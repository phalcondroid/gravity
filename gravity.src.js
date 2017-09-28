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
         * Set general config and environment
         *
         * @param Object config
         * @param Number env = Scope.Local
         */
        Config.prototype.setConfig = function (config, env) {
            if (env === void 0) { env = Environment.Scope.LOCAL; }
            this.config[env] = config;
        };
        /**
         * Get config was assigned
         *
         * @param Number env = Scope.Local
         * @return Object
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
var Gravity;
(function (Gravity) {
    var EventManager = (function () {
        function EventManager() {
            this.events = {};
        }
        EventManager.prototype.attach = function (controller, event) {
            this.events[controller][event];
        };
        EventManager.prototype.detach = function (controller, event) {
            this.events[controller][event];
        };
        EventManager.prototype.detachAll = function () {
        };
        EventManager.prototype.fire = function (controller, event, callback) {
        };
        EventManager.prototype.getListeners = function () {
        };
        return EventManager;
    }());
    Gravity.EventManager = EventManager;
})(Gravity || (Gravity = {}));
/// <reference path="./EventManagerInterface.ts"/>
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
///<reference path="./Environment/Scope.ts"/>
///<reference path="./Environment/Config.ts"/>
///<reference path="./Helper/ArrayHelper.ts"/>
var Gravity;
///<reference path="./Environment/Scope.ts"/>
///<reference path="./Environment/Config.ts"/>
///<reference path="./Helper/ArrayHelper.ts"/>
(function (Gravity) {
    var Application = (function () {
        /**
         *
         */
        function Application() {
            /**
             *
             */
            this.config = {};
            /**
             *
             */
            this.try = 0;
            /**
             *
             */
            this.env = Environment.Scope.LOCAL;
            /**
             *
             */
            this.catchErrors = function () { };
            /**
             *
             */
            this.domManager = new Gravity.View.DomManager;
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
                        if (temp instanceof Gravity.Mvc.Controller) {
                            temp.setDi(di);
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
                            var component = this.domManager.getById(key);
                            if (component) {
                                controller[key](component);
                            }
                        }
                        break;
                }
            }
            controller.inject();
        };
        /**
         *
         */
        Application.prototype.resolveServices = function (di, service) {
            new service().initialize(di);
        };
        Application.prototype.catch = function (fn) {
            this.catchErrors = fn;
            return this;
        };
        /**
         *
         */
        Application.prototype.start = function () {
            try {
                var di = new Service.FactoryDefault;
                this.resolveConfig(di);
            }
            catch (e) {
                this.catchErrors(e);
            }
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
/// <reference path="./RawModel.ts"/>
var ModelData;
/// <reference path="./RawModel.ts"/>
(function (ModelData) {
    var AjaxModel = (function (_super) {
        __extends(AjaxModel, _super);
        function AjaxModel() {
            var _this = _super.call(this) || this;
            _this.insertUrl = null;
            _this.deleteUrl = null;
            _this.updateUrl = null;
            _this.findUrl = null;
            _this.findOneUrl = null;
            _this.countUrl = null;
            _this.method = "POST";
            _this.initialize();
            return _this;
        }
        AjaxModel.prototype.setSource = function (data) {
            this.setInsertUrl(data.insert);
            this.setUpdateUrl(data.update);
            this.setInsertUrl(data.insert);
            this.setCountUrl(data.count);
            this.setFindOneUrl(data.findOne);
            this.setFindUrl(data.find);
        };
        AjaxModel.prototype.setInsertUrl = function (url) {
            this.insertUrl = url;
        };
        AjaxModel.prototype.setFindUrl = function (url) {
            this.findUrl = url;
        };
        AjaxModel.prototype.setFindOneUrl = function (url) {
            this.findOneUrl = url;
        };
        AjaxModel.prototype.setCountUrl = function (url) {
            this.countUrl = url;
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
var Builder;
(function (Builder) {
    var Transaction = (function () {
        function Transaction() {
        }
        Transaction.prototype.get = function (row) {
        };
        return Transaction;
    }());
    Builder.Transaction = Transaction;
})(Builder || (Builder = {}));
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="Transaction.ts"/>
(function (Builder) {
    var And = (function (_super) {
        __extends(And, _super);
        /**
         *
         * @param condition
         */
        function And(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        And.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] == this.condition[key]) {
                    result.push(true);
                }
            }
            if (result.length != size) {
                return false;
            }
            for (var i = 1; i <= size; i++) {
                if (result[i] == false) {
                    return false;
                }
            }
            return true;
        };
        return And;
    }(Builder.Transaction));
    Builder.And = And;
})(Builder || (Builder = {}));
var Builder;
(function (Builder) {
    var ComparisonOperators = (function () {
        function ComparisonOperators() {
        }
        return ComparisonOperators;
    }());
    ComparisonOperators.AND = "&&";
    ComparisonOperators.OR = "||";
    ComparisonOperators.EQUAL = "==";
    ComparisonOperators.DIFFERENT = "!=";
    Builder.ComparisonOperators = ComparisonOperators;
})(Builder || (Builder = {}));
var Builder;
(function (Builder) {
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
    Builder.DataType = DataType;
})(Builder || (Builder = {}));
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="Transaction.ts"/>
(function (Builder) {
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group() {
            return _super.call(this) || this;
        }
        Group.prototype.get = function () {
        };
        return Group;
    }(Builder.Transaction));
    Builder.Group = Group;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="DataType.ts" />
///<reference path="Transaction.ts"/>
(function (Builder) {
    var Gt = (function (_super) {
        __extends(Gt, _super);
        /**
         *
         * @param condition
         */
        function Gt(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Gt.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] > this.condition[key]) {
                    result.push(true);
                }
            }
            if (result.length != size) {
                return false;
            }
            for (var i = 1; i <= size; i++) {
                if (result[i] == false) {
                    return false;
                }
            }
            return true;
        };
        return Gt;
    }(Builder.Transaction));
    Builder.Gt = Gt;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
var Builder;
///<reference path="DataType.ts" />
(function (Builder) {
    var Gte = (function (_super) {
        __extends(Gte, _super);
        /**
         *
         * @param condition
         */
        function Gte(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Gte.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] >= this.condition[key]) {
                    result.push(true);
                }
            }
            if (result.length != size) {
                return false;
            }
            for (var i = 1; i <= size; i++) {
                if (result[i] == false) {
                    return false;
                }
            }
            return true;
        };
        return Gte;
    }(Builder.Transaction));
    Builder.Gte = Gte;
})(Builder || (Builder = {}));
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="Transaction.ts"/>
(function (Builder) {
    var In = (function (_super) {
        __extends(In, _super);
        /**
         *
         * @param condition
         */
        function In(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.conditions = new Array;
            if (typeof condition == "object") {
                for (var key in condition) {
                    if (condition[key] instanceof Array) {
                        var row = condition[key];
                        for (var key2 in row) {
                            var value2 = Builder.DataType.getValueByType(row[key2]);
                            _this.conditions.push("row[\"" + key + "\"]" + " == " + value2);
                        }
                    }
                    else {
                        throw "Not in value should be array";
                    }
                }
            }
            else {
                throw "Not condition must be an object";
            }
            return _this;
        }
        In.prototype.get = function () {
            return "(" + this.conditions.join(" || ") + ")";
        };
        return In;
    }(Builder.Transaction));
    Builder.In = In;
})(Builder || (Builder = {}));
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="Transaction.ts"/>
(function (Builder) {
    var Like = (function (_super) {
        __extends(Like, _super);
        /**
         *
         * @param condition
         */
        function Like(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
                return _this;
            }
            throw "And condition must be an object";
            return _this;
        }
        /**
         *
         */
        Like.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
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
        };
        return Like;
    }(Builder.Transaction));
    Builder.Like = Like;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
