import 'reflect-metadata';
import socketIO, {Socket} from 'socket.io-client';
import * as d from 'dotenv';
import {ClusterFunction} from './cluster-function';

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

        this.client.on('connect', () => {
            console.log('Connected');
        });

        this.client.on('sandbox', (a) => {
            console.log('sandbox', a);
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

let client = new Client();
client.init()
