const STORAGE_KEY = "alphy-portfolio-projects-draft";
const PROJECTS_FILE = "./projects.json";
const LANGUAGE_KEY = "alphy-portfolio-language";
const EDITOR_PASSWORD = "alphy-admin";
const translations = {
  es: {
    "nav.projects": "Proyectos",
    "nav.about": "Sobre mi",
    "nav.contact": "Contacto",
    "hero.eyebrow": "3D Artist / Modelado y Texturizado",
    "hero.description": "Artista 3D especializado en modelado y texturizado de assets digitales, con enfoque en calidad visual, estilo y optimizacion para tiempo real.",
    "hero.cta": "Ver proyectos",
    "hero.noteTop": "Coquette digital mood",
    "hero.noteBottom": "Soft romantic portfolio",
    "highlight.oneTitle": "Assets con estilo",
    "highlight.oneBody": "Piezas pensadas para verse bien de cerca y funcionar bien en escenas de tiempo real.",
    "highlight.twoTitle": "Texturas cuidadas",
    "highlight.twoBody": "Materiales con identidad visual clara, detalle y equilibrio entre forma y lectura.",
    "highlight.threeTitle": "Flujo flexible",
    "highlight.threeBody": "Portfolio preparado para seguir creciendo con nuevos proyectos y versiones.",
    "projects.eyebrow": "Selected Work",
    "projects.title": "Proyectos",
    "projects.body": "Esta seccion se actualiza desde el editor integrado. Puedes agregar, editar o borrar proyectos cuando quieras.",
    "about.eyebrow": "Sobre mi",
    "about.title": "Modelado con sensibilidad visual",
    "about.bodyOne": "Me enfoco en crear assets digitales con personalidad, cuidando la silueta, los materiales y la lectura final de cada pieza. Busco un balance entre estilo, detalle y optimizacion para que cada modelo conserve su impacto visual tambien en tiempo real.",
    "about.bodyTwo": "Mi trabajo mezcla una direccion artistica suave con decisiones tecnicas pensadas para produccion, presentacion y uso interactivo.",
    "contact.eyebrow": "Contacto",
    "contact.title": "Hablemos de tu proximo proyecto",
    "contact.note": "Espanol principal, ingles basico para comunicacion simple.",
    "contact.manage": "Gestion",
    "editor.eyebrow": "Project Editor",
    "editor.title": "Editar proyectos",
    "editor.close": "Cerrar",
    "editor.name": "Nombre",
    "editor.description": "Descripcion",
    "editor.tags": "Tags",
    "editor.category": "Categoria",
    "editor.link": "Link",
    "editor.cover": "Imagen principal",
    "editor.gallery": "Galeria de imagenes",
    "editor.accent": "Color de tarjeta",
    "editor.save": "Guardar",
    "editor.new": "Nuevo",
    "editor.export": "Exportar JSON",
    "editor.import": "Importar JSON",
    "editor.reset": "Restaurar ejemplo",
    "editor.note": "El portfolio publico lee <code>projects.json</code>. Puedes editar aqui, exportar el JSON y luego reemplazar ese archivo en GitHub para publicar los cambios."
  },
  en: {
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "hero.eyebrow": "3D Artist / Modeling & Texturing",
    "hero.description": "3D artist specialized in modeling and texturing digital assets, with a focus on visual quality, style, and real-time optimization.",
    "hero.cta": "View projects",
    "hero.noteTop": "Coquette digital mood",
    "hero.noteBottom": "Soft romantic portfolio",
    "highlight.oneTitle": "Stylish assets",
    "highlight.oneBody": "Pieces designed to look great up close and perform well in real-time scenes.",
    "highlight.twoTitle": "Careful texturing",
    "highlight.twoBody": "Materials with clear visual identity, detail, and balance between form and readability.",
    "highlight.threeTitle": "Flexible workflow",
    "highlight.threeBody": "A portfolio prepared to keep growing with new projects and versions.",
    "projects.eyebrow": "Selected Work",
    "projects.title": "Projects",
    "projects.body": "This section updates from the integrated editor. You can add, edit, or remove projects whenever you want.",
    "about.eyebrow": "About",
    "about.title": "Modeling with visual sensitivity",
    "about.bodyOne": "I focus on creating digital assets with personality, taking care of silhouette, materials, and the final readability of each piece. I look for a balance between style, detail, and optimization so every model keeps its visual impact in real-time use.",
    "about.bodyTwo": "My work blends a soft art direction with technical decisions made for production, presentation, and interactive use.",
    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk about your next project",
    "contact.note": "Spanish first, basic English for simple communication.",
    "contact.manage": "Manage",
    "editor.eyebrow": "Project Editor",
    "editor.title": "Edit projects",
    "editor.close": "Close",
    "editor.name": "Name",
    "editor.description": "Description",
    "editor.tags": "Tags",
    "editor.category": "Category",
    "editor.link": "Link",
    "editor.cover": "Cover image",
    "editor.gallery": "Image gallery",
    "editor.accent": "Card color",
    "editor.save": "Save",
    "editor.new": "New",
    "editor.export": "Export JSON",
    "editor.import": "Import JSON",
    "editor.reset": "Restore sample",
    "editor.note": "The public portfolio reads <code>projects.json</code>. You can edit here, export the JSON, and then replace that file on GitHub to publish your changes."
  }
};

