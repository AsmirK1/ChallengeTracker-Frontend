# ChallengeTracker Frontend

A modern React 19 application for tracking personal and group challenges. Built with Vite, TypeScript, and Tailwind CSS, following a feature-based architecture.

This project implements the frontend requirements for the ChallengeTracker system, providing a responsive and interactive user interface for managing challenges, memberships, and progress.

> **Backend API**: For the server-side implementation and API documentation, please refer to the [Backend README](../ChallengeTracker-Backend/readme.md).

---

## 🚀 Features & Functional Requirements

This application implements the following functional requirements we had for this group project(FRs):

### 🏗️ Core Architecture (FR017, FR018)

- **Tech Stack**: React 19, Vite, TypeScript.
- **State Management**: TanStack Query for server state, React Context for Auth.
- **Routing**: React Router v7 with protected routes (AuthGuard).
- **Structure**: Feature-based folder structure (`features/`, `shared/`, `pages/`) for scalability.

### 🔐 Authentication (FR019)

- **User Flows**: Login and Registration pages.
- **Security**: JWT storage in memory/localStorage.
- **Context**: Global `AuthContext` exposing user state and login/logout methods.

### 📊 Dashboard (FR020)

- **My Challenges**: View all active and joined challenges.
- **Discover**: Browse public challenges available for joining.
- **Optimized Loading**: Uses data loaders for efficient data fetching.

### 🏆 Challenge Management (FR021, FR022)

- **Create Challenge**: Form with Zod validation for creating new challenges.
- **Challenge Details**: Comprehensive view showing:
  - Challenge info and status.
  - Current members and leaderboard.
  - Today's progress summary.
- **Actions**: Join/Leave challenges, Start/Complete challenges (for owners).

### 📈 Progress Tracking (FR021, FR009)

- **Log Progress**: Intuitive form to log daily activity.
- **Validation**: Enforces rules (amount > 0, date windows).
- **Visuals**: Progress bars and recent activity logs.

### ⚡ User Experience (FR023)

- **Error Handling**: User-friendly error messages mapped from API ProblemDetails.
- **Optimistic UI**: Immediate feedback on actions with rollback on failure.
- **Responsive Design**: Mobile-first UI using Tailwind CSS.

---

## 🛠️ Project Structure

```
src/
├── app/                # App configuration (Router, Provider)
├── features/           # Feature-based modules
│   ├── auth/           # Authentication logic & forms
│   ├── challenges/     # Challenge management
│   ├── dashboard/      # Dashboard views
│   ├── leaderboard/    # Leaderboard components
│   ├── memberships/    # Membership actions
│   └── progress/       # Progress logging
├── pages/              # Route components
├── shared/             # Shared utilities & UI components
│   ├── api/            # API client & Query setup
│   ├── components/     # Reusable UI (Button, Input, etc.)
│   └── constants.ts    # App-wide constants (Enums)
└── main.tsx            # Entry point
```

---

## ⚡ Getting Started

### Prerequisites

| Tool    | Version         | Notes                              |
| ------- | --------------- | ---------------------------------- |
| Node.js | ≥ 20 LTS        | Required for Vite dev server/build |
| npm     | ships with Node | Replace with yarn/pnpm if desired  |

### Installation

1.  Clone the repository:

    ```bash
    git clone <repo-url> ChallengeTracker
    cd ChallengeTracker/ChallengeTracker-Frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env` file in the root directory:

    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```

    _Ensure this matches your running backend port._

4.  Run the development server:

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---
