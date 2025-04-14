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
const selectLevel = document.getElementById("selectLevel");
const levelGame = document.getElementById("levelGame");


// lấy người dùng đang đăng nhập
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// lấy danh sách người đăng ký
let users = JSON.parse(localStorage.getItem("users")) || [];
// mặc định là chơi với AI
let selectedMode = "playwAI";

// hàm cho nút chơi mới
newGame.addEventListener("click", () => {
  if (currentUser) {
    chooseStatusGame.classList.add("d-none");
    gameSetting.classList.remove("d-none");
    rankView.classList.add("d-none")
    userControlView.classList.add("d-none")
  } else {
    showToast("Bạn cần đăng nhập", "warning", 5000);

  }
});

// hàm cho nút chọn chế đọ chơi
modeButton.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMode = button.getAttribute("mode-game");
    modeButton.forEach((btn) => btn.classList.remove("btn-primary", "active"));
    button.classList.add("btn-primary", "active");

    if (selectedMode === "playwhuman") {
      infoSecond.classList.remove("d-none");
      selectLevel.classList.add("d-none")
    } else {
      infoSecond.classList.add("d-none");
      selectLevel.classList.remove("d-none")
    }
  });
});

// hàm cho nút trở về
backtoMenu.addEventListener("click", () => {
  gameSetting.classList.add("d-none");
  chooseStatusGame.classList.remove("d-none");
});

// hàm cho nút bắt đầu game
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
  const selectedLevel = levelGame.value;

  localStorage.setItem("mode", selectedMode);
  localStorage.setItem("size", selectedSize);
  localStorage.setItem("level",selectedLevel);
  localStorage.setItem("status", "newGame");

  window.location.href =
    selectedMode === "playwAI" ? "playscreenAI.html" : "playscreenHuman.html";
});

// hàm cho nút tiếp tục trò chơi
countinueGame.addEventListener("click", () => {
  if (currentUser) {
    let savedGame = localStorage.getItem("gameState");
    savedGame = JSON.parse(savedGame);
    let firstPlayer = JSON.parse(savedGame.firstPlayer);

    if (firstPlayer.username === currentUser.username){
      localStorage.setItem("statusGame", "countinueGame");
      if (savedGame.modeGame === "playwAI") {
        window.location.href = "playscreenAI.html";
      } else {
        window.location.href = "playscreenHuman.html";
      }
    }
    else {
      showToast("Tài khoản này không có trận đấu đã lưu", "warning", 5000);

    }
    
  } else {
    showToast("Bạn cần đăng nhập", "warning", 5000);

  }
});

// nút đăng nhập
loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

// cập nhật giao diện sau khi đăng nhập
function updateUserUI() {
  console.log(currentUser);
  if (currentUser) {
    currentUserDiv.innerHTML = `<h3 class="wellcome-user">Xin chào, ${currentUser.username}!</h3>`;
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    currentUserDiv.innerHTML = "<h3> Hãy đăng nhập để bắt đầu</h3>";
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
}
updateUserUI();

// nút đăng xuất
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.reload();
  updateUserUI();
});

// nút rank
rankBtn.addEventListener("click", () => {
   if (currentUser){
    window.location.href = "rank.html";
   } 
   else {
     showToast("Bạn cần đăng nhập", "warning",5000);
   }
})

function showToast(message, type = "info", duration = 3000) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `toast-message ${type}`
  toast.addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  });
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.showToast = showToast