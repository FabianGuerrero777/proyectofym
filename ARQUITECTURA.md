# 📐 Documento de Arquitectura — F&M Web Solutions

## 1. Descripción General

F&M Web Solutions es una plataforma web para la gestión de proyectos de desarrollo web. Permite a administradores, moderadores y clientes gestionar proyectos, pagos, ubicaciones geográficas y análisis de texto con inteligencia artificial.

El sistema está dividido en dos capas principales:

- **Backend**: API REST construida con Node.js + Express, organizada en microservicios.
- **Frontend**: Aplicación React 18 que consume la API del backend.

---

## 2. Arquitectura de Microservicios

El backend implementa una arquitectura de **microservicios modulares**, donde cada servicio encapsula una responsabilidad específica dentro de la carpeta `backend/modules/`.

```
backend/
├── index.js                    ← Punto de entrada (orquestador)
├── .env                        ← Variables de entorno
├── package.json
│
├── config/
│   └── firebaseAdmin.js        ← Configuración Firebase Admin SDK
│
├── middleware/
│   ├── authRequired.js         ← Middleware de autenticación (JWT/Firebase)
│   └── i18n.js                 ← Middleware de internacionalización
│
├── models/
│   └── models.js               ← Modelos Sequelize (ORM)
│
├── i18n/
│   ├── es.json                 ← Traducciones español
│   └── en.json                 ← Traducciones inglés
│
├── modules/
│   ├── auth/                   ← 🔐 Microservicio de Autenticación
│   │   ├── controller.js
│   │   └── routes.js
│   ├── users/                  ← 👤 Microservicio de Usuarios
│   │   ├── controller.js
│   │   └── routes.js
│   ├── geo/                    ← 📍 Microservicio Geográfico
│   │   ├── controller.js
│   │   └── routes.js
│   └── ia/                     ← 🤖 Microservicio de IA
│       ├── controller.js
│       └── routes.js
│
└── requests.http               ← Archivo de pruebas REST
```

### Diagrama de la Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE                           │
│            (React 18 + Tailwind CSS)                 │
│         http://localhost:3000                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP Requests (JSON)
                       ▼
