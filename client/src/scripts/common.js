export function getErrorMsg(message) {
  let msgArray = [
    "course not found, invalid course detail",
    "ticket not found, submit valid ticket",
    "INVALID_ARGUMENT",
  ];
  if (message)
    for (let i = 0; i < msgArray.length; i++) {
      if (message.toString().includes(msgArray[i])) return msgArray[i];
    }
  return "Something is wrong where error can't detect";
}
