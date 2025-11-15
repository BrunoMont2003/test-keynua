import app from './app';
import { config } from './config/index';

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
  console.log(`Webhook endpoint: http://localhost:${config.port}/api/webhook`);
});
