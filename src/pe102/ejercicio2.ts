import * as fs from "fs";
import * as path from "path";
import { json } from "stream/consumers";

/**
 * Convierte un archivo JSON con datos meteorológicos a formato CSV.
 * @param inputPath - Ruta del archivo JSON de entrada.
 * @param outputPath - Ruta del archivo CSV de salida.
 */
function convertJsonToCsv(inputPath: string, outputPath: string): void {
  fs.readFile(inputPath, "utf8", (err, data) => {
    if (err) {
      console.log(`Error al leer el archivo: ${inputPath}.`);
      return;
    }

    if (!data) {
      console.log("El archivo está vacío");
      return;
    }

    // Coloco any porque con unknown me pide el tipo de dato que se esta manejando
    let jsonData: any[];

    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.log(`Error al parsear el JSON: ${(parseErr as Error).message}`);
      return;
    }

    //Comprobamos ahora si el jsonData es un array de objetos
    if (!Array.isArray(jsonData)) {
      console.log(`El JSON debe ser un array de objetos.`);
      return;
    }

    // Comprobamos qu eno este vacio
    if (jsonData.length === 0) {
      console.log(`El JSON esta vació.`);
      return;
    }

    // Creamos una variable donde se van almacenar las claves del objeto.
    const cabecera = Object.keys(jsonData[0] as object);
    // Ahora unimos el contenido con comas
    const csvLines: string[] = [];
    csvLines.push(cabecera.join(","));

    // Convertimos el array de string a un solo array
    // iteramos sobre cada objeto
    jsonData.forEach((entrada) => {
      const fila: string[] = [];
      cabecera.forEach((header) => {
        let valor = entrada[header];
        if (typeof valor === "string" && valor.includes(",")) {
          valor = `"${valor}"`;
        }
        fila.push(valor);
      });
      csvLines.push(fila.join(","));
    });

    const csvContent = csvLines.join("\n");

    // Ahora almacenamos todos los valores en el nuevo fichero
    fs.writeFile(outputPath, csvContent, "utf8", (err) => {
      if (err) {
        console.log(`Error al escribir el archivo CSV.`);
        return;
      }
      console.log(`Archivo CSV creado.`);
    });
  });
}

/**
 * Procesa los argumentos por línea de comandos y ejecuta la acción de conteo.
 */
const args: string[] = process.argv.slice(2);

if (args.length < 2) {
  console.log("Uso: ts-node script.ts <ruta-archivo> <archivo de salida>.");
} else {
  const [inputPath, outputPath] = args;
  convertJsonToCsv(inputPath, outputPath);
}
