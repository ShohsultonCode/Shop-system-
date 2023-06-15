const whitelist: RegExp[] = [/http:\/\/localhost:[0-9]{4}$/];
export const corsOptions: any = {
  origin: function (origin, callback) {
    if (!origin || whitelist.some((w) => origin.match(w))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
};
