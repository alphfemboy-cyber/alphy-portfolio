const STORAGE_KEY = "alphy-portfolio-projects-draft";
const PROJECTS_FILE = "./projects.json";

const fallbackProjects = [
  {
    id: "dream-room-asset-pack",
    title: "Dream Room Asset Pack",
    description:
      "Coleccion de props estilizados para una habitacion con enfoque en silueta limpia, color suave y optimizacion para tiempo real.",
    tags: ["Blender", "Stylized", "Game Ready"],
    link: "https://example.com/project/dream-room",
    accent: "#f7cade",
    coverImage: "",
    gallery: [],
  },
  {
    id: "celestial-character-props",
    title: "Celestial Character Props",
    description:
      "Set de accesorios y piezas de vestuario con detalle ornamental, materiales suaves y lectura clara para escenas cercanas.",
    tags: ["3D Modeling", "Texturing", "Realtime"],
    link: "https://example.com/project/celestial-props",
    accent: "#f2c8da",
    coverImage: "",
    gallery: [],
  },
  {
    id: "soft-market-environment",
    title: "Soft Market Environment",
    description:
      "Exploracion visual de assets modulares para un entorno pequeno, pensados para variedad, rendimiento y coherencia de estilo.",
    tags: ["Environment", "Modular", "Lookdev"],
    link: "https://example.com/project/soft-market",
    accent: "#f9e4ee",
    coverImage: "",
    gallery: [],
  },
];

const elements = {
  body: document.body,
  projectsGrid: document.getElementById("projects-grid"),
  projectList: document.getElementById("project-list"),
  drawer: document.getElementById("editor-drawer"),
  form: document.getElementById("project-form"),
  resetForm: document.getElementById("reset-form"),
  exportButton: document.getElementById("export-projects"),
  importInput: document.getElementById("import-projects"),
  resetProjects: document.getElementById("reset-projects"),
  openButtons: document.querySelectorAll("[data-open-editor]"),
  closeButtons: document.querySelectorAll("[data-close-editor]"),
  cardTemplate: document.getElementById("project-card-template"),
  itemTemplate: document.getElementById("project-item-template"),
  projectId: document.getElementById("project-id"),
  projectTitle: document.getElementById("project-title"),
  projectDescription: document.getElementById("project-description"),
  projectTags: document.getElementById("project-tags"),
  projectLink: document.getElementById("project-link"),
  projectCoverImage: document.getElementById("project-cover-image"),
  projectGallery: document.getElementById("project-gallery"),
  projectAccent: document.getElementById("project-accent"),
};

let projects = [];

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

function loadDraftProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    return normalizeProjects(JSON.parse(saved));
  } catch {
    return null;
  }
}

async function loadProjects() {
  const draftProjects = loadDraftProjects();
  if (draftProjects && draftProjects.length > 0) {
    return draftProjects;
  }

  try {
    const response = await fetch(PROJECTS_FILE, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("No se pudo cargar projects.json");
    }

    const parsed = await response.json();
    const normalized = normalizeProjects(parsed);
    return normalized.length > 0 ? normalized : [...fallbackProjects];
  } catch {
    return [...fallbackProjects];
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  elements.projectsGrid.innerHTML = "";
  elements.projectList.innerHTML = "";

  projects.forEach((project) => {
    const cardNode = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const visual = cardNode.querySelector(".project-visual");
    const title = cardNode.querySelector("h3");
    const description = cardNode.querySelector(".project-description");
    const tags = cardNode.querySelector(".project-tags");
    const openLinks = cardNode.querySelectorAll(".project-open");
    const externalLink = cardNode.querySelector(".project-external");

    if (project.coverImage) {
      visual.style.backgroundImage = `linear-gradient(rgba(255, 236, 243, 0.15), rgba(255, 236, 243, 0.15)), url("${project.coverImage}")`;
      visual.style.backgroundSize = "cover";
      visual.style.backgroundPosition = "center";
    } else {
      visual.style.background = `linear-gradient(160deg, ${project.accent || "#f7cade"}, #ffffff)`;
    }
    title.textContent = project.title;
    description.textContent = project.description;
    tags.innerHTML = "";

    (project.tags || []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      tags.appendChild(chip);
    });

    openLinks.forEach((link) => {
      link.href = `./project.html?id=${encodeURIComponent(project.id)}`;
    });

    if (project.link) {
      externalLink.href = project.link;
      externalLink.hidden = false;
    } else {
      externalLink.hidden = true;
    }

    elements.projectsGrid.appendChild(cardNode);

    const itemNode = elements.itemTemplate.content.firstElementChild.cloneNode(true);
    itemNode.querySelector(".item-title").textContent = project.title;
    itemNode.querySelector(".item-description").textContent = project.description;
    itemNode.querySelector(".item-edit").addEventListener("click", () => fillForm(project.id));
    itemNode.querySelector(".item-delete").addEventListener("click", () => deleteProject(project.id));
    elements.projectList.appendChild(itemNode);
  });

  revealElements();
}

