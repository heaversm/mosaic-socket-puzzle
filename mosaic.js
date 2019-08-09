//server vars
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//connection vars
let numConnections = 0;
let lastConnections = 0;
const requiredConnections = 9;


app.use(express.static('public'))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const handleConnectionChange = function(){
    //console.log(numConnections);
    
    if (numConnections == requiredConnections && numConnections > lastConnections){
        //console.log('emitConnectionsReached');
        emitConnectionsReached();
    } else if (numConnections < requiredConnections && lastConnections == requiredConnections){
        //console.log('emitDisconnections');
        emitDisconnections();
    }
    
    if (numConnections < requiredConnections){
        emitConnectionChange();
    }
}

const emitConnectionsReached = function(){
    io.emit('handleConnect', { numConnections: numConnections });
}

const emitDisconnections = function(){
    io.emit('handleDisconnect', { numConnections: numConnections });
}

const emitConnectionChange = function(){
    io.emit('handleConnectionChange', { numConnections: numConnections, lastConnections: lastConnections });
}

io.on('connection', function (socket) {
    lastConnections = numConnections;
    numConnections++;
    //console.log('a user connected');
    handleConnectionChange();
    socket.on('disconnect', function () {
        //console.log('user disconnected');
        lastConnections = numConnections;
        numConnections--;
        handleConnectionChange();
    });
});


http.listen(port, () => console.log(`Example app listening on port ${port}!`));