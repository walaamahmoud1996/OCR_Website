const {AddHardcodedAdmin} = require('../middleware/AddHardcodedAdmin')

module.exports = function(app){
  app.get('/',AddHardcodedAdmin,(req,res)=>{
    res.status(200).send('ADVIC backend is now online!, the admin email is "admintest@test.com", the password is "admin123"')
  })
}
