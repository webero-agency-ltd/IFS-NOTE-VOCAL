var bytesToSize , formateComment , formPlace , FormValueFormate , Auth , Icon , Dom  , Json , wait , makeid , loadeNoteListe , Note , sendBlobToApp , getParams , extractUrlValue , lecteurTpl ; 

Auth = {
    checkApiKey: function (cbl) {
        this.getApiKey(function (res) {
            if (res !== '') {
            	Api.get('/user/authenticated', function ( [ err , data ] ) {
                    if ( err === null && typeof data.id != 'undefined') {
                        Icon.setColoredIcon();
                        if (cbl !== null) {
                            return cbl(res);
                        }
                    }
                });
            } else {
                Icon.setGreyIcon();
                if (cbl !== null) {
                    return cbl(false);
                }
            }
        });
    },
    setApiKey: function ( apiKey ) {
        chrome.storage.sync.set({ apiKey }, function () {
            return true;
        });
    },
    getApiKey: function (cbl) {
        chrome.storage.sync.get('apiKey', function (res) {
            res["apiKey"] ? apiKey = res["apiKey"] : apiKey = "";
            return cbl(apiKey);
        });
    },
    getUser: function (cbl) {
        this.getApiKey(function (apiKey) {
            if (apiKey !== false) {
                Api.get('/user/authenticated', function (user) {
                    return cbl(user);
                });
            } else {
                return cbl(false);
            }
        });
    },
    logoutAction: function (c8) {
        chrome.storage.sync.clear(c8);
        Icon.setGreyIcon();
    }
};

Icon = {
    setGreyIcon: function () {
        chrome.browserAction.setIcon({
            path: {
                "16": chrome.extension.getURL("img/icon.gris.png"),
                "48": chrome.extension.getURL("img/icon.gris.png")
            }
        });
    },
    setColoredIcon: function () {
        chrome.browserAction.setIcon({
            path: {
                "16": chrome.extension.getURL("img/icon.png"),
                "48": chrome.extension.getURL("img/icon.png")
            }
        });
    }
};

Json = {
	parse : function ( data , place = {} ) { 
		try{
			Json = JSON.parse( data ) ; 
		}catch( e ){
			Json = place ; 
		}
		return Json ;
	}
}

Api = {
	//url : "http://localhost:3000" , 
	url : "https://therapiequantique.net" , 
	port : "3000" , 
	//port : "" , 
	domaine : "localhost" , 
	//domaine : "therapiequantique.net" , 
    get: function ( entpoint , cbl ) {
    	return new Promise((resolve, reject) => {
		    Auth.getApiKey( async function (apiKey) {
	            if (typeof apiKey != 'undefined' && apiKey !== '') {
	            	if (entpoint.indexOf("?") == '-1') {
	                    urlCall = Api.url + entpoint + "?apiKey=" + apiKey;    
	                } else {
	                    urlCall = Api.url + entpoint + "&apiKey=" + apiKey;    
	                }
	                //lancement de l'évenement de requestio
	                //dans le backend pour éliminer 
	                //l'érreur de l'origine croiser  
	                var uniq = 'id' + (new Date()).getTime() + makeid(12) ;
	                //console.log( uniq , '______________________++++++++++++++++')
	                Event.on(uniq, async function( uploadResponse ){
	                	cbl?cbl( uploadResponse ):"";
	                	console.log( uploadResponse )
	                	setTimeout(function() {
	                		Event.delete( uniq )
	                	}, 1000);
					    return resolve( uploadResponse )
	                } , true )
	                Event.emit('requestApi', {
	                	url : urlCall , 
	                	event : uniq ,
	                })
	            } else {
				    cbl?cbl( [ false , false ] ):""
				    return resolve( [ false , false ] )
	            }
	        });
		});
    },
    post( entpoint , { body , method = 'POST' , headers = {} , type = false } , cbl ){
    	return new Promise((resolve, reject) => {
		    Auth.getApiKey( async function (apiKey) {
	            if (typeof apiKey != 'undefined' && apiKey !== '') {
	            	if (entpoint.indexOf("?") == '-1') {
	                    urlCall = Api.url + entpoint + "?apiKey=" + apiKey;    
	                } else {
	                    urlCall = Api.url + entpoint + "&apiKey=" + apiKey;    
	                }
	                //lancement de l'évenement de requestio
	                //dans le backend pour éliminer 
	                //l'érreur de l'origine croiser  
	                var uniq = 'id' + (new Date()).getTime() + makeid(12) ;
	                Event.on( uniq , async function( uploadResponse ){
	                	cbl?cbl( uploadResponse ):""
	                	setTimeout(function() {
	                		Event.delete( uniq )
	                	}, 1000);
	                	console.log( uploadResponse )
					    return resolve( uploadResponse )
	                })
	                Event.emit('requestApi', {
	                	url : urlCall , 
	                	body , 
	                	method , 
	                	headers , 
	                	type , 
	                	event : uniq
	                })
	            } else {
				    cbl?cbl( [ false , false ] ):""
				    return resolve( [ false , false ] )
	            }
	        });
		});
    }
};

