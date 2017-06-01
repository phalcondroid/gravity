
/// <reference path="Builder/DataType.ts" />
/// <reference path="Builder/ComparisonOperators.ts" />
/// <reference path="Builder/Operators.ts" />
/// <reference path="Builder/Gt.ts" />
/// <reference path="Builder/Gte.ts" />
/// <reference path="Builder/Lt.ts" />
/// <reference path="Builder/Lte.ts" />
/// <reference path="Builder/And.ts" />
/// <reference path="Builder/NotIn.ts" />
/// <reference path="Builder/Not.ts" />
/// <reference path="Builder/In.ts" />
/// <reference path="Builder/Sort.ts" />

namespace Mvc
{
    export class Query
    {
        private lim   : number = null;
        private sort  : any[]  = new Array;
        private data  : Object = false;
        private cols  : any[]  = new Array;
        private gt    : any[]  = new Array;
        private gte   : any[]  = new Array;
        private lt    : any[]  = new Array;
        private lte   : any[]  = new Array;
        private conds : number = null;
        private transactions   = new Array; 
        private negativeConds : number = null;
        private negativeTransactions   = new Array();

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
            if (conditions instanceof Builder.Transaction) {
                if (conditions instanceof Builder.Not || conditions instanceof Builder.NotIn) {
                    this.negativeTransactions.push(
                        conditions
                    );
                    this.negativeConds++;
                } else {
                    this.transactions.push(
                        conditions
                    );
                    this.conds++;
                }
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

        private addOperator(length, operator)
        {
            var cond = "";
            if (length > 0) {
                cond = operator + " ";
            }
            return cond;
        }

        /**
         * 
         * @param conditions 
         */
        private joinConditions()
        {
            /*
            var conditions = "";
            if (this.and.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.and.join(" && ") + " ";
            }
            if (this.or.length > 0) {
                conditions += this.addOperator(conditions.length, "||") + this.or.join(" || ") + " ";
            }
            if (this.not.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.not.join(" && ") + " ";
            }
            if (this.in.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.in.join(" && ") + " ";
            }
            if (this.notIn.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.notIn.join(" && ") + " ";
            }
            if (this.gt.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.gt.join(" && ") + " ";
            }
            if (this.gte.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.gte.join(" && ") + " ";
            }
            if (this.lt.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.lt.join(" && ") + " ";
            }
            if (this.lte.length > 0) {
                conditions += this.addOperator(conditions.length, "&&") + this.lte.join(" && ") + " ";
            }
            return conditions;
            */
        }

        /**
         * 
         * @param conditions 
         */
        public orderBy(sortContent : Object)
        {
            switch (typeof sortContent) {
                case Builder.DataType.STRING_TYPE:
                        this.sort.push(
                            "results = Builder.Sort.sortByField('" + sortContent + "');"
                        );
                    break;
                case Builder.DataType.OBJECT_TYPE:
                        if (Array.isArray(sortContent)) {
                            for (let sortKey in sortContent) {
                                let sortValue = sortContent[sortKey]
                                this.sort.push(
                                    "results = Builder.Sort.sortByField(results, '" + sortValue + "')"
                                );
                            }
                        } else {
                            for (let sortKey in sortContent) {
                                let sortType = sortContent[sortKey];
                                this.sort.push(
                                    "results = Builder.Sort.sortByField(results, '" + sortKey + "');"
                                );
                                if (sortContent[sortKey] == Builder.Sort.DESC) {
                                    this.sort.push(
                                        "results = results.reverse();"
                                    );
                                }
                            }
                        }
                    break;
            }
        }

        /**
         * 
         * @param row 
         */
        private miniChecksum(row)
        {
            var str  = JSON.stringify(row);
            var hash = 0;
            var char = 0;
            if (str.length == 0) return hash;
            for (var i = 0; i < str.length; i++) {
                char = str.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }

        /**
         * 
         * @param result
         * @param row 
         */
        private ifExistOnResult(result, row)
        {
            for (var key in result) {
                if (this.miniChecksum(result[key]) == this.miniChecksum(row)) {
                    return false;
                }
            }
            return true;
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
                if (this.conds > 0) {
                    for (var key in this.transactions) {
                        var result = this.transactions[key].get(
                            row
                        );
                        if (result) {
                            if (this.ifExistOnResult(results, row)) {
                                results.push(row);
                            }
                        }
                    }
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
            var newResults = new Array();
            for (var key in results) {
                var row = results[key];
                if (this.negativeConds > 0) {
                    for (var key in this.negativeTransactions) {
                        var result = this.negativeTransactions[key].get(
                            row
                        );
                        if (result) {
                            if (this.ifExistOnResult(newResults, row)) {
                                newResults.push(row);
                            }
                        }
                    }
                } else {
                    newResults.push(row);
                }
            }
            if (this.sort.length > 0) {
                var i = 0;
                for (let keySort in this.sort) {
                    eval(this.sort[keySort]);
                    i++;
                }
            }
            return newResults;
        }
    }
}