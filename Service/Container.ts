
namespace Service
{
    export class Container
    {
        private service    : any[] = [];

        public set(serviceName, content)
        {
            this.service[serviceName] = content;
        }

        public get(serviceName)
        {
            return this.service[serviceName];
        }

        public hasKey(serviceName)
        {
            if (typeof this.service[serviceName] == "undefined") {
                return false;
            }
            return true;
        }

        public setPersistent(serviceName, content)
        {
            sessionStorage.setItem(
                serviceName,
                content
            );
        }

        public getPersistent(serviceName) : any
        {
            return sessionStorage.getItem(
                serviceName
            );
        }

    }
}
