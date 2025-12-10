# 🎓 AI Examination System

[![CI](https://github.com/YOUR_USERNAME/ai_examination/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/ai_examination/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)](https://vuejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-47A248.svg)](https://www.mongodb.com/)

> A thoughtful, accessible examination platform crafted for inclusion. Designed to be simple, reliable, and friendly for students and teachers—especially those who are visually impaired.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

The **AI Examination System** is an open-source, web-based examination platform designed with accessibility at its core. It provides a seamless experience for both visually impaired and sighted users, enabling teachers to create exams and students to take them with full voice control and screen reader support.

### Why This Project?

Traditional examination systems often overlook users with visual impairments. This project aims to bridge that gap by providing:

- **Voice Commands**: Navigate and answer questions entirely by voice
- **Screen Reader Support**: Full ARIA compliance for assistive technologies
- **Keyboard Navigation**: Complete exam workflow without a mouse
- **AI-Assisted Features**: Smart tools to support students while maintaining exam integrity

---

## ✨ Key Features

### 🔊 Accessibility First
- **Speech Recognition**: Answer questions using your voice
- **Text-to-Speech**: Hear questions and options read aloud
- **Keyboard Navigation**: Full keyboard support with intuitive shortcuts
- **High Contrast Mode**: Enhanced visibility for low-vision users
- **ARIA Labels**: Complete screen reader compatibility

### 👨‍🏫 For Teachers
- Create and manage exams with multiple question types
- Set time limits and total marks
- Publish, archive, or save exams as drafts
- View student submissions and performance

### 👩‍🎓 For Students
- Browse available exams
- Take exams with voice or keyboard controls
- Timer announcements for time management
- Real-time feedback and progress tracking

### 🛠️ Technical Features
- Real-time updates via WebSocket (Socket.IO)
- GraphQL API for flexible data queries
- JWT-based authentication
- Mobile-ready with Capacitor support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Vue.js 3](https://vuejs.org/) | Reactive UI framework |
| [Vite](https://vitejs.dev/) | Fast build tool and dev server |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Vue Router](https://router.vuejs.org/) | Client-side routing |
| [Capacitor](https://capacitorjs.com/) | Native mobile app support |
| [Rive](https://rive.app/) | Interactive animations |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Speech recognition & synthesis |

### Backend
| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express](https://expressjs.com/) | Web application framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| [GraphQL](https://graphql.org/) | API query language |
| [Socket.IO](https://socket.io/) | Real-time communication |
| [JWT](https://jwt.io/) | Authentication tokens |
| [Joi](https://joi.dev/) | Schema validation |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai_examination.git
cd ai_examination
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Configuration

### Backend Environment

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
SERVER_PORT=8000

# Database
MONGODB_URI=mongodb://localhost:27017/ai_examination

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### Frontend Environment

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, create `.env.production`:

```env
VITE_API_URL=https://your-production-api-url.com
```

---

## 💻 Development

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as a service)
net start MongoDB

# On macOS/Linux
mongod --dbpath /path/to/your/data
```

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:8000`

### Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5000`

### Access the Application

Open your browser and navigate to `http://localhost:5000`

---

## 🏗️ Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Build Backend

```bash
cd backend
npm run build
```

The bundled backend will be in `backend/dist/backend.js`.

### Build Mobile App (Android)

```bash
cd frontend
npm run build:mobile
```

This creates an APK in `frontend/public/app-debug.apk`.

---

## 🧪 Testing

### Frontend Unit Tests

```bash
cd frontend
npm run test:unit
```

Uses [Vitest](https://vitest.dev/) with jsdom for component testing.

### Frontend E2E Tests

```bash
cd frontend
npm run test:e2e
```

Uses [Cypress](https://www.cypress.io/) for end-to-end testing.

### Run E2E Tests in Development Mode

```bash
cd frontend
npm run test:e2e:dev
```

This opens Cypress Test Runner for interactive testing.

### Linting

```bash
cd frontend
npm run lint
```

Runs ESLint to check for code quality issues.

---

## 📁 Project Structure

```
ai_examination/
├── backend/                    # Node.js/Express backend
│   ├── bootstrap/              # Server and database initialization
│   ├── config/                 # Configuration files
│   ├── src/
│   │   ├── controller/         # Route controllers
│   │   ├── graphql/            # GraphQL schema and resolvers
│   │   ├── helpers/            # Utility helpers
│   │   ├── interface/          # Data access interfaces
│   │   ├── middleware/         # Express middleware (auth, validation)
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic services
│   │   └── validators/         # Joi validation schemas
│   ├── index.js                # Application entry point
│   └── package.json
│
├── frontend/                   # Vue.js frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, styles
│   │   ├── components/         # Reusable Vue components
│   │   ├── directives/         # Custom Vue directives
│   │   ├── mixins/             # Vue mixins
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication views
│   │   │   ├── exam/           # Exam management (teacher)
│   │   │   ├── home/           # Landing page
│   │   │   ├── student/        # Student dashboard & exam taking
│   │   │   └── teacher/        # Teacher dashboard
│   │   ├── plugins/            # Vue plugins
│   │   ├── router/             # Vue Router configuration
│   │   ├── services/           # API service layer
│   │   ├── stores/             # Pinia state stores
│   │   └── utils/              # Utility functions
│   ├── index.html              # Entry HTML
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Exam Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | List all exams (teacher) |
| GET | `/api/exams/published` | List published exams (student) |
| POST | `/api/exams` | Create a new exam |
| GET | `/api/exams/:id` | Get exam details |
| PUT | `/api/exams/:id` | Update an exam |
| DELETE | `/api/exams/:id` | Delete an exam |
| PATCH | `/api/exams/:id/status` | Update exam status |

### Submission Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submissions` | Submit exam answers |
| GET | `/api/submissions/:examId` | Get submissions for an exam |

### GraphQL Endpoint

| Endpoint | Description |
|----------|-------------|
| POST `/graphql` | GraphQL API endpoint |

---

## 🤝 Contributing

We welcome contributions from everyone! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai_examination.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and commit them:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New accessibility features
- 🌍 Internationalization (i18n)
- 📚 Documentation improvements
- 🧪 Test coverage
- 🎨 UI/UX enhancements

---

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow:

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Inclusive**: Welcome contributors of all backgrounds
- **Be Constructive**: Provide helpful feedback
- **Be Patient**: Help newcomers learn and grow

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AI Examination Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- All contributors who help make education more accessible
- The open-source community for the amazing tools and libraries
- Educators and students who provide valuable feedback
- [Vue.js](https://vuejs.org/) team for the excellent framework
- [MongoDB](https://www.mongodb.com/) for the flexible database
- The Web Accessibility community for guidance and best practices

---

## 📞 Support

If you have questions or need help:

1. 📖 Check the [documentation](#api-documentation)
2. 🔍 Search existing [issues](https://github.com/YOUR_USERNAME/ai_examination/issues)
3. 💬 Open a new issue for bugs or feature requests

---

<p align="center">
  Made with ❤️ for accessible education
</p>
