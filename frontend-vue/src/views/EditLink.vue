<template>
  <div class="container">
    <h1>Edit Link</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="formData.title" required />
      </div>

      <div class="form-group">
        <label for="url">URL:</label>
        <input type="url" id="url" v-model="formData.url" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" rows="4" v-model="formData.description"></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma-separated):</label>
        <input type="text" id="tags" v-model="formData.tags" />
      </div>

      <div class="form-group text-center">
        <button type="submit" class="mb-20">Update Link</button>
        <router-link to="/">
          <button type="button" class="delete">Cancel</button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const route = useRoute()

const formData = ref({
  title: '',
  url: '',
  description: '',
  tags: '',
})
const loading = ref(true)
const error = ref(null)

const loadLink = async () => {
  try {
    const response = await api.getLink(route.params.id)
    const link = response.data
    formData.value = {
      title: link.title,
      url: link.url,
      description: link.description || '',
      tags: link.tags ? link.tags.join(', ') : '',
    }
  } catch (err) {
    error.value = 'Error loading link'
    console.error('Error loading link:', err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    await api.updateLink(route.params.id, {
      ...formData.value,
      tags: formData.value.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    })
    router.push('/')
  } catch (err) {
    console.error('Error updating link:', err)
    alert('Error updating link')
  }
}

onMounted(() => {
  loadLink()
})
</script>
