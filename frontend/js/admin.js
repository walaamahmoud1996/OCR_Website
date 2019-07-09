//requests URLS
var GetSitesURL = "http://138.68.242.54/sites"
var GetUsersURL = "http://138.68.242.54/users"
var AddUserURL =  "http://138.68.242.54/user/adduser";
var AddSiteURL =  "http://138.68.242.54/site/addsite"




// popup function

function POPup(value){
    var modal = document.getElementById('myModal');
    var content = document.getElementById('content');
        // Get the button that opens the modal
        //var btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
    var msg = document.createElement("p");
    var node = document.createTextNode("");
    node.nodeValue=value;
    msg.appendChild(node);
    msg.style.cssText ="text-align: center;font-family: Times New Roman , Times, serif; font-size :40px;"
    content.replaceChild(msg,content.childNodes[2]);
    modal.style.display = "block";
    
   
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }


}
//get cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


//setting users info 
var username = document.getElementById('username');
var username2= document.getElementById('username2');
username.textContent = getCookie('username');
username2.textContent = getCookie('username');

// get sites 
function htmlhandler(pagecode,response){
    if(pagecode ==1){
        var sel =document.getElementById('Site_Select');
    
        console.log(response.length);
        for(i  in response){
        var opt = document.createElement('option');
    
        opt.appendChild(document.createTextNode(response[i]['site_name']));
        opt.value = response[i]['_id'];
        console.log(opt.value);
        sel.appendChild(opt);
        }
    }
    if(pagecode ==2){
        console.log('hello from handler');
        var table = document.getElementById('site_table');

        for(i in response){
            var row = document.createElement('tr');
            var col0 = document.createElement('td');
            var col1 = document.createElement('td');
            var col2 = document.createElement('td');
            
            col0.appendChild(document.createTextNode(i));
            col1.appendChild(document.createTextNode(response[i]['site_name']));
            col2.appendChild(document.createTextNode(response[i]['site_location']));
            row.appendChild(col0);
            row.appendChild(col1);
            row.appendChild(col2);
            table.appendChild(row);
        }
    }
}


function GetSitesRequest(pagecode){
    var request = new XMLHttpRequest();
    request.open("GET",GetSitesURL,true);
    request.setRequestHeader('Content-Type','application/json');
    request.setRequestHeader('token',getCookie('token'));
    request.send();
    request.onreadystatechange=(e)=>{
        if (request.readyState == 4) {
        var response = JSON.parse(request.responseText);
        console.log(response);
        htmlhandler(pagecode,response);
    
        }
    
    
    }
    
}



//adding a user
function AddUser(){

    console.log('hello');
    var email  = document.getElementById('Email').value,
    password = document.getElementById('Password').value,
    site = document.getElementById('Site_Select'),
    site_selected = site[site.selectedIndex].value,
    type = document.getElementById('Type_Select'),
    type_selected = type[type.selectedIndex].value;
    

    console.log(email);
    console.log(password);
    console.log(site_selected);
    console.log(type_selected);
    var request = new XMLHttpRequest();
    request.open("POST",AddUserURL,true);
    request_body = {
    "email" : email,
    "password" : password,
    "user_site":site_selected,
    "user_type":type_selected
    }
    request.setRequestHeader('Content-Type','application/json');
    console.log(document.cookie);
    request.setRequestHeader('token',getCookie('token'));

    request.send(JSON.stringify(request_body));
    

    request.onreadystatechange=(e)=>{
        if(request.readyState==4){
        var response = JSON.parse(request.responseText);
        console.log(response['message']);
        POPup(response['message']);
    
        
       
    }
    document.getElementById('Email').value="";
    document.getElementById('Password').value="";


}
}

// get all users



//add a new site 

function AddSite(){

    console.log('hello from site');
    var site_name = document.getElementById('site_name').value,
    site_location = document.getElementById('site_location').value;

    var request = new XMLHttpRequest();
    request.open("POST",AddSiteURL,true);
    request_body ={
        "site_name":site_name,
        "site_location": site_location
    }
    request.setRequestHeader('Content-Type','application/json');
    //console.log(document.cookie);
    request.setRequestHeader('token',getCookie('token'));
    request.send(JSON.stringify(request_body));
    
    request.onreadystatechange=(e)=>{
        if(request.readyState==4){
            response = JSON.parse(request.responseText);
           
            POPup(response['message']);
        
            
        }
        document.getElementById('site_name').value="";
        document.getElementById('site_location').value="";

    }
    
  

}
// get all users

function GetUsers(){
    var request = new XMLHttpRequest();
    request.open("GET",GetUsersURL,true);
    request.setRequestHeader('Content-Type','application/json');
    request.setRequestHeader('token',getCookie('token'));
    request.send();
    request.onreadystatechange=(e)=>{
        if(request.readyState ==4){
            response = JSON.parse(request.responseText);
            console.log(response);
            var table = document.getElementById('users_table');
            for (i in response){
                var row = document.createElement("tr");
                var flag = true;

                for (j in response[i]){
                    
                    if(flag)
                    {   
                        var col = document.createElement("td");
                        console.log(i);
                        col.appendChild(document.createTextNode(i));
                        flag =false;
                    }
                    else if(j !="_id" && j!="password" &&j!="__v"){
                        var col = document.createElement("td");
                    col.appendChild(document.createTextNode(response[i][j]));
                    }
                    row.appendChild(col);
                }
                table.appendChild(row);
                
            }
        }
    }

}

