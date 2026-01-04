const html = document.querySelector("html")
const themeToggle = document.getElementById("theme-toggle-button")
const settingsToggle = document.getElementById("settings-toggle")
const settingsSidebar = document.getElementById("settings-sidebar")
const closeBtn = document.getElementById("close-settings")
const fontRadios = document.querySelectorAll(".font-option");
const body = document.body;
const colorButtons = document.querySelectorAll(".theme-color");
const resetBtn = document.getElementById("reset-settings");

themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark")
})

settingsToggle.addEventListener("click", () => {
    settingsSidebar.classList.remove("translate-x-full")
    settingsToggle.style.transform = "translateY(-50%) translateX(-20rem)"
})

closeBtn.addEventListener("click", _ => {
    settingsSidebar.classList.add("translate-x-full")
    settingsToggle.style.transform = "translateY(-50%) translateX(0)"
})



const savedFont = localStorage.getItem("font");
if (savedFont != null) {
    body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
    body.classList.add(`font-${savedFont}`)
}
// click
for (const radio of fontRadios) {
    radio.addEventListener("click", () => {
        for (const r of fontRadios) {
            r.classList.remove("active");
            r.setAttribute("aria-checked", "false");
        }

        radio.classList.add("active");
        radio.setAttribute("aria-checked", "true");

        const font = radio.dataset.font;
        body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
        body.classList.add(`font-${font}`);

        localStorage.setItem("font", font);
    });
}


for (const btn of colorButtons) {
    btn.addEventListener("click", () => {
        // بنجيب درجة اللون الي عايزينه 
        const primary = btn.getAttribute("data-primary");
        const secondary = btn.getAttribute("data-secondary");

        // بنغيرها 
        document.documentElement.style.setProperty("--color-primary", primary);
        document.documentElement.style.setProperty("--color-secondary", secondary);

        // active state
        for (const b of colorButtons) {
            b.classList.remove("ring-2", "ring-primary");
        }
        btn.classList.add("ring-2", "ring-primary");

        // save
        localStorage.setItem("theme-primary", primary);
        localStorage.setItem("theme-secondary", secondary);
    });
}

const savedPrimary = localStorage.getItem("theme-primary");
const savedSecondary = localStorage.getItem("theme-secondary");

if (savedPrimary && savedSecondary) {
    document.documentElement.style.setProperty("--color-primary", savedPrimary);
    document.documentElement.style.setProperty("--color-secondary", savedSecondary);

    for (const btn of colorButtons) {
        if (btn.getAttribute("data-primary") === savedPrimary) {
            btn.classList.add("ring-2", "ring-primary");
        }
    }
}


resetBtn.addEventListener("click", () => {


    document.documentElement.style.setProperty("--color-primary", "#6366f1");
    document.documentElement.style.setProperty("--color-secondary", "#8b5cf6");

    for (const btn of colorButtons) {
        btn.classList.remove("ring-2", "ring-primary");
    }

    body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
    body.classList.add("font-tajawal");

    for (const radio of fontRadios) {
        radio.classList.remove("active");
        radio.setAttribute("aria-checked", "false");

        if (radio.getAttribute("data-font") === "tajawal") {
            radio.classList.add("active");
            radio.setAttribute("aria-checked", "true");
        }
    }

    localStorage.removeItem("font");
    localStorage.removeItem("theme-primary");
    localStorage.removeItem("theme-secondary");

});


const navLinks = document.querySelectorAll(".nav-links a");
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute("href")));

document.addEventListener("scroll", () => {
    let currentSectionId = "";

    // نحدد السكشن الحالي حسب scroll
    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop - sectionHeight / 3) {
            currentSectionId = section.getAttribute("id");
        }
    }

    // نحدث active link
    for (const link of navLinks) {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
            link.classList.add("active");
        }
    }
});



const scrollToTopBtn = document.getElementById("scroll-to-top");
const triggerSection = document.getElementById("portfolio"); // السكشن اللي هيخلي الزرار يظهر

// نراقب scroll
document.addEventListener("scroll", () => {
    if (window.scrollY >= triggerSection.offsetTop) {
        scrollToTopBtn.classList.remove("opacity-0", "invisible");
        scrollToTopBtn.classList.add("opacity-100", "visible");
    } else {
        scrollToTopBtn.classList.add("opacity-0", "invisible");
        scrollToTopBtn.classList.remove("opacity-100", "visible");
    }
});

// scroll للأعلى عند الضغط على الزرار
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
    });
});




const filterButtons = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");


const activeClasses = `
active px-8 py-3 rounded-xl 
bg-linear-to-r from-primary to-secondary 
text-white font-bold transition-all duration-300 
hover:shadow-lg hover:shadow-primary/50
`;

const inactiveClasses = `
px-8 py-3 rounded-xl 
bg-white dark:bg-slate-800 
text-slate-600 dark:text-slate-300 
font-bold transition-all duration-300 
hover:bg-slate-100 dark:hover:bg-slate-700 
border border-slate-300 dark:border-slate-700
`;


for (const button of filterButtons) {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        // Reset all buttons
        for (const btn of filterButtons) {
            btn.className = "portfolio-filter " + inactiveClasses;

        }

        button.className = "portfolio-filter " + activeClasses;

        // Filter items
        for (const item of portfolioItems) {
            const category = item.getAttribute("data-category");

            if (filter === "all" || category === filter) {
                item.classList.remove("hidden");

            } else {
                item.classList.add("hidden");
            }
        }
    });
}

const nextBtn = document.getElementById("next-testimonial");
const prevBtn = document.getElementById("prev-testimonial");
const carousel = document.getElementById("testimonials-carousel");
const indicators = Array.from(document.querySelectorAll(".carousel-indicator"));

let currentIndex = 0;

function getTranslateStep() {
    const width = window.innerWidth;

    if (width >= 1024) return 100 / 3; // lg
    if (width >= 768) return 50;       // md
    return 100;                        // sm
}

function updateCarousel() {
    const step = getTranslateStep();

    
    carousel.style.transform = `translateX(${currentIndex * step}%)`;

    // indicators
    for (const dot of indicators) {
        dot.classList.remove("active", "bg-accent", "scale-125");
        dot.classList.add("bg-slate-400", "dark:bg-slate-600");
        dot.setAttribute("aria-selected", "false");
    }

    const activeDot = indicators[currentIndex];
    

    activeDot.classList.add("active", "bg-accent", "scale-125");
    activeDot.classList.remove("bg-slate-400", "dark:bg-slate-600");
    activeDot.setAttribute("aria-selected", "true");
}

// NEXT  arrow left
nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex > indicators.length - 1) {
        currentIndex = 0;
    }
    updateCarousel();
});

// PREV arrow right
prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = indicators.length - 1;
    }
    updateCarousel();
});

// indicator click
for (const dot of indicators) {
    dot.addEventListener("click", () => {
        currentIndex = Number(dot.dataset.index);
        updateCarousel();
    });
}

// resize
window.addEventListener("resize", updateCarousel);


