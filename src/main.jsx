import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import { SiteProvider } from "./context/SiteContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<ThemeProvider>
  <HelmetProvider>
    <SiteProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SiteProvider>
  </HelmetProvider>
</ThemeProvider>
  </React.StrictMode>
);