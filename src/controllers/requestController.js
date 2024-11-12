const RequestService = require('../services/requestService')
const mailService = require("../services/mailService");
const { config } = require("../config/config");
const { models } = require("../libs/sequelize");
const nodemailer = require("nodemailer")
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const fsExtra = require('fs-extra');

const findAllRequest = async(req,res,next)=>{
    try{
        const data=await RequestService.find()

        res.status(200).json({
            message:'OK',
            data
        })
    } catch(error){
        console.log(error)
        next(error)
    }
}

const findAllRequestBySeller = async(req,res,next)=>{
  try{
    const { params: { id } } = req;
    const data=await RequestService.findBySeller(id)

    res.status(200).json({
      message:'OK',
      data
    })
  } catch(error){
    console.log(error)
    next(error)
  }
}

const findAllRequestByCreater = async(req,res,next)=>{
  try{
    const { params: { name } } = req;
    const data=await RequestService.findByCreater(name)

    res.status(200).json({
      message:'OK',
      data
    })
  } catch(error){
    console.log(error)
    next(error)
  }
}

const findAllRequestByEmail = async(req,res,next)=>{
  try{
    const { params: { email } } = req;
    console.log(email)
    const data=await RequestService.findByEmail(email)

    res.status(200).json({
      message:'OK',
      data
    })
  } catch(error){
    console.log(error)
    next(error)
  }
}

const findAllpro = async(req,res,next)=>{
  try{
      const data=await RequestService.findPRo()

      res.status(200).json({
          message:'OK',
          data
      })
  } catch(error){
      console.log(error)
      next(error)
  }
}

const findAllProductsByRequest = async(req,res,next)=>{
  try{
    const { params: { id } } = req;
    console.log(id)
      const data = await RequestService.findProducts(id)
      /* console.log(JSON.stringify(data)) */
      res.status(200).json({
          message:'OK',
          data
      })
  } catch(error){
      console.log(error)
      next(error)
  }
}

const findOneRequest = async (req, res, next) => {
    try {
      const { params: { id } } = req;
      const data = await RequestService.findOne(id);
  
      res.status(200).json({
        message: 'OK',
        data
      })
    } catch (error) {
      next(error)
    }
};

