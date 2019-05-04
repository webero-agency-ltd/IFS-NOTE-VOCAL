import co from './config';
import observeDOM from './observeDOM';
let config = co() ; 

export default function PAGE_HOMEFUSEDESK( ) {
  
  	let typeId = config.CONFIG_PAGE.typeId ; 
	//caseActionTabs
	let addbtn = false ; 
	let btnAddNote = document.querySelector('#caseActionTabs li');
	let contactID = '';
	//écoute l'evenement de change DOM 
	let pages = document.querySelector( 'body' ) ; 
	return observeDOM( pages ,function(e){
		let btnAddNote = document.querySelector('#caseActionTabs li.dropdown');
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