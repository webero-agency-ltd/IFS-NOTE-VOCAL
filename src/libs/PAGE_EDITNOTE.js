import r from './recorder' ; 
import { editnote } from './DOM' ; 
import { title , soncas , produit , closing } from './select'; 
import { recordedTpl , lecteurTpl , selectTpl , areaTpl , recordedTpltask } from '../libs/tpl';
import co from '../libs/config';
import Vocale from '../libs/vocale';
import listen from '../libs/listen';
import makeid from './makeid';
import { $on , $emit } from '../libs/event';

let config = co() ; 
let generaleNote = '' ;
let generaleTitle = '' ;

function formatDesc( NOTEID , selectSoncas , selectProduit , comment , selectClosin ) {
	
	let note = '' ; 
	let notes = $('#notes') ; 
	let notecontent = notes.parents('.fieldContainer') ; 
	notecontent.hide() ; 
	if ( notes ) {
		note += 'NOTEID::'+NOTEID+'::NOTEID'  ; 
		let soncas_text = '' ; 
		if(selectSoncas.length){
			note += "\n"+" SONCAS : \n" ;
			let soncas_liste = soncas() ; 
			soncas_liste.forEach(function ( e, i ) {
				if( selectSoncas.includes( ""+i ) ){
					note += '- '+ e +"\n" ; 
				}
			})
		}
		if(selectProduit.length){
			note += "\n"+" Produit :"+"\n" ;
			let produit_liste = produit() ; 
			produit_liste.forEach(function ( e, i ) {
				if( selectProduit.includes( ""+ i ) ){
					note += '- '+ e +"\n" ; 
				}
			})
		}
		if ( !parseInt( selectClosin ) == 0 ) {
			let closing_liste = closing() ; 
			note += "\n"+" Vitesse Closing :"+"\n" ;
			closing_liste.forEach(function ( e, i ) {
				if( parseInt( selectClosin ) == i ){
					note += '- '+ e +"\n" ; 
				}
			})
		}
		if ( comment ) {
			note += "\n"+' Commentaire: '+"\n" ; 
			note += comment+"\n" ; 	
		}
		generaleNote = note += "\n" ;

		console.log( note ) ; 
		notes.html( note += "\n" ) ; 
	}
}	

function preformateUpdate( HTML ) {
	let soncas_pre = [] ; 
	let produit_pre = [] ; 
	let closing_pre = '' ; 
	let comment_pre = '' ; 
	let ss = HTML.split(/\r?\n/)  ;
	//recherche de soncas s'il existe
	let step = false ; 
	let atep = false ; 
	soncas_pre = ss.filter(function (e) {
		if ( e.toLowerCase().indexOf('soncas') >= 0  ) {
			atep = true ; 
		}else if( e.toLowerCase().indexOf('commentaire') >= 0 || e.toLowerCase().indexOf('produit') >= 0  || e.toLowerCase().indexOf('vitesse closing') >= 0 ){
			step = true ; 
		}
		if ( atep && !step && e.toLowerCase().indexOf('soncas') == -1  ) {
			return true
		}
		return false
	}) 
	soncas_pre=soncas_pre.map( e => e.replace(new RegExp('-','g'), '').trim() ) ; 
	//recherche produi s'il existe 
	step = false ; 
	atep = false ; 
	produit_pre = ss.filter(function (e) {
		if ( e.toLowerCase().indexOf('produit') >= 0  ) {
			atep = true ; 
		}else if( e.toLowerCase().indexOf('commentaire') >= 0 || e.toLowerCase().indexOf('vitesse closing') >= 0 ){
			step = true ; 
		}
		if ( atep && !step && e.toLowerCase().indexOf('produit') == -1 ) {
			return true
		}
		return false
	})
	produit_pre=produit_pre.map( e => e.replace(new RegExp('-','g'), '').trim() ) ; 
	step = false ; 
	atep = false ; 
	closing_pre = ss.filter(function (e) {
		if ( e.toLowerCase().indexOf('vitesse closing') >= 0  ) {
			atep = true ; 
		}else if( e.toLowerCase().indexOf('commentaire') >= 0 ){
			step = true ; 
		}
		if ( atep && !step && e.toLowerCase().indexOf('vitesse closing') == -1 ) {
			return true
		}
		return false
	})
	closing_pre=closing_pre.map( e => e.replace(new RegExp('-','g'), '').trim() ) ; 
	step = false ; 
	atep = false ; 
	comment_pre = ss.filter(function (e) {
		if ( e.toLowerCase().indexOf('commentaire') >= 0  ) {
			atep = true ; 
		}
		if ( atep  && e.toLowerCase().indexOf('commentaire') == -1 ) {
			return true
		}
		return false
	})
	return { comment : comment_pre.length>0?comment_pre.join("\n"):'' , closing : closing_pre , produit : produit_pre , soncas : soncas_pre }
}

