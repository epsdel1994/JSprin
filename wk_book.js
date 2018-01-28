

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

j_ex.X_TO_BIT = [
  {u: 0x00000000, d: 0x00000001}, {u: 0x00000000, d: 0x00000002},
  {u: 0x00000000, d: 0x00000004}, {u: 0x00000000, d: 0x00000008},
  {u: 0x00000000, d: 0x00000010}, {u: 0x00000000, d: 0x00000020},
  {u: 0x00000000, d: 0x00000040}, {u: 0x00000000, d: 0x00000080},
  {u: 0x00000000, d: 0x00000100}, {u: 0x00000000, d: 0x00000200},
  {u: 0x00000000, d: 0x00000400}, {u: 0x00000000, d: 0x00000800},
  {u: 0x00000000, d: 0x00001000}, {u: 0x00000000, d: 0x00002000},
  {u: 0x00000000, d: 0x00004000}, {u: 0x00000000, d: 0x00008000},
  {u: 0x00000000, d: 0x00010000}, {u: 0x00000000, d: 0x00020000},
  {u: 0x00000000, d: 0x00040000}, {u: 0x00000000, d: 0x00080000},
  {u: 0x00000000, d: 0x00100000}, {u: 0x00000000, d: 0x00200000},
  {u: 0x00000000, d: 0x00400000}, {u: 0x00000000, d: 0x00800000},
  {u: 0x00000000, d: 0x01000000}, {u: 0x00000000, d: 0x02000000},
  {u: 0x00000000, d: 0x04000000}, {u: 0x00000000, d: 0x08000000},
  {u: 0x00000000, d: 0x10000000}, {u: 0x00000000, d: 0x20000000},
  {u: 0x00000000, d: 0x40000000}, {u: 0x00000000, d: 0x80000000},
  {d: 0x00000000, u: 0x00000001}, {d: 0x00000000, u: 0x00000002},
  {d: 0x00000000, u: 0x00000004}, {d: 0x00000000, u: 0x00000008},
  {d: 0x00000000, u: 0x00000010}, {d: 0x00000000, u: 0x00000020},
  {d: 0x00000000, u: 0x00000040}, {d: 0x00000000, u: 0x00000080},
  {d: 0x00000000, u: 0x00000100}, {d: 0x00000000, u: 0x00000200},
  {d: 0x00000000, u: 0x00000400}, {d: 0x00000000, u: 0x00000800},
  {d: 0x00000000, u: 0x00001000}, {d: 0x00000000, u: 0x00002000},
  {d: 0x00000000, u: 0x00004000}, {d: 0x00000000, u: 0x00008000},
  {d: 0x00000000, u: 0x00010000}, {d: 0x00000000, u: 0x00020000},
  {d: 0x00000000, u: 0x00040000}, {d: 0x00000000, u: 0x00080000},
  {d: 0x00000000, u: 0x00100000}, {d: 0x00000000, u: 0x00200000},
  {d: 0x00000000, u: 0x00400000}, {d: 0x00000000, u: 0x00800000},
  {d: 0x00000000, u: 0x01000000}, {d: 0x00000000, u: 0x02000000},
  {d: 0x00000000, u: 0x04000000}, {d: 0x00000000, u: 0x08000000},
  {d: 0x00000000, u: 0x10000000}, {d: 0x00000000, u: 0x20000000},
  {d: 0x00000000, u: 0x40000000}, {d: 0x00000000, u: 0x80000000},
  {u: 0x00000000, d: 0x00000000}, {u: 0x00000000, d: 0x00000000},
  {u: 0x00000000, d: 0x00000000}, {u: 0x00000000, d: 0x00000000}
];

j_ex.bit_count32 = function(b){
  var c = b - ((b >>> 1) & 0x77777777) - ((b >>> 2) & 0x33333333) - ((b >>> 3) & 0x11111111);
  c = ((c + (c >>> 4)) & 0x0F0F0F0F) * 0x01010101;
  return c >>> 24;
};

