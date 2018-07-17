
var express = require('express');
var fs = require('fs')
var app = express();
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    return res.render('index');
});
app.use(express.static('public'));
const server = require('http').Server(app);
const io = require('socket.io')(server);
const SocketHander = require('./socket/index');

socketHander = new SocketHander();
socketHander.connect();

io.on('connection', async (socket) => {

    console.log('a user connected');
    /*const history = await socketHander.getMessages();
    const socketid = socket.id;
    io.to(socketid).emit('history', history);        */
    const history = await socketHander.gethistory();
    var history_arr=[]
    for(var i=history.length-1;i>=0;i--){
        history_arr.push(history[i].value)
    }
    io.emit('history', history_arr);
    setInterval(async function () {
        const socketid = socket.id;
        data = await socketHander.getdata();
        io.to(socketid).emit('data', data[0].value);
    }, 1000);
});
setInterval(function () {
    var tmp_value = Math.floor((Math.random() * 20) + 1);
    socketHander.storeMessages(tmp_value.toString())
}, 1000);

server.listen(3001);


/*
//把json寫入
fs.readFile('json/object1.json', 'utf8', function (err, data) {
    if (err) throw err;
   // console.log(data);
   socketHander = new SocketHander();

    socketHander.connect();
    var json = JSON.parse(data);
    socketHander.storeMessages(json)
    
});
*/