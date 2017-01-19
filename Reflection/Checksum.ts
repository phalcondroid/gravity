namespace Reflection
{
    export class Checksum
    {
        /**
         *
         */
        private toObj : Object = {};

        /**
         *
         */
        public constructor(obj : Object)
        {
            this.toObj = obj;
        }

        private utf8ToBase64(str) {
            return window.btoa(
                encodeURIComponent(str)
            );
        }

        /**
         *
         */
        public getChecksum()
        {
            return this.toObj;
        }
    }
}
