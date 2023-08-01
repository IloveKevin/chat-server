import badyParser from 'body-parser';

export default (app) => app.use(badyParser.json());