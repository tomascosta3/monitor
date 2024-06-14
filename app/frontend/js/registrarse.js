document.getElementById('usuarioRegistroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contraseña').value;
    const confirmarContrasena = document.getElementById('confirmarContraseña').value;
    const errorDiv = document.getElementById('error');

    errorDiv.textContent = '';

    // Verificar que todos los campos estén llenos
    if (!nombre || !apellido || !username || !email || !contrasena || !confirmarContrasena) {
        errorDiv.textContent = 'Todos los campos son obligatorios.';
        return;
    }

    // Verificar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorDiv.textContent = 'El formato del correo electrónico es inválido.';
        return;
    }

    // Verificar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        errorDiv.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    // Verificar que la contraseña tenga al menos 8 caracteres, una letra y un número
    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!contrasenaRegex.test(contrasena)) {
        errorDiv.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.';
        return;
    }

    // Si todas las validaciones pasan, enviar el formulario
    fetch('http://127.0.0.1:5000/registrar-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            email: email,
            username: username,
            contrasena: contrasena
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorDiv.textContent = data.error;
            } else {
                alert('Usuario registrado exitosamente.');
                // Redirigir a otra página o limpiar el formulario
            }
        })
        .catch(error => {
            errorDiv.textContent = 'Ocurrió un error. Por favor, inténtelo nuevamente.';
            console.error('Error:', error);
        });
});