j_ex.transpose = function(b){
  var c = {}; var t = {};

  t.u = (b.u ^ (b.u >>> 7)) & 0x00AA00AA;
  c.u = b.u ^ t.u ^ (t.u << 7);
  t.u = (c.u ^ (c.u >>> 14)) & 0x0000CCCC;
  c.u = c.u ^ t.u ^ (t.u << 14);

  t.d = (b.d ^ (b.d >>> 7)) & 0x00AA00AA;
  c.d = b.d ^ t.d ^ (t.d << 7);
  t.d = (c.d ^ (c.d >>> 14)) & 0x0000CCCC;
  c.d = c.d ^ t.d ^ (t.d << 14);

  t.u = (c.u & 0xF0F0F0F0) + ((c.d >>> 4) & 0x0F0F0F0F);
  c.d = (c.d & 0x0F0F0F0F) + ((c.u << 4) & 0xF0F0F0F0);
  c.u = t.u

  return c;
};

j_ex.vertical_mirror = function(b){
  var buf = {};
  buf.u = ((b.d >>> 8) & 0x00FF00FF ) | ((b.d << 8) & 0xFF00FF00);
  buf.u = ((buf.u >>> 16) & 0x0000FFFF ) | ((buf.u << 16) & 0xFFFF0000);
  buf.d = ((b.u >>> 8) & 0x00FF00FF ) | ((b.u << 8) & 0xFF00FF00);
  buf.d = ((buf.d >>> 16) & 0x0000FFFF ) | ((buf.d << 16) & 0xFFFF0000);
  return buf;
};

j_ex.horizontal_mirror = function(b){
  var buf = {};
  buf.u = ((b.u >>> 1) & 0x55555555 ) | ((b.u << 1) & 0xAAAAAAAA);
  buf.u = ((buf.u >>> 2) & 0x33333333 ) | ((buf.u << 2) & 0xCCCCCCCC);
  buf.u = ((buf.u >>> 4) & 0x0F0F0F0F ) | ((buf.u << 4) & 0xF0F0F0F0);
  buf.d = ((b.d >>> 1) & 0x55555555 ) | ((b.d << 1) & 0xAAAAAAAA);
  buf.d = ((buf.d >>> 2) & 0x33333333 ) | ((buf.d << 2) & 0xCCCCCCCC);
  buf.d = ((buf.d >>> 4) & 0x0F0F0F0F ) | ((buf.d << 4) & 0xF0F0F0F0);
  return buf;
};

j_ex.board_swap_players = function(board){
  var tmp = board.player;
  board.player = board.opponent;
  board.opponent = tmp;
};

j_ex.board_set = function(board, string){
  board.player = {};
  board.opponent = {};
  board.player.u = board.player.d = board.opponent.u = board.opponent.d = 0;

  var pos = 0;
  for(i=A1; i<=H8; i++){
    switch(string.charAt(pos++)){
      case "X":
        board.player.u |= j_ex.X_TO_BIT[i].u;
        board.player.d |= j_ex.X_TO_BIT[i].d;
        break;
      case "O":
        board.opponent.u |= j_ex.X_TO_BIT[i].u;
        board.opponent.d |= j_ex.X_TO_BIT[i].d;
        break;
      case "-":
        break;
      default:
        i--;break;
    }
  }
  for(; string.charAt(pos)!=="";){
    switch(string.charAt(pos++)){
      case "X":
        return BLACK;
      case "O":
        j_ex.board_swap_players(board);
        return WHITE;
      default:
        break;
    }
  }
};

j_ex.board_compare = function(b1,b2){

  var p1u, p2u, p1d, p2d, o1u, o2u, o1d, o2d;
  p1u = b1.player.u; p2u = b2.player.u; p1d = b1.player.d; p2d = b2.player.d;
  o1u = b1.opponent.u; o2u = b2.opponent.u; o1d = b1.opponent.d; o2d = b2.opponent.d;

  if(p1u < 0)p1u += 4294967296; if(p2u < 0)p2u += 4294967296;
  if(p1d < 0)p1d += 4294967296; if(p2d < 0)p2d += 4294967296;
  if(o1u < 0)o1u += 4294967296; if(o2u < 0)o2u += 4294967296;
  if(o1d < 0)o1d += 4294967296; if(o2d < 0)o2d += 4294967296;

  if(p1u > p2u) return 1;
  else if(p1u < p2u) return -1;
  else if(p1d > p2d) return 1;
  else if(p1d < p2d) return -1;
  else if(o1u > o2u) return 1;
  else if(o1u < o2u) return -1;
  else if(o1d > o2d) return 1;
  else if(o1d < o2d) return -1;
  else return 0;
};

