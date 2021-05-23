import socketIO, {Socket} from 'socket.io-client';
import * as d from 'dotenv';

let env = d.config().parsed ?? {};

// client.emit('add', [1, 2]).once('add:result', (res) => {
//     console.log('add:result', res);
// });

export function ClusterFunction(opts = {}): MethodDecorator {
    return ((target, propertyKey, descriptor) => {

    });
}

export class Client {
    private client: Socket;

    public constructor(private uri: string = `http://localhost:${env.SERVER_PORT}`) {
        this.client = socketIO(`http://localhost:${env.SERVER_PORT}`)
    }

    public init() {
        this.client.connect();

        this.client.on('connect', () => {
            console.log('Connected');
        });
    }

    @ClusterFunction()
    public add(a: number, b: number) {
        return a + b;
    }

    public async rAdd() {

    }

    public request(fn: string, args: any) {
        return new Promise<number>((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject({reason: 'timeout'});
            }, 10000);
            this.client.emit('ClusterFunctionRequest', {
                fn,
                args
            }).once('request:add:result', (result) => {
                clearTimeout(timeout);
                resolve(result);
            });
        });
    }
}
