import errorLogger from "./error-logger";

export default function (app) {
    app.use(errorLogger);
}