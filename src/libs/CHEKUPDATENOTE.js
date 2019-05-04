import r from './recorder' ; 
import { editnote } from './DOM' ; 
import { title , soncas , produit , closing } from './select'; 
import { recordedTpl , lecteurTpl , selectTpl , areaTpl , recordedTpltask } from '../libs/tpl';
import co from '../libs/config';

let config = co() ; 
let { serveur , port } = config.URL ;
//initialisation de l'object recoder qui va nous permètre d'afficher l'enregistrement de note 
let obrecod = r() ; 
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
		notes.html( note += "\n" ) ; 
	}
}	

export default function PAGE_EDITNOTE(length) {

	let { btnAddNote , actionType , sujet , noteSave } = editnote() ;
  	//Ajout du template d'enregistrement dans infusionsoft
    btnAddNote.before( recordedTpl(obrecod.recorder()) ) ; 
	//initialisation du DOM de l'application 
	let NOTEID = obrecod.init() ; 
	/////////////
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
			generaleTitle = dataTitle[index];
			sujet.val( dataTitle[index] )
		}
	})

	//on clique sur l'enregistrement de note 
	noteSave.on('click', () => {

		console.log(' CLICK save')
		console.log( { text : generaleNote , title : generaleTitle } ) ; 
		let formData = new FormData();
		//@todo : récupération de tout les notes et enregistrement se fait ici. 
		let url = config.PROT+'://'+config.URL+config.PORT+'/save/'+NOTEID+'?token='+navigator.userCookie + '&typeId='+config.CONFIG_PAGE.typeId  ; 
		console.log( url ) ; 
		fetch(url , {
		    method: 'POST',
		    headers: {
		      	'Accept': 'application/json',
                'Content-Type': 'application/json'
		    },
		    body: JSON.stringify({ type : 'note', text : generaleNote , title : generaleTitle })
		}) ;
	})
}