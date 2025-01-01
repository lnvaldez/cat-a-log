<template>
  <div class="container">
    <div class="text-center mb-20">
      <router-link to="/">
        <button>Back to List</button>
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else-if="link">
      <div class="link-card">
        <h2>{{ link.title }}</h2>
        <p>
          <a :href="link.url" target="_blank">{{ link.url }}</a>
        </p>
        <p class="description">{{ link.description }}</p>
        <div class="tags">
          <span v-for="tag in link.tags" :key="tag" class="tag-filter">
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="votes">
        <h3>Votes: {{ link.votes }}</h3>
        <div class="vote-buttons">
          <button @click="handleVote(1)">👍 Upvote</button>
          <button class="delete" @click="handleVote(-1)">👎 Downvote</button>
        </div>
      </div>

      <div class="comments">
        <h3>Comments</h3>
        <form @submit.prevent="handleCommentSubmit" class="comment-form">
          <div class="form-group">
            <textarea
              v-model="newComment"
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
          <div v-for="comment in comments" :key="comment._id" class="comment">
            <p>{{ comment.content }}</p>
            <small>{{ new Date(comment.createdAt).toLocaleString() }}</small>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'

const route = useRoute()
const link = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const error = ref(null)

const loadLinkAndComments = async () => {
  try {
    loading.value = true
    const [linkResponse, commentsResponse] = await Promise.all([
      api.getLink(route.params.id),
      api.getComments(route.params.id),
    ])
    link.value = linkResponse.data
    comments.value = commentsResponse.data
  } catch (err) {
    error.value = 'Error loading link details'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const handleVote = async (value) => {
  try {
    const response = await api.voteLink(route.params.id, value)
    link.value = response.data
  } catch (err) {
    console.error('Error voting:', err)
    alert('Error voting')
  }
}

const handleCommentSubmit = async () => {
  if (!newComment.value.trim()) return

  try {
    await api.createComment({
      linkId: route.params.id,
      content: newComment.value,
    })
    newComment.value = ''
    const commentsResponse = await api.getComments(route.params.id)
    comments.value = commentsResponse.data
  } catch (err) {
    console.error('Error posting comment:', err)
    alert('Error posting comment')
  }
}

onMounted(() => {
  loadLinkAndComments()
})
</script>
