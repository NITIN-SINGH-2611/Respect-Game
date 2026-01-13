"""
Flask Server for Respect Game
Handles API endpoints for respect tracking
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

# Database file
DB_FILE = 'respect_db.json'

def load_database():
    """Load respect data from JSON file"""
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_database(data):
    """Save respect data to JSON file"""
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_user_data(username, db):
    """Get or create user data"""
    if username not in db:
        db[username] = {
            'plus': 0,
            'minus': 0,
            'history': []
        }
    return db[username]

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/set_username', methods=['POST'])
def set_username():
    """Set username for current session"""
    try:
        data = request.json
        username = data.get('username', '').strip().lower()
        
        if not username:
            return jsonify({'success': False, 'error': 'Username required'}), 400
        
        # Initialize user if doesn't exist
        db = load_database()
        get_user_data(username, db)
        save_database(db)
        
        return jsonify({'success': True, 'message': f'Username {username} set'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/give_respect', methods=['POST'])
def give_respect():
    """Give respect to a user"""
    try:
        data = request.json
        from_user = data.get('from', '').strip().lower()
        to_user = data.get('to', '').strip().lower()
        respect_type = data.get('type', '++')
        message = data.get('message', '').strip()
        
        if not from_user or not to_user:
            return jsonify({'success': False, 'error': 'Both from and to usernames required'}), 400
        
        if from_user == to_user:
            return jsonify({'success': False, 'error': 'Cannot give respect to yourself'}), 400
        
        if respect_type not in ['++', '--']:
            return jsonify({'success': False, 'error': 'Invalid respect type'}), 400
        
        # Load database
        db = load_database()
        
        # Get user data
        user_data = get_user_data(to_user, db)
        
        # Update counts
        if respect_type == '++':
            user_data['plus'] = user_data.get('plus', 0) + 1
        else:
            user_data['minus'] = user_data.get('minus', 0) + 1
        
        # Add to history
        if 'history' not in user_data:
            user_data['history'] = []
        
        user_data['history'].append({
            'from': from_user,
            'type': respect_type,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Keep only last 100 history items
        if len(user_data['history']) > 100:
            user_data['history'] = user_data['history'][-100:]
        
        # Save database
        save_database(db)
        
        return jsonify({
            'success': True,
            'message': f'{from_user} gave {respect_type} to {to_user}',
            'count': {
                'plus': user_data['plus'],
                'minus': user_data['minus'],
                'total': user_data['plus'] - user_data['minus']
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get_respect_count/<username>')
def get_respect_count(username):
    """Get respect count for a user"""
    try:
        username = username.strip().lower()
        db = load_database()
        
        if username not in db:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = db[username]
        total = user_data.get('plus', 0) - user_data.get('minus', 0)
        
        return jsonify({
            'success': True,
            'count': {
                'plus': user_data.get('plus', 0),
                'minus': user_data.get('minus', 0),
                'total': total
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get_all_respects')
def get_all_respects():
    """Get all respect data"""
    try:
        db = load_database()
        
        # Format data for frontend
        formatted = {}
        for username, data in db.items():
            formatted[username] = {
                'plus': data.get('plus', 0),
                'minus': data.get('minus', 0),
                'total': data.get('plus', 0) - data.get('minus', 0)
            }
        
        return jsonify({
            'success': True,
            'respects': formatted
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get_history/<username>')
def get_history(username):
    """Get respect history for a user"""
    try:
        username = username.strip().lower()
        db = load_database()
        
        if username not in db:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        history = db[username].get('history', [])
        
        return jsonify({
            'success': True,
            'history': history[-50:]  # Last 50 entries
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    
    print("="*60)
    print("Respect Game Server")
    print("="*60)
    print(f"\nStarting server on http://0.0.0.0:{port}")
    print(f"Local access: http://localhost:{port}")
    print("\nFor multiplayer:")
    print("1. Share your IP address with friends")
    print("2. Or deploy to Railway/Render/Heroku")
    print("3. Or use ngrok for quick sharing")
    print("\nPress Ctrl+C to stop the server\n")
    
    app.run(debug=False, host='0.0.0.0', port=port, threaded=True)
