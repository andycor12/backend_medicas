const express=require('express');
const bodyParser = require('body-parser');
const mysql=require('mysql');
const cors=require('cors');
const app=express();


app.use(bodyParser.json());
app.use(cors());


//establecer parametros de conexion
const conn  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'company'
})

//conexion de mostrar si esta conectada
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });

//mostrar datos completos
app.get('/api/usuarios',(req, res) => {
    let sql = "SELECT * FROM usuarios";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
   
  //mostrar un solo dato
  app.get('/api/usuarios/:id',(req, res) => {
    let sql = "SELECT * FROM usuarios WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


//agregar datos
app.post('/api/usuarios',(req, res) => {
    let data = 
    {
    nombre: req.body.nombre, 
    email: req.body.email,
    contraseña: req.body.contraseña
    };
    let sql = "INSERT INTO usuarios SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


//actualizar una id de los datos de usuario
app.put('/api/usuarios/:id',(req, res) => {
    let sql = "UPDATE usuarios SET nombre='"+req.body.nombre+"', email='"+req.body.email+"',contraseña='"+req.body.contraseña+"' WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//eliminar usuario
app.delete('/api/usuarios/:id',(req, res) => {
    let sql = "DELETE FROM usuarios WHERE id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


//establecer parametros de servidores
const puerto=process.env.PUERTO || 3000;
app.listen(puerto,function(){
    console.log("servicio OK"+puerto);
})
