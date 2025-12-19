const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  maxGroupSize: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  startDates: [{
    type: Date,
    required: true
  }],
  images: [{
    type: String
  }],
  included: [{
    type: String
  }],
  excluded: [{
    type: String
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [{
      type: String
    }]
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration in days
tripSchema.virtual('durationInDays').get(function() {
  return `${this.duration} days`;
});

// Index for better query performance
tripSchema.index({ destination: 1, startDates: 1 });
tripSchema.index({ price: 1 });
tripSchema.index({ ratingsAverage: -1 });

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;