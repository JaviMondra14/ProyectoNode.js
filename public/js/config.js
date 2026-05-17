// Config dinámico según el ambiente
const API_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // En producción, usa el backend URL (será reemplazado por Netlify)
    return 'https://BACKEND_URL_AQUI/api';
})();

console.log('🔗 API URL:', API_URL);