const findOneItem = async (req, res, next) => {
  try {
    const { params: { id } } = req;
    const data = await RequestService.findOneItem(id);

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
};

const findAllItemsofRequest = async (req, res, next) => {
  try {
    const { params: { requestId } } = req;
    const data = await RequestService.findAllItemsofRequest(requestId);

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
};

const createRequest = async (req,res,next)=>{
    try{
        const { body } = req
        console.log(JSON.stringify(body.productosAgr.agregados))
        const data = await RequestService.create({
            install: body.install,
            nitClient: body.nitClient,
            nameClient: body.nameClient,
            branchClient: body.branchClient,
            destination: body.destination,
            emisor: body.emisor,
            total: Number(body.productosAgr.total.split('.').join('')),
            state: body.state,
            observations: body.observations,
            createdAt: body.createdAt,
            createdBy: body.createdBy,
        })

        for(let product of body.productosAgr.agregados) {
          await RequestService.addItem({
            amount: product.amount,
            cost: Number(product.costo[0]),
            price: Number(product.price[0]),
            priceAuth: Number(product.priceAuth.split(',').join('')),
            requestId: data.id,
            currentMargen: product.currentMargen,
            newMargen: product.newMargen,
            productId: product.id
          })
        }

        res.status(201).json({
            message:'Created',
            data
        })
    }
    catch(error){
        console.log(error)
        next(error)
    }
}

const sendMail = async (req, res, next) => {
    try {
      const { body } = req
      const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            * {
            font-size: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            thead {
              background-color: #d6d6d6;
              color: #000;
            }
            tbody {
              display: block;
              min-height: 100vh;
            }
            tr {
              display: table;
              width: 100%;
              table-layout: fixed;
  
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nueva Solicitud</title>
        </head>
        <body>
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              padding: 1rem 2rem;
            "
          >
            <h1 style="text-align: center; font-size: 18px; font-weight: bold">Solicitud Autorización de Precio</h1>
            <div style="position: relative; font-size: 12px; width: 100%; height: 100%;">
              <div style="margin: auto; margin-bottom: 15px;">
                <h2 style="font-size: 12px; font-weight: bolder; margin: 0">
                  EL GRAN LANGOSTINO S.A.S.
                </h2>
                <p style="margin: 0.3rem 0;font-size: 12px;"><strong style='font-size: 10px;'>Nit: 835001216</strong></p>
                <p style="margin: 0.3rem 0;font-size: 10px;;">Tel: 5584982 - 3155228124</p>
              </div>
            </div>
            <hr style="width: 100%; border: 1.5px solid black;"/>
            <div style="width: 100%; font-size: 13px; margin-top: 10px;">
              <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px; ">
                  <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">CLIENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nombre: </strong>${
                      body.nameClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nit: </strong>${
                      body.nitClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Sucursal: </strong>${
                      body.branchClient
                    }</p>
                  </div>
                </div>
                <div style="position: absolute; top: 0; right: 0; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px;">
                  <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">REMITENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Instalación: </strong>${
                      body.install
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Enviado por: </strong>${
                      body.createdBy
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; white-space: nowrap; font-size: 10px;">Fecha Envío:</strong>${
                      new Date(body.createdAt).toLocaleDateString()} - ${new Date(body.createdAt).toLocaleTimeString()
                    }</p>
                  </div>
                </div>
              </div>
              <div style="width: 100%;">
                <table style="width: 100%; font-size: 12px; border: 1px solid black; ">
                  <thead>
                    <tr>
                      <th style="width: 25px; font-size: 10px;">REF.</th>
                      <th colspan="2" style='font-size: 10px;'>DESCRIPCION</th>
                      <th style="width: 50px; font-size: 10px;">CANTIDAD</th>
                      <th style="width: 25px; font-size: 10px;">UM</th>
                      <th style='font-size: 10px;'>COSTO PROMEDIO</th>
                      <th style='font-size: 10px;'>PRECIO DE LISTA</th>
                      <th style='font-size: 10px;'>MARGEN ACTUAL</th>
                      <th style='font-size: 10px;'>PRECIO POR AUTORIZAR</th>
                      <th style='font-size: 10px;'>NUEVO MARGEN</th>
                      </tr>
                  </thead>
                  <tbody>
                  ${body.productosAgr.agregados.map((elem) => {
                    return `
                    <tr>
                      <td style="width: 25px; font-size: 10px;">${elem.id}</td>
                      <td colspan="2" style='font-size: 10px;'>${elem.description}</td>
                      <td style="width: 50px; font-size: 10px;">${elem.amount}</td>
                      <td style="width: 25px; font-size: 10px;">${elem.um}</td>
                      <td style='font-size: 10px;'>$${elem.cost.toLocaleString()}</td>
                      <td style='font-size: 10px;'>$${elem.price.toLocaleString()}</td>
                      <td style='font-size: 10px;'>${elem.currentMargen}%</td>
                      <td style='font-size: 10px;'>$${elem.priceAuth}</td>
                      <td style='font-size: 10px;'>${elem.newMargen}%</td>
                      </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; height: auto; padding: 1rem; margin-top: 14px;">
                <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">OBSERVACIONES:</h3>
                <div>
                  <p style="margin: 0; padding: 1rem; font-size: 11px;">
                    ${body.observations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;
      mailService.generatePDF(html, (error, pdfBuffer) => {
        if (error) {
          return res.status(400).json({
            status: "ERROR",
            error,
          });
        }        
        const transporter = nodemailer.createTransport({
          host: config.smtpHost,
            port: config.smtpPort,
            secure: true,
            auth: {
              user: config.smtpEmail,
              pass: config.smtpPassword
            }
        });
  
        const attachments = [
          {
            filename: `Solicitud de precio.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          }
        ];
        const mensaje={
            from: config.smtpEmail,
            to: body.destination,
            cc: 'precios1@granlangostino.net, jefedecostos@granlangostino.net',
            subject: "¡NUEVA SOLICITUD DE PRECIO!",
            attachments,
            html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                  href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                  rel="stylesheet"
                />
                <title>SOLICITUD DE PRECIO</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                    padding: 0;
                  }
            
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                  }
            
                  .header {
                    background-color: #f03c3c;
                    padding: 5px;
                    text-align: center;
                  }
            
                  .header h1 {
                    color: #fff;
                    font-size: medium;
                    margin: 0;
                  }
            
                  .invoice-details {
                    margin-top: 20px;
                  }
            
                  .invoice-details p {
                    margin: 0;
                  }
            
                  .logo {
                    text-align: right;
                  }
            
                  .logo img {
                    max-width: 200px;
                  }
            
                  .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                  }
            
                  .invoice-table th,
                  .invoice-table td {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: center;
                  }
            
                  .invoice-table th {
                    background-color: #f1f1f1;
                  }
            
                  .warning {
                    text-align: center;
                    margin-top: 20px;
                  }
            
                  .warning p {
                    margin: 0;
                  }
            
                  .att {
                    text-align: center;
                    margin-top: 20px;
                  }
            
                  .att p {
                    margin: 0;
                  }
            
                  .att a {
                    text-decoration: none;
                  }
            
                  .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>¡NUEVA SOLICITUD DE PRECIO!</h1>
                  </div>
            
                  <p>Se ha generado una nueva solicitud de autorización de precio</p>
            
                  <div class="warning">
                    <b>Para visualizar la información Ingresa aquí ${config.requestUrl}</b>                  
                    <p><strong>Por favor revisar los archivos antes de cualquier acción.</strong></p>
                  </div>
            
                  <div class="att">
                    <p>Cordialmente,</p>
                    <p>
                      EL GRAN LANGOSTINO S.A.S <br>
                      Línea Nacional 018000 180133 <br>
                      Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                      <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                    </p>
                  </div>
            
                  <div class="footer">
                    <p><u>Aviso Legal</u></p>
                    <p>
                      SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                      DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                      SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                      AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                      correo electrónico y todos los archivos adjuntos a éste contienen
                      información de carácter confidencial y/o uso privativo de EL GRAN
                      LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                      por error, por favor elimínelo y comuníquese con el remitente para
                      informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                      copia de la información ahí contenida, gracias. En caso contrario
                      podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                    </p>
                  </div>
                </div>
              </body>
            </html>
            
            `}
            transporter.sendMail(mensaje,(error,info)=> {
              if(error){
                res.json({
                  error,
                });
              } else {
                res.json({
                  info,
                });
                console.log('Correo enviado a:'+info.response)
              }
            })
            /* transporter.sendMail(mensaje, (error,info)=>{
              if (error) {
                return console.log('Error al enviar el correo al cliente:', error);
              }
              console.log('Correo electrónico enviado:', info.response);
            }) */      
        });
      res.status(200)
      } catch (error) {
      console.log(error);
      next(error)
    }
  };

/* Cuando se edita uno por uno los productos de la solicutud y dice que se actualizó */
  const sendAnswer = async (req, res, next) => {
    try {
      const { body } = req

      const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            * {
            font-size: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            thead {
              background-color: #d6d6d6;
              color: #000;
            }
            tbody {
              display: block;
              min-height: 100vh;
            }
            tr {
              display: table;
              width: 100%;
              table-layout: fixed;
  
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nueva Solicitud</title>
        </head>
        <body>
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              padding: 1rem 2rem;
            "
          >
            <h1 style="text-align: center; font-size: 18px; font-weight: bold">Solicitud Autorización de Precio</h1>
            <div style="position: relative; font-size: 12px; width: 100%; height: 100%;">
              <div style="margin: auto; margin-bottom: 15px;">
                <h2 style="font-size: 12px; font-weight: bolder; margin: 0">
                  EL GRAN LANGOSTINO S.A.S.
                </h2>
                <p style="margin: 0.3rem 0;font-size: 12px;"><strong style='font-size: 10px;'>Nit: 835001216</strong></p>
                <p style="margin: 0.3rem 0;font-size: 10px;;">Tel: 5584982 - 3155228124</p>
              </div>
            </div>
            <hr style="width: 100%; border: 1.5px solid black;"/>
            <div style="width: 100%; font-size: 13px; margin-top: 10px;">
              <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px; ">
                  <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">CLIENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nombre: </strong>${
                      body.nameClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nit: </strong>${
                      body.nitClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Sucursal: </strong>${
                      body.branchClient
                    }</p>
                  </div>
                </div>
                <div style="position: absolute; top: 0; right: 0; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px;">
                  <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">REMITENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Instalación: </strong>${
                      body.install
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Enviado por: </strong>${
                      body.createdBy
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; white-space: nowrap; font-size: 10px;">Fecha Envío:</strong>${
                      new Date(body.createdAt).toLocaleDateString()} - ${new Date(body.createdAt).toLocaleTimeString()
                    }</p>
                  </div>
                </div>
              </div>
              <div style="width: 100%;">
                <table style="width: 100%; font-size: 12px; border: 1px solid black; ">
                  <thead>
                    <tr>
                      <th style="width: 25px; font-size: 10px;">REF.</th>
                      <th colspan="2" style='font-size: 10px;'>DESCRIPCION</th>
                      <th style="width: 50px; font-size: 10px;">CANTIDAD</th>
                      <th style="width: 25px; font-size: 10px;">UM</th>
                      <th style='font-size: 10px;'>COSTO PROMEDIO</th>
                      <th style='font-size: 10px;'>PRECIO DE LISTA</th>
                      <th style='font-size: 10px;'>MARGEN ACTUAL</th>
                      <th style='font-size: 10px;'>PRECIO POR AUTORIZAR</th>
                      <th style='font-size: 10px;'>NUEVO MARGEN</th>
                      <th style='font-size: 10px;'>ESTADO</th>
                      </tr>
                  </thead>
                  <tbody>
                  ${body.items.map((elem) => {
                    return `
                    <tr>
                      <td style="width: 25px; font-size: 10px;">${elem.id}</td>
                      <td colspan="2" style='font-size: 10px;'>${elem.description}</td>
                      <td style="width: 50px; font-size: 10px;">${elem.RequestProduct.amount}</td>
                      <td style="width: 25px; font-size: 10px;">${elem.um}</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.cost.toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.price.toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.currentMargen}%</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.priceAuth}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.newMargen}%</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.state ? (elem.RequestProduct.state).toUpperCase() : ''}</td>
                      </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; height: auto; padding: 1rem; margin-top: 14px;">
                <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">OBSERVACIONES:</h3>
                <div>
                  <p style="margin: 0; padding: 1rem; font-size: 11px;">
                    ${body.observations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;
      mailService.generatePDF(html, (error, pdfBuffer) => {
        if (error) {
          return res.status(400).json({
            status: "ERROR",
            error,
          });
        }
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
          port: config.smtpPort,
          secure: true,
          auth: {
            user: config.smtpEmail,
            pass: config.smtpPassword
          }
      });
      const attachments = [
        {
          filename: `Solicitud de precio.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        }
      ];
        const mensaje={
            from: config.smtpEmail,
            to: body.emisor,
            cc: 'precios1@granlangostino.net, jefedecostos@granlangostino.net',
            subject: "¡RESPUESTA A SOLICITUD DE PRECIO!",
            attachments,
            html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                  href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                  rel="stylesheet"
                />
                <title>RESPUESTA A SOLICITUD</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                    padding: 0;
                  }
            
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                  }
            
                  .header {
                    background-color: #f03c3c;
                    padding: 5px;
                    text-align: center;
                  }
            
                  .header h1 {
                    color: #fff;
                    font-size: medium;
                    margin: 0;
                  }
            
                  .invoice-details {
                    margin-top: 20px;
                  }
            
                  .invoice-details p {
                    margin: 0;
                  }
            
                  .logo {
                    text-align: right;
                  }
            
                  .logo img {
                    max-width: 200px;
                  }
            
                  .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                  }
            
                  .invoice-table th,
                  .invoice-table td {
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: center;
                  }
            
                  .invoice-table th {
                    background-color: #f1f1f1;
                  }
            
                  .warning {
                    text-align: center;
                    margin-top: 20px;
                  }
            
                  .warning p {
                    margin: 0;
                  }
            
                  .att {
                    text-align: center;
                    margin-top: 20px;
                  }
            
                  .att p {
                    margin: 0;
                  }
            
                  .att a {
                    text-decoration: none;
                  }
            
                  .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>¡RESPUESTA A TU SOLICITUD DE PRECIO!</h1>
                  </div>
            
                  <p>Se ha actualizado tu solicitud de precios que enviaste el día: ${new Date(body.createdAt).toLocaleDateString()}, para el cliente: ${body.nameClient}, de NIT: ${body.nitClient} </p>
            
                  <div class="warning">
                    <b>Para visualizar la información Ingresa aquí ${config.requestUrl}</b>                  
                  </div>
                  <div class="att">
                    <p>Cordialmente,</p>
                    <p>
                      EL GRAN LANGOSTINO S.A.S <br>
                      Línea Nacional 018000 180133 <br>
                      Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                      <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                    </p>
                  </div>
            
                  <div class="footer">
                    <p><u>Aviso Legal</u></p>
                    <p>
                      SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                      DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                      SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                      AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                      correo electrónico y todos los archivos adjuntos a éste contienen
                      información de carácter confidencial y/o uso privativo de EL GRAN
                      LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                      por error, por favor elimínelo y comuníquese con el remitente para
                      informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                      copia de la información ahí contenida, gracias. En caso contrario
                      podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                    </p>
                  </div>
                </div>
              </body>
            </html>
            
            `}
              transporter.sendMail(mensaje,(error,info)=> {
                if(error){
                  res.json({
                    error,
                  });
                } else {
                  res.json({
                    info,
                  });
                  console.log('Correo enviado a:'+info.response)
                }
              })     
        }); 
      res.status(200)
      } catch (error) {
      console.log(error);
      next(error)
    }
  };

