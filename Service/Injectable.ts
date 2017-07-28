namespace Service
{
    export class Injectable implements Service.InjectionAwareInterface
    {
        di;

        public constructor()
        {
            
        }

        public inject()
        {
            for (var key in this.getDi()) {
                this[key] = this.getDi()[key];
            }
        }

        public getById(id : string)
        {
            let adapter = new View.ViewAdapter(document.getElementById(id));
            return adapter.get(this);
        }

        /**
         *
         */
        public getByTag(name : string)
        {
            var elements = document.getElementsByTagName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                let adapter = new View.ViewAdapter(elements[key]);
                result.push(
                    adapter.get(
                        this
                    )
                );
            }

            if (result.length == 1) {
                return result[0];
            }
            return result;
        }

        /**
         *
         */
        public getByClass(name : string)
        {
            var elements = document.getElementsByClassName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                let adapter = new View.ViewAdapter(elements[key]);
                result.push(
                    adapter.get(
                        this
                    )
                );
            }
            if (result.length == 1) {
                return result[0];
            }
            return this;
        }

        /**
         *
         */
        public getDi() : Service.Container
        {
            return this.di;
        }

        /**
         *
         */
        public setDi(di : Service.Container)
        {
            this.di = di;
        }
    }
}