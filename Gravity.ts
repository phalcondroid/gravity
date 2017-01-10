
namespace Gravity
{
    export class Application
    {

        private controllers : any[] = new Array;
        private loader      : any = null;

        /**
         *
         */
        public load(loader)
        {
            this.loader = loader;
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
        public start()
        {
            var di = new Service.FactoryDefault;
            var i = 1;
            var executed = new Array();

            if (this.loader != null) {
                var loader = new this.loader();
                loader.initialize(di);
            }

            if (this.controllers.length == 0) {
                throw "You must load your controllers";
            }

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
    }
}
