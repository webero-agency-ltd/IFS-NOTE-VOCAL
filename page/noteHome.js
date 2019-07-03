/*
 * fonction dans les pages qui liste les notes
 * pour pouvoire ajouter ajouter le button add note vocale 
*/
function placeButton() { 
	let { ID } = getParams(location.href)
  	//on est dans la page ou on liste tout les notes 
	//on ajoute le button "add note vocal" 
	var btnAddNote = document.querySelector('#TemplateId ~ input');
	if ( btnAddNote ) {
		$( btnAddNote ).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+ ID +'\' , {height: 730,width: 730})"  id="ifs-task-vocaux" class="inf-button btn" type="button" value="Ajouter note vocale">' ) 	
	}
	//ajouter aussi dans add task vocal 
	var btnAddTask = document.querySelector('#Add_Task ~ input');
	if ( btnAddTask ) {
		$( btnAddTask ).after( '<input onclick="openTask(\'?view=add&Task0ContactId='+ ID +'&taskType=task&vocaux=true\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Ajouter tache vocale">' ) 
	}
	/*
	 * Dans le modale ovrire show note all  
	*/
	var btnAddNote = document.querySelector('#TemplateId_select ~ input ');
	if ( btnAddNote ) {
		$( btnAddNote ).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+ ID +'\' , {height: 730,width: 730})" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Add Vocal Note">' ) 
		//écoute lors du clicque sur l'élement 	
	}
}

/*
 * Chargement de tout les élément vocal de cette page 
*/
function loadVocale( notes ) { 
	var noteListe = $('.noteSubjectText') ; 
  	console.log( notes ) ; 
  	console.log( noteListe ) ; 

  	listen.event()
	noteListe.each(async function ( index , e ) {
		let link = $( e ).find('a') ; 
		let href = null 
		let ID = null 
		let type = "" ;
		if ( link.length ) {
			href = link[0].href
			console.log( href )
			if ( href.indexOf( 'javascript:openTask' ) !== -1 ) {
				type = 'task';
			}else if ( href.indexOf( 'javascript:openHistory' ) !== -1 ) {
				type = 'note';
			}
			ID = extractUrlValue( 'ID' , href )
		}
		let note = notes.filter( e => (e.nativeId==ID||e.nativeId == ID+"")&&(type == e.attache)? true : false ) ; 
		let content = $(e).parent('.noteColumn').find('.noteContentText')
		let precontent = content.text().trim() ;
		console.log( note )
		if ( ID && note.length ) {
			if ( content.length ) {

				let url = Api.url+'/audio/'+note[0].unique ; 
				console.log( '___API FIND RESPONSE' )
				let [ err , form ] = await Api.get( '/form/'+note[0].id ) ;
				console.log( form[2] , note[0].id , '/form/'+note[0].id )
				console.log( '_____________________' )
				let text = formateComment( form ) ; 
				console.log( text )
        		new listen( content[0] , url , 'audio-liste-note-'+index , '<div><a target="_blank"  href="https://therapiequantique.net/read/'+note[0].unique+'">https://therapiequantique.net/read/'+note[0].unique+'</a></div>'+'<div>'+text+'</div>' )
			}
			//ceci est un note vocale  
		}else if ( precontent.indexOf('https://therapiequantique.net/read/') >= 0 ) {
			let repl = precontent.replace(new RegExp('\r?\n','g'), ''); ; 
			let sdsd = /https:\/\/therapiequantique.net\/read\/(.*)/gi;
			let s = sdsd.exec(repl);
			if ( s[1] ) {
				console.log( 'update note ici' )  ;
				console.log( s[1] , ID )
				//récupération des informations de cette note ci pour voire si c'est 
				//un note vocal ou pas. si c'est est une, on récupère les information via 
				console.log( `/infusionsoft/setnote/${s[1]}/${ID}/`+type )
				var [ error , upnote ] = await Api.get( `/infusionsoft/setnote/${s[1]}/${ID}/`+type )
				if ( upnote && upnote.id ) {
					let url = Api.url+'/audio/'+s[1] ; 
					//récupération des formulaires de cette notes 
					var [ err , form ] = await Api.get( '/form/'+upnote.id ) ;
					console.log( form )
					let text = formateComment( form ) ; 
        			new listen( content[0] , url , 'audio-liste-note-'+upnote.id , '<div><a target="_blank"  href="https://therapiequantique.net/read/'+s[1]+'">https://therapiequantique.net/read/'+s[1]+'</a></div>'+'<div>'+text+'</div>' )
				}
			}
		}
	})
}

async function initContent(){
	//récupération des informations de connexion
    let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
	let s = sdsd.exec(location.href);
	let contactId = s[1] ; 
	if ( !contactId ) 
		return
	var [ err , app ] = await Api.get( '/application/check/'+encodeURIComponent( contactId )+'/infusionsoft' )
	console.log( app )
	if ( !app || !app.id ) 
		return
	placeButton() ; 
	//récupération de tout les notes de cette infusionsoft 
	var [ err , note ]  = await Api.get( '/notes/'+app.id ) ;
	console.log( note , err ) 
	loadVocale( note ) ; 
}

$( function () {
    initContent() ; 
});
