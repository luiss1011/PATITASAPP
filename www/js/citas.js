document.addEventListener("DOMContentLoaded", async () => {
  await cargarCitas();
  await cargarMascotas();
  inicializarFormulario();

  const btnFuturas = document.getElementById("btnToggleFuturas");
  const contFuturas = document.getElementById("citas-futuras");
  const flechaFuturas = document.querySelector(".flecha-futuras");

  const btnPasadas = document.getElementById("btnTogglePasadas");
  const contPasadas = document.getElementById("citas-pasadas");
  const flechaPasadas = document.querySelector(".flecha-pasadas");

  if (btnFuturas && contFuturas) {
    btnFuturas.addEventListener("click", () => {
      contFuturas.classList.toggle("citas-expanded");
      contFuturas.classList.toggle("citas-collapsed");
      flechaFuturas.classList.toggle("flecha-rotada");
    });
  }

  if (btnPasadas && contPasadas) {
    btnPasadas.addEventListener("click", () => {
      contPasadas.classList.toggle("citas-expanded");
      contPasadas.classList.toggle("citas-collapsed");
      flechaPasadas.classList.toggle("flecha-rotada");
    });
  }

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

function inicializarFormulario() {
  const form = document.getElementById("nuevaCitaForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes iniciar sesión",
      });
    }

    const fechaInput = document.getElementById("fecha").value;
    const horaInput = document.getElementById("hora").value;

    const fechaCita = new Date(`${fechaInput}T${horaInput}`);
    const ahora = new Date();

    // Evita que el usuario elija una fecha pasada
    if (fechaCita < ahora) {
      return Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "No puedes agendar una cita en una fecha u hora pasada.",
      });
    }

    const data = {
      mascotaId: document.getElementById("mascota").value,
      fecha: fechaInput,
      hora: horaInput,
      tipoServicio: document.getElementById("tipoServicio").value,
      veterinario: document.getElementById("veterinario").value,
      motivo: document.getElementById("motivo").value,
      notas: document.getElementById("notas").value,
    };

    try {
      await crearCita(data); // ← aquí usamos la función API

      Swal.fire({
        icon: "success",
        title: "Cita agendada",
        text: "Tu cita ha sido registrada correctamente",
      }).then(() => (window.location.href = "./citas.html"));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
  });
}

async function cargarCitas() {
  const contFuturas = document.getElementById("citas-futuras");
  const contPasadas = document.getElementById("citas-pasadas");

  if (!contFuturas) return;

  try {
    const data = await obtenerMisCitas();

    const futuras = Array.isArray(data.futuras) ? data.futuras : [];
    const pasadas = Array.isArray(data.pasadas) ? data.pasadas : [];

    contFuturas.innerHTML = "";
    if (contPasadas) contPasadas.innerHTML = "";

    // ✅ Cargar FUTURAS
    futuras.forEach((cita) => {
      contFuturas.innerHTML += crearCardCita(cita, false);
    });

    // ✅ Cargar PASADAS
    if (contPasadas) {
      pasadas.forEach((cita) => {
        contPasadas.innerHTML += crearCardCita(cita, true);
      });
    }

    // ✅ Mensajes si no hay citas
    if (futuras.length === 0) {
      contFuturas.innerHTML = "<p class='text-muted'>No hay próximas citas.</p>";
    }

    if (pasadas.length === 0 && contPasadas) {
      contPasadas.innerHTML = "<p class='text-muted'>No hay citas pasadas.</p>";
    }

    // ✅ ABRIR FUTURAS POR DEFECTO
    contFuturas.classList.add("citas-expanded");
    contFuturas.classList.remove("citas-collapsed");

    const flechaFuturas = document.querySelector(".flecha-futuras");
    if (flechaFuturas) {
      flechaFuturas.classList.add("flecha-rotada");
    }

  } catch (error) {
    console.error("Error cargando citas:", error);
  }
}


function crearCardCita(cita, pasada = false) {
  const fecha = new Date(cita.date);
  const fechaTexto = fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const horaTexto = fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div class="cita-card loading-fade">
      <div class="cita-card-header">
          <h4><i class="bi bi-calendar-event"></i> ${cita.service}</h4>
          <span class="badge ${pasada ? "bg-secondary" : "bg-primary"}">
            ${fechaTexto}
          </span>
      </div>
      <div class="cita-card-body">
          <p><i class="bi bi-clock"></i> <strong>Hora:</strong> ${horaTexto}</p>
          <p><i class="bi bi-person"></i> <strong>Mascota:</strong> ${
            cita.mascota?.nombreMascota || "Sin nombre"
          }</p>
          <p><i class="bi bi-info-circle"></i> <strong>Motivo:</strong> ${
            cita.motivo
          }</p>

          ${
            cita.veterinario
              ? `<p><i class="bi bi-person-badge"></i> <strong>Veterinario:</strong> ${cita.veterinario}</p>`
              : ""
          }

          <p>
            <i class="bi bi-flag"></i> 
            <strong>Estado:</strong> 
            <span class="badge ${getEstadoClase(cita.status)}">
              ${cita.status}
            </span>
          </p>
      </div>
    </div>
  `;
}

function getEstadoClase(estado) {
  switch (estado) {
    case "pendiente":
      return "bg-warning text-dark";
    case "confirmada":
      return "bg-success";
    case "cancelada":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}
