const SIZE = 19;
let board = [];
let turn = "X";
let moves = [];
let players = { X: "", O: "" };
let gameEnded = false;
let allGames = []; // Lưu nhiều ván đấu

function startGame() {
  // Lấy tên người chơi
  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  document.getElementById("game-info").innerText = `${players.X} (X) vs ${players.O} (O) - X starts`;

  // Tạo bàn cờ mới
  createBoard();

  // Hiển thị nút Undo khi bắt đầu game
  document.getElementById("undoBtn").style.display = "inline-block"; // Hiện nút Undo
}

function createBoard() {
  // Reset lại bàn cờ
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  moves = [];
  turn = "X";
  gameEnded = false;

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  // Tạo các ô trên bàn cờ
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = Math.floor(i / SIZE);
    cell.dataset.col = i % SIZE;
    cell.onclick = handleClick; // Xử lý khi người chơi click vào ô
    boardDiv.appendChild(cell);
  }
}

function handleClick(e) {
  if (gameEnded) return; // Không cho phép click nếu ván đã kết thúc
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  // Nếu ô đã có X hoặc O thì không cho đánh nữa
  if (board[row][col] !== "") return;

  // Đánh X hoặc O vào ô
  board[row][col] = turn;
  e.target.innerText = turn;
  moves.push({ turn, row, col }); // Lưu nước đi vào mảng moves

  // Kiểm tra nếu có người thắng
  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    saveGame(turn);
  } else {
    turn = turn === "X" ? "O" : "X"; // Đổi lượt cho người tiếp theo
  }
}

function checkWin(r, c) {
  const dr = [1, 0, 1, 1]; // Hướng kiểm tra: ngang, dọc, chéo
  const dc = [0, 1, 1, -1];

  for (let d = 0; d < 4; d++) {
    let count = 1;
    // Kiểm tra theo hướng d
    for (let i = 1; i < 5; i++) {
      const nr = r + dr[d] * i, nc = c + dc[d] * i;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== turn) break;
      count++;
    }
    // Kiểm tra theo hướng ngược lại
    for (let i = 1; i < 5; i++) {
      const nr = r - dr[d] * i, nc = c - dc[d] * i;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== turn) break;
      count++;
    }
    // Nếu có 5 quân liên tiếp, thắng rồi
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

  allGames.push(data); // Lưu thông tin ván đấu

  // Sau khi kết thúc, hỏi người chơi có muốn chơi lại không
  setTimeout(() => {
    if (confirm("Play another game?")) {
      createBoard();
    }
  }, 300);
}

function undoMove() {
  if (moves.length === 0 || gameEnded) return; // Nếu không còn nước đi hoặc ván đã kết thúc thì không undo

  // Lấy nước đi cuối cùng và xóa nó
  const lastMove = moves.pop();
  const { row, col, turn: lastTurn } = lastMove;

  // Xóa quân X hoặc O trên bàn cờ
  board[row][col] = "";
  const cellIndex = row * SIZE + col;
  document.getElementsByClassName("cell")[cellIndex].innerText = "";

  // Trả lại lượt cho người chơi vừa đi
  turn = lastTurn;

  // Nếu đã undo và không có nước đi nữa thì ẩn nút Undo
  if (moves.length === 0) {
    document.getElementById("undoBtn").style.display = "none"; // Ẩn nút Undo nếu không còn nước đi
  }
}

function exportData() {
  if (allGames.length === 0) {
    alert("No game data to export!");
    return;
  }

  // Xuất dữ liệu ra file JSON
  const blob = new Blob([JSON.stringify(allGames, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
}
