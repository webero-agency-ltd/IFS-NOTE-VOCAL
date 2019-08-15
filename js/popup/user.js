
$(document).ready(function () {
    $("#username").html( window.parent.userConnected.name );
    $('#urlmogout').on('click',async function (event) {
    	await Auth.logoutAction() ; 
    	console.log('_______')
    })
});