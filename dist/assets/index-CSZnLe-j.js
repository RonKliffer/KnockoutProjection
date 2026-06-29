(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();const T=["A","B","C","D","E","F","G","H","I","J","K","L"],pe=["1A","1B","1D","1E","1G","1I","1K","1L"],A=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],me=[[89,"Round of 16","Winner Match 74","Winner Match 77"],[90,"Round of 16","Winner Match 73","Winner Match 75"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function F(e){return new DOMParser().parseFromString(e,"text/html")}function he(e){const n={};for(const t of T){const r=g(e,`Group ${t}`),o=r?k(r):null;if(!o)throw new Error(`Could not find standings table for Group ${t}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(s=>s.querySelector("td"));if(n[t]=a.map(s=>Te(s,t)).filter(Boolean),n[t].length<4)throw new Error(`Group ${t} standings table did not contain four teams`)}return n}function ge(e){const n={};for(const t of T){const r=g(e,`Group ${t}`);if(!r)throw new Error(`Could not find match list for Group ${t}`);const o=[];let a=r.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const s=Ae(a,t,o.length);s&&o.push(s)}a=a.nextElementSibling}n[t]=o}return n}function we(e){const n=g(e,/ranking of third-plac(?:e|ed) teams/),t=n?k(n):null;if(!t)throw new Error("Could not find ranking of third-placed teams table");return Array.from(t.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map((r,o)=>{var l;const a=y(r),s=a[0]&&/^\d+$/.test(a[0])?0:-1,i=p(a[0+s])||o+1,c=(l=(a[1+s]||"").match(/[A-L]/))==null?void 0:l[0],u=h(a[2+s]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:i,group:c,team:u,played:p(a[3+s]),wins:p(a[4+s]),draws:p(a[5+s]),losses:p(a[6+s]),goalsFor:p(a[7+s]),goalsAgainst:p(a[8+s]),goalDifference:X(a[9+s]),points:p(a[10+s]),qualified:i<=8}})}function ye(e){const n=g(e,"Qualified teams"),t=n?k(n):null;if(!t)throw new Error("Could not find qualified teams table");const r=Array.from(t.querySelectorAll("tr")),a=y(r.find(u=>y(u).some(Fe))??t).map(Y),s=a.map((u,l)=>/^(winners|runners-up)$/.test(u)?l:-1).filter(u=>u>=0),i=a.map((u,l)=>u.includes("third-placed teams")||/^qualified\b/.test(u)?l:-1).filter(u=>u>=0);if(!s.length&&!i.length)throw new Error("Qualified teams table did not include placement columns");const c={};for(const u of r.filter(l=>l.querySelector("td"))){const l=Array.from(u.querySelectorAll("th, td"));for(const m of s)W(c,l[m],"placed");for(const m of i)W(c,l[m],"qualified")}return c}function be(e){const n=g(e,"Combinations of matches in the round of 32"),t=n?k(n):null;if(!t)throw new Error("Could not find third-place combination table");return Array.from(t.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map(r=>{const o=y(r),a=o.filter(i=>/^[A-L]$/.test(i)).slice(0,8),s=o.filter(i=>/^3[A-L]$/.test(i)).slice(0,8);return a.length!==8||s.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(pe.map((i,c)=>[i,s[c]]))}}).filter(Boolean)}function ve(e){const n=z(e),t=g(e,"Round of 32");if(!t)return Ee(n);for(const[s,i]of ke(t))n.set(s,i);const r=[];let o=t.nextElementSibling;for(;o&&!/^H2$/i.test(o.tagName);){if(/^H3$/i.test(o.tagName)){const i=f(o).split(/\s+vs\s+/i).map(qe),c=V(o),u=c.matchNumber??Ne(i[0],i[1]);u&&i.length===2&&r.push({matchNumber:u,round:"Round of 32",date:c.date,time:c.time,kickoffAt:c.kickoffAt,venue:c.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:c.homeTeam??i[0],resolvedAwayTeam:c.awayTeam??i[1],...S(c)})}o=o.nextElementSibling}const a=new Map(r.map(s=>[s.matchNumber,s]));return A.map(([s,i,c])=>{const u=a.get(s)??n.get(s);return{matchNumber:s,round:"Round of 32",date:(u==null?void 0:u.date)??"",time:(u==null?void 0:u.time)??"",kickoffAt:u==null?void 0:u.kickoffAt,venue:(u==null?void 0:u.venue)??"",homeSlot:i,awaySlot:c,resolvedHomeTeam:L(u,"home")??i,resolvedAwayTeam:L(u,"away")??c,...S(u)}})}function J(e=new Map){return me.map(([n,t,r,o])=>{const a=e.get(n);return{...Z(a),matchNumber:n,round:t,homeSlot:r,awaySlot:o,resolvedHomeTeam:(a==null?void 0:a.homeTeam)??r,resolvedAwayTeam:(a==null?void 0:a.awayTeam)??o,...S(a)}})}function Se(e){return J(z(e))}function R(e,n){const t=e.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i),r=n.replace(/\u2212/g,"-").match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);if(!t||!r)return;const o=Le(t[1]),a=Number(t[2]),s=Number(t[3]);let i=Number(r[1]);const c=Number(r[2]),u=r[3].toLowerCase(),l=Number(r[4]),m=Number(r[5]??"0");if(o===void 0)return;u==="p"&&i!==12?i+=12:u==="a"&&i===12&&(i=0);const N=l<0?-1:1,b=l*60+N*m;return new Date(Date.UTC(s,o,a,i,c)-b*60*1e3).toISOString()}function $e(e){var t;return(t=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:t[0]}function Te(e,n){const t=y(e);return t.length<10||!/^\d+$/.test(t[0])?null:{group:n,position:p(t[0]),team:h(t[1]),played:p(t[2]),wins:p(t[3]),draws:p(t[4]),losses:p(t[5]),goalsFor:p(t[6]),goalsAgainst:p(t[7]),goalDifference:X(t[8]),points:p(t[9]),note:t.slice(10).join(" ")}}function Ae(e,n,t){var l;const r=h(f(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=h(f(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=f(e.querySelector(".fscore")??e),s=a.match(/(\d+)\s*[–-]\s*(\d+)/),i=Number((l=a.match(/Match\s+(\d+)/i))==null?void 0:l[1])||void 0;if(!r||!o)return null;const c=f(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),u=f(e.querySelector(".ftime")??e);return{id:`${n}-${t+1}`,group:n,matchNumber:i,date:c,time:u,kickoffAt:R(c,u),venue:G(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:r,awayTeam:o,homeScore:s?Number(s[1]):void 0,awayScore:s?Number(s[2]):void 0,played:!!s}}function g(e,n){return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(t=>{const r=H(t.textContent??"");return typeof n=="string"?r.includes(H(n)):n.test(r)})??null}function k(e){let n=e.nextElementSibling;for(;n;){if(n.matches("table.wikitable"))return n;const t=n.querySelector("table.wikitable");if(t)return t;if(/^H[234]$/i.test(n.tagName)||n.matches(".mw-heading"))return null;n=n.nextElementSibling}return null}function z(e){const n=new Map;for(const t of Array.from(e.querySelectorAll(".footballbox")).map(Q).filter(r=>!!r.matchNumber))n.set(t.matchNumber,t);for(const t of Array.from(e.querySelectorAll("h3, .mw-heading")).filter(r=>/\s+vs\s+/i.test(f(r))).map(r=>V(r)).filter(r=>!!r.matchNumber))n.has(t.matchNumber)||n.set(t.matchNumber,t);return n}function ke(e){var o;const n=new Map;let t=e.nextElementSibling,r=0;for(;t&&!/^H2$/i.test(t.tagName);){if(t.matches(".footballbox")){const a=Q(t),s=(o=A[r])==null?void 0:o[0],i=a.matchNumber??s;i&&n.set(i,{...a,matchNumber:i}),r+=1}t=t.nextElementSibling}return n}function Q(e){var b;const n=f(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),t=f(e.querySelector(".ftime")??e),r=e.querySelector(".fhome"),o=e.querySelector(".faway"),a=h(f((r==null?void 0:r.querySelector("[itemprop='name']"))??r??e)),s=h(f((o==null?void 0:o.querySelector("[itemprop='name']"))??o??e)),i=f(e.querySelector(".fscore")??e),c=i.match(/(\d+)\s*[–-]\s*(\d+)/),u=c?Number(c[1]):void 0,l=c?Number(c[2]):void 0,m=Ge(r,o,a,s,u,l),N=m===a?s:m===s?a:void 0;return{matchNumber:Number((b=i.match(/Match\s+(\d+)/i)??f(e).match(/Match\s+(\d+)/i))==null?void 0:b[1])||void 0,date:n,time:t,kickoffAt:R(n,t),venue:G(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:a||void 0,awayTeam:s||void 0,homeScore:u,awayScore:l,played:!!c,winnerTeam:m,loserTeam:N}}function V(e){var u,l;const n=[];let t="",r="",o="",a=e.nextElementSibling;for(;a&&!/^H[23]$/i.test(a.tagName)&&!a.matches(".mw-heading");)a.matches(".footballbox")&&(t||(t=f(a.querySelector(".fdate")??a).replace(/\s+\(.*\)$/,"")),r||(r=f(a.querySelector(".ftime")??a)),o||(o=G(a.querySelector(".flocation")??a.querySelector(".fright")))),/^STYLE$/i.test(a.tagName)||n.push(f(a)),a=a.nextElementSibling;const s=n.join(" ").replace(/\s+/g," ").trim(),i=t||((u=s.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:u[0])||"",c=r||((l=s.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i))==null?void 0:l[0])||"";return{matchNumber:Me(e,s),date:i,time:c,kickoffAt:R(i,c),venue:o||Ce(n)}}function Ne(e,n){var t;return(t=A.find(([,r,o])=>r===e&&o===n))==null?void 0:t[0]}function Me(e,n){const t=new Set(M(f(e)));return M(n).find(r=>!t.has(r))??M(n)[0]}function M(e){return Array.from(e.matchAll(/Match\s+(\d+)/gi)).map(n=>Number(n[1]))}function Ce(e){return e.find(n=>n&&!/(?:June|July)\s+\d{1,2},\s+2026/i.test(n)&&!/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(n)&&!/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(n)&&!/Match\s+\d+/i.test(n)&&!/[\{\}]/.test(n)&&!/\[edit\]/i.test(n))??""}function Ee(e=new Map){return A.map(([n,t,r])=>{const o=e.get(n);return{...Z(o),matchNumber:n,round:"Round of 32",homeSlot:t,awaySlot:r,resolvedHomeTeam:(o==null?void 0:o.homeTeam)??t,resolvedAwayTeam:(o==null?void 0:o.awayTeam)??r,...S(o)}})}function Z(e){return{date:(e==null?void 0:e.date)??"",time:(e==null?void 0:e.time)??"",kickoffAt:e==null?void 0:e.kickoffAt,venue:(e==null?void 0:e.venue)??""}}function S(e){return{homeScore:e==null?void 0:e.homeScore,awayScore:e==null?void 0:e.awayScore,played:e==null?void 0:e.played,winnerTeam:e==null?void 0:e.winnerTeam,loserTeam:e==null?void 0:e.loserTeam}}function L(e,n){if(e)return"resolvedHomeTeam"in e?n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam:n==="home"?e.homeTeam:e.awayTeam}function y(e){return Array.from(e.querySelectorAll("th, td")).map(n=>f(n))}function W(e,n,t){for(const r of Re(n))e[r]=e[r]==="placed"?"placed":t}function Re(e){if(!e)return[];const n=D(Array.from(e.querySelectorAll("a")).map(t=>h(f(t))));return n.length?n:D(e.innerHTML.replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").split(`
`).map(h))}function D(e){return Array.from(new Set(e.filter(Boolean)))}function Ge(e,n,t,r,o,a){if(o!==void 0&&a!==void 0&&o!==a)return o>a?t:r;if(I(e))return t||void 0;if(I(n))return r||void 0}function I(e){if(!e)return!1;const n=e.getAttribute("class")??"";return/\bwinner\b/i.test(n)||!!e.querySelector(".winner, b, strong")}function h(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z](?:\s*,\s*[A-Z])*\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function qe(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function H(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function Fe(e){const n=Y(e);return/^(winners|runners-up|qualified)\b/.test(n)||/\bthird-placed teams\b/.test(n)}function Y(e){return e.normalize("NFKC").replace(/[\u2010-\u2015\u2212]/g,"-").replace(/\s+/g," ").trim().toLowerCase()}function f(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function G(e){return e?f(e):""}function p(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function X(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function Le(e){return{june:5,july:6}[e.toLowerCase()]}const We=101,De=102,Ie=[104,103],He=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function je(e,n){const t=new Map([...e,...n].map(i=>[i.matchNumber,i])),r=j(t,We).reverse(),o=j(t,De),a=Pe(t,Ie),s=n.flatMap(i=>ne(i).map(c=>({fromMatchNumber:c,toMatchNumber:i.matchNumber})));return{leftRounds:r,rightRounds:o,finals:a,connections:s}}function Oe(e,n){const t=e.left+e.width/2,r=n.left+n.width/2,o=t<r,a=o?e.left+e.width:e.left,s=e.top+e.height/2,i=o?n.left:n.left+n.width,c=n.top+n.height/2,u=a+(i-a)/2;return`M ${w(a)} ${w(s)} H ${w(u)} V ${w(c)} H ${w(i)}`}function j(e,n){return ee(e,n).map((t,r)=>{var o;return{label:He[r]??((o=t[0])==null?void 0:o.round)??"",matches:t}})}function ee(e,n,t=0,r=[]){const o=e.get(n);if(!o)return r;r[t]=[...r[t]??[],o];for(const a of ne(o))ee(e,a,t+1,r);return r}function ne(e){return[e.homeSlot,e.awaySlot].map(Be).filter(Boolean)}function Be(e){var n;return Number((n=e.match(/^Winner Match (\d+)$/))==null?void 0:n[1])}function Pe(e,n){return n.map(t=>e.get(t)).filter(Boolean)}function w(e){return Number.isInteger(e)?String(e):e.toFixed(2)}const xe=["Round of 32","Round of 16","Quarterfinals","Semifinals","Third place","Final"];function Ue(e,n){const t=new Map;for(const r of[...e,...n])t.set(r.round,[...t.get(r.round)??[],r]);return xe.map(r=>{const o=t.get(r);return o?{round:r,matches:_e(o)}:void 0}).filter(r=>!!r)}function _e(e){return[...e].sort((n,t)=>{const r=O(n),o=O(t);return r!==o?r-o:n.matchNumber-t.matchNumber})}function O(e){if(!e.kickoffAt)return Number.POSITIVE_INFINITY;const n=new Date(e.kickoffAt).getTime();return Number.isNaN(n)?Number.POSITIVE_INFINITY:n}function te(e,n,t,r,o=J()){const a=n.filter(l=>l.qualified).map(l=>l.group).sort().join(""),s=t.find(l=>l.key===a);if(!s)throw new Error(`No third-place combination found for groups ${a}`);const i=new Map,c=r.map(l=>B(l,e,n,s,i)),u=o.map(l=>B(l,e,n,s,i));return{roundOf32:c,laterRounds:u,thirdPlaceKey:a}}function Ke(e,n,t,r){var i,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return C(n,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return C(n,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const u=ze(e),l=(i=r.slotAssignments[u])==null?void 0:i.replace("3","");return l?((c=t.find(m=>m.group===l))==null?void 0:c.team)??C(n,l,2)??e:e}return e}function B(e,n,t,r,o){const a=P(e.homeSlot,n,t,r,o),s=P(e.awaySlot,n,t,r,o),i=x(e.resolvedHomeTeam,e.homeSlot,a),c=x(e.resolvedAwayTeam,e.awaySlot,s),u=Je(e,i,c),l={...e,resolvedHomeTeam:i,resolvedAwayTeam:c,...u};return o.set(l.matchNumber,l),l}function P(e,n,t,r,o){var i,c;const a=e.match(/^Winner Match (\d+)$/);if(a)return((i=o.get(Number(a[1])))==null?void 0:i.winnerTeam)??e;const s=e.match(/^Loser Match (\d+)$/);return s?((c=o.get(Number(s[1])))==null?void 0:c.loserTeam)??e:Ke(e,n,t,r)}function x(e,n,t){return e&&e!==n?e:t}function Je(e,n,t){if(!e.played)return{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam};if(e.winnerTeam)return{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam};if(e.homeScore===void 0||e.awayScore===void 0||e.homeScore===e.awayScore)return{played:e.played,winnerTeam:void 0,loserTeam:void 0};const r=e.homeScore>e.awayScore;return{played:e.played,winnerTeam:r?n:t,loserTeam:r?t:n}}function ze(e){var t;switch(((t=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:t[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function C(e,n,t){var r,o;return(o=(r=e[n])==null?void 0:r[t])==null?void 0:o.team}function Qe(e,n,t){const r={};for(const o of T){const a=new Map(e[o].map((i,c)=>[i.team,c])),s=new Map(e[o].map((i,c)=>[i.team,ae(o,i.team,c+1,i.note)]));for(const i of n[o]){const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:t[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||ie(s,i,c.homeScore,c.awayScore)}r[o]=Ve(Array.from(s.values()),n[o],t,a).map((i,c)=>({...i,position:c+1}))}return r}function Ve(e,n,t,r){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[s])=>s-a).flatMap(([,a])=>re(a,n,t,r))}function re(e,n,t,r){if(e.length<2)return e;const o=new Set(e.map(i=>i.team)),a=new Map(e.map(i=>[i.team,ae(i.group,i.team,i.position,i.note)]));for(const i of n){if(!o.has(i.homeTeam)||!o.has(i.awayTeam))continue;const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:t[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||ie(a,i,c.homeScore,c.awayScore)}const s=[...e].sort((i,c)=>se(i,c,a));return Ze(s,a).flatMap(i=>i.length===e.length?i.sort((c,u)=>Ye(c,u,r)):re(i,n,t,r))}function Ze(e,n){const t=[];for(const r of e){const o=t[t.length-1],a=o==null?void 0:o[o.length-1];!a||se(r,a,n)!==0?t.push([r]):o.push(r)}return t}function oe(e,n){const t=new Map(n.map(r=>[r.group,r.rank]));return T.map(r=>e[r][2]).sort((r,o)=>Xe(r,o,t)).map((r,o)=>({rank:o+1,group:r.group,team:r.team,played:r.played,wins:r.wins,draws:r.draws,losses:r.losses,goalsFor:r.goalsFor,goalsAgainst:r.goalsAgainst,goalDifference:r.goalDifference,points:r.points,qualified:o<8}))}function ae(e,n,t,r){return{group:e,position:t,team:n,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:r}}function ie(e,n,t,r){const o=e.get(n.homeTeam),a=e.get(n.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=t,o.goalsAgainst+=r,a.goalsFor+=r,a.goalsAgainst+=t,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,t>r?(o.wins+=1,a.losses+=1,o.points+=3):r>t?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function se(e,n,t){const r=t.get(e.team),o=t.get(n.team);return((o==null?void 0:o.points)??0)-((r==null?void 0:r.points)??0)||((o==null?void 0:o.goalDifference)??0)-((r==null?void 0:r.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((r==null?void 0:r.goalsFor)??0)}function Ye(e,n,t){return n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(t.get(e.team)??99)-(t.get(n.team)??99)}function Xe(e,n,t){return n.points-e.points||n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(t.get(e.group)??99)-(t.get(n.group)??99)}const en={algeria:"DZ",argentina:"AR",australia:"AU",austria:"AT",belgium:"BE","bosnia and herzegovina":"BA",brazil:"BR",canada:"CA","cape verde":"CV",colombia:"CO","costa rica":"CR",croatia:"HR",curacao:"CW","czech republic":"CZ",czechia:"CZ",denmark:"DK","dominican republic":"DO","dr congo":"CD","congo dr":"CD",ecuador:"EC",egypt:"EG",france:"FR",germany:"DE",ghana:"GH",haiti:"HT",iran:"IR",iraq:"IQ","ivory coast":"CI","cote d ivoire":"CI",japan:"JP",jordan:"JO",mexico:"MX",morocco:"MA",netherlands:"NL","new zealand":"NZ",norway:"NO",panama:"PA",paraguay:"PY",portugal:"PT",qatar:"QA","saudi arabia":"SA",senegal:"SN","south africa":"ZA","south korea":"KR",spain:"ES",sweden:"SE",switzerland:"CH",turkey:"TR",turkiye:"TR","united states":"US",usa:"US",uruguay:"UY",uzbekistan:"UZ"},nn={england:E("gbeng"),scotland:E("gbsct"),wales:E("gbwls")};function tn(e){const n=rn(e);if(!n||on(n))return"";const t=nn[n];if(t)return t;const r=en[n];return r?an(r):""}function rn(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\([^)]*\)/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/gi," ").trim().replace(/\s+/g," ").toLowerCase()}function on(e){return/^(winner|loser|runner up|3rd|third place)\b/.test(e)}function an(e){return e.toUpperCase().split("").map(n=>String.fromCodePoint(127462+n.charCodeAt(0)-65)).join("")}function E(e){return String.fromCodePoint(127988,...e.toLowerCase().split("").map(n=>917504+n.charCodeAt(0)),917631)}function q(e,n){if(!e.kickoffAt)return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const t=new Date(e.kickoffAt);if(Number.isNaN(t.getTime()))return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const r={},o=new Intl.DateTimeFormat("en-US",{...r,month:"short",day:"numeric",year:"numeric"}).format(t),a=new Intl.DateTimeFormat("en-US",{...r,hour:"numeric",minute:"2-digit",hour12:!0}).format(t);return[o,a,e.venue].filter(Boolean).join(" · ")}const sn="https://en.wikipedia.org/w/api.php";async function U(e){var a,s;const n=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),t=await fetch(`${sn}?${n.toString()}`);if(!t.ok)throw new Error(`Wikipedia request failed for ${e}: ${t.status}`);const r=await t.json();if(r.error)throw new Error(r.error.info??`Wikipedia returned an error for ${e}`);const o=(s=(a=r.parse)==null?void 0:a.text)==null?void 0:s["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const cn=300*1e3,un="Could not find ranking of third-placed teams table";function ln(e){const n={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>ce(e));const t=async(r={})=>{r.clearUserResults&&(n.userResults={}),n.loading=!0,n.error=void 0,v(e,n,t);try{n.data=await dn(),n.stale=!1}catch(o){n.error=o instanceof Error?o.message:"Unable to load tournament data",n.stale=!!n.data}finally{n.loading=!1,v(e,n,t)}};v(e,n,t),t(),window.setInterval(t,cn)}async function dn(){const[e,n]=await Promise.all([U("2026_FIFA_World_Cup"),U("2026_FIFA_World_Cup_knockout_stage")]),t=F(e),r=F(n),o=he(t),a=ge(t),s=fn(t,o),i=be(r),c=ve(r),u=Se(r),l=ye(r);return{groups:o,groupMatches:a,knockoutCombinations:i,roundOf32:c,thirdPlaceRanking:s,qualificationStatuses:l,projection:te(o,s,i,c,u),fetchedAt:new Date,sourceUpdatedText:$e(t)}}function fn(e,n){try{return we(e)}catch(t){if(t instanceof Error&&t.message===un)return oe(n,[]);throw t}}function v(e,n,t){var o;const r=n.data?pn(n.data,n.userResults):void 0;e.innerHTML=`
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">World Cup 2026</p>
          <h1>Knockout projection</h1>
        </div>
        <div class="status-panel">
          <button class="refresh-button" type="button" ${n.loading?"disabled":""}>
            <span aria-hidden="true">Refresh</span>
          </button>
          <p class="timestamp">${kn(n)}</p>
        </div>
      </header>

      ${n.error?`<section class="notice ${n.stale?"warning":"error"}">${d(n.error)}</section>`:""}
      ${n.loading&&!n.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

      ${r?`
        <section class="page-stack">
          <section class="bracket-panel">
          <div class="section-heading">
            <h2>Projected bracket</h2>
            <div class="heading-note-stack">
              <p>Third-place groups: ${r.projection.thirdPlaceKey.split("").join(", ")}</p>
              <p>Times in your local timezone</p>
            </div>
          </div>
          ${mn(r.projection.roundOf32,r.projection.laterRounds,r.qualificationStatuses)}
          ${hn(r.projection.roundOf32,r.projection.laterRounds,r.qualificationStatuses)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${d(r.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${Sn(r)}
            ${$n(r.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
          </div>
          ${Tn(r.groupMatches,n.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,ce(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",()=>t({clearUserResults:!0})),e.querySelectorAll(".score-input").forEach(a=>{a.addEventListener("input",()=>{var l;const s=a.dataset.matchId,i=a.dataset.side;if(!s||!i)return;const c={...n.userResults[s]??{}},u=a.value===""?void 0:Number(a.value);c[i]=Number.isFinite(u)&&u!==void 0?u:void 0,c.homeScore===void 0&&c.awayScore===void 0?delete n.userResults[s]:n.userResults[s]=c,v(e,n,t),(l=e.querySelector(`.score-input[data-match-id="${s}"][data-side="${i}"]`))==null||l.focus()})})}function ce(e){window.requestAnimationFrame(()=>bn(e))}function pn(e,n){const t=Qe(e.groups,e.groupMatches,n),r=oe(t,e.thirdPlaceRanking);return{...e,groups:t,thirdPlaceRanking:r,projection:te(t,r,e.knockoutCombinations,e.roundOf32,e.projection.laterRounds)}}function mn(e,n,t){const{leftRounds:r,rightRounds:o,finals:a,connections:s}=je(e,n);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${d(JSON.stringify(s))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${r.map((i,c)=>_(i.label,i.matches,c+1,"left",t)).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${a.map(i=>ue(i,"center",t)).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${o.map((i,c)=>_(i.label,i.matches,4-c,"right",t)).join("")}
        </div>
      </div>
    </div>
  `}function _(e,n,t,r,o){return`
    <section class="round-column round-depth-${t} ${r==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${n.map(a=>ue(a,r,o)).join("")}
      </div>
    </section>
  `}function ue(e,n="left",t){const r=q({...e,venue:void 0}),o=le(e.venue),a=n==="center"?"center-match":n==="left"?"flows-right":"flows-left",s=e.round==="Round of 32";return`
    <article class="match-card ${a}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
      </div>
      <div class="team-row">
        ${$(e,"home",t)}
        ${s?`<small>${d(e.homeSlot)}</small>`:""}
      </div>
      <div class="team-row">
        ${$(e,"away",t)}
        ${s?`<small>${d(e.awaySlot)}</small>`:""}
      </div>
      ${r?`<p class="venue">${d(r)}</p>`:""}
      ${o?`<p class="match-venue">${d(o)}</p>`:""}
    </article>
  `}function hn(e,n,t){return`
    <section class="knockout-schedule">
      <div class="section-heading schedule-heading">
        <h2>Knockout matches</h2>
      </div>
      <div class="schedule-stage-list">
        ${Ue(e,n).map(o=>gn(o.round,o.matches,t)).join("")}
      </div>
    </section>
  `}function gn(e,n,t){return`
    <section class="schedule-stage">
      <h3>${d(e)}</h3>
      <div class="schedule-match-list">
        ${n.map(r=>wn(r,t)).join("")}
      </div>
    </section>
  `}function wn(e,n){const t=q({...e,venue:void 0}),r=le(e.venue);return`
    <article class="schedule-match">
      <div class="schedule-match-meta">
        <span>Match ${e.matchNumber}</span>
        ${t?`<time>${d(t)}</time>`:""}
      </div>
      <div class="schedule-teams">
        ${$(e,"home",n)}
        <span>${e.played?"FT":"vs"}</span>
        ${$(e,"away",n)}
      </div>
      ${r?`<p>${d(r)}</p>`:""}
    </article>
  `}function le(e){return e.replace(/\s*(?:referee|officials?)\b.*$/i,"").trim()}function yn(e,n){const t=tn(e),r=n[e]??"unqualified";return`${t?`<span class="team-flag bracket-team-${r}" aria-hidden="true">${t}</span>`:""}<span class="bracket-team-${r}">${d(e)}</span>`}function $(e,n,t){const r=n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam,o=n==="home"?e.homeScore:e.awayScore;return`
    <strong class="match-team${e.winnerTeam===r?" match-team-winner":""}">
      <span class="match-team-name">${yn(r,t)}</span>
      ${e.played?`<span class="match-score">${o??"-"}</span>`:""}
    </strong>
  `}function bn(e){e.querySelectorAll(".bracket-stage").forEach(n=>{const t=n.querySelector(".bracket-connectors");if(!t)return;const r=vn(n.dataset.connections),o=n.getBoundingClientRect();t.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),t.replaceChildren(...r.flatMap(a=>{const s=n.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),i=n.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!s||!i)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",Oe(K(s,o),K(i,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function vn(e){if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}function K(e,n){const t=e.getBoundingClientRect();return{left:t.left-n.left,top:t.top-n.top,width:t.width,height:t.height}}function Sn(e){return`
    <section class="third-place-block">
      <h3>Third-place ranking</h3>
      <div class="third-place-list">
        <div class="third-row third-row-header">
          <span></span>
          <span>Team</span>
          <span>Group</span>
          <span>MP</span>
          <span>Pts</span>
          <span>GD</span>
        </div>
        ${e.thirdPlaceRanking.map(n=>`
              <div class="third-row ${n.qualified?"qualified":""}">
                <span>${n.rank}</span>
                <strong>${d(n.team)}</strong>
                <small>Group ${n.group}</small>
                <b>${n.played}</b>
                <b>${n.points}</b>
                <b>${de(n.goalDifference)}</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function $n(e){return`
    <div class="groups-grid">
      ${Object.entries(e).map(([n,t])=>`
            <section class="group-card">
              <h3>Group ${n}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>MP</th>
                    <th>Pts</th>
                    <th>GD</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.map(r=>`
                        <tr>
                          <td>${r.position}</td>
                          <td>${d(r.team)}</td>
                          <td>${r.played}</td>
                          <td>${r.points}</td>
                          <td>${de(r.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function Tn(e,n){return`
    <div class="results-grid">
      ${Object.entries(e).map(([t,r])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${t}</h3>
              </div>
              <div class="results-list">
                ${r.map(o=>An(o,n[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function An(e,n){const t=e.played?e.homeScore:n==null?void 0:n.homeScore,r=e.played?e.awayScore:n==null?void 0:n.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${d(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${t??"-"}-${r??"-"}</strong>`:`
              <div class="score-editor" aria-label="${d(e.homeTeam)} vs ${d(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${t??""}" aria-label="${d(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${r??""}" aria-label="${d(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${d(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${d(q({...e,venue:void 0}))}</p>`}
    </article>
  `}function kn(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function de(e){return e>0?`+${e}`:String(e)}function d(e){return e.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}const fe=document.querySelector("#app");if(!fe)throw new Error("App root element was not found");ln(fe);
