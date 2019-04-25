import r from './recorder' ; 
import { editnote } from './DOM' ; 
import { title , soncas , produit , closing } from './select'; 
import { recordedTpl , lecteurTpl , selectTpl , areaTpl , recordedTpltask } from '../libs/tpl';
import co from '../libs/config';

let config = co() ; 
let { serveur , port } = config.URL ;
//initialisation de l'object recoder qui va nous permètre d'afficher l'enregistrement de note 
let obrecod = r() ; 

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
		notes.html( note += "\n" ) ; 
	}
}	

export default function PAGE_EDITNOTE(length) {

	console.log('PAGE EDIT NOTE') ; 
	let { btnAddNote } = editnote() ;
	console.log( btnAddNote ) ; 
  	//Ajout du template d'enregistrement dans infusionsoft
    btnAddNote.before( obrecod.recorder() ) ; 
	//initialisation du DOM de l'application 
	obrecod.init() ; 
	return

	$('body').on('click','#stop-recorded', async function (argument) {
		chrono.reset() ;
		dellAllAudio( prot+'://'+serveur+port+'/delete?id='+NOTEID ) ; 
		$('#noteSave').attr('disabled','disabled') ;
	})
	//ici on fait la modifici ation des valeurs boutton 
	$('#actionType').html('<option>Message Vocal</option>') 
	var dataTitle = title() ; 
	//changement des titre
	var allOptionTile = dataTitle.map(function ( e , i ) {
		return  `<option value="${i}">${e}</option>` ; 
	}) ; 
	//ajoute du liste de titre du note pour facilité la selection 
	var sujet = $('#subject') ; 
	if ( sujet.length ) {
		//on ajoute la liste d'option des titres 
		sujet.after( `<select id="subject-title">${ allOptionTile.join(" ") }</select>` ) ;
		sujet.val( dataTitle[0] )
		//change style pour le cacher 
		sujet.css({ position: 'absolute' , top: '-6000px', left: '-10000px' })
	}
	//ajoute desu autre différent input de selection 
	var sujetParent  = sujet.parents('.fieldContainer') ; 
	if ( sujetParent ) {
		let soncas_liste = soncas() ; 
		let soncasOp = soncas_liste.map(function ( e , i ) {
			return  `<option value="${i}">${e}</option>` ; 
		}) ; 
		let produit_liste = produit() ; 
		let produitOp = produit_liste.map(function ( e , i ) {
			return  `<option value="${i}">${e}</option>` ; 
		}) ; 
		let closing_liste = closing() ; 
		let closingOp = closing_liste.map(function ( e , i ) {
			return  `<option value="${i}">${e}</option>` ; 
		}) ;
		sujetParent.after( areaTpl('COMMENTAIRE' , '' , 'comment' ) ) ;
		sujetParent.after( selectTpl('Vitesse Closing' , closingOp , 'closing-select' , false ) ) ;
		sujetParent.after( selectTpl('Produit' , produitOp , 'produit-select' , true  ) ) ;
		sujetParent.after( selectTpl('SONCAS' , soncasOp , 'soncas-select' , true ) ) ;
		let comment = '' ; 
		let selectProduit = [] ; 
		let selectSoncas = [] ; 
		let selectClosin = 0 ; 
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
	}

	//écoute le changement de l'input titre et s'il y a de quelconque modification, on fait le changement 
	//de l'input d'origine 
	$('body').on('change','#subject-title',function ( e ) {
		var index = $(this).val() ; 
		if ( dataTitle[index] ) {
			sujet.val( dataTitle[index] )
		}
	})

	$('body').on('change','#audio-upload',async function (ev) {
		if ( ev.target.files.length ) {
			let pre = $('#pre-ecoute-vocaux') ; 
			pre.html('') ; 
			if ( recording ) {
				//stop chrono
				chrono.stop() ;  
				stopRecording() ; 
				$('#logo-recorded').removeClass('active')
				$('#stop-recorded').removeAttr('disabled') ;
				$('#run-recorded').val('Enregistrer') ; 
			}
			//tout les button ne son pa utilisable si on est encore dans un processu d'upload de fichier
			$('#upload-file-btn').attr('disabled','disabled') ;
			$('#stop-recorded').attr('disabled','disabled') ;
			$('#run-recorded').attr('disabled','disabled') ;
			//éfacer l'enregistrement précedement fait 
			chrono.reset() ;
			$('#noteSave').attr('disabled','disabled') ;
			var formData = new FormData();
			formData.append('file', ev.target.files[0] );
			//faire l'uploade automatiquement 
			var uploadResponse = await fetch(prot+'://'+serveur+port+'/upload?id='+NOTEID+'&type=infusionsoft&typeId='+config.CONFIG_PAGE.typeId+'&contactId='+config.CONFIG_PAGE.contactId , {
			    method: 'POST',
			    headers: {
			      	//'Content-Type': 'multipart/form-data'
			    },
			    body: formData
			})
			$emit('upload', prot+'://'+serveur+port+'/close?id='+NOTEID )
			if ( uploadResponse.ok ) { 
				let data = await uploadResponse.json() ; 
		    	//écoute l'audio qui é été Enregistrer 
		    	let url = prot+'://'+serveur+port+'/audio/'+NOTEID +'/?token='+makeid(60) ;
				pre.html(lecteurTpl( url , 'audio-liste-note-upload' )) ;
				pre.show() ;
				$('#noteSave').removeAttr('disabled') ; 
		    }
		    //Tout les button son de nouveaux clicable 
			setTimeout(function (argument) {
				$('#stop-recorded').removeAttr('disabled') ;
		    	$('#upload-file-btn').removeAttr('disabled') ;
				$('#run-recorded').removeAttr('disabled') ;
			}, 1000);
		}
	})
	//ICI on veut faire l'upload de fichier 
	$('body').on('click','#upload-file-btn',function () {
		$('#audio-upload').trigger('click') ; 
	})
	//clique sur enregistrement des notes 
	$('body').on('click','#noteSave',function () {
		if ( recording ) {
			stopRecording() ;
			setTimeout(function (argument) {
				fetch(prot+'://'+serveur+port+'/save?id='+NOTEID) ;
			}, 700);
		}else{
			fetch(prot+'://'+serveur+port+'/save?id='+NOTEID) ;
		}
	})
	//lors du premier chargement, il faux désactivé le button de création de note car c'est sur qu'il ny a pas de note par défaut 
	$('#noteSave').attr('disabled','disabled') ;
}