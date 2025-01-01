import { createRouter, createWebHistory } from 'vue-router'
import LinkList from '../views/LinkList.vue'
import LinkDetail from '../views/LinkDetail.vue'
import CreateLink from '../views/CreateLink.vue'
import EditLink from '../views/EditLink.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LinkList,
    },
    {
      path: '/link/:id',
      name: 'linkDetail',
      component: LinkDetail,
    },
    {
      path: '/create',
      name: 'createLink',
      component: CreateLink,
    },
    {
      path: '/edit/:id',
      name: 'editLink',
      component: EditLink,
    },
  ],
})

export default router
