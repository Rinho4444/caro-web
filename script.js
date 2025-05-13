const SIZE = 19;
let board = [];
let turn = "X";
let moves = [];
let players = { X: "", O: "" };
let gameEnded = false;
let allGames = []; // Lưu nhiều ván đấu

function startGame() {
  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  document.getElementById("game-info").innerText = `${players.X} (X) vs ${players.O} (O) - X starts`;
  createBoard();
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

  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    saveGame(turn);
  } else {
    turn = turn === "X" ? "O" : "X";
  }
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
    timestamp: new Date().toISOString()
  };

  // Lưu vào danh sách nhiều ván
  allGames.push(data);

  // Reset board để chơi tiếp nếu muốn
  setTimeout(() => {
    if (confirm("Play another game?")) {
      createBoard();
    }
  }, 300);
}

function exportData() {
  if (allGames.length === 0) {
    alert("No game data to export!");
    return;
  }

  const blob = new Blob([JSON.stringify(allGames, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
}
