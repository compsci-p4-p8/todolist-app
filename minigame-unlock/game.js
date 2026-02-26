(() => {
  const PAIRS = ['🍎','🚀','🎵','🌟','🐶','🍩'];
  let deck = [];
  let first = null;
  let second = null;
  let lock = false;
  let matches = 0;

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]
    }
    return a
  }

  function buildBoard(){
    const board = document.getElementById('board');
    board.innerHTML='';
    deck = shuffle(PAIRS.concat(PAIRS).slice());
    deck.forEach((val,idx) => {
      const el = document.createElement('div');
      el.className = 'card';
      el.dataset.value = val;
      el.dataset.index = idx;
      el.textContent = '';
      el.addEventListener('click', onCardClick);
      board.appendChild(el);
    });
    matches = 0; updateMatches();
    document.getElementById('win').classList.add('hidden');
  }

  function onCardClick(e){
    if(lock) return;
    const c = e.currentTarget;
    if(c.classList.contains('flipped')) return;
    flip(c);
    if(!first){ first = c; return }
    if(!second){ second = c; lock = true; checkMatch(); }
  }

  function flip(el){
    el.classList.add('flipped');
    el.textContent = el.dataset.value;
  }

  function unflip(el){
    el.classList.remove('flipped');
    el.textContent = '';
  }

  function checkMatch(){
    if(first.dataset.value === second.dataset.value){
      matches += 1; updateMatches();
      first.removeEventListener('click', onCardClick);
      second.removeEventListener('click', onCardClick);
      resetTurn();
      if(matches === PAIRS.length) showWin();
    } else {
      setTimeout(()=>{ unflip(first); unflip(second); resetTurn(); }, 700);
    }
  }

  function resetTurn(){ first = null; second = null; lock = false }

  function updateMatches(){ document.getElementById('matches').textContent = matches }

  function showWin(){ document.getElementById('win').classList.remove('hidden') }

  function startGame(){
    const container = document.getElementById('game-container');
    if (container) {
      container.classList.remove('hidden');
    }
    buildBoard();
  }

  // Public unlock API: call checkUnlock(n) from your app
  // if the DOM isn't ready yet we store the value and handle it once
  // the page has finished loading.
  let _pendingUnlock = null;
  function _applyUnlock(count) {
    const required = 5;
    const msg = document.getElementById('unlock-msg');
    if (!msg) return; // can't update yet

    const num = Number(count) || 0;
    if (num >= required) {
      msg.textContent = 'Unlocked! Have fun.';
      startGame();
    } else {
      const need = required - num;
      msg.textContent = `Need ${need} more completed ${need===1? 'task' : 'tasks'}.`;
    }
  }
  window.checkUnlock = function(completedCount){
    if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
      _pendingUnlock = completedCount;
    } else {
      _applyUnlock(completedCount);
    }
  };

  // wait for DOM so we can attach listeners and hide UI safely
  document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('resetBtn');
    const playAgain = document.getElementById('playAgain');
    const container = document.getElementById('game-container');

    if (container) container.classList.add('hidden');
    if (resetBtn) resetBtn.addEventListener('click', buildBoard);
    if (playAgain) playAgain.addEventListener('click', buildBoard);

    // if checkUnlock was called before the DOM was ready, apply it now
    if (_pendingUnlock !== null) {
      _applyUnlock(_pendingUnlock);
      _pendingUnlock = null;
    }
  });

})();
