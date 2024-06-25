from flask import Flask, redirect, url_for, request, render_template, jsonify
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, set_access_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, Usuario, UsuarioLogueo, Categoria, Gasto

app = Flask(__name__)
cors = CORS(app)
port = 5000

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://monitor:monitor*.12@localhost:5432/monitor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = 'monitor*.12'  # Cambia esto por una clave secreta segura
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True  # Habilitar CSRF protection para mayor seguridad

jwt = JWTManager(app)

db.init_app(app)


@app.route('/login', methods = ['POST'])
def login():
    try:
        data = request.get_json()
        usuario_acceso = data.get('usuario')
        contrasena = data.get('contrasena')
        recordar = data.get('recordar', False)

        usuario = Usuario.query.filter((Usuario.email == usuario_acceso) | (Usuario.username == usuario_acceso)).first()

        if usuario:
            usuario_logueo = UsuarioLogueo.query.filter_by(id_usuario = usuario.id).first()
            if usuario_logueo and check_password_hash(usuario_logueo.contrasena, contrasena):
                access_token = create_access_token(identity = usuario.id)

                response = jsonify({'mensaje': 'Inicio de sesión exitoso'})

                if recordar:
                    set_access_cookies(response, access_token)
                else:
                    response.set_cookie('access_token_cookie', '', expires=0)

                return response, 200
        return jsonify({'error': 'Credenciales incorrectas'}), 401

    except Exception as e:
        return jsonify({'error': 'Ocurrió un error al iniciar sesión', 'detalle': str(e)}), 500



@app.route('/registrar-usuario', methods = ['POST'])
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

        # Por cada nuevo usuario le añado categorías predeterminadas
        categorias_predeterminadas = [
            {'nombre': 'Alimentos', 'descripcion': 'Gastos en alimentos', 'id_usuario': nuevo_usuario.id},
            {'nombre': 'Transporte', 'descripcion': 'Gastos en transporte', 'id_usuario': nuevo_usuario.id},
            {'nombre': 'Entretenimiento', 'descripcion': 'Gastos en entretenimiento', 'id_usuario': nuevo_usuario.id},
            {'nombre': 'Otros', 'descripcion': 'Otros gastos', 'id_usuario': nuevo_usuario.id}
        ]

        for categoria in categorias_predeterminadas:
            nueva_categoria = Categoria(**categoria)
            db.session.add(nueva_categoria)

        db.session.commit()

        return jsonify({'mensaje': 'Usuario registrado exitosamente'}), 201

    except Exception as e:
        db.session.rollback()
        app.logger.error('Error al registrar el usuario: %s', e)
        return jsonify({'error': 'Ocurrió un error al registrar el usuario', 'detalle': str(e)}), 500

    finally:
        db.session.close()



@app.route('/registrar-gasto', methods = ['POST'])
def registrar_gasto():
    try:
        data = request.get_json()
        monto = data.get('monto')
        categoria_nombre = data.get('categoria', None)
        id_usuario = data.get('id_usuario')

        if not monto or not id_usuario:
            return jsonify({'error': 'Monto e id de usuario son requeridos'}), 400

        if categoria_nombre:
            categoria = Categoria.query.filter_by(nombre = categoria_nombre, id_usuario = id_usuario).first()
            if not categoria:
                categoria = Categoria(nombre = 'Otros', descripcion = 'Otros gastos', id_usuario = id_usuario)
                db.session.add(categoria)
                db.session.commit()
        else:
            categoria = Categoria.query.filter_by(nombre = 'Otros', id_usuario = id_usuario).first()
            if not categoria:
                categoria = Categoria(nombre = 'Otros', descripcion = 'Otros gastos', id_usuario = id_usuario)
                db.session.add(categoria)
                db.session.commit()

        nuevo_gasto = Gasto(monto = monto, id_categoria = categoria.id, id_usuario = id_usuario)
        db.session.add(nuevo_gasto)
        db.session.commit()

        return jsonify({'mensaje': 'Gasto registrado exitosamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Ocurrió un error al registrar el gasto', 'detalle': str(e)}), 500
    finally:
        db.session.close()


@app.route('/lista-gastos', methods = ['POST'])
def lista_gastos():
    try:
        gastos = Gasto.query.filter_by(activo = True).all()
        gastos_lista = []
        for gasto in gastos:
            gastos_lista.append({
                'id_gasto': gasto.id,
                'monto': gasto.monto,
                'fecha': gasto.fecha,
                'categoria': gasto.categoria.nombre
            })
        return jsonify({'gastos': gastos_lista}), 200
    except Exception as e:
        return jsonify({'error': 'Ocurrió un error al obtener los gastos', 'detalle': str(e)}), 500


if __name__ == '__main__':
    print('Starting server...')
    with app.app_context():
        db.create_all()
    print('Started...')
    app.run(host='0.0.0.0', port=port, debug=True)
