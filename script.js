import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAkQ1ZV2Zh70BTgBtFwvLzLbUd8W6AuCs",
  authDomain: "pb-thunder.firebaseapp.com",
  projectId: "pb-thunder",
  storageBucket: "pb-thunder.firebasestorage.app",
  messagingSenderId: "34546866415",
  appId: "1:34546866415:web:11efa7db6c34582fb1a31a",
  measurementId: "G-P0E9BBSPFH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isLoginMode = true;
window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById("modalTitle").innerText = isLoginMode ? "Đăng nhập" : "Đăng ký";
    document.getElementById("toggleAuthText").innerText = isLoginMode ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập";
}

document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!isLoginMode) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Đăng ký thành công!");
                document.getElementById("authModal").style.display = "none";
            })
            .catch((error) => {
                alert("Lỗi đăng ký: " + error.message);
            });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Đăng nhập thành công!");
                document.getElementById("authModal").style.display = "none";
            })
            .catch((error) => {
                alert("Sai email hoặc mật khẩu!");
            });
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { alert("Đã đăng xuất!"); });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginBtnTrigger').style.display = 'none';
        document.getElementById('userGreeting').style.display = 'inline';
        document.getElementById('userGreeting').innerText = "Chào, " + user.email;
        document.getElementById('logoutBtn').style.display = 'inline';
    } else {
        document.getElementById('loginBtnTrigger').style.display = 'inline';
        document.getElementById('userGreeting').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }
});

