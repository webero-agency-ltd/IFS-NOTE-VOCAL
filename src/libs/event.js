
let on = {} ;

export function $on( event , func ) {

	if (on[event]) {
		
	}else{
		on[event] = [] ;
	}

	return on[event].push(func);

}

export function $emit( event , option ) {

	chrome.runtime.sendMessage({
	  	name:   event,
	  	data:   option,
	});

}

chrome.runtime.onMessage.addListener(function (msg, sender) {

    let event = msg.name ; 
    if (on[event]) {
		for (var i = 0; i < on[event].length; i++) {
			on[event][i](msg.data);
		}
	}
	
});