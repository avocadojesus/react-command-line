// public/view.js
var React = require('react')
var CommandActions = require('./command-actions')
var CommandParser = require('./command-parser')

var View = React.createClass({
  displayName: 'View',
  propTypes: {
    commands: React.PropTypes.array
  },
  getDefaultProps: function() {
    return {
      commands: null
    }
  },
  getInitialState: function() {
    // sets the initial value displayed in the command prompt
    return {
      command_value: ''
    }
  },
  render: function() {
    var self = this
    return (
      <div className='view'>
        {this.props.commands.map(function(command, i) {
          // for each command, print the original command in the prompt
          // for each command, print the parsed command
          return (
            <div className='command-entry-container' key={i}>
              <div className='original-command'>{command}</div>
              <div className='parsed-command'>{CommandParser.parse(command)}</div>
            </div>
          )
        })}
        <input
          type='text'
          className='command-prompt'
          value={this.state.command_value}
          onChange={function(e) {
            // when the input value changes, update our state
            self.setState({command_value: e.target.value})
          }}
          onKeyUp={function(e) {
            // when the enter key is pressed, create a new command
            if (e.which === 13) self.__createCommand()
          }}
          />
      </div>
    )
  },
  __createCommand: function() {
    // adds command to CommandStore
    CommandActions.create(this.state.command_value)
    // clears the text input value
    this.setState({command_value: ''})
  }
})

module.exports = View
