///<reference path="Transaction.ts"/>

namespace Builder
{
    export class Like extends Builder.Transaction
    {
        /**
         * 
         */
        private condition: Object = {};

        /**
         * 
         * @param condition 
         */
        public constructor(condition : any)
        {
            super();
            if (typeof condition == "object") {
                this.condition = condition;
            } else {
                throw "And condition must be an object";
            }
        }

        /**
         * 
         */
        public get(row)
        {
            var result = new Array();
            var size   = Object.keys(this.condition).length;
            for (var key in this.condition) {
                if (typeof row[key] == "string") {
                    if (this.condition[key] != "") {
                        if (row[key].indexOf(this.condition[key]) > -1) {
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }
            return false;
        }
    }
}