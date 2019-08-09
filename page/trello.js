
//initialisation de l'object recoder qui va nous permètre d'afficher l'enregistrement de note 
let generaleNote = '' ;
let generaleTitle = '' ;
let vo = null ;
let native_id = null ;
let unique = null ;
let allNoteVocal = [] ;
let board = null ;
let cards = [] ;

//ajoute de template de notevocal a un élèment 
function allVocalNote( el , note ) {
	console.log( el , note ) ; 
	let cont = $( el ).find('.badges')[0]  ; 
	cont.style.width="100%"
	new listen( cont , Api.url+'/audio/'+note.unique , note.unique )
}

//parcoure de tout les lien et voire s'il on a de nouveaux card vocal 
async function allCardEach( btnAddNote ) {

	let nativeCards = [] ; 
	let	search = 'https://trello.com/1/boards/'+board+'/cards/?fields=all';
 	let resp = await fetch( search )
	if ( resp.ok ) {
		nativeCards = await resp.json() ;  
	}
 	data = [] ; 
	btnAddNote.forEach(function (e) {
		e.className += " checknote";
		if( e && e.href ){}
		else return
		let url_ = new URL( e.href ); 
		let card = nativeCards.find( e => e.url.indexOf( url_.pathname ) > -1 ) ; 
		if( !card ) return ; 
		e.dataset.checknote = card.id ;
		//parcourire tout les notes et voire si cette note est ou n'est pas un notevocal 
		let cardApp = allNoteVocal.find( e => e.native_id == card.id ) ; 
		if( cardApp ) allVocalNote( e , cardApp ) ; 
	})

}

function placeNoteEditRecorder( ) {

	let pages = document.querySelector( 'body' ) ; 
	let ready = false ; 
	Event.on('send_files_ok', async function( request ){
	    vo.upload()
    	console.log('----UPLOAD RUN')
		let body = {
	    	unique ,
	    	application_id : navigator.app.id ,
            type : 'trello' ,
	    	attache : 'card' ,
	    	filenoteeditefile : true ,
	    	file : true ,
	    	native_id ,
	    } 
        let [ err , post ] = await Api.fetch( '/api/note'+(navigator.note&&navigator.note.id?'/'+navigator.note.id:'') , { 
			method : 'POST',
			headers : true , 
			body 
		})
        console.log( post )
		if( post && post.data && post.data.id ){
			if( !navigator.note ){
				navigator.note = post.data;  
				allNoteVocal = [ ...allNoteVocal , {...navigator.note} ]
			}
		}
        vo.stopUpload()
	   	Event.emit('resetData')
	})

	Dom.observeDOM( pages ,async function(e){
		//lancement a chaque update du boad 
		let btnAddNote = document.querySelector('.js-plugin-sections');
		if(  btnAddNote && ready === false ){
			ready = true ; 
			let btnAddNote = $('.card-detail-data') ;  
		    let title = $('.js-card-detail-title-input') ;
			//Ajout du template d'enregistrement dans infusionsoft
		    let location = window.location ;  
			let url_ = new URL( location ); 
			let path = window.location.pathname.split('/') ; 
			let mini = path[path.length-2]
			let search = 'https://trello.com/1/Cards/'+mini;
			let resp = await fetch( search )
			if ( resp.ok ) {
				response = await resp.json()
				native_id = response.id ; 
			}
			let init = Vocale.init( btnAddNote ) ;
			//check si note existe dans le dom 
 			let [ err , note ] = await Api.fetch( '/api/note?native_id='+native_id ) ; 
 			console.log( note , '/note/'+native_id )
			if ( note && note.data && note.data.id ) {
				navigator.note = note.data;  
		        new listen( 'recordingsList' ,  Api.url+'/audio/'+navigator.note.unique  , 'audio-liste-note-record' )
			}else{
				unique = makeid( 16 ) ; 
			}

			vo = new Vocale()
		    //enregistrement terminer
		    vo.recorder = function ( blob  ) {
		        var url = URL.createObjectURL(blob);
		        new listen( 'recordingsList' , url , 'audio-liste-note-record' )
		        note = blob ; 
		        $('#noteSaveTemp').attr('disabled',false)
		        Event.emit('resetData')
    			setTimeout(function() { sendBlobToApp(blob,'noteeditefile'); }, 100);	
		    }
		    //button de conversion de card en tache infusionsoft 
		    btnAddNote.before( `<div class="fieldContainer fieldContainerMargin">
		    	<input class="inf-button btn button-x" id="duplicate_task" type="button" value="Clone en note infusionsoft">
		    	<input class="inf-button btn button-x" id="copy_task" type="button" value="Copier en note infusionsoft">
			</div>`) ;
			Dom.watch('#duplicate_task', () => {
				let url_vocal_note = Api.url ;
				$('#duplicate_task').on('click',function (argument) {
					window.open(`${url_vocal_note}/vocal-note?action=duplicate#/update/${NOTEID}`);
				})
				$('#copy_task').on('click',function (argument) {
					window.open(`${url_vocal_note}/vocal-note?action=copy#/update/${NOTEID}`);
				})
			})
		}else if( !btnAddNote && ready === true ){
			ready = false ; 
		}
	});

	let readyNote = false;
	Dom.observeDOM( pages ,async function(e){
		let btnAddNote = document.querySelectorAll('a.list-card:not(.checknote)[href]');
		if(  btnAddNote.length > 0 ){
			allCardEach( btnAddNote ) ; 
		}
	});
}



async function initContent(){

    async function board_Init( url ) {
		url = url.replace('https://trello.com', '').split('/').join('_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") ;
		console.log('---' , url )
		var [ err , app ] = await Api.fetch( '/api/application/check/trello/'+url  ) ; 
	    console.log( app )
	    navigator.app = app.data ; 
	    if ( !navigator.app || (navigator.app && !navigator.app.id) ) 
	        return !1
	    console.log( '/notes/'+navigator.app.id )
		var [ err , note ]  = await Api.fetch( '/api/notes/'+navigator.app.id ) ;
		if( note && note.data && note.data.length ){
		console.log( note , note.data ) ;  
			allNoteVocal = [ ...note.data ]
		}
	    placeNoteEditRecorder(  ) ;
	}

	async function find_board_from_url() {
		let path = window.location.pathname.split('/') ; 
		let mini = path[path.length-2]
		if( !mini )
			return !1 ; 
		let search = null ; 
		let type = null ; 
		if( window.location.pathname.indexOf('/c/'+mini) !== -1 ){
			type = 'cards';
			search = 'https://trello.com/1/Cards/'+mini+'?fields=all&stickers=true&attachments=true&customFieldItems=true&pluginData=true';
		}
		else if( window.location.pathname.indexOf('/b/'+mini) !== -1 ){
			type = 'boards';
			search = 'https://trello.com/1/Boards/'+mini;
		}
		if( !search )
			return !1;

		let resp = await fetch( search )
		if ( resp.ok ) { 
			let response = await resp.json() ; ; 
		    if( type == 'boards' ){
		    	board = response.id ;
		    	board_Init( response.url )
		    }else{
				search = 'https://trello.com/1/Boards/'+response.idBoard;
				let resp = await fetch( search )
				if ( resp.ok ) {
					response = await resp.json()
			    	//récupération de l'URL
		    		board = response.id ;
			    	board_Init( response.url )
				}
		    }
		}
	}

	find_board_from_url() ; 

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
