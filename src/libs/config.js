export default function config() {
	
	let location = window.location ;  
	let url = new URL( location ); 
	//si le modale est un popup ou pas 
	let popup = url.searchParams.get("isPop");
	//si on est dans le modale d'enregistrement de note vocaus 
	let vocaux = url.searchParams.get("vocaux");
	//récupération du contact ID
	let contactId = url.searchParams.get("ID");
	if (!contactId) {
		contactId = url.searchParams.get("contactId");
	}
	if ( !contactId ) {
		contactId = url.searchParams.get("Task0ContactId");
	}
	//id infusion soft 
	let typeId = '' ; 
	let platfome = 'ifs' ; 
	if ( location.href.indexOf('fusedesk') > -1 ) {
		let sdsd = /https:\/\/(.*)\.fusedesk\.com/gi;
		let s = sdsd.exec(location.href);
		platfome = 'fusedesk';
		typeId = s[1] ; 
	}else if ( location.href.indexOf('infusionsoft') > -1 ) {
		let sdsd = /https:\/\/(.*)\.infusionsoft\.com/gi;
		let s = sdsd.exec(location.href);
		typeId = s[1] ; 
	}
	let type = 'infusionsoft' ;
	let page = '' ;
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
	}else if( location.host=='trello.com' ){
		//Page add task vocal 
		page = 'TRELLO' ;
		typeId = location.pathname
		type = 'trello'
	}

	return { popup , type , typeId , contactId , vocaux , page } ;

}