/*
*	Evenement de google chrome qui nous permet de communiqué entre backend, popup, injectscript
*/
let on = {} ;

var Event = {
    on: function ( event , func ) {
        if (on[event]) {}
		else{
			on[event] = [] ;
		}
		return on[event].push(func);
    },
    emit: function ( event, option ) {
    	chrome.runtime.sendMessage({
		  	name:   event,
		  	data:   option,
		});
    }
};

chrome.runtime.onMessage.addListener(function (msg, sender) {
    let event = msg.name ; 
    if (on[event]) {
		for (var i = 0; i < on[event].length; i++) {
			on[event][i](msg.data);
		}
	}
});