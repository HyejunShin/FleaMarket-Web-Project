import { checkTitle, checkPrice, checkDescription} from '/js/validate-input.mjs';

function main(){
    const title = document.getElementsByName('title')[0];
    const price = document.getElementsByName('price')[0];
    const description = document.getElementsByName('description')[0];
    const titleMsg = document.getElementById('titleMsg');
    const priceMsg = document.getElementById('priceMsg');
    const descriptionMsg = document.getElementById('descriptionMsg');
    
    title.addEventListener('input', function () {
        if(title.value.length !== 0){
            const message = checkTitle(title.value.trim()).message;
            titleMsg.textContent = message;
        }
    });  

    price.addEventListener('input', function () {
        if(price.value.length !== 0){
            const message = checkPrice(price.value.trim()).message;
            priceMsg.textContent = message;
        }
    }); 

    description.addEventListener('input', function () {
        if(description.value.length !== 0){
            const message = checkDescription(description.value.trim()).message;
            descriptionMsg.textContent = message;
        }
    }); 
}

document.addEventListener('DOMContentLoaded', main);