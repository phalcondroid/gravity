export class GravityArray
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
