Kame = {
  Canvas: {
    Canvas: null,
    Context: null,
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
  console.log("Initializing Display...")
  let timer = Kame.Util.benchmark("Display initialization")

  Kame.Canvas.Canvas = document.getElementById("KameDisplay")
  if (!Kame.Canvas.Canvas) {console.log("Failed to locate a canvas with id KameDisplay"); return}
  Kame.Canvas.Context = Kame.Canvas.Canvas.getContext("2d");
  Kame.Canvas.Context.fillStyle = "Blue"
  Kame.Canvas.drawElli(50, 110, 60, 10, "gray");
  Kame.Canvas.drawCirc(50, 50, 60, "orange");

  timer.stop();
}

window.onload = boot()