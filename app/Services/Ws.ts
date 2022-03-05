import AdonisServer from '@ioc:Adonis/Core/Server'
import { Server } from 'socket.io'

// https://docs.adonisjs.com/cookbooks/socketio-with-adonisjs

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!)
  }
}

export default new Ws()
