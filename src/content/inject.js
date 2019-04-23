import { BinaryClient } from 'binaryjs-client';
import recordRTC from 'recordRTC';
import { wav } from 'wav';
import co from '../libs/config';
import makeid from '../libs/makeid';
import { recordedTpl , lecteurTpl , selectTpl , areaTpl , recordedTpltask } from '../libs/tpl';
import timer from '../libs/timer';
import { title , soncas , produit , closing } from '../libs/select';
import wait from '../libs/wait';
import { $on , $emit } from '../libs/event';
import moment from 'moment' ; 
var ready = false ; 

//vérification si le navigateur supporte l'enregistrement audio 
if (!navigator.getUserMedia)
  	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (navigator.getUserMedia) 
	ready = true ;  
else 
	ready = false ;  

var config = co() ; 
let serveur = config.URL ;  
let port = config.PORT ; 
let prot = config.PROT ;  

//mini plugin jquery pour ajouter un event play adu audio 
jQuery.createEventCapturing = (function () {
    var special = jQuery.event.special;
    return function (names) {
        if (!document.addEventListener) {
            return;
        }
        if (typeof names == 'string') {
            names = [names];
        }
        jQuery.each(names, function (i, name) {
            var handler = function (e) {
                e = jQuery.event.fix(e);
                return jQuery.event.dispatch.call(this, e);
            };
            special[name] = special[name] || {};
            if (special[name].setup || special[name].teardown) {
                return;
            }
            jQuery.extend(special[name], {
                setup: function () {
                    this.addEventListener(name, handler, true);
                },
                teardown: function () {
                    this.removeEventListener(name, handler, true);
                }
            });
        });
    };
})();

