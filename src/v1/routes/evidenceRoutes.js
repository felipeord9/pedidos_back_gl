const ClientsPosService = require('../../services/clientsPosService')
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/locales/'); // Ruta personalizada
  },
  filename: (req, file, cb) => {
    const filename = req.body.name || 'evidence';
    cb(null, `${filename}.jpg`);
  }
});

/* const upload = multer({ storage }); */
const upload = multer({ limits: { fileSize: 1024 * 1024 * 500 } ,  dest: 'uploads/' });

router.post('/', upload.single('evidence'), (req, res) => {
  console.log('entro a la ruta');
  const id = req.body.id;
  const name = req.body.name;

  console.log(`id: ${id} - name: ${name}`);

  if (!req.file) {
    return res.status(400).send('No se recibió ningún archivo');
  }

  const ruta = `/locales`
  const inputPath = req.file.path;
  const outputFileName = `local_${id}.jpg`;

  const outputPath = path.join(ruta, outputFileName)
  /* const outputPath = inputPath.replace('.webm', '.mp4'); */

  try {
    //crear el directorio si no esta o utilizar el que ya esta
    if (!fs.existsSync(ruta)) {
        console.log('se crea la carpeta');
        fs.mkdirSync(ruta, { recursive: true });
    }

    console.log('la carpeta ya esta creada');
    fs.renameSync(inputPath, outputPath);
    //fs.unlinkSync(inputPath); // Elimina el archivo .webm temporal
    console.log('archivo guardado');
    const change = {
        fotoLocal: true
    }
    ClientsPosService.update(id, change)
    .then(()=>{
        res.status(200).send('Foto subido y guardado correctamente');
    })
    .catch(()=>{
        res.status(500)
    })
  } catch (err) {
    console.error('Error general:', err);
    // ⚠️ Limpieza de emergencia si se captura un error
    fs.unlink(inputPath, () => {});
    console.log(err)
    res.status(500).send('Error al procesar el video');
  }
});

// GET único video
router.get('/file', (req, res) => {
  const { folder, filename } = req.query;

  console.log(`si llegaron los parametros`)

  if (!folder || !filename) {
    return res.status(400).send('Faltan parámetros');
  }

  const safeFolder = path.basename(folder); // evita rutas maliciosas
  const safeFilename = path.basename(filename);
  const videoPath = path.join('/locales', folder, filename);

  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Video no encontrado');
    }
    res.sendFile(videoPath);
  });
});

router.get('/obtener-archivo/:archivo', (req, res) => {
  const { archivo } = req.params;

  console.log(archivo)

  if (!archivo) {
    console.log('faltan archivos')
    return res.status(400).send('Faltan parámetros');
  }

  const videoPath = path.join('C:/locales', archivo);

  /* fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Video no encontrado');
    }
    res.sendFile(videoPath);
  }); */
  fs.stat(videoPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.sendStatus(404);
      /* return res.status(500).json({ ok: false, mensaje: 'Archivo no encontrado' }); */
    }else{
      res.sendFile(videoPath);
    }

  });
});

router.put('/renombrar/archivo/:nombreActual/:nuevoNombre', (req, res) => {
  const { nombreActual, nuevoNombre } = req.params;
  const carpeta = 'C:/locales';

  console.log(`actual: ${nombreActual} - nuevo: ${nuevoNombre}`)

  // Ruta completa del archivo actual y nuevo
  const rutaActual = path.join(carpeta, nombreActual);
  const rutaNueva = path.join(carpeta, nuevoNombre);

  // Verificamos si existe el archivo actual
  fs.access(rutaActual, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('Archivo no encontrado:', nombreActual);
      return res.status(500).json({ ok: false, mensaje: 'Archivo no encontrado' });
    }

    // Renombrar archivo
    fs.rename(rutaActual, rutaNueva, (err) => {
      if (err) {
        console.error('Error al renombrar el archivo:', err);
        return res.status(500).json({ ok: false, mensaje: 'Error al renombrar el archivo' });
      }

      console.log(`Archivo renombrado: ${nombreActual} → ${nuevoNombre}`);
      return res.json({ ok: true, mensaje: 'Archivo renombrado correctamente' });
    });
  });
});

const FILES_DIR = '/locales'

router.get('/consult/evidence/:archivo', (req, res) => {
  const { archivo } = req.params;

  if (!archivo) {
    console.log('faltan archivos')
    return res.status(400).send('Faltan parámetros');
  }

  const videoPath = path.join('C:/locales', `${archivo}.jpg`);

  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Video no encontrado');
    }
    res.sendFile(videoPath);
  });
});

router.use('/videos', express.static('/locales'));

module.exports=router
