import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import app from './app';
import { Boku } from "./classes/boku.class";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const server = createServer(app);
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);
const prefixRoom = (room: any) => {
    if (!room) return '';
    return `room_${room}`;
}


// socket
io.on("connection", socket => {
    console.log({
        message: 'user connected',
        // socket: socket
    });
    const room = prefixRoom(socket.handshake.query.room || 'default')
    console.log({ room });




    const listRooms = () => {
        const rooms: any[] = []
        io.sockets.adapter.rooms.forEach((value, key) => {
            if (key.indexOf('room_') > -1) {
                rooms.push(key.replace('room_', ''))
            }
        })
        console.table(rooms)
        io.emit('room_list', { rooms })
    }
    listRooms();




    socket.on('refresh', (data: any, callback: any) => {
        console.log({ data, callback });

        let roomName: string = prefixRoom(data.room);
        socket.join(roomName);

        callback(socket.data)
    })

    socket.on('play', (data: any, callback: any) => {
        console.log({ data, callback });
        let roomName: string = prefixRoom(data.room);
        socket.join(roomName);

        socket.data.game.move({
            player: data.player,
            column: data.column,
            line: data.line
        })

        callback(socket.data)
        socket.emit('refresh')
    })

    socket.on('join_room', (data, callback) => {

        if (!data.room) {
            callback({
                error: true,
                code: 'invalid_room_name',
                message: 'Invalid room name'
            });
        }



        let roomName: string = prefixRoom(data.room);
        socket.join(roomName);

        const _data = {
            room: data.room,
            game: new Boku(),
            players: [{
                number: 1,
                name: data.playerName
            }],
            ...data
        }
        socket.data = _data

        // if (_data.players.length == 2) {
        //     callback({
        //         error: true,
        //         code: 'room_full',
        //         message: 'This room already has two players'
        //     })
        // }

        // if (!_data.game) {
        //     _data.game = new Boku()
        // }

        // io.in(roomName).emit('refresh');

        // let opponent = io.sockets.adapter.rooms[roomName]['players'][0].player;
        // let player = (opponent == 1) ? 2 : 1;
        // io.sockets.adapter.rooms[roomName]['players'].push({
        //     socket_id: socket.id,
        //     player
        // })
        // socket.emit('player_connected', player);


        callback({
            success: true,
            data: _data
        })

    })















    socket.on('create_room', (room) => {
        let roomName = prefixRoom(room.room) || '';

        if (io.sockets.adapter.rooms.get(roomName)) {
            listRooms();
            socket.emit('room_status', {
                code: 'room_unavailable',
                message: 'This room is already in use'
            })
            return
        }

        socket.join(roomName);


        let game: Boku = new Boku();
        socket.data.game = game
        socket.data.players = [{
            socket_id: socket.id,
            player: 1
        }]

        io.emit('room_status', {
            code: 'room_created',
            message: 'This room was created'
        })

        io.in(roomName).emit('refresh')
        socket.emit('player_connected', 1);

        listRooms();
    })



    socket.on('disconnect', () => {
        console.log('user disconnected');
        // for (const key of Object.keys(io.sockets.adapter.rooms)) {
        //     let room = io.sockets.adapter.rooms[key];
        //     if (room['players']) {
        //         console.log(io.sockets.adapter.rooms[key]['players']);
        //         const players = room['players']
        //             .filter(player => player.socket_id != socket.id);
        //         io.sockets.adapter.rooms[key]['players'] = players;
        //         console.log(io.sockets.adapter.rooms[key]['players']);
        //     }
        // }
    })

});

export { io, prefixRoom };


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
    join_room: (data: any, callback: any) => void
    refresh: (data: any, callback: any) => void
    play: (data: any, callback: any) => void

}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
    game: Boku;
    players: any[]
}
