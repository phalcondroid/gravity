
/// <reference path="../Reflection/Reflection" />
/// <reference path="../Model/RawModel" />
/// <reference path="./UnitOfWork" />

namespace Persistence
{
    export class Hydrator
    {

        private reflector : Reflection.Reflection;

        public constructor()
        {
        }

        public hydrate(model : any, data)
        {
            var newModel = new model();
            newModel.state = Persistence.UnitOfWork.CREATED;

            for (let key in data) {
                switch (typeof newModel[key]) {
                    case "function":
                        var auxPropNested = new newModel[key];
                        if (auxPropNested instanceof Model.RawModel) {
                            newModel[key] = this.hydrate(newModel[key], data[key]);
                        } else {
                            newModel[key] = data[key];
                        }
                        break;
                    default:
                            var dataArray = new Array();
                            if (Array.isArray(newModel[key])) {
                                switch (typeof newModel[key][0]) {
                                    case "function":
                                            if (typeof data[key].length != "undefined") {
                                                if (data[key].length > 0) {

                                                    var auxSubModel = new newModel[key][0];
                                                    var arrayData   = new Array();

                                                    if (auxSubModel instanceof Model.RawModel) {
                                                        for (let subModelKey in data[key]) {
                                                            arrayData.push(
                                                                this.hydrate(newModel[key][0], data[key][subModelKey])
                                                            );
                                                        }
                                                        newModel[key] = arrayData;
                                                    }
                                                }
                                            }
                                        break;
                                }
                                if (newModel[key][0]) {

                                }
                            } else {
                                newModel[key] = data[key];
                            }
                        break;
                }
            }
            return newModel;
        }
    }
}
