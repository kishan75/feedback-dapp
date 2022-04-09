const jlkjlk = async () => {
  return new Promise((resolve, reject) => {
    // resolve("datsfsdfsa");
    reject("errfsdfsdfsor");
  });
};

let jp = async () => {
  let [res, err] = await jlkjlk();
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
};

jp();
