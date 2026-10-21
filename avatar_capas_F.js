/* avatar_capas_F.js — CANDIDATA F = candidata E con el pintado optimizado (mismo comportamiento y mismo dibujo). Base C: capas como archivos .webp separados (./capas/<clave>.webp) + C1.
 *
 * C1 · Preparación y verificación antes de dibujar
 *   prepararCapas(look) → Promise<{valido:true,claves} | {valido:false,reserva:true,motivo,claves?,fallos?}>
 *     Averigua qué capas necesita ese retrato (ejecutando «en seco» el mismo código de dibujo) y comprueba cada una
 *     UNA sola vez por página: carga (load/error), dimensiones esperadas y descodificación completa (createImageBitmap).
 *     El resultado de cada capa se recuerda (también las esperas en curso): no se repiten cargas ni esperas.
 *   retrato(look,size) → {valido:true,svg} | {valido:false,reserva:true,motivo}      (síncrona)
 *     Solo entrega el SVG si TODAS sus capas se han verificado ya; si no, devuelve una reserva explícita con el motivo.
 *   obtenerRetrato(look,size) → Promise del mismo resultado (= prepararCapas + retrato).
 *   avatarCapas(look,size) → SVG o null (compatibilidad: null en cualquier reserva, también en C1).
 *   motivoReserva(look) → motivo A1/B1/fuera de rango o null (solo depende de la apariencia, igual que antes).
 *
 * Qué detecta el navegador (Chromium, comprobado) y qué NO:
 *   · Detecta: archivo ausente o carpeta ausente (error), archivo que no es una imagen (error), dimensiones
 *     distintas de las esperadas, y archivo truncado o con la cabecera/estructura dañada (createImageBitmap rechaza).
 *   · NO detecta: un WebP válido pero distinto del aprobado (otra imagen, otra versión) ni algunos daños dentro de
 *     los datos comprimidos que siguen descodificando (píxeles erróneos sin error). Con file:// la página no puede
 *     leer los bytes ni los píxeles del archivo, así que no puede comprobar la huella SHA-256 en tiempo de ejecución.
 *   · Por eso la integridad del contenido se garantiza ANTES de distribuir con comprobar_capas.py (C2).
 */
