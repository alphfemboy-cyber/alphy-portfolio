const PROJECTS_FILE = "./projects.json";
const STORAGE_KEY = "alphy-portfolio-projects-draft";

function normalizeProjects(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id: item.id || `project-${index + 1}`,
    title: item.title || "Proyecto sin nombre",
    description: item.description || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
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
    article.textContent = "Agrega imagenes para mostrar el proyecto aqui.";
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
  const tags = document.getElementById("detail-tags");
  const cover = document.getElementById("detail-cover");
  const link = document.getElementById("detail-link");
  const gallery = document.getElementById("detail-gallery");

  document.title = `${project.title} | Alphy`;
  title.textContent = project.title;
  description.textContent = project.description;
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
}

init().catch(() => {
  const title = document.getElementById("detail-title");
  const description = document.getElementById("detail-description");
  title.textContent = "No se pudo cargar el proyecto";
  description.textContent =
    "Revisa que projects.json exista y que el proyecto tenga datos validos.";
});
