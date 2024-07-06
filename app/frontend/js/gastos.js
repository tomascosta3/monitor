// Redirrección al seleccionar en agregar gasto
document.getElementById('botonAgregarGasto').addEventListener('click', function () {
    window.location.href = './home.html';
});


// Obtengo la lista de gastos de la base de datos
fetch('http://127.0.0.1:5000/lista-gastos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        console.error(data.error);
        console.error(data.detalle);
    } else {
        console.log('Gastos activos:', data.gastos);
        mostrarGastos(data.gastos);
    }
})
.catch(error => {
    console.error('Error:', error);
});


// Muestro la lista de los gastos
function mostrarGastos(gastos) {
    const lista = document.getElementById('listaGastos');
    lista.innerHTML = '';

    gastos.forEach(gasto => {
        const gastoDiv = document.createElement('div');
        gastoDiv.setAttribute('class', 'gasto');

        const infoGasto = document.createElement('p');
        infoGasto.textContent = `$${gasto.monto} en ${gasto.categoria || 'Otros'}`;
        gastoDiv.appendChild(infoGasto);

        const botonesDiv = document.createElement('div');
        botonesDiv.setAttribute('class', 'botones');

        const botonDescripcion = document.createElement('i');
        botonDescripcion.classList.add('fas');
        botonDescripcion.classList.add('fa-list');
        botonesDiv.appendChild(botonDescripcion);

        const botonEditar = document.createElement('i');
        botonEditar.classList.add('fas');
        botonEditar.classList.add('fa-edit');
        botonesDiv.appendChild(botonEditar);

        const botonEliminar = document.createElement('i');
        botonEliminar.classList.add('fas');
        botonEliminar.classList.add('fa-trash');
        botonesDiv.appendChild(botonEliminar);

        gastoDiv.appendChild(botonesDiv);
        lista.appendChild(gastoDiv);
    });
}



document.addEventListener('DOMContentLoaded', function() {
    const botonLista = document.getElementById('botonLista');
    botonLista.classList.add('activo');
});