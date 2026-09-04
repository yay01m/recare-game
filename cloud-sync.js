(()=>{
const cfg=window.RECARE_CLOUD_CONFIG||{},SESSION="recare-cloud-session",PENDING="recare-cloud-pending";
const enabled=()=>/^https:\/\/.+\.supabase\.co$/.test(cfg.url)&&cfg.publishableKey.length>20;
async function rpc(name,body){let response=await fetch(`${cfg.url}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:cfg.publishableKey,Authorization:`Bearer ${cfg.publishableKey}`,"Content-Type":"application/json"},body:JSON.stringify(body)}),data=await response.json().catch(()=>null);if(!response.ok)throw new Error(data?.message||data?.error||"クラウドへ接続できません");return data}
function session(){try{return JSON.parse(localStorage.getItem(SESSION))}catch{return null}}
async function login(username,pin,displayName){let data=await rpc("recare_login",{p_username:username,p_pin:pin,p_display_name:displayName});if(data?.error)throw new Error(data.error);let s={username:data.username,displayName:data.display_name,token:data.session_token},profile=data.profile;localStorage.setItem(SESSION,JSON.stringify(s));if(data.is_new){let raw=localStorage.getItem(`recare-profile-v1:${username}`)||localStorage.getItem("recare-profile-v1");try{let local=JSON.parse(raw);if(local?.answered>0){profile=local;await rpc("recare_save",{p_username:s.username,p_session_token:s.token,p_profile:profile})}}catch{}}return{session:s,profile,isNew:data.is_new}}
let timer;
async function flush(profile){let s=session();if(!s)return;window.dispatchEvent(new CustomEvent("recare-cloud-status",{detail:"syncing"}));try{let ok=await rpc("recare_save",{p_username:s.username,p_session_token:s.token,p_profile:profile});if(!ok)throw new Error("セッションの有効期限が切れました");localStorage.removeItem(PENDING);window.dispatchEvent(new CustomEvent("recare-cloud-status",{detail:"saved"}))}catch(error){localStorage.setItem(PENDING,JSON.stringify(profile));window.dispatchEvent(new CustomEvent("recare-cloud-status",{detail:"error"}))}}
function save(profile){if(!enabled())return;localStorage.setItem(PENDING,JSON.stringify(profile));clearTimeout(timer);timer=setTimeout(()=>flush(profile),700)}
function logout(){localStorage.removeItem(SESSION);localStorage.removeItem(PENDING)}
window.addEventListener("online",()=>{try{let pending=JSON.parse(localStorage.getItem(PENDING));if(pending)flush(pending)}catch{}});
window.RECARE_CLOUD={enabled,login,save,logout,session};
})();
