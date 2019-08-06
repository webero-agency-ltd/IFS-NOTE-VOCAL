let background = true ;

chrome.runtime.onMessageExternal.addListener(function ( data ) {
    console.log( data )
    if (data["setApiKey"]) {
        key = data["setApiKey"];
        Auth.setApiKey(key.access_token);
        Auth.checkApiKey(function (apiKey) {
            var a67;
            if (apiKey !== !1) {
                a67 = chrome.extension.getViews({ type: "popup" });
                for (var f67 = 0; f67 < a67["length"]; f67++) {
                    a67[f67]["reload"]();
                }
            }
        });
    } 
});

function emit(e,d) {
    chrome.tabs.query({}, 
        function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage( tabs[i].id, {name: e, data: d} );
            }
        }
    );
}

//préfomatage des requests en post 
Event.on('request',async function( data ){
    let formData = new FormData();
    let { type , url , options , event } = data ; 
    let body = null ; 
    console.log( options , type )
    if ( options && options.body ) {
        let keys = Object.keys( options.body )
        for (var i = 0; i < keys.length; i++) {
            if ( file[keys[i]] ) 
                formData.append('file', file[keys[i]] );
            else
                formData.append( keys[i], options.body[keys[i]] );
        }
        body = formData ; 
    } 
    body ? data.options.body = body : '' ; 
    let res = await request( url , data.options ) ; 
    console.log('---RESPONSE BACKROUDN : ' , res )
    return emit( event , res ,'all' )
})

//écoute evene
chrome.runtime.onConnect.addListener(function (externalPort) {
    let APIkey = Auth.checkApiKey();
    console.log('--- initialisation de tout les app data')
    if ( APIkey ) 
        emit('IntiAppData',true,'all')
    else
       Auth.logoutAction() ;
    externalPort.onDisconnect.addListener(async function() {});
})

Block.syncBlock();