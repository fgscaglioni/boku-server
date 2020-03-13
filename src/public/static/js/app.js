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

$(document).ready(function () {
  //connect to the socket server.
  var socket = io.connect('http://' + document.domain + ':' + location.port + '/socket');

  //receive update signal from server
  socket.on('update', function (msg) {
    gameStatus();
  });
});


function drawBoard(board) {
  let hexagon = document.getElementById('rc');
  let paddingTop = 75;
  hexagon.innerHTML = ""
  for (let c = 0; c < board.length; c++) {
    let column = document.createElement('div')
    column.setAttribute('id', `c${c}`)
    column.setAttribute('class', 'column')
    column.style.paddingTop = `${Math.abs(paddingTop)}px`
    for (let l = 0; l < board[c].length; l++) {
      let line = document.createElement('div')
      const playerClass = (board[c][l] == 0) ? '' : `player${board[c][l]}`
      line.setAttribute('class', `line ${playerClass}`)
      line.addEventListener('click', function () {
        addEventListener(c + 1, l + 1)
      })
      column.appendChild(line)
    }
    hexagon.appendChild(column)
    paddingTop = paddingTop - 15;
  }
}

function addEventListener(column, line) {
  player = parseInt($("#jogador").text());
  request(
    `/move?player=${player}&coluna=${column}&linha=${line}`,
    (result) => {
      $("#estado").html(result);
    });
}

function gameStatus() {
  request('/game_status', (result) => {
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
  request('/restart', () => { gameStatus(); })
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
