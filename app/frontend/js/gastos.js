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

        const infoGasto = document.createElement('p');
        infoGasto.textContent = `$${gasto.monto} en ${gasto.categoria || 'Otros'}`;
        gastoDiv.appendChild(infoGasto);

        lista.appendChild(gastoDiv);
    });
}