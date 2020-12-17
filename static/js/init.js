(function() {
    var schema = {
        "builder": "Application",
        "input": ["createDom"],
        "capsule": true,
        "data": {
            "current": null,
            "screen": "",
            "project": null,
            "readonly": false
        },
        "low": {
            "account": {
    
            },
            "logon": {
    
            },
            "register": {
    
            },
            "loading": {
    
            },
            "panic": {
    
            },
            "saver": {
    
            }
        }
    }


    var common = common_mod()
    var sm = sm_mod();
    var html = html_mod();
    var pyramid = pyramid_mod(common);
    var enne2 = enne2_mod(common, sm, html, pyramid)

    var app = enne2.create(schema)
    var main = html.get("main")
    html.clear(main)
    app.createDom(main)
})();
