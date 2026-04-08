const API_URL = 'http://localhost:3000/api';
let currentUser = null;

// ==========================================
// 1. AUTENTICACIÓN Y MODO VISUAL
// ==========================================

function verDiseno() {
    currentUser = { id: 0, nombre: "Profesor (Sin BD)", rol: "admin" };
    
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');

    document.getElementById('usuario-nombre').innerText = currentUser.nombre;
    document.getElementById('usuario-rol').innerText = currentUser.rol;
    document.getElementById('admin-controls').classList.remove('hidden');
    
    // Dejar listas vacías con mensajes decorativos porque no hay BD
    document.getElementById('nuevo-cliente-id').innerHTML = '<option>-- Modo de diseño visual --</option>';
    document.getElementById('tabla-usuarios-body').innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 10px;">(Sin conexión - Datos vacíos)</td></tr>';
    document.getElementById('lista-proyectos').innerHTML = '<div class="card" style="text-align:center; color:#94a3b8;"><p>Modo visual: Los proyectos irían aquí</p></div>';
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Guardar sesión
            mostrarDashboard();
        } else {
            alert(data.message);
        }
    } catch (e) {
        console.error(e);
        alert("Error: Asegúrate de que el servidor (backend/services/server.js) esté corriendo.");
    }
}

function logout() {
    localStorage.removeItem('currentUser'); // Borrar sesión
    location.reload();
}

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        mostrarDashboard();
    }
});

// ==========================================
// 2. DASHBOARD Y UI
// ==========================================

function mostrarDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');

    document.getElementById('usuario-nombre').innerText = currentUser.nombre;
    document.getElementById('usuario-rol').innerText = currentUser.rol;

    // Si es admin, mostramos controles
    if (currentUser.rol === 'admin') {
        document.getElementById('admin-controls').classList.remove('hidden');
        cargarClientesSelect();
        cargarTablaUsuarios();
    }

    // Si es admin o moderador, cargar todos los proyectos
    cargarProyectos();
}

async function cargarClientesSelect() {
    const res = await fetch(`${API_URL}/usuarios`); // Endpoint que devuelve solo clientes
    const clientes = await res.json();
    const select = document.getElementById('nuevo-cliente-id');
    select.innerHTML = '<option value="">Seleccionar Cliente...</option>';
    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.nombre} (${c.email})</option>`;
    });
}

// ==========================================
// 3. GESTIÓN DE PROYECTOS
// ==========================================

async function cargarProyectos() {
    const res = await fetch(`${API_URL}/proyectos/${currentUser.id}`);
    const proyectos = await res.json();

    const container = document.getElementById('lista-proyectos');
    container.innerHTML = '';

    if (proyectos.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#94a3b8;">No tienes proyectos asignados aún.</p>';
        return;
    }

    proyectos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';

        let colorClass = 'pendiente';
        if (p.estado === 'En Desarrollo') colorClass = 'desarrollo';
        if (p.estado === 'Finalizado') colorClass = 'finalizado';

        const isAdminOrMod = currentUser.rol === 'admin' || currentUser.rol === 'moderador';
        const isAdmin = currentUser.rol === 'admin';

        // HTML Base del proyecto
        let html = `
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <h3>${p.nombre}</h3>
                    <p style="color:#cbd5e1; margin-bottom:10px;">${p.descripcion}</p>
                    <span class="status-badge ${colorClass}">${p.estado}</span>
                </div>
                ${isAdminOrMod ? `
                    <div style="text-align:right;">
                        <select onchange="cambiarEstado(${p.id}, this.value)" style="padding:5px; margin-bottom:5px;">
                            <option value="Pendiente" ${p.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="En Desarrollo" ${p.estado === 'En Desarrollo' ? 'selected' : ''}>En Desarrollo</option>
                            <option value="Finalizado" ${p.estado === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                        </select>
                        <br>
                        ${isAdmin ? `<button onclick="agregarPago(${p.id})" style="padding:5px 10px; font-size:0.8rem; background:var(--success);">+ Pago</button>` : ''}
                    </div>
                ` : ''}
            </div>
            
            <hr style="border:0; border-top:1px solid #334155; margin:15px 0;">
            
            <!-- SECCIÓN PAGOS (Visible para todos) -->
            <h4 style="font-size:0.9rem; color:#94a3b8; margin-bottom:5px;">💰 Historial de Pagos</h4>
            <ul style="list-style:none; padding-left:0; font-size:0.9rem;">
                ${p.Pagos && p.Pagos.length > 0
                ? p.Pagos.map(pay => `<li>✅ $${pay.monto} - ${pay.descripcion}</li>`).join('')
                : '<li style="color:#64748b;">No hay pagos registrados.</li>'}
            </ul>
        `;

        div.innerHTML = html;
        container.appendChild(div);
    });
}

// ==========================================
// 4. ACCIONES (ADMIN)
// ==========================================

async function crearProyecto() {
    const nombre = document.getElementById('nuevo-titulo').value;
    const descripcion = document.getElementById('nuevo-desc').value;
    const clienteId = document.getElementById('nuevo-cliente-id').value;

    if (!nombre || !clienteId) return alert("Falta nombre o cliente");

    await fetch(`${API_URL}/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, clienteId })
    });

    alert('Proyecto Creado!');
    cargarProyectos();
}

