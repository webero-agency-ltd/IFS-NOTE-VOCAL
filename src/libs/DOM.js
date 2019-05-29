export function edittask() {
    //selection du boutton qui permet d'ajouter des notes dans ifs
    return {
      taskcontent :$('#Task0ActionDescription_data') ,
      noteSave : $('#Save') , 
      SaveAndNew : $('#SaveAndNew') , 
      notesCreation : $('#Task0CreationNotes') , 
    }
}

//selction des dom qui est relier au recorder 
export function editnote() {
  	//selection du boutton qui permet d'ajouter des notes dans ifs
  	return {
  		btnAddNote : $('#template').parents('.fieldContainer'),  
      actionType : $('#actionType') , 
      sujet : $('#subject') , 
      noteSave : $('#noteSave') , 
  	}
}

//DOM de selection de trello 
export function trellodom() {
    //selection du boutton qui permet d'ajouter des notes dans ifs
    return {
      btnAddNote : $('.js-plugin-sections') ,  
      //actionType : $('#actionType') , 
      title : $('.js-card-detail-title-input') , 
      //noteSave : $('#noteSave') , 
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
      audioUpload : $('#audio-upload') , 
  		audioUploadBtn : $('#upload-file-btn') , 
  	}
}