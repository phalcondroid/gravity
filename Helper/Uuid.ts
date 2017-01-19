namespace Helper
{
    export class Uuid
    {
        public constructor()
        {

        }

        public static get()
        {
            return Helper.MathHelper.getS4() + Helper.MathHelper.getS4() + '-' +
                   Helper.MathHelper.getS4() + '-' + Helper.MathHelper.getS4() + '-' +
                   Helper.MathHelper.getS4() + '-' + Helper.MathHelper.getS4() +
                   Helper.MathHelper.getS4() + Helper.MathHelper.getS4();
        }
    }
}
