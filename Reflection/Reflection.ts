namespace Reflection
{
    export class Reflection
    {
        private classToReflect : any;
        private methods    : any[] = new Array();
        private attributes : any[] = new Array();

        public constructor()
        {
        }

        public read(obj) {

            if (typeof obj !== 'object') {
                console.log('Not an object');
                return;
            }

            var output = '';

            for (var i in obj) {

                var propName  = i;
                var propValue = obj[i];

                var type = (typeof propValue);

                switch (type) {

                    case 'function':

                        output += ' [method] ' + propName + '\n\n';
                        this.methods.push();

                        break;

                    case 'object':

                        output += '\t[object] ' + propName + ' ' + this.read(propValue) + '\n\n';

                        break;

                    default:
                        output += ' [property] ' + propName + ' ' + propValue + '\n\n';
                        this.attributes.push({
                            propName : propValue
                        });
                        break;

                }
            }

            return output;
        }

        public getAtttributeAsObjects(obj) {

            if (typeof obj !== 'object') {
                console.log('Not an object');
                return;
            }

            var output = '';

            for (var i in obj) {

                var propName  = i;
                var propValue = obj[i];

                var type = (typeof propValue);

                switch (type) {

                    case 'object':
                        console.log("refelction", propValue);
                        if (propValue instanceof Data.RawModel) {
                            this.attributes.push({
                                propName : this.getAtttributeAsObjects(propValue)
                            });
                        }
                        break;

                    default:
                        this.attributes.push({
                            propName : propValue
                        });
                        break;

                }
            }

            return output;
        }

        /**
         *
         */
        public getMethods()
        {
            return this.methods;
        }

        /**
         *
         */
        public getAttributes()
        {
            return this.attributes;
        }
    }
}
