chrome.runtime.onMessageExternal.addListener(function ( data ) {
    if (data["setApiKey"]) {
        key = data["setApiKey"];
        Auth.setApiKey(key);
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

function emit(e,d,_tab) {
    chrome.tabs.query({}, 
        function (tabs) {
            if ( _tab === 'all' ) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.sendMessage(
                        tabs[i].id,
                        {name: e, data: d},
                    );
                }
                return;
            }
            let tablable = 0 ; 
            if (_tab!=null) {
                tablable = _tab
            } else if(tabs[0]){
                tablable = tabs[0].id 
            }
            chrome.tabs.sendMessage(
                tablable,
                {name: e, data: d},
            );
        }
    );
}

Event.on('requestApi',async function( data ){
    let { url , method , headers , body , type } = data ; 
    let uploadResponse = null ;
    if ( method ) {
        let formData = new FormData();
        if ( type == 'formData' ) {
            let keys = Object.keys( body )
            for (var i = 0; i < keys.length; i++) {
                if ( keys[i] == 'file' ) {
                    formData.append('file', file );
                }else{
                    formData.append(keys[i], body[keys[i]] );
                }
            }
            body = formData ; 
        }else{
            body = JSON.stringify( body )
        }
        uploadResponse = await fetch( url , { method , headers , body } )
    }else{
        uploadResponse = await fetch( url )
    }
    if ( uploadResponse.ok ) { 
        let json = null ; 
        try {
            json = await uploadResponse.json() ;
        } catch(e) {
            return emit( 'reponseApi' , [ { message : 'FORMAT ERROR' }, null]  ,'all' )
        }
        if ( json && json.type == 'ERROR' ) {
            return emit( 'reponseApi' ,[ json , null ] ,'all' );
        }
        return emit( 'reponseApi' ,[ null, json.data ]  ,'all') ; 
    }
    return emit( 'reponseApi' , response ,'all' )
})

var _chunkIndex = 0 ; 
var _blobs = [] ; 
var file = null ; 

Event.on('resetData',async function( request ){
    file = null;
    _chunkIndex = 0 ; 
    _blobs = [] ; 
})

Event.on('sendData',async function( request ){
    if (request.blobAsText) {                  
        _chunkIndex++;                   
        var bytes = new Uint8Array(request.blobAsText.length);                     
        for (var i=0; i<bytes.length; i++) {
            bytes[i] = request.blobAsText.charCodeAt(i);            
        }         
        _blobs[_chunkIndex-1] = new Blob([bytes], {type: request.mimeString});           
        if (_chunkIndex == request.chunks) {                      
            for (j=0; j<_blobs.length; j++) {
                var mergedBlob;
                if (j>0) {                  
                   mergedBlob = new Blob([mergedBlob, _blobs[j]], {type: request.mimeString});
                }
                else {                  
                   mergedBlob = new Blob([_blobs[j]], {type: request.mimeString});
                }
            }           
            file = mergedBlob ; 
            emit( 'sendDataOk' , null )
        }
    }
})

//écoute evene
chrome.runtime.onConnect.addListener(function (externalPort) {
    onupload = false ; 
    externalPort.onDisconnect.addListener(async function() {

    });
})


Block.syncBlock();
