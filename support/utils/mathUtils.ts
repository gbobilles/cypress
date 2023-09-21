const mathUtils = {
  generateRandomNumber: function (length: number) {
    const min = Math.pow(10, (length - 1));
    const max = Math.pow(10, (length));
    return Math.floor(Math.random() * (max - min) + min);
  },
  generateRandomString: function(length: number) {
    return Math.random().toString(36).substring(2, length + 2).toUpperCase();
  },
  randomIntFromInterval: function (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export default mathUtils;
