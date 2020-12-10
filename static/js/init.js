(function() {
    var schema = {
        "handler": "Application",
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

    var createDom = function(node, parentElement) {
        return node.createDom(parentElement)
    }

    var run = function(node) {
        node.run()
    }

    var common = common_mod()
    var sm = sm_mod();
    var html = html_mod();
    var pyramid = pyramid_mod();
    var enne2 = enne2_mod(common, sm, html)
    var app = pyramid.build(schema, enne2)
    pyramid.traverse(app, run)
    var main = html.get("main")
    main.innerHTML = ""

    pyramid.traverse(app, createDom, main)
    //app.run()
})();
