# Deploy Respect Game for Multiplayer

## Option 1: Using ngrok (Quick & Easy)

### Step 1: Install ngrok
Download from: https://ngrok.com/download

### Step 2: Start your server
```bash
python server.py
```

### Step 3: In another terminal, start ngrok
```bash
ngrok http 5001
```

### Step 4: Share the ngrok URL
Copy the forwarding URL (e.g., `https://abc123.ngrok.io`) and share it with friends!

## Option 2: Deploy to Railway (Free)

### Step 1: Create account
Go to: https://railway.app

### Step 2: New Project → Deploy from GitHub
- Connect your GitHub account
- Select the Respect-Game repository
- Railway will auto-detect Python

### Step 3: Add environment variables
- PORT: 5001 (or let Railway assign)

### Step 4: Deploy!
Railway will give you a public URL like: `https://respect-game.railway.app`

## Option 3: Deploy to Render (Free)

### Step 1: Create account
Go to: https://render.com

### Step 2: New Web Service
- Connect GitHub repository
- Build command: `pip install -r requirements.txt`
- Start command: `python server.py`

### Step 3: Get public URL
Render will provide: `https://respect-game.onrender.com`

## Option 4: Deploy to Heroku

### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Login
```bash
heroku login
```

### Step 3: Create app
```bash
cd respect
heroku create respect-game
```

### Step 4: Create Procfile
Create `Procfile` with:
```
web: python server.py
```

### Step 5: Deploy
```bash
git push heroku main
```

## Option 5: Use PythonAnywhere (Free)

### Step 1: Create account
Go to: https://www.pythonanywhere.com

### Step 2: Upload files
- Upload all files via Files tab
- Install dependencies in Bash console

### Step 3: Create web app
- Go to Web tab
- Create new web app
- Point to your server.py

## Quick Start (Local Network)

If you're on the same network:

1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start server: `python server.py`
3. Share: `http://YOUR_IP:5001`

Example: `http://192.168.1.100:5001`

## Recommended: Railway or Render

Both are free and easy to use. Just connect your GitHub repo and deploy!

---

**Once deployed, share the public URL with friends to play together! 🎮**