j_ex.board_equal = function(board1, board2){
  return ((board1.player.u === board2.player.u) && (board1.player.d === board2.player.d)
    && (board1.opponent.u === board2.opponent.u) && (board1.opponent.d === board2.opponent.d) );
};

j_ex.board_symetry = function(board,s,sym){
  sym.player= {u: board.player.u, d: board.player.d};
  sym.opponent= {u: board.opponent.u, d: board.opponent.d};

  if((s & 1) !== 0){
    sym.player = j_ex.horizontal_mirror(sym.player);
    sym.opponent = j_ex.horizontal_mirror(sym.opponent);
  }
  if((s & 2) !== 0){
    sym.player = j_ex.vertical_mirror(sym.player);
    sym.opponent = j_ex.vertical_mirror(sym.opponent);
  }
  if((s & 4) !== 0){
    sym.player = j_ex.transpose(sym.player);
    sym.opponent = j_ex.transpose(sym.opponent);
  }
};

j_ex.board_unique = function(board,unique){
  var s = 0;
  unique.player.u = board.player.u; unique.player.d = board.player.d;
  unique.opponent.u = board.opponent.u; unique.opponent.d = board.opponent.d;
  for(var i=0; i<8; i++){
    var sym = {};
    j_ex.board_symetry(board, i, sym);
    if(j_ex.board_compare(sym, unique)<0){
      unique.player.u = sym.player.u; unique.player.d = sym.player.d;
      unique.opponent.u = sym.opponent.u; unique.opponent.d = sym.opponent.d;
      s = i;
    }
  }
  return s;
};

j_ex.board_get_hash_code = function(board){

  var h = {};
  h.u = j_ex.hash_rank[0 * 256 + board.player.u >>> 24].u;
  h.u ^= j_ex.hash_rank[1 * 256 + (board.player.u << 8) >>> 24].u;
  h.u ^= j_ex.hash_rank[2 * 256 + (board.player.u << 16) >>> 24].u;
  h.u ^= j_ex.hash_rank[3 * 256 + (board.player.u << 24) >>> 24].u;
  h.u ^= j_ex.hash_rank[0 * 256 + board.player.d >>> 24].u;
  h.u ^= j_ex.hash_rank[1 * 256 + (board.player.d << 8) >>> 24].u;
  h.u ^= j_ex.hash_rank[2 * 256 + (board.player.d << 16) >>> 24].u;
  h.u ^= j_ex.hash_rank[3 * 256 + (board.player.d << 24) >>> 24].u;
  h.u ^= j_ex.hash_rank[0 * 256 + board.opponent.u >>> 24].u;
  h.u ^= j_ex.hash_rank[1 * 256 + (board.opponent.u << 8) >>> 24].u;
  h.u ^= j_ex.hash_rank[2 * 256 + (board.opponent.u << 16) >>> 24].u;
  h.u ^= j_ex.hash_rank[3 * 256 + (board.opponent.u << 24) >>> 24].u;
  h.u ^= j_ex.hash_rank[0 * 256 + board.opponent.d >>> 24].u;
  h.u ^= j_ex.hash_rank[1 * 256 + (board.opponent.d << 8) >>> 24].u;
  h.u ^= j_ex.hash_rank[2 * 256 + (board.opponent.d << 16) >>> 24].u;
  h.u ^= j_ex.hash_rank[3 * 256 + (board.opponent.d << 24) >>> 24].u;

  h.d = j_ex.hash_rank[0 * 256 + board.player.u >>> 24].d;
  h.d ^= j_ex.hash_rank[1 * 256 + (board.player.u << 8) >>> 24].d;
  h.d ^= j_ex.hash_rank[2 * 256 + (board.player.u << 16) >>> 24].d;
  h.d ^= j_ex.hash_rank[3 * 256 + (board.player.u << 24) >>> 24].d;
  h.d ^= j_ex.hash_rank[0 * 256 + board.player.d >>> 24].d;
  h.d ^= j_ex.hash_rank[1 * 256 + (board.player.d << 8) >>> 24].d;
  h.d ^= j_ex.hash_rank[2 * 256 + (board.player.d << 16) >>> 24].d;
  h.d ^= j_ex.hash_rank[3 * 256 + (board.player.d << 24) >>> 24].d;
  h.d ^= j_ex.hash_rank[0 * 256 + board.opponent.u >>> 24].d;
  h.d ^= j_ex.hash_rank[1 * 256 + (board.opponent.u << 8) >>> 24].d;
  h.d ^= j_ex.hash_rank[2 * 256 + (board.opponent.u << 16) >>> 24].d;
  h.d ^= j_ex.hash_rank[3 * 256 + (board.opponent.u << 24) >>> 24].d;
  h.d ^= j_ex.hash_rank[0 * 256 + board.opponent.d >>> 24].d;
  h.d ^= j_ex.hash_rank[1 * 256 + (board.opponent.d << 8) >>> 24].d;
  h.d ^= j_ex.hash_rank[2 * 256 + (board.opponent.d << 16) >>> 24].d;
  h.d ^= j_ex.hash_rank[3 * 256 + (board.opponent.d << 24) >>> 24].d;

  return h;
};

