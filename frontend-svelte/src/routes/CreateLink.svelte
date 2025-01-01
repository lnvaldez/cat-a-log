<script>
  import { navigate } from 'svelte-routing';
  import { Link } from 'svelte-routing';
  import { api } from '../lib/api';

  let formData = {
    title: '',
    url: '',
    description: '',
    tags: ''
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.createLink({
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
      });
      navigate('/');
    } catch (err) {
      console.error('Error creating link:', err);
      alert('Error creating link');
    }
  };
</script>

<div class="container">
  <h1>Create New Link</h1>
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
      <button type="submit" class="mb-20">Create Link</button>
      <Link to="/">
        <button type="button" class="delete">Cancel</button>
      </Link>
    </div>
  </form>
</div> 