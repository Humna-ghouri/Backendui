// // routes/loanRoute.js
// import adminMiddleware from '../Middlewares/adminMiddleware.js';

// // Add these routes
// router.get('/admin/all', adminMiddleware, async (req, res) => {
//   try {
//     const loans = await LoanRequest.find().lean();
//     res.json({ success: true, data: loans });
//   } catch (error) {
//     console.error('Error fetching loans:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch loans' });
//   }
// });

// router.put('/admin/:id', adminMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedLoan = await LoanRequest.findByIdAndUpdate(
//       id, 
//       updateData, 
//       { new: true }
//     ).lean();

//     if (!updatedLoan) {
//       return res.status(404).json({ success: false, message: 'Loan not found' });
//     }

//     res.json({ success: true, data: updatedLoan });
//   } catch (error) {
//     console.error('Error updating loan:', error);
//     res.status(500).json({ success: false, message: 'Failed to update loan' });
//   }
// });

// router.delete('/admin/:id', adminMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedLoan = await LoanRequest.findByIdAndDelete(id);

//     if (!deletedLoan) {
//       return res.status(404).json({ success: false, message: 'Loan not found' });
//     }

//     res.json({ success: true, message: 'Loan deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting loan:', error);
//     res.status(500).json({ success: false, message: 'Failed to delete loan' });
//   }
// });