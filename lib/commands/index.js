module.exports = vorpal => {
  require('./cd').add(vorpal)
  require('./config').add(vorpal)
  require('./filter').add(vorpal)
  require('./get').add(vorpal)
  require('./login').add(vorpal)
  require('./open').add(vorpal)
  require('./token').add(vorpal)
  require('./url').add(vorpal)
}
