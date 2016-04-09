var React = require('react')
var ReactDOM = require('react-dom')
var Controller = require('./controller')

window.onload = function() {
  ReactDOM.render(<Controller/>, document.querySelector('#app-target'))
}
