declare namespace Data {
    class RawModel {
        state: number;
        initialize(): void;
        beforeInsert(): void;
        beforeFind(): void;
        beforeUpdate(): void;
        beforeDelete(): void;
    }
    class ModelAjax extends RawModel implements ModelInterface {
        source: string;
        insertUrl: string;
        deleteUrl: string;
        updateUrl: string;
        findUrl: string;
        params: Object;
        internalId: string;
        method: string;
        constructor();
        setSource(data: any): void;
        getClassName(): string;
        setInsertUrl(url: string): void;
        setFindUrl(url: string): void;
        setDeleteUrl(url: string): void;
        setUpdateUrl(url: string): void;
        getInsertUrl(): string;
        getFindUrl(): string;
        getDeleteUrl(): string;
        getUpdateUrl(): string;
        setParams(params: Object): void;
        getParams(): Object;
        setMethod(method: string): void;
        getMethod(): string;
    }
    class SimpleModel extends RawModel {
    }
    interface ModelInterface {
        insertUrl: string;
        deleteUrl: string;
        updateUrl: string;
        findUrl: string;
        state: number;
        internalId: string;
        setSource(source: Object): void;
        setFindUrl(url: string): void;
        setInsertUrl(url: string): void;
        setUpdateUrl(url: string): void;
        setDeleteUrl(url: string): void;
        getFindUrl(): string;
        getInsertUrl(): string;
        getUpdateUrl(): string;
        getDeleteUrl(): string;
    }
}
declare namespace Errors {
    class Message {
        static NOT_VALID_ARRAY: string;
        static NOT_VALID_ARRAY_OBJECT: string;
        static NOT_VALID_OBJECT: string;
        static getCodeMessage(code: number, custom: string): string;
    }
    class MessageCode {
        static NOT_VALID_ARRAY: number;
        static NOT_VALID_ARRAY_OBJECT: number;
        static NOT_VALID_OBJECT: number;
    }
}
declare namespace Events {
    class Manager {
    }
}
declare namespace Gravity {
    class Application {
        private controllers;
        private loader;
        /**
         *
         */
        load(loader: any): void;
        /**
         *
         */
        setControllers(controllers: any[]): void;
        /**
         *
         */
        start(): void;
    }
}
declare namespace Helper {
    class ArrayHelper {
        constructor();
        static inArray(container: any[], element: any): boolean;
    }
    class MathHelper {
        constructor();
        static getRandom(init: any, last: any): number;
        static getUUID(): string;
        private static getS4();
    }
    class StringHelper {
        constructor();
        /**
         * [sanitizeString description]
         * @param  {string} str [description]
         * @return {[type]}     [description]
         */
        static sanitizeString(str: string): string;
        /**
         * [capitalize description]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        static capitalize(str: any): any;
    }
    class Validator {
        static validStructArray(data: any[]): boolean;
    }
}
declare namespace Loader {
    interface DiConstructorInjection {
        initialize(di: Service.Container): any;
    }
}
declare namespace Criteria {
    class Native {
        static AND: string;
        static OR: string;
        static EQUAL: string;
    }
    class DataType {
        static BOOLEAN: number;
        static INTEGER: number;
        static STRING: number;
        static OBJECT: number;
        static ARRAY: number;
        static CLASS: number;
        static BOOLEAN_TYPE: string;
        static INTEGER_TYPE: string;
        static STRING_TYPE: string;
        static OBJECT_TYPE: string;
        /**
         *
         */
        static getValueByType(value: any): any;
    }
    class Operator {
        static OR: string;
        static AND: string;
        static SORT: string;
        static LIMIT: string;
        static COLUMNS: string;
        static CONDITIONAL: string;
    }
    class Sort {
        static ASC: number;
        static DESC: number;
        static sortByField(data: any, field: any): any[];
    }
    class Filters {
        private params;
        private first;
        private final;
        private init;
        private sort;
        private limit;
        private columns;
        constructor();
        buildCondition(params: any): void;
        getSort(sortContent: any): void;
        getLimit(limit: any): void;
        getExpression(key: any, content: any, operator: any, index: any, length: any): void;
        /**
         *
         */
        getColumns(row: any): Object;
        /**
         *
         */
        getMultipleRowValues(response: any): any[];
        getOneRowValue(data: any): void;
    }
}
declare namespace UnitOfWork {
    class UnitOfWork {
        static NEW: number;
        static CREATED: number;
        static DELETED: number;
        private detached;
        private updated;
        private deleted;
        constructor();
    }
}
declare namespace Reflection {
    class Reflection {
        private classToReflect;
        private methods;
        private attributes;
        constructor(classToReflect: any);
        read(obj: any): string;
    }
}
declare namespace Hydrator {
    class Hydrator {
        private reflector;
        constructor();
        hydrate(model: any, data: any): any;
    }
}
declare namespace Network {
    class Ajax {
        private httpRequest;
        private method;
        private parameters;
        private error;
        private url;
        private container;
        responseFn: Function;
        bfSendFn: Function;
        /**
         *
         */
        constructor();
        /**
         *
         */
        setUrl(url: any): this;
        /**
         *
         */
        getUrl(): string;
        /**
         *
         */
        setContainer(key: any, value: any): void;
        /**
         *
         */
        getContainer(key: any): any;
        /**
         *
         */
        setParams(params: any, value?: any): this;
        /**
         *
         */
        post(): this;
        /**
         *
         */
        get(): this;
        /**
         *
         */
        setMethod(method: string): this;
        /**
         *
         */
        response(responseFunction: Function): this;
        /**
         *
         */
        beforeSend(fn: Function): void;
        /**
         *
         */
        private setHeaders();
        /**
         *
         */
        getError(errorFunction: any): void;
        clear(): void;
        /**
         *
         */
        send(fn?: any): void;
    }
}
declare namespace Em {
    class EntityManager implements EntityManagerInterface {
        di: Service.Container;
        uow: UnitOfWork.UnitOfWork;
        private container;
        private ajax;
        private hydrator;
        private source;
        private model;
        private fnResponse;
        private resultSet;
        constructor();
        /**
         *
         */
        private getContainer();
        /**
         *
         */
        find(model: any, params?: Object): this;
        /**
         *
         */
        findOne(model: any, params?: Object): this;
        private getResultSet(response, params, model);
        /**
         *
         */
        save(model: any): this;
        /**
         *
         */
        delete(): boolean;
        /**
         *
         */
        response(fn: Function): this;
        /**
         *
         */
        flush(): boolean;
        /**
         *
         */
        reset(): boolean;
        /**
         *
         */
        group(): {};
        /**
         *
         */
        distinct(): {};
        /**
         *
         */
        count(): number;
        /**
         *
         */
        purge(): boolean;
        /**
         *
         */
        forget(): boolean;
        checksum(obj: any): string;
        setDi(di: Service.Container): void;
        getDi(): Service.Container;
    }
    interface EntityManagerInterface extends Service.InjectionAwareInterface {
        uow: Object;
        find(model: Data.ModelAjax, params: Object): any;
        findOne(model: Data.ModelAjax, params: Object): any;
        count(model: Data.ModelAjax, params: Object): any;
        distinct(model: Data.ModelAjax, params: Object): any;
        group(model: Data.ModelAjax, params: Object): any;
        save(model: Data.ModelAjax): any;
        delete(model: Data.ModelAjax): any;
        forget(): any;
        flush(): any;
        purge(): any;
        reset(): any;
    }
}
declare namespace Service {
    class Container {
        private service;
        private persistent;
        set(serviceName: any, content: any): void;
        get(serviceName: any): any;
        setPersistent(serviceName: any, content: any): void;
        getPersistent(serviceName: any): any;
    }
    class FactoryDefault extends Service.Container {
        constructor();
    }
    interface InjectionAwareInterface {
        di: Service.Container;
        setDi(di: Service.Container): any;
        getDi(): Service.Container;
    }
}
declare namespace Logic {
    class Controller implements Service.InjectionAwareInterface {
        di: Service.Container;
        constructor();
        initialize(): void;
        onConstruct(): void;
        setDi(di: Service.Container): void;
        getDi(): Service.Container;
    }
}
declare namespace Eval {
}
/**
 * [Html description]
 * @type {[type]}
 */
