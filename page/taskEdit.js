let vo = null

function selectTpl ( title ,option , id = "" , multiple = false ) {

    return `<tr id="content_${id}" >
        <td class="label-td">
            <label class="action-label" for="${id}">${title}</label></div>
        </td>
        <td class="field-td" id="Task0ActionDescription_data">
            <table cellpadding="0px" cellspacing="0px" border="0px">
                <tbody>
                    <tr>
                        <td>
                            <select ${multiple==true?'size="'+option.length+'"':''}  id="${id}" style="width:100%;max-height: 160px;" class="inf-select is-component" ${multiple==true?'multiple="multiple"':''}  name="${id}" data-on="Component.Select">
                                ${option}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>` ;

}

function areaTpl ( title ,value , id = "" ) {

    return `<tr id="content_${id}" >
        <td class="label-td">
            <label for="${id}">${title}</label></div>
        </td>
        <td class="field-td" id="Task0ActionDescription_data">
            <table cellpadding="0px" cellspacing="0px" border="0px">
                <tbody>
                    <tr>
                        <td>
                            <textarea id="${id}" class="fieldControlWidth fieldControlTextInputHeight clearable" name="${id}">${value}</textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>` ;

}

function inputTpl ( title ,value , id , placeholder = "" , text = "text" , min="" , max="" ) {
    return `<tr id="content_${id}" >
        <td class="label-td">
            <label for="${id}">${title}</label></div>
        </td>
        <td class="field-td" id="Task0ActionDescription_data">
            <table cellpadding="0px" cellspacing="0px" border="0px">
                <tbody>
                    <tr>
                        <td>
                            <input id="${id}" name="${id}" type="${text}" value="${value}" min="${min}" max="${max}" placeholder="${placeholder}" class="default" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>` ; 

}

