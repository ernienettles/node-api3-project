const server = require("./server.js");
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');


const PORT = 9000;
server.listen(PORT, () => {
    console.log(`\n* Server Running on http://localhost:${PORT} *\n`);
});
