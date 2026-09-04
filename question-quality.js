(()=>{
function refine(text){return text.replace(/のみ/g,"").replace(/だけ/g,"").replace(/必ず/g,"").replace(/完全/g,"").replace(/\s{2,}/g," ").trim()}
function shuffleQuestion(q){let rows=q.choices.map((choice,index)=>({choice,note:q.notes?.[index]||"",correct:index===q.answer}));for(let i=rows.length-1;i>0;i--){let values=new Uint32Array(1);crypto.getRandomValues(values);let j=values[0]%(i+1);[rows[i],rows[j]]=[rows[j],rows[i]]}q.choices=rows.map(x=>x.choice);q.notes=rows.map(x=>x.note);q.answer=rows.findIndex(x=>x.correct)}
for(const q of QUESTION_BANK){if(!/独自/.test(q.source||""))continue;let originals=[...q.choices];q.choices=q.choices.map(refine);if(q.notes)q.notes=q.notes.map(note=>{let result=note;originals.forEach((old,i)=>result=result.replace(old,q.choices[i]));return refine(result)});shuffleQuestion(q)}
})();
