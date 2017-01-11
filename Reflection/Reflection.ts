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
            let attributes = new Array();

            for (var i in obj) {

                var propName  = i;
                var propValue = obj[i];

                var type = (typeof propValue);
                var tempObj = {};

                switch (type) {
                    case 'function':

                        break;

                    case 'object':
                        if (propValue instanceof Data.RawModel) {
                            tempObj[propName] = this.getAtttributeAsObjects(propValue);
                            attributes.push(tempObj);
                        }
                        break;

                    default:
                        var deny = Data.Deny.getDeny();
                        if (deny.indexOf(propName) == -1) {
                            tempObj[propName] = propValue;
                            attributes.push(tempObj);
                        }
                        break;

                }
            }

            return attributes;
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
