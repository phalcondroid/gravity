namespace Helper
{
    export class MathHelper
    {
        public constructor()
        {

        }

        public static getRandom(init, last) {
            return Math.floor((Math.random() * last) + init);
        }

        public static getUUID()
        {
          return this.getS4() + this.getS4() + '-' +
                 this.getS4() + '-' + this.getS4() + '-' +
                 this.getS4() + '-' + this.getS4() +
                 this.getS4() + this.getS4();
        }

        private static getS4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
    }
}
