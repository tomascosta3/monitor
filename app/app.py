from flask import Flask, redirect, url_for, request, render_template, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash
from models import db, Usuario, UsuarioLogueo

app = Flask(__name__)
cors = CORS(app)
port = 5000
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://monitor:monitor*.12@localhost:5432/monitor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/registrar-usuario', methods=['POST'])
def registrar_usuario():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        username = data.get('username')
        contrasena = data.get('contrasena')

        if not nombre or not apellido or not email or not username or not contrasena:
            return jsonify({'error': 'Faltan datos'}), 400

        if Usuario.query.filter((Usuario.email == email) | (Usuario.username == username)).first():
            return jsonify({'error': 'El email o nombre de usuario ya está registrado'}), 400

        hashed_password = generate_password_hash(contrasena)

        nuevo_usuario = Usuario(
            nombre=nombre,
            apellido=apellido,
            email=email,
            username=username
        )
        db.session.add(nuevo_usuario)
        db.session.commit()

        nuevo_usuario_logueo = UsuarioLogueo(
            id_usuario=nuevo_usuario.id,
            contrasena=hashed_password
        )
        db.session.add(nuevo_usuario_logueo)
        db.session.commit()

        return jsonify({'mensaje': 'Usuario registrado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error('Error al registrar el usuario: %s', e)
        return jsonify({'error': 'Ocurrió un error al registrar el usuario', 'detalle': str(e)}), 500
    finally:
        db.session.close()


if __name__ == '__main__':
    print('Starting server...')
    with app.app_context():
        db.create_all()
    print('Started...')
    app.run(host='0.0.0.0', port=port, debug=True)
