var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'pug')
app.set('views', './views')
const onlineUsers = new Map();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// User request with an id to get online users
app.get('/private/:userID', function (req, res) {

  onlineUsers.set(req.params.userID, '')
  res.render('private', { userIDs: onlineUsers } );
});

io.of('/private')
  .on('connection', function(socket) {
    console.log('private chat connection');
  });

io.on('connection', function(socket) {
  console.log('new connectio');
  socket.emit('connected', { data: 'You are connected', id: socket.id });
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

module.exports = http;