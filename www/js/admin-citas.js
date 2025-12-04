// ============================
// CARGAR TODAS LAS CITAS (ADMIN)
// ============================

async function cargarCitas() {
  try {
    const citas = await apiRequest("/appointments/admin", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("authToken")
      }
    });

    const tbody = document.getElementById("lista-citas");
    tbody.innerHTML = "";

    if (!citas.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted py-4">
            No hay citas registradas.
          </td>
        </tr>`;
      return;
    }

    citas.forEach(cita => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <strong>${cita.mascota?.nombreMascota  || "Sin nombre"}</strong><br>
          <small class="text-muted">${cita.mascota?.tipoMascota || ""}</small>
        </td>

        <td>
          ${cita.client?.fullName || "N/A"} <br>
          <small class="text-muted">${cita.client?.email || ""}</small>
        </td>

        <td>${new Date(cita.date).toLocaleString()}</td>

        <td>${cita.service}</td>

        <td>${cita.motivo}</td>

        <td>${cita.veterinario || "<span class='text-muted'>No asignado</span>"}</td>

        <td>
          <span class="badge 
            ${cita.status === "pendiente" ? "bg-warning text-dark" : ""}
            ${cita.status === "confirmada" ? "bg-success" : ""}
            ${cita.status === "cancelada" ? "bg-danger" : ""}">
            ${cita.status}
          </span>
        </td>

        <td class="text-center">
          <button class="btn btn-success btn-sm me-2"
            onclick="aceptarCita('${cita._id}')"
            ${cita.status !== "pendiente" ? "disabled" : ""}>
            <i class="bi bi-check-circle"></i>
          </button>

          <button class="btn btn-danger btn-sm"
            onclick="rechazarCita('${cita._id}')"
            ${cita.status !== "pendiente" ? "disabled" : ""}>
            <i class="bi bi-x-circle"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error al cargar citas:", error);
  }
}


// ============================
// ACEPTAR CITA
// ============================

async function aceptarCita(id) {
  const result = await Swal.fire({
    title: "¿Confirmar cita?",
    text: "Se notificará al cliente por correo",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  try {
    await apiRequest(`/appointments/${id}/accept`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("authToken")
      }
    });

    Swal.fire({
      icon: "success",
      title: "Cita confirmada",
      text: "Correo enviado correctamente",
      timer: 2000,
      showConfirmButton: false
    });

    cargarCitas();

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo confirmar la cita"
    });
  }
}



// ============================
// RECHAZAR CITA
// ============================

async function rechazarCita(id) {
  const result = await Swal.fire({
    title: "¿Rechazar cita?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  try {
    await apiRequest(`/appointments/${id}/reject`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("authToken")
      }
    });

    Swal.fire({
      icon: "success",
      title: "Cita cancelada",
      text: "Se notificó al cliente por correo",
      timer: 2000,
      showConfirmButton: false
    });

    cargarCitas();

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cancelar la cita"
    });
  }
}



// ============================
// AUTO CARGA
// ============================

document.addEventListener("DOMContentLoaded", cargarCitas);
