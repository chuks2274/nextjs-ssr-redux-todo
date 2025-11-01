// "use client" directive tells Next.js that this component should be rendered on the client side.
// Necessary when using React hooks, state, or any interactivity (like Redux dispatch).
"use client";

import React from "react"; // Import React (needed for JSX)
import AddTodo from "../components/AddTodo"; // Import the AddTodo component (form to add new todos)
import TodoList from "../components/TodoList"; // Import the TodoList component (displays all todos)


// HomePage component
// This is the main page of the app where users can add and view todos.
export default function HomePage() {
  return (
    // Container div for styling purposes
    <div className="container">
      {/* Page title */}
      <h1 style={{ flex: 1, textAlign: "center", margin: 0 }}>Next.js SSR + Redux Todo App</h1>

      {/* AddTodo component: form/input where users can add a new todo */}
      <AddTodo />

      {/* TodoList component: shows all the todos stored in Redux state */}
      <TodoList />
    </div>
  );
}
