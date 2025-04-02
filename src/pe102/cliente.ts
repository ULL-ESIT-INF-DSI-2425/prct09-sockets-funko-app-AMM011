import * as net from "net";
import * as readline from "readline";
import { MensajeChat } from "./MensajeChat.js";

const cliente = new net.Socket();

/**
 * Se conecta al servidor y permite escribir mensajes por consola.
 */
cliente.connect(60300, () => {
    console.log('Conectado al servidor de chat.');
});

cliente.on('data', (datos) => {
    // Convertimos los datos a un objeto
    const mensaje: MensajeChat = JSON.parse(datos.toString());
    // Mostramos el mensaje en la consola
    console.log(`[${mensaje.nombre}]: ${mensaje.texto}`);
});

/**
 * Creamos una interfaz de lectura y escritura en la consola
 */
const entrada = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

entrada.on('line', (texto) => {
    // Creamos un mensaje con el texto introducido
    const mnesaje: MensajeChat = {
        nombre: '',
        texto: texto,
    };
    // Enviamos el mensaje al servidor
    cliente.write(JSON.stringify(mnesaje));
})