const STORAGE_KEY = "alphy-portfolio-projects";

const defaultProjects = [
  {
    id: crypto.randomUUID(),
    title: "Dream Room Asset Pack",
    description:
      "Coleccion de props estilizados para una habitacion con enfoque en silueta limpia, color suave y optimizacion para tiempo real.",
    tags: ["Blender", "Stylized", "Game Ready"],
    link: "https://example.com/project/dream-room",
    accent: "#f7d7e4",
  },
  {
    id: crypto.randomUUID(),
    title: "Celestial Character Props",
    description:
      "Set de accesorios y piezas de vestuario con detalle ornamental, materiales suaves y lectura clara para escenas cercanas.",
    tags: ["3D Modeling", "Texturing", "Realtime"],
    link: "https://example.com/project/celestial-props",
    accent: "#f2c8da",
  },
  {
    id: crypto.randomUUID(),
    title: "Soft Market Environment",
    description:
      "Exploracion visual de assets modulares para un entorno pequeno, pensados para variedad, rendimiento y coherencia de estilo.",
    tags: ["Environment", "Modular", "Lookdev"],
    link: "https://example.com/project/soft-market",
    accent: "#f9e4ee",
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
  projectAccent: document.getElementById("project-accent"),
};

let projects = loadProjects();

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [...defaultProjects];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [...defaultProjects];
    }
    return parsed;
  } catch {
    return [...defaultProjects];
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
    const link = cardNode.querySelector(".project-link");

    visual.style.background = `linear-gradient(160deg, ${project.accent || "#f7d7e4"}, #ffffff)`;
    title.textContent = project.title;
    description.textContent = project.description;
    tags.innerHTML = "";

    (project.tags || []).forEach((tag) => {
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
    accent: elements.projectAccent.value.trim() || "#f7d7e4",
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
        accent: item.accent || "#f7d7e4",
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
  projects = [...defaultProjects];
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

renderProjects();
