var Token="";
function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
});
return vars;
}

if(window.location.href.indexOf('token') > -1){
    Token = getUrlVars()['token'];
    console.log('hi');
    console.log(Token);

}