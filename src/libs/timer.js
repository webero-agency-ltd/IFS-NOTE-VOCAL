/*
*	C'est une classe qui va généré le muniteur  
*/
class timerClass{
	constructor(){
		//le temps total du timmer actuelle 
		this.totalSeconds = 0;
		//
		this.intervaleTimerRecorder = null ; 
		//pause 
		this.pause = false ; 
		this.cbl = null ; 
	}
	setTime() {
	  	++this.totalSeconds;
	  	var secondsLabel = this.pad(this.totalSeconds % 60);
	  	var minutesLabel = this.pad(parseInt(this.totalSeconds / 60));
	  	if ( this.cbl ) {
	  		this.cbl( minutesLabel + " : " + secondsLabel ) ; 
	  	}
	}
	pad(val) {
		var valString = val + "";
		if (valString.length < 2) {
		    return "0" + valString;
		} else {
		    return valString;
		}
	}
	start(){
		this.stop() ; 
		this.intervaleTimerRecorder = setInterval(()=>{
			if ( !this.pause ) {
				this.setTime() ; 
			}
		}, 1000);
	}
	stop(){
		clearInterval( this.intervaleTimerRecorder ) ;
		this.totalSeconds = 0;
	}
	reset(){
		this.totalSeconds = 0;
	  	var secondsLabel = this.pad(this.totalSeconds % 60);
	  	var minutesLabel = this.pad(parseInt(this.totalSeconds / 60));	
		clearInterval( this.intervaleTimerRecorder ) ;
		if ( this.cbl ) {
	  		this.cbl( minutesLabel + " : " + secondsLabel ) ; 
	  	}
	}
	pause(){
		this.pause = true ; 
	}
	play(){
		this.pause = false ; 
	}
	setcallback( cbl ){
		this.cbl = cbl ; 
	}
}
export default function timer(length) {
	return new timerClass() ; 
}