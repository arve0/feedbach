/*
 * Module dependencies.
 */
var express     = require('express'),
    server      = express(),
    http        = require('http').createServer(server),
    path        = require('path'),
    RedisStore  = require('connect-redis')(express),
    mongoose    = require('mongoose'),
    // validate([method], [arg1], [arg2] ... )
    validate    = require('mongoose-validator').validate
    io          = require('socket.io').listen(http),
    cookie      = require('cookie'),
    connect     = require('connect'),
    extend      = require('node.extend');


/*
 * Environments
 */
server.set('port', process.env.PORT || 3000);
server.set('views', __dirname + '/views');
server.set('view engine', 'jade');
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.bodyParser());
server.use(express.methodOverride());
//server.use(server.router);
server.use(express.static(path.join(__dirname, 'app')));
// vote client
server.use('/vote/', express.static(__dirname + '/vote-client'));
// cookies and sessions
var cookieSecret = 'super secret';
server.use(express.cookieParser());
server.use(express.session({ 
  secret: cookieSecret,
  // http://en.wikipedia.org/wiki/Year_2038_problem
  cookie: { expires: new Date(( Math.pow(2,31) - 1 )*1000) },
  store: new RedisStore({ host: 'localhost' })
})); 
// errorHandler
server.use(express.errorHandler());


/*
 * Mongoose database
 */
mongoose.connect('mongodb://localhost/feedbach');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


/*
 * Mongoose validate functions
 */
var minQuestions = function(array) { // min 1 questions
  return (0 < array.length);
}
var maxQuestions = function(array) { // max 6 questions
  return (7 > array.length);
}
var validateQuestionArray = [
  { validator: minQuestions, msg: 'Too few questions, min: 1' },
  { validator: maxQuestions, msg: 'Too many questions, max: 6' }
];
var minAnswers = function(array) { // min 2 answers
  return (1 < array.length);
}
var maxAnswers = function(array) { // max 4 answers
  return (5 > array.length);
} 
var validateAnswerArray = [
  { validator: minAnswers, msg: 'Too few answers, min: 2' },
  { validator: maxAnswers, msg: 'Too many answers, max: 4' }
];
var minVotes = function(array) { // min 1 vote, TODO: nescessary when array required?
  return (0 < array.length);
}
var maxVotes = function(array) {
  return (7 > array.length);
}
var validateVoteArray = [
  { validator: minVotes, msg: 'Too few votes, min: 1' },
  { validator: maxVotes, msg: 'Too many votes, max: 6' }
];


/*
 * Mongoose schemas
 */
var Answer          = new Schema({
  answer    : { type: String, required: true, validate: validate('len', 1, 100) },
  votes     : { type: Number, min: 0 }
});
var Question        = new Schema({
  question  : { type: String, required: true, validate: validate('len', 1, 100) },
  answers   : { type: [Answer] , validate: validateAnswerArray }
});
var SurveySchema    = new Schema({
  id          : { 
    type: String,
    index: true,
    unique: true,
    required: true,
    validate: validate('len', 1, 20) 
  },
  description : { type: String, validate: validate('len', 0, 100) },
  questions   : { type: [Question], validate: validateQuestionArray },
  owner       : { type: String, index: true, required: true },
  totalVotes  : { type: Number, min: 0 }
});
var FeedbackSchema  = new Schema({
    id        : { type: String, required: true, validate: validate('len', 1, 100) },
    sessionID : { type: String, required: true },
    votes     : { type: [Number], min: 0, max: 3, validate: validateVoteArray }
  })
  // prevent several votes from same sessionID to same survey
  .index({id: 1, sessionID: 1}, {unique: true});


/*
 * Mongoose middleware
 */
FeedbackSchema.pre('save', function(next, done){
  var feedback = this;
  Survey.findOne({id: feedback.id}, function(err, survey){
    if (err) next(err);
    if (!survey) {
      feedback.invalidate('id', 'Survey does not exists.');
      done('Survey must exists to vote.');
    }
    else if (feedback.votes.length != survey.questions.length)
      next(new Error('votes length != survey.questions length'));
    else {
      if (survey.totalVotes == undefined) survey.totalVotes = 0;
      survey.totalVotes++;
      for (var i=0; i < feedback.votes.length; i++) {
        if (survey.questions[i].answers[feedback.votes[i]].votes == undefined) survey.questions[i].answers[feedback.votes[i]].votes = 0;
        survey.questions[i].answers[feedback.votes[i]].votes++;
        console.log('votes for ' + i + ' is now ' + survey.questions[i].answers[feedback.votes[i]].votes);
      }
      survey.save(function(err){
        if (err) next(err);
        else {
          liveUpdate(survey, feedback);
          next();
        }
      });
    }
  });
});


/*
 * Mongoose models
 */
