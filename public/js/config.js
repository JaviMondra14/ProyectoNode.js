const API_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }

    return 'https://proyectonodejs-production.up.railway.app/';
})();

console.log('API URL:', API_URL);
