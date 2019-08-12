var request = async function( url , op ){
    let headers = { 
        'X-Requested-With' : 'XMLHttpRequest' 
    }
    if ( op.headers ) {
        op.headers = { ...headers , ...op.headers }
    }
    if ( op.method == "GET" ) 
        delete op['body']
    console.log( url , op )
    let resp = await fetch( url , op )
    console.log( resp )
    let response = null ; 
    if ( resp.ok ) { 
        try { response = await resp.json() ; } 
        catch(e) {
            let text = await resp.text() 
            console.log( text )
            return [true, null];
        }
        return [ false , response ]
    }else{
        let text = await resp.text() 
            console.log( text )
    }
    return [true, null];
}


var _chunkIndex = 0 ; 
var _blobs = [] ; 
var file = {} ; 

Event.on('resetData',async function( request ){
    file = {};
    _chunkIndex = 0 ; 
    _blobs = [] ; 
})

Event.on('send_files',async function( request ){
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
            file['file'+request.id] =  mergedBlob ; 
            console.log( '---END RESPONSE : ' , file )
            emit( 'send_files_ok' , 'file'+request.id , 'all' )
        }
    }
})

//enregistrement de files 