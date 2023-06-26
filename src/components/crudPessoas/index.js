import React, { useState } from 'react';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState('');

  const handleInputChange = (e) => {
    setInputTask(e.target.value);
  };

  const addTask = () => {
    if (inputTask.trim() !== '') {
      const newTask = {
        id: new Date().getTime(),
        value: inputTask.trim()
      };
      setTasks([...task, newTask]);
      setInputTask('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const editTask = (taskId, taskValue) => {
    setEditTaskId(taskId);
    setEditTaskValue(taskValue);
  };

  const updateTask = () => {
    if (editTaskId && editTaskValue.trim() !== '') {
      const updatedTasks = tasks.map(task => {
        if (task.id === editTaskId) {
          task.value = editTaskValue.trim();
        }
        return task;
      });
      setTasks(updatedTasks);
      setEditTaskId(null);
      setEditTaskValue('');
    }
  };

  return (
    <div>
      <h2>Task Management</h2>

      <div>
        <input
          type="text"
          placeholder="Enter task"
          value={inputTask}
          onChange={handleInputChange}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <input
                type="text"
                value={editTaskValue}
                onChange={(e) => setEditTaskValue(e.target.value)}
              />
            ) : (
              task.value
            )}
            <button onClick={() => editTask(task.id, task.value)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editTaskId && (
        <div>
          <button onClick={updateTask}>Update Task</button>
          <button onClick={() => setEditTaskId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TaskApp;