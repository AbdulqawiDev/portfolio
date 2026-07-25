
/*=========================================
    AOS
=========================================*/

AOS.init({
    duration: 1000,
    once: true,
    easing: "ease-in-out"
});


/*=========================================
    Typed.js
=========================================*/

new Typed("#typing", {
    strings: [
        "عبدالقوي السالمي",
        "Flutter Developer",
        "Python Developer",
        "UI / UX Designer"
    ],
    typeSpeed: 70,
    backSpeed: 45,
    backDelay: 1500,
    loop: true
});


/*=========================================
    Hero Animation (GSAP)
=========================================*/

gsap.from("nav", {
    y: -100,
    opacity: 0,
    duration: 1
});

gsap.from(".hero-left", {
    x: -120,
    opacity: 0,
    duration: 1.3
});

gsap.from(".hero-right", {
    x: 120,
    opacity: 0,
    duration: 1.3
});


/*=========================================
    Counter Animation
=========================================*/

const counters = document.querySelectorAll(".count");

const startCounter = (counter) => {

    const target = Number(counter.dataset.target);
    let current = 0;

    const speed = target / 120;

    const update = () => {

        current += speed;

        if (current < target) {

            counter.textContent = Math.ceil(current);

            requestAnimationFrame(update);

        } else {

            counter.textContent = target;

        }

    };

    update();

};

const counterSection = document.querySelector(".counter");

if (counterSection) {

    const observer = new IntersectionObserver((entries) => {

        if (entries[0].isIntersecting) {

            counters.forEach(startCounter);

            observer.disconnect();

        }

    });

    observer.observe(counterSection);

}


/*=========================================
    Smooth Scroll
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = this.getAttribute("href");

        if (target === "#") return;

        e.preventDefault();

        document.querySelector(target).scrollIntoView({

            behavior: "smooth"

        });

    });

});


/*=========================================
    Navbar Scroll
=========================================*/

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        nav.classList.add("active-nav");

    } else {

        nav.classList.remove("active-nav");

    }

});


/*=========================================
    Scroll To Top
=========================================*/

const topBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");

    }

});


/*=========================================
    Floating Image
=========================================*/

const profile = document.querySelector(".hero-right img");

window.addEventListener("mousemove", (e) => {

    const x = (window.innerWidth / 2 - e.clientX) / 40;

    const y = (window.innerHeight / 2 - e.clientY) / 40;

    profile.style.transform =
        `translate(${x}px, ${y}px)`;

});


/*=========================================
    Particles.js
=========================================*/

particlesJS("particles-js", {

    particles: {

        number: {
            value: 90
        },

        color: {
            value: "#06b6d4"
        },

        shape: {
            type: "circle"
        },

        opacity: {
            value: 0.5
        },

        size: {
            value: 3
        },

        line_linked: {

            enable: true,

            distance: 150,

            color: "#06b6d4",

            opacity: 0.3,

            width: 1

        },

        move: {

            enable: true,

            speed: 2

        }

    },

    interactivity: {

        events: {

            onhover: {

                enable: true,

                mode: "grab"

            },

            onclick: {

                enable: true,

                mode: "push"

            }

        }

    }

});


/*=========================================
    Card Hover Effect
=========================================*/

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        gsap.to(card, {

            scale: 1.04,

            duration: 0.3

        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(card, {

            scale: 1,

            duration: 0.3

        });

    });

});

// ==========================
// Mobile Navbar
// ==========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navLinks.classList.contains("active")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });


    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });

}