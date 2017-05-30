namespace Mvc
{
    export class And
    {
        /**
         * 
         */
        private conditions : any[] = new Array;

        /**
         * 
         * @param condition 
         */
        public constructor(condition : Object)
        {
            if (typeof condition == "object") {
                for (var key in condition) {
                    var value = DataType.getValueByType(condition[key]);
                    this.conditions.push(
                        "row[\"" + key + "\"]" + " == " + value
                    );
                }
            } else {
                throw "And condition must be an object";
            }
        }

        public get()
        {
            return "(" + this.conditions.join(" && ") + ")";
        }
    }
}