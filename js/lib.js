var Auth , Icon , Dom  , Json , wait , makeid , loadeNoteListe , Note , sendBlobToApp , getParams , extractUrlValue , lecteurTpl ; 

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
    get: async function ( entpoint , cbl ) {
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
	                Event.on('reponseApi', async function( uploadResponse ){
	                	cbl?cbl( uploadResponse ):""
					    return resolve( uploadResponse )
	                })
	                Event.emit('requestApi', {
	                	url : urlCall , 
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
	                Event.on('reponseApi', async function( uploadResponse ){
	                	cbl?cbl( uploadResponse ):""
					    return resolve( uploadResponse )
	                })
	                Event.emit('requestApi', {
	                	url : urlCall , 
	                	body , 
	                	method , 
	                	headers , 
	                	type , 
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