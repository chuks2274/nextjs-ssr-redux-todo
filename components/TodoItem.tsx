// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react"; // Import React and hooks: useState → local state, useRef → reference to DOM elements, useEffect → side effects, useMemo → memoize expensive calculations
import { useDispatch } from "react-redux";// Import Redux hook to dispatch actions to the store
import { toggleTodo, deleteTodo, updateTodo, Todo } from "../app/store/todoSlice"; // Import actions and Todo type from Redux slice
import { useTheme } from "../app/theme-provider"; // Custom hook for theme (light/dark/blue)
import type { AppDispatch } from "../app/store"; // TypeScript type for typed dispatch


// Main component
export default function TodoItem({ todo }: { todo: Todo }) {

  // Initialize typed Redux dispatch
  const dispatch = useDispatch<AppDispatch>();
  
  // Get current theme
  const { theme } = useTheme();

  // Local state for modal and edit fields
  // Track if the edit modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Store editable title
  const [editTitle, setEditTitle] = useState(todo.title);
  // Store editable description
  const [editDescription, setEditDescription] = useState(todo.description);
  
  // Reference for auto-focus on input when modal opens
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) inputRef.current.focus();
    // useEffect triggers whenever isModalOpen changes
  }, [isModalOpen]);

  // Memoized formatted date/time string
  const formattedDateTime = useMemo(() => {
    if (!todo.date && !todo.time) return "";
    try {
      const date = todo.date ? new Date(todo.date) : null;
      const time = todo.time ?? "";
      if (date && !isNaN(date.getTime())) {
        return `${date.toLocaleDateString()}${time ? ` at ${time}` : ""}`;
      }
      return time;
    } catch {
      return "";
    }
  // useMemo avoids recalculating formatted date/time on every render
  }, [todo.date, todo.time]);

  // Save changes from modal
  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    // Do nothing if title is empty
    if (!trimmedTitle) return; 
    // Dispatch update if something changed
    if (trimmedTitle !== todo.title || editDescription !== todo.description) {
      dispatch(updateTodo({ ...todo, title: trimmedTitle, description: editDescription }));
    }
    // Close modal after save
    setIsModalOpen(false); 
  };

  // Theme colors for modal
  const themeColors = {
    light: {
      modalBg: "#ffffff",
      text: "#000000",
      inputBg: "#ffffff",
      inputText: "#000000",
      inputBorder: "#ccc",
      overlayBg: "rgba(0,0,0,0.4)"
    },
    dark: {
      modalBg: "#1e1e1e",
      text: "#ffffff",
      inputBg: "#ffffff",
      inputText: "#000000",
      inputBorder: "#444",
      overlayBg: "rgba(0,0,0,0.7)"
    },
    blue: {
      modalBg: "#8cc4ff",
      text: "#000000",
      inputBg: "#ffffff",
      inputText: "#000000",
      inputBorder: "#007bff",
      overlayBg: "rgba(0,0,50,0.5)"
    }
  };
  // Select colors based on current theme
  const colors = themeColors[theme] || themeColors.light;

  return (
    <>
      {/* Todo item displayed in horizontal layout */}
      <li
        className={`todo-item ${theme}`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #ccc",
          gap: "1rem",
        }}
      >
        {/* Left side: checkbox + todo details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 }}>
          <div>
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
              style={{ marginRight: "0.5rem" }}
            />
            <label style={{ fontWeight: "bold" }}>Completed</label>
            {/* ✅ Checkbox to toggle completed status */}
          </div>

          {/* Title */}
          <div className="todo-field">
            <strong>Title:</strong> <span className="todo-text">{todo.title}</span>
          </div>

          {/* Optional description */}
          {todo.description && (
            <div className="todo-field">
              <strong>Description:</strong> <span className="todo-text">{todo.description}</span>
            </div>
          )}

          {/* Optional date/time */}
          {(todo.date || todo.time) && (
            <div className="todo-field">
              <strong>Date/Time:</strong> <span className="todo-text">{formattedDateTime}</span>
            </div>
          )}
        </div>

        {/* Right side: Edit/Delete buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            className="edit-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => dispatch(deleteTodo(todo.id))}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </li>

      {/* Edit modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.overlayBg,
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: colors.modalBg,
              color: colors.text,
              padding: "1.5rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Edit Todo</h3>

            {/* Title input */}
            <label htmlFor={`title-${todo.id}`} style={{ display: "block", marginBottom: "0.3rem", textAlign: "center" }}>
              Title
            </label>
            <input
              ref={inputRef}
              id={`title-${todo.id}`}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                borderRadius: "4px",
                border: `1px solid ${colors.inputBorder}`,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
              }}
            />

            {/* Description textarea */}
            <label htmlFor={`desc-${todo.id}`} style={{ display: "block", marginBottom: "0.3rem", textAlign: "center" }}>
              Description
            </label>
            <textarea
              id={`desc-${todo.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                borderRadius: "4px",
                border: `1px solid ${colors.inputBorder}`,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                resize: "none",
              }}
            />

            {/* Modal buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={handleSave}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#28a745", color: "#fff", cursor: "pointer" }}
              >
                Update
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#6c757d", color: "#fff", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
