// admin.js
// Este archivo hace funcionar el login del panel de administrador.
//
// En simple, hace esto:
//   1. Toma el correo y la contraseña que escribe la persona.
//   2. Se los manda al servidor para que los revise.
//   3. Si es administrador, muestra el panel. Si no, muestra un error.
//
// Para que funcione, el servidor tiene que estar prendido (node server.js).

// Dirección del servidor. Si algún día lo publican, solo se cambia esta línea.
const API_URL = "http://localhost:3000";

// Aquí guardamos las partes del HTML que vamos a usar
const vistaLogin = document.getElementById("vista-login");
const vistaPanel = document.getElementById("vista-panel");
const formLogin = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const mensajeError = document.getElementById("mensaje-error");
const btnEntrar = document.getElementById("btn-entrar");
const btnSalir = document.getElementById("btn-salir");
const nombreAdmin = document.getElementById("nombre-admin");
const estadoProductos = document.getElementById("estado-productos");
const listaProductos = document.getElementById("lista-productos");
const formProducto = document.getElementById("form-producto");
const inputNombreProducto = document.getElementById("nombre-producto");
const inputPrecioProducto = document.getElementById("precio-producto");
const inputDescripcionProducto = document.getElementById("descripcion-producto");
const mensajeProducto = document.getElementById("mensaje-producto");
const btnAgregar = document.getElementById("btn-agregar");

/**
 * Muestra un mensaje de error en rojo debajo de los campos.
 * Recibe el texto que se quiere mostrar.
 */
function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.hidden = false;
}

/**
 * Esconde el login y muestra el panel con el nombre del administrador.
 */
function mostrarPanel(nombre) {
    // Usamos textContent para que el nombre se muestre como texto normal
    nombreAdmin.textContent = nombre;
    vistaLogin.hidden = true;
    vistaPanel.hidden = false;
    // Al abrir el panel, cargamos los productos de la base de datos
    mensajeProducto.hidden = true;
    cargarProductos();
}

/**
 * Esconde el panel y vuelve a mostrar el login.
 */
function mostrarLogin() {
    vistaPanel.hidden = true;
    vistaLogin.hidden = false;
}

/**
 * Se ejecuta cuando la persona le da a "Entrar".
 * Revisa que los campos no estén vacíos, le pregunta al servidor
 * si el correo y la contraseña son correctos, y muestra lo que corresponda.
 * Es "async" porque hablar con el servidor se demora un poquito y hay que esperar la respuesta.
 */
async function iniciarSesion(evento) {
    // Evita que la página se recargue al enviar el formulario
    evento.preventDefault();
    mensajeError.hidden = true;

    const email = inputEmail.value.trim();
    const password = inputPassword.value;

    if (!email || !password) {
        mostrarError("Escribe tu correo y tu contraseña.");
        return;
    }

    // Bloqueamos el botón para que no lo toquen dos veces seguidas
    btnEntrar.disabled = true;
    btnEntrar.textContent = "Entrando...";

    try {
        // Le mandamos el correo y la contraseña al servidor
        const respuesta = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const datos = await respuesta.json();

        // Si el servidor dice que algo salió mal, mostramos su mensaje
        if (!respuesta.ok) {
            mostrarError(datos.error || "No se pudo iniciar sesión.");
            return;
        }

        // Un cliente puede tener cuenta, pero este panel es solo para administradores
        if (datos.rol !== "admin") {
            mostrarError("Esta zona es solo para administradores.");
            return;
        }

        // Guardamos el token (el "pase" que nos dio el servidor) mientras la pestaña esté abierta.
        // Más adelante lo vamos a usar para crear, editar y borrar productos.
        // Ojo: el token dura 2 horas, después hay que volver a entrar.
        sessionStorage.setItem("token", datos.token);
        sessionStorage.setItem("nombre", datos.nombre);

        formLogin.reset();
        mostrarPanel(datos.nombre);
    } catch (error) {
        // Si llega aquí, lo más probable es que el servidor esté apagado
        mostrarError("No se pudo conectar con el servidor. Revisa que esté encendido (node server.js).");
    } finally {
        // Pase lo que pase, el botón vuelve a quedar como estaba
        btnEntrar.disabled = false;
        btnEntrar.textContent = "Entrar";
    }
}

