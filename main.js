Kame = {
  Canvas: {
    Canvas: null,
    Context: null,
    // Helper functions
    init: function () {      
      console.log("Initializing Kame Canvas...")
      let timer = Kame.Util.benchmark("Kame Canvas initialization")
      Kame.Canvas.Canvas = document.getElementById("KameDisplay")
      if (!Kame.Canvas.Canvas) {console.log("Failed to locate a canvas with id KameDisplay"); return}
      Kame.Canvas.Context = Kame.Canvas.Canvas.getContext("2d");
      timer.stop();
    },
    clear: function () {
      Kame.Canvas.Context.clearRect(0, 0, Kame.Canvas.Canvas.width, Kame.Canvas.Canvas.height)
    },
    // Vector Graphics
    drawLine: function (x1, y1, x2, y2, color, strokeWidth) {
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    drawVect: function (x, y, angle, magnitude, color, strokeWidth) {
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }

      ctx.beginPath();
      ctx.moveTo(x, y);

      let newX = (Math.cos(Kame.Util.degToRad(angle)) * magnitude) | 0
      let newY = (Math.sin(Kame.Util.degToRad(angle)) * magnitude) | 0

      ctx.lineTo(x + newX, y + newY);
      ctx.stroke();

    },
    lineVert: function (vertices, color, strokeWidth) {
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }

      ctx.beginPath();
      ctx.moveTo(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y)
      for (let v = 0; v < vertices.length; v++) {
        let vertex = vertices[v]
        ctx.lineTo(vertex.x, vertex.y)
      }
      ctx.closePath()
      ctx.stroke()      
    },
    fillVert: function (vertices, color) {
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }

      ctx.beginPath();
      ctx.moveTo(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y)
      for (let v = 0; v < vertices.length; v++) {
        let vertex = vertices[v]
        ctx.lineTo(vertex.x, vertex.y)
      }
      ctx.closePath()
      ctx.fill()    
    },
    fillRect: function (x, y, w, h, color) {
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      ctx.fillRect(x, y, w, h)
    }, 
    lineRect: function (x, y, w, h, color, strokeWidth) {
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }
      ctx.strokeRect(x, y, w, h)
    },
    fillCirc: function (x, y, radius, color) {
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
    },
    lineCirc: function (x, y, radius, color, strokeWidth) {
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    },
    fillElli: function (x, y, w, h, color, rotation) {
      // Note, Kame tracks degrees not radians
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      rotation = rotation || 0;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Kame.Util.degToRad(rotation), 0, 2 * Math.PI)
      ctx.fill()

    },
    lineElli: function (x, y, w, h, color, strokeWidth, rotation) {
      // Note, Kame tracks degrees not radians
      let ctx = Kame.Canvas.Context
      ctx.lineWidth = strokeWidth || 1;
      if (color) { ctx.strokeStyle = color }
      rotation = rotation || 0;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Kame.Util.degToRad(rotation), 0, 2 * Math.PI)
      ctx.fill()

    },
  },
  Camera: {
    SimpleSprite: function (template) {
      template = template || {};

      this.x = template.x || 0;
      this.y = template.y || 0;

      if (template.t) { this.t = template.t } else {
        let cnv = document.createElement("canvas")
        cnv.width = 20; cnv.height = 20;
        let ctx = cnv.getContext("2d")
        ctx.fillStyle = "#FF00FF"
        ctx.fillRect(0, 0, 20, 20)
        ctx.strokeStyle = "black"
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(20, 20)
        ctx.moveTo(0, 20)
        ctx.lineTo(20, 0)
        ctx.stroke();
        this.t = cnv
      }
    },
    Simple2d: function (template) {
      template = template || {}
      this.cnv = document.createElement("canvas")
      
      // Global position relative to Canvas
      this.cx = template.cx || 0;
      this.cy = template.cy || 0;
      // Size relative to Canvas
      this.cw = template.cw || template.w || Kame.Canvas.Canvas.width;
      this.ch = template.ch || template.h || Kame.Canvas.Canvas.height;
      
      // Position relative to environment
      this.x = template.x || 0;
      this.y = template.y || 0;
      // Size relative to environment (fov/zoom)
      this.cnv.width  = template.w || Kame.Canvas.Canvas.width;
      this.cnv.height = template.h || Kame.Canvas.Canvas.height;

      this.ctx = this.cnv.getContext("2d")

      // Objects to be displayed
      this.Sprites = template.Sprites || [];
      // A way to display them
      this.updateBuffer = function () {
        for (const sprite of this.Sprites) {
          this.ctx.drawImage(sprite.t, sprite.x - this.x, sprite.y - this.y)
        }
      },
      // Decoupling drawing to the screen from 
      this.render = function () {        
        Kame.Canvas.Context.drawImage(this.cnv, this.cx, this.cy)
      }
    }
  },
  Controller: {
    List: [],
    init: function () {
      // Browser wrangling      
      window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
          e.gamepad.index, e.gamepad.id,
          e.gamepad.buttons.length, e.gamepad.axes.length);
        Kame.Controller.connect(e.gamepad)
      });
      window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad disconnected from index %d: %s",
          e.gamepad.index, e.gamepad.id);          
        Kame.Controller.disconnect(e.gamepad)
      });
      // Checking if any controllers are connected
      let gamepads = navigator.getGamepads()
      let connected = false
      for (const gamepad of gamepads) {
        if (gamepad) { Kame.Controller.update(); return true}
      }
      console.log("No controllers found")
      return false
    },
    connect: function (gamepad) {
      Kame.Controller.List.push(gamepad.index)
      // console.log(Kame.Controller.List)
    },
    disconnect: function (gamepad) {
      console.log(gamepad)
      Kame.Controller.List.splice(Kame.Controller.List.indexOf(gamepad.index))
      // console.log(Kame.Controller.List)
    },
    update: function () {
      let controllers = navigator.getGamepads()
      for (const c of Kame.Controller.List) {
        let controller = controllers[c]
        console.log(controller)
      }
    }
  },
  Util: {
    benchmark: function (name) {
      let start = new Date();
      return {
        stop: function () {
          let end  = new Date();
          let time = end.getTime() - start.getTime()
          console.log( name, 'completed in', time, 'ms');
        }
      }
    },
    degToRad: function (degree) {
      return degree * Math.PI / 180
    },
    radToDeg: function (rad) {
      return rad * 180 / Math.PI
    },
    getRngCol: function () {
      let r = 255 * Math.random() | 0,
          g = 255 * Math.random() | 0,
          b = 255 * Math.random() | 0;
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
  }
}


function boot () { 
  Kame.Canvas.init()
  Kame.Controller.init()
  let sprites = [new Kame.Camera.SimpleSprite()]
  let screen = new Kame.Camera.Simple2d({Sprites: sprites})
  screen.updateBuffer()
  screen.render()

}

window.onload = boot()