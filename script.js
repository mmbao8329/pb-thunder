import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// SẾP DÁN LẠI CONFIG FIREBASE CỦA SẾP VÀO ĐÂY NHÉ:
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
window.currentUserUid = ""; 

// === DÁN LINK GOOGLE SCRIPT URL (/exec) CỦA SẾP VÀO ĐÂY ===
window.GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbx3FHd7oVaCyDZuO0fQmqJwQmvJMs4Zw38bi_akBc5jFMZJP2ECZ8ZlQM66vAPQRdYT/exec";

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
    if(isLoginMode) { nameContainer.style.display = "none"; document.getElementById("displayName").removeAttribute("required");
    } else { nameContainer.style.display = "block"; document.getElementById("displayName").setAttribute("required", "true"); }
}

document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value; const password = document.getElementById("password").value; const displayName = document.getElementById("displayName").value;
    if (!isLoginMode) {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            updateProfile(userCredential.user, { displayName: displayName }).then(() => {
                document.getElementById("authModal").style.display = "none";
                showPbAlert("✨ Kích Hoạt", `Chào mừng lính mới: <b>${displayName}</b>! Hệ thống đang tải lại...`);
                setTimeout(() => location.reload(), 2000); 
            });
        }).catch((error) => { showPbAlert("❌ Lỗi", error.message); });
    } else {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            document.getElementById("authModal").style.display = "none";
            showPbAlert("⚡ Đăng Nhập", "Sức mạnh sấm sét đã sẵn sàng!");
        }).catch(() => { showPbAlert("❌ Lỗi", "Sai email hoặc mật khẩu!"); });
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { window.location.href = 'index.html'; });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.isUserLoggedIn = true; window.currentUserUid = user.uid;
        document.getElementById('loginBtnTrigger').style.display = 'none'; document.getElementById('userProfile').style.display = 'flex';
        const showName = user.displayName ? user.displayName : user.email;
        let avatarHtml = user.photoURL ? `<img src="${user.photoURL}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #ffcc00; background: #222;">` : `<div style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid #ffcc00; display: flex; align-items: center; justify-content: center; background: #222;"><svg width="20" height="20" fill="#ffcc00" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`;
        if(document.getElementById('userGreeting')) document.getElementById('userGreeting').innerHTML = `<div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="window.location.href='profile.html'">${avatarHtml}<span style="font-weight: bold; text-decoration: underline;">Chào, ${showName}</span></div>`;
        
        if(document.getElementById('profileName')) {
            document.getElementById('profileName').innerText = showName; document.getElementById('profileEmail').innerText = user.email; document.getElementById('profileUid').innerText = user.uid;
            if(user.photoURL) document.getElementById('avatarDisplay').innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        }

        // LẤY SỐ DƯ TỪ GOOGLE SHEETS BẰNG FETCH API
        if(document.getElementById('userBalance')) {
            fetch(window.GOOGLE_API_URL + "?uid=" + user.uid)
                .then(res => res.json())
                .then(data => { document.getElementById('userBalance').innerText = (data.balance || 0).toLocaleString('vi-VN'); })
                .catch(err => { document.getElementById('userBalance').innerText = "0"; });
            
            // Tự động load lại số dư mỗi 10 giây (khách ko cần F5)
            setInterval(() => {
                fetch(window.GOOGLE_API_URL + "?uid=" + user.uid)
                .then(res => res.json())
                .then(data => { document.getElementById('userBalance').innerText = (data.balance || 0).toLocaleString('vi-VN'); });
            }, 10000);
        }
    } else {
        window.isUserLoggedIn = false; window.currentUserUid = "";
        document.getElementById('loginBtnTrigger').style.display = 'block'; document.getElementById('userProfile').style.display = 'none';
    }
});

window.copyUid = function() { navigator.clipboard.writeText(window.currentUserUid); showPbAlert("📋 Copy", "Đã lưu mã UID!"); }

