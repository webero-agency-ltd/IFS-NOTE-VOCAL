let contactId = null ; 
/*
 * fonction dans les pages qui liste les notes
 * pour pouvoire ajouter ajouter le button add note vocale 
*/
function placeButton() { 
  	//on est dans la page ou on liste tout les notes 
	//on ajoute le button "add note vocal" 
	var btnAddNote = document.querySelector('#TemplateId ~ input');
	if ( btnAddNote ) {
		$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+ contactId +'\' , {height: 730,width: 730})"  id="ifs-task-vocaux" class="inf-button btn" type="button" value="Ajouter note vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	//ajouter aussi dans add task vocal 
	var btnAddTask = document.querySelector('#Add_Task ~ input');
	if ( btnAddTask ) {
		$(btnAddTask).after( '<input onclick="openTask(\'?view=add&Task0ContactId='+ contactId +'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Ajouter tache vocale">' ) 
		//écoute lors du clicque sur l'élement 	
	}
	/*
	 * Dans le modale ovrire show note all  
	*/
	var btnAddNote = document.querySelector('#TemplateId_select ~ input ');
	if ( btnAddNote ) {
		$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+ contactId +'\' , {height: 730,width: 730})" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Add Vocal Note">' ) 
		//écoute lors du clicque sur l'élement 	
	}
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
	//récupération de tout les notes de cette infusionsoft 
	var [ err , note ]  = await Api.get( '/notes/'+app.id )
	console.log( app ) ; 
	console.log( note ) ; 
	placeButton() ; 

}

$( function () {
    /*var X3U;
    X3U = "";
    setInterval(function () {
        if ($(location)["attr"]('href') != X3U) {
            X3U = $(location)["attr"]("href");
            initContent();
        }
    }, 500);*/
    initContent() ; 
});
