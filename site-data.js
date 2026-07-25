import { db } from "./firebase-config.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================================
   عرض المشاريع في الموقع الرئيسي
========================================= */

async function renderProjects() {
    const wrap = document.getElementById("projectsWrap");
    if (!wrap) return;

    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        if (snap.empty) {
            wrap.innerHTML = `<p style="text-align:center;color:#b8b8b8;">لا توجد مشاريع مضافة بعد.</p>`;
            return;
        }

        wrap.innerHTML = "";

        snap.forEach(docSnap => {
            const p = docSnap.data();

            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-aos", "zoom-in");

            card.innerHTML = `
                <img src="${p.imageUrl}" alt="${p.title}" loading="lazy">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                ${p.link ? `<a href="${p.link}" target="_blank" class="project-btn">عرض المشروع</a>` : ""}
            `;

            wrap.appendChild(card);
        });

        if (window.AOS) AOS.refresh();

    } catch (err) {
        wrap.innerHTML = `<p style="text-align:center;color:#ef4444;">تعذر تحميل المشاريع حالياً.</p>`;
        console.error(err);
    }
}

/* =========================================
   عرض الشهادات في الموقع الرئيسي
========================================= */

async function renderCertificates() {
    const wrap = document.getElementById("certificatesWrap");
    if (!wrap) return;

    try {
        const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        if (snap.empty) {
            wrap.innerHTML = `<p style="text-align:center;color:#b8b8b8;">لا توجد شهادات مضافة بعد.</p>`;
            return;
        }

        wrap.innerHTML = "";

        snap.forEach(docSnap => {
            const c = docSnap.data();

            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("data-aos", "zoom-in");

            card.innerHTML = `
                <img src="${c.imageUrl}" alt="${c.title}" loading="lazy">
                <h3>${c.title}</h3>
                <p>${c.issuer}</p>
                ${c.link ? `<a href="${c.link}" target="_blank" class="project-btn">التحقق من الشهادة</a>` : ""}
            `;

            wrap.appendChild(card);
        });

        if (window.AOS) AOS.refresh();

    } catch (err) {
        wrap.innerHTML = `<p style="text-align:center;color:#ef4444;">تعذر تحميل الشهادات حالياً.</p>`;
        console.error(err);
    }
}

renderProjects();
renderCertificates();