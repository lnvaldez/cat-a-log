<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { api } from '../lib/api';

  let links = [];
  let activeTags = new Set();
  let allTags = [];
  let loading = true;
  let error = null;

  const loadLinks = async () => {
    try {
      loading = true;
      const response = await api.getAllLinks();
      links = response.data;
      updateTags(response.data);
    } catch (err) {
      error = 'Error loading links';
      console.error('Error loading links:', err);
    } finally {
      loading = false;
    }
  };

  const updateTags = (links) => {
    const tagSet = new Set();
    links.forEach(link => {
      if (link.tags) {
        link.tags.forEach(tag => tagSet.add(tag));
      }
    });
    allTags = Array.from(tagSet).sort();
  };

  const toggleTag = (tag) => {
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
    } else {
      activeTags.add(tag);
    }
    activeTags = activeTags; // Trigger reactivity
  };

  const clearTags = () => {
    activeTags = new Set();
  };

  $: filteredLinks = links.filter(link => {
    if (activeTags.size === 0) return true;
    return link.tags && Array.from(activeTags).every(tag => link.tags.includes(tag));
  });

  const deleteLink = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    try {
      await api.deleteLink(id);
      await loadLinks();
    } catch (err) {
      console.error('Error deleting link:', err);
      alert('Error deleting link');
    }
  };

  onMount(() => {
    loadLinks();
  });
</script>

<div class="container">
  <h1>Link Library</h1>
  <div class="text-center mb-20">
    <Link to="/create">
      <button>Create New Link</button>
    </Link>
  </div>

  {#if loading}
    <div class="loading">Loading links...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <div class="filter-section">
      <h3>Filter by Tags:</h3>
      <div class="tag-filters">
        {#each allTags as tag}
          <button
            type="button"
            class="tag-filter"
            class:active={activeTags.has(tag)}
            on:click={() => toggleTag(tag)}
            on:keydown={(e) => e.key === 'Enter' && toggleTag(tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
      {#if activeTags.size > 0}
        <button on:click={clearTags}>Clear Filters</button>
      {/if}
    </div>

    <div class="links">
      {#if filteredLinks.length === 0}
        <p class="text-center">No links available.</p>
      {:else}
        {#each filteredLinks as link}
          <div class="link-card">
            <h3>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </h3>
            <div class="tags">
              {#each link.tags || [] as tag}
                <span class="tag-filter">{tag}</span>
              {/each}
            </div>
            <p class="description">{link.description}</p>
            <div class="actions">
              <Link to={`/link/${link._id}`}>
                <button>View</button>
              </Link>
              <Link to={`/edit/${link._id}`}>
                <button>Edit</button>
              </Link>
              <button class="delete" on:click={() => deleteLink(link._id)}>
                Delete
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div> 