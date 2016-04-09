var React = require('react')
var CommandActions = require('./command-actions')
var CommandParser = require('./command-parser')

var View = React.createClass({
  displayName: 'View',
  propTypes: {
    commands: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      commands: null
    }
  },
  getInitialState: function() {
    return {
      command_value: ''
    }
  },
  render: function() {
    var self = this
    return (
      <div className='view'>
        {this.props.commands.map(function(command, i) {
          return (
            <div className='command-entry-container' key={i}>
              <div className='original-command'>{command}</div>
              <div className='parsed-command'>{CommandParser.parse(command)}</div>
            </div>
          )
          return
        })}
        <input
          type='text'
          className='command-prompt'
          value={this.state.command_value}
          onChange={function(e) {
            self.setState({command_value: e.target.value})
          }}
          onKeyUp={function(e) {
            if (e.which === 13) self.__createCommand() // if enter
            // if (e.which === 38) self.__usePreviousCommand() // if up arrow
            // if (e.which === 40) self.__useNextCommand() // if down arrow
            // if (e.which === 75 && e.ctrlKey) self.__deleteAllCommands()  // if ctrl + k
          }}
          />
      </div>
    )
  },
  __createCommand: function() {
    CommandActions.create(this.state.command_value)
    this.setState({command_value: ''})
  }
})

module.exports = View
