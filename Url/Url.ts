namespace Url
{
    export class Url
    {

        private baseUrl : string;

        public constructor(base : string = "")
        {
            this.setBaseUrl(base);
        }

        public get(opt1 : string)
        {
            return this.baseUrl + opt1;
        }

        public setBaseUrl(url : string)
        {
            this.baseUrl = url;
        }

        public getBaseUrl()
        {
            return this.baseUrl;
        }
    }
}
