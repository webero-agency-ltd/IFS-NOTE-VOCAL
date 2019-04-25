//selction des dom qui est relier au recorder 
export function editnote() {
  	//selection du boutton qui permet d'ajouter des notes dans ifs
  	return {
  		btnAddNote : $('#template').parents('.fieldContainer')
  	}
}

//selection des dom de l'élement recorder 
export function recorder() {
  	//selection du boutton qui permet d'ajouter des notes dans ifs
  	return {
  		btnRun : $('#run-recorded') , 
  		btnDelete : $('#delete-recorded') , 
  		noteSave : $('#noteSave') , 
  		logoRecorder : $('#logo-recorded') , 
  		listenContent : $('#pre-ecoute-vocaux') , 
  	}
}