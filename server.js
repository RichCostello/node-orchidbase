var express = require('express'),
    path = require('path'),
    http = require('http'),
    orchid = require('./routes/orchids');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/orchids', orchid.findAll);
app.get('/orchids/:id', orchid.findById);
app.post('/orchids', orchid.addOrchid);
app.put('/orchids/:id', orchid.updateOrchid);
app.delete('/orchids/:id', orchid.deleteOrchid);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
