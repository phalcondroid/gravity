
namespace Criteria
{
    export class Native
    {
        public static AND   = "&&";
        public static OR    = "||";
        public static EQUAL = "==";
    }

    export class DataType
    {

        public static BOOLEAN = 1;
        public static INTEGER = 2;
        public static STRING  = 3;
        public static OBJECT  = 4;
        public static ARRAY   = 5;
        public static CLASS   = 6;

        public static BOOLEAN_TYPE = "boolean";
        public static INTEGER_TYPE = "number";
        public static STRING_TYPE  = "string";
        public static OBJECT_TYPE  = "object";

        /**
         *
         */
        public static getValueByType(value : any)
        {
            var tyof = typeof value;
            switch (tyof) {
                case DataType.STRING_TYPE:
                        value = "\"" + value + "\"";
                    break;
            }
            return value;
        }
    }

    export class Operator
    {
        public static OR          = "$or";
        public static AND         = "$and";
        public static SORT        = "$sort";
        public static LIMIT       = "$limit";
        public static COLUMNS     = "$columns";
        public static CONDITIONAL = "$conditions";
    }

    export class Sort
    {

        public static ASC  : number = 1;
        public static DESC : number = -1;

        public static sortByField(data, field) {

            var arr = [];
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var obj : any = {};
                    obj[prop] = data[prop];
                    obj.tempSortName = data[prop][field].toLowerCase();
                    arr.push(obj);
                }
            }

            arr.sort(function(a, b) {
                var at = a.tempSortName,
                    bt = b.tempSortName;
                return at > bt ? 1 : ( at < bt ? -1 : 0 );
            });

            var result = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                var obj = arr[i];
                delete obj.tempSortName;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        var id = prop;
                    }
                }
                var item = obj[id];
                result.push(item);
            }
            return result;
        }
    }

    export class Filters
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

                if (key == Operator.CONDITIONAL) {

                    let conditional = params[key];

                    for (var keyConditional in conditional) {

                        switch (keyConditional) {
                            case Operator.AND:

                                let iAnd = 1;
                                let andContent = conditional[keyConditional];
                                let andLength  = Object.keys(andContent).length;

                                for (let keyAnd in andContent) {
                                    this.getExpression(
                                        keyAnd,
                                        andContent[keyAnd],
                                        Native.AND,
                                        iAnd,
                                        andLength
                                    );
                                    iAnd++;
                                }

                                break;
                            case Operator.OR:

                                    let iOr = 1;
                                    let orContent = conditional[keyConditional];
                                    let orLength  = Object.keys(orContent).length;

                                    for (let keyOr in orContent) {
                                        this.getExpression(
                                            keyOr,
                                            orContent[keyOr],
                                            Native.OR,
                                            iOr,
                                            orLength
                                        );
                                        iOr++;
                                    }
                                break;
                            case Operator.SORT:
                                    this.getSort(
                                        conditional[keyConditional]
                                    );
                                break;
                            case Operator.LIMIT:
                                    this.getLimit(
                                        conditional[keyConditional]
                                    );
                                break;
                            case Operator.COLUMNS:
                                    this.columns = conditional[keyConditional];
                                    if (typeof conditional[keyConditional] != "object") {
                                        throw Errors.Message.getCodeMessage(
                                            Errors.MessageCode.NOT_VALID_OBJECT,
                                            "$columns option"
                                        );
                                    }
                                break;
                            default:

                                break;
                        }
                    }

                } else {
                    this.getExpression(
                        key,
                        params[key],
                        Native.AND,
                        index,
                        length
                    );
                    index++;
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

        public getExpression(key, content, operator, index, length)
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
                    condition += "row[\"" + key + "\"] == " + newVal[j] + " " + operatorStr + " ";
                }

            } else {
                let operatorStr = "";
                let valueByType = DataType.getValueByType(content);
                condition += "row[\"" + key + "\"] == " + valueByType + " " + operatorStr + " ";
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
        public getMultipleRowValues(response)
        {
            response = JSON.parse(response);
            if (this.first == "") {
                this.first = "true";
            }

            var conditions = this.first;
            var data = new Array();
            var evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";

            for (let key in response) {
                let row = response[key];
                eval(
                    evalValue
                );
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

            return data;
        }

        public getOneRowValue(data)
        {

        }
    }
}
