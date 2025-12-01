function formatearFecha(fechaISO) {
  if (!fechaISO) return "Sin registrar";

  const fecha = new Date(fechaISO);

  const opciones = { day: "2-digit", month: "short", year: "numeric" };

  return fecha.toLocaleDateString("es-MX", opciones).replace(".", ""); // quita el punto de "nov."
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  const contenedor = document.getElementById("lista-mascotas");

  try {
    const mascotas = await obtenerMisMascotas(); // ⭐ YA USA CONFIG AUTOMÁTICAMENTE

    contenedor.innerHTML = "";

    if (mascotas.length === 0) {
      contenedor.innerHTML = `<p>No tienes mascotas registradas.</p>`;
      return;
    }

    mascotas.forEach((m) => {
      const card = `
        <div class="mascota-card loading-fade">
            <div class="mascota-card-header">
                <h4><i class="bi bi-${
                  m.tipoMascota === "gato" ? "heart" : "dog"
                }"></i> ${m.nombreMascota}</h4>
                <span class="badge bg-success">Activo</span>
            </div>
            <div class="mascota-card-body">
                <p><i class="bi bi-tag"></i> <strong>Raza:</strong> ${
                  m.raza || "N/A"
                }</p>
                <p><i class="bi bi-calendar"></i> <strong>Edad:</strong> ${m.edad || "N/A"} años</p>
                <p><i class="bi bi-gender-${
                  m.sexo === "Hembra" ? "female" : "male"
                }"></i> <strong>Sexo:</strong> ${m.sexo}</p>
                <p><i class="bi bi-shield-check"></i> <strong>Última vacuna:</strong> ${formatearFecha(
                  m.vacunas
                )}</p>
                <p><i class="bi bi-file-medical"></i> <strong>Notas:</strong> ${
                  m.notas || "Sin notas"
                }</p>
                <button class="btn btn-danger" data-id="${m._id}">
                  🗑 Eliminar
                </button>
            </div>
        </div>
    `;
      contenedor.innerHTML += card;
    });
  } catch (error) {
    console.error("Error:", error);
    contenedor.innerHTML = `<p>Error cargando mascotas.</p>`;
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-danger")) {
    const mascotaId = e.target.dataset.id;

    const confirm = await Swal.fire({
      title: "¿Eliminar mascota?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      await eliminarMascota(mascotaId);
      Swal.fire("Eliminada", "La mascota fue eliminada", "success");

      // Recarga la lista automáticamente
      cargarMascotas();

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
});

async function cargarMascotas() {
  const contenedor = document.getElementById("lista-mascotas");

  try {
    const mascotas = await obtenerMisMascotas();

    contenedor.innerHTML = "";

    if (mascotas.length === 0) {
      contenedor.innerHTML = `<p>No tienes mascotas registradas.</p>`;
      return;
    }

    mascotas.forEach((m) => {
      const card = `
        <div class="mascota-card loading-fade">
            <div class="mascota-card-header">
                <h4><i class="bi bi-${
                  m.tipoMascota === "gato" ? "heart" : "dog"
                }"></i> ${m.nombreMascota}</h4>
                <span class="badge bg-success">Activo</span>
            </div>
            <div class="mascota-card-body">
                <p><i class="bi bi-tag"></i> <strong>Raza:</strong> ${m.raza || "N/A"}</p>
                <p><i class="bi bi-calendar"></i> <strong>Edad:</strong> ${m.edad || "N/A"} años</p>
                <p><i class="bi bi-gender-${
                  m.sexo === "Hembra" ? "female" : "male"
                }"></i> <strong>Sexo:</strong> ${m.sexo}</p>
                <p><i class="bi bi-shield-check"></i> <strong>Última vacuna:</strong> ${formatearFecha(m.vacunas)}</p>
                <p><i class="bi bi-file-medical"></i> <strong>Notas:</strong> ${m.notas || "Sin notas"}</p>

                <button class="btn btn-danger" data-id="${m._id}">
                  🗑 Eliminar
                </button>
            </div>
        </div>
      `;
      contenedor.innerHTML += card;
    });
  } catch (error) {
    contenedor.innerHTML = `<p>Error cargando mascotas.</p>`;
    console.error(error);
  }
}
