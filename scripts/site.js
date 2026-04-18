const dataUrl = "./content/site-data.json";

const elements = {
  title: document.querySelector("title"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroSummary: document.getElementById("hero-summary"),
  heroPanelText: document.getElementById("hero-panel-text"),
  heroTags: document.getElementById("hero-tags"),
  shortBio: document.getElementById("short-bio"),
  aboutBody: document.getElementById("about-body"),
  strengthList: document.getElementById("strength-list"),
  featuredProjectList: document.getElementById("featured-project-list"),
  additionalProjectList: document.getElementById("additional-project-list"),
  researchIntro: document.getElementById("research-intro"),
  researchThemeList: document.getElementById("research-theme-list"),
  researchEntryList: document.getElementById("research-entry-list"),
  linkList: document.getElementById("link-list"),
  footerNote: document.getElementById("footer-note"),
  loadStatus: document.getElementById("load-status")
};

init();

async function init() {
  setStatus("Loading content...");

  try {
    const response = await fetch(dataUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load content (${response.status})`);
    }

    const data = await response.json();
    renderSite(data);
    setStatus("Portfolio loaded.", true);
  } catch (error) {
    console.error(error);
    elements.heroSummary.textContent = "Portfolio content could not be loaded. Confirm that the site is being served over HTTP and that content/site-data.json is available.";
    setStatus("Content failed to load.", true);
  }
}

function renderSite(data) {
  if (data.site?.seoTitle) {
    elements.title.textContent = data.site.seoTitle;
  }

  elements.heroEyebrow.textContent = data.site.heroEyebrow;
  elements.heroTitle.textContent = data.site.brandName;
  elements.heroSummary.textContent = data.site.heroSummary;
  elements.heroPanelText.textContent = data.site.heroPanelText;
  elements.shortBio.textContent = data.site.shortBio;
  elements.footerNote.textContent = data.site.footerNote;
  elements.researchIntro.textContent = data.research.intro;

  renderTextList(elements.heroTags, data.site.heroTags);
  renderParagraphs(elements.aboutBody, data.site.aboutParagraphs);
  renderTextList(elements.strengthList, data.site.strengths);
  renderTextList(elements.researchThemeList, data.research.themes);

  const featuredProjects = data.projects.filter((project) => project.featured);
  const additionalProjects = data.projects.filter((project) => !project.featured);

  renderProjects(elements.featuredProjectList, featuredProjects, "featured");
  renderProjects(elements.additionalProjectList, additionalProjects, "compact");
  renderResearchEntries(elements.researchEntryList, data.research.entries, data.research.emptyState);
  renderLinks(elements.linkList, data.links);
}

function renderParagraphs(container, paragraphs) {
  container.replaceChildren();

  paragraphs.forEach((paragraph) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    container.append(node);
  });
}

function renderTextList(container, items) {
  container.replaceChildren();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.append(li);
  });
}

function renderProjects(container, projects, variant) {
  container.replaceChildren();

  projects.forEach((project) => {
    container.append(createProjectCard(project, variant));
  });
}

function createProjectCard(project, variant) {
  const card = document.createElement("article");
  card.className = "project-card";

  const media = document.createElement("div");
  media.className = "project-media";
  media.append(createProjectMedia(project));

  const body = document.createElement("div");
  body.className = "project-body";

  const titleRow = document.createElement("div");
  titleRow.className = "project-title-row";

  const title = document.createElement("h3");
  title.className = "project-title";
  title.textContent = project.title;

  const year = document.createElement("span");
  year.className = "project-year";
  year.textContent = project.year;

  titleRow.append(title, year);

  const pitch = document.createElement("p");
  pitch.className = "project-pitch";
  pitch.textContent = project.shortPitch;

  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = variant === "featured" ? project.description : project.longDescription;

  const meta = createChipList("project-meta", [project.status, project.role]);
  const techLabel = document.createElement("p");
  techLabel.className = "project-section-label";
  techLabel.textContent = "Tech / tools";

  const tech = createChipList("project-tech", project.techTools);
  const tags = createChipList("project-tags", project.tags);
  const links = createProjectLinks(project.links);

  body.append(titleRow, pitch, description, meta, techLabel, tech, tags, links);
  card.append(media, body);
  return card;
}

function createProjectMedia(project) {
  if (!project.image) {
    return createPlaceholder(project);
  }

  const image = document.createElement("img");
  image.className = "project-image";
  image.src = project.image;
  image.alt = `${project.title} artwork`;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.replaceWith(createPlaceholder(project));
  });

  return image;
}

function createPlaceholder(project) {
  const placeholder = document.createElement("div");
  placeholder.className = "project-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.textContent = getInitials(project.title);
  return placeholder;
}

function createChipList(className, items) {
  const list = document.createElement("ul");
  list.className = className;

  items.filter(Boolean).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });

  return list;
}

function createProjectLinks(links) {
  const wrapper = document.createElement("div");
  wrapper.className = "project-links";

  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "project-link";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer noopener";
    anchor.textContent = link.label;
    wrapper.append(anchor);
  });

  return wrapper;
}

function renderResearchEntries(container, entries, emptyState) {
  container.replaceChildren();

  if (!entries.length) {
    const block = document.createElement("div");
    block.className = "empty-state";

    const title = document.createElement("p");
    title.className = "empty-state-title";
    title.textContent = emptyState.title;

    const body = document.createElement("p");
    body.textContent = emptyState.body;

    block.append(title, body);
    container.append(block);
    return;
  }

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "research-entry";

    const title = document.createElement("h3");
    title.textContent = entry.title;

    const description = document.createElement("p");
    description.textContent = entry.description;

    article.append(title, description);

    if (entry.link) {
      const link = document.createElement("a");
      link.className = "project-link";
      link.href = entry.link.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = entry.link.label;
      article.append(link);
    }

    container.append(article);
  });
}

function renderLinks(container, links) {
  container.replaceChildren();

  links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.className = "link-card";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer noopener";

    const title = document.createElement("h3");
    title.textContent = link.label;

    const description = document.createElement("p");
    description.textContent = link.description;

    anchor.append(title, description);
    container.append(anchor);
  });
}

function getInitials(title) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function setStatus(message, hideLater = false) {
  elements.loadStatus.textContent = message;
  elements.loadStatus.classList.add("is-visible");

  if (hideLater) {
    window.setTimeout(() => {
      elements.loadStatus.classList.remove("is-visible");
    }, 1800);
  }
}
