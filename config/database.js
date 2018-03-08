if(process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: 'mongodb://keith:iAr^RtM3%t6B@ds137291.mlab.com:37291/jotathought' }
} else {
  module.exports = { mongoURI: 'mongodb://localhost/jot-a-thought' }
}