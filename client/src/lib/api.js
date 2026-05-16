// client/src/lib/api.js
async function loadMock() {
  if (window.__SAMPLE_DATA__) return window.__SAMPLE_DATA__;
  try {
    const res = await fetch('/sample-data.json');
    const data = await res.json();
    window.__SAMPLE_DATA__ = data;
    return data;
  } catch (e) {
    console.warn('No sample-data.json found or failed to load', e);
    return {};
  }
}

function parseRange(path) {
  const m = path.match(/notas-(?:examenes|materias)\/(\d+)-(\d+)/);
  if (!m) return null;
  return {min: Number(m[1]), max: Number(m[2])};
}

// If VITE_API_BASE is provided, use it; otherwise keep null so we can default to mocks
export let apiBase = import.meta.env.VITE_API_BASE || null;
// Enable mock when explicitly requested, or whenever no VITE_API_BASE is provided (dev or prod)
export let useMock = (import.meta.env.VITE_USE_MOCK === 'true') || (!import.meta.env.VITE_API_BASE);

async function tryDetectBackend() {
  if (apiBase || import.meta.env.VITE_API_BASE) return;
  if (window.__API_DETECTION_DONE) return;
  window.__API_DETECTION_DONE = true;
  const candidate = 'http://localhost:3000';
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 600);
    const res = await fetch(candidate + '/carreras', { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      apiBase = candidate;
      useMock = false;
      console.info('Detected local backend at', candidate);
    }
  } catch (e) {
    // ignore
  }
}

