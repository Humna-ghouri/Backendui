// import mongoose from 'mongoose';

// const LoanRequestSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     amount: {
//         type: Number,
//         default: 50000,
//         required: true
//     },
//     tenure: {
//         type: Number,
//         default: 12,
//         required: true
//     },
//     interestRate: {
//         type: Number,
//         default: 10,
//         required: true
//     },
//     applicantName: {
//         type: String,
//         required: true
//     },
//     applicantEmail: {
//         type: String,
//         required: true,
//         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address']
//     },
//     applicantCNIC: {
//         type: String,
//         required: true,
//         match: [/^\d{13}$/, 'CNIC must be 13 digits']
//     },
//     guarantorName: {
//         type: String,
//         required: true
//     },
//     guarantorEmail: {
//         type: String,
//         required: true,
//         match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address']
//     },
//     guarantorLocation: {
//         type: String,
//         required: true
//     },
//     guarantorCNIC: {
//         type: String,
//         required: true,
//         match: [/^\d{13}$/, 'CNIC must be 13 digits']
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     city: {
//         type: String,
//         required: true
//     },
//     country: {
//         type: String,
//         default: 'Pakistan',
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         match: [/^(\+92|0)[1-9]\d{9}$/, 'Please use a valid Pakistani phone number']
//     },
//     userPhoto: {
//         type: String,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected'],
//         default: 'pending'
//     },
//     tokenNumber: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     appointmentDate: {
//         type: Date,
//         required: true
//     },
//     qrCode: {
//         type: String,
//         required: true
//     }
// }, { 
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Virtuals
// LoanRequestSchema.virtual('formattedAppointmentDate').get(function() {
//     return this.appointmentDate?.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     }) || 'Not specified';
// });

// LoanRequestSchema.virtual('formattedAppointmentTime').get(function() {
//     return '10:00 AM - 3:00 PM';
// });

// LoanRequestSchema.virtual('loan_emi').get(function() {
//     const principal = this.amount;
//     const rate = this.interestRate / 100 / 12;
//     const time = this.tenure;
    
//     const emi = principal * rate * Math.pow(1 + rate, time) / 
//                (Math.pow(1 + rate, time) - 1);
    
//     return emi.toFixed(2);
// });

// // Fix OverwriteModelError
// if (mongoose.models.LoanRequest) {
//     delete mongoose.models.LoanRequest;
// }

// const LoanRequest = mongoose.model('LoanRequest', LoanRequestSchema);
// export default LoanRequest;