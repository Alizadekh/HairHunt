import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import Login from "./components/Auth/Login";
import Signin from "./components/Auth/Signin";
import Mybusiness from "./pages/admin/Mybusiness";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminRezervations from "./pages/admin/AdminRezervations";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mybusiness" element={<Mybusiness />} />
        <Route path="/mybusiness/profile" element={<AdminProfile />} />
        <Route
          path="/mybusiness/reservations"
          element={<AdminRezervations />}
        />
      </Routes>
    </>
  );
}

export default App;
