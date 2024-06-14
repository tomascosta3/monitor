// Validación y envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorDiv = document.getElementById('error');

    errorDiv.textContent = '';

    // Verificar que todos los campos necesarios estén llenos
    if (!usuario || !contrasena) {
        errorDiv.textContent = 'Todos los campos son obligatorios';
        return
    }

    // Enviar el formulario
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            contrasena: contrasena
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorDiv.textContent = data.error;
            } else {
                window.location.href = './../home.html';
            }
        })
        .catch(error => {
            errorDiv.textContent = 'Ocurrió un error. Por favor, inténtelo nuevamente.';
            console.error('Error:', error);
        });
});

// Redirección del botón 'Olvidé mi contraseña'
document.getElementById('botonOlvideContraseña').addEventListener('click', function () {
    window.location.href = '#';
});

// Redirección del botón 'Registrarme'
document.getElementById('botonRegistrarme').addEventListener('click', function () {
    window.location.href = './registrarse.html';
});