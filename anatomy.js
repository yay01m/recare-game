(()=>{
const regions=[
 {key:"brain",label:"脳・神経",re:/脳|神経|意識|構音|めまい|耳鳴|けいれん|髄膜|麻痺|しびれ/},
 {key:"airway",label:"気道",re:/気道|窒息|喘息|喘鳴|呼吸停止|アナフィラキシー/},
 {key:"lungs",label:"肺",re:/肺|呼吸|低酸素|SpO₂|気胸|ARDS|胸水|喀血|結核/},
 {key:"heart",label:"心臓",re:/心|循環|不整脈|脈拍|狭心|血圧|ショック|動悸|胸部/},
 {key:"liver",label:"肝・胆",re:/肝|胆|黄疸|アンモニア/},
 {key:"stomach",label:"胃・膵",re:/胃|膵|嘔吐|嘔気|吐血|心窩部/},
 {key:"intestine",label:"腸",re:/腸|下痢|便秘|下血|腹痛|腹膜/},
 {key:"kidneys",label:"腎臓",re:/腎|乏尿|電解質|尿毒|浮腫/},
 {key:"bladder",label:"膀胱",re:/膀胱|尿閉|排尿|血尿|頻尿/},
 {key:"joints",label:"四肢・関節",re:/関節|筋|骨|下肢|上肢|運動|歩行|疼痛/},
 {key:"blood",label:"血液",re:/血液|貧血|白血病|血小板|DIC|出血|凝固/},
 {key:"systemic",label:"全身",re:/感染|敗血症|発熱|水痘|発疹|中毒|代謝|甲状腺|血糖/}
];
const classes=regions.map(r=>`affected-${r.key}`);
function ensureAnatomy(){if($("#anatomyStatus"))return;el.avatarStage.insertAdjacentHTML("beforeend",`<div class="anatomy-caption" id="anatomyCaption">ANATOMICAL SCAN / NORMAL</div><div class="anatomy-status" id="anatomyStatus">${regions.map(r=>`<span data-region="${r.key}">${r.label}</span>`).join("")}</div>`)}
const previousAvatar=avatar;
avatar=function(effect){previousAvatar(effect);ensureAnatomy();state.anatomyEpisodes??=[];while(state.anatomyEpisodes.length>state.symptoms.length)state.anatomyEpisodes.pop();if(effect&&state.anatomyEpisodes.length<state.symptoms.length){let q=QUESTION_BANK[state.index],text=`${q.question} ${q.explanation} ${q.category} ${effect.name} ${effect.detail}`,hits=regions.filter(r=>r.re.test(text)).slice(0,3);if(!hits.length)hits=[regions.at(-1)];state.anatomyEpisodes.push({symptom:effect.name,regions:hits.map(r=>r.key)})}state.affectedRegions=[...new Set(state.anatomyEpisodes.flatMap(x=>x.regions))];el.avatarStage.classList.remove(...classes);document.querySelectorAll("#anatomyStatus span").forEach(x=>x.classList.remove("active"));state.affectedRegions.forEach(key=>{el.avatarStage.classList.add(`affected-${key}`);document.querySelector(`[data-region="${key}"]`)?.classList.add("active")});let labels=state.affectedRegions.map(key=>regions.find(r=>r.key===key)?.label).filter(Boolean);$("#anatomyCaption").textContent=labels.length?`ACTIVE ${state.anatomyEpisodes.length} / ${labels.join(" + ")}`:"ANATOMICAL SCAN / NORMAL"};
ensureAnatomy();avatar(null);
})();
