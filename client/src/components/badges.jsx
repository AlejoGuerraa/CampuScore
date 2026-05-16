import React, { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import "../pagescss/Badges.css";


// Definir badges disponibles
const BADGES_CONFIG = {
  "Estudiante Estrella": {
    emoji: "⭐",
    description: "Promedio mayor a 8.0",
    color: "#ffd700",
    condition: (promedio) => promedio > 8,
  },
  "Campeón Académico": {
    emoji: "🏅",
    description: "Promedio mayor a 9.0",
    color: "#ff6b6b",
    condition: (promedio) => promedio > 9,
  },
  "Dedicado": {
    emoji: "💪",
    description: "Cursando 5+ materias",
    color: "#667eea",
    condition: (materias) => materias > 5,
  },
  "Recuperador": {
    emoji: "🔄",
    description: "Mejoró 2+ puntos en promedio",
    color: "#51cf66",
    condition: () => true, // Simplificado
  },
  "Persistente": {
    emoji: "🎯",
    description: "Promedio entre 4 y 6",
    color: "#94d82d",
    condition: (promedio) => promedio >= 4 && promedio <= 6,
  },
  "Aprendiz": {
    emoji: "👶",
    description: "Nuevo alumno",
    color: "#ffa94d",
    condition: () => true,
  },
};

export default function Badges() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [alumnosBadges, setAlumnosBadges] = useState({});

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const res = await apiGet('/alumnos/buscar?limit=1000');
      const list = res?.results || res || [];
      setAlumnos(list);

      // Calcular badges para cada alumno
      const badges = {};
      for (const alumno of list) {
        badges[alumno.id] = generateBadges(alumno);
      }
      setAlumnosBadges(badges);
    } catch (err) {
      console.error("Error fetching alumnos:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateBadges = (alumno) => {
    const badges = [];

    // Por ahora, asignar badges basados en lógica simple
    // En una app real, se calcularía desde los datos del alumno
    const promedio = Math.random() * 10; // Simulado

    if (promedio > 9) badges.push("Campeón Académico");
    if (promedio > 8) badges.push("Estudiante Estrella");
    if (promedio >= 4 && promedio <= 6) badges.push("Persistente");

    // Agregar al menos un badge
    if (badges.length === 0) badges.push("Aprendiz");

    return badges;
  };

  return (
    <div className="badges-container">
      <h1>🎖️ Sistema de Logros y Badges</h1>

      {/* Galería de Badges Disponibles */}
      <section className="badges-info">
        <h2>Badges Disponibles</h2>
        <div className="badges-gallery">
          {Object.entries(BADGES_CONFIG).map(([name, config]) => (
            <div key={name} className="badge-info-card">
              <div className="badge-emoji" style={{ background: config.color }}>
                {config.emoji}
              </div>
              <h3>{name}</h3>
              <p>{config.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alumnos con Badges */}
      <section className="alumnos-badges">
        <h2>Alumnos Destacados</h2>

        {loading ? (
          <div className="loading">Cargando alumnos...</div>
        ) : alumnos.length > 0 ? (
          <div className="alumnos-grid">
            {alumnos.slice(0, 20).map((alumno) => (
              <div key={alumno.id} className="alumno-badge-card">
                <div className="alumno-header">
                  <h3>
                    {alumno.nombre} {alumno.apellido}
                  </h3>
                  <p className="dni">{alumno.dni}</p>
                </div>

                <div className="badges-list">
                  {(alumnosBadges[alumno.id] || []).map((badge, idx) => {
                    const config = BADGES_CONFIG[badge];
                    return (
                      <div
                        key={idx}
                        className="badge"
                        title={config?.description}
                        style={{ background: config?.color }}
                      >
                        {config?.emoji} {badge}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No hay alumnos registrados</p>
        )}
      </section>

      {/* Estadísticas */}
      <section className="badges-stats">
        <h2>Estadísticas</h2>
        <div className="stats">
          <div className="stat">
            <p>Total de Alumnos</p>
            <h3>{alumnos.length}</h3>
          </div>
          <div className="stat">
            <p>Badges Disponibles</p>
            <h3>{Object.keys(BADGES_CONFIG).length}</h3>
          </div>
          <div className="stat">
            <p>Alumnos Destacados</p>
            <h3>
              {Math.floor(
                (alumnos.filter((a) => (alumnosBadges[a.id] || []).length > 0)
                  .length /
                  alumnos.length) *
                  100
              )}
              %
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}
