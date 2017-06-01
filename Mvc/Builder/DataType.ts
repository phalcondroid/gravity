namespace Builder
{
    export class DataType
    {

        public static BOOLEAN = 1;
        public static INTEGER = 2;
        public static STRING  = 3;
        public static OBJECT  = 4;
        public static ARRAY   = 5;
        public static CLASS   = 6;

        public static BOOLEAN_TYPE = "boolean";
        public static INTEGER_TYPE = "number";
        public static STRING_TYPE  = "string";
        public static OBJECT_TYPE  = "object";

        /**
         *
         */
        public static getValueByType(value : any)
        {
            var tyof = typeof value;
            switch (tyof) {
                case DataType.STRING_TYPE:
                        value = "\"" + value + "\"";
                    break;
            }
            return value;
        }
    }
}
