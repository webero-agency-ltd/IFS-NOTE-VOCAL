import co from './config';
import { lecteurTpl } from './tpl';

let config = co() ; 
let { PORT , PROT , URL } = config ;

//transformation de tout les notes des pages
//qui a les donners : NOTEID::xxx::NOTEID
//en input audio qui permet de lire les note 
export default function loadeNoteListe(length) {

  	var noteListe = $('.noteContentText') ; 
	noteListe.each(async function ( index , e ) {
		var text = $(this).text().trim() ; 
		if ( text.indexOf('NOTEID::') >= 0 ) {
			let repl = text.replace(new RegExp('\r?\n','g'), '<br />'); ; 
			let sdsd = /NOTEID::(.*)::NOTEID(.*)/gi;
			let s = sdsd.exec(repl);
			let ID = '' ; 
			let html = '' ; 
			if ( s[1] ) {
				ID = s[1] ; 
			}
			if ( s[2] ) {
				html = s[2] ; 
			}
			let url = PROT+'://'+URL+PORT+'/audio/'+ID ; 
			let last = html.trim().substr(html.length - 3);   
				console.log( last ); 
			if ( last === '...' ) {
				let url = PROT+'://'+URL+PORT+'/note/'+ID+'?token='+navigator.userCookie ;  
				html += `<a data-url="${url}" class="readmore-note-vocaux" href="">voire plus</a>` ;
			}
			$(this).html( `<a target="_blank" href="${url}">${url}</a></br> 
				${lecteurTpl( url , 'audio-liste-note-'+index )}
				<div class="content-note-vocaux">${html}</div>` ) ; 
		}
	})

	$('body').on('click','.readmore-note-vocaux',async function (e) {
		e.preventDefault() ; 
		e.stopPropagation() ; 
		let url = $(this).data('url')
		let otherinfo = await fetch( url ) ; 
		if ( otherinfo.ok ){
			let infonotes = await otherinfo.json() ; 
			let htmlchange = ''; 
			if ( infonotes && infonotes.text ) {
				htmlchange = infonotes.text.replace(new RegExp('\r?\n','g'), '<br />'); ; 
			}
			if ( infonotes ) {
				$(this).parent('.content-note-vocaux').html( htmlchange ) ; 
			}else{
				$(this).remove() ; 
			}
		} 
		//a partire de l'ID du note, on fait la récupération des donners des notes en plus,
		//ceci afin d'afficher les voire plus 
	})
}