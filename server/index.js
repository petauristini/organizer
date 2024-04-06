const path = require('path');
const express = require('express');

const app = express();

const port = 5000;

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Hello World!" });
});
  
app.get('*', (res, req) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
