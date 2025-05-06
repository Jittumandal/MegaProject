import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import "./index.css";
import "@mantine/core/styles.css";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppRoutes />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
);