async function dinamicForulaire(){
    //récupération de la valeur par défaut de forlulaire 
    let def = 'comptabilite';
    var sujet = $('#Task0ActionDescription') ; 
    if ( (navigator.task && navigator.task.id) || ( navigator.note && navigator.note.id ) ) {
        var [ err , app ] = await Api.fetch( '/api/form/'+(( navigator.note && navigator.note.id )?navigator.note.id:navigator.task.id) ) ;
        for( let { name , type , value } of app.data ) {
            console.log( '__________________________' )
            console.log( name , type , value )
            if ( name == "categorie-select" ) {
                def = value ; 
            }else if ( name == "vitesse-closing-select" && value ) {
                value = value.split(',') 
            }
            console.log( name , type , value )
            $('#'+name).val( value )
        }
    }
    //on cache tout d'abord les éléments inutilement de l'application
    showable( def )
    formateTitle( def , sujet ) ; 
    //changement des catégorie a afficher 
    $('body').on('input','#categorie-select',function ( e ) {
        def = $(this).val() ; 
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#autre',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#produit-select',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#commercial',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#sav',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#comptabilite',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#categorie-select',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#commercial_autre',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#sav_autre',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

    $('body').on('input','#comptabilite_autre',function ( e ) {
        showable( def )
        formateTitle( def , sujet ) ; 
    })

}

async function upload( NOTEID , file , save = true  ){
    setTimeout( async function() {
        vo.upload()
        let body = {
            unique : NOTEID ,
            application_id : navigator.app.id ,
            attache : 'task' ,
            type : 'infusionsoft' ,
            filenoteeditefile : true ,
        }

        if( (navigator.task && navigator.task.id) )
           body['update'] = true ; 

       if( (navigator.note && navigator.note.id) )
           body['note'] = navigator.note.id ; 

        file?body['file'] = true : body['file'] = false  ; 

        let [ err , post ] = await Api.fetch( ((navigator.note && navigator.note.id) ? '/api/note/convert':'/api/note') + (navigator.task&&navigator.task.id?'/'+navigator.task.id:'') , { 
            method : 'POST',
            headers : true , 
            body 
        })

        Event.emit('resetData')
        if ( !post ||( post && !post.data ) ||( post && post.data && !post.data.id ) ) {
            alert('une erreur est survenue')
            return !1;
        }

        console.log( post ) ; 
        let [ error , form ] = await Api.fetch( '/api/form/'+post.data.id , { 
            method : 'POST',
            headers : true , 
            body : { forms : JSON.stringify(FormValueFormate()) }
        })
        vo.stopUpload()

        console.log( body )
        console.log( form )
        console.log( error )
        console.log( post )
        /////////////////// 
        if ( post.data.id ) {
            if ( save ) {
                $('#noteSaveTemp').html('Save');
                $('#Save').trigger('click')
            }else{
                $('#noteSaveTemp').html('Save New');
                $('#SaveAndNew').trigger('click')
            }
        }
    }, 500);
}


function formuExtenssionTemplate( NOTEID ){
    /*notesCreation.val('NOTEID::'+NOTEID+'::NOTEID') ;
    notesCreation.hide() ; */
    var sujet = $('#Task0ActionDescription') ; 
    var notes =  $('#Task0CreationNotes') ; ;
    //ajoute du liste de titre du note pour facilité la selection 
    if ( !sujet.length ) 
        return !1;
    //ajoute desu autre différent input de selection 
    let sujetParent  =  $('#Task0ActionDescription_data').parent('tr') ; 
    let notesParent  = $('#Task0CreationNotes_data').parent('tr') ; // notes.parents('.fieldContainer') ; 
    //changer le style du titre 
    sujetParent.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
    notesParent.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
    //ajoute du valeur par défaut dans la descriptions du notes 
    notes.val( Api.url+'/read/'+NOTEID ) ; 
    if ( sujetParent ) {
        ///////////////////////////////////////////////////////////////
        //formulaire qui part dans la description a apartire d'ici 
        /////////////////////////////////////////////////////////////
        //formulaire de autre
        sujetParent.after( areaTpl( 'Objections' , '', 'plaisir') ) ;
        sujetParent.after( inputTpl( 'Motivation' , '', 'motivation' , '0 a 10' , 'number' ) ) ;
        sujetParent.after( areaTpl( 'Plaisir' , '', 'plaisir') ) ;
        let dm = '' ; 
        sujetParent.after( areaTpl('Douleur émotionnelle :' , dm, 'doemotion' ) ) ;
        let comment = '' ; 
        sujetParent.after( areaTpl('Commentaire :' , comment, 'comment' ) ) ;
        //formulaire de sav 
        let soncasArray = formPlace('soncasArray') ; 
        let soncas = soncasArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('SONCAS :' , soncas , 'soncas-select' , true ) ) ;
        let vitesseclosingArray = formPlace('vitesseclosingArray') ;
        let vitesseclosing = vitesseclosingArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('Vitesse Closing :' , vitesseclosing , 'vitesse-closing-select' , false ) ) ;        
        //formulaire de Produit 
        let produitArray = formPlace('produitArray') ; 
        let produit = produitArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('Produit :' , produit , 'produit-select' , false ) ) ;
        //formulaire de autre
        let other = '' ; 
        sujetParent.after( areaTpl('Autre :' , other, 'autre' ) ) ;
        //formulaire de sav
        let commercialArray = formPlace('commercialArray') ; 
        let commercial = commercialArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })  
        sujetParent.after( inputTpl( '' , '', 'commercial_autre' , 'Text commercial') ) ;
        sujetParent.after( selectTpl('Commercial :' , commercial , 'commercial' , false ) ) ;
        //formulaire de sav 
        let savArray = formPlace('savArray') ; 
        let sav = savArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })
        sujetParent.after( inputTpl( '' , '', 'sav_autre' , 'Text sav') ) ;
        sujetParent.after( selectTpl('SAV :' , sav , 'sav' , false ) ) ;
        //formulaire de Comptabilité 
        let comptabiliteArray = formPlace('comptabiliteArray') ;  
        let comptabilite = comptabiliteArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })
        sujetParent.after( inputTpl( '' , '', 'comptabilite_autre' , 'Text comptabilite' ) ) ;
        sujetParent.after( selectTpl('Comptabilité :' , comptabilite , 'comptabilite' , false ) ) ;
        //on ajoute la liste d'option des titres 
        let categorieArray = formPlace('categorieArray') ;
        let categorie = categorieArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })
        //sujet.val( 'Résumé après appel commercial Aumscan 4' )
        //change style pour le cacher 
        sujetParent.after( selectTpl('Catégorie ' , categorie , 'categorie-select' , false ) ) ;
        dinamicForulaire() ; 
    }

}

