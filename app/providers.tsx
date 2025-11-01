// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import { Provider } from "react-redux"; // Import Redux's Provider component
import { store } from "./store";         // Import the Redux store we configured earlier

// Custom Providers component
// This wraps your app (or part of it) with Redux's <Provider>
// so that all child components can access the Redux store.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Wrap children with Redux Provider and pass in the store
    // Now any nested component can use Redux hooks like useSelector/useDispatch
    <Provider store={store}>
      {children}
    </Provider>
  );
}
