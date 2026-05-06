import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// PÁGINAS
import Principal from "./pages/principal";
import AlumnoPage from "./pages/alumno";
import FormAlumnoPage from "./pages/formAlumno";
import DashboardPage from "./pages/dashboard";
import RankingPage from "./pages/ranking";
import ProfesoresPage from "./pages/profesores";
import NotasPage from "./pages/notas";
import AlertasPage from "./pages/alertas";
import BadgesPage from "./pages/badges";
import UtnPage from "./pages/paginaUTN";
import UbaPage from "./pages/paginaUBA";
import UnsamPage from "./pages/paginaUNSAM";
import EasyMode from "./pages/easyMode";
import BrainHunter from "./pages/brainHunter";
import GhostHunter from "./pages/ghostHunter";

// DEFINICIÓN DE RUTAS
const router = createBrowserRouter([
  { path: "/", element: <Principal /> },
  
  // Alumno individual
  { path: "/alumno/:id", element: <AlumnoPage /> },
  
  // Nuevas rutas principales
  { path: "/crear-alumno", element: <FormAlumnoPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/ranking", element: <RankingPage /> },
  { path: "/profesores", element: <ProfesoresPage /> },
  { path: "/notas", element: <NotasPage /> },
  { path: "/alertas", element: <AlertasPage /> },
  { path: "/badges", element: <BadgesPage /> },

  // Páginas de universidades
  { path: "/utn", element: <UtnPage /> },
  { path: "/uba", element: <UbaPage /> },
  { path: "/unsam", element: <UnsamPage /> },
  { path: "/easy", element: <EasyMode /> },
  { path: "/ghost", element: <GhostHunter /> },
  { path: "/brain", element: <BrainHunter /> }
]);

// RENDER
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
