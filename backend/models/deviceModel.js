const Device = require("./Device");

// GET ALL DEVICES
const getAllDevices = async () => {
  return await Device.find().sort({ createdAt: -1 });
};

// GET DEVICE BY CODE
const getDeviceByCode = async (device_code) => {
  return await Device.findOne({ device_code });
};

// CREATE DEVICE
const createDevice = async ({ name, device_code }) => {
  return await Device.create({
    name,
    device_code,
  });
};

// DELETE DEVICE
const deleteDevice = async (id) => {
  const result = await Device.findByIdAndDelete(id);
  return !!result;
};

// UPDATE DEVICE
const updateDeviceStatusByCode = async (device_code, data) => {
  return await Device.findOneAndUpdate(
    { device_code },
    data,
    {
      new: true,
    }
  );
};

module.exports = {
  getAllDevices,
  getDeviceByCode,
  createDevice,
  deleteDevice,
  updateDeviceStatusByCode,
};