export default async function PAGE_EDITNOTE( ID , url , HTML ) {

	let { btnAddNote , actionType , sujet , noteSave } = editnote() ;
	let init = Vocale.init( btnAddNote ) ;
	let note = null ; 
	let NOTEID = null ;
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
    }
    console.log( btnAddNote )
  	//Ajout du template d'enregistrement dans infusionsoft
    //btnAddNote.before( recordedTpl(obrecod.recorder()) ) ; 
	//initialisation du DOM de l'application 
	//let NOTEID = obrecod.init( ID , url ) ; 
	//recherche de tout les informations précedement ajouter dans la notes 
	/////////////
	let placeholder = null ; 
	let desable = false ; 
	if ( HTML ) {
		placeholder = preformateUpdate( HTML )
	}else{
		desable = true
	}
	console.log( placeholder )
	//ici on fait la modification des valeurs boutton 
	actionType.html('<option>Message Vocal</option>') 
	let dataTitle = title() ; 
	//changement des titre
	let allOptionTile = dataTitle.map(function ( e , i ) {
		return  `<option value="${i}">${e}</option>` ; 
	}) ; 
	//ajoute du liste de titre du note pour facilité la selection 
	if ( sujet.length ) {
		//on ajoute la liste d'option des titres 
		sujet.after( `<select id="subject-title">${ allOptionTile.join(" ") }</select>` ) ;
		generaleTitle = dataTitle[0];
		sujet.val( dataTitle[0] )
		//change style pour le cacher 
		sujet.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
	}
	//ajoute desu autre différent input de selection 
	let sujetParent  = sujet.parents('.fieldContainer') ; 
	if ( sujetParent ) {
		let selectSoncas = [] ; 
		let soncas_liste = soncas() ; 
		let soncasOp = soncas_liste.map(function ( e , i ) {
			if ( placeholder&&placeholder.soncas&& placeholder.soncas.indexOf( e.trim() ) >= 0 ) {//.toLowerCase()
				selectSoncas.push( ''+i )
				return  `<option selected="selected" value="${i}">${e}</option>` ; 
			}else{
				return  `<option value="${i}">${e}</option>` ; 
			}
		}) ; 
		let selectProduit = [] ; 
		let produit_liste = produit() ; 
		let produitOp = produit_liste.map(function ( e , i ) {
			if ( placeholder&&placeholder.produit&& placeholder.produit.indexOf( e.trim() ) >= 0 ) {//.toLowerCase()
				selectProduit.push( ''+i )
				return  `<option selected="selected" value="${i}">${e}</option>` ; 
			}else{
				return  `<option value="${i}">${e}</option>` ; 
			}
		}) ; 

		let selectClosin = 0 ; 
		let closing_liste = closing() ; 
		let closingOp = closing_liste.map(function ( e , i ) {
			if ( placeholder&&placeholder.closing&& placeholder.closing.indexOf( e.trim() ) >= 0 ) {//.toLowerCase()
				selectClosin = i ; 
				return  `<option selected="selected" value="${i}">${e}</option>` ; 
			}else{
				return  `<option value="${i}">${e}</option>` ; 
			}
		}) ;
		let comment = placeholder&&placeholder.comment?placeholder.comment:'' ; 
		console.log( config )
		sujetParent.after( areaTpl('COMMENTAIRE' , comment, 'comment' ) ) ;
		sujetParent.after( selectTpl('Vitesse Closing' , closingOp , 'closing-select' , false ) ) ;
		sujetParent.after( selectTpl('Produit' , produitOp , 'produit-select' , true  ) ) ;
		sujetParent.after( selectTpl('SONCAS' , soncasOp , 'soncas-select' , true ) ) ;
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

	//écoute le changement de l'input titre et s'il y a de quelconque modification, on fait le changement 
	//de l'input d'origine 
	$('body').on('change','#subject-title',function ( e ) {
		var index = $(this).val() ; 
		if ( dataTitle[index] ) {
			generaleTitle = dataTitle[index];
			sujet.val( dataTitle[index] )
		}
	})

	noteSave.hide() ; 
	//on clique sur l'enregistrement de note 
    noteSave.before( '<button '+(desable?'disabled="disabled"':'')+' class="inf-button btn primary button-save" id="noteSaveTemp">Save</button>' ) ; 
	
	$('body').on('click','#noteSaveTemp', async ( e ) => {
        $('#noteSaveTemp').html('<i style="display:inline-block; vertical-align: middle; " class="spinner_vocal"></i>...Upload');
		e.preventDefault() ;
		e.stopPropagation() ;
		setTimeout( async function() {
			let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
			url = url+'/upload?token='+navigator.userCookie + '&typeId='+config.typeId  ; 
			let formData = new FormData();
	        formData.append('file', note );
	        url += 'token='+navigator.userCookie
	        url += '&NOTEID='+NOTEID
	        url += '&type=infusionsoft' 
	        url += '&appId='+navigator.appId
	        url += '&text='+generaleNote
	        url += '&title='+generaleTitle
	        vo.upload()
	        let upload = await fetch( url , {
	            method: 'POST',
	            headers: {
	                //'Content-Type': 'multipart/form-data'
	            },
	            body: formData
	        })
	        if ( upload.ok ) {
	        	vo.stopUpload()
	        	$('#noteSaveTemp').html('Save');
	        	noteSave.trigger('click')
	        }
		}, 500);
    })

}