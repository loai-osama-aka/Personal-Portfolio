const html = document.querySelector("html");
const themeToggle = document.getElementById("theme-toggle-button");
const settingsToggle = document.getElementById("settings-toggle");
const settingsSidebar = document.getElementById("settings-sidebar");
const closeBtn = document.getElementById("close-settings");
const fontRadios = document.querySelectorAll(".font-option");
const body = document.body;
const colorButtons = document.querySelectorAll(".theme-color");
const resetBtn = document.getElementById("reset-settings");

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
});

settingsToggle.addEventListener("click", () => {
  settingsSidebar.classList.remove("translate-x-full");
  settingsToggle.style.transform = "translateY(-50%) translateX(-20rem)";
});

closeBtn.addEventListener("click", (_) => {
  settingsSidebar.classList.add("translate-x-full");
  settingsToggle.style.transform = "translateY(-50%) translateX(0)";
});

const savedFont = localStorage.getItem("font");
if (savedFont != null) {
  body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
  body.classList.add(`font-${savedFont}`);
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
  document.documentElement.style.setProperty(
    "--color-secondary",
    savedSecondary,
  );

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
const sections = Array.from(navLinks).map((link) =>
  document.querySelector(link.getAttribute("href")),
);
console.log(sections);

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
  if (width >= 768) return 50; // md
  return 100; // sm
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

const menuBtn = document.getElementById("mobile-menu-btn");
const nav = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

//language switcher
const translations = {
  ar: {
    home: "الرئيسية",
    about: "عني",
    portfolio: "الأعمال",
    experience: "الخبرة",
    testimonials: "التوصيات",
    contact: "تواصل",
    loai: "لؤي اسامة",
    freelance: "متاح للشغل الحر",
    greeting: "مرحباً، أنا 👋",
    frontenddeveloper: "مطور واجهات",
    changeyourideas: "بحول أفكارك لـ",
    specialideas: "تجارب رقمية مميزة",
    description: ". متخصص في بناء مواقع وتطبيقات ويب حديثة بأحدث التقنيات",
    exploreWork: "استكشف أعمالي",
    contactMe: "تواصل معي",
    discoverMore: "اكتشف المزيد",
    aboutLabel: "من أنا",
    aboutTitle: "عن",
    name: "لؤي اسامة",

    aboutHeading: {
      text: `بحب أحول الأفكار <span class="text-primary">لواقع رقمي</span>`,
      html: true,
    },
    arrowRight: {
      text: ` <i
                    class="fa-solid fa-arrow-left relative z-10 transition-transform duration-300 group-hover:-translate-x-2"
                  ></i>`,
      html: true,
    },

    aboutDesc1:
      "مطور واجهات أمامية لدي الخبرة في بناء تطبيقات ويب حديثة وتصميم تجارب مستخدم استثنائية.",

    aboutDesc2:
      "بشتغل بأحدث التقنيات زي React و Next.js و TypeScript عشان أقدم حلول عالية الجودة وتعدي التوقعات.",
    aiFaculty: "كلية ذكاء اصطناعي",
    projectsCount: "+10 مشروع",
    teamwork: "القدرة على العمل ضمن فريق",

    whatIDo: "ما أقدمه",

    service1: "تطوير تطبيقات ويب متكاملة بـ React & Next.js",
    service2: "تصميم واجهات مستخدم حديثة وجذابة",
    service3: "تحسين الأداء وسرعة التحميل",
    service4: "تطوير مواقع متوافقة مع جميع الأجهزة",
    projects: "مشروع",
    years: "سنوات",
    clients: "عميل",
    skillsLabel: "ما أتقنه",
    skillsTitle: "المهارات و",
    skillsSpan: "التقنيات",

    reactDesc: "خبرة متقدمة في بناء تطبيقات React معقدة",
    nextDesc: "تطوير تطبيقات SSR وSSG متقدمة",
    tsDesc: "كتابة كود آمن ومنظم بشكل احترافي",
    tailwindDesc: "تصميم واجهات حديثة بسرعة عالية",
    bootstrapDesc: "بناء واجهات ويب متجاوبة",
    portfolioLabel: "أعمالي",
    portfolioTitle: "معرض",
    portfolioSpan: "المشاريع",

    filterAll: "الكل",
    filterWeb: "مواقع الويب",
    filterApp: "التطبيقات",
    filterDesign: "التصميم",
    filterEcommerce: "التجارة الإلكترونية",
    projectTypeApp: "تطبيق",
    project1Title: "موقع التجارة الإلكترونية",
    project1Desc: "موقع تجارة إلكترونية يتيح تصفح المنتجات والشراء والدفع.",
    projectTypeWeb: "موقع ويب",
    project2Title: "موقع عدسة للتصوير",
    project2Desc: "موقع عرض احترافي للتصوير والعدسات بتصميم عصري ومتجاوب.",
    project3Title: "تطبيق تواصل اجتماعي",
    project3Desc:
      "تطبيق تواصل اجتماعي يتيح إنشاء المنشورات والتفاعل مع المستخدمين.",

    project4Title: "Contact Hub",
    project4Desc: "نظام إدارة جهات الاتصال مع CRUD UI بسيط وسريع.",
    project5Title: "تطبيق الطقس",
    project5Desc:
      "تطبيق طقس حديث يعرض بيانات الطقس في الوقت الحقيقي بتصميم متجاوب.",

    project6Title: "ما هو للغداء؟",
    project6Desc:
      "تطبيق يقترح وصفات طعام ويُساعد في التخطيط للوجبات مع واجهة سهلة الاستخدام",
    startYourProject: "لنبدأ مشروعك القادم",
    expLabel: "مسيرتي المهنية",
    expTitle: "الخبرة",
    expSpan: "العملية",

    exp1Date: "2025 - الآن",
    exp1Title: "مطور واجهات",
    exp1Company: "عمل حر / مشاريع شخصية",
    exp1Desc:
      "تطوير تطبيقات ويب حديثة باستخدام React و Next.js مع التركيز على الأداء وتجربة المستخدم.",

    exp2Date: "2023 - 2024",
    exp2Title: "تدريب Frontend",
    exp2Company: "Route Academy",
    exp2Desc:
      "دراسة أساسيات البرمجة وتطوير الويب باستخدام HTML, CSS, JavaScript و React.",

    exp3Date: "2020 - 2024",
    exp3Title: "بكالوريوس ذكاء اصطناعي",
    exp3Company: "جامعة كفر الشيخ",
    exp3Desc:
      "دراسة علوم الحاسب والذكاء الاصطناعي مع التركيز على البرمجة والخوارزميات.",

    skillsCardTitle: "المهارات التقنية",
    skillsCardDesc:
      "React • Next.js • JavaScript • Tailwind • APIs • Redux • Git",

    projectsCardTitle: "المشاريع",
    projectsCardDesc: "منصات E-commerce • تطبيقات Social Media • أدوات داشبورد",

    goalTitle: "هدفي",
    goalDesc:
      "الانضمام لفريق تطوير احترافي وبناء تطبيقات ويب قوية وقابلة للتوسع",
    myrealexp: "خبرتي العملية",
    testimonialsWord: "تأثير",
    testimonialsSpan: "المشاريع",
    ctaTitle: "جاهز تبدأ مشروعك؟",
    ctaDesc: "يلا نشتغل سوا عشان نحول أفكارك لواقع مبهر",
    ctaBtnContact: "تواصل معي الآن",
    ctaBtnWork: "شاهد المزيد من الأعمال",
    footerName: "لؤي اسامة",

    footerDesc:
      "أؤمن بأن البرمجة فن. هدفي مش بس كتابة كود، بل خلق تجربة مستخدم سلسة بتسيب أثر.",

    footerCVLabel: "تعرف على خبراتي",
    footerCVText: "حمل السيرة الذاتية (CV)",

    footerStatusText: "أعمل حالياً على:",
    footerStatusProject: "مشروع SaaS لإدارة الفريق",

    footerLinksTitle: "روابط سريعة",

    footerServicesTitle: "الخدمات",

    service1: "تطوير الويب",
    service2: "تطوير التطبيقات",
    service3: "تصميم UI/UX",
    service4: "الاستشارات التقنية",
    service5: "تحسين الأداء",
    service6: "الصيانة والدعم",

    footerCopy: "© 2025 لؤي اسامة. جميع الحقوق محفوظة.",
    projectWeatherTitle: "تطبيق توقعات الطقس",
    projectWeatherDesc:
      "تطبيق طقس متطور يعرض بيانات الطقس في الوقت الحقيقي باستخدام API، مع تحسين الأداء عبر استخدام sprite للصور وإدارة الحالة باستخدام Jotai.",
    projectSpaceTitle: "لوحة تحكم الفضاء",
    projectSpaceDesc:
      "لوحة تحكم تفاعلية تعرض بيانات الفضاء والكواكب باستخدام REST API، مع تصميم حديث وتجربة مستخدم سلسة.",
  },

  en: {
    home: "Home",
    about: "About",
    portfolio: "Projects",
    experience: "Experience",
    testimonials: "Testimonials",
    contact: "Contact",
    loai: "Loai Osama",
    freelance: "Freelance Available",
    greeting: "Hello, I'm 👋",
    frontenddeveloper: "Frontend Developer",
    changeyourideas: "Transforming your ideas into",
    specialideas: "unique digital experiences",
    description:
      "Specializing in building modern websites and web applications with the latest technologies.",
    exploreWork: "Explore My Work",
    contactMe: "Contact Me",
    discoverMore: "Discover More",
    aboutLabel: "About Me",
    aboutTitle: "About",
    name: "Loai Osama",
    arrowRight: {
      text: ` <i
                    class="fa-solid fa-arrow-right relative z-10 transition-transform duration-300 group-hover:-translate-x-2"
                  ></i>`,
      html: true,
    },
    aboutHeading: {
      text: `I love turning ideas <span class="text-primary">into digital reality</span>`,
      html: true,
    },

    aboutDesc1:
      "Frontend developer experienced in building modern web applications and crafting exceptional user experiences.",

    aboutDesc2:
      "I work with the latest technologies like React, Next.js, and TypeScript to deliver high-quality solutions that exceed expectations.",
    aiFaculty: "AI Faculty",
    projectsCount: "+10 Projects",
    teamwork: "Teamwork Ability",

    whatIDo: "What I Offer",

    service1: "Full web app development with React & Next.js",
    service2: "Modern and attractive UI design",
    service3: "Performance and loading speed optimization",
    service4: "Responsive websites for all devices",
    projects: "Projects",
    years: "Years",
    clients: "Clients",
    skillsLabel: "What I Master",
    skillsTitle: "Skills &",
    skillsSpan: "Technologies",

    reactDesc: "Advanced experience in building complex React applications",
    nextDesc: "Building advanced SSR and SSG applications",
    tsDesc: "Writing safe and well-structured code",
    tailwindDesc: "Designing modern UIs with high speed",
    bootstrapDesc: "Building responsive web interfaces",
    portfolioLabel: "My Work",
    portfolioTitle: "Project",
    portfolioSpan: "Showcase",

    filterAll: "All",
    filterWeb: "Websites",
    filterApp: "Applications",
    filterDesign: "Design",
    filterEcommerce: "E-commerce",
    projectTypeApp: "App",
    project1Title: "Ecommerce Website",
    project1Desc:
      "An e-commerce platform for browsing products, purchasing, and payments.",
    projectTypeWeb: "Website",
    project2Title: "Lens Photography Website",
    project2Desc:
      "A professional photography and lenses showcase website with modern responsive design.",
    project3Title: "Social Media App",
    project3Desc:
      "A social media app for creating posts and interacting with users.",

    project4Title: "Contact Hub",
    project4Desc: "A simple and fast contact management system with CRUD UI.",
    project5Title: "Weather App",
    project5Desc:
      "A modern weather app that shows real-time data with responsive design.",

    project6Title: "What's for Dinner?",
    project6Desc:
      "An app that suggests recipes and helps plan meals with a simple UI.",
    startYourProject: "let's Start Your Project",
    expLabel: "My Journey",
    expTitle: "Experience",
    expSpan: "Timeline",

    exp1Date: "2025 - Present",
    exp1Title: "Frontend Developer",
    exp1Company: "Freelance / Personal Projects",
    exp1Desc:
      "Building modern web applications using React and Next.js with focus on performance and UX.",

    exp2Date: "2023 - 2024",
    exp2Title: "Frontend Training",
    exp2Company: "Route Academy",
    exp2Desc:
      "Studied web development fundamentals using HTML, CSS, JavaScript and React.",

    exp3Date: "2020 - 2024",
    exp3Title: "Bachelor of AI",
    exp3Company: "Kafrelsheikh University",
    exp3Desc:
      "Studied computer science and AI with focus on programming and algorithms.",

    skillsCardTitle: "Technical Skills",
    skillsCardDesc:
      "React • Next.js • JavaScript • Tailwind • APIs • Redux • Git",

    projectsCardTitle: "Projects",
    projectsCardDesc:
      "E-commerce Platforms • Social Media Apps • Dashboard Tools",

    goalTitle: "My Goal",
    goalDesc:
      "To join a professional development team and build scalable web applications",
    myrealexp: "My Real Experience",
    testimonialsWord: "Impact",
    testimonialsSpan: "of Projects",
    ctaTitle: "Ready to start your project?",
    ctaDesc: "Let’s work together to turn your ideas into something amazing",
    ctaBtnContact: "Contact Me Now",
    ctaBtnWork: "View More Projects",
    footerName: "Loai Osama",

    footerDesc:
      "I believe programming is an art. My goal is not just writing code, but creating smooth user experiences.",

    footerCVLabel: "Learn about my experience",
    footerCVText: "Download CV",

    footerStatusText: "Currently working on:",
    footerStatusProject: "SaaS team management project",

    footerLinksTitle: "Quick Links",

    footerServicesTitle: "Services",

    service1: "Web Development",
    service2: "App Development",
    service3: "UI/UX Design",
    service4: "Technical Consulting",
    service5: "Performance Optimization",
    service6: "Maintenance & Support",

    footerCopy: "© 2025 Loai Osama. All rights reserved.",
    projectWeatherTitle: "Weather Forecast App",
    projectWeatherDesc:
      "Advanced weather app displaying real-time data using APIs, optimized with sprite-based icons and state management using Jotai.",
    projectSpaceTitle: "Space Dashboard",
    projectSpaceDesc:
      "Interactive dashboard displaying space and planets data using REST APIs, featuring a modern UI and smooth user experience.",
  },
};
let currentLang = localStorage.getItem("lang") || "ar";

const toggleBtn = document.getElementById("lang-toggle");

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang][key];

    if (!value) return;

    //  Step 2 FIXED: safe HTML handling
    if (typeof value === "object" && value.html) {
      el.innerHTML = value.text;
    } else {
      el.textContent = value;
    }
  });

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  localStorage.setItem("lang", lang);
  toggleBtn.textContent = lang === "ar" ? "EN" : "العربية";
}
// toggle
toggleBtn.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  setLanguage(currentLang);
});

// init
setLanguage(currentLang);
