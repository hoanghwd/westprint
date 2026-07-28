/**
 * Returns the version of Internet Explorer or a -1
 * (indicating the use of another browser).
 */
function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.

    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }

    return rv;
}

/**
 * JavaScript File for Navigation Bar in the header
 *
 * Created By - Akshay Vaze (akshayvaze@gmail.com)
 * Created Date: 03/11/2014
 *
 * Code got from: Travis Clark
 *
 * Modified By -
 * Modified Date:
 */
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

$(function() {
    var ver = getInternetExplorerVersion();

    if ( ver > -1 ) {
        if ( ver >= 8.0 ) { }
        else {
            $('li').has('ul').mouseover(function(){
                $(this).children('ul').show();
            }).mouseout(function(){
                $(this).children('ul').hide();
            })
        }
    }
    else {
    }
});