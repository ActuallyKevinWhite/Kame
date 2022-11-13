Kame = {
  Canvas: {
    Canvas: null,
    Context: null,
    init: function () {      
      console.log("Initializing Kame Canvas...")
      let timer = Kame.Util.benchmark("Kame Canvas initialization")
      Kame.Canvas.Canvas = document.getElementById("KameDisplay")
      if (!Kame.Canvas.Canvas) {console.log("Failed to locate a canvas with id KameDisplay"); return}
      Kame.Canvas.Context = Kame.Canvas.Canvas.getContext("2d");
      timer.stop();
    },    
    drawRect: function (x, y, w, h, color) {
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      ctx.fillRect(x, y, w, h)
    },
    drawCirc: function (x, y, radius, color) {
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
    },
    drawElli: function (x, y, w, h, color, rotation) {
      // Note, Kame tracks degrees not radians
      let ctx = Kame.Canvas.Context
      if (color) { ctx.fillStyle = color }
      rotation = rotation || 0;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Kame.Util.degToRad(rotation), 0, 2 * Math.PI)
      ctx.fill()

    }
  },
  Camera: {
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
          console.log(sprite)
          this.ctx.drawImage(sprite.texture, sprite.x - this.x, sprite.y - this.y)
        }
      },
      this.render = function () {        
        Kame.Canvas.Context.drawImage(this.cnv, this.cx, this.cy)
      }
    },
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
    }
  }
}


function boot () {
  Kame.Canvas.init()
  let btc = document.createElement("canvas")
  btc.width  = 20
  btc.height = 20
  let btx = btc.getContext("2d")
  btx.fillStyle = "blue"
  btx.fillRect(0, 0, 20, 20)
  let box = {
    x: 10,
    y: 30,
    texture: btc
  }
  Kame.Canvas.Context.fillStyle = "Blue"
  Kame.Canvas.drawElli(50, 110, 60, 10, "gray");
  Kame.Canvas.drawCirc(50, 50, 60, "orange");

  let cam = new Kame.Camera.Simple2d({cx: 100, y: 20, Sprites: [box]})
  console.log(cam)
  cam.updateBuffer()
  cam.render()
}

window.onload = boot()