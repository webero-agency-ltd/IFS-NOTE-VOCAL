import { edittask } from './DOM' ; 
import { recordedTpltask } from '../libs/tpl';
import co from '../libs/config';
import Vocale from '../libs/vocale';
import listen from '../libs/listen';
import makeid from './makeid';

let config = co() ; 

export default function PAGE_EDITTASK( ID , url , text = '') {

  	let { btnAddNote , taskcontent , SaveAndNew , noteSave , notesCreation } = edittask() ;
    let init = Vocale.init( taskcontent.parent('tr') ) ;
	let note = null ; 
	let NOTEID = null ;
	let desable = false ; 
	if ( !ID ) {
		desable = true
	}
	if ( !ID ) {
		NOTEID = makeid( 16 ) ; 
	} else{
		NOTEID = ID ; 
	}
    let vo = new Vocale()
    //enregistrement terminer
    vo.recorder = function ( blob  ) {
        var url = URL.createObjectURL(blob);
        new listen( 'recordingsList' , url , 'audio-liste-note-record' )
        note = blob ; 
        $('#noteSaveTemp').attr('disabled',false)
        $('#SaveAndNewTemp').attr('disabled',false)
    }

	notesCreation.val('NOTEID::'+NOTEID+'::NOTEID') ;
	notesCreation.hide() ; 
	SaveAndNew.hide() ; 
	notesCreation.after('<textarea rows="7" class="default-input field-valid" cols="38 " name="localnotesvocal" id="localnotesvocal">'+text+'</textarea>')
	$('body').on('change','#localnotesvocal',function () {
		let value = $(this).val() ; 
		notesCreation.val( 'NOTEID::'+NOTEID+'::NOTEID '+"\n"+value ) ;
		console.log( value ) ; 
	})
	noteSave.hide() ; 
    noteSave.before( '<input '+(desable?'disabled="disabled"':'')+' class="inf-button btn primary button-save" id="noteSaveTemp" name="Save" type="submit" value="Save">' ) ; 
    noteSave.before( '<input '+(desable?'disabled="disabled"':'')+' value="Save &amp; New" type="submit" id="SaveAndNewTemp" class="default-input button-save np inf-button" name="SaveAndNew">' ) ; 

    $('body').on('click','#noteSaveTemp', async ( e ) => {
		e.preventDefault() ;
		e.stopPropagation() ;
		let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
		url = url+'/upload?token='+navigator.userCookie + '&typeId='+config.typeId  ; 
		console.log( url ) ;
		let formData = new FormData();
        formData.append('file', note );
        url += 'token='+navigator.userCookie
        url += '&NOTEID='+NOTEID
        url += '&type=infusionsoft' 
        url += '&appId='+navigator.appId
        url += '&text='
        url += '&title='
        let upload = await fetch( url , {
            method: 'POST',
            headers: {
                //'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        if ( upload.ok ) {
        	noteSave.trigger('click')
        }
    })

    $('body').on('click','#SaveAndNewTemp', async ( e ) => {
		e.preventDefault() ;
		e.stopPropagation() ;
		let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
		url = url+'/upload?token='+navigator.userCookie + '&typeId='+config.typeId  ; 
		console.log( url ) ;
		let formData = new FormData();
        formData.append('file', note );
        url += 'token='+navigator.userCookie
        url += '&NOTEID='+NOTEID
        url += '&type=infusionsoft' 
        url += '&appId='+navigator.appId
        url += '&text='
        url += '&title='
        let upload = await fetch( url , {
            method: 'POST',
            headers: {
                //'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        if ( upload.ok ) {
        	SaveAndNew.trigger('click')
        }
    })

}