var Survey    = mongoose.model('Survey', SurveySchema);
var Feedback  = mongoose.model('Feedback', FeedbackSchema);


/*
 * Routes
 */

/* REST survey */
server.get('/survey/', function(req, res, next){
  // prevent cache
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  Survey.find({ owner: req.sessionID }, function(err, doc){
    if (err) next(err);
    else {
      console.log('id:' + doc.id);
      res.send(200, doc);
    }
  })
});
server.get('/survey/:id', function(req, res, next){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  Survey.findOne({ id: req.params.id }, function(err, doc){
    if (err) next(err);
    if (doc) {
      if (doc.owner == req.sessionID) {
        doc.owner = true; // dont send sessionID unencrypted
        res.send(200, doc); // always send doc to owner
      }
      else {
        doc.owner = undefined; // we can use this for routing
        for (var i = 0; i < doc.questions.length; i++){ // delete votes (avoid cheating)
          for (var j = 0; j < doc.questions[i].answers.length; j++){
            doc.questions[i].answers[j].votes = undefined;
          }
        }
        Feedback.findOne({ id: req.params.id, sessionID: req.sessionID }, function (err, vote){
          if (err) next(err);
          if (vote) res.send(403, 'Already voted.');
          else res.send(200, doc);
        })
      }
    }
    else res.send(404, 'Not found.');
  });
});
server.post('/survey/', function(req, res, next){
  req.body.owner = req.sessionID;
  console.log('creating: '); //TODO
  console.log(JSON.stringify(req.body, null, 2)); //TODO 
  new Survey(req.body).save(function(err){
    if (err) next(err);
    else {
      console.log('saved to mongo!'); //TODO
      res.send('OK');
    }
  });
});
server.delete('/survey/:id', function(req, res, next){
  Survey.findOne({ id: req.params.id, owner: req.sessionID }, function(err, doc){
    if (err) next(err);
    if (doc) {
      Feedback.remove({id: req.params.id}, function(err){
        if (err) next(err);
        res.send(200, 'Removed');
      });
    }
    else res.send(401, 'Not authorized.');
  })
  .remove();
});

/* REST feedback */
server.post('/feedback/', function(req, res, next){
  req.body.sessionID = req.sessionID;
  console.log('voting: '); // TODO
  console.log(JSON.stringify(req.body, null, 2)); // TODO
  Feedback.findOne({id: req.body.id, sessionID: req.sessionID}, function(err, doc){
    if (err) next(err);
    if (doc) next(new Error('Double vote?')); // avoid several vote from same session
    else {
      new Feedback(req.body).save(function(err){
        if (err) next(err);
        else {
          console.log('saved to mongo!'); //TODO
          res.send('OK');
        }
      });
    }
  });
});
server.delete('/feedback/:id', function(req, res, next){
  Survey.findOne({ id: req.params.id, owner: req.sessionID }, function(err, doc){
    if (err) next(err);
    if (doc) {
      for (var i = 0; i < doc.questions.length; i++){ // delete votes
        for (var j = 0; j < doc.questions[i].answers.length; j++){
          doc.questions[i].answers[j].votes = 0;
        }
      }
      doc.totalVotes = 0;
      Feedback.remove({id: req.params.id}, function(err){
        if (err) next(err);
        doc.save(function(err){
          if (err) next(err);
          res.send(200, 'Removed feedback');
        });
      });
    }
    else res.send(401, 'Not authorized.');
  })
});

/* redirect url - old, now in nginx
server.get('/:id', function(req, res, next){
  Survey.findOne({ id: req.params.id }, function(err, doc){
    if (err) next(err);
    else {
      if (doc)  res.redirect('/vote/#/' + req.params.id);        // redirect to angular vote route
      else      res.redirect('/#/create/' + req.params.id); // redirect to angular create route
    }
  });
});
*/


http.listen(server.get('port'), function(){
  console.log('Express server listening on port ' + server.get('port'));
});

/**
 * Socket.io
 */
//http://howtonode.org/socket-io-auth
io.set('authorization', function (handshakeData, accept) {
  if (handshakeData.headers.cookie) {
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
    handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['connect.sid'], cookieSecret);
    if (handshakeData.cookie['connect.sid'] == handshakeData.sessionID) {
      return accept('Cookie is invalid.', false);
    }
  } 
  else {
    return accept('No cookie transmitted.', false);
  } 
  accept(null, true);
});

io.sockets.on('connection', function (socket) {
  console.log('client connected with session:' + socket.handshake.sessionID);//TODO
  console.log('requesting id:' + socket.handshake.query.id);//TODO
  socket.on('msg', function(data){
    console.log(data);
  });
});

var liveUpdate = function(survey, feedback){
  io.sockets.clients().forEach(function (socket) {
    if(socket.handshake.sessionID == survey.owner 
        && socket.handshake.query.id == survey.id) {
      socket.emit('update', feedback);
    }
  });
}
