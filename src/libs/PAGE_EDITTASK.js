
export default function editnote(length) {
  	var NOTEID = `${moment().format('DD-MM-YYYY')}-contactId-${config.CONFIG_PAGE.contactId}-noteId-${makeid(8)}`  ;
	//initialisation de micro recorder 
    navigator.getUserMedia({audio:true}, initializeRecorder, function(e) {
    	alert('une erreur est survenue');
  	});
  	//Ajout du template d'enregistrement dans infusionsoft
	var btnAddNote = $('#Task0ActionDescription_data').parent('tr');
	console.log( ' ---- : ' , btnAddNote ) ; 

    btnAddNote.before( recordedTpltask() ) ; 
	//lancement de l'initialisation du timeur 
	chrono = timer() ;
	chrono.setcallback(function ( time ) {
		document.getElementById('counter-recorded').value = time ; 
	}) 
	$('body').on('click','#run-recorded', async function (argument) {
		let pre = $('#pre-ecoute-vocaux') ; 
		pauseall() ;
		if ( recording ) {
			//stop chrono
			chrono.stop() ; 
			stopRecording() ; 
			$('#logo-recorded').removeClass('active')
			$('#stop-recorded').removeAttr('disabled') ;
			$('#run-recorded').val('Enregistrer') ; 
			//affichage du préécoute 
			let url = prot+'://'+serveur+port+'/audio/'+NOTEID +'/?token='+makeid(60) ;
			let tpl = lecteurTpl( url , 'audio-liste-note-recordin' ) ; 
			pre.html( tpl ) ; 
			pre.show() ;
			$('#noteSave').removeAttr('disabled') ;
		}else{
			//vidé d'abord le lecteur audio 
			pre.html(' ') ; 
			startRecording( NOTEID ) ; 
			var el = pre.find('.audio-controller') ; 
			if (el.length) {
				el.remove() ; 
			}
			$('#logo-recorded').addClass('active') ;  
			//$('#run-recorded').attr('disabled','disabled') ;
			$('#run-recorded').val('stop enregistrement') ; 
			$('#stop-recorded').attr('disabled','disabled') ;
			$('#noteSave').attr('disabled','disabled') ;
		}
	})

	$('body').on('click','#stop-recorded', async function (argument) {
		chrono.reset() ;
		dellAllAudio( prot+'://'+serveur+port+'/delete?id='+NOTEID ) ; 
		$('#noteSave').attr('disabled','disabled') ;
	})

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
	$('#Task0CreationNotes').val('NOTEID::'+NOTEID+'::NOTEID') ; 
}