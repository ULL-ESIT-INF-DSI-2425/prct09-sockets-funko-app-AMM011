import * as net from "net"
import { MensajeChat } from "./MensajeChat.js";

const clientes: net.Socket[] = [];
let contadorClientes = 1;

/**
 * Crea un servidor que permite a varios clientes conectarse y enviarse mensajes.
 */
const servidor = net.createServer((cliente) => {
    const nombreCliente = `Usuario${contadorClientes++}`;
    clientes.push(cliente);

    console.log(`${nombreCliente} se ha conectado.`);

    cliente.on('data', (datos) => {
        // Convertimos los datos a un objeto, aqui empleaod JSON para convertir la cadena recibida
        // de vuelta a un objeto
        const mensaje: MensajeChat = JSON.parse(datos.toString());
        // Mostramos el mensaje en la consola del servidor
        console.log(`[${nombreCliente}]: ${mensaje.texto}`);

        // Reenviamos a todos los clientes
        clientes.forEach((otroCliente) => {
            if (otroCliente !== cliente) {
                const mensajeReenviado: MensajeChat = {
                    nombre: nombreCliente,
                    texto: mensaje.texto,
                };
                // Utilizamos JSON para convertir los objetos de mensaje 
                // (del tipo MensajeChat) a una cadena en formato JSON antes de enviarlos
                otroCliente.write(JSON.stringify(mensajeReenviado));
            }
        });
    });

    cliente.on('end', () => {
        console.log(`${nombreCliente} se ha desconectado.`);
        // Obtenemos el indice del cliente, para despues sacarlo de la lista de clientes
        const index = clientes.indexOf(cliente);
        if (index !== -1) {
            // Para eliminarlo de la lista de clientes
            clientes.splice(index, 1);
        }
    });
});

servidor.listen(60300, () => {
    console.log("🟢 Servidor escuchando en el puerto 60300...");
})