const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const Schema = mongoose.Schema;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017';

const URL_LINK_REGEX = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/);

mongoose.connect(MONGODB_URI, function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

const CatSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Cat must have a name'],
        unique: true,
    },
    age: {
        type: Number,
        required: [true, 'Cat must have an age'],
        max: [30, 'To old for a cat'],
    },
    description: String,
    image: {
        type: String,
        default: 'https://cdn.onlinewebfonts.com/svg/img_74506.png',
        validate: {
            validator: text => {
                return !text || !isEmpty(text.match(URL_LINK_REGEX));
            },
            message: 'Image link must start with https://'
        }
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
