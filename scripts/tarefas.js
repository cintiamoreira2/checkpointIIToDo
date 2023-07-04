// Variavel responsavel por armazenar a URL Base para nossa API
const apiBaseUrl = 'https://todo-api.ctd.academy/v1'

// Token obtido no Login que foi salvo no localStorage
const token = localStorage.getItem('jwt')

// Referencia do Botao de Submit para cadastrar uma nova Tarefa
const submitButtonNewTaskRef = document.querySelector('#submitButtonNewTask')

// Referencia da Lista de Tarefas em Aberta
const openTasksListRef = document.querySelector('#openTasksList')

// Objeto que armazenara os Headers utilizados nas Requests
const requestHeadersAuth = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": jwt
}

// Objeto que armazenara todas as Tarefas, divididas em dois arrays
var userTasks = {
    openeds : [], // Array utilizado para armazenar as nossas tarefas em aberto
    closeds: [] // Array utilizado para armazenar as nossas tarefas concluidas
}

// Funcao que realiza o Logout
function logOut() {

    // Limpeza no localStorage
    localStorage.clear()
    // Redirecionamento para o Login
    window.location.href = 'index.html'

}

function deleteTask(task) {

    // construir a request de Delete aqui :)

}

function completeTask(task) {

    let taskCompleted = task
    // console.log(taskCompleted)
    taskCompleted.completed = true
    // console.log(taskCompleted)

    const requestSettings = {
        method: 'PUT',
        body: JSON.stringify(taskCompleted),
        headers: requestHeadersAuth
    }

    fetch(`${apiBaseUrl}/tasks/${task.id}`, requestSettings).then(
        response => {
            if(response.ok) {
                getTasks()
            }
        }
    )

}

// Funcao que ira adicionar os Events Listeners nos Itens do HTML
function addEventListenersToTasks() {

    // Logica para adicionar os Event Listeners para a Lista de Tarefas Abertas
    const openTaskListItensRef = Array.from(openTasksListRef.children)

    openTaskListItensRef.map(
        (item, index) => {
            const actionItemTaskRef = item.children[0]
            const taskFinded = userTasks.openeds[index]
            actionItemTaskRef.addEventListener('click', () => completeTask(taskFinded))
        }
    )


    // Contrua aqui a Logica para adicionar os Event Listeners para a Lista de Tarefas Concluidas

}

// Funcao que ira inserir as nossas Tasks no HTML
function insertTasksHtml() {

    // Logica para inserir as Tarefas Abertas na Lista de Tarefas Abertas no HTML

    // Remocao de todos os elementos dentro da Lista de Tarefas em Aberto
    openTasksListRef.innerHTML = ''

    // For nas tarefas para inseri-las no HTML
    for(let task of userTasks.openeds) {

        // Criacao de uma data baseada na string retornada da API
        const taskDate = new Date(task.createdAt)
        // Formatacao da data criada para o padrao brasileiro
        const taskDateFormated = new Intl.DateTimeFormat('pt-BR').format(taskDate)

        openTasksListRef.innerHTML += `
            <li class="tarefa">
                <div class="not-done"></div>
                <div class="descricao">
                    <p class="nome">${task.description}</p>
                    <p class="timestamp">Criada em: ${taskDateFormated}</p>
                </div>
            </li>
        `

    }

    // Construa aqui a Logica para inserir as Tarefas Concluidas na Lista de Tarefas Concluidas no HTML
    // Muito importante que a logica esteja antes da Funcao addEventListenersToTasks()

    addEventListenersToTasks()

}

// Funcao que ira checar e separar as nossas Task em dois grupos, Aberas e Finalizadas
function checkTasks(tasks) {

    // For para percorrer as terfas
    for(let task of tasks) {

        // Verificacao para ver se ela ja esta Finalizada
        if(task.completed) {

            // Caso esteja ela sera armazenada no Array "closeds" dentro do Objeto "userTasks"
            userTasks.closeds.push(task)

        } else {

            // Caso a tarefas esteja Aberta ela sera armazenada no Array "openeds" dentro do Objeto "userTasks"
            userTasks.openeds.push(task)

        }

    }

    // Caso tenha dado tudo certo com a Request, nos chamamos a funcao para inserir as Tasks no HTML
    setTimeout(() => insertTasksHtml(), 1000)
    // insertTasksHtml()

}

// Funcao para limpar as tarefas
function clearTasks() {

    // Limpando o Array de tarefas colocando o valor dos mesmos como um Array vazio "[]"
    userTasks.closeds = []
    userTasks.openeds = []

}

// Funcao que ira obter as Tarefas
function getTasks() {

    // Objeto de Configuracao da Request
    const requestSettings = {
        method: 'GET',
        headers: requestHeadersAuth
    }

    clearTasks()

    // Request para obter as tarefas
    fetch(`${apiBaseUrl}/tasks`, requestSettings).then(
        response => {
            // Verificacao se deu tudo certo com a Request
            if(response.ok) {
                response.json().then(
                    tasks => {
                        checkTasks(tasks)
                    }
                )
            } else {
                // Verificacao se o Status da Request é 401(Nao autorizado)
                if(response.status === 401) {
                    // Caso seja, a aplicacao ira realizar o Logout do usuario
                    logOut()
                }
            }
        }
    )

}

// Funcao que ira criar uma nova Task
async function createTask(event) {

    // Utilizacao do preventDefault() para a pagina nao recarregar apos o Submit
    event.preventDefault()

    // Objeto contendo a Task que sera Cadastrada
    const task = {
        // Descricao da Task(Essa descericao deve conter o valor do Input que o usuario digitou, ela esta fixa com essa String apenas para entendermos como a requisicao funciona)
        description: 'Teste 4', // Inserir aqui o valor do Input que o usuario digitou
        // Completed representa se a Task sera criada como Aberta ou Finalizada
        // False ira significar que esta em abera
        // True ira significar que esta finalizada
        // Voce pode manter o False por padrao, nao é necessario atualizar essa propriedade
        completed: false
    }

    // Objeto de configuracao da Request
    const requestSettings = {
        method: 'POST',
        body: JSON.stringify(task),
        headers: requestHeadersAuth
    }

    // Request para cadastrar uma nova tarefa
    const response = await fetch(`${apiBaseUrl}/tasks`, requestSettings)

    // Verificacao se deu tudo certo com a Request
    if(response.ok) {
        // Caso tenha dado tudo certo nos executamos a funcao getTasks() novamente
        // A ideia de executarmos novamente a getTasks() esta em "remontarmos as listas pata o usuario"
        // Toda vez que fazemos uma requisicao para criarmos uma nova tarefa, ela no final das contas é criada no Banco de Dados, porem, a listagem que esta sendo mostrada para o usuario nao contem essa nova tarefa criada. Por isso que precisamos obter as tarefas novamente
        getTasks()
    }
    

}

// Funcao que ira checar se o Usuario esta de fato Autenticado na Aplicacao
function checkAuthUser() {

    // Verifica se o JWT obtido do localStorage é nulo
    if(jwt === null) {

        // Caso seja a aplicacao ja realiza o Logout do Usuario
        logOut()
    
    } else {
    
        // Caso nao seja Nulo, a aplicacao ira obter as Tasks e realizar outra verificacao quando a Request for concluida
        getTasks()
    
    }

}

// Adicao de um EventListener para quando o usuario clickar no Button de Submit para cadastrar uma nova tarefa
submitButtonNewTaskRef.addEventListener('click', event => createTask(event))

// Execucao da funcao para checar a autenticidade do usuario na aplicacao
checkAuthUser()