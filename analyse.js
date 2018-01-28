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
