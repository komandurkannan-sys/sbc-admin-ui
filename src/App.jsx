import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Homes from "./pages/Homes";
import Devices from "./pages/Devices";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
        <Link to="/homes">Homes</Link>{" | "}
        <Link to="/devices">Devices</Link>{" | "}
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}
