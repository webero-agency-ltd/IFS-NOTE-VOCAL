$(document).ready(function () {
    $("a").click(function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return !1;
    });
    Block.syncBlock();
});