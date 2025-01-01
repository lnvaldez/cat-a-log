<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { api } from '../lib/api';

  export let id; // Accept id as a prop
  
  let link = null;
  let comments = [];
  let newComment = '';
  let loading = true;
  let error = null;

  const loadLinkAndComments = async () => {
    try {
      loading = true;
      const [linkResponse, commentsResponse] = await Promise.all([
        api.getLink(id),
        api.getComments(id)
      ]);
      link = linkResponse.data;
      comments = commentsResponse.data;
    } catch (err) {
      error = 'Error loading link details';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  };

  const handleVote = async (value) => {
    try {
      const response = await api.voteLink(id, value);
      link = response.data;
    } catch (err) {
      console.error('Error voting:', err);
      alert('Error voting');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.createComment({
        linkId: id,
        content: newComment
      });
      newComment = '';
      const commentsResponse = await api.getComments(id);
      comments = commentsResponse.data;
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment');
    }
  };

  onMount(() => {
    if (id) {
      loadLinkAndComments();
    }
  });
</script>

<div class="container">
  <div class="text-center mb-20">
    <Link to="/">
      <button>Back to List</button>
    </Link>
  </div>

  {#if loading}
    <div class="loading">Loading...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if link}
    <div class="link-card">
      <h2>{link.title}</h2>
      <p>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {link.url}
        </a>
      </p>
      <p class="description">{link.description}</p>
      <div class="tags">
        {#each link.tags || [] as tag}
          <span class="tag-filter">{tag}</span>
        {/each}
      </div>
    </div>

    <div class="votes">
      <h3>Votes: {link.votes}</h3>
      <div class="vote-buttons">
        <button on:click={() => handleVote(1)}>👍 Upvote</button>
        <button class="delete" on:click={() => handleVote(-1)}>
          👎 Downvote
        </button>
      </div>
    </div>

    <div class="comments">
      <h3>Comments</h3>
      <form on:submit={handleCommentSubmit} class="comment-form">
        <div class="form-group">
          <textarea
            bind:value={newComment}
            rows="4"
            placeholder="Write your comment here..."
            required
          ></textarea>
        </div>
        <div class="text-center">
          <button type="submit">Add Comment</button>
        </div>
      </form>

      <div class="comments-list mt-20">
        {#each comments as comment}
          <div class="comment">
            <p>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div> 