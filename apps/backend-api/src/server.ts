import app from './app.js';
import { env } from './config/env.js';
app.listen(env.PORT, () => console.log(`Gaurav Nursery API v2 listening on :${env.PORT}`));