┌─────────────────────────────────────────────────────┐
│              SERVIDOR EXPRESS (index.js)              │
│                 Puerto: 3000                         │
│                                                      │
│  Middlewares Globales:                                │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │   CORS   │ │ express.json │ │       i18n       │ │
│  └──────────┘ └──────────────┘ └──────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           authRequired (Middleware)             │  │
│  │     Firebase JWT / Token Local Base64          │  │
│  └────────────────────────────────────────────────┘  │
│                       │                              │
│  ┌────────┬───────────┼───────────┬────────────┐    │
│  ▼        ▼           ▼           ▼            │    │
│ AUTH    USERS        GEO         IA         LEGACY  │
│/auth/* /users/*   /locations/*  /ai/*      /api/*   │
│        /clientes/*                                   │
└──────┬──────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────┐     ┌─────────────────────┐
│   SQLite Database   │     │    APIs Externas     │
│   (Sequelize ORM)   │     │  ┌───────────────┐  │
│                     │     │  │  OpenAI API    │  │
│  - Usuarios         │     │  │  (ChatGPT)    │  │
│  - Proyectos        │     │  └───────────────┘  │
│  - Avances          │     │  ┌───────────────┐  │
│  - Pagos            │     │  │  Firebase     │  │
│  - Locations        │     │  │  Admin SDK    │  │
└─────────────────────┘     │  └───────────────┘  │
                            └─────────────────────┘
```

---

## 3. Descripción de los Microservicios

### 🔐 Auth Service (`/auth`)
**Responsabilidad**: Autenticación de usuarios (login y registro).

| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| POST | `/auth/login` | No | Iniciar sesión con email y contraseña |
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/google` | No | Iniciar sesión con Google (Firebase) |

- Contraseñas encriptadas con **bcrypt** (10 salt rounds)
- Integración con **Firebase Admin SDK** para verificar tokens de Google
- Login con Google: el frontend usa Firebase Auth popup, envía el `idToken` al backend para verificación
- Si Firebase no está configurado, genera tokens locales (Base64)

### 👤 Users Service (`/users`, `/clientes`)
**Responsabilidad**: CRUD completo de usuarios y clientes.

| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| GET | `/users` | Sí (JWT) | Listar usuarios (filtro `?rol=cliente`) |
| GET | `/users/:id` | Sí (JWT) | Obtener usuario por ID |
| POST | `/users` | Sí (JWT) | Crear usuario |
| PUT | `/users/:id` | Sí (JWT) | Actualizar usuario |
| DELETE | `/users/:id` | Sí (JWT) | Eliminar usuario |
| GET | `/clientes` | Sí (JWT) | Alias → mismo que `/users` |
| POST | `/clientes` | Sí (JWT) | Alias → mismo que `/users` |

### 📍 Geo Service (`/locations`)
**Responsabilidad**: Gestión de ubicaciones geográficas (datos de mapas).

| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| GET | `/locations` | Sí (JWT) | Listar ubicaciones (filtro `?tipo=oficina`) |
| GET | `/locations/:id` | Sí (JWT) | Obtener ubicación por ID |
| POST | `/locations` | Sí (JWT) | Crear ubicación (lat, lng, nombre, tipo) |
| PUT | `/locations/:id` | Sí (JWT) | Actualizar ubicación |
| DELETE | `/locations/:id` | Sí (JWT) | Eliminar ubicación |

Tipos de ubicación: `oficina`, `proyecto`, `cliente`, `otro`

### Estados de Proyecto

| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | 🟡 Amarillo | Proyecto recién creado, sin iniciar |
| En Desarrollo | 🔵 Azul | En construcción activa |
| En Espera de Pago | 🟠 Naranja | Trabajo pausado esperando pago del cliente |
| Finalizado | 🟢 Verde | Proyecto completado y entregado |

### 🤖 IA Service (`/ai`)
**Responsabilidad**: Análisis de texto con Inteligencia Artificial (OpenAI).

| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| POST | `/ai/analyze` | Sí (JWT) | Analizar texto con ChatGPT (gpt-3.5-turbo) |

Tipos de análisis soportados (procesados por **OpenAI API**):
- `general` — Análisis general del texto (idioma, tono, tema)
- `sentiment` — Análisis de sentimiento (positivo/negativo/neutral)
- `keywords` — Extracción de palabras clave con relevancia
- `summary` — Resumen automático del texto

---

## 4. Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **Node.js** | Runtime del servidor |
| **Express 4** | Framework HTTP / REST API |
| **Sequelize** | ORM para base de datos |
| **SQLite** | Base de datos relacional (archivo local) |
| **bcrypt** | Hash de contraseñas |
| **Firebase Admin SDK** | Autenticación y gestión de usuarios |
| **OpenAI API** | Servicio de Inteligencia Artificial (ChatGPT) |
| **CORS** | Seguridad para peticiones cross-origin |
| **dotenv** | Variables de entorno |

---

## 5. Modelo de Datos

```
┌──────────────┐       ┌──────────────┐
│   Usuario    │───1:N─│   Proyecto   │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ nombre       │       │ nombre       │
│ email        │       │ descripcion  │
│ password     │       │ estado       │
│ rol          │       │ fechaInicio  │
│ telefono     │       │ clienteId    │──→ FK Usuario
└──────────────┘       │ locationId   │──→ FK Location
                       └──────┬───────┘
                        1:N │      1:N │
                  ┌─────────┘          └──────────┐
                  ▼                                ▼
           ┌──────────────┐                ┌──────────────┐
           │   Avance     │                │    Pago      │
           ├──────────────┤                ├──────────────┤
           │ id           │                │ id           │
           │ descripcion  │                │ monto        │
           │ imagenUrl    │                │ estado       │
           │ fecha        │                │ descripcion  │
           │ ProyectoId   │                │ ProyectoId   │
           └──────────────┘                └──────────────┘

┌──────────────┐
│  Location    │
├──────────────┤
│ id           │
│ nombre       │
│ direccion    │
│ latitud      │
│ longitud     │
│ tipo         │
│ descripcion  │
└──────────────┘
```

---

## 6. Autenticación y Seguridad

El sistema utiliza un esquema de autenticación dual:

1. **Modo Firebase** (Producción): Verifica tokens JWT emitidos por Firebase Authentication.
2. **Modo Local** (Desarrollo): Genera tokens Base64 que contienen los datos del usuario.

El middleware `authRequired` protege las rutas de los microservicios Users, Geo e IA. Las rutas de Auth permanecen públicas para permitir login y registro.

### Flujo de autenticación:
```
1. POST /auth/login → { email, password }
2. Servidor valida credenciales con bcrypt
3. Retorna token (Firebase JWT o Base64 local)
4. Cliente envía token en cada petición:
   Header: Authorization: Bearer <token>
5. Middleware authRequired valida el token
6. Si es válido → ejecuta el endpoint
7. Si es inválido → 401 Unauthorized
```

---

## 7. Internacionalización (i18n)

Todas las respuestas del API soportan español e inglés. El idioma se detecta por:

1. Query parameter: `?lang=en`
2. Header: `Accept-Language: en`
3. Default: `es` (español)
