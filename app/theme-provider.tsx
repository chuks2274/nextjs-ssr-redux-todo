// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { createContext, useContext, useState, useEffect } from "react"; // Import React and hooks for state, context, and side effects

// Define allowed theme values
type Theme = "light" | "dark" | "blue";

// Define the shape of the ThemeContext
// This tells TypeScript what properties the context will have
interface ThemeContextType {
  theme: Theme;         // Current theme
  toggleTheme: () => void; // Function to cycle through themes
}

// Create the ThemeContext with undefined as initial value
// Components will later use this context to access the current theme and toggle function
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


// ThemeProvider component
// Wraps parts of the app that need access to theme
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useState stores the current theme (default is "light")
  const [theme, setTheme] = useState<Theme>("light");

  // useEffect updates the HTML <body> data attribute whenever theme changes
  // This allows CSS to target [data-theme="light"], [data-theme="dark"], etc.
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Function to cycle through the themes in order: light → dark → blue → light
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "blue" : "light"
    );
  };

  // Provide the current theme and toggle function to all children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} {/* Render all child components inside the provider */}
    </ThemeContext.Provider>
  );
}


// Custom hook to use theme in other components
// This allows components to easily access `theme` and `toggleTheme`
// Example: const { theme, toggleTheme } = useTheme();
export function useTheme() {
  const context = useContext(ThemeContext); // Get context value
  if (!context) throw new Error("useTheme must be used within ThemeProvider"); // Safety check
  return context; // Return context if available
}