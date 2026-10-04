var Module = Module !== undefined ? Module : {};
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && globalThis.name == "em-pthread";
(function () {
  if (typeof document != "undefined") {
    var e = "cod4";
    var r = "kisak_opfs_ready";
    var t = "kisak_opt_audio";
    var i = "kisak_opt_video";
    var n = "kisak-opfs";
    Module.preRun = Module.preRun || [];
    Module.preRun.push(function () {
      if (!window.__kisakOpfsReady) {
        addRunDependency(n);
        window.__kisakOpfsDependencyHeld = true;
      }
    });
    var a = "kisak_opt_maps";
    var s = /kisakcod-mp\.js(?:[?#]|$)/.test(document.currentScript ? document.currentScript.src : "");
    var o = ["killhouse", "cargoship", "coup", "blackout", "bog_a", "bog_b", "hunted", "aftermath", "airplane", "village_assault", "scoutsniper", "sniperescape", "village", "village_defend", "icbm", "launch", "ambush", "wetwork", "simplecredits"];
    var c = ["code_post_gfx", "code_post_gfx_mp", "code_pre_gfx", "code_pre_gfx_mp", "common", "common_mp", "ui", "ui_mp", "localized_code_post_gfx", "localized_code_post_gfx_mp", "localized_common", "localized_common_mp"];
    var l = /\.(exe|dll|pdb|so|dylib|lib|exp|ilk|log|dmp|tmp)$/i;
    var _ = /^(miles|pb|bin|docs|directx|__macosx|\.git|redist)$/i;
    var u = {
      panel: null,
      log: null,
      pick: null,
      play: null,
      wipe: null,
      audio: null,
      video: null,
      maps: null,
      options: null,
      audioSize: null,
      videoSize: null,
      copySize: null
    };
    var m = {
      files: [],
      maps: [],
      totalBytes: 0,
      lang: "english",
      sizes: {
        audio: 0,
        video: 0,
        maps: {}
      }
    };
    window.__kisakOpfsReady = false;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", H);
    } else {
      H();
    }
  }
  function f(e) {
    return document.getElementById(e);
  }
  function d(e) {
    console.log("[installer]", e);
    if (u.log) {
      u.log.textContent += e + "\n";
      u.log.scrollTop = u.log.scrollHeight;
    }
  }
  function g(e) {
    if (e < 1024) {
      return e + " B";
    } else if (e < 1048576) {
      return (e / 1024).toFixed(1) + " KB";
    } else if (e < 1073741824) {
      return (e / 1048576).toFixed(1) + " MB";
    } else {
      return (e / 1073741824).toFixed(2) + " GB";
    }
  }
  function p(e) {
    return e.replace(/\\/g, "/").replace(/^\/+/, "").toLowerCase();
  }
  function v(e) {
    return e.indexOf("mp_") === 0;
  }
  function w(e) {
    var r = p(e);
    var t = r.split("/");
    if (l.test(r)) {
      return "skip";
    }
    if (t.some(function (e, r) {
      return r < t.length - 1 && _.test(e);
    })) {
      return "skip";
    }
    if (r === "localization.txt") {
      return "required";
    }
    if (/\.(bik|bink|avi|ivf)$/i.test(r) || t.indexOf("video") >= 0) {
      return "video";
    }
    if (/\.(mp3|wav|flac|ogg|wma)$/i.test(r)) {
      return "audio";
    }
    if (t.indexOf("sound") >= 0 || t.indexOf("voice") >= 0 || /sound|voice|audio/.test(r.split("/").pop())) {
      return "audio";
    }
    var i = function (e) {
      var r = p(e).match(/^zone\/[^/]+\/([^/]+)\.(ff|iwd)$/);
      if (r) {
        return r[1];
      } else {
        return "";
      }
    }(r);
    if (i) {
      for (var n = 0; n < c.length; n++) {
        if (i === c[n]) {
          return "required";
        }
      }
      if (function (e) {
        if (!e) {
          return false;
        }
        if (v(e)) {
          return true;
        }
        for (var r = 0; r < o.length; r++) {
          if (e === o[r]) {
            return true;
          }
        }
        return false;
      }(i)) {
        return "map:" + i;
      } else {
        return "required";
      }
    }
    if (r.indexOf("main/") === 0 || r.indexOf("main_shared/") === 0 || r.indexOf("raw/") === 0 || r.indexOf("raw_shared/") === 0 || r.indexOf("zone/") === 0) {
      return "required";
    } else {
      return "skip";
    }
  }
  function E(e) {
    var r = e.replace(/\\/g, "/").toLowerCase();
    return r.indexOf("soundaliases/") !== 0 && !(r.indexOf("/soundaliases/") >= 0) && (!!/\.(mp3|wav|flac|ogg|wma)$/.test(r) || r === "sound" || r.indexOf("sound/") === 0 || r.indexOf("/sound/") >= 0 || r === "voice" || r.indexOf("voice/") === 0 || r.indexOf("/voice/") >= 0);
  }
  function x(e) {
    for (var r = e.length - 22; r >= 0; r--) {
      if (e[r] === 80 && e[r + 1] === 75 && e[r + 2] === 5 && e[r + 3] === 6) {
        return r;
      }
    }
    return -1;
  }
  async function h(e, r, t) {
    var i = e.values();
    while (true) {
      var n = await i.next();
      if (n.done) {
        break;
      }
      var a = n.value;
      var s = r ? r + "/" + a.name : a.name;
      if (a.kind === "directory") {
        if (_.test(a.name)) {
          continue;
        }
        await h(a, s, t);
      } else if (a.kind === "file") {
        var o = w(s);
        if (o === "skip") {
          continue;
        }
        var c = await a.getFile();
        t.push({
          path: s,
          handle: a,
          size: c.size,
          kind: o,
          audioBytes: 0
        });
        c = null;
      }
    }
  }
  function b() {
    return new Promise(function (e) {
      var r = document.createElement("input");
      r.type = "file";
      r.multiple = true;
      r.hidden = true;
      r.setAttribute("webkitdirectory", "");
      r.setAttribute("directory", "");
      document.body.appendChild(r);
      var t = false;
      function i(i) {
        if (!t) {
          t = true;
          r.remove();
          e(function (e) {
            for (var r = Array.from(e || []), t = r.map(function (e) {
                return (e.webkitRelativePath || e.name).replace(/\\/g, "/");
              }), i = t.length ? t[0].split("/")[0] : "", n = !!i && t.every(function (e) {
                return e.indexOf(i + "/") === 0;
              }), a = [], s = 0; s < r.length; s++) {
              var o = n ? t[s].slice(i.length + 1) : t[s];
              var c = w(o);
              if (o && c !== "skip") {
                a.push({
                  path: o,
                  file: r[s],
                  size: r[s].size,
                  kind: c,
                  audioBytes: 0
                });
              }
            }
            return a;
          }(i));
        }
      }
      r.addEventListener("change", function () {
        i(r.files);
      });
      r.addEventListener("cancel", function () {
        i([]);
      });
      r.click();
    });
  }
  async function A(r) {
    if (!navigator.storage || !navigator.storage.getDirectory) {
      throw new Error("OPFS unavailable");
    }
    return (await navigator.storage.getDirectory()).getDirectoryHandle(e, {
      create: !!r
    });
  }
  function L(e, r, t) {
    e[r] = t & 255;
    e[r + 1] = t >>> 8 & 255;
    e[r + 2] = t >>> 16 & 255;
    e[r + 3] = t >>> 24 & 255;
  }
  async function y(e, r, t) {
    var i = new DataView(await e.slice(r, r + 30).arrayBuffer());
    if (i.getUint32(0, true) !== 67324752) {
      return 0;
    }
    var n = i.getUint16(6, true);
    var a = 30 + i.getUint16(26, true) + i.getUint16(28, true) + t;
    if (n & 8) {
      a += new DataView(await e.slice(r + a, r + a + 4).arrayBuffer()).getUint32(0, true) === 134695760 ? 16 : 12;
    }
    return a;
  }
  async function T(e, r, t, i) {
    var n = await async function (e, r) {
      var t = r.split("/");
      t.pop();
      var i = e;
      for (var n = 0; n < t.length; n++) {
        if (t[n]) {
          i = await i.getDirectoryHandle(t[n], {
            create: true
          });
        }
      }
      return i;
    }(e, r.path);
    var a = r.path.split("/").pop();
    var s = await n.getFileHandle(a, {
      create: true
    });
    var o = await s.createWritable();
    var c = r.file || (await r.handle.getFile());
    if (i && /\.iwd$/i.test(r.path)) {
      try {
        var l = await async function (e) {
          try {
            var r = e.size;
            if (r < 22) {
              return 0;
            }
            var t = Math.min(r, 65557);
            var i = new Uint8Array(await e.slice(r - t).arrayBuffer());
            var n = x(i);
            if (n < 0) {
              return 0;
            }
            var a = new DataView(i.buffer, i.byteOffset, i.byteLength);
            var s = a.getUint32(n + 12, true);
            var o = a.getUint32(n + 16, true);
            if (!s || o === 4294967295 || o + s > r) {
              return 0;
            }
            for (var c = new Uint8Array(await e.slice(o, o + s).arrayBuffer()), l = 0, _ = 0, u = new TextDecoder("latin1"); l + 46 <= c.length && c[l] === 80 && c[l + 1] === 75 && c[l + 2] === 1 && c[l + 3] === 2;) {
              var m = (c[l + 20] | c[l + 21] << 8 | c[l + 22] << 16 | c[l + 23] << 24) >>> 0;
              var f = c[l + 28] | c[l + 29] << 8;
              var d = c[l + 30] | c[l + 31] << 8;
              var g = c[l + 32] | c[l + 33] << 8;
              if (E(u.decode(c.subarray(l + 46, l + 46 + f)))) {
                _ += m;
              }
              l += 46 + f + d + g;
            }
            return _;
          } catch (e) {
            return 0;
          }
        }(c);
        if (l > 0) {
          var _ = await async function (e) {
            var r = e.size;
            if (r < 22) {
              return null;
            }
            var t = Math.min(r, 65557);
            var i = new Uint8Array(await e.slice(r - t).arrayBuffer());
            var n = x(i);
            if (n < 0) {
              return null;
            }
            var a = new DataView(i.buffer, i.byteOffset, i.byteLength);
            var s = a.getUint32(n + 12, true);
            var o = a.getUint32(n + 16, true);
            if (!s || o === 4294967295 || o + s > r) {
              return null;
            }
            for (var c = new Uint8Array(await e.slice(o, o + s).arrayBuffer()), l = new TextDecoder("latin1"), _ = [], u = 0, m = 0; m + 46 <= c.length && c[m] === 80 && c[m + 1] === 75 && c[m + 2] === 1 && c[m + 3] === 2;) {
              var f = (c[m + 20] | c[m + 21] << 8 | c[m + 22] << 16 | c[m + 23] << 24) >>> 0;
              var d = c[m + 28] | c[m + 29] << 8;
              var g = 46 + d + (c[m + 30] | c[m + 31] << 8) + (c[m + 32] | c[m + 33] << 8);
              var p = l.decode(c.subarray(m + 46, m + 46 + d));
              var v = (c[m + 42] | c[m + 43] << 8 | c[m + 44] << 16 | c[m + 45] << 24) >>> 0;
              u += 1;
              if (!E(p)) {
                _.push({
                  cdRaw: c.subarray(m, m + g),
                  localOff: v,
                  compSize: f
                });
              }
              m += g;
            }
            if (_.length === u) {
              return null;
            }
            if (!_.length) {
              var w = new Uint8Array(22);
              w[0] = 80;
              w[1] = 75;
              w[2] = 5;
              w[3] = 6;
              return new Blob([w]);
            }
            var h = [];
            var b = [];
            var A = 0;
            for (var T = 0; T < _.length; T++) {
              var G = _[T];
              var C = await y(e, G.localOff, G.compSize);
              if (!C) {
                return null;
              }
              h.push(e.slice(G.localOff, G.localOff + C));
              var M = new Uint8Array(G.cdRaw);
              L(M, 42, A);
              b.push(M);
              A += C;
            }
            var P = new Blob(b);
            var S = new Uint8Array(22);
            S[0] = 80;
            S[1] = 75;
            S[2] = 5;
            S[3] = 6;
            S[8] = _.length & 255;
            S[9] = _.length >> 8 & 255;
            S[10] = S[8];
            S[11] = S[9];
            L(S, 12, P.size);
            L(S, 16, A);
            return new Blob(h.concat([P, S]));
          }(c);
          if (_) {
            c = _;
          }
        }
      } catch (e) {}
    }
    if (c.stream && o) {
      await c.stream().pipeTo(o);
    } else {
      await o.write(c);
      await o.close();
    }
    if (t) {
      t(c.size);
    }
  }
  function G() {
    for (var e = u.maps ? u.maps.querySelectorAll("input[type=checkbox]") : [], r = [], t = 0; t < e.length; t++) {
      if (e[t].checked) {
        var i = e[t].getAttribute("data-maps");
        if (i) {
          try {
            for (var n = JSON.parse(i), a = 0; a < n.length; a++) {
              r.push(n[a]);
            }
          } catch (e) {}
        } else if (e[t].value) {
          r.push(e[t].value);
        }
      }
    }
    return r;
  }
  function C(e, r, t, i) {
    var n = e.kind;
    return n !== "skip" && (n === "required" || (n === "audio" ? t : n === "video" ? i : n.indexOf("map:") === 0 && (r === null || r.indexOf(n.slice(4)) >= 0)));
  }
  function M(e) {
    if (e) {
      return "skip to save " + g(e);
    } else {
      return "";
    }
  }
  function P(e, r) {
    var t = e.size;
    if (!r) {
      t -= e.audioBytes || 0;
    }
    if (t < 0) {
      return 0;
    } else {
      return t;
    }
  }
  function S() {
    if (u.copySize && m.files.length) {
      var e = !!u.audio && !!u.audio.checked;
      var r = !!u.video && !!u.video.checked;
      var t = G();
      var i = 0;
      for (var n = 0; n < m.files.length; n++) {
        if (C(m.files[n], t, e, r)) {
          i += P(m.files[n], e);
        }
      }
      u.copySize.textContent = "Will copy " + g(i);
    }
  }
  function k(e, r, t) {
    var i = document.createElement("label");
    i.className = "map-group";
    var n = document.createElement("input");
    n.type = "checkbox";
    n.setAttribute("data-maps", JSON.stringify(r));
    n.checked = !!t;
    n.addEventListener("change", S);
    i.appendChild(n);
    i.appendChild(document.createTextNode(" " + e));
    var a = document.createElement("span");
    a.className = "map-group-count";
    var s = r.length + (r.length === 1 ? " map" : " maps");
    var o = M(function (e) {
      var r = 0;
      var t = m.sizes && m.sizes.maps || {};
      for (var i = 0; i < e.length; i++) {
        r += t[e[i]] || 0;
      }
      return r;
    }(r));
    a.textContent = o ? " · " + s + " · " + o : " · " + s;
    i.appendChild(a);
    u.maps.appendChild(i);
  }
  function V() {
    if (u.maps) {
      u.maps.innerHTML = "";
      var e = {};
      try {
        var r = localStorage.getItem(a);
        if (r) {
          JSON.parse(r).forEach(function (r) {
            e[r] = true;
          });
        }
      } catch (e) {}
      if (m.maps.length) {
        var t = m.maps.filter(v).sort();
        var i = m.maps.filter(function (e) {
          return !v(e);
        }).slice().sort(function (e, r) {
          var t = o.indexOf(e);
          var i = o.indexOf(r);
          if (t < 0) {
            t = 1000;
          }
          if (i < 0) {
            i = 1000;
          }
          if (t !== i) {
            return t - i;
          } else if (e < r) {
            return -1;
          } else if (e > r) {
            return 1;
          } else {
            return 0;
          }
        });
        var n = false;
        for (var c in e) {
          if (e[c]) {
            n = true;
            break;
          }
        }
        if (s && t.length) {
          var l = n && t.some(function (r) {
            return e[r];
          });
          k("Multiplayer maps", t, l);
        }
        if (i.length) {
          var _ = n && i.some(function (r) {
            return e[r];
          });
          k("Campaign maps", i, _);
        }
      } else {
        u.maps.innerHTML = "<div class=\"empty\">No maps found. The menu still boots.</div>";
      }
    }
  }
  async function I() {
    if (u.pick) {
      u.pick.disabled = true;
      u.pick.textContent = "Scanning…";
    }
    var e = [];
    try {
      if (window.showDirectoryPicker) {
        var r = await window.showDirectoryPicker({
          mode: "read"
        });
        await h(r, "", e);
      } else {
        e = await b();
      }
    } finally {
      if (u.pick) {
        u.pick.disabled = false;
        u.pick.textContent = "Choose your game folder";
      }
    }
    if (e.length) {
      m.files = e;
      m.totalBytes = 0;
      m.maps = [];
      m.sizes = {
        audio: 0,
        video: 0,
        maps: {}
      };
      var t = {};
      e.forEach(function (e) {
        m.totalBytes += e.size;
        if (e.kind === "audio") {
          m.sizes.audio += e.size;
        } else {
          if (e.audioBytes) {
            m.sizes.audio += e.audioBytes;
          }
          if (e.kind === "video") {
            m.sizes.video += e.size;
          } else if (e.kind.indexOf("map:") === 0) {
            var r = e.kind.slice(4);
            m.sizes.maps[r] = (m.sizes.maps[r] || 0) + e.size;
            if (!t[r]) {
              t[r] = 1;
              m.maps.push(r);
            }
          }
        }
      });
      if (!e.find(function (e) {
        return p(e.path) === "localization.txt";
      })) {
        d("No localization.txt - pick the CoD4 install root (the folder with localization.txt and zone/).");
        u.play.disabled = true;
        if (u.options) {
          u.options.hidden = true;
        }
        return;
      }
      if (u.audioSize) {
        u.audioSize.textContent = M(m.sizes.audio);
      }
      if (u.videoSize) {
        u.videoSize.textContent = M(m.sizes.video);
      }
      V();
      if (u.options) {
        u.options.hidden = false;
      }
      S();
      u.play.disabled = false;
      u.play.textContent = "Copy into OPFS";
    }
  }
  function B() {
    window.__kisakOpfsReady = true;
    if (window.__kisakOpfsDependencyHeld) {
      window.__kisakOpfsDependencyHeld = false;
      removeRunDependency(n);
    }
    if (u.panel) {
      u.panel.hidden = true;
    }
    document.body.classList.add("game-running");
  }
  async function H() {
    u.panel = f("installer-panel");
    u.log = f("install-log");
    u.pick = f("select-folder-button");
    u.play = f("play-button");
    u.wipe = f("wipe-data-button");
    u.audio = f("include-audio");
    u.video = f("include-video");
    u.maps = f("map-selection");
    u.options = f("install-options");
    u.audioSize = f("audio-size");
    u.videoSize = f("video-size");
    u.copySize = f("install-copy-size");
    if (u.audio) {
      u.audio.checked = localStorage.getItem(t) !== "0";
    }
    if (u.video) {
      u.video.checked = localStorage.getItem(i) === "1";
    }
    if (u.audio) {
      u.audio.addEventListener("change", S);
    }
    if (u.video) {
      u.video.addEventListener("change", S);
    }
    if (u.pick) {
      u.pick.addEventListener("click", function () {
        I().catch(function (e) {
          d(String(e.message || e));
        });
      });
    }
    if (u.play) {
      u.play.addEventListener("click", function () {
        if (m.files.length) {
          (async function () {
            if (m.files.length) {
              var e = !!u.audio && !!u.audio.checked;
              var n = !!u.video && !!u.video.checked;
              var s = G();
              localStorage.setItem(t, e ? "1" : "0");
              localStorage.setItem(i, n ? "1" : "0");
              localStorage.setItem(a, JSON.stringify(s));
              var o = m.files.filter(function (r) {
                return C(r, s, e, n);
              });
              var c = 0;
              o.forEach(function (r) {
                c += P(r, e);
              });
              u.play.disabled = true;
              u.pick.disabled = true;
              if (u.copySize) {
                u.copySize.textContent = "Copying " + g(c) + "…";
              }
              if (navigator.storage.persist) {
                try {
                  await navigator.storage.persist();
                } catch (e) {}
              }
              var l = await A(true);
              var _ = 0;
              for (var f = 0; f < o.length; f++) {
                try {
                  await T(l, o[f], function (e) {
                    _ += e;
                  }, !e);
                } catch (e) {
                  d("FAIL " + o[f].path + ": " + (e.message || e));
                }
                if (!!u.copySize && (f % 3 == 0 || f === o.length - 1)) {
                  u.copySize.textContent = "Copying " + g(_) + " / " + g(c);
                }
              }
              localStorage.setItem(r, "1");
              m.files = [];
              u.pick.disabled = false;
              u.play.disabled = false;
              u.play.textContent = "Play";
              if (u.copySize) {
                u.copySize.textContent = "Copy complete. Press Play.";
              }
            } else {
              d("Pick a CoD4 folder");
            }
          })().catch(function (e) {
            d(String(e.message || e));
          });
        } else if (localStorage.getItem(r) === "1") {
          u.play.disabled = true;
          (async function () {
            try {
              var e = await A(false);
              var r = await e.getDirectoryHandle("zone");
              var t = await r.getDirectoryHandle("english");
              var i = await t.getFileHandle("code_post_gfx.ff");
              var n = await i.getFile();
              var a = 872586;
              if (n.size !== a) {
                return "code_post_gfx.ff is " + n.size + " bytes; expected " + a + ". Re-copy the game folder.";
              }
              var s = await crypto.subtle.digest("SHA-256", await n.arrayBuffer());
              if (Array.from(new Uint8Array(s), function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("") !== "81725a3492080f836a800b59e3378ed63e445ff62bb922e67f40f012216f70cd") {
                return "code_post_gfx.ff failed integrity verification. Re-copy the game folder.";
              } else {
                return "";
              }
            } catch (e) {
              return "code_post_gfx.ff is missing. Re-copy the game folder.";
            }
          })().then(function (e) {
            if (e) {
              d(e);
              u.play.disabled = false;
              return;
            }
            B();
          });
        }
      });
    }
    if (u.wipe) {
      u.wipe.addEventListener("click", function () {
        (async function () {
          if (confirm("Delete the copied CoD4 files from this browser?")) {
            try {
              var t = await navigator.storage.getDirectory();
              await t.removeEntry(e, {
                recursive: true
              });
            } catch (e) {
              if (!e || e.name !== "NotFoundError") {
                d("wipe failed: " + e);
              }
            }
            localStorage.removeItem(r);
            d("Data cleared, refresh the page.");
            location.reload();
          }
        })().catch(function (e) {
          d(String(e.message || e));
        });
      });
    }
    if (await async function () {
      try {
        var e = await A(false);
        var r = await e.getFileHandle("localization.txt");
        return (await r.getFile()).size > 0;
      } catch (e) {
        return false;
      }
    }()) {
      d("Press play to start the game.");
      if (u.play) {
        u.play.disabled = false;
        u.play.textContent = "Play";
      }
      localStorage.setItem(r, "1");
    } else if (u.play) {
      u.play.disabled = true;
      u.play.textContent = "Play";
    }
  }
})();
var programArgs = [];
var thisProgram = "./this.program";
var quit_ = (e, r) => {
  throw r;
};
var _scriptName = globalThis.document?.currentScript?.src;
if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}
var readAsync;
var readBinary;
var scriptDirectory = "";
function locateFile(e) {
  if (Module.locateFile) {
    return Module.locateFile(e, scriptDirectory);
  } else {
    return scriptDirectory + e;
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  if (ENVIRONMENT_IS_WORKER) {
    readBinary = e => {
      var r = new XMLHttpRequest();
      r.open("GET", e, false);
      r.responseType = "arraybuffer";
      r.send(null);
      return new Uint8Array(r.response);
    };
  }
  readAsync = async e => {
    var r = await fetch(e, {
      credentials: "same-origin"
    });
    if (r.ok) {
      return r.arrayBuffer();
    }
    throw new Error(r.status + " : " + r.url);
  };
}
var wasmBinary;
var wasmModule;
var EXITSTATUS;
var out = console.log.bind(console);
var err = console.error.bind(console);
var ABORT = false;
function assert(e, r) {
  if (!e) {
    abort(r);
  }
}
var startWorker;
var isFileURI = e => e.startsWith("file://");
class EmscriptenEH {}
class EmscriptenSjLj extends EmscriptenEH {}
function growMemViews() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
}
if (ENVIRONMENT_IS_PTHREAD) {
  var initializedJS = false;
  function handleMessage(e) {
    try {
      var r = e.data;
      var t = r.cmd;
      if (t == 1) {
        let e = [];
        self.onmessage = r => e.push(r);
        startWorker = () => {
          postMessage({
            cmd: 3
          });
          for (let r of e) {
            handleMessage(r);
          }
          self.onmessage = handleMessage;
        };
        for (const e of r.handlers) {
          if (!Module[e] || !!Module[e].proxy) {
            Module[e] = (...r) => {
              postMessage({
                cmd: 9,
                handler: e,
                args: r
              });
            };
            if (e == "print") {
              out = Module[e];
            }
            if (e == "printErr") {
              err = Module[e];
            }
          }
        }
        wasmMemory = r.wasmMemory;
        updateMemoryViews();
        wasmModule = r.wasmModule;
        createWasm();
        run();
        startWorker();
      } else if (t == 2) {
        establishStackSpace(r.pthread_ptr);
        __emscripten_thread_init(r.pthread_ptr, 0, 0, 1, 0, 0);
        PThread.receiveOffscreenCanvases(r);
        PThread.threadInitTLS();
        __emscripten_thread_mailbox_await(r.pthread_ptr);
        initializedJS ||= true;
        try {
          invokeEntryPoint(r.start_routine, r.arg);
        } catch (e) {
          if (e != "unwind") {
            throw e;
          }
        }
      } else if (t == 4) {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (t) {
        err(`worker: received unknown command ${t}`);
        err(r);
      }
    } catch (e) {
      if (runtimeInitialized) {
        __emscripten_thread_crashed();
      }
      throw e;
    }
  }
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  self.onmessage = handleMessage;
}
var wasmBinaryFile;
var HEAP8;
var runtimeInitialized = false;
function getMemoryBuffer() {
  return wasmMemory.buffer;
}
function updateMemoryViews() {
  if (!HEAP8?.buffer?.growable) {
    var e = getMemoryBuffer();
    HEAP8 = new Int8Array(e);
    HEAP16 = new Int16Array(e);
    HEAPU8 = new Uint8Array(e);
    HEAPU16 = new Uint16Array(e);
    Module.HEAP32 = HEAP32 = new Int32Array(e);
    HEAPU32 = new Uint32Array(e);
    HEAPF32 = new Float32Array(e);
    HEAPF64 = new Float64Array(e);
    HEAP64 = new BigInt64Array(e);
  }
}
function initMemory() {
  if (!ENVIRONMENT_IS_PTHREAD) {
    wasmMemory = new WebAssembly.Memory({
      initial: 16384,
      maximum: 65536,
      shared: true
    });
    updateMemoryViews();
  }
}
function preRun() {
  var e = Module.preRun;
  if (e) {
    if (typeof e == "function") {
      e = [e];
    }
    onPreRuns.push(...e);
  }
  callRuntimeCallbacks(onPreRuns);
}
function initRuntime() {
  runtimeInitialized = true;
  if (!ENVIRONMENT_IS_PTHREAD) {
    wasmExports.__wasm_call_ctors();
  }
}
function postRun() {
  var e = Module.postRun;
  if (e) {
    if (typeof e == "function") {
      e = [e];
    }
    onPostRuns.push(...e);
  }
  callRuntimeCallbacks(onPostRuns);
}
function abort(e) {
  Module.onAbort?.(e);
  err(e = `Aborted(${e})`);
  ABORT = true;
  e += ". Build with -sASSERTIONS for more info.";
  throw new WebAssembly.RuntimeError(e);
}
function findWasmBinary() {
  return locateFile("kisakcod-sp.wasm");
}
function getBinarySync(e) {
  if (readBinary) {
    return readBinary(e);
  }
  throw "both async and sync fetching of the wasm failed";
}
async function getWasmBinary(e) {
  if (!wasmBinary) {
    try {
      var r = await readAsync(e);
      return new Uint8Array(r);
    } catch {}
  }
  return getBinarySync(e);
}
async function instantiateArrayBuffer(e, r) {
  try {
    var t = await getWasmBinary(e);
    return await WebAssembly.instantiate(t, r);
  } catch (e) {
    err(`failed to asynchronously prepare wasm: ${e}`);
    abort(e);
  }
}
async function instantiateAsync(e, r, t) {
  if (!e) {
    try {
      var i = fetch(r, {
        credentials: "same-origin"
      });
      return await WebAssembly.instantiateStreaming(i, t);
    } catch (e) {
      err(`wasm streaming compile failed: ${e}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(r, t);
}
function getWasmImports() {
  assignWasmImports();
  return {
    env: wasmImports,
    wasi_snapshot_preview1: wasmImports
  };
}
async function createWasm() {
  function e(e, r) {
    wasmExports = applySignatureConversions(wasmExports = e.exports);
    registerTLSInit(wasmExports._emscripten_tls_init);
    assignWasmExports(wasmExports);
    wasmModule = r;
    return wasmExports;
  }
  var r = getWasmImports();
  var t = Module.instantiateWasm;
  if (t) {
    return new Promise(i => {
      t(r, (r, t) => i(e(r, t)));
    });
  }
  if (ENVIRONMENT_IS_PTHREAD) {
    return e(new WebAssembly.Instance(wasmModule, getWasmImports()), wasmModule);
  }
  wasmBinaryFile ??= findWasmBinary();
  var i = function (r) {
    return e(r.instance, r.module);
  }(await instantiateAsync(wasmBinary, wasmBinaryFile, r));
  return i;
}
class ExitStatus {
  name = "ExitStatus";
  constructor(e) {
    this.message = `Program terminated with exit(${e})`;
    this.status = e;
  }
}
var HEAPF64;
var HEAP64;
var terminateWorker = e => {
  e.terminate();
  e.onmessage = e => {};
};
var cleanupThread = e => {
  var r = PThread.pthreads[e];
  PThread.returnWorkerToPool(r);
};
var callRuntimeCallbacks = e => {
  while (e.length > 0) {
    e.shift()(Module);
  }
};
var onPreRuns = [];
var addOnPreRun = e => onPreRuns.push(e);
var dependenciesPromise = null;
var resolveRunDependencies = async () => dependenciesPromise;
var runDependencies = 0;
var dependenciesPromiseResolve = null;
var removeRunDependency = e => {
  runDependencies--;
  Module.monitorRunDependencies?.(runDependencies);
  if (!runDependencies) {
    dependenciesPromiseResolve();
  }
};
var addRunDependency = e => {
  if (!runDependencies) {
    dependenciesPromise = new Promise(e => dependenciesPromiseResolve = e);
  }
  runDependencies++;
  Module.monitorRunDependencies?.(runDependencies);
};
var spawnThread = e => {
  var r = PThread.getNewWorker();
  if (!r) {
    return 6;
  }
  PThread.pthreads[e.pthread_ptr] = r;
  r.pthread_ptr = e.pthread_ptr;
  var t = {
    cmd: 2,
    start_routine: e.startRoutine,
    arg: e.arg,
    pthread_ptr: e.pthread_ptr
  };
  t.moduleCanvasId = e.moduleCanvasId;
  t.offscreenCanvases = e.offscreenCanvases;
  r.postMessage(t, e.transferList);
  return 0;
};
var runtimeKeepaliveCounter = 0;
var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
var stackSave = () => _emscripten_stack_get_current();
var stackRestore = e => __emscripten_stack_restore(e);
var stackAlloc = e => __emscripten_stack_alloc(e);
var proxyToMainThread = (e, r, t, ...i) => {
  var n = i.length * 8 * 2;
  var a = stackSave();
  var s = stackAlloc(n);
  var o = s >>> 3;
  for (var c of i) {
    if (typeof c == "bigint") {
      (growMemViews(), HEAP64)[o++ >>> 0] = 1n;
      (growMemViews(), HEAP64)[o++ >>> 0] = c;
    } else {
      (growMemViews(), HEAP64)[o++ >>> 0] = 0n;
      (growMemViews(), HEAPF64)[o++ >>> 0] = c;
    }
  }
  var l = __emscripten_run_js_on_main_thread(e, r, n, s, t);
  stackRestore(a);
  return l;
};
function _proc_exit(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(0, 0, 1, e);
  }
  EXITSTATUS = e;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    Module.onExit?.(e);
    ABORT = true;
  }
  quit_(e, new ExitStatus(e));
}
var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};
function exitOnMainThread(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(1, 0, 0, e);
  }
  runtimeKeepalivePop();
  _exit(e);
}
var HEAP32;
var HEAPU32;
var exitJS = (e, r) => {
  EXITSTATUS = e;
  if (ENVIRONMENT_IS_PTHREAD) {
    exitOnMainThread(e);
    throw "unwind";
  }
  _proc_exit(e);
};
var _exit = exitJS;
var waitAsyncPolyfilled = !Atomics.waitAsync || globalThis.navigator?.userAgent && Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]) < 91;
var PThread = {
  unusedWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  init() {
    if (!ENVIRONMENT_IS_PTHREAD) {
      PThread.initMainThread();
    }
  },
  initMainThread() {
    for (var e = 16; e--;) {
      PThread.allocateUnusedWorker();
    }
    addOnPreRun(async () => {
      var e = PThread.loadWasmModuleToAllWorkers();
      addRunDependency("loading-workers");
      await e;
      removeRunDependency("loading-workers");
    });
  },
  terminateAllThreads: () => {
    for (var e of Object.values(PThread.pthreads)) {
      terminateWorker(e);
    }
    for (var e of PThread.unusedWorkers) {
      terminateWorker(e);
    }
    PThread.unusedWorkers = [];
    PThread.pthreads = {};
  },
  clearMailboxAwait: e => {
    if (!waitAsyncPolyfilled) {
      Atomics.notify((growMemViews(), HEAP32), e >>> 2);
    }
  },
  terminateRuntime: () => {
    PThread.terminateAllThreads();
    var e = _pthread_self();
    ___set_thread_state(0, 0, 0, 1);
    PThread.clearMailboxAwait(e);
  },
  returnWorkerToPool: e => {
    var r = e.pthread_ptr;
    delete PThread.pthreads[r];
    PThread.unusedWorkers.push(e);
    e.pthread_ptr = 0;
    PThread.clearMailboxAwait(r);
    __emscripten_thread_free_data(r);
  },
  receiveOffscreenCanvases(e) {
    if (GL !== undefined) {
      Object.assign(GL.offscreenCanvases, e.offscreenCanvases);
      if (!Module.canvas && e.moduleCanvasId && GL.offscreenCanvases[e.moduleCanvasId]) {
        Module.canvas = GL.offscreenCanvases[e.moduleCanvasId].offscreenCanvas;
        Module.canvas.id = e.moduleCanvasId;
      }
    }
  },
  threadInitTLS() {
    PThread.tlsInitFunctions.forEach(e => e());
  },
  loadWasmModuleToWorker: e => new Promise(r => {
    e.onmessage = t => {
      var i = t.data;
      var n = i.cmd;
      if (i.targetThread && i.targetThread != _pthread_self()) {
        var a = PThread.pthreads[i.targetThread];
        a?.postMessage(i);
      } else if (i !== "setimmediate" && i !== "_si") {
        switch (n) {
          case 4:
            checkMailbox();
            break;
          case 5:
            spawnThread(i);
            break;
          case 6:
            callUserCallback(() => cleanupThread(i.thread));
            break;
          case 3:
            r(e);
            break;
          case 9:
            Module[i.handler](...i.args);
            break;
          default:
            if (n) {
              err(`worker sent an unknown command ${n}`);
            }
        }
      } else {
        e.postMessage(i);
      }
    };
    e.onerror = e => {
      err(`worker sent an error! ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    var t = [];
    for (var i of ["onExit", "onAbort", "print", "printErr"]) {
      if (Module.propertyIsEnumerable(i)) {
        t.push(i);
      }
    }
    e.postMessage({
      cmd: 1,
      handlers: t,
      wasmMemory: wasmMemory,
      wasmModule: wasmModule
    });
  }),
  async loadWasmModuleToAllWorkers() {
    if (ENVIRONMENT_IS_PTHREAD) {
      return;
    }
    return Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
  },
  allocateUnusedWorker() {
    var e;
    e = new Worker(_scriptName, {
      name: "em-pthread"
    });
    PThread.unusedWorkers.push(e);
    return e;
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      var e = PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(e);
    }
    return PThread.unusedWorkers.pop();
  }
};
var onPostRuns = [];
var addOnPostRun = e => onPostRuns.push(e);
function establishStackSpace(e) {
  var r = (growMemViews(), HEAPU32)[e + 48 >>> 2 >>> 0];
  var t = (growMemViews(), HEAPU32)[e + 52 >>> 2 >>> 0];
  _emscripten_stack_set_limits(r, r - t);
  stackRestore(r);
}
var wasmMemory;
var HEAPU8;
var invokeEntryPoint = (e, r) => {
  runtimeKeepaliveCounter = 0;
  noExitRuntime = 0;
  (function (e) {
    if (keepRuntimeAlive()) {
      EXITSTATUS = e;
    } else {
      __emscripten_thread_exit(e);
    }
  })(dynCall_ii(e, r));
};
var noExitRuntime = true;
var registerTLSInit = e => PThread.tlsInitFunctions.push(e);
var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};
var INT53_MAX = 9007199254740992;
var INT53_MIN = -9007199254740992;
var bigintToI53Checked = e => e < INT53_MIN || e > INT53_MAX ? NaN : Number(e);
var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
var findStringEnd = (e, r, t, i) => {
  var n = r + t;
  if (i) {
    return n;
  }
  while (e[r] && !(r >= n)) {
    ++r;
  }
  return r;
};
var UTF8ArrayToString = (e, r = 0, t, i) => {
  var n = findStringEnd(e, r >>>= 0, t, i);
  if (n - r > 16 && e.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(e.buffer instanceof ArrayBuffer ? e.subarray(r, n) : e.slice(r, n));
  }
  var a = "";
  for (; r < n;) {
    var s = e[r++];
    if (s & 128) {
      var o = e[r++] & 63;
      if ((s & 224) != 192) {
        var c = e[r++] & 63;
        if ((s = (s & 240) == 224 ? (s & 15) << 12 | o << 6 | c : (s & 7) << 18 | o << 12 | c << 6 | e[r++] & 63) < 65536) {
          a += String.fromCharCode(s);
        } else {
          var l = s - 65536;
          a += String.fromCharCode(l >> 10 | 55296, l & 1023 | 56320);
        }
      } else {
        a += String.fromCharCode((s & 31) << 6 | o);
      }
    } else {
      a += String.fromCharCode(s);
    }
  }
  return a;
};
var UTF8ToString = (e, r, t) => (e >>>= 0) ? UTF8ArrayToString((growMemViews(), HEAPU8), e, r, t) : "";
function ___assert_fail(e, r, t, i) {
  r >>>= 0;
  i >>>= 0;
  return abort(`Assertion failed: ${UTF8ToString(e >>>= 0)}, at: ${[r ? UTF8ToString(r) : "unknown filename", t, i ? UTF8ToString(i) : "unknown function"]}`);
}
var ___call_sighandler = function (e, r) {
  return dynCall_vi(e >>>= 0, r);
};
class ExceptionInfo {
  constructor(e) {
    this.excPtr = e;
    this.ptr = e - 24;
  }
  set_type(e) {
    (growMemViews(), HEAPU32)[this.ptr + 4 >>> 2 >>> 0] = e;
  }
  get_type() {
    return (growMemViews(), HEAPU32)[this.ptr + 4 >>> 2 >>> 0];
  }
  set_destructor(e) {
    (growMemViews(), HEAPU32)[this.ptr + 8 >>> 2 >>> 0] = e;
  }
  get_destructor() {
    return (growMemViews(), HEAPU32)[this.ptr + 8 >>> 2 >>> 0];
  }
  set_caught(e) {
    e = e ? 1 : 0;
    (growMemViews(), HEAP8)[this.ptr + 12 >>> 0] = e;
  }
  get_caught() {
    return (growMemViews(), HEAP8)[this.ptr + 12 >>> 0] != 0;
  }
  set_rethrown(e) {
    e = e ? 1 : 0;
    (growMemViews(), HEAP8)[this.ptr + 13 >>> 0] = e;
  }
  get_rethrown() {
    return (growMemViews(), HEAP8)[this.ptr + 13 >>> 0] != 0;
  }
  init(e, r) {
    this.set_adjusted_ptr(0);
    this.set_type(e);
    this.set_destructor(r);
  }
  set_adjusted_ptr(e) {
    (growMemViews(), HEAPU32)[this.ptr + 16 >>> 2 >>> 0] = e;
  }
  get_adjusted_ptr() {
    return (growMemViews(), HEAPU32)[this.ptr + 16 >>> 2 >>> 0];
  }
}
var uncaughtExceptionCount = 0;
var __Unwind_RaiseException = e => {
  abort();
};
function ___cxa_throw(e, r, t) {
  r >>>= 0;
  t >>>= 0;
  new ExceptionInfo(e >>>= 0).init(r, t);
  uncaughtExceptionCount++;
  __Unwind_RaiseException(e);
}
function pthreadCreateProxied(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(2, 0, 1, e, r, t, i);
  } else {
    return ___pthread_create_js(e, r, t, i);
  }
}
var _emscripten_has_threading_support = () => !!globalThis.SharedArrayBuffer;
function ___pthread_create_js(e, r, t, i) {
  e >>>= 0;
  r >>>= 0;
  t >>>= 0;
  i >>>= 0;
  if (!_emscripten_has_threading_support()) {
    return 6;
  }
  var n = [];
  var a = 0;
  var s = r ? (growMemViews(), HEAPU32)[r + 40 >>> 2 >>> 0] : 0;
  s = (s = s == 4294967295 ? "#canvas" : UTF8ToString(s).trim()) ? s.split(",") : [];
  var o = {};
  var c = Module.canvas?.id ?? "";
  for (var l of s) {
    var _;
    l = l.trim();
    try {
      if (l == "#canvas") {
        if (!Module.canvas) {
          err(`pthread_create: could not find canvas with ID "${l}" to transfer to thread!`);
          a = 28;
          break;
        }
        l = Module.canvas.id;
      }
      if (GL.offscreenCanvases[l]) {
        _ = GL.offscreenCanvases[l];
        GL.offscreenCanvases[l] = null;
        if (Module.canvas instanceof OffscreenCanvas && l === Module.canvas.id) {
          Module.canvas = null;
        }
      } else if (!ENVIRONMENT_IS_PTHREAD) {
        if (!(u = Module.canvas && Module.canvas.id === l ? Module.canvas : document.querySelector(l))) {
          err(`pthread_create: could not find canvas with ID "${l}" to transfer to thread!`);
          a = 28;
          break;
        }
        if (u.controlTransferredOffscreen) {
          err(`pthread_create: cannot transfer canvas with ID "${l}" to thread, since the current thread does not have control over it!`);
          a = 63;
          break;
        }
        if (!u.transferControlToOffscreen) {
          err(`pthread_create: cannot transfer control of canvas "${l}" to pthread, because current browser does not support OffscreenCanvas!`);
          err("pthread_create: Build with -sOFFSCREEN_FRAMEBUFFER to enable fallback proxying of GL commands from pthread to main thread.");
          return 52;
        }
        if (!u.canvasSharedPtr) {
          u.canvasSharedPtr = _malloc(12);
          (growMemViews(), HEAP32)[u.canvasSharedPtr >>> 2 >>> 0] = u.width;
          (growMemViews(), HEAP32)[u.canvasSharedPtr + 4 >>> 2 >>> 0] = u.height;
          (growMemViews(), HEAPU32)[u.canvasSharedPtr + 8 >>> 2 >>> 0] = 0;
        }
        _ = {
          offscreenCanvas: u.transferControlToOffscreen(),
          canvasSharedPtr: u.canvasSharedPtr,
          id: u.id
        };
        u.controlTransferredOffscreen = true;
      }
      if (_) {
        n.push(_.offscreenCanvas);
        o[_.id] = _;
      }
    } catch (e) {
      err(`pthread_create: failed to transfer control of canvas "${l}" to OffscreenCanvas! Error: ${e}`);
      return 28;
    }
  }
  if (ENVIRONMENT_IS_PTHREAD && (!n.length || a)) {
    return pthreadCreateProxied(e, r, t, i);
  }
  if (a) {
    return a;
  }
  for (var u of Object.values(o)) {
    (growMemViews(), HEAPU32)[u.canvasSharedPtr + 8 >>> 2 >>> 0] = e;
  }
  var m = {
    startRoutine: t,
    pthread_ptr: e,
    arg: i,
    moduleCanvasId: c,
    offscreenCanvases: o,
    transferList: n
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    m.cmd = 5;
    postMessage(m, n);
    return 0;
  } else {
    return spawnThread(m);
  }
}
var __abort_js = () => abort("");
function __emscripten_init_main_thread_js(e) {
  e >>>= 0;
  var r = !ENVIRONMENT_IS_WEB;
  try {
    Atomics.wait((growMemViews(), HEAP32), 0, 0, 0);
    r = true;
  } catch (e) {}
  __emscripten_thread_init(e, !ENVIRONMENT_IS_WORKER, 1, r, 16777216, false);
  PThread.threadInitTLS();
}
var handleException = e => {
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};
var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) {
        if (_pthread_self()) {
          __emscripten_thread_exit(EXITSTATUS);
        }
        return;
      }
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};
var callUserCallback = e => {
  if (!ABORT) {
    try {
      return e();
    } catch (e) {
      handleException(e);
    } finally {
      maybeExit();
    }
  }
};
function __emscripten_thread_mailbox_await(e) {
  e >>>= 0;
  if (!waitAsyncPolyfilled) {
    Atomics.waitAsync((growMemViews(), HEAP32), e >>> 2, e).value.then(checkMailbox);
    var r = e + 112;
    Atomics.store((growMemViews(), HEAP32), r >>> 2, 1);
  }
}
var checkMailbox = () => {
  var e = _pthread_self();
  if (e) {
    callUserCallback(() => {
      __emscripten_thread_mailbox_await(e);
      __emscripten_check_mailbox();
    });
  }
};
function __emscripten_notify_mailbox_postmessage(e, r) {
  if ((e >>>= 0) == (r >>>= 0)) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread: e,
      cmd: 4
    });
  } else {
    var t = PThread.pthreads[e];
    if (!t) {
      return;
    }
    t.postMessage({
      cmd: 4
    });
  }
}
var proxiedJSCallArgs = [];
function __emscripten_receive_on_main_thread_js(e, r, t, i, n, a, s) {
  r >>>= 0;
  t >>>= 0;
  n >>>= 0;
  a >>>= 0;
  s >>>= 0;
  proxiedJSCallArgs.length = 0;
  for (var o = n >>> 3, c = n + i >>> 3; o < c;) {
    var l;
    l = (growMemViews(), HEAP64)[o++ >>> 0] ? (growMemViews(), HEAP64)[o++ >>> 0] : (growMemViews(), HEAPF64)[o++ >>> 0];
    proxiedJSCallArgs.push(l);
  }
  var _ = r ? ASM_CONSTS[r] : proxiedFunctionTable[e];
  PThread.currentProxiedOperationCallerThread = t;
  var u = _(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  if (!a) {
    return u;
  }
  u.then(e => __emscripten_run_js_on_main_thread_done(a, s, e));
}
var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};
function __emscripten_thread_cleanup(e) {
  e >>>= 0;
  if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      cmd: 6,
      thread: e
    });
  } else {
    cleanupThread(e);
  }
}
function __emscripten_thread_set_strongref(e) {
  0;
}
var __emscripten_throw_longjmp = () => {
  throw new EmscriptenSjLj();
};
function __gmtime_js(e, r) {
  e = bigintToI53Checked(e);
  r >>>= 0;
  var t = new Date(e * 1000);
  if (isNaN(t.getTime())) {
    return 1;
  }
  (growMemViews(), HEAP32)[r >>> 2 >>> 0] = t.getUTCSeconds();
  (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0] = t.getUTCMinutes();
  (growMemViews(), HEAP32)[r + 8 >>> 2 >>> 0] = t.getUTCHours();
  (growMemViews(), HEAP32)[r + 12 >>> 2 >>> 0] = t.getUTCDate();
  (growMemViews(), HEAP32)[r + 16 >>> 2 >>> 0] = t.getUTCMonth();
  (growMemViews(), HEAP32)[r + 20 >>> 2 >>> 0] = t.getUTCFullYear() - 1900;
  (growMemViews(), HEAP32)[r + 24 >>> 2 >>> 0] = t.getUTCDay();
  var i = Date.UTC(t.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var n = (t.getTime() - i) / 86400000 | 0;
  (growMemViews(), HEAP32)[r + 28 >>> 2 >>> 0] = n;
  return 0;
}
var isLeapYear = e => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
var ydayFromDate = e => (isLeapYear(e.getFullYear()) ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE)[e.getMonth()] + e.getDate() - 1;
function __localtime_js(e, r) {
  e = bigintToI53Checked(e);
  r >>>= 0;
  var t = new Date(e * 1000);
  if (isNaN(t.getTime())) {
    return 1;
  }
  (growMemViews(), HEAP32)[r >>> 2 >>> 0] = t.getSeconds();
  (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0] = t.getMinutes();
  (growMemViews(), HEAP32)[r + 8 >>> 2 >>> 0] = t.getHours();
  (growMemViews(), HEAP32)[r + 12 >>> 2 >>> 0] = t.getDate();
  (growMemViews(), HEAP32)[r + 16 >>> 2 >>> 0] = t.getMonth();
  (growMemViews(), HEAP32)[r + 20 >>> 2 >>> 0] = t.getFullYear() - 1900;
  (growMemViews(), HEAP32)[r + 24 >>> 2 >>> 0] = t.getDay();
  var i = ydayFromDate(t) | 0;
  (growMemViews(), HEAP32)[r + 28 >>> 2 >>> 0] = i;
  (growMemViews(), HEAP32)[r + 36 >>> 2 >>> 0] = t.getTimezoneOffset() * -60;
  var n = new Date(t.getFullYear(), 0, 1);
  var a = new Date(t.getFullYear(), 6, 1).getTimezoneOffset();
  var s = n.getTimezoneOffset();
  var o = (a != s && t.getTimezoneOffset() == Math.min(s, a)) | 0;
  (growMemViews(), HEAP32)[r + 32 >>> 2 >>> 0] = o;
  return 0;
}
var __mktime_js = function (e) {
  e >>>= 0;
  var r = (() => {
    var r = new Date((growMemViews(), HEAP32)[e + 20 >>> 2 >>> 0] + 1900, (growMemViews(), HEAP32)[e + 16 >>> 2 >>> 0], (growMemViews(), HEAP32)[e + 12 >>> 2 >>> 0], (growMemViews(), HEAP32)[e + 8 >>> 2 >>> 0], (growMemViews(), HEAP32)[e + 4 >>> 2 >>> 0], (growMemViews(), HEAP32)[e >>> 2 >>> 0], 0);
    if (isNaN(r.getTime())) {
      return -1;
    }
    var t = (growMemViews(), HEAP32)[e + 32 >>> 2 >>> 0];
    var i = r.getTimezoneOffset();
    var n = new Date(r.getFullYear(), 0, 1);
    var a = new Date(r.getFullYear(), 6, 1).getTimezoneOffset();
    var s = n.getTimezoneOffset();
    var o = Math.min(s, a);
    if (t < 0) {
      t = Number(a != s && o == i);
    } else if (t > 0 != (o == i)) {
      var c = Math.max(s, a);
      var l = t > 0 ? o : c;
      r.setTime(r.getTime() + (l - i) * 60000);
      if (isNaN(r.getTime())) {
        return -1;
      }
    }
    (growMemViews(), HEAP32)[e + 32 >>> 2 >>> 0] = t;
    (growMemViews(), HEAP32)[e + 24 >>> 2 >>> 0] = r.getDay();
    var _ = ydayFromDate(r) | 0;
    (growMemViews(), HEAP32)[e + 28 >>> 2 >>> 0] = _;
    (growMemViews(), HEAP32)[e >>> 2 >>> 0] = r.getSeconds();
    (growMemViews(), HEAP32)[e + 4 >>> 2 >>> 0] = r.getMinutes();
    (growMemViews(), HEAP32)[e + 8 >>> 2 >>> 0] = r.getHours();
    (growMemViews(), HEAP32)[e + 12 >>> 2 >>> 0] = r.getDate();
    (growMemViews(), HEAP32)[e + 16 >>> 2 >>> 0] = r.getMonth();
    (growMemViews(), HEAP32)[e + 20 >>> 2 >>> 0] = r.getYear();
    return r.getTime() / 1000;
  })();
  return BigInt(r);
};
var stringToUTF8Array = (e, r, t, i) => {
  if (!(i > 0)) {
    return 0;
  }
  var n = t >>>= 0;
  var a = t + i - 1;
  for (var s = 0; s < e.length; ++s) {
    var o = e.codePointAt(s);
    if (o <= 127) {
      if (t >= a) {
        break;
      }
      r[t++ >>> 0] = o;
    } else if (o <= 2047) {
      if (t + 1 >= a) {
        break;
      }
      r[t++ >>> 0] = o >> 6 | 192;
      r[t++ >>> 0] = o & 63 | 128;
    } else if (o <= 65535) {
      if (t + 2 >= a) {
        break;
      }
      r[t++ >>> 0] = o >> 12 | 224;
      r[t++ >>> 0] = o >> 6 & 63 | 128;
      r[t++ >>> 0] = o & 63 | 128;
    } else {
      if (t + 3 >= a) {
        break;
      }
      r[t++ >>> 0] = o >> 18 | 240;
      r[t++ >>> 0] = o >> 12 & 63 | 128;
      r[t++ >>> 0] = o >> 6 & 63 | 128;
      r[t++ >>> 0] = o & 63 | 128;
      s++;
    }
  }
  r[t >>> 0] = 0;
  return t - n;
};
var stringToUTF8 = (e, r, t) => stringToUTF8Array(e, (growMemViews(), HEAPU8), r, t);
var __tzset_js = function (e, r, t, i) {
  e >>>= 0;
  r >>>= 0;
  t >>>= 0;
  i >>>= 0;
  var n = new Date().getFullYear();
  var a = new Date(n, 0, 1);
  var s = new Date(n, 6, 1);
  var o = a.getTimezoneOffset();
  var c = s.getTimezoneOffset();
  var l = Math.max(o, c);
  (growMemViews(), HEAPU32)[e >>> 2 >>> 0] = l * 60;
  (growMemViews(), HEAP32)[r >>> 2 >>> 0] = Number(o != c);
  var _ = e => {
    var r = e >= 0 ? "-" : "+";
    var t = Math.abs(e);
    return `UTC${r}${String(Math.floor(t / 60)).padStart(2, "0")}${String(t % 60).padStart(2, "0")}`;
  };
  var u = _(o);
  var m = _(c);
  if (c < o) {
    stringToUTF8(u, t, 17);
    stringToUTF8(m, i, 17);
  } else {
    stringToUTF8(u, i, 17);
    stringToUTF8(m, t, 17);
  }
};
function __wasmfs_copy_preloaded_file_data(e, r) {
  r >>>= 0;
  return (growMemViews(), HEAPU8).set(wasmFSPreloadedFiles[e].fileData, r >>> 0);
}
var wasmFSPreloadedDirs = [];
var __wasmfs_get_num_preloaded_dirs = () => wasmFSPreloadedDirs.length;
var wasmFSPreloadedFiles = [];
var wasmFSPreloadingFlushed = false;
var __wasmfs_get_num_preloaded_files = () => {
  wasmFSPreloadingFlushed = true;
  return wasmFSPreloadedFiles.length;
};
function __wasmfs_get_preloaded_child_path(e, r) {
  r >>>= 0;
  var t = wasmFSPreloadedDirs[e].childName;
  var i = lengthBytesUTF8(t) + 1;
  stringToUTF8(t, r, i);
}
var __wasmfs_get_preloaded_file_mode = e => wasmFSPreloadedFiles[e].mode;
function __wasmfs_get_preloaded_file_size(e) {
  return wasmFSPreloadedFiles[e].fileData.length;
}
function __wasmfs_get_preloaded_parent_path(e, r) {
  r >>>= 0;
  var t = wasmFSPreloadedDirs[e].parentPath;
  var i = lengthBytesUTF8(t) + 1;
  stringToUTF8(t, r, i);
}
var lengthBytesUTF8 = e => {
  var r = 0;
  for (var t = 0; t < e.length; ++t) {
    var i = e.charCodeAt(t);
    if (i <= 127) {
      r++;
    } else if (i <= 2047) {
      r += 2;
    } else if (i >= 55296 && i <= 57343) {
      r += 4;
      ++t;
    } else {
      r += 3;
    }
  }
  return r;
};
function __wasmfs_get_preloaded_path_name(e, r) {
  r >>>= 0;
  var t = wasmFSPreloadedFiles[e].pathName;
  var i = lengthBytesUTF8(t) + 1;
  stringToUTF8(t, r, i);
}
class HandleAllocator {
  allocated = [undefined];
  freelist = [];
  get(e) {
    return this.allocated[e];
  }
  has(e) {
    return this.allocated[e] !== undefined;
  }
  allocate(e) {
    var r = this.freelist.pop() ?? this.allocated.length;
    this.allocated[r] = e;
    return r;
  }
  free(e) {
    this.allocated[e] = undefined;
    this.freelist.push(e);
  }
}
var wasmfsOPFSAccessHandles = new HandleAllocator();
var wasmfsOPFSProxyFinish = e => {
  _emscripten_proxy_finish(e);
};
async function __wasmfs_opfs_close_access(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i = wasmfsOPFSAccessHandles.get(r);
  try {
    await i.close();
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = e;
  }
  wasmfsOPFSAccessHandles.free(r);
  wasmfsOPFSProxyFinish(e);
}
var wasmfsOPFSBlobs = new HandleAllocator();
var __wasmfs_opfs_close_blob = e => {
  wasmfsOPFSBlobs.free(e);
};
async function __wasmfs_opfs_flush_access(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i = wasmfsOPFSAccessHandles.get(r);
  try {
    await i.flush();
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
var wasmfsOPFSDirectoryHandles = new HandleAllocator();
var __wasmfs_opfs_free_directory = e => {
  wasmfsOPFSDirectoryHandles.free(e);
};
var wasmfsOPFSFileHandles = new HandleAllocator();
var __wasmfs_opfs_free_file = e => {
  wasmfsOPFSFileHandles.free(e);
};
var wasmfsOPFSGetOrCreateFile = async (e, r, t) => {
  let i;
  let n = wasmfsOPFSDirectoryHandles.get(e);
  try {
    i = await n.getFileHandle(r, {
      create: t
    });
  } catch (e) {
    if (e.name === "NotFoundError") {
      return -20;
    } else if (e.name === "TypeMismatchError") {
      return -31;
    } else {
      return -29;
    }
  }
  return wasmfsOPFSFileHandles.allocate(i);
};
var wasmfsOPFSGetOrCreateDir = async (e, r, t) => {
  let i;
  let n = wasmfsOPFSDirectoryHandles.get(e);
  try {
    i = await n.getDirectoryHandle(r, {
      create: t
    });
  } catch (e) {
    if (e.name === "NotFoundError") {
      return -20;
    } else if (e.name === "TypeMismatchError") {
      return -54;
    } else {
      return -29;
    }
  }
  return wasmfsOPFSDirectoryHandles.allocate(i);
};
async function __wasmfs_opfs_get_child(e, r, t, i, n) {
  e >>>= 0;
  i >>>= 0;
  n >>>= 0;
  let a = UTF8ToString(t >>>= 0);
  let s = 1;
  let o = await wasmfsOPFSGetOrCreateFile(r, a, false);
  if (o == -31) {
    s = 2;
    o = await wasmfsOPFSGetOrCreateDir(r, a, false);
  }
  (growMemViews(), HEAP32)[i >>> 2 >>> 0] = s;
  (growMemViews(), HEAP32)[n >>> 2 >>> 0] = o;
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_get_entries(e, r, t, i) {
  e >>>= 0;
  t >>>= 0;
  i >>>= 0;
  let n = wasmfsOPFSDirectoryHandles.get(r);
  try {
    let e = n.entries();
    for (let r; r = await e.next(), !r.done;) {
      let [e, i] = r.value;
      let n = stackSave();
      let a = stringToUTF8OnStack(e);
      let s = i.kind == "file" ? 1 : 2;
      __wasmfs_opfs_record_entry(t, a, s);
      stackRestore(n);
    }
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[i >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_get_size_access(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i;
  let n = wasmfsOPFSAccessHandles.get(r);
  try {
    i = await n.getSize();
  } catch {
    i = -29;
  }
  (growMemViews(), HEAP64)[t >>> 3 >>> 0] = BigInt(i);
  wasmfsOPFSProxyFinish(e);
}
var __wasmfs_opfs_get_size_blob = function (e) {
  var r = wasmfsOPFSBlobs.get(e).size;
  return BigInt(r);
};
async function __wasmfs_opfs_get_size_file(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i;
  let n = wasmfsOPFSFileHandles.get(r);
  try {
    i = (await n.getFile()).size;
  } catch {
    i = -29;
  }
  (growMemViews(), HEAP64)[t >>> 3 >>> 0] = BigInt(i);
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_init_root_directory(e) {
  e >>>= 0;
  if (wasmfsOPFSDirectoryHandles.allocated.length == 1) {
    let e = await navigator.storage.getDirectory();
    wasmfsOPFSDirectoryHandles.allocated.push(e);
  }
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_insert_directory(e, r, t, i) {
  e >>>= 0;
  i >>>= 0;
  let n = UTF8ToString(t >>>= 0);
  let a = await wasmfsOPFSGetOrCreateDir(r, n, true);
  (growMemViews(), HEAP32)[i >>> 2 >>> 0] = a;
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_insert_file(e, r, t, i) {
  e >>>= 0;
  i >>>= 0;
  let n = UTF8ToString(t >>>= 0);
  let a = await wasmfsOPFSGetOrCreateFile(r, n, true);
  (growMemViews(), HEAP32)[i >>> 2 >>> 0] = a;
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_move_file(e, r, t, i, n) {
  e >>>= 0;
  n >>>= 0;
  let a = UTF8ToString(i >>>= 0);
  let s = wasmfsOPFSFileHandles.get(r);
  let o = wasmfsOPFSDirectoryHandles.get(t);
  try {
    await s.move(o, a);
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[n >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_open_access(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i;
  let n = wasmfsOPFSFileHandles.get(r);
  try {
    let e;
    e = FileSystemFileHandle.prototype.createSyncAccessHandle.length == 0 ? await n.createSyncAccessHandle() : await n.createSyncAccessHandle({
      mode: "in-place"
    });
    i = wasmfsOPFSAccessHandles.allocate(e);
  } catch (e) {
    i = e.name === "InvalidStateError" || e.name === "NoModificationAllowedError" ? -2 : -29;
  }
  (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_open_blob(e, r, t) {
  e >>>= 0;
  t >>>= 0;
  let i;
  let n = wasmfsOPFSFileHandles.get(r);
  try {
    let e = await n.getFile();
    i = wasmfsOPFSBlobs.allocate(e);
  } catch (e) {
    i = e.name === "NotAllowedError" ? -2 : -29;
  }
  (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
  wasmfsOPFSProxyFinish(e);
}
function __wasmfs_opfs_read_access(e, r, t, i) {
  r >>>= 0;
  i = bigintToI53Checked(i);
  let n = wasmfsOPFSAccessHandles.get(e);
  let a = (growMemViews(), HEAPU8).subarray(r >>> 0, r + t >>> 0);
  try {
    return n.read(a, {
      at: i
    });
  } catch (e) {
    if (e.name == "TypeError") {
      return -28;
    } else {
      return -29;
    }
  }
}
async function __wasmfs_opfs_read_blob(e, r, t, i, n, a) {
  e >>>= 0;
  t >>>= 0;
  n = bigintToI53Checked(n);
  a >>>= 0;
  let s = wasmfsOPFSBlobs.get(r).slice(n, n + i);
  let o = 0;
  try {
    let e = await s.arrayBuffer();
    let r = new Uint8Array(e);
    (growMemViews(), HEAPU8).set(r, t >>> 0);
    o += r.length;
  } catch (e) {
    o = e instanceof RangeError ? -21 : -29;
  }
  (growMemViews(), HEAP32)[a >>> 2 >>> 0] = o;
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_remove_child(e, r, t, i) {
  e >>>= 0;
  i >>>= 0;
  let n = UTF8ToString(t >>>= 0);
  let a = wasmfsOPFSDirectoryHandles.get(r);
  try {
    await a.removeEntry(n);
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[i >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_set_size_access(e, r, t, i) {
  e >>>= 0;
  t = bigintToI53Checked(t);
  i >>>= 0;
  let n = wasmfsOPFSAccessHandles.get(r);
  try {
    await n.truncate(t);
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[i >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
async function __wasmfs_opfs_set_size_file(e, r, t, i) {
  e >>>= 0;
  t = bigintToI53Checked(t);
  i >>>= 0;
  let n = wasmfsOPFSFileHandles.get(r);
  try {
    let e = await n.createWritable({
      keepExistingData: true
    });
    await e.truncate(t);
    await e.close();
  } catch {
    let e = -29;
    (growMemViews(), HEAP32)[i >>> 2 >>> 0] = e;
  }
  wasmfsOPFSProxyFinish(e);
}
function __wasmfs_opfs_write_access(e, r, t, i) {
  r >>>= 0;
  i = bigintToI53Checked(i);
  let n = wasmfsOPFSAccessHandles.get(e);
  let a = (growMemViews(), HEAPU8).subarray(r >>> 0, r + t >>> 0);
  try {
    return n.write(a, {
      at: i
    });
  } catch (e) {
    if (e.name == "TypeError") {
      return -28;
    } else {
      return -29;
    }
  }
}
var HEAP16;
var HEAPF32;
var FS_stdin_getChar_buffer = [];
var intArrayFromString = (e, r, t) => {
  var i = t > 0 ? t : lengthBytesUTF8(e) + 1;
  var n = new Array(i);
  var a = stringToUTF8Array(e, n, 0, n.length);
  if (r) {
    n.length = a;
  }
  return n;
};
var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var e = null;
    if (globalThis.window?.prompt && (e = window.prompt("Input: ")) !== null) {
      e += "\n";
    }
    if (!e) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(e, true);
  }
  return FS_stdin_getChar_buffer.shift();
};
var __wasmfs_stdin_get_char = () => {
  var e = FS_stdin_getChar();
  if (typeof e == "number") {
    return e;
  } else {
    return -1;
  }
};
var __wasmfs_thread_utils_heartbeat = function (e) {
  e >>>= 0;
  var r = setInterval(() => {
    if (ABORT) {
      clearInterval(r);
    } else {
      _emscripten_proxy_execute_queue(e);
    }
  }, 50);
};
var _emscripten_set_main_loop_timing = (e, r) => {
  MainLoop.timingMode = e;
  MainLoop.timingValue = r;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.scheduler) {
    runtimeKeepalivePush();
  }
  if (e == 0) {
    MainLoop.scheduler = function () {
      var e = Math.max(0, MainLoop.tickStartTime + r - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, e);
    };
  } else if (e == 1) {
    MainLoop.scheduler = function () {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
  } else {
    if (!MainLoop.setImmediate) {
      if (globalThis.scheduler) {
        MainLoop.setImmediate = scheduler.postTask.bind(scheduler);
      } else {
        var t = [];
        var i = "setimmediate";
        addEventListener("message", e => {
          if (e.data === i) {
            e.stopPropagation();
            t.shift()();
          }
        }, true);
        MainLoop.setImmediate = e => {
          t.push(e);
          if (ENVIRONMENT_IS_WORKER) {
            postMessage(i);
          } else {
            postMessage(i, "*");
          }
        };
      }
    }
    MainLoop.scheduler = function () {
      MainLoop.setImmediate(MainLoop.runner);
    };
  }
  return 0;
};
var _emscripten_get_now = () => performance.timeOrigin + performance.now();
var setMainLoop = (e, r, t, i, n) => {
  MainLoop.func = e;
  MainLoop.arg = i;
  var a = MainLoop.currentlyRunningMainloop;
  function s() {
    return !(a < MainLoop.currentlyRunningMainloop) || (maybeExit(), false);
  }
  MainLoop.runner = function () {
    if (!ABORT) {
      if (MainLoop.queue.length > 0) {
        Date.now();
        var r = MainLoop.queue.shift();
        r.func(r.arg);
        if (MainLoop.remainingBlockers) {
          var t = MainLoop.remainingBlockers;
          var i = t % 1 == 0 ? t - 1 : Math.floor(t);
          if (r.counted) {
            MainLoop.remainingBlockers = i;
          } else {
            i += 0.5;
            MainLoop.remainingBlockers = (t * 8 + i) / 9;
          }
        }
        MainLoop.updateStatus();
        if (!s()) {
          return;
        }
        setTimeout(MainLoop.runner, 0);
      } else if (s()) {
        MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
        if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
          MainLoop.scheduler();
        } else {
          if (MainLoop.timingMode == 0) {
            MainLoop.tickStartTime = _emscripten_get_now();
          }
          MainLoop.runIter(e);
          if (s()) {
            MainLoop.scheduler();
          }
        }
      }
    }
  };
  if (!n) {
    if (r > 0) {
      _emscripten_set_main_loop_timing(0, 1000 / r);
    } else {
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (t) {
    throw "unwind";
  }
};
var MainLoop = {
  func: null,
  scheduler: null,
  currentlyRunningMainloop: 0,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    if (MainLoop.scheduler) {
      MainLoop.scheduler = null;
      MainLoop.currentlyRunningMainloop++;
      runtimeKeepalivePop();
    }
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var e = MainLoop.timingMode;
    var r = MainLoop.timingValue;
    var t = MainLoop.func;
    MainLoop.func = null;
    setMainLoop(t, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(e, r);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module.setStatus) {
      var e = Module.statusMessage || "Please wait...";
      var r = MainLoop.remainingBlockers ?? 0;
      var t = MainLoop.expectedBlockers ?? 0;
      if (r) {
        if (r < t) {
          Module.setStatus("{message} ({expected - remaining}/{expected})");
        } else {
          Module.setStatus(e);
        }
      } else {
        Module.setStatus("");
      }
    }
  },
  init() {},
  runIter(e) {
    if (!ABORT) {
      for (var r of MainLoop.preMainLoop) {
        if (r() === false) {
          return;
        }
      }
      callUserCallback(e);
      for (var t of MainLoop.postMainLoop) {
        t();
      }
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(e) {
    var r = Date.now();
    if (MainLoop.nextRAF) {
      while (r + 2 >= MainLoop.nextRAF) {
        MainLoop.nextRAF += 1000 / 60;
      }
    } else {
      MainLoop.nextRAF = r + 1000 / 60;
    }
    var t = Math.max(MainLoop.nextRAF - r, 0);
    setTimeout(e, t);
  },
  requestAnimationFrame(e) {
    if (globalThis.requestAnimationFrame) {
      requestAnimationFrame(e);
    } else {
      MainLoop.fakeRequestAnimationFrame(e);
    }
  }
};
var AL = {
  QUEUE_INTERVAL: 25,
  QUEUE_LOOKAHEAD: 0.1,
  DEVICE_NAME: "Emscripten OpenAL",
  CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
  ALC_EXTENSIONS: {
    ALC_EXT_capture: true,
    ALC_SOFT_pause_device: true,
    ALC_SOFT_HRTF: true
  },
  AL_EXTENSIONS: {
    AL_EXT_float32: true,
    AL_SOFT_loop_points: true,
    AL_SOFT_source_length: true,
    AL_EXT_source_distance_model: true,
    AL_SOFT_source_spatialize: true
  },
  _alcErr: 0,
  alcErr: 0,
  deviceRefCounts: {},
  alcStringCache: {},
  paused: false,
  stringCache: {},
  contexts: {},
  currentCtx: null,
  buffers: {
    0: {
      id: 0,
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0
    }
  },
  paramArray: [],
  _nextId: 1,
  newId: () => AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++,
  freeIds: [],
  scheduleContextAudio: e => {
    if (MainLoop.timingMode !== 1 || document.visibilityState == "visible") {
      for (var r in e.sources) {
        AL.scheduleSourceAudio(e.sources[r]);
      }
    }
  },
  scheduleSourceAudio: (e, r) => {
    if ((MainLoop.timingMode !== 1 || document.visibilityState == "visible") && e.state === 4114) {
      var t = AL.updateSourceTime(e);
      var i = e.bufStartTime;
      var n = e.bufOffset;
      var a = e.bufsProcessed;
      for (var s = 0; s < e.audioQueue.length; s++) {
        i = (_ = e.audioQueue[s])._startTime + _._duration;
        n = 0;
        a += _._skipCount + 1;
      }
      r ||= AL.QUEUE_LOOKAHEAD;
      for (var o = t + r, c = 0; i < o;) {
        if (a >= e.bufQueue.length) {
          if (!e.looping) {
            break;
          }
          a %= e.bufQueue.length;
        }
        var l = e.bufQueue[a % e.bufQueue.length];
        if (l.length) {
          var _;
          (_ = e.context.audioCtx.createBufferSource()).buffer = l.audioBuf;
          _.playbackRate.value = e.playbackRate;
          if (l.audioBuf._loopStart || l.audioBuf._loopEnd) {
            _.loopStart = l.audioBuf._loopStart;
            _.loopEnd = l.audioBuf._loopEnd;
          }
          var u = 0;
          if (e.type === 4136 && e.looping) {
            u = Number.POSITIVE_INFINITY;
            _.loop = true;
            if (l.audioBuf._loopStart) {
              _.loopStart = l.audioBuf._loopStart;
            }
            if (l.audioBuf._loopEnd) {
              _.loopEnd = l.audioBuf._loopEnd;
            }
          } else {
            u = (l.audioBuf.duration - n) / e.playbackRate;
          }
          _._startOffset = n;
          _._duration = u;
          _._skipCount = c;
          c = 0;
          _.connect(e.gain);
          if (_.start !== undefined) {
            i = Math.max(i, e.context.audioCtx.currentTime);
            _.start(i, n);
          } else if (_.noteOn !== undefined) {
            i = Math.max(i, e.context.audioCtx.currentTime);
            _.noteOn(i);
          }
          _._startTime = i;
          e.audioQueue.push(_);
          i += u;
        } else if (++c === e.bufQueue.length) {
          break;
        }
        n = 0;
        a++;
      }
    }
  },
  updateSourceTime: e => {
    var r = e.context.audioCtx.currentTime;
    if (e.state !== 4114) {
      return r;
    }
    if (!isFinite(e.bufStartTime)) {
      e.bufStartTime = r - e.bufOffset / e.playbackRate;
      e.bufOffset = 0;
    }
    var t = 0;
    for (; e.audioQueue.length;) {
      var i = e.audioQueue[0];
      e.bufsProcessed += i._skipCount;
      if (r < (t = i._startTime + i._duration)) {
        break;
      }
      e.audioQueue.shift();
      e.bufStartTime = t;
      e.bufOffset = 0;
      e.bufsProcessed++;
    }
    if (e.bufsProcessed >= e.bufQueue.length && !e.looping) {
      AL.setSourceState(e, 4116);
    } else if (e.type === 4136 && e.looping) {
      if ((l = e.bufQueue[0]).length) {
        var n = (r - e.bufStartTime) * e.playbackRate;
        var a = l.audioBuf._loopStart ?? 0;
        var s = l.audioBuf._loopEnd ?? l.audioBuf.duration;
        if (s <= a) {
          s = l.audioBuf.duration;
        }
        e.bufOffset = n < s ? n : a + (n - a) % (s - a);
      } else {
        e.bufOffset = 0;
      }
    } else if (e.audioQueue[0]) {
      e.bufOffset = (r - e.audioQueue[0]._startTime) * e.playbackRate;
    } else {
      if (e.type !== 4136 && e.looping) {
        var o = AL.sourceDuration(e) / e.playbackRate;
        if (o > 0) {
          e.bufStartTime += Math.floor((r - e.bufStartTime) / o) * o;
        }
      }
      for (var c = 0; c < e.bufQueue.length; c++) {
        if (e.bufsProcessed >= e.bufQueue.length) {
          if (!e.looping) {
            AL.setSourceState(e, 4116);
            break;
          }
          e.bufsProcessed %= e.bufQueue.length;
        }
        var l;
        if ((l = e.bufQueue[e.bufsProcessed]).length > 0) {
          if (r < (t = e.bufStartTime + l.audioBuf.duration / e.playbackRate)) {
            e.bufOffset = (r - e.bufStartTime) * e.playbackRate;
            break;
          }
          e.bufStartTime = t;
        }
        e.bufOffset = 0;
        e.bufsProcessed++;
      }
    }
    return r;
  },
  cancelPendingSourceAudio: e => {
    AL.updateSourceTime(e);
    for (var r = 1; r < e.audioQueue.length; r++) {
      e.audioQueue[r].stop();
    }
    if (e.audioQueue.length > 1) {
      e.audioQueue.length = 1;
    }
  },
  stopSourceAudio: e => {
    for (var r of e.audioQueue) {
      r.stop();
    }
    e.audioQueue.length = 0;
  },
  setSourceState: (e, r) => {
    if (r === 4114) {
      if (e.state === 4114 || e.state == 4116) {
        e.bufsProcessed = 0;
        e.bufOffset = 0;
      }
      AL.stopSourceAudio(e);
      e.state = 4114;
      e.bufStartTime = Number.NEGATIVE_INFINITY;
      AL.scheduleSourceAudio(e);
    } else if (r === 4115) {
      if (e.state === 4114) {
        AL.updateSourceTime(e);
        AL.stopSourceAudio(e);
        e.state = 4115;
      }
    } else if (r === 4116) {
      if (e.state !== 4113) {
        e.state = 4116;
        e.bufsProcessed = e.bufQueue.length;
        e.bufStartTime = Number.NEGATIVE_INFINITY;
        e.bufOffset = 0;
        AL.stopSourceAudio(e);
      }
    } else if (r === 4113 && e.state !== 4113) {
      e.state = 4113;
      e.bufsProcessed = 0;
      e.bufStartTime = Number.NEGATIVE_INFINITY;
      e.bufOffset = 0;
      AL.stopSourceAudio(e);
    }
  },
  initSourcePanner: e => {
    if (e.type !== 4144) {
      var r = AL.buffers[0];
      for (var t of e.bufQueue) {
        if (t.id) {
          r = t;
          break;
        }
      }
      if (e.spatialize === 1 || e.spatialize === 2 && r.channels === 1) {
        if (e.panner) {
          return;
        }
        e.panner = e.context.audioCtx.createPanner();
        AL.updateSourceGlobal(e);
        AL.updateSourceSpace(e);
        e.panner.connect(e.context.gain);
        e.gain.disconnect();
        e.gain.connect(e.panner);
      } else {
        if (!e.panner) {
          return;
        }
        e.panner.disconnect();
        e.gain.disconnect();
        e.gain.connect(e.context.gain);
        e.panner = null;
      }
    }
  },
  updateContextGlobal: e => {
    for (var r in e.sources) {
      AL.updateSourceGlobal(e.sources[r]);
    }
  },
  updateSourceGlobal: e => {
    var r = e.panner;
    if (r) {
      r.refDistance = e.refDistance;
      r.maxDistance = e.maxDistance;
      r.rolloffFactor = e.rolloffFactor;
      r.panningModel = e.context.hrtf ? "HRTF" : "equalpower";
      switch (e.context.sourceDistanceModel ? e.distanceModel : e.context.distanceModel) {
        case 0:
          r.distanceModel = "inverse";
          r.refDistance = 3.40282e+38;
          break;
        case 53249:
        case 53250:
          r.distanceModel = "inverse";
          break;
        case 53251:
        case 53252:
          r.distanceModel = "linear";
          break;
        case 53253:
        case 53254:
          r.distanceModel = "exponential";
      }
    }
  },
  updateListenerSpace: e => {
    var r = e.audioCtx.listener;
    if (r.positionX) {
      r.positionX.value = e.listener.position[0];
      r.positionY.value = e.listener.position[1];
      r.positionZ.value = e.listener.position[2];
    } else {
      r.setPosition(e.listener.position[0], e.listener.position[1], e.listener.position[2]);
    }
    if (r.forwardX) {
      r.forwardX.value = e.listener.direction[0];
      r.forwardY.value = e.listener.direction[1];
      r.forwardZ.value = e.listener.direction[2];
      r.upX.value = e.listener.up[0];
      r.upY.value = e.listener.up[1];
      r.upZ.value = e.listener.up[2];
    } else {
      r.setOrientation(e.listener.direction[0], e.listener.direction[1], e.listener.direction[2], e.listener.up[0], e.listener.up[1], e.listener.up[2]);
    }
    for (var t in e.sources) {
      AL.updateSourceSpace(e.sources[t]);
    }
  },
  updateSourceSpace: e => {
    if (e.panner) {
      var r = e.panner;
      var t = e.position[0];
      var i = e.position[1];
      var n = e.position[2];
      var a = e.direction[0];
      var s = e.direction[1];
      var o = e.direction[2];
      var c = e.context.listener;
      var l = c.position[0];
      var _ = c.position[1];
      var u = c.position[2];
      if (e.relative) {
        var m = -c.direction[0];
        var f = -c.direction[1];
        var d = -c.direction[2];
        var g = c.up[0];
        var p = c.up[1];
        var v = c.up[2];
        var w = (e, r, t) => {
          var i = Math.sqrt(e * e + r * r + t * t);
          if (i < Number.EPSILON) {
            return 0;
          } else {
            return 1 / i;
          }
        };
        var E = w(m, f, d);
        m *= E;
        f *= E;
        d *= E;
        var x = (p *= E = w(g, p, v)) * d - (v *= E) * f;
        var h = v * m - (g *= E) * d;
        var b = g * f - p * m;
        var A = a;
        var L = s;
        var y = o;
        a = A * (x *= E = w(x, h, b)) + L * (g = f * (b *= E) - d * (h *= E)) + y * m;
        s = A * h + L * (p = d * x - m * b) + y * f;
        o = A * b + L * (v = m * h - f * x) + y * d;
        t = (A = t) * x + (L = i) * g + (y = n) * m;
        i = A * h + L * p + y * f;
        n = A * b + L * v + y * d;
        t += l;
        i += _;
        n += u;
      }
      if (r.positionX) {
        if (t != r.positionX.value) {
          r.positionX.value = t;
        }
        if (i != r.positionY.value) {
          r.positionY.value = i;
        }
        if (n != r.positionZ.value) {
          r.positionZ.value = n;
        }
      } else {
        r.setPosition(t, i, n);
      }
      if (r.orientationX) {
        if (a != r.orientationX.value) {
          r.orientationX.value = a;
        }
        if (s != r.orientationY.value) {
          r.orientationY.value = s;
        }
        if (o != r.orientationZ.value) {
          r.orientationZ.value = o;
        }
      } else {
        r.setOrientation(a, s, o);
      }
      var T = e.dopplerShift;
      var G = e.velocity[0];
      var C = e.velocity[1];
      var M = e.velocity[2];
      var P = c.velocity[0];
      var S = c.velocity[1];
      var k = c.velocity[2];
      if (t === l && i === _ && n === u || G === P && C === S && M === k) {
        e.dopplerShift = 1;
      } else {
        var V = e.context.speedOfSound;
        var I = e.context.dopplerFactor;
        var B = l - t;
        var H = _ - i;
        var F = u - n;
        var D = Math.sqrt(B * B + H * H + F * F);
        var R = (B * P + H * S + F * k) / D;
        var N = (B * G + H * C + F * M) / D;
        R = Math.min(R, V / I);
        N = Math.min(N, V / I);
        e.dopplerShift = (V - I * R) / (V - I * N);
      }
      if (e.dopplerShift !== T) {
        AL.updateSourceRate(e);
      }
    }
  },
  updateSourceRate: e => {
    if (e.state === 4114) {
      AL.cancelPendingSourceAudio(e);
      var r;
      var t = e.audioQueue[0];
      if (!t) {
        return;
      }
      r = e.type === 4136 && e.looping ? Number.POSITIVE_INFINITY : (t.buffer.duration - t._startOffset) / e.playbackRate;
      t._duration = r;
      t.playbackRate.value = e.playbackRate;
      AL.scheduleSourceAudio(e);
    }
  },
  sourceDuration: e => {
    var r = 0;
    for (var t of e.bufQueue) {
      r += t.audioBuf?.duration ?? 0;
    }
    return r;
  },
  sourceTell: e => {
    AL.updateSourceTime(e);
    var r = 0;
    for (var t = 0; t < e.bufsProcessed; t++) {
      r += e.bufQueue[t].audioBuf?.duration ?? 0;
    }
    return r += e.bufOffset;
  },
  sourceSeek: (e, r) => {
    var t = e.state == 4114;
    if (t) {
      AL.setSourceState(e, 4113);
    }
    e.bufsProcessed = 0;
    for (var i of e.bufQueue) {
      var n = i.audioBuf?.duration ?? 0;
      if (r < n) {
        break;
      }
      r -= n;
      e.bufsProcessed++;
    }
    e.bufOffset = r;
    if (t) {
      AL.setSourceState(e, 4114);
    }
  },
  getGlobalParam: (e, r) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (r) {
      case 49152:
        return AL.currentCtx.dopplerFactor;
      case 49155:
        return AL.currentCtx.speedOfSound;
      case 53248:
        return AL.currentCtx.distanceModel;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setGlobalParam: (e, r, t) => {
    if (AL.currentCtx) {
      switch (r) {
        case 49152:
          if (!Number.isFinite(t) || t < 0) {
            AL.currentCtx.err = 40963;
            return;
          }
          AL.currentCtx.dopplerFactor = t;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 49155:
          if (!Number.isFinite(t) || t <= 0) {
            AL.currentCtx.err = 40963;
            return;
          }
          AL.currentCtx.speedOfSound = t;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 53248:
          switch (t) {
            case 0:
            case 53249:
            case 53250:
            case 53251:
            case 53252:
            case 53253:
            case 53254:
              AL.currentCtx.distanceModel = t;
              AL.updateContextGlobal(AL.currentCtx);
              break;
            default:
              AL.currentCtx.err = 40963;
              return;
          }
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
      }
    }
  },
  getListenerParam: (e, r) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (r) {
      case 4100:
        return AL.currentCtx.listener.position;
      case 4102:
        return AL.currentCtx.listener.velocity;
      case 4111:
        return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);
      case 4106:
        return AL.currentCtx.gain.gain.value;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setListenerParam: (e, r, t) => {
    if (AL.currentCtx) {
      if (t !== null) {
        var i = AL.currentCtx.listener;
        switch (r) {
          case 4100:
            if (!Number.isFinite(t[0]) || !Number.isFinite(t[1]) || !Number.isFinite(t[2])) {
              AL.currentCtx.err = 40963;
              return;
            }
            i.position[0] = t[0];
            i.position[1] = t[1];
            i.position[2] = t[2];
            AL.updateListenerSpace(AL.currentCtx);
            break;
          case 4102:
            if (!Number.isFinite(t[0]) || !Number.isFinite(t[1]) || !Number.isFinite(t[2])) {
              AL.currentCtx.err = 40963;
              return;
            }
            i.velocity[0] = t[0];
            i.velocity[1] = t[1];
            i.velocity[2] = t[2];
            AL.updateListenerSpace(AL.currentCtx);
            break;
          case 4106:
            if (!Number.isFinite(t) || t < 0) {
              AL.currentCtx.err = 40963;
              return;
            }
            AL.currentCtx.gain.gain.value = t;
            break;
          case 4111:
            if (!Number.isFinite(t[0]) || !Number.isFinite(t[1]) || !Number.isFinite(t[2]) || !Number.isFinite(t[3]) || !Number.isFinite(t[4]) || !Number.isFinite(t[5])) {
              AL.currentCtx.err = 40963;
              return;
            }
            i.direction[0] = t[0];
            i.direction[1] = t[1];
            i.direction[2] = t[2];
            i.up[0] = t[3];
            i.up[1] = t[4];
            i.up[2] = t[5];
            AL.updateListenerSpace(AL.currentCtx);
            break;
          default:
            AL.currentCtx.err = 40962;
            return;
        }
      } else {
        AL.currentCtx.err = 40962;
      }
    }
  },
  getBufferParam: (e, r, t) => {
    if (AL.currentCtx) {
      var i = AL.buffers[r];
      if (i && r) {
        switch (t) {
          case 8193:
            return i.frequency;
          case 8194:
            return i.bytesPerSample * 8;
          case 8195:
            return i.channels;
          case 8196:
            return i.length * i.bytesPerSample * i.channels;
          case 8213:
            if (i.length) {
              return [(i.audioBuf._loopStart ?? 0) * i.frequency, (i.audioBuf._loopEnd ?? i.length) * i.frequency];
            } else {
              return [0, 0];
            }
          default:
            AL.currentCtx.err = 40962;
            return null;
        }
      } else {
        AL.currentCtx.err = 40961;
      }
    }
  },
  setBufferParam: (e, r, t, i) => {
    if (AL.currentCtx) {
      var n = AL.buffers[r];
      if (n && r) {
        if (i !== null) {
          switch (t) {
            case 8196:
              if (i) {
                AL.currentCtx.err = 40963;
                return;
              }
              break;
            case 8213:
              if (i[0] < 0 || i[0] > n.length || i[1] < 0 || i[1] > n.Length || i[0] >= i[1]) {
                AL.currentCtx.err = 40963;
                return;
              }
              if (n.refCount > 0) {
                AL.currentCtx.err = 40964;
                return;
              }
              if (n.audioBuf) {
                n.audioBuf._loopStart = i[0] / n.frequency;
                n.audioBuf._loopEnd = i[1] / n.frequency;
              }
              break;
            default:
              AL.currentCtx.err = 40962;
              return;
          }
        } else {
          AL.currentCtx.err = 40962;
        }
      } else {
        AL.currentCtx.err = 40961;
      }
    }
  },
  getSourceParam: (e, r, t) => {
    if (!AL.currentCtx) {
      return null;
    }
    var i = AL.currentCtx.sources[r];
    if (!i) {
      AL.currentCtx.err = 40961;
      return null;
    }
    switch (t) {
      case 514:
        return i.relative;
      case 4097:
        return i.coneInnerAngle;
      case 4098:
        return i.coneOuterAngle;
      case 4099:
        return i.pitch;
      case 4100:
        return i.position;
      case 4101:
        return i.direction;
      case 4102:
        return i.velocity;
      case 4103:
        return i.looping;
      case 4105:
        if (i.type === 4136) {
          return i.bufQueue[0].id;
        } else {
          return 0;
        }
      case 4106:
        return i.gain.gain.value;
      case 4109:
        return i.minGain;
      case 4110:
        return i.maxGain;
      case 4112:
        return i.state;
      case 4117:
        if (i.bufQueue.length !== 1 || i.bufQueue[0].id) {
          return i.bufQueue.length;
        } else {
          return 0;
        }
      case 4118:
        if (i.bufQueue.length === 1 && !i.bufQueue[0].id || i.looping) {
          return 0;
        } else {
          return i.bufsProcessed;
        }
      case 4128:
        return i.refDistance;
      case 4129:
        return i.rolloffFactor;
      case 4130:
        return i.coneOuterGain;
      case 4131:
        return i.maxDistance;
      case 4132:
        return AL.sourceTell(i);
      case 4133:
        if ((n = AL.sourceTell(i)) > 0) {
          n *= i.bufQueue[0].frequency;
        }
        return n;
      case 4134:
        var n;
        if ((n = AL.sourceTell(i)) > 0) {
          n *= i.bufQueue[0].frequency * i.bufQueue[0].bytesPerSample;
        }
        return n;
      case 4135:
        return i.type;
      case 4628:
        return i.spatialize;
      case 8201:
        var a = 0;
        var s = 0;
        for (var o of i.bufQueue) {
          a += o.length;
          if (o.id) {
            s = o.bytesPerSample * o.channels;
          }
        }
        return a * s;
      case 8202:
        a = 0;
        for (var o of i.bufQueue) {
          a += o.length;
        }
        return a;
      case 8203:
        return AL.sourceDuration(i);
      case 53248:
        return i.distanceModel;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setSourceParam: (e, r, t, i) => {
    if (AL.currentCtx) {
      var n = AL.currentCtx.sources[r];
      if (n) {
        if (i !== null) {
          switch (t) {
            case 514:
              if (i === 1) {
                n.relative = true;
                AL.updateSourceSpace(n);
              } else {
                if (i !== 0) {
                  AL.currentCtx.err = 40963;
                  return;
                }
                n.relative = false;
                AL.updateSourceSpace(n);
              }
              break;
            case 4097:
              if (!Number.isFinite(i)) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.coneInnerAngle = i;
              if (n.panner) {
                n.panner.coneInnerAngle = i % 360;
              }
              break;
            case 4098:
              if (!Number.isFinite(i)) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.coneOuterAngle = i;
              if (n.panner) {
                n.panner.coneOuterAngle = i % 360;
              }
              break;
            case 4099:
              if (!Number.isFinite(i) || i <= 0) {
                AL.currentCtx.err = 40963;
                return;
              }
              if (n.pitch === i) {
                break;
              }
              n.pitch = i;
              AL.updateSourceRate(n);
              break;
            case 4100:
              if (!Number.isFinite(i[0]) || !Number.isFinite(i[1]) || !Number.isFinite(i[2])) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.position[0] = i[0];
              n.position[1] = i[1];
              n.position[2] = i[2];
              AL.updateSourceSpace(n);
              break;
            case 4101:
              if (!Number.isFinite(i[0]) || !Number.isFinite(i[1]) || !Number.isFinite(i[2])) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.direction[0] = i[0];
              n.direction[1] = i[1];
              n.direction[2] = i[2];
              AL.updateSourceSpace(n);
              break;
            case 4102:
              if (!Number.isFinite(i[0]) || !Number.isFinite(i[1]) || !Number.isFinite(i[2])) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.velocity[0] = i[0];
              n.velocity[1] = i[1];
              n.velocity[2] = i[2];
              AL.updateSourceSpace(n);
              break;
            case 4103:
              if (i === 1) {
                n.looping = true;
                AL.updateSourceTime(n);
                if (n.type === 4136 && n.audioQueue.length > 0) {
                  (a = n.audioQueue[0]).loop = true;
                  a._duration = Number.POSITIVE_INFINITY;
                }
              } else {
                if (i !== 0) {
                  AL.currentCtx.err = 40963;
                  return;
                }
                n.looping = false;
                var a;
                var s = AL.updateSourceTime(n);
                if (n.type === 4136 && n.audioQueue.length > 0) {
                  (a = n.audioQueue[0]).loop = false;
                  a._duration = n.bufQueue[0].audioBuf.duration / n.playbackRate;
                  a._startTime = s - n.bufOffset / n.playbackRate;
                }
              }
              break;
            case 4105:
              if (n.state === 4114 || n.state === 4115) {
                AL.currentCtx.err = 40964;
                return;
              }
              if (!(l = AL.buffers[i])) {
                AL.currentCtx.err = 40963;
                return;
              }
              for (var o of n.bufQueue) {
                o.refCount--;
              }
              n.bufQueue = [l];
              n.bufsProcessed = 0;
              if (i) {
                l.refCount++;
                n.type = 4136;
              } else {
                n.type = 4144;
              }
              AL.initSourcePanner(n);
              AL.scheduleSourceAudio(n);
              break;
            case 4106:
              if (!Number.isFinite(i) || i < 0) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.gain.gain.value = i;
              break;
            case 4109:
              if (!Number.isFinite(i) || i < 0 || i > Math.min(n.maxGain, 1)) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.minGain = i;
              break;
            case 4110:
              if (!Number.isFinite(i) || i < Math.max(0, n.minGain) || i > 1) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.maxGain = i;
              break;
            case 4128:
              if (!Number.isFinite(i) || i < 0) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.refDistance = i;
              if (n.panner) {
                n.panner.refDistance = i;
              }
              break;
            case 4129:
              if (!Number.isFinite(i) || i < 0) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.rolloffFactor = i;
              if (n.panner) {
                n.panner.rolloffFactor = i;
              }
              break;
            case 4130:
              if (!Number.isFinite(i) || i < 0 || i > 1) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.coneOuterGain = i;
              if (n.panner) {
                n.panner.coneOuterGain = i;
              }
              break;
            case 4131:
              if (!Number.isFinite(i) || i < 0) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.maxDistance = i;
              if (n.panner) {
                n.panner.maxDistance = i;
              }
              break;
            case 4132:
              if (i < 0 || i > AL.sourceDuration(n)) {
                AL.currentCtx.err = 40963;
                return;
              }
              AL.sourceSeek(n, i);
              break;
            case 4133:
              if ((_ = AL.sourceDuration(n)) > 0) {
                var c;
                for (var l of n.bufQueue) {
                  if (l.id) {
                    c = l.frequency;
                    break;
                  }
                }
                i /= c;
              }
              if (i < 0 || i > _) {
                AL.currentCtx.err = 40963;
                return;
              }
              AL.sourceSeek(n, i);
              break;
            case 4134:
              var _;
              if ((_ = AL.sourceDuration(n)) > 0) {
                var u;
                for (var l of n.bufQueue) {
                  if (l.id) {
                    u = l.frequency * l.bytesPerSample * l.channels;
                    break;
                  }
                }
                i /= u;
              }
              if (i < 0 || i > _) {
                AL.currentCtx.err = 40963;
                return;
              }
              AL.sourceSeek(n, i);
              break;
            case 4628:
              if (i !== 0 && i !== 1 && i !== 2) {
                AL.currentCtx.err = 40963;
                return;
              }
              n.spatialize = i;
              AL.initSourcePanner(n);
              break;
            case 8201:
            case 8202:
            case 8203:
              AL.currentCtx.err = 40964;
              break;
            case 53248:
              switch (i) {
                case 0:
                case 53249:
                case 53250:
                case 53251:
                case 53252:
                case 53253:
                case 53254:
                  n.distanceModel = i;
                  if (AL.currentCtx.sourceDistanceModel) {
                    AL.updateContextGlobal(AL.currentCtx);
                  }
                  break;
                default:
                  AL.currentCtx.err = 40963;
                  return;
              }
              break;
            default:
              AL.currentCtx.err = 40962;
              return;
          }
        } else {
          AL.currentCtx.err = 40962;
        }
      } else {
        AL.currentCtx.err = 40961;
      }
    }
  },
  captures: {},
  sharedCaptureAudioCtx: null,
  requireValidCaptureDevice: (e, r) => {
    if (!e) {
      AL.alcErr = 40961;
      return null;
    }
    var t = AL.captures[e];
    if (t) {
      if (t.mediaStreamError) {
        AL.alcErr = 40961;
        return null;
      } else {
        return t;
      }
    } else {
      AL.alcErr = 40961;
      return null;
    }
  }
};
function _alBufferData(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(3, 0, 1, e, r, t, i, n);
  }
  t >>>= 0;
  if (AL.currentCtx) {
    var a = AL.buffers[e];
    if (a) {
      if (n <= 0) {
        AL.currentCtx.err = 40963;
      } else {
        var s = null;
        try {
          switch (r) {
            case 4352:
              if (i > 0) {
                var o = (s = AL.currentCtx.audioCtx.createBuffer(1, i, n)).getChannelData(0);
                for (var c = 0; c < i; ++c) {
                  o[c] = (growMemViews(), HEAPU8)[t++ >>> 0] * 0.0078125 - 1;
                }
              }
              a.bytesPerSample = 1;
              a.channels = 1;
              a.length = i;
              break;
            case 4353:
              if (i > 0) {
                o = (s = AL.currentCtx.audioCtx.createBuffer(1, i >> 1, n)).getChannelData(0);
                t >>= 1;
                for (c = 0; c < i >> 1; ++c) {
                  o[c] = (growMemViews(), HEAP16)[t++ >>> 0] * 0.000030517578125;
                }
              }
              a.bytesPerSample = 2;
              a.channels = 1;
              a.length = i >> 1;
              break;
            case 4354:
              if (i > 0) {
                o = (s = AL.currentCtx.audioCtx.createBuffer(2, i >> 1, n)).getChannelData(0);
                var l = s.getChannelData(1);
                for (c = 0; c < i >> 1; ++c) {
                  o[c] = (growMemViews(), HEAPU8)[t++ >>> 0] * 0.0078125 - 1;
                  l[c] = (growMemViews(), HEAPU8)[t++ >>> 0] * 0.0078125 - 1;
                }
              }
              a.bytesPerSample = 1;
              a.channels = 2;
              a.length = i >> 1;
              break;
            case 4355:
              if (i > 0) {
                o = (s = AL.currentCtx.audioCtx.createBuffer(2, i >> 2, n)).getChannelData(0);
                l = s.getChannelData(1);
                t >>= 1;
                for (c = 0; c < i >> 2; ++c) {
                  o[c] = (growMemViews(), HEAP16)[t++ >>> 0] * 0.000030517578125;
                  l[c] = (growMemViews(), HEAP16)[t++ >>> 0] * 0.000030517578125;
                }
              }
              a.bytesPerSample = 2;
              a.channels = 2;
              a.length = i >> 2;
              break;
            case 65552:
              if (i > 0) {
                o = (s = AL.currentCtx.audioCtx.createBuffer(1, i >> 2, n)).getChannelData(0);
                t >>= 2;
                for (c = 0; c < i >> 2; ++c) {
                  o[c] = (growMemViews(), HEAPF32)[t++ >>> 0];
                }
              }
              a.bytesPerSample = 4;
              a.channels = 1;
              a.length = i >> 2;
              break;
            case 65553:
              if (i > 0) {
                o = (s = AL.currentCtx.audioCtx.createBuffer(2, i >> 3, n)).getChannelData(0);
                l = s.getChannelData(1);
                t >>= 2;
                for (c = 0; c < i >> 3; ++c) {
                  o[c] = (growMemViews(), HEAPF32)[t++ >>> 0];
                  l[c] = (growMemViews(), HEAPF32)[t++ >>> 0];
                }
              }
              a.bytesPerSample = 4;
              a.channels = 2;
              a.length = i >> 3;
              break;
            default:
              AL.currentCtx.err = 40963;
              return;
          }
          a.frequency = n;
          a.audioBuf = s;
        } catch (e) {
          AL.currentCtx.err = 40963;
          return;
        }
      }
    } else {
      AL.currentCtx.err = 40963;
    }
  }
}
function _alDeleteBuffers(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(4, 0, 1, e, r);
  }
  r >>>= 0;
  if (AL.currentCtx) {
    for (var t = 0; t < e; ++t) {
      if (i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0]) {
        if (!AL.buffers[i]) {
          AL.currentCtx.err = 40961;
          return;
        }
        if (AL.buffers[i].refCount) {
          AL.currentCtx.err = 40964;
          return;
        }
      }
    }
    for (t = 0; t < e; ++t) {
      var i;
      if (i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0]) {
        AL.deviceRefCounts[AL.buffers[i].deviceId]--;
        delete AL.buffers[i];
        AL.freeIds.push(i);
      }
    }
  }
}
function _alSourcei(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(6, 0, 1, e, r, t);
  }
  switch (r) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
      AL.setSourceParam("alSourcei", e, r, t);
      break;
    default:
      AL.setSourceParam("alSourcei", e, r, null);
  }
}
function _alDeleteSources(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(5, 0, 1, e, r);
  }
  r >>>= 0;
  if (AL.currentCtx) {
    for (var t = 0; t < e; ++t) {
      var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
      if (!AL.currentCtx.sources[i]) {
        AL.currentCtx.err = 40961;
        return;
      }
    }
    for (t = 0; t < e; ++t) {
      i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
      AL.setSourceState(AL.currentCtx.sources[i], 4116);
      _alSourcei(i, 4105, 0);
      delete AL.currentCtx.sources[i];
      AL.freeIds.push(i);
    }
  }
}
function _alDistanceModel(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(7, 0, 1, e);
  }
  AL.setGlobalParam("alDistanceModel", 53248, e);
}
function _alGenBuffers(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(8, 0, 1, e, r);
  }
  r >>>= 0;
  if (AL.currentCtx) {
    for (var t = 0; t < e; ++t) {
      var i = {
        deviceId: AL.currentCtx.deviceId,
        id: AL.newId(),
        refCount: 0,
        audioBuf: null,
        frequency: 0,
        bytesPerSample: 2,
        channels: 1,
        length: 0
      };
      AL.deviceRefCounts[i.deviceId]++;
      AL.buffers[i.id] = i;
      (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0] = i.id;
    }
  }
}
function _alGenSources(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(9, 0, 1, e, r);
  }
  r >>>= 0;
  if (AL.currentCtx) {
    for (var t = 0; t < e; ++t) {
      var i = AL.currentCtx.audioCtx.createGain();
      i.connect(AL.currentCtx.gain);
      var n = {
        context: AL.currentCtx,
        id: AL.newId(),
        type: 4144,
        state: 4113,
        bufQueue: [AL.buffers[0]],
        audioQueue: [],
        looping: false,
        pitch: 1,
        dopplerShift: 1,
        gain: i,
        minGain: 0,
        maxGain: 1,
        panner: null,
        bufsProcessed: 0,
        bufStartTime: Number.NEGATIVE_INFINITY,
        bufOffset: 0,
        relative: false,
        refDistance: 1,
        maxDistance: 3.40282e+38,
        rolloffFactor: 1,
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        direction: [0, 0, 0],
        coneOuterGain: 0,
        coneInnerAngle: 360,
        coneOuterAngle: 360,
        distanceModel: 53250,
        spatialize: 2,
        get playbackRate() {
          return this.pitch * this.dopplerShift;
        }
      };
      AL.currentCtx.sources[n.id] = n;
      (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0] = n.id;
    }
  }
}
function _alGetError() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(10, 0, 1);
  }
  if (!AL.currentCtx) {
    return 40964;
  }
  var e = AL.currentCtx.err;
  AL.currentCtx.err = 0;
  return e;
}
function _alGetSource3f(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(11, 0, 1, e, r, t, i, n);
  }
  t >>>= 0;
  i >>>= 0;
  n >>>= 0;
  var a = AL.getSourceParam("alGetSource3f", e, r);
  if (a !== null) {
    if (t && i && n) {
      switch (r) {
        case 4100:
        case 4101:
        case 4102:
          (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = a[0];
          (growMemViews(), HEAPF32)[i >>> 2 >>> 0] = a[1];
          (growMemViews(), HEAPF32)[n >>> 2 >>> 0] = a[2];
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
      }
    } else {
      AL.currentCtx.err = 40963;
    }
  }
}
function _alGetSourcef(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(12, 0, 1, e, r, t);
  }
  t >>>= 0;
  var i = AL.getSourceParam("alGetSourcef", e, r);
  if (i !== null) {
    if (t) {
      switch (r) {
        case 4097:
        case 4098:
        case 4099:
        case 4106:
        case 4109:
        case 4110:
        case 4128:
        case 4129:
        case 4130:
        case 4131:
        case 4132:
        case 4133:
        case 4134:
        case 8203:
          (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = i;
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
      }
    } else {
      AL.currentCtx.err = 40963;
    }
  }
}
function _alGetSourcei(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(13, 0, 1, e, r, t);
  }
  t >>>= 0;
  var i = AL.getSourceParam("alGetSourcei", e, r);
  if (i !== null) {
    if (t) {
      switch (r) {
        case 514:
        case 4097:
        case 4098:
        case 4103:
        case 4105:
        case 4112:
        case 4117:
        case 4118:
        case 4128:
        case 4129:
        case 4131:
        case 4132:
        case 4133:
        case 4134:
        case 4135:
        case 4628:
        case 8201:
        case 8202:
        case 53248:
          (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
      }
    } else {
      AL.currentCtx.err = 40963;
    }
  }
}
function _alListener3f(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(14, 0, 1, e, r, t, i);
  }
  switch (e) {
    case 4100:
    case 4102:
      AL.paramArray[0] = r;
      AL.paramArray[1] = t;
      AL.paramArray[2] = i;
      AL.setListenerParam("alListener3f", e, AL.paramArray);
      break;
    default:
      AL.setListenerParam("alListener3f", e, null);
  }
}
function _alListenerfv(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(15, 0, 1, e, r);
  }
  r >>>= 0;
  if (AL.currentCtx) {
    if (r) {
      switch (e) {
        case 4100:
        case 4102:
          AL.paramArray[0] = (growMemViews(), HEAPF32)[r >>> 2 >>> 0];
          AL.paramArray[1] = (growMemViews(), HEAPF32)[r + 4 >>> 2 >>> 0];
          AL.paramArray[2] = (growMemViews(), HEAPF32)[r + 8 >>> 2 >>> 0];
          AL.setListenerParam("alListenerfv", e, AL.paramArray);
          break;
        case 4111:
          AL.paramArray[0] = (growMemViews(), HEAPF32)[r >>> 2 >>> 0];
          AL.paramArray[1] = (growMemViews(), HEAPF32)[r + 4 >>> 2 >>> 0];
          AL.paramArray[2] = (growMemViews(), HEAPF32)[r + 8 >>> 2 >>> 0];
          AL.paramArray[3] = (growMemViews(), HEAPF32)[r + 12 >>> 2 >>> 0];
          AL.paramArray[4] = (growMemViews(), HEAPF32)[r + 16 >>> 2 >>> 0];
          AL.paramArray[5] = (growMemViews(), HEAPF32)[r + 20 >>> 2 >>> 0];
          AL.setListenerParam("alListenerfv", e, AL.paramArray);
          break;
        default:
          AL.setListenerParam("alListenerfv", e, null);
      }
    } else {
      AL.currentCtx.err = 40963;
    }
  }
}
function _alSource3f(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(16, 0, 1, e, r, t, i, n);
  }
  switch (r) {
    case 4100:
    case 4101:
    case 4102:
      AL.paramArray[0] = t;
      AL.paramArray[1] = i;
      AL.paramArray[2] = n;
      AL.setSourceParam("alSource3f", e, r, AL.paramArray);
      break;
    default:
      AL.setSourceParam("alSource3f", e, r, null);
  }
}
function _alSourcePause(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(17, 0, 1, e);
  }
  if (AL.currentCtx) {
    var r = AL.currentCtx.sources[e];
    if (r) {
      AL.setSourceState(r, 4115);
    } else {
      AL.currentCtx.err = 40961;
    }
  }
}
function _alSourcePlay(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(18, 0, 1, e);
  }
  if (AL.currentCtx) {
    var r = AL.currentCtx.sources[e];
    if (r) {
      AL.setSourceState(r, 4114);
    } else {
      AL.currentCtx.err = 40961;
    }
  }
}
function _alSourceQueueBuffers(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(19, 0, 1, e, r, t);
  }
  t >>>= 0;
  if (AL.currentCtx) {
    var i = AL.currentCtx.sources[e];
    if (i) {
      if (i.type !== 4136) {
        if (r) {
          var n = AL.buffers[0];
          for (var a of i.bufQueue) {
            if (a.id) {
              n = a;
              break;
            }
          }
          for (var s = 0; s < r; ++s) {
            var o = (growMemViews(), HEAP32)[t + s * 4 >>> 2 >>> 0];
            if (!(a = AL.buffers[o])) {
              AL.currentCtx.err = 40961;
              return;
            }
            if (!!n.id && (a.frequency !== n.frequency || a.bytesPerSample !== n.bytesPerSample || a.channels !== n.channels)) {
              AL.currentCtx.err = 40964;
            }
          }
          if (i.bufQueue.length === 1 && !i.bufQueue[0].id) {
            i.bufQueue.length = 0;
          }
          i.type = 4137;
          for (s = 0; s < r; ++s) {
            o = (growMemViews(), HEAP32)[t + s * 4 >>> 2 >>> 0];
            (a = AL.buffers[o]).refCount++;
            i.bufQueue.push(a);
          }
          if (i.looping) {
            AL.cancelPendingSourceAudio(i);
          }
          AL.initSourcePanner(i);
          AL.scheduleSourceAudio(i);
        }
      } else {
        AL.currentCtx.err = 40964;
      }
    } else {
      AL.currentCtx.err = 40961;
    }
  }
}
function _alSourceStop(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(20, 0, 1, e);
  }
  if (AL.currentCtx) {
    var r = AL.currentCtx.sources[e];
    if (r) {
      AL.setSourceState(r, 4116);
    } else {
      AL.currentCtx.err = 40961;
    }
  }
}
function _alSourceUnqueueBuffers(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(21, 0, 1, e, r, t);
  }
  t >>>= 0;
  if (AL.currentCtx) {
    var i = AL.currentCtx.sources[e];
    if (i) {
      if (r > (i.bufQueue.length !== 1 || i.bufQueue[0].id ? i.bufsProcessed : 0)) {
        AL.currentCtx.err = 40963;
      } else if (r) {
        for (var n = 0; n < r; n++) {
          var a = i.bufQueue.shift();
          a.refCount--;
          (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0] = a.id;
          i.bufsProcessed--;
        }
        if (!i.bufQueue.length) {
          i.bufQueue.push(AL.buffers[0]);
        }
        AL.initSourcePanner(i);
        AL.scheduleSourceAudio(i);
      }
    } else {
      AL.currentCtx.err = 40961;
    }
  }
}
function _alSourcef(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(22, 0, 1, e, r, t);
  }
  switch (r) {
    case 4097:
    case 4098:
    case 4099:
    case 4106:
    case 4109:
    case 4110:
    case 4128:
    case 4129:
    case 4130:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 8203:
      AL.setSourceParam("alSourcef", e, r, t);
      break;
    default:
      AL.setSourceParam("alSourcef", e, r, null);
  }
}
function _alcCloseDevice(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(23, 0, 1, e);
  } else if (!((e >>>= 0) in AL.deviceRefCounts) || AL.deviceRefCounts[e] > 0) {
    return 0;
  } else {
    delete AL.deviceRefCounts[e];
    AL.freeIds.push(e);
    return 1;
  }
}
var autoResumeAudioContext = e => {
  for (var r of ["keydown", "mousedown", "touchstart"]) {
    for (var t of [document, document.getElementById("canvas")]) {
      t?.addEventListener(r, () => {
        if (e.state === "suspended") {
          e.resume();
        }
      }, {
        once: true
      });
    }
  }
};
function _alcCreateContext(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(24, 0, 1, e, r);
  }
  r >>>= 0;
  if (!((e >>>= 0) in AL.deviceRefCounts)) {
    AL.alcErr = 40961;
    return 0;
  }
  var t;
  var i = {};
  var n = [];
  var a = null;
  if (r >>= 2) {
    for (var s = 0, o = 0; s = (growMemViews(), HEAP32)[r++ >>> 0], n.push(s), s;) {
      o = (growMemViews(), HEAP32)[r++ >>> 0];
      n.push(o);
      switch (s) {
        case 4103:
          i.sampleRate = o;
          break;
        case 4112:
        case 4113:
          break;
        case 6546:
          switch (o) {
            case 0:
              a = false;
              break;
            case 1:
              a = true;
              break;
            case 2:
              break;
            default:
              AL.alcErr = 40964;
              return 0;
          }
          break;
        case 6550:
          if (o) {
            AL.alcErr = 40964;
            return 0;
          }
          break;
        default:
          AL.alcErr = 40964;
          return 0;
      }
    }
  }
  try {
    t = new AudioContext(i);
  } catch (e) {
    if (e.name === "NotSupportedError") {
      AL.alcErr = 40964;
    } else {
      AL.alcErr = 40961;
    }
    return 0;
  }
  autoResumeAudioContext(t);
  if (t.createGain === undefined) {
    t.createGain = t.createGainNode;
  }
  var c = t.createGain();
  c.connect(t.destination);
  var l = {
    deviceId: e,
    id: AL.newId(),
    attrs: n,
    audioCtx: t,
    listener: {
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      direction: [0, 0, 0],
      up: [0, 0, 0]
    },
    sources: [],
    interval: setInterval(() => AL.scheduleContextAudio(l), AL.QUEUE_INTERVAL),
    gain: c,
    distanceModel: 53250,
    speedOfSound: 343.3,
    dopplerFactor: 1,
    sourceDistanceModel: false,
    hrtf: a || false,
    _err: 0,
    get err() {
      return this._err;
    },
    set err(e) {
      if (this._err === 0 || e === 0) {
        this._err = e;
      }
    }
  };
  AL.deviceRefCounts[e]++;
  AL.contexts[l.id] = l;
  if (a !== null) {
    for (var _ in AL.contexts) {
      var u = AL.contexts[_];
      if (u.deviceId === e) {
        u.hrtf = a;
        AL.updateContextGlobal(u);
      }
    }
  }
  return l.id;
}
function _alcDestroyContext(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(25, 0, 1, e);
  }
  e >>>= 0;
  var r = AL.contexts[e];
  if (AL.currentCtx !== r) {
    if (AL.contexts[e].interval) {
      clearInterval(AL.contexts[e].interval);
    }
    AL.deviceRefCounts[r.deviceId]--;
    delete AL.contexts[e];
    AL.freeIds.push(e);
  } else {
    AL.alcErr = 40962;
  }
}
function _alcMakeContextCurrent(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(26, 0, 1, e);
  } else {
    e >>>= 0;
    AL.currentCtx = AL.contexts[e];
    return 1;
  }
}
function _alcOpenDevice(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(27, 0, 1, e);
  }
  if ((e >>>= 0) && UTF8ToString(e) !== AL.DEVICE_NAME) {
    return 0;
  }
  if (!globalThis.AudioContext) {
    return 0;
  }
  var r = AL.newId();
  AL.deviceRefCounts[r] = 0;
  return r;
}
var _emscripten_date_now = () => Date.now();
var nowIsMonotonic = 1;
var checkWasiClock = e => e >= 0 && e <= 3;
function _clock_time_get(e, r, t) {
  r = bigintToI53Checked(r);
  t >>>= 0;
  if (!checkWasiClock(e)) {
    return 28;
  }
  var i;
  if (e === 0) {
    i = _emscripten_date_now();
  } else {
    if (!nowIsMonotonic) {
      return 52;
    }
    i = _emscripten_get_now();
  }
  var n = Math.round(i * 1000 * 1000);
  (growMemViews(), HEAP64)[t >>> 3 >>> 0] = BigInt(n);
  return 0;
}
function getFullscreenElement() {
  return document.fullscreenElement;
}
var GLctx;
var safeSetTimeout = (e, r) => {
  runtimeKeepalivePush();
  return setTimeout(() => {
    runtimeKeepalivePop();
    callUserCallback(e);
  }, r);
};
var warnOnce = e => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[e]) {
    warnOnce.shown[e] = 1;
    err(e);
  }
};
var preloadPlugins = [];
var Browser = {
  useWebGL: false,
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  preloadedImages: {},
  preloadedAudios: {},
  getCanvas: () => Module.canvas,
  init() {
    if (!Browser.initted) {
      Browser.initted = true;
      var e = {
        canHandle: e => !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp|webp)$/i.test(e),
        handle: async (e, r) => {
          var t = new Blob([e], {
            type: Browser.getMimetype(r)
          });
          if (t.size !== e.length) {
            t = new Blob([new Uint8Array(e).buffer], {
              type: Browser.getMimetype(r)
            });
          }
          var i = URL.createObjectURL(t);
          return new Promise((t, n) => {
            var a = new Image();
            a.onload = () => {
              var n = document.createElement("canvas");
              n.width = a.width;
              n.height = a.height;
              n.getContext("2d").drawImage(a, 0, 0);
              Browser.preloadedImages[r] = n;
              URL.revokeObjectURL(i);
              t(e);
            };
            a.onerror = e => {
              err(`Image ${i} could not be decoded`);
              n();
            };
            a.src = i;
          });
        }
      };
      preloadPlugins.push(e);
      var r = {
        canHandle: e => !Module.noAudioDecoding && e.slice(-4) in {
          ".ogg": 1,
          ".wav": 1,
          ".mp3": 1
        },
        handle: async (e, r) => new Promise((t, i) => {
          var n = false;
          function a(i) {
            if (!n) {
              n = true;
              Browser.preloadedAudios[r] = i;
              t(e);
            }
          }
          var s = new Blob([e], {
            type: Browser.getMimetype(r)
          });
          var o = URL.createObjectURL(s);
          var c = new Audio();
          c.addEventListener("canplaythrough", () => a(c));
          c.onerror = t => {
            if (!n) {
              err(`warning: browser could not fully decode audio ${r}, trying slower base64 approach`);
              c.src = "data:audio/x-" + r.slice(-3) + ";base64," + function (e) {
                var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var t = "";
                var i = 0;
                var n = 0;
                for (var a of e) {
                  i = i << 8 | a;
                  n += 8;
                  while (n >= 6) {
                    var s = i >> n - 6 & 63;
                    n -= 6;
                    t += r[s];
                  }
                }
                if (n == 2) {
                  t += r[(i & 3) << 4];
                  t += "==";
                } else if (n == 4) {
                  t += r[(i & 15) << 2];
                  t += "=";
                }
                return t;
              }(e);
              a(c);
            }
          };
          c.src = o;
          safeSetTimeout(() => {
            a(c);
          }, 10000);
        })
      };
      preloadPlugins.push(r);
      var t = Browser.getCanvas();
      if (t) {
        document.addEventListener("pointerlockchange", function () {
          var e = Browser.getCanvas();
          Browser.pointerLock = document.pointerLockElement === e;
        });
        if (Module.elementPointerLock) {
          t.addEventListener("click", e => {
            if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
              Browser.getCanvas().requestPointerLock();
              e.preventDefault();
            }
          });
        }
      }
    }
  },
  createContext(e, r, t, i) {
    if (r && Module.ctx && e == Browser.getCanvas()) {
      return Module.ctx;
    }
    var n;
    var a;
    if (r) {
      var s = {
        antialias: false,
        alpha: false,
        majorVersion: 2
      };
      if (i) {
        for (var o in i) {
          s[o] = i[o];
        }
      }
      if (GL !== undefined && (a = GL.createContext(e, s))) {
        n = GL.getContext(a).GLctx;
      }
    } else {
      n = e.getContext("2d");
    }
    if (n) {
      if (t) {
        Module.ctx = n;
        if (r) {
          GL.makeContextCurrent(a);
        }
        Browser.useWebGL = r;
        Browser.moduleContextCreatedCallbacks.forEach(e => e());
        Browser.init();
      }
      return n;
    } else {
      return null;
    }
  },
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen(e, r) {
    Browser.lockPointer = e;
    Browser.resizeCanvas = r;
    if (Browser.lockPointer === undefined) {
      Browser.lockPointer = true;
    }
    if (Browser.resizeCanvas === undefined) {
      Browser.resizeCanvas = false;
    }
    var t = Browser.getCanvas();
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", function () {
        Browser.isFullscreen = false;
        var e = t.parentNode;
        if (getFullscreenElement() === e) {
          t.exitFullscreen = Browser.exitFullscreen;
          if (Browser.lockPointer) {
            t.requestPointerLock();
          }
          Browser.isFullscreen = true;
          if (Browser.resizeCanvas) {
            Browser.setFullscreenCanvasSize();
          } else {
            Browser.updateCanvasDimensions(t);
          }
        } else {
          e.parentNode.insertBefore(t, e);
          e.parentNode.removeChild(e);
          if (Browser.resizeCanvas) {
            Browser.setWindowedCanvasSize();
          } else {
            Browser.updateCanvasDimensions(t);
          }
        }
      });
    }
    var i = document.createElement("div");
    t.parentNode.insertBefore(i, t);
    i.appendChild(t);
    i.requestFullscreen();
  },
  exitFullscreen: () => !!Browser.isFullscreen && (document.exitFullscreen(), true),
  safeSetTimeout: (e, r) => safeSetTimeout(e, r),
  getMimetype: e => ({
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    bmp: "image/bmp",
    ogg: "audio/ogg",
    wav: "audio/wav",
    mp3: "audio/mpeg"
  })[e.slice(e.lastIndexOf(".") + 1)],
  getUserMedia: e => navigator.mediaDevices.getUserMedia(e),
  getMouseWheelDelta(e) {
    var r = 0;
    switch (e.type) {
      case "DOMMouseScroll":
        r = e.detail / 3;
        break;
      case "mousewheel":
        r = e.wheelDelta / 120;
        break;
      case "wheel":
        r = e.deltaY;
        switch (e.deltaMode) {
          case 0:
            r /= 100;
            break;
          case 1:
            r /= 3;
            break;
          case 2:
            r *= 80;
            break;
          default:
            abort("unrecognized mouse wheel delta mode: " + e.deltaMode);
        }
        break;
      default:
        abort("unrecognized mouse wheel event: " + e.type);
    }
    return r;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseCoords(e, r) {
    var t = Browser.getCanvas();
    var i = t.getBoundingClientRect();
    var n = e - (window.scrollX + i.left);
    var a = r - (window.scrollY + i.top);
    return {
      x: n *= t.width / i.width,
      y: a *= t.height / i.height
    };
  },
  setMouseCoords(e, r) {
    const {
      x: t,
      y: i
    } = Browser.calculateMouseCoords(e, r);
    Browser.mouseMovementX = t - Browser.mouseX;
    Browser.mouseMovementY = i - Browser.mouseY;
    Browser.mouseX = t;
    Browser.mouseY = i;
  },
  calculateMouseEvent(e) {
    if (Browser.pointerLock) {
      Browser.mouseMovementX = e.movementX;
      Browser.mouseMovementY = e.movementY;
      Browser.mouseX += Browser.mouseMovementX;
      Browser.mouseY += Browser.mouseMovementY;
    } else {
      if (e.type === "touchstart" || e.type === "touchend" || e.type === "touchmove") {
        var r = e.touch;
        if (r === undefined) {
          return;
        }
        var t = Browser.calculateMouseCoords(r.pageX, r.pageY);
        if (e.type === "touchstart") {
          Browser.lastTouches[r.identifier] = t;
          Browser.touches[r.identifier] = t;
        } else if (e.type === "touchend" || e.type === "touchmove") {
          var i = Browser.touches[r.identifier];
          i ||= t;
          Browser.lastTouches[r.identifier] = i;
          Browser.touches[r.identifier] = t;
        }
        return;
      }
      Browser.setMouseCoords(e.pageX, e.pageY);
    }
  },
  resizeListeners: [],
  updateResizeListeners() {
    var e = Browser.getCanvas();
    Browser.resizeListeners.forEach(r => r(e.width, e.height));
  },
  setCanvasSize(e, r, t) {
    var i = Browser.getCanvas();
    Browser.updateCanvasDimensions(i, e, r);
    if (!t) {
      Browser.updateResizeListeners();
    }
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize() {
    if (typeof SDL != "undefined") {
      var e = (growMemViews(), HEAPU32)[SDL.screen >>> 2 >>> 0];
      e |= 8388608;
      (growMemViews(), HEAP32)[SDL.screen >>> 2 >>> 0] = e;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize() {
    if (typeof SDL != "undefined") {
      var e = (growMemViews(), HEAPU32)[SDL.screen >>> 2 >>> 0];
      e &= -8388609;
      (growMemViews(), HEAP32)[SDL.screen >>> 2 >>> 0] = e;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions(e, r, t) {
    if (r && t) {
      e.widthNative = r;
      e.heightNative = t;
    } else {
      r = e.widthNative;
      t = e.heightNative;
    }
    var i = r;
    var n = t;
    if (getFullscreenElement() === e.parentNode && typeof screen != "undefined") {
      var a = Math.min(screen.width / i, screen.height / n);
      i = Math.round(i * a);
      n = Math.round(n * a);
    }
    if (Browser.resizeCanvas) {
      if (e.width != i) {
        e.width = i;
      }
      if (e.height != n) {
        e.height = n;
      }
      if (e.style !== undefined) {
        e.style.removeProperty("width");
        e.style.removeProperty("height");
      }
    } else {
      if (e.width != r) {
        e.width = r;
      }
      if (e.height != t) {
        e.height = t;
      }
      if (e.style !== undefined) {
        if (i != r || n != t) {
          e.style.setProperty("width", i + "px", "important");
          e.style.setProperty("height", n + "px", "important");
        } else {
          e.style.removeProperty("width");
          e.style.removeProperty("height");
        }
      }
    }
  }
};
var EGL = {
  errorCode: 12288,
  defaultDisplayInitialized: false,
  currentContext: 0,
  currentReadSurface: 0,
  currentDrawSurface: 0,
  contextAttributes: {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false
  },
  stringCache: {},
  setErrorCode(e) {
    EGL.errorCode = e;
  },
  chooseConfig(e, r, t, i, n) {
    if (e != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    }
    if (r) {
      while (true) {
        var a = (growMemViews(), HEAP32)[r >>> 2 >>> 0];
        if (a == 12321) {
          var s = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.alpha = s > 0;
        } else if (a == 12325) {
          var o = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.depth = o > 0;
        } else if (a == 12326) {
          var c = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.stencil = c > 0;
        } else if (a == 12337) {
          var l = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.antialias = l > 0;
        } else if (a == 12338) {
          l = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.antialias = l == 1;
        } else if (a == 12544) {
          var _ = (growMemViews(), HEAP32)[r + 4 >>> 2 >>> 0];
          EGL.contextAttributes.lowLatency = _ != 12547;
        } else if (a == 12344) {
          break;
        }
        r += 8;
      }
    }
    if (t && i || n) {
      if (n) {
        (growMemViews(), HEAP32)[n >>> 2 >>> 0] = 1;
      }
      if (t && i > 0) {
        (growMemViews(), HEAPU32)[t >>> 2 >>> 0] = 62002;
      }
      EGL.setErrorCode(12288);
      return 1;
    } else {
      EGL.setErrorCode(12300);
      return 0;
    }
  }
};
function _eglBindAPI(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(28, 0, 1, e);
  } else if (e == 12448) {
    EGL.setErrorCode(12288);
    return 1;
  } else {
    EGL.setErrorCode(12300);
    return 0;
  }
}
function _eglChooseConfig(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(29, 0, 1, e, r, t, i, n);
  } else {
    e >>>= 0;
    r >>>= 0;
    t >>>= 0;
    n >>>= 0;
    return EGL.chooseConfig(e, r, t, i, n);
  }
}
var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = e => !!(e.dibvbi = e.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));
var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = e => !!(e.mdibvbi = e.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));
var webgl_enable_EXT_polygon_offset_clamp = e => !!(e.extPolygonOffsetClamp = e.getExtension("EXT_polygon_offset_clamp"));
var webgl_enable_EXT_clip_control = e => !!(e.extClipControl = e.getExtension("EXT_clip_control"));
var webgl_enable_WEBGL_polygon_mode = e => !!(e.webglPolygonMode = e.getExtension("WEBGL_polygon_mode"));
var webgl_enable_WEBGL_multi_draw = e => !!(e.multiDrawWebgl = e.getExtension("WEBGL_multi_draw"));
var getEmscriptenSupportedExtensions = e => {
  var r = ["EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode"];
  return e.getSupportedExtensions()?.filter(e => r.includes(e)) ?? [];
};
var registerPreMainLoop = e => {
  if (MainLoop !== undefined) {
    MainLoop.preMainLoop.push(e);
  }
};
var webglBufferSubData = (e, r, t, i, n = (growMemViews(), HEAPU8)) => {
  GLctx.bufferSubData(e, r, n.subarray(i, i + t));
};
var GL = {
  counter: 1,
  buffers: [],
  mappedBuffers: {},
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: {},
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: e => {
    GL.lastError ||= e;
  },
  getNewId: e => {
    for (var r = GL.counter++, t = e.length; t < r; t++) {
      e[t] = null;
    }
    while (e[r]) {
      r = GL.counter++;
    }
    return r;
  },
  genObject: (e, r, t, i) => {
    for (var n = 0; n < e; n++) {
      var a = GLctx[t]();
      var s = a && GL.getNewId(i);
      if (a) {
        a.name = s;
        i[s] = a;
      } else {
        GL.recordError(1282);
      }
      (growMemViews(), HEAP32)[r + n * 4 >>> 2 >>> 0] = s;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: e => 32 - Math.clz32(e ? e - 1 : 0),
  generateTempBuffers: (e, r) => {
    var t = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    r.tempVertexBufferCounters1 = [];
    r.tempVertexBufferCounters2 = [];
    r.tempVertexBufferCounters1.length = r.tempVertexBufferCounters2.length = t + 1;
    r.tempVertexBuffers1 = [];
    r.tempVertexBuffers2 = [];
    r.tempVertexBuffers1.length = r.tempVertexBuffers2.length = t + 1;
    r.tempIndexBuffers = [];
    r.tempIndexBuffers.length = t + 1;
    for (var i = 0; i <= t; ++i) {
      r.tempIndexBuffers[i] = null;
      r.tempVertexBufferCounters1[i] = r.tempVertexBufferCounters2[i] = 0;
      var n = GL.numTempVertexBuffersPerSize;
      r.tempVertexBuffers1[i] = [];
      r.tempVertexBuffers2[i] = [];
      var a = r.tempVertexBuffers1[i];
      var s = r.tempVertexBuffers2[i];
      a.length = s.length = n;
      for (var o = 0; o < n; ++o) {
        a[o] = s[o] = null;
      }
    }
    if (e) {
      r.tempQuadIndexBuffer = GLctx.createBuffer();
      r.GLctx.bindBuffer(34963, r.tempQuadIndexBuffer);
      for (var c = GL.MAX_TEMP_BUFFER_SIZE >> 1, l = new Uint16Array(c), _ = (i = 0, 0); !(l[i++] = _, i >= c || (l[i++] = _ + 1, i >= c) || (l[i++] = _ + 2, i >= c) || (l[i++] = _, i >= c) || (l[i++] = _ + 2, i >= c) || (l[i++] = _ + 3, i >= c));) {
        _ += 4;
      }
      r.GLctx.bufferData(34963, l, 35044);
      r.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: e => {
    var r = GL.log2ceilLookup(e);
    var t = GL.currentContext.tempVertexBuffers1[r];
    var i = GL.currentContext.tempVertexBufferCounters1[r];
    GL.currentContext.tempVertexBufferCounters1[r] = GL.currentContext.tempVertexBufferCounters1[r] + 1 & GL.numTempVertexBuffersPerSize - 1;
    var n = t[i];
    if (n) {
      return n;
    }
    var a = GLctx.getParameter(34964);
    t[i] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, t[i]);
    GLctx.bufferData(34962, 1 << r, 35048);
    GLctx.bindBuffer(34962, a);
    return t[i];
  },
  getTempIndexBuffer: e => {
    var r = GL.log2ceilLookup(e);
    var t = GL.currentContext.tempIndexBuffers[r];
    if (t) {
      return t;
    }
    var i = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[r] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[r]);
    GLctx.bufferData(34963, 1 << r, 35048);
    GLctx.bindBuffer(34963, i);
    return GL.currentContext.tempIndexBuffers[r];
  },
  newRenderingFrameStarted: () => {
    if (GL.currentContext) {
      var e = GL.currentContext.tempVertexBuffers1;
      GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
      GL.currentContext.tempVertexBuffers2 = e;
      e = GL.currentContext.tempVertexBufferCounters1;
      GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
      GL.currentContext.tempVertexBufferCounters2 = e;
      for (var r = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE), t = 0; t <= r; ++t) {
        GL.currentContext.tempVertexBufferCounters1[t] = 0;
      }
    }
  },
  getSource: (e, r, t, i) => {
    var n = "";
    for (var a = 0; a < r; ++a) {
      var s = i ? (growMemViews(), HEAPU32)[i + a * 4 >>> 2 >>> 0] : undefined;
      n += UTF8ToString((growMemViews(), HEAPU32)[t + a * 4 >>> 2 >>> 0], s);
    }
    return n;
  },
  calcBufLength: (e, r, t, i) => t > 0 ? i * t : e * GL.byteSizeByType[r - GL.byteSizeByTypeRoot] * i,
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings: e => {
    GL.resetBufferBinding = false;
    for (var r = 0; r < GL.currentContext.maxVertexAttribs; ++r) {
      var t = GL.currentContext.clientBuffers[r];
      if (t.clientside && t.enabled) {
        GL.resetBufferBinding = true;
        var i = GL.calcBufLength(t.size, t.type, t.stride, e);
        var n = GL.getTempVertexBuffer(i);
        GLctx.bindBuffer(34962, n);
        webglBufferSubData(34962, 0, i, t.ptr);
        t.vertexAttribPointerAdaptor.call(GLctx, r, t.size, t.type, t.normalized, t.stride, 0);
      }
    }
  },
  postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
    }
  },
  createContext: (e, r) => {
    if (!e.getContextSafariWebGL2Fixed) {
      e.getContextSafariWebGL2Fixed = e.getContext;
      e.getContext = function (r, t) {
        var i = e.getContextSafariWebGL2Fixed(r, t);
        if (r == "webgl" == i instanceof WebGLRenderingContext) {
          return i;
        } else {
          return null;
        }
      };
    }
    var t = e.getContext("webgl2", r);
    if (t) {
      return GL.registerContext(t, r);
    } else {
      return 0;
    }
  },
  registerContext: (e, r) => {
    var t = _malloc(8);
    (growMemViews(), HEAPU32)[t + 4 >>> 2 >>> 0] = _pthread_self();
    var i = {
      handle: t,
      attributes: r,
      version: r.majorVersion,
      GLctx: e
    };
    if (e.canvas) {
      e.canvas.GLctxObject = i;
    }
    GL.contexts[t] = i;
    if (r.enableExtensionsByDefault === undefined || r.enableExtensionsByDefault) {
      GL.initExtensions(i);
    }
    i.maxVertexAttribs = i.GLctx.getParameter(34921);
    i.clientBuffers = [];
    for (var n = 0; n < i.maxVertexAttribs; n++) {
      i.clientBuffers[n] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null
      };
    }
    GL.generateTempBuffers(false, i);
    return t;
  },
  makeContextCurrent: e => {
    GL.currentContext = GL.contexts[e];
    Module.ctx = GLctx = GL.currentContext?.GLctx;
    return !e || !!GLctx;
  },
  getContext: e => GL.contexts[e],
  deleteContext: e => {
    if (GL.currentContext === GL.contexts[e]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      JSEvents.removeAllHandlersOnTarget(GL.contexts[e].GLctx.canvas);
    }
    if (GL.contexts[e]?.GLctx.canvas) {
      GL.contexts[e].GLctx.canvas.GLctxObject = undefined;
    }
    _free(GL.contexts[e].handle);
    GL.contexts[e] = null;
  },
  initExtensions: e => {
    e ||= GL.currentContext;
    if (!e.initExtensionsDone) {
      e.initExtensionsDone = true;
      var r = e.GLctx;
      webgl_enable_WEBGL_multi_draw(r);
      webgl_enable_EXT_polygon_offset_clamp(r);
      webgl_enable_EXT_clip_control(r);
      webgl_enable_WEBGL_polygon_mode(r);
      webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(r);
      webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(r);
      if (e.version >= 2) {
        r.disjointTimerQueryExt = r.getExtension("EXT_disjoint_timer_query_webgl2");
      }
      if (e.version < 2 || !r.disjointTimerQueryExt) {
        r.disjointTimerQueryExt = r.getExtension("EXT_disjoint_timer_query");
      }
      for (var t of getEmscriptenSupportedExtensions(r)) {
        if (!t.includes("lose_context") && !t.includes("debug")) {
          r.getExtension(t);
        }
      }
    }
  }
};
function _eglCreateContext(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(30, 0, 1, e, r, t, i);
  }
  r >>>= 0;
  t >>>= 0;
  i >>>= 0;
  if ((e >>>= 0) != 62000) {
    EGL.setErrorCode(12296);
    return 0;
  }
  var n = 1;
  for (;;) {
    var a = (growMemViews(), HEAP32)[i >>> 2 >>> 0];
    if (a != 12440) {
      if (a == 12344) {
        break;
      }
      EGL.setErrorCode(12292);
      return 0;
    }
    n = (growMemViews(), HEAP32)[i + 4 >>> 2 >>> 0];
    i += 8;
  }
  if (n < 2 || n > 3) {
    EGL.setErrorCode(12293);
    return 0;
  } else {
    EGL.contextAttributes.majorVersion = n - 1;
    EGL.contextAttributes.minorVersion = 0;
    EGL.context = GL.createContext(Browser.getCanvas(), EGL.contextAttributes);
    if (EGL.context != 0) {
      EGL.setErrorCode(12288);
      GL.makeContextCurrent(EGL.context);
      Browser.useWebGL = true;
      Browser.moduleContextCreatedCallbacks.forEach(e => e());
      GL.makeContextCurrent(null);
      return 62004;
    } else {
      EGL.setErrorCode(12297);
      return 0;
    }
  }
}
function _eglCreateWindowSurface(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(31, 0, 1, e, r, t, i);
  } else {
    r >>>= 0;
    i >>>= 0;
    if ((e >>>= 0) != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    } else if (r != 62002) {
      EGL.setErrorCode(12293);
      return 0;
    } else {
      EGL.setErrorCode(12288);
      return 62006;
    }
  }
}
function _eglDestroyContext(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(32, 0, 1, e, r);
  } else {
    r >>>= 0;
    if ((e >>>= 0) != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    } else if (r != 62004) {
      EGL.setErrorCode(12294);
      return 0;
    } else {
      GL.deleteContext(EGL.context);
      EGL.setErrorCode(12288);
      if (EGL.currentContext == r) {
        EGL.currentContext = 0;
      }
      return 1;
    }
  }
}
function _eglDestroySurface(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(33, 0, 1, e, r);
  } else {
    r >>>= 0;
    if ((e >>>= 0) != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    } else if (r != 62006) {
      EGL.setErrorCode(12301);
      return 1;
    } else {
      if (EGL.currentReadSurface == r) {
        EGL.currentReadSurface = 0;
      }
      if (EGL.currentDrawSurface == r) {
        EGL.currentDrawSurface = 0;
      }
      EGL.setErrorCode(12288);
      return 1;
    }
  }
}
function _eglGetConfigAttrib(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(34, 0, 1, e, r, t, i);
  }
  r >>>= 0;
  i >>>= 0;
  if ((e >>>= 0) != 62000) {
    EGL.setErrorCode(12296);
    return 0;
  }
  if (r != 62002) {
    EGL.setErrorCode(12293);
    return 0;
  }
  if (!i) {
    EGL.setErrorCode(12300);
    return 0;
  }
  EGL.setErrorCode(12288);
  switch (t) {
    case 12320:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.alpha ? 32 : 24;
      return 1;
    case 12321:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.alpha ? 8 : 0;
      return 1;
    case 12322:
    case 12323:
    case 12324:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 8;
      return 1;
    case 12325:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.depth ? 24 : 0;
      return 1;
    case 12326:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.stencil ? 8 : 0;
      return 1;
    case 12327:
    case 12335:
    case 12340:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 12344;
      return 1;
    case 12328:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 62002;
      return 1;
    case 12329:
    case 12333:
    case 12334:
    case 12345:
    case 12346:
    case 12347:
    case 12349:
    case 12350:
    case 12354:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 0;
      return 1;
    case 12330:
    case 12332:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 4096;
      return 1;
    case 12331:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 16777216;
      return 1;
    case 12337:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.antialias ? 4 : 0;
      return 1;
    case 12338:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = EGL.contextAttributes.antialias ? 1 : 0;
      return 1;
    case 12339:
    case 12352:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 4;
      return 1;
    case 12341:
    case 12342:
    case 12343:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = -1;
      return 1;
    case 12348:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 1;
      return 1;
    case 12351:
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 12430;
      return 1;
    default:
      EGL.setErrorCode(12292);
      return 0;
  }
}
function _eglGetDisplay(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(35, 0, 1, e);
  } else {
    e >>>= 0;
    EGL.setErrorCode(12288);
    if (e != 0 && e != 1) {
      return 0;
    } else {
      return 62000;
    }
  }
}
function _eglGetError() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(36, 0, 1);
  } else {
    return EGL.errorCode;
  }
}
function _eglInitialize(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(37, 0, 1, e, r, t);
  } else {
    r >>>= 0;
    t >>>= 0;
    if ((e >>>= 0) != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    } else {
      if (r) {
        (growMemViews(), HEAP32)[r >>> 2 >>> 0] = 1;
      }
      if (t) {
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = 4;
      }
      EGL.defaultDisplayInitialized = true;
      EGL.setErrorCode(12288);
      return 1;
    }
  }
}
function _eglMakeCurrent(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(38, 0, 1, e, r, t, i);
  } else {
    r >>>= 0;
    t >>>= 0;
    i >>>= 0;
    if ((e >>>= 0) != 62000) {
      EGL.setErrorCode(12296);
      return 0;
    } else if (i != 0 && i != 62004) {
      EGL.setErrorCode(12294);
      return 0;
    } else if (t != 0 && t != 62006 || r != 0 && r != 62006) {
      EGL.setErrorCode(12301);
      return 0;
    } else {
      GL.makeContextCurrent(i ? EGL.context : null);
      EGL.currentContext = i;
      EGL.currentDrawSurface = r;
      EGL.currentReadSurface = t;
      EGL.setErrorCode(12288);
      return 1;
    }
  }
}
var stringToNewUTF8 = e => {
  var r = lengthBytesUTF8(e) + 1;
  var t = _malloc(r);
  if (t) {
    stringToUTF8(e, t, r);
  }
  return t;
};
function _eglQueryString(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(39, 0, 1, e, r);
  }
  if ((e >>>= 0) != 62000) {
    EGL.setErrorCode(12296);
    return 0;
  }
  EGL.setErrorCode(12288);
  if (EGL.stringCache[r]) {
    return EGL.stringCache[r];
  }
  var t;
  switch (r) {
    case 12371:
      t = stringToNewUTF8("Emscripten");
      break;
    case 12372:
      t = stringToNewUTF8("1.4 Emscripten EGL");
      break;
    case 12373:
      t = stringToNewUTF8("");
      break;
    case 12429:
      t = stringToNewUTF8("OpenGL_ES");
      break;
    default:
      EGL.setErrorCode(12300);
      return 0;
  }
  EGL.stringCache[r] = t;
  return t;
}
function _eglSwapBuffers(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(40, 0, 1, e, r);
  }
  e >>>= 0;
  r >>>= 0;
  if (EGL.defaultDisplayInitialized) {
    if (GLctx) {
      if (!GLctx.isContextLost()) {
        EGL.setErrorCode(12288);
        return 1;
      }
      EGL.setErrorCode(12302);
    } else {
      EGL.setErrorCode(12290);
    }
  } else {
    EGL.setErrorCode(12289);
  }
  return 0;
}
function _eglSwapInterval(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(41, 0, 1, e, r);
  } else if ((e >>>= 0) != 62000) {
    EGL.setErrorCode(12296);
    return 0;
  } else {
    if (r == 0) {
      _emscripten_set_main_loop_timing(0, 0);
    } else {
      _emscripten_set_main_loop_timing(1, r);
    }
    EGL.setErrorCode(12288);
    return 1;
  }
}
function _eglTerminate(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(42, 0, 1, e);
  } else if ((e >>>= 0) != 62000) {
    EGL.setErrorCode(12296);
    return 0;
  } else {
    EGL.currentContext = 0;
    EGL.currentReadSurface = 0;
    EGL.currentDrawSurface = 0;
    EGL.defaultDisplayInitialized = false;
    EGL.setErrorCode(12288);
    return 1;
  }
}
function _eglWaitClient() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(43, 0, 1);
  } else {
    EGL.setErrorCode(12288);
    return 1;
  }
}
var _eglWaitGL = _eglWaitClient;
function _eglWaitNative(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(44, 0, 1, e);
  } else {
    EGL.setErrorCode(12288);
    return 1;
  }
}
var readEmAsmArgsArray = [];
var readEmAsmArgs = (e, r) => {
  var t;
  for (readEmAsmArgsArray.length = 0; t = (growMemViews(), HEAPU8)[e++ >>> 0];) {
    var i = t != 105;
    r += (i &= t != 112) && r % 8 ? 4 : 0;
    readEmAsmArgsArray.push(t == 112 ? (growMemViews(), HEAPU32)[r >>> 2 >>> 0] : t == 106 ? (growMemViews(), HEAP64)[r >>> 3 >>> 0] : t == 105 ? (growMemViews(), HEAP32)[r >>> 2 >>> 0] : (growMemViews(), HEAPF64)[r >>> 3 >>> 0]);
    r += i ? 8 : 4;
  }
  return readEmAsmArgsArray;
};
var runMainThreadEmAsm = (e, r, t, i) => {
  var n = readEmAsmArgs(r, t);
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(0, e, i, ...n);
  } else {
    return ASM_CONSTS[e](...n);
  }
};
function _emscripten_asm_const_async_on_main_thread(e, r, t) {
  return runMainThreadEmAsm(e >>>= 0, r >>>= 0, t >>>= 0, 0);
}
var runEmAsmFunction = (e, r, t) => {
  var i = readEmAsmArgs(r, t);
  return ASM_CONSTS[e](...i);
};
function _emscripten_asm_const_int(e, r, t) {
  return runEmAsmFunction(e >>>= 0, r >>>= 0, t >>>= 0);
}
function _emscripten_asm_const_int_sync_on_main_thread(e, r, t) {
  return runMainThreadEmAsm(e >>>= 0, r >>>= 0, t >>>= 0, 1);
}
function _emscripten_asm_const_ptr_sync_on_main_thread(e, r, t) {
  return runMainThreadEmAsm(e >>>= 0, r >>>= 0, t >>>= 0, 1);
}
var _emscripten_check_blocking_allowed = () => {};
function _emscripten_err(e) {
  return err(UTF8ToString(e >>>= 0));
}
var onExits = [];
var addOnExit = e => onExits.push(e);
var JSEvents = {
  removeAllEventListeners() {
    while (JSEvents.eventHandlers.length) {
      JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
    }
    JSEvents.deferredCalls = [];
  },
  inEventHandler: 0,
  deferredCalls: [],
  deferCall(e, r, t) {
    function i(e, r) {
      if (e.length != r.length) {
        return false;
      }
      for (var t = 0; t < e.length; t++) {
        if (e[t] != r[t]) {
          return false;
        }
      }
      return true;
    }
    for (var n of JSEvents.deferredCalls) {
      if (n.targetFunction == e && i(n.argsList, t)) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction: e,
      precedence: r,
      argsList: t
    });
    JSEvents.deferredCalls.sort((e, r) => e.precedence - r.precedence);
  },
  removeDeferredCalls(e) {
    JSEvents.deferredCalls = JSEvents.deferredCalls.filter(r => r.targetFunction != e);
  },
  canPerformEventHandlerRequests: () => navigator.userActivation ? navigator.userActivation.isActive : JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls,
  runDeferredCalls() {
    if (JSEvents.canPerformEventHandlerRequests()) {
      var e = JSEvents.deferredCalls;
      JSEvents.deferredCalls = [];
      for (var r of e) {
        r.targetFunction(...r.argsList);
      }
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: (e, r) => {
    for (var t = 0; t < JSEvents.eventHandlers.length; ++t) {
      if (JSEvents.eventHandlers[t].target == e && (!r || r == JSEvents.eventHandlers[t].eventTypeString)) {
        JSEvents._removeHandler(t--);
      }
    }
  },
  _removeHandler(e) {
    var r = JSEvents.eventHandlers[e];
    r.target.removeEventListener(r.eventTypeString, r.eventListenerFunc, r.useCapture);
    JSEvents.eventHandlers.splice(e, 1);
  },
  registerOrRemoveHandler(e) {
    if (!e.target) {
      return -4;
    }
    if (e.callbackfunc) {
      e.eventListenerFunc = function (r) {
        ++JSEvents.inEventHandler;
        JSEvents.currentEventHandler = e;
        JSEvents.runDeferredCalls();
        e.handlerFunc(r);
        JSEvents.runDeferredCalls();
        --JSEvents.inEventHandler;
      };
      e.target.addEventListener(e.eventTypeString, e.eventListenerFunc, e.useCapture);
      JSEvents.eventHandlers.push(e);
    } else {
      for (var r = 0; r < JSEvents.eventHandlers.length; ++r) {
        if (JSEvents.eventHandlers[r].target == e.target && JSEvents.eventHandlers[r].eventTypeString == e.eventTypeString) {
          JSEvents._removeHandler(r--);
        }
      }
    }
    return 0;
  },
  removeSingleHandler(e) {
    let r = false;
    for (let t = 0; t < JSEvents.eventHandlers.length; ++t) {
      const i = JSEvents.eventHandlers[t];
      if (i.target === e.target && i.eventTypeId === e.eventTypeId && i.callbackfunc === e.callbackfunc && i.userData === e.userData) {
        JSEvents._removeHandler(t--);
        r = true;
      }
    }
    if (r) {
      return 0;
    } else {
      return -5;
    }
  },
  getTargetThreadForEventCallback(e) {
    switch (e) {
      case 1:
        return 0;
      case 2:
        return PThread.currentProxiedOperationCallerThread;
      default:
        return e;
    }
  },
  getNodeNameForTarget: e => e == window ? "#window" : e == screen ? "#screen" : e?.nodeName ?? "",
  fullscreenEnabled: () => document.fullscreenEnabled
};
var specialHTMLTargets = [0, globalThis.document ?? 0, globalThis.window ?? 0];
var maybeCStringToJsString = e => e > 2 ? UTF8ToString(e) : e;
var findCanvasEventTarget = e => {
  e = maybeCStringToJsString(e);
  return GL.offscreenCanvases[e.slice(1)] || e == "canvas" && Object.values(GL.offscreenCanvases)[0] || specialHTMLTargets[e] || globalThis.document?.querySelector(e);
};
var getCanvasSizeCallingThread = (e, r, t) => {
  var i = findCanvasEventTarget(e);
  if (!i) {
    return -4;
  }
  if (i.canvasSharedPtr) {
    var n = (growMemViews(), HEAP32)[i.canvasSharedPtr >>> 2 >>> 0];
    var a = (growMemViews(), HEAP32)[i.canvasSharedPtr + 4 >>> 2 >>> 0];
    (growMemViews(), HEAP32)[r >>> 2 >>> 0] = n;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = a;
  } else if (i.offscreenCanvas) {
    (growMemViews(), HEAP32)[r >>> 2 >>> 0] = i.offscreenCanvas.width;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i.offscreenCanvas.height;
  } else {
    if (i.controlTransferredOffscreen) {
      return -4;
    }
    (growMemViews(), HEAP32)[r >>> 2 >>> 0] = i.width;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i.height;
  }
  return 0;
};
function getCanvasSizeMainThread(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(46, 0, 1, e, r, t);
  } else {
    return getCanvasSizeCallingThread(e, r, t);
  }
}
function _emscripten_get_canvas_element_size(e, r, t) {
  r >>>= 0;
  t >>>= 0;
  if (findCanvasEventTarget(e >>>= 0)) {
    return getCanvasSizeCallingThread(e, r, t);
  } else {
    return getCanvasSizeMainThread(e, r, t);
  }
}
var stringToUTF8OnStack = e => {
  var r = lengthBytesUTF8(e) + 1;
  var t = stackAlloc(r);
  stringToUTF8(e, t, r);
  return t;
};
var getCanvasElementSize = e => {
  var r = stackSave();
  var t = stackAlloc(8);
  var i = t + 4;
  _emscripten_get_canvas_element_size(stringToUTF8OnStack(e.id), t, i);
  var n = [(growMemViews(), HEAP32)[t >>> 2 >>> 0], (growMemViews(), HEAP32)[i >>> 2 >>> 0]];
  stackRestore(r);
  return n;
};
var setOffscreenCanvasSizeOnTargetThread = (e, r, t, i) => {
  var n = 0;
  if (r = r ? UTF8ToString(r) : "") {
    n = stringToNewUTF8(r);
  }
  __emscripten_set_offscreencanvas_size_on_thread(e, n, t, i);
};
var setCanvasElementSizeCallingThread = (e, r, t) => {
  var i = findCanvasEventTarget(e);
  if (!i) {
    return -4;
  }
  if (i.canvasSharedPtr) {
    (growMemViews(), HEAP32)[i.canvasSharedPtr >>> 2 >>> 0] = r;
    (growMemViews(), HEAP32)[i.canvasSharedPtr + 4 >>> 2 >>> 0] = t;
  }
  if (!i.offscreenCanvas && i.controlTransferredOffscreen) {
    if (i.canvasSharedPtr) {
      var n = (growMemViews(), HEAPU32)[i.canvasSharedPtr + 8 >>> 2 >>> 0];
      setOffscreenCanvasSizeOnTargetThread(n, e, r, t);
      return 1;
    }
    return -4;
  }
  if (i.offscreenCanvas) {
    i = i.offscreenCanvas;
  }
  var a = false;
  if (i.GLctxObject?.GLctx) {
    var s = i.GLctxObject.GLctx.getParameter(2978);
    a = !s[0] && !s[1] && s[2] === i.width && s[3] === i.height;
  }
  i.width = r;
  i.height = t;
  if (a) {
    i.GLctxObject.GLctx.viewport(0, 0, r, t);
  }
  return 0;
};
function setCanvasElementSizeMainThread(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(47, 0, 1, e, r, t);
  } else {
    return setCanvasElementSizeCallingThread(e, r, t);
  }
}
function _emscripten_set_canvas_element_size(e, r, t) {
  if (findCanvasEventTarget(e >>>= 0)) {
    return setCanvasElementSizeCallingThread(e, r, t);
  } else {
    return setCanvasElementSizeMainThread(e, r, t);
  }
}
var setCanvasElementSize = (e, r, t) => {
  if (e.controlTransferredOffscreen) {
    var i = stackSave();
    _emscripten_set_canvas_element_size(stringToUTF8OnStack(e.id), r, t);
    stackRestore(i);
  } else {
    e.width = r;
    e.height = t;
  }
};
var currentFullscreenStrategy = 0;
var callCanvasResizedCallback = e => {
  var r;
  if (e.canvasResizedCallback) {
    if (e.canvasResizedCallbackTargetThread) {
      __emscripten_run_callback_on_thread(e.canvasResizedCallbackTargetThread, e.canvasResizedCallback, 37, 0, 0, e.canvasResizedCallbackUserData);
    } else {
      r = e.canvasResizedCallbackUserData;
      dynCall_iiii(e.canvasResizedCallback, 37, 0, r);
    }
  }
};
var registerRestoreOldStyle = e => {
  var r = getCanvasElementSize(e);
  var t = r[0];
  var i = r[1];
  var n = e.style.width;
  var a = e.style.height;
  var s = e.style.backgroundColor;
  var o = document.body.style.backgroundColor;
  var c = e.style.paddingLeft;
  var l = e.style.paddingRight;
  var _ = e.style.paddingTop;
  var u = e.style.paddingBottom;
  var m = e.style.marginLeft;
  var f = e.style.marginRight;
  var d = e.style.marginTop;
  var g = e.style.marginBottom;
  var p = document.body.style.margin;
  var v = document.documentElement.style.overflow;
  var w = document.body.scroll;
  var E = e.style.imageRendering;
  function x() {
    if (!getFullscreenElement()) {
      document.removeEventListener("fullscreenchange", x);
      setCanvasElementSize(e, t, i);
      e.style.width = n;
      e.style.height = a;
      e.style.backgroundColor = s;
      if (!o) {
        document.body.style.backgroundColor = "white";
      }
      document.body.style.backgroundColor = o;
      e.style.paddingLeft = c;
      e.style.paddingRight = l;
      e.style.paddingTop = _;
      e.style.paddingBottom = u;
      e.style.marginLeft = m;
      e.style.marginRight = f;
      e.style.marginTop = d;
      e.style.marginBottom = g;
      document.body.style.margin = p;
      document.documentElement.style.overflow = v;
      document.body.scroll = w;
      e.style.imageRendering = E;
      if (e.GLctxObject) {
        e.GLctxObject.GLctx.viewport(0, 0, t, i);
      }
      callCanvasResizedCallback(currentFullscreenStrategy);
    }
  }
  document.addEventListener("fullscreenchange", x);
  return x;
};
var setLetterbox = (e, r, t) => {
  e.style.paddingLeft = e.style.paddingRight = t + "px";
  e.style.paddingTop = e.style.paddingBottom = r + "px";
};
var getBoundingClientRect = e => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
  left: 0,
  top: 0
};
var JSEvents_resizeCanvasForFullscreen = (e, r) => {
  var t = registerRestoreOldStyle(e);
  var i = r.softFullscreen ? innerWidth : screen.width;
  var n = r.softFullscreen ? innerHeight : screen.height;
  var a = getBoundingClientRect(e);
  var s = a.width;
  var o = a.height;
  var c = getCanvasElementSize(e);
  var l = c[0];
  var _ = c[1];
  if (r.scaleMode == 3) {
    setLetterbox(e, (n - o) / 2, (i - s) / 2);
    i = s;
    n = o;
  } else if (r.scaleMode == 2) {
    if (i * _ < l * n) {
      var u = _ * i / l;
      setLetterbox(e, (n - u) / 2, 0);
      n = u;
    } else {
      var m = l * n / _;
      setLetterbox(e, 0, (i - m) / 2);
      i = m;
    }
  }
  e.style.backgroundColor ||= "black";
  document.body.style.backgroundColor ||= "black";
  e.style.width = i + "px";
  e.style.height = n + "px";
  if (r.filteringMode == 1) {
    e.style.imageRendering = "optimizeSpeed";
    e.style.imageRendering = "-moz-crisp-edges";
    e.style.imageRendering = "-o-crisp-edges";
    e.style.imageRendering = "-webkit-optimize-contrast";
    e.style.imageRendering = "optimize-contrast";
    e.style.imageRendering = "crisp-edges";
    e.style.imageRendering = "pixelated";
  }
  var f = r.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
  if (r.canvasResolutionScaleMode != 0) {
    var d = i * f | 0;
    var g = n * f | 0;
    setCanvasElementSize(e, d, g);
    if (e.GLctxObject) {
      e.GLctxObject.GLctx.viewport(0, 0, d, g);
    }
  }
  return t;
};
var JSEvents_requestFullscreen = (e, r) => {
  if (r.scaleMode != 0 || r.canvasResolutionScaleMode != 0) {
    JSEvents_resizeCanvasForFullscreen(e, r);
  }
  if (e.requestFullscreen) {
    e.requestFullscreen();
    currentFullscreenStrategy = r;
    callCanvasResizedCallback(r);
    return 0;
  } else if (JSEvents.fullscreenEnabled()) {
    return -3;
  } else {
    return -1;
  }
};
function _emscripten_exit_fullscreen() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(45, 0, 1);
  }
  if (!JSEvents.fullscreenEnabled()) {
    return -1;
  }
  JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
  var e = specialHTMLTargets[1];
  if (e.exitFullscreen) {
    if (e.fullscreenElement) {
      e.exitFullscreen();
    }
    return 0;
  } else {
    return -1;
  }
}
var requestPointerLock = e => e.requestPointerLock ? (e.requestPointerLock(), 0) : document.body.requestPointerLock ? -3 : -1;
function _emscripten_exit_pointerlock() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(48, 0, 1);
  } else {
    JSEvents.removeDeferredCalls(requestPointerLock);
    if (document.exitPointerLock) {
      document.exitPointerLock();
      return 0;
    } else {
      return -1;
    }
  }
}
var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};
function _emscripten_force_exit(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(49, 0, 1, e);
  }
  __emscripten_runtime_keepalive_clear();
  _exit(e);
}
function _emscripten_get_device_pixel_ratio() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(50, 0, 1);
  } else {
    return devicePixelRatio;
  }
}
var findEventTarget = e => {
  e = maybeCStringToJsString(e);
  return specialHTMLTargets[e] || globalThis.document?.querySelector(e);
};
function _emscripten_get_element_css_size(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(51, 0, 1, e, r, t);
  }
  r >>>= 0;
  t >>>= 0;
  if (!(e = findEventTarget(e >>>= 0))) {
    return -4;
  }
  var i = getBoundingClientRect(e);
  (growMemViews(), HEAPF64)[r >>> 3 >>> 0] = i.width;
  (growMemViews(), HEAPF64)[t >>> 3 >>> 0] = i.height;
  return 0;
}
var fillGamepadEventData = (e, r) => {
  (growMemViews(), HEAPF64)[e >>> 3 >>> 0] = r.timestamp;
  for (var t = 0; t < r.axes.length; ++t) {
    (growMemViews(), HEAPF64)[e + t * 8 + 16 >>> 3 >>> 0] = r.axes[t];
  }
  for (t = 0; t < r.buttons.length; ++t) {
    (growMemViews(), HEAP8)[e + t + 1040 >>> 0] = r.buttons[t].pressed;
    (growMemViews(), HEAPF64)[e + t * 8 + 528 >>> 3 >>> 0] = r.buttons[t].value;
  }
  (growMemViews(), HEAP8)[e + 1104 >>> 0] = r.connected;
  (growMemViews(), HEAP32)[e + 1108 >>> 2 >>> 0] = r.index;
  (growMemViews(), HEAP32)[e + 8 >>> 2 >>> 0] = r.axes.length;
  (growMemViews(), HEAP32)[e + 12 >>> 2 >>> 0] = r.buttons.length;
  stringToUTF8(r.id, e + 1112, 64);
  stringToUTF8(r.mapping, e + 1176, 64);
};
function _emscripten_get_gamepad_status(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(52, 0, 1, e, r);
  } else {
    r >>>= 0;
    if (e < 0 || e >= JSEvents.lastGamepadState.length) {
      return -5;
    } else if (JSEvents.lastGamepadState[e]) {
      fillGamepadEventData(r, JSEvents.lastGamepadState[e]);
      return 0;
    } else {
      return -7;
    }
  }
}
function _emscripten_get_num_gamepads() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(53, 0, 1);
  } else {
    return JSEvents.lastGamepadState.length;
  }
}
function _emscripten_get_screen_size(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(54, 0, 1, e, r);
  }
  e >>>= 0;
  r >>>= 0;
  (growMemViews(), HEAP32)[e >>> 2 >>> 0] = screen.width;
  (growMemViews(), HEAP32)[r >>> 2 >>> 0] = screen.height;
}
var _emscripten_glActiveTexture = e => GLctx.activeTexture(e);
var _emscripten_glAttachShader = (e, r) => {
  GLctx.attachShader(GL.programs[e], GL.shaders[r]);
};
var _emscripten_glBeginQuery = (e, r) => {
  GLctx.beginQuery(e, GL.queries[r]);
};
var _emscripten_glBeginQueryEXT = (e, r) => {
  GLctx.disjointTimerQueryExt.beginQueryEXT(e, GL.queries[r]);
};
var _emscripten_glBeginTransformFeedback = e => GLctx.beginTransformFeedback(e);
function _emscripten_glBindAttribLocation(e, r, t) {
  t >>>= 0;
  GLctx.bindAttribLocation(GL.programs[e], r, UTF8ToString(t));
}
var _emscripten_glBindBuffer = (e, r) => {
  if (r && !GL.buffers[r]) {
    var t = GLctx.createBuffer();
    t.name = r;
    GL.buffers[r] = t;
  }
  if (e == 34962) {
    GLctx.currentArrayBufferBinding = r;
  } else if (e == 34963) {
    GLctx.currentElementArrayBufferBinding = r;
  }
  if (e == 35051) {
    GLctx.currentPixelPackBufferBinding = r;
  } else if (e == 35052) {
    GLctx.currentPixelUnpackBufferBinding = r;
  }
  GLctx.bindBuffer(e, GL.buffers[r]);
};
var _emscripten_glBindBufferBase = (e, r, t) => {
  GLctx.bindBufferBase(e, r, GL.buffers[t]);
};
function _emscripten_glBindBufferRange(e, r, t, i, n) {
  i >>>= 0;
  n >>>= 0;
  GLctx.bindBufferRange(e, r, GL.buffers[t], i, n);
}
var _emscripten_glBindFramebuffer = (e, r) => {
  GLctx.bindFramebuffer(e, GL.framebuffers[r]);
};
var _emscripten_glBindRenderbuffer = (e, r) => {
  GLctx.bindRenderbuffer(e, GL.renderbuffers[r]);
};
var _emscripten_glBindSampler = (e, r) => {
  GLctx.bindSampler(e, GL.samplers[r]);
};
var _emscripten_glBindTexture = (e, r) => {
  GLctx.bindTexture(e, GL.textures[r]);
};
var _emscripten_glBindTransformFeedback = (e, r) => {
  GLctx.bindTransformFeedback(e, GL.transformFeedbacks[r]);
};
var _emscripten_glBindVertexArray = e => {
  GLctx.bindVertexArray(GL.vaos[e]);
  var r = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = r ? r.name | 0 : 0;
};
var _glBindVertexArray = _emscripten_glBindVertexArray;
var _emscripten_glBindVertexArrayOES = _glBindVertexArray;
var _emscripten_glBlendColor = (e, r, t, i) => GLctx.blendColor(e, r, t, i);
var _emscripten_glBlendEquation = e => GLctx.blendEquation(e);
var _emscripten_glBlendEquationSeparate = (e, r) => GLctx.blendEquationSeparate(e, r);
var _emscripten_glBlendFunc = (e, r) => GLctx.blendFunc(e, r);
var _emscripten_glBlendFuncSeparate = (e, r, t, i) => GLctx.blendFuncSeparate(e, r, t, i);
var _emscripten_glBlitFramebuffer = (e, r, t, i, n, a, s, o, c, l) => GLctx.blitFramebuffer(e, r, t, i, n, a, s, o, c, l);
function _emscripten_glBufferData(e, r, t, i) {
  r >>>= 0;
  t >>>= 0;
  GLctx.bufferData(e, t ? (growMemViews(), HEAPU8).subarray(t >>> 0, t + r >>> 0) : r, i);
}
function _emscripten_glBufferSubData(e, r, t, i) {
  return webglBufferSubData(e, r >>>= 0, t >>>= 0, i >>>= 0);
}
var _emscripten_glCheckFramebufferStatus = e => GLctx.checkFramebufferStatus(e);
var _emscripten_glClear = e => GLctx.clear(e);
var _emscripten_glClearBufferfi = (e, r, t, i) => GLctx.clearBufferfi(e, r, t, i);
function _emscripten_glClearBufferfv(e, r, t) {
  t >>>= 0;
  GLctx.clearBufferfv(e, r, (growMemViews(), HEAPF32), t >>> 2);
}
function _emscripten_glClearBufferiv(e, r, t) {
  t >>>= 0;
  GLctx.clearBufferiv(e, r, (growMemViews(), HEAP32), t >>> 2);
}
function _emscripten_glClearBufferuiv(e, r, t) {
  t >>>= 0;
  GLctx.clearBufferuiv(e, r, (growMemViews(), HEAPU32), t >>> 2);
}
var _emscripten_glClearColor = (e, r, t, i) => GLctx.clearColor(e, r, t, i);
var _emscripten_glClearDepthf = e => GLctx.clearDepth(e);
var _emscripten_glClearStencil = e => GLctx.clearStencil(e);
function _emscripten_glClientWaitSync(e, r, t) {
  e >>>= 0;
  t = Number(t);
  return GLctx.clientWaitSync(GL.syncs[e], r, t);
}
var _emscripten_glClipControlEXT = (e, r) => {
  GLctx.extClipControl.clipControlEXT(e, r);
};
var _emscripten_glColorMask = (e, r, t, i) => {
  GLctx.colorMask(!!e, !!r, !!t, !!i);
};
var _emscripten_glCompileShader = e => {
  GLctx.compileShader(GL.shaders[e]);
};
function _emscripten_glCompressedTexImage2D(e, r, t, i, n, a, s, o) {
  o >>>= 0;
  if (!GLctx.currentPixelUnpackBufferBinding && s) {
    GLctx.compressedTexImage2D(e, r, t, i, n, a, (growMemViews(), HEAPU8).subarray(o >>> 0, o + s >>> 0));
  } else {
    GLctx.compressedTexImage2D(e, r, t, i, n, a, s, o);
  }
}
function _emscripten_glCompressedTexImage3D(e, r, t, i, n, a, s, o, c) {
  c >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexImage3D(e, r, t, i, n, a, s, o, c);
  } else {
    GLctx.compressedTexImage3D(e, r, t, i, n, a, s, (growMemViews(), HEAPU8), c, o);
  }
}
function _emscripten_glCompressedTexSubImage2D(e, r, t, i, n, a, s, o, c) {
  c >>>= 0;
  if (!GLctx.currentPixelUnpackBufferBinding && o) {
    GLctx.compressedTexSubImage2D(e, r, t, i, n, a, s, (growMemViews(), HEAPU8).subarray(c >>> 0, c + o >>> 0));
  } else {
    GLctx.compressedTexSubImage2D(e, r, t, i, n, a, s, o, c);
  }
}
function _emscripten_glCompressedTexSubImage3D(e, r, t, i, n, a, s, o, c, l, _) {
  _ >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexSubImage3D(e, r, t, i, n, a, s, o, c, l, _);
  } else {
    GLctx.compressedTexSubImage3D(e, r, t, i, n, a, s, o, c, (growMemViews(), HEAPU8), _, l);
  }
}
function _emscripten_glCopyBufferSubData(e, r, t, i, n) {
  t >>>= 0;
  i >>>= 0;
  n >>>= 0;
  return GLctx.copyBufferSubData(e, r, t, i, n);
}
var _emscripten_glCopyTexImage2D = (e, r, t, i, n, a, s, o) => GLctx.copyTexImage2D(e, r, t, i, n, a, s, o);
var _emscripten_glCopyTexSubImage2D = (e, r, t, i, n, a, s, o) => GLctx.copyTexSubImage2D(e, r, t, i, n, a, s, o);
var _emscripten_glCopyTexSubImage3D = (e, r, t, i, n, a, s, o, c) => GLctx.copyTexSubImage3D(e, r, t, i, n, a, s, o, c);
var _emscripten_glCreateProgram = () => {
  var e = GL.getNewId(GL.programs);
  var r = GLctx.createProgram();
  r.name = e;
  r.maxUniformLength = r.maxAttributeLength = r.maxUniformBlockNameLength = 0;
  r.uniformIdCounter = 1;
  GL.programs[e] = r;
  return e;
};
var _emscripten_glCreateShader = e => {
  var r = GL.getNewId(GL.shaders);
  GL.shaders[r] = GLctx.createShader(e);
  return r;
};
var _emscripten_glCullFace = e => GLctx.cullFace(e);
function _emscripten_glDeleteBuffers(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.buffers[i];
    if (n) {
      GLctx.deleteBuffer(n);
      n.name = 0;
      GL.buffers[i] = null;
      if (i == GLctx.currentArrayBufferBinding) {
        GLctx.currentArrayBufferBinding = 0;
      }
      if (i == GLctx.currentElementArrayBufferBinding) {
        GLctx.currentElementArrayBufferBinding = 0;
      }
      if (i == GLctx.currentPixelPackBufferBinding) {
        GLctx.currentPixelPackBufferBinding = 0;
      }
      if (i == GLctx.currentPixelUnpackBufferBinding) {
        GLctx.currentPixelUnpackBufferBinding = 0;
      }
    }
  }
}
function _emscripten_glDeleteFramebuffers(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; ++t) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.framebuffers[i];
    if (n) {
      GLctx.deleteFramebuffer(n);
      n.name = 0;
      GL.framebuffers[i] = null;
    }
  }
}
var _emscripten_glDeleteProgram = e => {
  if (e) {
    var r = GL.programs[e];
    if (r) {
      GLctx.deleteProgram(r);
      r.name = 0;
      GL.programs[e] = null;
    } else {
      GL.recordError(1281);
    }
  }
};
function _emscripten_glDeleteQueries(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.queries[i];
    if (n) {
      GLctx.deleteQuery(n);
      GL.queries[i] = null;
    }
  }
}
function _emscripten_glDeleteQueriesEXT(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.queries[i];
    if (n) {
      GLctx.disjointTimerQueryExt.deleteQueryEXT(n);
      GL.queries[i] = null;
    }
  }
}
function _emscripten_glDeleteRenderbuffers(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.renderbuffers[i];
    if (n) {
      GLctx.deleteRenderbuffer(n);
      n.name = 0;
      GL.renderbuffers[i] = null;
    }
  }
}
function _emscripten_glDeleteSamplers(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.samplers[i];
    if (n) {
      GLctx.deleteSampler(n);
      n.name = 0;
      GL.samplers[i] = null;
    }
  }
}
var _emscripten_glDeleteShader = e => {
  if (e) {
    var r = GL.shaders[e];
    if (r) {
      GLctx.deleteShader(r);
      GL.shaders[e] = null;
    } else {
      GL.recordError(1281);
    }
  }
};
function _emscripten_glDeleteSync(e) {
  if (e >>>= 0) {
    var r = GL.syncs[e];
    if (r) {
      GLctx.deleteSync(r);
      r.name = 0;
      GL.syncs[e] = null;
    } else {
      GL.recordError(1281);
    }
  }
}
function _emscripten_glDeleteTextures(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.textures[i];
    if (n) {
      GLctx.deleteTexture(n);
      n.name = 0;
      GL.textures[i] = null;
    }
  }
}
function _emscripten_glDeleteTransformFeedbacks(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    var n = GL.transformFeedbacks[i];
    if (n) {
      GLctx.deleteTransformFeedback(n);
      n.name = 0;
      GL.transformFeedbacks[i] = null;
    }
  }
}
function _emscripten_glDeleteVertexArrays(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0];
    GLctx.deleteVertexArray(GL.vaos[i]);
    GL.vaos[i] = null;
  }
}
var _glDeleteVertexArrays = _emscripten_glDeleteVertexArrays;
var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArrays;
var _emscripten_glDepthFunc = e => GLctx.depthFunc(e);
var _emscripten_glDepthMask = e => {
  GLctx.depthMask(!!e);
};
var _emscripten_glDepthRangef = (e, r) => GLctx.depthRange(e, r);
var _emscripten_glDetachShader = (e, r) => {
  GLctx.detachShader(GL.programs[e], GL.shaders[r]);
};
var _emscripten_glDisable = e => GLctx.disable(e);
var _emscripten_glDisableVertexAttribArray = e => {
  GL.currentContext.clientBuffers[e].enabled = false;
  GLctx.disableVertexAttribArray(e);
};
var _emscripten_glDrawArrays = (e, r, t) => {
  GL.preDrawHandleClientVertexAttribBindings(r + t);
  GLctx.drawArrays(e, r, t);
  GL.postDrawHandleClientVertexAttribBindings();
};
var _emscripten_glDrawArraysInstanced = (e, r, t, i) => {
  GLctx.drawArraysInstanced(e, r, t, i);
};
var _glDrawArraysInstanced = _emscripten_glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedANGLE = _emscripten_glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedARB = _emscripten_glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedEXT = _emscripten_glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedNV = _emscripten_glDrawArraysInstanced;
var tempFixedLengthArray = [];
function _emscripten_glDrawBuffers(e, r) {
  r >>>= 0;
  var t = tempFixedLengthArray[e];
  for (var i = 0; i < e; i++) {
    t[i] = (growMemViews(), HEAP32)[r + i * 4 >>> 2 >>> 0];
  }
  GLctx.drawBuffers(t);
}
var _glDrawBuffers = _emscripten_glDrawBuffers;
var _emscripten_glDrawBuffersEXT = _emscripten_glDrawBuffers;
var _emscripten_glDrawBuffersWEBGL = _emscripten_glDrawBuffers;
function _emscripten_glDrawElements(e, r, t, i) {
  var n;
  i >>>= 0;
  var a = 0;
  if (!GLctx.currentElementArrayBufferBinding) {
    var s = GL.calcBufLength(1, t, 0, r);
    n = GL.getTempIndexBuffer(s);
    GLctx.bindBuffer(34963, n);
    webglBufferSubData(34963, 0, s, i);
    if (r > 0) {
      for (var o = 0; o < GL.currentContext.maxVertexAttribs; ++o) {
        var c = GL.currentContext.clientBuffers[o];
        if (c.clientside && c.enabled) {
          let e;
          switch (t) {
            case 5121:
              e = Uint8Array;
              break;
            case 5123:
              e = Uint16Array;
              break;
            case 5125:
              e = Uint32Array;
              break;
            default:
              GL.recordError(1282);
              return;
          }
          a = new e((growMemViews(), HEAPU8).buffer, i, r).reduce((e, r) => Math.max(e, r)) + 1;
          break;
        }
      }
    }
    i = 0;
  }
  GL.preDrawHandleClientVertexAttribBindings(a);
  GLctx.drawElements(e, r, t, i);
  GL.postDrawHandleClientVertexAttribBindings(r);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}
function _emscripten_glDrawElementsInstanced(e, r, t, i, n) {
  i >>>= 0;
  GLctx.drawElementsInstanced(e, r, t, i, n);
}
var _glDrawElementsInstanced = _emscripten_glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedANGLE = _emscripten_glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedARB = _emscripten_glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedEXT = _emscripten_glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedNV = _emscripten_glDrawElementsInstanced;
var _glDrawElements = _emscripten_glDrawElements;
function _emscripten_glDrawRangeElements(e, r, t, i, n, a) {
  _glDrawElements(e, i, n, a >>>= 0);
}
var _emscripten_glEnable = e => GLctx.enable(e);
var _emscripten_glEnableVertexAttribArray = e => {
  GL.currentContext.clientBuffers[e].enabled = true;
  GLctx.enableVertexAttribArray(e);
};
var _emscripten_glEndQuery = e => GLctx.endQuery(e);
var _emscripten_glEndQueryEXT = e => {
  GLctx.disjointTimerQueryExt.endQueryEXT(e);
};
var _emscripten_glEndTransformFeedback = () => GLctx.endTransformFeedback();
function _emscripten_glFenceSync(e, r) {
  var t = GLctx.fenceSync(e, r);
  if (t) {
    var i = GL.getNewId(GL.syncs);
    t.name = i;
    GL.syncs[i] = t;
    return i;
  }
  return 0;
}
var _emscripten_glFinish = () => GLctx.finish();
var _emscripten_glFlush = () => GLctx.flush();
var emscriptenWebGLGetBufferBinding = e => {
  switch (e) {
    case 34962:
      e = 34964;
      break;
    case 34963:
      e = 34965;
      break;
    case 35051:
      e = 35053;
      break;
    case 35052:
      e = 35055;
      break;
    case 35982:
      e = 35983;
      break;
    case 36662:
      e = 36662;
      break;
    case 36663:
      e = 36663;
      break;
    case 35345:
      e = 35368;
  }
  var r = GLctx.getParameter(e);
  if (r) {
    return r.name | 0;
  } else {
    return 0;
  }
};
var emscriptenWebGLValidateMapBufferTarget = e => {
  switch (e) {
    case 34962:
    case 34963:
    case 36662:
    case 36663:
    case 35051:
    case 35052:
    case 35882:
    case 35982:
    case 35345:
      return true;
    default:
      return false;
  }
};
function _emscripten_glFlushMappedBufferRange(e, r, t) {
  r >>>= 0;
  t >>>= 0;
  if (!emscriptenWebGLValidateMapBufferTarget(e)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glFlushMappedBufferRange");
    return;
  }
  var i = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)];
  if (i) {
    if (i.access & 16) {
      if (r < 0 || t < 0 || r + t > i.length) {
        GL.recordError(1281);
        err("invalid range in glFlushMappedBufferRange");
        return;
      } else {
        webglBufferSubData(e, i.offset, t, i.mem + r);
        return;
      }
    } else {
      GL.recordError(1282);
      err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
      return;
    }
  } else {
    GL.recordError(1282);
    err("buffer was never mapped in glFlushMappedBufferRange");
    return;
  }
}
var _emscripten_glFramebufferRenderbuffer = (e, r, t, i) => {
  GLctx.framebufferRenderbuffer(e, r, t, GL.renderbuffers[i]);
};
var _emscripten_glFramebufferTexture2D = (e, r, t, i, n) => {
  GLctx.framebufferTexture2D(e, r, t, GL.textures[i], n);
};
var _emscripten_glFramebufferTextureLayer = (e, r, t, i, n) => {
  GLctx.framebufferTextureLayer(e, r, GL.textures[t], i, n);
};
var _emscripten_glFrontFace = e => GLctx.frontFace(e);
function _emscripten_glGenBuffers(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createBuffer", GL.buffers);
}
function _emscripten_glGenFramebuffers(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createFramebuffer", GL.framebuffers);
}
function _emscripten_glGenQueries(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createQuery", GL.queries);
}
function _emscripten_glGenQueriesEXT(e, r) {
  r >>>= 0;
  for (var t = 0; t < e; t++) {
    var i = GLctx.disjointTimerQueryExt.createQueryEXT();
    if (!i) {
      for (GL.recordError(1282); t < e;) {
        (growMemViews(), HEAP32)[r + t++ * 4 >>> 2 >>> 0] = 0;
      }
      return;
    }
    var n = GL.getNewId(GL.queries);
    i.name = n;
    GL.queries[n] = i;
    (growMemViews(), HEAP32)[r + t * 4 >>> 2 >>> 0] = n;
  }
}
function _emscripten_glGenRenderbuffers(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createRenderbuffer", GL.renderbuffers);
}
function _emscripten_glGenSamplers(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createSampler", GL.samplers);
}
function _emscripten_glGenTextures(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createTexture", GL.textures);
}
function _emscripten_glGenTransformFeedbacks(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createTransformFeedback", GL.transformFeedbacks);
}
function _emscripten_glGenVertexArrays(e, r) {
  r >>>= 0;
  GL.genObject(e, r, "createVertexArray", GL.vaos);
}
var _glGenVertexArrays = _emscripten_glGenVertexArrays;
var _emscripten_glGenVertexArraysOES = _glGenVertexArrays;
var _emscripten_glGenerateMipmap = e => GLctx.generateMipmap(e);
var __glGetActiveAttribOrUniform = (e, r, t, i, n, a, s, o) => {
  r = GL.programs[r];
  var c = GLctx[e](r, t);
  if (c) {
    var l = o && stringToUTF8(c.name, o, i);
    if (n) {
      (growMemViews(), HEAP32)[n >>> 2 >>> 0] = l;
    }
    if (a) {
      (growMemViews(), HEAP32)[a >>> 2 >>> 0] = c.size;
    }
    if (s) {
      (growMemViews(), HEAP32)[s >>> 2 >>> 0] = c.type;
    }
  }
};
function _emscripten_glGetActiveAttrib(e, r, t, i, n, a, s) {
  return __glGetActiveAttribOrUniform("getActiveAttrib", e, r, t, i >>>= 0, n >>>= 0, a >>>= 0, s >>>= 0);
}
function _emscripten_glGetActiveUniform(e, r, t, i, n, a, s) {
  return __glGetActiveAttribOrUniform("getActiveUniform", e, r, t, i >>>= 0, n >>>= 0, a >>>= 0, s >>>= 0);
}
function _emscripten_glGetActiveUniformBlockName(e, r, t, i, n) {
  i >>>= 0;
  n >>>= 0;
  e = GL.programs[e];
  var a = GLctx.getActiveUniformBlockName(e, r);
  if (a) {
    if (n && t > 0) {
      var s = stringToUTF8(a, n, t);
      if (i) {
        (growMemViews(), HEAP32)[i >>> 2 >>> 0] = s;
      }
    } else if (i) {
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 0;
    }
  }
}
function _emscripten_glGetActiveUniformBlockiv(e, r, t, i) {
  if (i >>>= 0) {
    e = GL.programs[e];
    if (t != 35393) {
      var n = GLctx.getActiveUniformBlockParameter(e, r, t);
      if (n !== null) {
        if (t == 35395) {
          for (var a = 0; a < n.length; a++) {
            (growMemViews(), HEAP32)[i + a * 4 >>> 2 >>> 0] = n[a];
          }
        } else {
          (growMemViews(), HEAP32)[i >>> 2 >>> 0] = n;
        }
      }
    } else {
      var s = GLctx.getActiveUniformBlockName(e, r);
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = s.length + 1;
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetActiveUniformsiv(e, r, t, i, n) {
  t >>>= 0;
  if (n >>>= 0) {
    if (r > 0 && t == 0) {
      GL.recordError(1281);
    } else {
      e = GL.programs[e];
      var a = [];
      for (var s = 0; s < r; s++) {
        a.push((growMemViews(), HEAP32)[t + s * 4 >>> 2 >>> 0]);
      }
      var o = GLctx.getActiveUniforms(e, a, i);
      if (o) {
        var c = o.length;
        for (s = 0; s < c; s++) {
          (growMemViews(), HEAP32)[n + s * 4 >>> 2 >>> 0] = o[s];
        }
      }
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetAttachedShaders(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GLctx.getAttachedShaders(GL.programs[e]);
  var a = n.length;
  if (a > r) {
    a = r;
  }
  (growMemViews(), HEAP32)[t >>> 2 >>> 0] = a;
  for (var s = 0; s < a; ++s) {
    var o = GL.shaders.indexOf(n[s]);
    (growMemViews(), HEAP32)[i + s * 4 >>> 2 >>> 0] = o;
  }
}
function _emscripten_glGetAttribLocation(e, r) {
  r >>>= 0;
  return GLctx.getAttribLocation(GL.programs[e], UTF8ToString(r));
}
var writeI53ToI64 = (e, r) => {
  (growMemViews(), HEAPU32)[e >>> 2 >>> 0] = r;
  var t = (growMemViews(), HEAPU32)[e >>> 2 >>> 0];
  (growMemViews(), HEAPU32)[e + 4 >>> 2 >>> 0] = (r - t) / 4294967296;
};
var webglGetExtensions = () => {
  var e = getEmscriptenSupportedExtensions(GLctx);
  return e = e.concat(e.map(e => "GL_" + e));
};
var emscriptenWebGLGet = (e, r, t) => {
  if (r) {
    var i = undefined;
    switch (e) {
      case 36346:
        i = 1;
        break;
      case 36344:
        if (t != 0 && t != 1) {
          GL.recordError(1280);
        }
        return;
      case 34814:
      case 36345:
        i = 0;
        break;
      case 34466:
        var n = GLctx.getParameter(34467);
        i = n ? n.length : 0;
        break;
      case 33309:
        if (GL.currentContext.version < 2) {
          GL.recordError(1282);
          return;
        }
        i = webglGetExtensions().length;
        break;
      case 33307:
      case 33308:
        if (GL.currentContext.version < 2) {
          GL.recordError(1280);
          return;
        }
        i = e == 33307 ? 3 : 0;
    }
    if (i === undefined) {
      var a = GLctx.getParameter(e);
      switch (typeof a) {
        case "number":
          i = a;
          break;
        case "boolean":
          i = a ? 1 : 0;
          break;
        case "string":
          GL.recordError(1280);
          return;
        case "object":
          if (a === null) {
            switch (e) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 36662:
              case 36663:
              case 35053:
              case 35055:
              case 36010:
              case 35097:
              case 35869:
              case 32874:
              case 36389:
              case 35983:
              case 35368:
              case 34068:
                i = 0;
                break;
              default:
                GL.recordError(1280);
                return;
            }
          } else {
            if (a instanceof Float32Array || a instanceof Uint32Array || a instanceof Int32Array || a instanceof Array) {
              for (var s = 0; s < a.length; ++s) {
                switch (t) {
                  case 0:
                    (growMemViews(), HEAP32)[r + s * 4 >>> 2 >>> 0] = a[s];
                    break;
                  case 2:
                    (growMemViews(), HEAPF32)[r + s * 4 >>> 2 >>> 0] = a[s];
                    break;
                  case 4:
                    (growMemViews(), HEAP8)[r + s >>> 0] = a[s] ? 1 : 0;
                }
              }
              return;
            }
            try {
              i = a.name | 0;
            } catch (r) {
              GL.recordError(1280);
              err(`GL_INVALID_ENUM in glGet${t}v: Unknown object returned from WebGL getParameter(${e})! (error: ${r})`);
              return;
            }
          }
          break;
        default:
          GL.recordError(1280);
          err(`GL_INVALID_ENUM in glGet${t}v: Native code calling glGet${t}v(${e}) and it returns ${a} of type ${typeof a}!`);
          return;
      }
    }
    switch (t) {
      case 1:
        writeI53ToI64(r, i);
        break;
      case 0:
        (growMemViews(), HEAP32)[r >>> 2 >>> 0] = i;
        break;
      case 2:
        (growMemViews(), HEAPF32)[r >>> 2 >>> 0] = i;
        break;
      case 4:
        (growMemViews(), HEAP8)[r >>> 0] = i ? 1 : 0;
    }
  } else {
    GL.recordError(1281);
  }
};
function _emscripten_glGetBooleanv(e, r) {
  return emscriptenWebGLGet(e, r >>>= 0, 4);
}
function _emscripten_glGetBufferParameteri64v(e, r, t) {
  if (t >>>= 0) {
    writeI53ToI64(t, GLctx.getBufferParameter(e, r));
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetBufferParameteriv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getBufferParameter(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetBufferPointerv(e, r, t) {
  t >>>= 0;
  if (r == 35005) {
    var i = 0;
    var n = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)];
    if (n) {
      i = n.mem;
    }
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
  } else {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glGetBufferPointerv");
  }
}
var _emscripten_glGetError = () => {
  var e = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return e;
};
function _emscripten_glGetFloatv(e, r) {
  return emscriptenWebGLGet(e, r >>>= 0, 2);
}
function _emscripten_glGetFragDataLocation(e, r) {
  r >>>= 0;
  return GLctx.getFragDataLocation(GL.programs[e], UTF8ToString(r));
}
function _emscripten_glGetFramebufferAttachmentParameteriv(e, r, t, i) {
  i >>>= 0;
  var n = GLctx.getFramebufferAttachmentParameter(e, r, t);
  if (n instanceof WebGLRenderbuffer || n instanceof WebGLTexture) {
    n = n.name | 0;
  }
  (growMemViews(), HEAP32)[i >>> 2 >>> 0] = n;
}
var emscriptenWebGLGetIndexed = (e, r, t, i) => {
  if (t) {
    var n;
    var a = GLctx.getIndexedParameter(e, r);
    switch (typeof a) {
      case "boolean":
        n = a ? 1 : 0;
        break;
      case "number":
        n = a;
        break;
      case "object":
        if (a === null) {
          switch (e) {
            case 35983:
            case 35368:
              n = 0;
              break;
            default:
              GL.recordError(1280);
              return;
          }
        } else {
          if (!(a instanceof WebGLBuffer)) {
            GL.recordError(1280);
            return;
          }
          n = a.name | 0;
        }
        break;
      default:
        GL.recordError(1280);
        return;
    }
    switch (i) {
      case 1:
        writeI53ToI64(t, n);
        break;
      case 0:
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n;
        break;
      case 2:
        (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = n;
        break;
      case 4:
        (growMemViews(), HEAP8)[t >>> 0] = n ? 1 : 0;
        break;
      default:
        abort("internal emscriptenWebGLGetIndexed() error, bad type: " + i);
    }
  } else {
    GL.recordError(1281);
  }
};
function _emscripten_glGetInteger64i_v(e, r, t) {
  return emscriptenWebGLGetIndexed(e, r, t >>>= 0, 1);
}
function _emscripten_glGetInteger64v(e, r) {
  emscriptenWebGLGet(e, r >>>= 0, 1);
}
function _emscripten_glGetIntegeri_v(e, r, t) {
  return emscriptenWebGLGetIndexed(e, r, t >>>= 0, 0);
}
function _emscripten_glGetIntegerv(e, r) {
  return emscriptenWebGLGet(e, r >>>= 0, 0);
}
function _emscripten_glGetInternalformativ(e, r, t, i, n) {
  n >>>= 0;
  if (i < 0) {
    GL.recordError(1281);
  } else if (n) {
    var a = GLctx.getInternalformatParameter(e, r, t);
    if (a !== null) {
      for (var s = 0; s < a.length && s < i; ++s) {
        (growMemViews(), HEAP32)[n + s * 4 >>> 2 >>> 0] = a[s];
      }
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetProgramBinary(e, r, t, i, n) {
  GL.recordError(1282);
}
function _emscripten_glGetProgramInfoLog(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GLctx.getProgramInfoLog(GL.programs[e]);
  if (n === null) {
    n = "(unknown error)";
  }
  var a = r > 0 && i ? stringToUTF8(n, i, r) : 0;
  if (t) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = a;
  }
}
function _emscripten_glGetProgramiv(e, r, t) {
  if (t >>>= 0) {
    if (e >= GL.counter) {
      GL.recordError(1281);
    } else {
      e = GL.programs[e];
      if (r == 35716) {
        var i = GLctx.getProgramInfoLog(e);
        if (i === null) {
          i = "(unknown error)";
        }
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i.length + 1;
      } else if (r == 35719) {
        if (!e.maxUniformLength) {
          for (var n = GLctx.getProgramParameter(e, 35718), a = 0; a < n; ++a) {
            e.maxUniformLength = Math.max(e.maxUniformLength, GLctx.getActiveUniform(e, a).name.length + 1);
          }
        }
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = e.maxUniformLength;
      } else if (r == 35722) {
        if (!e.maxAttributeLength) {
          var s = GLctx.getProgramParameter(e, 35721);
          for (a = 0; a < s; ++a) {
            e.maxAttributeLength = Math.max(e.maxAttributeLength, GLctx.getActiveAttrib(e, a).name.length + 1);
          }
        }
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = e.maxAttributeLength;
      } else if (r == 35381) {
        if (!e.maxUniformBlockNameLength) {
          var o = GLctx.getProgramParameter(e, 35382);
          for (a = 0; a < o; ++a) {
            e.maxUniformBlockNameLength = Math.max(e.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(e, a).length + 1);
          }
        }
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = e.maxUniformBlockNameLength;
      } else {
        (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getProgramParameter(e, r);
      }
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetQueryObjecti64vEXT(e, r, t) {
  if (t >>>= 0) {
    var i;
    var n = GL.queries[e];
    i = GL.currentContext.version < 2 ? GLctx.disjointTimerQueryExt.getQueryObjectEXT(n, r) : GLctx.getQueryParameter(n, r);
    writeI53ToI64(t, typeof i == "boolean" ? i ? 1 : 0 : i);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetQueryObjectivEXT(e, r, t) {
  if (t >>>= 0) {
    var i;
    var n = GL.queries[e];
    var a = GLctx.disjointTimerQueryExt.getQueryObjectEXT(n, r);
    i = typeof a == "boolean" ? a ? 1 : 0 : a;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
  } else {
    GL.recordError(1281);
  }
}
var _glGetQueryObjecti64vEXT = _emscripten_glGetQueryObjecti64vEXT;
var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;
function _emscripten_glGetQueryObjectuiv(e, r, t) {
  if (t >>>= 0) {
    var i;
    var n = GL.queries[e];
    var a = GLctx.getQueryParameter(n, r);
    i = typeof a == "boolean" ? a ? 1 : 0 : a;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i;
  } else {
    GL.recordError(1281);
  }
}
var _glGetQueryObjectivEXT = _emscripten_glGetQueryObjectivEXT;
var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;
function _emscripten_glGetQueryiv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getQuery(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetQueryivEXT(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.disjointTimerQueryExt.getQueryEXT(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetRenderbufferParameteriv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getRenderbufferParameter(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetSamplerParameterfv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = GLctx.getSamplerParameter(GL.samplers[e], r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetSamplerParameteriv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getSamplerParameter(GL.samplers[e], r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetShaderInfoLog(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GLctx.getShaderInfoLog(GL.shaders[e]);
  if (n === null) {
    n = "(unknown error)";
  }
  var a = r > 0 && i ? stringToUTF8(n, i, r) : 0;
  if (t) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = a;
  }
}
function _emscripten_glGetShaderPrecisionFormat(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GLctx.getShaderPrecisionFormat(e, r);
  (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n.rangeMin;
  (growMemViews(), HEAP32)[t + 4 >>> 2 >>> 0] = n.rangeMax;
  (growMemViews(), HEAP32)[i >>> 2 >>> 0] = n.precision;
}
function _emscripten_glGetShaderSource(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GLctx.getShaderSource(GL.shaders[e]);
  if (n) {
    var a = r > 0 && i ? stringToUTF8(n, i, r) : 0;
    if (t) {
      (growMemViews(), HEAP32)[t >>> 2 >>> 0] = a;
    }
  }
}
function _emscripten_glGetShaderiv(e, r, t) {
  if (t >>>= 0) {
    if (r == 35716) {
      var i = GLctx.getShaderInfoLog(GL.shaders[e]);
      if (i === null) {
        i = "(unknown error)";
      }
      var n = i ? i.length + 1 : 0;
      (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n;
    } else if (r == 35720) {
      var a = GLctx.getShaderSource(GL.shaders[e]);
      var s = a ? a.length + 1 : 0;
      (growMemViews(), HEAP32)[t >>> 2 >>> 0] = s;
    } else {
      (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getShaderParameter(GL.shaders[e], r);
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetString(e) {
  var r = GL.stringCache[e];
  if (!r) {
    switch (e) {
      case 7939:
        r = stringToNewUTF8(webglGetExtensions().join(" "));
        break;
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        var t = GLctx.getParameter(e);
        if (!t) {
          GL.recordError(1280);
        }
        r = t ? stringToNewUTF8(t) : 0;
        break;
      case 7938:
        var i = GLctx.getParameter(7938);
        r = stringToNewUTF8(`OpenGL ES 3.0 (${i})`);
        break;
      case 35724:
        var n = GLctx.getParameter(35724);
        var a = n.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
        if (a !== null) {
          if (a[1].length == 3) {
            a[1] = a[1] + "0";
          }
          n = `OpenGL ES GLSL ES ${a[1]} (${n})`;
        }
        r = stringToNewUTF8(n);
        break;
      default:
        GL.recordError(1280);
    }
    GL.stringCache[e] = r;
  }
  return r;
}
function _emscripten_glGetStringi(e, r) {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    return 0;
  }
  var t = GL.stringiCache[e];
  if (t) {
    if (r < 0 || r >= t.length) {
      GL.recordError(1281);
      return 0;
    } else {
      return t[r];
    }
  }
  if (e === 7939) {
    var i = webglGetExtensions().map(stringToNewUTF8);
    t = GL.stringiCache[e] = i;
    if (r < 0 || r >= t.length) {
      GL.recordError(1281);
      return 0;
    } else {
      return t[r];
    }
  }
  GL.recordError(1280);
  return 0;
}
function _emscripten_glGetSynciv(e, r, t, i, n) {
  e >>>= 0;
  i >>>= 0;
  n >>>= 0;
  if (t < 0) {
    GL.recordError(1281);
  } else if (n) {
    var a = GLctx.getSyncParameter(GL.syncs[e], r);
    if (a !== null) {
      (growMemViews(), HEAP32)[n >>> 2 >>> 0] = a;
      if (i) {
        (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 1;
      }
    }
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetTexParameterfv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = GLctx.getTexParameter(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetTexParameteriv(e, r, t) {
  if (t >>>= 0) {
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getTexParameter(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetTransformFeedbackVarying(e, r, t, i, n, a, s) {
  i >>>= 0;
  n >>>= 0;
  a >>>= 0;
  s >>>= 0;
  e = GL.programs[e];
  var o = GLctx.getTransformFeedbackVarying(e, r);
  if (o) {
    if (s && t > 0) {
      var c = stringToUTF8(o.name, s, t);
      if (i) {
        (growMemViews(), HEAP32)[i >>> 2 >>> 0] = c;
      }
    } else if (i) {
      (growMemViews(), HEAP32)[i >>> 2 >>> 0] = 0;
    }
    if (n) {
      (growMemViews(), HEAP32)[n >>> 2 >>> 0] = o.size;
    }
    if (a) {
      (growMemViews(), HEAP32)[a >>> 2 >>> 0] = o.type;
    }
  }
}
function _emscripten_glGetUniformBlockIndex(e, r) {
  r >>>= 0;
  return GLctx.getUniformBlockIndex(GL.programs[e], UTF8ToString(r));
}
function _emscripten_glGetUniformIndices(e, r, t, i) {
  t >>>= 0;
  if (i >>>= 0) {
    if (r > 0 && (t == 0 || i == 0)) {
      GL.recordError(1281);
    } else {
      e = GL.programs[e];
      var n = [];
      for (var a = 0; a < r; a++) {
        n.push(UTF8ToString((growMemViews(), HEAPU32)[t + a * 4 >>> 2 >>> 0]));
      }
      var s = GLctx.getUniformIndices(e, n);
      if (s) {
        var o = s.length;
        for (a = 0; a < o; a++) {
          (growMemViews(), HEAP32)[i + a * 4 >>> 2 >>> 0] = s[a];
        }
      }
    }
  } else {
    GL.recordError(1281);
  }
}
var jstoi_q = e => parseInt(e);
var webglGetLeftBracePos = e => e.slice(-1) == "]" && e.lastIndexOf("[");
var webglPrepareUniformLocationsBeforeFirstUse = e => {
  var r;
  var t;
  var i = e.uniformLocsById;
  var n = e.uniformSizeAndIdsByName;
  if (!i) {
    e.uniformLocsById = i = {};
    e.uniformArrayNamesById = {};
    var a = GLctx.getProgramParameter(e, 35718);
    for (r = 0; r < a; ++r) {
      var s = GLctx.getActiveUniform(e, r);
      var o = s.name;
      var c = s.size;
      var l = webglGetLeftBracePos(o);
      var _ = l > 0 ? o.slice(0, l) : o;
      var u = e.uniformIdCounter;
      e.uniformIdCounter += c;
      n[_] = [c, u];
      t = 0;
      for (; t < c; ++t) {
        i[u] = t;
        e.uniformArrayNamesById[u++] = _;
      }
    }
  }
};
function _emscripten_glGetUniformLocation(e, r) {
  r = UTF8ToString(r >>>= 0);
  if (e = GL.programs[e]) {
    webglPrepareUniformLocationsBeforeFirstUse(e);
    var t = e.uniformLocsById;
    var i = 0;
    var n = r;
    var a = webglGetLeftBracePos(r);
    if (a > 0) {
      i = jstoi_q(r.slice(a + 1)) >>> 0;
      n = r.slice(0, a);
    }
    var s = e.uniformSizeAndIdsByName[n];
    if (s && i < s[0] && (t[i += s[1]] = t[i] || GLctx.getUniformLocation(e, r))) {
      return i;
    }
  } else {
    GL.recordError(1281);
  }
  return -1;
}
var webglGetProgramUniformLocation = (e, r) => {
  if (e) {
    var t = e.uniformLocsById[r];
    if (typeof t == "number") {
      e.uniformLocsById[r] = t = GLctx.getUniformLocation(e, e.uniformArrayNamesById[r] + (t > 0 ? `[${t}]` : ""));
    }
    return t;
  }
  GL.recordError(1282);
};
var emscriptenWebGLGetUniform = (e, r, t, i) => {
  if (t) {
    e = GL.programs[e];
    webglPrepareUniformLocationsBeforeFirstUse(e);
    var n = GLctx.getUniform(e, webglGetProgramUniformLocation(e, r));
    if (typeof n == "number" || typeof n == "boolean") {
      switch (i) {
        case 0:
          (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n;
          break;
        case 2:
          (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = n;
      }
    } else {
      for (var a = 0; a < n.length; a++) {
        switch (i) {
          case 0:
            (growMemViews(), HEAP32)[t + a * 4 >>> 2 >>> 0] = n[a];
            break;
          case 2:
            (growMemViews(), HEAPF32)[t + a * 4 >>> 2 >>> 0] = n[a];
        }
      }
    }
  } else {
    GL.recordError(1281);
  }
};
function _emscripten_glGetUniformfv(e, r, t) {
  emscriptenWebGLGetUniform(e, r, t >>>= 0, 2);
}
function _emscripten_glGetUniformiv(e, r, t) {
  emscriptenWebGLGetUniform(e, r, t >>>= 0, 0);
}
function _emscripten_glGetUniformuiv(e, r, t) {
  return emscriptenWebGLGetUniform(e, r, t >>>= 0, 0);
}
var emscriptenWebGLGetVertexAttrib = (e, r, t, i) => {
  if (t) {
    if (GL.currentContext.clientBuffers[e].enabled) {
      err("glGetVertexAttrib*v on client-side array: not supported, bad data returned");
    }
    var n = GLctx.getVertexAttrib(e, r);
    if (r == 34975) {
      (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n && n.name;
    } else if (typeof n == "number" || typeof n == "boolean") {
      switch (i) {
        case 0:
          (growMemViews(), HEAP32)[t >>> 2 >>> 0] = n;
          break;
        case 2:
          (growMemViews(), HEAPF32)[t >>> 2 >>> 0] = n;
          break;
        case 5:
          (growMemViews(), HEAP32)[t >>> 2 >>> 0] = Math.fround(n);
      }
    } else {
      for (var a = 0; a < n.length; a++) {
        switch (i) {
          case 0:
            (growMemViews(), HEAP32)[t + a * 4 >>> 2 >>> 0] = n[a];
            break;
          case 2:
            (growMemViews(), HEAPF32)[t + a * 4 >>> 2 >>> 0] = n[a];
            break;
          case 5:
            (growMemViews(), HEAP32)[t + a * 4 >>> 2 >>> 0] = Math.fround(n[a]);
        }
      }
    }
  } else {
    GL.recordError(1281);
  }
};
function _emscripten_glGetVertexAttribIiv(e, r, t) {
  emscriptenWebGLGetVertexAttrib(e, r, t >>>= 0, 0);
}
var _glGetVertexAttribIiv = _emscripten_glGetVertexAttribIiv;
var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIiv;
function _emscripten_glGetVertexAttribPointerv(e, r, t) {
  if (t >>>= 0) {
    if (GL.currentContext.clientBuffers[e].enabled) {
      err("glGetVertexAttribPointer on client-side array: not supported, bad data returned");
    }
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = GLctx.getVertexAttribOffset(e, r);
  } else {
    GL.recordError(1281);
  }
}
function _emscripten_glGetVertexAttribfv(e, r, t) {
  emscriptenWebGLGetVertexAttrib(e, r, t >>>= 0, 2);
}
function _emscripten_glGetVertexAttribiv(e, r, t) {
  emscriptenWebGLGetVertexAttrib(e, r, t >>>= 0, 5);
}
var _emscripten_glHint = (e, r) => GLctx.hint(e, r);
function _emscripten_glInvalidateFramebuffer(e, r, t) {
  t >>>= 0;
  var i = tempFixedLengthArray[r];
  for (var n = 0; n < r; n++) {
    i[n] = (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0];
  }
  GLctx.invalidateFramebuffer(e, i);
}
function _emscripten_glInvalidateSubFramebuffer(e, r, t, i, n, a, s) {
  t >>>= 0;
  var o = tempFixedLengthArray[r];
  for (var c = 0; c < r; c++) {
    o[c] = (growMemViews(), HEAP32)[t + c * 4 >>> 2 >>> 0];
  }
  GLctx.invalidateSubFramebuffer(e, o, i, n, a, s);
}
var _emscripten_glIsBuffer = e => {
  var r = GL.buffers[e];
  if (r) {
    return GLctx.isBuffer(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsEnabled = e => GLctx.isEnabled(e);
var _emscripten_glIsFramebuffer = e => {
  var r = GL.framebuffers[e];
  if (r) {
    return GLctx.isFramebuffer(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsProgram = e => (e = GL.programs[e]) ? GLctx.isProgram(e) : 0;
var _emscripten_glIsQuery = e => {
  var r = GL.queries[e];
  if (r) {
    return GLctx.isQuery(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsQueryEXT = e => {
  var r = GL.queries[e];
  if (r) {
    return GLctx.disjointTimerQueryExt.isQueryEXT(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsRenderbuffer = e => {
  var r = GL.renderbuffers[e];
  if (r) {
    return GLctx.isRenderbuffer(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsSampler = e => {
  var r = GL.samplers[e];
  if (r) {
    return GLctx.isSampler(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsShader = e => {
  var r = GL.shaders[e];
  if (r) {
    return GLctx.isShader(r);
  } else {
    return 0;
  }
};
function _emscripten_glIsSync(e) {
  e >>>= 0;
  return GLctx.isSync(GL.syncs[e]);
}
var _emscripten_glIsTexture = e => {
  var r = GL.textures[e];
  if (r) {
    return GLctx.isTexture(r);
  } else {
    return 0;
  }
};
var _emscripten_glIsTransformFeedback = e => GLctx.isTransformFeedback(GL.transformFeedbacks[e]);
var _emscripten_glIsVertexArray = e => {
  var r = GL.vaos[e];
  if (r) {
    return GLctx.isVertexArray(r);
  } else {
    return 0;
  }
};
var _glIsVertexArray = _emscripten_glIsVertexArray;
var _emscripten_glIsVertexArrayOES = _glIsVertexArray;
var _emscripten_glLineWidth = e => GLctx.lineWidth(e);
var _emscripten_glLinkProgram = e => {
  e = GL.programs[e];
  GLctx.linkProgram(e);
  e.uniformLocsById = 0;
  e.uniformSizeAndIdsByName = {};
};
function _emscripten_glMapBufferRange(e, r, t, i) {
  r >>>= 0;
  t >>>= 0;
  if (i & 33) {
    err("glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED");
    return 0;
  }
  if (!(i & 2)) {
    err("glMapBufferRange access must include MAP_WRITE");
    return 0;
  }
  if (!(i & 12)) {
    err("glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
    return 0;
  }
  if (!emscriptenWebGLValidateMapBufferTarget(e)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glMapBufferRange");
    return 0;
  }
  var n = _malloc(t);
  var a = emscriptenWebGLGetBufferBinding(e);
  if (n) {
    (a = GL.mappedBuffers[a] ??= {}).offset = r;
    a.length = t;
    a.mem = n;
    a.access = i;
    return n;
  } else {
    return 0;
  }
}
var _emscripten_glPauseTransformFeedback = () => GLctx.pauseTransformFeedback();
var _emscripten_glPixelStorei = (e, r) => {
  if (e == 3317) {
    GL.unpackAlignment = r;
  } else if (e == 3314) {
    GL.unpackRowLength = r;
  }
  GLctx.pixelStorei(e, r);
};
var _emscripten_glPolygonModeWEBGL = (e, r) => {
  GLctx.webglPolygonMode.polygonModeWEBGL(e, r);
};
var _emscripten_glPolygonOffset = (e, r) => GLctx.polygonOffset(e, r);
var _emscripten_glPolygonOffsetClampEXT = (e, r, t) => {
  GLctx.extPolygonOffsetClamp.polygonOffsetClampEXT(e, r, t);
};
function _emscripten_glProgramBinary(e, r, t, i) {
  GL.recordError(1280);
}
var HEAPU16;
var _emscripten_glProgramParameteri = (e, r, t) => {
  GL.recordError(1280);
};
var _emscripten_glQueryCounterEXT = (e, r) => {
  GLctx.disjointTimerQueryExt.queryCounterEXT(GL.queries[e], r);
};
var _emscripten_glReadBuffer = e => GLctx.readBuffer(e);
var computeUnpackAlignedImageSize = (e, r, t) => {
  var i;
  var n;
  var a = (GL.unpackRowLength || e) * t;
  return r * (i = a, n = GL.unpackAlignment, i + n - 1 & -n);
};
var colorChannelsInGlTextureFormat = e => ({
  5: 3,
  6: 4,
  8: 2,
  29502: 3,
  29504: 4,
  26917: 2,
  26918: 2,
  29846: 3,
  29847: 4
})[e - 6402] || 1;
var heapObjectForWebGLType = e => (e -= 5120) == 0 ? (growMemViews(), HEAP8) : e == 1 ? (growMemViews(), HEAPU8) : e == 2 ? (growMemViews(), HEAP16) : e == 4 ? (growMemViews(), HEAP32) : e == 6 ? (growMemViews(), HEAPF32) : e == 5 || e == 28922 || e == 28520 || e == 30779 || e == 30782 ? (growMemViews(), HEAPU32) : (growMemViews(), HEAPU16);
var toTypedArrayIndex = (e, r) => e >>> 31 - Math.clz32(r.BYTES_PER_ELEMENT);
var emscriptenWebGLGetTexPixelData = (e, r, t, i, n) => {
  var a = heapObjectForWebGLType(e);
  var s = colorChannelsInGlTextureFormat(r) * a.BYTES_PER_ELEMENT;
  var o = computeUnpackAlignedImageSize(t, i, s);
  return a.subarray(toTypedArrayIndex(n, a) >>> 0, toTypedArrayIndex(n + o, a) >>> 0);
};
function _emscripten_glReadPixels(e, r, t, i, n, a, s) {
  s >>>= 0;
  if (GLctx.currentPixelPackBufferBinding) {
    GLctx.readPixels(e, r, t, i, n, a, s);
  } else {
    var o = emscriptenWebGLGetTexPixelData(a, n, t, i, s);
    if (o) {
      GLctx.readPixels(e, r, t, i, n, a, o);
    } else {
      GL.recordError(1280);
    }
  }
}
var _emscripten_glReleaseShaderCompiler = () => {};
var _emscripten_glRenderbufferStorage = (e, r, t, i) => GLctx.renderbufferStorage(e, r, t, i);
var _emscripten_glRenderbufferStorageMultisample = (e, r, t, i, n) => GLctx.renderbufferStorageMultisample(e, r, t, i, n);
var _emscripten_glResumeTransformFeedback = () => GLctx.resumeTransformFeedback();
var _emscripten_glSampleCoverage = (e, r) => {
  GLctx.sampleCoverage(e, !!r);
};
var _emscripten_glSamplerParameterf = (e, r, t) => {
  GLctx.samplerParameterf(GL.samplers[e], r, t);
};
function _emscripten_glSamplerParameterfv(e, r, t) {
  t >>>= 0;
  var i = (growMemViews(), HEAPF32)[t >>> 2 >>> 0];
  GLctx.samplerParameterf(GL.samplers[e], r, i);
}
var _emscripten_glSamplerParameteri = (e, r, t) => {
  GLctx.samplerParameteri(GL.samplers[e], r, t);
};
function _emscripten_glSamplerParameteriv(e, r, t) {
  t >>>= 0;
  var i = (growMemViews(), HEAP32)[t >>> 2 >>> 0];
  GLctx.samplerParameteri(GL.samplers[e], r, i);
}
var _emscripten_glScissor = (e, r, t, i) => GLctx.scissor(e, r, t, i);
function _emscripten_glShaderBinary(e, r, t, i, n) {
  GL.recordError(1280);
}
function _emscripten_glShaderSource(e, r, t, i) {
  t >>>= 0;
  i >>>= 0;
  var n = GL.getSource(e, r, t, i);
  GLctx.shaderSource(GL.shaders[e], n);
}
var _emscripten_glStencilFunc = (e, r, t) => GLctx.stencilFunc(e, r, t);
var _emscripten_glStencilFuncSeparate = (e, r, t, i) => GLctx.stencilFuncSeparate(e, r, t, i);
var _emscripten_glStencilMask = e => GLctx.stencilMask(e);
var _emscripten_glStencilMaskSeparate = (e, r) => GLctx.stencilMaskSeparate(e, r);
var _emscripten_glStencilOp = (e, r, t) => GLctx.stencilOp(e, r, t);
var _emscripten_glStencilOpSeparate = (e, r, t, i) => GLctx.stencilOpSeparate(e, r, t, i);
function _emscripten_glTexImage2D(e, r, t, i, n, a, s, o, c) {
  c >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage2D(e, r, t, i, n, a, s, o, c);
  } else {
    var l = c ? emscriptenWebGLGetTexPixelData(o, s, i, n, c) : null;
    GLctx.texImage2D(e, r, t, i, n, a, s, o, l);
  }
}
function _emscripten_glTexImage3D(e, r, t, i, n, a, s, o, c, l) {
  l >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage3D(e, r, t, i, n, a, s, o, c, l);
  } else if (l) {
    heapObjectForWebGLType(c);
    var _ = emscriptenWebGLGetTexPixelData(c, o, i, n * a, l);
    GLctx.texImage3D(e, r, t, i, n, a, s, o, c, _);
  } else {
    GLctx.texImage3D(e, r, t, i, n, a, s, o, c, null);
  }
}
var _emscripten_glTexParameterf = (e, r, t) => GLctx.texParameterf(e, r, t);
function _emscripten_glTexParameterfv(e, r, t) {
  t >>>= 0;
  var i = (growMemViews(), HEAPF32)[t >>> 2 >>> 0];
  GLctx.texParameterf(e, r, i);
}
var _emscripten_glTexParameteri = (e, r, t) => GLctx.texParameteri(e, r, t);
function _emscripten_glTexParameteriv(e, r, t) {
  t >>>= 0;
  var i = (growMemViews(), HEAP32)[t >>> 2 >>> 0];
  GLctx.texParameteri(e, r, i);
}
var _emscripten_glTexStorage2D = (e, r, t, i, n) => GLctx.texStorage2D(e, r, t, i, n);
var _emscripten_glTexStorage3D = (e, r, t, i, n, a) => GLctx.texStorage3D(e, r, t, i, n, a);
function _emscripten_glTexSubImage2D(e, r, t, i, n, a, s, o, c) {
  c >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage2D(e, r, t, i, n, a, s, o, c);
  } else {
    var l = c ? emscriptenWebGLGetTexPixelData(o, s, n, a, c) : null;
    GLctx.texSubImage2D(e, r, t, i, n, a, s, o, l);
  }
}
function _emscripten_glTexSubImage3D(e, r, t, i, n, a, s, o, c, l, _) {
  _ >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage3D(e, r, t, i, n, a, s, o, c, l, _);
  } else if (_) {
    heapObjectForWebGLType(l);
    var u = emscriptenWebGLGetTexPixelData(l, c, a, s * o, _);
    GLctx.texSubImage3D(e, r, t, i, n, a, s, o, c, l, u);
  } else {
    GLctx.texSubImage3D(e, r, t, i, n, a, s, o, c, l, null);
  }
}
function _emscripten_glTransformFeedbackVaryings(e, r, t, i) {
  t >>>= 0;
  e = GL.programs[e];
  var n = [];
  for (var a = 0; a < r; a++) {
    n.push(UTF8ToString((growMemViews(), HEAPU32)[t + a * 4 >>> 2 >>> 0]));
  }
  GLctx.transformFeedbackVaryings(e, n, i);
}
var webglGetUniformLocation = e => webglGetProgramUniformLocation(GLctx.currentProgram, e);
var _emscripten_glUniform1f = (e, r) => {
  GLctx.uniform1f(webglGetUniformLocation(e), r);
};
var miniTempWebGLFloatBuffers = [];
function _emscripten_glUniform1fv(e, r, t) {
  t >>>= 0;
  if (r <= 288) {
    var i = miniTempWebGLFloatBuffers[r];
    for (var n = 0; n < r; ++n) {
      i[n] = (growMemViews(), HEAPF32)[t + n * 4 >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAPF32).subarray(t >>> 2 >>> 0, t + r * 4 >>> 2 >>> 0);
  }
  GLctx.uniform1fv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform1i = (e, r) => {
  GLctx.uniform1i(webglGetUniformLocation(e), r);
};
var miniTempWebGLIntBuffers = [];
function _emscripten_glUniform1iv(e, r, t) {
  t >>>= 0;
  if (r <= 288) {
    var i = miniTempWebGLIntBuffers[r];
    for (var n = 0; n < r; ++n) {
      i[n] = (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAP32).subarray(t >>> 2 >>> 0, t + r * 4 >>> 2 >>> 0);
  }
  GLctx.uniform1iv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform1ui = (e, r) => {
  GLctx.uniform1ui(webglGetUniformLocation(e), r);
};
function _emscripten_glUniform1uiv(e, r, t) {
  t >>>= 0;
  if (r) {
    GLctx.uniform1uiv(webglGetUniformLocation(e), (growMemViews(), HEAPU32), t >>> 2, r);
  }
}
var _emscripten_glUniform2f = (e, r, t) => {
  GLctx.uniform2f(webglGetUniformLocation(e), r, t);
};
function _emscripten_glUniform2fv(e, r, t) {
  t >>>= 0;
  if (r <= 144) {
    var i = miniTempWebGLFloatBuffers[r *= 2];
    for (var n = 0; n < r; n += 2) {
      i[n] = (growMemViews(), HEAPF32)[t + n * 4 >>> 2 >>> 0];
      i[n + 1] = (growMemViews(), HEAPF32)[t + (n * 4 + 4) >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAPF32).subarray(t >>> 2 >>> 0, t + r * 8 >>> 2 >>> 0);
  }
  GLctx.uniform2fv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform2i = (e, r, t) => {
  GLctx.uniform2i(webglGetUniformLocation(e), r, t);
};
function _emscripten_glUniform2iv(e, r, t) {
  t >>>= 0;
  if (r <= 144) {
    var i = miniTempWebGLIntBuffers[r *= 2];
    for (var n = 0; n < r; n += 2) {
      i[n] = (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0];
      i[n + 1] = (growMemViews(), HEAP32)[t + (n * 4 + 4) >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAP32).subarray(t >>> 2 >>> 0, t + r * 8 >>> 2 >>> 0);
  }
  GLctx.uniform2iv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform2ui = (e, r, t) => {
  GLctx.uniform2ui(webglGetUniformLocation(e), r, t);
};
function _emscripten_glUniform2uiv(e, r, t) {
  t >>>= 0;
  if (r) {
    GLctx.uniform2uiv(webglGetUniformLocation(e), (growMemViews(), HEAPU32), t >>> 2, r * 2);
  }
}
var _emscripten_glUniform3f = (e, r, t, i) => {
  GLctx.uniform3f(webglGetUniformLocation(e), r, t, i);
};
function _emscripten_glUniform3fv(e, r, t) {
  t >>>= 0;
  if (r <= 96) {
    var i = miniTempWebGLFloatBuffers[r *= 3];
    for (var n = 0; n < r; n += 3) {
      i[n] = (growMemViews(), HEAPF32)[t + n * 4 >>> 2 >>> 0];
      i[n + 1] = (growMemViews(), HEAPF32)[t + (n * 4 + 4) >>> 2 >>> 0];
      i[n + 2] = (growMemViews(), HEAPF32)[t + (n * 4 + 8) >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAPF32).subarray(t >>> 2 >>> 0, t + r * 12 >>> 2 >>> 0);
  }
  GLctx.uniform3fv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform3i = (e, r, t, i) => {
  GLctx.uniform3i(webglGetUniformLocation(e), r, t, i);
};
function _emscripten_glUniform3iv(e, r, t) {
  t >>>= 0;
  if (r <= 96) {
    var i = miniTempWebGLIntBuffers[r *= 3];
    for (var n = 0; n < r; n += 3) {
      i[n] = (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0];
      i[n + 1] = (growMemViews(), HEAP32)[t + (n * 4 + 4) >>> 2 >>> 0];
      i[n + 2] = (growMemViews(), HEAP32)[t + (n * 4 + 8) >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAP32).subarray(t >>> 2 >>> 0, t + r * 12 >>> 2 >>> 0);
  }
  GLctx.uniform3iv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform3ui = (e, r, t, i) => {
  GLctx.uniform3ui(webglGetUniformLocation(e), r, t, i);
};
function _emscripten_glUniform3uiv(e, r, t) {
  t >>>= 0;
  if (r) {
    GLctx.uniform3uiv(webglGetUniformLocation(e), (growMemViews(), HEAPU32), t >>> 2, r * 3);
  }
}
var _emscripten_glUniform4f = (e, r, t, i, n) => {
  GLctx.uniform4f(webglGetUniformLocation(e), r, t, i, n);
};
function _emscripten_glUniform4fv(e, r, t) {
  t >>>= 0;
  if (r <= 72) {
    var i = miniTempWebGLFloatBuffers[r * 4];
    growMemViews();
    var n = HEAPF32;
    t >>>= 2;
    r *= 4;
    for (var a = 0; a < r; a += 4) {
      var s = t + a;
      i[a] = n[s >>> 0];
      i[a + 1] = n[s + 1 >>> 0];
      i[a + 2] = n[s + 2 >>> 0];
      i[a + 3] = n[s + 3 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAPF32).subarray(t >>> 2 >>> 0, t + r * 16 >>> 2 >>> 0);
  }
  GLctx.uniform4fv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform4i = (e, r, t, i, n) => {
  GLctx.uniform4i(webglGetUniformLocation(e), r, t, i, n);
};
function _emscripten_glUniform4iv(e, r, t) {
  t >>>= 0;
  if (r <= 72) {
    var i = miniTempWebGLIntBuffers[r *= 4];
    for (var n = 0; n < r; n += 4) {
      i[n] = (growMemViews(), HEAP32)[t + n * 4 >>> 2 >>> 0];
      i[n + 1] = (growMemViews(), HEAP32)[t + (n * 4 + 4) >>> 2 >>> 0];
      i[n + 2] = (growMemViews(), HEAP32)[t + (n * 4 + 8) >>> 2 >>> 0];
      i[n + 3] = (growMemViews(), HEAP32)[t + (n * 4 + 12) >>> 2 >>> 0];
    }
  } else {
    i = (growMemViews(), HEAP32).subarray(t >>> 2 >>> 0, t + r * 16 >>> 2 >>> 0);
  }
  GLctx.uniform4iv(webglGetUniformLocation(e), i);
}
var _emscripten_glUniform4ui = (e, r, t, i, n) => {
  GLctx.uniform4ui(webglGetUniformLocation(e), r, t, i, n);
};
function _emscripten_glUniform4uiv(e, r, t) {
  t >>>= 0;
  if (r) {
    GLctx.uniform4uiv(webglGetUniformLocation(e), (growMemViews(), HEAPU32), t >>> 2, r * 4);
  }
}
var _emscripten_glUniformBlockBinding = (e, r, t) => {
  e = GL.programs[e];
  GLctx.uniformBlockBinding(e, r, t);
};
function _emscripten_glUniformMatrix2fv(e, r, t, i) {
  i >>>= 0;
  if (r <= 72) {
    var n = miniTempWebGLFloatBuffers[r *= 4];
    for (var a = 0; a < r; a += 4) {
      n[a] = (growMemViews(), HEAPF32)[i + a * 4 >>> 2 >>> 0];
      n[a + 1] = (growMemViews(), HEAPF32)[i + (a * 4 + 4) >>> 2 >>> 0];
      n[a + 2] = (growMemViews(), HEAPF32)[i + (a * 4 + 8) >>> 2 >>> 0];
      n[a + 3] = (growMemViews(), HEAPF32)[i + (a * 4 + 12) >>> 2 >>> 0];
    }
  } else {
    n = (growMemViews(), HEAPF32).subarray(i >>> 2 >>> 0, i + r * 16 >>> 2 >>> 0);
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(e), !!t, n);
}
function _emscripten_glUniformMatrix2x3fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix2x3fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 6);
  }
}
function _emscripten_glUniformMatrix2x4fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix2x4fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 8);
  }
}
function _emscripten_glUniformMatrix3fv(e, r, t, i) {
  i >>>= 0;
  if (r <= 32) {
    var n = miniTempWebGLFloatBuffers[r *= 9];
    for (var a = 0; a < r; a += 9) {
      n[a] = (growMemViews(), HEAPF32)[i + a * 4 >>> 2 >>> 0];
      n[a + 1] = (growMemViews(), HEAPF32)[i + (a * 4 + 4) >>> 2 >>> 0];
      n[a + 2] = (growMemViews(), HEAPF32)[i + (a * 4 + 8) >>> 2 >>> 0];
      n[a + 3] = (growMemViews(), HEAPF32)[i + (a * 4 + 12) >>> 2 >>> 0];
      n[a + 4] = (growMemViews(), HEAPF32)[i + (a * 4 + 16) >>> 2 >>> 0];
      n[a + 5] = (growMemViews(), HEAPF32)[i + (a * 4 + 20) >>> 2 >>> 0];
      n[a + 6] = (growMemViews(), HEAPF32)[i + (a * 4 + 24) >>> 2 >>> 0];
      n[a + 7] = (growMemViews(), HEAPF32)[i + (a * 4 + 28) >>> 2 >>> 0];
      n[a + 8] = (growMemViews(), HEAPF32)[i + (a * 4 + 32) >>> 2 >>> 0];
    }
  } else {
    n = (growMemViews(), HEAPF32).subarray(i >>> 2 >>> 0, i + r * 36 >>> 2 >>> 0);
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(e), !!t, n);
}
function _emscripten_glUniformMatrix3x2fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix3x2fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 6);
  }
}
function _emscripten_glUniformMatrix3x4fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix3x4fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 12);
  }
}
function _emscripten_glUniformMatrix4fv(e, r, t, i) {
  i >>>= 0;
  if (r <= 18) {
    var n = miniTempWebGLFloatBuffers[r * 16];
    growMemViews();
    var a = HEAPF32;
    i >>>= 2;
    r *= 16;
    for (var s = 0; s < r; s += 16) {
      var o = i + s;
      n[s] = a[o >>> 0];
      n[s + 1] = a[o + 1 >>> 0];
      n[s + 2] = a[o + 2 >>> 0];
      n[s + 3] = a[o + 3 >>> 0];
      n[s + 4] = a[o + 4 >>> 0];
      n[s + 5] = a[o + 5 >>> 0];
      n[s + 6] = a[o + 6 >>> 0];
      n[s + 7] = a[o + 7 >>> 0];
      n[s + 8] = a[o + 8 >>> 0];
      n[s + 9] = a[o + 9 >>> 0];
      n[s + 10] = a[o + 10 >>> 0];
      n[s + 11] = a[o + 11 >>> 0];
      n[s + 12] = a[o + 12 >>> 0];
      n[s + 13] = a[o + 13 >>> 0];
      n[s + 14] = a[o + 14 >>> 0];
      n[s + 15] = a[o + 15 >>> 0];
    }
  } else {
    n = (growMemViews(), HEAPF32).subarray(i >>> 2 >>> 0, i + r * 64 >>> 2 >>> 0);
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(e), !!t, n);
}
function _emscripten_glUniformMatrix4x2fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix4x2fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 8);
  }
}
function _emscripten_glUniformMatrix4x3fv(e, r, t, i) {
  i >>>= 0;
  if (r) {
    GLctx.uniformMatrix4x3fv(webglGetUniformLocation(e), !!t, (growMemViews(), HEAPF32), i >>> 2, r * 12);
  }
}
var _emscripten_glUnmapBuffer = e => {
  if (!emscriptenWebGLValidateMapBufferTarget(e)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glUnmapBuffer");
    return 0;
  }
  var r = emscriptenWebGLGetBufferBinding(e);
  var t = GL.mappedBuffers[r];
  if (t && t.mem) {
    if (!(t.access & 16)) {
      webglBufferSubData(e, t.offset, t.length, t.mem);
    }
    _free(t.mem);
    t.mem = 0;
    return 1;
  } else {
    GL.recordError(1282);
    err("buffer was never mapped in glUnmapBuffer");
    return 0;
  }
};
var _emscripten_glUseProgram = e => {
  e = GL.programs[e];
  GLctx.useProgram(e);
  GLctx.currentProgram = e;
};
var _emscripten_glValidateProgram = e => {
  GLctx.validateProgram(GL.programs[e]);
};
var _emscripten_glVertexAttrib1f = (e, r) => GLctx.vertexAttrib1f(e, r);
function _emscripten_glVertexAttrib1fv(e, r) {
  r >>>= 0;
  GLctx.vertexAttrib1f(e, (growMemViews(), HEAPF32)[r >>> 2]);
}
var _emscripten_glVertexAttrib2f = (e, r, t) => GLctx.vertexAttrib2f(e, r, t);
function _emscripten_glVertexAttrib2fv(e, r) {
  r >>>= 0;
  GLctx.vertexAttrib2f(e, (growMemViews(), HEAPF32)[r >>> 2], (growMemViews(), HEAPF32)[r + 4 >>> 2]);
}
var _emscripten_glVertexAttrib3f = (e, r, t, i) => GLctx.vertexAttrib3f(e, r, t, i);
function _emscripten_glVertexAttrib3fv(e, r) {
  r >>>= 0;
  GLctx.vertexAttrib3f(e, (growMemViews(), HEAPF32)[r >>> 2], (growMemViews(), HEAPF32)[r + 4 >>> 2], (growMemViews(), HEAPF32)[r + 8 >>> 2]);
}
var _emscripten_glVertexAttrib4f = (e, r, t, i, n) => GLctx.vertexAttrib4f(e, r, t, i, n);
function _emscripten_glVertexAttrib4fv(e, r) {
  r >>>= 0;
  GLctx.vertexAttrib4f(e, (growMemViews(), HEAPF32)[r >>> 2], (growMemViews(), HEAPF32)[r + 4 >>> 2], (growMemViews(), HEAPF32)[r + 8 >>> 2], (growMemViews(), HEAPF32)[r + 12 >>> 2]);
}
var _emscripten_glVertexAttribDivisor = (e, r) => {
  GLctx.vertexAttribDivisor(e, r);
};
var _glVertexAttribDivisor = _emscripten_glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorANGLE = _emscripten_glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorARB = _emscripten_glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorEXT = _emscripten_glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorNV = _emscripten_glVertexAttribDivisor;
var _emscripten_glVertexAttribI4i = (e, r, t, i, n) => GLctx.vertexAttribI4i(e, r, t, i, n);
function _emscripten_glVertexAttribI4iv(e, r) {
  r >>>= 0;
  GLctx.vertexAttribI4i(e, (growMemViews(), HEAP32)[r >>> 2], (growMemViews(), HEAP32)[r + 4 >>> 2], (growMemViews(), HEAP32)[r + 8 >>> 2], (growMemViews(), HEAP32)[r + 12 >>> 2]);
}
var _emscripten_glVertexAttribI4ui = (e, r, t, i, n) => GLctx.vertexAttribI4ui(e, r, t, i, n);
function _emscripten_glVertexAttribI4uiv(e, r) {
  r >>>= 0;
  GLctx.vertexAttribI4ui(e, (growMemViews(), HEAPU32)[r >>> 2], (growMemViews(), HEAPU32)[r + 4 >>> 2], (growMemViews(), HEAPU32)[r + 8 >>> 2], (growMemViews(), HEAPU32)[r + 12 >>> 2]);
}
function _emscripten_glVertexAttribIPointer(e, r, t, i, n) {
  n >>>= 0;
  var a = GL.currentContext.clientBuffers[e];
  if (!GLctx.currentArrayBufferBinding) {
    a.size = r;
    a.type = t;
    a.normalized = false;
    a.stride = i;
    a.ptr = n;
    a.clientside = true;
    a.vertexAttribPointerAdaptor = function (e, r, t, i, n, a) {
      this.vertexAttribIPointer(e, r, t, n, a);
    };
    return;
  }
  a.clientside = false;
  GLctx.vertexAttribIPointer(e, r, t, i, n);
}
function _emscripten_glVertexAttribPointer(e, r, t, i, n, a) {
  a >>>= 0;
  var s = GL.currentContext.clientBuffers[e];
  if (!GLctx.currentArrayBufferBinding) {
    s.size = r;
    s.type = t;
    s.normalized = i;
    s.stride = n;
    s.ptr = a;
    s.clientside = true;
    s.vertexAttribPointerAdaptor = function (e, r, t, i, n, a) {
      this.vertexAttribPointer(e, r, t, i, n, a);
    };
    return;
  }
  s.clientside = false;
  GLctx.vertexAttribPointer(e, r, t, !!i, n, a);
}
var _emscripten_glViewport = (e, r, t, i) => GLctx.viewport(e, r, t, i);
function _emscripten_glWaitSync(e, r, t) {
  e >>>= 0;
  t = Number(t);
  GLctx.waitSync(GL.syncs[e], r, t);
}
var _emscripten_has_asyncify = () => 0;
function _emscripten_out(e) {
  return out(UTF8ToString(e >>>= 0));
}
var doRequestFullscreen = (e, r) => JSEvents.fullscreenEnabled() ? (e = findEventTarget(e)) ? e.requestFullscreen ? JSEvents.canPerformEventHandlerRequests() ? JSEvents_requestFullscreen(e, r) : r.deferUntilInEventHandler ? (JSEvents.deferCall(JSEvents_requestFullscreen, 1, [e, r]), 1) : -2 : -3 : -4 : -1;
function _emscripten_request_fullscreen_strategy(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(55, 0, 1, e, r, t);
  }
  e >>>= 0;
  t >>>= 0;
  var i = {
    scaleMode: (growMemViews(), HEAP32)[t >>> 2 >>> 0],
    canvasResolutionScaleMode: (growMemViews(), HEAP32)[t + 4 >>> 2 >>> 0],
    filteringMode: (growMemViews(), HEAP32)[t + 8 >>> 2 >>> 0],
    deferUntilInEventHandler: r,
    canvasResizedCallbackTargetThread: (growMemViews(), HEAP32)[t + 20 >>> 2 >>> 0],
    canvasResizedCallback: (growMemViews(), HEAP32)[t + 12 >>> 2 >>> 0],
    canvasResizedCallbackUserData: (growMemViews(), HEAP32)[t + 16 >>> 2 >>> 0]
  };
  return doRequestFullscreen(e, i);
}
function _emscripten_request_pointerlock(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(56, 0, 1, e, r);
  } else if (e = findEventTarget(e >>>= 0)) {
    if (e.requestPointerLock) {
      if (JSEvents.canPerformEventHandlerRequests()) {
        return requestPointerLock(e);
      } else if (r) {
        JSEvents.deferCall(requestPointerLock, 2, [e]);
        return 1;
      } else {
        return -2;
      }
    } else {
      return -1;
    }
  } else {
    return -4;
  }
}
var getHeapMax = () => 4294901760;
var alignMemory = (e, r) => Math.ceil(e / r) * r;
var growMemory = e => {
  var r = (e - wasmMemory.buffer.byteLength + 65535) / 65536 | 0;
  try {
    wasmMemory.grow(r);
    updateMemoryViews();
    return 1;
  } catch (e) {}
};
function _emscripten_resize_heap(e) {
  e >>>= 0;
  var r = (growMemViews(), HEAPU8).length;
  if (e <= r) {
    return false;
  }
  var t = getHeapMax();
  if (e > t) {
    return false;
  }
  for (var i = 1; i <= 4; i *= 2) {
    var n = r * (1 + 0.2 / i);
    n = Math.min(n, e + 100663296);
    var a = Math.min(t, alignMemory(Math.max(e, n), 65536));
    if (growMemory(a)) {
      return true;
    }
  }
  return false;
}
var _emscripten_runtime_keepalive_check = keepRuntimeAlive;
function _emscripten_sample_gamepad_data() {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(57, 0, 1);
  }
  try {
    if (navigator.getGamepads) {
      if (JSEvents.lastGamepadState = navigator.getGamepads()) {
        return 0;
      } else {
        return -1;
      }
    }
  } catch (e) {
    navigator.getGamepads = null;
  }
  return -1;
}
var registerBeforeUnloadEventCallback = (e, r, t, i, n, a) => {
  var s = {
    target: findEventTarget(e),
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = dynCall_iiii(i, n, 0, r);
      t &&= UTF8ToString(t);
      if (t) {
        e.preventDefault();
        e.returnValue = t;
        return t;
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(s);
};
function _emscripten_set_beforeunload_callback_on_thread(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(58, 0, 1, e, r, t);
  } else {
    e >>>= 0;
    r >>>= 0;
    t >>>= 0;
    if (typeof onbeforeunload == "undefined") {
      return -1;
    } else if (t !== 1) {
      return -5;
    } else {
      return registerBeforeUnloadEventCallback(2, e, true, r, 28, "beforeunload");
    }
  }
}
var registerFocusEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.focusEvent ||= _malloc(256);
  var o = {
    target: findEventTarget(e),
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.getNodeNameForTarget(e.target);
      var a = e.target.id ?? "";
      var o = JSEvents.focusEvent;
      stringToUTF8(t, o + 0, 128);
      stringToUTF8(a, o + 128, 128);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, o, 256, r);
      } else if (dynCall_iiii(i, n, o, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_blur_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(59, 0, 1, e, r, t, i, n);
  } else {
    return registerFocusEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 12, "blur", n >>>= 0);
  }
}
function _emscripten_set_element_css_size(e, r, t) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(60, 0, 1, e, r, t);
  } else if (e = findEventTarget(e >>>= 0)) {
    e.style.width = r + "px";
    e.style.height = t + "px";
    return 0;
  } else {
    return -4;
  }
}
function _emscripten_set_focus_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(61, 0, 1, e, r, t, i, n);
  } else {
    return registerFocusEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 13, "focus", n >>>= 0);
  }
}
var fillFullscreenChangeEventData = e => {
  var r = getFullscreenElement();
  var t = !!r;
  (growMemViews(), HEAP8)[e >>> 0] = t;
  (growMemViews(), HEAP8)[e + 1 >>> 0] = JSEvents.fullscreenEnabled();
  var i = t ? r : JSEvents.previousFullscreenElement;
  var n = JSEvents.getNodeNameForTarget(i);
  var a = i?.id ?? "";
  stringToUTF8(n, e + 2, 128);
  stringToUTF8(a, e + 130, 128);
  (growMemViews(), HEAP32)[e + 260 >>> 2 >>> 0] = i?.clientWidth ?? 0;
  (growMemViews(), HEAP32)[e + 264 >>> 2 >>> 0] = i?.clientHeight ?? 0;
  (growMemViews(), HEAP32)[e + 268 >>> 2 >>> 0] = screen.width;
  (growMemViews(), HEAP32)[e + 272 >>> 2 >>> 0] = screen.height;
  if (t) {
    JSEvents.previousFullscreenElement = r;
  }
};
var registerFullscreenChangeEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.fullscreenChangeEvent ||= _malloc(276);
  var o = {
    target: e,
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.fullscreenChangeEvent;
      fillFullscreenChangeEventData(t);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, t, 276, r);
      } else if (dynCall_iiii(i, n, t, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_fullscreenchange_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(62, 0, 1, e, r, t, i, n);
  } else {
    e >>>= 0;
    r >>>= 0;
    i >>>= 0;
    n >>>= 0;
    if (JSEvents.fullscreenEnabled()) {
      if (e = findEventTarget(e)) {
        return registerFullscreenChangeEventCallback(e, r, t, i, 19, "fullscreenchange", n);
      } else {
        return -4;
      }
    } else {
      return -1;
    }
  }
}
var registerGamepadEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.gamepadEvent ||= _malloc(1240);
  var o = {
    target: findEventTarget(e),
    allowsDeferredCalls: true,
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.gamepadEvent;
      fillGamepadEventData(t, e.gamepad);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, t, 1240, r);
      } else if (dynCall_iiii(i, n, t, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_gamepadconnected_callback_on_thread(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(63, 0, 1, e, r, t, i);
  } else {
    e >>>= 0;
    t >>>= 0;
    i >>>= 0;
    if (_emscripten_sample_gamepad_data()) {
      return -1;
    } else {
      return registerGamepadEventCallback(2, e, r, t, 26, "gamepadconnected", i);
    }
  }
}
function _emscripten_set_gamepaddisconnected_callback_on_thread(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(64, 0, 1, e, r, t, i);
  } else {
    e >>>= 0;
    t >>>= 0;
    i >>>= 0;
    if (_emscripten_sample_gamepad_data()) {
      return -1;
    } else {
      return registerGamepadEventCallback(2, e, r, t, 27, "gamepaddisconnected", i);
    }
  }
}
var registerKeyEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.keyEvent ||= _malloc(160);
  var o = {
    target: findEventTarget(e),
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.keyEvent;
      (growMemViews(), HEAPF64)[t >>> 3 >>> 0] = e.timeStamp;
      var a = t >>> 2;
      (growMemViews(), HEAP32)[a + 2 >>> 0] = e.location;
      (growMemViews(), HEAP8)[t + 12 >>> 0] = e.ctrlKey;
      (growMemViews(), HEAP8)[t + 13 >>> 0] = e.shiftKey;
      (growMemViews(), HEAP8)[t + 14 >>> 0] = e.altKey;
      (growMemViews(), HEAP8)[t + 15 >>> 0] = e.metaKey;
      (growMemViews(), HEAP8)[t + 16 >>> 0] = e.repeat;
      (growMemViews(), HEAP32)[a + 5 >>> 0] = e.charCode;
      (growMemViews(), HEAP32)[a + 6 >>> 0] = e.keyCode;
      (growMemViews(), HEAP32)[a + 7 >>> 0] = e.which;
      stringToUTF8(e.key ?? "", t + 32, 32);
      stringToUTF8(e.code ?? "", t + 64, 32);
      stringToUTF8(e.char ?? "", t + 96, 32);
      stringToUTF8(e.locale ?? "", t + 128, 32);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, t, 160, r);
      } else if (dynCall_iiii(i, n, t, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_keydown_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(65, 0, 1, e, r, t, i, n);
  } else {
    return registerKeyEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 2, "keydown", n >>>= 0);
  }
}
function _emscripten_set_keypress_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(66, 0, 1, e, r, t, i, n);
  } else {
    return registerKeyEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 1, "keypress", n >>>= 0);
  }
}
function _emscripten_set_keyup_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(67, 0, 1, e, r, t, i, n);
  } else {
    return registerKeyEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 3, "keyup", n >>>= 0);
  }
}
var _emscripten_set_main_loop = function (e, r, t) {
  e >>>= 0;
  setMainLoop(() => dynCall_v(e), r, t);
};
var fillMouseEventData = (e, r, t) => {
  (growMemViews(), HEAPF64)[e >>> 3 >>> 0] = r.timeStamp;
  var i = e >>> 2;
  (growMemViews(), HEAP32)[i + 2 >>> 0] = r.screenX;
  (growMemViews(), HEAP32)[i + 3 >>> 0] = r.screenY;
  (growMemViews(), HEAP32)[i + 4 >>> 0] = r.clientX;
  (growMemViews(), HEAP32)[i + 5 >>> 0] = r.clientY;
  (growMemViews(), HEAP8)[e + 24 >>> 0] = r.ctrlKey;
  (growMemViews(), HEAP8)[e + 25 >>> 0] = r.shiftKey;
  (growMemViews(), HEAP8)[e + 26 >>> 0] = r.altKey;
  (growMemViews(), HEAP8)[e + 27 >>> 0] = r.metaKey;
  (growMemViews(), HEAP16)[i * 2 + 14 >>> 0] = r.button;
  (growMemViews(), HEAP16)[i * 2 + 15 >>> 0] = r.buttons;
  (growMemViews(), HEAP32)[i + 8 >>> 0] = r.movementX;
  (growMemViews(), HEAP32)[i + 9 >>> 0] = r.movementY;
  var n = getBoundingClientRect(t);
  (growMemViews(), HEAP32)[i + 10 >>> 0] = r.clientX - (n.left | 0);
  (growMemViews(), HEAP32)[i + 11 >>> 0] = r.clientY - (n.top | 0);
};
var registerMouseEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.mouseEvent ||= _malloc(64);
  var o = {
    target: e = findEventTarget(e),
    allowsDeferredCalls: a != "mousemove" && a != "mouseenter" && a != "mouseleave",
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: t => {
      var a;
      var o;
      fillMouseEventData(JSEvents.mouseEvent, t, e);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, JSEvents.mouseEvent, 64, r);
      } else {
        a = n;
        o = JSEvents.mouseEvent;
        if (dynCall_iiii(i, a, o, r)) {
          t.preventDefault();
        }
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_mousedown_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(68, 0, 1, e, r, t, i, n);
  } else {
    return registerMouseEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 5, "mousedown", n >>>= 0);
  }
}
function _emscripten_set_mouseenter_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(69, 0, 1, e, r, t, i, n);
  } else {
    return registerMouseEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 33, "mouseenter", n >>>= 0);
  }
}
function _emscripten_set_mouseleave_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(70, 0, 1, e, r, t, i, n);
  } else {
    return registerMouseEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 34, "mouseleave", n >>>= 0);
  }
}
function _emscripten_set_mousemove_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(71, 0, 1, e, r, t, i, n);
  } else {
    return registerMouseEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 8, "mousemove", n >>>= 0);
  }
}
function _emscripten_set_mouseup_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(72, 0, 1, e, r, t, i, n);
  } else {
    return registerMouseEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 6, "mouseup", n >>>= 0);
  }
}
var fillPointerlockChangeEventData = e => {
  var r = document.pointerLockElement;
  var t = !!r;
  (growMemViews(), HEAP8)[e >>> 0] = t;
  var i = JSEvents.getNodeNameForTarget(r);
  var n = r?.id ?? "";
  stringToUTF8(i, e + 1, 128);
  stringToUTF8(n, e + 129, 128);
};
var registerPointerlockChangeEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.pointerlockChangeEvent ||= _malloc(257);
  var o = {
    target: e,
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.pointerlockChangeEvent;
      fillPointerlockChangeEventData(t);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, t, 257, r);
      } else if (dynCall_iiii(i, n, t, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_pointerlockchange_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(73, 0, 1, e, r, t, i, n);
  } else {
    e >>>= 0;
    r >>>= 0;
    i >>>= 0;
    n >>>= 0;
    if (document.body?.requestPointerLock) {
      if (e = findEventTarget(e)) {
        return registerPointerlockChangeEventCallback(e, r, t, i, 20, "pointerlockchange", n);
      } else {
        return -4;
      }
    } else {
      return -1;
    }
  }
}
var registerUiEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.uiEvent ||= _malloc(36);
  var o = {
    target: e = findEventTarget(e),
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: t => {
      if (t.target == e) {
        var a = document.body;
        if (a) {
          var o = JSEvents.uiEvent;
          (growMemViews(), HEAP32)[o >>> 2 >>> 0] = 0;
          (growMemViews(), HEAP32)[o + 4 >>> 2 >>> 0] = a.clientWidth;
          (growMemViews(), HEAP32)[o + 8 >>> 2 >>> 0] = a.clientHeight;
          (growMemViews(), HEAP32)[o + 12 >>> 2 >>> 0] = innerWidth;
          (growMemViews(), HEAP32)[o + 16 >>> 2 >>> 0] = innerHeight;
          (growMemViews(), HEAP32)[o + 20 >>> 2 >>> 0] = outerWidth;
          (growMemViews(), HEAP32)[o + 24 >>> 2 >>> 0] = outerHeight;
          (growMemViews(), HEAP32)[o + 28 >>> 2 >>> 0] = pageXOffset | 0;
          (growMemViews(), HEAP32)[o + 32 >>> 2 >>> 0] = pageYOffset | 0;
          if (s) {
            __emscripten_run_callback_on_thread(s, i, n, o, 36, r);
          } else if (dynCall_iiii(i, n, o, r)) {
            t.preventDefault();
          }
        }
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_resize_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(74, 0, 1, e, r, t, i, n);
  } else {
    return registerUiEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 10, "resize", n >>>= 0);
  }
}
var registerTouchEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.touchEvent ||= _malloc(1552);
  var o = {
    target: e = findEventTarget(e),
    allowsDeferredCalls: a == "touchstart" || a == "touchend",
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: t => {
      var a = {};
      var o = t.touches;
      for (let e of o) {
        e.isChanged = e.onTarget = 0;
        a[e.identifier] = e;
      }
      for (let e of t.changedTouches) {
        e.isChanged = 1;
        a[e.identifier] = e;
      }
      for (let e of t.targetTouches) {
        a[e.identifier].onTarget = 1;
      }
      var c = JSEvents.touchEvent;
      (growMemViews(), HEAPF64)[c >>> 3 >>> 0] = t.timeStamp;
      (growMemViews(), HEAP8)[c + 12 >>> 0] = t.ctrlKey;
      (growMemViews(), HEAP8)[c + 13 >>> 0] = t.shiftKey;
      (growMemViews(), HEAP8)[c + 14 >>> 0] = t.altKey;
      (growMemViews(), HEAP8)[c + 15 >>> 0] = t.metaKey;
      var l = c + 16;
      var _ = getBoundingClientRect(e);
      var u = 0;
      for (let e of Object.values(a)) {
        var m = l >>> 2;
        (growMemViews(), HEAP32)[m + 0 >>> 0] = e.identifier;
        (growMemViews(), HEAP32)[m + 1 >>> 0] = e.screenX;
        (growMemViews(), HEAP32)[m + 2 >>> 0] = e.screenY;
        (growMemViews(), HEAP32)[m + 3 >>> 0] = e.clientX;
        (growMemViews(), HEAP32)[m + 4 >>> 0] = e.clientY;
        (growMemViews(), HEAP32)[m + 5 >>> 0] = e.pageX;
        (growMemViews(), HEAP32)[m + 6 >>> 0] = e.pageY;
        (growMemViews(), HEAP8)[l + 28 >>> 0] = e.isChanged;
        (growMemViews(), HEAP8)[l + 29 >>> 0] = e.onTarget;
        (growMemViews(), HEAP32)[m + 8 >>> 0] = e.clientX - (_.left | 0);
        (growMemViews(), HEAP32)[m + 9 >>> 0] = e.clientY - (_.top | 0);
        l += 48;
        if (++u > 31) {
          break;
        }
      }
      (growMemViews(), HEAP32)[c + 8 >>> 2 >>> 0] = u;
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, c, 1552, r);
      } else if (dynCall_iiii(i, n, c, r)) {
        t.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_touchcancel_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(75, 0, 1, e, r, t, i, n);
  } else {
    return registerTouchEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 25, "touchcancel", n >>>= 0);
  }
}
function _emscripten_set_touchend_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(76, 0, 1, e, r, t, i, n);
  } else {
    return registerTouchEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 23, "touchend", n >>>= 0);
  }
}
function _emscripten_set_touchmove_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(77, 0, 1, e, r, t, i, n);
  } else {
    return registerTouchEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 24, "touchmove", n >>>= 0);
  }
}
function _emscripten_set_touchstart_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(78, 0, 1, e, r, t, i, n);
  } else {
    return registerTouchEventCallback(e >>>= 0, r >>>= 0, t, i >>>= 0, 22, "touchstart", n >>>= 0);
  }
}
var fillVisibilityChangeEventData = e => {
  var r = ["hidden", "visible", "prerender", "unloaded"].indexOf(document.visibilityState);
  (growMemViews(), HEAP8)[e >>> 0] = document.hidden;
  (growMemViews(), HEAP32)[e + 4 >>> 2 >>> 0] = r;
};
var registerVisibilityChangeEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.visibilityChangeEvent ||= _malloc(8);
  var o = {
    target: e,
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: e => {
      var t = JSEvents.visibilityChangeEvent;
      fillVisibilityChangeEventData(t);
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, t, 8, r);
      } else if (dynCall_iiii(i, n, t, r)) {
        e.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_visibilitychange_callback_on_thread(e, r, t, i) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(79, 0, 1, e, r, t, i);
  } else {
    e >>>= 0;
    t >>>= 0;
    i >>>= 0;
    if (specialHTMLTargets[1]) {
      return registerVisibilityChangeEventCallback(specialHTMLTargets[1], e, r, t, 21, "visibilitychange", i);
    } else {
      return -4;
    }
  }
}
var registerWheelEventCallback = (e, r, t, i, n, a, s) => {
  s = JSEvents.getTargetThreadForEventCallback(s);
  JSEvents.wheelEvent ||= _malloc(96);
  var o = {
    target: e,
    allowsDeferredCalls: true,
    eventTypeString: a,
    eventTypeId: n,
    userData: r,
    callbackfunc: i,
    handlerFunc: t => {
      var a = JSEvents.wheelEvent;
      fillMouseEventData(a, t, e);
      (growMemViews(), HEAPF64)[a + 64 >>> 3 >>> 0] = t.deltaX;
      (growMemViews(), HEAPF64)[a + 72 >>> 3 >>> 0] = t.deltaY;
      (growMemViews(), HEAPF64)[a + 80 >>> 3 >>> 0] = t.deltaZ;
      (growMemViews(), HEAP32)[a + 88 >>> 2 >>> 0] = t.deltaMode;
      if (s) {
        __emscripten_run_callback_on_thread(s, i, n, a, 96, r);
      } else if (dynCall_iiii(i, n, a, r)) {
        t.preventDefault();
      }
    },
    useCapture: t
  };
  return JSEvents.registerOrRemoveHandler(o);
};
function _emscripten_set_wheel_callback_on_thread(e, r, t, i, n) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(80, 0, 1, e, r, t, i, n);
  } else {
    r >>>= 0;
    i >>>= 0;
    n >>>= 0;
    if (e = findEventTarget(e >>>= 0)) {
      if (e.onwheel !== undefined) {
        return registerWheelEventCallback(e, r, t, i, 9, "wheel", n);
      } else {
        return -1;
      }
    } else {
      return -4;
    }
  }
}
function _emscripten_set_window_title(e) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(81, 0, 1, e);
  } else {
    e >>>= 0;
    return document.title = UTF8ToString(e);
  }
}
var _emscripten_sleep = () => {
  abort("Please compile your program with async support in order to use asynchronous operations like emscripten_sleep");
};
var _emscripten_unwind_to_js_event_loop = () => {
  throw "unwind";
};
var _emscripten_webgl_do_commit_frame = () => GL.currentContext && GL.currentContext.GLctx && GL.currentContext.attributes.explicitSwapControl ? 0 : -3;
var _emscripten_webgl_commit_frame = _emscripten_webgl_do_commit_frame;
var _emscripten_supports_offscreencanvas = () => typeof OffscreenCanvas != "undefined";
var webglPowerPreferences = ["default", "low-power", "high-performance"];
function _emscripten_webgl_do_create_context(e, r) {
  e >>>= 0;
  var t = (r >>>= 0) >>> 2;
  var i = (growMemViews(), HEAP32)[t + 2 >>> 0];
  var n = {
    alpha: !!(growMemViews(), HEAP8)[r + 0 >>> 0],
    depth: !!(growMemViews(), HEAP8)[r + 1 >>> 0],
    stencil: !!(growMemViews(), HEAP8)[r + 2 >>> 0],
    antialias: !!(growMemViews(), HEAP8)[r + 3 >>> 0],
    premultipliedAlpha: !!(growMemViews(), HEAP8)[r + 4 >>> 0],
    preserveDrawingBuffer: !!(growMemViews(), HEAP8)[r + 5 >>> 0],
    powerPreference: webglPowerPreferences[i],
    failIfMajorPerformanceCaveat: !!(growMemViews(), HEAP8)[r + 12 >>> 0],
    desynchronized: !!(growMemViews(), HEAP8)[r + 33 >>> 0],
    majorVersion: (growMemViews(), HEAP32)[t + 4 >>> 0],
    minorVersion: (growMemViews(), HEAP32)[t + 5 >>> 0],
    enableExtensionsByDefault: (growMemViews(), HEAP8)[r + 24 >>> 0],
    explicitSwapControl: (growMemViews(), HEAP8)[r + 25 >>> 0],
    proxyContextToMainThread: (growMemViews(), HEAP32)[t + 7 >>> 0],
    renderViaOffscreenBackBuffer: (growMemViews(), HEAP8)[r + 32 >>> 0]
  };
  var a = findCanvasEventTarget(e);
  if (a?.canvas) {
    a = a.canvas;
  }
  if (!a) {
    return 0;
  }
  if (a.offscreenCanvas) {
    a = a.offscreenCanvas;
  }
  if (n.explicitSwapControl) {
    if (!a.transferControlToOffscreen && (!_emscripten_supports_offscreencanvas() || !(a instanceof OffscreenCanvas))) {
      return 0;
    }
    if (a.transferControlToOffscreen) {
      if (a.controlTransferredOffscreen) {
        if (!GL.offscreenCanvases[a.id]) {
          return 0;
        }
      } else {
        GL.offscreenCanvases[a.id] = {
          canvas: a.transferControlToOffscreen(),
          canvasSharedPtr: _malloc(12),
          id: a.id
        };
        a.controlTransferredOffscreen = true;
      }
      a = GL.offscreenCanvases[a.id].canvas;
    }
  }
  return GL.createContext(a, n);
}
var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;
var _emscripten_webgl_destroy_context_calling_thread = e => {
  if (GL.currentContext == e) {
    GL.currentContext = 0;
  }
  GL.deleteContext(e);
};
var _emscripten_webgl_destroy_context_main_thread = _emscripten_webgl_destroy_context_calling_thread;
function _emscripten_webgl_destroy_context(e) {
  e >>>= 0;
  if (GL.contexts[e]) {
    return _emscripten_webgl_destroy_context_calling_thread(e);
  } else {
    return _emscripten_webgl_destroy_context_main_thread(e);
  }
}
var _emscripten_webgl_enable_extension_calling_thread = (e, r) => {
  var t = GL.getContext(e);
  var i = UTF8ToString(r);
  if (i.startsWith("GL_")) {
    i = i.slice(3);
  }
  if (i == "WEBGL_draw_instanced_base_vertex_base_instance") {
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
  }
  if (i == "WEBGL_multi_draw_instanced_base_vertex_base_instance") {
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
  }
  if (i == "WEBGL_multi_draw") {
    webgl_enable_WEBGL_multi_draw(GLctx);
  }
  if (i == "EXT_polygon_offset_clamp") {
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
  }
  if (i == "EXT_clip_control") {
    webgl_enable_EXT_clip_control(GLctx);
  }
  if (i == "WEBGL_polygon_mode") {
    webgl_enable_WEBGL_polygon_mode(GLctx);
  }
  return !!t.GLctx.getExtension(i);
};
var _emscripten_webgl_enable_extension_main_thread = _emscripten_webgl_enable_extension_calling_thread;
function _emscripten_webgl_enable_extension(e, r) {
  e >>>= 0;
  r >>>= 0;
  if (GL.contexts[e]) {
    return _emscripten_webgl_enable_extension_calling_thread(e, r);
  } else {
    return _emscripten_webgl_enable_extension_main_thread(e, r);
  }
}
function _emscripten_webgl_do_get_current_context() {
  if (GL.currentContext) {
    return GL.currentContext.handle;
  } else {
    return 0;
  }
}
var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;
var _emscripten_webgl_get_drawing_buffer_size_calling_thread = (e, r, t) => {
  var i = GL.getContext(e);
  if (i && i.GLctx && r && t) {
    (growMemViews(), HEAP32)[r >>> 2 >>> 0] = i.GLctx.drawingBufferWidth;
    (growMemViews(), HEAP32)[t >>> 2 >>> 0] = i.GLctx.drawingBufferHeight;
    return 0;
  } else {
    return -5;
  }
};
var _emscripten_webgl_get_drawing_buffer_size_main_thread = _emscripten_webgl_get_drawing_buffer_size_calling_thread;
function _emscripten_webgl_get_drawing_buffer_size(e, r, t) {
  e >>>= 0;
  r >>>= 0;
  t >>>= 0;
  if (GL.contexts[e]) {
    return _emscripten_webgl_get_drawing_buffer_size_calling_thread(e, r, t);
  } else {
    return _emscripten_webgl_get_drawing_buffer_size_main_thread(e, r, t);
  }
}
function _emscripten_webgl_make_context_current(e) {
  e >>>= 0;
  if (GL.makeContextCurrent(e)) {
    return 0;
  } else {
    return -5;
  }
}
var ENV = {};
var getExecutableName = () => thisProgram;
var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    var e = {
      USER: "web_user",
      LOGNAME: "web_user",
      PATH: "/",
      PWD: "/",
      HOME: "/home/web_user",
      LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8",
      _: getExecutableName()
    };
    for (var r in ENV) {
      if (ENV[r] === undefined) {
        delete e[r];
      } else {
        e[r] = ENV[r];
      }
    }
    var t = [];
    for (var r in e) {
      t.push(`${r}=${e[r]}`);
    }
    getEnvStrings.strings = t;
  }
  return getEnvStrings.strings;
};
function _environ_get(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(82, 0, 1, e, r);
  }
  e >>>= 0;
  r >>>= 0;
  var t = 0;
  var i = 0;
  for (var n of getEnvStrings()) {
    var a = r + t;
    (growMemViews(), HEAPU32)[e + i >>> 2 >>> 0] = a;
    t += stringToUTF8(n, a, Infinity) + 1;
    i += 4;
  }
  return 0;
}
function _environ_sizes_get(e, r) {
  if (ENVIRONMENT_IS_PTHREAD) {
    return proxyToMainThread(83, 0, 1, e, r);
  }
  e >>>= 0;
  r >>>= 0;
  var t = getEnvStrings();
  (growMemViews(), HEAPU32)[e >>> 2 >>> 0] = t.length;
  var i = 0;
  for (var n of t) {
    i += lengthBytesUTF8(n) + 1;
  }
  (growMemViews(), HEAPU32)[r >>> 2 >>> 0] = i;
  return 0;
}
var _glActiveTexture = _emscripten_glActiveTexture;
var _glAttachShader = _emscripten_glAttachShader;
var _glBindAttribLocation = _emscripten_glBindAttribLocation;
var _glBindBuffer = _emscripten_glBindBuffer;
var _glBindFramebuffer = _emscripten_glBindFramebuffer;
var _glBindRenderbuffer = _emscripten_glBindRenderbuffer;
var _glBindTexture = _emscripten_glBindTexture;
var _glBlendFunc = _emscripten_glBlendFunc;
var _glBlitFramebuffer = _emscripten_glBlitFramebuffer;
var _glBufferData = _emscripten_glBufferData;
var _glBufferSubData = _emscripten_glBufferSubData;
var _glCheckFramebufferStatus = _emscripten_glCheckFramebufferStatus;
var _glClear = _emscripten_glClear;
var _glClearColor = _emscripten_glClearColor;
var _glClearDepthf = _emscripten_glClearDepthf;
var _glClearStencil = _emscripten_glClearStencil;
var _glColorMask = _emscripten_glColorMask;
var _glCompileShader = _emscripten_glCompileShader;
var _glCompressedTexImage2D = _emscripten_glCompressedTexImage2D;
var _glCopyTexImage2D = _emscripten_glCopyTexImage2D;
var _glCreateProgram = _emscripten_glCreateProgram;
var _glCreateShader = _emscripten_glCreateShader;
var _glCullFace = _emscripten_glCullFace;
var _glDeleteBuffers = _emscripten_glDeleteBuffers;
var _glDeleteFramebuffers = _emscripten_glDeleteFramebuffers;
var _glDeleteProgram = _emscripten_glDeleteProgram;
var _glDeleteShader = _emscripten_glDeleteShader;
var _glDeleteTextures = _emscripten_glDeleteTextures;
var _glDepthFunc = _emscripten_glDepthFunc;
var _glDepthMask = _emscripten_glDepthMask;
var _glDepthRangef = _emscripten_glDepthRangef;
var _glDisable = _emscripten_glDisable;
var _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray;
var _glDrawArrays = _emscripten_glDrawArrays;
var _glEnable = _emscripten_glEnable;
var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;
var _glFlush = _emscripten_glFlush;
var _glFramebufferRenderbuffer = _emscripten_glFramebufferRenderbuffer;
var _glFramebufferTexture2D = _emscripten_glFramebufferTexture2D;
var _glFrontFace = _emscripten_glFrontFace;
var _glGenBuffers = _emscripten_glGenBuffers;
var _glGenFramebuffers = _emscripten_glGenFramebuffers;
var _glGenRenderbuffers = _emscripten_glGenRenderbuffers;
var _glGenTextures = _emscripten_glGenTextures;
var _glGenerateMipmap = _emscripten_glGenerateMipmap;
var _glGetBooleanv = _emscripten_glGetBooleanv;
var _glGetIntegerv = _emscripten_glGetIntegerv;
var _glGetProgramInfoLog = _emscripten_glGetProgramInfoLog;
var _glGetProgramiv = _emscripten_glGetProgramiv;
var _glGetShaderInfoLog = _emscripten_glGetShaderInfoLog;
var _glGetShaderiv = _emscripten_glGetShaderiv;
var _glGetUniformLocation = _emscripten_glGetUniformLocation;
var _glLinkProgram = _emscripten_glLinkProgram;
var _glPixelStorei = _emscripten_glPixelStorei;
var _glRenderbufferStorage = _emscripten_glRenderbufferStorage;
var _glScissor = _emscripten_glScissor;
var _glShaderSource = _emscripten_glShaderSource;
var _glTexImage2D = _emscripten_glTexImage2D;
var _glTexImage3D = _emscripten_glTexImage3D;
var _glTexParameteri = _emscripten_glTexParameteri;
var _glTexSubImage3D = _emscripten_glTexSubImage3D;
var _glUniform1f = _emscripten_glUniform1f;
var _glUniform1i = _emscripten_glUniform1i;
var _glUniform4fv = _emscripten_glUniform4fv;
var _glUniformMatrix4fv = _emscripten_glUniformMatrix4fv;
var _glUseProgram = _emscripten_glUseProgram;
var _glVertexAttrib2f = _emscripten_glVertexAttrib2f;
var _glVertexAttrib4f = _emscripten_glVertexAttrib4f;
var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;
var _glViewport = _emscripten_glViewport;
var initRandomFill = () => e => {
  e.set(crypto.getRandomValues(new Uint8Array(e.byteLength)));
  return 0;
};
var randomFill = e => (randomFill = initRandomFill())(e);
function _random_get(e, r) {
  e >>>= 0;
  r >>>= 0;
  return randomFill((growMemViews(), HEAPU8).subarray(e >>> 0, e + r >>> 0));
}
var dynCalls = {};
var dynCallLegacy = (e, r, t) => {
  e = e.replace(/p/g, "i");
  return (0, dynCalls[e])(r, ...t);
};
var dynCall = (e, r, t = [], i = false) => function (r) {
  if (e[0] == "p") {
    return r >>> 0;
  } else {
    return r;
  }
}(dynCallLegacy(e, r, t));
var wasmTableMirror = [];
var getWasmTableEntry = e => {
  var r = wasmTableMirror[e];
  if (!r) {
    wasmTableMirror[e] = r = wasmTable.get(e);
  }
  return r;
};
function setValue(e, r, t = "i8") {
  if (t.endsWith("*")) {
    t = "*";
  }
  switch (t) {
    case "i1":
    case "i8":
      (growMemViews(), HEAP8)[e >>> 0] = r;
      break;
    case "i16":
      (growMemViews(), HEAP16)[e >>> 1 >>> 0] = r;
      break;
    case "i32":
      (growMemViews(), HEAP32)[e >>> 2 >>> 0] = r;
      break;
    case "i64":
      (growMemViews(), HEAP64)[e >>> 3 >>> 0] = BigInt(r);
      break;
    case "float":
      (growMemViews(), HEAPF32)[e >>> 2 >>> 0] = r;
      break;
    case "double":
      (growMemViews(), HEAPF64)[e >>> 3 >>> 0] = r;
      break;
    case "*":
      (growMemViews(), HEAPU32)[e >>> 2 >>> 0] = r;
      break;
    default:
      abort(`invalid type for setValue: ${t}`);
  }
}
var createContext = Browser.createContext;
PThread.init();
Module.requestAnimationFrame = MainLoop.requestAnimationFrame;
Module.pauseMainLoop = MainLoop.pause;
Module.resumeMainLoop = MainLoop.resume;
MainLoop.init();
registerPreMainLoop(() => GL.newRenderingFrameStarted());
for (let e = 0; e < 32; ++e) {
  tempFixedLengthArray.push(new Array(e));
}
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
for (var i = 0; i <= 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
}
var miniTempWebGLIntBuffersStorage = new Int32Array(288);
for (i = 0; i <= 288; ++i) {
  miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
}
registerPreMainLoop(() => {
  if (GL.currentContext && !GL.currentContextIsProxied && !GL.currentContext.attributes.explicitSwapControl && GL.currentContext.GLctx.commit) {
    GL.currentContext.GLctx.commit();
  }
});
initMemory();
if (Module.noExitRuntime) {
  noExitRuntime = Module.noExitRuntime;
}
if (Module.print) {
  out = Module.print;
}
if (Module.printErr) {
  err = Module.printErr;
}
if (Module.arguments) {
  programArgs = Module.arguments;
}
if (Module.thisProgram) {
  thisProgram = Module.thisProgram;
}
var preInit = Module.preInit;
if (preInit) {
  for (typeof preInit == "function" && (Module.preInit = preInit = [preInit]); preInit.length > 0;) {
    preInit.shift()();
  }
}
Module.createContext = createContext;
var _malloc;
var _free;
var _main;
var _pthread_self;
var __emscripten_tls_init;
var __emscripten_proxy_main;
var __emscripten_run_callback_on_thread;
var __emscripten_set_offscreencanvas_size_on_thread;
var __emscripten_thread_init;
var ___set_thread_state;
var __emscripten_thread_crashed;
var _emscripten_proxy_execute_queue;
var _emscripten_proxy_finish;
var __emscripten_run_js_on_main_thread_done;
var __emscripten_run_js_on_main_thread;
var __emscripten_thread_free_data;
var __emscripten_thread_exit;
var __emscripten_check_mailbox;
var _setThrew;
var _emscripten_stack_set_limits;
var __emscripten_stack_restore;
var __emscripten_stack_alloc;
var _emscripten_stack_get_current;
var __wasmfs_opfs_record_entry;
var dynCall_ii;
var dynCall_iii;
var dynCall_vii;
var dynCall_vi;
var dynCall_viiiiiii;
var dynCall_iiii;
var dynCall_jiji;
var dynCall_v;
var dynCall_i;
var dynCall_viii;
var dynCall_viiiii;
var dynCall_iiiii;
var dynCall_iiiiiiii;
var dynCall_viiiiiiii;
var dynCall_viiii;
var dynCall_iiiiii;
var dynCall_viffi;
var dynCall_ff;
var dynCall_viiiiii;
var dynCall_d;
var dynCall_viffffff;
var dynCall_jj;
var dynCall_iiiiiii;
var dynCall_iiiiiiiiii;
var dynCall_iiiiiiiiiii;
var dynCall_iiiiiiiii;
var dynCall_iiiiiifi;
var dynCall_iif;
var dynCall_fi;
var dynCall_iiiji;
var dynCall_dd;
var dynCall_iiijiiii;
var dynCall_ji;
var dynCall_vffff;
var dynCall_vf;
var dynCall_viiiiiiiii;
var dynCall_vff;
var dynCall_vfi;
var dynCall_viif;
var dynCall_vif;
var dynCall_viff;
var dynCall_vifff;
var dynCall_viffff;
var dynCall_vfff;
var dynCall_viiiiiiiiii;
var dynCall_viiiiiiiiiii;
var dynCall_viifi;
var dynCall_iiij;
var dynCall_viij;
var dynCall_iidiiiii;
var dynCall_iiiiij;
var dynCall_iiiiid;
var dynCall_iiiiijj;
var dynCall_iiiiiijj;
var dynCall_iiiij;
var dynCall_iij;
var __indirect_function_table;
var wasmTable;
var wasmImports;
var wasmExports;
var proxiedFunctionTable = [_proc_exit, exitOnMainThread, pthreadCreateProxied, _alBufferData, _alDeleteBuffers, _alDeleteSources, _alSourcei, _alDistanceModel, _alGenBuffers, _alGenSources, _alGetError, _alGetSource3f, _alGetSourcef, _alGetSourcei, _alListener3f, _alListenerfv, _alSource3f, _alSourcePause, _alSourcePlay, _alSourceQueueBuffers, _alSourceStop, _alSourceUnqueueBuffers, _alSourcef, _alcCloseDevice, _alcCreateContext, _alcDestroyContext, _alcMakeContextCurrent, _alcOpenDevice, _eglBindAPI, _eglChooseConfig, _eglCreateContext, _eglCreateWindowSurface, _eglDestroyContext, _eglDestroySurface, _eglGetConfigAttrib, _eglGetDisplay, _eglGetError, _eglInitialize, _eglMakeCurrent, _eglQueryString, _eglSwapBuffers, _eglSwapInterval, _eglTerminate, _eglWaitClient, _eglWaitNative, _emscripten_exit_fullscreen, getCanvasSizeMainThread, setCanvasElementSizeMainThread, _emscripten_exit_pointerlock, _emscripten_force_exit, _emscripten_get_device_pixel_ratio, _emscripten_get_element_css_size, _emscripten_get_gamepad_status, _emscripten_get_num_gamepads, _emscripten_get_screen_size, _emscripten_request_fullscreen_strategy, _emscripten_request_pointerlock, _emscripten_sample_gamepad_data, _emscripten_set_beforeunload_callback_on_thread, _emscripten_set_blur_callback_on_thread, _emscripten_set_element_css_size, _emscripten_set_focus_callback_on_thread, _emscripten_set_fullscreenchange_callback_on_thread, _emscripten_set_gamepadconnected_callback_on_thread, _emscripten_set_gamepaddisconnected_callback_on_thread, _emscripten_set_keydown_callback_on_thread, _emscripten_set_keypress_callback_on_thread, _emscripten_set_keyup_callback_on_thread, _emscripten_set_mousedown_callback_on_thread, _emscripten_set_mouseenter_callback_on_thread, _emscripten_set_mouseleave_callback_on_thread, _emscripten_set_mousemove_callback_on_thread, _emscripten_set_mouseup_callback_on_thread, _emscripten_set_pointerlockchange_callback_on_thread, _emscripten_set_resize_callback_on_thread, _emscripten_set_touchcancel_callback_on_thread, _emscripten_set_touchend_callback_on_thread, _emscripten_set_touchmove_callback_on_thread, _emscripten_set_touchstart_callback_on_thread, _emscripten_set_visibilitychange_callback_on_thread, _emscripten_set_wheel_callback_on_thread, _emscripten_set_window_title, _environ_get, _environ_sizes_get];
var ASM_CONSTS = {
  1050980: (e, r, t) => {
    const i = Module.kisakCreditsAudio;
    if (i) {
      i.pause();
      i.removeAttribute("src");
      i.load();
      Module.kisakCreditsAudio = null;
    }
    if (Module.kisakCreditsAudioUrl) {
      URL.revokeObjectURL(Module.kisakCreditsAudioUrl);
      Module.kisakCreditsAudioUrl = null;
    }
    Module.kisakCreditsAudioGeneration = r;
    if (!e) {
      return;
    }
    const n = UTF8ToString(e);
    (async () => {
      try {
        let e;
        if (t) {
          const r = await fetch(n);
          if (!r.ok) {
            throw new Error(`HTTP ${r.status} for ${n}`);
          }
          e = await r.blob();
        } else {
          const r = await navigator.storage.getDirectory();
          const t = await r.getDirectoryHandle("cod4");
          const i = await t.getDirectoryHandle("main");
          const a = await i.getDirectoryHandle("video");
          const s = await a.getFileHandle(n);
          e = await s.getFile();
        }
        if (Module.kisakCreditsAudioGeneration !== r) {
          return;
        }
        const i = URL.createObjectURL(e);
        const a = new Audio(i);
        a.preload = "auto";
        Module.kisakCreditsAudioUrl = i;
        Module.kisakCreditsAudio = a;
        await a.play();
      } catch (e) {
        console.error("Unable to play custom credits audio:", e);
      }
    })();
  },
  1052181: e => {
    Module.kisakLoadingMoviePresentation = !!e;
    const r = document.getElementById("loading-movie");
    const t = document.getElementById("loading-movie-subtitle");
    if (!e) {
      if (r) {
        r.hidden = true;
      }
      if (t) {
        t.hidden = true;
      }
    }
  },
  1052443: () => {
    const e = document.getElementById("loading-movie");
    const r = document.getElementById("loading-movie-subtitle");
    if (e) {
      e.hidden = true;
    }
    if (r) {
      r.hidden = true;
    }
  },
  1052647: (e, r, t, i, n, a, s, o, c) => {
    if (!Module.kisakLoadingMoviePresentation) {
      return;
    }
    let l = document.getElementById("loading-movie");
    if (!l) {
      l = document.createElement("canvas");
      l.id = "loading-movie";
      l.style.cssText = "position:fixed;pointer-events:none;z-index:1";
      document.body.appendChild(l);
    }
    let _ = document.getElementById("loading-movie-subtitle");
    if (!_) {
      _ = document.createElement("div");
      _.id = "loading-movie-subtitle";
      _.style.cssText = "position:fixed;pointer-events:none;z-index:2;color:white;font:600 clamp(18px,2.2vw,30px) Arial,sans-serif;text-align:center;line-height:1.2;white-space:pre-wrap;text-shadow:-2px -2px 2px #000,2px -2px 2px #000,-2px 2px 2px #000,2px 2px 2px #000";
      document.body.appendChild(_);
    }
    const u = document.getElementById("canvas").getBoundingClientRect();
    l.style.left = u.left + "px";
    l.style.top = u.top + "px";
    l.style.width = u.width + "px";
    l.style.height = u.height + "px";
    _.style.left = u.left + u.width * 0.08 + "px";
    _.style.top = u.top + u.height * 0.82 + "px";
    _.style.width = u.width * 0.84 + "px";
    if (l.width !== e || l.height !== r) {
      l.width = e;
      l.height = r;
    }
    const m = new VideoFrame((growMemViews(), HEAPU8), {
      format: "I420",
      codedWidth: e,
      codedHeight: r,
      timestamp: 0,
      layout: [{
        offset: t >>> 0,
        stride: i
      }, {
        offset: n >>> 0,
        stride: a
      }, {
        offset: s >>> 0,
        stride: o
      }],
      colorSpace: {
        matrix: "smpte170m",
        fullRange: true
      }
    });
    try {
      l.getContext("2d").drawImage(m, 0, 0);
      l.hidden = false;
      _.textContent = UTF8ToString(c);
      _.hidden = !_.textContent;
    } finally {
      m.close();
    }
  },
  1054405: () => {
    window.open("https://slqnt.dev", "_blank", "noopener,noreferrer");
  },
  1054476: (e, r, t) => {
    Module.kisakInputBase = e;
    Module.kisakWantLockOff = r;
    Module.kisakGamepadOff = t;
    if (window.__kisakInstallInput) {
      window.__kisakInstallInput();
    }
  },
  1054638: (e, r) => {
    var t = document.getElementById("canvas");
    if (t) {
      t.style.width = e + "px";
      t.style.height = r + "px";
    }
  },
  1054751: () => typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined",
  1054898: () => navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined || navigator.webkitGetUserMedia !== undefined,
  1055132: e => {
    if (Module.SDL2 === undefined) {
      Module.SDL2 = {};
    }
    var r = Module.SDL2;
    if (e) {
      r.capture = {};
    } else {
      r.audio = {};
    }
    if (!r.audioContext) {
      if (typeof AudioContext != "undefined") {
        r.audioContext = new AudioContext();
      } else if (typeof webkitAudioContext != "undefined") {
        r.audioContext = new webkitAudioContext();
      }
      if (r.audioContext && navigator.userActivation === undefined) {
        autoResumeAudioContext(r.audioContext);
      }
    }
    if (r.audioContext === undefined) {
      return -1;
    } else {
      return 0;
    }
  },
  1055684: () => Module.SDL2.audioContext.sampleRate,
  1055752: (e, r, t, i) => {
    var n = Module.SDL2;
    var a = function (a) {
      if (n.capture.silenceTimer !== undefined) {
        clearInterval(n.capture.silenceTimer);
        n.capture.silenceTimer = undefined;
        n.capture.silenceBuffer = undefined;
      }
      n.capture.mediaStreamNode = n.audioContext.createMediaStreamSource(a);
      n.capture.scriptProcessorNode = n.audioContext.createScriptProcessor(r, e, 1);
      n.capture.scriptProcessorNode.onaudioprocess = function (e) {
        if (n !== undefined && n.capture !== undefined) {
          e.outputBuffer.getChannelData(0).fill(0);
          n.capture.currentCaptureBuffer = e.inputBuffer;
          dynCall("vp", t, [i]);
        }
      };
      n.capture.mediaStreamNode.connect(n.capture.scriptProcessorNode);
      n.capture.scriptProcessorNode.connect(n.audioContext.destination);
      n.capture.stream = a;
    };
    var s = function (e) {};
    n.capture.silenceBuffer = n.audioContext.createBuffer(e, r, n.audioContext.sampleRate);
    n.capture.silenceBuffer.getChannelData(0).fill(0);
    n.capture.silenceTimer = setInterval(function () {
      n.capture.currentCaptureBuffer = n.capture.silenceBuffer;
      dynCall("vp", t, [i]);
    }, r / n.audioContext.sampleRate * 1000);
    if (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(a).catch(s);
    } else if (navigator.webkitGetUserMedia !== undefined) {
      navigator.webkitGetUserMedia({
        audio: true,
        video: false
      }, a, s);
    }
  },
  1057445: (e, r, t, i) => {
    var n = Module.SDL2;
    n.audio.scriptProcessorNode = n.audioContext.createScriptProcessor(r, 0, e);
    n.audio.scriptProcessorNode.onaudioprocess = function (e) {
      if (n !== undefined && n.audio !== undefined) {
        if (n.audio.silenceTimer !== undefined) {
          clearInterval(n.audio.silenceTimer);
          n.audio.silenceTimer = undefined;
          n.audio.silenceBuffer = undefined;
        }
        n.audio.currentOutputBuffer = e.outputBuffer;
        dynCall("vp", t, [i]);
      }
    };
    n.audio.scriptProcessorNode.connect(n.audioContext.destination);
    if (n.audioContext.state === "suspended") {
      n.audio.silenceBuffer = n.audioContext.createBuffer(e, r, n.audioContext.sampleRate);
      n.audio.silenceBuffer.getChannelData(0).fill(0);
      n.audio.silenceTimer = setInterval(function () {
        if (navigator.userActivation !== undefined && navigator.userActivation.hasBeenActive) {
          n.audioContext.resume();
        }
        n.audio.currentOutputBuffer = n.audio.silenceBuffer;
        dynCall("vp", t, [i]);
        n.audio.currentOutputBuffer = undefined;
      }, r / n.audioContext.sampleRate * 1000);
    }
  },
  1058620: (e, r) => {
    var t = Module.SDL2;
    for (var i = t.capture.currentCaptureBuffer.numberOfChannels, n = 0; n < i; ++n) {
      var a = t.capture.currentCaptureBuffer.getChannelData(n);
      if (a.length != r) {
        throw "Web Audio capture buffer length mismatch! Destination size: " + a.length + " samples vs expected " + r + " samples!";
      }
      if (i == 1) {
        for (var s = 0; s < r; ++s) {
          setValue(e + s * 4, a[s], "float");
        }
      } else {
        for (s = 0; s < r; ++s) {
          setValue(e + (s * i + n) * 4, a[s], "float");
        }
      }
    }
  },
  1059225: (e, r) => {
    var t = Module.SDL2;
    var i = e >>> 2;
    for (var n = t.audio.currentOutputBuffer.numberOfChannels, a = 0; a < n; ++a) {
      var s = t.audio.currentOutputBuffer.getChannelData(a);
      if (s.length != r) {
        throw "Web Audio output buffer length mismatch! Destination size: " + s.length + " samples vs expected " + r + " samples!";
      }
      for (var o = 0; o < r; ++o) {
        s[o] = (growMemViews(), HEAPF32)[i + (o * n + a) >>> 0];
      }
    }
  },
  1059714: e => {
    var r = Module.SDL2;
    if (e) {
      if (r.capture.silenceTimer !== undefined) {
        clearInterval(r.capture.silenceTimer);
      }
      if (r.capture.stream !== undefined) {
        for (var t = r.capture.stream.getAudioTracks(), i = 0; i < t.length; i++) {
          r.capture.stream.removeTrack(t[i]);
        }
      }
      if (r.capture.scriptProcessorNode !== undefined) {
        r.capture.scriptProcessorNode.onaudioprocess = function (e) {};
        r.capture.scriptProcessorNode.disconnect();
      }
      if (r.capture.mediaStreamNode !== undefined) {
        r.capture.mediaStreamNode.disconnect();
      }
      r.capture = undefined;
    } else {
      if (r.audio.scriptProcessorNode != null) {
        r.audio.scriptProcessorNode.disconnect();
      }
      if (r.audio.silenceTimer !== undefined) {
        clearInterval(r.audio.silenceTimer);
      }
      r.audio = undefined;
    }
    if (r.audioContext !== undefined && r.audio === undefined && r.capture === undefined) {
      r.audioContext.close();
      r.audioContext = undefined;
    }
  },
  1060720: (e, r, t) => {
    var i = e;
    var n = r;
    var a = t;
    Module.SDL2 ||= {};
    var s = Module.SDL2;
    if (s.ctxCanvas !== Module.canvas) {
      s.ctx = Browser.createContext(Module.canvas, false, true);
      s.ctxCanvas = Module.canvas;
    }
    if (s.w !== i || s.h !== n || s.imageCtx !== s.ctx) {
      s.image = s.ctx.createImageData(i, n);
      s.w = i;
      s.h = n;
      s.imageCtx = s.ctx;
    }
    var o;
    var c = s.image.data;
    var l = a / 4;
    var _ = 0;
    if (typeof CanvasPixelArray != "undefined" && c instanceof CanvasPixelArray) {
      for (o = c.length; _ < o;) {
        var u = (growMemViews(), HEAP32)[l >>> 0];
        c[_] = u & 255;
        c[_ + 1] = u >> 8 & 255;
        c[_ + 2] = u >> 16 & 255;
        c[_ + 3] = 255;
        l++;
        _ += 4;
      }
    } else {
      if (s.data32Data !== c) {
        s.data32 = new Int32Array(c.buffer);
        s.data8 = new Uint8Array(c.buffer);
        s.data32Data = c;
      }
      var m = s.data32;
      o = m.length;
      m.set((growMemViews(), HEAP32).subarray(l >>> 0, l + o >>> 0));
      var f = s.data8;
      var d = 3;
      var g = d + o * 4;
      if (o % 8 == 0) {
        while (d < g) {
          f[d] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          f[d = d + 4 | 0] = 255;
          d = d + 4 | 0;
        }
      } else {
        while (d < g) {
          f[d] = 255;
          d = d + 4 | 0;
        }
      }
    }
    s.ctx.putImageData(s.image, 0, 0);
  },
  1062186: (e, r, t, i, n) => {
    var a = e;
    var s = r;
    var o = t;
    var c = i;
    var l = n;
    var _ = document.createElement("canvas");
    _.width = a;
    _.height = s;
    var u;
    var m = _.getContext("2d");
    var f = m.createImageData(a, s);
    var d = f.data;
    var g = l / 4;
    var p = 0;
    if (typeof CanvasPixelArray != "undefined" && d instanceof CanvasPixelArray) {
      for (u = d.length; p < u;) {
        var v = (growMemViews(), HEAP32)[g >>> 0];
        d[p] = v & 255;
        d[p + 1] = v >> 8 & 255;
        d[p + 2] = v >> 16 & 255;
        d[p + 3] = v >> 24 & 255;
        g++;
        p += 4;
      }
    } else {
      var w = new Int32Array(d.buffer);
      u = w.length;
      w.set((growMemViews(), HEAP32).subarray(g >>> 0, g + u >>> 0));
    }
    m.putImageData(f, 0, 0);
    var E = o === 0 && c === 0 ? "url(" + _.toDataURL() + "), auto" : "url(" + _.toDataURL() + ") " + o + " " + c + ", auto";
    var x = _malloc(E.length + 1);
    stringToUTF8(E, x, E.length + 1);
    return x;
  },
  1063174: e => {
    if (Module.canvas) {
      Module.canvas.style.cursor = UTF8ToString(e);
    }
  },
  1063257: () => {
    if (Module.canvas) {
      Module.canvas.style.cursor = "none";
    }
  },
  1063326: () => window.innerWidth,
  1063356: () => window.innerHeight
};
function kisak_lan_init() {
  if (!Module._kisakLan) {
    var e;
    var r = Module.kisakLanUrl;
    if (!r) {
      r = (typeof location != "undefined" && location.protocol === "https:" ? "wss://" : "ws://") + (typeof location != "undefined" && location.host ? location.host : "127.0.0.1:8080") + "/lan";
    }
    try {
      e = new WebSocket(r);
    } catch (e) {
      return;
    }
    e.binaryType = "arraybuffer";
    Module._kisakLanRx = [];
    Module._kisakLan = e;
    e.onmessage = function (e) {
      var r = new Uint8Array(e.data);
      if (r.length >= 7 && r[0] === 161) {
        Module._kisakLanIp = [r[1], r[2], r[3], r[4]];
        Module._kisakLanPort = r[5] | r[6] << 8;
        Module._kisakLanReady = 1;
        return;
      }
      if (r.length >= 13 && r[0] === 162) {
        Module._kisakLanRx.push(r);
      }
    };
  }
}
function kisak_lan_ready(e, r) {
  if (!Module._kisakLanReady) {
    return 0;
  }
  var t = Module._kisakLanIp;
  (growMemViews(), HEAPU8)[e >>> 0] = t[0];
  (growMemViews(), HEAPU8)[e + 1 >>> 0] = t[1];
  (growMemViews(), HEAPU8)[e + 2 >>> 0] = t[2];
  (growMemViews(), HEAPU8)[e + 3 >>> 0] = t[3];
  var i = Module._kisakLanPort | 0;
  (growMemViews(), HEAPU8)[r >>> 0] = i & 255;
  (growMemViews(), HEAPU8)[r + 1 >>> 0] = i >> 8 & 255;
  return 1;
}
function kisak_lan_send(e, r, t, i, n, a, s) {
  var o = Module._kisakLan;
  if (!o || o.readyState !== 1) {
    return 0;
  }
  var c = (growMemViews(), HEAPU8).subarray(e >>> 0, e + r >>> 0);
  var l = new Uint8Array(13 + r);
  l[0] = 162;
  l[1] = t & 255;
  l[2] = i & 255;
  l[3] = n & 255;
  l[4] = a & 255;
  l[5] = s & 255;
  l[6] = s >> 8 & 255;
  l[7] = 0;
  l[8] = 0;
  l[9] = 0;
  l[10] = 0;
  l[11] = 0;
  l[12] = 0;
  l.set(c, 13);
  try {
    o.send(l);
  } catch (e) {
    return 0;
  }
  return 1;
}
function kisak_lan_recv(e, r, t) {
  var i = Module._kisakLanRx;
  if (!i || !i.length) {
    return 0;
  }
  var n = i.shift();
  var a = n.length - 13;
  if (a <= 0) {
    return 0;
  } else {
    if (a > r) {
      a = r;
    }
    (growMemViews(), HEAPU8).set(n.subarray(13, 13 + a), e >>> 0);
    (growMemViews(), HEAPU8).set(n.subarray(7, 13), t >>> 0);
    return a;
  }
}
function assignWasmExports(e) {
  _malloc = e.malloc;
  _free = e.free;
  _main = Module._main = e.__main_argc_argv;
  _main = Module._main = e.main;
  _pthread_self = e.pthread_self;
  __emscripten_tls_init = e._emscripten_tls_init;
  __emscripten_proxy_main = Module.__emscripten_proxy_main = e._emscripten_proxy_main;
  __emscripten_run_callback_on_thread = e._emscripten_run_callback_on_thread;
  __emscripten_set_offscreencanvas_size_on_thread = e._emscripten_set_offscreencanvas_size_on_thread;
  __emscripten_thread_init = e._emscripten_thread_init;
  ___set_thread_state = e.__set_thread_state;
  __emscripten_thread_crashed = e._emscripten_thread_crashed;
  _emscripten_proxy_execute_queue = e.emscripten_proxy_execute_queue;
  _emscripten_proxy_finish = e.emscripten_proxy_finish;
  __emscripten_run_js_on_main_thread_done = e._emscripten_run_js_on_main_thread_done;
  __emscripten_run_js_on_main_thread = e._emscripten_run_js_on_main_thread;
  __emscripten_thread_free_data = e._emscripten_thread_free_data;
  __emscripten_thread_exit = e._emscripten_thread_exit;
  __emscripten_check_mailbox = e._emscripten_check_mailbox;
  _setThrew = e.setThrew;
  _emscripten_stack_set_limits = e.emscripten_stack_set_limits;
  __emscripten_stack_restore = e._emscripten_stack_restore;
  __emscripten_stack_alloc = e._emscripten_stack_alloc;
  _emscripten_stack_get_current = e.emscripten_stack_get_current;
  __wasmfs_opfs_record_entry = e._wasmfs_opfs_record_entry;
  dynCall_ii = dynCalls.ii = e.dynCall_ii;
  dynCall_iii = dynCalls.iii = e.dynCall_iii;
  dynCall_vii = dynCalls.vii = e.dynCall_vii;
  dynCall_vi = dynCalls.vi = e.dynCall_vi;
  dynCall_viiiiiii = dynCalls.viiiiiii = e.dynCall_viiiiiii;
  dynCall_iiii = dynCalls.iiii = e.dynCall_iiii;
  dynCall_jiji = dynCalls.jiji = e.dynCall_jiji;
  dynCall_v = dynCalls.v = e.dynCall_v;
  dynCall_i = dynCalls.i = e.dynCall_i;
  dynCall_viii = dynCalls.viii = e.dynCall_viii;
  dynCall_viiiii = dynCalls.viiiii = e.dynCall_viiiii;
  dynCall_iiiii = dynCalls.iiiii = e.dynCall_iiiii;
  dynCall_iiiiiiii = dynCalls.iiiiiiii = e.dynCall_iiiiiiii;
  dynCall_viiiiiiii = dynCalls.viiiiiiii = e.dynCall_viiiiiiii;
  dynCall_viiii = dynCalls.viiii = e.dynCall_viiii;
  dynCall_iiiiii = dynCalls.iiiiii = e.dynCall_iiiiii;
  dynCall_viffi = dynCalls.viffi = e.dynCall_viffi;
  dynCall_ff = dynCalls.ff = e.dynCall_ff;
  dynCall_viiiiii = dynCalls.viiiiii = e.dynCall_viiiiii;
  dynCall_d = dynCalls.d = e.dynCall_d;
  dynCall_viffffff = dynCalls.viffffff = e.dynCall_viffffff;
  dynCall_jj = dynCalls.jj = e.dynCall_jj;
  dynCall_iiiiiii = dynCalls.iiiiiii = e.dynCall_iiiiiii;
  dynCall_iiiiiiiiii = dynCalls.iiiiiiiiii = e.dynCall_iiiiiiiiii;
  dynCall_iiiiiiiiiii = dynCalls.iiiiiiiiiii = e.dynCall_iiiiiiiiiii;
  dynCall_iiiiiiiii = dynCalls.iiiiiiiii = e.dynCall_iiiiiiiii;
  dynCall_iiiiiifi = dynCalls.iiiiiifi = e.dynCall_iiiiiifi;
  dynCall_iif = dynCalls.iif = e.dynCall_iif;
  dynCall_fi = dynCalls.fi = e.dynCall_fi;
  dynCall_iiiji = dynCalls.iiiji = e.dynCall_iiiji;
  dynCall_dd = dynCalls.dd = e.dynCall_dd;
  dynCall_iiijiiii = dynCalls.iiijiiii = e.dynCall_iiijiiii;
  dynCall_ji = dynCalls.ji = e.dynCall_ji;
  dynCall_vffff = dynCalls.vffff = e.dynCall_vffff;
  dynCall_vf = dynCalls.vf = e.dynCall_vf;
  dynCall_viiiiiiiii = dynCalls.viiiiiiiii = e.dynCall_viiiiiiiii;
  dynCall_vff = dynCalls.vff = e.dynCall_vff;
  dynCall_vfi = dynCalls.vfi = e.dynCall_vfi;
  dynCall_viif = dynCalls.viif = e.dynCall_viif;
  dynCall_vif = dynCalls.vif = e.dynCall_vif;
  dynCall_viff = dynCalls.viff = e.dynCall_viff;
  dynCall_vifff = dynCalls.vifff = e.dynCall_vifff;
  dynCall_viffff = dynCalls.viffff = e.dynCall_viffff;
  dynCall_vfff = dynCalls.vfff = e.dynCall_vfff;
  dynCall_viiiiiiiiii = dynCalls.viiiiiiiiii = e.dynCall_viiiiiiiiii;
  dynCall_viiiiiiiiiii = dynCalls.viiiiiiiiiii = e.dynCall_viiiiiiiiiii;
  dynCall_viifi = dynCalls.viifi = e.dynCall_viifi;
  dynCall_iiij = dynCalls.iiij = e.dynCall_iiij;
  dynCall_viij = dynCalls.viij = e.dynCall_viij;
  dynCall_iidiiiii = dynCalls.iidiiiii = e.dynCall_iidiiiii;
  dynCall_iiiiij = dynCalls.iiiiij = e.dynCall_iiiiij;
  dynCall_iiiiid = dynCalls.iiiiid = e.dynCall_iiiiid;
  dynCall_iiiiijj = dynCalls.iiiiijj = e.dynCall_iiiiijj;
  dynCall_iiiiiijj = dynCalls.iiiiiijj = e.dynCall_iiiiiijj;
  dynCall_iiiij = dynCalls.iiiij = e.dynCall_iiiij;
  dynCall_iij = dynCalls.iij = e.dynCall_iij;
  __indirect_function_table = wasmTable = e.__indirect_function_table;
}
function assignWasmImports() {
  wasmImports = {
    __assert_fail: ___assert_fail,
    __call_sighandler: ___call_sighandler,
    __cxa_throw: ___cxa_throw,
    __pthread_create_js: ___pthread_create_js,
    _abort_js: __abort_js,
    _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
    _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    _emscripten_throw_longjmp: __emscripten_throw_longjmp,
    _gmtime_js: __gmtime_js,
    _localtime_js: __localtime_js,
    _mktime_js: __mktime_js,
    _tzset_js: __tzset_js,
    _wasmfs_copy_preloaded_file_data: __wasmfs_copy_preloaded_file_data,
    _wasmfs_get_num_preloaded_dirs: __wasmfs_get_num_preloaded_dirs,
    _wasmfs_get_num_preloaded_files: __wasmfs_get_num_preloaded_files,
    _wasmfs_get_preloaded_child_path: __wasmfs_get_preloaded_child_path,
    _wasmfs_get_preloaded_file_mode: __wasmfs_get_preloaded_file_mode,
    _wasmfs_get_preloaded_file_size: __wasmfs_get_preloaded_file_size,
    _wasmfs_get_preloaded_parent_path: __wasmfs_get_preloaded_parent_path,
    _wasmfs_get_preloaded_path_name: __wasmfs_get_preloaded_path_name,
    _wasmfs_opfs_close_access: __wasmfs_opfs_close_access,
    _wasmfs_opfs_close_blob: __wasmfs_opfs_close_blob,
    _wasmfs_opfs_flush_access: __wasmfs_opfs_flush_access,
    _wasmfs_opfs_free_directory: __wasmfs_opfs_free_directory,
    _wasmfs_opfs_free_file: __wasmfs_opfs_free_file,
    _wasmfs_opfs_get_child: __wasmfs_opfs_get_child,
    _wasmfs_opfs_get_entries: __wasmfs_opfs_get_entries,
    _wasmfs_opfs_get_size_access: __wasmfs_opfs_get_size_access,
    _wasmfs_opfs_get_size_blob: __wasmfs_opfs_get_size_blob,
    _wasmfs_opfs_get_size_file: __wasmfs_opfs_get_size_file,
    _wasmfs_opfs_init_root_directory: __wasmfs_opfs_init_root_directory,
    _wasmfs_opfs_insert_directory: __wasmfs_opfs_insert_directory,
    _wasmfs_opfs_insert_file: __wasmfs_opfs_insert_file,
    _wasmfs_opfs_move_file: __wasmfs_opfs_move_file,
    _wasmfs_opfs_open_access: __wasmfs_opfs_open_access,
    _wasmfs_opfs_open_blob: __wasmfs_opfs_open_blob,
    _wasmfs_opfs_read_access: __wasmfs_opfs_read_access,
    _wasmfs_opfs_read_blob: __wasmfs_opfs_read_blob,
    _wasmfs_opfs_remove_child: __wasmfs_opfs_remove_child,
    _wasmfs_opfs_set_size_access: __wasmfs_opfs_set_size_access,
    _wasmfs_opfs_set_size_file: __wasmfs_opfs_set_size_file,
    _wasmfs_opfs_write_access: __wasmfs_opfs_write_access,
    _wasmfs_stdin_get_char: __wasmfs_stdin_get_char,
    _wasmfs_thread_utils_heartbeat: __wasmfs_thread_utils_heartbeat,
    alBufferData: _alBufferData,
    alDeleteBuffers: _alDeleteBuffers,
    alDeleteSources: _alDeleteSources,
    alDistanceModel: _alDistanceModel,
    alGenBuffers: _alGenBuffers,
    alGenSources: _alGenSources,
    alGetError: _alGetError,
    alGetSource3f: _alGetSource3f,
    alGetSourcef: _alGetSourcef,
    alGetSourcei: _alGetSourcei,
    alListener3f: _alListener3f,
    alListenerfv: _alListenerfv,
    alSource3f: _alSource3f,
    alSourcePause: _alSourcePause,
    alSourcePlay: _alSourcePlay,
    alSourceQueueBuffers: _alSourceQueueBuffers,
    alSourceStop: _alSourceStop,
    alSourceUnqueueBuffers: _alSourceUnqueueBuffers,
    alSourcef: _alSourcef,
    alSourcei: _alSourcei,
    alcCloseDevice: _alcCloseDevice,
    alcCreateContext: _alcCreateContext,
    alcDestroyContext: _alcDestroyContext,
    alcMakeContextCurrent: _alcMakeContextCurrent,
    alcOpenDevice: _alcOpenDevice,
    clock_time_get: _clock_time_get,
    eglBindAPI: _eglBindAPI,
    eglChooseConfig: _eglChooseConfig,
    eglCreateContext: _eglCreateContext,
    eglCreateWindowSurface: _eglCreateWindowSurface,
    eglDestroyContext: _eglDestroyContext,
    eglDestroySurface: _eglDestroySurface,
    eglGetConfigAttrib: _eglGetConfigAttrib,
    eglGetDisplay: _eglGetDisplay,
    eglGetError: _eglGetError,
    eglInitialize: _eglInitialize,
    eglMakeCurrent: _eglMakeCurrent,
    eglQueryString: _eglQueryString,
    eglSwapBuffers: _eglSwapBuffers,
    eglSwapInterval: _eglSwapInterval,
    eglTerminate: _eglTerminate,
    eglWaitGL: _eglWaitGL,
    eglWaitNative: _eglWaitNative,
    emscripten_asm_const_async_on_main_thread: _emscripten_asm_const_async_on_main_thread,
    emscripten_asm_const_int: _emscripten_asm_const_int,
    emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
    emscripten_asm_const_ptr_sync_on_main_thread: _emscripten_asm_const_ptr_sync_on_main_thread,
    emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    emscripten_date_now: _emscripten_date_now,
    emscripten_err: _emscripten_err,
    emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
    emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
    emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    emscripten_force_exit: _emscripten_force_exit,
    emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
    emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
    emscripten_get_element_css_size: _emscripten_get_element_css_size,
    emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
    emscripten_get_now: _emscripten_get_now,
    emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
    emscripten_get_screen_size: _emscripten_get_screen_size,
    emscripten_glActiveTexture: _emscripten_glActiveTexture,
    emscripten_glAttachShader: _emscripten_glAttachShader,
    emscripten_glBeginQuery: _emscripten_glBeginQuery,
    emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
    emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
    emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
    emscripten_glBindBuffer: _emscripten_glBindBuffer,
    emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
    emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
    emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
    emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
    emscripten_glBindSampler: _emscripten_glBindSampler,
    emscripten_glBindTexture: _emscripten_glBindTexture,
    emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
    emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
    emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
    emscripten_glBlendColor: _emscripten_glBlendColor,
    emscripten_glBlendEquation: _emscripten_glBlendEquation,
    emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
    emscripten_glBlendFunc: _emscripten_glBlendFunc,
    emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
    emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
    emscripten_glBufferData: _emscripten_glBufferData,
    emscripten_glBufferSubData: _emscripten_glBufferSubData,
    emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
    emscripten_glClear: _emscripten_glClear,
    emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
    emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
    emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
    emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
    emscripten_glClearColor: _emscripten_glClearColor,
    emscripten_glClearDepthf: _emscripten_glClearDepthf,
    emscripten_glClearStencil: _emscripten_glClearStencil,
    emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
    emscripten_glClipControlEXT: _emscripten_glClipControlEXT,
    emscripten_glColorMask: _emscripten_glColorMask,
    emscripten_glCompileShader: _emscripten_glCompileShader,
    emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
    emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
    emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
    emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
    emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
    emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
    emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
    emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
    emscripten_glCreateProgram: _emscripten_glCreateProgram,
    emscripten_glCreateShader: _emscripten_glCreateShader,
    emscripten_glCullFace: _emscripten_glCullFace,
    emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
    emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
    emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
    emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
    emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
    emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
    emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
    emscripten_glDeleteShader: _emscripten_glDeleteShader,
    emscripten_glDeleteSync: _emscripten_glDeleteSync,
    emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
    emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
    emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
    emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
    emscripten_glDepthFunc: _emscripten_glDepthFunc,
    emscripten_glDepthMask: _emscripten_glDepthMask,
    emscripten_glDepthRangef: _emscripten_glDepthRangef,
    emscripten_glDetachShader: _emscripten_glDetachShader,
    emscripten_glDisable: _emscripten_glDisable,
    emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
    emscripten_glDrawArrays: _emscripten_glDrawArrays,
    emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
    emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
    emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
    emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
    emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
    emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
    emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
    emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
    emscripten_glDrawElements: _emscripten_glDrawElements,
    emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
    emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
    emscripten_glDrawElementsInstancedARB: _emscripten_glDrawElementsInstancedARB,
    emscripten_glDrawElementsInstancedEXT: _emscripten_glDrawElementsInstancedEXT,
    emscripten_glDrawElementsInstancedNV: _emscripten_glDrawElementsInstancedNV,
    emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
    emscripten_glEnable: _emscripten_glEnable,
    emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
    emscripten_glEndQuery: _emscripten_glEndQuery,
    emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
    emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
    emscripten_glFenceSync: _emscripten_glFenceSync,
    emscripten_glFinish: _emscripten_glFinish,
    emscripten_glFlush: _emscripten_glFlush,
    emscripten_glFlushMappedBufferRange: _emscripten_glFlushMappedBufferRange,
    emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
    emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
    emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
    emscripten_glFrontFace: _emscripten_glFrontFace,
    emscripten_glGenBuffers: _emscripten_glGenBuffers,
    emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
    emscripten_glGenQueries: _emscripten_glGenQueries,
    emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
    emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
    emscripten_glGenSamplers: _emscripten_glGenSamplers,
    emscripten_glGenTextures: _emscripten_glGenTextures,
    emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
    emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
    emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
    emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
    emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
    emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
    emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
    emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
    emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
    emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
    emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
    emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
    emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
    emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
    emscripten_glGetBufferPointerv: _emscripten_glGetBufferPointerv,
    emscripten_glGetError: _emscripten_glGetError,
    emscripten_glGetFloatv: _emscripten_glGetFloatv,
    emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
    emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
    emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
    emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
    emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
    emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
    emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
    emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
    emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
    emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
    emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
    emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
    emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
    emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
    emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
    emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
    emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
    emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
    emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
    emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
    emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
    emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
    emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
    emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
    emscripten_glGetString: _emscripten_glGetString,
    emscripten_glGetStringi: _emscripten_glGetStringi,
    emscripten_glGetSynciv: _emscripten_glGetSynciv,
    emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
    emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
    emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
    emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
    emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
    emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
    emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
    emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
    emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
    emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
    emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
    emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
    emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
    emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
    emscripten_glHint: _emscripten_glHint,
    emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
    emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
    emscripten_glIsBuffer: _emscripten_glIsBuffer,
    emscripten_glIsEnabled: _emscripten_glIsEnabled,
    emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
    emscripten_glIsProgram: _emscripten_glIsProgram,
    emscripten_glIsQuery: _emscripten_glIsQuery,
    emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
    emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
    emscripten_glIsSampler: _emscripten_glIsSampler,
    emscripten_glIsShader: _emscripten_glIsShader,
    emscripten_glIsSync: _emscripten_glIsSync,
    emscripten_glIsTexture: _emscripten_glIsTexture,
    emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
    emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
    emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
    emscripten_glLineWidth: _emscripten_glLineWidth,
    emscripten_glLinkProgram: _emscripten_glLinkProgram,
    emscripten_glMapBufferRange: _emscripten_glMapBufferRange,
    emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
    emscripten_glPixelStorei: _emscripten_glPixelStorei,
    emscripten_glPolygonModeWEBGL: _emscripten_glPolygonModeWEBGL,
    emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
    emscripten_glPolygonOffsetClampEXT: _emscripten_glPolygonOffsetClampEXT,
    emscripten_glProgramBinary: _emscripten_glProgramBinary,
    emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
    emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
    emscripten_glReadBuffer: _emscripten_glReadBuffer,
    emscripten_glReadPixels: _emscripten_glReadPixels,
    emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
    emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
    emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
    emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
    emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
    emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
    emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
    emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
    emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
    emscripten_glScissor: _emscripten_glScissor,
    emscripten_glShaderBinary: _emscripten_glShaderBinary,
    emscripten_glShaderSource: _emscripten_glShaderSource,
    emscripten_glStencilFunc: _emscripten_glStencilFunc,
    emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
    emscripten_glStencilMask: _emscripten_glStencilMask,
    emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
    emscripten_glStencilOp: _emscripten_glStencilOp,
    emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
    emscripten_glTexImage2D: _emscripten_glTexImage2D,
    emscripten_glTexImage3D: _emscripten_glTexImage3D,
    emscripten_glTexParameterf: _emscripten_glTexParameterf,
    emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
    emscripten_glTexParameteri: _emscripten_glTexParameteri,
    emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
    emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
    emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
    emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
    emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
    emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
    emscripten_glUniform1f: _emscripten_glUniform1f,
    emscripten_glUniform1fv: _emscripten_glUniform1fv,
    emscripten_glUniform1i: _emscripten_glUniform1i,
    emscripten_glUniform1iv: _emscripten_glUniform1iv,
    emscripten_glUniform1ui: _emscripten_glUniform1ui,
    emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
    emscripten_glUniform2f: _emscripten_glUniform2f,
    emscripten_glUniform2fv: _emscripten_glUniform2fv,
    emscripten_glUniform2i: _emscripten_glUniform2i,
    emscripten_glUniform2iv: _emscripten_glUniform2iv,
    emscripten_glUniform2ui: _emscripten_glUniform2ui,
    emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
    emscripten_glUniform3f: _emscripten_glUniform3f,
    emscripten_glUniform3fv: _emscripten_glUniform3fv,
    emscripten_glUniform3i: _emscripten_glUniform3i,
    emscripten_glUniform3iv: _emscripten_glUniform3iv,
    emscripten_glUniform3ui: _emscripten_glUniform3ui,
    emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
    emscripten_glUniform4f: _emscripten_glUniform4f,
    emscripten_glUniform4fv: _emscripten_glUniform4fv,
    emscripten_glUniform4i: _emscripten_glUniform4i,
    emscripten_glUniform4iv: _emscripten_glUniform4iv,
    emscripten_glUniform4ui: _emscripten_glUniform4ui,
    emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
    emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
    emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
    emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
    emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
    emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
    emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
    emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
    emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
    emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
    emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
    emscripten_glUnmapBuffer: _emscripten_glUnmapBuffer,
    emscripten_glUseProgram: _emscripten_glUseProgram,
    emscripten_glValidateProgram: _emscripten_glValidateProgram,
    emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
    emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
    emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
    emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
    emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
    emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
    emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
    emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
    emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
    emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
    emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
    emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
    emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
    emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
    emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
    emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
    emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
    emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
    emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
    emscripten_glViewport: _emscripten_glViewport,
    emscripten_glWaitSync: _emscripten_glWaitSync,
    emscripten_has_asyncify: _emscripten_has_asyncify,
    emscripten_out: _emscripten_out,
    emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
    emscripten_request_pointerlock: _emscripten_request_pointerlock,
    emscripten_resize_heap: _emscripten_resize_heap,
    emscripten_runtime_keepalive_check: _emscripten_runtime_keepalive_check,
    emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
    emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
    emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
    emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
    emscripten_set_element_css_size: _emscripten_set_element_css_size,
    emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
    emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
    emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
    emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
    emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
    emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
    emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
    emscripten_set_main_loop: _emscripten_set_main_loop,
    emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
    emscripten_set_mouseenter_callback_on_thread: _emscripten_set_mouseenter_callback_on_thread,
    emscripten_set_mouseleave_callback_on_thread: _emscripten_set_mouseleave_callback_on_thread,
    emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
    emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
    emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
    emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
    emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
    emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
    emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
    emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
    emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
    emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
    emscripten_set_window_title: _emscripten_set_window_title,
    emscripten_sleep: _emscripten_sleep,
    emscripten_unwind_to_js_event_loop: _emscripten_unwind_to_js_event_loop,
    emscripten_webgl_commit_frame: _emscripten_webgl_commit_frame,
    emscripten_webgl_create_context: _emscripten_webgl_create_context,
    emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
    emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
    emscripten_webgl_get_current_context: _emscripten_webgl_get_current_context,
    emscripten_webgl_get_drawing_buffer_size: _emscripten_webgl_get_drawing_buffer_size,
    emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
    environ_get: _environ_get,
    environ_sizes_get: _environ_sizes_get,
    exit: _exit,
    glActiveTexture: _glActiveTexture,
    glAttachShader: _glAttachShader,
    glBindAttribLocation: _glBindAttribLocation,
    glBindBuffer: _glBindBuffer,
    glBindFramebuffer: _glBindFramebuffer,
    glBindRenderbuffer: _glBindRenderbuffer,
    glBindTexture: _glBindTexture,
    glBindVertexArray: _glBindVertexArray,
    glBlendFunc: _glBlendFunc,
    glBlitFramebuffer: _glBlitFramebuffer,
    glBufferData: _glBufferData,
    glBufferSubData: _glBufferSubData,
    glCheckFramebufferStatus: _glCheckFramebufferStatus,
    glClear: _glClear,
    glClearColor: _glClearColor,
    glClearDepthf: _glClearDepthf,
    glClearStencil: _glClearStencil,
    glColorMask: _glColorMask,
    glCompileShader: _glCompileShader,
    glCompressedTexImage2D: _glCompressedTexImage2D,
    glCopyTexImage2D: _glCopyTexImage2D,
    glCreateProgram: _glCreateProgram,
    glCreateShader: _glCreateShader,
    glCullFace: _glCullFace,
    glDeleteBuffers: _glDeleteBuffers,
    glDeleteFramebuffers: _glDeleteFramebuffers,
    glDeleteProgram: _glDeleteProgram,
    glDeleteShader: _glDeleteShader,
    glDeleteTextures: _glDeleteTextures,
    glDepthFunc: _glDepthFunc,
    glDepthMask: _glDepthMask,
    glDepthRangef: _glDepthRangef,
    glDisable: _glDisable,
    glDisableVertexAttribArray: _glDisableVertexAttribArray,
    glDrawArrays: _glDrawArrays,
    glDrawElements: _glDrawElements,
    glEnable: _glEnable,
    glEnableVertexAttribArray: _glEnableVertexAttribArray,
    glFlush: _glFlush,
    glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
    glFramebufferTexture2D: _glFramebufferTexture2D,
    glFrontFace: _glFrontFace,
    glGenBuffers: _glGenBuffers,
    glGenFramebuffers: _glGenFramebuffers,
    glGenRenderbuffers: _glGenRenderbuffers,
    glGenTextures: _glGenTextures,
    glGenVertexArrays: _glGenVertexArrays,
    glGenerateMipmap: _glGenerateMipmap,
    glGetBooleanv: _glGetBooleanv,
    glGetIntegerv: _glGetIntegerv,
    glGetProgramInfoLog: _glGetProgramInfoLog,
    glGetProgramiv: _glGetProgramiv,
    glGetShaderInfoLog: _glGetShaderInfoLog,
    glGetShaderiv: _glGetShaderiv,
    glGetUniformLocation: _glGetUniformLocation,
    glLinkProgram: _glLinkProgram,
    glPixelStorei: _glPixelStorei,
    glRenderbufferStorage: _glRenderbufferStorage,
    glScissor: _glScissor,
    glShaderSource: _glShaderSource,
    glTexImage2D: _glTexImage2D,
    glTexImage3D: _glTexImage3D,
    glTexParameteri: _glTexParameteri,
    glTexSubImage3D: _glTexSubImage3D,
    glUniform1f: _glUniform1f,
    glUniform1i: _glUniform1i,
    glUniform4fv: _glUniform4fv,
    glUniformMatrix4fv: _glUniformMatrix4fv,
    glUseProgram: _glUseProgram,
    glVertexAttrib2f: _glVertexAttrib2f,
    glVertexAttrib4f: _glVertexAttrib4f,
    glVertexAttribPointer: _glVertexAttribPointer,
    glViewport: _glViewport,
    invoke_ff: invoke_ff,
    invoke_i: invoke_i,
    invoke_ii: invoke_ii,
    invoke_iii: invoke_iii,
    invoke_iiii: invoke_iiii,
    invoke_iiiii: invoke_iiiii,
    invoke_iiiiiii: invoke_iiiiiii,
    invoke_iiiiiiii: invoke_iiiiiiii,
    invoke_v: invoke_v,
    invoke_vi: invoke_vi,
    invoke_vii: invoke_vii,
    invoke_viii: invoke_viii,
    invoke_viiii: invoke_viiii,
    invoke_viiiii: invoke_viiiii,
    invoke_viiiiii: invoke_viiiiii,
    invoke_viiiiiii: invoke_viiiiiii,
    invoke_viiiiiiii: invoke_viiiiiiii,
    memory: wasmMemory,
    proc_exit: _proc_exit,
    random_get: _random_get
  };
}
function invoke_ii(e, r) {
  var t = stackSave();
  try {
    return dynCall_ii(e, r);
  } catch (e) {
    stackRestore(t);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_vi(e, r) {
  var t = stackSave();
  try {
    dynCall_vi(e, r);
  } catch (e) {
    stackRestore(t);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_iiii(e, r, t, i) {
  var n = stackSave();
  try {
    return dynCall_iiii(e, r, t, i);
  } catch (e) {
    stackRestore(n);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_i(e) {
  var r = stackSave();
  try {
    return dynCall_i(e);
  } catch (e) {
    stackRestore(r);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_v(e) {
  var r = stackSave();
  try {
    dynCall_v(e);
  } catch (e) {
    stackRestore(r);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viiiii(e, r, t, i, n, a) {
  var s = stackSave();
  try {
    dynCall_viiiii(e, r, t, i, n, a);
  } catch (e) {
    stackRestore(s);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viii(e, r, t, i) {
  var n = stackSave();
  try {
    dynCall_viii(e, r, t, i);
  } catch (e) {
    stackRestore(n);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_iii(e, r, t) {
  var i = stackSave();
  try {
    return dynCall_iii(e, r, t);
  } catch (e) {
    stackRestore(i);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_iiiii(e, r, t, i, n) {
  var a = stackSave();
  try {
    return dynCall_iiiii(e, r, t, i, n);
  } catch (e) {
    stackRestore(a);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_iiiiiiii(e, r, t, i, n, a, s, o) {
  var c = stackSave();
  try {
    return dynCall_iiiiiiii(e, r, t, i, n, a, s, o);
  } catch (e) {
    stackRestore(c);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_vii(e, r, t) {
  var i = stackSave();
  try {
    dynCall_vii(e, r, t);
  } catch (e) {
    stackRestore(i);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viiiiiii(e, r, t, i, n, a, s, o) {
  var c = stackSave();
  try {
    dynCall_viiiiiii(e, r, t, i, n, a, s, o);
  } catch (e) {
    stackRestore(c);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_iiiiiii(e, r, t, i, n, a, s) {
  var o = stackSave();
  try {
    return dynCall_iiiiiii(e, r, t, i, n, a, s);
  } catch (e) {
    stackRestore(o);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viiii(e, r, t, i, n) {
  var a = stackSave();
  try {
    dynCall_viiii(e, r, t, i, n);
  } catch (e) {
    stackRestore(a);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viiiiiiii(e, r, t, i, n, a, s, o, c) {
  var l = stackSave();
  try {
    dynCall_viiiiiiii(e, r, t, i, n, a, s, o, c);
  } catch (e) {
    stackRestore(l);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_ff(e, r) {
  var t = stackSave();
  try {
    return dynCall_ff(e, r);
  } catch (e) {
    stackRestore(t);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function invoke_viiiiii(e, r, t, i, n, a, s) {
  var o = stackSave();
  try {
    dynCall_viiiiii(e, r, t, i, n, a, s);
  } catch (e) {
    stackRestore(o);
    if (!(e instanceof EmscriptenEH)) {
      throw e;
    }
    _setThrew(1, 0);
  }
}
function applySignatureConversions(e) {
  var r = e => r => e(r) >>> 0;
  var t = e => () => e() >>> 0;
  (e = Object.assign({}, e)).malloc = r(e.malloc);
  e.pthread_self = t(e.pthread_self);
  e._emscripten_tls_init = t(e._emscripten_tls_init);
  e._emscripten_stack_alloc = r(e._emscripten_stack_alloc);
  e.emscripten_stack_get_current = t(e.emscripten_stack_get_current);
  return e;
}
function callMain(e = []) {
  var r = __emscripten_proxy_main;
  runtimeKeepalivePush();
  e.unshift(thisProgram);
  var t = e.length;
  var i = stackAlloc((t + 1) * 4);
  var n = i;
  for (var a of e) {
    (growMemViews(), HEAPU32)[n >>> 2 >>> 0] = stringToUTF8OnStack(a);
    n += 4;
  }
  (growMemViews(), HEAPU32)[n >>> 2 >>> 0] = 0;
  try {
    var s = r(t, i);
    exitJS(s, true);
    return s;
  } catch (e) {
    return handleException(e);
  }
}
async function run(e = programArgs) {
  if (ENVIRONMENT_IS_PTHREAD) {
    initRuntime();
  } else {
    preRun();
    if (runDependencies) {
      await resolveRunDependencies();
    }
    var r = Module.setStatus;
    if (r) {
      r("Running...");
      await new Promise(e => setTimeout(e, 1));
      setTimeout(r, 1, "");
    }
    if (!ABORT) {
      initRuntime();
      Module.onRuntimeInitialized?.();
      if (!Module.noInitialRun && !false) {
        callMain(e);
      }
      postRun();
    }
  }
}
if (!ENVIRONMENT_IS_PTHREAD) {
  createWasm().then(() => run());
}