const resetbtn = document.getElementById("reset-btn");
const returnHomebtn = document.getElementById("return-home-btn");
const countinueGamebtn = document.getElementById("countinue-btn");
const mode = localStorage.getItem("mode");

// tạo sự kiện cho nút reset
resetbtn.addEventListener("click", () => {
  if (confirm("Bạn có muốn chơi lại không?")) {
    currentPlayer = "X";
    createMap();
  }
});

// tạo sự kiện cho nút back home
returnHomebtn.addEventListener("click", () => {
  if (confirm("Bạn có muốn lưu lại trước khi thoát không?")) {
    const currentUser = localStorage.getItem("currentUser")
    const secondUser = localStorage.getItem("secondUser");
    // nếu có thì lưu bàn cờ lại vào kho, chuyển về trang home
    localStorage.setItem("gameState", JSON.stringify({
      modeGame: mode,
      sizeMap: size,
      moves: moves,
      currentPlayer: currentPlayer,
      gameOver: gameOver,
      countScoreAI: countScoreAI,
      countScorePlayer: countScorePlayer,
      firstPlayer: currentUser,
      secondUser: secondUser,
    }));
  }    
  // localStorage.removeItem("mode");
  // localStorage.removeItem("size");
  window.location.href = "index.html";
});

// kiểm tra chiến thắng
function checkWinner() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const index = r * size + c;
      if (moves[index] === "") continue;

      // Kiểm tra chiến thắng theo 4 hướng
      if (
        checkDirection(r, c, 0, 1) || // Hướng ngang
        checkDirection(r, c, 1, 0) || // Hướng dọc
        checkDirection(r, c, 1, 1) || // Hướng chéo \
        checkDirection(r, c, 1, -1) // Hướng chéo /
      ) {
        return moves[index]; // Trả về người chiến thắng (X hoặc O)
      }
    }
  }
  return null;
}

// kiểm tra chiến thắng theo một hướng cụ thể
function checkDirection(row, col, dx, dy) {
  let count = 0;
  let player = moves[row * size + col];
  let tempPositions = []; 

  for (let i = 0; i < winLength; i++) {
    let newRow = row + i * dx;
    let newCol = col + i * dy;
    let newIndex = newRow * size + newCol;

    // Kiểm tra ra ngoài biên
    if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size)
      return false;
    if (moves[newIndex] !== player) return false;

    tempPositions.push({ row: newRow, col: newCol });
    count++;
  }

  //đủ nước thắng cập nhật winningPositions
  if (count === winLength) {
    winningPositions = [...tempPositions]; 
    return true;
  }
  return false;
}