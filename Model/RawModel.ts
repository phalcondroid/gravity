/// <reference path="../Helper/Uuid" />

namespace ModelData
{
    export class RawModel
    {
        state         : number = 1;
        identify      = Helper.Uuid.get();

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
    }
}
