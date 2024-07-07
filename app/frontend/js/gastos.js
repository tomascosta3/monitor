// Redirrección al seleccionar en agregar gasto
document.getElementById('botonAgregarGasto').addEventListener('click', function () {
    window.location.href = './home.html';
});


// Obtengo la lista de gastos de la base de datos
fetch('http://127.0.0.1:5000/lista-gastos', {
    method: 'GET',
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


function mostrarDescripcion(gastoId) {
    
    const gasto = document.getElementById('gasto-' + gastoId);
    const descripcion = gasto.querySelector('p.descripcion');

    if(descripcion.classList.contains('activo')) {
        descripcion.classList.remove('activo');
    } else {
        descripcion.classList.add('activo');
    }
}


// Muestro la lista de los gastos
function mostrarGastos(gastos) {
    const lista = document.getElementById('listaGastos');
    lista.innerHTML = '';

    gastos.forEach(gasto => {
        const gastoDiv = document.createElement('div');
        gastoDiv.setAttribute('class', 'gasto');
        gastoDiv.setAttribute('id', 'gasto-' + gasto.id);

        const precioCategoriaDiv = document.createElement('div');
        precioCategoriaDiv.setAttribute('class', 'info-precio-categoria');

        const infoGasto = document.createElement('p');
        infoGasto.textContent = `$${gasto.monto} en ${gasto.categoria || 'Otros'}`;

        const botonesDiv = document.createElement('div');
        botonesDiv.setAttribute('class', 'botones');

        const botonDescripcion = document.createElement('i');
        botonDescripcion.classList.add('fas');
        botonDescripcion.classList.add('fa-list');
        botonDescripcion.addEventListener('click', () => {
            mostrarDescripcion(gasto.id);
        });
        botonesDiv.appendChild(botonDescripcion);

        const botonEditar = document.createElement('i');
        botonEditar.classList.add('fas');
        botonEditar.classList.add('fa-edit');
        botonEditar.addEventListener('click', () => {
            editarGasto(gasto.id);
        });
        botonesDiv.appendChild(botonEditar);

        const botonEliminar = document.createElement('i');
        botonEliminar.classList.add('fas');
        botonEliminar.classList.add('fa-trash');
        botonEliminar.addEventListener('click', () => {
            eliminarGasto(gasto.id);
        });
        botonesDiv.appendChild(botonEliminar);

        const descripcionGasto = document.createElement('p');
        descripcionGasto.setAttribute('class', 'descripcion');
        if(gasto.descripcion) {
            descripcionGasto.textContent = gasto.descripcion;
        } else {
            descripcionGasto.textContent = 'Sin descripción';
        }

        precioCategoriaDiv.appendChild(infoGasto);
        precioCategoriaDiv.appendChild(botonesDiv);

        gastoDiv.appendChild(precioCategoriaDiv);
        gastoDiv.appendChild(descripcionGasto);

        lista.appendChild(gastoDiv);
    });
}


function eliminarGasto(id_gasto) {
    fetch(`http://127.0.0.1:5000/gastos/${id_gasto}/eliminar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            location.reload();
        } else {
            alert('Error al eliminar el gasto: ' + data.message);
        }
    })
    .catch(error => console.error('Error al eliminar el gasto:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    const botonLista = document.getElementById('botonLista');
    botonLista.classList.add('activo');
});