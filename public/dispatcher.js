// public/dispatcher.js
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

// our actions will use this method to broadcast
// i.e. CommandActions.create() would return AppDispatcher.handleAction(),
// passing in an action type as an argument
AppDispatcher.handleAction = function(action){
  this.dispatch({
    action: action
  });
};

module.exports = AppDispatcher;
