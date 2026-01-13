// Respect Game JavaScript

let currentUsername = '';
let targetUsername = '';
let respectData = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Setup Start Game button FIRST
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        console.log('Start Game button found, adding event listener');
        startGameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start Game button clicked!');
            startGame();
        });
    } else {
        console.error('Start Game button not found!');
    }
    
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

// Make startGame globally accessible
window.startGame = function() {
    console.log('startGame function called!');
    const landingPage = document.getElementById('landingPage');
    const gameContent = document.getElementById('gameContent');
    
    if (!landingPage) {
        console.error('Landing page not found!');
        alert('Landing page element not found');
        return;
    }
    
    if (!gameContent) {
        console.error('Game content not found!');
        alert('Game content element not found');
        return;
    }
    
    console.log('Elements found, starting transition...');
    
    // Fade out landing page
    landingPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        console.log('Hiding landing page, showing game content...');
        landingPage.style.display = 'none';
        
        // Show game content with animation
        gameContent.style.display = 'block';
        gameContent.style.opacity = '0';
        gameContent.style.transform = 'translateY(20px)';
        
        // Force reflow
        void gameContent.offsetHeight;
        
        setTimeout(() => {
            gameContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            gameContent.style.opacity = '1';
            gameContent.style.transform = 'translateY(0)';
            console.log('Game content should now be visible!');
        }, 50);
    }, 600);
};

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
    
    // Initialize user in Count database
    try {
        respectDB.getUserData(username.toLowerCase());
        console.log(`User ${username} initialized in Count database`);
    } catch (err) {
        console.error('Error initializing user:', err);
    }
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
    console.log('Opening respect modal for:', username);
    targetUsername = username;
    const modal = document.getElementById('respectModal');
    const targetUserEl = document.getElementById('targetUser');
    
    if (!modal) {
        console.error('Respect modal not found!');
        return;
    }
    
    if (targetUserEl) {
        targetUserEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    modal.classList.add('show');
    
    // Add event listeners to buttons directly
    const plusBtn = document.querySelector('.btn-respect-plus');
    const minusBtn = document.querySelector('.btn-respect-minus');
    
    if (plusBtn) {
        plusBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Plus button clicked directly');
            submitRespect('++');
        };
    }
    
    if (minusBtn) {
        minusBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Minus button clicked directly');
            submitRespect('--');
        };
    }
    
    console.log('Modal should now be visible');
}

function closeRespectModal() {
    const modal = document.getElementById('respectModal');
    if (modal) {
        modal.classList.remove('show');
    }
    targetUsername = '';
    console.log('Modal closed');
}

// Make closeRespectModal globally accessible
window.closeRespectModal = closeRespectModal;

// Make submitRespect globally accessible
window.submitRespect = function(type) {
    console.log('=== submitRespect called ===');
    console.log('Type:', type);
    console.log('Current username:', currentUsername);
    console.log('Target username:', targetUsername);
    
    if (!targetUsername) {
        console.error('No target username set');
        alert('Error: No target user selected');
        return;
    }
    
    if (!currentUsername) {
        alert('Please enter your name first!');
        closeRespectModal();
        return;
    }

    console.log('Submitting respect to Count database:', {
        from: currentUsername,
        to: targetUsername,
        type: type
    });
    
    // Disable buttons to prevent double-clicking
    const plusBtn = document.getElementById('respectPlusBtn');
    const minusBtn = document.getElementById('respectMinusBtn');
    if (plusBtn) plusBtn.disabled = true;
    if (minusBtn) minusBtn.disabled = true;
    
    try {
        // Save directly to Count database (localStorage)
        const count = respectDB.giveRespect(currentUsername, targetUsername, type);
        
        console.log('✅ Respect saved to Count database:', count);
        
        // Success message
        addActivity(`✅ ${currentUsername} gave ${type} to ${targetUsername}`, 
                   type === '++' ? 'respect-plus' : 'respect-minus');
        
        // Reload data and update UI
        loadRespectData();
        updateLeaderboard();
        
        // Close modal
        closeRespectModal();
        
        console.log('Respect submitted successfully to Count database!');
    } catch (error) {
        console.error('Error submitting respect:', error);
        alert('Failed to submit respect: ' + error.message);
        
        // Re-enable buttons
        if (plusBtn) plusBtn.disabled = false;
        if (minusBtn) minusBtn.disabled = false;
    }
};

function showRespectCount(username) {
    console.log(`Fetching respect count from Count database for: ${username}`);
    
    try {
        // Get data directly from Count database (localStorage)
        const count = respectDB.getRespectCount(username);
        
        if (count !== null) {
            console.log(`✅ Retrieved from Count database - ${username}:`, count);
            displayRespectBubble(username, count);
            addActivity(`📊 Retrieved count from Count database for ${username}`, 'count-check');
        } else {
            addActivity(`User ${username} not found in Count database`, 'error');
        }
    } catch (error) {
        console.error('Error fetching respect count:', error);
        addActivity('Failed to get respect count from Count database: ' + error.message, 'error');
    }
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
    try {
        // Load directly from Count database (localStorage)
        respectData = respectDB.getAllRespects();
        console.log('Loaded respect data from Count database:', respectData);
        updateLeaderboard();
    } catch (error) {
        console.error('Error loading respect data:', error);
    }
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
