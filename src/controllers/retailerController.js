/* eslint-disable no-underscore-dangle */
const retailerController = (
  retailerService, wholesalerService, otpService, authenticator, notifier, uploader,
) => {
  const create = {
    roles: [],
    action: async (retailer) => {
      const { status, result } = await retailerService.createRetailer(retailer);
      if (!status) return { statusCode: 400, result };

      await wholesalerService.activateRetailerInWholesalerRetailer(result.phoneNumber);
      const otp = await otpService.createOTP(result.phoneNumber, 2);
      const success = await notifier.sendSMS(`Garhia otp code:    ${otp}`, result.phoneNumber);
      if (success) {
        return {
          statusCode: 201,
          result: { msg: 'successfully created and OTP sent.', result },
        };
      }
      return {
        statusCode: 201,
        result: { msg: 'successfully created but issue sending OTP', result },
      };
    },
  };

  const index = {
    roles: [],
    action: async () => ({ statusCode: 200, result: await retailerService.getRetailers() }),
  };

  const show = {
    roles: [],
    action: async (id) => {
      const retailer = await retailerService.getRetailer(id);
      if (retailer) return { statusCode: 200, result: retailer };
      return { statusCode: 400, result: 'Invalid retailer Id.' };
    },
  };

  const update = {
    roles: [],
    action: async (id, updateObj) => {
      const updatedObj = await retailerService.updateRetailer(id, updateObj);
      if (updatedObj) return { statusCode: 200, result: updatedObj };
      return { statusCode: 400, result: 'Invalid retailer Id.' };
    },
  };

  const generateAndSendOTP = {
    role: [],
    action: async (phoneNumber) => {
      const retailer = await retailerService.getRetailerByPhoneNumber(phoneNumber);
      if (!retailer) return { statusCode: 400, result: 'Please register.' };

      const isPhoneNumberFormat = /^\+234[0-9]{10}$/.test(phoneNumber);
      if (!isPhoneNumberFormat) return { statusCode: 400, result: 'Wrong phone number format. Check phone number format. +234 format.' };

      const otp = await otpService.createOTP(phoneNumber, 2);
      const success = await notifier.sendOTP(phoneNumber.substring(1), otp);
      if (!success) return { statusCode: 400, result: 'Issue sending OTP. Contact Admin.' };

      return { statusCode: 200, result: 'OTP code successfully sent.' };
    },
  };

  const login = {
    roles: [],
    action: async (phoneNumber, otp, token) => {
      let retailer = await retailerService.getRetailerByPhoneNumber(phoneNumber);
      if (!retailer) return { statusCode: 400, result: 'Error Loging in. Check your details.' };

      const valid = await otpService.validateOTP(phoneNumber, 2, otp, new Date());
      if (!valid) return { statusCode: 400, result: 'Invalid OTP.' };

      if (token) {
        retailer = await retailerService.addRetailerToken(retailer._id, token);
      }

      return {
        statusCode: 200,
        result: {
          retailer,
          token: authenticator.generateAuthToken(
            {
              id: retailer._id,
              phoneNumber: retailer.phoneNumber,
              type: 2,
              deviceToken: token || '',
            },
          ),
        },
      };
    },
  };

  const uploadProfileImage = {
    roles: [],
    action: async (retailerId, profileImage) => {
      let retailer = await retailerService.getRetailer(retailerId);
      if (!retailer) return { statusCode: 400, result: 'Please login.' };
      if (!profileImage) return { statusCode: 400, result: 'Please select an image.' };
      profileImage = await uploader.uploadImage(profileImage);
      if (!profileImage) return { statusCode: 500, result: 'Internal server Error. Please contact admin.' };
      retailer = await retailerService.updateRetailerProfileImage(retailerId, profileImage);
      return { statusCode: 200, result: retailer };
    },
  };

  const logout = {
    roles: [],
    action: async (id, token) => {
      await retailerService.removeRetailerToken(id, token);
      return { statusCode: 200, result: 'successfully logged out.' };
    },
  };

  return {
    create,
    index,
    show,
    update,
    generateAndSendOTP,
    uploadProfileImage,
    login,
    logout,
  };
};

module.exports = retailerController;
