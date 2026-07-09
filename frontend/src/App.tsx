import { BrowserRouter } from "react-router";
import Routes from "./routes";
import { UserProvider } from "./auth/useAuth";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </UserProvider>
  );
}
