require('dotenv').config();

const getHelpContacts = () => {
  const helpNames = (process.env.HELP_NAMES || '').split(',');
  const helpContacts = (process.env.HELP_CONTACTS || '').split(',');
  return helpNames.map((name, index) => ({
    name, phoneNumber: helpContacts[index],
  }));
};

module.exports = { getHelpContacts };
