# 🚀 CodeSpace

**CodeSpace** is a browser-based coding platform that allows users to write, test, and share HTML, CSS, and JavaScript code in real time.
It provides an interactive environment similar to CodePen or JSFiddle, designed for students, developers, and coding enthusiasts to experiment and showcase web projects without requiring any local setup.

---

## 🧩 Project Overview
URL - https://codespace-orcin.vercel.app/

### 🔹 Objective

To provide an easy-to-use web application where users can:

* Create and manage code snippets (“pens”)
* Preview HTML, CSS, and JavaScript output instantly
* Save and share projects with others via unique links

### 🔹 Technology Stack

* **Frontend:** React (TypeScript + Vite)
* **UI:** Tailwind CSS + shadcn/ui
* **Code Editor:** CodeMirror / Monaco Editor
* **Backend Services:** Firebase (Authentication, Firestore, Storage)
* **Hosting:** Firebase Hosting

---

## ⚙️ Features

### 👤 User Management

* Secure user registration and login using Firebase Authentication
* Google OAuth integration for quick sign-in
* Passwords managed securely via Firebase

### 💻 Code Editor

* Three editor panels: **HTML**, **CSS**, **JavaScript**
* Real-time **live preview** of code output using iframe rendering
* Syntax highlighting for better readability
* Auto-save functionality (stores code in Firebase Firestore)

### 📁 Project Management

* Create, update, and delete “pens”
* Save and load projects from user dashboard
* Search pens by title or tags
* Share code via unique, public URLs

### 🌐 Hosting & Deployment

* Deployed on Firebase Hosting for global access
* Public pens viewable through shareable links
* Option to export/download code files locally

---

## 🧠 System Architecture

**Frontend (React SPA)** → Provides user interface, editor panels, and preview rendering
**Backend (Firebase Services)** → Handles authentication, database storage, and hosting
**Firestore Database** → Stores user pens, metadata, and user info
**Firebase Storage** → Manages uploaded or saved files

---

## 📜 Functional Requirements (Summary)

| ID       | Description                                            |
| -------- | ------------------------------------------------------ |
| **FR-1** | Secure user account management (register/login/logout) |
| **FR-2** | Real-time code editing (HTML, CSS, JS)                 |
| **FR-3** | Auto-save and project management                       |
| **FR-4** | Live output preview                                    |
| **FR-5** | Share and export functionality                         |

---

## 🧩 Non-Functional Requirements

| Category        | Description                                     |
| --------------- | ----------------------------------------------- |
| **Performance** | Live preview updates in under 1 second          |
| **Security**    | HTTPS communication; Firebase-managed auth      |
| **Usability**   | Clean, responsive, beginner-friendly UI         |
| **Reliability** | Firebase guarantees uptime and data durability  |
| **Scalability** | Supports thousands of concurrent users and pens |

---

## 🧭 Use Case Overview

### Actors

* **Guest User:** Can browse and view public pens
* **Registered User:** Can create, edit, save, and share pens

### Example Flow: Creating and Sharing a Pen

1. User logs in via Firebase Authentication
2. Opens the code editor
3. Writes HTML, CSS, and JS code
4. Live preview renders output in real time
5. User saves the pen to Firestore
6. A shareable public link is generated automatically

---

## ✅ Validation Criteria

* Users can successfully register/login/logout
* Live preview updates dynamically while typing
* Saved pens can be reloaded from Firestore
* Shared links open the correct project view
* App remains available globally via Firebase Hosting

---

## 🧰 Installation & Setup

### Prerequisites

* Node.js (v18+ recommended)
* npm (v9+)

### Steps

```bash
# Clone this repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project folder
cd codespace

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🌍 Deployment

1. Build the project

   ```bash
   npm run build
   ```
2. Deploy via Firebase CLI

   ```bash
   firebase deploy
   ```

Your app will be live globally within seconds.

---

---

> *“CodeSpace empowers learners and developers to code, preview, and share — all in one place.”*
