export namespace Helper
{
    export class ArrayHelper
    {
        public constructor()
        {

        }

        public static inArray(container : any[], element : any)
        {
            for (var key in container) {
                if (container[key] == element) {
                    return true;
                }
            }
            return false;
        }
    }

    export class MathHelper
    {
        public constructor()
        {

        }

        public static getRandom(init, last) {
            return Math.floor((Math.random() * last) + init);
        }

        public getUUID()
        {
          return this.getS4() + this.getS4() + '-' +
                 this.getS4() + '-' + this.getS4() + '-' +
                 this.getS4() + '-' + this.getS4() +
                 this.getS4() + this.getS4();
        }

        private getS4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
    }

    export class StringHelper
    {
        public constructor()
        {

        }

        /**
         * [sanitizeString description]
         * @param  {string} str [description]
         * @return {[type]}     [description]
         */
        public static sanitizeString(str: string) {
            let idTr = str.replace(/[`~!@#$%^&*()_|+\-=?;:"",.<>\{\}\[\]\\\/]/gi, "").toLowerCase();
            idTr = idTr.toString().replace(/\s/g, "");
            return idTr;
        }

        /**
         * [capitalize description]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        public static capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
}
