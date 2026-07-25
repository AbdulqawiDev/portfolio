import { auth, db, storage } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* =========================================
   AUTH
========================================= */

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    loginError.textContent = "";

    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
        loginError.textContent = "بيانات الدخول غير صحيحة";
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBox.style.display = "none";
        dashboard.style.display = "block";
        loadProjects();
        loadCertificates();
    } else {
        loginBox.style.display = "block";
        dashboard.style.display = "none";
    }
});

/* =========================================
   TABS
========================================= */

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab + "-panel").classList.add("active");
    });
});

/* =========================================
   HELPERS
========================================= */

function showStatus(el, message, type) {
    el.textContent = message;
    el.className = "status-msg " + type;
    setTimeout(() => { el.style.display = "none"; }, 3500);
}

async function uploadImage(file, folder, progressWrap, progressBar) {
    return new Promise((resolve, reject) => {
        const fileName = Date.now() + "_" + file.name;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        const task = uploadBytesResumable(storageRef, file);

        progressWrap.style.display = "block";

        task.on("state_changed",
            (snapshot) => {
                const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = pct + "%";
            },
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                progressWrap.style.display = "none";
                progressBar.style.width = "0%";
                resolve({ url, path: storageRef.fullPath });
            }
        );
    });
}

/* =========================================
   PROJECTS
========================================= */

const projTitle = document.getElementById("projTitle");
const projDesc = document.getElementById("projDesc");
const projLink = document.getElementById("projLink");
const projImage = document.getElementById("projImage");
const projEditId = document.getElementById("projEditId");
const projSubmitBtn = document.getElementById("projSubmitBtn");
const projFormTitle = document.getElementById("projFormTitle");
const projStatus = document.getElementById("projStatus");
const projProgressWrap = document.getElementById("projProgressWrap");
const projProgressBar = document.getElementById("projProgressBar");
const projectsList = document.getElementById("projectsList");

projSubmitBtn.addEventListener("click", async () => {
    const title = projTitle.value.trim();
    const desc = projDesc.value.trim();
    const link = projLink.value.trim();
    const file = projImage.files[0];
    const editId = projEditId.value;

    if (!title || !desc) {
        showStatus(projStatus, "الرجاء تعبئة العنوان والوصف", "error");
        return;
    }
    if (!editId && !file) {
        showStatus(projStatus, "الرجاء اختيار صورة للمشروع", "error");
        return;
    }

    projSubmitBtn.disabled = true;
    projSubmitBtn.textContent = "جاري الحفظ...";

    try {
        let imageData = null;
        if (file) {
            imageData = await uploadImage(file, "projects", projProgressWrap, projProgressBar);
        }

        if (editId) {
            const updateData = { title, description: desc, link };
            if (imageData) {
                updateData.imageUrl = imageData.url;
                updateData.imagePath = imageData.path;
            }
            await updateDoc(doc(db, "projects", editId), updateData);
            showStatus(projStatus, "تم تحديث المشروع بنجاح", "success");
        } else {
            await addDoc(collection(db, "projects"), {
                title,
                description: desc,
                link,
                imageUrl: imageData.url,
                imagePath: imageData.path,
                createdAt: serverTimestamp()
            });
            showStatus(projStatus, "تمت إضافة المشروع بنجاح", "success");
        }

        resetProjectForm();
        loadProjects();

    } catch (err) {
        showStatus(projStatus, "حدث خطأ: " + err.message, "error");
    }

    projSubmitBtn.disabled = false;
});

function resetProjectForm() {
    projTitle.value = "";
    projDesc.value = "";
    projLink.value = "";
    projImage.value = "";
    projEditId.value = "";
    projFormTitle.innerHTML = '<i class="fas fa-plus"></i> إضافة مشروع جديد';
    projSubmitBtn.textContent = "إضافة المشروع";
}

