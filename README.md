# littlelabcoats

# 🧪 Little Lab Coats

**Little Lab Coats** is a fun, friendly DIY project generator for parents and kids. It helps families discover creative, screen-free activities using common household materials — like glue sticks, cardboard, balloons, and more.

Built with React, Tailwind CSS, OpenAI, and Vercel, this GPT-powered tool encourages hands-on learning, imaginative play, and quality time — all while making it easy for busy parents to get started.

---

## ✨ Features

- ✅ Interactive materials checklist
- 🎲 “Surprise Me!” button powered by GPT-4o
- 🎨 Colorful DIY project cards with instructions
- 💡 Parent tips for each activity
- ❤️ Save projects to localStorage
- 🧼 Clean, mobile-friendly UI

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ronnydonkey/little-lab-coats.git
cd little-lab-coats
```

### 2. Install Dependencies
```bash
bun install
# or
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

> You'll need an OpenAI account with access to GPT-4o.

### 4. Run the Dev Server
```bash
bun dev
# or
npm run dev
```

---

## 📦 Project Structure

- `app/api/generate-project/route.ts` — AI SDK backend to generate projects
- `components/LittleLabCoats.tsx` — Main interface
- `public/` — Placeholder for future favicon/logo assets
- `styles/` — Tailwind and custom styles

---

## 🧠 Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI GPT-4o](https://platform.openai.com/)
- [Vercel Hosting](https://vercel.com/)
- [AI SDK](https://sdk.vercel.ai/docs)

---

## 🛠️ Contributing

Got ideas? Bug reports? Want to submit a project?

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Commit your changes
4. Open a pull request

We welcome thoughtful additions — especially ones tested with real kids!

---

## 📬 Contact

Made with glue-sticky fingers by [@dreamberg](https://github.com/dreamberg)  
Email: aaron@dreamberg.com

---

## 📘 License

MIT License — use it, remix it, and help families make magic.

---

> Little Lab Coats: Where screen time becomes *build time.*
