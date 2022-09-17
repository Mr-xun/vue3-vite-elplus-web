const localDB = {
    save(key, value) {
        if (Object.prototype.toString.call(value) == "[object Object]") {
            value = JSON.stringify(value);
        }
        if (Object.prototype.toString.call(value) == "[object Array]") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    },
    get(key, defaultValue = null) {
        let result = localStorage.getItem(key) || defaultValue;
        try {
            result = JSON.parse(result);
        } catch (error) {
            result = result;
        }
        return result;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
};
const sessionDB = {
    save(key, value) {
        if (Object.prototype.toString.call(value) == "[object Object]") {
            value = JSON.stringify(value);
        }
        if (Object.prototype.toString.call(value) == "[object Array]") {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    },
    get(key, defaultValue = null) {
        let result = sessionStorage.getItem(key) || defaultValue;
        try {
            result = JSON.parse(result);
        } catch (error) {
            result = result;
        }
        return result;
    },
    remove(key) {
        sessionStorage.removeItem(key);
    },
    clear() {
        sessionStorage.clear();
    },
};
export { localDB, sessionDB };
