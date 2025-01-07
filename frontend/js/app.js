const API_URL = "http://localhost:5000/api";

// Router
const router = {
  init() {
    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => this.handleRoute());
    // Handle initial page load
    this.handleRoute();
  },

  navigate(path, params = {}) {
    window.history.pushState(params, "", path);
    this.handleRoute();
  },

  handleRoute() {
    const path = window.location.pathname;
    const params = window.history.state || {};

    // Clear main content
    const app = document.getElementById("app");
    app.innerHTML = "";

    // Route to appropriate view
    if (path === "/" || path === "/index.html") {
      this.showHome();
    } else if (path === "/create") {
      this.showCreate();
    } else if (path.startsWith("/edit/")) {
      this.showEdit(params.id);
    } else if (path.startsWith("/view/")) {
      this.showView(params.id);
    }
  },

  showHome() {
    const template = document.getElementById("home-template");
    document.getElementById("app").innerHTML = template.innerHTML;
    loadLinks();
  },

  showCreate() {
    const template = document.getElementById("create-template");
    document.getElementById("app").innerHTML = template.innerHTML;
    setupCreateForm();
  },

  showEdit(id) {
    const template = document.getElementById("edit-template");
    document.getElementById("app").innerHTML = template.innerHTML;
    setupEditForm(id);
  },

  showView(id) {
    const template = document.getElementById("view-template");
    document.getElementById("app").innerHTML = template.innerHTML;
    setupViewPage(id);
  },
};

// State management
let allLinks = [];
let activeTags = new Set();

// Home page functionality
async function loadLinks() {
  try {
    const response = await fetch(`${API_URL}/links`);
    allLinks = await response.json();
    updateTagFilters();
    renderLinks();
  } catch (error) {
    console.error("Error:", error);
    document.getElementById(
      "links"
    ).innerHTML = `<p class="error">Error loading links: ${error.message}</p>`;
  }
}

function updateTagFilters() {
  const tags = new Set();
  allLinks.forEach((link) => {
    if (link.tags) {
      link.tags.forEach((tag) => tags.add(tag));
    }
  });

  document.getElementById("tagFilters").innerHTML = Array.from(tags)
    .sort()
    .map(
      (tag) => `
            <button 
                class="tag-filter ${activeTags.has(tag) ? "active" : ""}"
                onclick="toggleTag('${tag}')"
            >
                ${tag}
            </button>
        `
    )
    .join("");
}

function toggleTag(tag) {
  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
  }
  renderLinks();
  updateTagFilters();
}

function clearFilters() {
  activeTags.clear();
  renderLinks();
  updateTagFilters();
}

function renderLinks() {
  const filteredLinks = allLinks.filter(
    (link) =>
      activeTags.size === 0 ||
      Array.from(activeTags).every((tag) => link.tags?.includes(tag))
  );

  document.getElementById("links").innerHTML = filteredLinks
    .map(
      (link) => `
            <div class="link-card">
                <h2>${link.title}</h2>
                <p><a href="${link.url}" target="_blank">${link.url}</a></p>
                <p>${link.description || ""}</p>
                <div class="tags">
                    ${
                      link.tags
                        ? link.tags
                            .map((tag) => `<span class="tag">${tag}</span>`)
                            .join("")
                        : ""
                    }
                </div>
                <div class="votes">
                    <span>Votes: ${link.votes || 0}</span>
                </div>
                <div class="actions">
                    <button onclick="router.navigate('/view/${
                      link._id
                    }', {id: '${link._id}'})">
                        View
                    </button>
                    <button onclick="router.navigate('/edit/${
                      link._id
                    }', {id: '${link._id}'})">
                        Edit
                    </button>
                    <button onclick="deleteLink('${link._id}')" class="delete">
                        Delete
                    </button>
                </div>
            </div>
        `
    )
    .join("");
}

// Create functionality
function setupCreateForm() {
  document
    .getElementById("createLinkForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        title: document.getElementById("title").value,
        url: document.getElementById("url").value,
        description: document.getElementById("description").value,
        tags: document
          .getElementById("tags")
          .value.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      try {
        const response = await fetch(`${API_URL}/links`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          router.navigate("/");
        } else {
          throw new Error("Failed to create link");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error creating link");
      }
    });
}

// Edit functionality
async function setupEditForm(id) {
  try {
    const response = await fetch(`${API_URL}/links/${id}`);
    const link = await response.json();

    document.getElementById("editTitle").value = link.title;
    document.getElementById("editUrl").value = link.url;
    document.getElementById("editDescription").value = link.description || "";
    document.getElementById("editTags").value = link.tags
      ? link.tags.join(", ")
      : "";

    document
      .getElementById("editLinkForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
          title: document.getElementById("editTitle").value,
          url: document.getElementById("editUrl").value,
          description: document.getElementById("editDescription").value,
          tags: document
            .getElementById("editTags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        };

        try {
          const response = await fetch(`${API_URL}/links/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            router.navigate("/");
          } else {
            throw new Error("Failed to update link");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error updating link");
        }
      });
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading link");
  }
}

// View functionality
async function setupViewPage(id) {
  try {
    const response = await fetch(`${API_URL}/links/${id}`);
    const link = await response.json();

    document.getElementById("linkDetails").innerHTML = `
      <h2>${link.title}</h2>
      <p><a href="${link.url}" target="_blank">${link.url}</a></p>
      <p>${link.description || ""}</p>
      <div class="tags">
        ${
          link.tags
            ? link.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join(", ")
            : ""
        }
      </div>
    `;

    document.getElementById("voteCount").textContent = link.votes || 0;

    // Set up comment form
    document
      .getElementById("commentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleCommentSubmit(id);
      });

    loadComments(id);
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading link details");
  }
}

async function handleVote(value) {
  const id = window.history.state.id;
  try {
    const response = await fetch(`${API_URL}/links/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vote: value }),
    });

    if (response.ok) {
      const link = await response.json();
      document.getElementById("voteCount").textContent = link.votes;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error voting");
  }
}

async function deleteLink(id) {
  if (!confirm("Are you sure you want to delete this link?")) return;
  try {
    const response = await fetch(`${API_URL}/links/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await loadLinks();
    } else {
      alert("Failed to delete link");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error deleting link");
  }
}

async function loadComments(linkId) {
  try {
    const response = await fetch(`${API_URL}/comments/${linkId}`);
    const comments = await response.json();

    document.getElementById("commentsList").innerHTML = comments
      .map(
        (comment) => `
        <div class="comment">
          <p>${comment.content}</p>
          <small>${new Date(comment.createdAt).toLocaleString()}</small>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function handleCommentSubmit(linkId) {
  const content = document.getElementById("commentText").value;

  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        linkId,
        content,
      }),
    });

    if (response.ok) {
      document.getElementById("commentText").value = "";
      loadComments(linkId);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error posting comment");
  }
}

// Initialize the router
router.init();
