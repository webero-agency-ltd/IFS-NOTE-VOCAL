var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');

var port = 3700;
var app = express();
var path = require('path') ; 

app.set('views', path.join(__dirname, '/tpl'));

app.set('view enginer','ejs')

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.render('index');
});

app.listen(port);

console.log('server open on port ' + port);

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {


  	var url_string = require('url').parse( "http://www.example.com/t.html"+client._socket.upgradeReq.url,true).query;  
	var nameFile = url_string.nameFile ;
  	console.log('new connection---',url_string );

	if(!nameFile) return ; 

	nameFile +='.wav'; 

	console.log( '---NAME FILE' , nameFile ) ;

  	var fileWriter = new wav.FileWriter(nameFile, {
    	channels: 1,
    	sampleRate: 48000,
    	bitDepth: 16
  	});

  	client.on('stream', function(stream, meta) {
    	console.log('new stream');
    	stream.pipe(fileWriter);

	    stream.on('end', function() {
	      	fileWriter.end();
	      	console.log('wrote to file ' + nameFile);
	    });
  	});

  	client.on('remove', function(data, meta) {
		
		console.log('-- REMOVE CETTE FICHER CLIENT: ' , data, meta );
    	 
  	});


});