// ==========================================
// MÓDULO IA - Controller (Asistente Conversacional)
// ==========================================
// Asistente de IA conectado a la BD del sistema.
// Usa Google Gemini API con Fallback Local si hay error de cuota.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../../models/models');

// Inicializar cliente de Gemini (lazy para evitar crash sin API key)
let genAI = null;
function getGemini() {
    if (!genAI && process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
}

// Función para análisis local (cuando falla la API)
const localAnalyze = (text, context) => {
    const query = text.toLowerCase();
    let response = "🤖 **Asistente (Modo Offline)**\n\n";
    response += "La IA está procesando muchas peticiones en este momento, pero aquí tienes un resumen de tus datos:\n\n";

    if (query.includes('proyecto') || query.includes('cuanto') || query.includes('ganado')) {
        // Extraer resumen del contexto para la respuesta local
        const lines = context.split('\n');
        const resumen = lines.filter(l => l.startsWith('- Total')).join('\n');
        response += "📊 **Estado Actual:**\n" + resumen + "\n\n";
        
        if (query.includes('pago') || query.includes('dinero') || query.includes('ganado')) {
             const proyectosResult = lines.filter(l => l.includes('| Estado:')).join('\n');
             response += "📂 **Proyectos y Pagos:**\n" + proyectosResult;
        }
    } else if (query.includes('hola') || query.includes('quien eres')) {
        response += "¡Hola! Soy el asistente de F&M Web Solutions. Puedo darte información sobre tus proyectos, clientes y estados financieros basado en la base de datos actual.";
    } else {
        response += "No estoy seguro de cómo responder a eso en modo offline, pero aquí tienes el resumen del sistema:\n\n" + context.substring(0, 500) + "...";
    }

    return response;
};

// Función helper: obtener contexto de la BD
const getSystemContext = async () => {
    try {
        const [clientesSnap, proyectosSnap, ubicacionesSnap] = await Promise.all([
            db.collection('usuarios').where('rol', '==', 'cliente').get(),
            db.collection('proyectos').get(),
            db.collection('locations').get()
        ]);

        const clientes = clientesSnap.docs.map(d => ({ ...d.data(), id: d.id }));
        const ubicaciones = ubicacionesSnap.docs.map(d => ({ ...d.data(), id: d.id }));

        const proyectos = [];
        let totalPagosCount = 0;

        for (const doc of proyectosSnap.docs) {
            const data = doc.data();
            const proyecto = { ...data, id: doc.id };

            if (data.clienteId) {
                const cDoc = await db.collection('usuarios').doc(data.clienteId).get();
                if (cDoc.exists) proyecto.cliente = { ...cDoc.data(), id: cDoc.id };
            }

            const pagosSnap = await db.collection(`proyectos/${doc.id}/pagos`).get();
            proyecto.Pagos = pagosSnap.docs.map(p => ({ ...p.data(), id: p.id }));
            totalPagosCount += proyecto.Pagos.length;

            proyectos.push(proyecto);
        }

        let context = `DATOS DEL SISTEMA F&M Web Solutions:\n\n`;

        context += `📊 RESUMEN:\n`;
        context += `- Total clientes: ${clientes.length}\n`;
        context += `- Total proyectos: ${proyectos.length}\n`;
        context += `- Total pagos: ${totalPagosCount}\n`;
        context += `- Total ubicaciones: ${ubicaciones.length}\n\n`;

        if (clientes.length > 0) {
            context += `👤 CLIENTES:\n`;
            clientes.forEach(c => {
                context += `- ${c.nombre} (${c.email}) - Tel: ${c.telefono || 'N/A'} - Registrado: ${c.createdAt}\n`;
            });
            context += '\n';
        }

        if (proyectos.length > 0) {
            context += `📂 PROYECTOS:\n`;
            proyectos.forEach(p => {
                const clienteNombre = p.cliente ? p.cliente.nombre : 'Sin asignar';
                const pagosTotal = p.Pagos ? p.Pagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0) : 0;
                const numPagos = p.Pagos ? p.Pagos.length : 0;
                context += `- "${p.nombre}" | Estado: ${p.estado} | Cliente: ${clienteNombre} | Pagos: ${numPagos} ($${pagosTotal})\n`;
                if (p.descripcion) context += `  Descripción: ${p.descripcion}\n`;
            });
            context += '\n';
        }

        return context;
    } catch (error) {
        return 'No se pudieron cargar los datos del sistema: ' + error.message;
    }
};

const iaController = {
    // POST /ai/analyze → Asistente conversacional con contexto de la BD
    analyze: async (req, res) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'Se requiere texto' });

        const systemContext = await getSystemContext();

        try {
            const client = getGemini();
            if (!client) throw new Error('API Key de Gemini no configurada');

            const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const systemPrompt = `Eres el asistente de IA de F&M Web Solutions. Responde en español y usa emojis.\n\n${systemContext}`;

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUsuario: ' + text }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            });

            const response = result.response.text();
            res.json({
                success: true,
                data: { response, model: 'gemini-1.5-flash', timestamp: new Date().toISOString() }
            });

        } catch (error) {
            console.warn('⚠️ Error en Gemini, usando Fallback Local:', error.message);
            
            // Fallback Local
            const response = localAnalyze(text, systemContext);
            
            res.json({
                success: true,
                data: { 
                    response, 
                    model: 'Local Fallback (Offline)', 
                    timestamp: new Date().toISOString(),
                    note: 'IA temporalmente en modo offline por límites de cuota.'
                }
            });
        }
    }
};

module.exports = iaController;
