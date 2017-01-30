
/// <reference path="../Reflection/Reflection" />
/// <reference path="../Model/RawModel" />
/// <reference path="./UnitOfWork" />

namespace Persistence
{
    export class Hydrator implements Service.InjectionAwareInterface
    {
        di : Service.Container;
        private reflector : Reflection.Reflection;

        public constructor()
        {
        }

        public hydrate(model : any, data)
        {
            var newModel = new model(
                this.getDi()
            );
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
                        newModel[key] = data[key];
                        break;
                }
            }
            return newModel;
        }

        /**
         *
         */
        public setDi(di : Service.Container)
        {
            this.di = di;
        }

        /**
         *
         */
        public getDi()
        {
            return this.di;
        }
    }
}
