import config from "../../config/config.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';


    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken !== 'undefined' && refreshToken !== undefined && refreshToken !== null) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/'
        return false;
    }

    static async Logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken !== 'undefined' && refreshToken !== undefined) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem('userinfo');
                    return true;
                }
            }
        }

    }
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens(accessToken, refreshToken) {
        localStorage.removeItem(this.accessTokenKey, accessToken);
        localStorage.removeItem(this.refreshTokenKey, refreshToken);
    }

    static setUserInfo(info) {
        localStorage.setItem('userinfo', JSON.stringify(info))
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem('userinfo');
        if (userInfo) {
            return JSON.parse(userInfo)
        } else {
            return null;
        }
    }
}