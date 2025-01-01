<template>
  <div class="container">
    <h1>Create New Link</h1>
    <form @submit.prevent="handleSubmit">
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
        <button type="submit" class="mb-20">Create Link</button>
        <router-link to="/">
          <button type="button" class="delete">Cancel</button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()

const formData = ref({
  title: '',
  url: '',
  description: '',
  tags: '',
})

const handleSubmit = async () => {
  try {
    await api.createLink({
      ...formData.value,
      tags: formData.value.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    })
    router.push('/')
  } catch (err) {
    console.error('Error creating link:', err)
    alert('Error creating link')
  }
}
</script>
