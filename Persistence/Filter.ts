
/// <reference path="./DatamapperOperators" />
/// <reference path="./ComparisonOperators" />

namespace Persistence
{
    export class Filter
    {

        private params  : Object;
        private first   : string  = "";
        private final   : any[]   = [];
        private init    : boolean = false;
        private sort    : any[]   = new Array();
        private limit   : string  = null;
        private columns : Object  = {};

        public constructor()
        {

        }

        public buildCondition(params)
        {
            var index  = 1;
            var length = Object.keys(params).length;

            for (var key in params) {

                switch (key) {

                    case DatamapperOperators.CONDITIONAL:

                        let conditional = params[key];

                        for (var keyConditional in conditional) {

                            switch (keyConditional) {
                                case DatamapperOperators.AND:

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
                                case DatamapperOperators.OR:

                                        let iOr = 1;
                                        let orContent = conditional[keyConditional];
                                        let orLength  = Object.keys(orContent).length;

                                        for (let keyOr in orContent) {
                                            this.getExpression(
                                                keyOr,
                                                orContent[keyOr],
                                                ComparisonOperators.OR,
                                                iOr,
                                                orLength
                                            );
                                            iOr++;
                                        }
                                    break;
                                case DatamapperOperators.IS_NOT:
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

                    case DatamapperOperators.SORT:
                            this.getSort(
                                params[key]
                            );
                        break;
                    case DatamapperOperators.LIMIT:
                            this.getLimit(
                                params[key]
                            );
                        break;
                    case DatamapperOperators.COLUMNS:
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
                case DataType.STRING_TYPE:
                        this.sort.push(
                            "data = Sort.sortByField('" + sortContent + "');"
                        );
                    break;
                case DataType.OBJECT_TYPE:
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
                                if (sortContent[sortKey] == Sort.DESC) {
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
                    let valueByType = DataType.getValueByType(newVal[j]);
                    condition += "row[\"" + key + "\"] " + comparison + " " + newVal[j] + " " + operatorStr + " ";
                }

            } else {
                let operatorStr = "";
                let valueByType = DataType.getValueByType(content);
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
        public getMultipleRowValues(response, withConditions : boolean = true)
        {
            response = JSON.parse(response);
            if (this.first == "") {
                this.first = "true";
            }

            var data = new Array();

            if (Array.isArray(response)) {

                var conditions = this.first;
                var evalValue  = "";

                for (let key in response) {
                    let row = response[key];
                    if (withConditions) {
                        evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";
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
                    data.push(this.getColumns(response));
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
