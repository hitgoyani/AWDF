# Practical 3: API Integration & Data Rendering in React

**Course**: AWDF (Advanced Web Development Framework)  
**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Tech Stack**: React 19, React Router v6, GitHub REST API, Vite, CSS3  

---

## 📌 Objective
To perform asynchronous data fetching from the GitHub REST API using React's `useEffect` hook, manage asynchronous state lifecycle (`loading`, `error`, `data`), build modular UI components (`Spinner`, `ErrorMessage` with retry option), and implement client-side search filtering.

---

## 📁 Key Features
1. **GitHub REST API Fetching**: Retrieves repositories dynamically for `@hitgoyani` (or any custom username).
2. **Asynchronous UI State**: Display custom `Spinner` during fetch and `ErrorMessage` component on HTTP failures.
3. **Interactive Search Filter**: Live filter projects by name using controlled text input.
4. **Error Handling & Retry Pipeline**: Includes a built-in **Test Error State** button and a **Retry Fetch** trigger.

---

## 🚀 How to Run
```bash
npm install
npm run dev
```
