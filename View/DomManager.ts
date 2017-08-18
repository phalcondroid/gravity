///<reference path="ViewAdapter.ts"/>

namespace Gravity.View
{
    export class DomManager
    {
        /**
         * 
         */
        private element;

        /**
         * 
         * @param element
         */
        public constructor(element)
        {
            this.element = element;
        }

        /**
         * 
         * @param id 
         */
        public getById(id : string, context = null)
        {
            let adapter = new Gravity.View.ViewAdapter(
                document.getElementById(id)
            );
            return adapter.get(this);
        }

        /**
         *
         */
        public getByTag(name : string, context = null)
        {
            var elements = document.getElementsByTagName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                let adapter = new Gravity.View.ViewAdapter(
                    elements[key]
                );
                result.push(
                    adapter.get(
                        this
                    )
                );
            }

            if (result.length == 1) {
                return result[0];
            }
            return result;
        }

        /**
         *
         */
        public getByClass(name : string, context = null)
        {
            var elements = document.getElementsByClassName(
                name
            );
            var result = new Array();
            for (let key in elements) {
                let adapter = new Gravity.View.ViewAdapter(
                    elements[key]
                );
                result.push(
                    adapter.get(
                        this
                    )
                );
            }
            if (result.length == 1) {
                return result[0];
            }
            return this;
        }

        /**
         * 
         */
        public getElement()
        {
            return this.element;
        }

        /**
         * 
         * @param element 
         */
        public setElement(element)
        {
            this.element = element;
        }
    }
}