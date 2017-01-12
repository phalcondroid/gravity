
///<reference path="./Environment/Environment"/>

namespace Gravity
{
    export class Application
    {

        private config      : Object = null;
        private env         : number = Environment.Scope.LOCAL;

        public constructor()
        {

        }

        public setScope(env : number)
        {
            this.env = env;
        }

        /**
         *
         */
        public setConfig(config : Object)
        {
            this.config = config;
        }

        /**
         *
         */
        private resolveConfig(di)
        {

            if (typeof this.config[this.env] != "undefined") {
                for (let key in this.config) {
                    switch (key) {
                        case "url":
                                this.resolveBaseUrl(
                                    di,
                                    this.config[key]
                                );
                            break;
                        case "controllers":
                                this.resolveControllers(
                                    di,
                                    this.config[key]
                                )
                            break;
                        case "services":
                                this.resolveServices(
                                    di,
                                    this.config[key]
                                );
                            break;
                    }
                }
            }
        }

        private resolveBaseUrl(di, urls)
        {
            var url = new Url.Url();

            if (Array.isArray(urls)) {
                for (let key in urls) {
                    if (typeof urls[key] == "string") {
                        url.set(
                            key,
                            this.config[key]
                        );
                    } else {
                        throw "Url must be string : " + urls[key];
                    }
                }
            } else if(typeof url == "object") {
                let urlKey = Object.keys(urls)[0];
                url.set(urlKey, urls[urlKey]);
            } else {
                throw "Url data unrecognized"
            }
            di.set("url", url);
        }

        /**
         *
         */
        private resolveControllers(di, controllers : any[])
        {
            if (controllers.length == 0) {
                throw "You must load your controllers";
            }

            if (Array.isArray(controllers)) {
                let i = 1;
                for (let key in controllers) {
                    if (typeof controllers[key].name != "undefined") {
                        var temp = new controllers[key].name;
                        if (temp instanceof Logic.Controller) {
                            temp.setDi(di);
                            temp.onConstruct();
                            temp.initialize();
                            if (typeof controllers[key].views != "undefined") {
                                this.resolveViews(
                                    temp,
                                    controllers[key].views
                                );
                            }
                        } else {
                            throw "Controller #" + i + " must be extend from Logic.Controller class";
                        }
                        i++;
                    } else {
                        throw "Config => Controller => 'name' must be initialized with Logic.Controller class"
                    }
                }
            } else {
                throw "Config => controllers must be array"
            }
        }

        private resolveViews(controller : Logic.Controller , views : any[])
        {
            if (typeof views != "undefined") {
                if (Array.isArray(views)) {
                    for (let key in views) {
                        let tempView = new views[key](
                            controller.getViewModel()
                        );
                        if (!(tempView instanceof View.Component)) {
                            throw "View component must be an instance of View.Component"
                        }
                    }
                } else {
                    throw "Config => Controllers => views must be array"
                }
            }
        }

        private resolveServices(di, service)
        {
            new service(di);
        }

        /**
         *
         */
        public start()
        {
            var di = new Service.FactoryDefault;
            this.resolveConfig(di);
        }
    }
}
