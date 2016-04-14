var AppDispatcher = require('./dispatcher')

exports.create = function(command) {
  AppDispatcher.handleAction({
    actionType: "CREATE_COMMAND",
    data: command
  });
}
