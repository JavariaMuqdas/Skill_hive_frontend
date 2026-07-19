# SkillHive

A skill-driven hiring platform that connects students, companies, and admins through a two-phase matching algorithm — scoring candidates against real job and internship requirements instead of relying on keyword-matched resumes.

**Final Year Project** — React JS · Laravel · MySQL

---

## What it does

SkillHive rethinks how students find internships and jobs by matching them to roles based on verified skills, not just applications sent into a void.

- **Students** build a skill-based profile and get matched to relevant roles
- **Companies** post jobs/internships and receive a ranked shortlist of candidates scored against their requirements
- **Admins** verify companies (via FBR/SECP checks) and oversee platform integrity

### Core features

- 🎯 **Two-phase skill-matching algorithm** — scores and ranks candidates against job requirements
- 🏢 **Company verification** — FBR/SECP-based checks to keep listings legitimate
- 📅 **Interview scheduling** — built-in coordination between companies and shortlisted candidates
- 🎓 **Scholarship Module** — a dedicated track for scholarship opportunities alongside jobs
- 🔐 **Role-based access** — separate, tailored experiences for Student / Company / Admin
- 📱 **Fully responsive** — sticky filter sidebar and consistent layout across breakpoints

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React JS |
| Backend | Laravel (REST API) |
| Database | MySQL |
| Auth | Role-based authentication |
| Deployment | Nginx, Ubuntu VPS |

---

## How the matching works

1. Student builds a profile listing their skills
2. Company posts a role with required skills
3. The matching engine scores each student against the role's requirements
4. Ranked candidates surface to the company
5. Company shortlists top matches
6. Interview is scheduled, offer is made

---

## Local setup

```bash
# Clone the repo
git clone https://github.com/JavariaMuqdas/skillhive.git
cd skillhive

# Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Frontend (React)
cd ../frontend
npm install
npm start
```

> Update `.env` with your local MySQL credentials before running migrations.

---

## Deployment notes

Deployed on an Ubuntu VPS with:
- Nginx running two server blocks — frontend on port 80, Laravel API on port 8001
- CORS configured between frontend and API
- SSH-based deployment workflow

---

## Team

Built as a Final Year Project by **Javaria Muqadas**, along with Mehrab and Kashaf Ruba, under the supervision of **Sir Nasir Siddiqui**.

---

## License

This project was built for academic purposes as part of a university Final Year Project.
