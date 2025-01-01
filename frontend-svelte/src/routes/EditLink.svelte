<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { api } from '../lib/api';

  export let id; // Accept id as a prop
  
  let formData = {
    title: '',
    url: '',
    description: '',
    tags: ''
  };
  let loading = true;
  let error = null;

  const loadLink = async () => {
    try {
      loading = true;
      const response = await api.getLink(id);
      const link = response.data;
      formData = {
        title: link.title,
        url: link.url,
        description: link.description || '',
        tags: link.tags ? link.tags.join(', ') : ''
      };
    } catch (err) {
      error = 'Error loading link';
      console.error('Error:', err);
    } finally {
      loading = false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateLink(id, {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
      });
      window.location.href = '/';
    } catch (err) {
      console.error('Error updating link:', err);
      alert('Error updating link');
    }
  };

  onMount(() => {
    if (id) {
      loadLink();
    }
  });
</script>

<div class="container">
  <h1>Edit Link</h1>
  {#if loading}
    <div class="loading">Loading...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <form on:submit={handleSubmit}>
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          type="text"
          id="title"
          bind:value={formData.title}
          required
        />
      </div>

      <div class="form-group">
        <label for="url">URL:</label>
        <input
          type="url"
          id="url"
          bind:value={formData.url}
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          id="description"
          rows="4"
          bind:value={formData.description}
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          bind:value={formData.tags}
        />
      </div>

      <div class="form-group text-center">
        <button type="submit" class="mb-20">Update Link</button>
        <Link to="/">
          <button type="button" class="delete">Cancel</button>
        </Link>
      </div>
    </form>
  {/if}
</div> 