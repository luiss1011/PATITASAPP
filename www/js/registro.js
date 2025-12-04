document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return;

  // Cargar sistema de seguridad
  const securityScript = document.createElement('script');
  securityScript.src = '../js/form-security.js';
  document.head.appendChild(securityScript);

  securityScript.onload = () => {
    // Inicializar validación en tiempo real
    if (window.FormSecurity) {
      window.FormSecurity.initRealTimeValidation('registroForm', {
        username: { type: 'name', required: true, label: 'Nombre de usuario' },
        fullName: { type: 'name', required: true, label: 'Nombre completo' },
        email: { type: 'email', required: true, label: 'Correo electrónico' },
        phone: { type: 'phone', required: false, label: 'Teléfono' },
        password: { type: 'password', required: true, label: 'Contraseña' },
        'confirm-password': { type: 'password', required: true, label: 'Confirmar contraseña' }
      });
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación de seguridad
    if (window.FormSecurity) {
      const validation = window.FormSecurity.validateForm('registroForm', {
        username: { type: 'name', required: true, label: 'Nombre de usuario' },
        fullName: { type: 'name', required: true, label: 'Nombre completo' },
        email: { type: 'email', required: true, label: 'Correo electrónico' },
        phone: { type: 'phone', required: false, label: 'Teléfono' },
        password: { type: 'password', required: true, label: 'Contraseña' },
        'confirm-password': { type: 'password', required: true, label: 'Confirmar contraseña' },
        confirmPassword: true
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

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#2C5F7C'
      });
      return;
    }

    // Sanitizar datos
    const sanitize = window.FormSecurity ? window.FormSecurity.sanitizeInput : (val) => val;
    
    const userData = {
      username: sanitize(document.getElementById('username').value.trim()),
      fullName: sanitize(document.getElementById('fullName').value.trim()),
      email: sanitize(document.getElementById('email').value.trim()),
      phone: sanitize(document.getElementById('phone').value.trim() || ''),
      password: password
    };

try {
  // 1. Registrar usuario
  const data = await registerUser(userData);

  // 2. Hacer autologin inmediatamente
  const loginData = await loginUser({
    email: userData.email,
    password: userData.password
  });

  // 3. Guardar token y usuario del login real
  localStorage.setItem("authToken", loginData.token);
  localStorage.setItem("user", JSON.stringify(loginData.user));

  Swal.fire({
    icon: 'success',
    title: '¡Registro exitoso!',
    text: 'Bienvenido a Veterinaria Patitas',
    timer: 2500,
    showConfirmButton: false
  });

  // 4. Redirigir según rol
  setTimeout(() => {
    if (loginData.user.role === "admin") {
      window.location.href = "./consultas.html";
    } else {
      window.location.href = "../index.html";
    }
  }, 2000);

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: err.message,
      confirmButtonColor: '#2C5F7C'
    });
  }

  });
});