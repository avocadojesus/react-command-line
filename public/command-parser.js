var React = require('react')

exports.parse = function(command) {
  switch (command.toLowerCase()) {
    case 'welcome':
      return (
        <h1>Welcome to my react flux tutorial!!!</h1>
      )
    case 'help':
      return (
        <h1>type some commands to get started</h1>
      )
    case 'ls':
      return (
        <div>
          <h3>Commands</h3>
          <ul>
            <li>welcome: prints a welcome message</li>
            <li>help: lists all of the available commands</li>
          </ul>
        </div>
      )
    default:
      return <span style={{color: 'red'}}>command {command.toLowerCase()} not found</span>
  }
}
