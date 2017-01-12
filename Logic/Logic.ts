///<reference path="../Service/Service" />

namespace Logic
{
    export class Controller implements Service.InjectionAwareInterface
    {
        di : Service.Container;
        private viewModel : View.Model = new View.Model();

        /**
         *
         */
        public initialize()
        {

        }

        /**
         *
         */
        public onConstruct()
        {

        }

        /**
         *
         */
        public setVar(key, value)
        {
            this.viewModel.set(key, value);
        }

        /**
         *
         */
        public getViewModel() : View.Model
        {
            return this.viewModel;
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
