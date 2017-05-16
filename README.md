# The Lounge

## Dev Environment

 - [Node v6.9](https://nodejs.org/dist/v6.9.5/node-v6.9.5-x64.msi) (this is the maximum version supported by Elastic Beanstalk)
 - Cmder (for windows)
 - recommended: JetBrains WebStorm (its free for students until we commercialize)

## Global npm packages

 - sails@0.12.3
 - grunt
 - grunt-cli
 - karma
 - pm2

## Compass

[Compass](http://compass-style.org/install/) is a CSS preprocessor (build in ruby) that already is integrated into our build scripts. It
is used by [Bootstrap](http://getbootstrap.com/) (awesome UI framework by twitter).

## Setup and Running the App

Unless otherwise noted, you should run commands from the root directory of the project.

Every time `package.json` changes, you will need to run `npm i`. This command installs all *local* NPM modules defined for the project. 
Both Node JS (server) and browser dependencies are installed through npm, and included through Browserify.
Server dependencies should be installed with `npm i [name] --save` and browser dependencies with `npm i [name] --save-dev`

Before you run the app for the first time, you will need to setup or local configuration.
To do so, follow the instructions in `config/local_template.js`. 
You will also need to execute a build of the app, by running `npm run build` prior to starting the app.

To start the Sails server, you need to run `npm run devStart`. This command points to a script defined in `package.json` that runs the server.
Executing `npm start` will run the app in production mode. 
When the sails server is running, you can view the app at `http://localhost:1337`. 
You will see message in your browser console similar to `Now connected to Sails`.

To use mock data, the app must be run in **mock** mode. 
Running the app to connect to the test DB will not provide access to mock data, nor visa-versa. 
To run the app in mock mode, run `npm run mockStart`. 

When you're developing, you'll want to run `grunt watch` (in a new terminal tab).
When you load the Angular app in your browser, it should connect with the `live-reload` server (if it can't you'll get an error in your browser).
This will reload your page when you make changes to the app in your IDE and run tools like JS Hint automatically.

This connection will automatically reload your app when files are changed.

Other tasks are run when different files are changed:
 - When JS files are updated, **[JS Hint](http://jshint.com/)** is run.
 JS Hint checks the quality of your code and catches common mistakes.
 These rules will be enforced on all code pushed to production, so is important to fix any errors/warnings given by JS Hint.
 - *(In progress)* When CSS/SCSS files are changed they will be recompiled and loaded into the browser (no refresh needed).


## Project Structure

`(directory/)` = directory ignored in git

 ```
 AYS
├─ .elasticbeanstalk - configuration for Amazon server
├─ (.tmp/) - contains the compiled distribution of our UI app
├─ api/ - Sails app logic
├─ assets/ - assets used by Sails (not much will be here)
├─ config/ - Sails configuration
├─ mocks/ - hardcoded test data
├─ ng/ - Angular application code
│  ├─ js/ - JS that will run in the browser
│  ├─ styles/ - CSS/SCSS
│  ├─ services/ - Custom Angular Services
│  ├─ views/ - angular templates/views
│  ├─ images/ - image assets
│  └─ index.html - starting point for the Angular app
├─ tasks/ - configuration for Grunt build tasks
├─ views/ Sails view (were not using these)
├─ (node_modules/) - install directory for local node modules
├─ scripts - utility/build scripts
├─ test/ - contains tests
│  ├─ api-spec - Unit tests for the API
│  └─ ui-spec - UI unit test
├─ .jshintrc - JS Hint config
├─ .sailsrc - Sails.js config
├─ app.js - The sails app launcher
├─ circle.yml - configuration for Cirlce CI builds
├─ Gruntfile.js - Sails generated task config
└─ package.json - node and browser app definition and dependencies

 ```

 All Angular/UI code is held in the `app/ng` directory.
 When the project runs this code is copied to the `.tmp` directory, which is where Sails load the UI from.


## Targeted Platforms

The responsive web app will officially target the following browsers/platforms:

#### Windows
 - Chrome*
 - Firefox*
 - Edge
 - IE 11
 
### MacOS/iOS
 - Safari 8+
 - Chrome*
 - Firefox*
 
### Android
 - Chrome*
 
 (*) indicates support for latest version and previous 2 versions
