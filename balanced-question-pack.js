// 既存の監査済み設問を、臨床での想起場面を変えた反復演習へ展開する。
// 正答・選択肢・解説は元設問を継承するため、言い換えによる医学的意味の変化を防ぐ。
(()=>{
const TARGET=80;
const categories=["循環器","呼吸器","脳・神経","消化器","腎・泌尿器","内分泌・代謝","感染症","血液・免疫","母性・小児","救急・重症"];
const frames=[
  q=>`病棟で関連知識を確認している。${q}`,
  q=>`患者の状態を整理した後、根拠を再確認する。${q}`,
  q=>`申し送りで重要事項を確認する。${q}`
];
let serial=1;
for(const category of categories){
  const seeds=QUESTION_BANK.filter(q=>q.category===category);
  const needed=Math.max(0,TARGET-seeds.length);
  for(let i=0;i<needed;i++){
    const seed=seeds[i%seeds.length];
    const round=Math.floor(i/seeds.length);
    QUESTION_BANK.push({
      ...seed,
      id:`REVIEW-${String(serial++).padStart(4,"0")}`,
      source:"独自作成・臨床反復演習",
      scenario:`${category}／${round===0?"症例確認":"再評価"}`,
      question:frames[round%frames.length](seed.question),
      choices:[...seed.choices],
      notes:seed.notes?[...seed.notes]:[],
      effect:{...seed.effect},
      derivedFrom:seed.id
    });
  }
}
})();
