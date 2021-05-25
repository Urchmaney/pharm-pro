/* eslint-disable no-underscore-dangle */
const agentController = (agentService) => {
  const create = {
    roles: [],
    action: async (agent) => {
      const { status, result } = await agentService.createAgent(agent);
      if (status) return { statusCode: 201, result };
      return { statusCode: 400, result };
    },
  };

  return {
    create,
  };
};

module.exports = agentController;
