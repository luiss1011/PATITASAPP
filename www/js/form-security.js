// Sanitización de entrada para prevenir XSS
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Crear un elemento temporal para escapar HTML
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validación de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Validación de teléfono (formato mexicano)
function validatePhone(phone) {
    // Acepta formatos: +52 449-897-5425, 4498975425, (449) 897-5425
    const phoneRegex = /^(\+52\s?)?([0-9]{2,3}[\s\-]?)?[0-9]{3}[\s\-]?[0-9]{4}$/;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(phone) && cleaned.length >= 10 && cleaned.length <= 15;
}

// Validación de contraseña segura
function validatePassword(password) {
    // Mínimo 6 caracteres, al menos una letra y un número
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return password.length >= minLength && hasLetter && hasNumber;
}

// Validación de nombre (solo letras, espacios y algunos caracteres especiales)
function validateName(name) {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.\-']{2,50}$/;
    return nameRegex.test(name.trim());
}

// Validación de texto (prevenir inyección)
function validateText(text, maxLength = 1000) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
}

// Validación de número
function validateNumber(value, min = 0, max = 999999) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Validación de fecha futura
function validateFutureDate(dateString) {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate > now;
}

// Validación de fecha pasada o presente
function validatePastOrPresentDate(dateString) {
    const selectedDate = new Date(dateString);
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Fin del día actual
    return selectedDate <= now;
}

// Limpiar y validar formulario completo
function validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return { valid: false, errors: ['Formulario no encontrado'] };

    const errors = [];
    const formData = {};

    // Validar cada campo según las reglas
    for (const [fieldId, rule] of Object.entries(rules)) {
        const field = form.querySelector(`#${fieldId}`) || form.querySelector(`[name="${fieldId}"]`);
        
        if (!field) {
            if (rule.required) {
                errors.push(`Campo ${fieldId} es requerido pero no se encontró`);
            }
            continue;
        }

        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || fieldId;

        // Validar campo requerido
        if (rule.required && !value) {
            errors.push(`${rule.label || fieldName} es requerido`);
            field.classList.add('is-invalid');
            continue;
        }

        // Si el campo está vacío y no es requerido, continuar
        if (!value && !rule.required) {
            continue;
        }

        // Validaciones específicas
        if (rule.type === 'email' && !validateEmail(value)) {
            errors.push(`${rule.label || fieldName} debe ser un email válido`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'phone' && !validatePhone(value)) {
            errors.push(`${rule.label || fieldName} debe ser un teléfono válido`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'password' && !validatePassword(value)) {
            errors.push(`${rule.label || fieldName} debe tener al menos 6 caracteres, una letra y un número`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'name' && !validateName(value)) {
            errors.push(`${rule.label || fieldName} debe contener solo letras y espacios (2-50 caracteres)`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'text' && !validateText(value, rule.maxLength)) {
            errors.push(`${rule.label || fieldName} debe tener entre 1 y ${rule.maxLength} caracteres`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'number' && !validateNumber(value, rule.min, rule.max)) {
            errors.push(`${rule.label || fieldName} debe ser un número entre ${rule.min} y ${rule.max}`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'date-future' && !validateFutureDate(value)) {
            errors.push(`${rule.label || fieldName} debe ser una fecha futura`);
            field.classList.add('is-invalid');
        } else if (rule.type === 'date-past' && !validatePastOrPresentDate(value)) {
            errors.push(`${rule.label || fieldName} debe ser una fecha pasada o presente`);
            field.classList.add('is-invalid');
        } else {
            // Campo válido - sanitizar y guardar
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            formData[fieldId] = sanitizeInput(value);
        }
    }

    // Validaciones adicionales (ej: confirmación de contraseña)
    if (rules.confirmPassword && formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
            errors.push('Las contraseñas no coinciden');
            const confirmField = form.querySelector('#confirm-password') || form.querySelector('[name="confirm-password"]');
            if (confirmField) confirmField.classList.add('is-invalid');
        }
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        data: formData
    };
}

// Añadir estilos de validación
function addValidationStyles() {
    if (document.getElementById('form-validation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'form-validation-styles';
    style.textContent = `
        .is-invalid {
            border-color: #EF4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        .is-valid {
            border-color: #10B981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }
        .error-message {
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar validación en tiempo real
function initRealTimeValidation(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return;

    addValidationStyles();

    for (const [fieldId, rule] of Object.entries(rules)) {
        const field = form.querySelector(`#${fieldId}`) || form.querySelector(`[name="${fieldId}"]`);
        if (!field) continue;

        field.addEventListener('blur', function() {
            const value = this.value.trim();
            
            if (rule.required && !value) {
                this.classList.add('is-invalid');
                return;
            }

            if (!value && !rule.required) {
                this.classList.remove('is-invalid', 'is-valid');
                return;
            }

            let isValid = true;
            if (rule.type === 'email') isValid = validateEmail(value);
            else if (rule.type === 'phone') isValid = validatePhone(value);
            else if (rule.type === 'password') isValid = validatePassword(value);
            else if (rule.type === 'name') isValid = validateName(value);
            else if (rule.type === 'text') isValid = validateText(value, rule.maxLength);
            else if (rule.type === 'number') isValid = validateNumber(value, rule.min, rule.max);

            if (isValid) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value.trim()) {
                this.classList.remove('is-invalid');
            }
        });
    }
}

// Exportar funciones para uso global
window.FormSecurity = {
    sanitizeInput,
    validateEmail,
    validatePhone,
    validatePassword,
    validateName,
    validateText,
    validateNumber,
    validateFutureDate,
    validatePastOrPresentDate,
    validateForm,
    initRealTimeValidation
};

