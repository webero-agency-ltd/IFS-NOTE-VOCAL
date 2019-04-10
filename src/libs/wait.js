
export default function wait(length) {

  	var promise1 = new Promise(function(resolve, reject) {
		setTimeout(function() {
		  	resolve(length);
		}, length);
	});

  	return promise1  ; 
  	
}