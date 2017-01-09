
/// <reference path="../Reflection/Reflection" />

namespace Hydrator {

    export class Hydrator {

        private reflector : Reflection.Reflection;

        public constructor()
        {
        }

        public hydrate(model : any, data)
        {
            var newModel = new model();

            console.log(model, data);

            for (let key in data) {
                switch (typeof newModel[key]) {
                    case "function":
                        var auxPropNested = new newModel[key];
                        if (auxPropNested instanceof Data.RawModel) {
                            newModel[key] = this.hydrate(newModel[key], data[key]);
                        } else {
                            newModel[key] = data[key];
                        }
                        break;
                    default:
                        newModel[key] = data[key];
                        break;
                }
            }
            return newModel;
        }
    }
}
