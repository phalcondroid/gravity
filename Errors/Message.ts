
namespace Errors
{
    export class Message
    {
        public static NOT_VALID_ARRAY        : string = "The object returned in the transaction is not array";
        public static NOT_VALID_ARRAY_OBJECT : string = "The objects returned in the transaction into array are not objects, every row must be object key, value";
        public static NOT_VALID_OBJECT       : string = "The received variable is not an object";

        public static getCodeMessage(code : number, custom : string)
        {
            var custom = " => " + custom;
            switch (code) {
                case Errors.MessageCode.NOT_VALID_ARRAY:
                    return Message.NOT_VALID_ARRAY + custom;
                case Errors.MessageCode.NOT_VALID_ARRAY_OBJECT:
                    return Message.NOT_VALID_ARRAY_OBJECT + custom;
                case Errors.MessageCode.NOT_VALID_OBJECT:
                    return Message.NOT_VALID_OBJECT + custom;
            }
        }
    }
}
