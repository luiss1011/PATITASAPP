document.addEventListener("DOMContentLoaded", () => {
  cargarPerfil();
});

// ================================
//  CARGAR PERFIL DEL USUARIO
// ================================
async function cargarPerfil() {
  try {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${CONFIG.API_BASE_URL}/users/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return Swal.fire("Error", data.message, "error");
    }

    // MOSTRAR DATOS EN VISTA
    document.getElementById("nombreUsuario").textContent = data.fullName;
    document.getElementById("userName").textContent = data.username;
    document.getElementById("emailUsuario").textContent = data.email;
    document.getElementById("telefonoUsuario").textContent =
      data.phone || "No registrado";

    // CARGAR EN FORMULARIO
    document.getElementById("editNombre").value = data.fullName;
    document.getElementById("editUserName").value = data.username;
    document.getElementById("editEmail").value = data.email;
    document.getElementById("editTelefono").value = data.phone || "";
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    Swal.fire("Error", "No se pudo cargar el perfil", "error");
  }
}

// ================================
//  MOSTRAR / OCULTAR FORMULARIO
// ================================
function toggleEdicion() {
  document.getElementById("datosUsuario").style.display = "none";
  document.getElementById("formularioEdicion").style.display = "block";
  document.getElementById("btnEditar").style.display = "none";
}

function cancelarEdicion() {
  document.getElementById("datosUsuario").style.display = "block";
  document.getElementById("formularioEdicion").style.display = "none";
  document.getElementById("btnEditar").style.display = "inline-block";
}

// ================================
//  VALIDACIONES
// ================================
function validarFormulario({ fullName, username, email, phone }) {
  // ✅ Nombre: SOLO letras y espacios
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!fullName || !nameRegex.test(fullName)) {
    return "El nombre solo debe contener letras";
  }

  if (fullName.length < 5) {
    return "El nombre debe tener al menos 5 caracteres";
  }

  // ✅ Username sin espacios
  if (!username || username.includes(" ")) {
    return "El nombre de usuario no debe contener espacios";
  }

  // ✅ Correo válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Correo electrónico no válido";
  }

  // ✅ Teléfono: SOLO números y EXACTAMENTE 10
  if (!/^\d{10}$/.test(phone)) {
    return "El teléfono debe contener exactamente 10 números";
  }

  return null;
}

// ================================
//  GUARDAR CAMBIOS
// ================================
async function guardarCambios(e) {
  e.preventDefault();

  const fullName = document.getElementById("editNombre").value.trim();
  const username = document.getElementById("editUserName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editTelefono").value.trim();

  // VALIDAR DATOS
  const error = validarFormulario({ fullName, username, email, phone });
  if (error) {
    return Swal.fire("Validación", error, "warning");
  }

  // ✅ CONFIRMACIÓN ANTES DE GUARDAR
  const confirm = await Swal.fire({
    title: "¿Guardar cambios?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
  });

  if (!confirm.isConfirmed) return;

  try {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${CONFIG.API_BASE_URL}/users/perfil`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        username,
        email,
        phone,
      }),
    });

    const result = await res.json(); // ✅ AHORA SÍ LEES LA RESPUESTA

    if (!res.ok) {
      return Swal.fire("Error", result.message, "error");
    }

    Swal.fire("Éxito", "Perfil actualizado correctamente", "success");

    // ✅ ACTUALIZAR VISTA SIN RECARGAR
    document.getElementById("nombreUsuario").textContent = result.usuario.fullName;
    document.getElementById("userName").textContent = result.usuario.username;
    document.getElementById("emailUsuario").textContent = result.usuario.email;
    document.getElementById("telefonoUsuario").textContent =
      result.usuario.phone || "No registrado";

    cancelarEdicion();

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    Swal.fire("Error", "Error al guardar cambios", "error");
  }
}

