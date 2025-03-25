#importação das bibliotecas
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import json
from datetime import datetime  

#configuração do flask
app = Flask(__name__)
app.secret_key = 'supersecretkey'

#gerenciamento do login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

#classe de usuário
class User(UserMixin):
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

#carregar usuários e tarefas
def load_users():
    try:
        with open('users.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "users": [
                {"id": 1, "username": "luiza", "password": "luiza123", "role": "admin"},
                {"id": 2, "username": "joao", "password": "joao123", "role": "user"}
            ]
        }
def load_tasks():
    try:
        with open('tasks.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

#salvar as tarefas
def save_tasks(tasks):
    with open('tasks.json', 'w') as f:
        json.dump(tasks, f, indent=2)

#sugestão de prioridade
def suggest_priority(task_text):
    task_text = task_text.lower()
    high_priority = ['urgente','urgência' 'importante', 'hoje', 'amanhã']
    medium_priority = ['em breve', 'marcar', 'sem prazo', 'pesquisar', 'listar']
    if any(word in task_text for word in high_priority):
        return 'High'
    elif any(word in task_text for word in medium_priority):
        return 'Medium'
    return 'Low'

#login do usuário
@login_manager.user_loader
def load_user(user_id):
    users = load_users()['users']
    for user in users:
        if str(user['id']) == user_id:
            return User(user['id'], user['username'], user['role'])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        users = load_users()['users']
        for user in users:
            if user['username'] == username and user['password'] == password:
                user_obj = User(user['id'], user['username'], user['role'])
                login_user(user_obj)
                return redirect(url_for('index'))
        flash('Usuário ou senha inválidos')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

#página inicial
@app.route('/')
@login_required
def index():
    return render_template('index.html', username=current_user.username, is_admin=current_user.role == 'admin')

#obter tarefas
@app.route('/tasks', methods=['GET'])
@login_required
def get_tasks():
    tasks = load_tasks()
    priority = request.args.get('priority')
    status = request.args.get('status')
    if priority:
        tasks = [task for task in tasks if task['priority'] == priority]
    if status:
        done = status == 'true'
        tasks = [task for task in tasks if task['done'] == done]
    if current_user.role != 'admin':
        tasks = [task for task in tasks if task['user_id'] == current_user.id or task['user_id'] == 1]
    return jsonify(tasks)

#adicionar tarefas
@app.route('/tasks', methods=['POST'])
@login_required
def add_task():
    if current_user.role != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    tasks = load_tasks()
    data = request.get_json()
    task_text = data.get('text', '')
    priority = suggest_priority(task_text)
    new_task = {
        'id': len(tasks) + 1,
        'text': task_text,
        'priority': priority,
        'done': False,
        'user_id': current_user.id,
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')  
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    if current_user.role != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    tasks = load_tasks()
    data = request.get_json()
    for task in tasks:
        if task['id'] == task_id:
            task['done'] = data.get('done', task['done'])
            if 'text' in data:
                task['text'] = data['text']
                task['priority'] = suggest_priority(data['text'])
            save_tasks(tasks)
            return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    if current_user.role != 'admin':
        return jsonify({'error': 'Permission denied'}), 403
    tasks = load_tasks()
    for i, task in enumerate(tasks):
        if task['id'] == task_id:
            tasks.pop(i)
            save_tasks(tasks)
            return jsonify({'message': 'Task deleted'})
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)