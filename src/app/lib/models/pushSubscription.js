import mongoose from "mongoose";

const PushSubscriptionSchema = new mongoose.Schema(
  {
    // link by patientID
    patientID: { type: String, required: true },

    //endpoint
    endpoint: { type: String, required: true, unique: true },

    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },

    enabled: { type: Boolean, default: true },
    deviceLabel: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.PushSubscription ||
  mongoose.model("PushSubscription", PushSubscriptionSchema);
