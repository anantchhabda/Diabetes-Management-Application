import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    patientID: { type: String, ref: "Patient" },
    name: { type: String, required: true },
    interval: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    dayOfMonth: { type: Number, min: 1, max: 31 },
    startDate: { type: String, required: true },
    time: { type: String, required: true },
    timezone: { type: String, default: null },
    lastSentAt: { type: Date, default: null },
    system: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// derive weekday automatically
ReminderSchema.pre("validate", function (next) {
  let dateObj;
  if (typeof this.startDate === "string") {
    const [y, m, d] = this.startDate.split("-").map(Number);
    dateObj = new Date(y, m - 1, d);
  } else dateObj = this.startDate;

  if (this.interval === "Weekly") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.dayOfWeek = days[dateObj.getDay()];
  }
  next();
});

export default mongoose.models.Reminder ||
  mongoose.model("Reminder", ReminderSchema);
