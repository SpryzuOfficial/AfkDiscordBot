const {Schema, model} = require('mongoose');

const AFKMessageSchema = new Schema(
{
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

module.exports = model('AfkMsg', AFKMessageSchema);