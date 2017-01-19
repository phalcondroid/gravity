namespace View
{
    export class Controller implements Service.InjectionAwareInterface
    {
        public di         : Service.Container;

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
        public getDi() : Service.Container
        {
            return this.di;
        }

        /**
         *
         */
        public setDi(di : Service.Container)
        {
            this.di = di;
        }
    }
}
