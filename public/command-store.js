var AppDispatcher = require('./dispatcher');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var _store = [];

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case "CREATE_COMMAND":
      _store.push(action.data);
      commandStore.emit('change');
      break;
  }
});

var commandStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on('change', cb);
  },
  get: function(){
    return _store;
  },
});

module.exports = commandStore;
