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
