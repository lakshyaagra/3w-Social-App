# Social — Mini Social Post Application

Built for the 3W Business Full Stack Internship, Round 1, Task 1: a mini social
feed inspired by the TaskPlanet app's Social Page. Users can sign up, post
text and/or an image, view a public feed, like posts, and comment.

## Tech stack

- **Frontend:** React (Vite) + Material UI
- **Backend:** Node.js + Express
- **Database:** MongoDB (two collections only: `users`, `posts` — likes and
  comments live as embedded arrays inside each post document)
- **Image storage:** Multer (parses the upload) → Cloudinary (stores it)
- **Auth:** JWT, passwords hashed with bcrypt

## Project structure

```
.
├── backend/   # Express REST API
└── frontend/  # React + Vite client
```

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your real values
npm run dev
```

Required `.env` values:

- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `CORS_ORIGIN` — your deployed frontend URL (use `*` locally, or leave unset)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

## API reference

| Method | Route                        | Auth     | Description                                            |
| ------ | ---------------------------- | -------- | ------------------------------------------------------ |
| POST   | `/api/auth/signup`           | –        | Create an account                                      |
| POST   | `/api/auth/login`            | –        | Log in, returns JWT                                    |
| GET    | `/api/posts?page=1&limit=10` | –        | Paginated public feed                                  |
| POST   | `/api/posts`                 | required | Create a post (`multipart/form-data`: `text`, `image`) |
| POST   | `/api/posts/:id/like`        | required | Toggle like on a post                                  |
| POST   | `/api/posts/:id/comment`     | required | Add a comment (`{ text }`)                             |

## Deployment

1. **MongoDB Atlas** — create a free cluster, whitelist `0.0.0.0/0` (or Render's
   IPs) under Network Access, copy the connection string into `MONGODB_URI`.
2. **Backend → Render** — new Web Service, root directory `backend`, build
   command `npm install`, start command `npm start`. Add all env vars from
   `.env.example` with your real values.
3. **Frontend → Vercel** — import the repo, set root directory to `frontend`,
   framework preset "Vite", add `VITE_API_URL` pointing at your Render URL
   (e.g. `https://your-app.onrender.com/api`).
4. Once the frontend URL is live, go back to Render and set `CORS_ORIGIN` to
   that exact URL, then redeploy the backend.

## Design notes

- Only two MongoDB collections are used, per the assignment constraint — likes
  are a `string[]` of usernames and comments are a subdocument array on `Post`.
- Both `text` and `image` are optional on a post, but at least one is required
  (validated on both the client and the server).
- Likes and comments update optimistically in the UI, then reconcile with the
  server response.
- Feed pagination is server-side (`page`/`limit` query params + `hasMore` flag).
