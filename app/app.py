from flask import Flask, redirect, url_for, request, render_template # type: ignore
app = Flask(__name__, static_url_path='/templates')

@app.route('/registrarse')
def registrarse():
    return render_template('registrarse.html')

@app.route('/login', methods = ['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        username = request.form['username']
        return request.form

@app.route('/')
def root():
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8000, debug = True)
