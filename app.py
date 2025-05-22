from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, UserMixin
import psutil
import datetime

app = Flask(__name__)
app.secret_key = 'secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///apm.db'

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))

# Metrics model
class Metric(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    cpu = db.Column(db.Float)
    ram = db.Column(db.Float)
    bytes_sent = db.Column(db.BigInteger)
    bytes_recv = db.Column(db.BigInteger)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.password == request.form['password']:
            login_user(user)
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/metrics')
@login_required
def metrics():
    cpu = psutil.cpu_percent()
    ram = psutil.virtual_memory().percent
    net = psutil.net_io_counters()
    db.session.add(Metric(cpu=cpu, ram=ram, bytes_sent=net.bytes_sent, bytes_recv=net.bytes_recv))
    db.session.commit()
    return jsonify({
        'cpu': cpu,
        'ram': ram,
        'bytes_sent': net.bytes_sent,
        'bytes_recv': net.bytes_recv
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            db.session.add(User(username='admin', password='admin'))
            db.session.commit()
    app.run(debug=True)
