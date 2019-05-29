import co from './config';
import loadeNoteListe from './loadeNoteListe';

let config = co() ; 
export default function homenote() { 
	console.log(' HOME NOTE ADD BUTTON ') ; 
  	//on est dans la page ou on liste tout les notes 
	//on ajoute le button "add note vocal" 
	var btnAddNote = document.querySelector('#TemplateId ~ input');
	if ( btnAddNote ) {
		$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+config.contactId+'\' , {height: 730,width: 730})"  id="ifs-task-vocaux" class="inf-button btn" type="button" value="Ajouter note vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	//ajouter aussi dans add task vocal 
	var btnAddTask = document.querySelector('#Add_Task ~ input');
	if ( btnAddTask ) {
		$(btnAddTask).after( '<input onclick="openTask(\'?view=add&Task0ContactId='+config.contactId+'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Ajouter tache vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	loadeNoteListe() ; 
}