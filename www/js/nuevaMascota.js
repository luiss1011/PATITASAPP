document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('nuevaMascotaForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'No autenticado',
                text: 'Debes iniciar sesión para registrar mascotas'
            });
            return window.location.href = "./login.html";
        }

        // ==============================
        // ✅ OBTENER DATOS
        // ==============================
        const nombreMascota = document.getElementById("nombreMascota").value.trim();
        const tipoMascota = document.getElementById("tipoMascota").value;
        const raza = document.getElementById("raza").value.trim();
        const edad = document.getElementById("edad").value;
        const sexo = document.getElementById("sexo").value;
        const peso = document.getElementById("peso").value.trim();
        const color = document.getElementById("color").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;
        const notas = document.getElementById("notas").value;
        const fechaVacuna = document.getElementById("vacunas").value;

        // ==============================
        // ✅ VALIDACIONES DE TEXTO
        // ==============================

        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const soloNumeros = /^\d+(\.\d+)?$/;

        if (!soloLetras.test(raza)) {
            return Swal.fire({
                icon: "warning",
                title: "Raza inválida",
                text: "La raza solo debe contener letras"
            });
        }

        if (!soloLetras.test(color)) {
            return Swal.fire({
                icon: "warning",
                title: "Color inválido",
                text: "El color solo debe contener letras"
            });
        }

        if (!soloNumeros.test(peso)) {
            return Swal.fire({
                icon: "warning",
                title: "Peso inválido",
                text: "El peso solo debe contener números"
            });
        }

        // ==============================
        // ✅ VALIDACIÓN FECHA DE NACIMIENTO VS EDAD
        // ==============================

        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);

        let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edadCalculada--;
        }

        if (edadCalculada != edad) {
            return Swal.fire({
                icon: "warning",
                title: "Edad incorrecta",
                text: `La edad no coincide con la fecha de nacimiento. Edad real: ${edadCalculada} años`
            });
        }

        // ==============================
        // ✅ VALIDACIÓN FECHA DE VACUNAS
        // ==============================

        if (fechaVacuna) {
            const fechaVac = new Date(fechaVacuna);

            if (fechaVac > hoy) {
                return Swal.fire({
                    icon: "warning",
                    title: "Fecha de vacuna inválida",
                    text: "La fecha de vacunación no puede ser mayor a la fecha actual"
                });
            }

            if (fechaVac < fechaNac) {
                return Swal.fire({
                    icon: "warning",
                    title: "Fecha de vacuna inválida",
                    text: "La fecha de vacunación no puede ser anterior a la fecha de nacimiento"
                });
            }
        }

        // ==============================
        // ✅ DATOS LIMPIOS PARA ENVÍO
        // ==============================

        const formData = {
            nombreMascota,
            tipoMascota,
            raza,
            edad,
            sexo,
            peso,
            color,
            fechaNacimiento,
            notas,
            vacunas: fechaVacuna
        };

        // ==============================
        // ✅ ENVÍO AL BACKEND
        // ==============================

        try {
            const data = await crearMascota(formData);

            Swal.fire({
                icon: 'success',
                title: '¡Mascota registrada!',
                text: 'La mascota se ha guardado correctamente',
                confirmButtonColor: '#2C5F7C'
            }).then(() => {
                window.location.href = './mascotas.html';
            });

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Error del servidor o conexión.'
            });
        }

    });
});
