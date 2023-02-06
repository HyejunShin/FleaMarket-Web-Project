import { checkUsername, checkEmail, checkPassword} from '/js/validate-input.mjs';

function main(){
    const username = document.getElementsByName('username')[0];
    const email = document.getElementsByName('email')[0];
    const password = document.getElementsByName('password')[0];
    const usernameMsg = document.getElementById('usernameMsg');
    const emailMsg = document.getElementById('emailMsg');
    const passwordMsg = document.getElementById('passwordMsg');
    
    username.addEventListener('input', function () {
        if(username.value.length !== 0){
            const message = checkUsername(username.value.trim()).message;
            usernameMsg.textContent = message;
        }
    });  

    email.addEventListener('input', function () {
        if(email.value.length !== 0){
            const message = checkEmail(email.value.trim()).message;
            emailMsg.textContent = message;
        }
    }); 

    password.addEventListener('input', function () {
        if(password.value.length !== 0){
            const message = checkPassword(password.value.trim()).message;
            passwordMsg.textContent = message;
        }
    }); 
}

document.addEventListener('DOMContentLoaded', main);