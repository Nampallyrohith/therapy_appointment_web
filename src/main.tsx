import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "@/components/ui/provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider defaultTheme="light">
      <BrowserRouter>
        <AppointmentProvider>
          <App />
        </AppointmentProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
