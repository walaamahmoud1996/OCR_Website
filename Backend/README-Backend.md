# ADVIC

This is the documentation you will need to contact the API.
Here are the implemented routes and how to use them

## Mandatory routes
#1) Functionality : Add hardcoded admin user in the database  

    Route: GET /  
    Expected return code: *200*
    
## Normal routes

For all the next routes the following applies\
this header is needed Content-Type = application/json
If you got a *500* back, this means the server crashed

#1)  Functionality : Login 

    Route: POST /user/login  
    Expected data input format:  
        * _email_  --> this key has the email of the user\
        *_password_  --> this key has the password of the user
        
    Expected return codes:  
    1) *200* --> Logged in
        * In this case you will need to save the token field from the response
    2) *404* --> User isn't in the database
    3) *400* --> Error occured

#2) Functionality : Add site

    Route: POST /site/addsite  
    Expected data input format:  
        * site_name  --> this key has the site name\
        * site_location  --> this key has the site location\
        
    Expected return codes:  
    1) *200* --> Added the site
    2) *409* --> Conflict with the database, see response.body.message for it
    3) *400* --> Error occured 
    
#3) Functionality : Add uploader/approver to the site

    Route: POST /site/adduser  
    Expected data input format:  
        In Headers:
        token --> token you received after login
        In body:
        * email  --> this key has the site name\
        * password  --> this key has the site location\
        * user_type --> "approver" or "uploader"\
        * user_site --> Id of the site you want to add the user to  
        
    Expected return codes:  
    1) *200* --> Added the site
    2) *409* --> Conflict with the database, see response.body.message for it
    3) *400* --> Error occured 
    
#4) Functionality : Get all sites

    Route: GET /sites  
        
    Expected return codes:  
    1) *200* --> Returned all sites in json files
    
#5) Functionality : Get all users

    Route: GET /users  
    Expected data input format:  
    In Headers:
    token --> token you received after login
    Expected return codes:  
    1) *200* --> Returned all sites in json files

#6) Functionality : Uploader adds a file

    Route: POST /file/addfile  
    Expected data input format:  
    In Headers:
    token --> token you received after login
    In body:
        * upload_name  --> the upload name that links the files to each others\
        * pdf_excl_file --> the pdf document\
        * pdf_excl_file --> the excel document  
    Expected return codes:  
    1) *200* --> Returned all sites in json files
    2) *400* --> Error occured
