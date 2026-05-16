import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../lib/api";
import "../pagescss/FormAlumno.css";

export default function FormAlumno({ alumnoId = null, onSuccess = null }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    nacionalidad: "",
    telefono: "",
    direccion: "",
    id_carrera: "",
    id_facultad: "",
  });

  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      try {
          const [carrerasRes, facultadesRes] = await Promise.all([
            apiGet('/carreras'),
            apiGet('/facultades'),
          ]);

          setCarreras(carrerasRes || []);
          setFacultades(facultadesRes || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error cargando facultades y carreras");
      }
    }

    loadData();

    // Si es edición, cargar datos del alumno
    if (alumnoId) {
      loadAlumno();
    }
  }, [alumnoId]);

  const loadAlumno = async () => {
    try {
      const alumno = await apiGet(`/alumnos/${alumnoId}`);
      setFormData({
        nombre: alumno.nombre || "",
        apellido: alumno.apellido || "",
        dni: alumno.dni || "",
        edad: alumno.edad || "",
        nacionalidad: alumno.nacionalidad || "",
        telefono: alumno.telefono || "",
        direccion: alumno.direccion || "",
        id_carrera: alumno.id_carrera || "",
        id_facultad: alumno.id_facultad || "",
      });
    } catch (err) {
      console.error("Error cargando alumno:", err);
      setError("Error cargando datos del alumno");
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (alumnoId) {
        // Editar
        await apiPut(`/alumnos/editar/${alumnoId}`, formData);
        setSuccess(true);
      } else {
        // Crear
        await apiPost(`/alumnos/ingresar`, formData);
        setSuccess(true);
        setFormData({
          nombre: "",
          apellido: "",
          dni: "",
          edad: "",
          nacionalidad: "",
          telefono: "",
          direccion: "",
          id_carrera: "",
          id_facultad: "",
        });
      }

      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error al guardar alumno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-alumno-container">
      <h2>{alumnoId ? "Editar Alumno" : "Agregar Nuevo Alumno"}</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          Alumno {alumnoId ? "actualizado" : "creado"} correctamente ✓
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-alumno">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido *</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>DNI *</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nacionalidad</label>
            <input
              type="text"
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={handleChange}
              placeholder="Argentina, Brasil, etc..."
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Facultad *</label>
            <select
              name="id_facultad"
              value={formData.id_facultad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar facultad</option>
              {facultades.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Carrera *</label>
            <select
              name="id_carrera"
              value={formData.id_carrera}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar carrera</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Guardando..." : alumnoId ? "Actualizar" : "Crear Alumno"}
        </button>
      </form>
    </div>
  );
}
