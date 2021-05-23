import {Server} from './server';
import {Client} from './client';
import {clear} from './clear';

clear();

let server = new Server();
server.init();

let client = new Client();
client.init()
client.request('add', [1, 2])

let client2 = new Client();
client2.init()
client2.request('add', [1, 2])
