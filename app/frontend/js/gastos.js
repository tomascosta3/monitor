document.addEventListener('DOMContentLoaded', function () {

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

    // Obtengo las categorías de la base de datos
    const id_usuario = document.getElementById('id_usuario').value;
    var categorias = [];
    fetch(`http://127.0.0.1:5000/categorias/${id_usuario}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            categorias = data.categorias;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Muestro la descripción al clickear en el ícono de detalles
    function mostrarDescripcion(gastoId) {

        const gasto = document.getElementById('gasto-' + gastoId);
        const descripcion = gasto.querySelector('p.descripcion');

        if (descripcion.classList.contains('activo')) {
            descripcion.classList.remove('activo');
        } else {
            descripcion.classList.add('activo');
        }
    }

    const modal = document.getElementById('modalEditarGasto');
    const span = document.getElementsByClassName('cerrar')[0];

    // Abro el modal con los datos del gasto seleccionado
    function abrirModalEditar(gasto) {
        document.getElementById('editarMonto').value = gasto.monto;

        // Agrego las opciones del select de categorías
        const selectCategoria = document.getElementById('editarCategoria');
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.text = categoria.nombre;
            if (categoria.id == gasto.id_categoria) {
                option.defaultSelected = true;
            }
            selectCategoria.add(option);
        });

        document.getElementById('editarDescripcion').value = gasto.descripcion;
        modal.style.display = 'block';

        document.getElementById('formEditarGasto').setAttribute('data-id', gasto.id);
    }

    // Cierro el modal al clickear la cruz
    span.onclick = function () {
        modal.style.display = 'none';
    }

    // Cierro el modal al clickear en otro lado
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
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
            botonEditar.onclick = () => abrirModalEditar(gasto);
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
            if (gasto.descripcion) {
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

    // Elimina el gasto que corresponda al id seleccionado
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

    // El boton de la lista lo muestro activado
    const botonLista = document.getElementById('botonLista');
    botonLista.classList.add('activo');

    // Enviar datos del form de edición de gasto al backend
    document.getElementById('formEditarGasto').onsubmit = function (event) {
        event.preventDefault();

        const idGasto = this.getAttribute('data-id');
        const monto = document.getElementById('editarMonto').value;
        const categoria = document.getElementById('editarCategoria').value;
        const descripcion = document.getElementById('editarDescripcion').value;

        fetch('http://127.0.0.1:5000/gastos/' + idGasto + '/editar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ monto, categoria, descripcion })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error al editar el gasto: ' + data.message);
                }
            })
            .catch(error => console.error('Error al editar el gasto:', error));
    }
});