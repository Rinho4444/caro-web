const SIZE = 19;
let board = [];
let turn = "X";
let moves = [];
let players = { X: "", O: "" };
let gameEnded = false;
let allGames = [];
let gameLogs = [];
let currentGameId = null;

function startGame() {
  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  turn = "X";
  gameEnded = false;
  currentGameId = Date.now();
  gameLogs = [];
  document.getElementById("game-info").innerText = `${players[turn]} (${turn})'s turn`;
  createBoard();
  document.getElementById("undoBtn").style.display = "inline-block";
}

function createBoard() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  moves = [];
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

function handleClick(e) {
  if (gameEnded) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (board[row][col] !== "") return;

  const boardBeforeMove = deepCopyBoard(board);

  // Lưu move vào log trước khi thay đổi gì
  gameLogs.push({
    game_id: currentGameId,
    player: turn,
    board: boardBeforeMove,
    move: { row, col }
  });

  // Ghi vào bảng
  board[row][col] = turn;
  e.target.innerText = turn;

  // 🛠 FIX BUG: đảm bảo turn được lưu chính xác
  moves.push({ turn: turn, row, col });

  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    saveGame(turn);
    return;
  }

  // Đổi lượt
  turn = turn === "X" ? "O" : "X";
  document.getElementById("game-info").innerText = `${players[turn]} (${turn})'s turn`;
}

function checkWin(r, c) {
  const dr = [1, 0, 1, 1];
  const dc = [0, 1, 1, -1];

  for (let d = 0; d < 4; d++) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const nr = r + dr[d] * i, nc = c + dc[d] * i;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== turn) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      const nr = r - dr[d] * i, nc = c - dc[d] * i;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== turn) break;
      count++;
    }
    if (count >= 5) return true;
  }
  return false;
}

function saveGame(winner) {
  const data = {
    players,
    winner,
    moves,
    timestamp: new Date().toISOString(),
    game_id: currentGameId
  };

  allGames.push(data);

  setTimeout(() => {
    if (confirm("Play another game?")) {
      startGame();
    }
  }, 300);
}

function undoMove() {
  if (moves.length === 0 || gameEnded) return;

  const lastMove = moves.pop();
  const { row, col, turn: lastTurn } = lastMove;
  board[row][col] = "";
  const cellIndex = row * SIZE + col;
  document.getElementsByClassName("cell")[cellIndex].innerText = "";
  turn = lastTurn;
  document.getElementById("game-info").innerText = `${players[turn]} (${turn})'s turn`;

  gameLogs.pop();

  if (moves.length === 0) {
    document.getElementById("undoBtn").style.display = "none";
  }
}

function exportData() {
  if (gameLogs.length === 0) {
    alert("No game data to export!");
    return;
  }

  const blob = new Blob([JSON.stringify(gameLogs, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "game_logs.json";
  link.click();
}

function deepCopyBoard(b) {
  return b.map(row => row.slice());
}
