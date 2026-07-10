import { BrowserRouter } from "react-router";
import Routes from "./routes";
import { UserProvider } from "./auth/useAuth";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
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
  );
}
