namespace Mvc
{
    export class Sort
    {

        public static ASC  : number = 1;
        public static DESC : number = -1;

        public static sortByField(data, field) {

            var arr = [];
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var obj : any = {};
                    obj[prop] = data[prop];
                    obj.tempSortName = data[prop][field].toLowerCase();
                    arr.push(obj);
                }
            }

            arr.sort(function(a, b) {
                var at = a.tempSortName,
                    bt = b.tempSortName;
                return at > bt ? 1 : ( at < bt ? -1 : 0 );
            });

            var result = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                var obj = arr[i];
                delete obj.tempSortName;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        var id = prop;
                    }
                }
                var item = obj[id];
                result.push(item);
            }
            return result;
        }
    }
}
