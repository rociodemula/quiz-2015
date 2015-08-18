var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req, res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req, res){
  var comment = models.Comment.build(
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId
    });
  
  comment
  .validate()
  .then(
    function(err){
      if(err){
        res.render('comments/new.ejs', 
          {comment: comment, 
            quizid: req.params.quizId,
            errors: err.errors});
      }else{
        //guarda en DB los campos pregunta y respuesta de quiz
        comment
        .save()
        .then(function(){
          res.redirect('/quizes/'+req.params.quizId);
        }) //Redirección HTTP (URL relativo) lista de preguntas
      }
    }
  )
  .catch(function(error){next(error)});  
};
