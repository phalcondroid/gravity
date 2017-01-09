namespace Reflection
{
    export class Reflection
    {
        private classToReflect : any;
        private methods    : any[] = new Array();
        private attributes : any[] = new Array();

        public constructor(classToReflect : any)
        {
            this.classToReflect = classToReflect;
            console.log(this.read(this.classToReflect));

        }

        public read(obj) {
            if (typeof obj !== 'object') {

                console.log('Not an object');
                return;

            }

            var output = '';

            for (var i in obj) {

                var propName = i;
                var propValue = obj[i];

                var type = (typeof propValue);

                switch (type) {

                case 'function':

                    output += ' [method] ' + propName + '\n\n';

                    break;

                case 'object':

                    output += '\t[object] ' + propName + ' ' + this.read(propValue) + '\n\n';
                    break;

                default:
                    output += ' [property] ' + propName + ' ' + propValue + '\n\n';
                    break;

                }
            }

            return output;
        }
    }
}
