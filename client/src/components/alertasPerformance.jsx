import React, { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import "../pagescss/AlertasPerformance.css";


export default function AlertasPerformance() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlumnosBajaPerformance();
  }, []);

  const fetchAlumnosBajaPerformance = async () => {
    try {
      setLoading(true);
      const res = await apiGet('/alumnos-baja-performance');
      setAlumnos(res || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching alumnos:", err);
      setError("Error cargando alumnos en riesgo");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (promedio) => {
    if (promedio < 2) return "critical";
    if (promedio < 3.5) return "warning";
    return "at-risk";
  };

  const getStatusEmoji = (promedio) => {
    if (promedio < 2) return "🚨";
    if (promedio < 3.5) return "⚠️";
    return "⏰";
  };

  return (
    <div className="alertas-container">
      <h1>⚠️ Alumnos en Riesgo Académico</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando alumnos en riesgo...</div>
      ) : alumnos.length > 0 ? (
        <>
          <div className="summary">
            <p>
              <strong>Total en riesgo:</strong> {alumnos.length} alumnos
            </p>
            <p className="critical">
              🚨 Crítico (&lt; 2.0): {alumnos.filter((a) => a.promedio_general < 2).length}
            </p>
            <p className="warning">
              ⚠️ Grave (&lt; 3.5): {alumnos.filter((a) => a.promedio_general < 3.5).length}
            </p>
          </div>

          <div className="alumnos-riesgo">
            {alumnos.map((alumno, idx) => (
              <div key={alumno.id} className={`riesgo-card ${getStatusClass(alumno.promedio_general)}`}>
                <div className="riesgo-header">
                  <span className="emoji">{getStatusEmoji(alumno.promedio_general)}</span>
                  <span className="numero">{idx + 1}</span>
                </div>

                <div className="riesgo-content">
                  <h3>
                    {alumno.nombre} {alumno.apellido}
                  </h3>
                  <p className="dni">DNI: {alumno.dni}</p>
                  {alumno.carrera && <p className="carrera">📚 {alumno.carrera}</p>}
                  {alumno.facultad && <p className="facultad">🏫 {alumno.facultad}</p>}
                </div>

                <div className="riesgo-footer">
                  <div className="promedio">
                    <span className="label">Promedio: </span>
                    <span className="valor">{alumno.promedio_general}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-data">✅ Excelente! No hay alumnos en riesgo académico</div>
      )}

      <button onClick={fetchAlumnosBajaPerformance} className="btn-refresh">
        🔄 Actualizar
      </button>
    </div>
  );
}
