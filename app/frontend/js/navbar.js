document.addEventListener('DOMContentLoaded', function () {
    fetch('./../navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            document.getElementById('botonLogout').addEventListener('click', function () {
                fetch('http://127.0.0.1:5000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    console.log(response);
                    if (response.ok) {
                        window.location.href = './../login.html';
                    } else {
                        console.error('Error al cerrar sesión');
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            });
        });
});