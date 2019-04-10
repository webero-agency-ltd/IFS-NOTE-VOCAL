import { BinaryClient } from 'binaryjs-client';
import { wav } from 'wav';
import recordRTC from 'recordRTC';

import co from '../libs/config';

var config = co() ;

let serveur = config.URL ; 
 
console.log( serveur );

var stream = null ;
var client = null ; 
var onupload = false ; 

function connexion( data , cbl ) {

    var {
        NOTEID , 
        type , 
        typeId , 
        contactId
    } = data  ; 

    setTimeout(function () {

        console.log('FIND SERVEUR' , serveur );
        
        client = new BinaryClient( 'ws://'+serveur+':9001?id='+NOTEID+'&type='+type+'&typeId='+typeId+'&contactId='+contactId ) ; 

        client.on('open', function() { 
          
            stream = client.createStream();
            console.log(' ---- CONNEXION OK ---- ');
            cbl() ; 

        })

    }, 1000 );

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
        stream = null ; 
        console.log('--- STOP STREAM ' , stream );
    } else if( client && msg.name == 'delete' ){
        client.close();
        stream = null ;
        client = null ; 
        console.log('--- DELETE CLIENT' , stream );
    }  else if( msg.name == 'upload' ){
        console.log(' --- UPLOAD ACTION ');
        onupload = msg.data ; 
    }  

});

//écoute evene
chrome.runtime.onConnect.addListener(function (externalPort) {

    //au 
    onupload = false ; 

    externalPort.onDisconnect.addListener(async function() {

        console.log('---- CLOSE' , client );
        if( client ){
            setTimeout(function (argument) {
                client.close() ;
                stream = null ;
                client = null ; 
                console.log('--- STOP ICI CLIENT HERE');
            }, 1500);
        }else if ( onupload ) {
            console.log('--- CLOSE URL : ' , onupload );
            await fetch( onupload )   ;
        }

    });


})