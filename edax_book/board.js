
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
