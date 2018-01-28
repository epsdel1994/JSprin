
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
