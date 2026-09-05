(()=>{
const aliases={"救急":"救急・重症","救急看護":"救急・重症","救急・中毒":"救急・重症","消化器・がん":"消化器","泌尿器・がん":"腎・泌尿器","膠原病":"血液・免疫","耳鼻科":"脳・神経","小児・感染症":"母性・小児","基礎看護":"基礎・人体","人体の構造":"基礎・人体"};
const systemRules=[[/心房|心電図|循環|心筋|血栓/,"循環器"],[/腎|糸球体|尿量|クレアチニン|乏尿/,"腎・泌尿器"],[/関節|痛風|尿酸/,"内分泌・代謝"],[/脳|神経|失語|言語|意識|けいれん/,"脳・神経"],[/ウイルス|感染|発熱/,"感染症"]];
for(const q of QUESTION_BANK){if(aliases[q.category])q.category=aliases[q.category];if(q.category==="成人看護"){let text=`${q.scenario} ${q.question} ${q.explanation}`,hit=systemRules.find(([re])=>re.test(text));q.category=hit?hit[1]:"基礎・人体"}}
// 疾患学習の分類を臓器別に統一する。基礎問題も、実際に観察する系統へ置く。
const foundationalSystems={"115-B015":"腎・泌尿器","115-B022":"呼吸器","115-B023":"呼吸器","115-B013":"脳・神経"};
for(const q of QUESTION_BANK)if(foundationalSystems[q.id])q.category=foundationalSystems[q.id];
})();
