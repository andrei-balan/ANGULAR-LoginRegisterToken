"use strict";
let express=require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
var https = require('https');
let cors = require("cors");
let mongoFunctions = require("./mongoFunctions");
let tokenAdministration = require("./tokenAdministration");
let app = express();
let port = 8888;
var fileKey = fs.readFileSync('keys/privateKey.pem');
var fileCert = fs.readFileSync('keys/certificate.pem');
let bcrypt = require("bcrypt");

var httpsServer = https.createServer({
    "key": fileKey,
    "cert": fileCert
}, app);


httpsServer.listen(port, function (){
    console.log("Server avviato sulla porta: " + port);
});

// ---------- MIDDLEWARE -------------
// Intercetta parametri passati in formato url-encoded
app.use(bodyParser.urlencoded({extended:true}));
// Intercetta parametri passati in formato json
app.use(bodyParser.json());
app.use(cors());

app.get("/",function (req,res){
    res.send("Server funzionante"); 
});

app.use(function (req,res,next){
    let d=new Date();
    console.log(d.toLocaleTimeString() + " >>> " + req.method + ": " + req.originalUrl);
    if(Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if(Object.keys(req.body).length != 0)
        console.log("Parametri POST: " + JSON.stringify(req.body));
    next();
});

app.post("/api/login",function (req,res){
    
    let query = {user:req.body.username};
    mongoFunctions.findLogin(req,"users","users",query,function (err,data){
        if(err.codeErr == -1){
            console.log("Login OK");
            console.log(data);
            tokenAdministration.createToken(data);
            res.send({msg:"Login OK",token:tokenAdministration.token});
        }else
            error(req,res,err);
    });
});
app.post("/api/register",function (req,res){
    //cripto la password con bycrypt
    

    let user = {
        user:req.body.username,
        pwd:req.body.password,
        email:req.body.email
    };
    mongoFunctions.inserisci("users","users",user,function (err,data){
        if(err.codeErr == -1){
            res.send({msg:"User added successfully"});
        }else
            error(req,res,err);
    });
});


app.get("/api/getStudents",function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, payload => {
        if(!payload.err_exp){   // token ok
            mongoFunctions.find("studenti","studenti",{},function (err,data){
                if(err.codeErr == -1){
                    tokenAdministration.createToken(payload);
                    res.send({data:data,token:tokenAdministration.token});
                }else
                    error(req,res,err);
            });
        }else{
            console.log(payload.message);
            error(req,res,{codeErr:403,message:payload.message});
        }
    });
});

app.post("/api/addStudent", function (req, res) {
    let student = {
        nome: req.body.nome,
        cognome: req.body.cognome
    };
    console.log(student);
    mongoFunctions.inserisci("studenti", "studenti", student, function (err, data) {
        if (err.codeErr == -1) {
            res.send({ msg: "Student added successfully" });
        } else {
            error(req, res, err);
        }
    });
});
app.get("/api/getStudentsByName", function (req, res) {
    let nome = req.query.nome;
    let cognome = req.query.cognome;
    let query = { nome: nome, cognome: cognome };
    mongoFunctions.find("studenti", "studenti", query, function (err, data) {
        if (err.codeErr == -1) {
            console.log("Student found");
            res.send({ data: data });
        } else {
            console.log("Student not found" + err.message);
            error(req, res, err);
        }
    });
});

app.post("/api/loginCookie",function (req,res){
    let query = {user:req.body.username};
    mongoFunctions.findLogin(req,"users","users",query,function (err,data){
        if(err.codeErr == -1){
            console.log("Login OK");
            console.log(data);
            tokenAdministration.createToken(data);
            res.cookie("token",tokenAdministration.token,{maxAge:600000,secure:true,httpOnly:true});
            res.send({msg:"Login OK"});
        }else
            error(req,res,err);
    });
});
app.get("/api/getStudentsCookie",function (req,res){
    tokenAdministration.ctrlToken(req, (errToken)=> {
        if(errToken.codeErr == -1){   // token ok
            mongoFunctions.find("studenti","studenti",{},function (err,data){
                if(err.codeErr == -1){
                    tokenAdministration.createToken(tokenAdministration.payload);
                    res.cookie("token",tokenAdministration.token,{maxAge:600000,secure:true,httpOnly:true}); 



                    
                    res.send({data:data});
                }else
                    error(req,res,err);
            });
        }else{
            console.log(errToken.message);
            error(req,res,errToken);
        }
    });
});

function error(req,res,err){
    res.status(err.codeErr).send(err.message);
}