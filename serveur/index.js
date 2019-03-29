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


// Add headers
app.use(function (req, res, next) {
	
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	
	res.setHeader('Access-Control-Allow-Credentials', true);

   	next();

});

app.get('/', function(req, res){
	res.render('index');
});

//enregistré le document enregistré 
app.get('/save', function(req, res){
	
	if ( req.query.filename ) {
		//enregistrement du fichier 
		var file = path.join( __dirname,'./listes.json' ) ; 

		var liste = [] ; 

		if ( fs.existsSync( file ) ) {

			var i = fs.readFileSync( file ).toString(); 
			liste = JSON.parse(i) ;
		}

		console.log( liste );

		liste = liste.map((e) => {
      		return e.file == req.query.filename ? {...e, save : true } : { ...e }
      	})
      	
      	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;
		//liste.forEatch()

	}
	res.json({success:true}) ; 

});


app.get('/delete', function(req, res){
	
	if ( req.query.filename ) {
		 
		var file = path.join( __dirname,'./listes.json' ) ; 

		var liste = [] ; 

		if ( fs.existsSync( file ) ) {

			var i = fs.readFileSync( file ).toString(); 
			liste = JSON.parse(i) ;
		}

		liste = liste.filter((e) => {
      		return e.file == req.query.filename.trim() +'.wav' ? false : true ; 
      	})

		console.log( liste ,req.query.filename  );
      	
      	let file_delete = path.join(__dirname, '/notes/') + req.query.filename.trim() +'.wav' ; 

      	if ( fs.existsSync( file_delete ) ) {

      		fs.unlink( file_delete , function (err) {
		    	if (err) throw err;
		    	console.log('delete file') ; 
		    });  

      	}

      	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

	}

	res.json({success:true}) ; 

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

	var closeFile = false ; 

	var realpahtFile = path.join(__dirname, '/notes/') + nameFile ; 
	console.log( '---NAME FILE' , realpahtFile ) ;

	//ajoute dans le data json
	
	var file = path.join( __dirname,'./listes.json' ) ; 
	var liste = [] ; 

	if ( fs.existsSync( file ) ) {

		var i = fs.readFileSync( file ).toString(); 
		liste = JSON.parse(i) ;
	}
		
	liste.push({ file : nameFile , save : false })

	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

  	var fileWriter = new wav.FileWriter( realpahtFile , {
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

	      	liste = liste.map((e) => {
	      		return e.file == nameFile ? {...e, save : true } : { ...e }
	      	})
	      	
	      	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

	    });
  	
  	});

  	client.on('close', function() {
		
		//suprime le fichier audio s'i nes pas cloture correctement 
		let soundNonSave = liste.filter((e) => {
      		return (e.file == nameFile && e.save == false) ? true : false ; 
      	});

      	console.log( '**** : ' , soundNonSave.length  );

    	if ( soundNonSave.length ) {
    		
    		fileWriter.end();

    		setTimeout(()=>{
    			fs.unlink( realpahtFile , function (err) {
			    	
			    	if (err) throw err;
			    	liste = liste.filter((e) => {
			      		return e.file == nameFile ? false : true ; 
			      	})
			      	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

				});  
    		}, 1000); 

    	}

  	});

});

