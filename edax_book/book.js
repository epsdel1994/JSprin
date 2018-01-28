
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
