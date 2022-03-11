import random
import sys
import time
import urllib.request


class AI(object):
    host = "http://localhost:8080"
    request = None
    board = []
    opening_plays = [(6, 5), (7, 5), (6, 6), (5, 5)]
    comum_diagonal = [(1, 1), (1, 2), (1, 3), (1, 4), (1, 5)]
    main_diagonal = comum_diagonal + [(2, 6), (3, 7), (4, 8), (5, 9), (6, 10)]
    secondary_diagonal = [(6, 1), (5, 1), (4, 1),
                          (3, 1), (2, 1)] + comum_diagonal
    threats = [
        ("_____", 1000), ("0____0", 500), ("0____", 100),
        ("_0___", 100), ("__0__", 100), ("___0_", 100),
        ("____0", 100), ("00___00", 20), ("0___00", 20),
        ("00___0", 20), ("0_0__0", 20), ("0__0_0", 20),
        ("0___0", 10), ("_0__0", 10), ("__0_0", 10),
        ("___00", 10), ("00___", 10), ("0_0__", 10),
        ("0__0_", 10), ("0__0", 1)
    ]

    def __init__(self):
        self.host = "http://localhost:8080"
        self.request = urllib.request
        self.board = self.getBoard()

        # running = [0,5,10,15]
        # for i in running:
        #     self.threats[i]
        #     self.threats[i+1]
        #     self.threats[i+2]
        #     self.threats[i+3]
        #     self.threats[i+4]

    def urlOpen(self, url):
        url = self.host+url
        return eval(self.request.urlopen(url).read())

    def getMovimentsCount(self):
        return self.urlOpen('/num_movimentos')

    # Get possibel moviments
    def getMoviments(self):
        return self.urlOpen('/movimentos')

    def getBoard(self):
        return self.urlOpen('/tabuleiro')

    def chooseMoviment(self):
        if (self.getMovimentsCount() > 1):
            moviments = self.getMoviments()
            moviment = random.choice(moviments)
        else:
            moviment = random.choice(self.opening_plays)
        return moviment

    def neighbors(self, column, line):
        l = []

        if line > 1:
            l.append((column, line - 1))  # up
        else:
            l.append(None)

        if (column < 6 or line > 1) and (column < len(self.board)):
            if column >= 6:
                l.append((column + 1, line - 1))  # upper right
            else:
                l.append((column + 1, line))  # upper right
        else:
            l.append(None)

        if (column < 6 or line < len(self.board[column - 1])) and column < len(self.board):
            if column < 6:
                l.append((column + 1, line + 1))  # down right
            else:
                l.append((column + 1, line))  # down right
        else:
            l.append(None)

        if line < len(self.board[column - 1]):
            l.append((column, line + 1))  # down
        else:
            l.append(None)

        if (column > 6 or line < len(self.board[column - 1])) and column > 1:
            if column > 6:
                l.append((column - 1, line + 1))  # down left
            else:
                l.append((column - 1, line))  # down left
        else:
            l.append(None)

        if (column > 6 or line > 1) and (column > 1):
            if column > 6:
                l.append((column - 1, line))  # upper left
            else:
                l.append((column - 1, line - 1))  # upper left
        else:
            l.append(None)

        return l

    def colsToString(self):
        cols = []
        for col in range(len(self.board)):
            string = ""
            for row in range(len(self.board[col])):
                string += str(self.board[col][row])
            cols.append(string)
        return cols

    def diagonalToString(self, main=True):
        diags = []
        diagonal = self.main_diagonal if main else self.secondary_diagonal
        direction = 1 if main else 2
        for col, row in diagonal:
            string = ""
            coords = (col, row)
            while coords != None:
                string += str(self.board[coords[0]-1][coords[1]-1])
                coords = self.neighbors(coords[0], coords[1])[direction]
            diags.append(string)
        return diags


if len(sys.argv) == 1:
    print("Voce deve especificar o numero do jogador (1 ou 2)\n\nExemplo:    ./random_client.py 1")
    quit()

player = int(sys.argv[1])
done = False
ai = AI()

while not done:
    player_turn = ai.urlOpen("/jogador")

    # Se jogador == 0, o jogo acabou e o cliente perdeu
    if player_turn == 0:
        print("I lose.")
        done = True

    # Se for a vez do jogador
    if player_turn == player:
        move = ai.chooseMoviment()
        msg = ai.urlOpen("/move?player=%d&coluna=%d&linha=%d" %
                         (player, move[0], move[1]))
        # Se com o movimento o jogo acabou, o cliente venceu
        if msg[0] == 0:
            print("I win")
            done = True
        if msg[0] < 0:
            raise Exception(msg[1])

    # Descansa um pouco para nao inundar o servidor com requisicoes
    time.sleep(1)
