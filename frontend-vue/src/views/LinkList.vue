<template>
  <div class="container">
    <h1>Link Library</h1>
    <div class="text-center mb-20">
      <router-link to="/create">
        <button>Create New Link</button>
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading links...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="filter-section">
        <h3>Filter by Tags:</h3>
        <div class="tag-filters">
          <span
            v-for="tag in allTags"
            :key="tag"
            class="tag-filter"
            :class="{ active: activeTags.has(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <button v-if="activeTags.size" @click="clearTags">Clear Filters</button>
      </div>

      <div class="links">
        <div v-if="filteredLinks.length === 0" class="text-center">No links available.</div>
        <div v-else v-for="link in filteredLinks" :key="link._id" class="link-card">
          <h3>
            <a :href="link.url" target="_blank">{{ link.title }}</a>
          </h3>
          <div class="tags">
            <span v-for="tag in link.tags" :key="tag" class="tag-filter">
              {{ tag }}
            </span>
          </div>
          <p class="description">{{ link.description }}</p>
          <div class="actions">
            <router-link :to="`/link/${link._id}`">
              <button>View</button>
            </router-link>
            <router-link :to="`/edit/${link._id}`">
              <button>Edit</button>
            </router-link>
            <button class="delete" @click="deleteLink(link._id)">Delete</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../services/api'

const links = ref([])
const activeTags = ref(new Set())
const allTags = ref([])
const loading = ref(true)
const error = ref(null)

const loadLinks = async () => {
  try {
    loading.value = true
    const response = await api.getAllLinks()
    links.value = response.data
    updateTags(response.data)
  } catch (err) {
    error.value = 'Error loading links'
    console.error('Error loading links:', err)
  } finally {
    loading.value = false
  }
}

const updateTags = (links) => {
  const tagSet = new Set()
  links.forEach((link) => {
    if (link.tags) {
      link.tags.forEach((tag) => tagSet.add(tag))
    }
  })
  allTags.value = Array.from(tagSet).sort()
}

const toggleTag = (tag) => {
  if (activeTags.value.has(tag)) {
    activeTags.value.delete(tag)
  } else {
    activeTags.value.add(tag)
  }
}

const clearTags = () => {
  activeTags.value.clear()
}

const filteredLinks = computed(() => {
  if (activeTags.value.size === 0) return links.value
  return links.value.filter(
    (link) => link.tags && Array.from(activeTags.value).every((tag) => link.tags.includes(tag)),
  )
})

const deleteLink = async (id) => {
  if (!confirm('Are you sure you want to delete this link?')) return

  try {
    await api.deleteLink(id)
    await loadLinks()
  } catch (err) {
    console.error('Error deleting link:', err)
    alert('Error deleting link')
  }
}

onMounted(() => {
  loadLinks()
})
</script>
