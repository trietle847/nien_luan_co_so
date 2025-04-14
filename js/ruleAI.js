const mapContainer16 = document.querySelector(".map-16x16");
const mapContainer3 = document.querySelector(".map-3x3");
const displayTurn = document.getElementById("player-turn");
const displayScorePlayer = document.getElementById("score-player");
const displayScoreAI = document.getElementById("score-AI");
const gameContainer = document.querySelector(".game-container");
const namePlayer = document.getElementById("name-player");
const nameAI = document.getElementById("name-AI");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let levelGame = localStorage.getItem("level");

namePlayer.textContent = currentUser.username;
nameAI.textContent = "AI" + "(" + levelGame + ")";

let gameOver = false;
let currentPlayer = "X";
let moves = [];
let countScorePlayer = 0;
let countScoreAI = 0;
let winningPositions = [];
let lastMoveCell = null;

let size = parseInt(localStorage.getItem("size"));
const winLength = size === 3 ? 3 : 5;

gameContainer.classList.add(size === 3 ? "gameContainer3" : "gameContainer16");

function createMap() {
  const statusGame = localStorage.getItem("statusGame");
  let mapContainer = size === 16 ? mapContainer16 : mapContainer3;
  mapContainer.innerHTML = "";

  winningPositions = [];
  gameOver = false;
  moves = new Array(size * size).fill("");

  if (statusGame === "countinueGame") {
    const savedGame = JSON.parse(localStorage.getItem("gameState"));

    size = savedGame.sizeMap;
    currentPlayer = savedGame.currentPlayer;
    countScoreAI = savedGame.countScoreAI;
    countScorePlayer = savedGame.countScorePlayer;
    moves = savedGame.moves;
    // console.log(size,currentPlayer,countScoreAI,countScorePlayer);
    localStorage.removeItem("statusGame");
  }

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add(size === 16 ? "cell-16" : "cell-3", "cell"); //thêm 2 class
    cell.setAttribute("id", i);
    cell.addEventListener("click", handleCellClick);
    mapContainer.appendChild(cell);

    // nếu có giá trị thì in ra
    if (moves[i] !== "") {
      cell.textContent = moves[i];
    }
  }

  displayTurn.textContent = currentPlayer;
  displayScorePlayer.textContent = countScorePlayer;
  displayScoreAI.textContent = countScoreAI;
  gameOver = false;
}

// hàm sự kiện click cho các ô
function handleCellClick(event) {
  if (gameOver || currentPlayer === "O") return; // nếu có người chiến thắng hoặc lượt chơi là O thì kết thúc

  const cell = event.target; // trả về ô vừa click
  const index = parseInt(cell.id); // lấy id của ô đó

  if (moves[index] === "") {
    // nếu ô chưa được đánh thì
    if (lastMoveCell) {
      lastMoveCell.style.backgroundColor = "";
    }
    moves[index] = currentPlayer; // cho ô đó gán bằng lượt hiện tại
    cell.textContent = currentPlayer; // hiện ô đó lên màn hình
    cell.style.backgroundColor = "#add8e6";

    lastMoveCell = cell;
    // Kiểm tra chiến thắng
    const winner = checkWinner();

    if (winner) {
      if (currentPlayer === "X") {
        countScorePlayer++;
      } else {
        countScoreAI++;
      }
      gameOver = true;
      highlightWinningCells();

      setTimeout(() => {
        if (confirm(`${currentPlayer} thắng rồi, chơi lại nhé !!!`)) {
          createMap();
          updateRankingPoint(currentUser.username);
          countMatch(currentUser.username);
        }
      }, 500);
      return;
    }

    // Kiểm tra hòa
    if (!moves.includes("")) {
      gameOver = true;
      setTimeout(() => {
        if (confirm("Hòa rồi, chơi lại nhé !!!")) {
          createMap();
          countMatch(currentUser.username);
        }
      }, 500);
      return;
    }

    currentPlayer = "O"; // Đổi lượt sang O
    displayTurn.textContent = currentPlayer;

    setTimeout(() => {
      if (levelGame === "easy") {
        aiMoveEasy();
      } else {
        aiMoveNormal();
      }
    }, 100);
    // setTimeout(aiMoveNormal, 100);
  }
}

// Hàm tô màu các ô chiến thắng
function highlightWinningCells() {
  for (const position of winningPositions) {
    const cell = document.getElementById(position.row * size + position.col); // lấy id của ô trong mảng
    if (moves[position.row * size + position.col] === "X")
      cell.style.backgroundColor = "#32cd32";
    else {
      cell.style.backgroundColor = "#ff6347";
    }
    cell.style.color = "white";
  }
}

window.onload = createMap;

const depthLimit = 3; // độ sâu

