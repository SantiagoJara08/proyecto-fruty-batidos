# Backend de Fruty Batidos

Servidor hecho con Node.js, Express y MongoDB para la página de Fruty Batidos. Guarda los productos en una base de datos y tiene login con roles (administrador y cliente).

## Qué hace

- Muestra la lista de productos (público).
- Permite crear, editar y borrar productos (solo administrador).
- Permite registrarse e iniciar sesión. Al iniciar sesión entrega un token que dura 2 horas.
- Guarda las contraseñas encriptadas con bcrypt.

## Requisitos

- Node.js (versión LTS).
- Una cuenta gratuita en MongoDB Atlas, con un cluster y un usuario de base de datos.

## Instalación

1. Entra a la carpeta del backend:
   ```
   cd backend-fruty-batidos
   ```
2. Instala las librerías:
   ```
   npm install
   ```

## Configuración

1. Copia el archivo `config.example.js` y llama a la copia `config.js`.
2. Abre `config.js` y cambia:
   - `mongoUri`: la dirección de conexión de MongoDB Atlas, con tu usuario y contraseña, y `/frutybatidos` antes del `?`.
   - `jwtSecreto`: una frase larga y secreta que inventes.
3. No subas `config.js` a GitHub. Ya está en el `.gitignore`.

## Cargar los datos iniciales

Estos dos comandos se corren una sola vez:

```
node seed.js
node crearAdmin.js "Tu Nombre" tucorreo@gmail.com TuClave
```

- `seed.js` pasa los productos de `productos.js` a la base de datos.
- `crearAdmin.js` crea el primer usuario administrador.

## Cómo correrlo

```
node server.js
```

Si todo está bien, la terminal muestra `Conectado a MongoDB` y `Servidor corriendo en http://localhost:3000`.

## Rutas

| Método | Ruta | Quién puede | Qué hace |
|--------|------|-------------|----------|
| GET | `/` | Todos | Mensaje de bienvenida |
| GET | `/api/productos` | Todos | Lista los productos |
| POST | `/api/productos` | Solo admin | Crea un producto |
| PUT | `/api/productos/:id` | Solo admin | Edita un producto |
| DELETE | `/api/productos/:id` | Solo admin | Borra un producto |
| POST | `/api/auth/registro` | Todos | Crea un usuario con rol cliente |
| POST | `/api/auth/login` | Todos | Inicia sesión y devuelve un token |

Para usar las rutas de admin, se manda el token en la cabecera `Authorization: Bearer <token>`.

## Estructura de carpetas

```
backend-fruty-batidos/
├── middleware/     -> auth.js: revisa el token y el rol de admin
├── models/         -> Producto.js y Usuario.js: cómo son los datos
├── routes/         -> auth.js y productos.js: las rutas del servidor
├── config.example.js  -> plantilla de configuración (sin datos reales)
├── crearAdmin.js   -> crea el usuario administrador
├── productos.js    -> productos iniciales
├── seed.js         -> carga los productos a la base de datos
└── server.js       -> archivo principal que enciende el servidor
```

## Seguridad

- La clave de la base de datos va en `config.js`, que Git ignora.
- Todos los que se registran quedan con rol cliente. El administrador se crea solo con `crearAdmin.js`.
- Sin token, las rutas de administrador responden error 401.