Dom = {
	select : function ( ) {
		//on selection, si on ne trouve pas, 
		//on envoye une erreur indiquant une erreur de selection et le code qui ne marche pas 
	},
	observeDOM : function( obj, callback ) {
	    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
	        eventListenerSupported = window.addEventListener;
	    if( MutationObserver ){
	        var obs = new MutationObserver(function(mutations, observer){
	            if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
	                callback();
	        });
	        obs.observe( obj, { childList:true, subtree:true });
	    }
	    else if( eventListenerSupported ){
	        obj.addEventListener('DOMNodeInserted', callback, false);
	        obj.addEventListener('DOMNodeRemoved', callback, false);
	    }
	},
	watch : function ( select , callback , selIframe ) {
		let sel = null ; 
		let iframe = document.querySelector( selIframe );
		if ( iframe ) {
			let sel_ = iframe.contentDocument || iframe.contentWindow.document;
			sel = sel_.querySelector( select )
		}else{
			sel = document.querySelector( select ) ;
		}
		if ( sel ) {
	  		callback() ; 
	  	} else {
	  		setTimeout(function() {
	  			Dom.watch( select , callback , iframe ) 
	  		},500);
	  	}
	}
}

Block = {
    changeBlock: function ( template ) {
        $("#mainFrame")["attr"]("src", template  + ".html");
    },
    syncBlock: function () {
        Auth.getApiKey(function (apiKey) {
        	console.log( ' --- API KEY EST ICI : ' , apiKey )
            if (apiKey === '') {
                Block.changeBlock('login');
                Icon.setGreyIcon();
            } else {
                Block.changeBlock('user');
                Icon.setColoredIcon();
            }
        });
    }
};

wait = function(length) {
  	var promise1 = new Promise(function(resolve, reject) {
		setTimeout(function() {
		  	resolve(length);
		}, length);
	});
  	return promise1  ; 
}

makeid = function(length) {
  	var text = "";
  	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  	for (var i = 0; i < length; i++)
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
  	return text;
}

/*
 * Manipulation des notes de l'application
 * Création, modification, supression, récupération 
*/
Note = {
    find: function ( template ) {
        api.get( '' , function(){

        })
    },
};

loadeNoteListe = async function (length) {

	let notes =	await Note.find() ; 
	console.log( notes )
	return

  	var noteListe = $('.noteContentText') ; 
  	console.log( noteListe ) ; 
	noteListe.each(async function ( index , e ) {
		var text = $(this).text().trim() ; 
		console.log( text )
		if ( text.indexOf('NOTEID::') >= 0 ) {
			let repl = text.replace(new RegExp('\r?\n','g'), '<br />'); ; 
			let sdsd = /NOTEID::(.*)::NOTEID(.*)/gi;
			let s = sdsd.exec(repl);
			let ID = '' ; 
			let html = '' ; 
			if ( s[1] ) {
				ID = s[1] ; 
			}
			if ( s[2] ) {
				html = s[2] ; 
			}
			let base = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
			let url = base+'/audio/'+ID ; 
			let last = html.trim().substr(html.length - 3);   
				console.log( last ); 
			if ( last === '...' ) {
				let url = base+'/note/'+ID+'?token='+navigator.userCookie ;  
				html += `<a data-url="${url}" class="readmore-note-vocaux" href="">voire plus</a>` ;
			}
			$(this).html( `<a target="_blank" href="${url}">${url}</a></br> 
				${lecteurTpl( url , 'audio-liste-note-'+index )}
				<div class="content-note-vocaux">${html}</div>` ) ; 
		}
	})

	$('body').on('click','.readmore-note-vocaux',async function (e) {
		e.preventDefault() ; 
		e.stopPropagation() ; 
		let url = $(this).data('url')
		let otherinfo = await fetch( url ) ; 
		if ( otherinfo.ok ){
			let infonotes = await otherinfo.json() ; 
			let htmlchange = ''; 
			if ( infonotes && infonotes.text ) {
				htmlchange = infonotes.text.replace(new RegExp('\r?\n','g'), '<br />'); ; 
			}
			if ( infonotes ) {
				$(this).parent('.content-note-vocaux').html( htmlchange ) ; 
			}else{
				$(this).remove() ; 
			}
		} 
		//a partire de l'ID du note, on fait la récupération des donners des notes en plus,
		//ceci afin d'afficher les voire plus 
	})
}


