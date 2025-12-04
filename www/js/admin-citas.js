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
  if (!confirm("¿Deseas aceptar esta cita?")) return;

  await apiRequest(`/appointments/${id}/accept`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("authToken")
    }
  });

  cargarCitas();
}


// ============================
// RECHAZAR CITA
// ============================

async function rechazarCita(id) {
  if (!confirm("¿Deseas rechazar esta cita?")) return;

  await apiRequest(`/appointments/${id}/reject`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("authToken")
    }
  });

  cargarCitas();
}


// ============================
// AUTO CARGA
// ============================

document.addEventListener("DOMContentLoaded", cargarCitas);
