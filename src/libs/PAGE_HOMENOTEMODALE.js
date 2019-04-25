
export default function editnote(length) {
  	//on est dans la page ou on liste tout les notes 
	//on ajoute le button "add note vocal" 
	var btnAddNote = document.querySelector('#TemplateId_select ~ input ');
	if ( btnAddNote ) {
		$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+config.CONFIG_PAGE.contactId+'\' , {height: 730,width: 730})" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Add Vocal Note">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	loadeNoteListe() ;
}