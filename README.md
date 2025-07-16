# Intellicon Forum - Client

A modern, fully responsive MERN stack forum application built with React.js, designed for engaging discussions, real-time updates, and a recruiter-friendly user experience.

## 🚀 Live Demo

[https://intellicon-573fa.web.app](https://intellicon-573fa.web.app)

## 📚 Project Purpose

Intellicon Forum is an online platform where users can post messages, comment, vote, and interact in real time. The project demonstrates advanced MERN stack skills, focusing on user experience, security, and performance.

## ✨ Key Features

- **Authentication:** Email/password and social login (Google), JWT-based, badges on registration and membership.
- **Responsive UI:** Works seamlessly on mobile, tablet, and desktop.
- **Home Page:** 
  - Navbar with conditional rendering (profile, login, etc.)
  - Banner with tag-based search (server-side)
  - Tags section for filtering/searching posts
  - Announcements with notification count
  - Posts list (newest first, popularity sort, pagination)
- **Post Details:** 
  - Author info, title, description, tags, time, votes, comments
  - Upvote/downvote logic
  - Share button (react-share, dynamic URL)
  - Comment section (add, list, count, modal for long comments)
- **Membership:** 
  - Payment integration (Stripe/other)
  - Gold badge and post limit logic
- **User Dashboard:** 
  - My Profile (badges, recent posts)
  - Add Post (form, tag dropdown, post limit)
  - My Posts (table, votes, comments, delete, comment management)
- **Admin Dashboard:** 
  - Manage Users (make admin, search, subscription status)
  - Make Announcement
  - Reported Comments/Activities (admin actions)
  - Admin Profile (stats, pie chart, tag management)
- **Data Fetching:** 
  - TanStack Query for all GET requests
- **Security:** 
  - Firebase and API keys secured with environment variables

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, TanStack Query, react-hook-form, react-share, react-select, context API
- **Styling:** CSS3 (custom, responsive), recruiter-friendly color palette
- **Authentication:** Firebase Auth, JWT
- **State Management:** Context API, TanStack Query

## 🔒 Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_API_BASE_URL`

## 📦 NPM Packages Used

- react
- react-dom
- react-router-dom
- @tanstack/react-query
- react-hook-form
- react-share
- react-select
- firebase
- axios
- (add any others you use)

## 🖼️ Screenshots

_Add screenshots of your main pages here for recruiters!_

## 📝 How to Run Locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Add your `.env` file with the required variables
4. Start the dev server: `npm run dev`

## 📄 License

MIT
