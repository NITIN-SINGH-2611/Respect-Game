// Respect Game JavaScript

let currentUsername = '';
let targetUsername = '';
let respectData = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadRespectData();
    updateLeaderboard();
});

function setupEventListeners() {
    // Set username
    document.getElementById('setUsername').addEventListener('click', setUsername);
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') setUsername();
    });

    // Send command
    document.getElementById('sendCommand').addEventListener('click', processCommand);
    document.getElementById('commandInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') processCommand();
    });
}

function setUsername() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter your name!');
        return;
    }

    currentUsername = username.toLowerCase();
    
    // Disable username input
    document.getElementById('username').disabled = true;
    document.getElementById('setUsername').disabled = true;
    document.getElementById('setUsername').textContent = 'Joined ✓';
    document.getElementById('setUsername').style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    // Hide username panel with animation
    const userPanel = document.querySelector('.user-panel');
    userPanel.style.transition = 'opacity 0.5s, transform 0.5s';
    userPanel.style.opacity = '0';
    userPanel.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        userPanel.style.display = 'none';
        
        // Show game sections
        const commandSection = document.querySelector('.command-section');
        const activityFeed = document.querySelector('.activity-feed');
        const leaderboardSection = document.querySelector('.leaderboard-section');
        
        commandSection.style.display = 'block';
        activityFeed.style.display = 'block';
        leaderboardSection.style.display = 'block';
        
        // Add show class for animations
        setTimeout(() => {
            commandSection.classList.add('show');
            activityFeed.classList.add('show');
            leaderboardSection.classList.add('show');
        }, 50);
        
        // Enable command input
        document.getElementById('commandInput').disabled = false;
        document.getElementById('sendCommand').disabled = false;
        document.getElementById('commandInput').focus();
    }, 500);

    addActivity(`🎉 Welcome ${username}! You're now in the game.`, 'info');
    
    // Save to server
    fetch('/api/set_username', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username})
    }).catch(err => {
        console.error('Error setting username:', err);
    });
}

function processCommand() {
    const command = document.getElementById('commandInput').value.trim();
    if (!command) return;

    document.getElementById('commandInput').value = '';

    // Parse command
    if (command.startsWith('respect@')) {
        const username = command.substring(8).trim().toLowerCase();
        if (!username) {
            addActivity('Invalid command. Use: respect@username', 'error');
            return;
        }
        if (username === currentUsername) {
            addActivity('You cannot give respect to yourself!', 'error');
            return;
        }
        openRespectModal(username);
    } else if (command.startsWith('respect_count@')) {
        const username = command.substring(14).trim().toLowerCase();
        if (!username) {
            addActivity('Invalid command. Use: respect_count@username', 'error');
            return;
        }
        showRespectCount(username);
    } else {
        addActivity('Invalid command. Use: respect@username or respect_count@username', 'error');
    }
}

function openRespectModal(username) {
    targetUsername = username;
    document.getElementById('targetUser').textContent = username.charAt(0).toUpperCase() + username.slice(1);
    document.getElementById('respectModal').classList.add('show');
    document.getElementById('respectMessage').value = '';
}

function closeRespectModal() {
    document.getElementById('respectModal').classList.remove('show');
    targetUsername = '';
}

function submitRespect(type) {
    if (!targetUsername) return;

    const message = document.getElementById('respectMessage').value.trim();
    
    // Send to server
    fetch('/api/give_respect', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            from: currentUsername,
            to: targetUsername,
            type: type,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addActivity(`${currentUsername} gave ${type} to ${targetUsername}${message ? ': ' + message : ''}`, 
                       type === '++' ? 'respect-plus' : 'respect-minus');
            loadRespectData();
            updateLeaderboard();
            closeRespectModal();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit respect. Please try again.');
    });
}

function showRespectCount(username) {
    fetch(`/api/get_respect_count/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRespectBubble(username, data.count);
                addActivity(`Checked respect count for ${username}`, 'count-check');
            } else {
                addActivity(`User ${username} not found`, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addActivity('Failed to get respect count', 'error');
        });
}

function displayRespectBubble(username, count) {
    const bubble = document.getElementById('respectBubble');
    const usernameEl = bubble.querySelector('.bubble-username');
    const countEl = bubble.querySelector('.count-number');
    const plusEl = bubble.querySelector('.breakdown-value.positive');
    const minusEl = bubble.querySelector('.breakdown-value.negative');

    usernameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    countEl.textContent = count.total;
    plusEl.textContent = count.plus || 0;
    minusEl.textContent = count.minus || 0;

    // Animate
    bubble.classList.add('show');
    
    // Add pulse animation to number
    countEl.style.animation = 'none';
    setTimeout(() => {
        countEl.style.animation = 'numberPulse 0.5s ease';
    }, 10);
}

function closeRespectBubble() {
    document.getElementById('respectBubble').classList.remove('show');
}

function loadRespectData() {
    fetch('/api/get_all_respects')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                respectData = data.respects;
                updateLeaderboard();
            }
        })
        .catch(error => {
            console.error('Error loading respect data:', error);
        });
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    if (!respectData || Object.keys(respectData).length === 0) {
        leaderboard.innerHTML = '<div class="no-data">No players yet</div>';
        return;
    }

    // Calculate scores
    const players = Object.keys(respectData).map(username => {
        const data = respectData[username];
        const total = (data.plus || 0) - (data.minus || 0);
        return {
            username: username,
            plus: data.plus || 0,
            minus: data.minus || 0,
            total: total
        };
    });

    // Sort by total
    players.sort((a, b) => b.total - a.total);

    // Display
    leaderboard.innerHTML = players.map((player, index) => {
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'gold';
        else if (rank === 2) rankClass = 'silver';
        else if (rank === 3) rankClass = 'bronze';

        const scoreClass = player.total >= 0 ? 'positive' : 'negative';
        const displayName = player.username.charAt(0).toUpperCase() + player.username.slice(1);

        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">#${rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${displayName}</div>
                    <div class="leaderboard-stats">
                        👍 ${player.plus} | 👎 ${player.minus}
                    </div>
                </div>
                <div class="leaderboard-score ${scoreClass}">${player.total > 0 ? '+' : ''}${player.total}</div>
            </div>
        `;
    }).join('');
}

function addActivity(message, type = 'info') {
    const log = document.getElementById('activityLog');
    const time = new Date().toLocaleTimeString();
    
    const item = document.createElement('div');
    item.className = `activity-item ${type}`;
    item.innerHTML = `
        <div class="activity-time">${time}</div>
        <div class="activity-message">${message}</div>
    `;
    
    log.insertBefore(item, log.firstChild);
    
    // Keep only last 50 items
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

// Close modals on outside click
window.addEventListener('click', function(event) {
    const modal = document.getElementById('respectModal');
    if (event.target === modal) {
        closeRespectModal();
    }
});

// Auto-refresh leaderboard every 5 seconds
setInterval(loadRespectData, 5000);