async function loadProjects() {
    projectsList.innerHTML = "";
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    snap.forEach(docSnap => {
        const p = docSnap.data();
        const id = docSnap.id;

        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <img src="${p.imageUrl}" alt="${p.title}">
            <div class="info">
                <h4>${p.title}</h4>
                <p>${p.description}</p>
                <div class="item-actions">
                    <button class="btn-edit">تعديل</button>
                    <button class="btn-delete">حذف</button>
                </div>
            </div>
        `;

        card.querySelector(".btn-edit").addEventListener("click", () => {
            projTitle.value = p.title;
            projDesc.value = p.description;
            projLink.value = p.link || "";
            projEditId.value = id;
            projFormTitle.innerHTML = '<i class="fas fa-pen"></i> تعديل المشروع';
            projSubmitBtn.textContent = "حفظ التعديلات";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        card.querySelector(".btn-delete").addEventListener("click", async () => {
            if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
            try {
                if (p.imagePath) {
                    await deleteObject(ref(storage, p.imagePath)).catch(() => {});
                }
                await deleteDoc(doc(db, "projects", id));
                loadProjects();
            } catch (err) {
                alert("خطأ أثناء الحذف: " + err.message);
            }
        });

        projectsList.appendChild(card);
    });
}

/* =========================================
   CERTIFICATES
========================================= */

const certTitle = document.getElementById("certTitle");
const certIssuer = document.getElementById("certIssuer");
const certLink = document.getElementById("certLink");
const certImage = document.getElementById("certImage");
const certEditId = document.getElementById("certEditId");
const certSubmitBtn = document.getElementById("certSubmitBtn");
const certFormTitle = document.getElementById("certFormTitle");
const certStatus = document.getElementById("certStatus");
const certProgressWrap = document.getElementById("certProgressWrap");
const certProgressBar = document.getElementById("certProgressBar");
const certificatesList = document.getElementById("certificatesList");

certSubmitBtn.addEventListener("click", async () => {
    const title = certTitle.value.trim();
    const issuer = certIssuer.value.trim();
    const link = certLink.value.trim();
    const file = certImage.files[0];
    const editId = certEditId.value;

    if (!title || !issuer) {
        showStatus(certStatus, "الرجاء تعبئة اسم الشهادة وجهة الإصدار", "error");
        return;
    }
    if (!editId && !file) {
        showStatus(certStatus, "الرجاء اختيار صورة الشهادة", "error");
        return;
    }

    certSubmitBtn.disabled = true;
    certSubmitBtn.textContent = "جاري الحفظ...";

    try {
        let imageData = null;
        if (file) {
            imageData = await uploadImage(file, "certificates", certProgressWrap, certProgressBar);
        }

        if (editId) {
            const updateData = { title, issuer, link };
            if (imageData) {
                updateData.imageUrl = imageData.url;
                updateData.imagePath = imageData.path;
            }
            await updateDoc(doc(db, "certificates", editId), updateData);
            showStatus(certStatus, "تم تحديث الشهادة بنجاح", "success");
        } else {
            await addDoc(collection(db, "certificates"), {
                title,
                issuer,
                link,
                imageUrl: imageData.url,
                imagePath: imageData.path,
                createdAt: serverTimestamp()
            });
            showStatus(certStatus, "تمت إضافة الشهادة بنجاح", "success");
        }

        resetCertForm();
        loadCertificates();

    } catch (err) {
        showStatus(certStatus, "حدث خطأ: " + err.message, "error");
    }

    certSubmitBtn.disabled = false;
});

function resetCertForm() {
    certTitle.value = "";
    certIssuer.value = "";
    certLink.value = "";
    certImage.value = "";
    certEditId.value = "";
    certFormTitle.innerHTML = '<i class="fas fa-plus"></i> إضافة شهادة جديدة';
    certSubmitBtn.textContent = "إضافة الشهادة";
}

async function loadCertificates() {
    certificatesList.innerHTML = "";
    const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    snap.forEach(docSnap => {
        const c = docSnap.data();
        const id = docSnap.id;

        const card = document.createElement("div");
        card.className = "item-card";
        card.innerHTML = `
            <img src="${c.imageUrl}" alt="${c.title}">
            <div class="info">
                <h4>${c.title}</h4>
                <p>${c.issuer}</p>
                <div class="item-actions">
                    <button class="btn-edit">تعديل</button>
                    <button class="btn-delete">حذف</button>
                </div>
            </div>
        `;

        card.querySelector(".btn-edit").addEventListener("click", () => {
            certTitle.value = c.title;
            certIssuer.value = c.issuer;
            certLink.value = c.link || "";
            certEditId.value = id;
            certFormTitle.innerHTML = '<i class="fas fa-pen"></i> تعديل الشهادة';
            certSubmitBtn.textContent = "حفظ التعديلات";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        card.querySelector(".btn-delete").addEventListener("click", async () => {
            if (!confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;
            try {
                if (c.imagePath) {
                    await deleteObject(ref(storage, c.imagePath)).catch(() => {});
                }
                await deleteDoc(doc(db, "certificates", id));
                loadCertificates();
            } catch (err) {
                alert("خطأ أثناء الحذف: " + err.message);
            }
        });

        certificatesList.appendChild(card);
    });
}