const express=require('express');
const bodyParser = require('body-parser');
const mysql=require('mysql');
const cors=require('cors');
const app=express();
const bcrypt = require("bcrypt");
const jwt=require('jwt-simple');
const moment= require('moment');

app.use(cors());

function authApi(app){
  const router = express.Router();
  app.use('/api/', router);

app.use(bodyParser.json());


//establecer parametros de conexion
 const conn  = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : '',
 database : 'company',

})


const TOKEN_KEY='Token-Auth';

// //conexion de mostrar si esta conectada
conn.connect((err) =>{
   if(err) throw err;
   console.log('Mysql Connected...');
 });


  
const getUsuarioByEmail = (correo) => {
  return new Promise((resolve,reject)=>{
  conn.query(`SELECT * FROM usuarios WHERE email= ?`,[correo],(err,results)=>{

    if(err) reject (err)
    resolve(results[0])
    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    // console.log(results)
      });
  });
};

//mostrar datos completos
router.post('/login',async(req, res) => {
    //busca al usuario por su correo
    
    const usuario=await getUsuarioByEmail (req.body.email); 
    console.log(req.body.password);
    //si no encuentra a un usuario
    if(usuario === undefined){
        res.send(JSON.stringify({"status": 404, "error": null, "response": "usuario o contraseña valida"}));
    }else{
        

      //  const equals=await bcrypt.compareSync(req.body.password.toString(), usuario.password.toString());
      //   console.log(equals)

        if(req.body.password.toString()!= usuario.password.toString()){
        // if(!equals){
          res.json({ 
            "status": 404,
            error:'Error,email y contraseña not found'
        });

        }else{
          res.json({
            "status": 200,
            usuario:usuario,
            token:createToken(usuario),
            err:'login correcto'
           });
           
        }
    }
  

  });


  //token
  const createToken=(usuario)=>{
   
    let logueado = {
        email:usuario.email,
        createdAt:moment().unix(),
        expiresAt:moment().add(1,"day").unix()
    }
    return jwt.encode(logueado,TOKEN_KEY);
  }



   




  //mostrar un solo dato
  router.post('/register',async (req, res) => {

    return new Promise((resolve,reject)=>{
   // req.body.password =bcrypt.hashSync(req.body.password.toString(), 10);
    
    let body = {
        nombre: req.body.nombre, 
        email: req.body.email,
        password: req.body.password,
        idrol: req.body.idrol
        
    }

    console.log(body)

    let sql = "INSERT INTO usuarios SET ?";
    let query =conn.query(sql, body,(err, results) => {
      if(err) reject (err)
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  })
  });

  


  //mostrar un solo dato
  router.get('/rol', (req, res) => {
    let sql = "SELECT * FROM roles";
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    });
  });

  
  
}
module.exports = authApi;


