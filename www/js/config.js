//  Configuración global de la app
const CONFIG = {
  //  Cambia según el entorno:
  // - En desarrollo (emulador o navegador): usar IP local o localhost
  // - En dispositivo físico: usa la IP de tu máquina (no localhost)
  // - En producción: usa tu dominio y HTTPS

  // API_BASE_URL: 'https://acquire-car-comparative-singing.trycloudflare.com/api', // CAMBIA ESTA IP
   API_BASE_URL: 'http://localhost:3000/api',   // producción
};

// 👇 Opcional: detectar si es Cordova (dispositivo real)
if (typeof cordova !== 'undefined') {
  // En dispositivo real, localhost apunta al dispositivo → no sirve
  // Usa IP de tu servidor local (si la API está en tu PC)
  // O mejor: usa un túnel como ngrok para pruebas remotas
}

// Exportar (en entorno browser, no hay module.exports, así que solo la constante global)
// Si usas ES6 modules, puedes hacer `export { CONFIG }`, pero Cordova clásico usa scripts globales

function cerrarSesionIndex() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    text: "Tu sesión se cerrará de forma segura",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ BORRAR TODO LO SENSIBLE
      localStorage.removeItem("authToken");
      localStorage.clear();

      // ✅ EVITA REGRESAR CON BOTÓN ATRÁS
      window.location.replace("./pages/login.html");
    }
  });
}
