#baucis-gform


Use baucis-gform and [gform-rest-client] to quickly create a data administration ui for your [mongoose] managed data.

##Examples

see [here](https://github.com/stemey/baucis-example).

##Installation

1. add it to your `package.json`.
2. call `npm install`
3. call `require('baucis-gform');` before creating your [baucis] controller via `baucis.rest('user');`


##Customization

gform provides a lot of ways to customize the ui. You can do this in the client or on the server.
Have a look at all the features [here] (www.toobop.net).

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

The following properties are supported(see [details](www.toobop.net/schema)):

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



[gform-rest-client]: https://github.com/stemey/gform-admin
[baucis]: http://github.com/wprl/baucis
[gform]: http://toobop.net
[mongoose]: http://github.com/Learnboost/mongoose



