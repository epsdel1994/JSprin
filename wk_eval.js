

var Module = {
  "onRuntimeInitialized": function(){
    Module.ccall("jsprin_load_eval","number",[]);
    self.postMessage(0);
  }
};

var e_anl = {};

self["onmessage"] = function(e){
  if(e["data"]["kind"] === "eval"){ e_anl.eval(e); }
}

e_anl.eval = function(e){
  self.postMessage(
    JSON.parse(Module.ccall("jsprin_eval","string",["string","number","number","number","number","number","number"],
      [e["data"]["board"]+"t"+e["data"]["turn"],-64,64, e["data"]["depth"], e["data"]["percent"], e["data"]["deadline"] * 1000 , e["data"]["num"]])));
}
