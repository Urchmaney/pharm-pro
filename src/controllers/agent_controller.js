/* eslint-disable no-underscore-dangle */
const agentController = (agentService, authenticator) => {
  const create = {
    roles: [],
    action: async (agent) => {
      const { status, result } = await agentService.createAgent(agent);
      if (status) return { statusCode: 201, result };
      return { statusCode: 400, result };
    },
  };

  const login = {
    action: async (phoneNumber, password) => {
      const { status, result } = await agentService.verifyLoginDetail(phoneNumber, password);
      if (!status) return { statusCode: 400, result };
      return {
        statusCode: 200,
        result: {
          agent: result,
          token: authenticator.generateAuthToken(
            {
              id: result._id,
              phoneNumber: result.phoneNumber,
              fullName: result.fullName,
            },
          ),
        },
      };
    },
  };

  return {
    create,
    login,
  };
};

module.exports = agentController;
