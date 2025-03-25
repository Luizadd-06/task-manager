# task-manager
Este projeto é um gerenciador de tarefas simples desenvolvido com Flask e Flask-Login, permitindo autenticação de usuários e CRUD de tarefas com controle de permissões.

Como funciona?
Autenticação de Usuários
O sistema permite login/logout de usuários utilizando Flask-Login.
Os usuários estão armazenados em um arquivo users.json.
Apenas usuários administradores podem criar, editar ou excluir tarefas.

Gerenciamento de Tarefas
As tarefas são armazenadas no arquivo tasks.json.
As tarefas podem ser filtradas por prioridade e status (feitas ou não).
A prioridade é atribuída automaticamente com base em palavras-chave no texto da tarefa.
 
