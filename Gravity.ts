
///<reference path="./Environment/Environment"/>

namespace Gravity
{
    export class Application
    {

        private controllers : any[]  = new Array;
        private loader      : any    = null;
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
        public setLoader(loader)
        {
            this.loader = loader;
        }

        /**
         *
         */
        public resolveLoader(di)
        {
            if (this.loader != null) {
                var loader = new this.loader();
                loader.initialize(di);
            }
        }

        /**
         *
         */
        public setControllers(controllers : any[])
        {
            this.controllers = controllers;
        }

        /**
         *
         */
        public resolveControllers(di)
        {
            if (this.controllers.length == 0) {
                throw "You must load your controllers";
            }

            let i = 1;
            let executed = new Array();

            for (let key in this.controllers) {
                var temp = new this.controllers[key];
                if (temp instanceof Logic.Controller) {
                    temp.setDi(di);
                    temp.onConstruct();
                    temp.initialize();
                    executed[this.controllers[key]] = temp;
                } else {
                    throw "Controller #" + i + " must be extend from Logic.Controller class";
                }
                i++;
            }
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
        public resolveConfig(di)
        {
            if (this.config) {
                for (let key in this.config) {
                    var url = new Url.Url();
                    switch (key) {
                        case "baseUrl":
                                url.setBaseUrl(this.config[key]);
                            break;
                    }
                    di.set("url", url);
                }
            }
        }

        /**
         *
         */
        public start()
        {
            var di = new Service.FactoryDefault;

            this.resolveConfig(di);
            this.resolveLoader(di);
            this.resolveControllers(di);
        }
    }
}
