/// <reference path="../Model/RawModel" />
/// <reference path="../Model/Deny" />

namespace Reflection
{
    export class Reflection
    {
        private classToReflect : any;
        private methods    : any[]  = new Array();
        private attributes : any[]  = new Array();
        private deny       : Object = {};

        public constructor()
        {
            this.deny = {
                "insertUrl" : true,
                "deleteUrl" : true,
                "updateUrl" : true,
                "findUrl"   : true
            };
        }

        public getName(obj)
        {
            let funcNameRegex = /function (.{1,})\(/;
            let results  = (funcNameRegex).exec(obj["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
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
            var dataAttributes = {};

            for (var i in obj) {

                var propName  = i;
                var propValue = obj[i];
                var type = (typeof propValue);

                switch (type) {
                    case 'function':

                        break;
                    case 'object':
                        if (propValue instanceof ModelData.RawModel) {
                            dataAttributes[propName] = this.getAtttributeAsObjects(propValue);
                        } else {
                            if (propValue != null) {
                                if (Object.keys(propValue).length > 0) {
                                    if (this.checkDataObject(propName)) {
                                        dataAttributes[propName] = propValue;
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        var deny = ModelData.Deny.getDeny();
                        if (deny.indexOf(propName) == -1) {
                            dataAttributes[propName] = propValue;
                        }
                        break;
                }
            }
            return dataAttributes;
        }

        public checkDataObject(key)
        {
            if (this.deny[key] != true) {
                return true;
            } else {
                return false;
            }
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
