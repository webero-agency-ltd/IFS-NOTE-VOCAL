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

function inputTpl ( title ,value , id , placeholder = "" ) {
    return `<tr id="content_${id}" >
        <td class="label-td">
            <label for="${id}">${title}</label></div>
        </td>
        <td class="field-td" id="Task0ActionDescription_data">
            <table cellpadding="0px" cellspacing="0px" border="0px">
                <tbody>
                    <tr>
                        <td>
                            <input id="${id}" name="${id}" type="text" value="${value}" placeholder="${placeholder}" class="default" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>` ; 

}

function formateTitle(e){
    let title = e.toUpperCase()+' '+$('#produit-select').val()+' - '+( $('#'+e).val() !== '_____' ? $('#'+e).val() : $('#'+e+'_autre').val() ); 
    var sujet = $('#Task0ActionDescription') ; 
    sujet.val( title ) ;
    console.log( title ) 
}

function showable( def ){
    let el = ['comptabilite' , 'sav' , 'commercial' , 'autre']
    for( let e of el ){
        if ( def==e ) {
            $( '#content_'+e ).show()
            if ( $( '#'+e ).val() =='_____' ) {
                $( '#content_'+e+'_autre' ).show()
            }else{
                $( '#content_'+e+'_autre' ).hide()
            }
        }else{
            $( '#content_'+e ).hide()
            $( '#content_'+e+'_autre' ).hide()
        }
    }
}

