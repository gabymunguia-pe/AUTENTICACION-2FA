//Dependencias
let mysql = require('mysql');
let jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');


//Inicio del modelo
let modelo = {};

//Configuracion de BD

let hostDB = 'localhost';
let userDB = 'root';
let passBD = '';
let databaseBD = 'autenticacion';

modelo.inicio = function(nombre,callback){
    callback(null,{nombre: nombre, status: 'Conectado'});
}

modelo.verificar = function(email,pass,callback){
    var conexion = mysql.createConnection({
        host: hostDB,
        user: userDB,
        password: passBD,
        database: databaseBD
    });

    conexion.connect((err)=>{
        if(err) throw err;
    });

    if (conexion) {
        var consulta = "SELECT * FROM users WHERE email = '"+ email + "' and password = '" + pass + "'";
        conexion.query(consulta,function(err,filas){

            if(err){
                console.log(err);
            }
            else
            {
                if(filas.length >= 1)
                {
                    var token =jwt.sign({email: email},'clavetoken2025');
                    callback(null,{status:"OK",datos:filas,mensaje:"Usuario encontrado", token: token});
                }
                else
                {
                    callback(null,{status:"OK",datos:null,mensaje:"Usuario NO encontrado"});
                }
            }
        })
    }
    conexion.end((err)=>{});
}

modelo.enviarEmail = function(email,token,callback){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'spekgabrimp@gmail.com',
            pass: 'xpha mhun dcvc ydpo'
        }
    });

    //set up de los datos que va a recibir
    let mailOptions = {
        from: 'GABRIELA', 
        to: email,
        subject: 'Confirmacion de cuenta',
        text:"Has click en la siguiente liga para confirmar tu cuenta: http://localhost:3000/confirmar?token=" + token
    };

    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            console.log("correo no enviado correctamente");
            callback(null,{status: "ERROR", mensaje: "Correo no enviado"});
        }
        else{
            console.log("Correo enviado");
            callback(null,{status: "OK", mensaje: "Correo enviado"});
        }
    });
} 


module.exports = modelo;