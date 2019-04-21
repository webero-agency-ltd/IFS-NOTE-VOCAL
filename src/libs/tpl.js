
export function recordedTpl() {

	return  `<div class="fieldContainer fieldContainerMargin">
		    <div class="fieldLabel">
		        <label class="action-label" for="template">Vocal </label>
		    </div>
		    <div class="fieldControl">
		        <div style="display: flex;">
		        	<div style="display: flex;">
		    			<div id="logo-recorded" class="recorder-style"></div>
		        		<input id="counter-recorded" class="fieldControlWidth" style="width: 100px; margin-left: 6px;" disabled="disabled" id="timer" name="timer" type="text" value="00:00">
		        	</div>
		            <div style="display: flex;">
		            	<input class="inf-button btn button-x" id="run-recorded" name="runrecorded" type="button" value="Enregistrer">
		            	<input disabled="disabled" class="inf-button btn button-x" id="stop-recorded" name="resetrecorded" type="button" value="Effacer">
		            	<input class="inf-button btn button-x" id="upload-file-btn" type="button" value="Télécharger">
		            	<input style="position: absolute; top: -30000px; left: -30000px;" type="file" id="audio-upload" name="avatar" accept="audio/*">
		            </div>
		        </div>
		    </div>
		    <style>
		    	.recorder-style{
					width: 26px;
					height: 26px;
					border-radius: 26px; 
					background-color: #999 ; 
		    	}
		    	.recorder-style.active{
					background-color: red ;
		    	}
		    </style>
		</div>
		<div class="fieldContainer fieldContainerMargin">
		    <div class="fieldLabel"></div>
		    <div class="fieldControl">
		    	<div id="pre-ecoute-vocaux" style="height: 26px;  background: none; display:none;" > </div>
		    </div>
		</div>` ; 

}

export function lecteurTpl( url , id = "" ) {

	return  `<div class="${id}core" class="audio-controller" >
		<audio data-id="${id}" id="${id}" style="height: 30px;" controls="" >
			<source  src="${url}"  type="audio/mpeg">
		</audio>
		<div class="${id}" style="padding-left: 21px; display:none ; " >
			<a data-id="${id}" data-value="1" class="active speed-fan" href="#"><span>x 1</span></a>
			<a data-id="${id}" data-value="1.25" class="speed-fan" href="#"><span>x 1.25</span></a>
			<a data-id="${id}" data-value="1.50" class="speed-fan" href="#"><span>x 1.50</span></a>
			<a data-id="${id}" data-value="2" class="speed-fan" href="#"><span>x 2</span></a>
		</div>
		<style>
			a.speed-fan{
				color : #b5b5b5 ; 
				display: inline-block;
			    vertical-align: top;
			    margin-left: 0.51rem;
			    margin-right: 0.51rem;
			}
			a.speed-fan.active{
				color : #121212 ; 
			}
		</style>
	</div>` ; 

}

export function selectTpl( title ,option , id = "" , multiple = false ) {

	return  `<div class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	        <select ${multiple==true?'size="'+option.length+'"':''}  id="${id}" style="width:100%;" class="inf-select is-component" ${multiple==true?'multiple="multiple"':''}  name="${id}" data-on="Component.Select">
	        	${option}
	        </select>
	    </div>
	</div>` ; 

}

export function areaTpl( title ,value , id = "" ) {

	return  `<div class="fieldContainer fieldContainerMargin">
	    <div class="fieldLabel fieldLabelVerticalAlignTop">
	        <label class="action-label-area" for="${id}">${title}</label></div>
	    <div class="fieldControl">
	        <textarea id="${id}" class="fieldControlWidth fieldControlTextInputHeight clearable" name="${id}">${value}</textarea>
	    </div>
	</div>` ; 

}

