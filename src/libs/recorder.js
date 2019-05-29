/* *traitement de l'enregistrement des micro  */
import { BinaryClient } from 'binaryjs-client';
import recordRTC from 'recordRTC';
import { wav } from 'wav';
import moment from 'moment' ; 
import makeid from './makeid';
import co from './config';
import timer from './timer';
import { recoder , lecteurTpl } from './tpl'
import { $on , $emit } from '../libs/event';
import readydom from '../libs/readydom';
import pauseall from '../libs/pauseall';
import { recorder } from './DOM' ; 

let config = co() ; 

let context = null ; 
class recordClass{

	constructor(){
		this.NOTEID = null ; 
		//si cette valeur est = true, on fait l'enregistrement automatique des flux audio au serveur  	
		this.recording = false ; 
		this.chrono = false ;
		this.dom = {} ; 
		this.urlPrelisten = null ; 
		this.onSave = null ;
		this.startCLB = null ; 
	}
	//on demande au serveur de commencer une enregistrement 
	//si le reserveur répond OK, le backend lance une evenement 
	//connexion-soket-note-vocaux
	start( NOTEID ){
		let { audioUpload , btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
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
		//désactivé le button uploader 
		audioUpload.attr('desabled','desabled') ; 
		//desactiver le buttin qui va permerter de suprmimer les notes 
		btnDelete.attr('disabled','disabled') ;
		//desactiver le button de création de note ( validation de note d'infusionsoft ), et de couleur vert
		noteSave.attr('disabled','disabled') ;
		//demande de connexion au serveur 
    	$emit('connexion' , { NOTEID : this.NOTEID , type : 'infusionsoft' , typeId : config.typeId , contactId : config.contactId }) ; 
	}
	stop(){
		//stop l'enregistrement 
		this.chrono.stop() ; 
		let { btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
		logoRecorder.removeClass('active')
		btnDelete.removeAttr('disabled') ;
		btnRun.attr('disabled','disabled') ;
		btnRun.val('Enregistrer') ; 
		//affichage du préécoute 
		let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'') +'/audio/'+ this.NOTEID +'/?token='+makeid(60) ; 
		let tpl = lecteurTpl( url , 'audio-liste-note-recordin' ) ; 
		listenContent.html( tpl ) ; 
		listenContent.show() ;
		noteSave.removeAttr('disabled') ;
		//demande au serveur de stoper l'enregistrement 
		this.recording = false;
		$emit('save-stream' , null ) ; 	
	}
	showNote( url ){
		let { btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
		let tpl = lecteurTpl( url , 'audio-liste-note-recordin' ) ; 
		listenContent.html( tpl ) ; 
		listenContent.show() ;
	}
	pause(){
	}
	//supression du record enregistré actuelement 
	async delete( url ) {
		pauseall() ; 
		//cacher le préécoute 
		let { btnRun , btnDelete , noteSave , logoRecorder , listenContent } = this.dom ; 
		listenContent.hide() ; 
		btnDelete.attr('disabled','disabled') ;
		btnRun.removeAttr('disabled') ;
		//rendre de nouveaux inactive la button de création de notes 
		noteSave.attr('disabled','disabled') ;		
		//supression de ce fichier dans le serveur 
		return await fetch( url )  ;
	}
	//création de ID 
	makeid( ID ){
		if ( ID ) {
			return this.NOTEID = ID ; 
		}
		return this.NOTEID = makeid(8) ;
		//this.NOTEID = `${moment().format('DD-MM-YYYY')}-contactId-${config.CONFIG_PAGE.contactId}-noteId-${makeid(8)}`  ;
	}
	//ajout du template du recorder ICI
	recorder(){
		//écouter ici si les elements du recorder sont tout bien enregistré au DOM 
		readydom('#recorder-template', () => {
			this.dom = recorder() ;
			if ( this.urlPrelisten ) {
				this.showNote( this.urlPrelisten )
			}
			//lancement des utiles par le recorder en question 
			this.event() ; 
		})
		return recoder()  ; 
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
		recorder.onaudioprocess = this.recorderProcess.bind(this);
		audioInput.connect(recorder);
		recorder.connect(context.destination);
	}
	//initialisation du composante d'enregistrement 
	init( ID , urlPrelisten ){

		if ( urlPrelisten ) {
			this.urlPrelisten = urlPrelisten ; 
		}
		//@todo : le button vert de création de note a ajouter un attribut desabled 
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
		$on('connexion-soket-note-vocaux', () => {
			//lancement du chrono
			if ( this.chrono ) {
				this.chrono.start() ;
			}
			this.recording = true;
		})

		$on('audio-recoreder-end-stream', () => {
			if ( this.onSave ) {
				this.onSave()
			}
		})
		
		return this.makeid( ID ) ; 
	}

	event(){
		let { noteSave , btnRun , btnDelete , audioUpload , audioUploadBtn , listenContent } = this.dom ; 
		btnRun.on( 'click' , async () => {
			//écouter le clique de l'enregistrement des notes vocaux 
			if ( this.recording ) 
				this.stop() ; 
			else
				this.start() ; 
		})
		btnDelete.on( 'click' , async () => {
			this.chrono.reset() ;
			let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');	
			url = url+'/audio/delete/'+ this.NOTEID ;
			this.delete( url ) ;
		})
		audioUpload.on( 'change' , async (ev) => {
			if ( ev.target.files.length ) {
				listenContent.html('') ; 
				//désactivé la button 
				audioUploadBtn.attr('disabled','disabled') ;
				//désactivé le button delete 
				btnDelete.attr('disabled','disabled') ;
				//désactivé le boutton reocerd 
				btnRun.attr('disabled','disabled') ;
				//éfacer l'enregistrement précedement fait 
				this.chrono.reset() ;
				//désactivé le button de création de note
				noteSave.attr('disabled','disabled') ;
				let formData = new FormData();
				formData.append('file', ev.target.files[0] );
				//faire l'uploade automatiquement 
				let url = __OPTION__.proto+'://'+__OPTION__.domaine+(__OPTION__.port?':'+__OPTION__.port:'');	
				let _url = url+'/upload?unique='+this.NOTEID+'&type=infusionsoft&typeId='+config.typeId+'&contactId='+config.contactId  ;
				$emit('upload', url+'/close/'+this.NOTEID )
				let uploadResponse = await fetch( _url , {
				    method: 'POST',
				    headers: {
				      	//'Content-Type': 'multipart/form-data'
				    },
				    body: formData
				})
				if ( uploadResponse.ok ) { 
					let data = await uploadResponse.json() ; 
			    	//écoute l'audio qui é été Enregistrer  
			    	let url = PROT+'://'+URL+PORT+'/audio/'+ this.NOTEID +'/?token='+makeid(60) ;
					listenContent.html(lecteurTpl( url , 'audio-liste-note-upload' )) ;
					listenContent.show() ;
					noteSave.removeAttr('disabled') ; 
					if ( this.onSave ) {
						this.onSave()
					}
			    }
			    //Tout les button son de nouveaux clicable 
				setTimeout(function () {
					//désactivé la button 
					audioUploadBtn.removeAttr('disabled') ;
					//désactivé le button delete 
					btnDelete.removeAttr('disabled') ;
					//désactivé le boutton reocerd 
					//btnRun.removeAttr('disabled') ;
				}, 1000);
			}
		})
		//ICI on veut faire l'upload de fichier 
		audioUploadBtn.on('click',function () {
			audioUpload.trigger('click') ; 
		})

	}
}
export default function recorderinstance(length) {
	return new recordClass() ; 
}