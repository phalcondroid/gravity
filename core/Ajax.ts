export class Ajax
{

    private httpRequest;
    private method      : string = "GET";
    private parameters  : string = "";
    private error       : any;
    private url         : string;
    private bfSendFn    : Function;

    public constructor()
    {
        this.httpRequest = new XMLHttpRequest();
        this.bfSendFn();
    }

    public setUrl(url)
    {
        this.url = url;
        return this;
    }

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

    public post()
    {
        this.setMethod("POST");
        return this;
    }

    public get()
    {
        this.setMethod("GET");
        return this;
    }

    public setMethod(method : string)
    {
        this.method = method;
        return this;
    }

    public response(responseFunction)
    {
        try {
            this.httpRequest.onreadystatechange = function () {
                if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (this.httpRequest.status === 200) {
                        responseFunction(this.httpRequest.response);
                    } else {
                        this.error = "ajax status" + this.httpRequest.status + " " + this.httpRequest.statusText;
                    }
                }
            };
        } catch (e) {
            responseFunction(e.description);
        }
        return this;
    }

    public beforeSend(fn : Function = function() {})
    {
        this.bfSendFn = fn;
    }

    private setHeaders()
    {
        this.httpRequest.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
    }

    public getError(errorFunction)
    {
        errorFunction(this.error);
    }

    public send(fn : any = false)
    {
        if (typeof fn == "function") {
            this.response(fn);
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
