import * as http from 'http';
import * as d from 'dotenv';

let env = d.config().parsed ?? {};

interface ServerProps {
    port?: number;
}

interface ClusterFunctionRequestData<T = any> {
    fn: string;
    args: T;
}

interface ClusterFunctionResponseData<T = any, R = any> {
    fn: string;
    args: T;
    result: R;
}

export class Server {
    public constructor({port = +env.SERVER_PORT}: ServerProps = {}) {
    }
    public init() {
        const server = http.createServer();
        const io = require("socket.io")(server);
        io.on('connection', (socket: any) => {
            console.log(`Connected ${socket.id}`);
            socket.on('add', ([a, b]: any) => {
                socket.emit('add:result', a + b);
            });

            socket.on('ClusterFunctionRequest', (res: ClusterFunctionRequestData) => {
                socket.broadcast.emit('ClusterFunctionRequest', res);
                socket.once('ClusterFunctionResponse', (res: ClusterFunctionResponseData) => {
                    console.log('ClusterFunctionResponse', res);
                });
            });
        });

        server.listen(+env.SERVER_PORT);
        console.log(`Server listening on port ${env.SERVER_PORT}`)
    }
}
