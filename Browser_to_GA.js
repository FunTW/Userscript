// ==UserScript==
// @name         Browser to GA
// @version      0.6
// @description  GA
// @author       fUN
// @match        *://*/*
// @grant        GM.webRequest
// @grant        GM_xmlhttpRequest
// @domain       www.google-analytics.com
// ==/UserScript==
//Settings
const tid = '' // Fill Ga TrackID ex. UA-xxxxxxxxx-1
const gaType = 'pageview' //LogMode：event ,pageview

const singleUser = 0 // 0=random,1=singleuserMode
let cid = singleUser
//log main page
sendGA(window.location.href)

console.log(0,'starting')
function getTimestamp() {
    console.log("getTimestamp------");
    return new Date().getTime();
}
var a ={}
function sendGA(urlstr,embed=false) {
    console.log("sendGA------");
    console.log(embed, urlstr);
    const url = new URL(urlstr);
    if(!singleUser){
        cid = getTimestamp()
    }

    let ref
    let hostname
    let pathname
    if (gaType == 'event'){
        ref = "el"
        hostname = "ec"
        pathname = "ea"

    }else{
        ref = "dr"
        hostname = "dp"
        pathname = "dt"
    }
    if(embed){
        ref = "&"+ref+"="+ window.location.href
    }
    const data = "v=1&tid="+ tid +"&cid="+cid+"&t="+ gaType +"&ua=Fun&"+hostname+"="+ url.hostname +"&"+pathname+"="+ url.pathname +ref

    GM_xmlhttpRequest({
        url:"https://www.google-analytics.com/collect",
        data:data,
        method:"POST",
        headers:{"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(response) {
            //console.log(JSON.stringify(response.responseText));
        }
    });
}


GM.webRequest([
    { selector: { }, action: { redirect: { from: '(.*)', to: '$1' } } },
    ], function(info, message, details) {
    // 避免跑兩次
    var time
    if (!a[details.url]){
        time = getTimestamp()
        a[details.url] = time
    }else{
        var time2 = getTimestamp()
        if((11,(time2 - a[details.url])) < 1000){
            a[details.url] = false
            console.log(999,"break")
            return
        }else{
            console.log(998,(time2 - a[details.url]))
        }
        time = time2
    }
    console.log(time);
    //log embed page
    sendGA(details.url,1)

});
console.log('done')
