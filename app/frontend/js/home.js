document.addEventListener('DOMContentLoaded', function() {
    const id_usuario = document.getElementById('id_usuario').value;

    fetch(`http://127.0.0.1:5000/categorias/${id_usuario}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const selectCategoria = document.getElementById('categoria');

        data.categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.text = categoria.nombre;
            if (categoria.nombre == 'Otros') {
                option.defaultSelected = true;
            }
            
            selectCategoria.add(option);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('registroGastoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const monto = document.getElementById('monto').value;
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;
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
            descripcion: descripcion || null, // Envía null si la descripción está vacía
            id_usuario: id_usuario
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorDiv.textContent = data.error;
                console.log(data.detalle);
            } else {
                alert('Gasto guardado correctamente');
            }
        })
        .catch(error => {
            errorDiv.textContent = 'Ocurrió un error. Por favor, inténtelo nuevamente.';
            console.log('Error:', error);
        });
});

document.getElementById('botonVerGastos').addEventListener('click', function () {
    window.location.href = './gastos.html';
});