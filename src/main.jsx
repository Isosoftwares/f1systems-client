import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "animate.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { CompanyProvider } from "./context/CompanyContext";
import { HelmetProvider } from "react-helmet-async";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CompanyProvider>
              <MantineProvider
                theme={{
                  primaryColor: "red",
                  colors: {
                    red: [
                      "#ffe5e7",
                      "#ffccd0",
                      "#ff9b9f",
                      "#ff646b",
                      "#fe3642",
                      "#ff1a2b",
                      "#ff0014",
                      "#e6000e",
                      "#cc000a",
                      "#b30006",
                    ],
                    dark: [
                      "#C1C2C5",
                      "#A6A7AB",
                      "#909296",
                      "#5C5F66",
                      "#373A40",
                      "#2C2E33",
                      "#25262B",
                      "#1A1B1E",
                      "#141517",
                      "#101113",
                    ],
                  },
                }}
              >
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
              </MantineProvider>
            </CompanyProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
