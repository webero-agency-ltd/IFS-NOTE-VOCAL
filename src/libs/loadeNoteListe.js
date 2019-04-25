
//transformation de tout les notes des pages
//qui a les donners : NOTEID::xxx::NOTEID
//en input audio qui permet de lire les note 
export default function wait(length) {
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