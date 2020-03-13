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
    console.log('SOCKET Atualiza');
    atualiza();
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
  $.ajax({
    url: "/move?player=" + player + "&coluna=" + column + "&linha=" + line,
    success: function (result) {
      $("#estado").html(result);
    }
  });
  // atualiza();
}

function atualiza_board() {
  $.ajax({
    url: "/board",
    success: function (result) {
      board = eval(result);
      drawBoard(board);
    }
  });
}

function atualiza_turno() {
  $.ajax({
    url: "/player",
    success: function (result) {
      $("#jogador").html(result);
    }
  });
}

function atualiza_movimentos() {
  $.ajax({
    url: "/num_movimentos",
    success: function (result) {
      $("#movimentos").html(result);
    }
  });
}

function atualiza_ultima_jogada() {
  $.ajax({
    url: "/last_move",
    success: function (result) {
      $("#ultima_jogada").text(JSON.stringify(result));
    }
  });
}

function atualiza_status() {
  $.ajax({
    url: "/final",
    success: function (result) {
      if (result != null) {
        $("#estado").html(result + ' wins!');
      }
    }
  });
}

function atualiza() {
  atualiza_board();
  atualiza_turno();
  atualiza_movimentos();
  atualiza_ultima_jogada();
  atualiza_status();
}

function reiniciar() {
  $("#jogador").text('1');
  $("#estado").text('Aguardando movimento');
  $("#movimentos").text('0');
  $("#ultima_jogada").text('{"column":-1,"line":-1}');
  $.ajax({
    url: "/restart",
    success: function (result) {
      atualiza();
    }
  });
}
