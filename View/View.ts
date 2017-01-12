
/// <reference path="./Html" />
/// <reference path="../Service/Service" />

namespace View
{
    export class Component
    {
        private viewModelFromController : View.Model = null;

        public constructor(viewModel : View.Model)
        {
            this.setViewModel(viewModel);
            this.initialize();
        }

        public initialize()
        {
        }

        public setViewModel(viewModel : View.Model)
        {
            this.viewModelFromController = viewModel;
        }

        public get(key)
        {
            if (typeof this.viewModelFromController == null) {
                this.viewModelFromController = new View.Model;
            }
            this.viewModelFromController.get(key);
        }
    }

    export class Model extends Service.Container
    {

    }
}
