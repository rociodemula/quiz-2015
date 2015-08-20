var models = require('../models/models.js');

//Variable de debug. Solo se activa si estamos en modo local. Es decir, utilizando SQLite
var debug  = process.env.DATABASE_URL.substring(0, 6);
if (debug === "sqlite") debug = true;
else debug = false;
exports.debug = debug;

//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
};

//GET /login - formulario de login
exports.new = function(req, res){
  if (debug) console.log("session_controller.js: Running exports.new");
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login -- Crear la sesion
exports.create = function(req, res){
  if (debug) console.log("session_controller.js: Running exports.create");
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    if (error) {//si hay error retornaremos mensajes de error de sesión
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      return;
    }
    //Crear req.session.user y guardar campos id y username
    //La sesión se define por la existencia de: req.session.user
    req.session.user = {id:user.id, username:user.username};

    // Inicializamos la variable temporal de la sesión
    req.session.sessionTime = new Date();
    if (debug) console.log("session_controller.js: Initialization session at " + req.session.sessionTime);

    res.redirect(req.session.redir.toString());//redirección a path anterior y login
  });  
};

//DELETE /logout -- Destruir sesion
exports.destroy = function(req, res){
  if (debug) console.log("session_controller.js: Running exports.destroy");

  // Eliminamos la sesión
  delete req.session.user;
  delete req.session.sessionTime;
  res.redirect(req.session.redir.toString()); //redirect a path anterior a login
};
