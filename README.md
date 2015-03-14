#baucis-gform


Use baucis-gform and [gform-admin] to quickly create a data administration ui for your [mongoose] managed data.

##Examples

see [here](https://github.com/stemey/baucis-example).

##Installation

Configure Gform:

    // configure gform schema generator
    var Gform = require('baucis-gform');
    var TabGroupCreator = require('mongoose-schema/groupcreator/TabGroupCreator');
    var creator = new TabGroupCreator();
    var gform = new Gform({basePath:"/api", groupCreator: creator});


Create your models and add baucis rest routes

	// Create a mongoose schema.
	var Vegetable = new mongoose.Schema({ name: String });
	// Register new models with mongoose.
	mongoose.model('vegetable', Vegetable);
	// Create a simple controller.  By default these HTTP methods
	// are activated: HEAD, GET, POST, PUT, DELETE
	baucis.rest('vegetable');
	// Create the app and listen for API requests
	var app = express();
	app.use('/api', baucis());
	
Now add the gform routes and start express
	
	gform.start(app);
	app.listen(80);


The following urls are available now:
 
 * model data via baucis: `/localhost:80/api/vegetable`

 * general meta data: `/localhost:80/api/gform`

 * vegetable gform schema: `/localhost:80/api/gform/vegetable`


##Customization

gform provides a lot of ways to customize the ui. You can do this in the client or on the server.
Have a look at all the features [here] (http://www.toobop.net).

### attribute level meta data

Add meta data to a gform property on the schema's path options.


    var blogpost = Schema({
        text: String,
        title: { type: String, label:"my wonderful text"},
    }})

    // add additional gform information to the text property.
    blogpost.paths.text.options.gform = {
        groupCode: "text",
        label: "The blog entry",
        description: "this should be really interesting stuff.",
        editor: "textarea"
    };

The following properties are supported(see [details](http://www.toobop.net/gform/app/schema)):

* label : The label of the attribute
* description : a long text describing the attribute's purpose
* visible : false if the attribute should be invisible
* disabled : true if the attribute shall not be edited
* editor : defines the widget to be displayed in the form
* groupCode : assigns this attribute to a group defined on the schema level



### schema level meta data


#### groups
Define groups on the schema level. Add a property gform to the schema object's options.
the property contains a property group which defines the group and possible subgroups. Here is an example for a tab:


    var group = {
        editor: "tab",
        groups: [
            {code: "general", label: "General"},
            {code: "text", label: "Text"}
        ]
    }

    var blogpost = Schema({
        text: String, // will be assigned to general group
        title: { type: String, groupCode:"text"}, // assigned to text group
    }, {gform: {group: group}})


#### references

To find a referenced model the gform client uses an autocomplete input element.
The search is based on a single field which by default is either `name` or `label` if they exist.
To set a different field use the configuration property `labelAttribute` on the schema level


    var user = Schema({
        firstname: String, // the field to search when looking for referenced Users
        age: Integer
    }, {gform: {labelAttribute: "firstname"}})



[gform-admin]: https://github.com/stemey/gform-admin
[baucis]: http://github.com/wprl/baucis
[gform]: http://toobop.net
[mongoose]: http://github.com/Learnboost/mongoose



