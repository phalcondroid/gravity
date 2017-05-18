
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
            this.setContainer(new Service.Container());
            this.initialize();
        }

        /**
         *
         */
        public setData(data)
        {
            this.getContainer().setPersistent(
                "Models_Identify_" + this.getClassName(),
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
            var data = this.getContainer().getPersistent(
                "Models_Identify_" + this.getClassName()
            );
            if (typeof data == "string") {
                //return this.getObjectData();
            }
            return data;
        }

        /**
         *
         */
        public getObjectData()
        {
            return JSON.parse(
                this.getContainer().getPersistent(
                    "Models_Identify_" + this.getClassName()
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
        public setContainer(container)
        {
            this.container = container;
        }

        /**
         * 
         */
        public getContainer()
        {
            return this.container;
        }
    }
}
