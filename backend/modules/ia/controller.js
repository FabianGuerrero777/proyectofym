// ==========================================
// MÓDULO IA - Controller (Asistente Conversacional)
// ==========================================
// Asistente de IA conectado a la BD del sistema.
// Responde preguntas sobre proyectos, clientes, pagos, etc.

const OpenAI = require('openai');
const { db } = require('../../models/models');

// Inicializar cliente de OpenAI (lazy para evitar crash sin API key)
let openai = null;
function getOpenAI() {
    if (!openai && process.env.OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
}

// Función helper: obtener contexto de la BD
const getSystemContext = async () => {
    try {
        const [clientesSnap, proyectosSnap, ubicacionesSnap] = await Promise.all([
            db.collection('usuarios').where('rol', '==', 'cliente').get(),
            db.collection('proyectos').get(),
            db.collection('locations').get()
        ]);

        const clientes = clientesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const ubicaciones = ubicacionesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const proyectos = [];
        let totalPagosCount = 0;

        for (const doc of proyectosSnap.docs) {
            const data = doc.data();
            const proyecto = { id: doc.id, ...data };

            if (data.clienteId) {
                const cDoc = await db.collection('usuarios').doc(data.clienteId).get();
                if (cDoc.exists) proyecto.cliente = { id: cDoc.id, ...cDoc.data() };
            }

            const pagosSnap = await db.collection(`proyectos/${doc.id}/pagos`).get();
            proyecto.Pagos = pagosSnap.docs.map(p => ({ id: p.id, ...p.data() }));
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
                if (p.Pagos && p.Pagos.length > 0) {
                    p.Pagos.forEach(pago => {
                        context += `  💰 Pago: $${pago.monto} - ${pago.descripcion || 'Sin descripción'} (${pago.estado})\n`;
                    });
                }
            });
            context += '\n';
        }

        if (ubicaciones.length > 0) {
            context += `📍 UBICACIONES:\n`;
            ubicaciones.forEach(l => {
                context += `- ${l.nombre}: ${l.direccion} (${l.tipo})\n`;
            });
        }

        return context;
    } catch (error) {
        return 'No se pudieron cargar los datos del sistema: ' + error.message;
    }
};

const iaController = {
    // POST /ai/analyze → Asistente conversacional con contexto de la BD
    analyze: async (req, res) => {
        try {
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: req.t ? req.t('ia.noText') : 'Se requiere texto para analizar'
                });
            }

            const client = getOpenAI();
            if (!client) {
                return res.status(500).json({
                    success: false,
                    message: 'La API Key de OpenAI no está configurada en el archivo .env'
                });
            }

            // Obtener contexto del sistema
            const systemContext = await getSystemContext();

            const systemPrompt = `Eres el asistente de IA de F&M Web Solutions, una empresa de desarrollo web.
Tu trabajo es ayudar a los administradores respondiendo preguntas sobre sus proyectos, clientes, pagos y estado del negocio.

REGLAS:
- Responde SIEMPRE en español, de forma clara y amigable.
- Usa emojis para hacer las respuestas más legibles.
- Si te preguntan sobre datos específicos, consulta el contexto del sistema que tienes abajo.
- Si no tienes datos suficientes, dilo amablemente.
- Formatea las respuestas de forma bonita con viñetas y saltos de línea.
- NO respondas con JSON, responde en lenguaje natural.
- Sé conciso pero completo.

${systemContext}`;

            const completion = await client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.7,
                max_tokens: 800
            });

            const response = completion.choices[0].message.content;

            res.json({
                success: true,
                message: 'Análisis completado',
                data: {
                    response: response,
                    model: 'gpt-3.5-turbo',
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error en IA:', error.message);
            res.status(500).json({
                success: false,
                message: req.t ? req.t('ia.analyzeError') : 'Error en el análisis',
                error: error.message
            });
        }
    }
};

module.exports = iaController;
