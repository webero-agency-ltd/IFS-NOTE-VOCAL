$(document).ready(function () {
    $("a").click(function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return !1;
    });

    //changement de l'hfre de connection
    $("#urllogin").attr( 'href' , Api.url+"/logout" );
    $("#urlsignup").attr( 'href' , Api.url+"/signup" );
    Block.syncBlock();

});