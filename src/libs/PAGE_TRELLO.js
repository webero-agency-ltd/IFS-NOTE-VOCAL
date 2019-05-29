import r from './recorder' ; 
import { trellodom } from './DOM' ; 
import { title , soncas , produit , closing } from './select'; 
import { recordedTpl , lecteurTpl , selectTpl , areaTpl , recordedTpltask , btnTrelloConvertNote } from '../libs/tpl';
import co from '../libs/config';
import observeDOM from './observeDOM';
import makeid from './makeid';
import readydom from '../libs/readydom';

let config = co() ; 
//initialisation de l'object recoder qui va nous permètre d'afficher l'enregistrement de note 
let generaleNote = '' ;
let generaleTitle = '' ;


export default function PAGE_TRELLO( ID , url , HTML ) {

	let pages = document.querySelector( 'body' ) ; 
	let ready = false ; 
	observeDOM( pages ,async function(e){
		//lancement a chaque update du boad 
		let btnAddNote = document.querySelector('.js-plugin-sections');
		if(  btnAddNote && ready === false ){
			let obrecod = r() ; 
			ready = true ; 
			let { btnAddNote ,title /*, actionType , sujet , noteSave*/ } = trellodom() ;
		  	//Ajout du template d'enregistrement dans infusionsoft
		    let location = window.location ;  
			let url_ = new URL( location ); 
			let noteID = decodeURIComponent(url_.pathname).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
			console.log( '- ID : ' , noteID )
			//check si note existe dans le dom 
			let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');	
			let url__ = url+'/note/check/'+noteID
			let check = await fetch( url__ ) ;
			let existe = false ;
			if ( check.status == 200 ) { 
                existe = true ;
            } 
			console.log( check , existe === true  )
            if ( existe === true ) {
				url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
            	url = url+'/audio/'+noteID+'/?token='+makeid(60) ;
            }else{
            	url = null ; 
            }
            console.log( url )
			let NOTEID = obrecod.init( noteID , url ) ; 
			btnAddNote.before( recordedTpl(obrecod.recorder()) ) ; 
			btnAddNote.before( btnTrelloConvertNote() ) ; 

			console.log( NOTEID )
			obrecod.onSave = async function () {

				console.log('----------------------------------------------------------------------------')
				let formData = new FormData();
				generaleTitle = title.val() ;
				console.log( generaleTitle )
				//@todo : récupération de tout les notes et enregistrement se fait ici. 
            	let idApp = encodeURIComponent(  document.querySelector('.js-open-board').href )
				let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
				url = url+'/save/'+NOTEID+'?token='+navigator.userCookie + '&type=trello&typeId='+idApp  ; 
				console.log( url ) ; 
				await fetch(url , {
				    method: 'POST',
				    headers: {
				      	'Accept': 'application/json',
		                'Content-Type': 'application/json'
				    },
				    body: JSON.stringify({ type : 'trello', text : generaleNote , title : generaleTitle })
				}) ;
			}

			readydom('#duplicate_task', () => {
				console.log( '#duplicate_task' ) ; 
				let url_vocal_note = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
				$('#duplicate_task').on('click',function (argument) {
					window.open(`${url_vocal_note}?action=duplicate&card=${NOTEID}`);
				})
				$('#copy_task').on('click',function (argument) {
					window.open(`${url_vocal_note}?action=copy&card=${NOTEID}`);
				})
			})
		}else if( !btnAddNote && ready === true ){
			ready = false ; 
		}
	});

	let pages_ = document.querySelector( 'body' ) ; 
	let readyNote = false;
	observeDOM( pages_ ,async function(e){
		let btnAddNote = document.querySelectorAll('a.list-card:not(.checknote)[href]');
		if(  btnAddNote.length > 0 ){
			let data = [] ; 
			console.log( btnAddNote )
			btnAddNote.forEach(function (e) {
				e.className += " checknote";
				if( e && e.href ){}
				else{
					console.log( e )
					console.log( e.href )
					return
				}
				let url_ = new URL( e.href ); 
				let noteID = decodeURIComponent(url_.pathname).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
				e.dataset.checknote = decodeURIComponent( noteID ) ;
				data.push( noteID ) ; 
			})

			console.log( data )
			readyNote = true ; 
			let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
			url = url+'/note/checks/' ;
			let check = await fetch(url , {
			    method: 'POST',
			    headers: {
			      	'Accept': 'application/json',
	                'Content-Type': 'application/json'
			    },
			    body: JSON.stringify({ urls : data.join(',,,') })
			});

			console.log( check.ok )
			if ( check.ok ) { 
	            let data = await check.json() ;
	            console.log( data )
	            data.forEach(function (e) {
	            	console.log( 'a.list-card[data-checknote="'+e+'"]' )
					let VocalListes = document.querySelector('a.list-card[data-checknote="'+e+'"]');
					if ( VocalListes ) {
						let urlDecode = decodeURIComponent( e.replace('https://trello.com', '') ).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, ""); 
						let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');
						url = url+'/audio/'+urlDecode+'/?token='+makeid(60) ;
						console.log( url ) ; 
						console.log( VocalListes )
						$( VocalListes ).find('.badges').before( lecteurTpl( url , urlDecode ) )
					}
				})
	        } 
		}
	});
}