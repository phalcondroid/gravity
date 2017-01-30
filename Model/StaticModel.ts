
/// <reference path="./RawModel"/>

namespace Model
{
    export class StaticModel extends RawModel implements Service.InjectionAwareInterface
    {
        private index : number;
        private container : Service.Container;
        di : Service.Container;

        /**
         *
         */
        public constructor(di : Service.Container = new Service.Container)
        {
            super();
            this.setDi(di);
            this.initialize();
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
