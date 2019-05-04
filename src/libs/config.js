var CONFIG_PAGE = {
}
function findconfig () {
	var location = window.location ;  
	var url = new URL( location ); 
	//si le modale est un popup ou pas 
	var popup = url.searchParams.get("isPop");
	//si on est dans le modale d'enregistrement de note vocaus 
	var vocaux = url.searchParams.get("vocaux");
	//récupération du contact ID
	var contactId = url.searchParams.get("ID");
	if (!contactId) {
		contactId = url.searchParams.get("contactId");
	}
	if ( !contactId ) {
		contactId = url.searchParams.get("Task0ContactId");
	}
	//id infusion soft 
	var typeId = '' ; 
	var platfome = 'ifs' ; 
	if ( location.href.indexOf('fusedesk') > -1 ) {
		var sdsd = /https:\/\/(.*)\.fusedesk\.com/gi;
		var s = sdsd.exec(location.href);
		platfome = 'fusedesk';
		typeId = s[1] ; 
	}else if ( location.href.indexOf('infusionsoft') > -1 ) {
		var sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
		var s = sdsd.exec(location.href);
		typeId = s[1] ; 
	}
	var page = '' ;
	if ( location.pathname=='/ContactAction/manageContactAction.jsp' && vocaux ) {
		page = 'EDITNOTE'
	}else if ( location.pathname=='/ContactAction/manageContactAction.jsp' && !vocaux ) {
		page = 'CHEKUPDATENOTE' ; 
	}else if ( location.pathname=='/Contact/manageContact.jsp' && !popup ) {
		page = 'HOMENOTE' ; 
	}else if ( location.pathname=='/ContactAction/allHistoryPop.jsp' ) {
		page = 'HOMENOTEMODALE' ; 
	}else if ( location.pathname=='/app/' && platfome =='fusedesk' ) {
		page = 'HOMEFUSEDESK' ; 
	}else if( location.pathname=='/Task/manageTask.jsp' ){
		//Page add task vocal 
		page = 'EDITTASK' ;
	}
	CONFIG_PAGE = { popup , typeId , contactId , vocaux , page , ...CONFIG_PAGE } ; 
}

findconfig() ;

export default function config() {
	return { CONFIG_PAGE , URL : 'therapiequantique.net' , PORT : '' , PROT : 'https' } ;//'www.therapiequantique.net' 
	//return { CONFIG_PAGE , URL : 'localhost' , PORT : ':3000' , PROT : 'http' } ;
}