//écouter si un élement du dom change 
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;
    return function(obj, callback){
        if( MutationObserver ){
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

//si cette valeur est = true, on fait l'enregistrement automatique des flux audio au serveur 
var recording = false;
var chrono = null ; 

//écoute si un evenement dans le backend est lancer 
//le nom de l'évenement a écoute est connexion-soket-note-vocaux
$on('connexion-soket-note-vocaux',function (argument) {
	//lancement du chrono
	if ( chrono ) {
		chrono.start() ;
	}
	recording = true;
})

//l'ancer l'enregistrement de song
function startRecording ( NOTEID ) { 
    $('#run-recorded').removeAttr('disabled') ;
    $emit('connexion' , { NOTEID , type : 'infusionsoft' , typeId : config.CONFIG_PAGE.typeId , contactId : config.CONFIG_PAGE.contactId }) ; 
}

//stoper l'enregistrement 
function stopRecording () {
  	recording = false;
	$emit('save-stream' , null ) ; 
}

function recorderProcess(e) {
  	if(!recording) return;
  	var left = e.inputBuffer.getChannelData(0);
	$emit('stream' , [...left] ) ; 	
}

var context = null ; 
function initializeRecorder(stream) {
	var audioContext = window.AudioContext;
	context = new audioContext();
	var audioInput = context.createMediaStreamSource(stream);
	var bufferSize = 2048;
	var recorder = context.createScriptProcessor(bufferSize, 1, 1);
	recorder.onaudioprocess = recorderProcess;
	audioInput.connect(recorder);
	recorder.connect(context.destination);
}

function pauseall() {
	let audios = document.getElementsByTagName("audio") ; 
	for (var i = 0; i < audios.length; i++) {
		audios[0].pause() 
	}
}

//delete audio
async function dellAllAudio( url ) {
	pauseall() ; 
	//cacher le préécoute 
	$('#pre-ecoute-vocaux').hide() ; 
	$( this ).attr('disabled','disabled') ;
	//supression de ce fichier dans le serveur 
	return await fetch( url )  ;
}

function fetchNoteListe(argument) {
	var noteListe = $('.noteContentText') ; 
	noteListe.each(function ( index , e ) {
		var text = $(this).text().trim() ; 
		if ( text.indexOf('NOTEID::') >= 0 ) {
			let repl = text.replace(new RegExp('\r?\n','g'), '<br />'); ; 
			var sdsd = /NOTEID::(.*)::NOTEID(.*)/gi;
			var s = sdsd.exec(repl);
			let ID = '' ; 
			let html = '' ; 
			if ( s[1] ) {
				ID = s[1] ; 
			}
			if ( s[2] ) {
				html = s[2] ; 
			}
			let url = prot+'://'+serveur+port+'/audio/'+ID ; 
			$(this).html( `<a target="_blank" href="${url}">${url}</a></br> 
				${lecteurTpl( url , 'audio-liste-note-'+index )}
				<div>${html}</div>` ) ; 
		}
	})
}

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

jQuery(document).ready(function($) { 
	if( ! ready )
		return alert('getUserMedia non pris en charge par ce navigateur.');
	if ( config.CONFIG_PAGE.page == 'EDITNOTE' ) {
		//var NOTEID = makeid(8) ;
		var NOTEID = `${moment().format('DD-MM-YYYY')}-contactId-${config.CONFIG_PAGE.contactId}-noteId-${makeid(8)}`  ;
		//initialisation de micro recorder 
	    navigator.getUserMedia({audio:true}, initializeRecorder, function(e) {
        	alert('une erreur est survenue');
      	});
	  	//Ajout du template d'enregistrement dans infusionsoft
		var btnAddNote = $('#template').parents('.fieldContainer');
	    btnAddNote.before( recordedTpl() ) ; 
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
	else if(  config.CONFIG_PAGE.page == 'EDITNOTETASK' ){
 
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
	else if ( config.CONFIG_PAGE.page == "HOMENOTE" ) {
		//on est dans la page ou on liste tout les notes 
		//on ajoute le button "add note vocal" 
		var btnAddNote = document.querySelector('#TemplateId ~ input');
		if ( btnAddNote ) {
			$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+config.CONFIG_PAGE.contactId+'\' , {height: 730,width: 730})"  id="ifs-task-vocaux" class="inf-button btn" type="button" value="Ajouter note vocale">' ) 
			//écoute lors du clicque sur l'élement 	
		}
		//ajouter aussi dans add task vocal 
		var btnAddTask = document.querySelector('#Add_Task ~ input');
		if ( btnAddTask ) {
			$(btnAddTask).after( '<input onclick="openTask(\'?view=add&Task0ContactId='+config.CONFIG_PAGE.contactId+'&taskType=task\')" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Ajouter tache vocale">' ) 
			//écoute lors du clicque sur l'élement 	
		}
		fetchNoteListe() ; 
	}else if ( config.CONFIG_PAGE.page == 'HOMENOTEMODALE' ) {
		//on est dans la page ou on liste tout les notes 
		//on ajoute le button "add note vocal" 
		var btnAddNote = document.querySelector('#TemplateId_select ~ input ');
		if ( btnAddNote ) {
			$(btnAddNote).after( '<input onclick="Infusion.Popup.open(\'/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId='+config.CONFIG_PAGE.contactId+'\' , {height: 730,width: 730})" id="ifs-note-vocaux" class="inf-button btn" type="button" value="Add Vocal Note">' ) 
			//écoute lors du clicque sur l'élement 	
		}
		fetchNoteListe() ; 
	}
	else if(config.CONFIG_PAGE.page =='HOMEFUSEDESK'){
		var typeId = config.CONFIG_PAGE.typeId ; 
		//caseActionTabs
		var addbtn = false ; 
		var btnAddNote = document.querySelector('#caseActionTabs li');
		let contactID = '';
		//écoute l'evenement de change DOM 
		var pages = document.querySelector( 'body' ) ; 
		return observeDOM( pages ,function(e){
			var btnAddNote = document.querySelector('#caseActionTabs li.dropdown');
			let links = document.querySelector('.contact-details .header a') ; 
			if(  btnAddNote && links && addbtn === false ){
				let href = links.getAttribute("href");
				let url = new URL( href ); 
				contactID = url.searchParams.get("ID");
				$(btnAddNote).after( `<li class="hidden-xs">
					<a onclick="window.open('https://${typeId}.infusionsoft.com/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId=${contactID}');">Add Vocal Note</a>
				</li>` )
				addbtn = true ; 
			}
		});
	}
	//écoute evenement changement vitesse de lecteur audio 
	$('body').on('click','.speed-fan',function ( e ) {
		e.stopPropagation() ; 
		e.preventDefault() ;
		var el = $( this ) ; 
		var id = el.data('id') ; 
		var value = el.data('value') ;
		var od = document.getElementById( id ) ; 
		od.playbackRate = value ; 
		$('.'+id+'core .speed-fan').removeClass('active') ; 
		el.addClass('active') ; 
	})
	//si le lécteur audio est en play, on affiche son 
	jQuery.createEventCapturing(['play','pause']);  
	$('body').on('play', 'audio', function(){
		var el = $( this ) ; 
		let id = el.data('id') ; 
		var elCtrl = $('.'+id) ;
		elCtrl.show() ; 
	})
	$('body').on('pause', 'audio', function(){
		var el = $( this ) ; 
		let id = el.data('id') ; 
		var elCtrl = $('.'+id) ;
		elCtrl.hide() ;  
	})
});
chrome.runtime.connect();
//ici on écoute s'il y a un evenement du backend qui demande de fermé la fenètre encour 
$on('force-close-tab-save-note',function () {
	window.close()
})