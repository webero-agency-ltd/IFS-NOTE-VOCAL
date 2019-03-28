import {BinaryClient} from 'binaryjs-client';
import recordRTC from 'recordRTC';
import {wav} from 'wav';

function convertFloat32ToInt16(buffer) {

  	var l = buffer.length;
  	var buf = new Int16Array(l);
  	while (l--) {
    	buf[l] = Math.min(1, buffer[l])*0x7FFF;
  	}
  	return buf.buffer;

}

var recording = false;

//l'ancer l'enregistrement de song
window.startRecording = function() {

	clearInterval( intervaleTimerRecorder ) ;
	intervaleTimerRecorder = setInterval(setTime, 1000);
    recording = true;

}

//stoper l'enregistrement 
window.stopRecording = function() {
  	
  	recording = false;
  	window.Stream.end();
  	clearInterval( intervaleTimerRecorder ) ;

}

function recorderProcess(e) {
  	
  	if(!recording) return;
    console.log ('recording');

  	var left = e.inputBuffer.getChannelData(0);
  	window.Stream.write(convertFloat32ToInt16(left));
  	
}

var context = null ; 

function initializeRecorder(stream) {
	
	var audioContext = window.AudioContext;
	context = new audioContext();
	var audioInput = context.createMediaStreamSource(stream);
	var bufferSize = 2048;
	// create a javascript node
	var recorder = context.createScriptProcessor(bufferSize, 1, 1);
	// specify the processing function
	recorder.onaudioprocess = recorderProcess;
	// connect stream to our recorder
	audioInput.connect(recorder);
	// connect our recorder to the previous destination
	recorder.connect(context.destination);

}

async function stopRecorded() {
	
	await context.close();

}

//si on est dans la popup d'ajout de note 
		
var recorderInput = `<div class="fieldContainer fieldContainerMargin">
    <div class="fieldLabel">
        <label class="action-label" for="template">Vocaux</label>
    </div>
    <div class="fieldControl">
        <div style="display: flex;">
        	<div style="display: flex;">
    			<div id="logo-recorded" class="recorder-style"></div>
        		<input id="counter-recorded" class="fieldControlWidth" style="width: 100px; margin-left: 6px;" disabled="disabled" id="timer" name="timer" type="text" value="00:00">
        	</div>
            <div style="display: flex;">
            	<input class="inf-button btn button-x" id="run-recorded" name="runrecorded" type="button" value="Enregistré">
            	<input disabled="disabled" class="inf-button btn button-x" id="stop-recorded" name="resetrecorded" type="button" value="Effacté">
            </div>
        </div>
    </div>
    <style>
    	
    	.recorder-style{
			width: 26px;
			height: 26px;
			border-radius: 26px; 
			background-color: #999 ; 
    	}

    	.recorder-style.active{
			background-color: red ;
    	}

    </style>
</div>`;


var totalSeconds = 0;
var intervaleTimerRecorder = null ; 

function setTime() {
  	
  	++totalSeconds;
  	var secondsLabel = pad(totalSeconds % 60);
  	var minutesLabel = pad(parseInt(totalSeconds / 60));
  	document.getElementById('counter-recorded').value = minutesLabel + " : " + secondsLabel ; 

}

function pad(val) {
	
	var valString = val + "";
	if (valString.length < 2) {
	    return "0" + valString;
	} else {
	    return valString;
	}

}

function makeid(length) {

  	var text = "";
  	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  	for (var i = 0; i < length; i++)
    	text += possible.charAt(Math.floor(Math.random() * possible.length));

  	return text;

}

jQuery(document).ready(function($) { 

	//Touver un moyen d'injecté une seule foix le button 

	var currentLocation = window.location;
	var url_string = currentLocation ; 
	var url = new URL(url_string);
	var c = url.searchParams.get("c");
	var isPop = url.searchParams.get("isPop");
	var vocaux = url.searchParams.get("vocaux");
	var ID = url.searchParams.get("ID");
	var contactId = url.searchParams.get("contactId");

	if (currentLocation.pathname=='/ContactAction/manageContactAction.jsp'&&vocaux) {
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
		  	dd = '0' + dd;
		} 
		if (mm < 10) {
		  	mm = '0' + mm;
		} 
		var today = dd + '-' + mm + '-' + yyyy;

		var filename = today+'-contact_id-'+contactId+'-md5-'+makeid(5) ;

		var client = new BinaryClient( 'ws://127.0.0.1:9001?nameFile=' + filename );

		client.on('open', function() {

		  	// for the sake of this example let's put the stream in the window
		  	window.Stream = client.createStream();

		    if (!navigator.getUserMedia)
		      	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		    	navigator.mozGetUserMedia || navigator.msGetUserMedia;

		    if (navigator.getUserMedia) {
		      	navigator.getUserMedia({audio:true}, initializeRecorder, function(e) {
		        	alert('une erreur est survenue');
		      	});
		    } else {
		    	return alert('getUserMedia non pris en charge par ce navigateur.');
		    }
			
		  	//Injection des donner dans le modal infusionsoft d'édition de note

			var btnAddNote = $('#template').parents('.fieldContainer');

		    btnAddNote.before( recorderInput ) ; 

			var session = {
			  	audio: true,
			  	video: false
			};
		
			$('body').on('click','#run-recorded',function (argument) {

				if ( recording ) {
					window.stopRecording() ; 
					$('#logo-recorded').removeClass('active')
					$('#stop-recorded').removeAttr('disabled') ;
					$('#run-recorded').val('Enregistré') ; 

				}else{
					window.startRecording() ; 
					$('#logo-recorded').addClass('active') ;  
					$('#run-recorded').val('stop enregistrement') ; 
				}

			})

			$('body').on('click','#stop-recorded',function (argument) {
				
				totalSeconds = 0 ; 
				$('#stop-recorded').attr('disabled','disabled') ;
				//supression de ce fichier dans le serveur 
				console.log('-- REMOVE CETTE FICHER CLIENT: ' , filename );

				console.log( client );
				client.emit('remove', filename )
			})

		})

	}else if ( currentLocation.pathname=='/Contact/manageContact.jsp'&&!isPop ) {
		//on est dans la page ou on liste tout les notes 
		//on ajoute le button "add note vocal" 
		var btnAddNote = document.querySelector('#TemplateId + input');
		if ( btnAddNote ) {
			$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+ID+'\' , {height: 730,width: 730})" id="ifs-note-vocaux" class="inf-button btn" type="button" value="add note vocaux">' ) 
			//écoute lors du clicque sur l'élement 	
		}

	}

});


