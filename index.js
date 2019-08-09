//server vars
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//connection vars
const numConnections = 0;


app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){
    numConnections++;
    console.log('a user connected');
});
  

http.listen(port, () => console.log(`Example app listening on port ${port}!`))