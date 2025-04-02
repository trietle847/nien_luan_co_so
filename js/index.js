const newGame = document.getElementById("newGame");
const countinueGame = document.getElementById("countinueGame");
const chooseStatusGame = document.getElementById("choose-status-game");
const gameSetting = document.getElementById("game-setting");
const startGame = document.getElementById("startGame");
const backtoMenu = document.getElementById("backtoMenu");
const loginBtn = document.getElementById("loginBtn");
const currentUserDiv = document.querySelector(".currentUser");
const logoutBtn = document.getElementById("logoutBtn");
const modeButton = document.querySelectorAll("[mode-game]");
const sizeMap = document.getElementById("sizeMap");
const infoSecond = document.getElementById("infoSecond");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("pass");
const messageError = document.querySelector(".messageError");
const rankBtn = document.getElementById("rank");
const rankView = document.getElementById("rank-view")
const userControlView = document.getElementById("userControl")

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let users = JSON.parse(localStorage.getItem("users")) || [];

let selectedMode = "playwAI";

newGame.addEventListener("click", () => {
  if (currentUser) {
    chooseStatusGame.classList.add("d-none");
    gameSetting.classList.remove("d-none");
    rankView.classList.add("d-none")
    userControlView.classList.add("d-none")
  } else {
    alert("bạn cần đăng nhập");
  }
});

modeButton.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMode = button.getAttribute("mode-game");
    modeButton.forEach((btn) => btn.classList.remove("btn-primary", "active"));
    button.classList.add("btn-primary", "active");

    console.log(selectedMode);
    if (selectedMode === "playwhuman") {
      infoSecond.classList.remove("d-none");
    } else {
      infoSecond.classList.add("d-none");
    }
  });
});

backtoMenu.addEventListener("click", () => {
  gameSetting.classList.add("d-none");
  chooseStatusGame.classList.remove("d-none");
});

startGame.addEventListener("click", () => {
  if (selectedMode === "playwhuman") {
    const username = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    const userExit = users.find(
      (user) => user.username === username && user.password === pass 
    );
    
    if (!userExit || userExit.username === currentUser.username) {
      messageError.innerHTML =
        '<p class="text-danger">Tài khoản không hợp lệ!</p>';
      return;
    } 

    localStorage.setItem("secondUser", JSON.stringify(userExit));
  }

  const selectedSize = sizeMap.value;
  console.log(selectedMode + " " + selectedSize);
  localStorage.setItem("mode", selectedMode);
  localStorage.setItem("size", selectedSize);
  localStorage.setItem("status", "newGame");

  window.location.href =
    selectedMode === "playwAI" ? "playscreenAI.html" : "playscreenHuman.html";
});

countinueGame.addEventListener("click", () => {
  if (currentUser) {
    let savedGame = localStorage.getItem("gameState");
    savedGame = JSON.parse(savedGame);
    console.log(savedGame);
    localStorage.setItem("statusGame", "countinueGame");
    if (savedGame.modeGame === "playwAI") {
      window.location.href = "playscreenAI.html";
    } else {
      window.location.href = "playscreenHuman.html";
    }
  } else {
    alert("bạn cần đăng nhập");
  }
});

loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

function updateUserUI() {
  console.log(currentUser);
  if (currentUser) {
    currentUserDiv.innerHTML = `<h3 class="wellcome-user">Xin chào, ${currentUser.username}!</h3>`;
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    currentUserDiv.innerHTML = "";
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.reload();
  updateUserUI();
});

updateUserUI();

rankBtn.addEventListener("click", () => {
  window.location.href = "rank.html"
})