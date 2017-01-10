var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Data;
(function (Data) {
    var RawModel = (function () {
        function RawModel() {
            this.state = 1;
        }
        RawModel.prototype.initialize = function () {
        };
        RawModel.prototype.beforeInsert = function () {
        };
        RawModel.prototype.beforeFind = function () {
        };
        RawModel.prototype.beforeUpdate = function () {
        };
        RawModel.prototype.beforeDelete = function () {
        };
        return RawModel;
    }());
    Data.RawModel = RawModel;
    var ModelAjax = (function (_super) {
        __extends(ModelAjax, _super);
        function ModelAjax() {
            var _this = _super.call(this) || this;
            _this.method = "POST";
            _this.initialize();
            return _this;
        }
        ModelAjax.prototype.setSource = function (data) {
            this.setInsertUrl(data.insert);
            this.setUpdateUrl(data.update);
            this.setInsertUrl(data.insert);
            this.setFindUrl(data.insert);
        };
        ModelAjax.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        ModelAjax.prototype.setInsertUrl = function (url) {
            this.insertUrl = url;
        };
        ModelAjax.prototype.setFindUrl = function (url) {
            this.findUrl = url;
        };
        ModelAjax.prototype.setDeleteUrl = function (url) {
            this.deleteUrl = url;
        };
        ModelAjax.prototype.setUpdateUrl = function (url) {
            this.updateUrl = url;
        };
        ModelAjax.prototype.getInsertUrl = function () {
            return this.insertUrl;
        };
        ModelAjax.prototype.getFindUrl = function () {
            return this.findUrl;
        };
        ModelAjax.prototype.getDeleteUrl = function () {
            return this.deleteUrl;
        };
        ModelAjax.prototype.getUpdateUrl = function () {
            return this.updateUrl;
        };
        ModelAjax.prototype.setParams = function (params) {
            this.params = params;
        };
        ModelAjax.prototype.getParams = function () {
            return this.params;
        };
        ModelAjax.prototype.setMethod = function (method) {
            this.method = method;
        };
        ModelAjax.prototype.getMethod = function () {
            return this.method;
        };
        return ModelAjax;
    }(RawModel));
    Data.ModelAjax = ModelAjax;
    var SimpleModel = (function (_super) {
        __extends(SimpleModel, _super);
        function SimpleModel() {
            return _super.apply(this, arguments) || this;
        }
        return SimpleModel;
    }(RawModel));
    Data.SimpleModel = SimpleModel;
})(Data || (Data = {}));
var Errors;
(function (Errors) {
    var Message = (function () {
        function Message() {
        }
        Message.getCodeMessage = function (code, custom) {
            var custom = " => " + custom;
            switch (code) {
                case Errors.MessageCode.NOT_VALID_ARRAY:
                    return Message.NOT_VALID_ARRAY + custom;
                case Errors.MessageCode.NOT_VALID_ARRAY_OBJECT:
                    return Message.NOT_VALID_ARRAY_OBJECT + custom;
                case Errors.MessageCode.NOT_VALID_OBJECT:
                    return Message.NOT_VALID_OBJECT + custom;
            }
        };
        return Message;
    }());
    Message.NOT_VALID_ARRAY = "The object returned in the transaction is not array";
    Message.NOT_VALID_ARRAY_OBJECT = "The objects returned in the transaction into array are not objects, every row must be object key, value";
    Message.NOT_VALID_OBJECT = "The received variable is not an object";
    Errors.Message = Message;
    var MessageCode = (function () {
        function MessageCode() {
        }
        return MessageCode;
    }());
    MessageCode.NOT_VALID_ARRAY = 1;
    MessageCode.NOT_VALID_ARRAY_OBJECT = 2;
    MessageCode.NOT_VALID_OBJECT = 3;
    Errors.MessageCode = MessageCode;
})(Errors || (Errors = {}));
var Events;
(function (Events) {
    var Manager = (function () {
        function Manager() {
        }
        return Manager;
    }());
    Events.Manager = Manager;
})(Events || (Events = {}));
var Gravity;
(function (Gravity) {
    var Application = (function () {
        function Application() {
            this.controllers = new Array;
            this.loader = null;
        }
        /**
         *
         */
        Application.prototype.load = function (loader) {
            this.loader = loader;
        };
        /**
         *
         */
        Application.prototype.setControllers = function (controllers) {
            this.controllers = controllers;
        };
        /**
         *
         */
        Application.prototype.start = function () {
            var di = new Service.FactoryDefault;
            var i = 1;
            var executed = new Array();
            if (this.loader != null) {
                var loader = new this.loader();
                loader.initialize(di);
            }
            if (this.controllers.length == 0) {
                throw "You must load your controllers";
            }
            for (var key in this.controllers) {
                var temp = new this.controllers[key];
                if (temp instanceof Logic.Controller) {
                    temp.setDi(di);
                    temp.onConstruct();
                    temp.initialize();
                    executed[this.controllers[key]] = temp;
                }
                else {
                    throw "Controller #" + i + " must be extend from Logic.Controller class";
                }
                i++;
            }
        };
        return Application;
    }());
    Gravity.Application = Application;
})(Gravity || (Gravity = {}));
/// <reference path="../Errors/Errors"/>
var Helper;
/// <reference path="../Errors/Errors"/>
(function (Helper) {
    var ArrayHelper = (function () {
        function ArrayHelper() {
        }
        ArrayHelper.inArray = function (container, element) {
            for (var key in container) {
                if (container[key] == element) {
                    return true;
                }
            }
            return false;
        };
        return ArrayHelper;
    }());
    Helper.ArrayHelper = ArrayHelper;
    var MathHelper = (function () {
        function MathHelper() {
        }
        MathHelper.getRandom = function (init, last) {
            return Math.floor((Math.random() * last) + init);
        };
        MathHelper.getUUID = function () {
            return this.getS4() + this.getS4() + '-' +
                this.getS4() + '-' + this.getS4() + '-' +
                this.getS4() + '-' + this.getS4() +
                this.getS4() + this.getS4();
        };
        MathHelper.getS4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return MathHelper;
    }());
    Helper.MathHelper = MathHelper;
    var StringHelper = (function () {
        function StringHelper() {
        }
        /**
         * [sanitizeString description]
         * @param  {string} str [description]
         * @return {[type]}     [description]
         */
        StringHelper.sanitizeString = function (str) {
            var idTr = str.replace(/[`~!@#$%^&*()_|+\-=?;:"",.<>\{\}\[\]\\\/]/gi, "").toLowerCase();
            idTr = idTr.toString().replace(/\s/g, "");
            return idTr;
        };
        /**
         * [capitalize description]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        StringHelper.capitalize = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        return StringHelper;
    }());
    Helper.StringHelper = StringHelper;
    var Validator = (function () {
        function Validator() {
        }
        Validator.validStructArray = function (data) {
            try {
                if (Array.isArray(data)) {
                    var firstPosition = data[0];
                    if (typeof firstPosition == "object") {
                        return true;
                    }
                    else {
                        throw Errors.Message.NOT_VALID_ARRAY_OBJECT;
                    }
                }
                else {
                    throw Errors.Message.NOT_VALID_ARRAY;
                }
            }
            catch (e) {
            }
        };
        return Validator;
    }());
    Helper.Validator = Validator;
})(Helper || (Helper = {}));
var Criteria;
(function (Criteria) {
    var Native = (function () {
        function Native() {
        }
        return Native;
    }());
    Native.AND = "&&";
    Native.OR = "||";
    Native.EQUAL = "==";
    Criteria.Native = Native;
    var DataType = (function () {
        function DataType() {
        }
        /**
         *
         */
        DataType.getValueByType = function (value) {
            var tyof = typeof value;
            switch (tyof) {
                case DataType.STRING_TYPE:
                    value = "\"" + value + "\"";
                    break;
            }
            return value;
        };
        return DataType;
    }());
    DataType.BOOLEAN = 1;
    DataType.INTEGER = 2;
    DataType.STRING = 3;
    DataType.OBJECT = 4;
    DataType.ARRAY = 5;
    DataType.CLASS = 6;
    DataType.BOOLEAN_TYPE = "boolean";
    DataType.INTEGER_TYPE = "number";
    DataType.STRING_TYPE = "string";
    DataType.OBJECT_TYPE = "object";
    Criteria.DataType = DataType;
    var Operator = (function () {
        function Operator() {
        }
        return Operator;
    }());
    Operator.OR = "$or";
    Operator.AND = "$and";
    Operator.SORT = "$sort";
    Operator.LIMIT = "$limit";
    Operator.COLUMNS = "$columns";
    Operator.CONDITIONAL = "$conditions";
    Criteria.Operator = Operator;
    var Sort = (function () {
        function Sort() {
        }
        Sort.sortByField = function (data, field) {
            var arr = [];
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var obj = {};
                    obj[prop] = data[prop];
                    obj.tempSortName = data[prop][field].toLowerCase();
                    arr.push(obj);
                }
            }
            arr.sort(function (a, b) {
                var at = a.tempSortName, bt = b.tempSortName;
                return at > bt ? 1 : (at < bt ? -1 : 0);
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
        };
        return Sort;
    }());
    Sort.ASC = 1;
    Sort.DESC = -1;
    Criteria.Sort = Sort;
    var Filters = (function () {
        function Filters() {
            this.first = "";
            this.final = [];
            this.init = false;
            this.sort = new Array();
            this.limit = null;
            this.columns = {};
        }
        Filters.prototype.buildCondition = function (params) {
            var index = 1;
            var length = Object.keys(params).length;
            for (var key in params) {
                if (key == Operator.CONDITIONAL) {
                    var conditional = params[key];
                    for (var keyConditional in conditional) {
                        switch (keyConditional) {
                            case Operator.AND:
                                var iAnd = 1;
                                var andContent = conditional[keyConditional];
                                var andLength = Object.keys(andContent).length;
                                for (var keyAnd in andContent) {
                                    this.getExpression(keyAnd, andContent[keyAnd], Native.AND, iAnd, andLength);
                                    iAnd++;
                                }
                                break;
                            case Operator.OR:
                                var iOr = 1;
                                var orContent = conditional[keyConditional];
                                var orLength = Object.keys(orContent).length;
                                for (var keyOr in orContent) {
                                    this.getExpression(keyOr, orContent[keyOr], Native.OR, iOr, orLength);
                                    iOr++;
                                }
                                break;
                            case Operator.SORT:
                                this.getSort(conditional[keyConditional]);
                                break;
                            case Operator.LIMIT:
                                this.getLimit(conditional[keyConditional]);
                                break;
                            case Operator.COLUMNS:
                                this.columns = conditional[keyConditional];
                                if (typeof conditional[keyConditional] != "object") {
                                    throw Errors.Message.getCodeMessage(Errors.MessageCode.NOT_VALID_OBJECT, "$columns option");
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                else {
                    this.getExpression(key, params[key], Native.AND, index, length);
                    index++;
                }
            }
        };
        Filters.prototype.getSort = function (sortContent) {
            switch (typeof sortContent) {
                case DataType.STRING_TYPE:
                    this.sort.push("data = Sort.sortByField('" + sortContent + "');");
                    break;
                case DataType.OBJECT_TYPE:
                    if (Array.isArray(sortContent)) {
                        for (var sortKey in sortContent) {
                            var sortValue = sortContent[sortKey];
                            this.sort.push("data = Sort.sortByField(data, '" + sortValue + "')");
                        }
                    }
                    else {
                        for (var sortKey in sortContent) {
                            var sortType = sortContent[sortKey];
                            this.sort.push("data = Sort.sortByField(data, '" + sortKey + "');");
                            if (sortContent[sortKey] == Sort.DESC) {
                                this.sort.push("data = data.reverse();");
                            }
                        }
                    }
                    break;
            }
        };
        Filters.prototype.getLimit = function (limit) {
            if (typeof limit == "string") {
                limit = parseInt(limit);
            }
            this.limit = "data = data.slice(0, " + limit + ") ";
        };
        Filters.prototype.getExpression = function (key, content, operator, index, length) {
            var condition = "";
            var finalOperator = "";
            if (this.init) {
                finalOperator = operator;
            }
            if (Array.isArray(content)) {
                var newVal = content;
                for (var j = 0; j < newVal.length; j++) {
                    var operatorStr = "";
                    if (j < (newVal.length - 1)) {
                        operatorStr = operator;
                    }
                    var valueByType = DataType.getValueByType(newVal[j]);
                    condition += "row[\"" + key + "\"] == " + newVal[j] + " " + operatorStr + " ";
                }
            }
            else {
                var operatorStr = "";
                var valueByType = DataType.getValueByType(content);
                condition += "row[\"" + key + "\"] == " + valueByType + " " + operatorStr + " ";
            }
            this.first += finalOperator + " ( " + condition + " ) ";
            this.init = true;
        };
        /**
         *
         */
        Filters.prototype.getColumns = function (row) {
            var newRow = {};
            if (Object.keys(this.columns).length > 0) {
                for (var key in this.columns) {
                    newRow[this.columns[key]] = row[this.columns[key]];
                }
            }
            else {
                newRow = row;
            }
            return newRow;
        };
        /**
         *
         */
        Filters.prototype.getMultipleRowValues = function (response) {
            response = JSON.parse(response);
            if (this.first == "") {
                this.first = "true";
            }
            var conditions = this.first;
            var data = new Array();
            var evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";
            for (var key in response) {
                var row = response[key];
                eval(evalValue);
            }
            if (this.sort.length > 0) {
                var i = 0;
                for (var key in this.sort) {
                    eval(this.sort[key]);
                    i++;
                }
            }
            if (this.limit != null) {
                eval(this.limit);
            }
            return data;
        };
        Filters.prototype.getOneRowValue = function (data) {
        };
        return Filters;
    }());
    Criteria.Filters = Filters;
})(Criteria || (Criteria = {}));
var UnitOfWork;
(function (UnitOfWork_1) {
    var UnitOfWork = (function () {
        function UnitOfWork() {
        }
        return UnitOfWork;
    }());
    UnitOfWork.NEW = 1;
    UnitOfWork.CREATED = 2;
    UnitOfWork.DELETED = 3;
    UnitOfWork_1.UnitOfWork = UnitOfWork;
})(UnitOfWork || (UnitOfWork = {}));
var Reflection;
(function (Reflection_1) {
    var Reflection = (function () {
        function Reflection(classToReflect) {
            this.methods = new Array();
            this.attributes = new Array();
            this.classToReflect = classToReflect;
            console.log(this.read(this.classToReflect));
        }
        Reflection.prototype.read = function (obj) {
            if (typeof obj !== 'object') {
                console.log('Not an object');
                return;
            }
            var output = '';
            for (var i in obj) {
                var propName = i;
                var propValue = obj[i];
                var type = (typeof propValue);
                switch (type) {
                    case 'function':
                        output += ' [method] ' + propName + '\n\n';
                        break;
                    case 'object':
                        output += '\t[object] ' + propName + ' ' + this.read(propValue) + '\n\n';
                        break;
                    default:
                        output += ' [property] ' + propName + ' ' + propValue + '\n\n';
                        break;
                }
            }
            return output;
        };
        return Reflection;
    }());
    Reflection_1.Reflection = Reflection;
})(Reflection || (Reflection = {}));
/// <reference path="./UnitOfWork" />
/// <reference path="../Reflection/Reflection" />
var Hydrator;
/// <reference path="./UnitOfWork" />
/// <reference path="../Reflection/Reflection" />
(function (Hydrator_1) {
    var Hydrator = (function () {
        function Hydrator() {
        }
        Hydrator.prototype.hydrate = function (model, data) {
            var newModel = new model();
            newModel.state = UnitOfWork.UnitOfWork.CREATED;
            for (var key in data) {
                switch (typeof newModel[key]) {
                    case "function":
                        var auxPropNested = new newModel[key];
                        if (auxPropNested instanceof Data.RawModel) {
                            newModel[key] = this.hydrate(newModel[key], data[key]);
                        }
                        else {
                            newModel[key] = data[key];
                        }
                        break;
                    default:
                        newModel[key] = data[key];
                        break;
                }
            }
            return newModel;
        };
        return Hydrator;
    }());
    Hydrator_1.Hydrator = Hydrator;
})(Hydrator || (Hydrator = {}));
var Network;
(function (Network) {
    var Ajax = (function () {
        /**
         *
         */
        function Ajax() {
            this.method = "GET";
            this.parameters = "";
            this.container = [];
            this.responseFn = function () { };
            this.bfSendFn = function () { }.bind(this);
            this.httpRequest = new XMLHttpRequest();
        }
        /**
         *
         */
        Ajax.prototype.setUrl = function (url) {
            this.url = url;
            return this;
        };
        /**
         *
         */
        Ajax.prototype.getUrl = function () {
            return this.url;
        };
        /**
         *
         */
        Ajax.prototype.setContainer = function (key, value) {
            this.container[key] = value;
        };
        /**
         *
         */
        Ajax.prototype.getContainer = function (key) {
            return this.container[key];
        };
        /**
         *
         */
        Ajax.prototype.setParams = function (params, value) {
            if (value === void 0) { value = false; }
            if (typeof params == "object") {
                var i = 0;
                for (var key in params) {
                    var ampersand = "";
                    if (i < Object.keys(params).length) {
                        ampersand = "&";
                    }
                    this.parameters += key + "=" + encodeURIComponent(params[key]) + ampersand;
                    i++;
                }
            }
            else if (value) {
                this.parameters = params + "=" + encodeURIComponent(value);
            }
            return this;
        };
        /**
         *
         */
        Ajax.prototype.post = function () {
            this.setMethod("POST");
            return this;
        };
        /**
         *
         */
        Ajax.prototype.get = function () {
            this.setMethod("GET");
            return this;
        };
        /**
         *
         */
        Ajax.prototype.setMethod = function (method) {
            this.method = method;
            return this;
        };
        /**
         *
         */
        Ajax.prototype.response = function (responseFunction) {
            this.responseFn = responseFunction;
            try {
                this.bfSendFn();
                this.httpRequest.onreadystatechange = function () {
                    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (this.httpRequest.status === 200) {
                            if (typeof this.httpRequest.response != "undefined") {
                                if (typeof this.responseFn != "undefined") {
                                    this.responseFn(this.httpRequest.response);
                                }
                            }
                        }
                        else {
                            this.error = "ajax status" + this.httpRequest.status + " " + this.httpRequest.statusText;
                        }
                    }
                }.bind(this);
            }
            catch (e) {
                console.log("Network.AJax.Exception", e);
            }
            return this;
        };
        /**
         *
         */
        Ajax.prototype.beforeSend = function (fn) {
            this.bfSendFn = fn;
        };
        /**
         *
         */
        Ajax.prototype.setHeaders = function () {
            this.httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        };
        /**
         *
         */
        Ajax.prototype.getError = function (errorFunction) {
            errorFunction(this.error);
        };
        Ajax.prototype.clear = function () {
            this.method = "GET";
            this.parameters = "";
            this.error = null;
            this.url = "";
            this.bfSendFn = function () { };
            this.responseFn = function () { };
            this.container = [];
        };
        /**
         *
         */
        Ajax.prototype.send = function (fn) {
            if (fn === void 0) { fn = false; }
            if (typeof fn == "function") {
                this.response(fn.bind(this));
            }
            this.httpRequest.open(this.method, this.url);
            this.setHeaders();
            this.httpRequest.send(this.parameters);
        };
        return Ajax;
    }());
    Network.Ajax = Ajax;
})(Network || (Network = {}));
/// <reference path="./UnitOfWork" />
/// <reference path="../Network/Network" />
/// <reference path="../Data/Data" />
/// <reference path="./Criteria" />
/// <reference path="./Hydrator" />
var Em;
/// <reference path="./UnitOfWork" />
/// <reference path="../Network/Network" />
/// <reference path="../Data/Data" />
/// <reference path="./Criteria" />
/// <reference path="./Hydrator" />
(function (Em) {
    var EntityManager = (function () {
        function EntityManager() {
            this.container = null;
            this.ajax = null;
            this.hydrator = null;
            this.fnResponse = new Array;
            this.uow = new UnitOfWork.UnitOfWork;
        }
        /**
         *
         */
        EntityManager.prototype.getContainer = function () {
            if (this.container == null) {
                this.container = this.getDi().get("container");
            }
            return this.container;
        };
        /**
         *
         */
        EntityManager.prototype.find = function (model, params) {
            if (params === void 0) { params = {}; }
            this.ajax = new Network.Ajax();
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionParams", params);
            this.ajax.setContainer("transactionType", "find");
            var objModel = new model();
            this.ajax.setUrl(objModel.getFindUrl());
            this.ajax.setParams(objModel.getParams());
            this.ajax.setMethod(objModel.getMethod());
            return this;
        };
        /**
         *
         */
        EntityManager.prototype.findOne = function (model, params) {
            if (params === void 0) { params = {}; }
            this.ajax = new Network.Ajax();
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionParams", params);
            this.ajax.setContainer("transactionType", "findOne");
            var objModel = new model();
            this.ajax.setUrl(objModel.getFindUrl());
            this.ajax.setParams(objModel.getParams());
            this.ajax.setMethod(objModel.getMethod());
            return this;
        };
        EntityManager.prototype.getResultSet = function (response, params, model) {
            var resultSet = new Array();
            var hydrator = new Hydrator.Hydrator;
            var filters = new Criteria.Filters;
            filters.buildCondition(params);
            var data = filters.getMultipleRowValues(response);
            for (var key in data) {
                var newModel = hydrator.hydrate(model, data[key]);
                resultSet.push(newModel);
            }
            if (resultSet.length == 0) {
                resultSet = false;
            }
            return resultSet;
        };
        /**
         *
         */
        EntityManager.prototype.save = function (model) {
            this.ajax = new Network.Ajax();
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionObjectModel", model);
            this.ajax.setContainer("transactionType", "save");
            switch (model.state) {
                case UnitOfWork.UnitOfWork.NEW:
                    this.ajax.setUrl(model.getInsertUrl());
                    break;
                case UnitOfWork.UnitOfWork.CREATED:
                    this.ajax.setUrl(model.getUpdateUrl());
                    break;
            }
            this.ajax.setParams(model.getParams());
            this.ajax.setMethod(model.getMethod());
            return this;
        };
        /**
         *
         */
        EntityManager.prototype.delete = function () {
            return false;
        };
        /**
         *
         */
        EntityManager.prototype.response = function (fn) {
            var model = this.getContainer()
                .get("transactionModel");
            var type = this.ajax.getContainer("transactionType");
            if (type == "find" || type == "findOne") {
                var params = this.getContainer()
                    .get("transactionParams");
            }
            this.ajax.response(function (response) {
                var resultSet = new Array();
                switch (type) {
                    case "findOne":
                        resultSet = this.getResultSet(response, params, model);
                        if (resultSet != false) {
                            resultSet = resultSet[0];
                        }
                        break;
                    case "find":
                        resultSet = this.getResultSet(response, params, model);
                        break;
                    case "save":
                        resultSet = response;
                        break;
                }
                fn(resultSet).bind(this);
            }.bind(this));
            this.ajax.send();
            return this;
        };
        /**
         *
         */
        EntityManager.prototype.flush = function () {
            return false;
        };
        /**
         *
         */
        EntityManager.prototype.reset = function () {
            return false;
        };
        /**
         *
         */
        EntityManager.prototype.group = function () {
            return {};
        };
        /**
         *
         */
        EntityManager.prototype.distinct = function () {
            return {};
        };
        /**
         *
         */
        EntityManager.prototype.count = function () {
            return 0;
        };
        /**
         *
         */
        EntityManager.prototype.purge = function () {
            return false;
        };
        /**
         *
         */
        EntityManager.prototype.forget = function () {
            return false;
        };
        EntityManager.prototype.checksum = function (obj) {
            var keys = Object.keys(obj).sort();
            var output = [], prop;
            for (var i = 0; i < keys.length; i++) {
                prop = keys[i];
                output.push(prop);
                output.push(obj[prop]);
            }
            return JSON.stringify(output);
        };
        EntityManager.prototype.setDi = function (di) {
            this.di = di;
        };
        EntityManager.prototype.getDi = function () {
            return this.di;
        };
        return EntityManager;
    }());
    Em.EntityManager = EntityManager;
})(Em || (Em = {}));
/// <reference path="../Persistence/Criteria" />
/// <reference path="../Persistence/Hydrator" />
/// <reference path="../Network/Network" />
/// <reference path="../Persistence/Em" />
/// <reference path="../Errors/Errors" />
var Service;
/// <reference path="../Persistence/Criteria" />
/// <reference path="../Persistence/Hydrator" />
/// <reference path="../Network/Network" />
/// <reference path="../Persistence/Em" />
/// <reference path="../Errors/Errors" />
(function (Service) {
    var Container = (function () {
        function Container() {
            this.service = [];
            this.persistent = "Gravity.Persistent.Session" + Helper.MathHelper.getUUID();
        }
        Container.prototype.set = function (serviceName, content) {
            this.service[serviceName] = content;
        };
        Container.prototype.get = function (serviceName) {
            return this.service[serviceName];
        };
        Container.prototype.setPersistent = function (serviceName, content) {
            sessionStorage[this.persistent][serviceName][content];
        };
        Container.prototype.getPersistent = function (serviceName) {
            return sessionStorage[this.persistent][serviceName];
        };
        return Container;
    }());
    Service.Container = Container;
    var FactoryDefault = (function (_super) {
        __extends(FactoryDefault, _super);
        function FactoryDefault() {
            var _this = _super.call(this) || this;
            _this.set("ajax", new Network.Ajax);
            _this.set("container", new Service.Container);
            var em = new Em.EntityManager;
            em.setDi(_this);
            _this.set("em", em);
            return _this;
        }
        return FactoryDefault;
    }(Service.Container));
    Service.FactoryDefault = FactoryDefault;
})(Service || (Service = {}));
///<reference path="../Service/Service" />
var Logic;
///<reference path="../Service/Service" />
(function (Logic) {
    var Controller = (function () {
        function Controller() {
        }
        Controller.prototype.initialize = function () {
        };
        Controller.prototype.onConstruct = function () {
        };
        Controller.prototype.setDi = function (di) {
            this.di = di;
        };
        Controller.prototype.getDi = function () {
            return this.di;
        };
        return Controller;
    }());
    Logic.Controller = Controller;
})(Logic || (Logic = {}));
/// <reference path="../Helper/Helper" />
/// <reference path="../Network/Network" />
/**
 * [Html description]
 * @type {[type]}
 */
var Html;
/// <reference path="../Helper/Helper" />
/// <reference path="../Network/Network" />
/**
 * [Html description]
 * @type {[type]}
 */
(function (Html) {
    /**
     * [Html description]
     * @type {[type]}
     */
    var HtmlElement = (function () {
        /**
         *
         * @param  {string} name [description]
         * @return {[type]}      [description]
         */
        function HtmlElement(name, newClone) {
            if (name === void 0) { name = ""; }
            if (newClone === void 0) { newClone = false; }
            /**
             *
             */
            this.deny = ["Table", "Td", "Div", "Thead", "Tbody", "Tfoot", "Tr", "Td", "Th", "Label", "Span", "I", "A"];
            /**
             * [url description]
             * @type {String}
             */
            this.url = "";
            if (typeof name.nodeName != "undefined") {
                this.id = name.getAttribute("id");
                this.element = this.init(name.nodeName, this.id);
            }
            else {
                this.id = name;
                this.element = this.init(this.getClassName(), name);
            }
            return this;
        }
        /**
         *
         */
        HtmlElement.prototype.create = function (tag) {
            this.element = this.init(tag, this.id);
            return this;
        };
        /**
         * Create html component like jquery object
         *
         * @param  {string} element [description]
         * @param  {string} name    [description]
         * @return HTMLElement
         */
        HtmlElement.prototype.init = function (element, name) {
            this.className = element;
            var docElement = document.createElement(element);
            if (element === "Button") {
                docElement.setAttribute("type", "button");
            }
            if (name !== "") {
                if (Helper.ArrayHelper.inArray(this.deny, element)) {
                    docElement.setAttribute("name", name);
                }
                docElement.setAttribute("id", name);
            }
            return docElement;
        };
        /**
         *
         * @return
         */
        HtmlElement.prototype.getType = function () {
            return this.className;
        };
        /**
         *
         * @param  {string} class [description]
         * @return {[type]}       [description]
         */
        HtmlElement.prototype.class = function (attrClass) {
            this.element.setAttribute("class", attrClass);
            return this;
        };
        /**
         *
         */
        HtmlElement.prototype.addClass = function (attrClass) {
            var strClass = this.element.getAttribute("class");
            strClass += " " + attrClass;
            this.element.setAttribute("class", strClass);
            return this;
        };
        /**
         *
         */
        HtmlElement.prototype.getAttribute = function (attr) {
            return this.element.getAttribute(attr);
        };
        /**
         *
         * @return {[type]} [description]
         */
        HtmlElement.prototype.addChild = function (element) {
            this.element.append(element);
            return this;
        };
        /**
         * [click description]
         * @param  {Function} fn [description]
         * @return {[type]}      [description]
         */
        HtmlElement.prototype.click = function (fn) {
            this.element.addEventListener("click", fn);
            return this;
        };
        HtmlElement.prototype.doubleClick = function (fn) {
            this.element.addEventListener("dblclick", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.change = function (fn) {
            this.element.addEventListener("change", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.keypress = function (fn) {
            this.element.addEventListener("keypress", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.keydown = function (fn) {
            this.element.addEventListener("keydown", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.keyup = function (fn) {
            this.element.addEventListener("keyup", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.blur = function (fn) {
            this.element.addEventListener("blur", fn);
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.focus = function (fn) {
            this.element.addEventListener("focus", fn);
            return this;
        };
        HtmlElement.prototype.destroyEvent = function (event) {
            var nameEvent = "on" + event;
            this.element.removeEventListener("click", this.element.nameEvent);
        };
        /**
         * [get description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.getElement = function () {
            return this.element;
        };
        /**
         * Append elements
         * @param value append
         * @return this
         */
        HtmlElement.prototype.append = function (append) {
            if (Array.isArray(append)) {
                for (var key in append) {
                    this.element.appendChild(append[key]);
                }
            }
            else {
                if (typeof append != "object") {
                    this.element.appendChild(append);
                }
                else {
                    this.element.appendChild(append);
                }
            }
            return this;
        };
        /**
         * [html description]
         * @param  {[type]} html [description]
         * @return {[type]}      [description]
         */
        HtmlElement.prototype.html = function (html) {
            if (html === void 0) { html = null; }
            if (html) {
                this.element.innerHtml = html;
                return this;
            }
            else {
                return this.element.innerHtml;
            }
        };
        /**
         *
         */
        HtmlElement.prototype.getHtml = function () {
            return this.element.innerHtml;
        };
        /**
         *
         * @param attr
         * @return
         */
        HtmlElement.prototype.attr = function (attr, value) {
            if (value === void 0) { value = false; }
            if (typeof attr == "object") {
                for (var key in attr) {
                    this.element.setAttribute(key, attr[key]);
                }
            }
            else if (typeof attr == "string" && value != false) {
                this.element.setAttribute(attr, value);
            }
            return this;
        };
        /**
         *
         */
        HtmlElement.prototype.getAttr = function (attr) {
            return this.attr(attr);
        };
        /**
         * [css description]
         * @param  {[type]} css [description]
         * @return {[type]}     [description]
         */
        HtmlElement.prototype.css = function (css, value) {
            if (value === void 0) { value = false; }
            if (typeof css == "object") {
                for (var key in css) {
                    this.element.style.key = css[key];
                }
            }
            else if (typeof css == "string" && value != false) {
                this.element.style.css = value;
            }
            return this;
        };
        /**
         *
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        HtmlElement.prototype.unbind = function (event) {
            this.element.destroyEvent(event);
            return this;
        };
        /**
         * [getClassName description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        /**
         * [validateAndSet description]
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        HtmlElement.prototype.validateAndSet = function (config) {
            try {
                if (typeof config.name === "undefined") {
                    throw "The identify is required";
                }
                else if (typeof config.element === "undefined") {
                    throw "The type element is required";
                }
                else if (typeof config.event !== "undefined") {
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        /**
         * [clone description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.clone = function (newIdentify) {
            if (newIdentify === void 0) { newIdentify = ""; }
            var newElement = this.element.clone();
            return new HtmlElement(newIdentify, newElement[0]);
        };
        /**
         * [ajax description]
         * @return {[type]} [description]
         */
        HtmlElement.prototype.ajax = function (config) {
            var ajax = new Network.Ajax();
            ajax.setUrl(config.url);
            ajax.beforeSend(config.beforeSend);
            ajax.setMethod(config.type);
            ajax.setParams(config.data);
            ajax.send(config.success);
            return this;
        };
        /**
         * zzzz
         * @param  {any = null}        val [description]
         * @return {[type]}   [description]
         */
        HtmlElement.prototype.val = function (val) {
            if (val === void 0) { val = null; }
            if (val) {
                this.element.value = val;
                return this;
            }
            else {
                return this.element.value;
            }
        };
        /**
         * zzzz
         * @param  {any = null}        text [description]
         * @return {[type]}   [description]
         */
        HtmlElement.prototype.text = function (text) {
            if (text === void 0) { text = null; }
            if (text) {
                this.element.innerHtml = text;
                return this;
            }
            else {
                return this.element.value;
            }
        };
        HtmlElement.prototype.empty = function () {
            this.element.innerHtml = "";
        };
        return HtmlElement;
    }());
    Html.HtmlElement = HtmlElement;
    /**
     *
     */
    var A = (function (_super) {
        __extends(A, _super);
        function A() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        A.prototype.favIcon = function (favIcon) {
            var icon = new Html.I("favIcon" + this.id)
                .class(favIcon);
            this.append(icon.getElement());
            return this;
        };
        /**
         * [href description]
         * @param  {[type]} href [description]
         * @return {[type]}      [description]
         */
        A.prototype.href = function (href) {
            this.attr("href", href);
            return this;
        };
        return A;
    }(HtmlElement));
    Html.A = A;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Abbr = (function (_super) {
        __extends(Abbr, _super);
        function Abbr() {
            return _super.apply(this, arguments) || this;
        }
        return Abbr;
    }(HtmlElement));
    Html.Abbr = Abbr;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Address = (function (_super) {
        __extends(Address, _super);
        function Address() {
            return _super.apply(this, arguments) || this;
        }
        return Address;
    }(HtmlElement));
    Html.Address = Address;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Area = (function (_super) {
        __extends(Area, _super);
        function Area() {
            return _super.apply(this, arguments) || this;
        }
        return Area;
    }(HtmlElement));
    Html.Area = Area;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Article = (function (_super) {
        __extends(Article, _super);
        function Article() {
            return _super.apply(this, arguments) || this;
        }
        return Article;
    }(HtmlElement));
    Html.Article = Article;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Aside = (function (_super) {
        __extends(Aside, _super);
        function Aside() {
            return _super.apply(this, arguments) || this;
        }
        return Aside;
    }(HtmlElement));
    Html.Aside = Aside;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Audio = (function (_super) {
        __extends(Audio, _super);
        function Audio() {
            return _super.apply(this, arguments) || this;
        }
        return Audio;
    }(HtmlElement));
    Html.Audio = Audio;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var B = (function (_super) {
        __extends(B, _super);
        function B() {
            return _super.apply(this, arguments) || this;
        }
        return B;
    }(HtmlElement));
    Html.B = B;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            return _super.apply(this, arguments) || this;
        }
        return Base;
    }(HtmlElement));
    Html.Base = Base;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Bdi = (function (_super) {
        __extends(Bdi, _super);
        function Bdi() {
            return _super.apply(this, arguments) || this;
        }
        return Bdi;
    }(HtmlElement));
    Html.Bdi = Bdi;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Bdo = (function (_super) {
        __extends(Bdo, _super);
        function Bdo() {
            return _super.apply(this, arguments) || this;
        }
        return Bdo;
    }(HtmlElement));
    Html.Bdo = Bdo;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Blockquote = (function (_super) {
        __extends(Blockquote, _super);
        function Blockquote() {
            return _super.apply(this, arguments) || this;
        }
        return Blockquote;
    }(HtmlElement));
    Html.Blockquote = Blockquote;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            return _super.apply(this, arguments) || this;
        }
        return Body;
    }(HtmlElement));
    Html.Body = Body;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Br = (function (_super) {
        __extends(Br, _super);
        function Br() {
            return _super.apply(this, arguments) || this;
        }
        return Br;
    }(HtmlElement));
    Html.Br = Br;
    /**
     *
     */
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        Button.prototype.type = function (type) {
            this.attr("type", type);
            return this;
        };
        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        Button.prototype.favIcon = function (favIcon) {
            var icon = new Html.I("favIcon" + this.id)
                .class(favIcon);
            this.append(icon.getElement());
            return this;
        };
        /**
         * [succes description]
         * @return {[type]} [description]
         */
        Button.prototype.success = function () {
            this.element.addClass("btn btn-success");
            return this;
        };
        /**
         * [notice description]
         * @return {[type]} [description]
         */
        Button.prototype.notice = function () {
            this.element.addClass("btn btn-notice");
            return this;
        };
        /**
         * [warning description]
         * @return {[type]} [description]
         */
        Button.prototype.warning = function () {
            this.element.addClass("btn btn-warning");
            return this;
        };
        /**
         * [danger description]
         * @return {[type]} [description]
         */
        Button.prototype.danger = function () {
            this.element.addClass("btn btn-danger");
            return this;
        };
        return Button;
    }(HtmlElement));
    Html.Button = Button;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Canvas = (function (_super) {
        __extends(Canvas, _super);
        function Canvas() {
            return _super.apply(this, arguments) || this;
        }
        return Canvas;
    }(HtmlElement));
    Html.Canvas = Canvas;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Caption = (function (_super) {
        __extends(Caption, _super);
        function Caption() {
            return _super.apply(this, arguments) || this;
        }
        return Caption;
    }(HtmlElement));
    Html.Caption = Caption;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Cite = (function (_super) {
        __extends(Cite, _super);
        function Cite() {
            return _super.apply(this, arguments) || this;
        }
        return Cite;
    }(HtmlElement));
    Html.Cite = Cite;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Code = (function (_super) {
        __extends(Code, _super);
        function Code() {
            return _super.apply(this, arguments) || this;
        }
        return Code;
    }(HtmlElement));
    Html.Code = Code;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Col = (function (_super) {
        __extends(Col, _super);
        function Col() {
            return _super.apply(this, arguments) || this;
        }
        return Col;
    }(HtmlElement));
    Html.Col = Col;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var ColGroup = (function (_super) {
        __extends(ColGroup, _super);
        function ColGroup() {
            return _super.apply(this, arguments) || this;
        }
        return ColGroup;
    }(HtmlElement));
    Html.ColGroup = ColGroup;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Datalist = (function (_super) {
        __extends(Datalist, _super);
        function Datalist() {
            return _super.apply(this, arguments) || this;
        }
        return Datalist;
    }(HtmlElement));
    Html.Datalist = Datalist;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Dd = (function (_super) {
        __extends(Dd, _super);
        function Dd() {
            return _super.apply(this, arguments) || this;
        }
        return Dd;
    }(HtmlElement));
    Html.Dd = Dd;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Del = (function (_super) {
        __extends(Del, _super);
        function Del() {
            return _super.apply(this, arguments) || this;
        }
        return Del;
    }(HtmlElement));
    Html.Del = Del;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Details = (function (_super) {
        __extends(Details, _super);
        function Details() {
            return _super.apply(this, arguments) || this;
        }
        return Details;
    }(HtmlElement));
    Html.Details = Details;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Dfn = (function (_super) {
        __extends(Dfn, _super);
        function Dfn() {
            return _super.apply(this, arguments) || this;
        }
        return Dfn;
    }(HtmlElement));
    Html.Dfn = Dfn;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog() {
            return _super.apply(this, arguments) || this;
        }
        return Dialog;
    }(HtmlElement));
    Html.Dialog = Dialog;
    /**
     *
     */
    var Div = (function (_super) {
        __extends(Div, _super);
        function Div() {
            return _super.apply(this, arguments) || this;
        }
        return Div;
    }(HtmlElement));
    Html.Div = Div;
    /**
     *
     */
    var Dl = (function (_super) {
        __extends(Dl, _super);
        function Dl() {
            return _super.apply(this, arguments) || this;
        }
        return Dl;
    }(HtmlElement));
    Html.Dl = Dl;
    /**
     *
     */
    var Dt = (function (_super) {
        __extends(Dt, _super);
        function Dt() {
            return _super.apply(this, arguments) || this;
        }
        return Dt;
    }(HtmlElement));
    Html.Dt = Dt;
    /**
     *
     */
    var Em = (function (_super) {
        __extends(Em, _super);
        function Em() {
            return _super.apply(this, arguments) || this;
        }
        return Em;
    }(HtmlElement));
    Html.Em = Em;
    /**
     *
     */
    var Embed = (function (_super) {
        __extends(Embed, _super);
        function Embed() {
            return _super.apply(this, arguments) || this;
        }
        return Embed;
    }(HtmlElement));
    Html.Embed = Embed;
    /**
     *
     */
    var Fieldset = (function (_super) {
        __extends(Fieldset, _super);
        function Fieldset() {
            return _super.apply(this, arguments) || this;
        }
        return Fieldset;
    }(HtmlElement));
    Html.Fieldset = Fieldset;
    /**
     *
     */
    var Figcaption = (function (_super) {
        __extends(Figcaption, _super);
        function Figcaption() {
            return _super.apply(this, arguments) || this;
        }
        return Figcaption;
    }(HtmlElement));
    Html.Figcaption = Figcaption;
    /**
     *
     */
    var Figure = (function (_super) {
        __extends(Figure, _super);
        function Figure() {
            return _super.apply(this, arguments) || this;
        }
        return Figure;
    }(HtmlElement));
    Html.Figure = Figure;
    /**
     *
     */
    var Footer = (function (_super) {
        __extends(Footer, _super);
        function Footer() {
            return _super.apply(this, arguments) || this;
        }
        return Footer;
    }(HtmlElement));
    Html.Footer = Footer;
    /**
     *
     */
    var Form = (function (_super) {
        __extends(Form, _super);
        function Form() {
            return _super.apply(this, arguments) || this;
        }
        return Form;
    }(HtmlElement));
    Html.Form = Form;
    /**
     *
     */
    var H1 = (function (_super) {
        __extends(H1, _super);
        function H1() {
            return _super.apply(this, arguments) || this;
        }
        return H1;
    }(HtmlElement));
    Html.H1 = H1;
    /**
     *
     */
    var H2 = (function (_super) {
        __extends(H2, _super);
        function H2() {
            return _super.apply(this, arguments) || this;
        }
        return H2;
    }(HtmlElement));
    Html.H2 = H2;
    /**
     *
     */
    var H3 = (function (_super) {
        __extends(H3, _super);
        function H3() {
            return _super.apply(this, arguments) || this;
        }
        return H3;
    }(HtmlElement));
    Html.H3 = H3;
    /**
     *
     */
    var H4 = (function (_super) {
        __extends(H4, _super);
        function H4() {
            return _super.apply(this, arguments) || this;
        }
        return H4;
    }(HtmlElement));
    Html.H4 = H4;
    /**
     *
     */
    var H5 = (function (_super) {
        __extends(H5, _super);
        function H5() {
            return _super.apply(this, arguments) || this;
        }
        return H5;
    }(HtmlElement));
    Html.H5 = H5;
    /**
     *
     */
    var H6 = (function (_super) {
        __extends(H6, _super);
        function H6() {
            return _super.apply(this, arguments) || this;
        }
        return H6;
    }(HtmlElement));
    Html.H6 = H6;
    /**
     *
     */
    var Head = (function (_super) {
        __extends(Head, _super);
        function Head() {
            return _super.apply(this, arguments) || this;
        }
        return Head;
    }(HtmlElement));
    Html.Head = Head;
    /**
     *
     */
    var Header = (function (_super) {
        __extends(Header, _super);
        function Header() {
            return _super.apply(this, arguments) || this;
        }
        return Header;
    }(HtmlElement));
    Html.Header = Header;
    /**
     *Ttpt
    export class Html extends HtmlElement
    {
    }
    */
    /**
     *
     */
    var I = (function (_super) {
        __extends(I, _super);
        function I() {
            return _super.apply(this, arguments) || this;
        }
        return I;
    }(HtmlElement));
    Html.I = I;
    /**
     *
     */
    var Iframe = (function (_super) {
        __extends(Iframe, _super);
        function Iframe() {
            return _super.apply(this, arguments) || this;
        }
        return Iframe;
    }(HtmlElement));
    Html.Iframe = Iframe;
    var Img = (function (_super) {
        __extends(Img, _super);
        function Img() {
            return _super.apply(this, arguments) || this;
        }
        Img.prototype.src = function (src) {
            this.attr("src", src);
            return this;
        };
        return Img;
    }(HtmlElement));
    Html.Img = Img;
    /**
     * [Input description]
     * @type {[type]}
     */
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        Input.prototype.type = function (type) {
            this.attr("type", type);
            return this;
        };
        /**
         * [value description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        Input.prototype.val = function (value) {
            if (value === void 0) { value = null; }
            if (value === null) {
                return this.val();
            }
            this.getElement().val(value);
            return this;
        };
        return Input;
    }(HtmlElement));
    Html.Input = Input;
    /**
     *
     */
    var Ins = (function (_super) {
        __extends(Ins, _super);
        function Ins() {
            return _super.apply(this, arguments) || this;
        }
        return Ins;
    }(HtmlElement));
    Html.Ins = Ins;
    /**
     *
     */
    var Kbd = (function (_super) {
        __extends(Kbd, _super);
        function Kbd() {
            return _super.apply(this, arguments) || this;
        }
        return Kbd;
    }(HtmlElement));
    Html.Kbd = Kbd;
    /**
     *
     */
    var Keygen = (function (_super) {
        __extends(Keygen, _super);
        function Keygen() {
            return _super.apply(this, arguments) || this;
        }
        return Keygen;
    }(HtmlElement));
    Html.Keygen = Keygen;
    /**
     *
     */
    var Label = (function (_super) {
        __extends(Label, _super);
        function Label() {
            return _super.apply(this, arguments) || this;
        }
        return Label;
    }(HtmlElement));
    Html.Label = Label;
    /**
     *
     */
    var Leyend = (function (_super) {
        __extends(Leyend, _super);
        function Leyend() {
            return _super.apply(this, arguments) || this;
        }
        return Leyend;
    }(HtmlElement));
    Html.Leyend = Leyend;
    /**
     *
     */
    var Li = (function (_super) {
        __extends(Li, _super);
        function Li() {
            return _super.apply(this, arguments) || this;
        }
        return Li;
    }(HtmlElement));
    Html.Li = Li;
    /**
     *
     */
    var Link = (function (_super) {
        __extends(Link, _super);
        function Link() {
            return _super.apply(this, arguments) || this;
        }
        return Link;
    }(HtmlElement));
    Html.Link = Link;
    /**
     *
     */
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super.apply(this, arguments) || this;
        }
        return Main;
    }(HtmlElement));
    Html.Main = Main;
    /**
     *
     */
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map() {
            return _super.apply(this, arguments) || this;
        }
        return Map;
    }(HtmlElement));
    Html.Map = Map;
    /**
     *
     */
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super.apply(this, arguments) || this;
        }
        return Menu;
    }(HtmlElement));
    Html.Menu = Menu;
    /**
     *
     */
    var MenuItem = (function (_super) {
        __extends(MenuItem, _super);
        function MenuItem() {
            return _super.apply(this, arguments) || this;
        }
        return MenuItem;
    }(HtmlElement));
    Html.MenuItem = MenuItem;
    /**
     *
     */
    var Meta = (function (_super) {
        __extends(Meta, _super);
        function Meta() {
            return _super.apply(this, arguments) || this;
        }
        return Meta;
    }(HtmlElement));
    Html.Meta = Meta;
    /**
     *
     */
    var Meter = (function (_super) {
        __extends(Meter, _super);
        function Meter() {
            return _super.apply(this, arguments) || this;
        }
        return Meter;
    }(HtmlElement));
    Html.Meter = Meter;
    /**
     *
     */
    var Nav = (function (_super) {
        __extends(Nav, _super);
        function Nav() {
            return _super.apply(this, arguments) || this;
        }
        return Nav;
    }(HtmlElement));
    Html.Nav = Nav;
    /**
     *
     */
    var Noscrip = (function (_super) {
        __extends(Noscrip, _super);
        function Noscrip() {
            return _super.apply(this, arguments) || this;
        }
        return Noscrip;
    }(HtmlElement));
    Html.Noscrip = Noscrip;
    /**
     *
     */
    var Object = (function (_super) {
        __extends(Object, _super);
        function Object() {
            return _super.apply(this, arguments) || this;
        }
        return Object;
    }(HtmlElement));
    Html.Object = Object;
    /**
     *
     */
    var Ol = (function (_super) {
        __extends(Ol, _super);
        function Ol() {
            return _super.apply(this, arguments) || this;
        }
        return Ol;
    }(HtmlElement));
    Html.Ol = Ol;
    /**
     *
     */
    var Optgroup = (function (_super) {
        __extends(Optgroup, _super);
        function Optgroup() {
            return _super.apply(this, arguments) || this;
        }
        return Optgroup;
    }(HtmlElement));
    Html.Optgroup = Optgroup;
    /**
     *
     */
    var Option = (function (_super) {
        __extends(Option, _super);
        function Option() {
            return _super.apply(this, arguments) || this;
        }
        return Option;
    }(HtmlElement));
    Html.Option = Option;
    /**
     *
     */
    var Output = (function (_super) {
        __extends(Output, _super);
        function Output() {
            return _super.apply(this, arguments) || this;
        }
        return Output;
    }(HtmlElement));
    Html.Output = Output;
    /**
     *
     */
    var P = (function (_super) {
        __extends(P, _super);
        function P() {
            return _super.apply(this, arguments) || this;
        }
        return P;
    }(HtmlElement));
    Html.P = P;
    /**
     *
     */
    var Param = (function (_super) {
        __extends(Param, _super);
        function Param() {
            return _super.apply(this, arguments) || this;
        }
        return Param;
    }(HtmlElement));
    Html.Param = Param;
    /**
     *
     */
    var Pre = (function (_super) {
        __extends(Pre, _super);
        function Pre() {
            return _super.apply(this, arguments) || this;
        }
        return Pre;
    }(HtmlElement));
    Html.Pre = Pre;
    /**
     *
     */
    var Progress = (function (_super) {
        __extends(Progress, _super);
        function Progress() {
            return _super.apply(this, arguments) || this;
        }
        return Progress;
    }(HtmlElement));
    Html.Progress = Progress;
    /**
     *
     */
    var Q = (function (_super) {
        __extends(Q, _super);
        function Q() {
            return _super.apply(this, arguments) || this;
        }
        return Q;
    }(HtmlElement));
    Html.Q = Q;
    /**
     *
     */
    var Rp = (function (_super) {
        __extends(Rp, _super);
        function Rp() {
            return _super.apply(this, arguments) || this;
        }
        return Rp;
    }(HtmlElement));
    Html.Rp = Rp;
    /**
     *
     */
    var Rt = (function (_super) {
        __extends(Rt, _super);
        function Rt() {
            return _super.apply(this, arguments) || this;
        }
        return Rt;
    }(HtmlElement));
    Html.Rt = Rt;
    /**
     *
     */
    var Ruby = (function (_super) {
        __extends(Ruby, _super);
        function Ruby() {
            return _super.apply(this, arguments) || this;
        }
        return Ruby;
    }(HtmlElement));
    Html.Ruby = Ruby;
    /**
     *
     */
    var S = (function (_super) {
        __extends(S, _super);
        function S() {
            return _super.apply(this, arguments) || this;
        }
        return S;
    }(HtmlElement));
    Html.S = S;
    /**
     *
     */
    var Samp = (function (_super) {
        __extends(Samp, _super);
        function Samp() {
            return _super.apply(this, arguments) || this;
        }
        return Samp;
    }(HtmlElement));
    Html.Samp = Samp;
    /**
     *
     */
    var Script = (function (_super) {
        __extends(Script, _super);
        function Script() {
            return _super.apply(this, arguments) || this;
        }
        return Script;
    }(HtmlElement));
    Html.Script = Script;
    /**
     *
     */
    var Section = (function (_super) {
        __extends(Section, _super);
        function Section() {
            return _super.apply(this, arguments) || this;
        }
        return Section;
    }(HtmlElement));
    Html.Section = Section;
    var Select = (function (_super) {
        __extends(Select, _super);
        function Select() {
            return _super.apply(this, arguments) || this;
        }
        Select.prototype.getSelected = function () {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].getAttribute("selected") !== null) {
                    return new Html.HtmlElement(childs[key]);
                }
            }
            return null;
        };
        Select.prototype.select = function (value) {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].value === value) {
                    childs[key].setAttribute("selected", "selected");
                }
            }
        };
        /**
         * [build description]
         * @param  {[type]} content [description]
         * @return {[type]}         [description]
         */
        Select.prototype.build = function (content) {
            this.empty();
            for (var key in content) {
                var option = new Html.Option();
                option.attr({
                    "value": content[key],
                });
                option.text(content[key]);
                this.append([
                    option
                ]);
            }
            return this;
        };
        return Select;
    }(HtmlElement));
    Html.Select = Select;
    /**
     *
     */
    var Small = (function (_super) {
        __extends(Small, _super);
        function Small() {
            return _super.apply(this, arguments) || this;
        }
        return Small;
    }(HtmlElement));
    Html.Small = Small;
    /**
     *
     */
    var Source = (function (_super) {
        __extends(Source, _super);
        function Source() {
            return _super.apply(this, arguments) || this;
        }
        return Source;
    }(HtmlElement));
    Html.Source = Source;
    /**
     *
     */
    var Span = (function (_super) {
        __extends(Span, _super);
        function Span() {
            return _super.apply(this, arguments) || this;
        }
        return Span;
    }(HtmlElement));
    Html.Span = Span;
    /**
     *
     */
    var Strong = (function (_super) {
        __extends(Strong, _super);
        function Strong() {
            return _super.apply(this, arguments) || this;
        }
        return Strong;
    }(HtmlElement));
    Html.Strong = Strong;
    /**
     *
     */
    var Style = (function (_super) {
        __extends(Style, _super);
        function Style() {
            return _super.apply(this, arguments) || this;
        }
        return Style;
    }(HtmlElement));
    Html.Style = Style;
    /**
     *
     */
    var Sub = (function (_super) {
        __extends(Sub, _super);
        function Sub() {
            return _super.apply(this, arguments) || this;
        }
        return Sub;
    }(HtmlElement));
    Html.Sub = Sub;
    /**
     *
     */
    var Summary = (function (_super) {
        __extends(Summary, _super);
        function Summary() {
            return _super.apply(this, arguments) || this;
        }
        return Summary;
    }(HtmlElement));
    Html.Summary = Summary;
    /**
     *
     */
    var Sup = (function (_super) {
        __extends(Sup, _super);
        function Sup() {
            return _super.apply(this, arguments) || this;
        }
        return Sup;
    }(HtmlElement));
    Html.Sup = Sup;
    /**
     * [Table description]
     * @type {[type]}
     */
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table() {
            var _this = _super.apply(this, arguments) || this;
            _this.header = false;
            return _this;
        }
        /**
         *
         *
         */
        Table.prototype.setHeader = function (columns) {
            this.header = true;
            this.thead = new Html.Thead("thead" + this.id);
            this.tr = new Html.Tr("trHeader" + this.id);
            var i = 0;
            for (var key in columns) {
                var th = new Html.Th("TheadTh" + key + this.id);
                if (typeof columns[key] == "object") {
                    th.append(columns[key]);
                }
                else {
                    th.append(Helper.StringHelper.capitalize(columns[key]));
                }
                this.tr.append(th.getElement());
                if (typeof this.fnCHeader === "function") {
                    this.fnCHeader(th, i, columns[key], key);
                }
                i++;
            }
            this.thead.append(this.tr.getElement());
            this.append(this.thead.getElement());
            return this;
        };
        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        Table.prototype.setHeaderCustomize = function (fn) {
            this.fnCHeader = fn;
            return this;
        };
        /**
         *
         * @param  {[type]} rows
         * @return {[type]}
         */
        Table.prototype.build = function (content) {
            this.system = ["click", "customize"];
            this.tbody = new Html.Tbody("tbody" + this.id);
            var html = new Html.HtmlElement();
            var i = 0;
            for (var key in content) {
                var trIdentify = Helper.StringHelper.sanitizeString(key) + this.id;
                var tr = new Html.Tr("TbodyTr" + trIdentify);
                var header = new Array();
                var j = 0;
                for (var row in content[key]) {
                    header[j] = row;
                    var trIdentify2 = Helper.StringHelper.sanitizeString(key) + Helper.StringHelper.sanitizeString(row) + this.id;
                    var td = new Html.Td("TbodyTd" + trIdentify2);
                    if (this.validateSystemKeys(row)) {
                        var contentRow = content[key][row];
                        var finalContent;
                        if (contentRow instanceof Html.HtmlElement) {
                            finalContent = contentRow.getElement();
                        }
                        else if (typeof contentRow == "object") {
                            if (contentRow.hasOwnProperty("content")) {
                                finalContent = contentRow.content;
                            }
                            if (contentRow.hasOwnProperty("class")) {
                                td.attr(contentRow.class);
                            }
                            if (contentRow.hasOwnProperty("attr")) {
                                td.attr(contentRow.attr);
                            }
                            if (contentRow.hasOwnProperty("css")) {
                                td.attr(contentRow.css);
                            }
                            if (contentRow.hasOwnProperty("addTd")) {
                                tr.append([
                                    contentRow.addTd
                                ]);
                            }
                            if (contentRow.hasOwnProperty("event")) {
                                var functionTd = contentRow.event;
                                functionTd(td);
                            }
                        }
                        else {
                            finalContent = contentRow;
                        }
                        td.append([
                            finalContent
                        ]);
                        tr.append([
                            td.getElement()
                        ]);
                    }
                    if (typeof this.fnCContent === "function") {
                        this.fnCContent(td, j, content[key][row], row);
                        if (this.header === false) {
                            this.fnCHeader = this.fnCContent;
                        }
                    }
                    j++;
                }
                this.tbody.append([
                    tr.getElement()
                ]);
                i++;
            }
            if (this.header === false) {
                this.setHeader(header);
            }
            this.append([
                this.tbody.getElement()
            ]);
            return this;
        };
        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        Table.prototype.setContentCustomize = function (fn) {
            this.fnCContent = fn;
            return this;
        };
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        Table.prototype.validateSystemKeys = function (row) {
            if (Helper.ArrayHelper.inArray(this.system, row)) {
                return true;
            }
            return false;
        };
        return Table;
    }(HtmlElement));
    Html.Table = Table;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Thead = (function (_super) {
        __extends(Thead, _super);
        function Thead() {
            return _super.apply(this, arguments) || this;
        }
        return Thead;
    }(HtmlElement));
    Html.Thead = Thead;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Tbody = (function (_super) {
        __extends(Tbody, _super);
        function Tbody() {
            return _super.apply(this, arguments) || this;
        }
        return Tbody;
    }(HtmlElement));
    Html.Tbody = Tbody;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Tr = (function (_super) {
        __extends(Tr, _super);
        function Tr() {
            return _super.apply(this, arguments) || this;
        }
        return Tr;
    }(HtmlElement));
    Html.Tr = Tr;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Td = (function (_super) {
        __extends(Td, _super);
        function Td() {
            return _super.apply(this, arguments) || this;
        }
        /**
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        Td.prototype.colspan = function (cols) {
            this.attr({
                "colspan": cols
            });
        };
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        Td.prototype.rowspan = function (rows) {
            this.attr({
                "rowspan": rows
            });
        };
        return Td;
    }(HtmlElement));
    Html.Td = Td;
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    var Th = (function (_super) {
        __extends(Th, _super);
        function Th() {
            return _super.apply(this, arguments) || this;
        }
        /*
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        Th.prototype.colspan = function (cols) {
            this.attr({
                "colspan": cols
            });
        };
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        Th.prototype.rowspan = function (rows) {
            this.attr({
                "rowspan": rows
            });
        };
        return Th;
    }(HtmlElement));
    Html.Th = Th;
    /**
     *
     */
    var Tfoot = (function (_super) {
        __extends(Tfoot, _super);
        function Tfoot() {
            return _super.apply(this, arguments) || this;
        }
        return Tfoot;
    }(HtmlElement));
    Html.Tfoot = Tfoot;
    /**
     *
     */
    var Time = (function (_super) {
        __extends(Time, _super);
        function Time() {
            return _super.apply(this, arguments) || this;
        }
        return Time;
    }(HtmlElement));
    Html.Time = Time;
    /**
     *
     */
    var Textarea = (function (_super) {
        __extends(Textarea, _super);
        function Textarea() {
            return _super.apply(this, arguments) || this;
        }
        return Textarea;
    }(HtmlElement));
    Html.Textarea = Textarea;
    /**
     *
     */
    var Title = (function (_super) {
        __extends(Title, _super);
        function Title() {
            return _super.apply(this, arguments) || this;
        }
        return Title;
    }(HtmlElement));
    Html.Title = Title;
    /**
     *
     */
    var Track = (function (_super) {
        __extends(Track, _super);
        function Track() {
            return _super.apply(this, arguments) || this;
        }
        return Track;
    }(HtmlElement));
    Html.Track = Track;
    /**
     *
     */
    var U = (function (_super) {
        __extends(U, _super);
        function U() {
            return _super.apply(this, arguments) || this;
        }
        return U;
    }(HtmlElement));
    Html.U = U;
    /**
     *
     * @type {[type]}
     */
    var Ul = (function (_super) {
        __extends(Ul, _super);
        function Ul() {
            return _super.apply(this, arguments) || this;
        }
        /**
         *
         * @param
         * @param
         * @return
         */
        Ul.prototype.create = function (config) {
            for (var i = 0; i < config.content.length; i++) {
                var li = new Html.Li(config.name + i);
                if (typeof config.content !== "undefined") {
                }
                if (typeof config.clickChild !== "undefined") {
                    li.getElement().addEventListener(config.event, config.clickChild.bind(li));
                }
                if (typeof config.customize !== "undefined") {
                    config.customize(li, i, config.content[i]);
                }
                this.append(li.getElement());
            }
            return this;
        };
        return Ul;
    }(HtmlElement));
    Html.Ul = Ul;
    /**
     *
     */
    var Var = (function (_super) {
        __extends(Var, _super);
        function Var() {
            return _super.apply(this, arguments) || this;
        }
        return Var;
    }(HtmlElement));
    Html.Var = Var;
    /**
     *
     */
    var Video = (function (_super) {
        __extends(Video, _super);
        function Video() {
            return _super.apply(this, arguments) || this;
        }
        return Video;
    }(HtmlElement));
    Html.Video = Video;
    /**
     *
     */
    var Wbr = (function (_super) {
        __extends(Wbr, _super);
        function Wbr() {
            return _super.apply(this, arguments) || this;
        }
        return Wbr;
    }(HtmlElement));
    Html.Wbr = Wbr;
})(Html || (Html = {}));
/// <reference path="./Html" />
var View;
/// <reference path="./Html" />
(function (View) {
    var Component = (function () {
        function Component() {
        }
        return Component;
    }());
    View.Component = Component;
})(View || (View = {}));