sendBlobToApp = function ( blob ) {  
	console.log( blob )
  	var CHUNK_SIZE = 256 * 1024;
 	var start = 0;
  	var stop = CHUNK_SIZE;      
  	var remainder = blob.size % CHUNK_SIZE;
  	var chunks = Math.floor(blob.size / CHUNK_SIZE);      
  	var chunkIndex = 0;
  	if (remainder != 0) chunks = chunks + 1;           
  	var fr = new FileReader();
  	fr.onload = function() {
      	var message = {
        	blobAsText: fr.result,
        	mimeString: 'audio/wav',                 
        	chunks: chunks 
      	};          
      	Event.emit('sendData' , message )
      	processChunk();
  	};
  	fr.onerror = function() { appendLog("An error ocurred while reading file"); };
  	processChunk();

  	function processChunk() {
     	chunkIndex++;         
     	if (chunkIndex > chunks) {
        	return;
     	}
     	if (chunkIndex == chunks && remainder != 0) {
        	stop = start + remainder;
     	}                           
     	var blobChunk = blob.slice(start, stop);
     	start = stop;
     	stop = stop + CHUNK_SIZE;
     	fr.readAsBinaryString(blobChunk);
  	} 
}

getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

extractUrlValue = function ( key, url )
{
    if (typeof(url) === 'undefined')
        url = window.location.href;
    var match = url.match('[?&]' + key + '=([^&]+)');
    return match ? match[1] : null;
}

lecteurTpl = function ( url , id = "" ) {

	return  `<div class="${id}core" class="audio-controller" >
		<audio data-id="${id}" id="${id}" style="height: 30px;" controls="" >
			<source  src="${url}"  type="audio/mpeg">
		</audio>
		<div class="${id}" style="padding-left: 21px; display:none ; height: 30px;" >
			<a data-id="${id}" data-value="1" class="active speed-fan" href="#"><span>x 1</span></a>
			<a data-id="${id}" data-value="1.25" class="speed-fan" href="#"><span>x 1.25</span></a>
			<a data-id="${id}" data-value="1.50" class="speed-fan" href="#"><span>x 1.50</span></a>
			<a data-id="${id}" data-value="2" class="speed-fan" href="#"><span>x 2</span></a>
		</div>
		<style>
			a.speed-fan{
				color : #b5b5b5 ; 
				display: inline-block;
			    vertical-align: top;
			    margin-left: 0.51rem;
			    margin-right: 0.51rem;
			}
			a.speed-fan.active{
				color : #121212 ; 
			}
		</style>
	</div>` ; 

}

FormValueFormate = function(){
	let body = [] ; 
    let doemotion = $('#doemotion').val()
    body = [ ...body , { type : 'text' , name : 'doemotion' , value : doemotion } ]
	let autre = $('#autre').val()
    body = [ ...body , { type : 'text' , name : 'autre' , value : autre } ]
	let comment = $('#comment').val()
    body = [ ...body , { type : 'text' , name : 'comment' , value : comment } ]
	let vitesse_closing_select = $('#vitesse-closing-select').val()
    body = [ ...body , { type : 'text' , name : 'vitesse-closing-select' , value : vitesse_closing_select?vitesse_closing_select.join():'' } ]
	let soncas_select = $('#soncas-select').val()
    body = [ ...body , { type : 'text' , name : 'soncas-select' , value : soncas_select } ]
	let produit_select = $('#produit-select').val()
    body = [ ...body , { type : 'text' , name : 'produit-select' , value : produit_select } ]
	let commercial_autre = $('#commercial_autre').val()
    body = [ ...body , { type : 'text' , name : 'commercial_autre' , value : commercial_autre } ]
	let commercial = $('#commercial').val()
    body = [ ...body , { type : 'text' , name : 'commercial' , value : commercial } ]
	let sav_autre = $('#sav_autre').val()
    body = [ ...body , { type : 'text' , name : 'sav_autre' , value : sav_autre } ]
	let sav = $('#sav').val()
    body = [ ...body , { type : 'text' , name : 'sav' , value : sav } ]
	let comptabilite_autre = $('#comptabilite_autre').val()
    body = [ ...body , { type : 'text' , name : 'comptabilite_autre' , value : comptabilite_autre } ]
	let comptabilite = $('#comptabilite').val()
    body = [ ...body , { type : 'text' , name : 'comptabilite' , value : comptabilite } ]
	let categorie_select = $('#categorie-select').val()
    body = [ ...body , { type : 'text' , name : 'categorie-select' , value : categorie_select } ]
    return body 
}

