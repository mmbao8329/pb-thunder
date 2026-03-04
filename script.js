import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// === DÁN FIREBASE CONFIG CỦA BẠN VÀO ĐÂY ===
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

// Xử lý Giao diện Đăng nhập / Đăng ký
let isLoginMode = true;
window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById("modalTitle").innerText = isLoginMode ? "Đăng nhập" : "Đăng ký";
    document.getElementById("toggleAuthText").innerText = isLoginMode ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập";
    
    // Ẩn/hiện ô Tên hiển thị
    const nameContainer = document.getElementById("displayNameContainer");
    const nameInput = document.getElementById("displayName");
    if(isLoginMode) {
        nameContainer.style.display = "none";
        nameInput.removeAttribute("required");
    } else {
        nameContainer.style.display = "block";
        nameInput.setAttribute("required", "true");
    }
}

// Xử lý Form Submit
document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const displayName = document.getElementById("displayName").value;

    if (!isLoginMode) {
        // Tạo tài khoản mới
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Cập nhật Tên hiển thị ngay sau khi tạo
                updateProfile(userCredential.user, {
                    displayName: displayName
                }).then(() => {
                    alert("Đăng ký thành công! Chào mừng " + displayName);
                    document.getElementById("authModal").style.display = "none";
                    location.reload(); // Tải lại trang để cập nhật tên
                });
            })
            .catch((error) => {
                alert("Lỗi đăng ký: " + error.message);
            });
    } else {
        // Đăng nhập
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

// Đăng xuất
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { alert("Đã đăng xuất!"); });
});

// Theo dõi người dùng
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginBtnTrigger').style.display = 'none';
        document.getElementById('userGreeting').style.display = 'inline';
        
        // Ưu tiên hiển thị Tên thay vì Email
        const showName = user.displayName ? user.displayName : user.email;
        document.getElementById('userGreeting').innerText = "Chào, " + showName;
        
        document.getElementById('logoutBtn').style.display = 'inline';
    } else {
        document.getElementById('loginBtnTrigger').style.display = 'inline';
        document.getElementById('userGreeting').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }
});