j_ex.book = {};

j_ex.book.date = {};
j_ex.book.options = {};
j_ex.book.stats = {};

j_ex.link_read = function(link, file){
  link.score = file.data[file.pos++];
  link.move = file.data[file.pos++];
  return true;
};

j_ex.position_read = function(position, file){

  var reader = new FileReaderSync();
  var blob = j_ex.bloball.slice(file.pos, file.pos+200);
  var dataraw = reader.readAsArrayBuffer(blob);
  file.data = new Uint8Array(dataraw);
  file.pos = 0;

  position.board = {};

  position.board.player = {};
  position.board.player.d = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.board.player.u = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.board.opponent = {};
  position.board.opponent.d = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.board.opponent.u = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);

  position.n_wins = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.n_draws = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.n_loses = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);
  position.n_lines = file.data[file.pos++] + (file.data[file.pos++] << 8)
    + (file.data[file.pos++] << 16) + (file.data[file.pos++] << 24);

  position.score = {};
  position.score.value = file.data[file.pos++] + (file.data[file.pos++] << 8);
  position.score.lower = file.data[file.pos++] + (file.data[file.pos++] << 8);
  position.score.upper = file.data[file.pos++] + (file.data[file.pos++] << 8);

  position.n_link = file.data[file.pos++];
  position.level = file.data[file.pos++];

  position.done = position.todo = false;

  if(position.n_link){
    position.link = [];
    for(var i=0; i<position.n_link; i++){
      position.link[i] = {};
      j_ex.link_read(position.link[i], file);
    }
  } else position.link = null;

  position.leaf = {};
  j_ex.link_read(position.leaf, file);

  return true;
};

j_ex.position_array_init = function(a){
  a.size = a.n = 0;
  a.positions = [];
}

j_ex.position_array_add = function(a, p){
  for(var i=0; i<a.n; i++)if(j_ex.board_equal(a.positions[i].board, p.board)) return false;
  a.positions[a.n] = JSON.parse(JSON.stringify(p));
  a.positions[a.n].done = true;
  a.positions[a.n].todo = false;
  ++a.n;
  return true;
};

j_ex.position_array_probe = function(hash, board){

  var hashto = j_ex.book.hasharray[hash];
  while(hashto !== 0xFFFFFFFF){
    var position = {};
    var reader = new FileReaderSync();
    var blob = j_ex.book.arraybloball.slice(hashto*4, (hashto+1)*4);
    var array = reader.readAsArrayBuffer(blob);
    var arrayview = new Uint32Array(array);
    
    var file = { data: null, pos: arrayview[0]};
    j_ex.position_read(position, file);

    if(j_ex.board_equal(position.board, board))return position;
    blob = j_ex.book.arraynextbloball.slice(hashto*4, (hashto+1)*4);
    array = reader.readAsArrayBuffer(blob);
    arrayview = new Uint32Array(array);

    hashto = arrayview[0];
  }

  return null;
};

