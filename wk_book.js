

var e_anl = {};

var j_ex = {};

e_anl.inited = false;

self["onmessage"] = function(e){
  if(e_anl.inited === false){
    j_ex.hash_code_init();
    e_anl.inited = true;
  }
  if(e["data"]["kind"] === "book"){ e_anl.book(e);
  } else if(e["data"]["kind"] === "load_book"){ e_anl.load_book(e); }
}

e_anl.book = function(e){
  var position = {};
  var board = {};
  var turnchar;
  if(e["data"]["turn"] > 0)turnchar = "X"; else turnchar = "O";
  j_ex.board_set(board, e["data"]["board"] + "t" + turnchar);

  var res = j_ex.book_probe(board);
  if(res === null){
    self.postMessage({"n": 0}); return;
  }
  
  var s;
  for(s=0; s<8; s++){
    var sym = {};
    j_ex.board_symetry(res.board,s,sym);
    if(j_ex.board_equal(sym,board) === true)break;
  }

  var mes = {};
  mes["n"] = res.n_link;
  mes["x"] = []; mes["y"] = []; mes["v"] = [];

  for(var i=0; i<res.n_link; i++){
    mes["x"][i] = (j_ex.symetry(res.link[i].move,s) & 0x00000007) +1;
    mes["y"][i] = (j_ex.symetry(res.link[i].move,s) >>> 3) +1;
    mes["v"][i] = res.link[i].score;
  }

  if(res.leaf.move !== NOMOVE){
    mes["l"] = true;
    mes["x"][res.n_link] = (j_ex.symetry(res.leaf.move,s) & 0x00000007) +1;
    mes["y"][res.n_link] = (j_ex.symetry(res.leaf.move,s) >>> 3) +1;
    mes["v"][res.n_link] = res.leaf.score;
  } else {
    mes["l"] = false;
  }

  self.postMessage(mes);
}

e_anl.load_book = function(e){
  self.postMessage(j_ex.book_load(e["data"]["file"]));
}
