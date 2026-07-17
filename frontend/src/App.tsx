import { BrowserRouter } from "react-router";
import Routes from "./routes";
import { UserProvider } from "./auth/useAuth";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "./components/error-boundery/ErrorBoundery";

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
          <Routes />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
          />
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}
