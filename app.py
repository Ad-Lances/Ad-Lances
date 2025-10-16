from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/imoveis')
def imoveis():
    return render_template('categorias/imoveis.html')

@app.route('/veiculos')
def veiculos():
    return render_template('categorias/veiculos.html')

@app.route('/eletronicos')
def eletronicos():
    return render_template('categorias/eletronicos.html')

@app.route('/eletrodomesticos')
def eletrodomesticos():
    return render_template('categorias/eletrodomesticos.html')

if __name__ == '__main__':
    app.run(debug=True)