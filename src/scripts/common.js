export function getErrorMsg(message) {
  let msgArray = [
    "Course not found, invalid course detail",
    "TxN Error: Invalid ticket",
    "INVALID_ARGUMENT",
  ];
  if (message)
    for (let i = 0; i < msgArray.length; i++) {
      if (message.toString().includes(msgArray[i])) return msgArray[i];
    }
  return "Something is wrong where error can't detect";
}

export function jsFloatToSolFloat(num) {
  return {
    preDecimal: num.toString().split(".")[0],
    postDecimal:
      num.toString().split(".").length > 1 ? num.toString().split(".")[1] : 0,
  };
}
