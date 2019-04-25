/* *traitement de l'enregistrement des micro  */
import { BinaryClient } from 'binaryjs-client';
import recordRTC from 'recordRTC';
import { wav } from 'wav';
import moment from 'moment' ; 
import makeid from './makeid';
import co from './config';
import timer from './timer';
import { recordedTpl , lecteurTpl } from './tpl'
import { $on , $emit } from '../libs/event';
import readydom from '../libs/readydom';
import pauseall from '../libs/pauseall';
import { recorder } from './DOM' ; 

let config = co() ; 
let { serveur , port , prot } = config.URL ;

let context = null ; 
class recordClass{

	constructor(){
		this.NOTEID = null ; 
		//si cette valeur est = true, on fait l'enregistrement automatique des flux audio au serveur  	
		this.recording = false ; 
		this.chrono = false ;
		this.dom = {} ; 
	}
	//on demande au serveur de commencer une enregistrement 
	//si le reserveur répond OK, le backend lance une evenement 
	//connexion-soket-note-vocaux
	start( NOTEID ){
		let { btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
		//transformation des buttons du recorder 
		listenContent.html(' ') ; 
		//supression de tout les audios controller qui existe X1, X2, avec l'élement audion en question 
		let el = listenContent.find('.audio-controller') ; 
		if (el.length) {
			el.remove() ; 
		}
		//changer le logos en active, pour le rendre de couleur rouge
		logoRecorder.addClass('active') ;  
		//transformation du btn star en btn stop qui va stoper l'enregistrement de vocaux 
		btnRun.val('stop enregistrement') ; 
		btnRun.removeAttr('disabled') ;
		//desactiver le buttin qui va permerter de suprmimer les notes 
		btnDelete.attr('disabled','disabled') ;
		//desactiver le button de création de note ( validation de note d'infusionsoft ), et de couleur vert
		noteSave.attr('disabled','disabled') ;
		//demande de connexion au serveur 
    	$emit('connexion' , { NOTEID : this.NOTEID , type : 'infusionsoft' , typeId : config.CONFIG_PAGE.typeId , contactId : config.CONFIG_PAGE.contactId }) ; 
	}
	stop(){
		//stop l'enregistrement 
		this.chrono.stop() ; 
		let { btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
		logoRecorder.removeClass('active')
		btnDelete.removeAttr('disabled') ;
		btnRun.val('Enregistrer') ; 
		//affichage du préécoute 
		let url = prot+'://'+serveur+port+'/audio/'+ this.NOTEID +'/?token='+makeid(60) ;
		let tpl = lecteurTpl( url , 'audio-liste-note-recordin' ) ; 
		pre.html( tpl ) ; 
		pre.show() ;
		noteSave.removeAttr('disabled') ;
		//demande au serveur de stoper l'enregistrement 
		this.recording = false;
		$emit('save-stream' , null ) ; 	
	}
	pause(){
	}
	//supression du record enregistré actuelement 
	async delete( url ) {
		pauseall() ; 
		//cacher le préécoute 
		$('#pre-ecoute-vocaux').hide() ; 
		$( this ).attr('disabled','disabled') ;
		//supression de ce fichier dans le serveur 
		return await fetch( url )  ;
	}
	//création de ID 
	makeid(){
		this.NOTEID = makeid(8) ;
		//this.NOTEID = `${moment().format('DD-MM-YYYY')}-contactId-${config.CONFIG_PAGE.contactId}-noteId-${makeid(8)}`  ;
	}
	//ajout du template du recorder ICI
	recorder(){
		//écouter ici si les elements du recorder sont tout bien enregistré au DOM 
		readydom('#recorder-template', () => {
			this.dom = recorder() ;
			//lancement des utiles par le recorder en question 
			this.event() ; 
		})
		return recordedTpl()  ; 
	}
	//envoyer le flux de traitement a la backend de l'application  
	recorderProcess(e) {
	  	if(!this.recording) return;
	  	let left = e.inputBuffer.getChannelData(0);
		$emit('stream' , [...left] ) ; 	
	}
	//capture le flux audio qui vient du micro
	//et faire quelque traitement 
	initializeRecorder(stream) {
		let audioContext = window.AudioContext;
		context = new audioContext();
		let audioInput = context.createMediaStreamSource(stream);
		let bufferSize = 2048;
		let recorder = context.createScriptProcessor(bufferSize, 1, 1);
		recorder.onaudioprocess = this.recorderProcess;
		audioInput.connect(recorder);
		recorder.connect(context.destination);
	}
	//initialisation du composante d'enregistrement 
	init(){
		//initialisation de micro recorder 
	    navigator.getUserMedia({audio:true}, ( stream ) => {
	    	this.initializeRecorder( stream )
	    } , function(e) {
	    	alert('une erreur est survenue');
	  	});
	  	//lancement de l'initialisation du timeur 
		this.chrono = timer() ;
		this.chrono.setcallback(function ( time ) {
			document.getElementById('counter-recorded').value = time ; 
		}) 
		//écoute si le backend lance une evenement connexion-soket-note-vocaux
		//cette evenement veut dire que le serveur a répondu OK et on peut commencer 
		//l'enregistrement 
		$on('connexion-soket-note-vocaux',function (argument) {
			console.log('EVENEMENT DEPUIS BACKEND connexion-soket-note-vocaux')
			//lancement du chrono
			if ( this.chrono ) {
				this.chrono.start() ;
			}
			this.recording = true;
		})
	}

	event(){
		console.log(' --- RUN LISTEN EVENEMENT ')
		let { btnRun } = this.dom ; 
		btnRun.on( 'click' , async () => {
			//écouter le clique de l'enregistrement des notes vocaux 
			if ( this.recording ) 
				this.stop() ; 
			else
				this.start() ; 
		})

	}
}
export default function recorderinstance(length) {
	return new recordClass() ; 
}