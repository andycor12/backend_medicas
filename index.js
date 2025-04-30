const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql=require('mysql');
const cors=require('cors');
const usuariosApi = require('./routes/usuario.js');
const authApi = require('./routes/auth.js');
const PacientesApi = require('./routes/pacientes.js');
const citacionmedicasApi = require('./routes/citasMedicas');


app.use(cors());


app.use(bodyParser.json());
app.use(express.json());
authApi(app);
usuariosApi(app);
PacientesApi(app);
citacionmedicasApi(app);



//establecer parametros de servidores
const puerto=process.env.PUERTO || 3000;
app.listen(puerto,function(){
    console.log("servicio OK"+puerto);
})
