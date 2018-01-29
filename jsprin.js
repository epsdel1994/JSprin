var e_ui = {};

e_ui.AppName = "JSprin"

e_ui.iswide = 0; 
e_ui.sizegrid = 0; 
e_ui.posX = 0; 
e_ui.posY = 0; 

e_ui.state = 0 ; 
e_ui.loading = 0; 
e_ui.importing = 0; 

e_ui.analysing = false; 
e_ui.book_searching = false; 
e_ui.book_loading = false; 
e_ui.book_loading_processing = false; 
e_ui.book_loading_cur = 0;
e_ui.book_loading_all = 0;
e_ui.book_loaded = false; 
e_ui.eval_loading = false; 
e_ui.eval_loaded = false; 

e_ui.config = {};

e_ui.editstate = 0 ; 

e_ui.savestate = 0 ; 
e_ui.load_name = "" ; 
e_ui.load_n = 0; 
e_ui.load_pos = 0; 

e_ui.buttonX = new Array();
e_ui.buttonY = new Array();
e_ui.buttonSize = 0;

e_ui.color = {};
e_ui.color.back = "rgb(0,255,255)";
e_ui.color.board = "rgb(0,255,0)";
e_ui.color.board_best = "rgb(64,224,255)";
e_ui.color.button = "rgb(255,255,0)";
e_ui.color.button_u = "rgb(255,255,128)";
e_ui.color.button_s = "rgb(192,255,0)";
e_ui.color.button_su = "rgb(224,255,128)";
e_ui.color.button_f = "rgb(255,192,0)";
e_ui.color.button_ff = "rgb(255,128,0)";
e_ui.color.button_fu = "rgb(255,224,128)";
e_ui.color.button_ffu = "rgb(255,192,128)";
e_ui.color.board_book = "rgb(255,64,64)";
e_ui.color.board_eval = "rgb(0,0,255)";

e_ui.black_notice = function(string){

  window.onresize = function(){
    e_ui.onresize_u();
    var canvas = document.getElementById('canvas');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = ( e_ui.sizegrid * 0.6 ) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(string, canvas.width / 2, canvas.height / 2);
  };

  if('ontouchstart' in window){
    canvas.ontouchstart = function(e){ e.preventDefault(); };
  } else {
    canvas.onmousedown = function(e){ e.preventDefault(); };
  }
  if('ontouchmove' in window){
    canvas.ontouchmove = function(e){ e.preventDefault(); };
  } else {
    canvas.onmousemove = function(e){ e.preventDefault(); };
  }
  if('ontouchend' in window){
    canvas.ontouchend = function(e){ e.preventDefault(); };
  } else {
    canvas.onmouseup = function(e){ e.preventDefault(); };
  }

  window.onresize();

};

window.onload = function() {

  if(window.Worker
    && window.File && window.FileReader
    && window.localStorage && window.applicationCache){
  } else { e_ui.black_notice("このブラウザには対応していません。"); }

  e_ui.black_notice("読込中...");

  var cache = window.applicationCache;
  cache.addEventListener("checking",function(){
  },false);
  cache.addEventListener("noupdate",function(){
    e_ui.onload_u();
  },false);
  cache.addEventListener("downloading",function(){
  },false);
  cache.addEventListener("cached",function(){
    e_ui.onload_u();
  },false);
  cache.addEventListener("error",function(){
    alert("最新のデータを取得できませんでした。前回のデータを使用します。");
    e_ui.onload_u();
  },false);
  cache.addEventListener("updateready",function(){
    cache.swapCache();
    window.location.reload();
  },false);

//  if(navigator.onLine === true){
    cache.update();
//  }

};

