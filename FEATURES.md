# 🎓 CampuScore - Nuevas Funcionalidades

**Documento de descripción de todas las características implementadas**

---

## 📋 Índice
1. [Agregar Alumnos](#agregar-alumnos)
2. [Dashboard](#dashboard)
3. [Ranking](#ranking)
4. [Gestor de Notas](#gestor-de-notas)
5. [Gestor de Profesores](#gestor-de-profesores)
6. [Alertas de Performance](#alertas-de-performance)
7. [Sistema de Badges](#sistema-de-badges)
8. [Endpoints API](#endpoints-api)

---

## 🎯 Agregar Alumnos

**Ruta:** `/crear-alumno`  
**Componente:** `formAlumno.jsx`

### Características
- ✅ Formulario validado para crear nuevos alumnos
- ✅ Campos: Nombre, Apellido, DNI, Edad, Nacionalidad, Teléfono, Dirección
- ✅ Selección de Facultad y Carrera desde dropdowns
- ✅ Integración con BD mediante endpoint `/alumnos/ingresar`
- ✅ Mensajes de éxito/error visuales
- ✅ Redirección automática al inicio tras crear

### Campos del Formulario
```
- Nombre (requerido)
- Apellido (requerido)
- DNI (requerido)
- Edad
- Nacionalidad
- Teléfono
- Dirección
- Facultad (requerido)
- Carrera (requerido)
```

### Ejemplo de Uso
1. Click en "Alumno" en el header
2. Llenar datos del alumno
3. Click "Crear Alumno"
4. Automáticamente redirige a la página principal

---

## 📊 Dashboard

**Ruta:** `/dashboard`  
**Componente:** `dashboard.jsx`

### Características
- ✅ 6 tarjetas con métricas principales
- ✅ Tabla Top 5 mejores alumnos con medallas (🥇🥈🥉)
- ✅ Gráfico de distribución por facultad
- ✅ Promedio general de exámenes
- ✅ Botón para actualizar datos en tiempo real
- ✅ Diseño responsivo con gradientes

### Métricas Mostradas
```
👥 Total Alumnos       📚 Total Materias
🏫 Total Facultades    📈 Promedio Exámenes
📖 Total Carreras      👨‍🏫 Total Profesores
```

### Datos del Top 5
- Posición con medalla
- Nombre y Apellido
- DNI
- Promedio General

---

## 🏆 Ranking

**Ruta:** `/ranking`  
**Componente:** `ranking.jsx`

### Características
- ✅ Tabla de alumnos ordenados por promedio
- ✅ Filtros avanzados (carrera, facultad)
- ✅ Opciones de mostrar: Top 10, 25, 50, 100
- ✅ Medallas para los 3 primeros lugares
- ✅ Botón para limpiar filtros
- ✅ Muestra materias cursadas por alumno

### Filtros Disponibles
```
- Carrera (todas o específica)
- Facultad (todas o específica)
- Limit (10, 25, 50, 100 alumnos)
```

### Columnas de la Tabla
```
Posición | Nombre | DNI | Promedio | Materias Cursadas
```

---

## 📝 Gestor de Notas

**Ruta:** `/notas`  
**Componente:** `gestorNotas.jsx`

### Características
- ✅ Tabs para Exámenes y Materias
- ✅ Crear notas de examen (parcial, final, recuperatorio)
- ✅ Validación de notas 0-10
- ✅ Selección de alumno y materia
- ✅ Integración con endpoints `/notas-examenes` y `/notas-materias`
- ✅ Mensajes de confirmación

### Tipos de Examen
```
- Parcial
- Final
- Recuperatorio
```

### Datos Requeridos
```
- Alumno (seleccionar)
- Materia (seleccionar)
- Nota (0-10 con paso de 0.5)
- Tipo (solo exámenes)
```

---

## 👨‍🏫 Gestor de Profesores

**Ruta:** `/profesores`  
**Componente:** `gestorProfesores.jsx`

### Características
- ✅ CRUD completo de profesores
- ✅ Crear nuevos profesores
- ✅ Editar información existente
- ✅ Eliminar profesores
- ✅ Interfaz en tarjetas
- ✅ Mostrar especialidad (opcional)

### Operaciones
```
CREATE: /profesores/ingresar
READ:   /profesores
UPDATE: /profesores/editar/:id
DELETE: /profesores/:id
```

### Campos
```
- Nombre (requerido)
- Apellido (requerido)
- Especialidad (opcional)
```

---

## ⚠️ Alertas de Performance

**Ruta:** `/alertas`  
**Componente:** `alertasPerformance.jsx`

### Características
- ✅ Identifica alumnos con bajo rendimiento (promedio < 5)
- ✅ 3 niveles de severidad
- ✅ Muestra carrera y facultad del alumno
- ✅ Contadores por nivel de riesgo
- ✅ Tarjetas coloridas por severidad

### Niveles de Riesgo
```
🚨 CRÍTICO:  Promedio < 2.0
⚠️  GRAVE:   Promedio < 3.5
⏰ EN RIESGO: Promedio 3.5 - 5.0
```

### Información Mostrada
```
- Nombre y DNI
- Carrera
- Facultad
- Promedio General
- Posición en la lista
```

---

## 🎖️ Sistema de Badges

**Ruta:** `/badges`  
**Componente:** `badges.jsx`

### Características
- ✅ Galería de badges disponibles
- ✅ Asignación automática a alumnos
- ✅ Visualización de badges por alumno
- ✅ Estadísticas de logros
- ✅ 6 tipos de badges diferentes

### Badges Disponibles
```
⭐ Estudiante Estrella    - Promedio > 8.0
🏅 Campeón Académico     - Promedio > 9.0
💪 Dedicado              - Cursando 5+ materias
🔄 Recuperador           - Mejoró 2+ puntos
🎯 Persistente           - Promedio entre 4 y 6
👶 Aprendiz              - Nuevo alumno
```

### Secciones
1. **Galería de Badges** - Descripción de cada badge
2. **Alumnos Destacados** - Alumnos con sus badges
3. **Estadísticas** - Cantidad y porcentaje de alumnos destacados

---

## 🔌 Endpoints API

### Dashboard
```
GET /dashboard/stats
Retorna: {
  totalAlumnos,
  totalFacultades,
  totalCarreras,
  totalMaterias,
  totalProfesores,
  promExamenes,
  top5,
  distFacultad
}
```

### Ranking
```
GET /ranking?idCarrera=X&idFacultad=Y&limit=50
Retorna: Array de alumnos con: {
  id, nombre, apellido, dni,
  promedio_general, materias_cursadas
}
```

### Alumnos
```
GET /alumnos/:id
Retorna: Alumno completo con todas las relaciones

POST /alumnos/ingresar
Body: { nombre, apellido, dni, edad, nacionalidad, telefono, direccion, id_carrera, id_facultad }

PUT /alumnos/editar/:id
Body: Datos a actualizar

DELETE /alumnos/:id
```

### Profesores
```
GET /profesores
GET /profesores/:id

POST /profesores/ingresar
Body: { nombre, apellido, especialidad }

PUT /profesores/editar/:id
Body: Datos a actualizar

DELETE /profesores/:id
```

### Notas Exámenes
```
POST /notas-examenes
Body: { id_alumno, id_materia, nota, tipo, acompatrimonio }

PUT /notas-examenes/:id
DELETE /notas-examenes/:id
```

### Notas Materias
```
POST /notas-materias
Body: Datos de la nota

PUT /notas-materias/:id
```

### Analytics
```
GET /alumnos-baja-performance
Retorna: Array de alumnos con promedio < 5
```

---

## 🎨 Diseño y UX

- **Colores:** Gradientes azul-púrpura (#667eea - #764ba2)
- **Responsive:** Mobile, tablet, desktop
- **Iconos:** Lucide React + Emojis
- **Animaciones:** Transiciones suaves, hover effects
- **Accesibilidad:** Botones, labels, semantic HTML

---

## 📦 Dependencias Utilizadas

### Frontend
- React 19
- React Router DOM 7
- Axios 1.13
- Lucide React (iconos)
- CSS custom puro

### Backend
- Express 5
- Sequelize 6
- MySQL2 3
- Node.js 14+

---

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Exportación a CSV
- [ ] Autenticación y permisos por rol
- [ ] Mejoras en gamificación de conejos
- [ ] Gráficos con Chart.js o Recharts
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda de alumnos mejorada
- [ ] Reporte de notas en PDF

---

## 📝 Notas Importantes

1. El backend debe estar corriendo en `localhost:3000`
2. El frontend corre en `localhost:5173` (desarrollo)
3. Base de datos MySQL debe estar configurada en `api/.env`
4. Todos los endpoints tienen CORS habilitado
5. Las validaciones se hacen en frontend y backend

---

**Última actualización:** Mayo 2026  
**Estado:** ✅ Completo y Funcional
