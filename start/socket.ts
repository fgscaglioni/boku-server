import BokuClass from 'App/Classes/Boku';
import Ws from 'App/Services/Ws';
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {

  const prefixRoom = (roomName: string) => {
    return `room_${roomName}`;
  }
  const listRoomNames = () => {
    const rooms = Array.from(socket.rooms)
      .filter(room => room.indexOf('room_') > -1)
      .map(room => {
        console.log(room);
        room.replace('room_', '')
      });
    return rooms
  }
  const rooms = {}

  socket.emit('news', { hello: 'world' })
  console.log(Array.from(socket.rooms));

  socket.on('my other event', (data) => {
    console.log(data)
  })

  socket.on('create_room', (params) => {
    const roomName = prefixRoom(params.room)

    if (socket.rooms.has(roomName)) {
      socket.emit('rooms', { rooms: listRoomNames() });
      socket.emit('room_status', {
        code: 'room_unavailable',
        message: 'This room is already in use'
      })
      return
    }

    socket.join(roomName)

    socket.emit('room_status', {
      code: 'room_created',
      message: 'This room was created'
    })


    const game = new BokuClass()
    rooms[roomName] = {
      roomName,
      game,
      players: [{
        socket_id: socket.id,
        player: 1
      }]
    }

    socket.in(roomName).emit('update');
    socket.emit('player_connected', 1);
    socket.emit('rooms', { rooms: listRoomNames() });

  })

  socket.on('join_room', (room) => {
    if (!room.room) return;

    const roomName: any = prefixRoom(room.room);

    if (rooms[roomName]['players'].length == 2) {
      socket.emit('room_status', {
        code: 'room_full',
        message: 'This room already has two players'
      })
      return;
    }

    socket.join(roomName);
    socket.in(roomName).emit('update');

    let opponent = rooms[roomName]['players'][0].player;
    let player = (opponent == 1) ? 2 : 1;
    rooms[roomName]['players'].push({
      socket_id: socket.id,
      player
    })
    socket.emit('player_connected', player);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    for (const key of Object.keys(Ws.io.sockets.adapter.rooms)) {
      let room = Ws.io.sockets.adapter.rooms[key];
      if (room['players']) {
        console.log(Ws.io.sockets.adapter.rooms[key]['players']);
        const players = room['players']
          .filter(player => player.socket_id != socket.id);
        Ws.io.sockets.adapter.rooms[key]['players'] = players;
        console.log(Ws.io.sockets.adapter.rooms[key]['players']);
      }
    }
  })
})
