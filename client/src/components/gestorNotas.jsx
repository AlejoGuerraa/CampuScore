import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/api";
import "../pagescss/GestorNotas.css";

export default function GestorNotas() {
  const [activeTab, setActiveTab] = useState("examenes");
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_alumno: "",
    id_materia: "",
    nota: "",
    tipo: "parcial",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alumnosRes, materiasRes] = await Promise.all([
        apiGet('/alumnos/buscar?limit=1000'),
        apiGet('/carreras/1/materias').catch(() => []),
      ]);

      const alumnosList = alumnosRes?.results || alumnosRes || [];
      setAlumnos(alumnosList);
      setMaterias(materiasRes || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error cargando datos");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = activeTab === "examenes" 
        ? "/notas-examenes" 
        : "/notas-materias";

      await apiPost(`${endpoint}`, formData);

      setFormData({
        id_alumno: "",
        id_materia: "",
        nota: "",
        tipo: "parcial",
      });
      setShowForm(false);
      setError(null);
      
      // Mostrar notificación
      alert("Nota creada correctamente");
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error al crear nota");
    }
  };

  return (
    <div className="gestor-notas-container">
      <h1>📝 Gestor de Notas</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "examenes" ? "active" : ""}`}
          onClick={() => setActiveTab("examenes")}
        >
          Exámenes
        </button>
        <button
          className={`tab ${activeTab === "materias" ? "active" : ""}`}
          onClick={() => setActiveTab("materias")}
        >
          Materias
        </button>
      </div>

      <button
        className="btn-agregar-nota"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancelar" : "+ Agregar Nota"}
      </button>

      {/* Formulario */}
      {showForm && (
        <div className="form-nota">
          <h2>
            Crear nota de {activeTab === "examenes" ? "examen" : "materia"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Alumno *</label>
              <select
                name="id_alumno"
                value={formData.id_alumno}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar alumno</option>
                {alumnos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} {a.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Materia *</label>
              <select
                name="id_materia"
                value={formData.id_materia}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar materia</option>
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nota (0-10) *</label>
                <input
                  type="number"
                  name="nota"
                  value={formData.nota}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.5"
                  required
                />
              </div>

              {activeTab === "examenes" && (
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="parcial">Parcial</option>
                    <option value="final">Final</option>
                    <option value="recuperatorio">Recuperatorio</option>
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit">
              Guardar Nota
            </button>
          </form>
        </div>
      )}

      <div className="info-box">
        <p>
          <strong>Total de alumnos:</strong> {alumnos.length}
        </p>
        <p>
          <strong>Total de materias:</strong> {materias.length}
        </p>
      </div>
    </div>
  );
}
