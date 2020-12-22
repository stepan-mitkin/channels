(function () {
    var schema = {
        "builder": "Application",
        "input": ["createDom", "start"],
        "capsule": true,
        "data": {
            "current": "loading",
            "screen": "",
            "project": null,
            "readonly": false
        },
        "below": {
            "api": {
                "builder": "Api"
            },
            "auth": {
                "builder": "Auth",
                "above": {
                    "api": "Api"
                }
            },
            "account": {

            },
            "logon": {
                "builder": "Logon",
                "above": {
                    "app": "Application",
                    "api": "Api"
                }
            },
            "register": {

            },
            "loading": {
                "builder": "Loading"
            },
            "panic": {
                "builder": "Panic"

            },
            "saver": {

            }
        }
    }

    var config = {
        apiRoot: "http://localhost:6200/enne"
    }


    var common = common_mod()
    var sm = sm_mod();
    var html = html_mod();
    var pyramid = pyramid_mod(common);
    var enne2 = enne2_mod(common, sm, html, pyramid, config)

    var app = enne2.create(schema)
    var main = html.get("main")
    html.clear(main)
    app.createDom(main)
    app.start(config)
})();
