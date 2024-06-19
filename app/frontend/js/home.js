document.getElementById('registroGastoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const monto = document.getElementById('monto').value;
    const categoria = document.getElementById('categoria').value;
    const id_usuario = document.getElementById('id_usuario').value;
    const errorDiv = document.getElementById('error');

    errorDiv.textContent = '';

    // Validación de monto
    if (!monto || isNaN(monto) || monto <= 0) {
        errorDiv.textContent = 'Monto inválido. Debe ser un número positivo.';
        return;
    }

    // Si todas las validaciones pasan, enviar el formulario
    fetch('http://127.0.0.1:5000/registrar-gasto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            monto: monto,
            categoria: categoria || null, // Envía null si la categoría está vacía
            id_usuario: id_usuario
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorDiv.textContent = data.error;
            } else {
                alert('Gasto guardado correctamente');
            }
        })
        .catch(error => {
            errorDiv.textContent = 'Ocurrió un error. Por favor, inténtelo nuevamente.';
            console.log('Error:', error);
        });
});