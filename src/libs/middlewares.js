import express from 'express';

module.exports = app => {
    //Settings
    app.set('port', process.env.PORT || 3000);

    //middlewares
    app.use(express.json());
};