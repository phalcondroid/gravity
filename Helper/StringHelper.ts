namespace Helper
{
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
