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