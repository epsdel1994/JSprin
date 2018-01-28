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

