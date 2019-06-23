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
	noteListe.each(async function ( index , e ) {
		let link = $( e ).find('a') ; 
		let href = null 
		let ID = null 
		if ( link.length ) {
			href = link[0].href
			ID = extractUrlValue( 'ID' , href )
		}
		let note = notes.filter( e => e.nativeId==ID||e.nativeId == ID+"" ? true : false ) ; 
		if ( ID && note.length ) {
			let content = $(e).parent('.noteColumn').find('.noteContentText')
			if ( content.length ) {
				let url = Api.url+'/audio/'+note[0].unique ; 
        		new listen( content[0] , url , 'audio-liste-note-'+index )
				/*$(content[0]).html( `<a target="_blank" href="${url}">${url}</a></br> 
					${lecteurTpl( url , 'audio-liste-note-'+index )}
					<div class="content-note-vocaux">${html}</div>` ) ;*/
			}
			//ceci est un note vocale 
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