// hàm tạo nước đi cho AI (chế độ normal)
function aiMoveNormal() {
  let possibleMoves = getPossibleMoves();

  // Kiểm tra nước thắng ngay
  for (let move of possibleMoves) {
    moves[move] = "O";
    if (checkWinner() === "O") {
      let cell = document.getElementById(move);
      cell.textContent = "O";

      // Xóa màu ô trước đó nếu có
      if (lastMoveCell) {
        lastMoveCell.style.backgroundColor = "";
      }

      // Tô màu ô hiện tại của AI
      cell.style.backgroundColor = "#add8e6";
      lastMoveCell = cell; // Lưu ô này làm ô cuối cùng của AI

      countScoreAI++;
      gameOver = true;
      highlightWinningCells();
      setTimeout(() => {
        if (confirm("O thắng! Chơi lại nhé?")) {
          createMap();
          countMatch(currentUser.username);
          currentPlayer = "X";
          displayTurn.textContent = currentPlayer;
        }
      }, 500);
      return;
    }
    moves[move] = "";
  }

  // Kiểm tra chặn nước thắng của người chơi
  for (let move of possibleMoves) {
    moves[move] = "X";
    if (checkWinner() === "X") {
      moves[move] = "O";
      let cell = document.getElementById(move);
      cell.textContent = "O";

      // Xóa màu ô trước đó nếu có
      if (lastMoveCell) {
        lastMoveCell.style.backgroundColor = "";
      }

      // Tô màu ô hiện tại của AI
      cell.style.backgroundColor = "#add8e6";
      lastMoveCell = cell; // Lưu ô này làm ô cuối cùng của AI

      currentPlayer = "X";
      displayTurn.textContent = currentPlayer;
      return;
    }
    moves[move] = "";
  }

  // Tìm nước đi tốt nhất bằng Minimax
  let bestMove = -1;
  let bestScore = -Infinity;
  for (let move of possibleMoves) {
    moves[move] = "O";
    let score = minimax(0, false, -Infinity, Infinity);
    moves[move] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (bestMove !== -1) {
    moves[bestMove] = "O";
    let cell = document.getElementById(bestMove);
    cell.textContent = "O";

    // Xóa màu ô trước đó nếu có
    if (lastMoveCell) {
      lastMoveCell.style.backgroundColor = "";
    }

    // Tô màu ô hiện tại của AI
    cell.style.backgroundColor = "#add8e6";
    lastMoveCell = cell; // Lưu ô này làm ô cuối cùng của AI
  }

  // Kiểm tra nếu AI thắng
  if (checkWinner()) {
    countScoreAI++;
    gameOver = true;
    highlightWinningCells();
    setTimeout(() => {
      if (confirm("O thắng! Chơi lại nhé?")) {
        createMap();
        countMatch(currentUser.username);
        currentPlayer = "X";
      }
    }, 500);
  } else {
    currentPlayer = "X";
    displayTurn.textContent = currentPlayer;
  }
}

function aiMoveEasy() {
  let possibleMoves = getPossibleMoves();
  if (possibleMoves === 0) return;

  let randomMove =
    possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  if (lastMoveCell) {
    lastMoveCell.style.backgroundColor = "";
  }

  moves[randomMove] = "O";
  const cell = document.getElementById(randomMove);
  cell.textContent = "O";
  cell.style.backgroundColor = "#add8e6";

  lastMoveCell = cell;

  if (checkWinner()) {
    countScoreAI++;
    gameOver = true;
    highlightWinningCells();
    setTimeout(() => {
      if (confirm("O thắng! Chơi lại nhé?")) {
        createMap();
        countMatch(currentUser.username);
        currentPlayer = "X";
      }
    }, 500);
  } else {
    currentPlayer = "X";
    displayTurn.textContent = currentPlayer;
  }
}

// hàm đánh giá trạng thái bàn cờ
function evaluateBoard() {
  let score = 0;
  const directions = [
    [1, 0], // hàng ngang
    [0, 1], // hàng dọc
    [1, 1], // đường chéo xuống phải
    [1, -1], // đường chéo xuống trái
  ];

  // Hàm trả về điểm của chuỗi liên tiếp
  function getConsecutiveSetScore(count, blocks, currPlayerTurn) {
    const winScore = 1000000;
    const winGuarantee = 1000000;
    if (size === 16) {
      if (currPlayerTurn) {
        // Xét cho AI (O)
        switch (count) {
          case 5:
            return winScore;
          case 4:
            return blocks === 0 ? winGuarantee * 2 : winGuarantee;
          case 3:
            return blocks === 0 ? 100000 : 500;
          case 2:
            return blocks === 0 ? 200 : 20;
          case 1:
            return 5;
        }
      } else {
        // Xét cho người chơi (X)
        switch (count) {
          case 5:
            return -winScore;
          case 4:
            return blocks === 0 ? -winGuarantee * 2 : -winGuarantee * 1.5;
          case 3:
            return blocks === 0 ? -300000 : -2000;
          case 2:
            return blocks === 0 ? -2000 : -100;
          case 1:
            return -5;
        }
      }
    } else {
      switch (count) {
        case 3:
          return currPlayerTurn ? winGuarantee : -winGuarantee;
        case 2:
          return blocks === 0
            ? currPlayerTurn
              ? 10000
              : -10000
            : currPlayerTurn
            ? 50
            : -50;
        case 1:
          return currPlayerTurn ? 10 : -10;
      }
      return 0;
    }
  }

  // Duyệt qua các ô trên bàn cờ
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let index = r * size + c;
      if (moves[index] === "") continue;

      let player = moves[index];
      let isAITurn = player === "O";

      // Duyệt qua từng hướng
      for (let [dr, dc] of directions) {
        // Kiểm tra nếu ô hiện tại không phải là ô bắt đầu của chuỗi theo hướng [dr, dc]
        let prevRow = r - dr;
        let prevCol = c - dc;
        if (
          prevRow >= 0 &&
          prevRow < size &&
          prevCol >= 0 &&
          prevCol < size &&
          moves[prevRow * size + prevCol] === player
        ) {
          continue; // Bỏ qua vì chuỗi này đã được tính từ ô đầu tiên
        }

        let count = 1,
          blocks = 0;
        // Duyệt xuôi theo hướng [dr, dc]
        let nr = r + dr;
        let nc = c + dc;
        while (
          nr >= 0 &&
          nr < size &&
          nc >= 0 &&
          nc < size &&
          moves[nr * size + nc] === player
        ) {
          count++;
          nr += dr;
          nc += dc;
        }
        // Kiểm tra ô chặn sau chuỗi
        if (
          nr < 0 ||
          nr >= size ||
          nc < 0 ||
          nc >= size ||
          moves[nr * size + nc] !== ""
        ) {
          blocks++;
        }
        // Kiểm tra ô chặn trước chuỗi (ở phía ngược lại)
        let br = r - dr;
        let bc = c - dc;
        if (
          br < 0 ||
          br >= size ||
          bc < 0 ||
          bc >= size ||
          moves[br * size + bc] !== ""
        ) {
          blocks++;
        }

        score += getConsecutiveSetScore(count, blocks, isAITurn);
      }
    }
  }
  return score;
}

