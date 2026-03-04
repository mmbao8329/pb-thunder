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

// Biến kiểm tra xem đã đăng nhập chưa
window.isUserLoggedIn = false;

let isLoginMode = true;
window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById("modalTitle").innerText = isLoginMode ? "Đăng nhập" : "Đăng ký";
    document.getElementById("toggleAuthText").innerHTML = isLoginMode ? "Chưa có tài khoản? <b>Đăng ký ngay</b>" : "Đã có tài khoản? <b>Đăng nhập</b>";
    
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

document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const displayName = document.getElementById("displayName").value;

    if (!isLoginMode) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(userCredential.user, { displayName: displayName })
                .then(() => {
                    alert("Đăng ký thành công! Chào mừng " + displayName);
                    document.getElementById("authModal").style.display = "none";
                    location.reload(); 
                });
            })
            .catch((error) => { alert("Lỗi đăng ký: " + error.message); });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Đăng nhập thành công!");
                document.getElementById("authModal").style.display = "none";
            })
            .catch((error) => { alert("Sai email hoặc mật khẩu!"); });
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { 
        alert("Đã đăng xuất!"); 
        window.isUserLoggedIn = false;
    });
});

// THEO DÕI TRẠNG THÁI NGƯỜI DÙNG & CẬP NHẬT BIẾN GLOBAL
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.isUserLoggedIn = true;
        document.getElementById('loginBtnTrigger').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        
        const showName = user.displayName ? user.displayName : user.email;
        document.getElementById('userGreeting').innerText = "Chào, " + showName;
    } else {
        window.isUserLoggedIn = false;
        document.getElementById('loginBtnTrigger').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
    }
});

// XỬ LÝ NÚT XEM CHI TIẾT DỊCH VỤ
window.handleServiceClick = function(serviceName) {
    if (window.isUserLoggedIn) {
        // Nếu đã đăng nhập thì báo thông tin liên hệ
        alert(`Bạn đang chọn ${serviceName}. \nHãy liên hệ Admin qua Zalo/Facebook: 0987.xxx.xxx để trao đổi chi tiết nhé!`);
    } else {
        // Nếu chưa thì bật form đăng nhập lên
        alert("Vui lòng đăng nhập để xem chi tiết và liên hệ dịch vụ!");
        document.getElementById("authModal").style.display = "flex";
    }
}

