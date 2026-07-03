const CatalogService = require("../services/catalogService");
const FamiliaService = require("../services/familiaService");
const NotificationService = require('../services/notificationService')
const fs = require('fs');
const path = require('path');
const { config } = require('../config/config')
const axios = require('axios');
const crypto = require('crypto');

const findAllProducts = async (req, res, next) => {
  try {
    const data = await CatalogService.find();
    res.status(200).json({
      status: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const compareAllProducts = async (req, res, next) => {
  try {
    console.log("Solicitando productos al backend de SQL Server...");
    const respuestaSQLServer = await axios.get(`${config.sqlApiUrl}/products`);
    const productosSQL = respuestaSQLServer.data; // Aquí ya tienes los datos de SQL Server
    const dataSql = productosSQL.data

    console.log('busqueda en postgresql')
    const resultadoPostgres = await CatalogService.find();
    
    //filtrar datos del siesa
    const DataFiltrada = dataSql.map(({ item }) => ({
      codigo: item.codigo,
      descripcion: item.descripcion,
      um: item.um
    }));

    //filtrar datos de pgadmin
    const PgFiltrada = resultadoPostgres.map(( item ) => ({
      codigo: item.id,
      descripcion: item.description,
      um: item.um
    }));

    //se busca los elementos que el codigo ya existe, pero la referencia es diferente
    const diferencias = DataFiltrada.filter(
      item1 => PgFiltrada.some(item2 => parseInt(item1.codigo) === parseInt(item2.codigo) && !(item1.descripcion === item2.descripcion))
    );

    //se bucasn los datos que el codigo esta en siesa y no en pgadmina
    const porCrear = DataFiltrada.filter(
      item1 => !PgFiltrada.some(item2 => parseInt(item1.codigo) === parseInt(item2.codigo))
    );

    const result = [...porCrear]
        
    //se filtrar datos que el codigo son string
    const filtroResult = result.filter(item => !(item.codigo.includes("LC0003 ") || (item.codigo.includes("MP6075 ")) || item.codigo.includes("SR0060 ") || item.codigo.includes("MP0415 ")))
        
    //se guardan los valores en constantes de la funcion
    const creates = [...filtroResult]
    const updates = [...diferencias]

    const alertasParaEnviar = [];

    //agregamos los productos por crear
    if(creates){
      for(const product of creates){
        const id = product.codigo
        const tipoNotificacion = 'crear'
        const huellaHash = crypto.createHash('md5').update(`${id}-${tipoNotificacion}`).digest('hex');

        // Verificar si YA se le notificó esto al usuario antes
        const yaNotificado = await NotificationService.findByHuella(huellaHash)
        
        if(!yaNotificado){
          await NotificationService.create({
            producId: id,
            tipoNotificacion: `El producto: ${id}, está pendiente por crear.`,
            fechaNotificacion: new Date(),
            huella: huellaHash,
            concept: 'crear',
            leido: false,
          })
          alertasParaEnviar.push({
            id: id,
            texto: `El producto: ${id}, está pendiente por crear.`,
            leida: false,
          });
        }
      }
    }

    //agregamos los productos por editar
    if(updates){
      for(const product of updates){
        const id = product.codigo
        const tipoNotificacion = 'editar'
        const huellaHash = crypto.createHash('md5').update(`${id}-${tipoNotificacion}`).digest('hex');

        // Verificar si YA se le notificó esto al usuario antes
        const yaNotificado = await NotificationService.findByHuella(huellaHash)
        
        if(!yaNotificado){
          const notifi = await NotificationService.create({
            producId: id,
            tipoNotificacion: `El producto: ${id}, ha cambiado y se debe actualizar.`,
            fechaNotificacion: new Date(),
            huella: huellaHash,
            concept: 'editar',
            leido: false
          })
          alertasParaEnviar.push({
            id: id,
            texto: `El producto: ${id}, ha cambiado y se debe actualizar.`,
            leida: false,
          });
        }
      }
    }

    //agregamos las notificaciones exitentes
    const todasLasNotificaciones = await NotificationService.find()

    res.status(200).json(todasLasNotificaciones);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const findOneProduct = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const data = await CatalogService.findOne(id);

    res.status(200).json({
      status: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { body } = req
    console.log(body)
    
    const data = await CatalogService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const create2 = async (req, res, next) => {
  try {
    const { body } = req
    console.log(body)

    const productFromSql = await axios.get(`${config.sqlApiUrl}/products/${body.id}`);
    const productoSQL = productFromSql.data; // Aquí ya tienes los datos de SQL Server
    const dataSql = productoSQL.data

    console.log(dataSql)

    const info = {
      id: dataSql.item.codigo,
      description: dataSql.item.descripcion,
      um: dataSql.item.um
    }

    const data = await CatalogService.create(info)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { body } = req
    
    for(let product of body) {
      const prod = await CatalogService.findOne(parseInt(product.codigo))
      const updated = await prod.update({
        family: product.familia
      })
    }

    res.status(201).json({
      message: 'Updated'
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updateProd2 = async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const data = await CatalogService.update2(id, body)

    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateFamily = async (req, res, next) => {
  try {

    const { body } = req

    // 1. Traemos todos los productos
    const data = await CatalogService.find();

    // 2. Traemos TODAS las familias de una sola vez para no hacer un findOne por cada ciclo
    // Asumo que tu FamiliaService tiene un findAll o método similar
    const todasLasFamilias = await FamiliaService.find(); 
    
    // Creamos un mapa rápido de buscar: { "064": "RECORTES", "0002": "CAMARONES" }
    const mapaFamilias = new Map(todasLasFamilias.map(f => [String(f.id).trim(), f.description]));

    // 3. Usamos Promise.all para procesar las actualizaciones en paralelo (o en bloques)
    // Nota: Si son demasiados datos (ej: > 5000), un ciclo for normal con la optimización del mapa sigue siendo mejor para no saturar conexiones.
    const promesasActualizacion = data.map(async (product) => {
      // Limpiamos el código de familia por si viene con espacios
      const codigoFamilia = String(product.family).trim();
      const descripcionFamilia = mapaFamilias.get(codigoFamilia) || "Sin Descripción";

      // Buscamos el registro del catálogo
      const catalogItem = await CatalogService.findOne(parseInt(product.id));
      
      if (catalogItem) {
        // Ejecutamos el update y retornamos la promesa
        return catalogItem.update({
          familyDescrip: descripcionFamilia
        });
      }
    });

    // Esperamos a que todas las actualizaciones terminen en paralelo
    await Promise.all(promesasActualizacion);

    res.status(200).json({ // Cambiado a 200 porque es una actualización (PUT/PATCH implícito), 201 es para creación.
      message: 'Updated'
    });
    
  } catch (error) {
    console.log("Error en updateFamily:", error);
    /* next(error); */
  }
};

const updateImg = async (req, res, next) => {
  try {

    const directorioOrigen = '\\\\192.168.4.237\\aplicativoComercial'; 

    console.log('Iniciando lectura de archivos y actualización de base de datos...');

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
                        const product = await CatalogService.findOne(ref);
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
                        const product = await CatalogService.findOne(ref);
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

    res.status(200).json({ // Cambiado a 200 porque es una actualización (PUT/PATCH implícito), 201 es para creación.
      message: 'Updated'
    });
    
  } catch (error) {
    console.log("Error en updateFamily:", error);
    /* next(error); */
  }
};

const verifyImgProduct = async (req, res, next) => {
  const { archivo } = req.params;

  if (!archivo) {
    console.log('faltan archivos')
    return res.status(400).send('Faltan parámetros');
  }

  const videoPath = path.join('\\\\192.168.4.237\\aplicativoComercial', archivo);

  fs.stat(videoPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.sendStatus(404);
      /* return res.status(500).json({ ok: false, mensaje: 'Archivo no encontrado' }); */
    }else{
      res.sendFile(videoPath);
    }
  })
};

module.exports = {
  findAllProducts,
  compareAllProducts,
  findOneProduct,
  createProduct,
  create2,
  updateProduct,
  updateProd2,
  updateFamily,
  updateImg,
  verifyImgProduct,
};
