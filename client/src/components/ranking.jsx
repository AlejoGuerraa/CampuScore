import React, { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import "../pagescss/Ranking.css";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    idCarrera: "",
    idFacultad: "",
    limit: 50,
  });
  const [carreras, setCarreras] = useState([]);
  const [facultades, setFacultades] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (carreras.length > 0 || facultades.length > 0) {
      fetchRanking();
    }
  }, [filtros]);

  const fetchData = async () => {
    try {
      const [carrerasRes, facultadesRes] = await Promise.all([
        apiGet('/carreras'),
        apiGet('/facultades'),
      ]);

      setCarreras(carrerasRes || []);
      setFacultades(facultadesRes || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filtros.idCarrera) params.append("idCarrera", filtros.idCarrera);
      if (filtros.idFacultad) params.append("idFacultad", filtros.idFacultad);
      params.append("limit", filtros.limit);

      const res = await apiGet(`/ranking?${params.toString()}`);
      setRanking(res || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching ranking:", err);
      setError("Error cargando ranking");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFiltros({
      idCarrera: "",
      idFacultad: "",
      limit: 50,
    });
  };

  return (
    <div className="ranking-container">
      <h1 className="ranking-title">🏆 Ranking de Alumnos</h1>

      {/* Filtros */}
      <div className="ranking-filtros">
        <div className="filtro-group">
          <label>Carrera:</label>
          <select
            name="idCarrera"
            value={filtros.idCarrera}
            onChange={handleFilterChange}
          >
            <option value="">- Todas las carreras -</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Facultad:</label>
          <select
            name="idFacultad"
            value={filtros.idFacultad}
            onChange={handleFilterChange}
          >
            <option value="">- Todas las facultades -</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Mostrar:</label>
          <select
            name="limit"
            value={filtros.limit}
            onChange={handleFilterChange}
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>

        <button onClick={handleReset} className="btn-reset">
          Limpiar Filtros
        </button>
      </div>

      {/* Contenido */}
      {loading && <div className="loading">Cargando ranking...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && ranking.length > 0 && (
        <div className="ranking-table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th className="pos-col">Pos.</th>
                <th className="nom-col">Nombre</th>
                <th className="dni-col">DNI</th>
                <th className="prom-col">Promedio</th>
                <th className="mat-col">Materias</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((alumno, idx) => (
                <tr key={alumno.id} className={`rank-row rank-${idx + 1}`}>
                  <td className="medal-cell">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                  </td>
                  <td>
                    <strong>{alumno.nombre}</strong> {alumno.apellido}
                  </td>
                  <td>{alumno.dni}</td>
                  <td className="promedio-cell">{alumno.promedio_general}</td>
                  <td className="materias-cell">{alumno.materias_cursadas || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && ranking.length === 0 && (
        <div className="no-data">No hay datos de ranking disponibles</div>
      )}
    </div>
  );
}
