const express=require('express');
const bodyParser = require('body-parser');
const mysql=require('mysql');
const cors=require('cors');
const app=express();
const bcrypt = require("bcrypt");
const jwt=require('jwt-simple');
const moment= require('moment');

app.use(cors());

function PacientesApi(app){
  const Router = express.Router();
  app.use('/api/', Router);

app.use(bodyParser.json());


//establecer parametros de conexion
 const conn  = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : '',
 database : 'company',

})

// //conexion de mostrar si esta conectada
conn.connect((err) =>{
   if(err) throw err;
   console.log('Mysql Connected...');
 });

 //mostrar un paciente
Router.get('/paciente',(req, res) => {
    let sql = "SELECT * FROM paciente";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      console.log(sql)
    });
  });
  
//mostrar un solo dato
Router.get('/paciente/:id',(req, res) => {
    let sql = "SELECT * FROM paciente WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//agregar datos
Router.post('/paciente',(req, res) => {
    let data = 
    {
        nombre:req.body.nombre, 
        apellido:req.body.apellido,
        direccion:req.body.direccion,
        email:req.body.email,
        ciudad:req.body.ciudad,
        fechanac:req.body.fechanac,
        telefono:req.body.telefono,
        cedula:req.body.cedula,
    };
    let sql = "INSERT INTO paciente SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//actualizar una id de los datos de usuario
Router.put('/paciente/:id',(req, res) => {


        let sql = "UPDATE paciente SET nombre='"+req.body.nombre+"',apellido='"+req.body.apellido+"',email='"+req.body.email+"' WHERE id="+req.params.id;
        let query = conn.query(sql, (err, results) => {
            if(err) throw err;
              res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          });
        });


//eliminar paciente
Router.delete('/paciente/:id',(req, res) => {
    let sql = "DELETE FROM paciente WHERE id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


}


module.exports = PacientesApi;


