import * as fs from "fs";

/**
 * Cuenta la cantidad de veces que una palabra clave aparece en un archivo de texto.
 * @param filePath - Ruta del archivo a analizar.
 * @param keyWord - Clave a buscar
 */
function countKeywordOccurrences(filePath: string, keyWord: string): void {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(`Erro al leer el archivo: ${err.message}`);
      return;
    }

    if (!data) {
      console.log("El archivo está vacío");
      return;
    }
    // Indicamos que la busqueda sera global con g
    // Creamos una expresión regular
    const regex = new RegExp(keyWord, "g");
    const matches = data.match(regex);
    // Si es null devolvemos 0, sino el conteo
    const count = matches ? matches.length : 0;
    console.log(`La palabra "${keyWord}" aparece ${count} veces.`);
  });
}

/**
 * Procesa los argumentos por línea de comandos y ejecuta la acción de conteo.
 */
const args: string[] = process.argv.slice(2);

if (args.length < 2) {
  console.log("Uso: ts-node script.ts <ruta-archivo> <palabra-clave>.");
} else {
  const [filePath, keyword] = args;
  countKeywordOccurrences(filePath, keyword);
}
