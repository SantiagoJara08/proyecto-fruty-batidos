<<<<<<< HEAD
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
=======
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
>>>>>>> 8eaa7a03d121ff5c759d2376849478049abd2167
}