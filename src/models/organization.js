const mongoose = require('mongoose');
const {Schema} = mongoose;

const OrganizationSchema = new Schema({
    name: String,
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cc_email: String,
});

module.exports = mongoose.model('Organization', OrganizationSchema);