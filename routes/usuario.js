const express=require('express');
const bodyParser = require('body-parser');
const mysql=require('mysql');
const cors=require('cors');
const app=express();

app.use(cors());

function usuariosApi(app){
  const router = express.Router();
  app.use('/api/', router);



app.use(bodyParser.json());







//establecer parametros de conexion
 const conn  = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : '',
 database : 'company'
})

// //conexion de mostrar si esta conectada
conn.connect((err) =>{
   if(err) throw err;
   console.log('Mysql Connected...');
 });

//mostrar datos completos
router.get('/usuarios',(req, res) => {
    let sql = "SELECT * FROM usuarios";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
//mostrar datos completos
router.get('/pacientes',(req, res) => {
    let sql = "SELECT * FROM usuarios WHERE idrol=1";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });
   
//obtner usuario por email
  const getUsuarioByEamil = (correo) => {
    let sql = "SELECT * FROM usuarios WHERE email="+correo;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  };

  
  //mostrar un solo dato
  router.get('/usuarios/:id',(req, res) => {
    let sql = "SELECT * FROM usuarios WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


//agregar datos
router.post('/usuarios',(req, res) => {
    let data = 
    {
    nombre: req.body.nombre, 
    email: req.body.email,
    password: req.body.password
    };
    let sql = "INSERT INTO usuarios SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });


//actualizar una id de los datos de usuario
router.put('/usuarios/:id',(req, res) => {
    let sql = "UPDATE usuarios SET nombre='"+req.body.nombre+"', email='"+req.body.email+"',password='"+req.body.password+"' WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

//eliminar usuario
router.delete('/usuarios/:id',(req, res) => {
    let sql = "DELETE FROM usuarios WHERE id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  });

}
module.exports = usuariosApi;

// //establecer parametros de servidores
// const puerto=process.env.PUERTO || 3000;
// app.listen(puerto,function(){
//     console.log("servicio OK"+puerto);
// })
