const port =
    process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.VCAP_APP_PORT ||
    process.env.PORT ||
    process.argv[2] ||
    8080;

import { peers } from "./src/config/peers";


var express  = require('express');
var app      = express();                               
var bodyParser = require('body-parser');    
var cors = require('cors');
 
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(cors());
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
app.use(express.static('www'));
app.set('port', port);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});