formateComment = function( form ){
	let text = '' ; 
	for( let { name , value } of form ){
		if ( name == 'soncas-select' && value !== '') {
			let val = formPlace('soncasArray')  ;
			text += '<strong>SONCAS :</strong> </br>'
			for( let pitem of val ){
				pitem.value==value?text += ` - ${pitem.key}</br>`:'';
			}
		}else if( name == 'vitesse-closing-select' && value ){
			text += '<strong>Vitesse Closing :</strong> </br>';
			console.log( value )
			let ex = value.split(',') ; 
			console.log( ex )
			let val = formPlace('vitesseclosingArray')  ;
			for( let i of ex ){
				for( let pitem of val ){
					pitem.value==i?text += ` - ${pitem.key}</br>`:'';
				}
			}
		}else if( name == 'doemotion' && value !== ''){
			text += '<strong>Douleur émotionnelle :</strong> </br>'
			text += ` - ${value}</br>`
		}else if( name == 'comment' && value !== ''){
			text += '<strong>Commentaire :</strong></br>'
			text += ` - ${value}</br>`
		}
	}
	return text
}

formPlace = function( opt ){
	
	let objs = {} ; 
	objs['soncasArray'] = [
		{value : 0 , key : 'Sécurité'} , 
		{value : 1 , key : 'Orgueil'} , 
		{value : 2 , key : 'Nouveauté'} , 
		{value : 3 , key : 'Confort'} , 
		{value : 4 , key : 'Argent'} , 
		{value : 5 , key : 'Sympathie'} , 
	]; 
	objs['vitesseclosingArray'] = [
		{value : 0 , key : 'V1 (Rapide)'} , 
		{value : 1 , key : 'V2 (Moyen)'} , 
		{value : 2 , key : 'V3 (Lent)'} , 
	]; 
	objs['produitArray'] = [
		{value : 'Aumscan 4' , key : 'Aumscan 4'} , 
		{value : 'Aumscan 3' , key : 'Aumscan 3'} , 
		{value : 'Cardiaum' , key : 'Cardiaum'} , 
		{value : 'TQ2022' , key : 'TQ2022'} , 
		{value : 'Coloraum' , key : 'Coloraum'} , 
	] ; 

	objs['commercialArray'] = [
		{value : 'Envoyer devis' , key : 'Envoyer devis'} , 
		{value : 'Relancer' , key : 'Relancer'} , 
		{value : 'Closer' , key : 'Closer'} , 
		{value : 'Résumé après appel' , key : 'Résumé après appel'} , 
		{value : 'Résumé après présentation' , key : 'Résumé après présentation'} , 
		{value : 'Envoyer document' , key : 'Envoyer document'} , 
		{value : '_____' , key : 'Autre (Input Texte libre)'} , 
	] ; 

	objs['savArray'] = [
		{value : 'Installation logiciel' , key : 'Installation logiciel'} , 
		{value : 'Intervention' , key : 'Intervention'} , 
		{value : '_____' , key : 'Autre (Input Texte libre)'} , 
	]; 

	objs['comptabiliteArray'] =  [
		{value : 'Envoyer document' , key : 'Envoyer document'} , 
		{value : 'Vérifier paiement' , key : 'Vérifier paiement'} , 
		{value : 'Gérer impayé' , key : 'Gérer impayé'} , 
		{value : '_____' , key : 'Autre (Input Texte libre)'} , 
	];

	objs['categorieArray'] =  [
		{value : 'comptabilite' , key : 'COMPTABILITE'} , 
		{value : 'sav' , key : 'SAV'} , 
		{value : 'commercial' , key : 'COMMERCIAL'} , 
		{value : 'autre' , key : 'AUTRE'} , 
	]; 

	if ( objs[opt] ) 
		return objs[opt]
	return null 

}

bytesToSize = function (bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
