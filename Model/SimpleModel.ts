
/// <reference path="./RawModel"/>

namespace Model
{
    export class SimpleModel extends RawModel implements Service.InjectionAwareInterface
    {
        di : Service.Container;
        private data;

        public constructor(di : Service.Container)
        {
            super();
            this.setDi(di);
            this.initialize();
        }

        /**
         *
         */
        public setData(data)
        {
            this.getDi().setPersistent(
                this.getIdentify(),
                data
            );
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
        public getData()
        {
            return this.data;
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
