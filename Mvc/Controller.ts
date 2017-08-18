///<reference path="../View/ViewAdapter.ts"/>
///<reference path="../Service/Injectable.ts"/>


function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

namespace Gravity.Mvc
{
    @sealed
    export class Controller extends Service.Injectable
    {
        
        /**
         *
         */
        public initialize()
        {
        }

        /**
         *
         */
        public getArguments(args)
        {
            if (typeof args == "object") {
                var argsTemp = new Array();
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != "atmpnil" && !(args[i] instanceof Gravity.Mvc.Controller)) {
                        argsTemp.push(args[i]);
                    }
                }
                return argsTemp;
            } else {
                return false
            }
        }
    }
}
