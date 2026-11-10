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
