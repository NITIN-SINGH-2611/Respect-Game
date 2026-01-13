/**
 * Client-Side Database Manager
 * Stores respect data in browser localStorage (Count database)
 * No server needed - works on GitHub Pages!
 */

class RespectDatabase {
    constructor() {
        this.dbKey = 'respect_game_count_db';
        this.ensureDatabase();
    }

    ensureDatabase() {
        if (!localStorage.getItem(this.dbKey)) {
            localStorage.setItem(this.dbKey, JSON.stringify({}));
            console.log('Created new Count database in localStorage');
        }
    }

    loadDatabase() {
        try {
            const data = localStorage.getItem(this.dbKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Error loading database:', e);
        }
        return {};
    }

    saveDatabase(data) {
        try {
            localStorage.setItem(this.dbKey, JSON.stringify(data));
            console.log('✅ Saved to Count database (localStorage)');
            return true;
        } catch (e) {
            console.error('Error saving database:', e);
            return false;
        }
    }

    getUserData(username) {
        const db = this.loadDatabase();
        if (!db[username]) {
            db[username] = {
                plus: 0,
                minus: 0,
                history: []
            };
            this.saveDatabase(db);
        }
        return db[username];
    }

    giveRespect(fromUser, toUser, type) {
        const db = this.loadDatabase();
        const userData = this.getUserData(toUser);
        
        // Update counts
        if (type === '++') {
            userData.plus = (userData.plus || 0) + 1;
        } else if (type === '--') {
            userData.minus = (userData.minus || 0) + 1;
        }

        // Add to history
        if (!userData.history) {
            userData.history = [];
        }
        userData.history.push({
            from: fromUser,
            type: type,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 history items
        if (userData.history.length > 100) {
            userData.history = userData.history.slice(-100);
        }

        // Save back to database
        db[toUser] = userData;
        this.saveDatabase(db);

        return {
            plus: userData.plus || 0,
            minus: userData.minus || 0,
            total: (userData.plus || 0) - (userData.minus || 0)
        };
    }

    getRespectCount(username) {
        const db = this.loadDatabase();
        if (!db[username]) {
            return null;
        }
        const userData = db[username];
        return {
            plus: userData.plus || 0,
            minus: userData.minus || 0,
            total: (userData.plus || 0) - (userData.minus || 0)
        };
    }

    getAllRespects() {
        const db = this.loadDatabase();
        const result = {};
        for (const username in db) {
            const userData = db[username];
            result[username] = {
                plus: userData.plus || 0,
                minus: userData.minus || 0,
                total: (userData.plus || 0) - (userData.minus || 0)
            };
        }
        return result;
    }

    clearDatabase() {
        localStorage.removeItem(this.dbKey);
        this.ensureDatabase();
        console.log('Count database cleared');
    }
}

// Global database instance
const respectDB = new RespectDatabase();
