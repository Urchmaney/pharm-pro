const bcrypt = require('bcrypt');
const AgentModel = require('../schemas/agent_schema');

const hashPassword = (password, callback) => bcrypt.hash(password, 5, callback);

const createAgent = async (agent) => {
  agent = new AgentModel(agent);
  const error = agent.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await agent.save();
  hashPassword(agent.password, (err, hash) => {
    agent.password = hash;
    agent.save();
  });
  return { status: true, result: agent };
};

module.exports = {
  createAgent,
};
