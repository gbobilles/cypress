const dateUtils = {
  getDateToday: function() {
    return new Date();
  },
  getDateTodayAsString: function() {
    return dateUtils.getDateToday().toLocaleDateString();
  },
  getDateTodayMinusDays: function(daysToMinus: number) {
    const dateToday = dateUtils.getDateToday();
    dateToday.setDate(dateToday.getDate() - daysToMinus);
    return dateToday;
  },
  getDateTodayMinusMonths: function(monthsToMinus: number) {
    const dateToday = dateUtils.getDateToday()
    dateToday.setMonth(dateToday.getMonth() - monthsToMinus);
    return dateToday;
  },
  getDateTodayPlusYears: function(yearsToAdd: number) {
    const dateToday = dateUtils.getDateToday()
    dateToday.setMonth(dateToday.getFullYear() + yearsToAdd);
    return dateToday;
  }
}

export default dateUtils;
