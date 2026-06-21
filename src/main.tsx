import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// GitHub Pages 404 redirect: decode the path from the query param
const search = window.location.search;
if (search && search.startsWith("?/")) {
  const path = decodeURIComponent(search.slice(1));
  window.history.replaceState(null, "", path);
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/BitRecon">
    <App />
  </BrowserRouter>,
);
