
///<reference path="./Environment/Scope"/>
///<reference path="./Environment/Config"/>

namespace Gravity
{
    export class Application
    {
        /**
         *
         */
        private config : Object = null;

        /**
         *
         */
        private env    : number = Environment.Scope.LOCAL;

        /**
         *
         */
        public constructor()
        {

        }

        /**
         *
         */
        public setScope(env : number)
        {
            this.env = env;
        }

        /**
         *
         */
        public setConfig(config : Environment.Config)
        {
            this.config = config.getConfig(this.env);
        }

        /**
         *
         */
        private resolveConfig(di)
        {
            var positionArray = new Array();

            var configData = this.config;

            for (let key in configData) {
                switch (key) {
                    case "urls":
                            this.resolveUrl(
                                di,
                                configData[key]
                            );
                        break;
                    case "services":
                            this.resolveServices(
                                di,
                                configData[key]
                            );
                        break;
                }
            }

            //controllers executed in the final section
            if (configData.hasOwnProperty("controllers")) {
                this.resolveControllers(
                    di,
                    configData["controllers"]
                );
            } else {
                throw "Config must have controllers item attached"
            }
        }

        /**
         *
         */
        private resolveUrl(di, urls)
        {
            var url = new Url.Url();

            if (Array.isArray(urls)) {
                for (let key in urls) {
                    if (typeof urls[key] == "string") {
                        url.set(
                            key,
                            urls[key]
                        );
                    } else {
                        throw "Url must be string : " + urls[key];
                    }
                }
            } else if(typeof url == "object") {
                let urlKey = Object.keys(urls)[0];
                url.set(
                    urlKey,
                    urls[urlKey]
                );
            } else {
                throw "Url data unrecognized"
            }
            di.set(
                "url",
                url
            );
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

                        if (temp instanceof View.Controller) {

                            temp.setDi(di);
                            temp.initialize();

                            if (typeof controllers[key].views != "undefined") {
                                this.resolveViews(
                                    temp,
                                    controllers[key].views,
                                    di
                                );
                            }

                        } else {
                            throw "Controller #" + i + " must be extend from View.Controller class";
                        }

                        i++;

                    } else {
                        throw "Config => Controller => 'name' must be initialized with View.Controller class"
                    }
                }
            } else {
                throw "Config => controllers must be array"
            }
        }

        /**
         *
         */
        private resolveViews(controller : View.Controller , views : any[], di)
        {
            if (typeof views != "undefined") {
                /*
                if (Array.isArray(views)) {

                    if (views.length == 0) {
                        for (let key in views) {

                            let tempView = new views[key](
                                controller.getViewModel()
                            );

                            tempView.setDi(di);

                            if (!(tempView instanceof View.Controller)) {
                                throw "View component must be an instance of View.Component"
                            }
                        }
                    }

                } else {
                    throw "Config => Controllers => views must be array"
                }
                */
            }
        }

        /**
         *
         */
        private resolveServices(di, service)
        {
            new service().initialize(di);
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
