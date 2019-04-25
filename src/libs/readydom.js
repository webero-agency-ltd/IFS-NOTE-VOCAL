import observeDOM from './observeDOM' ; 

export default function readydom( select , callback ) {
  	let sel = document.querySelector( select ) ;
  	if ( sel ) {
  		callback() ; 
  	} else {
  		setTimeout(function() {
  			readydom( select , callback ) 
  		},500);
  	}
}