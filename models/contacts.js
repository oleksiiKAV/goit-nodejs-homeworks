const {Schema, model, SchemaTypes} = require("mongoose");
const handleMongooseError = require("../utils/handle-mongoose-error");

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
});

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = Contact;