var AppDispatcher = require('./dispatcher')

exports.create = function(command, opts) {
  AppDispatcher.handleAction({
    actionType: "CREATE_COMMAND",
    data: command
  });
}

exports.deleteAll = function() {
  AppDispatcher.handleAction({
    actionType: "DELETE_ALL_COMMANDS"
  });
}

exports.deleteLast = function() {
  AppDispatcher.handleAction({
    actionType: "DELETE_LAST_COMMAND"
  });
}
