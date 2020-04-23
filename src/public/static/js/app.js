let board = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
];
let socket;
let room = 'default';
let rooms = [];



$(document).ready(function () {
  // joinRoom();
  const btnJoinEl = document.getElementById('btnJoin');
  btnJoinEl.addEventListener('click', (ev) => {
    room = document.getElementById('txtRoom').value
    joinRoom()
  })

  const roomsEl = document.getElementById('rooms');
  roomsEl.addEventListener('change', (ev) => {
    console.log(ev.target.value);
    room = ev.target.value
    joinRoom()
  })

  joinRoom()
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
  player = parseInt($("#jogador").text());
  request(
    `/move?player=${player}&coluna=${column}&linha=${line}&room=${room}`,
    (result) => {
      $("#estado").html(result);
    });
}

function gameStatus() {
  request(`/game_status?room=${room}`, (result) => {
    drawBoard(result.board);
    $("#jogador").html(result.player);
    $("#movimentos").html(result.num_movimentos);
    $("#ultima_jogada").text(JSON.stringify(result.last_move));
    if (result.final != null) {
      $("#estado").html(result.final + ' wins!');
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

function joinRoom() {
  // room = document.getElementById('room').value
  socket = io.connect('http://' + document.domain + ':' + location.port, { query: `room=${room}` });
  socket.on('update', function (msg) {
    console.log('evento de update');
    gameStatus();
  });

  socket.on('rooms', (availableRooms) => {
    rooms = availableRooms.rooms
    listRooms()
  })
}

function listRooms() {
  console.log(rooms);
  const roomsEl = document.getElementById('rooms')

  roomsEl.innerHTML = ""
  for (const room of rooms) {
    const el = document.createElement('option')
    el.id = room;
    el.value = room;
    el.text = room;
    roomsEl.appendChild(el)
  }

}

