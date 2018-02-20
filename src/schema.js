const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017';

mongoose.connect(MONGODB_URI, function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

const CatSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: 'https://cdn.onlinewebfonts.com/svg/img_74506.png',
    },
    likes: Array,
    dislikes: Array,
    description: String,
    created_at: Date,
    updated_at: Date,
});

// on every save, add the date
CatSchema.pre('save', function(next) {
    const currentDate = new Date();

    this.updated_at = currentDate;

    if (!this.created_at)
      this.created_at = currentDate;

    next();
});

CatSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

const Cat = mongoose.model('Cat', CatSchema);

module.exports = { Cat };
