///<reference path="../Service/Service" />

namespace Logic
{
    export class Controller implements Service.InjectionAwareInterface
    {
        di : Service.Container;

        public constructor()
        {
            
        }

        public initialize()
        {

        }

        public onConstruct()
        {

        }

        public setDi(di : Service.Container)
        {
            this.di = di;
        }

        public getDi()
        {
            return this.di;
        }
    }
}
