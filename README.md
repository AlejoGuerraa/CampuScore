<p align="center">
  <img src="misc/Banner.PNG" width="100%">
</p>
<br>

## Descripción

CampuScore es un proyecto escolar en desarrollo que explora la gestión de estudiantes, materias y calificaciones en un entorno universitario.


###  Características Principales

-  **Dashboard completo** con estadísticas y métricas
-  **Sistema de ranking** de alumnos con filtros avanzados
-  **Gestor de notas** para exámenes y materias
-  **CRUD de profesores** integrado
-  **Gestión de alumnos** con formularios validados
-  **Alertas automáticas** para alumnos en riesgo
-  **Sistema de badges/logros** para motivación
-  **Gamificación con conejos virtuales** según desempeño

### Sistema de recompensas

Cada calificación otorga un "conejo virtual" con características dinámicas:

* **Mejores notas** → conejos más jóvenes
* **Peores notas** → conejos más viejos
* **Badges especiales** → Motivación y reconocimiento

## Tecnologías

### Frontend
- **React 19** - Interfaz de usuario interactiva
- **Vite 7** - Build tool y dev server
- **Axios 1.13** - Cliente HTTP
- **React Router 7** - Enrutamiento
- **Lucide React** - Iconos vectoriales
- **CSS3** - Estilos con gradientes y animaciones

### Backend
- **Node.js 14+** - Runtime de JavaScript
- **Express 5** - Framework web
- **Sequelize 6** - ORM para base de datos
- **MySQL 3** - Base de datos relacional
- **JWT & Bcrypt** - Seguridad (dependencias incluidas)

## Instalación

### Requisitos previos
- Node.js (v14 o superior)
- npm o yarn
- MySQL Server
- Git

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/AlejoGuerraa/CampuScore.git
cd CampuScore
```

2. **Instalar dependencias del backend**
```bash
cd api
npm install
cd ..
```

3. **Instalar dependencias del frontend**
```bash
cd client
npm install
cd ..
```

4. **Configurar la base de datos**

Ejecutar el script SQL principal:
```sql
mysql -u root -p --local-infile=1 < inserts/insertsPesados.sql
```

Luego cargar los datos CSV desde MySQL:
```sql
LOAD DATA LOCAL INFILE 'ruta/a/conejos.csv'
INTO TABLE conejos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(placa, raza, edad);

-- Repetir para alumnos.csv, notas_examenes.csv, alumno_materia.csv, alumnos_conejos.csv
```

## Configuración

Crear archivo `.env` en la carpeta `/api`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=facultades
DB_PORT=3306

# Servidor
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

## Uso / Ejecutar la aplicación

### Modo desarrollo

**Terminal 1 - Backend:**
```bash
cd api
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (Vite dev server)

### Modo producción

```bash
# Build del frontend
cd client
npm run build

# Ejecutar el backend en producción
cd api
npm start
```

## Características

### Gestión de Estudiantes
- Registro y búsqueda de estudiantes
- Información personal (DNI, teléfono, dirección, edad, nacionalidad)
- Asignación a facultades y carreras
- Visualización de historial académico

### Sistema de Calificaciones
- Registro de notas de parciales (Parcial 1, Parcial 2)
- Registro de notas de exámenes finales
- Validación automática de aprobación por materia:
  - Promedio ≥ 7: Aprobado directo
  - Promedio 4-6: Acceso a examen final
  - Promedio < 4: Reprobado (puede recursar)

### Sistema de Recompensas (Conejos)
- Cada calificación genera automáticamente una recompensa
- Edad del conejo: 11 - calificación (mejor nota = conejo más joven)
- Historial completo de conejos otorgados por estudiante

### Validaciones Académicas
- Prerequisitos: No se pueden cursar materias de años superiores sin haber aprobado las del año anterior
- Materias por carrera: Solo se permiten materias asociadas a la carrera del estudiante
- Recurse automático: Permite reintentar materias reprobadas

## Estado del Proyecto

**Estado:** En desarrollo 🚀

El proyecto se encuentra en fase activa de desarrollo con funcionalidades principales implementadas. Se continúa trabajando en optimizaciones, validaciones adicionales y mejoras de interfaz.

## Autor

Alejo Guerra.

---

**Nota:** Este proyecto maneja grandes volúmenes de datos (más de 3,496 estudiantes y 100,000+ registros de calificaciones). Asegúrate de tener suficiente capacidad de almacenamiento y memoria disponibles.
