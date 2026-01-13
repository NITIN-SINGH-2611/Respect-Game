# 🎮 Respect Game

A fun, interactive game where players can give respect points to each other!

## 🎯 How to Play

1. **Enter your name** and click "Join Game"
2. **Give respect** by typing: `respect@username`
3. **Check counts** by typing: `respect_count@username`
4. **Compete** on the leaderboard!

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd respect
pip install -r requirements.txt
```

### Step 2: Start the Server

```bash
python server.py
```

Or on Windows:
```bash
start_server.bat
```

### Step 3: Open in Browser

Go to: **http://localhost:5001**

## 🎮 Game Commands

- `respect@username` - Give respect to a user (opens prompt for ++ or --)
- `respect_count@username` - Check someone's respect count (shows attractive bubble)

## ✨ Features

- 🎨 Beautiful, game-like interface
- 📊 Real-time leaderboard
- 💬 Activity feed
- 🎯 Respect tracking (++ and --)
- 📈 Graph database storage (JSON-based)
- 🎪 Attractive bubble animations for count display
- 👥 Multi-player support

## 🏆 Leaderboard

The leaderboard shows:
- Rank (with gold/silver/bronze for top 3)
- Player name
- Total respect count
- Breakdown of ++ and --

## 📝 How It Works

1. Players join by entering their name
2. Players can give `respect++` or `respect--` to others
3. All counts are stored in a JSON database
4. Leaderboard updates in real-time
5. Respect counts can be viewed with attractive bubble animations

## 🎨 Features

- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Leaderboard refreshes automatically
- **Beautiful Animations**: Smooth transitions and effects
- **Activity Log**: See all game activities
- **Respect History**: Track who gave respect to whom

## 🔧 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Flask (Python)
- **Database**: JSON file (can be upgraded to Neo4j)
- **Port**: 5001 (to avoid conflict with job bot)

## 📁 Project Structure

```
respect/
├── index.html          # Main game interface
├── styles.css          # Beautiful styling
├── script.js           # Game logic
├── server.py           # Flask backend
├── requirements.txt    # Python dependencies
├── respect_db.json     # Database (auto-created)
└── README.md           # This file
```

## 🎯 Example Gameplay

1. Shashank joins: Enters "shashank"
2. Nitin joins: Enters "nitin"
3. Shashank types: `respect@nitin`
4. Prompt opens: Shashank clicks "Respect ++"
5. Nitin's count increases!
6. Shashank types: `respect_count@nitin`
7. Beautiful bubble shows Nitin's total respect!

## 🚀 Future Enhancements

- [ ] Upgrade to Neo4j graph database
- [ ] User authentication
- [ ] Respect reasons/categories
- [ ] Achievements and badges
- [ ] Chat system
- [ ] Teams/groups
- [ ] Respect streaks

---

**Have fun and show respect! 🎮✨**
