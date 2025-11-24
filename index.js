//Dependencias
var express = require('express');
var bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let cors = require('cors');

//Importacion del modelo
let modelo = require('./modelo.js');


//Inicio de los endpoints
var app = express();

app.use(cors({origin: '*'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res){

    modelo.inicio('Gabriela',function(err,filas){

        if(err){
            return res.status(500).json({error:'Ocurrio un error'});
        }
        else
        {
            res.json(filas)
        }

    });

})

app.post('/verificar', function(req,res){
    var email = req.body.email;
    var pass =  req.body.pass;

    modelo.verificar(email,pass,function(err,filas){
        if(err){
            return res.status(500).json({error:'Ocurrio un error'});
        }
        else
        {
            res.json(filas);
        }
    });
})

app.post('/enviarEmail', function(req,res){
    var email = req.body.email;
    var token = req.body.token;

    modelo.enviarEmail(email,token, function(err,filas){
        if(err){
            return res.status(500).json({error:'Ocurrio un error'});
        }
        else
        {
            res.json(filas);
        }
    });
})

app.get('/confirmar',function(req,res){
    var token = req.query.token;

    jwt.verify(token,'clavetoken2025',function(err,data){
        if(err){
            return res.json({status: "ERROR", MENSAJE: "Token no valido"});
        }
        else
        {
            return res.json({status: "OK", MENSAJE: "Token valido"});
        }
    })
})

//Puerto de conexion de la API
app.listen(3000,() => {
    console.log('Servidor corriendo en el puerto 3000');
})