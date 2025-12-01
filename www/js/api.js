// api.js — funciones reutilizables
async function apiRequest(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ...' ← añadir si usas JWT luego
    }
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR] ${endpoint}:`, error);
    throw error;
  }
}

// Ejemplos de helpers específicos:
async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

async function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

async function crearMascota(mascotaData) {
  return apiRequest('/mascotas/crear', {
    method: 'POST',
    body: JSON.stringify(mascotaData),
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("authToken")
    }
  });
}

// Obtener mascotas del usuario autenticado
async function obtenerMisMascotas() {
  return apiRequest('/mascotas/mis-mascotas', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("authToken")
    }
  });
}


async function crearCita(citaData) {
  return apiRequest('/appointments/crear', {
    method: 'POST',
    body: JSON.stringify(citaData),
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("authToken")
    }
  });
}

async function obtenerMisCitas() {
  return apiRequest('/appointments/mis-citas', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("authToken")
    }
  });
}

async function eliminarMascota(id) {
  return apiRequest(`/mascotas/eliminar/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("authToken")
    }
  });
}

let intervaloRecordatorios = null;

async function actualizarContadorRecordatorios() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    if (intervaloRecordatorios) {
      clearInterval(intervaloRecordatorios);
      intervaloRecordatorios = null;
    }
    return;
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/recordatorios`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.replace("./login.html");
      return;
    }

    const recordatorios = await response.json();
    if (!Array.isArray(recordatorios)) return;

    const pendientes = recordatorios.filter(r => !r.completado);
    const contador = document.getElementById("contadorRecordatorios");
    if (!contador) return;

    contador.textContent = pendientes.length;

  } catch (error) {
    console.error("Error en contador de recordatorios:", error);
  }
}

intervaloRecordatorios = setInterval(actualizarContadorRecordatorios, 60000);
actualizarContadorRecordatorios();


function cerrarSesion() {
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
      window.location.replace("./login.html");
    }
  });
}


function toggleSeccion(id, header) {
  const contenedor = document.getElementById(id);
  const flecha = header.querySelector(".flecha");

  if (!contenedor) return;

  contenedor.classList.toggle("collapsed");
  contenedor.classList.toggle("expanded");
  flecha.classList.toggle("rotada");
}

// ✅ ABRIR AMBAS POR DEFECTO AL CARGAR
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mascotas-contenido")?.classList.add("expanded");
  document.getElementById("citas-futuras")?.classList.add("expanded");
});
