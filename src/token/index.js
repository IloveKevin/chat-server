const tokenMap = new Map();

const setToken = (key, token) => {
    tokenMap.set(key, token);
}

const getToken = (key) => {
    return tokenMap.get(key);
}

export { setToken, getToken };