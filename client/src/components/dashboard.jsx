import React, { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import "../pagescss/Dashboard.css";


export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiGet('/dashboard/stats');
      setStats(res);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Error cargando estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
        <button onClick={fetchStats} className="btn-retry">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard CampuScore</h1>

      {/* Tarjetas de resumen */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalAlumnos || 0}</div>
            <div className="stat-label">Total Alumnos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalFacultades || 0}</div>
            <div className="stat-label">Facultades</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalCarreras || 0}</div>
            <div className="stat-label">Carreras</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalMaterias || 0}</div>
            <div className="stat-label">Materias</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalProfesores || 0}</div>
            <div className="stat-label">Profesores</div>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.promExamenes || "0.00"}</div>
            <div className="stat-label">Promedio Exámenes</div>
          </div>
        </div>
      </div>

      {/* Top 5 Alumnos */}
      <div className="dashboard-section">
        <h2>🏆 Top 5 Mejores Alumnos</h2>
        {stats?.top5 && stats.top5.length > 0 ? (
          <div className="top-alumnos-table">
            <table>
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {stats.top5.map((alumno, idx) => (
                  <tr key={idx} className={`rank-${idx + 1}`}>
                    <td className="medal">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                    </td>
                    <td>
                      {alumno.nombre} {alumno.apellido}
                    </td>
                    <td>{alumno.dni}</td>
                    <td className="nota-highlight">{alumno.promedio_general}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No hay datos de alumnos</p>
        )}
      </div>

      {/* Distribución por facultad */}
      <div className="dashboard-section">
        <h2>🏫 Distribución por Facultad</h2>
        {stats?.distFacultad && stats.distFacultad.length > 0 ? (
          <div className="facultad-dist">
            {stats.distFacultad.map((f, idx) => (
              <div key={idx} className="facultad-item">
                <div className="facultad-name">{f.nombre || "Sin facultad"}</div>
                <div className="facultad-bar">
                  <div
                    className="facultad-fill"
                    style={{
                      width: `${((f.cantidad / stats.totalAlumnos) * 100) || 0}%`,
                    }}
                  >
                    {f.cantidad}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No hay datos de distribución</p>
        )}
      </div>

      {/* Botón para actualizar */}
      <div className="dashboard-actions">
        <button onClick={fetchStats} className="btn-refresh">
          🔄 Actualizar Datos
        </button>
      </div>
    </div>
  );
}
