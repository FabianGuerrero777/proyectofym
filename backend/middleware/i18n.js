// ==========================================
// MIDDLEWARE: Internacionalización (i18n)
// ==========================================
// Detecta el idioma del cliente por:
//   1. Query parameter: ?lang=es
//   2. Header: Accept-Language: es
//   3. Default: 'es'
//
// Agrega req.lang y req.t() a cada petición.
// Uso: req.t('auth.loginSuccess') → "Inicio de sesión exitoso"

const path = require('path');
const fs = require('fs');

// Cargar archivos de idioma
const localesDir = path.join(__dirname, '..', 'i18n');
const languages = {};

// Cargar todos los archivos .json de la carpeta i18n/
try {
    const files = fs.readdirSync(localesDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const lang = file.replace('.json', '');
            languages[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
            console.log(`🌐 Idioma cargado: ${lang}`);
        }
    });
} catch (error) {
    console.log('⚠️  No se pudieron cargar archivos de idioma:', error.message);
}

const i18n = (req, res, next) => {
    // Detectar idioma
    let lang = 'es'; // Default

    // 1. Por query parameter ?lang=en
    if (req.query.lang && languages[req.query.lang]) {
        lang = req.query.lang;
    }
    // 2. Por header Accept-Language
    else if (req.headers['accept-language']) {
        const headerLang = req.headers['accept-language'].split(',')[0].split('-')[0].toLowerCase();
        if (languages[headerLang]) {
            lang = headerLang;
        }
    }

    // Establecer idioma en el request
    req.lang = lang;

    // Función de traducción: req.t('clave.subclave')
    req.t = (key) => {
        const keys = key.split('.');
        let value = languages[lang];

        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                // Si no encuentra la traducción, buscar en español como fallback
                let fallback = languages['es'];
                for (const fk of keys) {
                    if (fallback && fallback[fk] !== undefined) {
                        fallback = fallback[fk];
                    } else {
                        return key; // Devolver la clave si no hay traducción
                    }
                }
                return fallback;
            }
        }
        return value;
    };

    next();
};

module.exports = i18n;
