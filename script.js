// Thêm biến lưu game_id hiện tại
let currentGameId = null;

// Trong hàm startGame, thêm phần tạo game_id
function startGame() {
  // Tạo game_id mới bằng timestamp
  currentGameId = Date.now(); 

  players.X = document.getElementById("playerX").value || "Player X";
  players.O = document.getElementById("playerO").value || "Player O";
  document.getElementById("game-info").innerText = `${players.X} (X) vs ${players.O} (O) - X starts`;

  createBoard();
  document.getElementById("undoBtn").style.display = "inline-block";
}

// Sửa lại hàm handleClick để ghi log
function handleClick(e) {
  if (gameEnded) return;
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (board[row][col] !== "") return;

  // Clone trạng thái board hiện tại TRƯỚC khi đánh
  const currentBoard = board.map(row => [...row]); 

  // Đánh quân cờ
  board[row][col] = turn;
  e.target.innerText = turn;
  
  // Ghi log với board state trước khi đánh
  const moveLog = {
    game_id: currentGameId,
    board: currentBoard,
    move: { x: row, y: col }, // Giả sử x là row, y là column
    player: players[turn],    // Lấy tên người chơi từ input
    timestamp: new Date().toISOString()
  };
  
  moves.push({ turn, row, col });
  allGames.push(moveLog); // Lưu vào allGames

  if (checkWin(row, col)) {
    alert(`${players[turn]} (${turn}) wins!`);
    gameEnded = true;
    saveGame(turn);
  } else {
    turn = turn === "X" ? "O" : "X";
  }
}

// Sửa hàm saveGame để không lưu thừa dữ liệu
function saveGame(winner) {
  setTimeout(() => {
    if (confirm("Play another game?")) {
      createBoard();
    }
  }, 300);
}
