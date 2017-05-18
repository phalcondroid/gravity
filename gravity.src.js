var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Environment;
(function (Environment) {
    var Config = (function () {
        function Config() {
            this.config = {};
        }
        /**
         *
         */
        Config.prototype.setConfig = function (config, env) {
            if (env === void 0) { env = Environment.Scope.LOCAL; }
            this.config[env] = config;
        };
        /**
         *
         */
        Config.prototype.getConfig = function (env) {
            if (env === void 0) { env = Environment.Scope.LOCAL; }
            return this.config[env];
        };
        return Config;
    }());
    Environment.Config = Config;
})(Environment || (Environment = {}));
var Environment;
(function (Environment) {
    var Scope = (function () {
        function Scope() {
        }
        return Scope;
    }());
    Scope.LOCAL = 0;
    Scope.DEV = 1;
    Scope.TEST = 2;
    Scope.QA = 3;
    Scope.STAGING = 4;
    Scope.PRODUCTION = 5;
    Environment.Scope = Scope;
})(Environment || (Environment = {}));
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
})(Errors || (Errors = {}));
var Errors;
(function (Errors) {
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
/// <reference path="./ManagerInterface"/>
var Events;
(function (Events) {
    var Manager = (function () {
        function Manager() {
            this.events = {};
        }
        Manager.prototype.attach = function (controller, event) {
            this.events[controller][event];
        };
        Manager.prototype.detach = function (controller, event) {
            this.events[controller][event];
        };
        Manager.prototype.detachAll = function () {
        };
        Manager.prototype.fire = function (controller, event, callback) {
        };
        Manager.prototype.getListeners = function () {
        };
        return Manager;
    }());
    Events.Manager = Manager;
})(Events || (Events = {}));
var Helper;
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
})(Helper || (Helper = {}));
///<reference path="./Environment/Scope"/>
///<reference path="./Environment/Config"/>
///<reference path="./Helper/ArrayHelper"/>
var Gravity;
///<reference path="./Environment/Scope"/>
///<reference path="./Environment/Config"/>
///<reference path="./Helper/ArrayHelper"/>
(function (Gravity) {
    var Application = (function () {
        /**
         *
         */
        function Application() {
            /**
             *
             */
            this.config = null;
            /**
             *
             */
            this.env = Environment.Scope.LOCAL;
            window.onbeforeunload = function () {
                sessionStorage.clear();
            };
        }
        /**
         *
         */
        Application.prototype.setScope = function (env) {
            this.env = env;
        };
        /**
         *
         */
        Application.prototype.setConfig = function (config) {
            this.config = config.getConfig(this.env);
        };
        /**
         *
         */
        Application.prototype.getConfig = function () {
            return this.config;
        };
        /**
         *
         */
        Application.prototype.resolveConfig = function (di) {
            var positionArray = new Array();
            var configData = this.config;
            for (var key in configData) {
                switch (key) {
                    case "urls":
                        this.resolveUrl(di, configData[key]);
                        break;
                    case "services":
                        this.resolveServices(di, configData[key]);
                        break;
                }
            }
            //controllers executed in the final section
            if (configData.hasOwnProperty("controllers")) {
                this.resolveControllers(di, configData["controllers"]);
            }
            else {
                throw "Config must have controllers item attached";
            }
        };
        /**
         *
         */
        Application.prototype.resolveUrl = function (di, urls) {
            var url = new Url.Url();
            if (Array.isArray(urls)) {
                for (var key in urls) {
                    if (typeof urls[key] == "string") {
                        url.set(key, urls[key]);
                    }
                    else {
                        throw "Url must be string : " + urls[key];
                    }
                }
            }
            else if (typeof url == "object") {
                for (var keyUrlFor in urls) {
                    url.set(keyUrlFor, urls[keyUrlFor]);
                }
            }
            else {
                throw "Url data unrecognized";
            }
            di.set("url", url);
        };
        /**
         *
         */
        Application.prototype.resolveControllers = function (di, controllers) {
            if (controllers.length == 0) {
                throw "You must load your controllers";
            }
            if (Array.isArray(controllers)) {
                var i = 1;
                for (var key in controllers) {
                    if (typeof controllers[key].name != "undefined") {
                        var temp = new controllers[key].name;
                        if (temp instanceof View.Controller) {
                            temp.setDi(di);
                            temp.setUrl(di.get("url"));
                            temp.initialize();
                            this.resolvePropertiesController(temp);
                        }
                        else {
                            throw "Controller #" + i + " must be extend from View.Controller class";
                        }
                        i++;
                    }
                    else {
                        throw "Config => Controller => 'name' must be initialized with View.Controller class";
                    }
                }
            }
            else {
                throw "Config => controllers must be array";
            }
        };
        Application.prototype.resolvePropertiesController = function (controller) {
            var restricted = [
                "constructor",
                "initialize",
                "getById",
                "getByTag",
                "getByClass",
                "getDi",
                "setDi",
                "getUrl",
                "setUrl"
            ];
            for (var key in controller) {
                switch (typeof controller[key]) {
                    case "function":
                        if (!Helper.ArrayHelper.inArray(restricted, key)) {
                            var component = controller.getById(key);
                            if (component) {
                                controller[key](component);
                            }
                        }
                        break;
                }
            }
        };
        /**
         *
         */
        Application.prototype.resolveServices = function (di, service) {
            new service().initialize(di);
        };
        /**
         *
         */
        Application.prototype.start = function () {
            var di = new Service.FactoryDefault;
            this.resolveConfig(di);
        };
        return Application;
    }());
    Gravity.Application = Application;
})(Gravity || (Gravity = {}));
var Helper;
(function (Helper) {
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
})(Helper || (Helper = {}));
var Helper;
(function (Helper) {
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
})(Helper || (Helper = {}));
var Helper;
(function (Helper) {
    var Uuid = (function () {
        function Uuid() {
        }
        Uuid.get = function () {
            return Helper.MathHelper.getS4() + Helper.MathHelper.getS4() + '-' +
                Helper.MathHelper.getS4() + '-' + Helper.MathHelper.getS4() + '-' +
                Helper.MathHelper.getS4() + '-' + Helper.MathHelper.getS4() +
                Helper.MathHelper.getS4() + Helper.MathHelper.getS4();
        };
        return Uuid;
    }());
    Helper.Uuid = Uuid;
})(Helper || (Helper = {}));
/// <reference path="../Errors/Message"/>
var Helper;
/// <reference path="../Errors/Message"/>
(function (Helper) {
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
///<reference path="../Service/InjectionAwareInterface" />
var Logic;
///<reference path="../Service/InjectionAwareInterface" />
(function (Logic) {
    var Controller = (function () {
        function Controller() {
        }
        /**
         *
         */
        Controller.prototype.initialize = function () {
        };
        /**
         *
         */
        Controller.prototype.onConstruct = function () {
        };
        /**
         *
         */
        Controller.prototype.setDi = function (di) {
            this.di = di;
        };
        /**
         *
         */
        Controller.prototype.getDi = function () {
            return this.di;
        };
        return Controller;
    }());
    Logic.Controller = Controller;
})(Logic || (Logic = {}));
/// <reference path="../Helper/Uuid" />
var ModelData;
/// <reference path="../Helper/Uuid" />
(function (ModelData) {
    var RawModel = (function () {
        function RawModel() {
            this.state = 1;
            this.identify = Helper.Uuid.get();
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
        /**
         * [getClassName description]
         * @return {[type]} [description]
         */
        RawModel.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        /**
         *
         */
        RawModel.prototype.getIdentify = function () {
            return this.identify;
        };
        return RawModel;
    }());
    ModelData.RawModel = RawModel;
})(ModelData || (ModelData = {}));
/// <reference path="./RawModel"/>
var ModelData;
/// <reference path="./RawModel"/>
(function (ModelData) {
    var AjaxModel = (function (_super) {
        __extends(AjaxModel, _super);
        function AjaxModel() {
            var _this = _super.call(this) || this;
            _this.insertUrl = null;
            _this.deleteUrl = null;
            _this.updateUrl = null;
            _this.findUrl = null;
            _this.method = "POST";
            _this.initialize();
            return _this;
        }
        AjaxModel.prototype.setSource = function (data) {
            this.setInsertUrl(data.find);
            this.setUpdateUrl(data.update);
            this.setInsertUrl(data.insert);
            this.setFindUrl(data.insert);
        };
        AjaxModel.prototype.setInsertUrl = function (url) {
            this.insertUrl = url;
        };
        AjaxModel.prototype.setFindUrl = function (url) {
            this.findUrl = url;
        };
        AjaxModel.prototype.setDeleteUrl = function (url) {
            this.deleteUrl = url;
        };
        AjaxModel.prototype.setUpdateUrl = function (url) {
            this.updateUrl = url;
        };
        AjaxModel.prototype.getInsertUrl = function () {
            return this.insertUrl;
        };
        AjaxModel.prototype.getFindUrl = function () {
            return this.findUrl;
        };
        AjaxModel.prototype.getDeleteUrl = function () {
            return this.deleteUrl;
        };
        AjaxModel.prototype.getUpdateUrl = function () {
            return this.updateUrl;
        };
        AjaxModel.prototype.setParams = function (params) {
            this.params = params;
        };
        AjaxModel.prototype.getParams = function () {
            return this.params;
        };
        AjaxModel.prototype.setMethod = function (method) {
            this.method = method;
        };
        AjaxModel.prototype.getMethod = function () {
            return this.method;
        };
        return AjaxModel;
    }(ModelData.RawModel));
    ModelData.AjaxModel = AjaxModel;
})(ModelData || (ModelData = {}));
/// <reference path="./RawModel"/>
var ModelData;
/// <reference path="./RawModel"/>
(function (ModelData) {
    var StaticModel = (function (_super) {
        __extends(StaticModel, _super);
        /**
         *
         */
        function StaticModel(di) {
            var _this = _super.call(this) || this;
            _this.setContainer(new Service.Container());
            _this.initialize();
            return _this;
        }
        /**
         *
         */
        StaticModel.prototype.setData = function (data) {
            this.getContainer().setPersistent("Models_Identify_" + this.getClassName(), JSON.stringify(data));
        };
        /**
         *
         */
        StaticModel.prototype.getData = function () {
            var data = this.getContainer().getPersistent("Models_Identify_" + this.getClassName());
            if (typeof data == "string") {
            }
            return data;
        };
        /**
         *
         */
        StaticModel.prototype.getObjectData = function () {
            return JSON.parse(this.getContainer().getPersistent("Models_Identify_" + this.getClassName()));
        };
        /**
         *
         */
        StaticModel.prototype.setDi = function (di) {
            this.di = di;
        };
        /**
         *
         */
        StaticModel.prototype.getDi = function () {
            return this.di;
        };
        /**
         *
         */
        StaticModel.prototype.setIndex = function (index) {
            this.index = index;
        };
        /**
         *
         */
        StaticModel.prototype.getIndex = function () {
            return this.index;
        };
        /**
         *
         */
        StaticModel.prototype.setContainer = function (container) {
            this.container = container;
        };
        /**
         *
         */
        StaticModel.prototype.getContainer = function () {
            return this.container;
        };
        return StaticModel;
    }(ModelData.RawModel));
    ModelData.StaticModel = StaticModel;
})(ModelData || (ModelData = {}));
/// <reference path="./StaticModel"/>
var ModelData;
/// <reference path="./StaticModel"/>
(function (ModelData) {
    var AjaxModelPersistent = (function (_super) {
        __extends(AjaxModelPersistent, _super);
        function AjaxModelPersistent() {
            var _this = _super.apply(this, arguments) || this;
            _this.insertUrl = null;
            _this.deleteUrl = null;
            _this.updateUrl = null;
            _this.findUrl = null;
            _this.method = "POST";
            return _this;
        }
        AjaxModelPersistent.prototype.setSource = function (data) {
            this.setInsertUrl(data.find);
            this.setUpdateUrl(data.update);
            this.setInsertUrl(data.insert);
            this.setFindUrl(data.insert);
        };
        AjaxModelPersistent.prototype.setAjaxInit = function (value) {
            this.getContainer().setPersistent("ajaxInit_" + this.getClassName(), value);
        };
        AjaxModelPersistent.prototype.getAjaxInit = function () {
            return this.getContainer().getPersistent("ajaxInit_" + this.getClassName());
        };
        AjaxModelPersistent.prototype.setInsertUrl = function (url) {
            this.insertUrl = url;
        };
        AjaxModelPersistent.prototype.setFindUrl = function (url) {
            this.findUrl = url;
        };
        AjaxModelPersistent.prototype.setDeleteUrl = function (url) {
            this.deleteUrl = url;
        };
        AjaxModelPersistent.prototype.setUpdateUrl = function (url) {
            this.updateUrl = url;
        };
        AjaxModelPersistent.prototype.getInsertUrl = function () {
            return this.insertUrl;
        };
        AjaxModelPersistent.prototype.getFindUrl = function () {
            return this.findUrl;
        };
        AjaxModelPersistent.prototype.getDeleteUrl = function () {
            return this.deleteUrl;
        };
        AjaxModelPersistent.prototype.getUpdateUrl = function () {
            return this.updateUrl;
        };
        AjaxModelPersistent.prototype.setParams = function (params) {
            this.params = params;
        };
        AjaxModelPersistent.prototype.getParams = function () {
            return this.params;
        };
        AjaxModelPersistent.prototype.setMethod = function (method) {
            this.method = method;
        };
        AjaxModelPersistent.prototype.getMethod = function () {
            return this.method;
        };
        return AjaxModelPersistent;
    }(ModelData.StaticModel));
    ModelData.AjaxModelPersistent = AjaxModelPersistent;
})(ModelData || (ModelData = {}));
var ModelData;
(function (ModelData) {
    var Deny = (function () {
        function Deny() {
        }
        Deny.getDeny = function () {
            return [
                "state",
                "source",
                "insertUrl",
                "deleteUrl",
                "updateUrl",
                "findUrl",
                "params",
                "internalId",
                "method"
            ];
        };
        return Deny;
    }());
    ModelData.Deny = Deny;
})(ModelData || (ModelData = {}));
var Mvc;
(function (Mvc) {
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
    Mvc.DataType = DataType;
})(Mvc || (Mvc = {}));
var Mvc;
(function (Mvc) {
    var Operators = (function () {
        function Operators() {
        }
        return Operators;
    }());
    Operators.OR = "$or";
    Operators.AND = "$and";
    Operators.SORT = "$sort";
    Operators.IS_NOT = "$isNot";
    Operators.LIMIT = "$limit";
    Operators.COLUMNS = "$columns";
    Operators.CONDITIONAL = "$conditions";
    Mvc.Operators = Operators;
})(Mvc || (Mvc = {}));
var Mvc;
(function (Mvc) {
    var ComparisonOperators = (function () {
        function ComparisonOperators() {
        }
        return ComparisonOperators;
    }());
    ComparisonOperators.AND = "&&";
    ComparisonOperators.OR = "||";
    ComparisonOperators.EQUAL = "==";
    ComparisonOperators.DIFFERENT = "!=";
    Mvc.ComparisonOperators = ComparisonOperators;
})(Mvc || (Mvc = {}));
/// <reference path="Builder/DataType.ts" />
/// <reference path="Builder/Operators.ts" />
/// <reference path="Builder/ComparisonOperators.ts" />
var Mvc;
/// <reference path="Builder/DataType.ts" />
/// <reference path="Builder/Operators.ts" />
/// <reference path="Builder/ComparisonOperators.ts" />
(function (Mvc) {
    var Builder = (function () {
        function Builder(data) {
            if (data === void 0) { data = false; }
            this.data = false;
            this.first = "";
            this.final = [];
            this.init = false;
            this.sort = new Array();
            this.limit = null;
            this.columns = {};
            this.data = data;
        }
        Builder.prototype.buildCondition = function (params) {
            var index = 1;
            var length = Object.keys(params).length;
            for (var key in params) {
                switch (key) {
                    case Mvc.Operators.CONDITIONAL:
                        var conditional = params[key];
                        for (var keyConditional in conditional) {
                            switch (keyConditional) {
                                case Mvc.Operators.AND:
                                    var iAnd = 1;
                                    var andContent = conditional[keyConditional];
                                    var andLength = Object.keys(andContent).length;
                                    for (var keyAnd in andContent) {
                                        this.getExpression(keyAnd, andContent[keyAnd], Mvc.ComparisonOperators.AND, iAnd, andLength);
                                        iAnd++;
                                    }
                                    break;
                                case Mvc.Operators.OR:
                                    var iOr = 1;
                                    var orContent = conditional[keyConditional];
                                    var orLength = Object.keys(orContent).length;
                                    for (var keyOr in orContent) {
                                        this.getExpression(keyOr, orContent[keyOr], Mvc.Operators.OR, iOr, orLength);
                                        iOr++;
                                    }
                                    break;
                                case Mvc.Operators.IS_NOT:
                                    var iIsNot = 1;
                                    var isNotContent = conditional[keyConditional];
                                    var isNotLength = Object.keys(isNotContent).length;
                                    for (var keyIsNot in isNotContent) {
                                        this.getExpression(keyIsNot, isNotContent[keyIsNot], Mvc.ComparisonOperators.AND, iIsNot, isNotLength, Mvc.ComparisonOperators.DIFFERENT);
                                        iIsNot++;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case Mvc.Operators.SORT:
                        this.getSort(params[key]);
                        break;
                    case Mvc.Operators.LIMIT:
                        this.getLimit(params[key]);
                        break;
                    case Mvc.Operators.COLUMNS:
                        this.columns = params[key];
                        if (typeof params[key] != "object") {
                            throw Errors.Message.getCodeMessage(Errors.MessageCode.NOT_VALID_OBJECT, "$columns option");
                        }
                        break;
                    default:
                        this.getExpression(key, params[key], Mvc.ComparisonOperators.AND, index, length);
                        index++;
                        break;
                }
            }
        };
        Builder.prototype.getSort = function (sortContent) {
            switch (typeof sortContent) {
                case Mvc.DataType.STRING_TYPE:
                    this.sort.push("data = Sort.sortByField('" + sortContent + "');");
                    break;
                case Mvc.DataType.OBJECT_TYPE:
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
                            if (sortContent[sortKey] == Mvc.Sort.DESC) {
                                this.sort.push("data = data.reverse();");
                            }
                        }
                    }
                    break;
            }
        };
        Builder.prototype.getLimit = function (limit) {
            if (typeof limit == "string") {
                limit = parseInt(limit);
            }
            this.limit = "data = data.slice(0, " + limit + ") ";
        };
        Builder.prototype.getExpression = function (key, content, operator, index, length, comparison) {
            if (comparison === void 0) { comparison = "=="; }
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
                    var valueByType = Mvc.DataType.getValueByType(newVal[j]);
                    condition += "row[\"" + key + "\"] " + comparison + " " + newVal[j] + " " + operatorStr + " ";
                }
            }
            else {
                var operatorStr = "";
                var valueByType = Mvc.DataType.getValueByType(content);
                condition += "row[\"" + key + "\"] " + comparison + " " + valueByType + " " + operatorStr + " ";
            }
            this.first += finalOperator + " ( " + condition + " ) ";
            this.init = true;
        };
        /**
         *
         */
        Builder.prototype.getColumns = function (row) {
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
        Builder.prototype.getMultipleRowValues = function (rsp, conds) {
            if (conds === void 0) { conds = true; }
            if (typeof rsp != "object") {
                var response = JSON.parse(rsp);
                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
            }
            else {
                response = rsp;
            }
            if (this.first == "") {
                this.first = "true";
            }
            var data = new Array();
            if (Array.isArray(response)) {
                var conditions = this.first;
                var evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";
                for (var key in response) {
                    var row = response[key];
                    console.log("si cas", row);
                    if (conds) {
                        eval(evalValue);
                    }
                    else {
                        data.push(this.getColumns(row));
                    }
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
            }
            else {
                if (typeof response == "object") {
                    data.push(this.getColumns(response));
                }
                else {
                    console.log("Response is not an object");
                }
            }
            return data;
        };
        Builder.prototype.getOneRowValue = function (data) {
        };
        return Builder;
    }());
    Mvc.Builder = Builder;
})(Mvc || (Mvc = {}));
var Mvc;
(function (Mvc) {
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
    Mvc.Sort = Sort;
})(Mvc || (Mvc = {}));
var Mvc;
(function (Mvc) {
    var Where = (function () {
        function Where() {
        }
        return Where;
    }());
    Mvc.Where = Where;
})(Mvc || (Mvc = {}));
var Mvc;
(function (Mvc) {
    var ViewModel = (function () {
        function ViewModel(element, data) {
        }
        return ViewModel;
    }());
    Mvc.ViewModel = ViewModel;
})(Mvc || (Mvc = {}));
var Network;
(function (Network) {
    var Ajax = (function () {
        /**
         *
         */
        function Ajax() {
            this.context = {};
            this.method = "POST";
            this.parameters = "";
            this.container = [];
            this.responseFn = function () { };
            this.bfSendFn = function () { }.bind(this);
            this.httpRequest = new XMLHttpRequest();
        }
        /**
         *
         */
        Ajax.prototype.setContext = function (ctx) {
            this.context = ctx;
        };
        /**
         *
         */
        Ajax.prototype.getContext = function () {
            return this.context;
        };
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
        Ajax.prototype.set = function (key, value) {
            this.container[key] = value;
        };
        /**
         *
         */
        Ajax.prototype.get = function (key) {
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
        Ajax.prototype.POST = function () {
            this.setMethod("POST");
            return this;
        };
        /**
         *
         */
        Ajax.prototype.PUT = function () {
            this.setMethod("PUT");
            return this;
        };
        /**
         *
         */
        Ajax.prototype.DELETE = function () {
            this.setMethod("DELETE");
            return this;
        };
        /**
         *
         */
        Ajax.prototype.GET = function () {
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
        Ajax.prototype.addContext = function () {
            this.httpRequest.context = this.getContext();
            this.httpRequest.getContext = function () {
                return this.context;
            };
        };
        /**
         *
         */
        Ajax.prototype.response = function (responseFunction) {
            this.responseFn = responseFunction;
            try {
                this.bfSendFn();
                this.addContext();
                this.httpRequest.onreadystatechange = function () {
                    if (this.httpRequest.readyState === this.httpRequest.DONE) {
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
        /**
         *
         */
        Ajax.prototype.setDi = function (di) {
            this.di = di;
        };
        /**
         *
         */
        Ajax.prototype.getDi = function () {
            return this.di;
        };
        return Ajax;
    }());
    Network.Ajax = Ajax;
})(Network || (Network = {}));
var Network;
(function (Network) {
    var MethodType = (function () {
        function MethodType() {
        }
        return MethodType;
    }());
    MethodType.POST = "POST";
    MethodType.GET = "GET";
    MethodType.PUT = "PUT";
    MethodType.DELETE = "DELETE";
    Network.MethodType = MethodType;
})(Network || (Network = {}));
var Persistence;
(function (Persistence) {
    var ComparisonOperators = (function () {
        function ComparisonOperators() {
        }
        return ComparisonOperators;
    }());
    ComparisonOperators.AND = "&&";
    ComparisonOperators.OR = "||";
    ComparisonOperators.EQUAL = "==";
    ComparisonOperators.DIFFERENT = "!=";
    Persistence.ComparisonOperators = ComparisonOperators;
})(Persistence || (Persistence = {}));
var Persistence;
(function (Persistence) {
    var DatamapperOperators = (function () {
        function DatamapperOperators() {
        }
        return DatamapperOperators;
    }());
    DatamapperOperators.OR = "$or";
    DatamapperOperators.AND = "$and";
    DatamapperOperators.SORT = "$sort";
    DatamapperOperators.IS_NOT = "$isNot";
    DatamapperOperators.LIMIT = "$limit";
    DatamapperOperators.COLUMNS = "$columns";
    DatamapperOperators.CONDITIONAL = "$conditions";
    Persistence.DatamapperOperators = DatamapperOperators;
})(Persistence || (Persistence = {}));
var Persistence;
(function (Persistence) {
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
    Persistence.DataType = DataType;
})(Persistence || (Persistence = {}));
/// <reference path="../Model/RawModel" />
/// <reference path="../Model/Deny" />
var Reflection;
/// <reference path="../Model/RawModel" />
/// <reference path="../Model/Deny" />
(function (Reflection_1) {
    var Reflection = (function () {
        function Reflection() {
            this.methods = new Array();
            this.attributes = new Array();
        }
        Reflection.prototype.getName = function (obj) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(obj["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
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
                        this.methods.push();
                        break;
                    case 'object':
                        output += '\t[object] ' + propName + ' ' + this.read(propValue) + '\n\n';
                        break;
                    default:
                        output += ' [property] ' + propName + ' ' + propValue + '\n\n';
                        this.attributes.push({
                            propName: propValue
                        });
                        break;
                }
            }
            return output;
        };
        Reflection.prototype.getAtttributeAsObjects = function (obj) {
            if (typeof obj !== 'object') {
                console.log('Not an object');
                return;
            }
            var output = '';
            var attributes = new Array();
            for (var i in obj) {
                var propName = i;
                var propValue = obj[i];
                var type = (typeof propValue);
                var tempObj = {};
                switch (type) {
                    case 'function':
                        break;
                    case 'object':
                        if (propValue instanceof ModelData.RawModel) {
                            tempObj[propName] = this.getAtttributeAsObjects(propValue);
                            attributes.push(tempObj);
                        }
                        break;
                    default:
                        var deny = ModelData.Deny.getDeny();
                        if (deny.indexOf(propName) == -1) {
                            tempObj[propName] = propValue;
                            attributes.push(tempObj);
                        }
                        break;
                }
            }
            return attributes;
        };
        /**
         *
         */
        Reflection.prototype.getMethods = function () {
            return this.methods;
        };
        /**
         *
         */
        Reflection.prototype.getAttributes = function () {
            return this.attributes;
        };
        return Reflection;
    }());
    Reflection_1.Reflection = Reflection;
})(Reflection || (Reflection = {}));
var Service;
(function (Service) {
    var Container = (function () {
        function Container() {
            this.service = [];
        }
        Container.prototype.set = function (serviceName, content) {
            this.service[serviceName] = content;
        };
        Container.prototype.get = function (serviceName) {
            return this.service[serviceName];
        };
        Container.prototype.setPersistent = function (serviceName, content) {
            sessionStorage.setItem(serviceName, content);
        };
        Container.prototype.getPersistent = function (serviceName) {
            return sessionStorage.getItem(serviceName);
        };
        return Container;
    }());
    Service.Container = Container;
})(Service || (Service = {}));
var Persistence;
(function (Persistence) {
    var UnitOfWork = (function () {
        function UnitOfWork() {
        }
        return UnitOfWork;
    }());
    UnitOfWork.NEW = 1;
    UnitOfWork.CREATED = 2;
    UnitOfWork.DELETED = 3;
    Persistence.UnitOfWork = UnitOfWork;
})(Persistence || (Persistence = {}));
/// <reference path="../Reflection/Reflection.ts" />
/// <reference path="../Model/RawModel.ts" />
/// <reference path="./UnitOfWork.ts" />
var Persistence;
/// <reference path="../Reflection/Reflection.ts" />
/// <reference path="../Model/RawModel.ts" />
/// <reference path="./UnitOfWork.ts" />
(function (Persistence) {
    var Hydrator = (function () {
        function Hydrator() {
        }
        Hydrator.prototype.hydrate = function (model, data) {
            var newModel = new model();
            newModel.state = Persistence.UnitOfWork.CREATED;
            for (var key in data) {
                switch (typeof newModel[key]) {
                    case "function":
                        var auxPropNested = new newModel[key];
                        if (auxPropNested instanceof ModelData.RawModel) {
                            newModel[key] = this.hydrate(newModel[key], data[key]);
                        }
                        else {
                            newModel[key] = data[key];
                        }
                        break;
                    default:
                        var dataArray = new Array();
                        if (Array.isArray(newModel[key])) {
                            switch (typeof newModel[key][0]) {
                                case "function":
                                    if (typeof data[key].length != "undefined") {
                                        if (data[key].length > 0) {
                                            var auxSubModel = new newModel[key][0];
                                            var arrayData = new Array();
                                            if (auxSubModel instanceof ModelData.RawModel) {
                                                for (var subModelKey in data[key]) {
                                                    arrayData.push(this.hydrate(newModel[key][0], data[key][subModelKey]));
                                                }
                                                newModel[key] = arrayData;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    newModel[key] = data[key];
                                    break;
                            }
                        }
                        else {
                            newModel[key] = data[key];
                        }
                        break;
                }
                if (Array.isArray(newModel[key])) {
                    if (typeof newModel[key][0] == "function") {
                        newModel[key] = new Array();
                    }
                }
            }
            return newModel;
        };
        return Hydrator;
    }());
    Persistence.Hydrator = Hydrator;
})(Persistence || (Persistence = {}));
/// <reference path="./DatamapperOperators.ts" />
/// <reference path="./ComparisonOperators.ts" />
var Persistence;
/// <reference path="./DatamapperOperators.ts" />
/// <reference path="./ComparisonOperators.ts" />
(function (Persistence) {
    var Filter = (function () {
        function Filter() {
            this.first = "";
            this.final = [];
            this.init = false;
            this.sort = new Array();
            this.limit = null;
            this.columns = {};
        }
        Filter.prototype.buildCondition = function (params) {
            var index = 1;
            var length = Object.keys(params).length;
            for (var key in params) {
                switch (key) {
                    case Persistence.DatamapperOperators.CONDITIONAL:
                        var conditional = params[key];
                        for (var keyConditional in conditional) {
                            switch (keyConditional) {
                                case Persistence.DatamapperOperators.AND:
                                    var iAnd = 1;
                                    var andContent = conditional[keyConditional];
                                    var andLength = Object.keys(andContent).length;
                                    for (var keyAnd in andContent) {
                                        this.getExpression(keyAnd, andContent[keyAnd], Persistence.ComparisonOperators.AND, iAnd, andLength);
                                        iAnd++;
                                    }
                                    break;
                                case Persistence.DatamapperOperators.OR:
                                    var iOr = 1;
                                    var orContent = conditional[keyConditional];
                                    var orLength = Object.keys(orContent).length;
                                    for (var keyOr in orContent) {
                                        this.getExpression(keyOr, orContent[keyOr], Persistence.ComparisonOperators.OR, iOr, orLength);
                                        iOr++;
                                    }
                                    break;
                                case Persistence.DatamapperOperators.IS_NOT:
                                    var iIsNot = 1;
                                    var isNotContent = conditional[keyConditional];
                                    var isNotLength = Object.keys(isNotContent).length;
                                    for (var keyIsNot in isNotContent) {
                                        this.getExpression(keyIsNot, isNotContent[keyIsNot], Persistence.ComparisonOperators.AND, iIsNot, isNotLength, Persistence.ComparisonOperators.DIFFERENT);
                                        iIsNot++;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case Persistence.DatamapperOperators.SORT:
                        this.getSort(params[key]);
                        break;
                    case Persistence.DatamapperOperators.LIMIT:
                        this.getLimit(params[key]);
                        break;
                    case Persistence.DatamapperOperators.COLUMNS:
                        this.columns = params[key];
                        if (typeof params[key] != "object") {
                            throw Errors.Message.getCodeMessage(Errors.MessageCode.NOT_VALID_OBJECT, "$columns option");
                        }
                        break;
                    default:
                        this.getExpression(key, params[key], Persistence.ComparisonOperators.AND, index, length);
                        index++;
                        break;
                }
            }
        };
        Filter.prototype.getSort = function (sortContent) {
            switch (typeof sortContent) {
                case Persistence.DataType.STRING_TYPE:
                    this.sort.push("data = Sort.sortByField('" + sortContent + "');");
                    break;
                case Persistence.DataType.OBJECT_TYPE:
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
                            if (sortContent[sortKey] == Persistence.Sort.DESC) {
                                this.sort.push("data = data.reverse();");
                            }
                        }
                    }
                    break;
            }
        };
        Filter.prototype.getLimit = function (limit) {
            if (typeof limit == "string") {
                limit = parseInt(limit);
            }
            this.limit = "data = data.slice(0, " + limit + ") ";
        };
        Filter.prototype.getExpression = function (key, content, operator, index, length, comparison) {
            if (comparison === void 0) { comparison = "=="; }
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
                    var valueByType = Persistence.DataType.getValueByType(newVal[j]);
                    condition += "row[\"" + key + "\"] " + comparison + " " + newVal[j] + " " + operatorStr + " ";
                }
            }
            else {
                var operatorStr = "";
                var valueByType = Persistence.DataType.getValueByType(content);
                condition += "row[\"" + key + "\"] " + comparison + " " + valueByType + " " + operatorStr + " ";
            }
            this.first += finalOperator + " ( " + condition + " ) ";
            this.init = true;
        };
        /**
         *
         */
        Filter.prototype.getColumns = function (row) {
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
        Filter.prototype.getMultipleRowValues = function (rsp, conds) {
            if (conds === void 0) { conds = true; }
            var response = JSON.parse(rsp);
            if (typeof response == "string") {
                response = JSON.parse(response);
            }
            if (this.first == "") {
                this.first = "true";
            }
            var data = new Array();
            if (Array.isArray(response)) {
                var conditions = this.first;
                var evalValue = "if (" + conditions + ") { data.push(this.getColumns(row)); }";
                for (var key in response) {
                    var row = response[key];
                    if (conds) {
                        eval(evalValue);
                    }
                    else {
                        data.push(this.getColumns(row));
                    }
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
            }
            else {
                if (typeof response == "object") {
                    data.push(this.getColumns(response));
                }
                else {
                    console.log("Response is not an object");
                }
            }
            return data;
        };
        Filter.prototype.getOneRowValue = function (data) {
        };
        return Filter;
    }());
    Persistence.Filter = Filter;
})(Persistence || (Persistence = {}));
/// <reference path="../Reflection/Reflection.ts" />
/// <reference path="../Service/Container.ts" />
/// <reference path="../Model/StaticModel.ts" />
/// <reference path="../Model/AjaxModel.ts" />
/// <reference path="../Network/Ajax.ts" />
/// <reference path="./UnitOfWork.ts" />
/// <reference path="./Hydrator.ts" />
/// <reference path="./Filter.ts" />
var Persistence;
/// <reference path="../Reflection/Reflection.ts" />
/// <reference path="../Service/Container.ts" />
/// <reference path="../Model/StaticModel.ts" />
/// <reference path="../Model/AjaxModel.ts" />
/// <reference path="../Network/Ajax.ts" />
/// <reference path="./UnitOfWork.ts" />
/// <reference path="./Hydrator.ts" />
/// <reference path="./Filter.ts" />
(function (Persistence) {
    var EntityManager = (function () {
        /**
         * Entity manager is a class
         */
        function EntityManager() {
            this.container = null;
            this.ajax = null;
            this.hydrator = null;
            this.uow = new Persistence.UnitOfWork;
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
         * @param model
         * @param params
         */
        EntityManager.prototype.find = function (model, params) {
            if (params === void 0) { params = {}; }
            this.setWhenIsModel(model, params, "find");
            return this;
        };
        /**
         *
         * @param model
         * @param params
         */
        EntityManager.prototype.findOne = function (model, params) {
            if (params === void 0) { params = {}; }
            this.setWhenIsModel(model, params, "findOne");
            return this;
        };
        /**
         *
         * @param model
         * @param params
         */
        EntityManager.prototype.count = function (model, params) {
            if (params === void 0) { params = {}; }
            this.setWhenIsModel(model, params, "count");
            return this;
        };
        /**
         *
         */
        EntityManager.prototype.setWhenIsModel = function (model, params, type) {
            var objModel = new model();
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionObjModel", objModel);
            this.getContainer()
                .set("transactionParams", params);
            this.getContainer()
                .set("transactionType", type);
            if (objModel instanceof ModelData.RawModel) {
                var callAjax = false;
                if (objModel instanceof ModelData.AjaxModelPersistent) {
                    if (objModel.getAjaxInit() === null) {
                        this.callAjax(objModel, type, params);
                    }
                }
                else if (objModel instanceof ModelData.AjaxModel) {
                    this.callAjax(objModel, type, params);
                }
            }
            else {
                throw "Model must be instance of RawModel";
            }
        };
        EntityManager.prototype.callAjax = function (objModel, type, params) {
            this.ajax = new Network.Ajax();
            this.ajax.setDi(this.getDi());
            var url = objModel.getFindUrl();
            if (url == null) {
                url = this.getDi().get("url").get("baseUrl") +
                    objModel.getClassName() +
                    type;
            }
            this.ajax.setUrl(url);
            this.ajax.setParams(params);
            this.ajax.setMethod(objModel.getMethod());
        };
        /**
         *
         */
        EntityManager.prototype.save = function (model) {
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionObjectModel", model);
            this.getContainer()
                .set("transactionType", "save");
            if (model instanceof ModelData.AjaxModel) {
                this.ajax = new Network.Ajax();
                this.ajax.setDi(this.getDi());
                var modelName = model.getClassName();
                switch (model.state) {
                    case Persistence.UnitOfWork.NEW:
                        var url = model.getInsertUrl();
                        if (url == null) {
                            url = this.getDi().get("url").get("baseUrl") +
                                modelName +
                                "Insert";
                        }
                        this.ajax.setUrl(url);
                        break;
                    case Persistence.UnitOfWork.CREATED:
                        var url = model.getUpdateUrl();
                        if (url == null) {
                            url = this.getDi().get("url").get("baseUrl") +
                                modelName +
                                "Update";
                        }
                        this.ajax.setUrl(url);
                        break;
                }
                var reflection = new Reflection.Reflection();
                var attrsAsString = JSON.stringify(reflection.getAtttributeAsObjects(model));
                var objParams = {};
                objParams[modelName] = attrsAsString;
                this.ajax.setParams(objParams);
                this.ajax.setMethod(model.getMethod());
            }
            else if (model instanceof ModelData.StaticModel) {
                switch (model.state) {
                    case Persistence.UnitOfWork.NEW:
                        var tempData = model.getData();
                        break;
                    case Persistence.UnitOfWork.CREATED:
                        break;
                }
            }
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
            var objModel = this.getContainer()
                .get("transactionObjModel");
            var type = this.getContainer()
                .get("transactionType");
            if (type == "save") {
                this.ajax.response(function (response) {
                    return fn(this.setResponse(response, type, model));
                }.bind(this));
                this.ajax.send();
            }
            else {
                if (type == "find" || type == "findOne" || type == "count") {
                    var params = this.getContainer()
                        .get("transactionParams");
                }
                this.checkModel(fn, type, model, objModel, params);
            }
            return this;
        };
        /**
         *
         */
        EntityManager.prototype.checkModel = function (fn, type, model, objModel, params) {
            if (objModel instanceof ModelData.AjaxModelPersistent) {
                var data = objModel.getData();
                if (objModel.getAjaxInit() == null) {
                    this.setResponseAjax(fn, type, model, objModel, params);
                }
                else {
                    this.setResponseStatic(fn, objModel, type, model, params);
                }
            }
            else {
                if (objModel instanceof ModelData.AjaxModel) {
                    this.setResponseAjax(fn, type, model, objModel, params);
                }
                else {
                    if (objModel instanceof ModelData.StaticModel) {
                        this.setResponseStatic(fn, objModel, type, model, params);
                    }
                }
            }
        };
        /**
         *
         */
        EntityManager.prototype.setResponseAjax = function (fn, type, model, objModel, params) {
            this.ajax.response(function (response) {
                return fn(this.setResponse(response, objModel, type, model, params));
            }.bind(this));
            this.ajax.send();
        };
        /**
         *
         */
        EntityManager.prototype.setResponseStatic = function (fn, objModel, type, model, params) {
            fn(this.setResponse(objModel.getData(), objModel, type, model, params));
        };
        /**
         *
         */
        EntityManager.prototype.setResponse = function (data, objModel, type, model, params) {
            var resultSet = new Array();
            switch (type) {
                case "count":
                case "findOne":
                    resultSet = this.getResultSet(data, params, model, objModel);
                    if (resultSet != false) {
                        resultSet = resultSet[0];
                    }
                    break;
                case "find":
                    resultSet = this.getResultSet(data, params, model, objModel);
                    break;
                case "save":
                    resultSet = data;
                    break;
            }
            return resultSet;
        };
        /**
         *
         */
        EntityManager.prototype.getResultSet = function (response, params, model, objModel) {
            var resultSet = new Array();
            var hydrator = new Persistence.Hydrator;
            var filters = new Persistence.Filter;
            filters.buildCondition(params);
            var data = new Array();
            if (objModel instanceof ModelData.AjaxModelPersistent) {
                if (objModel.getAjaxInit() == null) {
                    objModel.setAjaxInit(true);
                    objModel.setData(response);
                }
                data = filters.getMultipleRowValues(response, false);
            }
            else if (objModel instanceof ModelData.AjaxModel) {
                data = filters.getMultipleRowValues(response, false);
            }
            else {
                data = filters.getMultipleRowValues(response);
            }
            var i = 0;
            for (var key in data) {
                var newModel = hydrator.hydrate(model, data[key]);
                if (newModel instanceof ModelData.StaticModel) {
                    newModel.setIndex(i);
                }
                resultSet.push(newModel);
                i++;
            }
            if (resultSet.length == 0) {
                resultSet = false;
            }
            return resultSet;
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
    Persistence.EntityManager = EntityManager;
})(Persistence || (Persistence = {}));
var Persistence;
(function (Persistence) {
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
    Persistence.Sort = Sort;
})(Persistence || (Persistence = {}));
var Reflection;
(function (Reflection) {
    var Checksum = (function () {
        /**
         *
         */
        function Checksum(obj) {
            /**
             *
             */
            this.toObj = {};
            this.toObj = obj;
        }
        Checksum.prototype.utf8ToBase64 = function (str) {
            return window.btoa(encodeURIComponent(str));
        };
        /**
         *
         */
        Checksum.prototype.getChecksum = function () {
            return this.toObj;
        };
        return Checksum;
    }());
    Reflection.Checksum = Checksum;
})(Reflection || (Reflection = {}));
/// <reference path="../Persistence/EntityManager" />
/// <reference path="../Persistence/Hydrator" />
/// <reference path="../Network/Ajax" />
var Service;
/// <reference path="../Persistence/EntityManager" />
/// <reference path="../Persistence/Hydrator" />
/// <reference path="../Network/Ajax" />
(function (Service) {
    var FactoryDefault = (function (_super) {
        __extends(FactoryDefault, _super);
        function FactoryDefault() {
            var _this = _super.call(this) || this;
            _this.set("ajax", new Network.Ajax);
            _this.set("container", new Service.Container);
            var em = new Persistence.EntityManager;
            em.setDi(_this);
            _this.set("em", em);
            return _this;
        }
        return FactoryDefault;
    }(Service.Container));
    Service.FactoryDefault = FactoryDefault;
})(Service || (Service = {}));
/// <reference path="../Service/Container.ts" />
var Url;
/// <reference path="../Service/Container.ts" />
(function (Url_1) {
    var Url = (function (_super) {
        __extends(Url, _super);
        function Url() {
            return _super.apply(this, arguments) || this;
        }
        Url.prototype.getQuery = function (url) {
            if (url === void 0) { url = false; }
            if (url == false) {
                url = document.URL;
            }
            var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
            var obj = {};
            if (queryString) {
                queryString = queryString.split('#')[0];
                var arr = queryString.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var a = arr[i].split('=');
                    var paramNum = undefined;
                    var paramName = a[0].replace(/\[\d*\]/, function (v) {
                        paramNum = v.slice(1, -1);
                        return '';
                    });
                    var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                    if (obj[paramName]) {
                        if (typeof obj[paramName] === 'string') {
                            obj[paramName] = [obj[paramName]];
                        }
                        if (typeof paramNum === 'undefined') {
                            obj[paramName].push(paramValue);
                        }
                        else {
                            obj[paramName][paramNum] = paramValue;
                        }
                    }
                    else {
                        obj[paramName] = paramValue;
                    }
                }
            }
            return obj;
        };
        return Url;
    }(Service.Container));
    Url_1.Url = Url;
})(Url || (Url = {}));
///<reference path="./ViewAdapter.ts"/>
var View;
///<reference path="./ViewAdapter.ts"/>
(function (View) {
    /**
     *
     * @type
     */
    var ViewElement = (function () {
        /**
         *
         * @param  {string} name [description]
         * @return {[type]}      [description]
         */
        function ViewElement(name, newClone) {
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
            else if (typeof name.target != "undefined") {
                this.element = name.target;
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
        ViewElement.prototype.getArguments = function (args) {
            if (typeof args == "object") {
                var argsTemp = new Array();
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != "atmpnil" && !(args[i] instanceof View.Controller)) {
                        argsTemp.push(args[i]);
                    }
                }
                return argsTemp;
            }
            else {
                return [];
            }
        };
        /**
         *
         */
        ViewElement.prototype.setArgs = function (args) {
            this.args = args;
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.getArgs = function () {
            return this.args;
        };
        /**
         *
         */
        ViewElement.prototype.initialize = function () {
        };
        /**
         *
         */
        ViewElement.prototype.getContext = function () {
            return this.context;
        };
        /**
         *
         */
        ViewElement.prototype.setContext = function (ctx) {
            this.context = ctx;
        };
        /**
         *
         */
        ViewElement.prototype.setElement = function (element) {
            this.element = element;
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.show = function () {
            this.element.style.display = "block";
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.hide = function () {
            this.element.style.display = "none";
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.getById = function (id) {
            if (document.getElementById(id)) {
                var adapter = new View.ViewAdapter(document.getElementById(id));
                if (!adapter) {
                    return false;
                }
                return adapter.get(this.getContext());
            }
            else {
                return false;
            }
        };
        /**
         *
         */
        ViewElement.prototype.getByTag = function (name) {
            var elements = document.getElementsByTagName(name);
            var result = new Array();
            for (var key in elements) {
                var adapter = new View.ViewAdapter(elements[key]);
                result.push(adapter.get(this.getContext()));
            }
            if (result.length == 1) {
                return result[0];
            }
            return result;
        };
        /**
         *
         */
        ViewElement.prototype.getByClass = function (name) {
            var elements = document.getElementsByClassName(name);
            var result = new Array();
            for (var key in elements) {
                var adapter = new View.ViewAdapter(elements[key]);
                result.push(adapter.get(this.getContext()));
            }
            if (result.length == 1) {
                return result[0];
            }
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.create = function (tag) {
            this.element = this.init(tag, this.id);
            return this;
        };
        /**
         * Create html component like jquery object
         *
         * @param  {string} element [description]
         * @param  {string} name    [description]
         * @return ViewElement
         */
        ViewElement.prototype.init = function (element, name) {
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
        ViewElement.prototype.getType = function () {
            return this.className;
        };
        /**
         *
         * @param  {string} class [description]
         * @return {[type]}       [description]
         */
        ViewElement.prototype.class = function (attrClass) {
            this.element.setAttribute("class", attrClass);
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.addClass = function (attrClass) {
            var strClass = this.element.getAttribute("class");
            strClass += " " + attrClass;
            this.element.setAttribute("class", strClass);
            return this;
        };
        /**
         * Set inner html throught
         */
        ViewElement.prototype.setInnerHtml = function (html) {
            this.element.innerHTML = html;
            return this.element;
        };
        /**
         *
         */
        ViewElement.prototype.getAttribute = function (attr) {
            return this.element.getAttribute(attr);
        };
        /**
         *
         * @return {[type]} [description]
         */
        ViewElement.prototype.addChild = function (element) {
            this.element.append(element);
            return this;
        };
        /**
         * [click description]
         * @param  {Function} fn [description]
         * @return {[type]}      [description]
         */
        ViewElement.prototype.click = function (fn) {
            this.element.addEventListener("click", fn.bind(this));
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.doubleClick = function (fn) {
            this.element.addEventListener("dblclick", fn.bind(this));
            return this;
        };
        /**
         *
         * @return {[type]} [description]
         */
        ViewElement.prototype.change = function (fn) {
            this.element.addEventListener("change", fn.bind(this));
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.keypress = function (fn) {
            this.element.addEventListener("keypress", fn.bind(this));
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.keydown = function (fn) {
            this.element.addEventListener("keydown", fn.bind(this));
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.keyup = function (fn) {
            this.element.addEventListener("keyup", fn.bind(this));
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.blur = function (fn) {
            this.element.addEventListener("blur", fn.bind(this));
            return this;
        };
        /**
         * [change description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.focus = function (fn) {
            this.element.addEventListener("focus", fn.bind(this));
            return this;
        };
        ViewElement.prototype.destroyEvent = function (event) {
            var nameEvent = "on" + event;
            this.element.removeEventListener("click", this.element.nameEvent);
        };
        /**
         *
         */
        ViewElement.prototype.removeAttr = function (attr) {
            this.element.removeAttribute(attr);
            return this;
        };
        /**
         * [get description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.getElement = function () {
            return this.element;
        };
        /**
         * Append elements
         * @param value append
         * @return this
         */
        ViewElement.prototype.append = function (append) {
            if (Array.isArray(append) || (append instanceof HTMLCollection)) {
                for (var key in append) {
                    this.checkAppendValue(append[key]);
                }
            }
            else {
                this.checkAppendValue(append);
            }
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.data = function (key, value) {
            if (value === void 0) { value = false; }
            if (value) {
                this.getElement().data(key, value);
            }
            else {
                this.getElement().data(key);
            }
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.checkAppendValue = function (append) {
            switch (typeof append) {
                case "string":
                    this.element.appendChild(document.createTextNode(append));
                    break;
                case "number":
                    this.element.appendChild(document.createTextNode(append.toString()));
                    break;
                case "object":
                    if (append instanceof View.ViewElement) {
                        this.verifyElement(append.getElement());
                    }
                    else {
                        this.verifyElement(append);
                    }
                    break;
                default:
                    break;
            }
        };
        /**
         *
         * @param  html [description]
         * @return
         */
        ViewElement.prototype.html = function (html) {
            if (html === void 0) { html = null; }
            if (html != null) {
                this.removeChildNodes();
                this.append(html);
                return this;
            }
            else {
                return this.element.innerHTML;
            }
        };
        /**
         *
         */
        ViewElement.prototype.verifyElement = function (append, type) {
            if (type === void 0) { type = "append"; }
            if (this.element instanceof HTMLCollection) {
                for (var key in this.element) {
                    if (typeof this.element[key].nodeType != "undefined") {
                        if (this.element[key].nodeType == 1) {
                            this.element[key].appendChild(append);
                        }
                    }
                }
            }
            else {
                this.element.appendChild(append);
            }
        };
        /**
         *
         */
        ViewElement.prototype.removeChildNodes = function () {
            if (this.element instanceof HTMLCollection) {
                for (var key in this.element) {
                    this.removeChilds(this.element[key], this.element[key].childNodes);
                }
            }
            else {
                this.removeChilds(this.element, this.element.childNodes);
            }
        };
        /**
         *
         */
        ViewElement.prototype.removeChilds = function (element, childs) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        };
        /**
         *
         * @param attr
         * @return
         */
        ViewElement.prototype.attr = function (attr, value) {
            if (value === void 0) { value = false; }
            if (typeof attr == "object" && value == false) {
                for (var key in attr) {
                    this.element.setAttribute(key, attr[key]);
                }
            }
            else if (typeof attr == "string" && value != false) {
                this.element.setAttribute(attr, value);
            }
            else if (typeof attr == "string" && value == false) {
                return this.element.getAttribute(attr);
            }
            return this;
        };
        /**
         * [css description]
         * @param   css [description]
         * @return
         */
        ViewElement.prototype.css = function (css, value) {
            if (value === void 0) { value = null; }
            if (typeof css == "object") {
                for (var key in css) {
                    this.element.style[key] = css[key];
                }
            }
            else if (typeof css == "string" && value != null) {
                this.element.style[css] = value;
            }
            else if (typeof css == "string" && value == null) {
                return this.element.style[css];
            }
            return this;
        };
        /**
         *
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        ViewElement.prototype.unbind = function (event) {
            this.element.destroyEvent(event);
            return this;
        };
        /**
         * [getClassName description]
         * @return {[type]} [description]
         */
        ViewElement.prototype.getClassName = function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(this["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        /**
         * [validateAndSet description]
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        ViewElement.prototype.validateAndSet = function (config) {
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
        ViewElement.prototype.clone = function (newIdentify) {
            if (newIdentify === void 0) { newIdentify = ""; }
            var newElement = this.element.clone();
            return new ViewElement(newIdentify, newElement[0]);
        };
        /**
         *
         * @param  {any = null}        val [description]
         * @return {[type]}   [description]
         */
        ViewElement.prototype.val = function (val) {
            if (val === void 0) { val = false; }
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
        ViewElement.prototype.text = function (text) {
            if (text === void 0) { text = false; }
            if (text) {
                this.element.innerHtml = text;
                return this;
            }
            else {
                return this.element.innerHtml;
            }
        };
        /**
         *
         */
        ViewElement.prototype.empty = function () {
            this.removeChildNodes();
        };
        /**
         *
         */
        ViewElement.prototype.getChilds = function () {
            var childNodes = this.element.childNodes;
            var childs = new Array();
            for (var key in childNodes) {
                if (childNodes[key].nodeType == 1) {
                    var adapter = new View.ViewAdapter(childNodes[key]);
                    childs.push(adapter.get(this.getContext()));
                }
            }
            return childs;
        };
        /**
         *
         */
        ViewElement.prototype.getAsObject = function () {
            var childs = this.element.childNodes;
            var obj = new Array();
            if (childs instanceof NodeList) {
                for (var key in childs) {
                    if (typeof childs[key].nodeType != "undefined") {
                        switch (childs[key].nodeType) {
                            case Node.ELEMENT_NODE:
                                var adapter = new View.ViewAdapter(childs[key]);
                                var auxElement = adapter.get(this.getContext());
                                var finalObj = {};
                                var auxObject = auxElement.getAsObject();
                                finalObj[auxElement.getClassName().toLowerCase()] = auxObject;
                                if (auxObject.length > 0) {
                                    obj.push(finalObj);
                                }
                                break;
                            case Node.TEXT_NODE:
                                obj.push(childs[key].nodeValue);
                                break;
                        }
                    }
                }
            }
            return obj;
        };
        /**
         *
         */
        ViewElement.prototype.getAsJson = function () {
            var objects = this.getAsObject();
            return JSON.stringify(objects);
        };
        /**
         *
         */
        ViewElement.prototype.getRandomString = function () {
            var randomStr = Helper.MathHelper.getUUID();
            return btoa(randomStr);
        };
        /**
         *
         */
        ViewElement.prototype.remove = function (element) {
            if (element === void 0) { element = false; }
            if (element) {
                this.getElement().removeChild(element);
            }
            else {
                this.getElement().parentElement.removeChild(this.getElement());
            }
        };
        /**
         *
         */
        ViewElement.prototype.setId = function (id) {
            this.attr("id", "id");
            return this;
        };
        /**
         *
         */
        ViewElement.prototype.getId = function () {
            return this.attr("id");
        };
        /**
         *
         */
        ViewElement.prototype.setDi = function (di) {
            this.di = di;
        };
        /**
         *
         */
        ViewElement.prototype.getDi = function () {
            return this.di;
        };
        return ViewElement;
    }());
    View.ViewElement = ViewElement;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     *
     */
    var A = (function (_super) {
        __extends(A, _super);
        /**
         *
         */
        function A(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("a");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.href("");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        A.prototype.favIcon = function (favIcon) {
            var icon = new View.I(this.getContext())
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
    }(View.ViewElement));
    View.A = A;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Abbr = (function (_super) {
        __extends(Abbr, _super);
        /**
         *
         */
        function Abbr(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("abbr");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Abbr;
    }(View.ViewElement));
    View.Abbr = Abbr;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Address = (function (_super) {
        __extends(Address, _super);
        /**
         *
         */
        function Address(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("address");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Address;
    }(View.ViewElement));
    View.Address = Address;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Area = (function (_super) {
        __extends(Area, _super);
        /**
         *
         */
        function Area(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("area");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Area;
    }(View.ViewElement));
    View.Area = Area;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Article = (function (_super) {
        __extends(Article, _super);
        /**
         *
         */
        function Article(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("article");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Article;
    }(View.ViewElement));
    View.Article = Article;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Aside = (function (_super) {
        __extends(Aside, _super);
        /**
         *
         */
        function Aside(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("aside");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Aside;
    }(View.ViewElement));
    View.Aside = Aside;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Audio = (function (_super) {
        __extends(Audio, _super);
        /**
         *
         */
        function Audio(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("aside");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Audio;
    }(View.ViewElement));
    View.Audio = Audio;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var B = (function (_super) {
        __extends(B, _super);
        /**
         *
         */
        function B(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("b");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return B;
    }(View.ViewElement));
    View.B = B;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Base = (function (_super) {
        __extends(Base, _super);
        /**
         *
         */
        function Base(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("base");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Base;
    }(View.ViewElement));
    View.Base = Base;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Bdi = (function (_super) {
        __extends(Bdi, _super);
        /**
         *
         */
        function Bdi(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("bdi");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Bdi;
    }(View.ViewElement));
    View.Bdi = Bdi;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Bdo = (function (_super) {
        __extends(Bdo, _super);
        /**
         *
         */
        function Bdo(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("bdo");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Bdo;
    }(View.ViewElement));
    View.Bdo = Bdo;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Blockquote = (function (_super) {
        __extends(Blockquote, _super);
        /**
         *
         */
        function Blockquote(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("blockquote");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Blockquote;
    }(View.ViewElement));
    View.Blockquote = Blockquote;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.element = document.body;
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Body;
    }(View.ViewElement));
    View.Body = Body;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Br = (function (_super) {
        __extends(Br, _super);
        /**
         *
         */
        function Br(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("br");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Br;
    }(View.ViewElement));
    View.Br = Br;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     *
     */
    var Button = (function (_super) {
        __extends(Button, _super);
        /**
         *
         */
        function Button(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("button");
            _this.attr("type", "button");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        /**
         *
         * @param
         * @return
         */
        Button.prototype.type = function (type) {
            this.attr("type", type);
            return this;
        };
        /**
         *
         * @return
         */
        Button.prototype.favIcon = function (favIcon) {
            var icon = new View.I(this.getContext())
                .class(favIcon);
            this.append(icon);
            return this;
        };
        /**
         *
         * @return
         */
        Button.prototype.success = function () {
            this.addClass("btn btn-success");
            return this;
        };
        /**
         *
         * @return
         */
        Button.prototype.notice = function () {
            this.addClass("btn btn-notice");
            return this;
        };
        /**
         *
         * @return
         */
        Button.prototype.default = function () {
            this.addClass("btn btn-default");
            return this;
        };
        /**
         *
         * @return
         */
        Button.prototype.primary = function () {
            this.addClass("btn btn-primary");
            return this;
        };
        /**
         * [warning description]
         * @return {[type]} [description]
         */
        Button.prototype.warning = function () {
            this.addClass("btn btn-warning");
            return this;
        };
        /**
         * [danger description]
         * @return {[type]} [description]
         */
        Button.prototype.danger = function () {
            this.addClass("btn btn-danger");
            return this;
        };
        return Button;
    }(View.ViewElement));
    View.Button = Button;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Canvas = (function (_super) {
        __extends(Canvas, _super);
        /**
         *
         */
        function Canvas(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("canvas");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Canvas;
    }(View.ViewElement));
    View.Canvas = Canvas;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Caption = (function (_super) {
        __extends(Caption, _super);
        /**
         *
         */
        function Caption(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("caption");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Caption;
    }(View.ViewElement));
    View.Caption = Caption;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Cite = (function (_super) {
        __extends(Cite, _super);
        /**
         *
         */
        function Cite(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("cite");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Cite;
    }(View.ViewElement));
    View.Cite = Cite;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Code = (function (_super) {
        __extends(Code, _super);
        /**
         *
         */
        function Code(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("code");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Code;
    }(View.ViewElement));
    View.Code = Code;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Col = (function (_super) {
        __extends(Col, _super);
        /**
         *
         */
        function Col(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("col");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Col;
    }(View.ViewElement));
    View.Col = Col;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var ColGroup = (function (_super) {
        __extends(ColGroup, _super);
        /**
         *
         */
        function ColGroup(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("colgroup");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return ColGroup;
    }(View.ViewElement));
    View.ColGroup = ColGroup;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Datalist = (function (_super) {
        __extends(Datalist, _super);
        /**
         *
         */
        function Datalist(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("datalist");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Datalist;
    }(View.ViewElement));
    View.Datalist = Datalist;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Db = (function (_super) {
        __extends(Db, _super);
        /**
         *
         */
        function Db(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("db");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Db;
    }(View.ViewElement));
    View.Db = Db;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Del = (function (_super) {
        __extends(Del, _super);
        /**
         *
         */
        function Del(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("del");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Del;
    }(View.ViewElement));
    View.Del = Del;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Details = (function (_super) {
        __extends(Details, _super);
        /**
         *
         */
        function Details(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("details");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Details;
    }(View.ViewElement));
    View.Details = Details;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Dfn = (function (_super) {
        __extends(Dfn, _super);
        /**
         *
         */
        function Dfn(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("dfn");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Dfn;
    }(View.ViewElement));
    View.Dfn = Dfn;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        /**
         *
         */
        function Dialog(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("dialog");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Dialog;
    }(View.ViewElement));
    View.Dialog = Dialog;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Div = (function (_super) {
        __extends(Div, _super);
        /**
         *
         */
        function Div(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("div");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Div;
    }(View.ViewElement));
    View.Div = Div;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Dl = (function (_super) {
        __extends(Dl, _super);
        /**
         *
         */
        function Dl(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("dl");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Dl;
    }(View.ViewElement));
    View.Dl = Dl;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Dt = (function (_super) {
        __extends(Dt, _super);
        /**
         *
         */
        function Dt(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("dt");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Dt;
    }(View.ViewElement));
    View.Dt = Dt;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Em = (function (_super) {
        __extends(Em, _super);
        /**
         *
         */
        function Em(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("em");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Em;
    }(View.ViewElement));
    View.Em = Em;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Embed = (function (_super) {
        __extends(Embed, _super);
        /**
         *
         */
        function Embed(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("embed");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Embed;
    }(View.ViewElement));
    View.Embed = Embed;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Fieldset = (function (_super) {
        __extends(Fieldset, _super);
        /**
         *
         */
        function Fieldset(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("fieldset");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Fieldset;
    }(View.ViewElement));
    View.Fieldset = Fieldset;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Figcaption = (function (_super) {
        __extends(Figcaption, _super);
        /**
         *
         */
        function Figcaption(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("figcaption");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Figcaption;
    }(View.ViewElement));
    View.Figcaption = Figcaption;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Figure = (function (_super) {
        __extends(Figure, _super);
        /**
         *
         */
        function Figure(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("figure");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Figure;
    }(View.ViewElement));
    View.Figure = Figure;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Footer = (function (_super) {
        __extends(Footer, _super);
        /**
         *
         */
        function Footer(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("footer");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Footer;
    }(View.ViewElement));
    View.Footer = Footer;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Form = (function (_super) {
        __extends(Form, _super);
        /**
         *
         */
        function Form(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("form");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Form;
    }(View.ViewElement));
    View.Form = Form;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H1 = (function (_super) {
        __extends(H1, _super);
        /**
         *
         */
        function H1(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h1");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H1;
    }(View.ViewElement));
    View.H1 = H1;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H2 = (function (_super) {
        __extends(H2, _super);
        /**
         *
         */
        function H2(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h2");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H2;
    }(View.ViewElement));
    View.H2 = H2;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H3 = (function (_super) {
        __extends(H3, _super);
        /**
         *
         */
        function H3(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h3");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H3;
    }(View.ViewElement));
    View.H3 = H3;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H4 = (function (_super) {
        __extends(H4, _super);
        /**
         *
         */
        function H4(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h4");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H4;
    }(View.ViewElement));
    View.H4 = H4;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H5 = (function (_super) {
        __extends(H5, _super);
        /**
         *
         */
        function H5(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h5");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H5;
    }(View.ViewElement));
    View.H5 = H5;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var H6 = (function (_super) {
        __extends(H6, _super);
        /**
         *
         */
        function H6(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("h6");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return H6;
    }(View.ViewElement));
    View.H6 = H6;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Head = (function (_super) {
        __extends(Head, _super);
        /**
         *
         */
        function Head(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("head");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Head;
    }(View.ViewElement));
    View.Head = Head;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Header = (function (_super) {
        __extends(Header, _super);
        /**
         *
         */
        function Header(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("header");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Header;
    }(View.ViewElement));
    View.Header = Header;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var I = (function (_super) {
        __extends(I, _super);
        /**
         *
         */
        function I(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("i");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return I;
    }(View.ViewElement));
    View.I = I;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Iframe = (function (_super) {
        __extends(Iframe, _super);
        /**
         *
         */
        function Iframe(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("iframe");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Iframe;
    }(View.ViewElement));
    View.Iframe = Iframe;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Img = (function (_super) {
        __extends(Img, _super);
        /**
         *
         */
        function Img(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("img");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        Img.prototype.width = function (width) {
            this.element.style.width = width;
            return this;
        };
        Img.prototype.height = function (height) {
            this.element.style.width = height;
            return this;
        };
        Img.prototype.src = function (src) {
            this.attr("src", src);
            return this;
        };
        return Img;
    }(View.ViewElement));
    View.Img = Img;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [Input description]
     * @type {[type]}
     */
    var Input = (function (_super) {
        __extends(Input, _super);
        /**
         *
         */
        function Input(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("input");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        /**
         *
         */
        Input.prototype.getValue = function () {
            return this.element.value;
        };
        /**
         *
         */
        Input.prototype.setValue = function (value) {
            this.element.value = value;
            return this;
        };
        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        Input.prototype.type = function (type) {
            this.attr("type", type);
            return this;
        };
        return Input;
    }(View.ViewElement));
    View.Input = Input;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Ins = (function (_super) {
        __extends(Ins, _super);
        /**
         *
         */
        function Ins(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("ins");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Ins;
    }(View.ViewElement));
    View.Ins = Ins;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Kbd = (function (_super) {
        __extends(Kbd, _super);
        /**
         *
         */
        function Kbd(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("kbd");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Kbd;
    }(View.ViewElement));
    View.Kbd = Kbd;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Keygen = (function (_super) {
        __extends(Keygen, _super);
        /**
         *
         */
        function Keygen(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("keygen");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Keygen;
    }(View.ViewElement));
    View.Keygen = Keygen;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Label = (function (_super) {
        __extends(Label, _super);
        /**
         *
         */
        function Label(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("label");
            _this.setDi(ctx.getDi());
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Label;
    }(View.ViewElement));
    View.Label = Label;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Leyend = (function (_super) {
        __extends(Leyend, _super);
        /**
         *
         */
        function Leyend(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("leyend");
            if (!(ctx instanceof View.Controller)) {
                throw "Context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Leyend;
    }(View.ViewElement));
    View.Leyend = Leyend;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Li = (function (_super) {
        __extends(Li, _super);
        /**
         *
         */
        function Li(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("li");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Li;
    }(View.ViewElement));
    View.Li = Li;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Link = (function (_super) {
        __extends(Link, _super);
        /**
         *
         */
        function Link(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("li");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Link;
    }(View.ViewElement));
    View.Link = Link;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Main = (function (_super) {
        __extends(Main, _super);
        /**
         *
         */
        function Main(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("main");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Main;
    }(View.ViewElement));
    View.Main = Main;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Map = (function (_super) {
        __extends(Map, _super);
        /**
         *
         */
        function Map(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("map");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Map;
    }(View.ViewElement));
    View.Map = Map;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Menu = (function (_super) {
        __extends(Menu, _super);
        /**
         *
         */
        function Menu(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("menu");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Menu;
    }(View.ViewElement));
    View.Menu = Menu;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Menuitem = (function (_super) {
        __extends(Menuitem, _super);
        /**
         *
         */
        function Menuitem(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("menuitem");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Menuitem;
    }(View.ViewElement));
    View.Menuitem = Menuitem;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Meta = (function (_super) {
        __extends(Meta, _super);
        /**
         *
         */
        function Meta(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("meta");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Meta;
    }(View.ViewElement));
    View.Meta = Meta;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Meter = (function (_super) {
        __extends(Meter, _super);
        /**
         *
         */
        function Meter(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("meter");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Meter;
    }(View.ViewElement));
    View.Meter = Meter;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Nav = (function (_super) {
        __extends(Nav, _super);
        /**
         *
         */
        function Nav(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("nav");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Nav;
    }(View.ViewElement));
    View.Nav = Nav;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Noscrip = (function (_super) {
        __extends(Noscrip, _super);
        /**
         *
         */
        function Noscrip(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("noscrip");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Noscrip;
    }(View.ViewElement));
    View.Noscrip = Noscrip;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Object = (function (_super) {
        __extends(Object, _super);
        /**
         *
         */
        function Object(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("object");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Object;
    }(View.ViewElement));
    View.Object = Object;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Ol = (function (_super) {
        __extends(Ol, _super);
        /**
         *
         */
        function Ol(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("ol");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Ol;
    }(View.ViewElement));
    View.Ol = Ol;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Optgroup = (function (_super) {
        __extends(Optgroup, _super);
        /**
         *
         */
        function Optgroup(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("optgroup");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Optgroup;
    }(View.ViewElement));
    View.Optgroup = Optgroup;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     *
     * @type
     */
    var Option = (function (_super) {
        __extends(Option, _super);
        /**
         *
         */
        function Option(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("option");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        Option.prototype.setValue = function (val) {
            this.attr("value", val);
            return this;
        };
        /**
         *
         */
        Option.prototype.getValue = function () {
            return this.attr("value");
        };
        /**
         *
         */
        Option.prototype.setContent = function (content) {
            this.append(content);
            return this;
        };
        /**
         *
         */
        Option.prototype.getContent = function () {
            return this.getElement().text;
        };
        return Option;
    }(View.ViewElement));
    View.Option = Option;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Output = (function (_super) {
        __extends(Output, _super);
        /**
         *
         */
        function Output(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("output");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Output;
    }(View.ViewElement));
    View.Output = Output;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var P = (function (_super) {
        __extends(P, _super);
        /**
         *
         */
        function P(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("p");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return P;
    }(View.ViewElement));
    View.P = P;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Param = (function (_super) {
        __extends(Param, _super);
        /**
         *
         */
        function Param(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("param");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Param;
    }(View.ViewElement));
    View.Param = Param;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Pre = (function (_super) {
        __extends(Pre, _super);
        /**
         *
         */
        function Pre(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("pre");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Pre;
    }(View.ViewElement));
    View.Pre = Pre;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Progress = (function (_super) {
        __extends(Progress, _super);
        /**
         *
         */
        function Progress(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("progress");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Progress;
    }(View.ViewElement));
    View.Progress = Progress;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Q = (function (_super) {
        __extends(Q, _super);
        /**
         *
         */
        function Q(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("q");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Q;
    }(View.ViewElement));
    View.Q = Q;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Rp = (function (_super) {
        __extends(Rp, _super);
        /**
         *
         */
        function Rp(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("rp");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Rp;
    }(View.ViewElement));
    View.Rp = Rp;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Rt = (function (_super) {
        __extends(Rt, _super);
        /**
         *
         */
        function Rt(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("rt");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Rt;
    }(View.ViewElement));
    View.Rt = Rt;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Ruby = (function (_super) {
        __extends(Ruby, _super);
        /**
         *
         */
        function Ruby(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("ruby");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Ruby;
    }(View.ViewElement));
    View.Ruby = Ruby;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var S = (function (_super) {
        __extends(S, _super);
        /**
         *
         */
        function S(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("s");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return S;
    }(View.ViewElement));
    View.S = S;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Samp = (function (_super) {
        __extends(Samp, _super);
        /**
         *
         */
        function Samp(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("samp");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Samp;
    }(View.ViewElement));
    View.Samp = Samp;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Script = (function (_super) {
        __extends(Script, _super);
        /**
         *
         */
        function Script(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("script");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Script;
    }(View.ViewElement));
    View.Script = Script;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Section = (function (_super) {
        __extends(Section, _super);
        /**
         *
         */
        function Section(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("section");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Section;
    }(View.ViewElement));
    View.Section = Section;
})(View || (View = {}));
///<reference path="../ViewElement"/>
///<reference path="../../Model/RawModel"/>
var View;
///<reference path="../ViewElement"/>
///<reference path="../../Model/RawModel"/>
(function (View) {
    var Select = (function (_super) {
        __extends(Select, _super);
        /**
         *
         */
        function Select(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this, "") || this;
            _this.choose = "Choose...";
            _this.create("select");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        /**
         *
         */
        Select.prototype.getSelected = function () {
            var option = new View.Option(this.getContext());
            option.setElement(this.getElement().options[this.getElement().selectedIndex]);
            return option;
        };
        /**
         *
         */
        Select.prototype.setChoose = function (choose) {
            this.choose = choose;
        };
        /**
         *
         */
        Select.prototype.select = function (value) {
            var childs = this.getElement().childNodes;
            for (var key in childs) {
                if (childs[key].value == value) {
                    childs[key].setAttribute("selected", "selected");
                }
            }
        };
        /**
         *
         * @param  content
         * @return
         */
        Select.prototype.build = function (content, fields) {
            if (content instanceof ModelData.StaticModel) {
                content = JSON.parse(content.getData());
            }
            var i = 0;
            for (var key in content) {
                var option = new View.Option(this.getContext());
                var id = content[key][fields[0]];
                if (id === "") {
                    id = content[key][fields[1]];
                }
                option.attr({
                    "value": id
                });
                option.append(content[key][fields[1]]);
                this.append([
                    option
                ]);
                i++;
            }
            return this;
        };
        return Select;
    }(View.ViewElement));
    View.Select = Select;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Small = (function (_super) {
        __extends(Small, _super);
        /**
         *
         */
        function Small(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("small");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Small;
    }(View.ViewElement));
    View.Small = Small;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Source = (function (_super) {
        __extends(Source, _super);
        /**
         *
         */
        function Source(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("source");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Source;
    }(View.ViewElement));
    View.Source = Source;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Span = (function (_super) {
        __extends(Span, _super);
        /**
         *
         */
        function Span(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("span");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Span;
    }(View.ViewElement));
    View.Span = Span;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Strong = (function (_super) {
        __extends(Strong, _super);
        /**
         *
         */
        function Strong(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("strong");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Strong;
    }(View.ViewElement));
    View.Strong = Strong;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Style = (function (_super) {
        __extends(Style, _super);
        /**
         *
         */
        function Style(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("style");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Style;
    }(View.ViewElement));
    View.Style = Style;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Sub = (function (_super) {
        __extends(Sub, _super);
        /**
         *
         */
        function Sub(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("sub");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Sub;
    }(View.ViewElement));
    View.Sub = Sub;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [Table description]
     * @type {[type]}
     */
    var Table = (function (_super) {
        __extends(Table, _super);
        /**
         *
         */
        function Table(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.header = false;
            _this.create("table");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.thead = new View.Thead(_this.getContext());
            _this.tbody = new View.Tbody(_this.getContext());
            _this.tfoot = new View.Tfoot(_this.getContext());
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        /**
         *
         */
        Table.prototype.getThead = function () {
            return this.thead;
        };
        /**
         *
         */
        Table.prototype.getTbody = function () {
            return this.tbody;
        };
        /**
         *
         */
        Table.prototype.toHead = function (component) {
            this.thead.append(component);
            this.append(this.thead);
            return this;
        };
        /**
         *
         */
        Table.prototype.toHeadTr = function (component) {
            var tr = new View.Tr(this.getContext());
            tr.append(component);
            this.thead.append(tr);
            this.append(this.thead);
            return this;
        };
        /**
         *
         */
        Table.prototype.toBody = function (component) {
            this.tbody.append(component);
            this.append(this.tbody);
            return this;
        };
        /**
         *
         */
        Table.prototype.toFoot = function (component) {
            this.tfoot.append(component);
            this.append(this.tfoot);
            return this;
        };
        /**
         *
         */
        Table.prototype.toBodyTr = function (component) {
            var tr = new View.Tr(this.getContext());
            tr.append(component);
            this.tbody.append(tr);
            this.append(this.tbody);
            return this;
        };
        /**
         *
         */
        Table.prototype.toFootTr = function (component) {
            var tr = new View.Tr(this.getContext());
            tr.append(component);
            this.tfoot.append(tr);
            this.append(this.tfoot);
            return this;
        };
        /**
         *
         *
         */
        Table.prototype.setHeader = function (columns) {
            this.header = true;
            this.tr = new View.Tr(this.getContext());
            var i = 0;
            for (var key in columns) {
                var th = new View.Th(this.context);
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
            var html = new View.ViewElement();
            var i = 0;
            for (var key in content) {
                var trIdentify = Helper.StringHelper.sanitizeString(key) + this.id;
                var tr = new View.Tr(this.getContext());
                var header = new Array();
                var j = 0;
                for (var row in content[key]) {
                    header[j] = row;
                    var trIdentify2 = Helper.StringHelper.sanitizeString(key) + Helper.StringHelper.sanitizeString(row) + this.id;
                    var td = new View.Td(this.getContext());
                    if (!this.validateSystemKeys(row)) {
                        var contentRow = content[key][row];
                        var finalContent;
                        if (contentRow instanceof View.ViewElement) {
                            finalContent = contentRow.getElement();
                        }
                        else if (typeof contentRow == "object" && contentRow != null) {
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
                        tr.append(td);
                    }
                    if (typeof this.fnCContent === "function") {
                        this.fnCContent(td, j, content[key][row], row);
                        if (this.header === false) {
                            this.fnCHeader = this.fnCContent;
                        }
                    }
                    j++;
                }
                this.tbody.append(tr);
                i++;
            }
            if (this.header === false) {
                this.setHeader(header);
            }
            this.append(this.tbody);
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
    }(View.ViewElement));
    View.Table = Table;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Tbody = (function (_super) {
        __extends(Tbody, _super);
        /**
         *
         */
        function Tbody(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("tbody");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Tbody;
    }(View.ViewElement));
    View.Tbody = Tbody;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Td = (function (_super) {
        __extends(Td, _super);
        /**
         *
         */
        function Td(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("td");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
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
            return this;
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
            return this;
        };
        return Td;
    }(View.ViewElement));
    View.Td = Td;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Textarea = (function (_super) {
        __extends(Textarea, _super);
        /**
         *
         */
        function Textarea(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("textarea");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Textarea;
    }(View.ViewElement));
    View.Textarea = Textarea;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Tfoot = (function (_super) {
        __extends(Tfoot, _super);
        /**
         *
         */
        function Tfoot(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("tfoot");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Tfoot;
    }(View.ViewElement));
    View.Tfoot = Tfoot;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Th = (function (_super) {
        __extends(Th, _super);
        /**
         *
         */
        function Th(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("th");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
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
            return this;
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
            return this;
        };
        return Th;
    }(View.ViewElement));
    View.Th = Th;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Thead = (function (_super) {
        __extends(Thead, _super);
        /**
         *
         */
        function Thead(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("thead");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Thead;
    }(View.ViewElement));
    View.Thead = Thead;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Time = (function (_super) {
        __extends(Time, _super);
        /**
         *
         */
        function Time(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("time");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Time;
    }(View.ViewElement));
    View.Time = Time;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Title = (function (_super) {
        __extends(Title, _super);
        /**
         *
         */
        function Title(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("title");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Title;
    }(View.ViewElement));
    View.Title = Title;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Tr = (function (_super) {
        __extends(Tr, _super);
        /**
         *
         */
        function Tr(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("tr");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Tr;
    }(View.ViewElement));
    View.Tr = Tr;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Track = (function (_super) {
        __extends(Track, _super);
        /**
         *
         */
        function Track(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("track");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Track;
    }(View.ViewElement));
    View.Track = Track;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var U = (function (_super) {
        __extends(U, _super);
        /**
         *
         */
        function U(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("u");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return U;
    }(View.ViewElement));
    View.U = U;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Ul = (function (_super) {
        __extends(Ul, _super);
        /**
         *
         */
        function Ul(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("ul");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Ul;
    }(View.ViewElement));
    View.Ul = Ul;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Var = (function (_super) {
        __extends(Var, _super);
        /**
         *
         */
        function Var(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("var");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Var;
    }(View.ViewElement));
    View.Var = Var;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Video = (function (_super) {
        __extends(Video, _super);
        /**
         *
         */
        function Video(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("video");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Video;
    }(View.ViewElement));
    View.Video = Video;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Wbr = (function (_super) {
        __extends(Wbr, _super);
        /**
         *
         */
        function Wbr(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("wbr");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Wbr;
    }(View.ViewElement));
    View.Wbr = Wbr;
})(View || (View = {}));
///<reference path="./Elements/A"/>
///<reference path="./Elements/Abbr"/>
///<reference path="./Elements/Address"/>
///<reference path="./Elements/Area"/>
///<reference path="./Elements/Article"/>
///<reference path="./Elements/Aside"/>
///<reference path="./Elements/Audio"/>
///<reference path="./Elements/B"/>
///<reference path="./Elements/Base"/>
///<reference path="./Elements/Bdi"/>
///<reference path="./Elements/Bdo"/>
///<reference path="./Elements/Blockquote"/>
///<reference path="./Elements/Body"/>
///<reference path="./Elements/Br"/>
///<reference path="./Elements/Button"/>
///<reference path="./Elements/Canvas"/>
///<reference path="./Elements/Caption"/>
///<reference path="./Elements/Cite"/>
///<reference path="./Elements/Code"/>
///<reference path="./Elements/Col"/>
///<reference path="./Elements/ColGroup"/>
///<reference path="./Elements/Datalist"/>
///<reference path="./Elements/Db"/>
///<reference path="./Elements/Del"/>
///<reference path="./Elements/Details"/>
///<reference path="./Elements/Dfn"/>
///<reference path="./Elements/Dialog"/>
///<reference path="./Elements/Div"/>
///<reference path="./Elements/Dl"/>
///<reference path="./Elements/Dt"/>
///<reference path="./Elements/Em"/>
///<reference path="./Elements/Embed"/>
///<reference path="./Elements/Fieldset"/>
///<reference path="./Elements/Figcaption"/>
///<reference path="./Elements/Figure"/>
///<reference path="./Elements/Footer"/>
///<reference path="./Elements/Form"/>
///<reference path="./Elements/H1"/>
///<reference path="./Elements/H2"/>
///<reference path="./Elements/H3"/>
///<reference path="./Elements/H4"/>
///<reference path="./Elements/H5"/>
///<reference path="./Elements/H6"/>
///<reference path="./Elements/Head"/>
///<reference path="./Elements/Header"/>
///<reference path="./Elements/I"/>
///<reference path="./Elements/Iframe"/>
///<reference path="./Elements/Img"/>
///<reference path="./Elements/Input"/>
///<reference path="./Elements/Ins"/>
///<reference path="./Elements/Kbd"/>
///<reference path="./Elements/Keygen"/>
///<reference path="./Elements/Label"/>
///<reference path="./Elements/Leyend"/>
///<reference path="./Elements/Li"/>
///<reference path="./Elements/Link"/>
///<reference path="./Elements/Main"/>
///<reference path="./Elements/Map"/>
///<reference path="./Elements/Menu"/>
///<reference path="./Elements/MenuItem"/>
///<reference path="./Elements/Meta"/>
///<reference path="./Elements/Meter"/>
///<reference path="./Elements/Nav"/>
///<reference path="./Elements/Noscrip"/>
///<reference path="./Elements/Object"/>
///<reference path="./Elements/Ol"/>
///<reference path="./Elements/Optgroup"/>
///<reference path="./Elements/Option"/>
///<reference path="./Elements/Output"/>
///<reference path="./Elements/P"/>
///<reference path="./Elements/Param"/>
///<reference path="./Elements/Pre"/>
///<reference path="./Elements/Progress"/>
///<reference path="./Elements/Q"/>
///<reference path="./Elements/Rp"/>
///<reference path="./Elements/Rt"/>
///<reference path="./Elements/Ruby"/>
///<reference path="./Elements/S"/>
///<reference path="./Elements/Samp"/>
///<reference path="./Elements/Script"/>
///<reference path="./Elements/Section"/>
///<reference path="./Elements/Select"/>
///<reference path="./Elements/Small"/>
///<reference path="./Elements/Source"/>
///<reference path="./Elements/Span"/>
///<reference path="./Elements/Strong"/>
///<reference path="./Elements/Style"/>
///<reference path="./Elements/Sub"/>
///<reference path="./Elements/Table"/>
///<reference path="./Elements/Tbody"/>
///<reference path="./Elements/Td"/>
///<reference path="./Elements/Textarea"/>
///<reference path="./Elements/Tfoot"/>
///<reference path="./Elements/Th"/>
///<reference path="./Elements/Thead"/>
///<reference path="./Elements/Time"/>
///<reference path="./Elements/Title"/>
///<reference path="./Elements/Tr"/>
///<reference path="./Elements/Track"/>
///<reference path="./Elements/U"/>
///<reference path="./Elements/Ul"/>
///<reference path="./Elements/Var"/>
///<reference path="./Elements/Video"/>
///<reference path="./Elements/Wbr"/>
var View;
///<reference path="./Elements/A"/>
///<reference path="./Elements/Abbr"/>
///<reference path="./Elements/Address"/>
///<reference path="./Elements/Area"/>
///<reference path="./Elements/Article"/>
///<reference path="./Elements/Aside"/>
///<reference path="./Elements/Audio"/>
///<reference path="./Elements/B"/>
///<reference path="./Elements/Base"/>
///<reference path="./Elements/Bdi"/>
///<reference path="./Elements/Bdo"/>
///<reference path="./Elements/Blockquote"/>
///<reference path="./Elements/Body"/>
///<reference path="./Elements/Br"/>
///<reference path="./Elements/Button"/>
///<reference path="./Elements/Canvas"/>
///<reference path="./Elements/Caption"/>
///<reference path="./Elements/Cite"/>
///<reference path="./Elements/Code"/>
///<reference path="./Elements/Col"/>
///<reference path="./Elements/ColGroup"/>
///<reference path="./Elements/Datalist"/>
///<reference path="./Elements/Db"/>
///<reference path="./Elements/Del"/>
///<reference path="./Elements/Details"/>
///<reference path="./Elements/Dfn"/>
///<reference path="./Elements/Dialog"/>
///<reference path="./Elements/Div"/>
///<reference path="./Elements/Dl"/>
///<reference path="./Elements/Dt"/>
///<reference path="./Elements/Em"/>
///<reference path="./Elements/Embed"/>
///<reference path="./Elements/Fieldset"/>
///<reference path="./Elements/Figcaption"/>
///<reference path="./Elements/Figure"/>
///<reference path="./Elements/Footer"/>
///<reference path="./Elements/Form"/>
///<reference path="./Elements/H1"/>
///<reference path="./Elements/H2"/>
///<reference path="./Elements/H3"/>
///<reference path="./Elements/H4"/>
///<reference path="./Elements/H5"/>
///<reference path="./Elements/H6"/>
///<reference path="./Elements/Head"/>
///<reference path="./Elements/Header"/>
///<reference path="./Elements/I"/>
///<reference path="./Elements/Iframe"/>
///<reference path="./Elements/Img"/>
///<reference path="./Elements/Input"/>
///<reference path="./Elements/Ins"/>
///<reference path="./Elements/Kbd"/>
///<reference path="./Elements/Keygen"/>
///<reference path="./Elements/Label"/>
///<reference path="./Elements/Leyend"/>
///<reference path="./Elements/Li"/>
///<reference path="./Elements/Link"/>
///<reference path="./Elements/Main"/>
///<reference path="./Elements/Map"/>
///<reference path="./Elements/Menu"/>
///<reference path="./Elements/MenuItem"/>
///<reference path="./Elements/Meta"/>
///<reference path="./Elements/Meter"/>
///<reference path="./Elements/Nav"/>
///<reference path="./Elements/Noscrip"/>
///<reference path="./Elements/Object"/>
///<reference path="./Elements/Ol"/>
///<reference path="./Elements/Optgroup"/>
///<reference path="./Elements/Option"/>
///<reference path="./Elements/Output"/>
///<reference path="./Elements/P"/>
///<reference path="./Elements/Param"/>
///<reference path="./Elements/Pre"/>
///<reference path="./Elements/Progress"/>
///<reference path="./Elements/Q"/>
///<reference path="./Elements/Rp"/>
///<reference path="./Elements/Rt"/>
///<reference path="./Elements/Ruby"/>
///<reference path="./Elements/S"/>
///<reference path="./Elements/Samp"/>
///<reference path="./Elements/Script"/>
///<reference path="./Elements/Section"/>
///<reference path="./Elements/Select"/>
///<reference path="./Elements/Small"/>
///<reference path="./Elements/Source"/>
///<reference path="./Elements/Span"/>
///<reference path="./Elements/Strong"/>
///<reference path="./Elements/Style"/>
///<reference path="./Elements/Sub"/>
///<reference path="./Elements/Table"/>
///<reference path="./Elements/Tbody"/>
///<reference path="./Elements/Td"/>
///<reference path="./Elements/Textarea"/>
///<reference path="./Elements/Tfoot"/>
///<reference path="./Elements/Th"/>
///<reference path="./Elements/Thead"/>
///<reference path="./Elements/Time"/>
///<reference path="./Elements/Title"/>
///<reference path="./Elements/Tr"/>
///<reference path="./Elements/Track"/>
///<reference path="./Elements/U"/>
///<reference path="./Elements/Ul"/>
///<reference path="./Elements/Var"/>
///<reference path="./Elements/Video"/>
///<reference path="./Elements/Wbr"/>
(function (View) {
    var ViewAdapter = (function () {
        /**
         *
         */
        function ViewAdapter(element) {
            this.element = element;
        }
        /**
         *
         */
        ViewAdapter.prototype.get = function (context) {
            var instance;
            if (this.element) {
                if (typeof this.element.nodeName != "undefined") {
                    switch (this.element.nodeName) {
                        case "A":
                            instance = new View.A(context);
                            break;
                        case "ABBR":
                            instance = new View.Abbr(context);
                            break;
                        case "ADDRESS":
                            instance = new View.Address(context);
                            break;
                        case "AREA":
                            instance = new View.Area(context);
                            break;
                        case "ARTICLE":
                            instance = new View.Article(context);
                            break;
                        case "ASIDE":
                            instance = new View.Aside(context);
                            break;
                        case "AUDIO":
                            instance = new View.Audio(context);
                            break;
                        case "B":
                            instance = new View.B(context);
                            break;
                        case "BASE":
                            instance = new View.Base(context);
                            break;
                        case "BDI":
                            instance = new View.Bdi(context);
                            break;
                        case "BDO":
                            instance = new View.Bdo(context);
                            break;
                        case "BLOCKQUOTE":
                            instance = new View.Blockquote(context);
                            break;
                        case "BODY":
                            instance = new View.Body(context);
                            break;
                        case "BR":
                            instance = new View.Br(context);
                            break;
                        case "BUTTON":
                            instance = new View.Button(context);
                            break;
                        case "CANVAS":
                            instance = new View.Canvas(context);
                            break;
                        case "CAPTION":
                            instance = new View.Caption(context);
                            break;
                        case "CITE":
                            instance = new View.Cite(context);
                            break;
                        case "CODE":
                            instance = new View.Code(context);
                            break;
                        case "COL":
                            instance = new View.Col(context);
                            break;
                        case "COLGROUP":
                            instance = new View.ColGroup(context);
                            break;
                        case "DATALIST":
                            instance = new View.Datalist(context);
                            break;
                        case "DB":
                            instance = new View.Db(context);
                            break;
                        case "DEL":
                            instance = new View.Del(context);
                            break;
                        case "DETAILS":
                            instance = new View.Details(context);
                            break;
                        case "DFN":
                            instance = new View.Dfn(context);
                            break;
                        case "DIALOG":
                            instance = new View.Dialog(context);
                            break;
                        case "DIV":
                            instance = new View.Div(context);
                            break;
                        case "DL":
                            instance = new View.Dl(context);
                            break;
                        case "DT":
                            instance = new View.Dt(context);
                            break;
                        case "EM":
                            instance = new View.Em(context);
                            break;
                        case "EMBED":
                            instance = new View.Embed(context);
                            break;
                        case "FIELDSET":
                            instance = new View.Fieldset(context);
                            break;
                        case "FIGCAPTION":
                            instance = new View.Figcaption(context);
                            break;
                        case "FIGURE":
                            instance = new View.Figure(context);
                            break;
                        case "FOOTER":
                            instance = new View.Footer(context);
                            break;
                        case "FORM":
                            instance = new View.Form(context);
                            break;
                        case "H1":
                            instance = new View.H1(context);
                            break;
                        case "H2":
                            instance = new View.H2(context);
                            break;
                        case "H3":
                            instance = new View.H3(context);
                            break;
                        case "H4":
                            instance = new View.H4(context);
                            break;
                        case "H5":
                            instance = new View.H5(context);
                            break;
                        case "H6":
                            instance = new View.H6(context);
                            break;
                        case "HEAD":
                            instance = new View.Head(context);
                            break;
                        case "HEADER":
                            instance = new View.Header(context);
                            break;
                        case "I":
                            instance = new View.I(context);
                            break;
                        case "IFRAME":
                            instance = new View.Iframe(context);
                            break;
                        case "IMG":
                            instance = new View.Img(context);
                            break;
                        case "INPUT":
                            instance = new View.Input(context);
                            break;
                        case "INS":
                            instance = new View.Ins(context);
                            break;
                        case "KBD":
                            instance = new View.Kbd(context);
                            break;
                        case "KEYGEN":
                            instance = new View.Keygen(context);
                            break;
                        case "LABEL":
                            instance = new View.Label(context);
                            break;
                        case "LEYEND":
                            instance = new View.Leyend(context);
                            break;
                        case "LI":
                            instance = new View.Li(context);
                            break;
                        case "LINK":
                            instance = new View.Link(context);
                            break;
                        case "MAIN":
                            instance = new View.Main(context);
                            break;
                        case "MAP":
                            instance = new View.Map(context);
                            break;
                        case "MENU":
                            instance = new View.Menu(context);
                            break;
                        case "MENUITEM":
                            instance = new View.Menuitem(context);
                            break;
                        case "META":
                            instance = new View.Meta(context);
                            break;
                        case "META":
                            instance = new View.Meta(context);
                            break;
                        case "METER":
                            instance = new View.Meter(context);
                            break;
                        case "NAV":
                            instance = new View.Nav(context);
                            break;
                        case "NOSCRIP":
                            instance = new View.Noscrip(context);
                            break;
                        case "OBJECT":
                            instance = new View.Object(context);
                            break;
                        case "OL":
                            instance = new View.Ol(context);
                            break;
                        case "OPTGROUP":
                            instance = new View.Optgroup(context);
                            break;
                        case "P":
                            instance = new View.P(context);
                            break;
                        case "PARAM":
                            instance = new View.Param(context);
                            break;
                        case "PRE":
                            instance = new View.Pre(context);
                            break;
                        case "PROGRESS":
                            instance = new View.Progress(context);
                            break;
                        case "Q":
                            instance = new View.Q(context);
                            break;
                        case "RP":
                            instance = new View.Rp(context);
                            break;
                        case "RT":
                            instance = new View.Rt(context);
                            break;
                        case "RUBY":
                            instance = new View.Ruby(context);
                            break;
                        case "S":
                            instance = new View.S(context);
                            break;
                        case "SAMP":
                            instance = new View.Samp(context);
                            break;
                        case "SCRIPT":
                            instance = new View.Script(context);
                            break;
                        case "SECTION":
                            instance = new View.Section(context);
                            break;
                        case "SELECT":
                            instance = new View.Select(context);
                            break;
                        case "SMALL":
                            instance = new View.Small(context);
                            break;
                        case "SOURCE":
                            instance = new View.Source(context);
                            break;
                        case "SPAN":
                            instance = new View.Span(context);
                            break;
                        case "STRONG":
                            instance = new View.Strong(context);
                            break;
                        case "STYLE":
                            instance = new View.Style(context);
                            break;
                        case "SUB":
                            instance = new View.Sub(context);
                            break;
                        case "SUMMARY":
                            instance = new View.Summary(context);
                            break;
                        case "SUP":
                            instance = new View.Sup(context);
                            break;
                        case "TABLE":
                            instance = new View.Table(context);
                            break;
                        case "TBODY":
                            instance = new View.Tbody(context);
                            break;
                        case "TD":
                            instance = new View.Td(context);
                            break;
                        case "TEXTAREA":
                            instance = new View.Textarea(context);
                            break;
                        case "TFOOT":
                            instance = new View.Tfoot(context);
                            break;
                        case "TH":
                            instance = new View.Th(context);
                            break;
                        case "THEAD":
                            instance = new View.Thead(context);
                            break;
                        case "TIME":
                            instance = new View.Time(context);
                            break;
                        case "TITLE":
                            instance = new View.Title(context);
                            break;
                        case "TR":
                            instance = new View.Tr(context);
                            break;
                        case "TRACK":
                            instance = new View.Track(context);
                            break;
                        case "U":
                            instance = new View.U(context);
                            break;
                        case "UL":
                            instance = new View.Ul(context);
                            break;
                        case "VAR":
                            instance = new View.Var(context);
                            break;
                        case "VIDEO":
                            instance = new View.Video(context);
                            break;
                        case "WBR":
                            instance = new View.Wbr(context);
                            break;
                        default:
                            instance = new View.ViewElement();
                            instance.create(this.element.nodeName);
                            break;
                    }
                    instance.setElement(this.element);
                    return instance;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        return ViewAdapter;
    }());
    View.ViewAdapter = ViewAdapter;
})(View || (View = {}));
///<reference path="./ViewAdapter.ts"/>
///<reference path="../Url/Url.ts"/>
var View;
///<reference path="./ViewAdapter.ts"/>
///<reference path="../Url/Url.ts"/>
(function (View) {
    var Controller = (function () {
        function Controller() {
        }
        /**
         *
         */
        Controller.prototype.initialize = function () {
        };
        /**
         *
         */
        Controller.prototype.getById = function (id) {
            var adapter = new View.ViewAdapter(document.getElementById(id));
            return adapter.get(this);
        };
        /**
         *
         */
        Controller.prototype.getByTag = function (name) {
            var elements = document.getElementsByTagName(name);
            var result = new Array();
            for (var key in elements) {
                var adapter = new View.ViewAdapter(elements[key]);
                result.push(adapter.get(this));
            }
            if (result.length == 1) {
                return result[0];
            }
            return result;
        };
        /**
         *
         */
        Controller.prototype.getByClass = function (name) {
            var elements = document.getElementsByClassName(name);
            var result = new Array();
            for (var key in elements) {
                var adapter = new View.ViewAdapter(elements[key]);
                result.push(adapter.get(this));
            }
            if (result.length == 1) {
                return result[0];
            }
            return this;
        };
        /**
         *
         */
        Controller.prototype.getDi = function () {
            return this.di;
        };
        /**
         *
         */
        Controller.prototype.setDi = function (di) {
            this.di = di;
            this.em = this.di.get("em");
        };
        /**
         *
         */
        Controller.prototype.setUrl = function (url) {
            this.url = url;
        };
        /**
         *
         */
        Controller.prototype.getUrl = function () {
            return this.url;
        };
        return Controller;
    }());
    View.Controller = Controller;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Hr = (function (_super) {
        __extends(Hr, _super);
        /**
         *
         */
        function Hr(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("hr");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Hr;
    }(View.ViewElement));
    View.Hr = Hr;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Summary = (function (_super) {
        __extends(Summary, _super);
        /**
         *
         */
        function Summary(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("summary");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Summary;
    }(View.ViewElement));
    View.Summary = Summary;
})(View || (View = {}));
///<reference path="../ViewElement"/>
var View;
///<reference path="../ViewElement"/>
(function (View) {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    var Sup = (function (_super) {
        __extends(Sup, _super);
        /**
         *
         */
        function Sup(ctx, a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = "atmpnil"; }
            if (a2 === void 0) { a2 = "atmpnil"; }
            if (a3 === void 0) { a3 = "atmpnil"; }
            if (a4 === void 0) { a4 = "atmpnil"; }
            if (a5 === void 0) { a5 = "atmpnil"; }
            var _this = _super.call(this) || this;
            _this.create("sup");
            if (!(ctx instanceof View.Controller)) {
                throw "context must be instance of View.Controller to " + _this.getClassName();
            }
            _this.setContext(ctx);
            _this.setDi(ctx.getDi());
            _this.em = _this.getDi().get("em");
            _this.setArgs(_this.getArguments(arguments));
            _this.initialize();
            return _this;
        }
        return Sup;
    }(View.ViewElement));
    View.Sup = Sup;
})(View || (View = {}));