(function(){
"use strict";const VERSION='candF-2026-10-13';
const BASE=(document.currentScript&&document.currentScript.src)?new URL('capas/',document.currentScript.src).href:'capas/';
const INDICE={"cl_back":[1000,1100],"cl_front":[1000,1100],"co_back":[1000,1100],"co_front":[1000,1100],"cr_back":[1000,1100],"cr_front":[1000,1100],"f1_brows":[1000,1100],"f1_eyes":[1000,1100],"f1_head":[1000,1100],"f1_iris":[1000,1100],"f1_lips":[1000,1100],"f1_spec":[1000,1100],"f2_brows":[1000,1100],"f2_eyes":[1000,1100],"f2_head":[1000,1100],"f2_iris":[1000,1100],"f2_lips":[1000,1100],"f2_spec":[1000,1100],"f3_brows":[1000,1100],"f3_eyes":[1000,1100],"f3_head":[1000,1100],"f3_iris":[1000,1100],"f3_lips":[1000,1100],"f3_spec":[1000,1100],"f4_brows":[1000,1100],"f4_eyes":[1000,1100],"f4_head":[1000,1100],"f4_iris":[1000,1100],"f4_lips":[1000,1100],"f4_spec":[1000,1100],"f5_brows":[1000,1100],"f5_eyes":[1000,1100],"f5_head":[1000,1100],"f5_iris":[1000,1100],"f5_lips":[1000,1100],"f5_spec":[1000,1100],"f6_brows":[1000,1100],"f6_eyes":[1000,1100],"f6_head":[1000,1100],"f6_iris":[1000,1100],"f6_lips":[1000,1100],"f6_spec":[1000,1100],"f7_brows":[1000,1100],"f7_eyes":[1000,1100],"f7_head":[1000,1100],"f7_iris":[1000,1100],"f7_lips":[1000,1100],"f7_spec":[1000,1100],"fl_back":[1000,1100],"fl_front":[1000,1100],"fo_brows":[1000,1100],"fo_eyes":[1000,1100],"fo_head":[1000,1100],"fo_iris":[1000,1100],"fo_lips":[1000,1100],"fo_spec":[1000,1100],"la_back":[1000,1100],"la_front":[1000,1100],"mh_cc_front":[1000,1100],"mh_cd_front":[1000,1100],"mh_cr_front":[1000,1100],"mh_fl_back":[1000,1100],"mh_fl_front":[1000,1100],"mh_ha_front":[1000,1100],"mh_la_back":[1000,1100],"mh_la_front":[1000,1100],"mh_on_front":[1000,1100],"mh_ri_front":[1000,1100],"mm0_brows":[1000,1100],"mm0_eyes":[1000,1100],"mm0_head":[1000,1100],"mm0_iris":[1000,1100],"mm0_lips":[1000,1100],"mm0_spec":[1000,1100],"mm1_brows":[1000,1100],"mm1_eyes":[1000,1100],"mm1_head":[1000,1100],"mm1_iris":[1000,1100],"mm1_lips":[1000,1100],"mm1_spec":[1000,1100],"mm2_brows":[1000,1100],"mm2_eyes":[1000,1100],"mm2_head":[1000,1100],"mm2_iris":[1000,1100],"mm2_lips":[1000,1100],"mm2_spec":[1000,1100],"mm3_brows":[1000,1100],"mm3_eyes":[1000,1100],"mm3_head":[1000,1100],"mm3_iris":[1000,1100],"mm3_lips":[1000,1100],"mm3_spec":[1000,1100],"mm4_brows":[1000,1100],"mm4_eyes":[1000,1100],"mm4_head":[1000,1100],"mm4_iris":[1000,1100],"mm4_lips":[1000,1100],"mm4_spec":[1000,1100],"mm5_brows":[1000,1100],"mm5_eyes":[1000,1100],"mm5_head":[1000,1100],"mm5_iris":[1000,1100],"mm5_lips":[1000,1100],"mm5_spec":[1000,1100],"mm6_brows":[1000,1100],"mm6_eyes":[1000,1100],"mm6_head":[1000,1100],"mm6_iris":[1000,1100],"mm6_lips":[1000,1100],"mm6_spec":[1000,1100],"mm7_brows":[1000,1100],"mm7_eyes":[1000,1100],"mm7_head":[1000,1100],"mm7_iris":[1000,1100],"mm7_lips":[1000,1100],"mm7_spec":[1000,1100],"mm_back":[1000,1100],"mm_front":[1000,1100],"mo_back":[1000,1100],"mo_bun":[1000,1100],"mo_front":[1000,1100],"ri_back":[1000,1100],"ri_front":[1000,1100]};   // clave → [ancho, alto] esperados
const AN={"f": {"eyes": [[388.1, 478.5], [610.9, 478.5]], "irisR": 24.9, "skullTop": 95.3, "skullHalf": 249.7, "chin": 770.6, "nose": 647.6, "mouth": 723.9, "brows": 417.8, "hairline": 269.8, "ears": [216.7, 787.7], "earsY": [429.4, 639.8], "headEdge": [258.0, 746.4], "neckY": [776.1, 1037.8], "neckHalfTop": 153.1, "neckJoinY": 970.9, "neckJoinHalf": 188.1, "s_mid": [0.8157, 0.5922, 0.4627], "s_hi": [0.9137, 0.7255, 0.6118], "s_lo": [0.6039, 0.3882, 0.2863], "lips": [0.7059, 0.3765, 0.3137], "neck_mid": "#d79f7c", "neck_side": "#be8564"}, "f1": {"eyes": [[370.6, 479.7], [628.7, 478.9]], "irisR": 28.4, "skullTop": 138.2, "skullHalf": 251.5, "ears": [217.8, 787.0], "headEdge": [250.4, 753.4], "s_mid": [0.8039, 0.5843, 0.4667], "s_hi": [0.9176, 0.7216, 0.6196], "s_lo": [0.6118, 0.4, 0.3059], "lips": [0.702, 0.3765, 0.3255], "neck_mid": "#d09978", "neck_side": "#b47e61"}, "f2": {"eyes": [[384.9, 470.0], [615.5, 470.0]], "irisR": 22.9, "skullTop": 110.6, "skullHalf": 252.4, "ears": [198.0, 798.0], "headEdge": [243.1, 752.2], "chin": 843.1, "s_mid": [0.81, 0.5871, 0.4573], "s_hi": [0.9407, 0.7447, 0.6444], "s_lo": [0.5991, 0.3826, 0.2815], "lips": [0.6693, 0.3547, 0.2885], "neck_mid": "#d79f7c", "neck_side": "#c08866"}, "f3": {"eyes": [[379.9, 471.2], [623.2, 471.2]], "irisR": 24.8, "skullTop": 109.6, "skullHalf": 252.4, "ears": [213.0, 789.4], "headEdge": [247.4, 750.7], "chin": 862.0, "s_mid": [0.8079, 0.5857, 0.4574], "s_hi": [0.936, 0.7419, 0.6405], "s_lo": [0.6126, 0.397, 0.2949], "lips": [0.6895, 0.3618, 0.3046], "neck_mid": "#d8a17f", "neck_side": "#c28a68"}, "f4": {"eyes": [[388.2, 469.9], [612.5, 469.9]], "irisR": 22.1, "skullTop": 98.3, "skullHalf": 252.0, "ears": [204.4, 788.2], "headEdge": [246.5, 746.1], "chin": 859.2, "s_mid": [0.8115, 0.5887, 0.4595], "s_hi": [0.9265, 0.7265, 0.6268], "s_lo": [0.6096, 0.3956, 0.2929], "lips": [0.6885, 0.3616, 0.3012], "neck_mid": "#d9a17f", "neck_side": "#c68c6b"}, "f5": {"eyes": [[390.4, 470.4], [613.4, 470.4]], "irisR": 22.6, "skullTop": 88.0, "skullHalf": 247.4, "ears": [209.9, 782.9], "headEdge": [252.0, 740.8], "chin": 861.1, "s_mid": [0.8111, 0.5884, 0.4586], "s_hi": [0.9417, 0.7341, 0.6292], "s_lo": [0.6158, 0.4046, 0.3007], "lips": [0.6886, 0.3726, 0.3089], "neck_mid": "#d9a07f", "neck_side": "#c58c6b"}, "f6": {"eyes": [[387.1, 469.2], [622.9, 469.9]], "irisR": 27.3, "skullTop": 101.7, "skullHalf": 250.2, "ears": [214.1, 786.8], "headEdge": [251.0, 749.9], "chin": 847.0, "s_mid": [0.8055, 0.5858, 0.4578], "s_hi": [0.9232, 0.7254, 0.6285], "s_lo": [0.6106, 0.3971, 0.2947], "lips": [0.6866, 0.37, 0.303], "neck_mid": "#d8a080", "neck_side": "#c38969"}, "f7": {"eyes": [[388.2, 469.8], [612.5, 469.4]], "irisR": 24.2, "skullTop": 91.0, "skullHalf": 244.9, "ears": [213.5, 781.3], "headEdge": [253.3, 740.0], "chin": 881.2, "s_mid": [0.8116, 0.5882, 0.4587], "s_hi": [0.9249, 0.7219, 0.6235], "s_lo": [0.6174, 0.4037, 0.3017], "lips": [0.6854, 0.3765, 0.3078], "neck_mid": "#d89f7f", "neck_side": "#c68a6b"}, "mm0": {"eyes": [[398.8, 469.6], [614.5, 469.6]], "irisR": 23.4, "skullTop": 80.4, "skullHalf": 251.2, "ears": [209.3, 789.6], "headEdge": [249.0, 751.4], "chin": 874.4, "s_mid": [0.702, 0.5216, 0.4157], "s_hi": [0.8118, 0.6431, 0.5569], "s_lo": [0.5333, 0.3765, 0.2941], "lips": [0.6, 0.3725, 0.3255], "neck_mid": "#b5886b", "neck_side": "#a87c60"}, "mm1": {"eyes": [[393.3, 470.1], [609.0, 469.4]], "irisR": 23.4, "skullTop": 98.5, "skullHalf": 255.7, "ears": [206.4, 793.0], "headEdge": [244.3, 755.8], "chin": 887.9, "s_mid": [0.8118, 0.5647, 0.4353], "s_hi": [0.9216, 0.6902, 0.5804], "s_lo": [0.5843, 0.3765, 0.2784], "lips": [0.6941, 0.349, 0.3176], "neck_mid": "#d49675", "neck_side": "#a16649"}, "mm2": {"eyes": [[396.5, 470.9], [612.2, 470.1]], "irisR": 24.1, "skullTop": 89.7, "skullHalf": 263.1, "ears": [198.4, 803.4], "headEdge": [237.4, 763.6], "chin": 898.1, "s_mid": [0.7922, 0.5333, 0.4039], "s_hi": [0.9137, 0.6588, 0.5412], "s_lo": [0.5804, 0.3686, 0.2706], "lips": [0.6471, 0.3294, 0.298], "neck_mid": "#d49170", "neck_side": "#a66c4e"}, "mm3": {"eyes": [[397.3, 469.1], [612.9, 470.4]], "irisR": 20.4, "skullTop": 80.1, "skullHalf": 265.2, "ears": [200.9, 799.0], "headEdge": [233.5, 763.9], "chin": 892.0, "s_mid": [0.7765, 0.5137, 0.3843], "s_hi": [0.8941, 0.6392, 0.5176], "s_lo": [0.5725, 0.3647, 0.2627], "lips": [0.6549, 0.349, 0.3098], "neck_mid": "#c6896a", "neck_side": "#a86c4b"}, "mm4": {"eyes": [[396.8, 470.2], [612.5, 469.7]], "irisR": 19.9, "skullTop": 80.2, "skullHalf": 260.6, "ears": [201.5, 799.7], "headEdge": [238.7, 760.0], "chin": 904.3, "s_mid": [0.7529, 0.4824, 0.3529], "s_hi": [0.8902, 0.6196, 0.4941], "s_lo": [0.5647, 0.3451, 0.2471], "lips": [0.6039, 0.298, 0.2706], "neck_mid": "#bf8163", "neck_side": "#a86844"}, "mm5": {"eyes": [[397.0, 470.9], [612.7, 469.4]], "irisR": 20.5, "skullTop": 68.8, "skullHalf": 260.8, "ears": [204.1, 797.3], "headEdge": [239.1, 760.6], "chin": 906.2, "s_mid": [0.7882, 0.4824, 0.349], "s_hi": [0.9137, 0.6039, 0.4902], "s_lo": [0.5922, 0.349, 0.2431], "lips": [0.6549, 0.2902, 0.2824], "neck_mid": "#cd8161", "neck_side": "#b77653"}, "mm6": {"eyes": [[398.3, 469.6], [614.0, 469.6]], "irisR": 23.4, "skullTop": 76.5, "skullHalf": 261.4, "ears": [200.3, 799.9], "headEdge": [239.6, 762.4], "chin": 890.8, "s_mid": [0.7922, 0.4902, 0.349], "s_hi": [0.9255, 0.6196, 0.4902], "s_lo": [0.5961, 0.3529, 0.2431], "lips": [0.6902, 0.302, 0.2902], "neck_mid": "#cf815d", "neck_side": "#be7652"}, "mm7": {"eyes": [[399.4, 470.0], [615.1, 470.0]], "irisR": 21.1, "skullTop": 42.2, "skullHalf": 261.0, "ears": [196.0, 802.6], "headEdge": [238.3, 760.3], "chin": 930.5, "s_mid": [0.749, 0.4863, 0.3529], "s_hi": [0.8745, 0.6039, 0.4902], "s_lo": [0.5725, 0.3608, 0.251], "lips": [0.6451, 0.3098, 0.302], "neck_mid": "#c58263", "neck_side": "#b87d5b"}, "m": {"chin": 811.3, "scale": 3.261, "skullTop": 125, "skullHalf": 204.0, "Lsh": 0.30042745098039214, "Lmid": 0.5647764705882352, "Lhi": 0.7320627450980391, "eyes": [[403.6, 480.7], [596.4, 479.3]], "iris_r": 22.8, "s_lo": [0.549, 0.3647, 0.2784], "s_mid": [0.7333, 0.5255, 0.4235], "s_hi": [0.8667, 0.6863, 0.5765]}};
const URLS=Object.create(null),EST={urlsCreadas:0,peticiones:0,ausentes:Object.create(null),verificaciones:0,esperasReutilizadas:0};
// ESTADO[clave]: Promise (verificando) | {ok:true} | {ok:false,motivo}
const ESTADO=Object.create(null),RETENIDAS=Object.create(null);   // imágenes ya verificadas que se conservan: el navegador las reutiliza al pintar
const ESPERA_MAX=20000;   // ms: una capa que no termina de cargar en este tiempo cuenta como fallo
let GRABA=null;           // modo «en seco»: registra las claves que pide el código de dibujo, sin crear URL
function urlDe(k){if(GRABA){if(INDICE[k]){GRABA.add(k);return 'x'}return undefined}
 EST.peticiones++;let u=URLS[k];if(u)return u;if(!INDICE[k]){EST.ausentes[k]=(EST.ausentes[k]||0)+1;return undefined}
 u=BASE+k+'.webp';URLS[k]=u;EST.urlsCreadas++;return u}
const LY=new Proxy({},{get:(t,k)=>typeof k==='string'?urlDe(k):undefined,has:(t,k)=>k in INDICE});
// ===================== código de dibujo del prototipo (literal) =====================
const mix=(a,b,t)=>{const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)),A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const SKIN=['#f2d9c8','#e6bc9e','#cf9a76','#a9714f','#7c4b33','#523223'],SKN=['Muy clara','Clara','Media','Morena','Oscura','Muy oscura'];
const EYE=['#5b3b22','#4f80b0','#4e8a5c','#7d878e','#8a6334','#7b5b9c','#b8953b'],EYN=['Marrón','Azul','Verde','Gris','Avellana','Violeta','Ámbar'];
const HAIRC=['#1e1a19','#4a2f20','#7b5134','#c69d62','#a5492b','#a4a7ab','#d77aa3','#4f86c9','#7f569f'],HCN=['Negro','Castaño oscuro','Castaño','Rubio','Pelirrojo','Gris','Rosa','Azul','Morado'];
const F=AN.f;
// PLANTILLA COMÚN definida a partir de la pieza real
const TPL={cx:500,skullTop:F.skullTop,skullHalf:F.skullHalf,hairline:F.hairline,brows:F.brows,eyes:F.eyes,irisR:F.irisR,nose:F.nose,mouth:F.mouth,chin:F.chin,
 ears:{x:F.ears,y:F.earsY},headEdge:F.headEdge,neck:{y:[F.chin,F.neckY[1]],half:F.neckHalfTop,joinY:F.neckJoinY,joinHalf:F.neckJoinHalf},shoulders:{y:[F.neckJoinY,1100],half:[300,345,395]}};
// cara masculina provisional: se encaja en la plantilla alineando los ojos
const MT=(()=>{const e=AN.m.eyes,s=(TPL.eyes[1][0]-TPL.eyes[0][0])/(e[1][0]-e[0][0]),mx=(e[0][0]+e[1][0])/2,my=(e[0][1]+e[1][1])/2,ex=(TPL.eyes[0][0]+TPL.eyes[1][0])/2,ey=TPL.eyes[0][1];return {s,tf:`translate(${ex},${ey}) scale(${s}) translate(${-mx},${-my})`,skullTop:ey-(my-AN.m.skullTop)*s,skullHalf:AN.m.skullHalf*s}})();
let ID=0;const f1=v=>(+v).toFixed(1);
const hex2=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255);
// --- cambio de tez que conserva textura y sombras: curva por canal que lleva el tono medio de la ilustración al tono elegido ---
function skinCurve(id,tone,st,k){k=k==null?1:k;const ds=v=>{const l=v[0]*.299+v[1]*.587+v[2]*.114;return v.map(x=>l+(x-l)*k)},SL=ds(st.s_lo),SM=ds(st.s_mid),SH=ds(st.s_hi),t=hex2(tone),n=48,fn=[];for(let c=0;c<3;c++){const lo=SL[c],md=SM[c],hi=SH[c],tm=t[c],tl=tm*Math.pow(lo/md,1.05),th=tm+(1-tm)*((hi-md)/(1-md))*.85;
  const P=[[0,0],[lo,tl],[md,tm],[hi,th],[1,Math.min(1,th+(1-th)*.6)]],v=[];for(let i=0;i<n;i++){const x=i/(n-1);let j=0;while(j<P.length-2&&x>P[j+1][0])j++;const[a,ya]=P[j],[b,yb]=P[j+1];v.push(Math.max(0,Math.min(1,ya+(yb-ya)*(x-a)/(b-a))).toFixed(3))}fn.push(v.join(' '))}
 return `<filter id="${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">${k<1?`<feColorMatrix type="saturate" values="${k}"/>`:''}<feComponentTransfer><feFuncR type="table" tableValues="${fn[0]}"/><feFuncG type="table" tableValues="${fn[1]}"/><feFuncB type="table" tableValues="${fn[2]}"/></feComponentTransfer></filter>`}
