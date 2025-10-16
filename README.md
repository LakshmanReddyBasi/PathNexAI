# 🌐 PathNexAI

> **PathNexAI** is an intelligent AI-powered career guidance platform built with **Next.js**, **Tailwind CSS**, **Prisma**, **Neon Database**, and **Inngest**.  
> It leverages **Google Gemini AI** to deliver personalized career recommendations, resume insights, and skill growth pathways.

---

## 🚀 Tech Stack

| Technology | Description |
|-------------|-------------|
| **Next.js 14+** | React framework for building fast, full-stack web apps |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Prisma ORM** | Type-safe database ORM for modern TypeScript projects |
| **Neon DB** | Serverless Postgres database for scalable cloud storage |
| **Inngest** | Reliable background jobs, scheduled tasks, and webhooks |
| **Clerk** | Authentication and user management (Sign-in, Sign-up, Profiles) |
| **Gemini API** | Google’s LLM for AI-driven insights and career recommendations |

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/pathnexai.git
cd pathnexai
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Create a `.env` File

Create a `.env` file in the project root and add the following environment variables:

```bash
# Database
DATABASE_URL="your_neon_database_url"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Gemini AI
GEMINI_API_KEY="your_google_gemini_api_key"
```

> 💡 Make sure your **Gemini API key** is valid — test it using a simple Node script before running the project.

---

## 🧩 Database Setup

Initialize and migrate your Prisma schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

You can explore your Neon DB schema visually with Prisma Studio:

```bash
npx prisma studio
```

---

## 🧠 Using Gemini AI

The app integrates **Google Gemini (Generative AI)** for generating:
- Career path insights  
- Personalized skill recommendations  
- Resume and portfolio feedback  
- Interview readiness evaluation  

All API requests are handled via secure server routes using your `GEMINI_API_KEY`.

---

## ⚡ Inngest Integration

**Inngest** is used for:
- Asynchronous background tasks  
- Email notifications  
- Scheduled workflows (e.g., daily career insights)  

Start Inngest locally:

```bash
npx inngest dev
```

---

## 🧰 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Run the development server |
| `npm run build` | Build the production app |
| `npm start` | Start the production server |
| `npm run lint` | Lint the codebase |
| `npx prisma studio` | View and edit your database via Prisma Studio |

---

## 📁 Folder Structure

```
pathnexai/
│
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions & API helpers
│   ├── inngest/         # Inngest functions
│   └── styles/          # Tailwind CSS setup
│
├── public/              # Static assets
├── .env.example         # Example environment variables
├── package.json
└── README.md
```

---

## 🧑‍💻 Contributing

Contributions are welcome!  

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m "Add amazing feature"`)  
4. Push to your branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request 🚀

---

## 🌍 Deployment

Easily deploy **PathNexAI** on **Vercel** with:
- **Neon** for the PostgreSQL database  
- **Clerk** for authentication  
- **Inngest** for serverless background jobs  

Make sure to add all environment variables from your `.env` file into your Vercel project settings.

---

## 🛡️ License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support

If you like this project, consider giving it a ⭐ on GitHub — it helps others discover **PathNexAI**!
