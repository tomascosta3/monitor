import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(50), nullable = False)
    apellido = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(100), nullable = False, unique = True)
    username = db.Column(db.String(255), nullable = False, unique = True)
    fecha_creacion = db.Column(db.DateTime, default = datetime.datetime.now)
    fecha_modificacion = db.Column(db.DateTime, default = datetime.datetime.now, onupdate = datetime.datetime.now)
    activo = db.Column(db.Boolean, default = True)
    logueo = db.relationship('UsuarioLogueo', backref = 'usuario', uselist = False, cascade = 'all, delete-orphan')
    categorias = db.relationship('Categoria', backref = 'usuario', lazy = True)
    gastos = db.relationship('Gasto', backref = 'usuario', lazy = True)

class UsuarioLogueo(db.Model):
    __tablename__ = 'usuarios_logueo'
    id = db.Column(db.Integer, primary_key = True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    contrasena = db.Column(db.String(255), nullable = False)
    ultimo_inicio_sesion = db.Column(db.DateTime, default = datetime.datetime.now)
    intentos_fallidos = db.Column(db.Integer, default = 0)
    bloqueado = db.Column(db.Boolean, default = False)

class Categoria(db.Model):
    __tablename__ = 'categorias'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(255), nullable = False)
    descripcion = db.Column(db.String(255), nullable = True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    fecha_creacion = db.Column(db.DateTime, default = datetime.datetime.now)
    fecha_modificacion = db.Column(db.DateTime, default = datetime.datetime.now, onupdate = datetime.datetime.now)
    activo = db.Column(db.Boolean, default = True)
    gastos = db.relationship('Gasto', backref = 'categoria', lazy = True)

class Gasto(db.Model):
    __tablename__ = 'gastos'
    id = db.Column(db.Integer, primary_key = True)
    monto = db.Column(db.Float, nullable = False)
    fecha = db.Column(db.DateTime, default = datetime.datetime.now)
    id_categoria = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable = True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable = False)
    fecha_creacion = db.Column(db.DateTime, default = datetime.datetime.now)
    fecha_modificacion = db.Column(db.DateTime, default = datetime.datetime.now, onupdate = datetime.datetime.now)
    activo = db.Column(db.Boolean, default = True)