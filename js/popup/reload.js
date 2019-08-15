$(document).ready(function () {
    $("a").click(function () {
        chrome.tabs.create({ url: Api.url + $(this).attr('href') });
        return !1;
    });
});