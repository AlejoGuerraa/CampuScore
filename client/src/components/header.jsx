// Header.jsx
import { useNavigate } from "react-router-dom";
import "../pagescss/header.css";
import { Ghost, Brain, Smile, BarChart3, Trophy, Plus, FileText, Users, AlertCircle, Award } from "lucide-react";

// IMPORTAR LOGO
import logo from "/Logo.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <div className="header-left" onClick={() => navigate("/")}>
        {/* LOGO CIRCULAR */}
        <img src={logo} alt="Logo" className="header-logo" />
        <span className="app-title">Campuscore</span>
      </div>

      <nav className="header-nav">
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>
          <BarChart3 size={20} /> Dashboard
        </button>
        <button className="nav-btn" onClick={() => navigate("/ranking")}>
          <Trophy size={20} /> Ranking
        </button>
        <button className="nav-btn" onClick={() => navigate("/crear-alumno")}>
          <Plus size={20} /> Alumno
        </button>
        <button className="nav-btn" onClick={() => navigate("/notas")}>
          <FileText size={20} /> Notas
        </button>
        <button className="nav-btn" onClick={() => navigate("/profesores")}>
          <Users size={20} /> Profes
        </button>
        <button className="nav-btn" onClick={() => navigate("/alertas")}>
          <AlertCircle size={20} /> Alertas
        </button>
        <button className="nav-btn" onClick={() => navigate("/badges")}>
          <Award size={20} /> Badges
        </button>
      </nav>

      <div className="header-right">
        {/* Íconos con navegación */}
        
        <Smile
          className="icon"
          onClick={() => navigate("/easy")}
          title="Easy mode"
        />
        <Ghost
          className="icon"
          onClick={() => navigate("/ghost")}
          title="Ghost Hunter"
        />
        <Brain
          className="icon"
          onClick={() => navigate("/brain")}
          title="Brain Hunter"
        />
        
      </div>
    </header>
  );
}
