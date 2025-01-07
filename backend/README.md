# Cat-a-log Link Manager

A full-stack application for managing and sharing links with voting and commenting features.

## 🔗 Frontend Implementations

This project includes multiple frontend implementations:

1. [Vanilla JS](/frontend-vanilla) - Pure JavaScript implementation
2. [Alpine.js](/frontend-alpinejs) - Lightweight JavaScript framework
3. [Angular](/frontend-angular) - Full-featured TypeScript framework
4. [React](/frontend-react) - Popular JavaScript library
5. [Svelte](/frontend-svelte) - Compiled JavaScript framework
6. [Vue](/frontend-vue) - Progressive JavaScript framework

## 🚀 Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   git clone https://github.com/lnvaldez/cat-a-log.git
   cd cat-a-log/backend

2. Install dependencies:
   npm install

3. Create a .env file:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cat-a-log

4. Start the server:
   npm run dev

## 📚 API Documentation

### Links

- GET /api/links - Get all links
- POST /api/links - Create a new link
- GET /api/links/:id - Get a specific link
- PUT /api/links/:id - Update a link
- DELETE /api/links/:id - Delete a link
- PUT /api/links/:id/vote - Vote on a link
- PUT /api/links/:id/downvote - Downvote a link

### Comments

- GET /api/comments/:linkId - Get comments for a link
- POST /api/comments - Create a new comment
