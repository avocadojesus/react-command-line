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
    CommandStore.addChangeListener(this.onChange)
    CommandActions.create('Welcome')
  },
  onChange: function() {
    this.setState({
      commands: CommandStore.get()
    })
  },
  render: function() {
    return (
      <div className='controller'>
        <View commands={this.state.commands} />
      </div>
    )
  }
})

module.exports = Controller
