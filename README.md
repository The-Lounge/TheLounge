# The Lounge

##Dev Environment

 - [Node v4.3](https://nodejs.org/dist/v4.3.1/node-v4.3.1-x64.msi) (this is the maxiumn version supported by Elastic Beanstalk)
 - Cmder (for windows)
 - recommended: JetBrains WebStorm (its free for students until we commercialize)

##Global npm packages

 - sails@0.12.1
 - grunt
 - grunt-cli
 - bower
 - karma
 - pm2

##Compass

[Compass](http://compass-style.org/install/) is a CSS preprocessor (build in ruby) that already is integrated into our build scripts. It
is used by [Bootstrap](http://getbootstrap.com/) (awesome UI framework by twitter).

##Setup and Running the App

Unless otherwise noted, you should run commands from the root directory of the project.

Every time `package.json` changes, you will need to run `npm i`. This command installs all *local* NPM modules defined for the project.
This also applies to `bower.json`, which handles browser dependencies through [Bower](http://bower.io/). For the Bower components, run `bower i`.

To start the Sails server, you need to run ~~`sails lift`.~~ `npm start`. This command points to a script defined in `package.json` that runs the server.
When the sails server is running, you can view the app at `http://localhost:1337`. (I don't have PM2 working with sails yet, so don't worry about it)
You will see message in your browser console similar to `Now connected to Sails`.

When you're developing, you'll want to run `grunt serve` (in a new terminal tab).
When you load the Angular app in your browser, it should connect with the `live-reload` server (if it can't you'll get an error in your browser).
This will reload your page when you make changes to the app in your IDE and run tools like JS Hint automatically.

This connection will automatically reload your app when files are changed.

Other tasks are run when different files are changed:
 - When JS files are updated, **[JS Hint](http://jshint.com/)** is run.
 JS Hint checks the quality of your code and catches common mistakes.
 These rules will be enforced on all code pushed to production, so is important to fix any errors/warnings given by JS Hint.
 - *(In progress)* When CSS/SCSS files are changed they will be recompiled and loaded into the browser (no refresh needed).


##Project Structure

`(directory/)` = directory ignored in git

 ```
 AYS
├─ (.tmp/) - contains the compiled distribution of our UI app
├─ app/ - holds application code
│  ├─ api/ - Sails app logic
│  ├─ assets/ - assets used by Sails (not much will be here)
│  ├─ (bower_components/) - install directory for bower components
│  ├─ config/ - Sails configuration
│  ├─ ng/ - Angular application code
│  │  ├─ scripts/ - JS that will run in the browser
│  │  ├─ styles/ - CSS/SCSS
│  │  ├─ views/ - angular templates/views
│  │  ├─ images/ - image assets
│  │  └─ index.html - starting point for the Angular app
│  ├─ tasks/ - configuration for Grunt build tasks
│  ├─ views/ Sails view (were not using these)
│  └─ app.js - She sails app launcher
├─ (node_modules/) - install directory for local node modules
├─ test/ - contains tests
├─ .bowerrc - bower configuration
├─ .jshintrc - JS Hint config
├─ bower.json - browser side dependencies
└─ package.json - node app definition and dependencies

 ```

 All Angular/UI code is held in the `app/ng` directory.
 When the project runs this code is copied to the `.tmp` directory, which is where Sails load the UI from.
