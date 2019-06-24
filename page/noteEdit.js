function selectTpl( title ,option , id = "" , multiple = false ) {

	return  `<div class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	        <select ${multiple==true?'size="'+option.length+'"':''}  id="${id}" style="width:100%;max-height: 160px;" class="inf-select is-component" ${multiple==true?'multiple="multiple"':''}  name="${id}" data-on="Component.Select">
	        	${option}
	        </select>
	    </div>
	</div>` ; 

}

function areaTpl( title ,value , id = "" ) {

	return  `<div class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label-area" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	        <textarea id="${id}" class="fieldControlWidth fieldControlTextInputHeight clearable" name="${id}">${value}</textarea>
	    </div>
	</div>` ; 

}

function dinamicForulaire(){
	//écoute le changement de l'un de ces element pour faire le formatage du text dans infusionnote description
	$('body').on('input','#comment',function ( e ) {
		//si on ajoute ou éfface une commentaire 
		comment = $(this).val() ; 
		formatDesc( NOTEID , selectSoncas , selectProduit , comment ,selectClosin ) ; 
	})
	$('body').on('input','#produit-select',function ( e ) {
		//si on select ou désélect un produit 
		selectProduit  = $(this).val() ; 
		formatDesc( NOTEID , selectSoncas , selectProduit , comment ,selectClosin ) ; 
	})
	$('body').on('input','#soncas-select',function ( e ) {
		//si on select ou désélect un soncas 
		selectSoncas  = $(this).val() ; 
		formatDesc( NOTEID , selectSoncas , selectProduit , comment ,selectClosin ) ; 
	})
	$('body').on('input','#closing-select',function ( e ) {
		selectClosin = $(this).val() ; 
		formatDesc( NOTEID , selectSoncas , selectProduit , comment ,selectClosin ) ; 
	})
	formatDesc( NOTEID , selectSoncas , selectProduit , comment , selectClosin ) ; 
	//récupération des informations du notes infuionsoft 
	let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
	url = url+'/infusionsoft/note/'+config.contactId+'?token='+navigator.userCookie + '&appId='+navigator.appId  ; 
	$on('check_note_app_response',function ( data ) {
		if ( data && data.contact_id ) {
			sujetParent.after( '<input onclick="openTask(\'?view=add&Task0ContactId='+data.contact_id+'&NOTEID='+NOTEID+'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Convertire en tache vocal">' ) 
		}
	})
	$emit( 'check_note_app', url )
}

