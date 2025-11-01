// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { useState, useRef, useEffect } from "react"; // Import React hooks
import { useDispatch } from "react-redux"; // Import Hook to dispatch actions to Redux store
import { toggleTodo, deleteTodo, editTodo, Todo } from "../app/store/todoSlice"; // Import Redux actions and Todo type
import type { AppDispatch } from "../app/store"; // Import TypeScript type for typed dispatch

// TodoItem component: represents a single todo item
// Props:
// - todo: the current todo object
// - nextInputRef: optional ref to the next todo's input for smooth keyboard navigation
export default function TodoItem({
  todo,
  nextInputRef,
}: {
  todo: Todo;
  nextInputRef?: React.RefObject<HTMLInputElement>;
}) {
  // Get typed dispatch function to interact with Redux store
  const dispatch = useDispatch<AppDispatch>();

  // Local state to track whether the todo is currently being edited
  const [isEditing, setIsEditing] = useState(false);

  // Local state to hold the text while editing
  const [editText, setEditText] = useState(todo.text);

  // Ref to the input element when editing, so we can programmatically focus it
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // Focus input when editing starts
    }
  }, [isEditing]); // Runs whenever isEditing changes

  // Function to save the edited todo
  const handleSave = () => {
    const trimmed = editText.trim(); // Remove whitespace at the start and end

    // Only dispatch if text is non-empty and has changed
    if (trimmed && trimmed !== todo.text) {
      dispatch(editTodo({ id: todo.id, newText: trimmed }));
    }

    setIsEditing(false); // Exit edit mode

    // Focus next todo's input if available (for smooth keyboard navigation)
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
  };

  return (
    <li className="todo-item">
      {/* Left side: checkbox and text/input */}
      <div className="todo-left">
        <label className="todo-label">
          {/* Checkbox to toggle completed state */}
          <input
            type="checkbox"
            checked={todo.completed} // Checked if todo.completed is true
            onChange={() => dispatch(toggleTodo(todo.id))} // Dispatch toggleTodo on change
          />

          {/* If editing, show input; otherwise show text */}
          {isEditing ? (
            <input
              ref={inputRef} // Ref for focus
              value={editText} // Bind to editText state
              onChange={(e) => setEditText(e.target.value)} // Update state on input
              onKeyDown={(e) => e.key === "Enter" && handleSave()} // Save on Enter key
              className="todo-edit-input" // CSS class
            />
          ) : (
            <span
              className={todo.completed ? "completed" : ""} // Strike-through if completed
              onDoubleClick={() => setIsEditing(true)} // Double-click to start editing
            >
              {todo.text} {/* Display todo text */}
            </span>
          )}
        </label>
      </div>

      {/* Right side: action buttons */}
      <div className="todo-actions">
        {/* If editing, show Save button; otherwise show Edit button */}
        {isEditing ? (
          <button onClick={handleSave} className="save">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit">
            Edit
          </button>
        )}

        {/* Delete button always visible */}
        <button onClick={() => dispatch(deleteTodo(todo.id))} className="delete">
          Delete
        </button>
      </div>
    </li>
  );
}