/**
 * Le pide los productos al servidor y los muestra en la lista del panel.
 * Esta ruta es pública, así que no necesita el token.
 */
async function cargarProductos() {
    estadoProductos.textContent = "Cargando productos...";
    estadoProductos.hidden = false;
    listaProductos.textContent = "";

    try {
        const respuesta = await fetch(`${API_URL}/api/productos`);
        const productos = await respuesta.json();

        if (!respuesta.ok) {
            estadoProductos.textContent = "No se pudieron cargar los productos.";
            return;
        }

        if (productos.length === 0) {
            estadoProductos.textContent = "Todavía no hay productos.";
            return;
        }

        // Por cada producto armamos un renglón de la lista
        productos.forEach((producto) => {
            const item = document.createElement("li");

            const nombre = document.createElement("strong");
            nombre.textContent = producto.nombre;

            const precio = document.createElement("span");
            precio.className = "precio";
            precio.textContent = "$" + producto.precio.toLocaleString("es-CO");

            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion;

            item.append(nombre, precio, descripcion);
            listaProductos.appendChild(item);
        });

        // Ya hay lista, así que escondemos el aviso de "Cargando"
        estadoProductos.hidden = true;
    } catch (error) {
        estadoProductos.textContent = "No se pudo conectar con el servidor.";
    }
}

/**
 * Muestra un aviso debajo del formulario de productos.
 * Si "esError" es true sale en rojo, si no sale en verde.
 */
function mostrarMensajeProducto(texto, esError) {
    mensajeProducto.textContent = texto;
    mensajeProducto.className = esError ? "mensaje-error" : "mensaje-ok";
    mensajeProducto.hidden = false;
}

/**
 * Se ejecuta cuando le dan a "Agregar producto".
 * Manda el producto nuevo al servidor junto con el token (el "pase" de administrador).
 * Si sale bien, vuelve a cargar la lista para que se vea el producto nuevo.
 */
async function agregarProducto(evento) {
    evento.preventDefault();
    mensajeProducto.hidden = true;

    const nombre = inputNombreProducto.value.trim();
    const precio = Number(inputPrecioProducto.value);
    const descripcion = inputDescripcionProducto.value.trim();

    if (!nombre || inputPrecioProducto.value === "" || precio < 0) {
        mostrarMensajeProducto("Escribe el nombre y un precio válido.", true);
        return;
    }

    const token = sessionStorage.getItem("token");

    // Bloqueamos el botón para que no lo toquen dos veces seguidas
    btnAgregar.disabled = true;
    btnAgregar.textContent = "Agregando...";

    try {
        const respuesta = await fetch(`${API_URL}/api/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Aquí va el token. Sin él, el servidor responde error 401
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, precio, descripcion })
        });
        const datos = await respuesta.json();

        // 401 o 403: el token venció (dura 2 horas) o no es de un administrador
        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesion();
            mostrarError("Tu sesión venció. Vuelve a entrar.");
            return;
        }

        if (!respuesta.ok) {
            mostrarMensajeProducto(datos.error || "No se pudo agregar el producto.", true);
            return;
        }

        formProducto.reset();
        mostrarMensajeProducto("Producto agregado.", false);
        cargarProductos();
    } catch (error) {
        mostrarMensajeProducto("No se pudo conectar con el servidor.", true);
    } finally {
        btnAgregar.disabled = false;
        btnAgregar.textContent = "Agregar producto";
    }
}

/**
 * Cierra la sesión: borra lo que guardamos y vuelve al login.
 */
function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("nombre");
    mostrarLogin();
}

// Si ya habían entrado antes en esta pestaña, mostramos el panel directo
const nombreGuardado = sessionStorage.getItem("nombre");
if (sessionStorage.getItem("token") && nombreGuardado) {
    mostrarPanel(nombreGuardado);
}

// Le decimos a cada botón qué función ejecutar cuando lo toquen
formLogin.addEventListener("submit", iniciarSesion);
btnSalir.addEventListener("click", cerrarSesion);
formProducto.addEventListener("submit", agregarProducto);
