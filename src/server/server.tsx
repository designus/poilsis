import app from './app';

const expressPort = 3000;

app.listen(expressPort, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${expressPort}. Open up http://localhost:${expressPort}/ in your browser.`);
  }
});
