document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("listaRecordatorios");
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${CONFIG.API_BASE_URL}/recordatorios`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  contenedor.innerHTML = "";

  if (data.length === 0) {
    contenedor.innerHTML = "<p>No tienes recordatorios</p>";
    return;
  }

  data.forEach(rec => {
    const fecha = new Date(rec.fechaHora).toLocaleString();

    contenedor.innerHTML += `
      <div class="cita-card loading-fade ${rec.completado ? 'opacity-50' : ''}">
        <div class="cita-card-header">
          <h4>${rec.titulo}</h4>
        </div>
        <div class="cita-card-body">
          <p><strong>Fecha:</strong> ${fecha}</p>
          <p>${rec.descripcion}</p>

          <div class="d-flex gap-2 mt-2">
            ${!rec.completado ? `
              <button class="btn btn-success btn-sm" onclick="completar('${rec._id}')">
                ✅ Completar
              </button>` : ""}

            <button class="btn btn-danger btn-sm" onclick="eliminar('${rec._id}')">
              🗑 Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  });
});

async function completar(id) {
  const confirmacion = await Swal.fire({
    title: "¿Marcar como completado?",
    text: "Este recordatorio se marcará como finalizado.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, completar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const token = localStorage.getItem("authToken");

    await fetch(`${CONFIG.API_BASE_URL}/recordatorios/${id}/completar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    Swal.fire("Listo", "Recordatorio completado", "success")
      .then(() => location.reload());

  } catch (error) {
    console.error(error);
    Swal.fire("Error ❌", "No se pudo completar el recordatorio", "error");
  }
}


async function eliminar(id) {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar recordatorio?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const token = localStorage.getItem("authToken");

    await fetch(`${CONFIG.API_BASE_URL}/recordatorios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    Swal.fire("Eliminado 🗑️", "Recordatorio eliminado", "info")
      .then(() => location.reload());

  } catch (error) {
    console.error(error);
    Swal.fire("Error ❌", "No se pudo eliminar el recordatorio", "error");
  }
}

