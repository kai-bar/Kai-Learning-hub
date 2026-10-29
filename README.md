# Kai Learning Hub

A modern school learning platform for students, teachers, and administrators.

## Features
- Student registration and login
- Teacher registration and login
- Admin dashboard
- Course management and enrollment
- Lesson access
- Online class scheduling
- Exam creation and submission
- Results and performance tracking
- Study percentage overview

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- JWT authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate the Prisma client and database:
```bash
npx prisma generate
npx prisma db push
```

3. Start the app:
```bash
npm run dev
```

4. Open the app at:
```bash
http://localhost:3000
```

## Demo Accounts
- Admin: admin@school.com / admin123
- Teacher: teacher@school.com / teacher123
- Student: student@school.com / student123

## Seed data
To add demo users and sample content, visit:
```bash
http://localhost:3000/api/seed
```

## Project purpose
This project is designed to support:
- Students logging in and viewing lessons
- Teachers registering and managing courses
- Admins overseeing school data and performance
- Online exams and results tracking
- Study progress calculation
