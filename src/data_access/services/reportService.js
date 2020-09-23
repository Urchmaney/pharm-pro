const Report = require('../schemas/report_schema');

const createReport = async (report) => {
  try {
    report = new Report(report);
    const error = report.validateSync();
    if (error) {
      return {
        status: false,
        result: Object.keys(error.errors).map(ele => error.errors[ele].message),
      };
    }
    await report.save();
    return { status: true, result: report };
  } catch (e) {
    return { status: false, result: [e.message] };
  }
};

module.exports = {
  createReport,
};