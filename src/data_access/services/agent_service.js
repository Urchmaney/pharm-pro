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

const verifyLoginDetail = async (phoneNumber, password) => {
  const user = await AgentModel.findOne({ phoneNumber });
  if (!user) return { status: false, result: ['Wrong Login details.'] };

  const isPasswordCorreect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorreect) return { status: false, result: ['Wrong Login details.'] };

  return { status: true, result: user };
};

module.exports = {
  createAgent,
  verifyLoginDetail,
};
