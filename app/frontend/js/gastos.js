document.getElementById('botonAgregarGasto').addEventListener('click', function () {
    window.location.href = './home.html';
});


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


function mostrarGastos(gastos) {
    const lista = document.getElementById('listaGastos');
    lista.innerHTML = '';

    gastos.forEach(gasto => {
        const gastoDiv = document.createElement('div');
        gastoDiv.setAttribute('class', 'gasto');

        const monto = document.createElement('p');
        monto.textContent = `$${gasto.monto}`;
        gastoDiv.appendChild(monto);

        const conector = document.createElement('p');
        conector.textContent = 'en';
        gastoDiv.appendChild(conector);

        const categoria = document.createElement('p');
        categoria.textContent = `${gasto.categoria || 'Otros'}`;
        gastoDiv.appendChild(categoria);

        lista.appendChild(gastoDiv);
    });
}