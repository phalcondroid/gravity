
/// <reference path="Builder/DataType.ts" />
/// <reference path="Builder/Operators.ts" />
/// <reference path="Builder/ComparisonOperators.ts" />

namespace Mvc
{
    export class Builder
    {
        private data    : Object = false;
        private params  : Object;
        private first   : string  = "";
        private final   : any[]   = [];
        private init    : boolean = false;
        private sort    : any[]   = new Array();
        private limit   : string  = null;
        private columns : Object  = {};

        public constructor(data : any = false)
        {
            this.data = data;
        }

        public buildCondition(params)
        {
            var index  = 1;
            var length = Object.keys(params).length;

            for (var key in params) {

                switch (key) {

                    case Mvc.Operators.CONDITIONAL:

                        let conditional = params[key];

                        for (var keyConditional in conditional) {

                            switch (keyConditional) {
                                case Mvc.Operators.AND:

                                    let iAnd = 1;
                                    let andContent = conditional[keyConditional];
                                    let andLength  = Object.keys(andContent).length;

                                    for (let keyAnd in andContent) {
                                        this.getExpression(
                                            keyAnd,
                                            andContent[keyAnd],
                                            ComparisonOperators.AND,
                                            iAnd,
                                            andLength
                                        );
                                        iAnd++;
                                    }

                                    break;
                                case Operators.OR:

                                        let iOr = 1;
                                        let orContent = conditional[keyConditional];
                                        let orLength  = Object.keys(orContent).length;

                                        for (let keyOr in orContent) {
                                            this.getExpression(
                                                keyOr,
                                                orContent[keyOr],
                                                Operators.OR,
                                                iOr,
                                                orLength
                                            );
                                            iOr++;
                                        }
                                    break;
                                case Mvc.Operators.IS_NOT:
                                        let iIsNot = 1;
                                        let isNotContent = conditional[keyConditional];
                                        let isNotLength  = Object.keys(isNotContent).length;
                                        for (let keyIsNot in isNotContent) {
                                            this.getExpression(
                                                keyIsNot,
                                                isNotContent[keyIsNot],
                                                ComparisonOperators.AND,
                                                iIsNot,
                                                isNotLength,
                                                ComparisonOperators.DIFFERENT
                                            );
                                            iIsNot++;
                                        }
                                    break;
                                default:

                                    break;
                            }
                        }
                        break;

                    case Mvc.Operators.SORT:
                            this.getSort(
                                params[key]
                            );
                        break;
                    case Mvc.Operators.LIMIT:
                            this.getLimit(
                                params[key]
                            );
                        break;
                    case Mvc.Operators.COLUMNS:
                            this.columns = params[key];
                            if (typeof params[key] != "object") {
                                throw Errors.Message.getCodeMessage(
                                    Errors.MessageCode.NOT_VALID_OBJECT,
                                    "$columns option"
                                );
                            }
                        break;
                    default:
                        this.getExpression(
                            key,
                            params[key],
                            ComparisonOperators.AND,
                            index,
                            length
                        );
                        index++;
                        break;
                }
            }
        }

        public getSort(sortContent)
        {
            switch (typeof sortContent) {
                case Mvc.DataType.STRING_TYPE:
                        this.sort.push(
                            "data = Sort.sortByField('" + sortContent + "');"
                        );
                    break;
                case Mvc.DataType.OBJECT_TYPE:
                        if (Array.isArray(sortContent)) {
                            for (let sortKey in sortContent) {
                                let sortValue = sortContent[sortKey]
                                this.sort.push(
                                    "data = Sort.sortByField(data, '" + sortValue + "')"
                                );
                            }
                        } else {
                            for (let sortKey in sortContent) {
                                let sortType = sortContent[sortKey];
                                this.sort.push(
                                    "data = Sort.sortByField(data, '" + sortKey + "');"
                                );
                                if (sortContent[sortKey] == Mvc.Sort.DESC) {
                                    this.sort.push(
                                        "data = data.reverse();"
                                    );
                                }
                            }
                        }
                    break;
            }
        }

        public getLimit(limit)
        {
            if (typeof limit == "string") {
                limit = parseInt(limit);
            }
            this.limit = "data = data.slice(0, " + limit + ") ";
        }

        public getExpression(key, content, operator, index, length, comparison = "==")
        {
            var condition : string = "";
            var finalOperator = "";
            if (this.init) {
                finalOperator = operator;
            }

            if (Array.isArray(content)) {
                var newVal = content;
                for (var j = 0; j < newVal.length; j++) {
                    let operatorStr = "";
                    if (j < (newVal.length - 1)) {
                        operatorStr = operator;
                    }
                    let valueByType = Mvc.DataType.getValueByType(newVal[j]);
                    condition += "row[\"" + key + "\"] " + comparison + " " + newVal[j] + " " + operatorStr + " ";
                }

            } else {
                let operatorStr = "";
                let valueByType = Mvc.DataType.getValueByType(content);
                condition += "row[\"" + key + "\"] " + comparison + " " + valueByType + " " + operatorStr + " ";
            }
            this.first += finalOperator + " ( " + condition + " ) ";
            this.init = true;
        }

        /**
         *
         */
        public getColumns(row)
        {
            var newRow : Object = {};
            if (Object.keys(this.columns).length > 0) {
                for (let key in this.columns) {
                    newRow[this.columns[key]] = row[this.columns[key]];
                }
            } else {
                newRow = row;
            }
            return newRow;
        }

        /**
         *
         */
        public getMultipleRowValues(rsp, conds = true)
        {
            if (typeof rsp != "object") {
                var response = JSON.parse(rsp);
                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
            } else {
                response = rsp;
            }

            if (this.first == "") {
                this.first = "true";
            }

            var data = new Array();

            if (Array.isArray(response)) {

                var conditions = this.first;
                var evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";

                for (let key in response) {
                    let row = response[key];

                    if (conds) {
                        eval(
                            evalValue
                        );
                    } else {
                        data.push(this.getColumns(row));
                    }
                }


                if (this.sort.length > 0) {
                    var i = 0;
                    for (let key in this.sort) {
                        eval(this.sort[key]);
                        i++;
                    }
                }

                if (this.limit != null) {
                    eval(this.limit);
                }
            } else {
                if (typeof response == "object") {
                    data.push(
                        this.getColumns(response)
                    );
                } else {
                    console.log("Response is not an object");
                }
            }
            return data;
        }

        public getOneRowValue(data)
        {

        }
    }
}