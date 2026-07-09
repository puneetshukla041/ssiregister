const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const PhysicianSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: String, 
  phone: String, hospital: String, specialty: String, remark: String,
  createdAt: { type: Date, default: Date.now }
});

const Physician = mongoose.models.Physician || mongoose.model('Physician', PhysicianSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    await connectDB();
    await Physician.create(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}