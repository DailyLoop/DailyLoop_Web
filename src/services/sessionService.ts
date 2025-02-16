import { v4 as uuidv4 } from 'uuid';

class SessionService {
    private static SESSION_KEY = 'news_session_id';

    static initSession(): string {
        let sessionId = localStorage.getItem(this.SESSION_KEY);
        if (!sessionId) {
            sessionId = uuidv4();
            localStorage.setItem(this.SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    static getSessionId(): string | null {
        return localStorage.getItem(this.SESSION_KEY);
    }

    static clearSession(): void {
        localStorage.removeItem(this.SESSION_KEY);
    }
}

export default SessionService;