import 'reflect-metadata';
import socketIO, {Socket} from 'socket.io-client';
import * as d from 'dotenv';

export interface ClusterFunctionType {
    propertyKey: string | symbol;
    opts: any;
}

export function ClusterFunction(opts = {}): MethodDecorator {
    return ((target, propertyKey, descriptor) => {
        let trg = target.constructor;
        console.log('ClusterFunction', trg);
        let ClusterFunctions: ClusterFunctionType[] = Reflect.getMetadata('ClusterFunctions', trg);

        if (!ClusterFunctions) {
            ClusterFunctions = [];
        }

        ClusterFunctions.push({
            propertyKey,
            opts
        });

        Reflect.defineMetadata('ClusterFunctions', trg, ClusterFunctions);
    });
}

let env = d.config().parsed ?? {};

// client.emit('add', [1, 2]).once('add:result', (res) => {
//     console.log('add:result', res);
// });

export class Client {
    private client: Socket;

    public constructor(private uri: string = `http://localhost:${env.SERVER_PORT}`) {
        this.client = socketIO(uri)
    }

    public init() {
        this.client.connect();

        this.client.on('ClusterFunctionRequest', (res) => {
            console.log('client ClusterFunctionRequest', res);
        });
    }

    @ClusterFunction()
    public add(a: number, b: number) {
        return a + b;
    }

    public request(fn: string, args: any) {
        return new Promise<number>((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject({reason: 'timeout'});
            }, 10000);
            this.client.emit('ClusterFunctionRequest', {
                fn,
                args
            }).once('ClusterFunctionResponse', (result) => {
                clearTimeout(timeout);
                resolve(result);
            });
        });
    }
}
