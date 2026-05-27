// index.js
const express = require("express");
const sequelize = require("./config/db");

require("./models"); // inicializa todos los modelos

// Controladores
const {
  buscarAlumno,
  ingresarAlumno,
  editarAlumno,
  eliminarAlumno,
  obtenerAlumnoCompleto,
  ingresarProfesor,
  editarProfesor,
  listarProfesores,
  obtenerProfesor,
  eliminarProfesor,
  listarMateriasPorCarrera,
  getConejosByAlumno,
  getNotasExamenesByAlumno,
  getNotasMateriasByAlumno,
  listarAlumnosPorCarrera,
  listarCarreras,
  getNotasExamenes0a3,
  getNotasExamenes4a7,
  getNotasExamenes7a10,
  getNotasMaterias0a3,
  getNotasMaterias4a7,
  getNotasMaterias7a10,
  getDashboardStats,
  getRanking,
  crearNotaExamen,
  editarNotaExamen,
  eliminarNotaExamen,
  crearNotaMateria,
  editarNotaMateria,
  getAlumnosBajaPerformance,
} = require("./controller/peticionesAlumno");

const server = express();
server.use(express.json());

// CORS
server.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:3000",
    /campuscore.*\.vercel\.app$/,
  ];
  const isAllowed = allowedOrigins.some((allowed) =>
    typeof allowed === "string" ? allowed === origin : allowed.test(origin)
  );
  if (isAllowed || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* ===========================
         RUTAS ALUMNOS
   =========================== */

server.get("/alumnos/buscar", buscarAlumno);
server.post("/alumnos/ingresar", ingresarAlumno);
server.put("/alumnos/editar/:id", editarAlumno);
server.delete("/alumnos/:id", eliminarAlumno);
server.get("/alumnos/:id", obtenerAlumnoCompleto);

/* ===========================
       RUTAS PROFESORES
   =========================== */

server.get("/profesores", listarProfesores);
server.get("/profesores/:id", obtenerProfesor);
server.post("/profesores/ingresar", ingresarProfesor);
server.put("/profesores/editar/:id", editarProfesor);
server.delete("/profesores/:id", eliminarProfesor);

/* ===========================
     RUTAS NOTAS EXÁMENES
   =========================== */

server.post("/notas-examenes", crearNotaExamen);
server.put("/notas-examenes/:id", editarNotaExamen);
server.delete("/notas-examenes/:id", eliminarNotaExamen);

/* ===========================
     RUTAS NOTAS MATERIAS
   =========================== */

server.post("/notas-materias", crearNotaMateria);
server.put("/notas-materias/:id", editarNotaMateria);

/* ===========================
       RUTAS USUARIO
   =========================== */

// Obtener alumno por ID (simple)
server.get("/alumno/:id", obtenerAlumnoCompleto);

// Conejos
server.get("/alumno/:id/conejos", getConejosByAlumno);

// Notas de un alumno
server.get("/alumno/:id/notas-examenes", getNotasExamenesByAlumno);
server.get("/alumno/:id/notas-materias", getNotasMateriasByAlumno);

// Materias por carrera
server.get("/carreras/:idCarrera/materias", listarMateriasPorCarrera);

// Alumnos por carrera
server.get("/carreras/:idCarrera/alumnos", listarAlumnosPorCarrera);

// Todas las carreras
server.get("/carreras", listarCarreras);

/* ===========================
       RUTAS ANALYTICS
   =========================== */

server.get("/dashboard/stats", getDashboardStats);
server.get("/ranking", getRanking);
server.get("/alumnos-baja-performance", getAlumnosBajaPerformance);

/* ===========================
      RUTAS EASY MODE
   =========================== */

server.get("/notas-examenes/0-3", getNotasExamenes0a3);
server.get("/notas-examenes/4-7", getNotasExamenes4a7);
server.get("/notas-examenes/7-10", getNotasExamenes7a10);

server.get("/notas-materias/0-3", getNotasMaterias0a3);
server.get("/notas-materias/4-7", getNotasMaterias4a7);
server.get("/notas-materias/7-10", getNotasMaterias7a10);

/* ===========================
             SERVER
   =========================== */

server.listen(3000, "0.0.0.0", async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Tablas sincronizadas correctamente");
    console.log("Servidor corriendo en puerto 3000");
  } catch (error) {
    console.error("Error al sincronizar las tablas:", error);
  }
});