/* Cuando se Aprueban todos los productos desde el boton del modal */
const sendConfirm = async (req, res, next) => {
  try {
    const { body } = req
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            * {
            font-size: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            thead {
              background-color: #d6d6d6;
              color: #000;
            }
            tbody {
              display: block;
              min-height: 100vh;
            }
            tr {
              display: table;
              width: 100%;
              table-layout: fixed;
  
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nueva Solicitud</title>
        </head>
        <body>
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              padding: 1rem 2rem;
            "
          >
            <h1 style="text-align: center; font-size: 18px; font-weight: bold">Solicitud Autorización de Precio</h1>
            <div style="position: relative; font-size: 12px; width: 100%; height: 100%;">
              <div style="margin: auto; margin-bottom: 15px;">
                <h2 style="font-size: 12px; font-weight: bolder; margin: 0">
                  EL GRAN LANGOSTINO S.A.S.
                </h2>
                <p style="margin: 0.3rem 0;font-size: 12px;"><strong style='font-size: 10px;'>Nit: 835001216</strong></p>
                <p style="margin: 0.3rem 0;font-size: 10px;;">Tel: 5584982 - 3155228124</p>
              </div>
            </div>
            <hr style="width: 100%; border: 1.5px solid black;"/>
            <div style="width: 100%; font-size: 13px; margin-top: 10px;">
              <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px; ">
                  <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">CLIENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nombre: </strong>${
                      body.nameClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nit: </strong>${
                      body.nitClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Sucursal: </strong>${
                      body.branchClient
                    }</p>
                  </div>
                </div>
                <div style="position: absolute; top: 0; right: 0; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px;">
                  <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">REMITENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Instalación: </strong>${
                      body.install
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Enviado por: </strong>${
                      body.createdBy
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; white-space: nowrap; font-size: 10px;">Fecha Envío:</strong>${
                      new Date(body.createdAt).toLocaleDateString()} - ${new Date(body.createdAt).toLocaleTimeString()
                    }</p>
                  </div>
                </div>
              </div>
              <div style="width: 100%;">
                <table style="width: 100%; font-size: 12px; border: 1px solid black; ">
                  <thead>
                    <tr>
                      <th style="width: 25px; font-size: 10px;">REF.</th>
                      <th colspan="2" style='font-size: 10px;'>DESCRIPCION</th>
                      <th style="width: 50px; font-size: 10px;">CANTIDAD</th>
                      <th style="width: 25px; font-size: 10px;">UM</th>
                      <th style='font-size: 10px;'>COSTO PROMEDIO</th>
                      <th style='font-size: 10px;'>PRECIO DE LISTA</th>
                      <th style='font-size: 10px;'>MARGEN ACTUAL</th>
                      <th style='font-size: 10px;'>PRECIO POR AUTORIZAR</th>
                      <th style='font-size: 10px;'>NUEVO MARGEN</th>
                      <th style='font-size: 10px;'>ESTADO</th>
                      </tr>
                  </thead>
                  <tbody>
                  ${body.items.map((elem) => {
                    return `
                    <tr>
                      <td style="width: 25px; font-size: 10px;">${elem.id}</td>
                      <td colspan="2" style='font-size: 10px;'>${elem.description}</td>
                      <td style="width: 50px; font-size: 10px;">${elem.RequestProduct.amount}</td>
                      <td style="width: 25px; font-size: 10px;">${elem.um}</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.cost.toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.price.toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.currentMargen}%</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.priceAuth}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.newMargen}%</td>
                      <td style='font-size: 10px;'>APROBADO</td>
                      </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; height: auto; padding: 1rem; margin-top: 14px;">
                <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">OBSERVACIONES:</h3>
                <div>
                  <p style="margin: 0; padding: 1rem; font-size: 11px;">
                    ${body.observations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;
    mailService.generatePDF(html, (error, pdfBuffer) => {
      if (error) {
        return res.status(400).json({
          status: "ERROR",
          error,
        });
      }
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
        port: config.smtpPort,
        secure: true,
        auth: {
          user: config.smtpEmail,
          pass: config.smtpPassword
        }
    });
    const attachments = [
      {
        filename: `Solicitud de precio.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      }
    ];
      const mensaje={
          from: config.smtpEmail,
          to: body.emisor,
          cc: 'precios1@granlangostino.net, jefedecostos@granlangostino.net',
          subject: "¡RESPUESTA A SOLICITUD DE PRECIO!",
          attachments,
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <title>RESPUESTA A SOLICITUD</title>
              <style>
                body {
                  font-family: Arial, sans-serif;;
                  line-height: 1.5;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
          
                .header {
                  background-color: #f03c3c;
                  padding: 5px;
                  text-align: center;
                }
          
                .header h1 {
                  color: #fff;
                  font-size: medium;
                  margin: 0;
                }
          
                .invoice-details {
                  margin-top: 20px;
                }
          
                .invoice-details p {
                  margin: 0;
                }
          
                .logo {
                  text-align: right;
                }
          
                .logo img {
                  max-width: 200px;
                }
          
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
          
                .invoice-table th,
                .invoice-table td {
                  padding: 10px;
                  border: 1px solid #ccc;
                  text-align: center;
                }
          
                .invoice-table th {
                  background-color: #f1f1f1;
                }
          
                .warning {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .warning p {
                  margin: 0;
                }
          
                .att {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .att p {
                  margin: 0;
                }
          
                .att a {
                  text-decoration: none;
                }
          
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡RESPUESTA A TU SOLICITUD DE PRECIO!</h1>
                </div>
          
                <p>Se ha aprobado tu solicitud de precios que enviaste el dia: ${new Date(body.createdAt).toLocaleDateString()}, para el cliente: ${body.nameClient}, de NIT: ${body.nitClient} </p>
          
                <div class="warning">
                  <b>Para visualizar la información Ingresa aquí ${config.requestUrl}</b>                  
                </div>
                <div class="att">
                  <p>Cordialmente,</p>
                  <p>
                    EL GRAN LANGOSTINO S.A.S <br>
                    Línea Nacional 018000 180133 <br>
                    Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                    <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                  </p>
                </div>
          
                <div class="footer">
                  <p><u>Aviso Legal</u></p>
                  <p>
                    SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                    DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                    SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                    AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                    correo electrónico y todos los archivos adjuntos a éste contienen
                    información de carácter confidencial y/o uso privativo de EL GRAN
                    LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                    por error, por favor elimínelo y comuníquese con el remitente para
                    informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                    copia de la información ahí contenida, gracias. En caso contrario
                    podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                  </p>
                </div>
              </div>
            </body>
          </html>
          
          `}
          transporter.sendMail(mensaje,(error,info)=> {
            if(error){
              res.json({
                error,
              });
            } else {
              res.json({
                info,
              });
              console.log('Correo enviado a:'+info.response)
            }
          })
          /* transporter.sendMail(mensaje, (error,info)=>{
            if (error) {
              return console.log('Error al enviar el correo al cliente:', error);
            }
            console.log('Correo electrónico enviado:', info.response);
          }) */ 
        });     
    res.status(200)
    } catch (error) {
    console.log(error);
    next(error)
  }
};

/* Cuando se rechazan todos los productos desde el modal */
const sendRechazo = async (req, res, next) => {
  try {
    const { body } = req
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            * {
            font-size: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            thead {
              background-color: #d6d6d6;
              color: #000;
            }
            tbody {
              display: block;
              min-height: 100vh;
            }
            tr {
              display: table;
              width: 100%;
              table-layout: fixed;
  
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nueva Solicitud</title>
        </head>
        <body>
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              padding: 1rem 2rem;
            "
          >
            <h1 style="text-align: center; font-size: 18px; font-weight: bold">Solicitud Autorización de Precio</h1>
            <div style="position: relative; font-size: 12px; width: 100%; height: 100%;">
              <div style="margin: auto; margin-bottom: 15px;">
                <h2 style="font-size: 12px; font-weight: bolder; margin: 0">
                  EL GRAN LANGOSTINO S.A.S.
                </h2>
                <p style="margin: 0.3rem 0;font-size: 12px;"><strong style='font-size: 10px;'>Nit: 835001216</strong></p>
                <p style="margin: 0.3rem 0;font-size: 10px;;">Tel: 5584982 - 3155228124</p>
              </div>
            </div>
            <hr style="width: 100%; border: 1.5px solid black;"/>
            <div style="width: 100%; font-size: 13px; margin-top: 10px;">
              <div style="position: relative; margin-bottom: 2rem;">
                <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px; ">
                  <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">CLIENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nombre: </strong>${
                      body.nameClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Nit: </strong>${
                      body.nitClient
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Sucursal: </strong>${
                      body.branchClient
                    }</p>
                  </div>
                </div>
                <div style="position: absolute; top: 0; right: 0; border: 1px solid black; border-radius: 5px; width: 47%; padding: 1rem; font-size: 12px;">
                  <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 11px;">REMITENTE</h3>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Instalación: </strong>${
                      body.install
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; font-size: 10px;">Enviado por: </strong>${
                      body.createdBy
                    }</p>
                  </div>
                  <div>
                    <p style="margin: 0; width: 100%; font-size: 10px;"><strong style="margin-right: 0.5rem; white-space: nowrap; font-size: 10px;">Fecha Envío:</strong>${
                      new Date(body.createdAt).toLocaleDateString()} - ${new Date(body.createdAt).toLocaleTimeString()
                    }</p>
                  </div>
                </div>
              </div>
              <div style="width: 100%;">
                <table style="width: 100%; font-size: 12px; border: 1px solid black; ">
                  <thead>
                    <tr>
                      <th style="width: 25px; font-size: 10px;">REF.</th>
                      <th colspan="2" style='font-size: 10px;'>DESCRIPCION</th>
                      <th style="width: 50px; font-size: 10px;">CANTIDAD</th>
                      <th style="width: 25px; font-size: 10px;">UM</th>
                      <th style='font-size: 10px;'>COSTO PROMEDIO</th>
                      <th style='font-size: 10px;'>PRECIO DE LISTA</th>
                      <th style='font-size: 10px;'>MARGEN ACTUAL</th>
                      <th style='font-size: 10px;'>PRECIO POR AUTORIZAR</th>
                      <th style='font-size: 10px;'>NUEVO MARGEN</th>
                      <th style='font-size: 10px;'>ESTADO</th>
                      </tr>
                  </thead>
                  <tbody>
                  ${body.items.map((elem) => {
                    return `
                    <tr>
                      <td style="width: 25px; font-size: 10px;">${elem.id}</td>
                      <td colspan="2" style='font-size: 10px;'>${elem.description}</td>
                      <td style="width: 50px; font-size: 10px;">${elem.RequestProduct.amount}</td>
                      <td style="width: 25px; font-size: 10px;">${elem.um}</td>
                      <td style='font-size: 10px;'>$${(elem.RequestProduct.cost).toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>$${(elem.RequestProduct.price).toLocaleString('es-ES')}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.currentMargen}%</td>
                      <td style='font-size: 10px;'>$${elem.RequestProduct.priceAuth}</td>
                      <td style='font-size: 10px;'>${elem.RequestProduct.newMargen}%</td>
                      <td style='font-size: 10px;'>RECHAZADO</td>
                      </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; height: auto; padding: 1rem; margin-top: 14px;">
                <h3 style="background: #fff; font-size: 10px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">OBSERVACIONES:</h3>
                <div>
                  <p style="margin: 0; padding: 1rem; font-size: 11px;">
                    ${body.observations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;
    mailService.generatePDF(html, (error, pdfBuffer) => {
      if (error) {
        return res.status(400).json({
          status: "ERROR",
          error,
        });
      }
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
        port: config.smtpPort,
        secure: true,
        auth: {
          user: config.smtpEmail,
          pass: config.smtpPassword
        }
    });
    const attachments = [
      {
        filename: `Solicitud de precio.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      }
    ];
      const mensaje={
          from: config.smtpEmail,
          to: body.emisor,
          cc: 'precios1@granlangostino.net, jefedecostos@granlangostino.net',
          subject: "¡RESPUESTA A SOLICITUD DE PRECIO!",
          attachments,
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <title>RESPUESTA A SOLICITUD</title>
              <style>
                body {
                  font-family: Arial, sans-serif;;
                  line-height: 1.5;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
          
                .header {
                  background-color: #f03c3c;
                  padding: 5px;
                  text-align: center;
                }
          
                .header h1 {
                  color: #fff;
                  font-size: medium;
                  margin: 0;
                }
          
                .invoice-details {
                  margin-top: 20px;
                }
          
                .invoice-details p {
                  margin: 0;
                }
          
                .logo {
                  text-align: right;
                }
          
                .logo img {
                  max-width: 200px;
                }
          
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
          
                .invoice-table th,
                .invoice-table td {
                  padding: 10px;
                  border: 1px solid #ccc;
                  text-align: center;
                }
          
                .invoice-table th {
                  background-color: #f1f1f1;
                }
          
                .warning {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .warning p {
                  margin: 0;
                }
          
                .att {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .att p {
                  margin: 0;
                }
          
                .att a {
                  text-decoration: none;
                }
          
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡RESPUESTA A TU SOLICITUD DE PRECIO!</h1>
                </div>
          
                <p>Se ha rechazado tu solicitud de precios que enviaste el dia: ${new Date(body.createdAt).toLocaleDateString()}, para el cliente: ${body.nameClient}, de NIT: ${body.nitClient} </p>
          
                <div class="warning">
                  <b>Para visualizar la información Ingresa aquí ${config.requestUrl}</b>                  
                </div>
                <div class="att">
                  <p>Cordialmente,</p>
                  <p>
                    EL GRAN LANGOSTINO S.A.S <br>
                    Línea Nacional 018000 180133 <br>
                    Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                    <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                  </p>
                </div>
          
                <div class="footer">
                  <p><u>Aviso Legal</u></p>
                  <p>
                    SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                    DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                    SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                    AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                    correo electrónico y todos los archivos adjuntos a éste contienen
                    información de carácter confidencial y/o uso privativo de EL GRAN
                    LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                    por error, por favor elimínelo y comuníquese con el remitente para
                    informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                    copia de la información ahí contenida, gracias. En caso contrario
                    podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                  </p>
                </div>
              </div>
            </body>
          </html>
          
          `}
          transporter.sendMail(mensaje,(error,info)=> {
            if(error){
              res.json({
                error,
              });
            } else {
              res.json({
                info,
              });
              console.log('Correo enviado a:'+info.response)
            }
          })  
        });    
      res.status(200)
    } catch (error) {
    console.log(error);
    next(error)
  }
};

const updateRequest = async (req, res, next) => {
  try{
    const { body, params: { id }} = req
    const data = await RequestService.update(id, body)
    res.status(200).json({
      message: "Updated",
      data
    })
  }catch (error) {
    next(error)
    console.log(error)
  }
}

const updateItem = async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const data = await RequestService.updateOneItem(id, body)
  
    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    next(error)
  }
}

const updateItemsofRequest = async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const Items = await RequestService.findAllItemsofRequest(id)
    
    for (let item of Items){
      await item.update(body)
    }  
    const data = await RequestService.findAllItemsofRequest(id)
    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
    findAllRequest,
    findAllRequestBySeller,
    findAllRequestByEmail,
    findAllRequestByCreater,
    findOneRequest,
    findAllpro,
    findAllItemsofRequest,
    findOneItem,
    findAllProductsByRequest,
    createRequest,
    sendMail,
    sendAnswer,
    sendConfirm,
    sendRechazo,
    updateRequest,
    updateItem,
    updateItemsofRequest,
}