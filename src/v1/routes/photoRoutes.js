const CatalogService= require('../../services/catalogService')
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '\\\\192.168.4.237\\aplicativoComercial'); // Ruta personalizada
  },
  filename: (req, file, cb) => {
    const filename = req.body.name || 'evidence';
    cb(null, `${filename}.webm`);
  }
});

/* const upload = multer({ storage }); */
const upload = multer({ limits: { fileSize: 1024 * 1024 * 500 } ,  dest: 'uploads/' });

router.post('/', upload.array('evidence', 4), async (req, res) => {
  console.log('entro a la ruta');
  const tipo = req.body.tipo;
  const id = req.body.id;

  console.log(`tipo: ${tipo} - id: ${id}`);

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No se recibió ningún archivo');
  }

  const ruta = `\\\\192.168.4.237\\aplicativoComercial`
  /* const inputPath = req.file.path;
  const outputFileName = `${id}-${tipo}.jpg`
  const outputPath = path.join(ruta, outputFileName) */

  try {
    //crear el directorio si no esta o utilizar el que ya esta
    if (!fs.existsSync(ruta)) {
        console.log('se crea la carpeta');
        fs.mkdirSync(ruta, { recursive: true });
    }

    console.log('la carpeta ya esta creada');

    for (const archivo of req.files) {
      const inputPath = archivo.path; // Ruta temporal local en uploads/
      const nombreOriginal = archivo.originalname; // Ej: "1008_EMP.jpg"

      // Extraemos el id y el tipo usando split('_') basándonos en cómo lo enviamos desde React
      // "1008_EMP.jpg" -> quita el .jpg -> "1008_EMP" -> separa por "_" -> ["1008", "EMP"]
      const nombreSinExtension = path.parse(nombreOriginal).name;
      const [id, tipo] = nombreSinExtension.split('-');

      if (!id || !tipo) {
        console.log(`[ALERTA] Archivo con formato inválido omitido: ${nombreOriginal}`);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        continue; // Salta al siguiente archivo si el nombre no cumple la regla
      }

      console.log(`Procesando archivo -> ID: ${id} | Tipo: ${tipo}`);

      // Definimos el nombre final que tendrá en la red local (Volvemos a usar el guion normal si prefieres)
      const outputFileName = `${id}-${tipo}.jpg`;
      const outputPath = path.join(ruta, outputFileName);

      // Copiamos a la red y borramos el temporal local
      fs.copyFileSync(inputPath, outputPath);
      fs.unlinkSync(inputPath);
      
      console.log(`Guardado con éxito: ${outputFileName}`);
      var change;

      if(tipo === 'EMP'){
        change = {
            imgProduct: 1
        }
      } else if(tipo === 'EMB'){
        change = {
            imgPacking: 1
        }
      } else if(tipo === 'PRES'){
        change = {
            imgPresentation: 1
        }
      } else if(tipo === 'BAR'){
        change = {
            imgBarcode: 1
        }
      }
      CatalogService.update2(id, change)
      .then(()=>{
        res.status(200).send('Foto subido y guardado correctamente');
      })
      .catch(()=>{
        res.status(500)
      })
    }

    /* fs.copyFileSync(inputPath, outputPath);
    fs.unlinkSync(inputPath); */

    console.log('archivo guardado');

  } catch (err) {
    console.error('Error general:', err);
    // ⚠️ Limpieza de emergencia si se captura un error
    fs.unlink(inputPath, () => {});
    console.log(err)
    res.status(500).send('Error al procesar el video');
  }
});

module.exports=router