function placeTaskEditRecorder( ID ) {
    let taskcontent = $('#Task0ActionDescription_data') ;
    let noteSave = $('#Save') ;
    let SaveAndNew = $('#SaveAndNew') ;
    let notesCreation = $('#Task0CreationNotes') ;
    let init = Vocale.init( taskcontent.parent('tr') , function( tpl ){
        return `<tr class="h3-row"><td width="100%" colspan="99">${tpl}</td></tr>`; 
    });
	let note = null ; 
	let NOTEID = null ;
	let desable = true ; 
    listen.event()
	if ( !ID ) {
		NOTEID = makeid( 16 ) ; 
	} else{
        desable = false;
        if( navigator.note && navigator.note.id ){
            NOTEID = makeid( 16 ) ; 
            new listen( 'recordingsList' , Api.url+'/audio/'+navigator.note.unique , 'audio-liste-note-record' )
        }
        else{
            NOTEID = navigator.task.unique ; 
            new listen( 'recordingsList' , Api.url+'/audio/'+NOTEID , 'audio-liste-note-record' )
        }
	}
    console.log( NOTEID )
    vo = new Vocale()
    let file = false ; 
    //enregistrement terminer
    vo.recorder = function ( blob  ) {
        var url = URL.createObjectURL(blob);
        new listen( 'recordingsList' , url , 'audio-liste-note-record' )
        note = blob ; 
        $('#noteSaveTemp').attr('disabled',false)
        $('#SaveAndNewTemp').attr('disabled',false)
        Event.emit('resetData')
        setTimeout(function() { sendBlobToApp(blob,'noteeditefile'); }, 100);
    }

    Event.on('send_files_ok', ( data ) => {
        if( data == 'filenoteeditefile' )
            file = true ; 
    })

	SaveAndNew.hide() ; 
	noteSave.hide() ; 
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' class="inf-button btn primary button-save" id="noteSaveTemp">Save</button>' ) ; 
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' type="submit" id="SaveAndNewTemp" class="default-input button-save np inf-button">Save New</button>' ) ; 
    $('body').on('click','#noteSaveTemp', async ( e ) => {
        $('#noteSaveTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
        upload( NOTEID , file , true ) ;
    })

    $('body').on('click','#SaveAndNewTemp', async ( e ) => {
        $('#SaveAndNewTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
        upload( NOTEID , file , false ) ;
    })

    formuExtenssionTemplate( NOTEID )
}

async function initContent(){
    console.log( 'Task0ActionDescription_data')
    let { vocaux , ID , NOTEID , nativeId } = getParams(location.href)
    console.log( !vocaux && !ID , vocaux , ID , NOTEID , nativeId )
    if ( !vocaux && !ID && !NOTEID ) 
        return !1
    //récupération des informations de connexion
    let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
    let s = sdsd.exec(location.href);
    let contactId = s[1] ; 
    console.log( contactId)
    if ( !contactId ) 
        return
    var [ err , resp ] = await Api.fetch( '/api/application/check/ifs/'+encodeURIComponent( contactId ) ) ; 
    let app = resp.data ; 
    console.log( app ) ;
    if ( !app.id ) 
        return !1
    navigator.app = app ; 
    //récupération des valeurs des tache par défaut dans notre application 
    if ( ID ) {
        var [ err , note ] = await Api.fetch( '/api/note?native_id='+ID ) ; 
        console.log( '---TASK DATA' ) ;
        console.log( navigator.task ) ;
        navigator.task = note.data ;
        if ( (!navigator.task || (navigator.task && !navigator.task.id)) && !vocaux ) {
            return !1
        }
        console.log( '/infusionsoft/task/'+ID +'/?appId='+navigator.app.id )
        var [ err , native ] = await Api.fetch( '/api/infusionsoft/task/'+navigator.app.id+'/'+ID ) ; 
        console.log( native )
        if ( !native || !native.data.contact || !native.data.contact.id ) 
            return !1
        navigator.task['contact_id'] = native.data.contact.id ; 
    }else if ( NOTEID ) {
        ID = nativeId ; 
        //récupération des informations des notes 
        var [ err , note ] = await Api.fetch( '/api/note?native_id='+nativeId ) ; 
        navigator.note = note.data ;
        console.log( navigator.note , '/note/nativeId/'+nativeId+'/note' )
        if ( (!navigator.note || (navigator.note && !navigator.note.id)) && !vocaux ) {
            return !1
        }
    }
    placeTaskEditRecorder( ID ) ; 
}

let ready = false ; 
$( function () {
    Event.on('IntiAppData',async function( request ){
        if ( !ready ) {
            ready = true ; 
            initContent() ; 
        }
    })
    chrome.runtime.connect();
});
