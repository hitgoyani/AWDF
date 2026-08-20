# Student Portfolio (Practicals 1, 2 & 3)

**Student Name**: Hit Goyani  
**ID / Roll No**: 24DIT021  
**Course**: Advanced Web Development Frameworks (ITUE301)  
**Semester**: 5th Semester  
**University**: CHARUSAT  

---

## 📌 About this Project

This React application was built using Vite as part of the AWDF practical coursework:

- **Practical 1: Introduction to React and Component Architecture**
  - Scaffolded using Vite (`npm create vite@latest`).
  - Structured into modular components: `Header.jsx`, `About.jsx`, `Skills.jsx`, `Footer.jsx`.
  - Data passed down using `props` (`name`, `themeColor`, `skillList`, `email`).

- **Practical 2: State Management and Routing in React**
  - Configured client-side routing with `react-router-dom` v6 (`Home`, `Projects`, `Contact`, `NotFound`).
  - Implemented `useState` hooks for dark/light mode toggling and a controlled contact form with real-time character count.

- **Practical 3: API Integration and Data Rendering in React**
  - Consumes the GitHub REST API using `useEffect()` on component mount.
  - Handles loading states (`Spinner.jsx`), error states (`ErrorMessage.jsx` with retry), and real-time project filtering.

---

## 🚀 How to Run

1. Navigate to the portfolio folder:
   ```bash
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.
