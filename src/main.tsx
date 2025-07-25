import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";

import "./index.css";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error("Could not find root element");

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
