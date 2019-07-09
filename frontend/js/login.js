
var LoginURL = "http://138.68.242.54/user/login/"
var token = "";

document.getElementById('login_button').addEventListener('click',function(){
    var email = document.getElementById('Email').value,
    password= document.getElementById('Password').value;
    console.log('hi',email);
    console.log('hi',password);
    var request = new XMLHttpRequest();
    request.open("POST",LoginURL,true);
    request_body = {
        "email" : email,
        "password" : password
    }
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(request_body));

    request.onreadystatechange=(e)=>{
        var response = JSON.parse(request.responseText);
        console.log(response);
        console.log(response['message']);
        console.log(response['user_type']);
       
       // this.Authenticate(response['user_type']);
       if(response['message']=="Auth successful"){
        token =response['token'];
        document.cookie = "token="+token;
        document.cookie = "username="+email;
        switch(response['user_type']){
            case 'admin': window.location.assign('../pages/users/admin.html');break;
        

             }
        }

    }

});