import timer from '../libs/timer';
import Recorder from '../libs/recoder';

export class Vocale {

    constructor( content ) {

        URL = window.URL || window.webkitURL;
        var gumStream;                    
        var rec;                           
        var input;  
        let chrono;  

        chrono = timer() ;
        chrono.setcallback(function ( time ) {
            document.getElementById('counter-recorded').value = time ; 
        })            
        //.reset() ;         

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext //audio context to help us record

        var recordButton = document.getElementById("recordButton");
        var stopButton = document.getElementById("stopButton");
        var pauseButton = document.getElementById("pauseButton");
        var logoRecorder = document.getElementById("logo-recorded");
        var recorderInfo = document.getElementById("recorder-info");
        var uploadButton = document.getElementById("uploadButton");
        var audioUpload = document.getElementById("audio-upload");

        console.log( recordButton )

        recordButton.addEventListener("click", startRecording);
        stopButton.addEventListener("click", stopRecording);
        uploadButton.addEventListener("click", ( e )=>{
            e.preventDefault()
            e.stopPropagation()
            document.getElementById("audio-upload").click();
        });
        audioUpload.addEventListener("change", uploadFile);
        //pauseButton.addEventListener("click", pauseRecording);
        
        let $this = this ; 

        //ici on veut faire l'upload de fichier 
        function uploadFile( upload ){
            if ( $this.recorder ) {
                $this.recorder( upload.target.files[0] )
            }
        }

        function startRecording(e) {
            console.log("recordButton clicked");
            e.preventDefault()
            e.stopPropagation()
            var constraints = { audio: true, video:false }
            recordButton.disabled = true;
            stopButton.disabled = false;
            //pauseButton.disabled = false

            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
                audioContext = new AudioContext();
                //document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
                gumStream = stream;
                input = audioContext.createMediaStreamSource(stream);
                rec = new Recorder(input,{numChannels:1})
                rec.record()
                chrono.start() ;
                recorderInfo.style.display = 'block';
                //logoRecorder.addClass('active') ;
                // element.classList.add("mystyle"); 
            }).catch(function(err) {
                console.log( err )
                recordButton.disabled = false;
                stopButton.disabled = true;
                //pauseButton.disabled = true
            });
        }

        function pauseRecording(e){
            console.log("pauseButton clicked rec.recording=",rec.recording );
            e.preventDefault()
            e.stopPropagation()
            if (rec.recording){
                //pause
                rec.stop();
                pauseButton.innerHTML="Resume";
            }else{
                //resume
                rec.record()
                pauseButton.innerHTML="Pause";
            }
        }

        function stopRecording(e) {
            console.log("stopButton clicked");
            e.preventDefault()
            e.stopPropagation()
            stopButton.disabled = true;
            recordButton.disabled = false;
            //pauseButton.disabled = true;
            //pauseButton.innerHTML="Pause";
            rec.stop();
            chrono.stop() ; 
            gumStream.getAudioTracks()[0].stop();
            rec.exportWAV(createDownloadLink);
            recorderInfo.style.display = 'none';
        }

        function createDownloadLink(blob) {
            
            if ( $this.recorder ) {
                $this.recorder( blob )
            }
            return 
            var li = document.createElement('div');
            var link = document.createElement('a');
            var filename = new Date().toISOString();
            
            link.href = url;
            link.download = filename+".wav";  
            
            //li.appendChild(document.createTextNode(filename+".wav "))
            li.appendChild(link);
            
            var upload = document.createElement('a');
            upload.href="#";
            upload.innerHTML = "Upload";
            upload.addEventListener("click", function(event){
                console.log('--- UPLOAD')
                var xhr=new XMLHttpRequest();
                xhr.onload=function(e) {
                    if(this.readyState === 4) {
                        console.log("Server returned: ",e.target.responseText);
                    }
                };
                var fd=new FormData();
                fd.append("audio_data",blob, filename);
                xhr.open("POST","upload.php",true);
                xhr.send(fd);
            })

            recordingsList.appendChild(li);
        
        }
    }

    static
    init( content ) {
        let tpl = `<div id="recorder-info" style="display: none;">
            <div style="display: flex;">
                <div id="logo-recorded" class="recorder-style active "></div>
            <input id="counter-recorded" style="width: 100px; margin-left: 6px;" disabled="disabled" name="timer" type="text" value="00 : 00" />
            </div>
        </div>
        <div id="controls" style="display:flex;">
            <button class="btn btn-info btn-block" id="recordButton">Record</button>
            <!--<button id="pauseButton" disabled>Pause</button>-->
            <button class="btn btn-info btn-block" id="stopButton" disabled>Stop</button>
            <!--<button id="deleteButton" disabled>Effacer</button>-->
            <button class="btn btn-info btn-block" id="uploadButton">Télécharger</button>
            <input style="position: absolute; top: -30000px; left: -30000px;" type="file" id="audio-upload" name="avatar" accept="audio/*">
        </div>
        <style>
            .btn-info.disabled, .btn-info:disabled {
                color: #191919 !important;
                background-color: #b3d1e0 !important;
                border-color: #191919 !important;
            }
        </style>
        <div id="recordingsList"></div>`;
        let c = document.getElementById( content ) ;
        content.before( tpl ) 
        return
    }
}

export default Vocale;