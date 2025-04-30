const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jwt-simple');
const moment = require('moment');

app.use(cors());

function citacionmedicasApi(app) {
  const Router = express.Router();
  app.use('/api/', Router);

  app.use(bodyParser.json());


  //establecer parametros de conexion
  const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company',

  })

  // //conexion de mostrar si esta conectada
  conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
  });

  //mostrar un citacionmedica
  Router.get('/citacionmedica', (req, res) => {
    // let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,p.nombre nombrepaciente,m.direccion,p.ciudad FROM citacionmedica c,medico m,paciente p where c.id_paciente=p.idpaciente and c.id_medico=m.idmedicos ";
    let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada FROM citacionmedica c,medico m where c.id_medico=m.idmedicos";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //mostrar un citacionmedica
  Router.get('/citacionmedica/disponibles', (req, res) => {
    let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada FROM citacionmedica c,medico m where c.id_medico=m.idmedicos and c.aceptada=0";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //mostrar un solo dato
  Router.get('/citacionmedica/:id', (req, res) => {
    let sql = "SELECT * FROM citacionmedica WHERE id=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //mostrar un solo dato
  Router.get('/citacionmedica/historial/:id', (req, res) => {
    let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada FROM citacionmedica c,medico m,citas_paciente cp where cp.id_citamedica=c.id and c.id_medico=m.idmedicos and c.fecha<CURDATE() and cp.id_paciente=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //mostrar un solo dato
  Router.get('/citacionmedica/pendientes/:id', (req, res) => {
    let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada FROM citacionmedica c,medico m,citas_paciente cp where cp.id_citamedica=c.id and c.id_medico=m.idmedicos and c.fecha>CURDATE() and cp.id_paciente=" + req.params.id;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });


  //buscar dato por su nombre
  Router.post('/citacionmedica/buscar', (req, res) => {
    let sql = "SELECT c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada  FROM citacionmedica c,medico m WHERE c.id_medico=m.idmedicos and m.area LIKE '%" + req.body.nombre + "%'";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //agregar datos
  Router.post('/citacionmedica', (req, res) => {
    let data =
    {
      id_medico: req.body.id_medico,
      fecha: req.body.fecha,
      estado: 1,
      hora: req.body.hora,
      lugar: req.body.lugar,
      direccion: req.body.direccion,
      aceptada: 0
    };
    console.log(data);
    let sql = "INSERT INTO citacionmedica SET ?";
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });


  //agregar datos
  Router.post('/citacionmedica/reporte', (req, res) => {
    let data =
    {
      fechacita: req.body.fecha,
      pago: req.body.pago,
      costo: req.body.costo,
      estado: req.body.estado,
      idmedico: req.body.id_medico,
      idpaciente: req.body.id_paciente
    };
    console.log(data);
    let sql = "INSERT INTO reportes SET ?";
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });


  //agregar datos
  Router.post('/citacionmedica/reportes', (req, res) => {
    let data =
    {
      id_medico: req.body.id_medico,
      id_paciente: req.body.id_paciente,
      fecha: req.body.fecha
    };

    let sql = "SELECT u.nombre,u.id idPaciente ,m.idmedicos idMedico, c.id,c.estado,c.fecha,c.hora,m.nombre nombremedico,m.area,c.lugar,c.direccion ,c.aceptada FROM usuarios u, citacionmedica c,medico m,citas_paciente cp where u.id=cp.id_paciente and cp.id_citamedica=c.id and c.id_medico=m.idmedicos and c.fecha='" + data.fecha + "' and m.idmedicos='" + data.id_medico + "' and cp.id_paciente='" + data.id_paciente + "'";
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  //agregar datos
  Router.post('/citacionmedica/agendar', (req, res) => {
    let data =
    {
      id_citamedica: req.body.id_cita,
      id_paciente: req.body.id_paciente
    };
    console.log(data);
    let sql = "INSERT INTO citas_paciente SET ?";
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      let sql2 = "UPDATE citacionmedica SET aceptada='" + 1 + "' WHERE id='" + data.id_citamedica + "'";
      let query2 = conn.query(sql2, (err, results) => {
        if (err) throw err;
        // res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      });

    });
  });

  //actualizar una id de los datos de usuario
  Router.put('/citacionmedica/:id', (req, res) => {
    let sql = "UPDATE citacionmedica SET fecha='" + req.body.fecha + "', estado='" + req.body.estado + "', hora='" + req.body.hora + "', id_medico='" + req.body.id_medico + "', lugar='" + req.body.lugar + "',direccion='" + req.body.direccion + "' WHERE id =" + req.params.id + ";";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });


  //eliminar citacionmedica
  Router.delete('/citacionmedica/:id', (req, res) => {
    let sql = "DELETE FROM citacionmedica WHERE id=" + req.params.id + "";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });






}



module.exports = citacionmedicasApi;