const fallbackProjects = [];

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
  projectCategory: document.getElementById("project-category"),
  projectLink: document.getElementById("project-link"),
  projectCoverImage: document.getElementById("project-cover-image"),
  projectGallery: document.getElementById("project-gallery"),
  projectAccent: document.getElementById("project-accent"),
  langToggle: document.getElementById("lang-toggle"),
  adminAccess: document.getElementById("admin-access"),
};

let projects = [];
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "en";

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

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "es";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = translations[currentLanguage][node.dataset.i18n];
    if (typeof value === "string") {
      if (value.includes("<code>")) {
        node.innerHTML = value;
      } else {
        node.textContent = value;
      }
    }
  });

  elements.langToggle?.querySelectorAll("[data-lang-option]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.langOption === currentLanguage);
  });

  document.querySelectorAll(".project-open").forEach((link) => {
    if (link.classList.contains("project-link")) {
      link.textContent = currentLanguage === "es" ? "Abrir proyecto" : "Open project";
    }
  });

  document.querySelectorAll(".project-external").forEach((link) => {
    link.textContent = currentLanguage === "es" ? "Link externo" : "External link";
  });

  document.querySelectorAll(".project-toggle").forEach((button) => {
    if (button.hidden) {
      return;
    }
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.textContent = expanded
      ? currentLanguage === "es" ? "Ver menos" : "Show less"
      : currentLanguage === "es" ? "Ver mas" : "Show more";
  });

  document.querySelectorAll(".item-up").forEach((button) => {
    button.textContent = currentLanguage === "es" ? "Subir" : "Up";
  });
  document.querySelectorAll(".item-down").forEach((button) => {
    button.textContent = currentLanguage === "es" ? "Bajar" : "Down";
  });
  document.querySelectorAll(".item-edit").forEach((button) => {
    button.textContent = currentLanguage === "es" ? "Editar" : "Edit";
  });
  document.querySelectorAll(".item-delete").forEach((button) => {
    button.textContent = currentLanguage === "es" ? "Borrar" : "Delete";
  });

  if (elements.adminAccess) {
    elements.adminAccess.textContent = currentLanguage === "es" ? "Gestion" : "Manage";
  }
}

