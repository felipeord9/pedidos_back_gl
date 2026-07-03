const fs = require('fs');
const path = require('path');
const CatalogService = require("../../services/catalogService");
const { models } = require('../../libs/sequelize')

// '.' significa el directorio actual donde se ejecuta el script
const directorioOrigen = '\\\\192.168.4.237\\aplicativoComercial'; 

// Función principal asíncrona para poder usar await correctamente
async function actualizarBaseDatos() {
    console.log('Iniciando lectura de archivos y actualización de base de datos...');

    try {
        // Leemos el directorio de forma síncrona
        const archivos = fs.readdirSync(directorioOrigen);
        console.log(`Se encontraron ${archivos.length} elementos en el directorio.\n`);

        // Usamos 'for...of' que maneja perfectamente el flujo asíncrono y permite usar 'continue'
        for (const archivo of archivos) {
            const rutaOrigenCompleta = path.join(directorioOrigen, archivo);

            // 1. SOLUCIÓN AL ERROR DE SINTAXIS: Ahora 'continue' es legal aquí
            if (!fs.lstatSync(rutaOrigenCompleta).isFile()) continue;

            // Extraer las referencias numéricas del nombre del archivo
            const nombreSinExtension = path.parse(archivo).name; 
            const referencias = nombreSinExtension.match(/\d+/g); 

            // ==========================================
            // Evaluar si contiene -EMB
            // ==========================================
            if (archivo.includes('-EMB')) {
                if (referencias) {
                    for (const ref of referencias) {
                        try {
                            // 2. SOLUCIÓN AL ERROR ASÍNCRONO: Ahora el await funciona en orden
                            const product = await models.CatalogService.findByPk(ref);
                            if (!product) {
                                console.log(`[ALERTA] La referencia ${ref} no existe en la BD. (Archivo: ${archivo})`);
                                continue; 
                            }
                            await product.update({ imgPacking: true });
                            console.log(`[ÉXITO EMB] Ref: ${ref} actualizada a imgPacking: true`);
                        } catch (errorDb) {
                            console.error(`[ERROR BD] Error con ref ${ref}:`, errorDb.message);
                        }
                    }
                }
            } 
            
            // ==========================================
            // Evaluar si contiene -EMP
            // ==========================================
            else if (archivo.includes('-EMP')) {
                if (referencias) {
                    for (const ref of referencias) {
                        try {
                            const product = await models.CatalogService.findByPk(ref);
                            if (!product) {
                                console.log(`[ALERTA] La referencia ${ref} no existe en la BD. (Archivo: ${archivo})`);
                                continue; 
                            }
                            await product.update({ imgProduct: true });
                            console.log(`[ÉXITO EMP] Ref: ${ref} actualizada a imgProduct: true`);
                        } catch (errorDb) {
                            console.error(`[ERROR BD] Error con ref ${ref}:`, errorDb.message);
                        }
                    }
                }
            }
        }

        console.log('\n¡Proceso de actualización en Base de Datos finalizado con éxito!');

    } catch (err) {
        console.error('Error crítico al procesar el directorio:', err);
    }
}

// Ejecutar la función principal
actualizarBaseDatos();