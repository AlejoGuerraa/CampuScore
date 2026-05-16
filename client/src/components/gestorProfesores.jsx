import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import "../pagescss/GestorProfesores.css";

export default function GestorProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
  });

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    try {
      setLoading(true);
      const res = await apiGet('/profesores');
      setProfesores(res || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching profesores:", err);
      setError("Error cargando profesores");
    } finally {
      setLoading(false);
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
      if (editingId) {
        await apiPut(`/profesores/editar/${editingId}`, formData);
      } else {
        await apiPost(`/profesores/ingresar`, formData);
      }

      setFormData({ nombre: "", apellido: "", especialidad: "" });
      setShowForm(false);
      setEditingId(null);
      fetchProfesores();
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error al guardar profesor");
    }
  };

  const handleEdit = (profesor) => {
    setFormData({
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      especialidad: profesor.especialidad || "",
    });
    setEditingId(profesor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
      try {
        await apiDelete(`/profesores/${id}`);
        fetchProfesores();
      } catch (err) {
        setError("Error eliminando profesor");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre: "", apellido: "", especialidad: "" });
  };

  return (
    <div className="gestor-profesores-container">
      <h1>👨‍🏫 Gestor de Profesores</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <button
        className="btn-agregar"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancelar" : "+ Agregar Profesor"}
      </button>

      {/* Formulario */}
      {showForm && (
        <div className="form-profesor">
          <h2>{editingId ? "Editar" : "Crear"} Profesor</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="text"
              name="especialidad"
              placeholder="Especialidad"
              value={formData.especialidad}
              onChange={handleChange}
            />

            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de profesores */}
      {loading ? (
        <div className="loading">Cargando profesores...</div>
      ) : profesores.length > 0 ? (
        <div className="profesores-list">
          {profesores.map((profesor) => (
            <div key={profesor.id} className="profesor-card">
              <div className="profesor-info">
                <h3>
                  {profesor.nombre} {profesor.apellido}
                </h3>
                {profesor.especialidad && (
                  <p className="especialidad">{profesor.especialidad}</p>
                )}
              </div>
              <div className="profesor-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(profesor)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(profesor.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">No hay profesores registrados</div>
      )}
    </div>
  );
}
