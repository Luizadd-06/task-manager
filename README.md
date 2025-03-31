# Task Manager

Um gerenciador de tarefas simples desenvolvido com **Flask** e **Flask-Login**, oferecendo autenticação de usuários e operações CRUD (criar, ler, atualizar, excluir) de tarefas com controle de permissões.

---

## Como Funciona?

### Autenticação de Usuários
- Utiliza **Flask-Login** para login e logout de usuários.
- Os dados dos usuários são armazenados em `users.json`.
- Apenas usuários com permissão de administrador podem criar, editar ou excluir tarefas.

### Gerenciamento de Tarefas
- As tarefas são salvas em `tasks.json`.
- Suporta filtros por **prioridade** e **status** (concluídas ou pendentes).
- A prioridade é atribuída automaticamente com base em palavras-chave no texto da tarefa.

---

## Tecnologias Utilizadas
- **Python**: Linguagem principal do projeto.
- **Flask**: Framework web para o back-end.
- **Flask-Login**: Gerenciamento de autenticação.
- **JSON**: Armazenamento de dados (usuários e tarefas).

---

## Pré-requisitos
- Python 3.8 ou superior
- Pip (gerenciador de pacotes do Python)

---

## Como Executar
1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/Luizadd-06/task-manager.git
   cd task-manager
   ```

2. **Instale as Dependências**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute o Aplicativo**:
   ```bash
   python app.py
   ```
   Acesse em `http://localhost:5000` no seu navegador.

---

## Estrutura do Projeto
```
task-manager/
├── static/         # Arquivos estáticos (CSS, JS, etc.)
     ├── css/
     └── styles.css
     ├── js/
     └── script.js    
├──templates
     └── index.html
     └── login.html   
├── .gitattributes
├── README.md         
├── app.py
├── requirements.txt
├── tasks.json
├── users.json    
```

---

## Contribuições
Sugestões e melhorias são bem-vindas! Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch (`git checkout -b minha-melhoria`).
3. Envie um pull request com suas alterações.

---

## Autor
- **Luiza Darze**  
- GitHub: [Luizadd-06](https://github.com/Luizadd-06)  
- LinkedIn: [Luiza Dorr Darze](https://www.linkedin.com/in/luiza-dorr-darze-101784213/)
