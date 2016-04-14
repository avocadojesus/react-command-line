var React = require('react')
var View = require('./view')
var CommandStore = require('./command-store')
var CommandActions = require('./command-actions')

var Controller = React.createClass({
  displayName: 'Controller',
  getInitialState: function() {
    return {
      commands: []
    }
  },
  componentDidMount: function() {
    // Listen for changes to the CommandStore
    CommandStore.addChangeListener(this.onChange)
    // create a default command
    CommandActions.create('Welcome')
  },
  onChange: function() {
    this.setState({
      commands: CommandStore.get()
    })
  },
  render: function() {
    return <View commands={this.state.commands} />
  }
})

module.exports = Controller
