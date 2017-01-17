///<reference path="../ViewElement"/>

namespace View {
    /**
     * [ViewElement description]
     * @type {[type]}
     */
    export class Img extends ViewElement
    {
        public src(src)
        {
            this.attr("src", src);
            return this;
        }
    }
}
