import co from '../libs/config';
import readydom from '../libs/readydom';
import { $on , $emit } from '../libs/event';
import PAGE_EDITNOTE from '../libs/PAGE_EDITNOTE' ; 
import PAGE_HOMENOTE from '../libs/PAGE_HOMENOTE' ; 
import PAGE_HOMENOTEMODALE from '../libs/PAGE_HOMENOTEMODALE' ; 
import PAGE_EDITTASK from '../libs/PAGE_EDITTASK' ; 
import PAGE_HOMEFUSEDESK from '../libs/PAGE_HOMEFUSEDESK' ; 
import PAGE_TRELLO from '../libs/PAGE_TRELLO' ; 

require('../libs/pluginJquery') ; 
 
let config = co() ; 
navigator.userCookie = null ; 

//vérification si le navigateur supporte l'enregistrement audio 
var ready = false ; 
if (!navigator.getUserMedia)
  	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || navigator.msGetUserMedia;
if (navigator.getUserMedia) 
	ready = true ;  
else 
	ready = false ;  

//ici on écoute s'il y a un evenement du backend qui demande de fermé la fenètre encour 
$on('force-close-tab-save-note',function () {
	window.close()
})

let init = false ; 

//initialisation de tout l'application 
$on('audio-recoreder-init',function ( { cookie , application } ) {
	if ( init ) 
		return ; 
	else 
		init = true ; 
	console.log( application )
	navigator.appId = application.id ;
	navigator.userCookie = cookie.value ;
	jQuery(document).ready(function($) { 
		if( ! ready )
			return alert('getUserMedia non pris en charge par ce navigateur.');
		let firstLoad = null ; 
		console.log( '_____________________________' )
		console.log( config.page )
		if ( config.page == 'EDITNOTE' ) {
			//écouter un élement du dom de la page, si cette element est présent
			//on affiche la page edit note 
			readydom('body',function () {
				if ( !firstLoad ) {
					PAGE_EDITNOTE() 
					firstLoad = true ; 
				}
			})
		}
		else if(  config.page == 'EDITTASK' ){
			readydom('#Task0CreationNotes',function () {
				let ID = '' ; 
				let html = '' ; 
				let url = '' ; 
				let location = window.location ;  
				let _url_ = new URL( location ); 
				let NOTEID = _url_.searchParams.get("NOTEID");

				if ( !firstLoad ) {
					let text = $('#Task0CreationNotes').text().trim() ; 
					if ( text.indexOf('NOTEID::') >= 0 ) {
						let repl = text.replace(new RegExp('\r?\n','g'), ''); ; 
						let sdsd = /NOTEID::(.*)::NOTEID(.*)/gi;
						let s = sdsd.exec(repl);
						if ( s[1] ) {
							ID = s[1] ; 
						}
						if ( s[2] ) {
							html = s[2] ; 
						} 
						let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
						url = url+'/audio/'+ID ; 
						//ici on check qu'on a bien un notes dans l'update 
					}
					if( NOTEID ){
						ID = NOTEID
					}
					PAGE_EDITTASK( ID , url , text.replace(new RegExp(/NOTEID::(.*)::NOTEID/,'gi'), '').trim() ) 
					firstLoad = true ; 
				}
			})
		}
		else if ( config.page == "HOMENOTE" ) {
			readydom('body',function () {
				if ( !firstLoad ) {
					PAGE_HOMENOTE() 
					firstLoad = true ; 
				}
			})
		}
		else if ( config.page == 'HOMENOTEMODALE' ) {
			readydom('body',function () {
				if ( !firstLoad ) {
					PAGE_HOMENOTEMODALE() 
					firstLoad = true ; 
				}
			})
		}
		else if( config.page =='HOMEFUSEDESK'){
			readydom('#caseActionTabs',function () {
				if ( !firstLoad ) {
					PAGE_HOMEFUSEDESK() 
					firstLoad = true ; 
				}
			})
		}
		else if( config.page =='CHEKUPDATENOTE'){
			readydom('#notes',function () {
				let text = $('#notes').text().trim() ; 
				let ID = '' ; 
				let html = '' ; 
				let url = '' ; 
				if ( text.indexOf('NOTEID::') >= 0 ) {
					let repl = text.replace(new RegExp('\r?\n','g'), ''); ; 
					let sdsd = /NOTEID::(.*)::NOTEID(.*)/gi;
					let s = sdsd.exec(repl);
					if ( s[1] ) {
						ID = s[1] ; 
					}
					if ( s[2] ) {
						html = s[2] ; 
					}
					let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
					url = url+'/audio/'+ID ; 
					//ici on check qu'on a bien un notes dans l'update 
				}
				PAGE_EDITNOTE( ID , url , text )
			})
		}
		else if( config.page =='TRELLO'){
			readydom('#board',function () {
				//Récupération des urls dans le serveur pour voire si c'est un note vocal ou pas 
				let ID = null ; 
				let url = null ; 
				let text = null ; 
				PAGE_TRELLO( ID , url , text )
			})
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
})
chrome.runtime.connect();
$emit('cookies',config)