e_ui.onload_u = function(){

  var canvas=document.getElementById('canvas');

  if('ontouchstart' in window){
    canvas.ontouchstart = e_ui.event.touchstart;
  } else {
    canvas.onmousedown = e_ui.event.mousedown;
  }
  if('ontouchmove' in window){
    canvas.ontouchmove = e_ui.event.touchmove;
  } else {
    canvas.onmousemove = e_ui.event.mousemove;
  }
  if('ontouchend' in window){
    canvas.ontouchend = e_ui.event.touchend;
  } else {
    canvas.onmouseup = e_ui.event.mouseup;
  }

  canvas.addEventListener('click', e_ui.event.click);

//  document.getElementById('book').addEventListener('change', e_anl.load_book, false);

  e_ui.init();
  e_anl.init();
  e_board.init();

  window.onresize = function() {
    e_ui.onresize_u();
    e_ui.draw();
  }

  window.onscroll = function(){
    var canvas = document.getElementById('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = window.pageXOffset + 'px' ;
    canvas.style.top = window.pageYOffset + 'px' ;
  }

  window.onresize();
  e_ui.draw();
};

e_ui.onresize_u = function() {

  var canvas = document.getElementById('canvas');
  
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;

  if(canvas.width < canvas.height){
    e_ui.iswide=0;
    if(canvas.width * 1.5 < canvas.height){
      e_ui.sizegrid = Math.floor((canvas.width * 0.95) / 16 ) * 2;
    } else {
      e_ui.sizegrid = Math.floor((canvas.height * 0.95) / 24 ) * 2;
    }
    e_ui.posX=Math.floor((canvas.width-8*e_ui.sizegrid)/2);
    e_ui.posY=Math.floor((canvas.height-12*e_ui.sizegrid)/2);
  } else {
    e_ui.iswide=1;
    if(canvas.height * 1.5 < canvas.width){
      e_ui.sizegrid = Math.floor((canvas.height * 0.9) / 16 ) * 2;
    } else {
      e_ui.sizegrid = Math.floor((canvas.width * 0.9) / 24 ) * 2;
    }
    e_ui.posX=Math.floor((canvas.width-12*e_ui.sizegrid)/2);
    e_ui.posY=Math.floor((canvas.height-8*e_ui.sizegrid)/2);
  }

  if(e_ui.iswide==0){
    e_ui.buttonX[1] = e_ui.posX + e_ui.sizegrid * 0 ;
    e_ui.buttonY[1] = e_ui.posY + e_ui.sizegrid * 8 ;
    e_ui.buttonX[2] = e_ui.posX + e_ui.sizegrid * 2 ;
    e_ui.buttonY[2] = e_ui.posY + e_ui.sizegrid * 8 ;
    e_ui.buttonX[3] = e_ui.posX + e_ui.sizegrid * 4 ;
    e_ui.buttonY[3] = e_ui.posY + e_ui.sizegrid * 8 ;
    e_ui.buttonX[4] = e_ui.posX + e_ui.sizegrid * 6 ;
    e_ui.buttonY[4] = e_ui.posY + e_ui.sizegrid * 8 ;
    e_ui.buttonX[5] = e_ui.posX + e_ui.sizegrid * 0 ;
    e_ui.buttonY[5] = e_ui.posY + e_ui.sizegrid * 10 ;
    e_ui.buttonX[6] = e_ui.posX + e_ui.sizegrid * 2 ;
    e_ui.buttonY[6] = e_ui.posY + e_ui.sizegrid * 10 ;
    e_ui.buttonX[7] = e_ui.posX + e_ui.sizegrid * 4 ;
    e_ui.buttonY[7] = e_ui.posY + e_ui.sizegrid * 10 ;
    e_ui.buttonX[8] = e_ui.posX + e_ui.sizegrid * 6 ;
    e_ui.buttonY[8] = e_ui.posY + e_ui.sizegrid * 10 ;
  } else {
    e_ui.buttonX[1] = e_ui.posX + e_ui.sizegrid * 8 ;
    e_ui.buttonY[1] = e_ui.posY + e_ui.sizegrid * 0 ;
    e_ui.buttonX[2] = e_ui.posX + e_ui.sizegrid * 10 ;
    e_ui.buttonY[2] = e_ui.posY + e_ui.sizegrid * 0 ;
    e_ui.buttonX[3] = e_ui.posX + e_ui.sizegrid * 8 ;
    e_ui.buttonY[3] = e_ui.posY + e_ui.sizegrid * 2 ;
    e_ui.buttonX[4] = e_ui.posX + e_ui.sizegrid * 10 ;
    e_ui.buttonY[4] = e_ui.posY + e_ui.sizegrid * 2 ;
    e_ui.buttonX[5] = e_ui.posX + e_ui.sizegrid * 8 ;
    e_ui.buttonY[5] = e_ui.posY + e_ui.sizegrid * 4 ;
    e_ui.buttonX[6] = e_ui.posX + e_ui.sizegrid * 10 ;
    e_ui.buttonY[6] = e_ui.posY + e_ui.sizegrid * 4 ;
    e_ui.buttonX[7] = e_ui.posX + e_ui.sizegrid * 8 ;
    e_ui.buttonY[7] = e_ui.posY + e_ui.sizegrid * 6 ;
    e_ui.buttonX[8] = e_ui.posX + e_ui.sizegrid * 10 ;
    e_ui.buttonY[8] = e_ui.posY + e_ui.sizegrid * 6 ;
  }

  e_ui.buttonSize= e_ui.sizegrid * 2;

}

e_ui.init = function () {

  if(localStorage.getItem(e_ui.AppName + "_history") === null){
    var buf = {};
    buf["n"] = 0;
    buf["next"] = e_ui.AppName + "_history";
    buf["prev"] = e_ui.AppName + "_history";
    try{
      localStorage.setItem(e_ui.AppName + "_history",JSON.stringify(buf));
    }catch(e){
      e_ui.black_notice("初期化に失敗しました。");
    }
  }

  e_ui.state = 0;
  e_ui.editstate = 1;
  e_ui.savestate = 0;
}

e_ui.draw = function() {

  var canvas = document.getElementById('canvas');
  if ( ! canvas || ! canvas.getContext ) { return false; }
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = e_ui.color.back;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = e_ui.color.board;
  ctx.fillRect(e_ui.posX, e_ui.posY, e_ui.sizegrid * 8 , e_ui.sizegrid * 8);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if((e_ui.state !== 1) && (e_ui.state !== 3)){

    if(e_anl.eval !== false){
      if( (e_anl.book === false) || (e_anl.eval.isbook === false) ){

        ctx.fillStyle = e_ui.color.board_best;
        ctx.fillRect(
          e_ui.posX + e_ui.sizegrid * (e_anl.eval["x"][0] - 1),
          e_ui.posY + e_ui.sizegrid * (e_anl.eval["y"][0] - 1),
          e_ui.sizegrid, e_ui.sizegrid);
        ctx.fillStyle = e_ui.color.board_eval;
        ctx.font = ( e_ui.sizegrid * 0.6 ) + "px sans-serif";
        for(var i=0;i<e_anl.eval["n"];i++){
          var valstr;
          if(e_anl.eval["v"][i] > 0)valstr = "+"+e_anl.eval["v"][i];
          else valstr = ""+e_anl.eval["v"][i];
          ctx.fillText(valstr,
            e_ui.posX - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.eval["x"][i],
            e_ui.posY - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.eval["y"][i], e_ui.sizegrid * 0.8);
        }

      } else {

      }
    }
    if(e_anl.book !== false){
      ctx.fillStyle = e_ui.color.board_book;
      ctx.font = ( e_ui.sizegrid * 0.6 ) + "px sans-serif";
      for(var i=0;i<e_anl.book["n"];i++){
        var valstr;
        if(e_anl.book["v"][i] >= 128)valstr = (e_anl.book["v"][i] - 256)+"";
        else if(e_anl.book["v"][i] > 0)valstr = "+"+e_anl.book["v"][i];
        else valstr = ""+e_anl.book["v"][i];
        ctx.fillText(valstr,
          e_ui.posX - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.book["x"][i],
          e_ui.posY - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.book["y"][i], e_ui.sizegrid * 0.8);
      }

      if(e_anl.book["l"] === true){
        ctx.fillStyle = e_ui.color.board_eval;
        var valstr;
        if(e_anl.book["v"][e_anl.book["n"]] >= 128)valstr = (e_anl.book["v"][e_anl.book["n"]] - 256)+"";
        else if(e_anl.book["v"][e_anl.book["n"]] > 0)valstr = "+"+e_anl.book["v"][e_anl.book["n"]];
        else valstr = ""+e_anl.book["v"][e_anl.book["n"]];
        ctx.fillText(valstr,
          e_ui.posX - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.book["x"][e_anl.book["n"]],
          e_ui.posY - e_ui.sizegrid * 0.5 + e_ui.sizegrid * e_anl.book["y"][e_anl.book["n"]], e_ui.sizegrid * 0.8);
      }

    }
  }

  ctx.strokeStyle = "black";
  ctx.lineWidth = e_ui.sizegrid * 0.02 ;
  ctx.beginPath();
  for(var i=0;i<=8;i++){
      ctx.moveTo( e_ui.posX + e_ui.sizegrid * i, e_ui.posY);
      ctx.lineTo( e_ui.posX + e_ui.sizegrid * i, e_ui.posY + e_ui.sizegrid * 8);
  }
  for(var i=0;i<=8;i++){
      ctx.moveTo( e_ui.posX , e_ui.posY + e_ui.sizegrid *i);
      ctx.lineTo( e_ui.posX + e_ui.sizegrid * 8, e_ui.posY + e_ui.sizegrid * i);
  }
  ctx.stroke();

  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      if(e_board.board[i][j]==0)continue;
      if(e_board.board[i][j]==1){
        ctx.fillStyle='rgb(0,0,0)';
      } else {
        ctx.fillStyle='rgb(255,255,255)';
      }
      ctx.beginPath();
      ctx.arc(
        e_ui.posX - e_ui.sizegrid * 0.5 + e_ui.sizegrid * i,
        e_ui.posY - e_ui.sizegrid * 0.5 + e_ui.sizegrid * j,
        Math.floor(e_ui.sizegrid * 0.45), 0, Math.PI*2, false);
      ctx.fill();
      ctx.stroke();
    }
  }

  e_ui.buttonSize = e_ui.sizegrid * 2;

  if(e_ui.state === 0){

    if((e_board.history_pos === 1) || (e_ui.analysing === true) || (e_ui.book_searching === true)){
      ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[1], e_ui.buttonY[1], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[3], e_ui.buttonY[3], e_ui.buttonSize, e_ui.buttonSize);

    if((e_board.history_pos === e_board.history_endpos)
      || (e_ui.analysing === true) || (e_ui.book_searching === true)){
      ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[2], e_ui.buttonY[2], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[4], e_ui.buttonY[4], e_ui.buttonSize, e_ui.buttonSize);

    if((e_ui.analysing === true) || (e_ui.book_searching === true)){
      ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[5], e_ui.buttonY[5], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[7], e_ui.buttonY[7], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_u;
    ctx.fillRect(e_ui.buttonX[8], e_ui.buttonY[8], e_ui.buttonSize, e_ui.buttonSize);

    if((e_ui.analysing === true) || (e_ui.book_searching === true) ){
      ctx.fillStyle = e_ui.color.button_fu;
    } else if (e_anl.eval !== false){
      ctx.fillStyle = e_ui.color.button_s;
    } else if ( (e_board.turn === 0) || (e_anl.autobook === true) ) {
      ctx.fillStyle = e_ui.color.button_u;
    } else if (e_ui.eval_loaded === false) {
      ctx.fillStyle = e_ui.color.button_u;
    } else {
      ctx.fillStyle = e_ui.color.button;
    }
    ctx.fillRect(e_ui.buttonX[6], e_ui.buttonY[6], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = "black";
    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText("<", e_ui.buttonX[1] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[1] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText(">", e_ui.buttonX[2] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[2] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("<<", e_ui.buttonX[3] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[3] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText(">>", e_ui.buttonX[4] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[4] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("新規盤面", e_ui.buttonX[5] + e_ui.buttonSize * 0.5 ,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("メニュー", e_ui.buttonX[7] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.5, e_ui.buttonSize);

    if(e_ui.analysing === true){
      ctx.fillText("解析中", e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    } else if (e_ui.book_searching === true){
      ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
      ctx.fillText("BOOK", e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("検索中", e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else if (e_anl.eval !== false){

      ctx.fillText(e_anl.eval["depth"]+"手読み" , e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.3, e_ui.buttonSize);
      ctx.fillText("@" + e_anl.eval["percent"] + "%", e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.7, e_ui.buttonSize);
    } else {
      ctx.fillText("解析", e_ui.buttonX[6] + e_ui.buttonSize * 0.5 ,
        e_ui.buttonY[6] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    }

    if(e_board.turn == 0){

      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillRect(e_ui.buttonX[8] + e_ui.buttonSize * 0.07, e_ui.buttonY[8] + e_ui.buttonSize * 0.17,
        e_ui.buttonSize * 0.26, e_ui.buttonSize * 0.26);
      ctx.strokeRect(e_ui.buttonX[8] + e_ui.buttonSize * 0.07, e_ui.buttonY[8] + e_ui.buttonSize * 0.17,
        e_ui.buttonSize * 0.26, e_ui.buttonSize * 0.26);

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.beginPath();
      ctx.arc( e_ui.buttonX[8] + e_ui.buttonSize * 0.2, e_ui.buttonY[8] + e_ui.buttonSize * 0.3,
        e_ui.buttonSize * 0.1, Math.PI*2, false);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillRect(e_ui.buttonX[8] + e_ui.buttonSize * 0.67, e_ui.buttonY[8] + e_ui.buttonSize * 0.17,
        e_ui.buttonSize * 0.26, e_ui.buttonSize * 0.26);
      ctx.strokeRect(e_ui.buttonX[8] + e_ui.buttonSize * 0.67, e_ui.buttonY[8] + e_ui.buttonSize * 0.17,
        e_ui.buttonSize * 0.26, e_ui.buttonSize * 0.26);

      ctx.fillStyle = "rgb(255,255,255)";
      ctx.beginPath();
      ctx.arc( e_ui.buttonX[8] + e_ui.buttonSize * 0.8, e_ui.buttonY[8] + e_ui.buttonSize * 0.3,
        e_ui.buttonSize * 0.1, Math.PI*2, false);
      ctx.fill();
      ctx.stroke();

      var nb = 0; var nw = 0;
      for(var i=1;i<=8;i++){
        for(var j=1;j<=8;j++){
          if(e_board.board[i][j] === 1){ nb ++;
          } else if(e_board.board[i][j] === -1){ nw ++;
          }
        } 
      }

      ctx.fillStyle = "black";
      ctx.font = ( e_ui.sizegrid * 0.6 ) + "px sans-serif";
      ctx.fillText(nb , e_ui.buttonX[8] + e_ui.buttonSize * 0.2,
        e_ui.buttonY[8] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
      ctx.fillText("-", e_ui.buttonX[8] + e_ui.buttonSize * 0.5,
        e_ui.buttonY[8] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
      ctx.fillText(nw , e_ui.buttonX[8] + e_ui.buttonSize * 0.8,
        e_ui.buttonY[8] + e_ui.buttonSize * 0.65, e_ui.buttonSize);

    } else {

      ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
      ctx.fillText("手番", e_ui.buttonX[8] + e_ui.buttonSize / 2,
        e_ui.buttonY[8] + e_ui.buttonSize * 0.2, e_ui.buttonSize);
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillRect(e_ui.buttonX[8] + e_ui.buttonSize / 4, e_ui.buttonY[8] + e_ui.buttonSize * 0.4,
        e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);
      ctx.strokeRect(e_ui.buttonX[8] + e_ui.buttonSize / 4, e_ui.buttonY[8] + e_ui.buttonSize * 0.4,
        e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);

      if(e_board.turn == 1){
        ctx.fillStyle = "rgb(0,0,0)";
      } else if(e_board.turn == -1){
        ctx.fillStyle = "rgb(255,255,255)";
      }
      ctx.beginPath();
      ctx.arc( e_ui.buttonX[8] + e_ui.buttonSize * 0.5, e_ui.buttonY[8] + e_ui.buttonSize * 0.65,
        e_ui.buttonSize * 0.2, Math.PI*2, false);
      ctx.fill();
      ctx.stroke();

    }

  } else if(e_ui.state == 1) {

    ctx.fillStyle = e_ui.color.button_u;
    ctx.fillRect(e_ui.buttonX[1], e_ui.buttonY[1], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[2], e_ui.buttonY[2], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[3], e_ui.buttonY[3], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[4], e_ui.buttonY[4], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button;
    ctx.fillRect(e_ui.buttonX[5], e_ui.buttonY[5], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[6], e_ui.buttonY[6], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_s;
    ctx.fillRect(e_ui.buttonX[7], e_ui.buttonY[7], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_f;
    ctx.fillRect(e_ui.buttonX[8], e_ui.buttonY[8], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = "black";
    ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
    ctx.fillText("配置色切替", e_ui.buttonX[5] + e_ui.buttonSize / 2,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.2, e_ui.buttonSize);
    ctx.fillText("手番切替", e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize * 0.2, e_ui.buttonSize);
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(e_ui.buttonX[5] + e_ui.buttonSize * 0.25, e_ui.buttonY[5] + e_ui.buttonSize * 0.45,
      e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);
    ctx.strokeRect(e_ui.buttonX[5] + e_ui.buttonSize * 0.25, e_ui.buttonY[5] + e_ui.buttonSize * 0.45,
      e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);
    ctx.fillRect(e_ui.buttonX[6] + e_ui.buttonSize * 0.25, e_ui.buttonY[6] + e_ui.buttonSize * 0.45,
      e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);
    ctx.strokeRect(e_ui.buttonX[6] + e_ui.buttonSize * 0.25, e_ui.buttonY[6] + e_ui.buttonSize * 0.45,
      e_ui.buttonSize * 0.5, e_ui.buttonSize * 0.5);

    if(e_ui.editstate == 1){
      ctx.fillStyle = "rgb(0,0,0)";
    } else if(e_ui.editstate == -1){
      ctx.fillStyle = "rgb(255,255,255)";
    }
    if(e_ui.editstate != 0){
      ctx.beginPath();
      ctx.arc( e_ui.buttonX[5] + e_ui.buttonSize * 0.5, e_ui.buttonY[5] + e_ui.buttonSize * 0.7,
        e_ui.buttonSize * 0.2, Math.PI*2, false);
      ctx.fill();
      ctx.stroke();
    }

    if(e_board.turn == 1){
      ctx.fillStyle = "rgb(0,0,0)";
    } else if(e_board.turn == -1){
      ctx.fillStyle = "rgb(255,255,255)";
    }
    ctx.beginPath();
    ctx.arc( e_ui.buttonX[6] + e_ui.buttonSize * 0.5, e_ui.buttonY[6] + e_ui.buttonSize * 0.7,
      e_ui.buttonSize * 0.2, Math.PI*2, false);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText("編集完了", e_ui.buttonX[7] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("戻る", e_ui.buttonX[8] + e_ui.buttonSize * 0.5,
      e_ui.buttonY[8] + e_ui.buttonSize * 0.5, e_ui.buttonSize);

  } else if(e_ui.state == 2) {

    ctx.fillStyle = e_ui.color.button;
    ctx.fillRect(e_ui.buttonX[1], e_ui.buttonY[1], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[3], e_ui.buttonY[3], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[4], e_ui.buttonY[4], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[5], e_ui.buttonY[5], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[6], e_ui.buttonY[6], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[7], e_ui.buttonY[7], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_f;
    ctx.fillRect(e_ui.buttonX[8], e_ui.buttonY[8], e_ui.buttonSize, e_ui.buttonSize);

    if(e_ui.savestate == 0){ ctx.fillStyle = e_ui.color.button;
    } else if(e_ui.savestate == 1){ ctx.fillStyle = e_ui.color.button_su; }
    ctx.fillRect(e_ui.buttonX[2], e_ui.buttonY[2], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = "black";
    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText("棋譜読込", e_ui.buttonX[1] + e_ui.buttonSize / 2,
      e_ui.buttonY[1] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("盤面編集", e_ui.buttonX[5] + e_ui.buttonSize / 2,
      e_ui.buttonY[5] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("解析設定", e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("戻る", e_ui.buttonX[8] + e_ui.buttonSize / 2,
      e_ui.buttonY[8] + e_ui.buttonSize / 2, e_ui.buttonSize);

    if(e_ui.savestate == 0){
      ctx.fillText("棋譜保存", e_ui.buttonX[2] + e_ui.buttonSize * 0.5,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    } else if(e_ui.savestate == 1) {
      ctx.fillText("保存完了", e_ui.buttonX[2] + e_ui.buttonSize * 0.5,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    }

    ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
    ctx.fillText("棋譜インポート", e_ui.buttonX[3] + e_ui.buttonSize / 2,
      e_ui.buttonY[3] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("棋譜エクスポート", e_ui.buttonX[4] + e_ui.buttonSize / 2,
      e_ui.buttonY[4] + e_ui.buttonSize * 0.5, e_ui.buttonSize);
    ctx.fillText("このアプリ", e_ui.buttonX[7] + e_ui.buttonSize / 2,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
    ctx.fillText("について", e_ui.buttonX[7] + e_ui.buttonSize / 2,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.65, e_ui.buttonSize);

  } else if(e_ui.state == 3) {

    if(e_ui.load_pos <= 1){ ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[1], e_ui.buttonY[1], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[3], e_ui.buttonY[3], e_ui.buttonSize, e_ui.buttonSize);

    if(e_ui.load_pos === e_ui.load_n){ ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[2], e_ui.buttonY[2], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[4], e_ui.buttonY[4], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_u;
    ctx.fillRect(e_ui.buttonX[5], e_ui.buttonY[5], e_ui.buttonSize, e_ui.buttonSize);

    if(e_ui.load_n === 0){ ctx.fillStyle = e_ui.color.button_ffu;
    } else { ctx.fillStyle = e_ui.color.button_ff; }
    ctx.fillRect(e_ui.buttonX[6], e_ui.buttonY[6], e_ui.buttonSize, e_ui.buttonSize);

    if(e_ui.load_n === 0){ ctx.fillStyle = e_ui.color.button_su;
    } else { ctx.fillStyle = e_ui.color.button_s; }
    ctx.fillRect(e_ui.buttonX[7], e_ui.buttonY[7], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_f;
    ctx.fillRect(e_ui.buttonX[8], e_ui.buttonY[8], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = "black";
    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText("<", e_ui.buttonX[1] + e_ui.buttonSize / 2,
      e_ui.buttonY[1] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText(">", e_ui.buttonX[2] + e_ui.buttonSize / 2,
      e_ui.buttonY[2] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("<<", e_ui.buttonX[3] + e_ui.buttonSize / 2,
      e_ui.buttonY[3] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText(">>", e_ui.buttonX[4] + e_ui.buttonSize / 2,
      e_ui.buttonY[4] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("消去", e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("読込", e_ui.buttonX[7] + e_ui.buttonSize / 2,
      e_ui.buttonY[7] + e_ui.buttonSize / 2, e_ui.buttonSize);
    ctx.fillText("戻る", e_ui.buttonX[8] + e_ui.buttonSize / 2,
      e_ui.buttonY[8] + e_ui.buttonSize / 2, e_ui.buttonSize);

    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText(e_ui.load_pos, e_ui.buttonX[5] + e_ui.buttonSize * 0.3,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.3, e_ui.buttonSize * 0.4);
    ctx.fillText(e_ui.load_n, e_ui.buttonX[5] + e_ui.buttonSize * 0.7,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.7, e_ui.buttonSize * 0.4);

    ctx.lineWidth = e_ui.sizegrid * 0.05;
    ctx.beginPath();
    ctx.moveTo( e_ui.buttonX[5] + e_ui.buttonSize * 0.2 , e_ui.buttonY[5] + e_ui.buttonSize * 0.8);
    ctx.lineTo( e_ui.buttonX[5] + e_ui.buttonSize * 0.8 , e_ui.buttonY[5] + e_ui.buttonSize * 0.2);
    ctx.stroke();

  } else if(e_ui.state == 4) {

    if(e_ui.book_loading === true){ ctx.fillStyle = e_ui.color.button_fu;
    } else if(e_ui.book_loaded === true){ ctx.fillStyle = e_ui.color.button_su;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[1], e_ui.buttonY[1], e_ui.buttonSize, e_ui.buttonSize);
    if(e_ui.eval_loading === true){ ctx.fillStyle = e_ui.color.button_fu;
    } else if(e_ui.eval_loaded === true){ ctx.fillStyle = e_ui.color.button_su;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[2], e_ui.buttonY[2], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = e_ui.color.button_u;
    ctx.fillRect(e_ui.buttonX[4], e_ui.buttonY[4], e_ui.buttonSize, e_ui.buttonSize);

    if( (e_ui.book_loading === false) && (e_ui.eval_loading === false) && (e_ui.eval_loaded === true)
      && (e_ui.book_searching === false) && (e_ui.analysing === false) ){
      ctx.fillStyle = e_ui.color.button;
    }
    ctx.fillRect(e_ui.buttonX[5], e_ui.buttonY[5], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[6], e_ui.buttonY[6], e_ui.buttonSize, e_ui.buttonSize);
    ctx.fillRect(e_ui.buttonX[7], e_ui.buttonY[7], e_ui.buttonSize, e_ui.buttonSize);

    if( (e_ui.book_searching === true) || (e_ui.analysing === true)
      || ((e_ui.book_loaded === false) && (e_ui.eval_loaded === false)) ){
      ctx.fillStyle = e_ui.color.button_u;
    } else { ctx.fillStyle = e_ui.color.button; }
    ctx.fillRect(e_ui.buttonX[3], e_ui.buttonY[3], e_ui.buttonSize, e_ui.buttonSize);

    if( (e_ui.book_searching === false) && (e_ui.analysing === false) ){
      ctx.fillStyle = e_ui.color.button_f;
    } else { ctx.fillStyle = e_ui.color.button_fu; }
    ctx.fillRect(e_ui.buttonX[8], e_ui.buttonY[8], e_ui.buttonSize, e_ui.buttonSize);

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
    if( (e_ui.book_loading === false) && (e_ui.book_loaded === false) ){
      ctx.fillText("book.dat", e_ui.buttonX[1] + e_ui.buttonSize / 2,
        e_ui.buttonY[1] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("読込", e_ui.buttonX[1] + e_ui.buttonSize / 2,
        e_ui.buttonY[1] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else if ( e_ui.book_loading === true ) {
      if( e_ui.book_loading_processing === true ){
        ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
        ctx.fillText("book.dat", e_ui.buttonX[1] + e_ui.buttonSize / 2,
          e_ui.buttonY[1] + e_ui.buttonSize * 0.1, e_ui.buttonSize);
        ctx.fillText("読込中", e_ui.buttonX[1] + e_ui.buttonSize / 2,
          e_ui.buttonY[1] + e_ui.buttonSize * 0.3, e_ui.buttonSize);
        ctx.font = ( e_ui.sizegrid * 0.6 ) + "px sans-serif";
        ctx.fillText(e_ui.book_loading_cur + "/" + e_ui.book_loading_all, e_ui.buttonX[1] + e_ui.buttonSize / 2,
          e_ui.buttonY[1] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
      } else  {
        ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
        ctx.fillText("book.dat", e_ui.buttonX[1] + e_ui.buttonSize / 2,
          e_ui.buttonY[1] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
        ctx.fillText("読込中", e_ui.buttonX[1] + e_ui.buttonSize / 2,
          e_ui.buttonY[1] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
      }
    } else {
      ctx.fillText("book.dat", e_ui.buttonX[1] + e_ui.buttonSize / 2,
        e_ui.buttonY[1] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("読込完了", e_ui.buttonX[1] + e_ui.buttonSize / 2,
        e_ui.buttonY[1] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    }
    ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
    if( (e_ui.eval_loading === false) && (e_ui.eval_loaded === false) ){
      ctx.font = ( e_ui.sizegrid * 0.5 ) + "px sans-serif";
      ctx.fillText("eval.dat", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("読込", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else if ( e_ui.eval_loading === true ) {
      ctx.fillText("eval.dat", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("読込中", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else {
      ctx.fillText("eval.dat", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.35, e_ui.buttonSize);
      ctx.fillText("読込完了", e_ui.buttonX[2] + e_ui.buttonSize / 2,
        e_ui.buttonY[2] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    }

    ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
    ctx.fillText("思考時間", e_ui.buttonX[5] + e_ui.buttonSize / 2,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.1, e_ui.buttonSize);
    ctx.fillText("(解析)", e_ui.buttonX[5] + e_ui.buttonSize / 2,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.3, e_ui.buttonSize);
    ctx.font = ( e_ui.sizegrid * 0.8 ) + "px sans-serif";
    ctx.fillText(e_anl.eval_deadline_s, e_ui.buttonX[5] + e_ui.buttonSize / 2,
      e_ui.buttonY[5] + e_ui.buttonSize * 0.65, e_ui.buttonSize);

    ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
    ctx.fillText("思考時間", e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize * 0.1, e_ui.buttonSize);
    ctx.fillText("(自動解析)", e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize * 0.3, e_ui.buttonSize);
    ctx.font = ( e_ui.sizegrid * 0.8 ) + "px sans-serif";
    ctx.fillText(e_anl.eval_deadline_auto_s, e_ui.buttonX[6] + e_ui.buttonSize / 2,
      e_ui.buttonY[6] + e_ui.buttonSize * 0.65, e_ui.buttonSize);

    ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
    ctx.fillText("モード切替", e_ui.buttonX[3] + e_ui.buttonSize / 2,
      e_ui.buttonY[3] + e_ui.buttonSize * 0.2, e_ui.buttonSize);

    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    if(e_anl.autobook === true){
      ctx.fillText("BOOK", e_ui.buttonX[3] + e_ui.buttonSize / 2,
        e_ui.buttonY[3] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else if(e_anl.autoeval === true){
      ctx.fillText("自動解析", e_ui.buttonX[3] + e_ui.buttonSize / 2,
        e_ui.buttonY[3] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    } else {
      ctx.fillText("OFF", e_ui.buttonX[3] + e_ui.buttonSize / 2,
        e_ui.buttonY[3] + e_ui.buttonSize * 0.65, e_ui.buttonSize);
    }

    ctx.font = ( e_ui.sizegrid * 0.4 ) + "px sans-serif";
    ctx.fillText("評価値表示数", e_ui.buttonX[7] + e_ui.buttonSize / 2,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.2, e_ui.buttonSize);

    ctx.font = ( e_ui.sizegrid * 0.8 ) + "px sans-serif";
    ctx.fillText(e_anl.eval_num_anl, e_ui.buttonX[7] + e_ui.buttonSize / 2,
      e_ui.buttonY[7] + e_ui.buttonSize * 0.65, e_ui.buttonSize);


    ctx.font = ( e_ui.sizegrid * 0.7 ) + "px sans-serif";
    ctx.fillText("戻る", e_ui.buttonX[8] + e_ui.buttonSize / 2,
      e_ui.buttonY[8] + e_ui.buttonSize / 2, e_ui.buttonSize);

  }

  ctx.lineWidth = e_ui.sizegrid * 0.02;
  ctx.strokeStyle = "black";
  for(var i=1;i<=8;i++){
    ctx.strokeRect(e_ui.buttonX[i], e_ui.buttonY[i], e_ui.buttonSize, e_ui.buttonSize);
  }
}

e_ui.event = {};

window.onscroll = function(){
  
};

e_ui.event.fend = function(e,x,y){

try{
  if(e_ui.state === 4){
    if( (x > e_ui.buttonX[1]) && (x <= e_ui.buttonX[1] + e_ui.buttonSize ) ){
      if( (y > e_ui.buttonY[1] ) && (y <= e_ui.buttonY[1] + e_ui.buttonSize ) ){
        return;
      }
    }
  }

  for ( var i=0; i<8 ; i++){
    for ( var j=0; j<8 ; j++){
      if( (x > e_ui.posX + e_ui.sizegrid * i) && (x <= e_ui.posX + e_ui.sizegrid * (i+1) ) ){
        if( (y > e_ui.posY + e_ui.sizegrid * j) && (y <= e_ui.posY + e_ui.sizegrid * (j+1) ) ){
          e_ui.event.board(i,j);
        }
      }
    }
  }

  for ( var i=0;i<=8;i++)  {
    if( (x > e_ui.buttonX[i]) && (x <= e_ui.buttonX[i] + e_ui.buttonSize ) ){
      if( (y > e_ui.buttonY[i] ) && (y <= e_ui.buttonY[i] + e_ui.buttonSize ) ){
        e_ui.event.button(i);
      }
    }
  }

  e.preventDefault();
  e_ui.draw();
}catch(e){
  e_ui.black_notice("エラーが発生しました。");
}
}

e_ui.event.fmove = function(e,x,y){
try{
  e.preventDefault();

  for ( var i=0; i<8 ; i++){
    for ( var j=0; j<8 ; j++){
      if( (x > e_ui.posX + e_ui.sizegrid * i) && (x <= e_ui.posX + e_ui.sizegrid * (i+1) ) ){
        if( (y > e_ui.posY + e_ui.sizegrid * j) && (y <= e_ui.posY + e_ui.sizegrid * (j+1) ) ){
          e_ui.event.moveonboard(i,j);
        }
      }
    }
  }
  e_ui.draw();
}catch(e){
  e_ui.black_notice("エラーが発生しました。");
}
}

e_ui.event.fstart = function(e,x,y) {
try{
  if( (e_ui.state === 4) && (e_ui.book_loading === false) && (e_ui.book_loaded === false)
    && (e_ui.book_searching === false) && (e_ui.analysing === false) ){
    if( (x > e_ui.buttonX[1]) && (x <= e_ui.buttonX[1] + e_ui.buttonSize ) ){
      if( (y > e_ui.buttonY[1] ) && (y <= e_ui.buttonY[1] + e_ui.buttonSize ) ){
        return;
      }
    }
  }

  e.preventDefault();
  e_ui.draw();
}catch(e){
  e_ui.black_notice("エラーが発生しました。");
}
}

e_ui.event.fclick = function(e,x,y){
try{
  if( (e_ui.state === 4) && (e_ui.book_loading === false) && (e_ui.book_loaded === false)
    && (e_ui.book_searching === false) && (e_ui.analysing === false) ){
    if( (x > e_ui.buttonX[1]) && (x <= e_ui.buttonX[1] + e_ui.buttonSize ) ){
      if( (y > e_ui.buttonY[1] ) && (y <= e_ui.buttonY[1] + e_ui.buttonSize ) ){
        if(e_ui.elinp) document.body.removeChild(e_ui.elinp);
        e_ui.elinp = document.createElement("input");
        e_ui.elinp.setAttribute("type","file");
        e_ui.elinp.setAttribute("style","display:none");
        document.body.appendChild(e_ui.elinp);
        e_ui.elinp.addEventListener('change', e_anl.load_book, false);

        e_ui.elinp.click();
        return;
      }
    }
  }
//  e.preventDefault();
}catch(e){
  e_ui.black_notice("エラーが発生しました。");
}
}

e_ui.event.board = function(i,j){
  if((e_ui.state === 0) && (e_ui.analysing === false) && (e_ui.book_searching === false)){
    e_board.put(i+1,j+1);
  } else if(e_ui.state === 1){
    e_board.board[i+1][j+1] = e_ui.editstate;
  }
}

e_ui.event.moveonboard = function(i,j){
  if(e_ui.state === 1){
    e_board.board[i+1][j+1] = e_ui.editstate;
  }
}

e_ui.event.button = function(n){
  if(n === 1){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching === false)){
        e_board.undo();
      }
    } else if(e_ui.state === 2){
      e_ui.state = 3;
      e_board.load_preview_init();
    } else if(e_ui.state === 3){
      e_board.load_preview_prev();
    }
  } else if(n === 2){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching == false)){
        e_board.redo();
      }
    } else if(e_ui.state === 2){
      if(e_ui.savestate !== 1){
        e_board.save();
        e_ui.savestate = 1;
      }
    } else if(e_ui.state === 3){
      e_board.load_preview_next();
    } else if(e_ui.state === 4){
      if((e_ui.eval_loading === false) && (e_ui.eval_loaded === false)){
        e_anl.load_eval();
      }
    }
  } else if(n === 3){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching == false)){
        e_board.undoall();
      }
    } else if(e_ui.state === 2){
      e_board.import();
      e_ui.state = 0;
    } else if(e_ui.state === 3){
      e_board.load_preview_first();
    } else if(e_ui.state === 4){
      if(e_anl.autobook === true){
        if(e_ui.book_searching === false){
          if( (e_ui.eval_loading === false) 
            && (e_ui.eval_loaded === true) ){
            e_anl.autoeval = true;
            if(e_anl.eval === false) e_anl.eval_auto();
          }
          e_anl.autobook = false; e_anl.book = false;
        }
      } else if(e_anl.autoeval === true){
        if(e_ui.analysing === false){
          e_anl.autoeval = false; e_anl.eval = false;
        }
      } else {
        if( (e_ui.book_loading === false)
          && (e_ui.book_loaded === true) ){
          e_anl.autobook = true; e_anl.book_anl(); e_anl.eval = false;
        } else if( (e_ui.eval_loading === false)
          && (e_ui.eval_loaded === true) ){
          e_anl.autoeval = true; if(e_anl.eval === false) e_anl.eval_auto();
        }
      }
    }
  } else if( n===4 ){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching == false)){
        e_board.redoall(); 
      }
    } else if(e_ui.state === 2){
      e_board.export();
    } else if(e_ui.state === 3){
      e_board.load_preview_last();
    }
  } else if( n===5 ){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching == false)){
        e_board.init();
      }
    } else if(e_ui.state === 1){
      if(e_ui.editstate === 1){
        e_ui.editstate = -1;
      } else if(e_ui.editstate === -1){
        e_ui.editstate = 0;
      } else if(e_ui.editstate === 0){
        e_ui.editstate = 1;
      }
    } else if(e_ui.state === 2){
      e_ui.state = 1;
      e_ui.editstate = 1;
      if(e_board.turn === 0){
        e_board.turn = 1;
      }
    } else if( (e_ui.state === 4) && (e_ui.eval_loading === false)
      && (e_ui.eval_loaded === true) && (e_ui.analysing === false) ){
      if (e_anl.eval_deadline_s === 9){ e_anl.eval_deadline_s = 1;
      } else { e_anl.eval_deadline_s += 1; }
    }
  } else if(n === 6){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching === false)
        && (e_ui.eval_loaded === true) && (e_anl.autobook === false) ){
        e_anl.eval_anl();
      }
    } else if(e_ui.state === 1){
      e_board.turn *= -1;
    } else if(e_ui.state === 2){
      e_ui.state = 4;
    } else if(e_ui.state === 3){
      e_board.load_delete();
    } else if( (e_ui.state === 4) && (e_ui.eval_loading === false)
      && (e_ui.eval_loaded === true) && (e_ui.analysing === false) ){
      if(e_anl.eval_deadline_auto_s === 5){ e_anl.eval_deadline_auto_s = 1;
      } else { e_anl.eval_deadline_auto_s += 1; }
    } 
  } else if(n===7){
    if(e_ui.state === 0){
      if((e_ui.analysing === false) && (e_ui.book_searching === false)){
        e_ui.state = 2;
      }
    } else if(e_ui.state === 1){
      e_board.editend();
      e_ui.state = 0;
    } else if(e_ui.state === 2){
      location.href = "http://github.com/epsdel1994/JSprin";
    } else if(e_ui.state === 3){
      if(e_ui.load_n !== 0){
        e_board.load();
        e_ui.state = 0;
        e_ui.savestate = 1;
      }
    } else if( (e_ui.state === 4) && (e_ui.eval_loading === false)
      && (e_ui.eval_loaded === true) && (e_ui.analysing === false) ){
      if(e_anl.eval_num_anl === 5){ e_anl.eval_num_anl = 1;
      } else { e_anl.eval_num_anl += 1; }
    }
  } else if(n===8){
    if(e_ui.state === 0){
    } else if(e_ui.state === 1){
      e_board.editcancel();
      e_ui.state = 0;
    } else if(e_ui.state === 2){
      e_ui.state = 0;
    } else if(e_ui.state === 3){
      e_board.load_cancel();
      e_ui.state = 0;
    } else if( (e_ui.state === 4) 
      && (e_ui.book_searching === false) && (e_ui.analysing === false) ){
      e_ui.state = 0;
    }
  }
  e_ui.draw();
}


e_ui.event.mousedown = function(e){
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fstart(e,
    (e.clientX - rect.left) * window.devicePixelRatio,
    (e.clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.mousemove = function(e){
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fmove(e,
    (e.clientX - rect.left) * window.devicePixelRatio,
    (e.clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.mouseup = function(e){
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fend(e,
    (e.clientX - rect.left) * window.devicePixelRatio,
    (e.clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.touchstart = function(e) {
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fstart(e,
    (e.changedTouches[0].clientX - rect.left) * window.devicePixelRatio, 
    (e.changedTouches[0].clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.touchmove = function(e) {
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fmove(e,
    (e.changedTouches[0].clientX - rect.left) * window.devicePixelRatio, 
    (e.changedTouches[0].clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.touchend = function(e) {
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fend(e,
    (e.changedTouches[0].clientX - rect.left) * window.devicePixelRatio, 
    (e.changedTouches[0].clientY - rect.top) * window.devicePixelRatio);
}

e_ui.event.click = function(e) {
  var rect = canvas.getBoundingClientRect();
  e_ui.event.fclick(e,
    (e.clientX - rect.left) * window.devicePixelRatio, 
    (e.clientY - rect.top) * window.devicePixelRatio);
}


var e_board = {} ;

e_board.board = new Array();

e_board.board[0] = new Array();
e_board.board[1] = new Array();
e_board.board[2] = new Array();
e_board.board[3] = new Array();
e_board.board[4] = new Array();
e_board.board[5] = new Array();
e_board.board[6] = new Array();
e_board.board[7] = new Array();
e_board.board[8] = new Array();
e_board.board[9] = new Array();

e_board.turn = 1;

e_board.init = function(flag){

  for(var i=0;i<=9;i++){
    for(var j=0;j<=9;j++){
      e_board.board[i][j]=0;
    }
  }

  e_board.board[4][4] = -1 ;
  e_board.board[4][5] = 1 ;
  e_board.board[5][4] = 1 ;
  e_board.board[5][5] = -1 ;

  e_board.turn = 1;

  e_board.history = new Array();
  e_board.history_pos = 0;
  e_board.history_endpos = 0;

  e_board.history_update();
  if(flag !== false) e_anl.clear();
}

e_board.load_preview_init = function(){
  var m = JSON.parse(window.localStorage.getItem(e_ui.AppName + "_history"));
  if(m["prev"] === e_ui.AppName + "_history"){
    e_board.load_thumbnail("----------------------------------------------------------------");
    e_ui.load_n = 0;
    e_ui.load_pos = 0;
    e_ui.load_name = "";
  } else {
    var c = JSON.parse(window.localStorage.getItem(m["prev"]));
    e_board.load_thumbnail(c["thumbnail"]);
    e_ui.load_n = m["n"];
    e_ui.load_pos = m["n"];
    e_ui.load_name = m["prev"];
  }
}

e_board.load_preview_prev = function(){
  if(e_ui.load_pos <= 1) return;

  var c = JSON.parse(window.localStorage.getItem(e_ui.load_name));
  var cp = JSON.parse(window.localStorage.getItem(c["prev"]));

  e_board.load_thumbnail(cp["thumbnail"]);

  e_ui.load_pos--;
  e_ui.load_name = c["prev"];
}

e_board.load_preview_next = function(){
  if(e_ui.load_pos === e_ui.load_n) return;

  var c = JSON.parse(window.localStorage.getItem(e_ui.load_name));
  var cn = JSON.parse(window.localStorage.getItem(c["next"]));

  e_board.load_thumbnail(cn["thumbnail"]);

  e_ui.load_pos++;
  e_ui.load_name = c["next"];
}

e_board.load_preview_first = function(){
  if(e_ui.load_pos <= 1) return;
  var m = JSON.parse(window.localStorage.getItem(e_ui.AppName + "_history"));
  var mn = JSON.parse(window.localStorage.getItem(m["next"]));

  e_board.load_thumbnail(mn["thumbnail"]);

  e_ui.load_pos = 1;
  e_ui.load_name = m["next"];
}

e_board.load_preview_last = function(){
  if(e_ui.load_pos === e_ui.load_n) return;
  var m = JSON.parse(window.localStorage.getItem(e_ui.AppName + "_history"));
  var mp = JSON.parse(window.localStorage.getItem(m["prev"]));

  e_board.load_thumbnail(mp["thumbnail"]);

  e_ui.load_pos = e_ui.load_n;
  e_ui.load_name = m["prev"];
}

e_board.load = function(){

  var data = JSON.parse(window.localStorage.getItem(e_ui.load_name));

  if(e_board.load_str(data["str"]) === false) {
    window.alert("failed loading");
    e_board.init();
  }
  e_board.history_pos = +data["pos"];
  e_board.recoverboard();
  e_anl.clear();
}

e_board.load_str = function(str){

  var tmpflag1 = e_anl.autobook; var tmpflag2 = e_anl.autoeval;
  e_anl.autobook = false; e_anl.autoeval = false;

  e_board.init();

  var cur = 0;

  while(true){
    var c = str.charAt(cur);
    if(c === "")break;
    else if(c=== "Z"){
      cur++;
      for(var i=1;i<=8;i++){
        for(var j=1;j<=8;j++){
          var cl;
          if(str.charAt(cur) === "X") cl = 1;
          else if(str.charAt(cur) === "O") cl = -1;
          else if(str.charAt(cur) === "-") cl = 0;
          else return false;
          e_board.board[j][i] = cl;
          cur++;
        }
      }
      if(str.charAt(cur) !== "t") return false;

      var cl;
      if(str.charAt(cur+1) === "X") cl = 1;
      else if(str.charAt(cur+1) === "O") cl = -1;
      else return false;
      e_board.turn = cl;
      cur += 2;

      if(str.charAt(cur) !== "Z") return false;
      cur++;

      e_board.editend();
    } else if(c=== "z"){
      cur++;
      while(true){
        c = str.charAt(cur);
        if(c==="z"){
          cur++;
          break;
        }
        else if(c==="t"){
          var cl;
          if(str.charAt(cur+1) === "X") cl = 1;
          else if(str.charAt(cur+1) === "O") cl = -1;
          else return false;
          e_board.turn = cl;
          cur += 2;
        } else {
          var cc = c.charCodeAt(0);
          var cl;
          if(str.charAt(cur+1) === "") return false;
          if(str.charAt(cur+2) === "X") cl = 1;
          else if(str.charAt(cur+2) === "O") cl = -1;
          else if(str.charAt(cur+2) === "-") cl = 0;
          else return false;
          e_board.board[cc-96][str.charAt(cur+1)] = cl;
          cur += 3;
        }
      }
      e_board.editend();
    } else {
      var cc = c.charCodeAt(0);
      if( (cc >= 97) && (cc <= 104) ){
        if(str.charAt(cur+1) === "") return false;
        if(e_board.put( cc-96 , +str.charAt(cur+1) ) === 0) return false;
        cur += 2;
      } else if( (cc >= 65) && (cc <= 72) ){
        if(str.charAt(cur+1) === "") return false;
        if(e_board.put( cc-64 , +str.charAt(cur+1) ) === 0) return false;
        cur += 2;
      } else return false;
    }
  }

  e_anl.autobook = tmpflag1; e_anl.autoeval = tmpflag2;

  return true;
}

e_board.load_delete = function(){
  if(e_ui.load_n === 0) return;
  if(e_ui.load_n === 1){

    window.localStorage.removeItem(e_ui.load_name);

    var m = JSON.parse(window.localStorage.getItem(e_ui.AppName + "_history"));
    m["n"] = 0;
    m["next"] = e_ui.AppName + "_history";
    m["prev"] = e_ui.AppName + "_history";
    window.localStorage.setItem(e_ui.AppName + "_history",JSON.stringify(m));

    e_board.load_thumbnail("----------------------------------------------------------------");
    e_ui.load_n = 0;
    e_ui.load_pos = 0;
    e_ui.load_name = "";
  } else {
    var c = JSON.parse(window.localStorage.getItem(e_ui.load_name));
    var cp = JSON.parse(window.localStorage.getItem(c["prev"]));
    var cn = JSON.parse(window.localStorage.getItem(c["next"]));

    cp["next"] = c["next"];
    cn["prev"] = c["prev"];

    window.localStorage.removeItem(e_ui.load_name);
    window.localStorage.setItem(c["prev"],JSON.stringify(cp));
    window.localStorage.setItem(c["next"],JSON.stringify(cn));

    e_ui.load_n--;

    if(e_ui.load_n < e_ui.load_pos){
      e_ui.load_pos--;
      e_board.load_thumbnail(cp["thumbnail"]);
      e_ui.load_name = c["prev"];
    } else {
      e_board.load_thumbnail(cn["thumbnail"]);
      e_ui.load_name = c["next"];
    }

    var m = JSON.parse(window.localStorage.getItem(e_ui.AppName + "_history"));
    m["n"] = e_ui.load_n;
    window.localStorage.setItem(e_ui.AppName + "_history",JSON.stringify(m));
  }
}

e_board.ispass = function(){
  var res = 1;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      if(e_board.canput(i,j) === 1){
        res = 0;
      }
    }
  }
  return res;
}

e_board.canput = function(x,y){ 
  if(e_board.turn === 0) return 0;
  if(e_board.board[x][y]!=0)return 0;

  var res = 0;
  for(var i=-1;i<=1;i++){
    for(var j=-1;j<=1;j++){
      if( (i === 0) && (j === 0) )continue;
      if(e_board.canput_rec(x+i,y+j,i,j) === 1){ res=1; }
    }
  }
  return res;
}

e_board.canput_rec = function(x,y,i,j){
  if(e_board.board[x][y] === e_board.turn) return 2;
  if(e_board.board[x][y] === 0) return 0;
  if(e_board.canput_rec(x+i,y+j,i,j)>0) return 1; 
  else return 0;
}

e_board.editend = function(){ 

  var nchanged = 0;
  for(i=1;i<=8;i++){
    for(j=1;j<=8;j++){
      if(e_board.board[i][j] !== e_board.history[e_board.history_pos-1].board[i][j]){
        nchanged ++;
      }
    }
  }

  res = "";

  if(nchanged <= 22){
    res += "z";
    var buf = "abcdefgh";
    for(var i=1;i<=8;i++){
      for(var j=1;j<=8;j++){
        if(e_board.board[i][j] !== e_board.history[e_board.history_pos-1].board[i][j]){
          res += buf.charAt(i-1) + j;
          if(e_board.board[i][j] === 1){
            res += "X";
          } else if(e_board.board[i][j] === -1){
            res += "O";
          } else if(e_board.board[i][j] === 0){
            res += "-";
          }
        }
      }
    }
    if(e_board.turn !== e_board.history[e_board.history_pos-1].turn){
      res += "t";
      if(e_board.turn === 1){
        res += "X"
      } else if(e_board.turn === -1){
        res += "O"
      }
    }
    res += "z";
  } else {
    res += "Z";
    for(var j=1;j<=8;j++){
      for(var i=1;i<=8;i++){
        if(e_board.board[i][j] === 1){
          res += "X";
        } else if(e_board.board[i][j] === -1){
          res += "O";
        } else if(e_board.board[i][j] === 0){
          res += "-";
        }
      }
    }
    res += "t";
    if(e_board.turn === 1){
      res += "X"
    } else if(e_board.turn === -1){
      res += "O"
    }
    res += "Z";
  }
  e_board.history[e_board.history_pos-1].oper = res;
  e_board.history_update();
  e_anl.clear();
}

e_board.editcancel = function(){
  e_board.recoverboard();
}

e_board.load_cancel = function(){
  e_board.recoverboard();
}

e_board.recoverboard = function(){
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      e_board.board[i][j] = e_board.history[e_board.history_pos-1].board[i][j];
    }
  }
  e_board.turn = e_board.history[e_board.history_pos-1].turn ;
}

e_board.put = function(x,y){
    
  if(e_board.turn === 0) return 0;
  if(e_board.board[x][y]!=0)return 0;

  var res = 0;
  for(var i=-1;i<=1;i++){
    for(var j=-1;j<=1;j++){
      if( (i === 0) && (j === 0) )continue;
      if(e_board.put_rec(x+i,y+j,i,j) === 1){ res=1; }
    }
  }
  if(res === 1){
    e_board.board[x][y]=e_board.turn;
    e_board.turn*=-1;

    var buf = 'abcdefgh';
    var w = buf.charAt(x-1);
    var h = y ;
    e_board.history[e_board.history_pos-1].oper=w+h;
    e_board.history_update();
    e_anl.clear();
  }

  return res;
}

e_board.put_rec = function(x,y,i,j){
  if(e_board.board[x][y] === e_board.turn) return 2;
  if(e_board.board[x][y] === 0) return 0;
  if(e_board.put_rec(x+i,y+j,i,j)>0){
    e_board.board[x][y]=e_board.turn;
    return 1;
  } else return 0;
}

e_board.history_update = function() {
  e_ui.savestate = 0;
  if(e_board.ispass() === 1){
    e_board.turn *= -1;
    if(e_board.ispass() === 1){
      e_board.turn = 0;
    }
  }
  e_board.history[e_board.history_pos] = {};
  e_board.history[e_board.history_pos].board = new Array();
  for(var i=1;i<=8;i++){
    e_board.history[e_board.history_pos].board[i] = new Array();
    for(var j=1;j<=8;j++){
      e_board.history[e_board.history_pos].board[i][j] = e_board.board[i][j];
    }
  }
  e_board.history[e_board.history_pos].turn = e_board.turn ;

  e_board.history_pos++;
  e_board.history_endpos = e_board.history_pos;
}

e_board.undo = function() {
  if(e_board.history_pos <= 1) return;

  e_board.history_pos--;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      e_board.board[i][j] = e_board.history[e_board.history_pos-1].board[i][j];
    }
  }
  e_board.turn = e_board.history[e_board.history_pos-1].turn ;
  e_ui.savestate = 0;
  e_anl.clear();
}

e_board.undoall = function() {
  if(e_board.history_pos <= 1) return;

  e_board.history_pos=1;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      e_board.board[i][j] = e_board.history[0].board[i][j];
    }
  }
  e_board.turn = e_board.history[e_board.history_pos-1].turn ;
  e_ui.savestate = 0;
  e_anl.clear();
}

e_board.redo = function() {
  if(e_board.history_pos >= e_board.history_endpos) return;

  e_board.history_pos++;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      e_board.board[i][j] = e_board.history[e_board.history_pos-1].board[i][j];
    }
  }
  e_board.turn = e_board.history[e_board.history_pos-1].turn ;
  e_ui.savestate = 0;
  e_anl.clear();
}
e_board.redoall = function() {
  if(e_board.history_pos >= e_board.history_endpos) return;

  e_board.history_pos = e_board.history_endpos;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      e_board.board[i][j] = e_board.history[e_board.history_pos-1].board[i][j];
    }
  }
  e_board.turn = e_board.history[e_board.history_pos-1].turn ;
  e_ui.savestate = 0;
  e_anl.clear();
}

e_board.history_str = function() {
  res = "";
  for(i=0;i<e_board.history_endpos-1;i++){
    res += e_board.history[i].oper;
  }
  return res;
}

e_board.save = function(){
  var m = {};
  m.n = 0;
  m.next = e_ui.AppName + "_history";
  m.prev = e_ui.AppName + "_history";
  var mstr;

  mstr = window.localStorage.getItem(e_ui.AppName + "_history");
  if(mstr !== null){
    m = JSON.parse(mstr);
  }

  var mprev;
  var mprevstr;
  var mprevname;

  if(m["prev"] === e_ui.AppName + "_history"){
    mprev = m;
    mprevname = e_ui.AppName + "_history"
  } else {
    mprevstr = window.localStorage.getItem(m["prev"]);
    mprev = JSON.parse(mprevstr);
    mprevname = m["prev"];
  }

  var bufname = new Date().getTime().toString(16);

  var buf = {};
  buf["next"] = e_ui.AppName + "_history";
  buf["prev"] = m["prev"];
  buf["str"] = e_board.history_str();
  buf["pos"] = e_board.history_pos;
  buf["thumbnail"] = e_board.thumbnail();

  m["prev"] = bufname;
  mprev["next"] = bufname;

  m["n"]++;

  try{
    var bufstr = JSON.stringify(buf);
    window.localStorage.setItem(bufname,bufstr);
    mprevstr = JSON.stringify(mprev);
    window.localStorage.setItem(mprevname,mprevstr);
    mstr = JSON.stringify(m);
    window.localStorage.setItem(e_ui.AppName + "_history",mstr);
  }catch(e){
    alert("保存できませんでした。容量が不足している可能性があります。");
    m["n"]--;
  }
}

e_board.thumbnail = function(){
  res = "";
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      if(e_board.board[j][i] === 1){
        res += "X";
      } else if(e_board.board[j][i] === -1){
        res += "O";
      } else if(e_board.board[j][i] === 0){
        res += "-";
      }
    }
  }
  return res;
}

e_board.load_thumbnail = function(str){
  var cur = 0;
  for(var i=1;i<=8;i++){
    for(var j=1;j<=8;j++){
      if(str.charAt(cur) === "X"){
        e_board.board[j][i] = 1;
      } else if(str.charAt(cur) === "O"){
        e_board.board[j][i] = -1;
      } else if(str.charAt(cur) === "-"){
        e_board.board[j][i] = 0;
      }
      cur++;
    }
  }
}

e_board.import = function(){
  res = window.prompt("棋譜を入力してください。");
  if( (res !== null) && (res !== "") ){
    if(e_board.load_str(res) === false){
      window.alert("棋譜の読み込みに失敗しました。");
      e_board.init();
    }
  }
}

e_board.export = function(){
  window.prompt("コピペしてお使いください。",e_board.history_str());
}
var e_anl = {};

e_anl.eval_depth = 21; 
e_anl.eval_percent = 73; 

e_anl.eval_deadline_s = 1; 
e_anl.eval_deadline_auto_s = 1; 
e_anl.eval_num_anl = 1;

e_anl.autobook = false; 
e_anl.autoeval = false; 

e_anl.eval = false;
e_anl.book = false;

e_anl.init = function(){
  e_anl.wk_book = new Worker("wk_book.js");
  e_anl.wk_book.onerror = function(e){
//    alert(e.message);
    e_ui.black_notice("エラーが発生しました。");
  };
}

e_anl.load_eval = function(){
  e_ui.eval_loading = true;
  e_anl.wk_eval = new Worker("wk_eval.js");
  e_anl.wk_eval["onmessage"] = function(e){
    e_ui.eval_loading = false;
    e_ui.eval_loaded = true;
    e_ui.draw();
  }
  e_anl.wk_eval.onerror = function(e){
    e_ui.black_notice("エラーが発生しました。");
  };
};

e_anl.book_anl = function(){ 
  if(e_board.turn === 0)return;
  e_ui.book_searching = true;
  e_anl.wk_book["onmessage"] = function(e){
    e_anl.book = e["data"];
    e_ui.book_searching = false;
    e_ui.draw();
    if(e_anl.autoeval === true){
      e_anl.eval_auto();
    }
  }
  e_anl.wk_book["postMessage"](
    {"kind": "book", "board": e_board.thumbnail(), "turn": e_board.turn});
  e_ui.draw();
};

e_anl.eval_anl = function(){
  if(e_board.turn === 0)return;
  e_ui.analysing = true;
  e_anl.wk_eval["onmessage"] = function(e){
    e_anl.eval = e["data"];
    e_ui.analysing = false;
    e_ui.draw();
  }
  var turnchar;
  if(e_board.turn === 1){ turnchar = "X";
  }else{ turnchar = "O"; }
  e_anl.wk_eval["postMessage"]({
    "kind": "eval", "board": e_board.thumbnail(), "turn": turnchar,
    "depth": e_anl.eval_depth, "percent": e_anl.eval_percent,
    "deadline": e_anl.eval_deadline_s, "num": e_anl.eval_num_anl
  });
  e_ui.draw();
};

e_anl.eval_auto = function(){
  if(e_board.turn === 0)return;
  e_ui.analysing = true;
  e_anl.wk_eval["onmessage"] = function(e){
    e_anl.eval = e["data"];
    e_ui.analysing = false;
    e_ui.draw();
  }
  var turnchar;
  if(e_board.turn === 1){ turnchar = "X";
  }else{ turnchar = "O"; }
  e_anl.wk_eval["postMessage"]({
    "kind": "eval", "board": e_board.thumbnail(), "turn": turnchar,
    "depth": e_anl.eval_depth, "percent": e_anl.eval_percent,
    "deadline": e_anl.eval_deadline_auto_s,"num": e_anl.eval_num_anl
  });
  e_ui.draw();
};

e_anl.clear = function(){
  e_anl.book = false;
  e_anl.eval = false;
  if(e_board.turn !== 0){
    if(e_anl.autobook === true){
      e_anl.book_anl();
    } else if(e_anl.autoeval === true){
      e_anl.eval_auto();
    }
  }
};

e_anl.load_book = function(e){

  e_ui.book_loading = true;
  e_ui.book_loading_processing = false;
  e_ui.draw();

  e_anl.wk_book["onmessage"] = function(e){
    if(e["data"]["kind"] === "processing"){
      e_ui.book_loading_cur = e["data"]["ccur"];
      e_ui.book_loading_all = e["data"]["call"];
      e_ui.book_loading_processing = true;
    } else {
      e_ui.book_loaded = e["data"]["result"];
      e_ui.book_loading = false;
      if(e["data"]["result"] === false){
        e_anl.autobook = false;
        e_anl.book = false;
      }
    }
    e_ui.draw();
  }

  e_ui.file = e["target"]["files"][0];

  e_anl.wk_book["postMessage"]({"kind": "load_book", "file": e["target"]["files"][0]});

};
