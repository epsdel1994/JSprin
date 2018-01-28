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


