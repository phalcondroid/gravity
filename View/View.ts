
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
            return new Html.HtmlElement().byId(id);
        }

        /**
         *
         */
        public getByClass(cls)
        {
            return new Html.HtmlElement().byClass(cls);
        }

        /**
         *
         */
        public getByTag(tag)
        {
            return new Html.HtmlElement().byTag(tag);
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
