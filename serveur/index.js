
var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');
let Busboy = require('busboy');

let env = 'local' ; 

var app = express();
var path = require('path') ; 

var http = require('http') ;

var https = require('https') ;
var stores = require('./libs/stores');

app.set('views', path.join(__dirname, '/tpl'));

app.set('view enginer','ejs') ; 

app.use(express.static(__dirname + '/public')) ; 

var openfile = [] ; 

http.createServer(function(req, res) {   
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

// Add headers
app.use(function (req, res, next) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	
	res.setHeader('Access-Control-Allow-Credentials', true);

   	next();

});

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/audio/:filename', function(req, res){

	if (  req.param("filename") ) {
	
		var nameFile =  req.param("filename")+'.wav' ;
		var filePath = path.join(__dirname, '/notes/') + nameFile ; 

		if ( ! fs.existsSync( filePath ) ) {
			return res.send('Fichier pas trouver');
		}

	    ////////////////////////////////////////////////////

	    stat = fs.statSync(filePath);

	    const fileSize = stat.size;
	    const range = req.headers.range;
	    const id = req.param("filename") ; 
 
	    if (range) {
		    const parts = range.replace(/bytes=/, "").split("-");
		    const start = parseInt(parts[0], 10);
		    const end = parts[1] 
		        ? parseInt(parts[1], 10)
		        : fileSize - 1;
		    const chunksize = (end - start) + 1;
		    let readStream = fs.createReadStream(filePath, { start, end });
		    const head = {
		        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		        'Accept-Ranges': 'bytes',
		        'Content-Length': chunksize,
		        'Content-Type': 'video/mp4',
		    };
		    res.writeHead(206, head);

		    let is = openfile.filter( e => e.id==id?true:false );
		    if ( is.length == 0 ) {
		    	openfile.push({id, stream : readStream }) ;
		    }
		 
		    readStream.pipe(res);
	    } else {
		    const head = {
		        'Content-Length': fileSize,
		        'Content-Type': 'video/mp4',
		    };
	      	res.writeHead(200, head);
	      	let stream = fs.createReadStream(filePath)
	    
	      	let is = openfile.filter( e => e.id==id?true:false );
		    if ( is.length == 0 ) {
		    	openfile.push({id, stream : stream }) ;
		    }

	      	stream.pipe(res);
	    
	    }

	    ////////////////////////////////////////////////////

	    return true; 
	    
	}

	return res.send('Fichier pas trouver');

});
 
//ici on a le fichier et on fait l'upload
app.post('/upload', async function(req, res){

	var { id , type , typeId , contactId } = req.query ; 

	var index = null ; 
	
	let deletefile = openfile.filter( function ( e , i ) {
		index = i ; 
		return e.id==id?true:false;
	}); 


	console.log( deletefile , openfile , id );

	if ( deletefile.length ) {
		
		deletefile[0].stream.destroy();
		openfile.splice(index, 1);
	}

	var busboy = new Busboy({ headers: req.headers });

	var filePath = path.join(__dirname, '/notes/') + id + '.wav' ; 

	console.log('--- START UPLOAD');

	await stores.createNote( id , filePath , type , typeId , contactId ) ; 

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

	    file.pipe(fs.createWriteStream(filePath)); 

	})
	
	busboy.on('finish', async function () {
    	
    	await stores.endNote( id ) ;
        res.status(200).json({ 'message': "File uploaded successfully." });
    
    });

    return req.pipe(busboy);

});


//enregistré le document enregistré 
app.get('/save', async function(req, res){
	
	if ( req.query.id ) {

		console.log('---ENREGIsTREMENT DE CETTE NOTE');
		await stores.saveNote( req.query.id ) ; 

	}

	res.json({success:true}) ; 

});


app.get('/close', async function(req, res){
	
	if ( req.query.id ) {

		let id = req.query.id.trim() ; 

		if ( stores.findNoteNotSave( id ) ) {
      		
      		console.log('---- VOCAL ENRGISTRE CORRECTEMENET MAIS NOTE PAS PRISE EN CHARGE');
    		
    		var index = null ; 
			let deletefile = openfile.filter( function ( e , i ) {
				index = i ; 
				return e.id==id?true:false;
			}); 

			if ( deletefile.length ) {
				deletefile[0].stream.destroy();
				openfile.splice(index, 1);
			}

    		await stores.deleteNote( id ) ;
    	
    	}

	}

	res.json({success:true}) ; 

});


