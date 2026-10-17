# 🚀 SkillSync

### AI-Powered Learning & Project Collaboration Platform

SkillSync is a full-stack MERN platform that helps developers showcase their work, discover projects to collaborate on, and connect with other developers — with AI-powered project suggestions and feedback built in.

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based auth with HTTP-only cookies
- 👤 **User Profiles** — Bio, skills, and profile avatar uploads (Cloudinary)
- 🚀 **Project Management** — Create, edit, delete, and discover projects with search/filter
- 🤝 **Collaboration** — Request to join, accept/reject, leave, and remove members
- 💬 **Real-Time Chat** — Project-based chat via Socket.IO, restricted to collaborators only
- 🔔 **Notifications** — In-app alerts for join requests, responses, and new messages
- 🤖 **AI Project Ideas** — Personalized project suggestions based on your skills (Gemini AI)
- ✍️ **AI Description Feedback** — Get AI suggestions to improve your project descriptions
- ☁️ **Cloudinary Uploads** — Avatar and project image uploads
- 📱 **Responsive UI** — 3D tilt-card interactions, works across screen sizes

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router, Socket.IO Client
**Backend:** Node.js, Express.js, Socket.IO, JWT, Cookie-based Auth
**Database & Services:** MongoDB Atlas, Cloudinary, Google Gemini AI

---

## 📁 Project Structure

```text
SkillSync/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── server/          # Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── socket.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SkillSync.git
cd SkillSync
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

---

## 🔑 Environment Variables

### Backend — `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## ▶️ Run Locally

### Backend

```bash
cd server
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd client
npm run dev
```

Runs on `http://localhost:5173`

---

## 🌐 Deployment

| Part          | Platform      |
| ------------- | ------------- |
| Frontend      | Vercel        |
| Backend       | Render        |
| Database      | MongoDB Atlas |
| Image Storage | Cloudinary    |
| AI            | Google Gemini |

---

## 👩‍💻 Author

**Muskan Gulati**
B.Tech Computer Science Engineering

---

⭐ If you find SkillSync interesting, consider giving the repository a star!
