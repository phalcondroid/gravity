namespace Service
{
    export class Injectable implements Service.InjectionAwareInterface
    {
        di;

        public constructor()
        {
            
        }

        public inject()
        {
            for (var key in this.getDi()) {
                this[key] = this.getDi()[key];
            }
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