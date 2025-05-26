let SIZE = 19;
let board = [];
let turn = "X";
let moves = [];
let players = { X: "", O: "" };
let gameEnded = false;
let gameLogs = []; // Dùng cho training AI
let currentGameId = ""; // Ghi thời gian game bắt đầu

function startGame() {
  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  document.getElementById("game-info").innerText = `${players.X} (X) vs ${players.O} (O) - X starts`;

  currentGameId = new Date().toISOString(); // Gán game_id theo thời gian
  createBoard();

  document.getElementById("undoBtn").style.display = "inline-block";
}

function createBoard() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  moves = [];
  turn = "X";
  gameEnded = false;

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = Math.floor(i / SIZE);
    cell.dataset.col = i % SIZE;
    cell.onclick = handleClick;
    boardDiv.appendChild(cell);
  }
}

function deepCopyBoard(board) {
  return board.map(row => [...row]);
}

function handleClick(e) {
  if (gameEnded) return;
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (board[row][col] !== "") return;

  // Ghi log trước khi đánh
  const boardBeforeMove = deepCopyBoard(board);
  gameLogs.push({
    game_id: currentGameId,
    player: turn,
    board: boardBeforeMove,
    move: { row, col }
  });

  board[row][col] = turn;
  e.target.innerText = turn;
  moves.push({ turn, row, col });

  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    saveGame(turn);
  } else {
    turn = turn === "X" ? "O" : "X";
  }
}

function saveGame(winner) {
  // Không cần lưu allGames nữa, chỉ export gameLogs
  setTimeout(() => {
    if (confirm("Play another game?")) {
      createBoard();
    }
  }, 300);
}

function exportData() {
  if (gameLogs.length === 0) {
    alert("No data to export!");
    return;
  }

  const blob = new Blob([JSON.stringify(gameLogs, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "gomoku_log.json";
  link.click();
}
