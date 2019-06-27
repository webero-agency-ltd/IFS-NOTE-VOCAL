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
		if ( link.length ) {
			href = link[0].href
			ID = extractUrlValue( 'ID' , href )
		}
		let note = notes.filter( e => e.nativeId==ID||e.nativeId == ID+"" ? true : false ) ; 
		let content = $(e).parent('.noteColumn').find('.noteContentText')
		let precontent = content.text() ;
		console.log( precontent )
		if ( ID && note.length ) {
			if ( content.length ) {
				let url = Api.url+'/audio/'+note[0].unique ; 
        		new listen( content[0] , url , 'audio-liste-note-'+index )
				/*$(content[0]).html( `<a target="_blank" href="${url}">${url}</a></br> 
					${lecteurTpl( url , 'audio-liste-note-'+index )}
					<div class="content-note-vocaux">${html}</div>` ) ;*/
			}
			//ceci est un note vocale 
		}else if ( precontent.indexOf('https://therapiequantique.net/note/u/') >= 0 ) {
			let repl = precontent.replace(new RegExp('\r?\n','g'), ''); ; 
			let sdsd = /https:\/\/therapiequantique.net\/note\/u\/(.*)/gi;
			let s = sdsd.exec(repl);
			if ( s[1] ) {
				console.log( 'update note ici' )  ;
				console.log( s[1] , ID )
				//récupération des informations de cette note ci pour voire si c'est 
				//un note vocal ou pas. si c'est est une, on récupère les information via 
				var [ error , upnote ] = await Api.get( `/infusionsoft/setnote/${s[1]}/${ID}` )
				if ( upnote && upnote.id ) {
					let url = Api.url+'/audio/'+s[1] ; 
					var [ err , app ] = await Api.get( '/form/'+navigator.note.id ) ;
        			new listen( content[0] , url , 'audio-liste-note-'+upnote.id )
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
	if ( ! app.id ) 
		return
	placeButton() ; 
	//récupération de tout les notes de cette infusionsoft 
	var [ err , note ]  = await Api.get( '/notes/'+app.id ) ; 
	loadVocale( note ) ; 
}

$( function () {
    initContent() ; 
});
