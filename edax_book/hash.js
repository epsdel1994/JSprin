
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
