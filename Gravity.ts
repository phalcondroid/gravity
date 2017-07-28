
///<reference path="./Environment/Scope.ts"/>
///<reference path="./Environment/Config.ts"/>
///<reference path="./Helper/ArrayHelper.ts"/>

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
        private try = 0;

        /**
         *
         */
        private env    : number = Environment.Scope.LOCAL;

        /**
         * 
         */
        private catchErrors : Function = function () {}; 

        /**
         *
         */
        public constructor()
        {
            window.onbeforeunload = function () {
                sessionStorage.clear();
            }
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
        public getConfig()
        {
            return this.config;
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
                for (var keyUrlFor in urls) {
                    url.set(
                        keyUrlFor,
                        urls[keyUrlFor]
                    );
                }
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
                            this.resolvePropertiesController(
                                temp
                            );

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

        private resolvePropertiesController(controller : View.Controller)
        {
            var restricted = [
                "constructor",
                "initialize",
                "getById",
                "getByTag",
                "getByClass",
                "getDi",
                "setDi",
                "getUrl",
                "setUrl"
            ];

            for (var key in controller) {
                switch (typeof controller[key]) {
                    case "function":
                            if (!Helper.ArrayHelper.inArray(restricted, key)) {
                                var component = controller.getById(key);
                                if (component) {
                                    controller[key](component);
                                }
                            }
                        break;
                }
            }
            controller.inject();
        }

        /**
         *
         */
        private resolveServices(di, service)
        {
            new service().initialize(di);
        }

        public catch(fn)
        {
            this.catchErrors = fn;
            return this;
        }

        /**
         *
         */
        public start()
        {
            try {
                var di = new Service.FactoryDefault;
                this.resolveConfig(di);
            } catch (e) {
                this.catchErrors(e);
            }
        }
    }
}