function renderProjects() {
  elements.projectsGrid.innerHTML = "";
  elements.projectList.innerHTML = "";

  if (projects.length === 0) {
    elements.projectsGrid.innerHTML = `
      <article class="project-empty reveal is-visible">
        <p class="eyebrow">No hay proyectos aun</p>
        <h3>Agrega tu primer proyecto desde el editor</h3>
        <p>
          Usa el boton "Editar proyectos" para crear una ficha con descripcion,
          portada, galeria e links.
        </p>
      </article>
    `;
    elements.projectList.innerHTML = `
      <article class="project-item">
        <div>
          <strong class="item-title">Sin proyectos cargados</strong>
          <p class="item-description">
            Crea tu primer proyecto y luego exporta el JSON para publicarlo.
          </p>
        </div>
      </article>
    `;
    return;
  }

  projects.forEach((project) => {
    const cardNode = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const visual = cardNode.querySelector(".project-visual");
    const title = cardNode.querySelector("h3");
    const description = cardNode.querySelector(".project-description");
    const descriptionToggle = cardNode.querySelector(".project-toggle");
    const badge = cardNode.querySelector(".project-badge");
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
    badge.textContent = project.category || "Proyecto";
    description.textContent = project.description;
    description.classList.toggle("is-collapsed", project.description.length > 180);
    descriptionToggle.hidden = project.description.length <= 180;
    descriptionToggle.textContent = currentLanguage === "es" ? "Ver mas" : "Show more";
    descriptionToggle.setAttribute("aria-expanded", "false");
    descriptionToggle.addEventListener("click", () => {
      const isCollapsed = description.classList.toggle("is-collapsed");
      descriptionToggle.textContent = isCollapsed
        ? currentLanguage === "es" ? "Ver mas" : "Show more"
        : currentLanguage === "es" ? "Ver menos" : "Show less";
      descriptionToggle.setAttribute("aria-expanded", String(!isCollapsed));
    });
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
    const upButton = itemNode.querySelector(".item-up");
    const downButton = itemNode.querySelector(".item-down");
    const editButton = itemNode.querySelector(".item-edit");
    const deleteButton = itemNode.querySelector(".item-delete");
    upButton.textContent = currentLanguage === "es" ? "Subir" : "Up";
    downButton.textContent = currentLanguage === "es" ? "Bajar" : "Down";
    editButton.textContent = currentLanguage === "es" ? "Editar" : "Edit";
    deleteButton.textContent = currentLanguage === "es" ? "Borrar" : "Delete";
    upButton.addEventListener("click", () => moveProject(project.id, -1));
    downButton.addEventListener("click", () => moveProject(project.id, 1));
    editButton.addEventListener("click", () => fillForm(project.id));
    deleteButton.addEventListener("click", () => deleteProject(project.id));
    elements.projectList.appendChild(itemNode);
  });

  revealElements();
  applyLanguage(currentLanguage);
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
  elements.projectCategory.value = project.category || "";
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

function moveProject(projectId, direction) {
  const index = projects.findIndex((item) => item.id === projectId);
  if (index < 0) {
    return;
  }

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= projects.length) {
    return;
  }

  const [project] = projects.splice(index, 1);
  projects.splice(nextIndex, 0, project);
  saveProjects();
  renderProjects();
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
    category: elements.projectCategory.value.trim() || "Proyecto",
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
        category: item.category || "Proyecto",
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

function requestEditorAccess() {
  const promptText = currentLanguage === "es"
    ? "Contrasena del editor:"
    : "Editor password:";
  const value = window.prompt(promptText, "");
  if (value === EDITOR_PASSWORD) {
    openEditor();
    return;
  }

  if (value !== null && value !== "") {
    window.alert(currentLanguage === "es" ? "Contrasena incorrecta." : "Incorrect password.");
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

elements.closeButtons.forEach((button) => {
  button.addEventListener("click", closeEditor);
});

elements.langToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "es" ? "en" : "es");
});

elements.adminAccess?.addEventListener("click", requestEditorAccess);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEditor();
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "e") {
    requestEditorAccess();
  }
});

async function init() {
  projects = await loadProjects();
  renderProjects();
  applyLanguage(currentLanguage);
}

init();
