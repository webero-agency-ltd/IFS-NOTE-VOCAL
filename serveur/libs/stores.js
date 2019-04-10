
var path = require('path') ; 
var moment = require('moment') ; 
var fs = require('fs');
var file = path.join( __dirname,'../listes.json' ) ; 

var exports = module.exports = {};

/*
*	Récupération de tout les enregistrement des donners 
*/
exports.ALL = function (argument) {

	var liste = [] ; 

	if ( fs.existsSync( file ) ) {

		var i = fs.readFileSync( file ).toString(); 
		liste = JSON.parse(i) ;
	}

	return liste 

}


/*
*	Enregistrement, supression, récupération des informations des notes enregistré 
*/

exports.createNote = function( id , fileI , type /* Infustion sift ou autre application */,typeId , conatactId ) {
    
    //récupération du fichier et des elements dans le JSON
	let liste = exports.ALL() ; 
	// file reprénte ici le nom du fichier 
	// save si le fichier a été enregistré avec succes dans le note 
	// close si le fichier a bien été fermer correctement 
	liste.push({ id , file : fileI , type ,typeId , conatactId , save : false , end : false })

	//écriture des nouvelle élement dans le fichier nliste 
	return fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

};

exports.saveNote = function( id ) {

	//récupération de la liste
	let liste = exports.ALL() ; 

	//on parcoure le tebleaux et on inque qu'i faut ajouter terminer sur la liste
    liste = liste.map((e) => {
  		return e.id == id ? {...e, save : true } : { ...e }
  	})
  	
  	//on réenregistre le fichier 
  	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

};

exports.endNote = function( id ) {

	//récupération de la liste
	let liste = exports.ALL() ; 

	//on parcoure le tebleaux et on inque qu'i faut ajouter terminer sur la liste
    liste = liste.map((e) => {
  		return e.id == id ? {...e, end : true } : { ...e }
  	})

  	let item = liste.filter((e) => {
  		return (e.id == id) ? true : false ; 
  	})
  	
  	//on réenregistre le fichier 
  	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

};

exports.findNoteNotEnd = function( id ) {
    
    let liste = exports.ALL() ;

    liste = liste.filter((e) => {
  		return (e.id == id && e.end === false) ? true : false ; 
  	})
  	
    return liste.length?liste[0]:null ; 

};

exports.findNoteNotSave = function( id ) {
    
    let liste = exports.ALL() ;

    console.log( liste );

    liste = liste.filter((e) => {
  		return (e.id == id && e.save == false) ? true : false ; 
  	})

    return liste.length?liste[0]:null ; 

};

exports.deleteNote = function( id ) {
    
    let liste = exports.ALL() ;

    liste = liste.filter((e) => {
  		return e.id == id ? true : false ; 
  	})

  	if (!liste.length) {
  		return false ;  
  	}

    fs.unlink( liste[0].file , function (err) {
	    
      console.log( 'Erreur delete' , err );
    	if (err) throw err;
    	//if (err) return false ;
    	liste = liste.filter((e) => {
      		return e.id == id ? false : true ; 
      	})
      	fs.writeFileSync( file , JSON.stringify(liste) , 'utf8' ) ;

	});  

};


