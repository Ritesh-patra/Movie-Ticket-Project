import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import connectDb from './db/db.js';
import {clerkMiddleware} from '@clerk/express';

await connectDb();
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/show.routes.js';
import bookingRouter from './routes/booking.routes.js';
import adminRouter from './routes/admin.route.js';
import userRouter from './routes/user.route.js';
import { stripeWebhooks } from './Controllers/stripeWebhooks.controller.js';


const app = express();
const port = 3000;


// IMPORTANT: Mount webhook route BEFORE body parsers that consume the raw body
// so Stripe signature verification receives the raw payload.
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

//middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send("Hello world")
})
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.listen( port, () => {
    console.log(`server is running on ${port}`)
})
