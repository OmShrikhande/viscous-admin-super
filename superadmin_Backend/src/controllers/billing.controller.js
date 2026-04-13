const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getStub = asyncHandler(async (req, res) => {
  res.status(200).send(new ApiResponse(true, 'billing endpoint hit'));
});

module.exports = {
  getStub
};
