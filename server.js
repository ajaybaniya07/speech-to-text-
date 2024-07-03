const express = require('express');
const app = express();
const port = 3000;

let clients = [];

app.use(express.static(__dirname));

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

app.post('/broadcast', express.json(), (req, res) => {
    const message = req.body;
    clients.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
    res.status(200).end();
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
