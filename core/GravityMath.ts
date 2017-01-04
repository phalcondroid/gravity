export class GravityMath
{
    public constructor()
    {

    }

    public static getRandom(init, last) {
        return Math.floor((Math.random() * last) + init);
    }
}
