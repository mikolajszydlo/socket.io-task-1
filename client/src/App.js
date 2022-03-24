import React, { useEffect, useRef, useState } from 'react';
import uuid from 'short-uuid';
import { io } from 'socket.io-client';



const App = () => {
  const [tasks, setTasks] = useState([]);
  const inputEl = useRef(null);
  const socket = io('http://localhost:8000');

  useEffect(() => {
    socket.on('updateData', (tasksFromServer) => {
      setTasks([...tasksFromServer])
    });

    socket.on('addTask', (tasksFromServer) => {
      console.log(tasksFromServer);
      setTasks([...tasksFromServer]);
    });

    socket.on('removeTask', (tasksFromServer) => {
      setTasks([...tasksFromServer]);
    });

  }, []);

  const removeTask = taskId => {
    const newArr = tasks.filter(task => task.id !== taskId)
    setTasks([...newArr]);
    socket.emit('removeTask', taskId);
  };

  const addTask = e => {
    e.preventDefault();
    const newTaskId = uuid.generate();
    tasks.push({
      id: newTaskId,
      name: inputEl.current.value,
    });
    setTasks([...tasks]);
    socket.emit('addTask', {
      id: newTaskId,
      name: inputEl.current.value,
    });
    inputEl.current.value = '';
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">{task.name}<button onClick={() => removeTask(task.id)} className="btn btn--red">Remove</button></li>
          ))}
        </ul>
  
        <form id="add-task-form">
          <input className="text-input" autoComplete="off" ref={inputEl} type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" onClick={event => addTask(event)} type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;
