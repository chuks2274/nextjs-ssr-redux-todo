// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { useState } from "react"; //Import React and useState for local state
import { useSelector } from "react-redux"; //Import Hook to read state from Redux store
import TodoItem from "./TodoItem"; //Import component to render individual todos
import type { RootState } from "../app/store"; //Import type for Redux state
import type { Todo } from "../app/store/todoSlice"; //Import type for a single todo item

// Define allowed filter options
type Filter = "All" | "Active" | "Completed";


// TodoList component: displays list of todos with filtering
export default function TodoList() {
  // Get todos from Redux store
  const todos = useSelector((state: RootState) => state.todos.todos);

  // Local state to track which filter is selected
  const [filter, setFilter] = useState<Filter>("All");

  // Filter todos based on selected filter
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === "Active") return !todo.completed;      // Show only incomplete todos
    if (filter === "Completed") return todo.completed;   // Show only completed todos
    return true;                                         // Show all todos
  });

  // Show message if there are no todos
  if (todos.length === 0) return <p>No todos yet. Add one above.</p>;

  return (
    <div>
      {/* Filter buttons */}
      <div className="todo-filters">
        {(["All", "Active", "Completed"] as Filter[]).map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""} // Highlight selected filter
            onClick={() => setFilter(f)}             // Update filter on click
          >
            {f}
          </button>
        ))}
      </div>

      {/* Render filtered todos using TodoItem */}
      <ul className="todo-list">
        {filteredTodos.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} /> // Pass todo to TodoItem component
        ))}
      </ul>
    </div>
  );
}
