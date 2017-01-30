/// <reference path="../Helper/Uuid" />

namespace Model
{
    export class RawModel
    {
        state         : number = 1;
        di            : Service.Container;
        identify      = Helper.Uuid.get();
        
        public constructor(di : Service.Container)
        {
            this.setDi(di);
        }

        public initialize()
        {
        }

        public beforeInsert()
        {
        }

        public beforeFind()
        {
        }

        public beforeUpdate()
        {
        }

        public beforeDelete()
        {
        }

        /**
         * [getClassName description]
         * @return {[type]} [description]
         */
        public getClassName() {
            let funcNameRegex = /function (.{1,})\(/;
            let results  = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        }

        /**
         *
         */
        public getIdentify()
        {
            return this.identify;
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