var Builder;
///<reference path="DataType.ts" />
(function (Builder) {
    var Lt = (function (_super) {
        __extends(Lt, _super);
        /**
         *
         * @param condition
         */
        function Lt(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Lt.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] < this.condition[key]) {
                    result.push(true);
                }
            }
            if (result.length != size) {
                return false;
            }
            for (var i = 1; i <= size; i++) {
                if (result[i] == false) {
                    return false;
                }
            }
            return true;
        };
        return Lt;
    }(Builder.Transaction));
    Builder.Lt = Lt;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
var Builder;
///<reference path="DataType.ts" />
(function (Builder) {
    var Lte = (function (_super) {
        __extends(Lte, _super);
        /**
         *
         * @param condition
         */
        function Lte(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Lte.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] <= this.condition[key]) {
                    result.push(true);
                }
            }
            if (result.length != size) {
                return false;
            }
            for (var i = 1; i <= size; i++) {
                if (result[i] == false) {
                    return false;
                }
            }
            return true;
        };
        return Lte;
    }(Builder.Transaction));
    Builder.Lte = Lte;
})(Builder || (Builder = {}));
///<reference path="Transaction.ts"/>
var Builder;
///<reference path="Transaction.ts"/>
(function (Builder) {
    var Not = (function (_super) {
        __extends(Not, _super);
        /**
         *
         * @param condition
         */
        function Not(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Not.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            for (var key in row) {
                if (row[key] == this.condition[key]) {
                    result.push(true);
                }
            }
            for (var i = 0; i < size; i++) {
                if (result[i] == true) {
                    return false;
                }
            }
            return true;
        };
        return Not;
    }(Builder.Transaction));
    Builder.Not = Not;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
var Builder;
///<reference path="DataType.ts" />
(function (Builder) {
    var NotIn = (function (_super) {
        __extends(NotIn, _super);
        /**
         *
         * @param condition
         */
        function NotIn(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.conditions = new Array;
            if (typeof condition == "object") {
                for (var key in condition) {
                    if (condition[key] instanceof Array) {
                        var row = condition[key];
                        for (var key2 in row) {
                            var value2 = Builder.DataType.getValueByType(row[key2]);
                            _this.conditions.push("row[\"" + key + "\"]" + " != " + value2);
                        }
                    }
                    else {
                        throw "Not in value should be array";
                    }
                }
            }
            else {
                throw "Not condition must be an object";
            }
            return _this;
        }
        NotIn.prototype.get = function () {
            return "(" + this.conditions.join(" && ") + ")";
        };
        return NotIn;
    }(Builder.Transaction));
    Builder.NotIn = NotIn;
})(Builder || (Builder = {}));
var Builder;
(function (Builder) {
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
    Builder.Operators = Operators;
})(Builder || (Builder = {}));
///<reference path="DataType.ts" />
var Builder;
///<reference path="DataType.ts" />
(function (Builder) {
    var Or = (function (_super) {
        __extends(Or, _super);
        /**
         *
         * @param condition
         */
        function Or(condition) {
            var _this = _super.call(this) || this;
            /**
             *
             */
            _this.condition = {};
            if (typeof condition == "object") {
                _this.condition = condition;
            }
            else {
                throw "And condition must be an object";
            }
            return _this;
        }
        /**
         *
         */
        Or.prototype.get = function (row) {
            var result = new Array();
            var size = Object.keys(this.condition).length;
            if (this.condition instanceof Builder.Transaction) {
                result.push(this.condition.get(row));
            }
            for (var key in row) {
                if (this.condition[key] instanceof Builder.Transaction) {
                    result.push(this.condition[key].get(row));
                }
                else {
                    if (row[key] == this.condition[key]) {
                        result.push(true);
                    }
                }
            }
            for (var i = 0; i < size; i++) {
                if (result[i] == true) {
                    return true;
                }
            }
            return false;
        };
        return Or;
    }(Builder.Transaction));
    Builder.Or = Or;
})(Builder || (Builder = {}));
var Builder;
(function (Builder) {
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
    Builder.Sort = Sort;
})(Builder || (Builder = {}));
///<reference path="./ViewAdapter.ts"/>
///<reference path="../Mvc/Controller.ts"/>
var Gravity;
///<reference path="./ViewAdapter.ts"/>
///<reference path="../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
    (function (View) {
        /**
         *
         * @type
         */
        //@fuck
        var Tag = (function () {
            /**
             *
             * @param
             * @return
             */
            function Tag(name, newClone) {
                if (name === void 0) { name = ""; }
                if (newClone === void 0) { newClone = false; }
                /**
                 *
                 */
                this.deny = ["Table", "Td", "Div", "Thead", "Tbody", "Tfoot", "Tr", "Td", "Th", "Label", "Span", "I", "A"];
                /**
                 *
                 * @type
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
            Tag.prototype.initialize = function () {
            };
            /**
             *
             */
            Tag.prototype.getArguments = function (args) {
                if (typeof args == "object") {
                    var argsTemp = new Array();
                    for (var i = 0; i < args.length; i++) {
                        if (args[i] != "atmpnil" && !(args[i] instanceof Gravity.Mvc.Controller)) {
                            argsTemp.push(args[i]);
                        }
                    }
                    return argsTemp;
                }
                else {
                    return false;
                }
            };
            /**
             *
             */
            Tag.prototype.setArgs = function (args) {
                this.args = args;
                return this;
            };
            /**
             *
             */
            Tag.prototype.getArgs = function () {
                return this.args;
            };
            /**
             *
             */
            Tag.prototype.getContext = function () {
                return this.context;
            };
            /**
             *
             */
            Tag.prototype.setContext = function (ctx) {
                this.context = ctx;
            };
            /**
             *
             */
            Tag.prototype.setElement = function (element) {
                this.element = element;
                return this;
            };
            /**
             *
             */
            Tag.prototype.show = function () {
                this.element.style.display = "";
                return this;
            };
            /**
             *
             */
            Tag.prototype.hide = function () {
                this.element.style.display = "none";
                return this;
            };
            /**
             *
             */
            Tag.prototype.getById = function (id) {
                if (document.getElementById(id)) {
                    var adapter = new Gravity.View.ViewAdapter(document.getElementById(id));
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
            Tag.prototype.getByTag = function (name) {
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
            Tag.prototype.getByClass = function (name) {
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
            Tag.prototype.create = function (tag) {
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
            Tag.prototype.init = function (element, name) {
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
            Tag.prototype.getType = function () {
                return this.className;
            };
            /**
             *
             * @param  {string} class [description]
             * @return {[type]}       [description]
             */
            Tag.prototype.class = function (attrClass) {
                this.element.setAttribute("class", attrClass);
                return this;
            };
            /**
             *
             */
            Tag.prototype.addClass = function (attrClass) {
                var strClass = this.element.getAttribute("class");
                strClass += " " + attrClass;
                this.element.setAttribute("class", strClass);
                return this;
            };
            /**
             * Set inner html throught
             */
            Tag.prototype.setInnerHtml = function (html) {
                this.element.innerHTML = html;
                return this.element;
            };
            /**
             *
             */
            Tag.prototype.getAttribute = function (attr) {
                return this.element.getAttribute(attr);
            };
            /**
             *
             * @return {[type]} [description]
             */
            Tag.prototype.addChild = function (element) {
                this.element.append(element);
                return this;
            };
            /*
            public valueListener(fn : Function)
            {
                valueListenerNative.bind(this)(fn);
                return this;
            }
            */
            /**
             * [click description]
             * @param  {Function} fn [description]
             * @return {[type]}      [description]
             */
            Tag.prototype.click = function (fn) {
                this.element.addEventListener("click", fn.bind(this));
                return this;
            };
            /**
             *
             */
            Tag.prototype.doubleClick = function (fn) {
                this.element.addEventListener("dblclick", fn.bind(this));
                return this;
            };
            /**
             *
             * @return {[type]} [description]
             */
            Tag.prototype.change = function (fn) {
                this.element.addEventListener("change", fn.bind(this));
                return this;
            };
            /**
             * [change description]
             * @return {[type]} [description]
             */
            Tag.prototype.keypress = function (fn) {
                this.element.addEventListener("keypress", fn.bind(this));
                return this;
            };
            /**
             * [change description]
             * @return {[type]} [description]
             */
            Tag.prototype.keydown = function (fn) {
                this.element.addEventListener("keydown", fn.bind(this));
                return this;
            };
            /**
             * [change description]
             * @return {[type]} [description]
             */
            Tag.prototype.keyup = function (fn) {
                this.element.addEventListener("keyup", fn.bind(this));
                return this;
            };
            Tag.prototype.paste = function (fn) {
                this.element.addEventListener("paste", fn.bind(this));
                return this;
            };
            /**
             * [change description]
             * @return {[type]} [description]
             */
            Tag.prototype.blur = function (fn) {
                this.element.addEventListener("blur", fn.bind(this));
                return this;
            };
            /**
             * [change description]
             * @return {[type]} [description]
             */
            Tag.prototype.focus = function (fn) {
                this.element.addEventListener("focus", fn.bind(this));
                return this;
            };
            Tag.prototype.destroyEvent = function (event) {
                var nameEvent = "on" + event;
                this.element.removeEventListener("click", this.element.nameEvent);
            };
            /**
             *
             */
            Tag.prototype.removeAttr = function (attr) {
                this.element.removeAttribute(attr);
                return this;
            };
            /**
             * [get description]
             * @return {[type]} [description]
             */
            Tag.prototype.getElement = function () {
                return this.element;
            };
            /**
             * Append elements
             * @param value append
             * @return this
             */
            Tag.prototype.append = function (append) {
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
            Tag.prototype.data = function (key, value) {
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
            Tag.prototype.checkAppendValue = function (append) {
                switch (typeof append) {
                    case "string":
                        this.element.appendChild(document.createTextNode(append));
                        break;
                    case "number":
                        this.element.appendChild(document.createTextNode(append.toString()));
                        break;
                    case "object":
                        if (append instanceof Gravity.View.Tag) {
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
            Tag.prototype.html = function (html) {
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
            Tag.prototype.verifyElement = function (append, type) {
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
            Tag.prototype.removeChildNodes = function () {
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
            Tag.prototype.removeChilds = function (element, childs) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            };
            /**
             *
             * @param attr
             * @return
             */
            Tag.prototype.attr = function (attr, value) {
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
            Tag.prototype.css = function (css, value) {
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
            Tag.prototype.unbind = function (event) {
                this.element.destroyEvent(event);
                return this;
            };
            /**
             * [getClassName description]
             * @return {[type]} [description]
             */
            Tag.prototype.getClassName = function () {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec(this["constructor"].toString());
                return (results && results.length > 1) ? results[1] : "";
            };
            /**
             * [validateAndSet description]
             * @param  {[type]} config [description]
             * @return {[type]}        [description]
             */
            Tag.prototype.validateAndSet = function (config) {
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
            Tag.prototype.clone = function (newIdentify) {
                if (newIdentify === void 0) { newIdentify = ""; }
                var newElement = this.element.clone();
                return new Gravity.View.Tag(newIdentify, newElement[0]);
            };
            /**
             *
             * @param  {any = null}        val [description]
             * @return {[type]}   [description]
             */
            Tag.prototype.val = function (val) {
                if (val === void 0) { val = false; }
                if (val || typeof val == "string") {
                    this.element.value = val;
                    this.attr("value", val);
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
            Tag.prototype.text = function (text) {
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
            Tag.prototype.empty = function () {
                this.removeChildNodes();
                return this;
            };
            /**
             *
             */
            Tag.prototype.getChilds = function () {
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
            Tag.prototype.getParent = function () {
                var parent = this.element.parentElement;
                if (parent.nodeType == 1) {
                    var adapter = new View.ViewAdapter(parent);
                    return adapter.get(this.getContext());
                }
                return false;
            };
            /**
             *
             */
            Tag.prototype.getAsObject = function () {
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
            Tag.prototype.getAsJson = function () {
                var objects = this.getAsObject();
                return JSON.stringify(objects);
            };
            /**
             *
             */
            Tag.prototype.getRandomString = function () {
                var randomStr = Helper.MathHelper.getUUID();
                return btoa(randomStr);
            };
            /**
             *
             */
            Tag.prototype.remove = function (element) {
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
            Tag.prototype.setId = function (id) {
                this.attr("id", "id");
                return this;
            };
            /**
             *
             */
            Tag.prototype.getId = function () {
                return this.attr("id");
            };
            /**
             *
             */
            Tag.prototype.setDi = function (di) {
                this.di = di;
            };
            /**
             *
             */
            Tag.prototype.getDi = function () {
                return this.di;
            };
            return Tag;
        }());
        Tag.NO_CONTEXT = 1;
        View.Tag = Tag;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
    (function (View) {
        /**
         *
         */
        var A = (function (_super) {
            __extends(A, _super);
            /**
             *
             */
            function A(ctx, args) {
                if (args === void 0) { args = ""; }
                var _this = _super.call(this) || this;
                _this.create("a");
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
                var icon = new Gravity.View.I(this.getContext())
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
        }(Gravity.View.Tag));
        View.A = A;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
(function (Gravity) {
    var View;
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
            function Abbr(ctx) {
                var _this = _super.call(this) || this;
                _this.create("abbr");
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
                    throw "context must be instance of View.Controller to " + _this.getClassName();
                }
                _this.setContext(ctx);
                _this.setDi(ctx.getDi());
                _this.setArgs(_this.getArguments(arguments));
                _this.initialize();
                return _this;
            }
            return Abbr;
        }(Gravity.View.Tag));
        View.Abbr = Abbr;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Address = Address;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Area = Area;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Article = Article;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Aside = Aside;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Audio = Audio;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.B = B;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Base = Base;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Bdi = Bdi;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Bdo = Bdo;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Blockquote = Blockquote;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Body = Body;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Br = Br;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Button = Button;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Canvas = Canvas;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Caption = Caption;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Cite = Cite;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Code = Code;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Col = Col;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.ColGroup = ColGroup;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Datalist = Datalist;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Db = Db;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Del = Del;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Details = Details;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Dfn = Dfn;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Dialog = Dialog;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Div = Div;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Dl = Dl;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Dt = Dt;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Em = Em;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Embed = Embed;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Fieldset = Fieldset;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Figcaption = Figcaption;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Figure = Figure;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Footer = Footer;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Form = Form;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H1 = H1;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H2 = H2;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H3 = H3;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H4 = H4;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H5 = H5;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.H6 = H6;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Head = Head;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Header = Header;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.I = I;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Iframe = Iframe;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Img = Img;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Input = Input;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Ins = Ins;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Kbd = Kbd;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Keygen = Keygen;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
                    throw "context must be instance of View.Controller to " + _this.getClassName();
                }
                _this.setContext(ctx);
                _this.em = _this.getDi().get("em");
                _this.setArgs(_this.getArguments(arguments));
                _this.initialize();
                return _this;
            }
            return Label;
        }(Gravity.View.Tag));
        View.Label = Label;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Leyend = Leyend;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Li = Li;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Link = Link;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Main = Main;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Map = Map;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Menu = Menu;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Menuitem = Menuitem;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Meta = Meta;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Meter = Meter;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Nav = Nav;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Noscrip = Noscrip;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Object = Object;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Ol = Ol;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Optgroup = Optgroup;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Option = Option;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Output = Output;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.P = P;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Param = Param;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Pre = Pre;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Progress = Progress;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Q = Q;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Rp = Rp;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Rt = Rt;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Ruby = Ruby;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.S = S;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Samp = Samp;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Script = Script;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Section = Section;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
///<reference path="../../Model/RawModel"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
///<reference path="../../Model/RawModel"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
             * @param fn
             */
            Select.prototype.iterate = function (fn) {
                var childs = this.getChilds();
                for (var key in childs) {
                    fn(childs[key]);
                }
                return this;
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
        }(Gravity.View.Tag));
        View.Select = Select;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Small = Small;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Source = Source;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Span = Span;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Strong = Strong;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Style = Style;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Sub = Sub;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
                    throw "context must be instance of View.Controller to " + _this.getClassName();
                }
                _this.setContext(ctx);
                _this.setDi(ctx.getDi());
                _this.em = _this.getDi().get("em");
                _this.thead = new Gravity.View.Thead(_this.getContext());
                _this.tbody = new Gravity.View.Tbody(_this.getContext());
                _this.tfoot = new Gravity.View.Tfoot(_this.getContext());
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
                var tr = new Gravity.View.Tr(this.getContext());
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
                var tr = new Gravity.View.Tr(this.getContext());
                tr.append(component);
                this.tbody.append(tr);
                this.append(this.tbody);
                return this;
            };
            /**
             *
             */
            Table.prototype.toFootTr = function (component) {
                var tr = new Gravity.View.Tr(this.getContext());
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
                this.tr = new Gravity.View.Tr(this.getContext());
                var i = 0;
                for (var key in columns) {
                    var th = new Gravity.View.Th(this.context);
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
                var html = new Gravity.View.Tag();
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
                            if (contentRow instanceof Gravity.View.Tag) {
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
        }(Gravity.View.Tag));
        View.Table = Table;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Tbody = Tbody;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Td = Td;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Textarea = Textarea;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Tfoot = Tfoot;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Th = Th;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Thead = Thead;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Time = Time;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Title = Title;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Tr = Tr;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Track = Track;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.U = U;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Ul = Ul;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Var = Var;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Video = Video;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Wbr = Wbr;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="./Tag.ts"/>
///<reference path="./Elements/A.ts"/>
///<reference path="./Elements/Abbr.ts"/>
///<reference path="./Elements/Address.ts"/>
///<reference path="./Elements/Area.ts"/>
///<reference path="./Elements/Article.ts"/>
///<reference path="./Elements/Aside.ts"/>
///<reference path="./Elements/Audio.ts"/>
///<reference path="./Elements/B.ts"/>
///<reference path="./Elements/Base.ts"/>
///<reference path="./Elements/Bdi.ts"/>
///<reference path="./Elements/Bdo.ts"/>
///<reference path="./Elements/Blockquote.ts"/>
///<reference path="./Elements/Body.ts"/>
///<reference path="./Elements/Br.ts"/>
///<reference path="./Elements/Button.ts"/>
///<reference path="./Elements/Canvas.ts"/>
///<reference path="./Elements/Caption.ts"/>
///<reference path="./Elements/Cite.ts"/>
///<reference path="./Elements/Code.ts"/>
///<reference path="./Elements/Col.ts"/>
///<reference path="./Elements/ColGroup.ts"/>
///<reference path="./Elements/Datalist.ts"/>
///<reference path="./Elements/Db.ts"/>
///<reference path="./Elements/Del.ts"/>
///<reference path="./Elements/Details.ts"/>
///<reference path="./Elements/Dfn.ts"/>
///<reference path="./Elements/Dialog.ts"/>
///<reference path="./Elements/Div.ts"/>
///<reference path="./Elements/Dl.ts"/>
///<reference path="./Elements/Dt.ts"/>
///<reference path="./Elements/Em.ts"/>
///<reference path="./Elements/Embed.ts"/>
///<reference path="./Elements/Fieldset.ts"/>
///<reference path="./Elements/Figcaption.ts"/>
///<reference path="./Elements/Figure.ts"/>
///<reference path="./Elements/Footer.ts"/>
///<reference path="./Elements/Form.ts"/>
///<reference path="./Elements/H1.ts"/>
///<reference path="./Elements/H2.ts"/>
///<reference path="./Elements/H3.ts"/>
///<reference path="./Elements/H4.ts"/>
///<reference path="./Elements/H5.ts"/>
///<reference path="./Elements/H6.ts"/>
///<reference path="./Elements/Head.ts"/>
///<reference path="./Elements/Header.ts"/>
///<reference path="./Elements/I.ts"/>
///<reference path="./Elements/Iframe.ts"/>
///<reference path="./Elements/Img.ts"/>
///<reference path="./Elements/Input.ts"/>
///<reference path="./Elements/Ins.ts"/>
///<reference path="./Elements/Kbd.ts"/>
///<reference path="./Elements/Keygen.ts"/>
///<reference path="./Elements/Label.ts"/>
///<reference path="./Elements/Leyend.ts"/>
///<reference path="./Elements/Li.ts"/>
///<reference path="./Elements/Link.ts"/>
///<reference path="./Elements/Main.ts"/>
///<reference path="./Elements/Map.ts"/>
///<reference path="./Elements/Menu.ts"/>
///<reference path="./Elements/MenuItem.ts"/>
///<reference path="./Elements/Meta.ts"/>
///<reference path="./Elements/Meter.ts"/>
///<reference path="./Elements/Nav.ts"/>
///<reference path="./Elements/Noscrip.ts"/>
///<reference path="./Elements/Object.ts"/>
///<reference path="./Elements/Ol.ts"/>
///<reference path="./Elements/Optgroup.ts"/>
///<reference path="./Elements/Option.ts"/>
///<reference path="./Elements/Output.ts"/>
///<reference path="./Elements/P.ts"/>
///<reference path="./Elements/Param.ts"/>
///<reference path="./Elements/Pre.ts"/>
///<reference path="./Elements/Progress.ts"/>
///<reference path="./Elements/Q.ts"/>
///<reference path="./Elements/Rp.ts"/>
///<reference path="./Elements/Rt.ts"/>
///<reference path="./Elements/Ruby.ts"/>
///<reference path="./Elements/S.ts"/>
///<reference path="./Elements/Samp.ts"/>
///<reference path="./Elements/Script.ts"/>
///<reference path="./Elements/Section.ts"/>
///<reference path="./Elements/Select.ts"/>
///<reference path="./Elements/Small.ts"/>
///<reference path="./Elements/Source.ts"/>
///<reference path="./Elements/Span.ts"/>
///<reference path="./Elements/Strong.ts"/>
///<reference path="./Elements/Style.ts"/>
///<reference path="./Elements/Sub.ts"/>
///<reference path="./Elements/Table.ts"/>
///<reference path="./Elements/Tbody.ts"/>
///<reference path="./Elements/Td.ts"/>
///<reference path="./Elements/Textarea.ts"/>
///<reference path="./Elements/Tfoot.ts"/>
///<reference path="./Elements/Th.ts"/>
///<reference path="./Elements/Thead.ts"/>
///<reference path="./Elements/Time.ts"/>
///<reference path="./Elements/Title.ts"/>
///<reference path="./Elements/Tr.ts"/>
///<reference path="./Elements/Track.ts"/>
///<reference path="./Elements/U.ts"/>
///<reference path="./Elements/Ul.ts"/>
///<reference path="./Elements/Var.ts"/>
///<reference path="./Elements/Video.ts"/>
///<reference path="./Elements/Wbr.ts"/>
var Gravity;
///<reference path="./Tag.ts"/>
///<reference path="./Elements/A.ts"/>
///<reference path="./Elements/Abbr.ts"/>
///<reference path="./Elements/Address.ts"/>
///<reference path="./Elements/Area.ts"/>
///<reference path="./Elements/Article.ts"/>
///<reference path="./Elements/Aside.ts"/>
///<reference path="./Elements/Audio.ts"/>
///<reference path="./Elements/B.ts"/>
///<reference path="./Elements/Base.ts"/>
///<reference path="./Elements/Bdi.ts"/>
///<reference path="./Elements/Bdo.ts"/>
///<reference path="./Elements/Blockquote.ts"/>
///<reference path="./Elements/Body.ts"/>
///<reference path="./Elements/Br.ts"/>
///<reference path="./Elements/Button.ts"/>
///<reference path="./Elements/Canvas.ts"/>
///<reference path="./Elements/Caption.ts"/>
///<reference path="./Elements/Cite.ts"/>
///<reference path="./Elements/Code.ts"/>
///<reference path="./Elements/Col.ts"/>
///<reference path="./Elements/ColGroup.ts"/>
///<reference path="./Elements/Datalist.ts"/>
///<reference path="./Elements/Db.ts"/>
///<reference path="./Elements/Del.ts"/>
///<reference path="./Elements/Details.ts"/>
///<reference path="./Elements/Dfn.ts"/>
///<reference path="./Elements/Dialog.ts"/>
///<reference path="./Elements/Div.ts"/>
///<reference path="./Elements/Dl.ts"/>
///<reference path="./Elements/Dt.ts"/>
///<reference path="./Elements/Em.ts"/>
///<reference path="./Elements/Embed.ts"/>
///<reference path="./Elements/Fieldset.ts"/>
///<reference path="./Elements/Figcaption.ts"/>
///<reference path="./Elements/Figure.ts"/>
///<reference path="./Elements/Footer.ts"/>
///<reference path="./Elements/Form.ts"/>
///<reference path="./Elements/H1.ts"/>
///<reference path="./Elements/H2.ts"/>
///<reference path="./Elements/H3.ts"/>
///<reference path="./Elements/H4.ts"/>
///<reference path="./Elements/H5.ts"/>
///<reference path="./Elements/H6.ts"/>
///<reference path="./Elements/Head.ts"/>
///<reference path="./Elements/Header.ts"/>
///<reference path="./Elements/I.ts"/>
///<reference path="./Elements/Iframe.ts"/>
///<reference path="./Elements/Img.ts"/>
///<reference path="./Elements/Input.ts"/>
///<reference path="./Elements/Ins.ts"/>
///<reference path="./Elements/Kbd.ts"/>
///<reference path="./Elements/Keygen.ts"/>
///<reference path="./Elements/Label.ts"/>
///<reference path="./Elements/Leyend.ts"/>
///<reference path="./Elements/Li.ts"/>
///<reference path="./Elements/Link.ts"/>
///<reference path="./Elements/Main.ts"/>
///<reference path="./Elements/Map.ts"/>
///<reference path="./Elements/Menu.ts"/>
///<reference path="./Elements/MenuItem.ts"/>
///<reference path="./Elements/Meta.ts"/>
///<reference path="./Elements/Meter.ts"/>
///<reference path="./Elements/Nav.ts"/>
///<reference path="./Elements/Noscrip.ts"/>
///<reference path="./Elements/Object.ts"/>
///<reference path="./Elements/Ol.ts"/>
///<reference path="./Elements/Optgroup.ts"/>
///<reference path="./Elements/Option.ts"/>
///<reference path="./Elements/Output.ts"/>
///<reference path="./Elements/P.ts"/>
///<reference path="./Elements/Param.ts"/>
///<reference path="./Elements/Pre.ts"/>
///<reference path="./Elements/Progress.ts"/>
///<reference path="./Elements/Q.ts"/>
///<reference path="./Elements/Rp.ts"/>
///<reference path="./Elements/Rt.ts"/>
///<reference path="./Elements/Ruby.ts"/>
///<reference path="./Elements/S.ts"/>
///<reference path="./Elements/Samp.ts"/>
///<reference path="./Elements/Script.ts"/>
///<reference path="./Elements/Section.ts"/>
///<reference path="./Elements/Select.ts"/>
///<reference path="./Elements/Small.ts"/>
///<reference path="./Elements/Source.ts"/>
///<reference path="./Elements/Span.ts"/>
///<reference path="./Elements/Strong.ts"/>
///<reference path="./Elements/Style.ts"/>
///<reference path="./Elements/Sub.ts"/>
///<reference path="./Elements/Table.ts"/>
///<reference path="./Elements/Tbody.ts"/>
///<reference path="./Elements/Td.ts"/>
///<reference path="./Elements/Textarea.ts"/>
///<reference path="./Elements/Tfoot.ts"/>
///<reference path="./Elements/Th.ts"/>
///<reference path="./Elements/Thead.ts"/>
///<reference path="./Elements/Time.ts"/>
///<reference path="./Elements/Title.ts"/>
///<reference path="./Elements/Tr.ts"/>
///<reference path="./Elements/Track.ts"/>
///<reference path="./Elements/U.ts"/>
///<reference path="./Elements/Ul.ts"/>
///<reference path="./Elements/Var.ts"/>
///<reference path="./Elements/Video.ts"/>
///<reference path="./Elements/Wbr.ts"/>
(function (Gravity) {
    var View;
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
                                instance = new Gravity.View.A(context);
                                break;
                            case "ABBR":
                                instance = new Gravity.View.Abbr(context);
                                break;
                            case "ADDRESS":
                                instance = new Gravity.View.Address(context);
                                break;
                            case "AREA":
                                instance = new Gravity.View.Area(context);
                                break;
                            case "ARTICLE":
                                instance = new Gravity.View.Article(context);
                                break;
                            case "ASIDE":
                                instance = new Gravity.View.Aside(context);
                                break;
                            case "AUDIO":
                                instance = new Gravity.View.Audio(context);
                                break;
                            case "B":
                                instance = new Gravity.View.B(context);
                                break;
                            case "BASE":
                                instance = new Gravity.View.Base(context);
                                break;
                            case "BDI":
                                instance = new Gravity.View.Bdi(context);
                                break;
                            case "BDO":
                                instance = new Gravity.View.Bdo(context);
                                break;
                            case "BLOCKQUOTE":
                                instance = new Gravity.View.Blockquote(context);
                                break;
                            case "BODY":
                                instance = new Gravity.View.Body(context);
                                break;
                            case "BR":
                                instance = new Gravity.View.Br(context);
                                break;
                            case "BUTTON":
                                instance = new Gravity.View.Button(context);
                                break;
                            case "CANVAS":
                                instance = new Gravity.View.Canvas(context);
                                break;
                            case "CAPTION":
                                instance = new Gravity.View.Caption(context);
                                break;
                            case "CITE":
                                instance = new Gravity.View.Cite(context);
                                break;
                            case "CODE":
                                instance = new Gravity.View.Code(context);
                                break;
                            case "COL":
                                instance = new Gravity.View.Col(context);
                                break;
                            case "COLGROUP":
                                instance = new Gravity.View.ColGroup(context);
                                break;
                            case "DATALIST":
                                instance = new Gravity.View.Datalist(context);
                                break;
                            case "DB":
                                instance = new Gravity.View.Db(context);
                                break;
                            case "DEL":
                                instance = new Gravity.View.Del(context);
                                break;
                            case "DETAILS":
                                instance = new Gravity.View.Details(context);
                                break;
                            case "DFN":
                                instance = new Gravity.View.Dfn(context);
                                break;
                            case "DIALOG":
                                instance = new Gravity.View.Dialog(context);
                                break;
                            case "DIV":
                                instance = new Gravity.View.Div(context);
                                break;
                            case "DL":
                                instance = new Gravity.View.Dl(context);
                                break;
                            case "DT":
                                instance = new Gravity.View.Dt(context);
                                break;
                            case "EM":
                                instance = new Gravity.View.Em(context);
                                break;
                            case "EMBED":
                                instance = new Gravity.View.Embed(context);
                                break;
                            case "FIELDSET":
                                instance = new Gravity.View.Fieldset(context);
                                break;
                            case "FIGCAPTION":
                                instance = new Gravity.View.Figcaption(context);
                                break;
                            case "FIGURE":
                                instance = new Gravity.View.Figure(context);
                                break;
                            case "FOOTER":
                                instance = new Gravity.View.Footer(context);
                                break;
                            case "FORM":
                                instance = new Gravity.View.Form(context);
                                break;
                            case "H1":
                                instance = new Gravity.View.H1(context);
                                break;
                            case "H2":
                                instance = new Gravity.View.H2(context);
                                break;
                            case "H3":
                                instance = new Gravity.View.H3(context);
                                break;
                            case "H4":
                                instance = new Gravity.View.H4(context);
                                break;
                            case "H5":
                                instance = new Gravity.View.H5(context);
                                break;
                            case "H6":
                                instance = new Gravity.View.H6(context);
                                break;
                            case "HEAD":
                                instance = new Gravity.View.Head(context);
                                break;
                            case "HEADER":
                                instance = new Gravity.View.Header(context);
                                break;
                            case "I":
                                instance = new Gravity.View.I(context);
                                break;
                            case "IFRAME":
                                instance = new Gravity.View.Iframe(context);
                                break;
                            case "IMG":
                                instance = new Gravity.View.Img(context);
                                break;
                            case "INPUT":
                                instance = new Gravity.View.Input(context);
                                break;
                            case "INS":
                                instance = new Gravity.View.Ins(context);
                                break;
                            case "KBD":
                                instance = new Gravity.View.Kbd(context);
                                break;
                            case "KEYGEN":
                                instance = new Gravity.View.Keygen(context);
                                break;
                            case "LABEL":
                                instance = new Gravity.View.Label(context);
                                break;
                            case "LEYEND":
                                instance = new Gravity.View.Leyend(context);
                                break;
                            case "LI":
                                instance = new Gravity.View.Li(context);
                                break;
                            case "LINK":
                                instance = new Gravity.View.Link(context);
                                break;
                            case "MAIN":
                                instance = new Gravity.View.Main(context);
                                break;
                            case "MAP":
                                instance = new Gravity.View.Map(context);
                                break;
                            case "MENU":
                                instance = new Gravity.View.Menu(context);
                                break;
                            case "MENUITEM":
                                instance = new Gravity.View.Menuitem(context);
                                break;
                            case "META":
                                instance = new Gravity.View.Meta(context);
                                break;
                            case "META":
                                instance = new Gravity.View.Meta(context);
                                break;
                            case "METER":
                                instance = new Gravity.View.Meter(context);
                                break;
                            case "NAV":
                                instance = new Gravity.View.Nav(context);
                                break;
                            case "NOSCRIP":
                                instance = new Gravity.View.Noscrip(context);
                                break;
                            case "OBJECT":
                                instance = new Gravity.View.Object(context);
                                break;
                            case "OL":
                                instance = new Gravity.View.Ol(context);
                                break;
                            case "OPTGROUP":
                                instance = new Gravity.View.Optgroup(context);
                                break;
                            case "P":
                                instance = new Gravity.View.P(context);
                                break;
                            case "PARAM":
                                instance = new Gravity.View.Param(context);
                                break;
                            case "PRE":
                                instance = new Gravity.View.Pre(context);
                                break;
                            case "PROGRESS":
                                instance = new Gravity.View.Progress(context);
                                break;
                            case "Q":
                                instance = new Gravity.View.Q(context);
                                break;
                            case "RP":
                                instance = new Gravity.View.Rp(context);
                                break;
                            case "RT":
                                instance = new Gravity.View.Rt(context);
                                break;
                            case "RUBY":
                                instance = new Gravity.View.Ruby(context);
                                break;
                            case "S":
                                instance = new Gravity.View.S(context);
                                break;
                            case "SAMP":
                                instance = new Gravity.View.Samp(context);
                                break;
                            case "SCRIPT":
                                instance = new Gravity.View.Script(context);
                                break;
                            case "SECTION":
                                instance = new Gravity.View.Section(context);
                                break;
                            case "SELECT":
                                instance = new Gravity.View.Select(context);
                                break;
                            case "SMALL":
                                instance = new Gravity.View.Small(context);
                                break;
                            case "SOURCE":
                                instance = new Gravity.View.Source(context);
                                break;
                            case "SPAN":
                                instance = new Gravity.View.Span(context);
                                break;
                            case "STRONG":
                                instance = new Gravity.View.Strong(context);
                                break;
                            case "STYLE":
                                instance = new Gravity.View.Style(context);
                                break;
                            case "SUB":
                                instance = new Gravity.View.Sub(context);
                                break;
                            case "SUMMARY":
                                instance = new Gravity.View.Summary(context);
                                break;
                            case "SUP":
                                instance = new Gravity.View.Sup(context);
                                break;
                            case "TABLE":
                                instance = new Gravity.View.Table(context);
                                break;
                            case "TBODY":
                                instance = new Gravity.View.Tbody(context);
                                break;
                            case "TD":
                                instance = new Gravity.View.Td(context);
                                break;
                            case "TEXTAREA":
                                instance = new Gravity.View.Textarea(context);
                                break;
                            case "TFOOT":
                                instance = new Gravity.View.Tfoot(context);
                                break;
                            case "TH":
                                instance = new Gravity.View.Th(context);
                                break;
                            case "THEAD":
                                instance = new Gravity.View.Thead(context);
                                break;
                            case "TIME":
                                instance = new Gravity.View.Time(context);
                                break;
                            case "TITLE":
                                instance = new Gravity.View.Title(context);
                                break;
                            case "TR":
                                instance = new Gravity.View.Tr(context);
                                break;
                            case "TRACK":
                                instance = new Gravity.View.Track(context);
                                break;
                            case "U":
                                instance = new Gravity.View.U(context);
                                break;
                            case "UL":
                                instance = new Gravity.View.Ul(context);
                                break;
                            case "VAR":
                                instance = new Gravity.View.Var(context);
                                break;
                            case "VIDEO":
                                instance = new Gravity.View.Video(context);
                                break;
                            case "WBR":
                                instance = new Gravity.View.Wbr(context);
                                break;
                            default:
                                instance = new Gravity.View.Tag();
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
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
var Service;
(function (Service) {
    var Injectable = (function () {
        function Injectable() {
        }
        Injectable.prototype.inject = function () {
            for (var key in this.getDi()) {
                this[key] = this.getDi()[key];
            }
        };
        /**
         *
         */
        Injectable.prototype.getDi = function () {
            return this.di;
        };
        /**
         *
         */
        Injectable.prototype.setDi = function (di) {
            this.di = di;
        };
        return Injectable;
    }());
    Service.Injectable = Injectable;
})(Service || (Service = {}));
///<reference path="../View/ViewAdapter.ts"/>
///<reference path="../Service/Injectable.ts"/>
/*
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
*/
var Gravity;
///<reference path="../View/ViewAdapter.ts"/>
///<reference path="../Service/Injectable.ts"/>
/*
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
*/
(function (Gravity) {
    var Mvc;
    (function (Mvc) {
        //@sealed
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller() {
                return _super.apply(this, arguments) || this;
            }
            /**
             *
             */
            Controller.prototype.initialize = function () {
            };
            return Controller;
        }(Service.Injectable));
        Mvc.Controller = Controller;
    })(Mvc = Gravity.Mvc || (Gravity.Mvc = {}));
})(Gravity || (Gravity = {}));
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
var Mvc;
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
(function (Mvc) {
    var Query = (function () {
        /**
         *
         * @param data
         */
        function Query(data) {
            if (data === void 0) { data = false; }
            this.lim = null;
            this.sort = new Array;
            this.data = false;
            this.cols = new Array;
            this.conds = null;
            this.sortConds = false;
            this.transactions = new Array;
            this.negativeConds = null;
            this.negativeTransactions = new Array();
            this.data = data;
        }
        /**
         *
         */
        Query.prototype.columns = function (cols) {
            if (typeof cols == "object") {
                this.cols = cols;
            }
            else {
                throw "Column param must be an object";
            }
            return this;
        };
        /**
         *
         */
        Query.prototype.getColumns = function () {
            return Object.keys(this.data[0]);
        };
        /**
         *
         * @param row
         */
        Query.prototype.resolveColumns = function (row) {
            var newRow = {};
            if (Object.keys(this.cols).length > 0) {
                for (var key in this.cols) {
                    newRow[this.cols[key]] = row[this.cols[key]];
                }
            }
            else {
                newRow = Object.keys(row);
            }
            return newRow;
        };
        /**
         *
         * @param condClass
         */
        Query.prototype.where = function (conditions) {
            if (conditions instanceof Builder.Transaction) {
                if (conditions instanceof Builder.Not || conditions instanceof Builder.NotIn) {
                    this.negativeTransactions.push(conditions);
                    this.negativeConds++;
                }
                else {
                    this.transactions.push(conditions);
                    this.conds++;
                }
            }
            return this;
        };
        Query.prototype.limit = function (limit) {
            if (typeof limit == "number") {
                this.lim = limit;
            }
            else {
                throw "limit must be number";
            }
            return this;
        };
        Query.prototype.addOperator = function (length, operator) {
            var cond = "";
            if (length > 0) {
                cond = operator + " ";
            }
            return cond;
        };
        /**
         *
         * @param conditions
         */
        Query.prototype.orderBy = function (sortContent) {
            this.sort = sortContent;
            this.sortConds = true;
        };
        /**
         *
         */
        Query.prototype.resolveSort = function (results) {
            switch (typeof this.sort) {
                case Builder.DataType.STRING_TYPE:
                    results = Builder.Sort.sortByField(results, this.sort);
                    break;
                case Builder.DataType.OBJECT_TYPE:
                    if (this.sort instanceof Array) {
                        for (var sortKey in this.sort) {
                            var sortValue = this.sort[sortKey];
                            results = Builder.Sort.sortByField(results, sortValue);
                        }
                    }
                    else {
                        for (var sortKey in this.sort) {
                            var sortType = this.sort[sortKey];
                            results = Builder.Sort.sortByField(results, sortKey);
                            if (this.sort[sortKey] == Builder.Sort.DESC) {
                                results = results.reverse();
                            }
                        }
                    }
                    break;
            }
            return results;
        };
        /**
         *
         * @param row
         */
        Query.prototype.miniChecksum = function (row) {
            var str = JSON.stringify(row);
            var hash = 0;
            var char = 0;
            if (str.length == 0)
                return hash;
            for (var i = 0; i < str.length; i++) {
                char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        };
        /**
         *
         * @param result
         * @param row
         */
        Query.prototype.ifExistOnResult = function (result, row) {
            for (var key in result) {
                if (this.miniChecksum(result[key]) == this.miniChecksum(row)) {
                    return false;
                }
            }
            return true;
        };
        /**
         *
         */
        Query.prototype.get = function () {
            var results = new Array;
            var limit = 1;
            for (var key in this.data) {
                var row = this.data[key];
                if (this.cols != null && this.cols.length > 0) {
                    row = this.resolveColumns(row);
                }
                if (this.conds > 0) {
                    for (var key in this.transactions) {
                        var result = this.transactions[key].get(row);
                        if (result) {
                            if (this.ifExistOnResult(results, row)) {
                                results.push(row);
                            }
                        }
                    }
                }
                else {
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
                        var result = this.negativeTransactions[key].get(row);
                        if (result) {
                            if (this.ifExistOnResult(newResults, row)) {
                                newResults.push(row);
                            }
                        }
                    }
                }
                else {
                    newResults.push(row);
                }
            }
            if (this.sortConds) {
                newResults = this.resolveSort(newResults);
            }
            return newResults;
        };
        return Query;
    }());
    Mvc.Query = Query;
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
            this.deny = {};
            this.deny = {
                "insertUrl": true,
                "deleteUrl": true,
                "updateUrl": true,
                "findUrl": true
            };
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
            var dataAttributes = {};
            for (var i in obj) {
                var propName = i;
                var propValue = obj[i];
                var type = (typeof propValue);
                switch (type) {
                    case 'function':
                        break;
                    case 'object':
                        if (propValue instanceof ModelData.RawModel) {
                            dataAttributes[propName] = this.getAtttributeAsObjects(propValue);
                        }
                        else {
                            if (propValue != null) {
                                if (Object.keys(propValue).length > 0) {
                                    if (this.checkDataObject(propName)) {
                                        dataAttributes[propName] = propValue;
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        var deny = ModelData.Deny.getDeny();
                        if (deny.indexOf(propName) == -1) {
                            dataAttributes[propName] = propValue;
                        }
                        break;
                }
            }
            return dataAttributes;
        };
        Reflection.prototype.checkDataObject = function (key) {
            if (this.deny[key] != true) {
                return true;
            }
            else {
                return false;
            }
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
        Container.prototype.hasKey = function (serviceName) {
            if (typeof this.service[serviceName] == "undefined") {
                return false;
            }
            return true;
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
            var url = null;
            switch (type) {
                case "find":
                    url = objModel.getFindUrl();
                    break;
                case "findOne":
                    url = objModel.getFindOneUrl();
                    break;
                case "insert":
                    url = objModel.getInsertUrl();
                    break;
                case "update":
                    url = objModel.getUpdateUrl();
                    break;
                case "delete":
                    url = objModel.getDeleteUrl();
                    break;
                case "count":
                    url = objModel.getCountUrl();
                    break;
            }
            if (url == null) {
                url = this.getDi().get("url").get("baseUrl") +
                    type +
                    objModel.getClassName();
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
        EntityManager.prototype.delete = function (model) {
            this.getContainer()
                .set("transactionModel", model);
            this.getContainer()
                .set("transactionObjectModel", model);
            this.getContainer()
                .set("transactionType", "delete");
            if (model instanceof ModelData.AjaxModel) {
                this.ajax = new Network.Ajax();
                this.ajax.setDi(this.getDi());
                var modelName = model.getClassName();
                var url = model.getDeleteUrl();
                if (url == null) {
                    url = this.getDi().get("url").get("baseUrl") +
                        modelName +
                        "Delete";
                }
                this.ajax.setUrl(url);
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
        EntityManager.prototype.response = function (fn) {
            var model = this.getContainer()
                .get("transactionModel");
            var objModel = this.getContainer()
                .get("transactionObjModel");
            var type = this.getContainer()
                .get("transactionType");
            if (type == "save" || type == "delete") {
                this.ajax.response(function (response) {
                    return fn(this.setResponse(response, objModel, type, model));
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
                case "delete":
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
///<reference path="ViewAdapter.ts"/>
var Gravity;
///<reference path="ViewAdapter.ts"/>
(function (Gravity) {
    var View;
    (function (View) {
        var DomManager = (function () {
            /**
             *
             * @param element
             */
            function DomManager(element) {
                if (element === void 0) { element = null; }
                if (element != null)
                    this.element = element;
            }
            /**
             *
             * @param id
             */
            DomManager.prototype.getById = function (id, context) {
                if (context === void 0) { context = null; }
                var adapter = new Gravity.View.ViewAdapter(document.getElementById(id));
                return adapter.get(this);
            };
            /**
             *
             */
            DomManager.prototype.getByTag = function (name, context) {
                if (context === void 0) { context = null; }
                var elements = document.getElementsByTagName(name);
                var result = new Array();
                for (var key in elements) {
                    var adapter = new Gravity.View.ViewAdapter(elements[key]);
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
            DomManager.prototype.getByClass = function (name, context) {
                if (context === void 0) { context = null; }
                var elements = document.getElementsByClassName(name);
                var result = new Array();
                for (var key in elements) {
                    var adapter = new Gravity.View.ViewAdapter(elements[key]);
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
            DomManager.prototype.getElement = function () {
                return this.element;
            };
            /**
             *
             * @param element
             */
            DomManager.prototype.setElement = function (element) {
                this.element = element;
            };
            return DomManager;
        }());
        View.DomManager = DomManager;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
/// <reference path="../Persistence/EntityManager.ts" />
/// <reference path="../Persistence/Hydrator.ts" />
/// <reference path="../Network/Ajax.ts" />
/// <reference path="../View/DomManager.ts"/>
var Service;
/// <reference path="../Persistence/EntityManager.ts" />
/// <reference path="../Persistence/Hydrator.ts" />
/// <reference path="../Network/Ajax.ts" />
/// <reference path="../View/DomManager.ts"/>
(function (Service) {
    var FactoryDefault = (function (_super) {
        __extends(FactoryDefault, _super);
        function FactoryDefault() {
            var _this = _super.call(this) || this;
            _this.set("ajax", new Network.Ajax);
            _this.set("container", new Service.Container);
            _this.set("domManager", new Gravity.View.DomManager);
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
var Gravity;
(function (Gravity) {
    var View;
    (function (View) {
        var Component = (function () {
            function Component(context) {
            }
            Component.prototype.setDi = function (di) {
                this.di = di;
            };
            Component.prototype.getDi = function () {
                return this.di;
            };
            return Component;
        }());
        View.Component = Component;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Hr = Hr;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Summary = Summary;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
var Gravity;
///<reference path="../Tag.ts"/>
///<reference path="../../Mvc/Controller.ts"/>
(function (Gravity) {
    var View;
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
                if (!(ctx instanceof Gravity.Mvc.Controller)) {
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
        }(Gravity.View.Tag));
        View.Sup = Sup;
    })(View = Gravity.View || (Gravity.View = {}));
})(Gravity || (Gravity = {}));
