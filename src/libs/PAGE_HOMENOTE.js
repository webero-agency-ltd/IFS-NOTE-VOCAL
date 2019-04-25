
export default function editnote(length) {
  	//on est dans la page ou on liste tout les notes 
	//on ajoute le button "add note vocal" 
	var btnAddNote = document.querySelector('#TemplateId ~ input');
	if ( btnAddNote ) {
		$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+config.CONFIG_PAGE.contactId+'\' , {height: 730,width: 730})"  id="ifs-task-vocaux" class="inf-button btn" type="button" value="Ajouter note vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	//ajouter aussi dans add task vocal 
	var btnAddTask = document.querySelector('#Add_Task ~ input');
	if ( btnAddTask ) {
		$(btnAddTask).after( '<input onclick="openTask(\'?view=add&Task0ContactId='+config.CONFIG_PAGE.contactId+'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Ajouter tache vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	loadeNoteListe() ; 
}