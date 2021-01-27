// Some abstraction for document.cookie handling

export default class CookieManager {
    constructor(duration = 365 * 24 * 3600) {
        this.cookieDuration = duration;
    }
    
    get(key) {
        const value = document.cookie.split(';')
                                     .find(s => s.indexOf(key + '=') !== -1);
        return value ? 
              value.replace(key + '=', '').trim() 
            : false;
    }
    write(dict, duration = this.cookieDuration) {
        const dateStr = new Date(Date.now() + duration * 1000)
                            .toUTCString();

        Object.entries(dict)
        .forEach(([k, v]) => {
            document.cookie = `${k}=${v}; path=/; expires=${dateStr}`;
        });
    }

    clear() {        
        document.cookie.split(';')
        .forEach(s => {
            const k = s.split('=')[0];
            document.cookie = `${k}=; path=/`;
        });
    }
}
