const mapContainer16 = document.querySelector(".map-16x16");
const mapContainer3 = document.querySelector(".map-3x3");
const displayTurn = document.getElementById("player-turn");

const displayScorePlayer = document.getElementById("score-player"); // Điểm số trong trận đấu
const displayScoreAI = document.getElementById("score-AI"); // Điểm số trong trận đấu
const gameContainer = document.querySelector(".game-container");

const namePlayer1 = document.getElementById("name-player-1");
const namePlayer2 = document.getElementById("name-player-2");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const secondUser = JSON.parse(localStorage.getItem("secondUser"));

namePlayer1.textContent = `${currentUser.username} (X)`;
namePlayer2.textContent = `${secondUser.username} (O)`;

let gameOver = false; // Biến để kết thúc trò chơi

let currentPlayer = "X";
let countScorePlayer = 0; // Điểm trong trận đấu
let countScoreAI = 0; // Điểm trong trận đấu
let moves = [];
let winningPositions = [];

let size = parseInt(localStorage.getItem("size"));
const winLength = size === 3 ? 3 : 5;
gameContainer.classList.add(size === 3 ? "gameContainer3" : "gameContainer16");

function createMap() {
  const statusGame = localStorage.getItem("statusGame");
  const mapContainer = size === 16 ? mapContainer16 : mapContainer3;
  mapContainer.innerHTML = "";

  moves = new Array(size * size).fill("");
  winningPositions = [];
  gameOver = false;

  if (statusGame === "countinueGame") {
    const savedGame = JSON.parse(localStorage.getItem("gameState"));
    size = savedGame.sizeMap;
    currentPlayer = savedGame.currentPlayer;
    countScoreAI = savedGame.countScoreAI;
    countScorePlayer = savedGame.countScorePlayer;
    moves = savedGame.moves;
    localStorage.removeItem("statusGame");
  }

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add(size === 16 ? "cell-16" : "cell-3", "cell");
    cell.setAttribute("id", i);
    cell.addEventListener("click", handleCellClick);
    mapContainer.appendChild(cell);

    if (moves[i] !== "") {
      cell.textContent = moves[i];
    }
  }

  displayTurn.textContent = currentPlayer;
  displayScorePlayer.textContent = countScorePlayer; // Hiển thị tỉ số trong trận đấu
  displayScoreAI.textContent = countScoreAI; // Hiển thị tỉ số trong trận đấu
  gameOver = false;
}

// Xử lý khi người chơi click vào ô cờ
function handleCellClick(event) {
  if (gameOver) return;

  const cell = event.target;
  const index = parseInt(cell.id);

  if (moves[index] === "") {
    moves[index] = currentPlayer;
    cell.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
      gameOver = true;

      if (currentPlayer === "X") {
        countScorePlayer++; // Chỉ tăng điểm hiển thị trong trận đấu
        updateRankingPoint(currentUser.username); // Cập nhật điểm xếp hạng
      } else {
        countScoreAI++; // Chỉ tăng điểm hiển thị trong trận đấu
        updateRankingPoint(secondUser.username); // Cập nhật điểm xếp hạng
      }

      countMatch(currentUser.username);
      countMatch(secondUser.username);

      highlightWinningCells(winner);

      setTimeout(() => {
        if (confirm(`${currentPlayer} thắng rồi, chơi lại nhé !!!`)) {
          createMap();
        }
      }, 500);
      return;
    }

    if (!moves.includes("")) {
      gameOver = true;
      countMatch(currentUser.username);
      countMatch(secondUser.username);

      setTimeout(() => {
        if (confirm("Hòa rồi, chơi lại nhé !!!")) {
          createMap();
        }
      }, 500);
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    displayTurn.textContent = currentPlayer;
  }
}

// Tô màu ô thắng
function highlightWinningCells() {
  for (const position of winningPositions) {
    const cell = document.getElementById(position.row * size + position.col);
    cell.style.backgroundColor =
      moves[position.row * size + position.col] === "X" ? "#32cd32" : "#ff6347";
    cell.style.color = "white";
  }
}

// Cập nhật điểm xếp hạng của người chơi trong localStorage
function updateRankingPoint(winner) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex((user) => user.username === winner);

  if (userIndex !== -1) {
    users[userIndex].point += 5;
    users[userIndex].matchWin += 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// hàm cập nhật số trận
function countMatch(userCurrent) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userIndex = users.findIndex((user) => user.username === userCurrent);
  if (userIndex !== -1) {
    users[userIndex].countMatch += 1;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// Gọi hàm để tạo bản đồ khi load trang
createMap();
