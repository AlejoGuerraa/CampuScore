// peticionesAlumno.js

const { Op } = require("sequelize");
const { alumnos, carreras, facultades, materias, profesores, conejos, alumnos_conejos, notas_materias, notas_examenes } = require("../models");

const buscarAlumno = async (req, res) => {
  const { search } = req.query;

  // parámetros de paginación
  const limit = parseInt(req.query.limit) || 100;   // por defecto 20
  const offset = parseInt(req.query.offset) || 0;  // por defecto 0

  try {
    const where = {};

    if (search) {
      const term = `%${search}%`;
      where[Op.or] = [
        { nombre: { [Op.like]: term } },
        { apellido: { [Op.like]: term } },
        { dni: { [Op.like]: term } },
      ];
    }

    // COUNT TOTAL (sin paginación)
    const total = await alumnos.count({ where });

    // BUSCAR SOLO EL BLOQUE QUE CORRESPONDE
    const datos = await alumnos.findAll({
      where,
      include: [
        {
          model: carreras,
          as: "carrera",
          attributes: ["id", "nombre"],
        },
        {
          model: facultades,
          as: "facultad",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    // Mapear igual que tu versión original
    const results = datos.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      apellido: a.apellido,
      telefono: a.telefono,
      direccion: a.direccion,
      dni: a.dni,
      edad: a.edad,
      nacionalidad: a.nacionalidad,
      id_carrera: a.id_carrera,
      id_facultad: a.id_facultad,
      carrera: a.carrera ? a.carrera.nombre : null,
      facultad: a.facultad ? a.facultad.nombre : null,
    }));

    return res.json({
      results,
      total,
    });
  } catch (error) {
    console.error("buscarAlumno error:", error);
    return res.status(500).json({ error: "Error buscando alumno." });
  }
};


const ingresarAlumno = async (req, res) => {
  try {
    const nuevo = await alumnos.create(req.body);
    res.status(200).json({ message: "Alumno ingresado correctamente", data: nuevo });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al ingresar alumno" });
  }
};

const editarAlumno = async (req, res) => {
  const { id } = req.params;

  try {
    const alumno = await alumnos.findByPk(id);
    if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

    await alumno.update(req.body);
    res.json({ message: "Alumno actualizado", data: alumno });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al editar alumno" });
  }
};

const ingresarProfesor = async (req, res) => {
  try {
    const nuevo = await profesores.create(req.body);
    res.status(200).json({ message: "Profesor ingresado correctamente", data: nuevo });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al ingresar profesor" });
  }
};

const editarProfesor = async (req, res) => {
  const { id } = req.params;

  try {
    const prof = await profesores.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Profesor no encontrado" });

    await prof.update(req.body);
    res.json({ message: "Profesor actualizado", data: prof });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al editar profesor" });
  }
};
const listarMateriasPorCarrera = async (req, res) => {
  const { idCarrera } = req.params;

  try {
    const lista = await materias.findAll({ where: { id_carrera: idCarrera } });
    if (!lista || lista.length === 0)
      return res.status(404).json({ error: "No hay materias para esta carrera" });

    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error buscando materias" });
  }
};

const listarAlumnosPorCarrera = async (req, res) => {
  const { idCarrera } = req.params;

  const limit = parseInt(req.query.limit) || 300;   // por defecto 20
  const offset = parseInt(req.query.offset) || 0;  // por defecto 0

  try {
    const lista = await alumnos.findAll({ where: { id_carrera: idCarrera } });
    if (!lista || lista.length === 0)
      return res.status(404).json({ error: "No hay alumnos para esta carrera" });

    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error buscando alumnos" });
  }
};
const listarCarreras = async (req, res) => {
  try {
    const lista = await carreras.findAll();
    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error buscando carreras" });
  }
};


const getConejosByAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const registros = await alumnos_conejos.findAll({
      where: { alumno_id: id },
      attributes: ["id", "alumno_id", "conejo_id"],
      include: [
        {
          model: conejos,
          as: "conejo",
          attributes: ["id", "placa" ,"raza", "edad"]
        }
      ],
      order: [["id", "ASC"]],
      raw: false
    });

    console.log(`[getConejosByAlumno] alumno=${id} registros=${registros.length}`);
    if (registros.length > 0) {
      console.log("Ejemplo registro[0]:", registros[0].toJSON ? registros[0].toJSON() : registros[0]);
    }

    return res.json(registros);
  } catch (err) {
    console.error("getConejosByAlumno error:", err);
    return res.status(500).json({ error: "Error obteniendo conejos del alumno" });
  }
};


const getNotasExamenesByAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const notas = await notas_examenes.findAll({
      where: { id_alumno: id },
      include: [
        {
          model: materias,
          as: "materia",
          attributes: ["id", "nombre", "anio", "id_carrera"]
        }
      ],
      order: [
        ["id_materia", "ASC"],
        ["tipo", "ASC"]
      ]
    });

    res.json(notas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error obteniendo notas de exámenes" });
  }
};

const getNotasMateriasByAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const notas = await notas_materias.findAll({
      where: { alumno_id: id },
      include: [
        {
          model: materias,
          as: "materia",
          attributes: ["id", "nombre", "anio", "id_carrera"]
        }
      ],
      order: [["materia_id", "ASC"]]
    });

    res.json(notas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error obteniendo notas de materias" });
  }
};

// =========================
// Notas Exámenes
// =========================
const getNotasExamenes0a3 = async (req, res) => {
  try {
    const notas = await notas_examenes.findAll({
      where: { nota: { [Op.between]: [0, 3.99] } },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas de exámenes 0-3" });
  }
};

const getNotasExamenes4a7 = async (req, res) => {
  try {
    const notas = await notas_examenes.findAll({
      where: { nota: { [Op.between]: [4, 7.99] } },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas de exámenes 4-7" });
  }
};

const getNotasExamenes7a10 = async (req, res) => {
  try {
    const notas = await notas_examenes.findAll({
      where: { nota: { [Op.between]: [7, 10] } },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas de exámenes 7-10" });
  }
};

// =========================
// Notas Materias
// =========================
const getNotasMaterias0a3 = async (req, res) => {
  try {
    const notas = await notas_materias.findAll({
      where: {
        [Op.or]: [
          { promedio: { [Op.between]: [0, 3.99] } },
          { promedio_sin_aplazo: { [Op.between]: [0, 3.99] } },
        ],
      },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas materias 0-3" });
  }
};

const getNotasMaterias4a7 = async (req, res) => {
  try {
    const notas = await notas_materias.findAll({
      where: {
        [Op.or]: [
          { promedio: { [Op.between]: [4, 6.99] } },
          { promedio_sin_aplazo: { [Op.between]: [4, 6.99] } },
        ],
      },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas materias 4-7" });
  }
};

const getNotasMaterias7a10 = async (req, res) => {
  try {
    const notas = await notas_materias.findAll({
      where: {
        [Op.or]: [
          { promedio: { [Op.between]: [7, 10] } },
          { promedio_sin_aplazo: { [Op.between]: [7, 10] } },
        ],
      },
      include: [
        { model: alumnos, as: "alumno", attributes: ["id", "nombre", "apellido", "dni"] },
        { model: materias, as: "materia", attributes: ["id", "nombre", "id_carrera"] },
      ],
      order: [[{ model: alumnos, as: "alumno" }, "apellido", "ASC"]],
    });
    res.json(notas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo notas materias 7-10" });
  }
};

// =========================
// NUEVAS FUNCIONES
// =========================

// DASHBOARD - Estadísticas generales
const getDashboardStats = async (req, res) => {
  try {
    const totalAlumnos = await alumnos.count();
    const totalFacultades = await facultades.count();
    const totalCarreras = await carreras.count();
    const totalMaterias = await materias.count();
    const totalProfesores = await profesores.count();
    
    // Promedio de notas de exámenes
    const allNotasEx = await notas_examenes.findAll({ attributes: ["nota"] });
    const promExamenes = allNotasEx.length > 0 
      ? (allNotasEx.reduce((sum, n) => sum + n.nota, 0) / allNotasEx.length).toFixed(2)
      : 0;

    // Top 5 alumnos por promedio
    const top5 = await notas_materias.sequelize.query(`
      SELECT 
        nm.alumno_id,
        a.nombre,
        a.apellido,
        a.dni,
        ROUND(AVG(COALESCE(nm.promedio, 0)), 2) as promedio_general
      FROM notas_materias nm
      JOIN alumnos a ON nm.alumno_id = a.id
      GROUP BY nm.alumno_id, a.id, a.nombre, a.apellido, a.dni
      ORDER BY promedio_general DESC
      LIMIT 5
    `, { type: require("sequelize").QueryTypes.SELECT });

    // Distribución por facultad
    const distFacultad = await alumnos.sequelize.query(`
      SELECT f.nombre, COUNT(a.id) as cantidad
      FROM alumnos a
      LEFT JOIN facultades f ON a.id_facultad = f.id
      GROUP BY a.id_facultad, f.nombre
    `, { type: require("sequelize").QueryTypes.SELECT });

    res.json({
      totalAlumnos,
      totalFacultades,
      totalCarreras,
      totalMaterias,
      totalProfesores,
      promExamenes,
      top5,
      distFacultad
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};

// RANKING - Alumnos ordenados por promedio
const getRanking = async (req, res) => {
  try {
    const { idCarrera, idFacultad, limit = 50 } = req.query;

    let query = `
      SELECT 
        a.id,
        a.nombre,
        a.apellido,
        a.dni,
        a.id_carrera,
        a.id_facultad,
        ROUND(AVG(COALESCE(nm.promedio, 0)), 2) as promedio_general,
        COUNT(DISTINCT nm.materia_id) as materias_cursadas
      FROM alumnos a
      LEFT JOIN notas_materias nm ON a.id = nm.alumno_id
    `;

    let where = "WHERE 1=1";
    if (idCarrera) where += ` AND a.id_carrera = ${parseInt(idCarrera)}`;
    if (idFacultad) where += ` AND a.id_facultad = ${parseInt(idFacultad)}`;

    query += where;
    query += ` GROUP BY a.id, a.nombre, a.apellido, a.dni, a.id_carrera, a.id_facultad
      ORDER BY promedio_general DESC
      LIMIT ${parseInt(limit)}`;

    const ranking = await notas_materias.sequelize.query(query, { 
      type: require("sequelize").QueryTypes.SELECT 
    });

    res.json(ranking);
  } catch (err) {
    console.error("getRanking error:", err);
    res.status(500).json({ error: "Error obteniendo ranking" });
  }
};

// Listar todos los profesores
const listarProfesores = async (req, res) => {
  try {
    const lista = await profesores.findAll({
      order: [["apellido", "ASC"]]
    });
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error listando profesores" });
  }
};

// Obtener profesor por ID
const obtenerProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const prof = await profesores.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Profesor no encontrado" });
    res.json(prof);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo profesor" });
  }
};

// Eliminar alumno
const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await alumnos.findByPk(id);
    if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

    // Eliminar relaciones antes
    await alumnos_conejos.destroy({ where: { alumno_id: id } });
    await notas_examenes.destroy({ where: { id_alumno: id } });
    await notas_materias.destroy({ where: { alumno_id: id } });

    await alumno.destroy();
    res.json({ message: "Alumno eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error eliminando alumno" });
  }
};

// Eliminar profesor
const eliminarProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const prof = await profesores.findByPk(id);
    if (!prof) return res.status(404).json({ error: "Profesor no encontrado" });

    await prof.destroy();
    res.json({ message: "Profesor eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error eliminando profesor" });
  }
};

// Crear nota de examen
const crearNotaExamen = async (req, res) => {
  try {
    const { id_alumno, id_materia, nota, tipo, acompatrimonio } = req.body;
    
    const nuevaNota = await notas_examenes.create({
      id_alumno,
      id_materia,
      nota,
      tipo: tipo || "parcial",
      acompatrimonio: acompatrimonio || false
    });

    res.status(201).json({ message: "Nota de examen creada", data: nuevaNota });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creando nota de examen" });
  }
};

// Editar nota de examen
const editarNotaExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notas_examenes.findByPk(id);
    if (!nota) return res.status(404).json({ error: "Nota no encontrada" });

    await nota.update(req.body);
    res.json({ message: "Nota actualizada", data: nota });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error actualizando nota" });
  }
};

// Eliminar nota de examen
const eliminarNotaExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notas_examenes.findByPk(id);
    if (!nota) return res.status(404).json({ error: "Nota no encontrada" });

    await nota.destroy();
    res.json({ message: "Nota eliminada" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error eliminando nota" });
  }
};

// Crear nota de materia
const crearNotaMateria = async (req, res) => {
  try {
    const nuevaNota = await notas_materias.create(req.body);
    res.status(201).json({ message: "Nota de materia creada", data: nuevaNota });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creando nota de materia" });
  }
};

// Editar nota de materia
const editarNotaMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notas_materias.findByPk(id);
    if (!nota) return res.status(404).json({ error: "Nota no encontrada" });

    await nota.update(req.body);
    res.json({ message: "Nota actualizada", data: nota });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error actualizando nota" });
  }
};

// Alumnos con baja performance (promedio < 5)
const getAlumnosBajaPerformance = async (req, res) => {
  try {
    const bajos = await notas_materias.sequelize.query(`
      SELECT 
        a.id,
        a.nombre,
        a.apellido,
        a.dni,
        c.nombre as carrera,
        f.nombre as facultad,
        ROUND(AVG(COALESCE(nm.promedio, 0)), 2) as promedio_general
      FROM alumnos a
      LEFT JOIN notas_materias nm ON a.id = nm.alumno_id
      LEFT JOIN carreras c ON a.id_carrera = c.id
      LEFT JOIN facultades f ON a.id_facultad = f.id
      GROUP BY a.id, a.nombre, a.apellido, a.dni, c.nombre, f.nombre
      HAVING promedio_general < 5
      ORDER BY promedio_general ASC
    `, { type: require("sequelize").QueryTypes.SELECT });

    res.json(bajos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo alumnos de baja performance" });
  }
};

// Obtener alumno con TODOS sus datos (completo)
const obtenerAlumnoCompleto = async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await alumnos.findByPk(id, {
      include: [
        { model: carreras, as: "carrera", attributes: ["id", "nombre"] },
        { model: facultades, as: "facultad", attributes: ["id", "nombre"] },
        { model: notas_examenes, as: "notas_examenes", include: [{ model: materias, as: "materia" }] },
        { model: notas_materias, as: "notas_materias", include: [{ model: materias, as: "materia" }] },
        { model: alumnos_conejos, as: "alumnos_conejos", include: [{ model: conejos, as: "conejo" }] }
      ]
    });

    if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

    res.json(alumno);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo alumno completo" });
  }
};


module.exports = {
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
};
