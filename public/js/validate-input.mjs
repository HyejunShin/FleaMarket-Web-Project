// https://www.javascripttutorial.net/javascript-dom/javascript-form-validation/
const isRequired = value => value === '' ? false : true;

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const isPasswordSecure = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(password);
};

export function checkUsername(username){
    let isValid = false;
    let message = '';
    if(username.length < 8){
        message = 'Username must have at least 8 characters';
    } else if(username.length >= 20){
        message = 'Username must have at less than 20 characters';
    } else{
        isValid = true;
    }
    return {isValid: isValid, message: message};
}

export function checkEmail(email){
    let isValid = false;
    let message = '';
    if(!isRequired(email)){
        message = 'Email cannot be blank';
    } else if(!isEmailValid(email)){
        message = 'Invalid email';
    } else{
        isValid = true;
    }
    return {isValid: isValid, message: message};
}

export function checkPassword(password) {
    let isValid = false;
    let message = '';
    if(!isRequired(password)){
        message = 'Password cannot be blank';
    } else if(!isPasswordSecure(password)){
        message = 'Password must have at least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 special character (!@#$%^&*)';
    } else{
        isValid = true;
    }
    return {isValid: isValid, message: message};
}

export function checkTitle(title){
    let isValid = false;
    let message = '';
    if(title.length < 3){
        message = 'Title must have at least 3 characters';
    } else if(title.length >= 100){
        message = 'Title must have less than 100 characters';
    } else{
        isValid = true;
    }
    return {isValid: isValid, message: message};
}

export function checkCategory(category){
    let isValid = false;
    if(typeof category !== 'undefined'){
        isValid = true;
    }
    return {isValid: isValid};
}

export function checkPrice(price){
    let isValid = false;
    let message = '';
    if(!isRequired(price)){
        message = 'Price cannot be blank';
    } else if(typeof parseFloat(price) === "number"){
        if(parseFloat(price) % 1 !== 0 || price.includes('.')){
            message = 'Must input an integer';
        } else{
            if(parseInt(price) < 0){
                message = 'Must be non-negative';
            } else if(parseInt(price) >= 1000000){
                message = 'Must be less than 1000000';
            } else{
                isValid = true;
            }
        }
    } else{
        message = 'Must input an integer';
    }
    return {isValid: isValid, message: message};
}

export function checkDescription(description){
    let isValid = false;
    let message = '';
    if(description.length < 20){
        message = 'Description must have at least 20 characters';
    } else if(description.length >= 3000){
        message = 'Description must have less than 3000 characters';
    } else{
        isValid = true;
    }
    return {isValid: isValid, message: message};
}