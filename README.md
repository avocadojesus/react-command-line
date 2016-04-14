# WTFlux???

Many first encounters with the [FLUX design pattern](https://facebook.github.io/flux/docs/overview.html) result in temporary blindness of the mind, followed by a set of mental gymnastics which inevitably lead to the same followup question: "uhhh...what?". well I am here to tell you to fear not! by the end of this tutorial, you should be able to:

* install a basic `node server`
* clone this repository onto your local machine
* get up and running with a basic FLUX application
* understand the fundamental FLUX design concepts
* love reactjs <3333

## Quickstart
While explaining all of the different components of this application can be difficult, getting up and running with this application is relatively painless. in order to follow this tutorial, we assume that you have [nodejs](need_link) and [npm](need_link) installed on your computer, and that you are capable of accessing the [command line from your machine.](need_link)

```bash
# change into the folder where you want your project
$ cd /your/sandbox/dir
# clone this repository onto your computer
$ git clone https://github.com/avocadojesus/react-command-line.git
# change into the newly-cloned repo folder
cd ./react-command-line
# only if you don't already have it
$ npm install -g gulp
# precompile your assets
$ gulp build
# start your node server
$ node index
```

That's it! now you can navigate to `http://localhost:4000` to view your installed application!

## Prerequisites
In order to properly launch this demo, you will need to have the following packages installed:
* [nodejs](need_link)
* [npm](need_link)
* [gulp](need_link)
* [git](need_link)

In addition, you should have some familiarity with using a command line on your computer's operating system.

* [understanding the command line on windows](need_link)
* [understanding the command line on mac](need_link)
* [understanding the command line on linux](need_link)

## Ok, so what are we building?
In this tutorial, we are building a basic command prompt emulator. I have chosen this exercise because it allows us to very simply illustrate the power of using React and FLUX. Our completed application will do the following:
* render a text input for command entry
* when submitting the command, Our application should parse the submitted input and print the result of that command. You can see a fully-implemented demo at (hackaholics.io)[http://hackaholics.io]

## What is React?
React is a javascript library which allows you to essentially invent your own HTML tags. This is, of course, a very simplified view of React, and does not do nearly enough justice in actually articulating what it does, but it helps some people to visualize it that way from the beginning. The power of creating your own HTML tags is in the ability to customize both the appearance and behavior of these components in a very modular fashion. In fact, React ships with several default components which allow it to replicate the entire HTML spec, so you are free to write into your code whatever you like.

``` javascript
// jquery:
$('body').append('<div class="my-component">hello world</div>')
$('.my-component').click(function(){
  alert('hello!')
})

// react:
<div
  className='my-component'
  onClick={function(){
    alert('hello!')
  }}>
  Hello World
</div>
```

Composing this way is possible through a syntax called [jsx](need_link). In a web browser, this code would render as invalid javascript, but our precompiler will take care of translating the `jsx` into valid javascript for us.

In addition to allowing fluid and modular composition of component architecture, react also gives us the added bonus of providing a sophisticated DOM change detection system which only repaints sections of the DOM that are necessary, as DOM manipulation is very taxing on browser resources, especially when it is frequently re-drawn.

React also ships with 2 way data binding, and trickles any changes in data to all child components that are dependent on the data. Because of the way these changes affect all regarded components, react behaves most efficiently in a system dominated by top-down architecture, much like a pyramid. At the tip of the pyramid, you would have a data store. Any changes to data happen at the top of the pyramid, and then those changes are distributed down the pyramid, which is composed entirely of components, many of which are dependent on that data to operate effectively. Enter `Flux`

## What is Flux?
Flux is a complimentary architecture which is designed to let React do what it does best: perform change detection against an application's data, distribute that data where it needs to go, and manipulate the DOM if necessary. If that sounds like a load of nonsense, let me try to explain it more clearly: Because of react's ability to trickle data down to it's child components, the flux architecture is meant to allow the data to sit at the top of the component chain, rather than being controlled and distributed by components nested within a component chain.

## When should I use flux?
While react is an excellent tool for any project, implementing Flux is not always a good idea. Flux is really attempting to solve a specific problem, and that problem doesn't occur in every project you may work on. The architectural model is significantly more complex than is necessary for delegating the typical interactions of a static HTML page, or in a website where there is no need for a data persistence layer. While it is always a line in the sand, I will attempt to illustrate the problem that Flux solves, so as to clarify the exact scenario in your own architectural considerations when you should decide that Flux is right for you.

### The problem:
```javascript
<View>
  <UserComponent user={user}>
    <UserPhoto url={user.photo_url}/>
  </UserComponent>
  <Messages>
    <Message>
      <UserPhoto url={user.photo_url}/>
    </Message>
  </Messages>
  <UpdateUserDialog user={user}/>
</View>
```

In this overly-simplified diagram, i illustrate a typical application scenario which would benefit from a Flux architecture. Here, we have three components which are dependent on the same data. One of these components is a dialog which allows the user to update their photo, and when that happens we run into a classic design problem which dramatically convolutes the design process for many front-end applications. Below is an example of how this problem would be solved with and without flux.

### Without Flux
```javascript
$('#update-user-dialog .submit-button').click(function() {
  var photo = $('#user-photo-selector').files[0]
  $.put('/users', {photo: photo}, function(url) {
    $('#user-component .user-photo img').src(url)
    $('.message[user-id="' + window.user.id + '"]').src(url)
  })
})
```

The problem is displayed clearly here if you can read between the lines. First of all, in leu of a persistence layer we are simply engaging our `window` directly and storing our data there. In addition, we have to update every component in the application every time we update the user object. If maintain this pattern, this component is prone to bugginess, and decreases in usefulness as it becomes more and more dependent on the state of the rest of the application.

To illustrate this point, imagine there is a second view where you include the `UpdateUserDialog`, but in this view you don't have either of the above components which this update dialog is now dependent on to operate correctly. Without those DOM elements, your component will trigger a series of DOM errors which are cumbersome to chase and expensive to maintain.

### With Flux
```javascript
...
render: function() {
  return (
    <div>
      <input type='file' ref='file_input' />
      <input
        type='submit'
        onClick={function() {
          UserActions.updatePhoto(self.refs.file_input.files[0])
        }}
    </div>
  )
}
```

Here, you can see that instead of this component being aware of all of the other components it needs to update, it simply calls an action to update the photo. Below is a simplified illustration of the treatment of data distribution on flux:

```javascript
// my-app/controller.js
...
componentDidMount: function() {
  var self = this
  UserStore.addChangeListener(function() {
    self.setState({user: UserStore.get()})
  })
},
render: function() {
  <View user={this.state.user}>
    <UserDisplay user={this.state.user}/>
    <UserUpdateDialog user={this.state.user}/>
  </View>
}
...

// my-app/user-update-dialog.js
...
render: function() {
  return (
    <div>
      <input type='file' ref='file_input' />
      <input
        type='submit'
        onClick={function() {
          UserActions.updatePhoto(self.refs.file_input.files[0])
        }}
    </div>
  )
}
...
```

In this example, the parent component is subscribing to changes in the `UserStore` and distributing those changes to the components. then, in the `UserUpdateDialog`, we are using an action to distribute the change to the store.

Now, to circle back to the original subject; **when would you use flux?** really, any time you need to do more than just distribute data. Examples where flux would not necessarily be useful:

#### Don't need flux
* a static home page with a signup form
* a page that contains distributed data, but does not update it (i.e. a page that lists all your soundcloud albums)

#### Could use flux
* a page that allows a user to post messages to a chat room
* a dashboard, where a user can log in and update their information
* an application with a complex set of data which can be updated through user interactions

## How does it work?
Flux is really just a sophisticated pub-sub model stacked around a data persistence layer, not unlike the way a REST api is just a controlled layer governing the access, manipulation, and distribution of data within a database. In non-geek terms, it means that Flux provides you with a way of storing your data, and a basic event emission system used to manipulate that data.

In this model, a data persistence layer is known in flux terms as a `store`, and an event-emitter is known as an `action`. Actions communicate with stores, informing them of any changes made to their data.

### Stores
A store is exactly what the name suggests: a place to store things. what things? data, usually of a consistent type. For example, if your application stored users and messages, you would probably want to have a `UserStore` and a `MessageStore`, each of which you would associate with the respective data. These stores are responsible for the following:
* holding data
* updating that data when instructed to
* notifying concerned parties when data is updated

### Actions
An action is a service which informs stores of changes made to their data, much like in the example above using the `<UserUpdateDialog />` component. You can think of an action as a message. It contains useful information, but is only responsible for informing the store. It does not actually go into the store and update the data, it only tells the store that that data was updated.

### Dispatcher
The dispatcher is the staple of the Flux model, although it is really an abstraction, rather than a core concept. It is the trigger point between an action and a store. In a simplied model, it can be viewed like this:

```javascript
Dispatcher  <---------
----------           |
Store                |
----------           |
component --[ACTION]--
```

`Stores` are subscribed to `events` which are emitted by the `dispatcher`, which is informed by `actions`, which are called by `components`/`views`, who receive their data from `stores`, completing the Flux data distribution cycle.

### Why is it so complicated?
Perhaps this is the wrong question, but who knows... There are an infinite number of simpler solutions for updating your DOM state when necessary, but most of them will come with complications at scale. In a static HTML page, this is not so important, but at the scale of twitter or facebook, it becomes increasingly important that, for example, the chat component is not directly communicating with the state of the friend finder component, as it can create a **whack-a-mole** situation, in which breaks in one part of your application crash other parts of your application.

In short, it is actually the simplest solution to resolving the most common communication problems delegated by a front-end web application. The system flux provides is the same type of system that the internals of the DOM operate on; the `pub-sub` system. In other words, flux is the simplest model for building a uniform event distribution model for your application.

## How is Flux different from Angularjs?

Ultimately, both frameworks share a lot of similarities. Angular has many built-in classes which are essentially responsible for communicating and delegating information back to their view layer. Flux and Angular fundamentally only disagree on implementation. In Angular, all of these fixtures are built into the framework, making a simple angular hello world relatively complicated. In React, most of these complications evaporate in favor of a simple component model that can perform at all layers of the application. This can be illustrated below:

### Angularjs
* router
* controllers
* directives
* modules
* filters

### React
* components

You can see that React ships by default with much less overhead. Because of it's design, React allows you to take a very simple (but well-designed) structure and exploit it to the most complex application states. Of course, if you want to build a single page application, you will need to import your own router (many use [react-router](need_link)), and if you wish to delegate actions through an event-based system, you will want to implement `flux`. Once this is done, your application will resemble an angular app in complexity.

Where react shines is in understanding that you can exploit their 2 way binding and lifecycle events without all of the extra application overhead.

## Understanding the project

* react-command-line
  * `node_modules`: a folder what contains installed dependencies using npm
  * `public`: the folder containing all of our react code
  * `public/dist`: a folder containing all of our precompiled data (used by gulp)
  * `public/app.js`: the launch file for our react app
  * `public/command-actions.js`: the action file for our Command object
  * `public/command-parser.js`: a service which interprets commands based on user input
  * `public/command-store.js`: a data store for our Command objects
  * `public/controller.js`: our top-level react component
  * `public/dispatcher.js`: dispatches react events to listeners
  * `public/view.js`: component nested directly underneath the controller
  * `gulpfile.js`: a task runner that converts our react code into readable javascript
  * `index.html`: the launch file for our front-end application
  * `index.js`: the launch file for our node server
  * `package.json`: a file for managing all our npm dependencies
  * `README.md`: the file explaining all of this

# Node Server
To start the app, you of course must already have [nodejs](need_link) installed on your computer. `Nodejs` is essentially a javascript engine detached from the browser and reimplemented as a cross-platform server-side web framework. All this really means for us is that you can serve up an html file, because that's all that we are using it for in this case. If you prefer, you can use `MAMP/apache/nginx/php/python/basically anything` to write a web server that can render a static html file.

### how is it used in this project?
```javascript
// index.js
// initialize express app (wrapper around node HTTP service)
var express = require('express');
var app = express();

// set our public folder (for resource requests)
app.use(express.static('public'));

// catch the default route and return our index.html file
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

// listen on port 4000
app.listen(4000)
console.log('app listening on 4000')
```

1. load express (handles basic routing, sort of like the `VC` in `MVC`)
2. sets our `static` directory to the `public` folder (this means that a request to `http://localhost:4000/dist/src/build.js` will be processed, as the public folder is treated as root for static file requests)
2. catch the root route (i.e. `http://localhost:4000/`)
3. respond to it by sending an html file

### HTML
```html
<!-- index.html -->
<!-- load our compiled javascript file -->
<script src='/dist/src/build.js'></script>
<!-- set an HTML element to render our app in -->
<div id='app-target'></div>
```

As you can see, our index.html file is nearly empty. In react, as in most precompiled applications, there is typically a launch file for your app. As such, our `index.html` file simply needs to point to the source of the compiled code. The html file also renders a div with the id of `app-target`. This is not significant yet, but it will be later

#### Note: do not format your html this way!!
While i have chosen to reduce the amount of code in this application wherever i can, writing malformatted HTML like this will often trigger your browser into `quirks mode`, which interprets javascript much differently than it would in `standards mode`.

### Precompiling
In order to efficiently develop any application that requires precompiling before it can be interpreted, your precompiler needs to be able to the following things:
* capture all of the files required by your app
* compile them into proper format
* render the compiled code somewhere

However, if you don't want to rip your hair out with all of the complications this introduces each time you make a change in your code, you will probably also want it to:
* listen for any code updates
* re-compile your code

This can be arduous, but fortunately I have taken care of that step for you. This precompiling method can be used with all of the marked dependencies in the package.json file

```javascript
// gulpfile.js
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var lessify = require('lessify');
var bulkify = require('bulkify');

var path = {
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'public/dist',
  DEST_BUILD: 'public/dist/build',
  DEST_SRC: 'public/dist/src',
  ENTRY_POINT: './public/app.js'
};

/*
** watch
** -----
** this function allows your app to watch for changes made to a specific set of files.
** essentially, we pass it our app.js file, and it discovers all app dependencies, monitoring
** them for any changes and recompiling our distributed js file whenever changes are made.
**
** to run: `gulp watch` or just `gulp`
*/
gulp.task('watch', function() {
  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify, lessify, bulkify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher
    .on('update', function () {
      watcher
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC))
        console.log('Updated');
    })
    .on('transform', function (tr, file) {
      console.log('^.^: ', file);
    })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

/*
** build
** -----
** This function is similar to watch, except in that it compiles your assets and then shuts down.
** it is meant for production.
**
** to run: `gulp build`
*/
gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify, lessify, bulkify],
  })
  .bundle()
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_SRC));
});

// sets the default gulp task to `watch`. this means that when you run `gulp` from
// the project directory, the `watch` command will be run.
gulp.task('default', ['watch']);
```
As you can see, the code essentially ships with two tasks here.
`gulp build` will simply compile the html and place it in our desired location (`public/dist/src/build.js`).
`gulp watch` will perform the same operation as build, but will then continue running, listening for any changes to any of the files in its' file tree, and will recompile them when it deems necessary
`gulp` will essentially run `gulp watch`, but it's easier to type, so yay!

## Flux App
Everything to do with our flux app can be found in the `public` directory. Here is a description of each of the files, in load order:

### public/app.js
This is essentially our app load file. If you were building an app that actually parsed several different routes (meaning, there is navigation to different pages), you would probably use the [react-router](need_link) npm package to handle those route changes. I have decided to keep it simple for this demonstration, however, as navigation is non-essential to the concepts illustrated by flux.

Instead, our app file is just simply going to render our component into the html element we set up in our html file (remember `<div id='app-target'></div>`?).

```js
// public/app.js
var React = require('react')
var ReactDOM = require('react-dom')
var Controller = require('./controller')

window.onload = function() {
  ReactDOM.render(<Controller/>, document.querySelector('#app-target'))
}
```

both react and react-dom are packages necessary to load your react app initially, so they are both imported above. just below, we render the `controller` component, which we will essentially think of as the very tip of our component tree.

### public/controller.js
Controllers are not a fundamental concept in react, as react is solely focused at the component level (which in an `MVC` pattern would best be represented by the `V`), and it is also not a required concept in flux design, as flux only cares about how components delegate changes in data back to data stores.

So then why do we have a controller? I introduced it here for two reasons:
* it is familiar to people who know angularjs
* in large-scale applications, it is extremely benefitial to separate your view layer from your data-association layer (otherwise, your view can get very convoluted and handle too many tasks)

Our controller is responsible for the following:
* rendering a view
* listening for changes to the `CommandStore` (or any other stores)
* distributing those changes to the view

```js
// public/controller.js
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
```

As you can see above, this component subscibes to changes on the `CommandStore` in the `componentDidMount` [lifecycle event](need_link). it points the `CommandStore` to fire the `onChange` method any time the state of the store is changed (i.e. data is created, updated, or deleted).

Any time the state is updated on a react component, the `render` method will be called. This means that our `View` component will receive new data every time it is updated.

### public/view.js
If our **controller** is responsible for *collecting and responding to our CommandStore data*, our **view** should be responsible for *displaying things based on the data it receives*. As our application is supposed to be a command line simulator, our view should be responsible for the following:
* displaying the unparsed commands (i.e. when you type `ls`, it prints the word `ls`)
* executing the parsed commands (i.e. the `ls` command collects all data in your file system)
* printing the results of those compiled commands (i.e. `ls` prints all of the files in your application)
* generating a prompt (i.e. the place where you type into)
* when that prompt receives the `enter` key, we need to create a new command from the prompt input.

#### Render
Most of this can be discovered by taking a look at the render method of the component
```js
...
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
...
```

first, you can see that we are iterating over each of the commands in our `props` object. In react, the props object is where you access any data you have passed to it from a parent component. This means that `this.props.commands` and `controller.state.commands` are the same object.

#### Printing Commands
```javascript
...
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
...
```
Here, we print both the original command, as well as the parsed command (we will cover the `CommandParser` object a bit later). The iterator is powerful, as it allows us to repeat these HTML elements for each command distributed by our controller.

#### Note: while this model is effective for demoing, parsing this command should actually not happen at the view layer, as this can cause the command to be executed several times repeatedly. This would be devastating to the design of a true command prompt, but, as all we are doing is printing things, it will go unnoticed in this model.

#### Command Prompt
Finally, we generate our `prompt`, which is essentially just a text input with an event listener.
```js
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
```

First, let me start by discussing the `onChange` event, as this pattern is both confusing and essential to properly implementing react components. Because of the way that data travels, any child component is not able to update properties that have been passed to them. This is a strict no no in any 2-way data binding implementation (angular included). Instead, we need a way of informing the parent component of the change, and then the parent component adjusting its' value and redistributing it.

Another way of understanding this is that the `View` component owns the value `this.state.command_value`. The child component `input`'s value is bound to the `View`'s state, which it does not control. To get around this, we listen for any attempted value changes against the text input (i.e. `onChange`), and we tell our `View` to update its' state, which it then redistributes back to the `input` component.

It seems cumbersome, but it keeps your code modular. This means that the child component is in no way dependent on the parent component, which is ideal for any application. It simplifies unit testing, architectural modeling, and allows you to understand each component on a fundamental level.

##### Event Codes
Ok, now that we got that out of the way, lets talk about the `onKeyup` event, which is where the things we care about are happening. In javascript, each keyup event in an input fires the event back to any callback methods that are listening. When it does so, it takes the key that was pressed and translates it into a [keycode](need_link). While i could talk for hours about keycodes (no i cant i am def bluffing on that), all we really care about is this:
* if `e.which === 13`, then the enter key was pressed.
We take advantage of this consistent truth about the DOM by registering it and firing our `__createCommand` method.

##### Private Methods
For those of you unfamiliar with the pattern, methods prefixed with underscores are often indications that they are not meant to be used by outside components (otherwise known as private methods). This method is not truly private, but it is still named with the intent of indicating to any other developers that they should not call it from outside the component.

#### Creating Commands
To see how commands are created, we can navigate to the `__createCommand` in our react component.

```js
...
__createCommand: function() {
  // adds command to CommandStore
  CommandActions.create(this.state.command_value)
  // clears the text input value
  this.setState({command_value: ''})
}
```

So simple! we use our `CommandActions` to send the new command to our store, and then we clear the command prompt by setting the `command_value` to a blank string.

### public/command-actions.js
Actions are interesting, in that they do not involve react. this is because, as i said before, react is only concerned with rendering views. It does not concern itself with anything outside of the scope of components, and as this is essentially an event subscription model that supersedes the component framework provided by react, it will not require react to perform. This can be confusing to some, but it is imperative to understand, as it clearly defines the boundaries between react and flux.
* flux
  * dispatcher
  * stores
  * actions
* react
  * components

Our actions file should simply expose a series of methods (often times these are basic [CRUD](need_link) operations, such as `create`). These methods can do anything they want, but ultimately serve the purpose of communicating with a dispatcher (which is subscribed to by stores).

```js
// public/command-actions.js
var AppDispatcher = require('./dispatcher')

exports.create = function(command) {
  AppDispatcher.handleAction({
    actionType: "CREATE_COMMAND",
    data: command
  });
}
```

In this example, you can see that we simply ingest the command (i.e. what was submitted by the prompt) and bubble it up to our dispatcher. If this was a more sophisticated application, perhaps we could emit an [AJAX](need_link) request first, but no need to here.

### public/dispatcher.js
The dispatcher is a critical piece of the flux puzzle, but is itself a static piece of code. It is simply a place to pair all of the `stores` listening for actions with all of the actions that are emitting them.

```js
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
```

While we could have very easily implemented this dispatcher ourselves, it is easier to grab the [flux] package from npm. This is a basic event emission system which collects event listeners, and then runs them each time a new event is established.

In our case, this means this dispatcher will be receiving the `handleAction` method from our `CommandActions.create` method, and will be distributing it to...well...really, anything, but in our case, the `CommandStore`

### public/command-store.js
The store component can be thought of as the `database` for the front end. You could even build it out to accept a sophisticated query language (if you are interested in implementing this, i recommend looking into [backbonejs](need_link), although it is an unnecessary complication to the core flux design pattern). In our case, we only ever want to gather all of the commands in the command store, so we will only provide the method for gathering them.

```js
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
```

Again, take not that react is not required. Also take note of the fact that we are requiring the `AppDispatcher`, not unlike our `CommandActions`.

This file is responsible for the following:
* listening for events from the `AppDispatcher`
* persisting any data that is sent to it
* exposing methods for gathering that data
* allow external components to register change listeners (i.e. the controller needs to know when any changes are made to this store)

```js
AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case "CREATE_COMMAND":
      _store.push(action.data);
      commandStore.emit('change');
      break;
  }
});
```

Here we are *listening* for all actions emitted by the dispatcher, but are only *responding* to events that match the id `CREATE_COMMAND`. As designed, this pairs well with our `CommandActions` object, which emits the `CREATE_COMMAND` id to the dispatcher.

So if the id matches, we inject that item into our `_store` variable, which is initially just a blank array. Simple, right! then, we emit a change event (exposed by the `events.EventEmitter` object, although we could have implemented this from scratch fairly easily if we wanted to).

```js
var commandStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on('change', cb);
  },
  get: function(){
    return _store;
  },
});

module.exports = commandStore;
```

Next, we create an object to expose to the world. Note that this object does not expose the actual data store, but does expose a method for retreiving it. This is not by accident. The flux pattern is meant to encourage you to retreive data through the store, but to manipulate data through actions.

This can be confusing for some, but this is also why flux is not ideal for small-scale applications. The design is meant to handle applications at an enterprise level, and proportionately becomes more appropriate as your application increases in complexity.

So to create data, we are essentially responding to actions, and to retreive it, we expose the `get` method, which our `controller` can then use to collect the contents of the store.

## The Big Picture
This comes full circle by revisiting the `componentDidMount` method of our `Controller`
```js
...
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
```

By listening to any updates to our store, we can successfully bind the state of our top level component to updates in our store. Here is an illustration of the complete cycle in order of events:

* `Controller`: listens for updates to the `CommandStore`
* `Controller`: renders view
* `View`: renders a command prompt
* `View`: responds to enter key and creates a `CommandAction`
* `CommandAction`: bubbles the event to the dispatcher with the `CREATE_COMMAND` id attached
* `AppDispatcher`: captures the event, and distributes to anyone who is listening
* `CommandStore`: listens for broadcasted events from the `AppDispatcher` with the `CREATE_COMMAND` id, populates the data into the `_store` array, and then alerts anyone who is listening
* `Controller`: responds to change event emitted by the `CommandStore`, rebuilds its' command state, and then re-renders the `View`
* `View`: lists the newly created command, displaying both the parsed and unparsed versions of the command.

## CommandParser
Although this component has NOTHING to do with flux, it is imperative to the operation of this application, and as such should be discussed.

```js
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
```

This file exposes a `parse` method, which will look at the command (essentially just a string), and see if it matches any of the listed commands. If it does not recognize the command, it displays an error message.

That's all! I hope this has been a helpful introduction to the flux architecture. Enjoy playing with the command prompt! Some things it could really use:

* styling!!! (see http://hackaholics.io for inspiration)
* clear prompt command?
* implement [shelljs](need_link) to add sophistication to the prompt
* run CommandParser at the `action layer` instead of the `view layer` (so as not to continuously rerun each command)
* cycle through previous commands when `up arrow` is pressed
