import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function LinkList() {
  const [links, setLinks] = useState([]);
  const [activeTags, setActiveTags] = useState(new Set());
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLinks();
      setLinks(response.data);
      updateTags(response.data);
    } catch (error) {
      setError("Error loading links");
      console.error("Error loading links:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTags = (links) => {
    const tagSet = new Set();
    links.forEach((link) => {
      if (link.tags) {
        link.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    setAllTags(Array.from(tagSet).sort());
  };

  const toggleTag = (tag) => {
    const newTags = new Set(activeTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setActiveTags(newTags);
  };

  const filteredLinks = links.filter((link) => {
    if (activeTags.size === 0) return true;
    return (
      link.tags &&
      Array.from(activeTags).every((tag) => link.tags.includes(tag))
    );
  });

  const deleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await api.deleteLink(id);
      loadLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Error deleting link");
    }
  };

  if (loading) return <div className="loading">Loading links...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Link Library</h1>
      <div className="text-center mb-20">
        <Link to="/create">
          <button>Create New Link</button>
        </Link>
      </div>

      <div className="filter-section">
        <h3>Filter by Tags:</h3>
        <div className="tag-filters">
          {allTags.map((tag) => (
            <span
              key={tag}
              className={`tag-filter ${activeTags.has(tag) ? "active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        {activeTags.size > 0 && (
          <button onClick={() => setActiveTags(new Set())}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="links">
        {filteredLinks.length === 0 ? (
          <p className="text-center">No links available.</p>
        ) : (
          filteredLinks.map((link) => (
            <div key={link._id} className="link-card">
              <h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </h3>
              <div className="tags">
                {link.tags?.map((tag) => (
                  <span key={tag} className="tag-filter">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="description">{link.description}</p>
              <div className="actions">
                <Link to={`/link/${link._id}`}>
                  <button>View</button>
                </Link>
                <Link to={`/edit/${link._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteLink(link._id)} className="delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LinkList;
