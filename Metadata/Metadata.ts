namespace Metadata
{
    export interface IProcessResult
    {
        fnFound: boolean;
        path: Array<string>;
    }

    export interface INameResolver
    {
        getFullClassNameFromInstance(instance: any, global: any): string;
    }

    /**
     *
     */
    export class NameResolver implements INameResolver
    {

        /**
         *
         */
        private _fn : any;

        /**
         *
         */
        private _global: any;

        /**
         *
         */
        private _processed: Array<any>;

        /**
         * To handle recursiveness in the object graph, collect all handled nodes in the object graph,
         * so an object is only traversed once.
         */
        public isProcessed(obj: any): boolean {
            var result = false;
            for (var i, length; i < length; i += 1) {
                if (this._processed[i] === obj) {
                    return true;
                }
            }
            return result;
        }

        /**
         *
         */
        public processProperty(obj: any, key: string, path: Array<string>) : IProcessResult
        {

            var result : IProcessResult = {
                fnFound: false,
                path: path
            }

            if (obj.hasOwnProperty(key)) {
                try {
                    var prop = obj[key];
                    if (prop === this._fn) {
                        // Function found, stop traversing the object graph.
                        result.fnFound = true;
                        return result;
                    }
                    // Continue traversing the object graph.
                    result = this.processObject(prop, path);
                    if (result.fnFound) {
                        // Function found, stop traversing the object graph.
                        return result;
                    }
                } catch (error) {
                // Access to some properties result in exceptions.
                }
            }
            return result;
        }

        /**
         *
         */
        public processObject(obj: any, path: Array<string>): IProcessResult {
            var result: IProcessResult = {
                fnFound: false,
                path: path
            }
            if (this.isProcessed(obj)) {
                return result;
            }
            this._processed.push(obj);
            let processResult : any = "";
            for (var key in obj) {
                let pathCopy = path.slice();
                pathCopy.push(key);
                processResult = this.processProperty(obj, key, pathCopy);
                if (typeof processResult["fnFound"] != "undefined") {
                    return processResult;
                }
            }
            return processResult;
        }

        /**
         *
         */
        public getFullClassNameFromInstance(instance: any, global: any) : string {
            this._fn = instance["constructor"];
            this._global = global;
            this._processed = [];
            var processResult = this.processObject(this._global, []);
            var fullFnName = "";
            if (processResult.fnFound) {
                fullFnName = processResult.path.join(".");
            }
            return fullFnName;
        }
    }
}
