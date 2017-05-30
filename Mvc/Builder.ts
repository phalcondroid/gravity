
/// <reference path="Builder/DataType.ts" />
/// <reference path="Builder/Operators.ts" />
/// <reference path="Builder/ComparisonOperators.ts" />

namespace Mvc
{
    export class Builder
    {
        private lim  : number = null;
        private data : Object = false;
        private cols : any[]  = new Array;
        private conditions : any[] = new Array();

        /**
         * 
         * @param data 
         */
        public constructor(data : any = false)
        {
            this.data = data;
        }

        /**
         * 
         */
        public columns(cols)
        {
            if (typeof cols == "object") {
                this.cols = cols;
            } else {
                throw "Column param must be an object";
            }
            return this;
        }

        private getColumns(row)
        {
            var newRow : Object = {};
            if (Object.keys(this.cols).length > 0) {
                for (let key in this.cols) {
                    newRow[this.cols[key]] = row[this.cols[key]];
                }
            } else {
                newRow = row;
            }
            return newRow;
        }

        /**
         * 
         * @param condClass 
         */
        public where(conditions : any)
        {
            if (conditions instanceof Mvc.And) {
                this.conditions.push(
                    conditions.get()
                );
            } else if (conditions instanceof Mvc.Or) {
                this.conditions.push(
                    conditions.get()
                );
            } else if (conditions instanceof Mvc.Not) {
                this.conditions.push(
                    conditions.get()
                );
            } else if (conditions instanceof Mvc.In) {
                this.conditions.push(
                    conditions.get()
                );
            }
            return this;
        }

        public limit(limit)
        {
            if (typeof limit == "number") {
                this.lim = limit;
            } else {
                throw "limit must be number";
            }
            return this;
        }

        /**
         * 
         * @param conditions 
         */
        private joinConditions()
        {
            return this.conditions.join(" || ");
        }

        /**
         * 
         * @param conditions 
         */
        public orderBy(conditions : Object)
        {
            
        }

        /**
         * 
         */
        public get()
        {
            var results = new Array;
            var limit = 1;
            for (var key in this.data) {
                var row     = this.data[key];
                if (this.cols != null && this.cols.length > 0) {
                    row = this.getColumns(row);
                }
                if (this.conditions.length > 0) {
                    var conditions = this.joinConditions();
                    eval(
                        "if (" + conditions + ") { results.push(row) }"
                    );
                } else {
                    results.push(row);
                }
                if (this.lim != null) {
                    if (limit == this.lim) {
                        break;
                    }
                }
                limit++;
            }
            return results;
        }
    }
}