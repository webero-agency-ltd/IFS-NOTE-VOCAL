
function placeNoteEditRecorder( ID , text='' ) {
    let taskcontent = $('#Task0ActionDescription_data') ;
    let noteSave = $('#Save') ;
    let SaveAndNew = $('#SaveAndNew') ;
    let notesCreation = $('#Task0CreationNotes') ;
    let init = Vocale.init( taskcontent.parent('tr') , function( tpl ){
        return `<tr class="h3-row"><td width="100%" colspan="99">${tpl}</td></tr>`; 
    });
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
        Event.emit('resetData')
        setTimeout(function() {
            sendBlobToApp(blob);
        }, 500);
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
            let url = '/upload?' ; 
            url += 'NOTEID='+NOTEID
            url += '&type=infusionsoft' 
            url += '&attache=task' 
            url += '&appId='+navigator.app.id
            url += '&text='
            url += '&title='
            let [ err , post ] = await Api.post( url , { 
                body : {
                    file : true
                },
                type : 'formData'
            })
            console.log( post )
            if ( post.id ) {
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
    		let url = '/upload?' ; 
            url += 'NOTEID='+NOTEID
            url += '&type=infusionsoft' 
            url += '&attache=task' 
            url += '&appId='+navigator.app.id
            url += '&text='
            url += '&title='
            let [ err , post ] = await Api.post( url , { 
                body : {
                    file : true
                },
                type : 'formData'
            })
            console.log( post )
            if ( post.id ) {
                $('#noteSaveTemp').html('Save New');
                SaveAndNew.trigger('click')
            }
        }, 500);
    })
}

async function initContent(){
    let { vocaux } = getParams(location.href)
    if ( !vocaux ) 
        return !1
    //récupération des informations de connexion
    let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
    let s = sdsd.exec(location.href);
    let contactId = s[1] ; 
    if ( !contactId ) 
        return
    var [ err , app ] = await Api.get( '/application/check/'+encodeURIComponent( contactId )+'/infusionsoft' ) ; 
    if ( !app.id ) 
        return !1

    console.log( app )
    navigator.app = app ; 
    placeNoteEditRecorder() ; 
}

$( function () {
    initContent() ; 
});
