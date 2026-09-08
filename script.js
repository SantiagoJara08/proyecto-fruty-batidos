/**
 * Captura los datos del formulario de pedido ("Arma tu pedido rápido"),
 * valida que el nombre y el detalle del pedido no estén vacíos, y abre
 * una nueva pestaña de WhatsApp con el mensaje ya redactado.
 *
 * No usa una base de datos ni un servidor: todo el trabajo pasa en el
 * navegador del cliente, por eso no hace falta async/await ni promesas.
 *
 * Lee estos elementos del HTML (deben existir con estos mismos ids):
 *   - #nombreCliente   (input de texto)
 *   - #detallePedido   (textarea)
 *   - #numeroWhatsApp  (select con el número de WhatsApp destino)
 *
 * @function enviarPedidoWhatsApp
 * @returns {void} No retorna ningún valor. Si faltan datos, muestra una
 *   alerta y no hace nada más. Si todo está bien, abre WhatsApp Web/App
 *   en una pestaña nueva con el mensaje listo para enviar.
 */
function enviarPedidoWhatsApp() {
    const nombre = document.getElementById('nombreCliente').value.trim();
    const detalle = document.getElementById('detallePedido').value.trim();
    const numero = document.getElementById('numeroWhatsApp').value;

    if (nombre === "" || detalle === "") {
        alert("Por favor escribe tu nombre y los detalles de tu pedido antes de enviarlo.");
        return;
    }

    const mensaje = `¡Hola! Mi nombre es *${nombre}* y quiero hacer el siguiente pedido de Fruty Batidos:%0A%0A*Detalle del pedido:*%0A${detalle}`;
    const urlWhatsApp = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
}