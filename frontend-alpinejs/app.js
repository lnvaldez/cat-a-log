document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    currentView: "list",
    links: [],
    currentLink: null,
    comments: [],
    newComment: "",
    activeTags: [],
    allTags: [],
    formData: {
      title: "",
      url: "",
      description: "",
      tags: "",
    },
    currentId: null,

    init() {
      this.loadLinks();
    },

    async loadLinks() {
      try {
        const response = await axios.get("http://localhost:5000/api/links");
        this.links = response.data;
        this.updateTags();
      } catch (err) {
        console.error("Error loading links:", err);
        alert("Error loading links");
      }
    },

    updateTags() {
      const tagSet = new Set();
      this.links.forEach((link) => {
        if (link.tags) {
          link.tags.forEach((tag) => tagSet.add(tag));
        }
      });
      this.allTags = Array.from(tagSet).sort();
    },

    toggleTag(tag) {
      const index = this.activeTags.indexOf(tag);
      if (index === -1) {
        this.activeTags.push(tag);
      } else {
        this.activeTags.splice(index, 1);
      }
    },

    clearTags() {
      this.activeTags = [];
    },

    get filteredLinks() {
      return this.links.filter((link) => {
        if (this.activeTags.length === 0) return true;
        return this.activeTags.every(
          (tag) => link.tags && link.tags.includes(tag)
        );
      });
    },

    async viewLink(id) {
      try {
        const [linkResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/links/${id}`),
          axios.get(`http://localhost:5000/api/comments/${id}`),
        ]);
        this.currentLink = linkResponse.data;
        this.comments = commentsResponse.data;
        this.currentView = "detail";
      } catch (err) {
        console.error("Error loading link details:", err);
        alert("Error loading link details");
      }
    },

    async vote(value) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/links/${this.currentLink._id}/vote`,
          { vote: value }
        );
        this.currentLink = response.data;
      } catch (err) {
        console.error("Error voting:", err);
        alert("Error voting");
      }
    },

    async addComment() {
      if (!this.newComment.trim()) return;

      try {
        await axios.post("http://localhost:5000/api/comments", {
          linkId: this.currentLink._id,
          content: this.newComment,
        });
        const response = await axios.get(
          `http://localhost:5000/api/comments/${this.currentLink._id}`
        );
        this.comments = response.data;
        this.newComment = "";
      } catch (err) {
        console.error("Error adding comment:", err);
        alert("Error adding comment");
      }
    },

    editLink(id) {
      const link = this.links.find((l) => l._id === id);
      if (link) {
        this.formData = {
          title: link.title,
          url: link.url,
          description: link.description || "",
          tags: link.tags ? link.tags.join(", ") : "",
        };
        this.currentId = id;
        this.currentView = "edit";
      }
    },

    async deleteLink(id) {
      if (!confirm("Are you sure you want to delete this link?")) return;

      try {
        await axios.delete(`http://localhost:5000/api/links/${id}`);
        await this.loadLinks();
      } catch (err) {
        console.error("Error deleting link:", err);
        alert("Error deleting link");
      }
    },

    async submitLink(e) {
      e.preventDefault();
      const formData = {
        ...this.formData,
        tags: this.formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      try {
        if (this.currentView === "create") {
          await axios.post("http://localhost:5000/api/links", formData);
        } else {
          await axios.put(
            `http://localhost:5000/api/links/${this.currentId}`,
            formData
          );
        }
        this.formData = { title: "", url: "", description: "", tags: "" };
        this.currentId = null;
        this.currentView = "list";
        await this.loadLinks();
      } catch (err) {
        console.error("Error submitting link:", err);
        alert("Error submitting link");
      }
    },
  }));
});
