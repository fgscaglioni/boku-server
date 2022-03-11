// let board = [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0]
// ];
// let socket;
let room = 'default';
let rooms = [];
let player = 0;

const socket = io();

console.log({
  domain: document.domain,
  port: location.port,
  socket
})

// function getSocket(query) {
//   let config;
//   const defaultConfig = {
//     // allowEIO3: true,
//     // transports: ['websocket'],
//     // rejectUnauthorized: false
//   }
//   config = (query) ? { ...query, ...defaultConfig } : defaultConfig

//   return socket
// }

socket.on('connected', (id) => { console.log(id); })
socket.on('disconnect', (id) => { console.log(id); })
socket.on('error', (error) => { console.log(error); })
socket.on('onCommand', (command) => { console.log(command); })
socket.on('rooms', (availableRooms) => {
  console.log('available rooms', availableRooms);
  rooms = availableRooms.rooms
  listRooms()
})
socket.on('player_connected', (player_number) => {
  player = player_number
  console.log('você é o jogador' + player);
  $("#localPlayer").html("você é o jogador: " + player)
})
socket.on('update', (msg) => {
  console.log('update', msg);
  gameStatus();
});
socket.on('room_status', (status) => {
  console.log(status.code, status.message);
});




$(document).ready(function () {
  const btnJoinEl = document.getElementById('btnJoin');
  btnJoinEl.addEventListener('click', (ev) => {
    console.log(ev);
    room = document.getElementById('txtRoom').value
    const playerName = document.getElementById('txtPlayerName').value
    socket.emit('create_room', {
      command: 'create',
      room,
      player,
      playerName,
      players: [player]
    })
  })

  const roomsEl = document.getElementById('rooms');
  roomsEl.addEventListener('change', (ev) => {
    console.log(ev.target.value);
    room = ev.target.value
    socket.emit('join_room', {
      command: 'join',
      room: room,
      player
    })
  })

});


function drawBoard(board) {
  let hexagon = document.getElementById('rc');
  let paddingTop = 30;
  hexagon.innerHTML = ""
  for (let c = 0; c < board.length; c++) {
    let column = document.createElement('div')
    column.setAttribute('id', `c${c}`)
    column.setAttribute('class', 'column')
    column.style.paddingTop = `${Math.abs(paddingTop)}%`
    // column.style.height = `${100 - Math.abs(paddingTop)}%`
    for (let l = 0; l < board[c].length; l++) {
      let line = document.createElement('div')
      const playerClass = (board[c][l] == 0) ? '' : `player${board[c][l]}`
      line.setAttribute('data-col-row', `(${c},${l})`)
      line.setAttribute('id', `l${l}`)
      line.setAttribute('class', `line ${playerClass}`)
      line.addEventListener('click', function () {
        play(c + 1, l + 1)
      })
      column.appendChild(line)
    }
    hexagon.appendChild(column)
    paddingTop = paddingTop - 6;
  }
}

function play(column, line) {
  // player = parseInt($("#jogador").text());
  request(
    `/move?player=${player}&coluna=${column}&linha=${line}&room=${room}`,
    (result) => {
      $("#estado").html(result);
    });
}

function gameStatus() {
  request(`/game_status?room=${room}`, (result) => {
    // console.log(result);

    drawBoard(result.board);
    $("#jogador").html(result.player);
    $("#movimentos").html(result.num_movimentos);
    console.log(result.last_move);
    $("#ultima_jogada").text(JSON.stringify(result.last_move));
    if (result.final != null) {
      $("#estado").html(result.final + ' wins!');
    }

    if (result.last_move.column > -1 && result.player == player) {
      const column = result.last_move.column - 1;
      const line = result.last_move.line - 1;
      const lastMoveEl = document
        .querySelector(`#c${result.last_move.column - 1}`)
        .querySelector(`#l${result.last_move.line - 1}`)
      lastMoveEl.classList.add('last-move')
    }
  });
}

function reiniciar() {
  $("#jogador").text('1');
  $("#estado").text('Aguardando movimento');
  $("#movimentos").text('0');
  $("#ultima_jogada").text('{"column":-1,"line":-1}');
  request(`/restart?room=${room}`, () => { gameStatus(); })
}

function request(url, callback) {
  $.ajax({
    url,
    success: function (data) {
      callback(data)
    },
    error: function (err) {
      console.error(err);
    }
  });
}

function listRooms() {
  const roomsEl = document.getElementById('rooms')
  roomsEl.innerHTML = ""

  const first = document.createElement('option')
  first.id = '';
  first.value = '';
  first.text = '';
  roomsEl.appendChild(first)

  for (const room of rooms) {
    const el = document.createElement('option')
    el.id = room;
    el.value = room;
    el.text = room;
    roomsEl.appendChild(el)
  }

}

