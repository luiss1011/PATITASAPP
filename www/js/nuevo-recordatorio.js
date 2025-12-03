document.addEventListener("DOMContentLoaded", () => {
  cargarMascotas();
  const form = document.getElementById("nuevoRecordatorioForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const mascota = document.getElementById("mascota").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const tipo = document.getElementById("tipo").value;
    const notas = document.getElementById("notas").value;

    if (!hora || !mascota) {
      return Swal.fire("Error", "Debes seleccionar una mascota y una hora", "error");
    }

    const data = {
      titulo,
      mascota,
      descripcion: `${tipo} - ${notas}`,
      fecha,
      hora
    };


    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${CONFIG.API_BASE_URL}/recordatorios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        return Swal.fire("Error", result.message, "error");
      }

      Swal.fire({
        icon: "success",
        title: "Recordatorio Guardado",
        text: "Te llegará el correo exactamente en la fecha programada"
      }).then(() => {
        window.location.href = "./recordatorios.html";
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error de servidor", "error");
    }
  });
});


async function cargarMascotas() {
  const token = localStorage.getItem("authToken");
  const select = document.getElementById("mascota");

  if (!select) return; // evita error si no está en otra página

  try {
    const mascotas = await obtenerMisMascotas();

    select.innerHTML = `<option value="">Seleccione una mascota</option>`;

    mascotas.forEach((mascota) => {
      select.innerHTML += `
        <option value="${mascota._id}">
          ${mascota.nombreMascota}
        </option>`;
    });
  } catch (error) {
    console.error("Error cargando mascotas:", error);
  }
}
