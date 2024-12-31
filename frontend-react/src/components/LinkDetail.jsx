import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";

function LinkDetail() {
  const { id } = useParams();
  const [link, setLink] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLinkAndComments();
  }, [id]);

  const loadLinkAndComments = async () => {
    try {
      setLoading(true);
      const [linkResponse, commentsResponse] = await Promise.all([
        api.getLink(id),
        api.getComments(id),
      ]);
      setLink(linkResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      setError("Error loading link details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (value) => {
    try {
      const response = await api.voteLink(id, value);
      setLink(response.data);
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error voting");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.createComment({
        linkId: id,
        content: newComment,
      });
      setNewComment("");
      const commentsResponse = await api.getComments(id);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Error posting comment");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!link) return <div className="error">Link not found</div>;

  return (
    <div className="container">
      <div className="text-center mb-20">
        <Link to="/">
          <button>Back to List</button>
        </Link>
      </div>

      <div className="link-card">
        <h2>{link.title}</h2>
        <p>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.url}
          </a>
        </p>
        <p className="description">{link.description}</p>
        <div className="tags">
          {link.tags?.map((tag) => (
            <span key={tag} className="tag-filter">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="votes">
        <h3>Votes: {link.votes}</h3>
        <div className="vote-buttons">
          <button onClick={() => handleVote(1)}>👍 Upvote</button>
          <button onClick={() => handleVote(-1)} className="delete">
            👎 Downvote
          </button>
        </div>
      </div>

      <div className="comments">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              placeholder="Write your comment here..."
              required
            />
          </div>
          <div className="text-center">
            <button type="submit">Add Comment</button>
          </div>
        </form>

        <div className="comments-list mt-20">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LinkDetail;
