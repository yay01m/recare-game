create extension if not exists pgcrypto;

create table if not exists public.recare_users (
  username text primary key,
  display_name text not null,
  pin_hash text not null,
  profile jsonb not null default '{"xp":0,"answered":0,"correct":0,"stats":{},"bookmarks":[],"achievements":[]}'::jsonb,
  session_token uuid,
  token_expires_at timestamptz,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recare_users enable row level security;
revoke all on table public.recare_users from anon, authenticated;

create or replace function public.recare_login(p_username text,p_pin text,p_display_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare u public.recare_users; clean_name text; new_token uuid:=gen_random_uuid(); created boolean:=false;
begin
  clean_name:=lower(trim(p_username));
  if clean_name !~ '^[[:alnum:]_\-]{2,20}$' or p_pin !~ '^[0-9]{4}$' then raise exception '入力形式が正しくありません'; end if;
  select * into u from public.recare_users where username=clean_name for update;
  if not found then
    insert into public.recare_users(username,display_name,pin_hash,session_token,token_expires_at)
    values(clean_name,left(trim(p_display_name),20),extensions.crypt(p_pin,extensions.gen_salt('bf')),new_token,now()+interval '90 days') returning * into u;
    created:=true;
  else
    if u.locked_until is not null and u.locked_until>now() then return jsonb_build_object('error','試行回数が多すぎます。10分後にお試しください'); end if;
    if u.pin_hash<>extensions.crypt(p_pin,u.pin_hash) then
      update public.recare_users set failed_attempts=failed_attempts+1,locked_until=case when failed_attempts+1>=5 then now()+interval '10 minutes' else null end where username=clean_name;
      return jsonb_build_object('error','ユーザーネームまたは4桁コードが違います');
    end if;
    update public.recare_users set session_token=new_token,token_expires_at=now()+interval '90 days',failed_attempts=0,locked_until=null,updated_at=now() where username=clean_name returning * into u;
  end if;
  return jsonb_build_object('username',u.username,'display_name',u.display_name,'session_token',new_token,'profile',u.profile,'is_new',created);
end $$;

create or replace function public.recare_save(p_username text,p_session_token uuid,p_profile jsonb)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.recare_users set profile=p_profile,updated_at=now()
  where username=lower(trim(p_username)) and session_token=p_session_token and token_expires_at>now();
  return found;
end $$;

revoke execute on function public.recare_login(text,text,text) from public;
revoke execute on function public.recare_save(text,uuid,jsonb) from public;
grant execute on function public.recare_login(text,text,text) to anon;
grant execute on function public.recare_save(text,uuid,jsonb) to anon;
