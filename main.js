export default function socketConfiguration(sockets)  {
    let DEBUG = true
    const SOCKET_LIST = {}
    const PLAYER_LIST = {}

    var Player = function(id){
        var self = {
            x:250,
            y:250,
            id:id,
            number:"" + Math.floor(10 * Math.random()),
            pressingRight:false,
            pressingLeft:false,
            pressingUp:false,
            pressingDown:false,	
            maxSpd:2,
        }

        self.updatePosition = function(){
            if(self.pressingRight)
                self.x += self.maxSpd
            if(self.pressingLeft)
                self.x -= self.maxSpd
            if(self.pressingUp)
                self.y -= self.maxSpd
            if(self.pressingDown)
                self.y += self.maxSpd
        }
        return self
    }

    sockets.on('connection', socket => {

        const player = Player(socket.id)
        SOCKET_LIST[socket.id] = socket
	    PLAYER_LIST[socket.id] = player


        socket.on('disconnect', () => {
            delete SOCKET_LIST[socket.id]
            delete PLAYER_LIST[socket.id]
        })

        socket.on('keyPress',function(data){
            if(data.inputId === 'left')
                player.pressingLeft = data.state
            else if(data.inputId === 'right')
                player.pressingRight = data.state
            else if(data.inputId === 'up')
                player.pressingUp = data.state
            else if(data.inputId === 'down')
                player.pressingDown = data.state
        })

        socket.on('sendMsgToServer', (data) => {

            const name = ('' + socket.id).slice(2, 7)

            for (const i in SOCKET_LIST) {
                SOCKET_LIST[i].emit('addToChat', `${name}: ${data}`)
            }

        })

        socket.on('evalServer', (data) => {

            if(!DEBUG) return

            const res = eval(data)
            socket.emit('evalAnswer', res)
        })

        
    })

    setInterval(function(){
        var pack = []
        for(var i in PLAYER_LIST){
            var player = PLAYER_LIST[i]
            player.updatePosition()
            pack.push({
                x:player.x,
                y:player.y,
                number:player.number
            });	
        }
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i]
            socket.emit('newPositions',pack)
        }
    },1000/120)
    
}