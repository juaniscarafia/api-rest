import express from 'express';
import consign from 'consign';

const app = express();

consign({
    cwd: __dirname
})
    .include('libs/config.js')
    .then('db.js')
    .then('libs/middlewares.js')
    //.then('libs/authController.js')
    //.then('libs/verifyToken.js')
    .then('routes')
    .then('libs/boot.js')
    .into(app)