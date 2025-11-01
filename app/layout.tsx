import "./globals.css"; // Import global styles that apply to the entire app.
import { Providers } from "./providers"; // Import the custom Redux provider component.
import { ThemeProvider } from "./theme-provider"; // Import the custom ThemeProvider.


//  Define basic metadata for the app (used by Next.js for SEO & browser info).
// `title` shows up in the browser tab, and `description` is used for meta tags.
export const metadata = {
  title: "Next.js SSR Todo", // App title
  description: "Todo app with Redux and Next.js App Router", // Short app description
};


// RootLayout component
// This defines the base HTML structure shared by all pages in the app.
// Every page in the `app/` directory will be rendered inside this layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Standard HTML structure: Next.js requires <html> and <body> tags here.
    <html lang="en">
      <body>
        {/* 
          Wrap everything inside the Redux <Provider> 
          so that any component (at any level) can access Redux state 
          and dispatch actions.
        */}
        <Providers>
          {/*
            Wrap the content with ThemeProvider to enable theme toggling
            (e.g., light/dark mode) throughout the app.
            The ThemeProvider listens to user preference and updates UI accordingly.
          */}
          <ThemeProvider>
            {/*
              Render all child components (like pages or components inside routes).
              Next.js automatically passes the page content as `children`.
            */}
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}