function ramp(stops){const n=33,ch=[[],[],[]];for(let i=0;i<n;i++){const x=i/(n-1);let j=0;while(j<stops.length-2&&x>stops[j+1][0])j++;const[a,ca]=stops[j],[b,cb]=stops[j+1],t=Math.max(0,Math.min(1,(x-a)/((b-a)||1))),A=hex2(ca),Bc=hex2(cb);for(let k=0;k<3;k++)ch[k].push((A[k]+(Bc[k]-A[k])*t).toFixed(3))}return ch.map(c=>c.join(' '))}
// mapa de color por luminancia (iris, cejas, pelo en gris)
function gmap(id,stops){const[r,g,b]=ramp(stops);return `<filter id="${id}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values=".299 .587 .114 0 0 .299 .587 .114 0 0 .299 .587 .114 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="${r}"/><feFuncG type="table" tableValues="${g}"/><feFuncB type="table" tableValues="${b}"/></feComponentTransfer></filter>`}
// ---- peinado provisional (media melena, capa trasera + delantera, en grises para teñir) ----
function rnd(s){let x=Math.sin(s*999.7)*43758.5453;return x-Math.floor(x)}
function lock(P,w){const[p0,p1,p2,p3]=P,dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*w/2,ny=dx/l*w/2;return `M${f1(p0[0]+nx)},${f1(p0[1]+ny)} C${f1(p1[0]+nx*.95)},${f1(p1[1]+ny*.95)} ${f1(p2[0]+nx*.6)},${f1(p2[1]+ny*.6)} ${f1(p3[0])},${f1(p3[1])} C${f1(p2[0]-nx*.6)},${f1(p2[1]-ny*.6)} ${f1(p1[0]-nx*.95)},${f1(p1[1]-ny*.95)} ${f1(p0[0]-nx)},${f1(p0[1]-ny)} Z`}
function bz(P,u){const v=1-u;return [0,1].map(i=>v*v*v*P[0][i]+3*v*v*u*P[1][i]+3*v*u*u*P[2][i]+u*u*u*P[3][i])}
function seg(P,a,b){let o='';for(let k=0;k<=8;k++){const p=bz(P,a+(b-a)*k/8);o+=(k?'L':'M')+f1(p[0])+','+f1(p[1])+' '}return o}
function hairPaint(id,clipD,gen,n,seed,hiA,hiB){let locks='',dk='',lt='',fine='';
 for(let k=0;k<n;k++){const t=(k+.5+(rnd(seed+k)-.5)*.8)/n,r=rnd(seed+k*3.1),P=gen(Math.min(1,Math.max(0,t)),r),w=26+rnd(seed+k*7)*30,g=Math.round(95+rnd(seed+k*5)*60);
  locks+=`<path d="${lock(P,w)}" fill="rgb(${g},${g},${g})"/>`;dk+=seg(P.map((p,i)=>[p[0]+(i<3?w*.38:0),p[1]]),.03,.92);lt+=seg(P,hiA+rnd(seed+k)*.08,hiB-rnd(seed+k*2)*.08);
  for(let m=0;m<3;m++){const o=(rnd(seed+k*11+m)-.5)*w*.8;fine+=seg(P.map((p,i)=>[p[0]+(i<3?o:0),p[1]]),.04,.9)}}
 return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><path d="${clipD}" fill="#4a4a4a"/><g clip-path="url(#${id})">${locks}
 <path d="${dk}" fill="none" stroke="#262626" stroke-width="5" opacity=".55" filter="url(#${id}b1)"/><path d="${fine}" fill="none" stroke="#1e1e1e" stroke-width="1.4" opacity=".45"/>
 <path d="${lt}" fill="none" stroke="#e6e6e6" stroke-width="9" opacity=".5" stroke-linecap="round" filter="url(#${id}b1)"/><path d="${fine.split(' M').filter((_,i)=>i%3==0).join(' M')}" fill="none" stroke="#d9d9d9" stroke-width="1.3" opacity=".5"/>
 <rect x="0" y="0" width="1000" height="1100" fill="url(#${id}hs)"/></g><path d="${clipD}" fill="none" stroke="#1a1a1a" stroke-width="2.4" opacity=".6"/>
 <filter id="${id}b1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
 <linearGradient id="${id}hs" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>`}
function hairLayers(id,T,S){const c=500,L=v=>c-v,R=v=>c+v,bt=TPL.chin+15,part=L(75),hl=TPL.hairline;
 const back=`M${L(S+26)},${T+190} C${L(S+46)},${T-60} ${R(S+46)},${T-60} ${R(S+26)},${T+190} C${R(S+48)},${T+380} ${R(S+38)},${bt-90} ${R(S+44)},${bt} Q${c},${bt+18} ${L(S+44)},${bt} C${L(S+38)},${bt-90} ${L(S+48)},${T+380} ${L(S+26)},${T+190} Z`;
 const lp=`M${part},${T-24} C${L(S*.7)},${T-32} ${L(S+36)},${T+30} ${L(S+32)},${T+190} C${L(S+40)},${T+400} ${L(S+32)},${bt-60} ${L(S+42)},${bt-4} L${L(S-30)},${bt-24} C${L(S-38)},${T+460} ${L(S-36)},${T+330} ${L(S-40)},${hl+60} C${L(S-50)},${hl+10} ${L(110)},${hl-14} ${part},${hl-26} Z`;
 const rp=`M${part},${T-24} L${part},${hl-26} C${L(10)},${hl-34} ${R(110)},${hl-16} ${R(S-46)},${hl+40} C${R(S-36)},${T+300} ${R(S-34)},${T+450} ${R(S-28)},${bt-24} L${R(S+42)},${bt-2} C${R(S+34)},${bt-70} ${R(S+42)},${T+400} ${R(S+34)},${T+190} C${R(S+38)},${T+20} ${R(S*.6)},${T-38} ${part},${T-24} Z`;
 const gb=(t,r)=>{const x=L(S+32)+t*(2*S+64);return [[c+(t-.5)*120,T+10],[x,T+60],[x+(r-.5)*24,T+420],[L(S+40)+t*(2*S+80),bt-6]]};
 const gl=(t,r)=>[[part+10+t*6,T-18+t*8],[L(S-40+t*70),hl-10-t*110],[L(S-34+t*62)+(r-.5)*16,T+380],[L(S-30+t*66)+(r-.5)*10,bt-20+t*14]];
 const gr=(t,r)=>[[part-6-t*10,T-18+t*8],[R(20+t*(S-20)),hl-30-t*100],[R(S-40+t*70)-(r-.5)*16,T+380],[R(S-30+t*66)+(r-.5)*10,bt-20+t*16]];
 return {back:hairPaint(id+'hb',back,gb,22,1,.08,.3),front:hairPaint(id+'hl',lp,gl,12,40,.06,.26)+hairPaint(id+'hr',rp,gr,18,80,.06,.26),cast:`<g clip-path="url(#${id}fc)" opacity=".45"><path d="${lp}" transform="translate(6,14)" fill="#3a1a10" filter="url(#${id}sb)"/><path d="${rp}" transform="translate(6,14)" fill="#3a1a10" filter="url(#${id}sb)"/></g>`}}
// ---- hombros (3 complexiones), pintados con los colores del cuello de la ilustración para que el cambio de tez sea el mismo ----
let NC=null;function body(bd){const S=TPL.shoulders.half[bd],c=500,y=1000,P=`M${c-148},930 C${c-158},960 ${c-180},985 ${c-214},${y} C${c-262},1018 ${c-S+40},1030 ${c-S},1072 L${c-S-14},1100 L${c+S+14},1100 L${c+S},1072 C${c+S-40},1030 ${c+262},1018 ${c+214},${y} C${c+180},985 ${c+158},960 ${c+148},930 Z`,cid='bc'+(++ID);
 return `<clipPath id="${cid}"><path d="${P}"/></clipPath><path d="M${c-148},930 C${c-158},960 ${c-180},985 ${c-214},${y} C${c-262},1018 ${c-S+40},1030 ${c-S},1072 L${c-S-14},1100 L${c+S+14},1100 L${c+S},1072 C${c+S-40},1030 ${c+262},1018 ${c+214},${y} C${c+180},985 ${c+158},960 ${c+148},930 Z" fill="url(#BODYG)"/>
 <g clip-path="url(#${cid})"><path d="M${c-220},1004 C${c-270},1022 ${c-S+50},1034 ${c-S+8},1076" fill="none" stroke="${NC.neck_side}" stroke-width="20" opacity=".7" filter="url(#BODYB)"/>
 <path d="M${c-30},1050 C${c-100},1040 ${c-170},1044 ${c-240},1058 M${c+30},1050 C${c+100},1040 ${c+170},1044 ${c+240},1058" fill="none" stroke="#9a5c40" stroke-width="7" opacity=".3" filter="url(#BODYB2)"/>
 <path d="M${c-30},1060 C${c-100},1050 ${c-170},1054 ${c-240},1068 M${c+30},1060 C${c+100},1050 ${c+170},1054 ${c+240},1068" fill="none" stroke="#f2c4a6" stroke-width="6" opacity=".35" filter="url(#BODYB2)"/>
 <path d="M${c+220},1004 C${c+270},1022 ${c+S-40},1034 ${c+S},1072 L${c+S+14},1100 L${c+S-70},1100 Z" fill="#8a5238" opacity=".22" filter="url(#BODYB)"/></g>`}
// ---- gafas provisionales (se colocan con los puntos de ojos y sienes de la plantilla) ----
function glasses(A){A=A||TPL;const e=A.eyes,fr='#2b1d16',w=82,h=50;let o='';
 e.forEach(([x,y])=>{o+=`<rect x="${x-w}" y="${y-h}" width="${2*w}" height="${2*h}" rx="30" fill="#dfe9f2" fill-opacity=".1" stroke="${fr}" stroke-width="8"/><rect x="${x-w}" y="${y-h}" width="${2*w}" height="${2*h}" rx="30" fill="none" stroke="#8a5a3c" stroke-width="2.5" opacity=".7"/><path d="M${x-w+18},${y-h+16} l48,-7" stroke="#fff" stroke-width="6" opacity=".35" stroke-linecap="round"/>`});
 o+=`<path d="M${e[0][0]+w},${e[0][1]-12} Q500,${e[0][1]-32} ${e[1][0]-w},${e[1][1]-12}" fill="none" stroke="${fr}" stroke-width="8"/>`;
 o+=`<path d="M${e[0][0]-w},${e[0][1]-22} L${A.headEdge[0]+4},${e[0][1]-28} M${e[1][0]+w},${e[1][1]-22} L${A.headEdge[1]-4},${e[1][1]-28}" stroke="${fr}" stroke-width="8" fill="none"/>`;
 const sh=e.map(([x,y])=>`<rect x="${x-w+6}" y="${y+h+4}" width="${2*w-12}" height="14" rx="7" fill="#5a2e1c"/>`).join('');
 return `<g opacity=".18" filter="url(#GLB)">${sh}</g>`+o}
// ---- composición ----
function avatar(o,size){const id='p'+(++ID),fem=o.sx===1,real=o.sx!==2,t=o.skin<0?null:SKIN[o.skin],ey=EYE[o.ey<0?0:o.ey],hc=HAIRC[o.hc];
 const sx2=[.965,1,1.035][o.bd],tf=`translate(${500*(1-sx2)},0) scale(${sx2},1)`;
 NC=null;const FK=fem?['fo','f1','f2','f3','f4','f5','f6','f7'][o.fc]:real?['mm0','mm1','mm2','mm3','mm4','mm5','mm6','mm7'][o.mc|0]:'m',FA=fem?[F,AN.f1,AN.f2,AN.f3,AN.f4,AN.f5,AN.f6,AN.f7][o.fc]:real?[AN.mm0,AN.mm1,AN.mm2,AN.mm3,AN.mm4,AN.mm5,AN.mm6,AN.mm7][o.mc|0]:AN.m,st=FA,skinF=t?skinCurve(id+'sk',t,st,[1,1,1,.85,.7,.6][o.skin]):'';
 const irisF=o.ey<0?'':gmap(id+'ir',[[0,'#070403'],[.12,'#0d0806'],[.2,mix(ey,'#000000',.6)],[.36,mix(ey,'#000000',.15)],[.5,ey],[.66,mix(ey,'#ffffff',.3)],[.86,mix(ey,'#ffffff',.65)],[1,'#ffffff']]);
 const bc=o.hc===3?mix(hc,'#4a3220',.35):o.hc>=5?mix(hc,'#3a2a22',.45):hc;
 const browF=gmap(id+'br',[[0,mix(bc,'#000000',.6)],[.35,mix(bc,'#000000',.25)],[.55,bc],[1,mix(bc,'#ffffff',.3)]]);
 const hd=o.hc===0?'#000000':'#1e0f08',hairI=gmap(id+'hi',[[0,mix(hc,hd,.85)],[.26,mix(hc,hd,.5)],[.4,mix(hc,hd,.2)],[.5,hc],[.64,mix(hc,'#fff4e0',o.hc===0?.1:.2)],[.8,mix(hc,'#fff4e0',o.hc===0?.24:.45)],[1,mix(hc,'#ffffff',o.hc===0?.45:.7)]]);
 const hairC=`<filter id="${id}hc" x="-10%" y="-10%" width="120%" height="120%"><feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .08  0 0 0 0 .04  0 0 0 .5 0"/><feGaussianBlur stdDeviation="9"/></filter>`;
 const hairF=gmap(id+'hf',[[0,mix(hc,'#000000',.8)],[.3,mix(hc,'#000000',.45)],[.5,hc],[.75,mix(hc,'#ffffff',.25)],[1,mix(hc,'#ffffff',.55)]]);
 const T=real?TPL.skullTop:MT.skullTop,SH=real?TPL.skullHalf:MT.skullHalf;
 NC=real?FA:F;const male=o.sx===0,MHK=MHAIR[o.mh|0][2],HK=male?MHK:['','mm','h1','co','la','ri','mo','cr','fl','cl'][o.hair],H=null,HI=male?!!(MHK&&(LY[HK+'_front']||LY[HK+'_back'])):o.hair>=1;
 const im=(k,n,f,op)=>LY[k+'_'+n]?`<image href="${LY[k+'_'+n]}" x="0" y="0" width="1000" height="1100"${f?` filter="url(#${f})"`:''}${op?` opacity="${op}"`:''}/>`:'';
 const sk=t?id+'sk':'';
 const face=real?`${im(FK,'head',sk)}${im(FK,'lips',sk)}${im(FK,'spec','', t?.55:0)}${im(FK,'eyes')}${o.ey<0?'':im(FK,'iris',id+'ir')}${im(FK,'brows',id+'br')}`
  :`<g transform="${MT.tf}">${im('m','head',sk)}${im('m','lips',sk)}${im('m','eyes')}${o.ey<0?'':im('m','iris',id+'ir')}${im('m','brows',id+'br')}</g>`;
 const g=TPL,l=(y,txt,c)=>`<line x1="30" x2="970" y1="${y}" y2="${y}" stroke="${c}" stroke-width="2" stroke-dasharray="10 8"/><text x="36" y="${y-6}" font-size="22" fill="${c}" font-family="sans-serif">${txt}</text>`;
 const guide=o.guide?`<g opacity=".9">${l(g.skullTop,'cráneo','#c0392b')}${l(g.hairline,'línea del pelo','#8e44ad')}${l(g.brows,'cejas','#2c3e50')}${l(g.eyes[0][1],'ojos','#2980b9')}${l(g.nose,'base nariz','#16a085')}${l(g.mouth,'boca','#d35400')}${l(g.chin,'barbilla','#c0392b')}${l(g.neck.joinY,'unión cuello / hombros','#7f8c8d')}<line x1="500" x2="500" y1="30" y2="1090" stroke="#2980b9" stroke-width="2" stroke-dasharray="6 6"/>${g.eyes.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${g.irisR}" fill="none" stroke="#2980b9" stroke-width="3"/>`).join('')}${g.ears.x.map(x=>`<rect x="${x-(x<500?0:44)}" y="${g.ears.y[0]}" width="44" height="${g.ears.y[1]-g.ears.y[0]}" fill="none" stroke="#27ae60" stroke-width="3"/>`).join('')}</g>`:'';
 return `<svg viewBox="0 0 1000 1100" width="${size}" height="${Math.round(size*1.1)}" xmlns="http://www.w3.org/2000/svg" style="background:linear-gradient(180deg,#f4f1ec,#e6e1d9)">
 <defs>${skinF}${irisF}${browF}${hairF}${hairI}${hairC}
 <linearGradient id="BODYG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${NC.neck_side}"/><stop offset=".42" stop-color="${NC.neck_mid}"/><stop offset="1" stop-color="${mix(NC.neck_side,'#5a2e1c',.25)}"/></linearGradient>
 <filter id="BODYB" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter><filter id="BODYB2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter><filter id="GLB" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="${id}sb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12"/></filter>
 <clipPath id="${id}fc"><ellipse cx="500" cy="${(T+TPL.chin)/2}" rx="${SH+6}" ry="${(TPL.chin-T)/2}"/></clipPath>
 </defs>
 <g transform="${tf}">${HI&&o.layers!=='face'&&LY[HK+'_back']?`<image href="${LY[HK+'_back']}" width="1000" height="1100" filter="url(#${id}hi)"/>`:''}${H&&o.layers!=='face'?`<g filter="url(#${id}hf)">${H.back}</g>`:''}</g>
 ${o.layers==='hair'?'':`<g${sk?` filter="url(#${sk})"`:''} transform="${tf}">${body(o.bd)}</g><g transform="${tf}">${face}</g>`}
 <g transform="${tf}">${o.av&&o.layers!=='hair'?glasses(real?FA:null):''}</g>
 <g transform="${tf}">${HI&&o.layers!=='face'&&LY[HK+'_front']?`${o.layers==='hair'?'':`<g clip-path="url(#${id}fc)"><image href="${LY[HK+'_front']}" width="1000" height="1100" filter="url(#${id}hc)" transform="translate(5,12)"/></g>`}<image href="${LY[HK+'_front']}" width="1000" height="1100" filter="url(#${id}hi)"/>${LY[HK+'_bun']?`<image href="${LY[HK+'_bun']}" width="1000" height="1100" filter="url(#${id}hi)"/>`:''}`:''}${H&&o.layers!=='face'?`${o.layers==='hair'?'':H.cast}<g filter="url(#${id}hf)">${H.front}</g>`:''}</g>
 ${guide}</svg>`}
// ---- interfaz ----
const MHAIR=[['Calvo','🧑‍🦲',''],['Corto clásico','💇','mh_cc'],['Corto degradado','✂️','mh_cd'],['Rizado','🧑‍🦱','mh_ri'],['Ondulado','🌊','mh_on'],['Largo','💇‍♂️','mh_la'],['Flequillo','💈','mh_fl'],['Cresta','🔥','mh_cr'],['Hacia atrás','🎩','mh_ha']];

// ===================== correspondencias juego → prototipo (aprobadas 13/10/2026) =====================
// Caras del juego (FACE): 0 Ovalada,1 Redonda,2 Cuadrada,3 Alargada,4 Corazón,5 Con carácter,6 Fina,7 Ojos grandes
const FC_JUEGO_A_PROTO=[0,1,2,7,3,4,5,6];
// Peinados del juego (HAIRS): 0 Corto,1 Largo,2 Rizado,3 Moño,4 Cresta,5 Calvo,6 Flequillo,7 Media melena,8 Coleta
const HS_CHICA_A_PROTO=[3,4,5,6,7,0,8,1,9];               // índices de OPT.hair del prototipo
const HS_CHICO_A_PROTO=[1,5,3,null,7,0,6,null,null];       // índices de MHAIR; null = sin equivalente (A1)
const HS_NOMBRE=['Corto','Largo','Rizado','Moño','Cresta','Calvo','Flequillo','Media melena','Coleta'];
const AV_NOMBRE=['Ninguno','Gafas','Pecas','Sombrero','Pendientes'];
const ent=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
function motivoReserva(c){
 if(!c||typeof c!=='object')return 'fuera de rango: apariencia ausente';
 const sx=c.sx?1:0;
 for(const [k,a,b] of [['fc',0,7],['hs',0,8],['skin',0,5],['hc',0,8],['ey',0,6],['av',0,4]])if(!ent(c[k],a,b))return `fuera de rango: ${k}=${c[k]}`;
 if(c.bd!=null&&!ent(c.bd,0,2))return `fuera de rango: bd=${c.bd}`;
 if(c.av>=2)return `B1: accesorio ${AV_NOMBRE[c.av]} sin equivalente por capas`;
 if(sx===0&&HS_CHICO_A_PROTO[c.hs]===null)return `A1: chico con ${HS_NOMBRE[c.hs]} sin equivalente por capas`;
 return null}
function lookAPrototipo(c){if(motivoReserva(c))return null;const sx=c.sx?1:0,f=FC_JUEGO_A_PROTO[c.fc];
 const o={sx,bd:c.bd==null?1:c.bd,skin:c.skin,ey:c.ey,hc:c.hc,av:c.av===1?1:0,guide:0,fc:0,mc:0,hair:1,mh:0};
 if(sx===1){o.fc=f;o.hair=HS_CHICA_A_PROTO[c.hs]}else{o.mc=f;o.mh=HS_CHICO_A_PROTO[c.hs]}
 return o}

// ===================== C1 · verificación de capas =====================
const MEMO_CLAVES=new Map();   // las capas que usa un retrato solo dependen de la apariencia: se calculan una vez
function clavesDeProto(o){const q=JSON.stringify(o);let s=MEMO_CLAVES.get(q);if(s)return s.slice();GRABA=new Set();try{avatar(o,10)}finally{}s=[...GRABA].sort();GRABA=null;MEMO_CLAVES.set(q,s);return s.slice()}
function clavesDe(c){const o=lookAPrototipo(c);return o?clavesDeProto(o):null}
function verificarCapa(k){
 const e=ESTADO[k];if(e){if(e instanceof Promise)EST.esperasReutilizadas++;return e instanceof Promise?e:Promise.resolve(e)}
 EST.verificaciones++;const [W,H]=INDICE[k],u=BASE+k+'.webp';
 const p=new Promise(fin=>{const im=new Image();let hecho=false;
  const t=setTimeout(()=>acabar({ok:false,motivo:'tiempo de carga agotado'}),ESPERA_MAX);
  function acabar(r){if(hecho)return;hecho=true;clearTimeout(t);im.onload=im.onerror=null;ESTADO[k]=r;fin(r)}
  im.onerror=()=>acabar({ok:false,motivo:'no se pudo cargar (archivo o carpeta ausente, o no es una imagen)'});
  im.onload=()=>{if(im.naturalWidth!==W||im.naturalHeight!==H)return acabar({ok:false,motivo:`dimensiones ${im.naturalWidth}×${im.naturalHeight}, se esperaban ${W}×${H}`});
   if(typeof createImageBitmap!=='function')return acabar({ok:true,sinDescodificar:true});
   createImageBitmap(im).then(bm=>{const okd=bm.width===W&&bm.height===H;bm.close&&bm.close();
     if(okd)RETENIDAS[k]=im;acabar(okd?{ok:true}:{ok:false,motivo:'descodificación con dimensiones inesperadas'})},
    er=>acabar({ok:false,motivo:'no se puede descodificar completa (archivo truncado o dañado): '+(er&&er.name||er)}))};
  im.src=u});
 ESTADO[k]=p;return p}
function reservaC1(fallos){return {valido:false,reserva:true,motivo:'C1: '+fallos.map(([k,m])=>`capa ${k}: ${m}`).join(' · '),fallos}}
async function prepararProto(o){const ks=clavesDeProto(o);const rs=await Promise.all(ks.map(verificarCapa));
 const fallos=ks.map((k,i)=>[k,rs[i]]).filter(([,r])=>!r.ok).map(([k,r])=>[k,r.motivo]);
 return fallos.length?{...reservaC1(fallos),claves:ks}:{valido:true,claves:ks}}
async function prepararCapas(c){const m=motivoReserva(c);if(m)return {valido:false,reserva:true,motivo:m};return prepararProto(lookAPrototipo(c))}
function retratoProto(o,size){const ks=clavesDeProto(o),fallos=[];
 for(const k of ks){const e=ESTADO[k];if(!e)fallos.push([k,'no preparada (falta llamar a prepararCapas)']);else if(e instanceof Promise)fallos.push([k,'verificación en curso']);else if(!e.ok)fallos.push([k,e.motivo])}
 return fallos.length?reservaC1(fallos):{valido:true,svg:avatar(o,size)}}
function retrato(c,size){const m=motivoReserva(c);if(m)return {valido:false,reserva:true,motivo:m};return retratoProto(lookAPrototipo(c),size)}
async function obtenerRetrato(c,size){const p=await prepararCapas(c);return p.valido?retrato(c,size):p}
function avatarCapas(c,size){const r=retrato(c,size);return r.valido?r.svg:null}
function estadoCapas(){const r={};for(const k in ESTADO){const e=ESTADO[k];r[k]=e instanceof Promise?'verificando':e.ok?'ok':'fallo: '+e.motivo}return r}

// ===================== O3 · vista: avatar antiguo primero; retrato por capas solo cuando está listo =====================
// crearVista(contenedor,{avatarAntiguo(look,size), size, pintadoMax, alCambiar(evento)})
//  · mostrar(look): enseña al instante el avatar antiguo de ESA selección (nunca se queda a la vista otra anterior),
//    prepara y verifica las capas (C1) y pinta el retrato nuevo TAPADO, debajo del visible. Solo cuando todas sus
//    imágenes han disparado «load» (ninguna «error») y se ha pintado un fotograma con él, se intercambian las dos capas de la
//    vista en un mismo cambio de DOM: nunca se ve un retrato a medio cargar ni un icono de imagen rota.
//  · Cada llamada tiene un turno: una preparación antigua que termina tarde se descarta y no toca lo visible.
//  · Si falla cualquier paso, se queda el avatar antiguo de la selección actual y el motivo queda registrado.
//  · Si se vuelve a pedir la selección que ya se ve por capas, no se cambia nada (sin parpadeo).
function crearVista(el,op){
 op=op||{};const antiguo=op.avatarAntiguo;if(typeof antiguo!=='function')throw new Error('crearVista: falta avatarAntiguo(look,size)');
 const T=op.size||170,ESPERA=op.esperaMax==null?800:op.esperaMax,PINTADO_MAX=op.pintadoMax||10000,aviso=typeof op.alCambiar==='function'?op.alCambiar:()=>{};
 if(getComputedStyle(el).position==='static')el.style.position='relative';
 const nueva=()=>{const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center';return d};
 let vis=nueva(),oculta=nueva();vis.style.zIndex='2';oculta.style.zIndex='1';oculta.setAttribute('aria-hidden','true');el.replaceChildren(oculta,vis);
 let turno=0,esperaT=null,est={tipo:'vacío',turno:0,look:null,motivo:null,final:false};const REG=[];
 const registrar=ev=>{ev.t=performance.now();REG.push(ev);if(REG.length>1000)REG.shift();try{aviso({...ev})}catch(e){}};
 function verAntiguo(c,n,motivo,final){
  const mismo=est.tipo==='antiguo'&&est.look&&JSON.stringify(est.look)===JSON.stringify(c);
  if(!mismo)vis.innerHTML=antiguo(c,T);   // la capa tapada NO se toca aquí: puede contener el retrato que se está preparando
  est={tipo:'antiguo',turno:n,look:{...c},motivo:motivo||null,final:!!final};
  registrar({tipo:final?'reserva':'antiguo',turno:n,motivo:motivo||null,cambioVisible:!mismo})}
 function pintarTapado(svg,ks){
  oculta.innerHTML=svg;const raiz=oculta.firstElementChild,ims=[...oculta.querySelectorAll('image')];
  const hrefs=[...new Set(ims.map(i=>i.getAttribute('href')))].sort(),esper=ks.map(k=>urlDe(k)).sort();
  if(JSON.stringify(hrefs)!==JSON.stringify(esper))return Promise.resolve({ok:false,motivo:'el retrato pintado no usa exactamente las capas verificadas'});
  return new Promise(fin=>{let pend=ims.length;const mal=[];
   const t=setTimeout(()=>fin({ok:false,motivo:'tiempo de pintado agotado'}),PINTADO_MAX);
   const uno=(im,ok)=>{if(!ok)mal.push((im.getAttribute('href')||'').split('/').pop());if(--pend)return;clearTimeout(t);
    if(mal.length)fin({ok:false,motivo:'no se pudo pintar: '+mal.join(', ')});else requestAnimationFrame(()=>{const mc=new MessageChannel();mc.port1.onmessage=()=>fin({ok:true,raiz,n:ims.length});mc.port2.postMessage(0)})};   // tras el pintado del fotograma que ya incluye el retrato tapado
   if(!pend){clearTimeout(t);fin({ok:false,motivo:'el retrato no tiene capas'});return}
   ims.forEach(im=>{im.addEventListener('load',()=>uno(im,true),{once:true});im.addEventListener('error',()=>uno(im,false),{once:true})})})}
 async function mostrar(c){
  const n=++turno,look={...c};clearTimeout(esperaT);esperaT=null;
  const m=motivoReserva(look);
  if(m){oculta.innerHTML='';verAntiguo(look,n,m,true);return {...est}}
  // la selección actual se ve siempre: si ya se ve su retrato por capas no se toca nada; si no, su avatar antiguo al instante
  if(est.tipo==='capas'&&JSON.stringify(est.look)===JSON.stringify(look)){oculta.innerHTML='';est={...est,turno:n};registrar({tipo:'capas',turno:n,mismo:true,cambioVisible:false});return {...est}}
  verAntiguo(look,n,null,false);
  let p;try{p=await prepararCapas(look)}catch(e){p={valido:false,motivo:'C1: fallo de preparación: '+(e&&e.message||e)}}
  if(n!==turno){registrar({tipo:'descartado',turno:n,fase:'preparación'});return {descartado:true,turno:n}}
  if(!p.valido){clearTimeout(esperaT);oculta.innerHTML='';verAntiguo(look,n,p.motivo,true);return {...est}}
  const r=retrato(look,T);if(!r.valido){clearTimeout(esperaT);oculta.innerHTML='';verAntiguo(look,n,r.motivo,true);return {...est}}
  const pt=await pintarTapado(r.svg,p.claves);
  if(n!==turno){registrar({tipo:'descartado',turno:n,fase:'pintado'});return {descartado:true,turno:n}}
  clearTimeout(esperaT);esperaT=null;
  // comprobación final: lo que se va a enseñar sigue siendo exactamente el retrato pintado y completo
  if(pt.ok&&(oculta.firstElementChild!==pt.raiz||oculta.childElementCount!==1||oculta.querySelectorAll('image').length!==pt.n||![...oculta.querySelectorAll('image')].every(i=>i.isConnected)))pt.ok=false,pt.motivo='el retrato tapado cambió antes de mostrarse';
  if(!pt.ok){oculta.innerHTML='';verAntiguo(look,n,'C1: '+pt.motivo,true);return {...est}}
  // intercambio atómico: el retrato ya pintado pasa delante y el anterior se vacía en el mismo cambio de DOM
  const antes=est.tipo;[vis,oculta]=[oculta,vis];vis.style.zIndex='2';oculta.style.zIndex='1';vis.removeAttribute('aria-hidden');oculta.setAttribute('aria-hidden','true');oculta.innerHTML='';
  est={tipo:'capas',turno:n,look,motivo:null,final:true};registrar({tipo:'capas',turno:n,desde:antes,cambioVisible:true});return {...est}}
 return Object.freeze({mostrar,estado:()=>({...est,look:est.look&&{...est.look}}),registro:()=>REG.map(x=>({...x})),turnoActual:()=>turno})}
window.MiVidaAvatarCapas=Object.freeze({version:VERSION,crearVista,prepararCapas,retrato,obtenerRetrato,avatarCapas,motivoReserva,lookAPrototipo,clavesDe,estadoCapas,
 _avatarPrototipo:(o,size)=>avatar(o,size),_prepararProto:prepararProto,_retratoProto:retratoProto,claves:()=>Object.keys(INDICE),
 estadisticas:()=>({urlsCreadas:EST.urlsCreadas,peticiones:EST.peticiones,verificaciones:EST.verificaciones,esperasReutilizadas:EST.esperasReutilizadas,capasDisponibles:Object.keys(INDICE).length,ausentes:{...EST.ausentes},urls:{...URLS}}),
 tablas:Object.freeze({FC_JUEGO_A_PROTO,HS_CHICA_A_PROTO,HS_CHICO_A_PROTO})});
})();
