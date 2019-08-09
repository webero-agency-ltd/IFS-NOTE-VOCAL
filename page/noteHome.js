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
		let note = notes.find( e => (e.native_id==ID||e.native_id == ID+"")&&(type == e.attache)? true : false ) ; 
		let content = $(e).parent('.noteColumn').find('.noteContentText')
		let precontent = content.text().trim() ;
		console.log( note , notes )
		if ( ID && note ) {
			if ( content.length ) {
				let url = Api.url+'/audio/'+note.unique ; 
				console.log( '___API FIND RESPONSE' )
				let [ err , form ] = await Api.fetch( '/api/form/'+note.id ) ;
				console.log( form , note.id , '/api/form/'+note.id )
				console.log( '_____________________' )
				let text = formateComment( form.data ) ; 
				console.log( text )
        		new listen( content[0] , url , 'audio-liste-note-'+index , '<div><a target="_blank"  href="'+Api.url+'/read/'+note.unique+'">'+Api.url+'/read/'+note.unique+'</a></div>'+'<div>'+text+'</div>' )
			}
			//ceci est un note vocale  
		}else if ( precontent.indexOf(Api.url+'/read/') >= 0 ) {
			let repl = precontent.replace(new RegExp('\r?\n','g'), ''); ; 
			repl = repl.replace(new RegExp(Api.url,'g'), ''); ; 
			let sdsd = /(.*)read\/(.*)/gi;
			let s = sdsd.exec(repl);
			console.log( s ); 
			if ( s[2] ) {
				console.log( 'update note ici' )  ;
				console.log( s[2] , ID )
				//récupération des informations de cette note ci pour voire si c'est 
				//un note vocal ou pas. si c'est est une, on récupère les information via 
				console.log( `/infusionsoft/setnote/${s[2]}/${ID}/`+type )
				var [ error , upnote ] = await Api.fetch( `/api/note/attache/${s[2]}/${ID}/`+type )
				if ( upnote && upnote.data && upnote.data.id ) {
					console.log( upnote )
					let url = Api.url+'/audio/'+s[2] ; 
					//récupération des formulaires de cette notes 
					var [ err , form ] = await Api.fetch( '/api/form/'+upnote.data.id ) ;
					console.log( form )
					if( !form )
						return !1 ; 
					let text = formateComment( form.data ) ; 
        			new listen( content[0] , url , 'audio-liste-note-'+upnote.data.id , '<div><a target="_blank"  href="'+Api.url+'/read/'+s[2]+'">'+Api.url+'/read/'+s[2]+'</a></div>'+'<div>'+text+'</div>' )
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
	var [ err , resp ] = await Api.fetch( '/api/application/check/ifs/'+encodeURIComponent( contactId ) )
	let app = resp.data ; 
	if ( !app || !app.id ) 
		return
	placeButton() ; 
	//récupération de tout les notes de cette infusionsoft 
	var [ err , note ]  = await Api.fetch( '/api/notes/'+app.id ) ;
	console.log( note ) 
	note.data?loadVocale( note.data ):'';
}

let ready = false ; 
$( function () {
	console.log( 'IntiAppData' ) ;
    Event.on('IntiAppData',async function( request ){
	    if ( !ready ) {
	    	ready = true ; 
	    	initContent() ; 
	    }
	})
	chrome.runtime.connect();
});
