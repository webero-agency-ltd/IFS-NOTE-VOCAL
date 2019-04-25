import co from '../libs/config';
import readydom from '../libs/readydom';
import { $on , $emit } from '../libs/event';
import PAGE_EDITNOTE from '../libs/PAGE_EDITNOTE' ; 
require('../libs/pluginJquery') ; 

let config = co() ; 
//vérification si le navigateur supporte l'enregistrement audio 
var ready = false ; 
if (!navigator.getUserMedia)
  	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || navigator.msGetUserMedia;
if (navigator.getUserMedia) 
	ready = true ;  
else 
	ready = false ;  

jQuery(document).ready(function($) { 
	if( ! ready )
		return alert('getUserMedia non pris en charge par ce navigateur.');
	if ( config.CONFIG_PAGE.page == 'EDITNOTE' ) {
		//écouter un élement du dom de la page, si cette element est présent
		//on affiche la page edit note 
		readydom('body',function () {
			PAGE_EDITNOTE()
		})
	}
	else if(  config.CONFIG_PAGE.page == 'EDITTASK' ){
		
	}
	else if ( config.CONFIG_PAGE.page == "HOMENOTE" ) {
		
	}else if ( config.CONFIG_PAGE.page == 'HOMENOTEMODALE' ) {
		 
	}
	else if(config.CONFIG_PAGE.page =='HOMEFUSEDESK'){
		
	}
	/*
	 * Pour tout les lecteurs audio de l'application 
	 * écoute evenement changement vitesse de lecteur audio 
	 * et faire les manipulation qui va avec 
	*/
	$('body').on('click','.speed-fan',function ( e ) {
		e.stopPropagation() ; 
		e.preventDefault() ;
		let el = $( this ) ; 
		let id = el.data('id') ; 
		let value = el.data('value') ;
		let od = document.getElementById( id ) ; 
		od.playbackRate = value ; 
		$('.'+id+'core .speed-fan').removeClass('active') ; 
		el.addClass('active') ; 
	})
	//si le lécteur audio est en play, on affiche son 
	jQuery.createEventCapturing(['play','pause']);  
	$('body').on('play', 'audio', function(){
		let el = $( this ) ; 
		let id = el.data('id') ; 
		let elCtrl = $('.'+id) ;
		elCtrl.show() ; 
	})
	$('body').on('pause', 'audio', function(){
		let el = $( this ) ; 
		let id = el.data('id') ; 
		let elCtrl = $('.'+id) ;
		elCtrl.hide() ;  
	})
});
chrome.runtime.connect();
//ici on écoute s'il y a un evenement du backend qui demande de fermé la fenètre encour 
$on('force-close-tab-save-note',function () {
	window.close()
})