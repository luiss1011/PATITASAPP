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

        const formData = {
            nombreMascota: document.getElementById("nombreMascota").value,
            tipoMascota: document.getElementById("tipoMascota").value,
            raza: document.getElementById("raza").value,
            edad: document.getElementById("edad").value,
            sexo: document.getElementById("sexo").value,
            peso: document.getElementById("peso").value,
            color: document.getElementById("color").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            notas: document.getElementById("notas").value,
            vacunas: document.getElementById("vacunas").value
        };

        try {
            // ⭐ Usa api.js (NO fetch directo)
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
