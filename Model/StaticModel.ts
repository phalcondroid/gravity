
/// <reference path="./RawModel"/>

namespace ModelData
{
    export class StaticModel extends RawModel implements Service.InjectionAwareInterface
    {
        private index : number;
        private container : Service.Container;
        di : Service.Container;

        /**
         *
         */
        public constructor(di : Service.Container)
        {
            super();
            this.setDi(new Service.Container());
            this.initialize();
        }

        /**
         *
         */
        public setData(data)
        {
            this.getDi().setPersistent(
                this.getIdentify(),
                JSON.stringify(
                    data
                )
            );
        }

        /**
         *
         */
        public getData()
        {
            return this.getDi().getPersistent(
                this.getIdentify()
            );
        }

        /**
         *
         */
        public getObjectData()
        {
            return JSON.parse(
                this.getDi().getPersistent(
                    this.getIdentify()
                )
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
        public getDi()
        {
            return this.di;
        }

        /**
         *
         */
        public setIndex(index)
        {
            this.index = index;
        }

        /**
         *
         */
        public getIndex()
        {
            return this.index;
        }

        /**
         *
         */
        public getSerialized()
        {

        }
    }
}
