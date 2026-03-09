# Instrucciones para Ejecutar el Proyecto

Este proyecto consiste en un backend (Node.js + Express + Sequelize) y un frontend (HTML + CSS + JS).

## 1. Requisitos Previos

*   **Node.js**: Debes tener instalado Node.js.
*   **MySQL**: Debes tener un servidor MySQL corriendo.

## 2. Configuración de la Base de Datos

1.  Abre tu cliente de MySQL (ej. MySQL Workbench).
2.  Crea la base de datos:
    ```sql
    CREATE DATABASE fymweb_db;
    ```
3.  **IMPORTANTE**: Debes configurar tu usuario y contraseña de MySQL en el archivo del servidor.
    *   Abre `backend/services/server.js`.
    *   En la línea 10, cambia `'root'` y `'12345'` por tu usuario y contraseña reales de MySQL.
    ```javascript
    // Ejemplo:
    const sequelize = new Sequelize('fymweb_db', 'tu_usuario', 'tu_contraseña', { ... });
    ```
    *   Házlo también en `backend/models/models.js` línea 5 si planeas usar ese archivo.

## 3. Instalación de Dependencias

Abre una terminal en la carpeta raíz del proyecto (`c:\Users\Admin\Downloads\Adelanto_proyecto\Adelanto_proyecto`) y ejecuta:

```bash
npm install
```

Esto instalará `express`, `cors`, `mysql2`, y `sequelize`.

## 4. Ejecutar el Backend

En la misma terminal, ejecuta:

```bash
node backend/services/server.js
```

Si todo va bien, verás:
`🚀 Servidor de CLIENTES listo en puerto 3000`
`✅ Tabla 'Clientes' recreada y lista`

## 5. Ejecutar el Frontend

Simplemente abre el archivo `index.html` en tu navegador (doble clic) o usa una extensión como "Live Server" en VS Code.

---

## ⚠️ Nota Importante sobre el Código Actual

He notado que el código está **incompleto/desconectado**:

1.  **Frontend (`app.js`)**: Intenta hacer login (`POST /api/login`) y cargar proyectos (`GET /api/proyectos`).
2.  **Backend (`server.js`)**: Actualmente **SOLO** tiene rutas para Clientes (`/api/clientes`). No tiene `/login` ni `/proyectos`.

Por lo tanto, al darle al botón "Ingresar" en la página web, **recibirás un error** (probablemente 404 Not Found en la consola del navegador), porque el servidor no sabe cómo responder a esa petición.

Si necesitas ayuda para implementar la funcionalidad de Login y Proyectos en el backend, por favor házmelo saber.
