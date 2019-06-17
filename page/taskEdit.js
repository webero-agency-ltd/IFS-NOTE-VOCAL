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
        setTimeout(function() {
            let base = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
            new listen( 'recordingsList' , base+'/audio/'+ID , 'audio-liste-note-record' )
        }, 1000);
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
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' class="inf-button btn primary button-save" id="noteSaveTemp">Save</button>' ) ; 
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' type="submit" id="SaveAndNewTemp" class="default-input button-save np inf-button">Save New</button>' ) ; 

    $('body').on('click','#noteSaveTemp', async ( e ) => {
        $('#noteSaveTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
        setTimeout( async function() {
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
                $('#noteSaveTemp').html('Save');
            	noteSave.trigger('click')
            }
        }, 500);
    })

    $('body').on('click','#SaveAndNewTemp', async ( e ) => {
        $('#SaveAndNewTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
        setTimeout( async function() {
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
                $('#noteSaveTemp').html('Save New');
            	SaveAndNew.trigger('click')
            }
        }, 500);
    })

}