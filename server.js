const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const server = app.listen(8000, console.log("listening on port"));
const io = require('socket.io')(server);
var counter = 0;


io.on('connection', function (socket) { //This triggers our server's connection listener to run, and this occurs for every new socket connection.
    socket.emit("currentCount", {current: counter});

    socket.on('updatedCount', function (data) { //The server's listener with the matching 'thank you' label will be triggered...
        // console.log(data.survey); //...and invoke its callback.
        // console.log(data.rand);
        counter+=1;
        socket.emit("currentCount", {current: counter});
    });

    socket.on('reset', function(data){
        counter = 0;
        socket.emit("currentCount", {current: counter});
    })
});

app.get('/', (req, res) => {
    res.render('index', { info: counter });
});
