export function openChat(user_id, item_user_id, item_id){
    const socket = io();
    const button = document.querySelector('#start-chat');
    button.addEventListener('click', function(evt) {
        evt.preventDefault();
        socket.emit('openChat', {user_id, item_user_id, item_id});
    });
    socket.on('openChat', message => {
        window.open(message, '_self');
    });
}

export function needLogin(){
    const button = document.querySelector('#start-chat');
    button.addEventListener('click', function(evt) {
        evt.preventDefault();
        window.open('/login', '_self');
    });
}