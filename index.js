const jsonServer = require('json-server');
const UserServer = jsonServer.create();
const middleware = jsonServer.defaults();
const route = jsonServer.router('db.json');
const PORT = 5001;

console.log("Starting JSON Server...");

UserServer.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

// Add body parser to handle POST request bodies
UserServer.use(jsonServer.bodyParser);

// Logger middleware
UserServer.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Custom POST route for deleting an inventory item
UserServer.post('/delete-item', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 👈 Add this
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 👈 And this
    console.log('Received request to delete igtem:', req.body);
    const { id,type } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const db = route.db; // lowdb instance
    const inventory = db.get(type);
    const item = inventory.find({ id }).value();

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    inventory.remove({ id }).write();
    res.status(200).json({ success: true, deletedId: id });
});

// Use default middleware and router
UserServer.use(middleware);
UserServer.use(route);

// Start the server
UserServer.listen(PORT, () => {
    console.log(`User manage server started at port ${PORT} and waiting for client request`);
});
