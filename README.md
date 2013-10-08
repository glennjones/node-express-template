# sgn-mapper-service

The sgn-mapper-service is part of the Brandwatch profile system, it has two main functions:

* Take a list of URLs and convert them into SGNs (Social Graph Normalized URLs).
* Take a list of SGNs and return URLs and API endpoints to retrieve user generated content


## Install

    $ git clone https://gite.brandwatch.com/glennj/sgn-mapper-service.git

or

    $ curl -L https://gite.brandwatch.com/glennj/sgn-mapper-service/tarball/master | tar zx
    // extract the tar and rename the dircetory to sgn-mapper-service
    
    
## Run

1. Install [nvm](https://github.com/creationix/nvm) as per their instructions
2.  Move into project directory `$ cd sgn-mapper-service`
3.  Run `$ npm install`
4.  Make sure you are running the right version of node (Check the package.json for node version): 
    * `$ nvm ls` will list the versions of node on a sever
    * `$ nvm install 0.10.12` will install a version of node
    * `$ nvm use 0.10.12` will switch you to use a choosen version of node
5. Run `$ node bin/sgn-mapper-service`
6. Connect to the server using `http://{hostname}:8000`


## Running in different environment nodes
The project contains a `config.json` file which has the settings for 3 different environments. You can load any of the configuration by prefixing the node.js start command with the `NODE_ENV` prama.

    $ NODE_ENV=dev node bin/sgn-mapper-service
    $ NODE_ENV=test node bin/sgn-mapper-service
    $ NODE_ENV=production node bin/sgn-mapper-service
    
    
## Forever in production
To run the app in a production please use [forever](https://github.com/nodejitsu/forever) which manages and recovers the app if things go wrong. You should install forever on the server using `$ npm install forever -g`. Once installed you start the app using the following command

    $ NODE_ENV=production forever start -a -o logs/out.log -e logs/err.log bin/sgn-mapper-service
    
You can check the app is runing by using `$ forever list` or stop the app by using `$ forever stop bin/sgn-mapper-service`     



## config.json



    {
        "http": {
            "maxSockets": 10000
        },
        "urlShorteners": [
                "bit.ly",
                "goo.gl",
                "is.gd",
                "tiny.cc",
                "youtu.be",
                "fb.me",
                "linkd.in"
        ],
        "dev": {
            "host": "localhost",
            "port": 8000,
            "maxCores": 1,
            "logging": {
                "path": "/logs/",
                "console": ["request", "log"],
                "file": ["request", "log"],
                "websocket": {
                    "logTypes": ["memory", "request"],
                    "port": 8001
                }
            }
        },
        "test": {
            "host": "10.0.7.55",
            "proxyHost": "94.228.37.5",
            "port": 8000,
            "maxCores": 1,
            "logging": {
                "path": "/logs/",
                "console": ["analytics", "request", "log"],
                "file": ["request", "log"],
                "websocket": {
                    "logTypes": ["memory", "request"],
                    "port": 8001
                }
            }
        },
        "production": {
            "host": "localhost",
            "port": 8000,
            "maxCores": 2,
            "logging": {
                "path": "/logs/",
                "console": ["log"],
                "file": ["request", "log"],
                "websocket": {
                    "logTypes": ["memory", "request"],
                    "port": 8001
                }
            }
        }
    }





## Use as a module in another node.js project

#### Get identities from a list of URLs

    var mapper = require("sgn-mapper-service"),
        options = {
            urls: ['http://twitter.com/glennjones']
        }
    
    mapper.parseUrls(options, function(err, data){
        // do something with data
    });

#### Get identities from a list of SGNs

    var mapper = require("sgn-mapper-service"),
        options = {
            sgns: ['sgn://twitter.com/?ident=glennjones']
        }

    mapper.parseSgns(options, function(err, data){
        // do something with data
    });

#### Using a promise
As well as the standard node.js function pattern the module also supports Promises/A+ on all the public function calls.






## Development

#### Updating npm-shrinkwrap.json

The project uses [npm shrinkwrap](http://blog.nodejs.org/2012/02/27/managing-node-js-dependencies-with-shrinkwrap/) to ensure that all machines get the same versions of libraries. You must ensure that the shrinkwrap file is updated if you're adding dependencies to the project.

1. `npm install` to ensure all your packages are up-to-date
2. `npm install <packagename> --save` will update your package.json file (use `--save-dev` instead if it's a development-mode-only package)
3. `rm npm-shrinkwrap.json`
4. `npm shrinkwrap`
5. `node scripts/clean-shrinkwrap.js` to clean up the shrinkwrap file [https://github.com/isaacs/npm/issues/3463](https://github.com/isaacs/npm/issues/3463)


## Debugging
Because the system is setup to use more than one core if your using node-inspector the workers will be on the port numbers above :5858 so try :5859, :5860 i.e. the first work will be on

    http://0.0.0.0:8080/debug?port=5859


## Mocha integration test
The project has a large number of Integration test one for each site supported. To run the test within the project type the following command

    $ mocha --reporter list

## Scripts and Grunt task
There a number of scripts and grunt task within the project. Some are taken from the frontend project

* `$ grunt jshint` will run jshint on the codebase the configuration is in the GruntFile.js file
* `$ grunt mochaTest` will run the tests from within grunt
* `$ node scripts/clean-shrinkwrap.js` to clean up the shrinkwrap file



## Adding a new site to sgn-mapper-service

It is easy to add a new site to the list that sgn-mapper-service maps. Each site has its own mapping file, which contains a simple description in JSON of the site and a group of urltemplates for matching. This is the mapping file for dopplr.com
    
    {
        "name": "Dopplr",
        "domain": "dopplr.com",
        "wwwOptional": true,
        "subdomain": false,
        "ownershipType" : "individual",
        "caseSensitive": false,
        "urlMappings": [{
            "urlTemplate": "http://dopplr.com/traveller/{username}",
            "schema": "hcard",
            "contentType": "profile",
            "mediaType": "html"
        }, {
            "urlTemplate": "http://dopplr.com/traveller/{username}/public",
            "schema": "none",
            "contentType": "none",
            "mediaType": "html"
        }]
    }

#### Properties schema for mapping file:

Property         | Description
:----------------|:-------------------------------------------------------------
**name** | a display name, it is often used in client facing UIs
**domain** | the host name of the site
**wwwOptional** | Whether URLs will resolve to the same content with and without www.
**ownershipType** | `individual` or  `group` weather a profile on a site can be own just by an individual or by a group 
**caseSensitive** | is the `username` element of a profile case sensitive when used in a URL
**idRegExp** | (optional) A regular expression to determine if a piece of text is an id where the id and username are interchangeable.
**altDomainFilter:** | (optional) Is used as a filter to see if it is worth trying the altDomain list. Improves the speed of execution.
**altDomain:** | (optional) A list of alternative domain names. These domains can be exchanged with the main domain and the URL still resolved to the same content. Always use with the  altDomainFilter property..
**urlTemplate:** | A URL template is used to find usernames or ids
**schema:** |  Data schemas such as Rss or Microformats
**contentType:** | The type of content the page or API endpoint contains
**mediaType:** | The media type Html, Rss, Atom or others
**IDorName:** | (optional) Whether name and id are interchangeable against this urlTemplate. Has to be used with the idRegExp property
**blockList:** | (optional) A list of common URLs entered by mistake. Only used on sites where usernames come directly after the domain segment of an URL.

### Understanding the urlTemplate

The urlTemplate is relatively simple and only has three different tokens that you can use `{uersename}`, `{userid}` and `{*}`. The URLs and templates are normalised for matching so you have to create `urlTemples` using the following rules:

1. The `urlTemplate` should be structured in lowercase.
2. If `wwwOptional` is set to true remove any `www.` from the template.
3. Do not finish the URL with a trailing slash.
4. If you use a querystring or hash they will be used as part of the match otherwise they are ignored.
5. The matching system also ignores different protocols so it does not matter if you use `http` or `https`.  

#### {username}

If the URL is matched, any text that is in the space where the `{username}` token is will be returned as the username.

#### {userid}

If the URL is matched, any text that is in the space where the  `{userid}` token is will be returned as the userid.

#### {*}
The "end with wildcard" `{*}` can only be placed at the end of a urlTemplate. It allows matches where the URL ends with an unknown pattern which is not required for matching.


### Compliing mapping files and icons

 First make sure you have the development version of sgn-mapper-service by using the following command 

    npm install --dev 

to download the package. To add a site create a new map file and add it into the maps directory. Follow the simple structure from another map file changing the values. Then create a 16x16 pixel png icon file for your site and place it in the icons directory. The icon can be copied from the favicon of the site, but it has to be in the png format.

To compress the images [install glue](http://glue.readthedocs.org/en/latest/index.html) on your mac navigate to the sgn-mapper-service directory using the command execute 

    $ glue --html --optipng --watch icons sprites.

The maps are concat into one large file everytime the server starts.  