app.get('/delete', async function(req, res){
	
	if ( req.query.id ) {

		var index = null ; 

		let deletefile = openfile.filter( function ( e , i ) {
			index = i ; 
			return e.id==req.query.id?true:false;
		}); 

		console.log( '--------------delete:::', deletefile.length );
		if ( deletefile.length ) {
			console.log('ANATINy');
			deletefile[0].stream.destroy();
			openfile.splice(index, 1);
            await stores.deleteNote( req.query.id ) ; 
		}

	}

	res.json({success:true}) ;


});

var port = 443;
var server = null ;  

if ( env =='local' ) {
	port = 4434;
	server =  http.createServer( app ).listen(port);
}else{
	var options = {
		key: fs.readFileSync("/etc/letsencrypt/archive/therapiequantique.net/privkey1.pem"),
	    cert: fs.readFileSync("/etc/letsencrypt/archive/therapiequantique.net/fullchain1.pem"),
	    ca: fs.readFileSync("/etc/letsencrypt/archive/therapiequantique.net/chain1.pem"),
	};
	server =  https.createServer(options, app).listen(port);
}

console.log('server open on port ' + port );

binaryServer = BinaryServer({ server , port: 9001 });

binaryServer.on('connection', async function(client) {

  	var url_string = require('url').parse( "http://www.example.com/socket/"+client._socket.upgradeReq.url,true).query;  
	
	var { id , type , typeId , contactId } = url_string ; 

  	console.log('new connection---', id , type , typeId , contactId  );

	if( !id ) return ; 

	let index = null ;
	let deletefile = openfile.filter( function ( e , i ) {
		index = i ; 
		return e.id==id?true:false;
	}); 

	if ( deletefile.length ) {
		console.log('------------DELETE STREAM');
		deletefile[0].stream.destroy();
		openfile.splice(index, 1);
	}

	var nameFile = id+ '.wav' ; 

	var pathFile = path.join(__dirname, '/notes/') + nameFile ; 

	//ajoute dans le data json
	await stores.createNote( id , pathFile , type , typeId , contactId ) ; 

  	var fileWriter = new wav.FileWriter( pathFile , {
    	channels: 1,
    	sampleRate: 48000,
    	bitDepth: 16
  	});

  	client.on('stream', function(stream, meta) {
    	
    	console.log('new stream');
    	stream.pipe(fileWriter);

	    stream.on('end', async function() {
	      	
	      	fileWriter.end();
	      	console.log('Close file End file ' + nameFile);
			await stores.endNote( id ) ; 
	      	
	    });
  	
  	});

  	client.on('close', async function() {

  		console.log( 'closecloseclosecloseclosecloseclose' );

  		let liste = stores.ALL() ;
		//si on a un note qui n'est pas terminer avec un procédure normale 
    	if ( stores.findNoteNotEnd( id ) ) {
      		console.log( 'NON CLOSE' );
    		fileWriter.end();

    		var index = null ; 
			let deletefile = openfile.filter( function ( e , i ) {
				index = i ; 
				return e.id==id?true:false;
			}); 

			if ( deletefile.length ) {
				deletefile[0].stream.destroy();
				openfile.splice(index, 1);
			}
			
			await stores.deleteNote( id ) ; 
    	}
    	//si un note a bien été crée et fermer correctement mais na pas été enregistré dans le note 
    	else if ( stores.findNoteNotSave( id ) ) {
      		
      		console.log('---- VOCAL ENRGISTRE CORRECTEMENET MAIS NOTE PAS PRISE EN CHARGE');
    		
    		var index = null ; 
			let deletefile = openfile.filter( function ( e , i ) {
				index = i ; 
				return e.id==id?true:false;
			}); 

			if ( deletefile.length ) {
				deletefile[0].stream.destroy();
				openfile.splice(index, 1);
			}

    		await stores.deleteNote( id ) ;
    	
    	}

  	});

});

