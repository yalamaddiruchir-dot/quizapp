# QuizRoom: Full Stack Interactive Quiz Application

**Developed by Ch. Balaji**

> Repository description (paste into GitHub): *Full stack interactive quiz app built with React, Spring Boot and MySQL. Developed by Ch. Balaji.*

Users register, take randomized quizzes, see their score and review every answer. Admins add, edit and delete questions from an admin panel.

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Spring Boot 3.2 (Java 17), Spring Data JPA, Spring Security |
| Database | MySQL 8 |

## Features
- Register and log in; passwords stored as BCrypt hashes
- 10 random questions per quiz, one at a time with a progress bar
- Score calculated **on the server** (correct answers are never sent to the browser while taking a quiz)
- Answer review: your pick vs. the correct answer
- Personal score history
- Admin panel (role `ADMIN` only): add, edit, delete questions
- Input validation on all write endpoints; CORS limited to the frontend origin

## Project structure
```
quiz-app/
├── backend/    Spring Boot API (com.quiz: model, repo, web, config)
├── frontend/   React app (Auth, Quiz, Admin components)
└── database/   schema.sql (reference)
```

## Setup

### Prerequisites
Node.js 18+, Java 17+, Maven 3.8+, MySQL 8 running locally.

### 1. Database
Nothing to create by hand: the backend creates the `quizdb` database and tables on first start. (`database/schema.sql` shows the schema.)

### 2. Backend
```bash
cd backend
# set your MySQL password (or edit application.properties)
export DB_USER=root
export DB_PASSWORD=your_mysql_password
mvn spring-boot:run
```
API runs at `http://localhost:8080`. On first start it seeds 6 sample questions and an admin account:

- username: `admin`
- password: `admin123` (change it with the `ADMIN_PASSWORD` environment variable before first start)

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## API endpoints
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create a user account |
| GET | `/api/auth/me` | logged in | Verify login, return username and role |
| GET | `/api/quiz?count=10` | logged in | Random questions (no answers) |
| POST | `/api/quiz/submit` | logged in | Submit `{answers:{questionId:optionIndex}}`, get score and review |
| GET | `/api/quiz/results` | logged in | Current user's past scores |
| GET | `/api/admin/questions` | admin | List all questions |
| POST | `/api/admin/questions` | admin | Add a question |
| PUT | `/api/admin/questions/{id}` | admin | Update a question |
| DELETE | `/api/admin/questions/{id}` | admin | Delete a question |

Authentication uses HTTP Basic over a stateless API; roles are enforced in `SecurityConfig`.

## Database schema
- `users(id, username UNIQUE, password, role)`
- `question(id, text, option_a..option_d, correct, category)`
- `quiz_result(id, username, score, total, taken_at)`

## Deployment
- **Backend:** `mvn clean package`, then `java -jar target/quiz-backend-1.0.0.jar` with `DB_USER`, `DB_PASSWORD`, `ADMIN_PASSWORD` and `CORS_ORIGIN` (your frontend URL) set. Deploy on Render, Railway, AWS, etc., with a managed MySQL.
- **Frontend:** set `VITE_API_URL` to your backend URL (e.g. `https://api.example.com/api`), run `npm run build`, and host the `dist/` folder on Netlify, Vercel or any static host.
- **Always serve both over HTTPS** in production, because Basic credentials are only Base64-encoded.

## Git and GitHub
```bash
cd quiz-app
git init && git add . && git commit -m "Quiz app: React + Spring Boot + MySQL (Ch. Balaji)"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Testing checklist
1. Register a user, log in, take a quiz, confirm score and review match.
2. Log in as `admin`, add, edit and delete a question; confirm a normal user does not see the admin tab and gets 403 on `/api/admin/questions`.
3. Submit with some questions skipped and check they show as skipped.

---
Author: Ch. Balaji
