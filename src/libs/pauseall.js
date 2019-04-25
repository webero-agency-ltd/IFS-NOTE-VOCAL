
export default function pauseall(length) {
  	let audios = document.getElementsByTagName("audio") ; 
	for (var i = 0; i < audios.length; i++) {
		audios[0].pause() 
	}
}