<h1 align="center">🛒 Full-Stack Grocery List Mobile App  🛒</h1>

![Demo App](/assets/images/screenshot-for-readme.png)

✨ **Highlights:**

- 📱 Fully Functional Mobile App built with React Native & Expo
- 🧑‍💻 Beginner-Friendly
- 📱 Cross-Platform Support (iOS & Android)
- 🔐 Authentication with Clerk (Google, Apple & GitHub login)
- 🧾 List Screen to manage grocery items
- ✅ Mark Items as Purchased with check functionality
- 🔢 Update Item Quantities
- 🗑️ Delete Items
- 📝 Planner Screen to add new grocery items
- 📊 Insights Screen with profile information and analytics
- 🚪 Secure Logout Flow
- 🧹 Clear Completed Items with a single button
- 💬 User Feedback Button to collect feature suggestions and bug reports
- 🎨 Liquid Glass iOS Tab Effect using Expo Native Tabs
- 🗄️ PostgreSQL Database for persistent data storage
- 🧩 Drizzle ORM for type-safe database queries
- ☁️ Cloud Database Hosting with Neon
- 🎨 Styling with NativeWind (TailwindCSS for React Native)
- ⚡ Global State Management with Zustand
- 🚀 Modern Full-Stack Mobile Architecture
- 🆓 100% Free Setup — No credit card required
- 📂 Full Source Code Provided

---

# 🧪 `.env` Setup

Create a `.env` file in the **root of the project** and add the following variables:

```bash
DATABASE_URL=your_db_url

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## 🔧 Run the App

```bash
npm install
npx expo run:ios or npx expo run:android
```
