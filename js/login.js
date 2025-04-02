const registerForm = document.getElementById("register-form");
console.log(registerForm);
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("usernameResgiter").value.trim();
  const password = document.getElementById("passwordResgiter").value.trim();
  const messageBox = document.getElementById("message");
  console.log(username + " " + password);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userExit = users.some((user) => user.username === username);
  if (userExit) {
    messageBox.innerHTML = `<span class="text-danger">Tên người chơi đã tồn tại, vui lòng chọn tên khác.</span>`;
  } else {
    users.push({ username, password, point:0, countMatch: 0, matchWin:0 });
    localStorage.setItem("users", JSON.stringify(users));
    messageBox.innerHTML = `<span class="text-success">Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.</span>`;
    document.getElementById("register-data").reset();
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const usernameLogin = document.getElementById("usernameLogin").value.trim();
  const passwordLogin = document.getElementById("passwordLogin").value.trim();
  const messageError = document.getElementById("messageError");

  console.log(usernameLogin + " " + passwordLogin);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userExit = users.find(
    (user) => user.username === usernameLogin && user.password === passwordLogin
  );

  if (userExit) {
    console.log("thành công");
    localStorage.setItem("currentUser", JSON.stringify(userExit));
    window.location.href = "index.html";
  } else {
    console.log("thất bại");
    messageError.innerHTML = `<span class="text-danger">Sai tài khoản hoặc mật khẩu!</span>`;
  }
});
