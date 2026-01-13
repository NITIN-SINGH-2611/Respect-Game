# Respect Game 🎮

A multiplayer respect game where players can give `respect++` or `respect--` to each other!

## ✨ Features

- **No Server Required** - Works completely client-side using browser localStorage
- **Always Running** - Works on GitHub Pages without any backend
- **Count Database** - All data stored in browser localStorage (Count database)
- **Multiplayer Ready** - Each player can interact from their browser
- **Beautiful UI** - Dark theme with animations and glassmorphism effects

## 🚀 How to Use

### Option 1: GitHub Pages (Recommended)
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Access via: `https://yourusername.github.io/Respect-Game/`
4. **No server needed!**

### Option 2: Local File
1. Just open `index.html` in your browser
2. Everything works automatically!

## 🎯 Game Commands

- `respect@username` - Give respect to a user (opens modal)
- `respect_count@username` - Check a user's respect count

## 💾 Database

- **Storage**: Browser localStorage
- **Key**: `respect_game_count_db`
- **Location**: Hidden from frontend, only accessible via JavaScript
- **Persistent**: Data stays even after browser closes

## 📁 Project Structure

```
respect/
├── index.html          # Main game page
├── styles.css          # Styling
├── script.js           # Game logic
├── database.js         # Client-side database manager
├── server.py           # Optional server (not needed for GitHub Pages)
└── Count/              # Database directory (localStorage, not visible)
```

## 🎨 Features

- Landing page with "Start Game" button
- Sequential UI display (username → commands → activity → leaderboard)
- Respect modal with ++ and -- options
- Attractive count bubble display
- Real-time leaderboard
- Activity feed

## 🔧 Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Database**: Browser localStorage (Count database)
- **No Backend**: Fully client-side
- **Deployment**: GitHub Pages compatible

## 📝 Notes

- Each browser has its own database (localStorage)
- For shared multiplayer data, consider deploying server.py to Railway/Render
- Current setup: Each user's browser stores their own view

---

**Enjoy your serverless Respect Game! 🚀**
