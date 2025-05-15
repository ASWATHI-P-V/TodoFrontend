import React, { useState, useEffect } from "react";
import axios from "./api/axios"; // Import the Axios instance
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Fetch todos from the Django backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/todos/");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (input.trim() !== "") {
      try {
        const response = await axios.post("/todos/", {
          task: input,
          completed: false,
        });
        setTodos([...todos, response.data]);
        setInput("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

     // Toggle the completed status of a todo
  const toggleCompleted = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    axios.put(`http://127.0.0.1:8000/api/todos/${id}/`, { ...todo, completed: !todo.completed })
      .then((response) => {
        setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      })
      .catch((error) => console.error(error));
  };

  

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}/`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="todo-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo.id)}
            />  
            {todo.task}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;