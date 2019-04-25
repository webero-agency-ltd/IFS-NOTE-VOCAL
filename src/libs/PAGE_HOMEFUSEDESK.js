
export default function editnote(length) {
  	var typeId = config.CONFIG_PAGE.typeId ; 
	//caseActionTabs
	var addbtn = false ; 
	var btnAddNote = document.querySelector('#caseActionTabs li');
	let contactID = '';
	//écoute l'evenement de change DOM 
	var pages = document.querySelector( 'body' ) ; 
	return observeDOM( pages ,function(e){
		var btnAddNote = document.querySelector('#caseActionTabs li.dropdown');
		let links = document.querySelector('.contact-details .header a') ; 
		if(  btnAddNote && links && addbtn === false ){
			let href = links.getAttribute("href");
			let url = new URL( href ); 
			contactID = url.searchParams.get("ID");
			$(btnAddNote).after( `<li class="hidden-xs">
				<a onclick="window.open('https://${typeId}.infusionsoft.com/ContactAction/manageContactAction.jsp?isPop=true&vocaux=true&view=add&contactId=${contactID}');">Add Vocal Note</a>
			</li>` )
			addbtn = true ; 
		}
	});
}