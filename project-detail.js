const PROJECTS_FILE = "./projects.json";
const STORAGE_KEY = "alphy-portfolio-projects-draft";
const LANGUAGE_KEY = "alphy-portfolio-language";
const translations = {
  es: {
    "nav.projects": "Proyectos",
    "nav.about": "Sobre mi",
    "nav.contact": "Contacto",
    "detail.eyebrow": "Project Detail",
    "detail.link": "Ver link del proyecto",
    "detail.back": "Volver",
    "detail.galleryEyebrow": "Gallery",
    "detail.galleryTitle": "Imagenes del proyecto"
  },
  en: {
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "detail.eyebrow": "Project Detail",
    "detail.link": "View project link",
    "detail.back": "Back",
    "detail.galleryEyebrow": "Gallery",
    "detail.galleryTitle": "Project images"
  }
};
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "es";

function normalizeProjects(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id: item.id || `project-${index + 1}`,
    title: item.title || "Proyecto sin nombre",
    description: item.description || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    category: item.category || "Proyecto",
    link: item.link || "",
    accent: item.accent || "#f7cade",
    coverImage: item.coverImage || "",
    gallery: Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : [],
  }));
}

function createGalleryItem(image, title) {
  const article = document.createElement("article");
  article.className = "gallery-item";

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = `${title} preview`;
    img.loading = "lazy";
    article.appendChild(img);
  } else {
    article.classList.add("gallery-placeholder");
    article.textContent = currentLanguage === "es"
      ? "Agrega imagenes para mostrar el proyecto aqui."
      : "Add images to show the project here.";
  }

  return article;
}

function loadDraftProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return normalizeProjects(JSON.parse(saved));
  } catch {
    return [];
  }
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "es";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translations[currentLanguage][node.dataset.i18n];
    if (typeof value === "string") {
      node.textContent = value;
    }
  });

  document.querySelectorAll("[data-lang-option]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.langOption === currentLanguage);
  });
}

function revealElements() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupDescriptionToggle(description, toggle, minLength) {
  if (!description || !toggle) {
    return;
  }

  const shouldCollapse = description.textContent.trim().length > minLength;
  description.classList.toggle("is-collapsed", shouldCollapse);
  toggle.hidden = !shouldCollapse;
  toggle.textContent = currentLanguage === "es" ? "Ver mas" : "Show more";
  toggle.setAttribute("aria-expanded", "false");

  if (!shouldCollapse) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isCollapsed = description.classList.toggle("is-collapsed");
    toggle.textContent = isCollapsed
      ? currentLanguage === "es" ? "Ver mas" : "Show more"
      : currentLanguage === "es" ? "Ver menos" : "Show less";
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  let projects = loadDraftProjects();
  if (projects.length === 0) {
    const response = await fetch(PROJECTS_FILE, { cache: "no-store" });
    projects = normalizeProjects(await response.json());
  }
  const project = projects.find((item) => item.id === projectId) || projects[0];

  const title = document.getElementById("detail-title");
  const description = document.getElementById("detail-description");
  const descriptionToggle = document.getElementById("detail-description-toggle");
  const tags = document.getElementById("detail-tags");
  const cover = document.getElementById("detail-cover");
  const link = document.getElementById("detail-link");
  const gallery = document.getElementById("detail-gallery");
  const langToggle = document.getElementById("lang-toggle");

  langToggle?.addEventListener("click", () => {
    applyLanguage(currentLanguage === "es" ? "en" : "es");
  });

  document.title = `${project.title} | Alphy`;
  title.textContent = project.title;
  description.textContent = project.description;
  setupDescriptionToggle(description, descriptionToggle, 420);
  tags.innerHTML = "";

  project.tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    tags.appendChild(chip);
  });

  if (project.link) {
    link.href = project.link;
    link.hidden = false;
  } else {
    link.hidden = true;
  }

  if (project.coverImage) {
    cover.innerHTML = `<img src="${project.coverImage}" alt="${project.title}" />`;
  } else {
    cover.style.background = `linear-gradient(160deg, ${project.accent}, #ffffff)`;
    cover.classList.add("project-detail-cover-fallback");
  }

  gallery.innerHTML = "";
  if (project.gallery.length > 0) {
    project.gallery.forEach((image) => {
      gallery.appendChild(createGalleryItem(image, project.title));
    });
  } else if (project.coverImage) {
    gallery.appendChild(createGalleryItem(project.coverImage, project.title));
  } else {
    gallery.appendChild(createGalleryItem("", project.title));
  }

  revealElements();
  applyLanguage(currentLanguage);
}

init().catch(() => {
  const title = document.getElementById("detail-title");
  const description = document.getElementById("detail-description");
  title.textContent = currentLanguage === "es" ? "No se pudo cargar el proyecto" : "The project could not be loaded";
  description.textContent =
    currentLanguage === "es"
      ? "Revisa que projects.json exista y que el proyecto tenga datos validos."
      : "Check that projects.json exists and that the project has valid data.";
  applyLanguage(currentLanguage);
});