declare namespace Html {
    /**
     * [Html description]
     * @type {[type]}
     */
    class HtmlElement {
        /**
         * Jquery element
         */
        element: any;
        /**
         *
         */
        id: any;
        /**
         *
         */
        private deny;
        /**
         * [url description]
         * @type {String}
         */
        private url;
        /**
         * [className description]
         * @type {[type]}
         */
        private className;
        /**
         *
         * @param  {string} name [description]
         * @return {[type]}      [description]
         */
        constructor(name?: any, newClone?: boolean);
        /**
         *
         */
        create(tag: string): this;
        /**
         * Create html component like jquery object
         *
         * @param  {string} element [description]
         * @param  {string} name    [description]
         * @return HTMLElement
         */
        init(element: string, name: string): HTMLElement;
        /**
         *
         * @return
         */
        getType(): any;
        /**
         *
         * @param  {string} class [description]
         * @return {[type]}       [description]
         */
        class(attrClass: string): this;
        /**
         *
         */
        addClass(attrClass: string): this;
        /**
         *
         */
        getAttribute(attr: any): any;
        /**
         *
         * @return {[type]} [description]
         */
        addChild(element: any): this;
        /**
         * [click description]
         * @param  {Function} fn [description]
         * @return {[type]}      [description]
         */
        click(fn: any): this;
        doubleClick(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        change(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        keypress(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        keydown(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        keyup(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        blur(fn: any): this;
        /**
         * [change description]
         * @return {[type]} [description]
         */
        focus(fn: any): this;
        destroyEvent(event: any): void;
        /**
         * [get description]
         * @return {[type]} [description]
         */
        getElement(): any;
        /**
         * Append elements
         * @param value append
         * @return this
         */
        append(append: any): this;
        /**
         * [html description]
         * @param  {[type]} html [description]
         * @return {[type]}      [description]
         */
        html(html?: any): any;
        /**
         *
         */
        getHtml(): any;
        /**
         *
         * @param attr
         * @return
         */
        attr(attr: any, value?: any): this;
        /**
         *
         */
        getAttr(attr: any): this;
        /**
         * [css description]
         * @param  {[type]} css [description]
         * @return {[type]}     [description]
         */
        css(css: any, value?: boolean): this;
        /**
         *
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        unbind(event: any): this;
        /**
         * [getClassName description]
         * @return {[type]} [description]
         */
        getClassName(): string;
        /**
         * [validateAndSet description]
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        validateAndSet(config: any): void;
        /**
         * [clone description]
         * @return {[type]} [description]
         */
        clone(newIdentify?: string): HtmlElement;
        /**
         * [ajax description]
         * @return {[type]} [description]
         */
        ajax(config: any): this;
        /**
         * zzzz
         * @param  {any = null}        val [description]
         * @return {[type]}   [description]
         */
        val(val?: any): any;
        /**
         * zzzz
         * @param  {any = null}        text [description]
         * @return {[type]}   [description]
         */
        text(text?: any): any;
        empty(): void;
    }
    /**
     *
     */
    class A extends HtmlElement {
        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        favIcon(favIcon: any): this;
        /**
         * [href description]
         * @param  {[type]} href [description]
         * @return {[type]}      [description]
         */
        href(href: any): this;
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Abbr extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Address extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Area extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Article extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Aside extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Audio extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class B extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Base extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Bdi extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Bdo extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Blockquote extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Body extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Br extends HtmlElement {
    }
    /**
     *
     */
    class Button extends HtmlElement {
        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        type(type: any): this;
        /**
         * [favIcon description]
         * @return {[type]} [description]
         */
        favIcon(favIcon: any): this;
        /**
         * [succes description]
         * @return {[type]} [description]
         */
        success(): this;
        /**
         * [notice description]
         * @return {[type]} [description]
         */
        notice(): this;
        /**
         * [warning description]
         * @return {[type]} [description]
         */
        warning(): this;
        /**
         * [danger description]
         * @return {[type]} [description]
         */
        danger(): this;
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Canvas extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Caption extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Cite extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Code extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Col extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class ColGroup extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Datalist extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Dd extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Del extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Details extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Dfn extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Dialog extends HtmlElement {
    }
    /**
     *
     */
    class Div extends HtmlElement {
    }
    /**
     *
     */
    class Dl extends HtmlElement {
    }
    /**
     *
     */
    class Dt extends HtmlElement {
    }
    /**
     *
     */
    class Em extends HtmlElement {
    }
    /**
     *
     */
    class Embed extends HtmlElement {
    }
    /**
     *
     */
    class Fieldset extends HtmlElement {
    }
    /**
     *
     */
    class Figcaption extends HtmlElement {
    }
    /**
     *
     */
    class Figure extends HtmlElement {
    }
    /**
     *
     */
    class Footer extends HtmlElement {
    }
    /**
     *
     */
    class Form extends HtmlElement {
    }
    /**
     *
     */
    class H1 extends HtmlElement {
    }
    /**
     *
     */
    class H2 extends HtmlElement {
    }
    /**
     *
     */
    class H3 extends HtmlElement {
    }
    /**
     *
     */
    class H4 extends HtmlElement {
    }
    /**
     *
     */
    class H5 extends HtmlElement {
    }
    /**
     *
     */
    class H6 extends HtmlElement {
    }
    /**
     *
     */
    class Head extends HtmlElement {
    }
    /**
     *
     */
    class Header extends HtmlElement {
    }
    /**
     *Ttpt
    export class Html extends HtmlElement
    {
    }
    */
    /**
     *
     */
    class I extends HtmlElement {
    }
    /**
     *
     */
    class Iframe extends HtmlElement {
    }
    class Img extends HtmlElement {
        src(src: any): this;
    }
    /**
     * [Input description]
     * @type {[type]}
     */
    class Input extends HtmlElement {
        /**
         * [type description]
         * @param  {[type]} type [description]
         * @return {[type]}      [description]
         */
        type(type: any): this;
        /**
         * [value description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        val(value?: any): any;
    }
    /**
     *
     */
    class Ins extends HtmlElement {
    }
    /**
     *
     */
    class Kbd extends HtmlElement {
    }
    /**
     *
     */
    class Keygen extends HtmlElement {
    }
    /**
     *
     */
    class Label extends HtmlElement {
    }
    /**
     *
     */
    class Leyend extends HtmlElement {
    }
    /**
     *
     */
    class Li extends HtmlElement {
    }
    /**
     *
     */
    class Link extends HtmlElement {
    }
    /**
     *
     */
    class Main extends HtmlElement {
    }
    /**
     *
     */
    class Map extends HtmlElement {
    }
    /**
     *
     */
    class Menu extends HtmlElement {
    }
    /**
     *
     */
    class MenuItem extends HtmlElement {
    }
    /**
     *
     */
    class Meta extends HtmlElement {
    }
    /**
     *
     */
    class Meter extends HtmlElement {
    }
    /**
     *
     */
    class Nav extends HtmlElement {
    }
    /**
     *
     */
    class Noscrip extends HtmlElement {
    }
    /**
     *
     */
    class Object extends HtmlElement {
    }
    /**
     *
     */
    class Ol extends HtmlElement {
    }
    /**
     *
     */
    class Optgroup extends HtmlElement {
    }
    /**
     *
     */
    class Option extends HtmlElement {
    }
    /**
     *
     */
    class Output extends HtmlElement {
    }
    /**
     *
     */
    class P extends HtmlElement {
    }
    /**
     *
     */
    class Param extends HtmlElement {
    }
    /**
     *
     */
    class Pre extends HtmlElement {
    }
    /**
     *
     */
    class Progress extends HtmlElement {
    }
    /**
     *
     */
    class Q extends HtmlElement {
    }
    /**
     *
     */
    class Rp extends HtmlElement {
    }
    /**
     *
     */
    class Rt extends HtmlElement {
    }
    /**
     *
     */
    class Ruby extends HtmlElement {
    }
    /**
     *
     */
    class S extends HtmlElement {
    }
    /**
     *
     */
    class Samp extends HtmlElement {
    }
    /**
     *
     */
    class Script extends HtmlElement {
    }
    /**
     *
     */
    class Section extends HtmlElement {
    }
    class Select extends HtmlElement {
        getSelected(): HtmlElement;
        select(value: any): void;
        /**
         * [build description]
         * @param  {[type]} content [description]
         * @return {[type]}         [description]
         */
        build(content: any): this;
    }
    /**
     *
     */
    class Small extends HtmlElement {
    }
    /**
     *
     */
    class Source extends HtmlElement {
    }
    /**
     *
     */
    class Span extends HtmlElement {
    }
    /**
     *
     */
    class Strong extends HtmlElement {
    }
    /**
     *
     */
    class Style extends HtmlElement {
    }
    /**
     *
     */
    class Sub extends HtmlElement {
    }
    /**
     *
     */
    class Summary extends HtmlElement {
    }
    /**
     *
     */
    class Sup extends HtmlElement {
    }
    /**
     * [Table description]
     * @type {[type]}
     */
    class Table extends HtmlElement {
        private tblElements;
        private thead;
        private tbody;
        private tr;
        private th;
        private td;
        private system;
        private header;
        private fnCHeader;
        private fnCContent;
        /**
         *
         *
         */
        setHeader(columns: any): this;
        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        setHeaderCustomize(fn: any): this;
        /**
         *
         * @param  {[type]} rows
         * @return {[type]}
         */
        build(content: any): this;
        /**
         * [setCustomize description]
         * @param  {Function} fn      [description]
         * @return {[type]}           [description]
         */
        setContentCustomize(fn: any): this;
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        private validateSystemKeys(row);
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Thead extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Tbody extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Tr extends HtmlElement {
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Td extends HtmlElement {
        /**
         *
         * @param  {[type]} num [description]
         * @return {[type]}     [description]
         */
        colspan(cols: any): void;
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        rowspan(rows: any): void;
    }
    /**
     * [HtmlElement description]
     * @type {[type]}
     */
    class Th extends HtmlElement {
        colspan(cols: any): void;
        /**
         *
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        rowspan(rows: any): void;
    }
    /**
     *
     */
    class Tfoot extends HtmlElement {
    }
    /**
     *
     */
    class Time extends HtmlElement {
    }
    /**
     *
     */
    class Textarea extends HtmlElement {
    }
    /**
     *
     */
    class Title extends HtmlElement {
    }
    /**
     *
     */
    class Track extends HtmlElement {
    }
    /**
     *
     */
    class U extends HtmlElement {
    }
    /**
     *
     * @type {[type]}
     */
    class Ul extends HtmlElement {
        /**
         *
         * @param
         * @param
         * @return
         */
        create(config: any): this;
    }
    /**
     *
     */
    class Var extends HtmlElement {
    }
    /**
     *
     */
    class Video extends HtmlElement {
    }
    /**
     *
     */
    class Wbr extends HtmlElement {
    }
}
declare namespace View {
    class Component {
        constructor();
    }
}
