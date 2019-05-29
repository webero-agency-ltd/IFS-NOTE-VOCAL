import observeDOM from './observeDOM' ; 

export default function readydom( select , callback , ifm ) {
	
	let sel = null ; 
	let iframe = document.querySelector( ifm );
	if ( iframe ) {
		let sel_ = iframe.contentDocument || iframe.contentWindow.document;
		sel = sel_.querySelector( select )
	}else{
		sel = document.querySelector( select ) ;
	}
	if ( sel ) {
  		callback() ; 
  	} else {
  		setTimeout(function() {
  			readydom( select , callback , ifm ) 
  		},500);
  	}
}