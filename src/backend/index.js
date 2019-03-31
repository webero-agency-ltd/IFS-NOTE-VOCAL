import { BinaryClient } from 'binaryjs-client';
import { wav } from 'wav';
import recordRTC from 'recordRTC';

console.log('CONNEXION AU SERVEUR ');

var serveur = '127.0.0.1' ; 

var stream = null ;
var client = null ; 

function connexion( filename , cbl ) {

    client = new BinaryClient( 'ws://'+serveur+':9001?nameFile=' + filename ) ; 

    client.on('open', function() {
          
        stream = client.createStream();
        console.log(' ---- CONNEXION OK ---- ');
        cbl() ; 

    })

}

function convertFloat32ToInt16(buffer) {

      var l = buffer.length;
      var buf = new Int16Array(l);
      while (l--) {
        buf[l] = Math.min(1, buffer[l])*0x7FFF;
      }
      return buf.buffer;

}

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

chrome.runtime.onMessage.addListener(function (msg, sender, response) {

    if ( stream && msg.name=='stream' ) {
        var arr = new Float32Array( msg.data );
        stream.write(convertFloat32ToInt16( arr ));
    }
    else if( msg.name=='connexion' && ! stream ){
        connexion( msg.data , function () {
            emit('connexion-soket-note-vocaux',true,'all') ;
        })
    }else if( stream && msg.name == 'save-stream' ){
        stream.end();
        client.close() ;
        console.log('---STOP STREAM' , stream );
    }else if( client && msg.name == 'stop' ){
        client.close() ;
        console.log('---STOP ICI');
    }

});