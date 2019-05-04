import { edittask } from './DOM' ; 
import { recordedTpltask } from '../libs/tpl';
import r from './recorder' ; 
import co from '../libs/config';

let obrecod = r() ; 
let config = co() ; 

export default function PAGE_EDITTASK( ID , url , text = '') {

  	let { btnAddNote , taskcontent , SaveAndNew , noteSave , notesCreation } = edittask() ;
    taskcontent.parent('tr').before( recordedTpltask(obrecod.recorder()) ) ; 
	//initialisation du DOM de l'application 
	let NOTEID = obrecod.init( ID , url ) ; 
	notesCreation.val('NOTEID::'+NOTEID+'::NOTEID') ;
	notesCreation.hide() ; 
	notesCreation.after('<textarea rows="7" class="default-input field-valid" cols="38 " name="localnotesvocal" id="localnotesvocal">'+text+'</textarea>')
	
	$('body').on('change','#localnotesvocal',function () {
		let value = $(this).val() ; 
		notesCreation.val( 'NOTEID::'+NOTEID+'::NOTEID '+"\n"+value ) ;
		console.log( value ) ; 
	})

	noteSave.on('click', () => {

		let formData = new FormData();
		//@todo : récupération de tout les notes et enregistrement se fait ici. 
		let url = config.PROT+'://'+config.URL+config.PORT+'/save/'+NOTEID+'?token='+navigator.userCookie + '&typeId='+config.CONFIG_PAGE.typeId  ; 
		fetch(url , {
		    method: 'POST',
		    headers: {
		      	'Accept': 'application/json',
                'Content-Type': 'application/json'
		    },
		    body: JSON.stringify({ type : 'task', text : '' , title : '' } )
		}) ;
	})
	SaveAndNew.on('click', () => {

		let formData = new FormData();
		//@todo : récupération de tout les notes et enregistrement se fait ici. 
		let url = config.PROT+'://'+config.URL+config.PORT+'/save/'+NOTEID+'?token='+navigator.userCookie + '&typeId='+config.CONFIG_PAGE.typeId  ; 
		fetch(url , {
		    method: 'POST',
		    headers: {
		      	'Accept': 'application/json',
                'Content-Type': 'application/json'
		    },
		    body: JSON.stringify({ type : 'task', text : '' , title : '' } )
		}) ;
	})
}