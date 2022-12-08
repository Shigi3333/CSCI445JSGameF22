const player = 'x';
const cpu = 'o';
const wins = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];
const cells = document.getElementsByClassName('cell');
const cell_nums = [0,1,2,3,4,5,6,7,8];
const board = document.getElementById('board');
const message = document.getElementById('message');
const player_wins = document.getElementById('player-count');
const cpu_wins = document.getElementById('cpu-count');
const error_msg = document.getElementById('error');


function start () {
  player_turn = true;
  for (const cell of cells) {
      cell.classList.remove(player);
      cell.classList.remove(cpu);
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick);
      cell.style.removeProperty('background-image')
  }
}

function makeMark(cell, player) {
  cell.classList.add(player);
  cell.style.backgroundImage = "url(images/" + player + ".png)";
}

function swap() {
  player_turn = !player_turn;
}

function checkWin(player) {
  for (const win of wins) {
    if (cells[win[0]].classList.contains(player) && cells[win[1]].classList.contains(player) && cells[win[2]].classList.contains(player)) {
      return true;
    }
  }
  return false;
  
}

function isDraw() {
  let count = 0;
  for (const cell of cells) {
    if (cell.classList.contains('x') || cell.classList.contains('o')) {
      count ++;
    }
  }
  return count==9 ? true : false;
}

function cpuMove() {
  let cell_idx = cell_nums[Math.floor(Math.random() * cell_nums.length)];
  let cell = cells[cell_idx];
  while (cell.classList.contains('x') || cell.classList.contains('o')) {
    cell_idx = cell_nums[Math.floor(Math.random() * cell_nums.length)];
    cell = cells[cell_idx];
  }
  makeMark(cell, cpu);
  if (checkWin(cpu)) {
    endGame('win', false);
  } else if (isDraw()) {
    endGame('draw', false);
  }
}

function handleClick(e) {
  const cell = e.target;
  const checked = cell.classList.contains('x') || cell.classList.contains('o');
  if (checked) {
    error_msg.innerHTML = "Select another square!";
  } else {
    error_msg.innerHTML = "";
    makeMark(cell, player);
    if (checkWin(player)) {
      endGame('win', true);
    } else if (isDraw()) {
      endGame('draw', true);
    }
    cpuMove();
  }

}

function endGame(state, player) {
  if (state == 'win') {
    if (player) {
      message.style.color = "purple";
      message.innerHTML = "You win!";
      player_wins.innerHTML = parseInt(player_wins.innerHTML) + 1;
    } else {
      message.style.color = "red";
      message.innerHTML = "RANDOM won! You suck!";
      cpu_wins.innerHTML = parseInt(cpu_wins.innerHTML) + 1;
    }
  } else {
    message.innerHTML = "No one won!";
  }
  player_wins_num = player_wins.innerHTML;
  cpu_wins_num = cpu_wins.innerHTML;
  if (player_wins_num == 10) {
    alert("You beat RANDOM! Congrats!");
    message.innerHTML = "";
    player_wins.innerHTML = 0;
    cpu_wins.innerHTML = 0;
  } else if (cpu_wins_num == 10) {
    alert("RANDOM takes another victim. Sorry human!");
    message.innerHTML = "";
    player_wins.innerHTML = 0;
    cpu_wins.innerHTML = 0;
  }
  start();
}

start();