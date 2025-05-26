const SIZE = 19;
let board = [];
let turn = "X";
let moves = [];
let players = { X: "", O: "" };
let gameEnded = false;
let allMoves = []; // Chứa tất cả các nước đi cho training
let gameID = "";   // ID của ván hiện tại (timestamp)

function startGame() {
  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  document.getElementById("game-info").innerText = `${players.X} (X) vs ${players.O} (O) - X starts`;

  gameID = new Date().toISOString(); // tạo ID theo thời gian
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

function handleClick(e) {
  if (gameEnded) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (board[row][col] !== "") return;

  board[row][col] = turn;
  e.target.innerText = turn;

  moves.push({ turn, row, col });
  logMove(row, col); // Ghi log dữ liệu nước đi

  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    askReplay();
  } else {
    // Đổi lượt và cập nhật thông tin hiển thị
    turn = turn === "X" ? "O" : "X";
    document.getElementById("game-info").innerText = `${players[turn]} (${turn})'s turn`;
  }
}

function logMove(row, col) {
  // Chuyển bàn cờ thành dạng số
  const board_flattened = board.flat().map(cell => {
    if (cell === "X") return 1;
    if (cell === "O") return -1;
    return 0;
  });

  allMoves.push({
    game_id: gameID,
    name: players[turn],
    role: turn === "X" ? 1 : -1,
    board_flattened,
    move_row: row,
    move_col: col
  });
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

function askReplay() {
  setTimeout(() => {
    if (confirm("Play another game?")) {
      gameID = new Date().toISOString();
      createBoard();
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

  allMoves.pop(); // Xóa khỏi log dữ liệu AI

  if (moves.length === 0) {
    document.getElementById("undoBtn").style.display = "none";
  }
}

function exportData() {
  if (allMoves.length === 0) {
    alert("No game data to export!");
    return;
  }

  const blob = new Blob([JSON.stringify(allMoves, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "gomoku_ai_data.json";
  link.click();
}
