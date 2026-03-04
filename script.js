import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Khóa kết nối Firebase của bạn
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

window.isUserLoggedIn = false;

// HÀM GỌI THÔNG BÁO TỰ TẠO (Thay thế Alert)
window.showPbAlert = function(title, message) {
    document.getElementById("pbAlertTitle").innerHTML = title;
    document.getElementById("pbAlertMessage").innerHTML = message;
    document.getElementById("pbAlertModal").style.display = "flex";
}

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

// XỬ LÝ NÚT ĐĂNG KÝ / ĐĂNG NHẬP
document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const displayName = document.getElementById("displayName").value;

    if (!isLoginMode) {
        // Tạo tài khoản
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(userCredential.user, { displayName: displayName })
                .then(() => {
                    document.getElementById("authModal").style.display = "none";
                    showPbAlert("✨ Kích Hoạt Thành Công", `Chào mừng lính mới: <b>${displayName}</b>! <br>Hệ thống đang tải lại...`);
                    setTimeout(() => location.reload(), 2000); 
                });
            })
            .catch((error) => { 
                showPbAlert("❌ Cảnh Báo", "Lỗi đăng ký: <br>" + error.message); 
            });
    } else {
        // Đăng nhập
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                document.getElementById("authModal").style.display = "none";
                showPbAlert("⚡ Đăng Nhập Thành Công", "Sức mạnh sấm sét đã sẵn sàng!");
            })
            .catch((error) => { 
                showPbAlert("❌ Lỗi Truy Cập", "Sai email hoặc mật khẩu!<br>Vui lòng kiểm tra lại."); 
            });
    }
});

// XỬ LÝ ĐĂNG XUẤT
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { 
        window.isUserLoggedIn = false;
        showPbAlert("👋 Tạm Biệt", "Đã ngắt kết nối khỏi hệ thống P&B Thunder.");
    });
});

// THEO DÕI NGƯỜI DÙNG ONLINE/OFFLINE
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

// XỬ LÝ NÚT "XEM CHI TIẾT" DỊCH VỤ
window.handleServiceClick = function(serviceName) {
    if (window.isUserLoggedIn) {
        showPbAlert("⚡ Yêu Cầu Dịch Vụ", `Bạn đang chọn: <b>${serviceName}</b>.<br><br>Hãy liên hệ Admin qua Zalo/Facebook:<br><b>0987.xxx.xxx</b> để trao đổi chi tiết nhé!`);
    } else {
        showPbAlert("⚠️ Cần Ủy Quyền", "Vui lòng <b>Đăng nhập</b> vào hệ thống để xem chi tiết và liên hệ dịch vụ!");
        
        // Khi người dùng bấm "Đã hiểu", bảng thông báo sẽ đóng và bảng Đăng nhập tự động nhảy lên
        const pbBtn = document.getElementById("pbAlertBtn");
        pbBtn.onclick = function() {
            document.getElementById("pbAlertModal").style.display = "none";
            document.getElementById("authModal").style.display = "flex";
            // Trả lại chức năng đóng bình thường cho nút sau khi dùng xong
            pbBtn.onclick = function() { document.getElementById("pbAlertModal").style.display = "none"; };
        };
    }
}

