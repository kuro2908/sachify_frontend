import React from "react";
import Router from "./router/Router";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import BackToTop from "./components/ui/BackToTop";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router />
        <BackToTop />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
