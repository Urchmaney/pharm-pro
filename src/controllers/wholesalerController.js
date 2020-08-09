/* eslint-disable no-underscore-dangle */
const wholesalerController = (wholesalerService, otpService, authenticator, notifier, uploader) => {
  const create = {
    roles: [],
    action: async (wholesaler) => {
      const { status, result } = await wholesalerService.createWholesaler(wholesaler);
      if (!status) return { statusCode: 400, result };
      const otp = await otpService.createOTP(result.phoneNumber, 1);
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
    action: async () => ({ statusCode: 200, result: await wholesalerService.getWholesalers() }),
  };

  const show = {
    roles: [],
    action: async (id) => {
      const wholesaler = await wholesalerService.getWholesalerById(id);
      if (!wholesaler) return { statusCode: 404, result: 'wholesaler with id does not exist' };
      return { statusCode: 200, result: wholesaler };
    },
  };

  const update = {
    roles: [],
    action: async (id, newWholesaler) => {
      const oldWholesaler = await wholesalerService.getWholesalerById(id);
      if (!oldWholesaler) return { statusCode: 400, result: 'wholesaler with id does not exist' };
      const result = await wholesalerService.updateWholesaler(id, newWholesaler);
      return { statusCode: 200, result };
    },
  };

  const deleteAction = {
    roles: [],
    action: async (id) => {
      const wholesaler = await wholesalerService.getWholesalerById(id);
      if (wholesaler) await wholesalerService.updateWholesaler(id, { isDeleted: true });
      return { statusCode: 200, result: 'successfully deleted wholesaler.' };
    },
  };

  const generateAndSendOTP = {
    role: [],
    action: async (phoneNumber) => {
      const otp = await otpService.createOTP(phoneNumber, 1);
      const success = await notifier.sendSMS(`Garhia otp code:    ${otp}`, phoneNumber);
      if (!success) return { statusCode: 400, result: 'Issue sending OTP. Check phone number format. +234 format.' };
      return { statusCode: 200, result: 'OTP code successfully sent.' };
    },
  };

  const uploadProfileImage = {
    roles: [],
    action: async (wholesalerId, profileImage) => {
      let wholesaler = await wholesalerService.getWholesalerById(wholesalerId);
      if (!wholesaler) return { statusCode: 400, result: 'Please login.' };
      if (!profileImage) return { statusCode: 400, result: 'Please select an image.' };
      profileImage = await uploader.uploadImage(profileImage);
      if (!profileImage) return { statusCode: 500, result: 'Internal server Error. Please contact admin.' };
      wholesaler = await wholesalerService.uploadWholesalerProfile(wholesalerId, profileImage);
      return { statusCode: 200, result: wholesaler };
    },
  };

  const login = {
    roles: [],
    action: async (phoneNumber, otp) => {
      const wholesaler = await wholesalerService.getWholesalerByPhoneNumber(phoneNumber);
      if (!wholesaler) return { statusCode: 400, result: 'Error Loging. Check your details.' };
      const valid = await otpService.validateOTP(phoneNumber, 1, otp, new Date());
      if (!valid) return { statusCode: 400, result: 'Invalid OTP.' };
      return {
        statusCode: 200,
        result: {
          wholesaler,
          token: authenticator.generateAuthToken(
            {
              id: wholesaler._id,
              phoneNumber: wholesaler.phoneNumber,
              type: 1,
            },
          ),
        },
      };
    },
  };

  return {
    login,
    create,
    index,
    show,
    update,
    deleteAction,
    generateAndSendOTP,
    uploadProfileImage,
  };
};

module.exports = wholesalerController;