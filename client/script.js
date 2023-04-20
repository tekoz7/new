const socket = io()

const chat = document.getElementById('chat')
const messages = document.getElementById('messages')

socket.on('evalAnswer', data => console.log(data))
socket.on('addToChat', data => messages.innerHTML += `<div>${data}</div>`)

chat.onsubmit = e => {

    e.preventDefault()

    const send = e.target.msg

    if(send.value[0] === '/') {
        socket.emit('evalServer', send.value.slice(1))
        return
    } 

    socket.emit('sendMsgToServer', send.value)
    send.value = ''
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

context.font = '30px Arial';

socket.on('newPositions',function(data){
    context.clearRect(0,0,500,500)
    for(var i = 0 ; i < data.length; i++)
    context.fillText(data[i].number,data[i].x,data[i].y)
})

document.onkeydown = function(event){
    if(event.key === 'd')	//d
        socket.emit('keyPress',{inputId:'right',state:true})
    else if(event.key === 's')	//s
        socket.emit('keyPress',{inputId:'down',state:true})
    else if(event.key === 'a') //a
        socket.emit('keyPress',{inputId:'left',state:true})
    else if(event.key === 'w') // w
        socket.emit('keyPress',{inputId:'up',state:true})

}
document.onkeyup = function(event){
    if(event.key === 'd')	//d
        socket.emit('keyPress',{inputId:'right',state:false})
    else if(event.key === 's')	//s
        socket.emit('keyPress',{inputId:'down',state:false})
    else if(event.key === 'a') //a
        socket.emit('keyPress',{inputId:'left',state:false})
    else if(event.key === 'w') // w
        socket.emit('keyPress',{inputId:'up',state:false})
}
