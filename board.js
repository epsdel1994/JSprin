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
