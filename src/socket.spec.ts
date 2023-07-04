const { createServer } = require("http");
import { Server, Socket } from "socket.io";
const Client = require("socket.io-client");

describe("my awesome project", () => {
    let io: Server, serverSocket: Socket, clientSocket: any;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", socket => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("should work", (done) => {
        clientSocket.on("hello", (arg: any) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    test("should work (with ack)", (done) => {
        serverSocket.on("hi", (cb: any) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg: any) => {
            expect(arg).toBe("hola");
            done();
        });
    });





    test("should work (returning game info)", (done) => {

        serverSocket.data.game = [1, 2, 3]

        serverSocket.on("refresh", (cb: any) => {
            cb(serverSocket.data.game);
        });
        clientSocket.emit("refresh", (arg: any) => {
            console.table(arg)
            expect(true).toBe(true);
            done();
        });
    });




});

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;

    room_list: (rooms: any) => void
    room_join: (room: string) => void
    room_exit: () => void
    room_status: (status: any) => void
    refresh: () => void
    player_connected: (player: number) => void
}

interface ClientToServerEvents {
    hello: () => void;
    connected: () => void

    create_room: (room: any) => void
    join_room: (room: any) => void
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
    // game: Boku;
    players: any[]
}
