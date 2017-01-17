
/// <reference path="./Html" />
/// <reference path="../Service/Service" />

namespace View
{
    export class Component
    {
        private viewModel : View.Model = null;

        /**
         *
         */
        public constructor(viewModel : View.Model)
        {
            this.viewModel = viewModel;
            this.initialize();
        }

        /**
         *
         */
        public initialize()
        {
        }

        /**
         *
         */
        public getById(id)
        {
            let element = new View.ViewElement();
            element.getById(id);
            return element;
        }

        /**
         *
         */
        public getByClass(cls)
        {
            let element = new View.ViewElement();
            let result  = element.getByClass(cls);
            return result;
        }

        /**
         *
         */
        public getByTag(tag)
        {
            let element = new View.ViewElement();
            let result  = element.getByTag(tag);
            return result;
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
        public getVar(key)
        {
            return this.viewModel.get(key);
        }
    }

    export class Model extends Service.Container
    {

    }
}
