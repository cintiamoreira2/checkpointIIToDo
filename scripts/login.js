//Captura os elementos do formulário de login
const apiBaseUrl = 'https://todo-api.ctd.academy/v1'
            // input email
const inputEmailRef = document.querySelector("#inputEmail");
            // input senha
const inputPasswordRef = document.querySelector("#inputPassword");
            //botao de enviar
const buttonLoginSubmitRef = document.querySelector("#sentButton")
            // mensagem de erro
const mensagemErro = document.querySelector(".erro_mensagem")
  


buttonLoginSubmitRef.disabled = true;


//define objeto JS para usuario 
let user = {
    email: '',
    password: ''
}
 
//coferir se os input estao com erro 
let formaHasError ={

   email: true,
   password: true

}

//desabilitar botao
function disabledButtonErro(){

    if(!formaHasError.email  && !formaHasError.password){
   
        buttonLoginSubmitRef.disabled = true
   
    }else{

        buttonLoginSubmitRef.disabled = false

    }
}


//avaliar input
function inputValidet(event){
    const target = event.target

    const isValided = target.checkValidity()
    user[target.name] = target.value
    if(isValided){

        target.classList.remove("error")
        formaHasError[target.name] = true
        buttonLoginSubmitRef.classList.remove("errorButton")
        mensagemErro.innerHTML = ""
    }else{

        mensagemErro.innerHTML = "error de digitaçao"
        formaHasError[target.name] = false
        target.classList.add("error")
        buttonLoginSubmitRef.classList.add("errorButton")

    }

    disabledButtonErro()
}

//botao entrar 
function sentButton(){

    const userEmail = inputEmailRef.value

    localStorage.setItem("user", userEmail)

    window.location.href = "../pages/tarefas.html"
 
}


function authUser(event) {

    event.preventDefault()

    const requestHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    const requestSettings = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: requestHeaders
    }

    fetch(`${apiBaseUrl}/users/login`, requestSettings).then(
        response => {
            console.log(response)
            if(response.ok) {
                response.json().then(
                    token => {                                                  // token ==> é a varíavel que armazenará meu token (jwt).
                        localStorage.setItem('jwt', token.jwt)
                        window.location.href = '/pages/tarefas.html'
                    }
                )
            } else {
                alert('esse e-mail ja foi cadastrado')
            }
        }
    )

}

buttonLoginSubmitRef.addEventListener('click', event => authUser(event))

inputEmailRef.addEventListener("keyup",(event)=>inputValidet(event))

inputPasswordRef.addEventListener("keyup",(event)=>inputValidet(event))






