// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function sendChat(message, message_user_id, user_id){
    console.log("message_user_id", message_user_id);
    console.log("user_id", user_id);
    const div = document.createElement('div');
    div.classList.add('message-box');
    div.setAttribute('align', 'left');
    let p = document.createElement('p');
    p.classList.add('message-text');
    p.appendChild(document.createTextNode(message));
    if(message_user_id === user_id){
        div.classList.add('self-sent');
        p.classList.add('self-text');
    } 
    else{
        div.classList.add('others-sent');
        p.classList.add('others-text');
    }
    const time = document.createElement('div');
    time.classList.add('message-time');
    time.appendChild(document.createTextNode(formatAMPM(new Date)));
    div.appendChild(time);
    div.appendChild(p);
    const chatMessages = document.querySelector('#chat-messages');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    document.querySelector('#message-text').value = '';
    document.querySelector('#message-text').focus();
}

function main(){
    const socket = io();
    const submit = document.querySelector('#submit-btn');
    const chatMessages = document.querySelector('#chat-messages');
    const chat_id = document.querySelector('#room-name').getAttribute('chat-id');
    const user_id = document.querySelector('#room-name').getAttribute('user-id');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    socket.emit('joinRoom', chat_id);
    
    submit.addEventListener('click', function(evt) {
        evt.preventDefault();
        const msg = document.querySelector('#message-text').value;
        socket.emit('sendChat', {msg, user_id, chat_id});
    });

    socket.on('sendChat', (data) => {
        sendChat(data.msg, data.user_id, user_id);
    });
}

document.addEventListener('DOMContentLoaded', main);