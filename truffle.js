// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '192.168.3.57',
      port: 9545,
       gas: 4600000,
      network_id: '*' // Match any network id
    }
  }
}
