from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('/index.html')

@app.route('/cadastro')
def pagina_cadastro():
    return render_template('cadastro.html')

@app.route('/login')
def pagina_login():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)