function fillForm(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return;
  }

  elements.projectId.value = project.id;
  elements.projectTitle.value = project.title;
  elements.projectDescription.value = project.description;
  elements.projectTags.value = (project.tags || []).join(", ");
  elements.projectLink.value = project.link || "";
  elements.projectCoverImage.value = project.coverImage || "";
  elements.projectGallery.value = (project.gallery || []).join("\n");
  elements.projectAccent.value = project.accent || "";
  openEditor();
}

function resetForm() {
  elements.form.reset();
  elements.projectId.value = "";
}

function deleteProject(projectId) {
  projects = projects.filter((item) => item.id !== projectId);
  saveProjects();
  renderProjects();
  resetForm();
}

function handleSubmit(event) {
  event.preventDefault();

  const payload = {
    id: elements.projectId.value || crypto.randomUUID(),
    title: elements.projectTitle.value.trim(),
    description: elements.projectDescription.value.trim(),
    tags: elements.projectTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    link: elements.projectLink.value.trim(),
    coverImage: elements.projectCoverImage.value.trim(),
    gallery: elements.projectGallery.value
      .split("\n")
      .map((image) => image.trim())
      .filter(Boolean),
    accent: elements.projectAccent.value.trim() || "#f7cade",
  };

  const index = projects.findIndex((item) => item.id === payload.id);
  if (index >= 0) {
    projects[index] = payload;
  } else {
    projects.unshift(payload);
  }

  saveProjects();
  renderProjects();
  resetForm();
}

function exportProjects() {
  const blob = new Blob([JSON.stringify(projects, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "alphy-projects.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function importProjects(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed)) {
        return;
      }
      projects = parsed.map((item) => ({
        id: item.id || crypto.randomUUID(),
        title: item.title || "Proyecto sin nombre",
        description: item.description || "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        link: item.link || "",
        coverImage: item.coverImage || "",
        gallery: Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : [],
        accent: item.accent || "#f7cade",
      }));
      saveProjects();
      renderProjects();
      resetForm();
    } catch {
      window.alert("No se pudo importar el archivo JSON.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function restoreDefaults() {
  projects = [...fallbackProjects];
  saveProjects();
  renderProjects();
  resetForm();
}

function openEditor() {
  elements.drawer.classList.add("is-open");
  elements.drawer.setAttribute("aria-hidden", "false");
  elements.body.classList.add("editor-open");
}

function closeEditor() {
  elements.drawer.classList.remove("is-open");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.body.classList.remove("editor-open");
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

  items.forEach((item) => {
    if (!item.classList.contains("is-visible")) {
      observer.observe(item);
    }
  });
}

elements.form.addEventListener("submit", handleSubmit);
elements.resetForm.addEventListener("click", resetForm);
elements.exportButton.addEventListener("click", exportProjects);
elements.importInput.addEventListener("change", importProjects);
elements.resetProjects.addEventListener("click", restoreDefaults);

elements.openButtons.forEach((button) => {
  button.addEventListener("click", openEditor);
});

elements.closeButtons.forEach((button) => {
  button.addEventListener("click", closeEditor);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEditor();
  }
});

async function init() {
  projects = await loadProjects();
  renderProjects();
}

init();
