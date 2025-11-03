// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { useState, useEffect } from "react"; // Import React and hooks: useState → for local component state, useEffect → for side-effects like updating state after mount
import { useSelector } from "react-redux"; // Import useSelector to read state from the Redux store
import type { RootState } from "../app/store"; // TypeScript type for the root Redux state
import { Todo } from "../app/store/todoSlice"; // Import Todo type from Redux slice
import TodoItem from "./TodoItem"; // Import TodoItem component to display each todo
import { useTheme } from "../app/theme-provider"; // Import custom hook to access current theme (light/dark/blue)

// TypeScript type for filtering todos
type Filter = "All" | "Active" | "Completed";

// Main component
export default function TodoList() {

  // Get current theme from custom hook
  const { theme } = useTheme();

  // Get todos array from Redux store
  const todos = useSelector((state: RootState) => state.todos.todos);
  
  // State for current filter (All, Active, Completed)
  const [filter, setFilter] = useState<Filter>("All");
  // State for current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  // Use a "hasMounted" flag to avoid hydration mismatches in Next.js
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Schedule this after client hydration
    const id = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(id);
    // Ensures the component only fully renders after client mount to prevent SSR/client mismatches
  }, []);
  
  // Number of todos to display per page
  const todosPerPage = 10; 

  // Apply filter based on the selected filter
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true; // "All" shows all todos
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / todosPerPage));
  // Total number of pages (minimum 1)
  
  // Slice the filtered todos array for the current page
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Ensure currentPage does not exceed totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      queueMicrotask(() => setCurrentPage(totalPages));
    }
  }, [currentPage, totalPages]);

  // Guard against SSR/client mismatch: render lightweight placeholder until client mount
  if (!hasMounted) {
    return <div className={`todo-list-container ${theme}`} />;
  }

  // Show a message if there are no todos
  if (todos.length === 0) return <p>No todos yet. Add one above.</p>;

  return (
    <div className={`todo-list-container ${theme}`}>
      {/* Filters */}
      <div className="todo-filters">
        {(["All", "Active", "Completed"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""} ${theme}`}
            onClick={() => {
              setFilter(f); 
              // Reset to first page when changing filter
              setCurrentPage(1); 
              
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo Items */}
      <ul className="todo-list">
        {currentTodos.map((todo: Todo) => (
          // Render each todo using the TodoItem component
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`pagination-btn ${theme}`}
        >
          {/* Go to previous page, disabled on first page */}
          Prev
        </button>

        <span className={`pagination-info ${theme}`}>
           {/* Show current page info */}
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`pagination-btn ${theme}`}
        >
          {/* Go to next page, disabled on last page */}
          Next
        </button>
      </div>
    </div>
  );
}
