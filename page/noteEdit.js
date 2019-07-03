let nativeId = null ; 

function selectTpl( title ,option , id = "" , multiple = false ) {
	return  `<div id="content_${id}" class="fieldContainer fieldContainerMargin">
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
	return  `<div id="content_${id}" class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label-area" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	        <textarea id="${id}" class="fieldControlWidth fieldControlTextInputHeight clearable" name="${id}">${value}</textarea>
	    </div>
	</div>` ; 
}

function inputTpl ( title ,value , id , placeholder = "" ) {
	return  `<div id="content_${id}" class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label-area" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	    	<input id="${id}" name="${id}" type="text" value="${value}" placeholder="${placeholder}" class="default" />
	    </div>
	</div>` ; 
}


function formateTitle(e){
	let title = e.toUpperCase()+' '+$('#produit-select').val()+' - '+( $('#'+e).val() !== '_____' ? $('#'+e).val() : $('#'+e+'_autre').val() ); 
  	$('#subject').val( title ) ;
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
			if ( name == "categorie-select" ) {
				def = value ; 
			}else if ( name == "vitesse-closing-select" && value ) {
				value = value.split(',') 
			}
			console.log( NoteId , name , type , value )
			$('#'+name).val( value )

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

function formuExtenssionTemplate( NOTEID ){

	var btnAddNote = $('#template').parents('.fieldContainer') ; 
  	var actionType = $('#actionType') ; 
  	var sujet = $('#subject') ; 
  	var noteSave = $('#noteSave') ;
  	var notes = $('#notes') ;
  	console.log( btnAddNote )
	//ici on fait la modification des valeurs boutton 
	actionType.html('<option>Message Vocal</option>') 
	//ajoute du liste de titre du note pour facilité la selection 
	if ( !sujet.length ) 
		return !1;
	//ajoute desu autre différent input de selection 
	let sujetParent  = sujet.parents('.fieldContainer') ; 
	let notesParent  = notes.parents('.fieldContainer') ; 
	//changer le style du titre 
	sujetParent.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
	notesParent.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
	//ajoute du valeur par défaut dans la descriptions du notes 
	notes.val( Api.url+'/read/'+NOTEID ) ; 
	if ( sujetParent ) {
		navigator.note&&navigator.note.id?sujetParent.after( '<input onclick="openTask(\'?view=add&Task0ContactId='+navigator.note.contact_id+'&NOTEID='+NOTEID+'&nativeId='+nativeId+'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Convertire en tache vocal">' ):''
		///////////////////////////////////////////////////////////////
		//formulaire qui part dans la description a apartire d'ici 
		/////////////////////////////////////////////////////////////
		//formulaire de autre
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

function placeNoteEditRecorder( ID ) {

  	let btnAddNote = $('#template').parents('.fieldContainer') ; 
    let actionType = $('#actionType') ; 
    let sujet = $('#subject') ; 
    let noteSave = $('#noteSave') ; 
	let init = Vocale.init( btnAddNote ) ;
	let note = null ; 
	let desable = true ; 
	let NOTEID = null ;
  	listen.event()
	//@todo: Récupération des notes, s'il n'est pas dans la base de donner ou s'il y a l'ID de 
	//ce note dans la base de donner 
	if ( !ID ) {
		NOTEID = makeid( 16 ) ; 
	} else{
		desable = false;
		NOTEID = navigator.note.unique ; 
		setTimeout(async function() {
			let [ err , post ] = await Api.get( '/note/nativeId/'+ID+'/note' )
			if( post.unique ){
        		new listen( 'recordingsList' , Api.url+'/audio/'+post.unique , 'audio-liste-note-record' )
			}
        }, 1000);
	}
	console.log( NOTEID )
    let vo = new Vocale()
    let file = false ; 
    //enregistrement terminer
    vo.recorder = function ( blob  ) {
        var url = URL.createObjectURL(blob);
        new listen( 'recordingsList' , url , 'audio-liste-note-record' )
        note = blob ; 
        $('#noteSaveTemp').attr('disabled',false)
        Event.emit('resetData')
    	setTimeout(function() {
    		sendBlobToApp(blob);
    		file = true ; 
    	}, 500);
    }
	noteSave.hide() ; 
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
	        url += '&text='+''
	        url += '&title='+''
	        if ( ID ) {
	        	console.log( ID )
	        	url += '&update='+true
	        }
	        if ( file ) {
	        	url += '&file='+true
	        }else{
	        	url += '&file='+false
	        }
	        console.log('START PLOAD' , url )
			let [ err , post ] = await Api.post( url , { 
				body : {
					file : true , 
				},
				type : 'formData'
			})
	        //url += '&text='+generaleNote
	        //url += '&title='+generaleTitle
	        vo.stopUpload()
	        let urlForm = '/form/'+post.id ; 
	        console.log( 'Upload a formulaire' , urlForm )
	        let body = FormValueFormate() ; 
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
	        	$('#noteSaveTemp').html('Save');
	        	noteSave.trigger('click')
			}
		}, 500);
    })
    formuExtenssionTemplate( NOTEID )

}

async function initContent(){

	console.log("111")
	let { vocaux , ID } = getParams(location.href)
	if ( !vocaux && !ID ) 
		return !1
	console.log("222")
	//récupération des informations de connexion
    let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
	let s = sdsd.exec(location.href);
	let contactId = s[1] ; 
	if ( !contactId ) 
		return
	console.log("333")
	var [ err , app ] = await Api.get( '/application/check/'+encodeURIComponent( contactId )+'/infusionsoft' ) ; 
	if ( ! app.id ) 
		return !1
	console.log("444")
	navigator.app = app ;
	//récupération des valeurs des notes par défaut dans notre application 
	if ( ID ) {
		var [ err , note ] = await Api.get( '/note/nativeId/'+ID+'/note' ) ; 
		navigator.note = note ;
		console.log( navigator.note , (!navigator.note || (navigator.note && !navigator.note.id)) && !vocaux  , vocaux )
		if ( (!navigator.note || (navigator.note && !navigator.note.id)) && !vocaux ) {
			return !1
		}
		var [ err , native ] = await Api.get( '/infusionsoft/note/'+ID + '/?appId='+navigator.app.id) ; 
		console.log( native )
		if ( ! native.contact_id ) 
			return !1
		console.log("666")
		navigator.note['contact_id'] = native ['contact_id'] ; 
		nativeId = ID ;
	}
	placeNoteEditRecorder( ID ) ; 
}

$( function () {
    initContent() ; 
});
