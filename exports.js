/* MCQ Bench: Excel and PDF made on the phone with no libraries. */
'use strict';
var LOGO_JPG = null;
// Helvetica and Helvetica-Bold widths for characters 32 to 126 (from the standard AFM files), in 1/1000 of the font size.
var HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
var HELVB = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
function pdfW(s, size, bold) {
  var t = bold ? HELVB : HELV, w = 0;
  for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); w += c >= 32 && c <= 126 ? t[c - 32] : 556; }
  return w * size / 1000;
}
function pdfEsc(s) {
  var out = '';
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i), k = s.charCodeAt(i);
    if (c === '\\' || c === '(' || c === ')') out += '\\' + c;
    else if (k === 0x2019) out += "'";
    else if (k < 32) out += ' ';
    else if (k > 255) out += '?';
    else out += c;
  }
  return out;
}
function bytesOf(s) { var a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 255; return a; }
// ---------- Excel (.xlsx): a stored zip of plain XML ----------
var CRC_T = (function () { var t = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function utf8(s) { return new TextEncoder().encode(s); }
function zipStore(files) {
  var parts = [], central = [], off = 0;
  function u16(n) { return [n & 255, (n >>> 8) & 255]; }
  function u32(n) { return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]; }
  files.forEach(function (f) {
    var name = utf8(f.name), data = utf8(f.data), crc = crc32(data);
    var head = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
    parts.push(new Uint8Array(head), name, data);
    central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length),
      u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), name);
    off += head.length + name.length + data.length;
  });
  var cdSize = central.reduce(function (s, b) { return s + b.length; }, 0);
  var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cdSize), u32(off), u16(0)));
  var all = parts.concat(central, [end]), len = all.reduce(function (s, b) { return s + b.length; }, 0), out = new Uint8Array(len), at = 0;
  all.forEach(function (b) { out.set(b, at); at += b.length; });
  return out;
}
function xmlEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\r/g, '&#13;').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); }
function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
function dateSerial(ymd) { return Math.round((Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10)) - Date.UTC(1899, 11, 30)) / 86400000); }
// cells: {v, t: 's' text | 'n' number | 'd' date | 'h' heading}
function sheetXml(rows, widths) {
  var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
  if (widths) x += '<cols>' + widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>';
  x += '<sheetData>';
  rows.forEach(function (r, ri) {
    x += '<row r="' + (ri + 1) + '">';
    r.forEach(function (c, ci) {
      if (c === null || c === undefined || c.v === '' || c.v === null || c.v === undefined) return;
      var ref = colName(ci) + (ri + 1);
      if (c.t === 'n') x += '<c r="' + ref + '" s="3"><v>' + Number(c.v) + '</v></c>';
      else if (c.t === 'f') x += '<c r="' + ref + '" s="4"><f>' + xmlEsc(c.f) + '</f><v>' + Number(c.v) + '</v></c>';
      else if (c.t === 'd') x += '<c r="' + ref + '" s="1"><v>' + dateSerial(c.v) + '</v></c>';
      else x += '<c r="' + ref + '" t="inlineStr"' + (c.t === 'h' ? ' s="2"' : '') + '><is><t xml:space="preserve">' + xmlEsc(c.v) + '</t></is></c>';
    });
    x += '</row>';
  });
  return x + '</sheetData></worksheet>';
}
function xlsxBook(sheets) {
  var files = [
    { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' },
    { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
      sheets.map(function (s, i) { return '<sheet name="' + xmlEsc(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
      '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
    { name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="d mmm yyyy"/></numFmts>' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="3" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' }
  ].concat(sheets.map(function (s, i) { return { name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: s.xml }; }));
  return zipStore(files);
}

// A plain A4 document with the same look as the summary: title band, sections, label and amount lines. Used for statements.
function pdfDoc(title, subtitle, build) {
  var NAVY = '0.055 0.369 0.353', GOLD = '0.184 0.647 0.612', GREY = '0.33 0.36 0.42';
  var pages = [], cur = null, y = 0;
  function text(x, yy, size, bold, s, rgb) { cur.push('BT ' + (rgb || '0.08 0.11 0.17') + ' rg /' + (bold ? 'F2' : 'F1') + ' ' + size + ' Tf ' + x.toFixed(2) + ' ' + yy.toFixed(2) + ' Td (' + pdfEsc(s) + ') Tj ET'); }
  function rtext(xr, yy, size, bold, s, rgb) { text(xr - pdfW(s, size, bold), yy, size, bold, s, rgb); }
  function page(first) {
    cur = []; pages.push(cur);
    if (first) {
      cur.push('q ' + NAVY + ' rg 0 762 595 80 re f Q', 'q ' + GOLD + ' rg 0 758 595 4 re f Q');
      if (LOGO_JPG) cur.push('q 56 0 0 56 28 774 cm /Im1 Do Q');
      text(LOGO_JPG ? 96 : 32, 808, 19, true, title, '1 1 1');
      text(LOGO_JPG ? 96 : 32, 789, 10.5, false, subtitle, '1 1 1');
      rtext(567, 808, 9, false, 'Made ' + fmtDate(todayPk()), '1 1 1');
      y = 734;
    } else {
      cur.push('q ' + NAVY + ' rg 0 812 595 30 re f Q');
      text(32, 822, 10, true, title + ' (continued)', '1 1 1');
      y = 790;
    }
  }
  function need(h) { if (y - h < 50) page(false); }
  function fit(s, size, bold, width) { if (pdfW(s, size, bold) <= width) return s; while (s.length > 1 && pdfW(s + '...', size, bold) > width) s = s.slice(0, -1); return s + '...'; }
  var d = {
    section: function (t) { need(46); y -= 7; text(40, y, 12.5, true, t, NAVY); y -= 5; cur.push('q ' + GOLD + ' rg 40 ' + y.toFixed(2) + ' 515 1.2 re f Q'); y -= 14; },
    kv: function (l, v, bold) { need(16); text(40, y, 10, !!bold, fit(l, 10, !!bold, 420)); rtext(555, y, 10, !!bold, String(v)); y -= 13.6; },
    line: function (s) { need(14); text(40, y, 9.5, false, fit(s, 9.5, false, 515), GREY); y -= 13.5; }
  };
  page(true);
  build(d);
  var parts = [], off = [], pos = 0;
  function add(bytes) { parts.push(bytes); pos += bytes.length; }
  function obj(n, body, stream) {
    off[n] = pos;
    add(bytesOf(n + ' 0 obj\n' + body + (stream ? '\nstream\n' : '\nendobj\n')));
    if (stream) { add(stream); add(bytesOf('\nendstream\nendobj\n')); }
  }
  add(bytesOf('%PDF-1.4\n%âãÏÓ\n'));
  var nPages = pages.length, first = 6, kids = [];
  for (var i = 0; i < nPages; i++) kids.push((first + i * 2) + ' 0 R');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Count ' + nPages + ' /Kids [' + kids.join(' ') + '] >>');
  obj(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  obj(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  if (LOGO_JPG) obj(5, '<< /Type /XObject /Subtype /Image /Width 240 /Height 240 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + LOGO_JPG.length + ' >>', LOGO_JPG);
  else obj(5, '<< >>');
  pages.forEach(function (p, i) {
    var content = bytesOf(p.join('\n'));
    obj(first + i * 2, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>' +
      (LOGO_JPG ? ' /XObject << /Im1 5 0 R >>' : '') + ' >> /Contents ' + (first + i * 2 + 1) + ' 0 R >>');
    obj(first + i * 2 + 1, '<< /Length ' + content.length + ' >>', content);
  });
  var total = first + nPages * 2, xref = pos, x = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
  for (var n = 1; n < total; n++) x += ('0000000000' + off[n]).slice(-10) + ' 00000 n \n';
  add(bytesOf(x + 'trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n'));
  var outB = new Uint8Array(pos), at = 0;
  parts.forEach(function (b) { outB.set(b, at); at += b.length; });
  return outB;
}
