
namespace Network
{
    export class Ajax
    {
        private httpRequest;
        private method      : string = "GET";
        private parameters  : string = "";
        private error       : any;
        private url         : string;
        private container   : any[] = [];
        public  responseFn  : Function = function() {};
        public  bfSendFn    : Function = function () {}.bind(this);

        /**
         *
         */
        public constructor()
        {
            this.httpRequest = new XMLHttpRequest();
        }

        /**
         *
         */
        public setUrl(url)
        {
            this.url = url;
            return this;
        }

        /**
         *
         */
        public getUrl()
        {
            return this.url;
        }

        /**
         *
         */
        public setContainer(key, value)
        {
            this.container[key] = value;
        }

        /**
         *
         */
        public getContainer(key)
        {
            return this.container[key];
        }

        /**
         *
         */
        public setParams(params, value : any = false)
        {
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
            } else if (value) {
                this.parameters = params + "=" + encodeURIComponent(value);
            }

            return this;
        }

        /**
         *
         */
        public post()
        {
            this.setMethod("POST");
            return this;
        }

        /**
         *
         */
        public get()
        {
            this.setMethod("GET");
            return this;
        }

        /**
         *
         */
        public setMethod(method : string)
        {
            this.method = method;
            return this;
        }

        /**
         *
         */
        public response(responseFunction : Function)
        {
            this.responseFn = responseFunction;
            try {
                this.bfSendFn();
                this.httpRequest.onreadystatechange = function () {
                    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (this.httpRequest.status === 200) {
                            if (typeof this.httpRequest.response != "undefined") {
                                if (typeof this.responseFn != "undefined") {
                                    this.responseFn(
                                        this.httpRequest.response
                                    );
                                }
                            }
                        } else {
                            this.error = "ajax status" + this.httpRequest.status + " " + this.httpRequest.statusText;
                        }
                    }
                }.bind(this);
            } catch (e) {
                console.log("Network.AJax.Exception", e);
            }
            return this;
        }

        /**
         *
         */
        public beforeSend(fn : Function)
        {
            this.bfSendFn = fn;
        }

        /**
         *
         */
        private setHeaders()
        {
            this.httpRequest.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
        }

        /**
         *
         */
        public getError(errorFunction)
        {
            errorFunction(this.error);
        }

        public clear()
        {
            this.method     = "GET";
            this.parameters = "";
            this.error      = null;
            this.url        = "";
            this.bfSendFn   = function () {};
            this.responseFn = function () {};
            this.container  = [];
        }

        /**
         *
         */
        public send(fn : any = false)
        {

            if (typeof fn == "function") {
                this.response(fn.bind(this));
            }

            this.httpRequest.open(
                this.method,
                this.url
            );
            this.setHeaders();
            this.httpRequest.send(
                this.parameters
            );
        }
    }
}