function formuExtenssionTemplate(){

	var btnAddNote = $('#template').parents('.fieldContainer') ; 
  	var actionType = $('#actionType') ; 
  	var sujet = $('#subject') ; 
  	var noteSave = $('#noteSave') ;

  	console.log( btnAddNote )

	//ici on fait la modification des valeurs boutton 
	actionType.html('<option>Message Vocal</option>') 
	
	//ajoute du liste de titre du note pour facilité la selection 
	if ( !sujet.length ) 
		return !1;

	//changer le style du titre 
	sujet.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
	//ajoute desu autre différent input de selection 
	let sujetParent  = sujet.parents('.fieldContainer') ; 
	
	if ( sujetParent ) {

		//on ajoute la liste d'option des titres 
		let categorie = `<option selected="selected" value="0">COMPTABILITE</option>
				<option value="1">SAV</option>
				<option value="3">COMMERCIAL</option>
				<option value="4">AUTRE</option>`;
		//sujet.val( 'Résumé après appel commercial Aumscan 4' )
		//change style pour le cacher 
		sujetParent.after( selectTpl('Catégorie ' , categorie , 'categorie-select' , true ) ) ;

		//formulaire de Produit 
		let produit = `<option selected="selected" value="0">Aumscan 4</option>
			<option value="1">Aumscan 3</option>
			<option value="3">Cardiaum</option>
			<option value="4">TQ2022</option>
			<option value="5">Coloraum</option>`
		sujetParent.after( selectTpl('Produit :' , produit , 'produit-select' , false ) ) ;

		//formulaire de Comptabilité 
		let comptabilite = `<option selected="selected" value="0">Envoyer document</option>
			<option value="1">Vérifier paiement</option>
			<option value="2">Gérer impayé</option>
			<option value="3">Autre (Input Texte libre)</option>`
		sujetParent.after( selectTpl('Comptabilité :' , comptabilite , 'produit-select' , false ) ) ;

		//formulaire de sav 
		let sav = `<option selected="selected" value="0">Installation logiciel</option>
			<option value="1">Intervention</option>
			<option value="2">Autre (Input Texte libre)</option>`
		sujetParent.after( selectTpl('SAV :' , sav , 'produit-select' , false ) ) ;

		//formulaire de sav 
		let commercial = `<option selected="selected" value="0">Envoyer devis</option>
			<option value="1">Relancer</option>
			<option value="2">Closer</option>
			<option value="3">Résumé après appel</option>
			<option value="4">Résumé après présentation</option>
			<option value="5">Envoyer document</option>
			<option value="6">Autre (Input Texte libre)</option>`
		sujetParent.after( selectTpl('Commercial :' , commercial , 'produit-select' , false ) ) ;

		//formulaire de autre
		let other = '' ; 
		sujetParent.after( areaTpl('Autre :' , other, 'autre' ) ) ;

		///////////////////////////////////////////////////////////////
		//formulaire qui part dans la description a apartire d'ici 
		/////////////////////////////////////////////////////////////
		//formulaire de sav 
		let soncas = `<option selected="selected" value="0">Sécurité</option>
			<option value="1">Orgueil</option>
			<option value="2">Nouveauté</option>
			<option value="3">Confort</option>
			<option value="4">Argent</option>
			<option value="5">Sympathie</option>`
		sujetParent.after( selectTpl('SONCAS :' , soncas , 'soncas-select' , false ) ) ;

		let vitesseclosing = `<option selected="selected" value="0">V1 (Rapide)</option>
			<option value="1">V2 (Moyen)</option>
			<option value="2">V3 (Lent)</option>`
		sujetParent.after( selectTpl('Vitesse Closing :' , vitesseclosing , 'soncas-select' , false ) ) ;

		//formulaire de autre
		let dm = '' ; 
		sujetParent.after( areaTpl('Douleur émotionnelle :' , dm, 'autre' ) ) ;

		let comment = '' ; 
		sujetParent.after( areaTpl('Commentaire :' , comment, 'autre' ) ) ;

	}

	//écoute le changement de l'input titre et s'il y a de quelconque modification, on fait le changement 
	//de l'input d'origine 
	$('body').on('change','#subject-title',function ( e ) {
		var index = $(this).val() ; 
		if ( dataTitle[index] ) {
			generaleTitle = dataTitle[index];
			sujet.val( dataTitle[index] )
		}
	})

}

function placeNoteEditRecorder() {

  	let btnAddNote = $('#template').parents('.fieldContainer') ; 
    let actionType = $('#actionType') ; 
    let sujet = $('#subject') ; 
    let noteSave = $('#noteSave') ; 
	let init = Vocale.init( btnAddNote ) ;
	let note = null ; 
	let NOTEID = null ;
	let ID = null ;
	//@todo: Récupération des notes, s'il n'est pas dans la base de donner ou s'il y a l'ID de 
	//ce note dans la base de donner 
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
        Event.emit('resetData')
    	setTimeout(function() {
    		sendBlobToApp(blob);
    	}, 500);
    }

	noteSave.hide() ; 
	//@todo : changer cette varraible si on fait la modification des notes 
	let desable = true ; 

	//on clique sur l'enregistrement de note 
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' class="inf-button btn primary button-save" id="noteSaveTemp">Save</button>' ) ; 
	
	$('body').on('click','#noteSaveTemp', async ( e ) => {
        $('#noteSaveTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
	    vo.upload()
		setTimeout( async function() {
			let url = '/upload?' ; 
	        url += 'NOTEID='+NOTEID
	        url += '&type=infusionsoft' 
	        url += '&appId='+navigator.app.id
	        url += '&attache=note' 
	        url += '&text='+'generaleNote'
	        url += '&title='+'generaleTitle'
			let [ err , post ] = await Api.post( url , { 
				body : {
					file : true
				},
				type : 'formData'
			})
	        //url += '&text='+generaleNote
	        //url += '&title='+generaleTitle
	        vo.stopUpload()
	        console.log( post )
	        if ( post.id ) {
	        	$('#noteSaveTemp').html('Save');
	        	noteSave.trigger('click')
			}
		}, 500);
    })

    formuExtenssionTemplate()

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
	if ( ! app.id ) 
		return !1
	navigator.app = app ; 
	placeNoteEditRecorder() ; 
}

$( function () {
    initContent() ; 
});
