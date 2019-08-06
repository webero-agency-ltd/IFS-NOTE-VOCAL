
//initialisation de l'object recoder qui va nous permètre d'afficher l'enregistrement de note 
let generaleNote = '' ;
let generaleTitle = '' ;
let vo = null ;
let NOTEIDTEMP = null ;

function placeNoteEditRecorder( note ) {
	console.log( note )
	let pages = document.querySelector( 'body' ) ; 
	let ready = false ; 
	Event.on('send_files_ok',function( request ){
	    vo.upload()
    	setTimeout(async function() {
    		console.log('----UPLOAD RUN')
    		let url = '/upload?' ; 
	        url += 'NOTEID='+NOTEIDTEMP
	        url += '&type=trello' 
	        url += '&appId='+navigator.app.id
	        url += '&attache=card' 
	        url += '&text='+generaleNote
	        url += '&title='+generaleTitle
			let [ err , post ] = await Api.post( url , { 
				body : {
					file : true
				},
				type : 'formData'
			})
	        //url += '&text='+generaleNote
	        //url += '&title='+generaleTitle
	        vo.stopUpload()
    	}, 1000);
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
			let NOTEID = decodeURIComponent(url_.pathname).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
			console.log( '- ID : ' , NOTEID )
			NOTEIDTEMP = NOTEID ;
			//check si note existe dans le dom 
			let init = Vocale.init( btnAddNote ) ;
 			let [ err , note ] = await Api.get( '/note/'+NOTEID ) ; 
 			console.log( note , '/note/'+NOTEID )
			if ( note && note.id ) {
		        new listen( 'recordingsList' ,  Api.url+'/audio/'+NOTEID  , 'audio-liste-note-record' )
			}
			vo = new Vocale()
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
			let data = [] ; 
			btnAddNote.forEach(function (e) {
				e.className += " checknote";
				if( e && e.href ){}
				else{
					return
				}
				let url_ = new URL( e.href ); 
				let noteID = decodeURIComponent(url_.pathname).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
				e.dataset.checknote = decodeURIComponent( noteID ) ;
				if ( note.filter( e => e.unique == noteID ).length > 0 ) {
					let cont = $( e ).find('.badges')[0]  ; 
					cont.style.width="100%"
            		new listen( cont , Api.url+'/audio/'+noteID , noteID )
				}
			})
			console.log( data , note )
		}
	});
}


async function initContent(){
	let url_ = new URL( location ); 
	let NOTEID = decodeURIComponent(url_.pathname).split('/').join('_').replace('/', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
	console.log( '- ID : ' , NOTEID )
    var [ err , app ] = await Api.get( '/application/check/'+NOTEID+'/trello' ) ; 
    if ( !app || (app && !app.id) ) 
        return !1
    console.log( app )
    navigator.app = app ; 
    console.log( '/notes/'+app.id )
	var [ err , note ]  = await Api.get( '/notes/'+app.id ) ; 
    placeNoteEditRecorder( note ) ; 
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
