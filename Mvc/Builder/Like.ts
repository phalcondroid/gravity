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
                return;
            }
            throw "And condition must be an object";            
        }

        /**
         * 
         */
        public get(row)
        {
            var result = new Array();
            var size   = Object.keys(this.condition).length;
            for (var key in this.condition) {
                if (this.condition[key] != "" && typeof row[key] == "string") {
                    //console.log("->", row[key], this.condition[key], this.condition[key].replace(/[^A-Za-z0-9\s]/g, ""));
                    var regexp = new RegExp(this.condition[key], "i");                    
                    if (regexp.test(row[key].replace(/([^a-z_0-9\s]+)/gi, ''))) {
                         return true;
                    }
                    return false;
                }
            }
            return false;
        }
    }
}