async function crearCliente() {
    const nombre = document.getElementById('crear-nombre').value;
    const email = document.getElementById('crear-email').value;
    const password = document.getElementById('crear-pass').value;

    await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'cliente' })
    });

    alert('Cliente Registrado!');
    cargarClientesSelect(); // Actualizar lista
    cargarTablaUsuarios(); // Actualizar tabla si existe
}

async function cargarTablaUsuarios() {
    try {
        const res = await fetch(`${API_URL}/users-all`);
        const usuarios = await res.json();
        const tbody = document.getElementById('tabla-usuarios-body');
        tbody.innerHTML = '';

        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 8px; border-bottom: 1px solid #334155;">${u.id}</td>
                <td style="padding: 8px; border-bottom: 1px solid #334155;">${u.nombre}</td>
                <td style="padding: 8px; border-bottom: 1px solid #334155;">${u.email}</td>
                <td style="padding: 8px; border-bottom: 1px solid #334155;">
                    <span style="padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; background: ${u.rol === 'admin' ? 'var(--accent)' : 'var(--bg-card)'};">
                        ${u.rol}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Error cargando tabla de usuarios:", e);
    }
}

async function cambiarEstado(id, nuevoEstado) {
    await fetch(`${API_URL}/proyectos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    cargarProyectos(); // Refrescar para ver cambio de color
}

async function agregarPago(proyectoId) {
    const monto = prompt("Monto del pago:");
    if (!monto) return;
    const descripcion = prompt("Descripción (ej. Anticipo):");

    await fetch(`${API_URL}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto, descripcion, ProyectoId: proyectoId, estado: 'Pagado' })
    });
    cargarProyectos();
}


// ==========================================
// 5. DATOS DE PRUEBA (SOLO PARA SETUP)
// ==========================================
async function crearDatosPrueba() {
    if (!confirm("¿Crear admin, moderador y cliente de prueba?")) return;

    // Crear Admin
    await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: "Admin Fabian", email: "admin@fmweb.com", password: "123", rol: "admin" })
    });

    // Crear Moderador
    await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: "Moderador Test", email: "mod@fmweb.com", password: "123", rol: "moderador" })
    });

    // Crear Cliente
    await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: "Cliente Test", email: "cliente@test.com", password: "123", rol: "cliente" })
    });

    alert("Usuarios creados. \nAdmin: admin@fmweb.com\nMod: mod@fmweb.com\nCliente: cliente@test.com\nPass: 123");
}