import { Document, model, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;

  bookingDate: Date;
  timeSlot: string;

  guests: number;
  cccasion?: String;
  specialRequest?: string;

  status: "pending" | "confirmed" | "cancelled" | "completed";

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    specialRequest: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
BookingSchema.index({ user: 1 });
BookingSchema.index({ restaurant: 1 });
BookingSchema.index({ bookingDate: 1 });

const Booking = model<IBooking>("Booking", BookingSchema);

export default Booking;