export async function apiGet(path) {
  await tryDetectBackend();

  if (useMock) {
    const data = await loadMock();
    // normalize path and query
    let url;
    try {
      url = new URL(path, 'http://local');
    } catch (e) {
      url = { pathname: path, searchParams: new URLSearchParams() };
    }
    const pathname = url.pathname;
    const params = url.searchParams;

    // simple routing for demo endpoints
    if (path === '/carreras') return data.carreras || [];
    if (path === '/facultades') return data.facultades || [];
    if (path.startsWith('/carreras/') && path.endsWith('/materias')) {
      const id = Number(path.split('/')[2]);
      return (data.materias || []).filter(m => m.carrera_id === id);
    }
    if (path.startsWith('/carreras/') && path.includes('/alumnos')) {
      const id = Number(path.split('/')[2]);
      return (data.alumnos || []).filter(a => a.carrera_id === id);
    }
    if (pathname.startsWith('/alumno/')) {
      const parts = pathname.split('/').filter(Boolean);
      const id = Number(parts[1]);
      if (parts.length === 2) {
        return (data.alumnos || []).find(a => a.id === id) || null;
      }
      if (parts[2] === 'conejos') return (data.conejos || []).filter(c => c.alumno_id === id);
      if (parts[2] === 'notas-examenes') return (data.notas_examenes || []).filter(n => n.alumno_id === id);
      if (parts[2] === 'notas-materias') return (data.notas_materias || []).filter(n => n.alumno_id === id);
    }
    if (pathname.startsWith('/alumnos')) {
      // support /alumnos/buscar with limit/offset/query
      const limit = parseInt(params.get('limit') || params.get('size') || '100', 10) || 100;
      const offset = parseInt(params.get('offset') || '0', 10) || 0;
      const q = (params.get('q') || params.get('query') || '').toLowerCase();
      let list = (data.alumnos || []).slice();
      if (q) {
        list = list.filter(a => (`${a.apellido || ''} ${a.nombre || ''} ${a.dni || ''}`).toLowerCase().includes(q));
      }
      const total = list.length;
      const results = list.slice(offset, offset + limit);
      return { results, total };
    }
    if (pathname.startsWith('/notas-examenes') || pathname.startsWith('/notas-materias')) {
      const range = parseRange(pathname);
      const key = pathname.startsWith('/notas-examenes') ? 'notas_examenes' : 'notas_materias';
      let list = data[key] || [];
      if (range) {
        list = list.filter(n => Number(n.nota) >= range.min && Number(n.nota) < range.max);
      }
      // support limit param
      const limit = parseInt(params.get('limit') || '100', 10) || 100;
      return list.slice(0, limit);
    }

    if (pathname === '/dashboard/stats') {
      if (data.dashboard) return data.dashboard;
      const totalAlumnos = (data.alumnos || []).length;
      const totalFacultades = (data.facultades || []).length;
      const totalCarreras = (data.carreras || []).length;
      const totalMaterias = (data.materias || []).length;
      const promedioGeneral = (() => {
        const notas = (data.notas_examenes || []).map(n => Number(n.nota)).filter(Boolean);
        if (notas.length === 0) return 0;
        return (notas.reduce((s, v) => s + v, 0) / notas.length).toFixed(2);
      })();
      return { totalAlumnos, totalFacultades, totalCarreras, totalMaterias, promExamenes: promedioGeneral };
    }

    if (pathname === '/ranking') {
      // compute ranking from notas_materias.promedio or notas_examenes
      const limit = parseInt(params.get('limit') || '50', 10) || 50;
      const alumnos = (data.alumnos || []).slice();
      const notasMat = data.notas_materias || [];
      const notasEx = data.notas_examenes || [];

      const byAlumno = alumnos.map(a => {
        let promedio = a.promedio_general;
        if (!promedio) {
          const mat = notasMat.filter(n => Number(n.alumno_id) === Number(a.id));
          if (mat.length) promedio = mat.reduce((s, x) => s + (Number(x.promedio) || 0), 0) / mat.length;
          else {
            const ex = notasEx.filter(n => Number(n.alumno_id) === Number(a.id));
            if (ex.length) promedio = ex.reduce((s, x) => s + (Number(x.nota) || 0), 0) / ex.length;
          }
        }
        return { ...a, promedio_general: Number(promedio || 0) };
      });

      byAlumno.sort((A, B) => (B.promedio_general || 0) - (A.promedio_general || 0));
      return byAlumno.slice(0, limit);
    }

    if (pathname === '/alumnos-baja-performance') {
      const max = parseFloat(params.get('max') || '3.5');
      const alumnos = (data.alumnos || []).slice();
      const notasMat = data.notas_materias || [];
      const notasEx = data.notas_examenes || [];
      const list = alumnos.map(a => {
        let promedio = a.promedio_general;
        if (!promedio) {
          const mat = notasMat.filter(n => Number(n.alumno_id) === Number(a.id));
          if (mat.length) promedio = mat.reduce((s, x) => s + (Number(x.promedio) || 0), 0) / mat.length;
          else {
            const ex = notasEx.filter(n => Number(n.alumno_id) === Number(a.id));
            if (ex.length) promedio = ex.reduce((s, x) => s + (Number(x.nota) || 0), 0) / ex.length;
          }
        }
        return { ...a, promedio_general: Number(promedio || 0) };
      }).filter(a => a.promedio_general < max);
      return list;
    }
    // fallback: return whole data for convenience, or a key without leading slash
    const key = pathname.replace(/\//g,'');
    if (key && data[key]) return data[key];
    return {};
  }

  // real API
  if (!apiBase) throw new Error('No API base configured and mock disabled');
  const url = apiBase + path;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API GET ${url} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  if (useMock) {
    // naive mock: return success and echo
    return {ok:true, result: body};
  }
  const res = await fetch(apiBase + path, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  if (!res.ok) throw new Error(`API POST failed: ${res.status}`);
  return res.json();
}

export async function apiPut(path, body) {
  if (useMock) {
    return {ok:true, result: body};
  }
  const res = await fetch(apiBase + path, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  if (!res.ok) throw new Error(`API PUT failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path) {
  if (useMock) {
    return {ok:true};
  }
  if (!apiBase) throw new Error('No API base configured and mock disabled');
  const res = await fetch(apiBase + path, {method:'DELETE'});
  if (!res.ok) throw new Error(`API DELETE failed: ${res.status}`);
  return res.json();
}

export default { apiGet, apiPost, apiPut, apiDelete };
