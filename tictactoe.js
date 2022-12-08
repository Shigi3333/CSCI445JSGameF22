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
const cell_nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const board = document.getElementById('board');
const message = document.getElementById('message');
const player_wins = document.getElementById('player-count');
const cpu_wins = document.getElementById('cpu-count');
const error_msg = document.getElementById('error');
let hard = false;//confirm("Press OK to play on hard mode, else press Cancel.");


function start() {
  console.log("Start!")
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
  console.log(player + " mark made.")
  cell.classList.add(player);
  cell.style.backgroundImage = "url(images/" + player + ".png)";
}

function swap() {
  console.log("Players swapped");
  player_turn = !player_turn;
}

function checkWin(player) {
  console.log("CheckWin");
  for (const win of wins) {
    if (cells[win[0]].classList.contains(player) && cells[win[1]].classList.contains(player) && cells[win[2]].classList.contains(player)) {
      return true;
    }
  }
  return false;

}

function isDraw() {
  console.log("isDraw check");
  let count = 0;
  for (const cell of cells) {
    if (cell.classList.contains('x') || cell.classList.contains('o')) {
      count++;
    }
  }
  return count == 9 ? true : false;
}

function cpuMove() {
  console.log("CPU MOVE regular")
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

function cpuMoveMinMax() {
  console.log("CPUMOVEMINMAX ACTIVATE");
  // find best move
  let nextMoveCellID = findBestMove(1);
  alert(nextMoveCellID);
  // Make the move
  let cell = cells[nextMoveCellID];
  makeMark(cell, cpu);

  if (checkWin(cpu)) {
    endGame('win', false);
  } else if (isDraw()) {
    endGame('draw', false);
  }
  return;


}

function evaluate(boardState) {
  console.log("Evaluate ACTIVATE")
  if (checkWin(player)) {
    return +10;
  } else if (checkWin(cpu)) {
    return -10;
  } else {
    return 0;
  }
}

// 0-2 is top row, 3-5 is middle row, 6-8 is bottom row
// example boardState: ['x','x','x','o','o','_','_','_','_'] ('_' is empty)
// looks like:  x  x  x
//              o  o  _
//              _  _  _
function isMovesLeft() {
  console.log("isMovesLeft ACTIVATE")
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
      return true;
    }
  }
  return false;
}

// This is the minimax function. It considers all the possible ways the game can go and returns the
// value of the board
function minimax(boardState, depth, isMax) {
  console.log("Minimax ACTIVATE");
  let score = evaluate(boardState);

  // If Maximizer has won the game return his/her evaluated score
  if (score == 10)
    return score;

  // If Minimizer has won the game return his/her evaluated score
  if (score == -10)
    return score;

  // If there are no more moves and no winner then it is a tie
  if (isMovesLeft(boardState) == false)
    return 0;

  // If this maximizer's (human player's) move
  if (isMax) {
    let best = -1000;

    // Traverse all cells
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];

      // Check if cell is empty
      if (!cell.classList.contains('x') && !cell.classList.contains('o')) {

        // Make the move
        cell.classList.add(player);

        // Call minimax recursively and choose the maximum value
        best = Math.max(best, minimax(boardState, depth + 1, !isMax)) - depth;
        console.log("Best score: " + best + ", Depth: " + depth + ", isPlayer: " + isMax);

        // Undo the move
        cell.classList.remove(player);
      }
    }

    return best;
    // Traverse all cells
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        // Check if cell is empty
        if (board[i][j] == '_') {

          // Make the move
          board[i][j] = player;

          // Call minimax recursively
          // and choose the maximum value
          best = Math.max(best, minimax(board,
            depth + 1, !isMax));

          // Undo the move
          board[i][j] = '_';
        }
      }
    }
    return best;
  }

  // If this minimizer's move
  else {
    let best = 1000;

    // Traverse all cells
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];

      // Check if cell is empty
      console.log(cell.classList);

      if (!cell.classList.contains('x') && !cell.classList.contains('o')) {

        // Make the move
        cell.classList.add(cpu);

        // Call minimax recursively and choose the maximum value
        best = Math.min(best, minimax(boardState, depth + 1, !isMax)) + depth;
        console.log("Best score: " + best + ", Depth: " + depth + ", isPlayer: " + isMax);

        // Undo the move
        cell.classList.remove(cpu);
        console.log(cell.classList);

      }
    }

    return best;
    // Traverse all cells
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        // Check if cell is empty
        if (board[i][j] == '_') {

          // Make the move
          board[i][j] = opponent;

          // Call minimax recursively and
          // choose the minimum value
          best = Math.min(best, minimax(board,
            depth + 1, !isMax));

          // Undo the move
          board[i][j] = '_';
        }
      }
    }
    return best;
  }
}

// This will return the best possible move for the player (cpu)
function findBestMove(board) {
  console.log("FIND BEST MOVE ACTIVATE");
  let bestVal = -1000;
  // let bestMove = new Move();
  // bestMove.row = -1;
  // bestMove.col = -1;
  let bestMove = -1;
  let cellID = -1;

  // Traverse all cells, evaluate minimax function for all empty cells. And return the cell with optimal value.
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    cellID++;
    // alert(cell);
    // Check if the cell is empty
    if (!cell.classList.contains('x') && !cell.classList.contains('o')) {

      // Make the move
      cell.classList.add(cpu);

      // Compute evaluation function for this move
      let moveVal = minimax(board, 0, false);

      // Undo the move
      cell.classList.remove(cpu);

      // If the value of the current move is more than the best value, then update best
      if (moveVal > bestVal) {
        bestMove = cellID;
        bestVal = moveVal;
        alert("new best move" + bestMove)
        alert("New Best Value:" + bestVal)
      }
    }
  }

  alert("The value of the best Move is : ", bestVal);

  return bestMove;

  // Traverse all cells, evaluate minimax function for all empty cells. And return the cell with optimal value.
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

      // Check if cell is empty
      if (board[i][j] == '_') {

        // Make the move
        board[i][j] = player;

        // compute evaluation function for this move.
        let moveVal = minimax(board, 0, false);

        // Undo the move
        board[i][j] = '_';

        // If the value of the current move is more than the best value, then update best
        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }

  document.write("The value of the best Move " +
    "is : ", bestVal + "<br><br>");

  return bestMove;
}

function handleClick(e) {
  const cell = e.target;
  const checked = cell.classList.contains('x') || cell.classList.contains('o');
  if (checked) {
    error_msg.innerHTML = "Select another square!";
  } else {
    error_msg.innerHTML = "";
    makeMark(cell, player);
    let gameFinish = false;
    if (checkWin(player)) {
      gameFinish = endGame('win', true);
    } else if (isDraw()) {
      gameFinish = endGame('draw', true);
    }
    if (!gameFinish) {
      if (hard) {
        cpuMoveMinMax();
      } else {
        cpuMove();
      }
    }
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
  return true;
}

start();