j_ex.book_probe = function(board){

  var unique = {};
  unique.player = {}; unique.opponent = {};
  j_ex.board_unique(board, unique);

  return j_ex.position_array_probe(j_ex.board_get_hash_code(unique).d & (j_ex.book.n - 1), unique);

};

j_ex.book.add_hasharray_u = function(hash, offset){
  j_ex.book.arraynext[offset%250000] = j_ex.book.hasharray[hash];
  j_ex.book.hasharray[hash] = offset;
};

j_ex.book_load = function(file){

  var j_ex_blob = [];

  var reader = new FileReaderSync();
  var ccur = 0;
  var blob = file.slice(0,1000400);
  var dataraw = reader.readAsArrayBuffer(blob);
  j_ex_blob[ccur] = new Blob([dataraw.slice(0,1000000)]);
  var data = new Uint8Array(dataraw);

  var c_all = Math.floor(file.size/1000000);

  var pos = 0;
  if( (data[pos++] !== 88) || (data[pos++] !== 65) || (data[pos++] !== 68) || (data[pos++] !== 69)
    || (data[pos++] !== 75) || (data[pos++] !== 79) || (data[pos++] !== 79) || (data[pos++] !== 66) ){
    return {"kind":"done" ,"result": false};
  }

  if( (data[pos++] !== 4) || (data[pos++] !==3) ){
    return {"kind":"done" ,"result": false};
  }

  self.postMessage({"kind": "processing", "ccur": ccur, "call": c_all});

  j_ex.book.date.year = data[pos++] + (data[pos++] << 8);
  j_ex.book.date.month = data[pos++];
  j_ex.book.date.day = data[pos++];
  j_ex.book.date.hour = data[pos++];
  j_ex.book.date.minute = data[pos++];
  j_ex.book.date.second = data[pos++];
  pos++;

  j_ex.book.options.level = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);
  j_ex.book.options.n_empties = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);
  j_ex.book.options.midgame_error = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);
  j_ex.book.options.endcut_error = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);
  j_ex.book.options.verbosity = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);

  j_ex.book.n_nodes = data[pos++] + (data[pos++] << 8) + (data[pos++] << 16) + (data[pos++] << 24);

  j_ex.book.n = 65536;
  while( (j_ex.book.n << 4) < j_ex.book.n_nodes) j_ex.book.n <<= 1;

  j_ex.book.hasharrayraw = new ArrayBuffer(4 * j_ex.book.n);
  j_ex.book.hasharray = new Uint32Array(j_ex.book.hasharrayraw);

  var arrayblob = [];
  j_ex.book.arrayraw = new ArrayBuffer(1000000);
  j_ex.book.array = new Uint32Array(j_ex.book.arrayraw);

  var arraynextblob = [];
  j_ex.book.arraynextraw = new ArrayBuffer(1000000);
  j_ex.book.arraynext = new Uint32Array(j_ex.book.arraynextraw);

  for(var i=0; i<j_ex.book.n; i++){
    j_ex.book.hasharray[i] = 0xFFFFFFFF;
  }

  var offset = pos;

  var i;
  for(i=0; i<j_ex.book.n_nodes; i++){
    if(1000000 < offset){
      ccur++;
      blob = file.slice(ccur*1000000, ccur*1000000 + 1000400);
      dataraw = reader.readAsArrayBuffer(blob);
      j_ex_blob[ccur] = new Blob([dataraw.slice(0,1000000)]);
      data = new Uint8Array(dataraw);
      offset -= 1000000;
      self.postMessage({"kind": "processing", "ccur": ccur, "call": c_all});
    }
    if( (i !== 0) && ((i%250000) === 0) ){
      arrayblob[(i/250000)-1] = new Blob([j_ex.book.arrayraw]);
      j_ex.book.arrayraw = new ArrayBuffer(1000000);
      j_ex.book.array = new Uint32Array(j_ex.book.arrayraw);

      arraynextblob[(i/250000)-1] = new Blob([j_ex.book.arraynextraw]);
      j_ex.book.arraynextraw = new ArrayBuffer(1000000);
      j_ex.book.arraynext = new Uint32Array(j_ex.book.arraynextraw);
    }

    j_ex.book.array[i%250000] = ccur*1000000 + offset;
    j_ex.book.add_hasharray_u(j_ex.board_get_hash_code({
      player: {
        u: data[offset++] + (data[offset++] << 8) + (data[offset++] << 16) + (data[offset++] << 24) ,
        d: data[offset++] + (data[offset++] << 8) + (data[offset++] << 16) + (data[offset++] << 24)
      },
      opponent: {
        u: data[offset++] + (data[offset++] << 8) + (data[offset++] << 16) + (data[offset++] << 24) ,
        d: data[offset++] + (data[offset++] << 8) + (data[offset++] << 16) + (data[offset++] << 24)
      }
    }).d & (j_ex.book.n - 1), i);
    offset += 24 + data[offset + 22] * 2 + 2 ;
  }

  dataraw = null;
  data = null;

  arrayblob[Math.floor(i/250000)] = new Blob([j_ex.book.arrayraw]);
  j_ex.book.arraybloball = new Blob(arrayblob);

  arraynextblob[Math.floor(i/250000)] = new Blob([j_ex.book.arraynextraw]);
  j_ex.book.arraynextbloball = new Blob(arraynextblob);

  j_ex.bloball = new Blob(j_ex_blob);


  return {"kind":"done" ,"result": true};
};
var i=0;
var A1 = i++; var B1 = i++; var C1 = i++; var D1 = i++;
var E1 = i++; var F1 = i++; var G1 = i++; var H1 = i++;
var A2 = i++; var B2 = i++; var C2 = i++; var D2 = i++;
var E2 = i++; var F2 = i++; var G2 = i++; var H2 = i++;
var A3 = i++; var B3 = i++; var C3 = i++; var D3 = i++;
var E3 = i++; var F3 = i++; var G3 = i++; var H3 = i++;
var A4 = i++; var B4 = i++; var C4 = i++; var D4 = i++;
var E4 = i++; var F4 = i++; var G4 = i++; var H4 = i++;
var A5 = i++; var B5 = i++; var C5 = i++; var D5 = i++;
var E5 = i++; var F5 = i++; var G5 = i++; var H5 = i++;
var A6 = i++; var B6 = i++; var C6 = i++; var D6 = i++;
var E6 = i++; var F6 = i++; var G6 = i++; var H6 = i++;
var A7 = i++; var B7 = i++; var C7 = i++; var D7 = i++;
var E7 = i++; var F7 = i++; var G7 = i++; var H7 = i++;
var A8 = i++; var B8 = i++; var C8 = i++; var D8 = i++;
var E8 = i++; var F8 = i++; var G8 = i++; var H8 = i++;
var PASS = i++; var NOMOVE = i++;

i=0;
var BLACK = i++; var WHITE = i++; var EMPTY = i++; var OFF_SIDE = i++;

j_ex.hash_rank = [];

j_ex.hash_code_init = function(){
  for(var i=0;i<16*256;i++){
    do{
      j_ex.hash_rank[i] = {};
      j_ex.hash_rank[i].u = Math.floor((Math.random() * 4294967296));
      j_ex.hash_rank[i].d = Math.floor((Math.random() * 4294967296));
    }while(j_ex.bit_count32(j_ex.hash_rank[i].u) + j_ex.bit_count32(j_ex.hash_rank[i].d) < 8);
  }
}
j_ex.symetry = function(x,sym){
  if((A1 <= x) && (x <= H8)){
    if((sym & 1) !== 0){
      x = ((x & 0x00000038) | (7 - (x & 7)));
    }
    if((sym & 2) !== 0){
      x = ((0x00000038 - (x & 0x00000038)) | (x & 7));
    }
    if((sym & 4) !== 0){
      x = (((x & 0x00000038) >>> 3) | ((x & 7) << 3));
    }
  }
  return x;
};
