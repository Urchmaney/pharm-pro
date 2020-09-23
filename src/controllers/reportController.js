const reportController = (reportService) => {
  const create = {
    roles: [],
    action: async (report) => {
      const { status, result } = await reportService.createReport(report);
      if (status) return { statusCode: 200, result };

      return { statusCode: 400, result };
    },
  };

  return { create };
};

module.exports = reportController;
