var env = process.env.NODE_ENV;

process.env.PORT = 3000
process.env.JWT_KEY = 'secret'
process.env.MONGODB_URI = 'mongodb://localhost:27017/ADVIC'

if (env === 'test'){
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ADVIC'
}
