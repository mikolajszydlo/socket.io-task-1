const express = require("express");
const socket = require("socket.io");

const app = express();

app.use('/', (req, res) => {
  res.send('Not found');
});

const server = app.listen(8000, () => {
  console.log("Server is running...")
});

const io = socket(server, {cors: {origin: "*"}});

const tasks = [
  {id: '7avBkPhfmgcsEyFWTND3kK', name: 'Shopping'},
  {id: 'tLNoiy3wnycNRA1J69FrTZ', name: 'Go out with a dog'},
];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('updateData', tasks);
  });

  socket.on('removeTask', (taskId) => {
    let taskIndex = null;
    taskIndex = tasks.indexOf(tasks.find(task => task.id === taskId));
    tasks.splice(taskIndex, 1);

    socket.broadcast.emit('updateData', tasks);
  })
})