// thuât toán minimax
function minimax(depth, isMaximizing, alpha, beta) {
  // isMaximizing : O => true, X => false
  let winner = checkWinner(); // kiểm tra người chiến thắng
  if (winner) return winner === "O" ? 1000000 - depth : -1000000 + depth;
  if (!moves.includes("") || depth >= depthLimit) return evaluateBoard();

  let bestScore = isMaximizing ? -Infinity : Infinity;
  const possibleMoves = getPossibleMoves(); // các nước có thể đi

  for (let move of possibleMoves) {
    moves[move] = isMaximizing ? "O" : "X";
    let score = minimax(depth + 1, !isMaximizing, alpha, beta); // gọi đệ quy kiếm tra nước tiếp theo
    moves[move] = ""; // trả về nước trước đó

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, score);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) break;
    // cắt tỉa các nhánh dư thừa
  }
  return bestScore;
}

// tìm các ô trống gần ô đã đánh
function getPossibleMoves() {
  let possibleMoves = new Set();
  for (let i = 0; i < size * size; i++) {
    if (moves[i] !== "") {
      let row = Math.floor(i / size); // tìm hàng vd i = 7 size = 3 => row = 2;
      let col = i % size; //tìm cột vd trên => col = 1
      for (let dr = -1; dr <= 1; dr++) {
        // dịch chuyển lên xuống
        for (let dc = -1; dc <= 1; dc++) {
          // sang trái phải
          let newRow = row + dr;
          let newCol = col + dc;
          let newIndex = newRow * size + newCol;
          // kiểm tra điều kiện ô hợp lệ k ngoài board và còn trống
          if (
            newRow >= 0 &&
            newRow < size &&
            newCol >= 0 &&
            newCol < size &&
            moves[newIndex] === ""
          ) {
            possibleMoves.add(newIndex);
          }
        }
      }
    }
  }
  return Array.from(possibleMoves); // trả vè mảng các phần tử có thể xét
}

function updateRankingPoint(winner) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex((user) => user.username === winner);

  if (userIndex !== -1) {
    if (levelGame === "easy") {
      users[userIndex].point += 1;
    } else {
      users[userIndex].point += 3;
    }
    users[userIndex].matchWin += 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// hàm cập nhật số trận
function countMatch(userCurrent) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex((user) => user.username === userCurrent);
  if (userIndex !== -1) {1
    users[userIndex].countMatch += 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

//thêm xếp hạng người chơi, theo phần trăm(*)
// chọn nước đi
// tăng kích thước giao diện bàn cờ
// thêm mức độ chơi. dễ, trung bình(*)
