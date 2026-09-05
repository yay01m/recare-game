// 公開過去問は参考資料としてのみ扱い、ゲームの出題対象には含めない。
// この処理より後に作られる反復演習も、独自作成問題だけを種にする。
(()=>{
  const originals=QUESTION_BANK.filter(q=>!/^115-/.test(q.id||"")&&!/^第115回/.test(q.source||""));
  QUESTION_BANK.splice(0,QUESTION_BANK.length,...originals);
})();
