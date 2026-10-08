# Job Portal - Frontend

A job portal web app where employers post jobs and job seekers apply for them. This is the React frontend. It talks to a Spring Boot backend.

Backend repository: [job-portal-spring-boot](https://github.com/sakshigujar07/job-portal-spring-boot)

## Features

**For everyone**
- Browse jobs with search and pagination
- View job details with company information
- Register and login (JWT based)

**For job seekers**
- Apply to a job with a resume upload (PDF, DOC, DOCX)
- See your applications and their status (Pending, Shortlisted, Rejected, Hired)
- Get notifications when your application status changes
- Create and edit your profile

**For employers**
- Create a company profile
- Post, edit and delete jobs
- See applications for your jobs and Shortlist, Hire or Reject candidates
- Dashboard with job and application stats

## Tech Stack

- React
- Vite
- React Router
- Axios

## Getting Started

You need Node.js installed. The backend must also be running on `http://localhost:8080`.

1. Clone this repository

```bash
git clone https://github.com/sakshigujar07/job-portal-frontend.git
cd job-portal-frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

To run the backend, follow the setup steps in the [backend repository](https://github.com/sakshigujar07/job-portal-spring-boot).

## Project Structure

```
src/
  api.js        Axios instance with the backend base URL
  theme.js      Shared styles used by all pages
  App.jsx       Routes
  pages/        All pages (Home, Login, Dashboard, Jobs, Company, etc.)
```

## Notes

- The API base URL is set in `src/api.js`. Change it there if your backend runs on a different address.
- Resume files are stored on the backend's local disk. This project is built for local demo use.

## Author

Sakshi Gujar - BCA graduate, looking for Java Full Stack / SDE-1 roles.
GitHub: [sakshigujar07](https://github.com/sakshigujar07)