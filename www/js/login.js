document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  // Cargar sistema de seguridad
  const securityScript = document.createElement('script');
  securityScript.src = '../js/form-security.js';
  document.head.appendChild(securityScript);

  securityScript.onload = () => {
    // Inicializar validación en tiempo real
    if (window.FormSecurity) {
      window.FormSecurity.initRealTimeValidation('loginForm', {
        email: { type: 'email', required: true, label: 'Correo electrónico' },
        password: { type: 'password', required: true, label: 'Contraseña' }
      });
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validación de seguridad
    if (window.FormSecurity) {
      const validation = window.FormSecurity.validateForm('loginForm', {
        email: { type: 'email', required: true, label: 'Correo electrónico' },
        password: { type: 'password', required: true, label: 'Contraseña' }
      });

      if (!validation.valid) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          html: validation.errors.join('<br>'),
          confirmButtonColor: '#2C5F7C'
        });
        return;
      }
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa email y contraseña',
        confirmButtonColor: '#2C5F7C'
      });
      return;
    }

    const credentials = { email, password };

    try {
      // ✅ Usando el helper de api.js (recomendado)
      // const data = await loginUser(credentials);
      const data = await loginUser(credentials);

      // ✅ ¡Login exitoso!
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `${data.user.fullName || data.user.username}`,
        timer: 5000,
        showConfirmButton: false,
      });

      // 👇 Guardar token y datos del usuario (ej: en localStorage)
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir al dashboard o home
      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "./consultas.html";
        } else {
          window.location.href = "../index.html";
        }
      }, 2000);
    } catch (err) {
    console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: err.message,
      });
    }
  });
});
