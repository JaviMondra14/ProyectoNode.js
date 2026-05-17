// Configuración dinámica de API_URL basada en el entorno
const API_URL = (() => {
    const hostname = window.location.hostname;
    
    // En desarrollo local, siempre usar puerto 3000 (Express)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }

    // En producción (Railway, etc.), usar el mismo dominio que sirve el frontend
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}/api`;
})();
