import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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
                    document.getElementById("authModal").style.display = "none";
                    showPbAlert("✨ Kích Hoạt Thành Công", `Chào mừng lính mới: <b>${displayName}</b>! <br>Hệ thống đang tải lại...`);
                    setTimeout(() => location.reload(), 2000); 
                });
            })
            .catch((error) => { showPbAlert("❌ Cảnh Báo", "Lỗi đăng ký: <br>" + error.message); });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                document.getElementById("authModal").style.display = "none";
                showPbAlert("⚡ Đăng Nhập Thành Công", "Sức mạnh sấm sét đã sẵn sàng!");
            })
            .catch((error) => { showPbAlert("❌ Lỗi Truy Cập", "Sai email hoặc mật khẩu!<br>Vui lòng kiểm tra lại."); });
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => { 
        window.isUserLoggedIn = false;
        if(window.location.pathname.includes('profile.html')) {
            window.location.href = 'index.html';
        } else {
            showPbAlert("👋 Tạm Biệt", "Đã ngắt kết nối khỏi hệ thống P&B Thunder.");
        }
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.isUserLoggedIn = true;
        document.getElementById('loginBtnTrigger').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        
        const showName = user.displayName ? user.displayName : user.email;
        const greetingEl = document.getElementById('userGreeting');
        
        let avatarHtml = `<div style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid #ffcc00; display: flex; align-items: center; justify-content: center; background: #222;"><svg width="20" height="20" fill="#ffcc00" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>`;
        if(user.photoURL) {
            avatarHtml = `<img src="${user.photoURL}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #ffcc00; background: #222;">`;
        }

        if(greetingEl) {
            greetingEl.innerHTML = `<div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="window.location.href='profile.html'">${avatarHtml}<span style="font-weight: bold; text-decoration: underline;">Chào, ${showName}</span></div>`;
        }

        if(document.getElementById('profileName')) {
            document.getElementById('profileName').innerText = showName;
            document.getElementById('profileEmail').innerText = user.email;
            document.getElementById('profileUid').innerText = user.uid;
            if(user.phoneNumber) document.getElementById('profilePhone').innerText = user.phoneNumber;
            if(user.photoURL) {
                document.getElementById('avatarDisplay').innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            }
        }
    } else {
        window.isUserLoggedIn = false;
        document.getElementById('loginBtnTrigger').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
        if(window.location.pathname.includes('profile.html')) {
            alert("Vui lòng đăng nhập để xem hồ sơ!");
            window.location.href = 'index.html';
        }
    }
});

// THAY THẾ ALERT BẰNG BẢNG COPY XỊN XÒ
window.copyUid = function() {
    const uidText = document.getElementById('profileUid').innerText;
    navigator.clipboard.writeText(uidText);
    showPbAlert("📋 Copy Thành Công", "Đã lưu mã UID vào bộ nhớ tạm:<br><br><b style='color:#00ffcc; font-family: monospace; font-size: 16px; word-break: break-all;'>" + uidText + "</b>");
}

// THAY THẾ PROMPT BẰNG BẢNG NHẬP LIỆU VIP
window.updateUserName = function() {
    document.getElementById("pbPromptTitle").innerText = "✏️ Đổi Tên Hiển Thị";
    document.getElementById("pbPromptMessage").innerText = "Nhập Tên hiển thị mới của bạn:";
    const inputField = document.getElementById("pbPromptInput");
    inputField.value = ""; // Xóa chữ cũ
    inputField.style.borderColor = "#555";
    document.getElementById("pbPromptModal").style.display = "flex";
    inputField.focus();

    document.getElementById("pbPromptConfirmBtn").onclick = function() {
        const newName = inputField.value;
        if (newName && newName.trim() !== "") {
            document.getElementById("pbPromptModal").style.display = "none";
            updateProfile(auth.currentUser, { displayName: newName })
            .then(() => {
                showPbAlert("✨ Thành công", "Tên hiển thị đã được cập nhật! Trang sẽ tự tải lại.");
                setTimeout(() => location.reload(), 1500); 
            }).catch((error) => { showPbAlert("❌ Lỗi", "Không thể đổi tên: " + error.message); });
        } else {
            inputField.style.borderColor = "red"; // Báo đỏ nếu để trống
        }
    };
}

// XỬ LÝ UP ẢNH LÊN IMGBB
window.handleAvatarUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showPbAlert("❌ Lỗi", "Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhẹ hơn 5MB.");
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    showPbAlert("⏳ Đang xử lý", "Hệ thống đang tải ảnh lên máy chủ, vui lòng không tắt trang...");

    // === THAY MÃ API KEY CỦA BẠN VÀO ĐÂY ===
    const imgbbApiKey = "4f889d3d111eb895df6dd2173bbe6f55"; 
    
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.url;
            await updateProfile(user, { photoURL: imageUrl });
            showPbAlert("✨ Thành công", "Ảnh đại diện đã được cập nhật! Trang sẽ tự động tải lại.");
            setTimeout(() => location.reload(), 1500); 
        } else {
            showPbAlert("❌ Lỗi Server", "Máy chủ ảnh phản hồi lỗi: " + data.error.message);
        }
    } catch (error) {
        console.error(error);
        showPbAlert("❌ Lỗi Mạng", "Không thể tải ảnh lên. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.");
    }
}

window.handleServiceClick = function(serviceName) {
    if (window.isUserLoggedIn) {
        showPbAlert("⚡ Yêu Cầu Dịch Vụ", `Bạn đang chọn: <b>${serviceName}</b>.<br><br>Hãy liên hệ Admin ở phần <b>Liên hệ</b> để trao đổi chi tiết nhé!`);
    } else {
        showPbAlert("⚠️ Cần Ủy Quyền", "Vui lòng <b>Đăng nhập</b> vào hệ thống để xem chi tiết và liên hệ dịch vụ!");
        const pbBtn = document.getElementById("pbAlertBtn");
        pbBtn.onclick = function() {
            document.getElementById("pbAlertModal").style.display = "none";
            document.getElementById("authModal").style.display = "flex";
            pbBtn.onclick = function() { document.getElementById("pbAlertModal").style.display = "none"; };
        };
    }
}