async function dinamicForulaire(){
    //récupération de la valeur par défaut de forlulaire 
    let def = 'comptabilite';
    if ( navigator.note && navigator.note.id ) {
        var [ err , app ] = await Api.get( '/form/'+navigator.note.id ) ;
        for( let { NoteId , name , type , value } of app ) {
            console.log( '__________________________' )
            console.log( NoteId , name , type , value )
            $('#'+name).val( value )
            if ( name == "categorie-select" ) {
                def = value ; 
            }
        }
    }
    //on cache tout d'abord les éléments inutilement de l'application
    showable( def )
    formateTitle( def ) ; 
    //changement des catégorie a afficher 
    $('body').on('input','#categorie-select',function ( e ) {
        def = $(this).val() ; 
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#produit-select',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#commercial',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#sav',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#comptabilite',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#categorie-select',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#commercial_autre',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#sav_autre',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

    $('body').on('input','#comptabilite_autre',function ( e ) {
        showable( def )
        formateTitle( def ) ; 
    })

}

async function upload( NOTEID , file , save = true  ){
    setTimeout( async function() {
        vo.upload()
        let url = '/upload?' ; 
        url += 'NOTEID='+NOTEID
        url += '&type=infusionsoft' 
        url += '&attache=task' 
        url += '&appId='+navigator.app.id
        url += '&text='
        url += '&title='
        if ( navigator.note && navigator.note.id ) {
            url += '&update='+true
        }
        if ( file ) {
            url += '&file='+true
        }else{
            url += '&file='+false
        }
        let [ err , post ] = await Api.post( url , { 
            body : {
                file : true
            },
            type : 'formData'
        })
        vo.stopUpload()

        let urlForm = '/form/'+post.id ; 
        console.log( 'Upload a formulaire' , urlForm )
        let body = [] ; 
        let doemotion = $('#doemotion').val()
        body = [ ...body , { type : 'text' , name : 'doemotion' , value : doemotion } ]
        let autre = $('#autre').val()
        document.getElementById( 'autre')
        console.log( autre )
        console.log( autre )
        console.log( autre )
        console.log( autre )
        console.log( autre )
        body = [ ...body , { type : 'text' , name : 'autre' , value : autre } ]
        let vitesse_closing_select = $('#vitesse-closing-select').val()
        body = [ ...body , { type : 'text' , name : 'vitesse-closing-select' , value : vitesse_closing_select } ]
        let soncas_select = $('#soncas-select').val()
        body = [ ...body , { type : 'text' , name : 'soncas-select' , value : soncas_select } ]
        let produit_select = $('#produit-select').val()
        body = [ ...body , { type : 'text' , name : 'produit-select' , value : produit_select } ]
        let commercial_autre = $('#commercial_autre').val()
        body = [ ...body , { type : 'text' , name : 'commercial_autre' , value : commercial_autre } ]
        let commercial = $('#commercial').val()
        body = [ ...body , { type : 'text' , name : 'commercial' , value : commercial } ]
        let sav_autre = $('#sav_autre').val()
        body = [ ...body , { type : 'text' , name : 'sav_autre' , value : sav_autre } ]
        let sav = $('#sav').val()
        body = [ ...body , { type : 'text' , name : 'sav' , value : sav } ]
        let comptabilite_autre = $('#comptabilite_autre').val()
        body = [ ...body , { type : 'text' , name : 'comptabilite_autre' , value : comptabilite_autre } ]
        let comptabilite = $('#comptabilite').val()
        body = [ ...body , { type : 'text' , name : 'comptabilite' , value : comptabilite } ]
        let categorie_select = $('#categorie-select').val()
        body = [ ...body , { type : 'text' , name : 'categorie-select' , value : categorie_select } ]
        let comment = $('#comment').val()
        body = [ ...body , { type : 'text' , name : 'comment' , value : comment } ]
        let [ error , form ] = await Api.post( urlForm , { 
            body : { data : body } , 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        console.log( body )
        console.log( form )
        console.log( error )
        console.log( post )
        /////////////////// 
        if ( post.id ) {
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
    notes.val( Api.url+'/note/u/'+NOTEID ) ; 
    if ( sujetParent ) {
        ///////////////////////////////////////////////////////////////
        //formulaire qui part dans la description a apartire d'ici 
        /////////////////////////////////////////////////////////////
        //formulaire de autre
        let dm = '' ; 
        sujetParent.after( areaTpl('Douleur émotionnelle :' , dm, 'doemotion' ) ) ;
        let comment = '' ; 
        sujetParent.after( areaTpl('Commentaire :' , comment, 'comment' ) ) ;
        //formulaire de sav 
        let soncasArray = [
            {value : 0 , key : 'Sécurité'} , 
            {value : 1 , key : 'Orgueil'} , 
            {value : 2 , key : 'Nouveauté'} , 
            {value : 3 , key : 'Confort'} , 
            {value : 4 , key : 'Argent'} , 
            {value : 5 , key : 'Sympathie'} , 
        ] ; 
        let soncas = soncasArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('SONCAS :' , soncas , 'soncas-select' , false ) ) ;
        let vitesseclosingArray = [
            {value : 0 , key : 'V1 (Rapide)'} , 
            {value : 1 , key : 'V2 (Moyen)'} , 
            {value : 2 , key : 'V3 (Lent)'} , 
        ] ; 
        let vitesseclosing = vitesseclosingArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('Vitesse Closing :' , vitesseclosing , 'vitesse-closing-select' , false ) ) ;        
        //formulaire de Produit 
        let produitArray = [
            {value : 'Aumscan 4' , key : 'Aumscan 4'} , 
            {value : 'Aumscan 3' , key : 'Aumscan 3'} , 
            {value : 'Cardiaum' , key : 'Cardiaum'} , 
            {value : 'TQ2022' , key : 'TQ2022'} , 
            {value : 'Coloraum' , key : 'Coloraum'} , 
        ] ; 
        let produit = produitArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        }) 
        sujetParent.after( selectTpl('Produit :' , produit , 'produit-select' , false ) ) ;
        //formulaire de autre
        let other = '' ; 
        sujetParent.after( areaTpl('Autre :' , other, 'autre' ) ) ;
        //formulaire de sav
        let commercialArray = [
            {value : 'Envoyer devis' , key : 'Envoyer devis'} , 
            {value : 'Relancer' , key : 'Relancer'} , 
            {value : 'Closer' , key : 'Closer'} , 
            {value : 'Résumé après appel' , key : 'Résumé après appel'} , 
            {value : 'Résumé après présentation' , key : 'Résumé après présentation'} , 
            {value : 'Envoyer document' , key : 'Envoyer document'} , 
            {value : '_____' , key : 'Autre (Input Texte libre)'} , 
        ] ; 
        let commercial = commercialArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })  
        sujetParent.after( inputTpl( '' , '', 'commercial_autre' , 'Text commercial') ) ;
        sujetParent.after( selectTpl('Commercial :' , commercial , 'commercial' , false ) ) ;
        //formulaire de sav 
        let savArray = [
            {value : 'Installation logiciel' , key : 'Installation logiciel'} , 
            {value : 'Intervention' , key : 'Intervention'} , 
            {value : '_____' , key : 'Autre (Input Texte libre)'} , 
        ] ; 
        let sav = savArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })
        sujetParent.after( inputTpl( '' , '', 'sav_autre' , 'Text sav') ) ;
        sujetParent.after( selectTpl('SAV :' , sav , 'sav' , false ) ) ;
        //formulaire de Comptabilité 
        let comptabiliteArray = [
            {value : 'Envoyer document' , key : 'Envoyer document'} , 
            {value : 'Vérifier paiement' , key : 'Vérifier paiement'} , 
            {value : 'Gérer impayé' , key : 'Gérer impayé'} , 
            {value : '_____' , key : 'Autre (Input Texte libre)'} , 
        ] ; 
        let comptabilite = comptabiliteArray.map(({ value , key })=>{
            return `<option value="${value}">${key}</option>`;
        })
        sujetParent.after( inputTpl( '' , '', 'comptabilite_autre' , 'Text comptabilite' ) ) ;
        sujetParent.after( selectTpl('Comptabilité :' , comptabilite , 'comptabilite' , false ) ) ;
        //on ajoute la liste d'option des titres 
        let categorieArray = [
            {value : 'comptabilite' , key : 'COMPTABILITE'} , 
            {value : 'sav' , key : 'SAV'} , 
            {value : 'commercial' , key : 'COMMERCIAL'} , 
            {value : 'autre' , key : 'AUTRE'} , 
        ] ; 
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
		NOTEID = navigator.note.unique ; 
        setTimeout(async function() {
            let [ err , post ] = await Api.get( '/note/nativeId/'+ID )
            if( post.unique ){
                new listen( 'recordingsList' , Api.url+'/audio/'+post.unique , 'audio-liste-note-record' )
            }
        }, 1000);
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
        setTimeout(function() {
            sendBlobToApp(blob);
            file = true ; 
        }, 500);
    }
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
    let { vocaux , ID } = getParams(location.href)
    console.log( !vocaux && !ID , vocaux , ID )
    if ( !vocaux && !ID  ) 
        return !1
    //récupération des informations de connexion
    let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
    let s = sdsd.exec(location.href);
    let contactId = s[1] ; 
    console.log( contactId)
    if ( !contactId ) 
        return
    var [ err , app ] = await Api.get( '/application/check/'+encodeURIComponent( contactId )+'/infusionsoft' ) ; 
    console.log( app )
    if ( !app.id ) 
        return !1
    navigator.app = app ; 
    //récupération des valeurs des tache par défaut dans notre application 
    if ( ID ) {
        var [ err , note ] = await Api.get( '/note/nativeId/'+ ID ) ; 
        navigator.note = note ;
        if ( (!navigator.note || (navigator.note && !navigator.note.id)) && !vocaux ) {
            return !1
        }
        console.log( '/infusionsoft/task/'+ID +'/?appId='+navigator.app.id )
        var [ err , native ] = await Api.get( '/infusionsoft/task/'+ID +'/?appId='+navigator.app.id ) ; 
        console.log( native )
        if ( !native || !native.contact || !native.contact.id ) 
            return !1
        navigator.note['contact_id'] = native ['contact_id'] ; 
    }
    placeTaskEditRecorder( ID ) ; 
}

$( function () {
    initContent() ; 
});
