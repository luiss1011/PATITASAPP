async function cargarHistorial() {
  try {
    const citas = await apiRequest("/appointments/admin/historial", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });

    const tbody = document.getElementById("lista-historial");
    tbody.innerHTML = "";

    if (!citas.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">No hay historial</td>
        </tr>`;
      return;
    }

    citas.forEach((cita) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cita.client?.fullName || "N/D"}</td>
        <td>${cita.client?.email || "N/D"}</td>
        <td>${cita.mascota?.nombreMascota || "N/D"}</td>
        <td>${new Date(cita.date).toLocaleString()}</td>

        <td>
            <span class="badge ${cita.status === "cancelada" ? "bg-danger" : "bg-success"}">
            ${cita.status}
            </span>
        </td>

        <td>${cita.diagnostico || "<span class='text-muted'>Sin diagnóstico</span>"}</td>

        <td>${cita.observaciones || "<span class='text-muted'>Sin observaciones</span>"}</td>

        <td>
            ${
                cita.status === "confirmada"
                ? `
                    <button class="btn btn-primary btn-sm"
                    onclick="abrirModalDiagnostico('${cita._id}')">
                    <i class="bi bi-clipboard-heart"></i>
                    </button>
                `
                : `
                    <span class="text-muted">Finalizada</span>
                `
            }
        </td>

        `;


      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarHistorial);

function abrirModalDiagnostico(id) {
  document.getElementById("citaId").value = id;
  new bootstrap.Modal(document.getElementById("modalDiagnostico")).show();
}

async function guardarDiagnostico() {
  const id = document.getElementById("citaId").value;

  const data = {
    diagnostico: document.getElementById("diagnostico").value,
    observaciones: document.getElementById("observaciones").value,
  };

  try {
    // ✅ Loader mientras guarda
    Swal.fire({
      title: "Guardando diagnóstico...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await apiRequest(`/appointments/${id}/diagnostico`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("authToken"),
        "Content-Type": "application/json",
      },
    });

    // ✅ Cierra el modal
    bootstrap.Modal.getInstance(
      document.getElementById("modalDiagnostico")
    ).hide();

    // ✅ Actualiza historial
    cargarHistorial();

    // ✅ Alerta de éxito
    Swal.fire({
      icon: "success",
      title: "Diagnóstico guardado",
      text: "La cita fue finalizada correctamente",
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error("Error al guardar diagnóstico:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar el diagnóstico ❌",
    });
  }
}
