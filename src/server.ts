import * as http from 'http';
import * as d from 'dotenv';

let env = d.config().parsed ?? {};

interface ServerProps {
    port?: number;
}

export class Server {
    public constructor({port = +env.SERVER_PORT}: ServerProps = {}) {
    }
    public init() {
        const server = http.createServer();
        const io = require("socket.io")(server);
        io.on('connection', (socket: any) => {
            console.log(`Connected`);
            socket.on('add', ([a, b]: any) => {
                socket.emit('add:result', a + b);
            });
        });
        server.listen(+env.SERVER_PORT);
        console.log(`Server listening on port ${env.SERVER_PORT}`)
    }
}
let server = new Server();
server.init();
