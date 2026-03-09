const API_URL = 'http://localhost:3000/api';

// ==========================================
// 1. COMPONENTES DE LA LANDING PAGE
// ==========================================

const Navbar = ({ t, lang, toggleLang, isDark, toggleTheme, onLoginClick, currentUser, onDashboardClick }) => (
    <header className="fixed top-4 left-0 right-0 z-[1000] flex justify-center px-4">
        <nav className="flex items-center justify-between w-full max-w-7xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 px-6 py-3 rounded-full shadow-sm dark:shadow-none transition-colors duration-300">
            <div className={`text-2xl font-bold ${isDark ? 'text-gradient' : ''}`} style={!isDark ? { background: 'linear-gradient(135deg, #1e293b 30%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>F&M</div>
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
                <li><a href="#inicio" className="text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-500 transition">{t.nav.home}</a></li>
                <li><a href="#servicios" className="text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-500 transition">{t.nav.services}</a></li>
                <li><a href="#contacto" className="text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-500 transition">{t.nav.contact}</a></li>
            </ul>
            <div className="flex items-center space-x-3">
                <button onClick={toggleLang} className="text-xs font-bold border border-gray-300 dark:border-white/20 px-2 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition">
                    {lang === 'es' ? 'EN' : 'ES'}
                </button>
                <button onClick={toggleTheme} className="text-sm p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-700 dark:text-white">
                    {isDark ? '☀️' : '🌙'}
                </button>
                {currentUser ? (
                    <button onClick={onDashboardClick} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition">
                        {t.nav.dashboard}
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition">
                        {t.nav.login}
                    </button>
                )}
            </div>
        </nav>
    </header>
);

const ServiceCard = ({ icono, titulo, descripcion }) => (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-lg dark:shadow-none hover:shadow-xl dark:hover:bg-white/10 transition-all group">
        <div className="text-pink-600 dark:text-pink-500 text-3xl mb-4 group-hover:scale-110 transition-transform">
            <i className={icono}></i>
        </div>
        <h3 className="text-xl font-extrabold mb-2 text-gray-900 dark:text-white">{titulo}</h3>
        <p className="text-gray-800 dark:text-gray-400 font-medium dark:font-normal leading-relaxed">{descripcion}</p>
    </div>
);

const Hero = ({ t, isDark }) => (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20" id="inicio">
        <h1 className="text-5xl md:text-7xl font-black mb-6 max-w-4xl leading-tight text-gray-900 dark:text-white">
            {t.hero.title1} <br />
            <span className={isDark ? 'text-gradient' : ''} style={!isDark ? { background: 'linear-gradient(135deg, #1e293b 30%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>{t.hero.title2}</span>
        </h1>
        <p className="text-gray-800 font-medium dark:font-normal dark:text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
            {t.hero.desc}
        </p>
    </section>
);

const ContactForm = ({ t }) => {
    const [formData, setFormData] = React.useState({ name: '', email: '', project: '', description: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `Hola F&M, mi nombre es ${formData.name}.%0A%0A*Detalles del Proyecto:* ${formData.project}%0A*Descripción:* ${formData.description}%0A*Email:* ${formData.email}`;
        window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
    };

    return (
        <section className="py-24 px-4" id="contacto">
            <div className="max-w-3xl mx-auto bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl dark:shadow-none transition-colors duration-300">
                <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">{t.contact.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.contact.name}</label>
                            <input type="text" name="name" required onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                                placeholder={t.contact.name} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.contact.email}</label>
                            <input type="email" name="email" required onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                                placeholder="correo@ejemplo.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.contact.project}</label>
                        <input type="text" name="project" required onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                            placeholder={t.contact.project} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.contact.desc}</label>
                        <textarea name="description" required rows="4" onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none"
                            placeholder={t.contact.desc}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-pink-500/25 flex justify-center items-center">
                        <i className="fab fa-whatsapp mr-2 text-xl"></i> {t.contact.submit}
                    </button>
                </form>
            </div>
        </section>
    );
};

// ==========================================
// 2. MODAL DE LOGIN (con Google Auth)
// ==========================================

const LoginModal = ({ t, onClose, onLogin }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                onLogin(data.user);
                onClose();
            } else {
                setError(data.message || t.login.error);
            }
        } catch (e) {
            setError('Error de conexión. ¿Está el servidor corriendo?');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;

            // Enviar datos del usuario al backend (no requiere Firebase Admin)
            const res = await fetch('http://localhost:3000/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idToken: await user.getIdToken(),
                    email: user.email,
                    nombre: user.displayName || user.email.split('@')[0],
                    uid: user.uid
                })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                onLogin(data.user);
                onClose();
            } else {
                setError(data.message || 'Error al iniciar sesión con Google');
            }
        } catch (e) {
            console.error('Google Sign-In error:', e);
            if (e.code === 'auth/popup-closed-by-user') {
                setError('Se cerró la ventana de Google');
            } else if (e.code === 'auth/unauthorized-domain') {
                setError('Dominio no autorizado. Agrega localhost en Firebase Console → Authentication → Settings.');
            } else {
                setError('Error con Google: ' + (e.message || ''));
            }
        }
        setLoading(false);
    };

    const crearDatosPrueba = async () => {
        setLoading(true);
        try {
            await fetch(`${API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: "Admin Fabian", email: "admin@fmweb.com", password: "123", rol: "admin" }) });
            await fetch(`${API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: "Moderador Test", email: "mod@fmweb.com", password: "123", rol: "moderador" }) });
            await fetch(`${API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: "Cliente Test", email: "cliente@test.com", password: "123", rol: "cliente" }) });
            alert("Usuarios creados.\nAdmin: admin@fmweb.com\nMod: mod@fmweb.com\nCliente: cliente@test.com\nPass: 123");
        } catch (e) {
            alert('Error creando usuarios de prueba');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔐 {t.login.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl transition">✕</button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <button onClick={handleGoogleLogin} disabled={loading} className="google-btn mb-2">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    {t.login.google || 'Iniciar sesión con Google'}
                </button>

                <div className="divider-or">{t.login.or || 'o'}</div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.login.email}</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                            placeholder="admin@fmweb.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.login.password}</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                            placeholder="******" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50">
                        {loading ? '...' : t.login.submit}
                    </button>
                </form>

                <p className="text-center mt-4">
                    <button onClick={crearDatosPrueba} className="text-pink-500 hover:text-pink-400 text-sm font-medium transition">
                        {t.login.createTest}
                    </button>
                </p>
            </div>
        </div>
    );
};

// ==========================================
// 3. PANEL DE IA (Asistente Conversacional)
// ==========================================

const IAPanel = ({ t }) => {
    const [text, setText] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const analyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`${API_URL}/ai-analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.data);
            } else {
                setResult({ error: data.message || 'Error en el análisis' });
            }
        } catch (e) {
            setResult({ error: 'Error de conexión con el servicio de IA' });
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analyze();
        }
    };

    const inputClass = "w-full bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition text-sm";

    return (
        <div className="mb-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 border-l-4 border-l-purple-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🤖 {t.ia?.title || 'Asistente IA (ChatGPT)'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
                Pregúntame sobre tus proyectos, clientes, pagos o cualquier dato del sistema.
            </p>
            <div className="space-y-3">
                <div className="flex gap-3">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.ia?.placeholder || 'Ej: ¿Cuántos clientes tenemos? ¿Cómo van los proyectos?'}
                        className={inputClass + " flex-1"}
                    />
                    <button
                        onClick={analyze}
                        disabled={loading || !text.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition text-sm disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? <span className="ia-typing">⏳</span> : '🚀'}
                    </button>
                </div>

                {result && (
                    <div className="mt-3 bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-xl p-4">
                        {result.error ? (
                            <p className="text-red-500 text-sm">❌ {result.error}</p>
                        ) : (
                            <div className="ia-panel-response text-gray-800 dark:text-gray-200" style={{ whiteSpace: 'pre-wrap' }}>
                                {result.response}
                                <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-white/10">
                                    🤖 {result.model} | {new Date(result.timestamp).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const MapaUbicaciones = ({ ubicaciones, onSelectLocation, selectable }) => {
    const mapRef = React.useRef(null);
    const mapInstance = React.useRef(null);
    const pinMarker = React.useRef(null);

    React.useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current).setView([4.6, -74.08], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance.current);

        // Click para poner pin (solo si es selectable)
        if (selectable && onSelectLocation) {
            mapInstance.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                // Quitar pin anterior
                if (pinMarker.current) {
                    mapInstance.current.removeLayer(pinMarker.current);
                }
                // Crear pin rojo de selección
                const redIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                });
                pinMarker.current = L.marker([lat, lng], { icon: redIcon }).addTo(mapInstance.current);
                pinMarker.current.bindPopup(`📍 Ubicación seleccionada<br><small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>`).openPopup();
                onSelectLocation(lat, lng);
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                pinMarker.current = null;
            }
        };
    }, []);

    React.useEffect(() => {
        if (!mapInstance.current) return;

        // Limpiar marcadores previos (excepto el pin seleccionado)
        mapInstance.current.eachLayer(layer => {
            if (layer instanceof L.Marker && layer !== pinMarker.current) {
                mapInstance.current.removeLayer(layer);
            }
        });

        ubicaciones.forEach(loc => {
            if (loc.latitud && loc.longitud) {
                const marker = L.marker([loc.latitud, loc.longitud]).addTo(mapInstance.current);
                const tipo = loc.tipo === 'cliente' ? '👤' : loc.tipo === 'oficina' ? '🏢' : loc.tipo === 'proyecto' ? '📂' : '📍';
                marker.bindPopup(`<b>${tipo} ${loc.nombre}</b><br>${loc.direccion || ''}<br><small>${loc.tipo}</small>`);
            }
        });

        if (ubicaciones.length > 0 && !selectable) {
            const validLocs = ubicaciones.filter(l => l.latitud && l.longitud);
            if (validLocs.length > 0) {
                const bounds = validLocs.map(l => [l.latitud, l.longitud]);
                mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
            }
        }
    }, [ubicaciones]);

    return (
        <div ref={mapRef} style={{ height: selectable ? '200px' : '350px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}></div>
    );
};

// ==========================================
// 4b. PANEL DE DETALLE DE CLIENTE
// ==========================================

const ClientDetailPanel = ({ cliente, proyectos, ubicaciones, onClose }) => {
    // Buscar ubicación del cliente
    const clienteUbicacion = ubicaciones.filter(u => 
        u.nombre === cliente.nombre || u.tipo === 'cliente'
    );
    // Buscar proyectos de este cliente
    const clienteProyectos = proyectos.filter(p => 
        p.clienteId === cliente.id || (p.cliente && p.cliente.id === cliente.id)
    );

    const getStatusClass = (estado) => {
        if (estado === 'En Desarrollo') return 'status-desarrollo';
        if (estado === 'Finalizado') return 'status-finalizado';
        if (estado === 'En Espera de Pago') return 'status-espera-pago';
        return 'status-pendiente';
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">👤 {cliente.nombre}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl transition">✕</button>
                </div>

                {/* Info del cliente */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-gray-900 dark:text-white font-medium mt-1">{cliente.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Rol</p>
                        <p className="text-gray-900 dark:text-white font-medium mt-1 capitalize">{cliente.rol}</p>
                    </div>
                </div>

                {/* Ubicación en mapa */}
                {clienteUbicacion.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">📍 Ubicación</h3>
                        <MapaUbicaciones ubicaciones={clienteUbicacion} selectable={false} />
                        <div className="mt-2 space-y-1">
                            {clienteUbicacion.map((loc, i) => (
                                <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
                                    📌 {loc.direccion || 'Sin dirección'} ({loc.latitud}, {loc.longitud})
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Proyectos del cliente */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                        📂 Proyectos ({clienteProyectos.length})
                    </h3>
                    {clienteProyectos.length === 0 ? (
                        <p className="text-gray-400 text-sm py-3 text-center">No tiene proyectos asignados</p>
                    ) : (
                        <div className="space-y-3">
                            {clienteProyectos.map(p => (
                                <div key={p.id} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{p.nombre}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{p.descripcion}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClass(p.estado)}`}>
                                            {p.estado}
                                        </span>
                                    </div>
                                    {p.Pagos && p.Pagos.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                            <p className="text-xs text-gray-400 mb-1">💰 Pagos:</p>
                                            {p.Pagos.map((pay, idx) => (
                                                <p key={idx} className="text-xs text-emerald-500">✅ ${pay.monto} - {pay.descripcion}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

// ==========================================
// 5. DASHBOARD
// ==========================================

const Dashboard = ({ t, currentUser, onLogout, onBack, isDark }) => {
    const [proyectos, setProyectos] = React.useState([]);
    const [usuarios, setUsuarios] = React.useState([]);
    const [clientes, setClientes] = React.useState([]);
    const [ubicaciones, setUbicaciones] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState(null);

    // Form states
    const [nuevoTitulo, setNuevoTitulo] = React.useState('');
    const [nuevoDesc, setNuevoDesc] = React.useState('');
    const [nuevoClienteId, setNuevoClienteId] = React.useState('');
    const [crearNombre, setCrearNombre] = React.useState('');
    const [crearEmail, setCrearEmail] = React.useState('');
    const [crearPass, setCrearPass] = React.useState('');
    const [crearDireccion, setCrearDireccion] = React.useState('');
    const [crearLat, setCrearLat] = React.useState('');
    const [crearLng, setCrearLng] = React.useState('');
    const [editingUser, setEditingUser] = React.useState(null);

    // Comment states
    const [nuevoComentario, setNuevoComentario] = React.useState('');
    const [nuevaActitud, setNuevaActitud] = React.useState('😊 Satisfecho');
    const [commentingProyectoId, setCommentingProyectoId] = React.useState(null);

    const isAdmin = currentUser.rol === 'admin';
    const isAdminOrMod = currentUser.rol === 'admin' || currentUser.rol === 'moderador';

    React.useEffect(() => {
        cargarProyectos();
        cargarUbicaciones();
        if (isAdmin) {
            cargarUsuarios();
            cargarClientes();
        }
    }, []);

    const cargarProyectos = async () => {
        try {
            console.log('[DEBUG] Cargando proyectos para userId:', currentUser.id, 'tipo:', typeof currentUser.id);
            const url = `${API_URL}/proyectos/${currentUser.id}`;
            console.log('[DEBUG] Fetch URL:', url);
            const res = await fetch(url);
            console.log('[DEBUG] Response status:', res.status);
            if (!res.ok) { console.error('Error cargando proyectos:', res.status); return; }
            const data = await res.json();
            console.log('[DEBUG] Proyectos recibidos:', data);
            setProyectos(Array.isArray(data) ? data : []);
        } catch (e) { console.error('[DEBUG] Error en cargarProyectos:', e); }
    };

    const cargarUsuarios = async () => {
        try {
            const res = await fetch(`${API_URL}/users-all`);
            const data = await res.json();
            setUsuarios(data);
        } catch (e) { console.error(e); }
    };

    const cargarClientes = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios`);
            const data = await res.json();
            setClientes(data);
        } catch (e) { console.error(e); }
    };

    const cargarUbicaciones = async () => {
        try {
            const res = await fetch(`${API_URL}/locations`);
            const data = await res.json();
            if (data.data) setUbicaciones(data.data);
        } catch (e) { console.error(e); }
    };

    const crearProyecto = async () => {
        if (!nuevoTitulo || !nuevoClienteId) return alert("Falta nombre o cliente");
        try {
            const res = await fetch(`${API_URL}/proyectos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoTitulo, descripcion: nuevoDesc, clienteId: nuevoClienteId, estado: 'Pendiente', progreso: 0 })
            });
            const data = await res.json();
            if (data.success) {
                alert(t.dashboard.projectCreated);
            } else {
                alert('Error al crear proyecto: ' + (data.error || data.message));
                return;
            }
        } catch (e) {
            alert('Error de conexión al crear proyecto');
            console.error(e);
            return;
        }
        setNuevoTitulo(''); setNuevoDesc(''); setNuevoClienteId('');
        cargarProyectos();
    };

    const crearCliente = async () => {
        if (!crearNombre || !crearEmail || !crearPass) return alert("Nombre, email y contraseña son obligatorios");
        // Registrar cliente
        await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: crearNombre, email: crearEmail, password: crearPass, rol: 'cliente' })
        });

        // Si tiene dirección/ubicación, registrarla
        if (crearDireccion && crearLat && crearLng) {
            await fetch(`${API_URL}/locations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: crearNombre,
                    direccion: crearDireccion,
                    latitud: parseFloat(crearLat),
                    longitud: parseFloat(crearLng),
                    tipo: 'cliente',
                    descripcion: `Ubicación del cliente ${crearNombre}`
                })
            });
            cargarUbicaciones();
        }

        alert(t.dashboard.clientCreated);
        setCrearNombre(''); setCrearEmail(''); setCrearPass('');
        setCrearDireccion(''); setCrearLat(''); setCrearLng('');
        cargarClientes();
        cargarUsuarios();
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        await fetch(`${API_URL}/proyectos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarProyectos();
    };

    const cambiarProgreso = async (id, nuevoProgreso) => {
        await fetch(`${API_URL}/proyectos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progreso: parseInt(nuevoProgreso) || 0 })
        });
        cargarProyectos();
    };

    const eliminarProyecto = async (id) => {
        if (!confirm(t.dashboard.confirmDelete)) return;
        await fetch(`${API_URL}/proyectos/${id}`, { method: 'DELETE' });
        alert(t.dashboard.projectDeleted);
        cargarProyectos();
    };

    const agregarPago = async (proyectoId) => {
        const monto = prompt(t.dashboard.payAmount || 'Monto del pago:');
        if (!monto) return;
        const descripcion = prompt(t.dashboard.payDesc || 'Descripción:');
        await fetch(`${API_URL}/pagos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ monto, descripcion, proyectoId: proyectoId, estado: 'Pagado' })
        });
        cargarProyectos();
    };

    const agregarComentario = async (proyectoId) => {
        if (!nuevoComentario) return alert('El comentario no puede estar vacío');
        await fetch(`${API_URL}/projects/${proyectoId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                texto: nuevoComentario, 
                actitud: nuevaActitud, 
                usuarioId: currentUser.id 
            })
        });
        alert('Comentario agregado');
        setNuevoComentario('');
        setCommentingProyectoId(null);
        cargarProyectos();
    };

    const eliminarUsuario = async (id) => {
        if (!confirm(t.dashboard.confirmDelete)) return;
        await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
        alert(t.dashboard.userDeleted);
        cargarUsuarios();
        cargarClientes();
    };

    const actualizarUsuario = async (id, data) => {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert(t.dashboard.userUpdated);
        setEditingUser(null);
        cargarUsuarios();
        cargarClientes();
    };

    const getStatusClass = (estado) => {
        if (estado === 'En Desarrollo') return 'status-desarrollo';
        if (estado === 'Finalizado') return 'status-finalizado';
        if (estado === 'En Espera de Pago') return 'status-espera-pago';
        return 'status-pendiente';
    };

    const inputClass = "w-full bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition text-sm";
    const btnClass = "bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition text-sm w-full";
    const btnDanger = "bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition";
    const btnSuccess = "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition";

    return (
        <div className="dashboard-container min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t.dashboard.greeting} <span className="text-pink-500">{currentUser.nombre}</span> 👋
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mt-1">
                            {t.dashboard.role}: {currentUser.rol}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onBack} className="border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition">
                            {t.dashboard.backToSite}
                        </button>
                        <button onClick={onLogout} className="border border-red-500/30 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition">
                            {t.dashboard.logout}
                        </button>
                    </div>
                </div>

                {/* PANEL IA */}
                {isAdminOrMod && <IAPanel t={t} />}

                {/* MAPA DE UBICACIONES (con todos los pins) */}
                {isAdminOrMod && (
                    <div className="mb-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 border-l-4 border-l-emerald-500">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            📍 Mapa de Ubicaciones
                        </h3>
                        <MapaUbicaciones ubicaciones={ubicaciones} selectable={false} />
                        <p className="text-xs text-gray-400 mt-2">{ubicaciones.length} ubicaciones registradas</p>
                    </div>
                )}

                {/* PANEL ADMIN */}
                {isAdmin && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">⚡ {t.dashboard.adminPanel}</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Crear Proyecto */}
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 border-l-4 border-l-pink-500">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.newProject}</h4>
                                <div className="space-y-3">
                                    <input type="text" placeholder={t.dashboard.projectName} value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} className={inputClass} />
                                    <input type="text" placeholder={t.dashboard.projectDesc} value={nuevoDesc} onChange={(e) => setNuevoDesc(e.target.value)} className={inputClass} />
                                    <select value={nuevoClienteId} onChange={(e) => setNuevoClienteId(e.target.value)} className={inputClass}>
                                        <option value="">{t.dashboard.selectClient}</option>
                                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.email})</option>)}
                                    </select>
                                    <button onClick={crearProyecto} className={btnClass}>{t.dashboard.createProject}</button>
                                </div>
                            </div>

                            {/* Crear Cliente con Ubicación (mapa interactivo) */}
                            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 border-l-4 border-l-emerald-500">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.newClient}</h4>
                                <div className="space-y-3">
                                    <input type="text" placeholder={t.dashboard.clientName} value={crearNombre} onChange={(e) => setCrearNombre(e.target.value)} className={inputClass} />
                                    <input type="email" placeholder={t.dashboard.clientEmail} value={crearEmail} onChange={(e) => setCrearEmail(e.target.value)} className={inputClass} />
                                    <input type="password" placeholder={t.dashboard.clientPass} value={crearPass} onChange={(e) => setCrearPass(e.target.value)} className={inputClass} />
                                    <div className="border-t border-gray-200 dark:border-white/10 pt-3 mt-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">📍 Haz clic en el mapa para seleccionar la ubicación del cliente</p>
                                        <MapaUbicaciones 
                                            ubicaciones={[]} 
                                            selectable={true} 
                                            onSelectLocation={(lat, lng) => { setCrearLat(lat.toFixed(5)); setCrearLng(lng.toFixed(5)); }} 
                                        />
                                        {crearLat && crearLng && (
                                            <p className="text-xs text-emerald-500 mt-2 font-bold">
                                                ✅ Seleccionado: {crearLat}, {crearLng}
                                            </p>
                                        )}
                                        <input type="text" placeholder="Dirección (ej: Calle 100 #15-20, Bogotá)" value={crearDireccion} onChange={(e) => setCrearDireccion(e.target.value)} className={inputClass + ' mt-2'} />
                                    </div>
                                    <button onClick={crearCliente} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition text-sm w-full">
                                        {t.dashboard.registerClient}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de Usuarios con expansión */}
                        <div className="mt-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-900 dark:text-white">👥 {t.dashboard.userList}</h4>
                                <button onClick={cargarUsuarios} className="text-pink-500 hover:text-pink-400 text-sm font-bold transition">
                                    {t.dashboard.refresh}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="users-table">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map(u => (
                                            <tr key={u.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                                <td className="text-gray-900 dark:text-white">{u.id}</td>
                                                <td className="text-gray-900 dark:text-white">
                                                    {editingUser === u.id ? (
                                                        <input type="text" defaultValue={u.nombre} id={`edit-nombre-${u.id}`} className="bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-sm text-gray-900 dark:text-white w-full" />
                                                    ) : u.nombre}
                                                </td>
                                                <td className="text-gray-900 dark:text-white">
                                                    {editingUser === u.id ? (
                                                        <input type="text" defaultValue={u.email} id={`edit-email-${u.id}`} className="bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded px-2 py-1 text-sm text-gray-900 dark:text-white w-full" />
                                                    ) : u.email}
                                                </td>
                                                <td>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.rol === 'admin' ? 'bg-pink-500/20 text-pink-500' : u.rol === 'moderador' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                        {u.rol}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        {editingUser === u.id ? (
                                                            <>
                                                                <button onClick={() => {
                                                                    const nombre = document.getElementById(`edit-nombre-${u.id}`).value;
                                                                    const email = document.getElementById(`edit-email-${u.id}`).value;
                                                                    actualizarUsuario(u.id, { nombre, email });
                                                                }} className={btnSuccess}>✓ Guardar</button>
                                                                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-300 text-xs">Cancelar</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => setSelectedClient(u)} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-500 hover:text-white transition" title="Ver detalles">
                                                                    👁️ Ver
                                                                </button>
                                                                <button onClick={() => setEditingUser(u.id)} className="bg-blue-500/10 border border-blue-500/30 text-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition">
                                                                    ✏️
                                                                </button>
                                                                <button onClick={() => eliminarUsuario(u.id)} className={btnDanger}>
                                                                    🗑️
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* LISTA DE PROYECTOS */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-white/10">
                        📂 {t.dashboard.projects}
                    </h3>

                    {proyectos.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">{t.dashboard.noProjects}</p>
                    ) : (
                        <div className="grid gap-4">
                            {proyectos.map(p => (
                                <div key={p.id} className="project-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{p.nombre}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{p.descripcion}</p>
                                            {p.cliente && (
                                                <p className="text-xs text-gray-400 mt-1">👤 Cliente: {p.cliente.nombre}</p>
                                            )}
                                            
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClass(p.estado)}`}>
                                                    {p.estado}
                                                </span>
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                    Progreso: {p.progreso || 0}%
                                                </span>
                                            </div>

                                            {/* BARRA DE PROGRESO VISUAL */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3 overflow-hidden">
                                                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${p.progreso || 0}%` }}></div>
                                            </div>
                                        </div>

                                        {isAdminOrMod && (
                                            <div className="flex flex-col gap-3 items-end w-full md:w-auto mt-4 md:mt-0">
                                                <div className="flex items-center gap-2 w-full justify-end">
                                                    <span className="text-xs text-gray-400 font-bold">Estado:</span>
                                                    <select
                                                        value={p.estado}
                                                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                                                        className="bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white flex-1 md:flex-none">
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="En Desarrollo">En Desarrollo</option>
                                                        <option value="En Espera de Pago">En Espera de Pago</option>
                                                        <option value="Finalizado">Finalizado</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 w-full justify-end">
                                                    <span className="text-xs text-gray-400 font-bold">%:</span>
                                                    <input 
                                                        type="range" 
                                                        min="0" max="100" 
                                                        value={p.progreso || 0}
                                                        onChange={(e) => cambiarProgreso(p.id, e.target.value)}
                                                        className="w-32 accent-pink-500"
                                                    />
                                                </div>

                                                <div className="flex gap-2 w-full md:w-auto justify-end mt-1">
                                                    {isAdmin && (
                                                        <button onClick={() => agregarPago(p.id)} className={btnSuccess}>
                                                            💰 + Pago
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button onClick={() => eliminarProyecto(p.id)} className={btnDanger}>
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                        <h5 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">💰 {t.dashboard.payments}</h5>
                                        <ul className="space-y-1">
                                            {p.Pagos && p.Pagos.length > 0 ? (
                                                p.Pagos.map((pay, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                        ✅ ${pay.monto} - {pay.descripcion}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm text-gray-400">{t.dashboard.noPayments}</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* SECCIÓN DE COMENTARIOS */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                        <h5 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">💬 Comentarios del Cliente</h5>
                                        {p.Comentarios && p.Comentarios.length > 0 ? (
                                            <div className="space-y-3 mb-4">
                                                {p.Comentarios.map((com, idx) => (
                                                    <div key={idx} className="bg-gray-50 dark:bg-[#0f0f1a] rounded-xl p-3 border border-gray-100 dark:border-white/5">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                                {com.Usuario?.nombre || 'Cliente'}
                                                            </span>
                                                            <span className="text-xs">{com.actitud}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{com.texto}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 mb-4">Aún no hay comentarios</p>
                                        )}

                                        {currentUser.rol === 'cliente' && (
                                            <>
                                                {commentingProyectoId === p.id ? (
                                                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl">
                                                        <select 
                                                            value={nuevaActitud}
                                                            onChange={(e) => setNuevaActitud(e.target.value)}
                                                            className={inputClass + " mb-2"}
                                                        >
                                                            <option value="😊 Satisfecho">😊 Satisfecho</option>
                                                            <option value="🎉 Muy feliz">🎉 Muy feliz</option>
                                                            <option value="😐 Neutral">😐 Neutral</option>
                                                            <option value="🤔 En duda">🤔 En duda</option>
                                                            <option value="😠 Enojado">😠 Enojado</option>
                                                        </select>
                                                        <textarea 
                                                            placeholder="Escribe tu comentario o feedback..."
                                                            value={nuevoComentario}
                                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                                            className={inputClass + " mb-2 resize-none"}
                                                            rows="3"
                                                        ></textarea>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => agregarComentario(p.id)} className={btnSuccess + " flex-1 py-2"}>
                                                                Enviar Comentario
                                                            </button>
                                                            <button onClick={() => setCommentingProyectoId(null)} className="text-gray-500 hover:text-gray-700 text-sm px-3">
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setCommentingProyectoId(p.id)} className="text-pink-500 hover:text-pink-400 text-sm font-bold transition">
                                                        + Añadir Comentario
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DETALLE DE CLIENTE */}
            {selectedClient && (
                <ClientDetailPanel 
                    cliente={selectedClient} 
                    proyectos={proyectos} 
                    ubicaciones={ubicaciones} 
                    onClose={() => setSelectedClient(null)} 
                />
            )}
        </div>
    );
};

// ==========================================
// 6. COMPONENTE RAÍZ (APP)
// ==========================================

const App = () => {
    const [lang, setLang] = React.useState('es');
    const [isDark, setIsDark] = React.useState(true);
    const [showLogin, setShowLogin] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [view, setView] = React.useState('landing');
    const [fading, setFading] = React.useState(false);

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    React.useEffect(() => {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Si el ID es numérico (viejo SQLite), forzar re-login
            if (typeof parsed.id === 'number' || !isNaN(parsed.id)) {
                console.warn('[FIX] Usuario con ID numérico detectado, forzando re-login...');
                localStorage.removeItem('currentUser');
                return;
            }
            setCurrentUser(parsed);
        }
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    const toggleLang = () => {
        setFading(true);
        setTimeout(() => {
            setLang(lang === 'es' ? 'en' : 'es');
        }, 250);
    };

    const [translations, setTranslations] = React.useState(null);
    React.useEffect(() => {
        fetch(`http://localhost:3000/translations/${lang}`)
            .then(res => res.json())
            .then(data => {
                setTranslations(data);
                setTimeout(() => setFading(false), 50);
            })
            .catch(err => {
                console.error("Error cargando idiomas:", err);
                setFading(false);
            });
    }, [lang]);

    if (!translations) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-900 dark:bg-[#0f0f1a] dark:text-white transition-colors duration-300">
                <div className="text-xl font-bold animate-pulse">Cargando / Loading...</div>
            </div>
        );
    }

    const t = translations;

    const handleLogin = (user) => {
        setCurrentUser(user);
        setView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        try { firebase.auth().signOut(); } catch(e) {}
        setCurrentUser(null);
        setView('landing');
    };

    return (
        <div className={`app-wrapper ${fading ? 'lang-fade-out' : 'lang-fade-in'}`}>
            <div className={`mesh-gradient transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0 hidden'}`}></div>

            <Navbar
                t={t} lang={lang} toggleLang={toggleLang}
                isDark={isDark} toggleTheme={toggleTheme}
                onLoginClick={() => setShowLogin(true)}
                currentUser={currentUser}
                onDashboardClick={() => setView('dashboard')}
            />

            {view === 'landing' ? (
                <>
                    <Hero t={t} isDark={isDark} />
                    <main className="container mx-auto px-4 z-10 relative">
                        <section id="servicios" className="py-24">
                            <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900 dark:text-white">{t.services.title}</h2>
                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {t.services.items.map((svc, idx) => (
                                    <ServiceCard key={idx} icono={svc.icon} titulo={svc.title} descripcion={svc.desc} />
                                ))}
                            </div>
                        </section>
                        <ContactForm t={t} />
                    </main>
                    <footer className="py-12 border-t border-gray-300 dark:border-white/10 text-center text-gray-700 font-medium dark:font-normal dark:text-gray-400">
                        <p>{t.footer}</p>
                    </footer>
                </>
            ) : (
                <Dashboard t={t} currentUser={currentUser} onLogout={handleLogout} onBack={() => setView('landing')} isDark={isDark} />
            )}

            {showLogin && <LoginModal t={t} onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
