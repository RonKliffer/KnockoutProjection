(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const R=["A","B","C","D","E","F","G","H","I","J","K","L"],Ee=["1A","1B","1D","1E","1G","1I","1K","1L"],A=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],y=[[89,"Round of 16","Winner Match 74","Winner Match 77"],[90,"Round of 16","Winner Match 73","Winner Match 75"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function I(e){return new DOMParser().parseFromString(e,"text/html")}function Ge(e){const r={};for(const n of R){const t=S(e,`Group ${n}`),o=t?C(t):null;if(!o)throw new Error(`Could not find standings table for Group ${n}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(s=>s.querySelector("td"));if(r[n]=a.map(s=>Ie(s,n)).filter(Boolean),r[n].length<4)throw new Error(`Group ${n} standings table did not contain four teams`)}return r}function qe(e){const r={};for(const n of R){const t=S(e,`Group ${n}`);if(!t)throw new Error(`Could not find match list for Group ${n}`);const o=[];let a=t.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const s=Pe(a,n,o.length);s&&o.push(s)}a=a.nextElementSibling}r[n]=o}return r}function Fe(e){const r=S(e,/ranking of third-plac(?:e|ed) teams/),n=r?C(r):null;if(!n)throw new Error("Could not find ranking of third-placed teams table");return Array.from(n.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map((t,o)=>{var l;const a=N(t),s=a[0]&&/^\d+$/.test(a[0])?0:-1,i=m(a[0+s])||o+1,c=(l=(a[1+s]||"").match(/[A-L]/))==null?void 0:l[0],u=g(a[2+s]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:i,group:c,team:u,played:m(a[3+s]),wins:m(a[4+s]),draws:m(a[5+s]),losses:m(a[6+s]),goalsFor:m(a[7+s]),goalsAgainst:m(a[8+s]),goalDifference:pe(a[9+s]),points:m(a[10+s]),qualified:i<=8}})}function Le(e){const r=S(e,"Qualified teams"),n=r?C(r):null;if(!n)throw new Error("Could not find qualified teams table");const t=Array.from(n.querySelectorAll("tr")),a=N(t.find(u=>N(u).some(sr))??n).map(me),s=a.map((u,l)=>/^(winners|runners-up)$/.test(u)?l:-1).filter(u=>u>=0),i=a.map((u,l)=>u.includes("third-placed teams")||/^qualified\b/.test(u)?l:-1).filter(u=>u>=0);if(!s.length&&!i.length)throw new Error("Qualified teams table did not include placement columns");const c={};for(const u of t.filter(l=>l.querySelector("td"))){const l=Array.from(u.querySelectorAll("th, td"));for(const p of s)U(c,l[p],"placed");for(const p of i)U(c,l[p],"qualified")}return c}function We(e){const r=S(e,"Combinations of matches in the round of 32"),n=r?C(r):null;if(!n)throw new Error("Could not find third-place combination table");return Array.from(n.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map(t=>{const o=N(t),a=o.filter(i=>/^[A-L]$/.test(i)).slice(0,8),s=o.filter(i=>/^3[A-L]$/.test(i)).slice(0,8);return a.length!==8||s.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(Ee.map((i,c)=>[i,s[c]]))}}).filter(Boolean)}function He(e){const r=ae(e),n=S(e,"Round of 32");if(!n)return tr(r);for(const[s,i]of _e(n,r))r.set(s,i);const t=[];let o=n.nextElementSibling;for(;o&&!/^H2$/i.test(o.tagName);){if(/^H3$/i.test(o.tagName)){const i=d(o).split(/\s+vs\s+/i).map(ir),c=le(o),u=c.matchNumber??Xe(i[0],i[1]);u&&i.length===2&&t.push({matchNumber:u,round:"Round of 32",date:c.date,time:c.time,kickoffAt:c.kickoffAt,venue:c.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:c.homeTeam??i[0],resolvedAwayTeam:c.awayTeam??i[1],...k(c)})}o=o.nextElementSibling}const a=new Map(t.map(s=>[s.matchNumber,s]));return A.map(([s,i,c])=>{const u=a.get(s)??r.get(s);return{matchNumber:s,round:"Round of 32",date:(u==null?void 0:u.date)??"",time:(u==null?void 0:u.time)??"",kickoffAt:u==null?void 0:u.kickoffAt,venue:(u==null?void 0:u.venue)??"",homeSlot:i,awaySlot:c,resolvedHomeTeam:_(u,"home")??i,resolvedAwayTeam:_(u,"away")??c,...k(u)}})}function oe(e=new Map){return y.map(([r,n,t,o])=>{const a=e.get(r);return{...fe(a),matchNumber:r,round:n,homeSlot:t,awaySlot:o,resolvedHomeTeam:(a==null?void 0:a.homeTeam)??t,resolvedAwayTeam:(a==null?void 0:a.awayTeam)??o,...k(a)}})}function De(e){return oe(ae(e))}function W(e,r){const n=e.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i),t=r.replace(/\u2212/g,"-").match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);if(!n||!t)return;const o=cr(n[1]),a=Number(n[2]),s=Number(n[3]);let i=Number(t[1]);const c=Number(t[2]),u=t[3].toLowerCase(),l=Number(t[4]),p=Number(t[5]??"0");if(o===void 0)return;u==="p"&&i!==12?i+=12:u==="a"&&i===12&&(i=0);const h=l<0?-1:1,v=l*60+h*p;return new Date(Date.UTC(s,o,a,i,c)-v*60*1e3).toISOString()}function xe(e){var n;return(n=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:n[0]}function Ie(e,r){const n=N(e);return n.length<10||!/^\d+$/.test(n[0])?null:{group:r,position:m(n[0]),team:g(n[1]),played:m(n[2]),wins:m(n[3]),draws:m(n[4]),losses:m(n[5]),goalsFor:m(n[6]),goalsAgainst:m(n[7]),goalDifference:pe(n[8]),points:m(n[9]),note:n.slice(10).join(" ")}}function Pe(e,r,n){var l;const t=g(d(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=g(d(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=d(e.querySelector(".fscore")??e),s=a.match(/(\d+)\s*[–-]\s*(\d+)/),i=Number((l=a.match(/Match\s+(\d+)/i))==null?void 0:l[1])||void 0;if(!t||!o)return null;const c=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),u=d(e.querySelector(".ftime")??e);return{id:`${r}-${n+1}`,group:r,matchNumber:i,date:c,time:u,kickoffAt:W(c,u),venue:D(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:t,awayTeam:o,homeScore:s?Number(s[1]):void 0,awayScore:s?Number(s[2]):void 0,played:!!s}}function S(e,r){return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(n=>{const t=q(n.textContent??"");return typeof r=="string"?t.includes(q(r)):r.test(t)})??null}function C(e){let r=e.nextElementSibling;for(;r;){if(r.matches("table.wikitable"))return r;const n=r.querySelector("table.wikitable");if(n)return n;if(/^H[234]$/i.test(r.tagName)||r.matches(".mw-heading"))return null;r=r.nextElementSibling}return null}function ae(e){const r=new Map;for(const n of Array.from(e.querySelectorAll(".footballbox")).map(t=>H(t,de(t))).filter(t=>!!t.matchNumber))r.set(n.matchNumber,n);for(const n of Array.from(e.querySelectorAll("h3, .mw-heading")).filter(t=>/\s+vs\s+/i.test(d(t))).map(t=>le(t)).filter(t=>!!t.matchNumber))r.has(n.matchNumber)||r.set(n.matchNumber,n);return Oe(e,r),Be(r),r}function Oe(e,r){let n=[],t=0;for(const o of Array.from(e.body.querySelectorAll("h2, .footballbox"))){if(/^H2$/i.test(o.tagName)){const u=d(o);n=je(u),t=0;continue}if(!o.matches(".footballbox"))continue;const a=n[t];if(t+=1,!a)continue;const s=H(o,de(o)),i=se(s,Ve(r)),c=Ke(s,i,a,n);ie(r,c,ce({...s,matchNumber:c==null?void 0:c.matchNumber},c,i))}}function je(e){const r=q(e);return r.includes("round of 16")?y.filter(([,n])=>n==="Round of 16").map(([n])=>n):r.includes("quarterfinal")||r.includes("quarter-final")?y.filter(([,n])=>n==="Quarterfinals").map(([n])=>n):r.includes("semifinal")||r.includes("semi-final")?y.filter(([,n])=>n==="Semifinals").map(([n])=>n):r.includes("third place")||r.includes("third-place")?[103]:r.includes("final")?[104]:[]}function Be(e){for(const[r,,n,t]of y){const o=e.get(r);o&&(P(e,n,o.homeTeam),P(e,t,o.awayTeam))}}function P(e,r,n){const t=r.match(/^(Winner|Loser) Match (\d+)$/);if(!t||!n||$(n))return;const o=Number(t[2]),a=e.get(o);if(!a)return;const s=t[1]==="Winner"?n:a.winnerTeam,i=t[1]==="Loser"?n:a.loserTeam;e.set(o,{...a,winnerTeam:s,loserTeam:i??ue(a,s)})}function _e(e,r){var i;const n=new Map;let t=e.nextElementSibling,o=0,a="";const s=Qe(r);for(;t&&!/^H2$/i.test(t.tagName);){if((/^H3$/i.test(t.tagName)||t.matches(".mw-heading"))&&(a=d(t)),t.matches(".footballbox")){const c=H(t,a),u=(i=A[o])==null?void 0:i[0],l=se(c,s),p=Ue(c,l,u);ie(n,p,ce({...c,matchNumber:p==null?void 0:p.matchNumber},p,l)),o+=1}t=t.nextElementSibling}return n}function Ue(e,r,n){return e.matchNumber?{matchNumber:e.matchNumber,source:e.matchNumberSource??"explicit"}:r!=null&&r.matchNumber?{matchNumber:r.matchNumber,source:"advanced"}:n?{matchNumber:n,source:"fallback"}:void 0}function Ke(e,r,n,t){if(e.matchNumber&&(!t.length||t.includes(e.matchNumber)))return{matchNumber:e.matchNumber,source:e.matchNumberSource??"explicit"};if(r!=null&&r.matchNumber&&t.includes(r.matchNumber))return{matchNumber:r.matchNumber,source:"advanced"};if(n)return{matchNumber:n,source:"fallback"};if(e.matchNumber)return{matchNumber:e.matchNumber,source:e.matchNumberSource??"explicit"}}function ie(e,r,n){if(!r)return;const t=e.get(r.matchNumber),o={...n,matchNumber:r.matchNumber,matchNumberSource:r.source};(!t||O(o)>O(t))&&e.set(r.matchNumber,o)}function O(e){return Je(e.matchNumberSource??"fallback")*10+(e.played?6:0)+(e.winnerTeam?3:0)+(e.homeScore!==void 0&&e.awayScore!==void 0?2:0)+(ze(e)?1:0)}function Je(e){switch(e){case"explicit":return 3;case"advanced":return 2;case"fallback":return 1}}function ze(e){return!!(e.homeTeam&&e.awayTeam&&!$(e.homeTeam)&&!$(e.awayTeam))}function Qe(e){const r=new Map;for(const[n,,t,o]of y){const a=e.get(n);a&&(j(r,a.homeTeam,t),j(r,a.awayTeam,o))}return r}function Ve(e){const r=new Map;for(const[n,,t,o]of y){const a=e.get(n);a&&(B(r,a.homeTeam,t),B(r,a.awayTeam,o))}return r}function j(e,r,n){if(!r||$(r))return;const t=n.match(/^(Winner|Loser) Match (\d+)$/),o=Number(t==null?void 0:t[2]);o&&A.some(([a])=>a===o)&&e.set(r,{matchNumber:o,result:(t==null?void 0:t[1])==="Loser"?"loser":"winner"})}function B(e,r,n){if(!r||$(r))return;const t=n.match(/^(Winner|Loser) Match (\d+)$/),o=Number(t==null?void 0:t[2]);o&&e.set(r,{matchNumber:o,result:(t==null?void 0:t[1])==="Loser"?"loser":"winner"})}function se(e,r){for(const n of[e.homeTeam,e.awayTeam]){const t=n?r.get(n):void 0;if(n&&t)return{team:n,...t}}}function Ze(e,r){if(!r)return e;const n=r.result==="winner"?r.team:e.winnerTeam,t=r.result==="loser"?r.team:e.loserTeam;return{...e,winnerTeam:n,loserTeam:t??ue(e,n)}}function ce(e,r,n){return(r==null?void 0:r.matchNumber)===(n==null?void 0:n.matchNumber)?Ze(e,n):e}function ue(e,r){if(r===e.homeTeam)return e.awayTeam;if(r===e.awayTeam)return e.homeTeam}function $(e){return/^(winner|loser|runner-up|runner up|3rd|third place)\b/i.test(e)}function H(e,r=""){const n=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),t=d(e.querySelector(".ftime")??e),o=e.querySelector(".fhome"),a=e.querySelector(".faway"),s=g(d((o==null?void 0:o.querySelector("[itemprop='name']"))??o??e)),i=g(d((a==null?void 0:a.querySelector("[itemprop='name']"))??a??e)),c=d(e.querySelector(".fscore")??e),u=c.match(/(\d+)\s*[–-]\s*(\d+)/),l=u?Number(u[1]):void 0,p=u?Number(u[2]):void 0,h=Ye(e),v=u?ar(o,a,s,i):void 0,Ce=v===s?i:v===i?s:void 0,w=rr(e,r);return{matchNumber:w==null?void 0:w.matchNumber,matchNumberSource:w==null?void 0:w.source,date:n,time:t,kickoffAt:W(n,t),venue:D(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:s||void 0,awayTeam:i||void 0,homeScore:l,awayScore:p,homePenaltyScore:h==null?void 0:h.homePenaltyScore,awayPenaltyScore:h==null?void 0:h.awayPenaltyScore,extraTime:/\ba\.?e\.?t\.?\b/i.test(c),played:!!u,winnerTeam:v,loserTeam:Ce}}function Ye(e){const r=Array.from(e.querySelectorAll("tr")),n=r.findIndex(i=>/penalties/i.test(d(i))),t=n>=0?r.slice(n+1).find(i=>i.querySelector(".fhgoal, .fagoal")):void 0,o=t==null?void 0:t.querySelector("th"),s=(o?d(o):"").match(/(\d+)\s*[–-]\s*(\d+)/);if(s)return{homePenaltyScore:Number(s[1]),awayPenaltyScore:Number(s[2])}}function le(e){var u,l;const r=[];let n="",t="",o="",a=e.nextElementSibling;for(;a&&!/^H[23]$/i.test(a.tagName)&&!a.matches(".mw-heading");)a.matches(".footballbox")&&(n||(n=d(a.querySelector(".fdate")??a).replace(/\s+\(.*\)$/,"")),t||(t=d(a.querySelector(".ftime")??a)),o||(o=D(a.querySelector(".flocation")??a.querySelector(".fright")))),/^STYLE$/i.test(a.tagName)||r.push(d(a)),a=a.nextElementSibling;const s=r.join(" ").replace(/\s+/g," ").trim(),i=n||((u=s.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:u[0])||"",c=t||((l=s.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i))==null?void 0:l[0])||"";return{matchNumber:er(e,s),date:i,time:c,kickoffAt:W(i,c),venue:o||nr(r)}}function Xe(e,r){var n;return(n=A.find(([,t,o])=>t===e&&o===r))==null?void 0:n[0]}function er(e,r){const n=new Set(b(d(e)));return b(r).find(t=>!n.has(t))??b(r)[0]}function rr(e,r){const n=b(d(e.querySelector(".fscore")??e));if(n.length)return{matchNumber:n[0],source:"explicit"};const t=b(d(e));if(!t.length)return;const o=new Set(b(r));return{matchNumber:t.find(s=>!o.has(s))??t[0],source:"explicit"}}function de(e){let r=e.previousElementSibling;for(;r;){if(/^H[23]$/i.test(r.tagName)||r.matches(".mw-heading"))return d(r);r=r.previousElementSibling}return""}function b(e){return Array.from(e.matchAll(/Match\s+(\d+)/gi)).map(r=>Number(r[1]))}function nr(e){return e.find(r=>r&&!/(?:June|July)\s+\d{1,2},\s+2026/i.test(r)&&!/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(r)&&!/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(r)&&!/Match\s+\d+/i.test(r)&&!/[\{\}]/.test(r)&&!/\[edit\]/i.test(r))??""}function tr(e=new Map){return A.map(([r,n,t])=>{const o=e.get(r);return{...fe(o),matchNumber:r,round:"Round of 32",homeSlot:n,awaySlot:t,resolvedHomeTeam:(o==null?void 0:o.homeTeam)??n,resolvedAwayTeam:(o==null?void 0:o.awayTeam)??t,...k(o)}})}function fe(e){return{date:(e==null?void 0:e.date)??"",time:(e==null?void 0:e.time)??"",kickoffAt:e==null?void 0:e.kickoffAt,venue:(e==null?void 0:e.venue)??""}}function k(e){return{homeScore:e==null?void 0:e.homeScore,awayScore:e==null?void 0:e.awayScore,homePenaltyScore:e==null?void 0:e.homePenaltyScore,awayPenaltyScore:e==null?void 0:e.awayPenaltyScore,extraTime:e==null?void 0:e.extraTime,played:e==null?void 0:e.played,winnerTeam:e==null?void 0:e.winnerTeam,loserTeam:e==null?void 0:e.loserTeam}}function _(e,r){if(e)return"resolvedHomeTeam"in e?r==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam:r==="home"?e.homeTeam:e.awayTeam}function N(e){return Array.from(e.querySelectorAll("th, td")).map(r=>d(r))}function U(e,r,n){for(const t of or(r))e[t]=e[t]==="placed"?"placed":n}function or(e){if(!e)return[];const r=K(Array.from(e.querySelectorAll("a")).map(n=>g(d(n))));return r.length?r:K(e.innerHTML.replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").split(`
`).map(g))}function K(e){return Array.from(new Set(e.filter(Boolean)))}function ar(e,r,n,t){if(J(e))return n||void 0;if(J(r))return t||void 0}function J(e){if(!e)return!1;const r=e.getAttribute("class")??"";return/\bwinner\b/i.test(r)||!!e.querySelector(".winner, b, strong")}function g(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z](?:\s*,\s*[A-Z])*\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function ir(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function q(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function sr(e){const r=me(e);return/^(winners|runners-up|qualified)\b/.test(r)||/\bthird-placed teams\b/.test(r)}function me(e){return e.normalize("NFKC").replace(/[\u2010-\u2015\u2212]/g,"-").replace(/\s+/g," ").trim().toLowerCase()}function d(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function D(e){return e?d(e):""}function m(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function pe(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function cr(e){return{june:5,july:6}[e.toLowerCase()]}const ur=101,lr=102,dr=[104,103],fr=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function mr(e,r){const n=new Map([...e,...r].map(i=>[i.matchNumber,i])),t=z(n,ur).reverse(),o=z(n,lr),a=gr(n,dr),s=r.flatMap(i=>ge(i).map(c=>({fromMatchNumber:c,toMatchNumber:i.matchNumber})));return{leftRounds:t,rightRounds:o,finals:a,connections:s}}function pr(e,r){const n=e.left+e.width/2,t=r.left+r.width/2,o=n<t,a=o?e.left+e.width:e.left,s=e.top+e.height/2,i=o?r.left:r.left+r.width,c=r.top+r.height/2,u=a+(i-a)/2;return`M ${T(a)} ${T(s)} H ${T(u)} V ${T(c)} H ${T(i)}`}function z(e,r){return he(e,r).map((n,t)=>{var o;return{label:fr[t]??((o=n[0])==null?void 0:o.round)??"",matches:n}})}function he(e,r,n=0,t=[]){const o=e.get(r);if(!o)return t;t[n]=[...t[n]??[],o];for(const a of ge(o))he(e,a,n+1,t);return t}function ge(e){return[e.homeSlot,e.awaySlot].map(hr).filter(Boolean)}function hr(e){var r;return Number((r=e.match(/^Winner Match (\d+)$/))==null?void 0:r[1])}function gr(e,r){return r.map(n=>e.get(n)).filter(Boolean)}function T(e){return Number.isInteger(e)?String(e):e.toFixed(2)}const yr=["Round of 32","Round of 16","Quarterfinals","Semifinals","Third place","Final"];function wr(e,r){const n=new Map;for(const t of[...e,...r])n.set(t.round,[...n.get(t.round)??[],t]);return yr.map(t=>{const o=n.get(t);return o?{round:t,matches:br(o)}:void 0}).filter(t=>!!t)}function br(e){return[...e].sort((r,n)=>{const t=Q(r),o=Q(n);return t!==o?t-o:r.matchNumber-n.matchNumber})}function Q(e){if(!e.kickoffAt)return Number.POSITIVE_INFINITY;const r=new Date(e.kickoffAt).getTime();return Number.isNaN(r)?Number.POSITIVE_INFINITY:r}function ye(e,r,n,t,o=oe()){const a=r.filter(l=>l.qualified).map(l=>l.group).sort().join(""),s=n.find(l=>l.key===a);if(!s)throw new Error(`No third-place combination found for groups ${a}`);const i=new Map,c=t.map(l=>V(l,e,r,s,i)),u=o.map(l=>V(l,e,r,s,i));return{roundOf32:c,laterRounds:u,thirdPlaceKey:a}}function Sr(e,r,n,t){var i,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return E(r,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return E(r,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const u=Tr(e),l=(i=t.slotAssignments[u])==null?void 0:i.replace("3","");return l?((c=n.find(p=>p.group===l))==null?void 0:c.team)??E(r,l,2)??e:e}return e}function V(e,r,n,t,o){const a=Z(e.homeSlot,r,n,t,o),s=Z(e.awaySlot,r,n,t,o),i=Y(e.resolvedHomeTeam,e.homeSlot,a),c=Y(e.resolvedAwayTeam,e.awaySlot,s),u=vr(e),l={...e,resolvedHomeTeam:i,resolvedAwayTeam:c,...u};return o.set(l.matchNumber,l),l}function Z(e,r,n,t,o){var i,c;const a=e.match(/^Winner Match (\d+)$/);if(a)return((i=o.get(Number(a[1])))==null?void 0:i.winnerTeam)??e;const s=e.match(/^Loser Match (\d+)$/);return s?((c=o.get(Number(s[1])))==null?void 0:c.loserTeam)??e:Sr(e,r,n,t)}function Y(e,r,n){return e&&e!==r?e:n}function vr(e,r,n){return e.played?e.winnerTeam?{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}:{played:e.played,winnerTeam:void 0,loserTeam:void 0}:{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}}function Tr(e){var n;switch(((n=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:n[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function E(e,r,n){var t,o;return(o=(t=e[r])==null?void 0:t[n])==null?void 0:o.team}function $r(e,r,n){const t={};for(const o of R){const a=new Map(e[o].map((i,c)=>[i.team,c])),s=new Map(e[o].map((i,c)=>[i.team,Se(o,i.team,c+1,i.note)]));for(const i of r[o]){const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:n[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||ve(s,i,c.homeScore,c.awayScore)}t[o]=Nr(Array.from(s.values()),r[o],n,a).map((i,c)=>({...i,position:c+1}))}return t}function Nr(e,r,n,t){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[s])=>s-a).flatMap(([,a])=>we(a,r,n,t))}function we(e,r,n,t){if(e.length<2)return e;const o=new Set(e.map(i=>i.team)),a=new Map(e.map(i=>[i.team,Se(i.group,i.team,i.position,i.note)]));for(const i of r){if(!o.has(i.homeTeam)||!o.has(i.awayTeam))continue;const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:n[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||ve(a,i,c.homeScore,c.awayScore)}const s=[...e].sort((i,c)=>Te(i,c,a));return Ar(s,a).flatMap(i=>i.length===e.length?i.sort((c,u)=>Mr(c,u,t)):we(i,r,n,t))}function Ar(e,r){const n=[];for(const t of e){const o=n[n.length-1],a=o==null?void 0:o[o.length-1];!a||Te(t,a,r)!==0?n.push([t]):o.push(t)}return n}function be(e,r){const n=new Map(r.map(t=>[t.group,t.rank]));return R.map(t=>e[t][2]).sort((t,o)=>kr(t,o,n)).map((t,o)=>({rank:o+1,group:t.group,team:t.team,played:t.played,wins:t.wins,draws:t.draws,losses:t.losses,goalsFor:t.goalsFor,goalsAgainst:t.goalsAgainst,goalDifference:t.goalDifference,points:t.points,qualified:o<8}))}function Se(e,r,n,t){return{group:e,position:n,team:r,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:t}}function ve(e,r,n,t){const o=e.get(r.homeTeam),a=e.get(r.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=n,o.goalsAgainst+=t,a.goalsFor+=t,a.goalsAgainst+=n,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,n>t?(o.wins+=1,a.losses+=1,o.points+=3):t>n?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function Te(e,r,n){const t=n.get(e.team),o=n.get(r.team);return((o==null?void 0:o.points)??0)-((t==null?void 0:t.points)??0)||((o==null?void 0:o.goalDifference)??0)-((t==null?void 0:t.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((t==null?void 0:t.goalsFor)??0)}function Mr(e,r,n){return r.goalDifference-e.goalDifference||r.goalsFor-e.goalsFor||(n.get(e.team)??99)-(n.get(r.team)??99)}function kr(e,r,n){return r.points-e.points||r.goalDifference-e.goalDifference||r.goalsFor-e.goalsFor||(n.get(e.group)??99)-(n.get(r.group)??99)}const Rr={algeria:"DZ",argentina:"AR",australia:"AU",austria:"AT",belgium:"BE","bosnia and herzegovina":"BA",brazil:"BR",canada:"CA","cape verde":"CV",colombia:"CO","costa rica":"CR",croatia:"HR",curacao:"CW","czech republic":"CZ",czechia:"CZ",denmark:"DK","dominican republic":"DO","dr congo":"CD","congo dr":"CD",ecuador:"EC",egypt:"EG",france:"FR",germany:"DE",ghana:"GH",haiti:"HT",iran:"IR",iraq:"IQ","ivory coast":"CI","cote d ivoire":"CI",japan:"JP",jordan:"JO",mexico:"MX",morocco:"MA",netherlands:"NL","new zealand":"NZ",norway:"NO",panama:"PA",paraguay:"PY",portugal:"PT",qatar:"QA","saudi arabia":"SA",senegal:"SN","south africa":"ZA","south korea":"KR",spain:"ES",sweden:"SE",switzerland:"CH",turkey:"TR",turkiye:"TR","united states":"US",usa:"US",uruguay:"UY",uzbekistan:"UZ"},Cr={england:G("gbeng"),scotland:G("gbsct"),wales:G("gbwls")};function Er(e){const r=Gr(e);if(!r||qr(r))return"";const n=Cr[r];if(n)return n;const t=Rr[r];return t?Fr(t):""}function Gr(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\([^)]*\)/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/gi," ").trim().replace(/\s+/g," ").toLowerCase()}function qr(e){return/^(winner|loser|runner up|3rd|third place)\b/.test(e)}function Fr(e){return e.toUpperCase().split("").map(r=>String.fromCodePoint(127462+r.charCodeAt(0)-65)).join("")}function G(e){return String.fromCodePoint(127988,...e.toLowerCase().split("").map(r=>917504+r.charCodeAt(0)),917631)}function x(e,r){if(!e.kickoffAt)return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const n=new Date(e.kickoffAt);if(Number.isNaN(n.getTime()))return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const t={},o=new Intl.DateTimeFormat("en-US",{...t,month:"short",day:"numeric",year:"numeric"}).format(n),a=new Intl.DateTimeFormat("en-US",{...t,hour:"numeric",minute:"2-digit",hour12:!0}).format(n);return[o,a,e.venue].filter(Boolean).join(" · ")}const Lr="https://en.wikipedia.org/w/api.php";async function X(e){var a,s;const r=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),n=await fetch(`${Lr}?${r.toString()}`);if(!n.ok)throw new Error(`Wikipedia request failed for ${e}: ${n.status}`);const t=await n.json();if(t.error)throw new Error(t.error.info??`Wikipedia returned an error for ${e}`);const o=(s=(a=t.parse)==null?void 0:a.text)==null?void 0:s["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const Wr=300*1e3,Hr="Could not find ranking of third-placed teams table";function Dr(e){const r={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>$e(e));const n=async(t={})=>{t.clearUserResults&&(r.userResults={}),r.loading=!0,r.error=void 0,M(e,r,n);try{r.data=await xr(),r.stale=!1}catch(o){r.error=o instanceof Error?o.message:"Unable to load tournament data",r.stale=!!r.data}finally{r.loading=!1,M(e,r,n)}};M(e,r,n),n(),window.setInterval(n,Wr)}async function xr(){const[e,r]=await Promise.all([X("2026_FIFA_World_Cup"),X("2026_FIFA_World_Cup_knockout_stage")]),n=I(e),t=I(r),o=Ge(n),a=qe(n),s=Ir(n,o),i=We(t),c=He(t),u=De(t),l=Le(t);return{groups:o,groupMatches:a,knockoutCombinations:i,roundOf32:c,thirdPlaceRanking:s,qualificationStatuses:l,projection:ye(o,s,i,c,u),fetchedAt:new Date,sourceUpdatedText:xe(n)}}function Ir(e,r){try{return Fe(e)}catch(n){if(n instanceof Error&&n.message===Hr)return be(r,[]);throw n}}function M(e,r,n){var o;const t=r.data?Pr(r.data,r.userResults):void 0;e.innerHTML=`
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">World Cup 2026</p>
          <h1>Knockout projection</h1>
        </div>
        <div class="status-panel">
          <button class="refresh-button" type="button" ${r.loading?"disabled":""}>
            <span aria-hidden="true">Refresh</span>
          </button>
          <p class="timestamp">${Yr(r)}</p>
        </div>
      </header>

      ${r.error?`<section class="notice ${r.stale?"warning":"error"}">${f(r.error)}</section>`:""}
      ${r.loading&&!r.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

      ${t?`
        <section class="page-stack">
          <section class="bracket-panel">
          <div class="section-heading">
            <h2>Projected bracket</h2>
            <div class="heading-note-stack">
              <p>Third-place groups: ${t.projection.thirdPlaceKey.split("").join(", ")}</p>
              <p>Times in your local timezone</p>
            </div>
          </div>
          ${Or(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
          ${jr(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${f(t.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${zr(t)}
            ${Qr(t.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
          </div>
          ${Vr(t.groupMatches,r.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,$e(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",()=>n({clearUserResults:!0})),e.querySelectorAll(".score-input").forEach(a=>{a.addEventListener("input",()=>{var l;const s=a.dataset.matchId,i=a.dataset.side;if(!s||!i)return;const c={...r.userResults[s]??{}},u=a.value===""?void 0:Number(a.value);c[i]=Number.isFinite(u)&&u!==void 0?u:void 0,c.homeScore===void 0&&c.awayScore===void 0?delete r.userResults[s]:r.userResults[s]=c,M(e,r,n),(l=e.querySelector(`.score-input[data-match-id="${s}"][data-side="${i}"]`))==null||l.focus()})})}function $e(e){window.requestAnimationFrame(()=>Kr(e))}function Pr(e,r){const n=$r(e.groups,e.groupMatches,r),t=be(n,e.thirdPlaceRanking);return{...e,groups:n,thirdPlaceRanking:t,projection:ye(n,t,e.knockoutCombinations,e.roundOf32,e.projection.laterRounds)}}function Or(e,r,n){const{leftRounds:t,rightRounds:o,finals:a,connections:s}=mr(e,r);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${f(JSON.stringify(s))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${t.map((i,c)=>ee(i.label,i.matches,c+1,"left",n)).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${a.map(i=>Ne(i,"center",n)).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${o.map((i,c)=>ee(i.label,i.matches,4-c,"right",n)).join("")}
        </div>
      </div>
    </div>
  `}function ee(e,r,n,t,o){return`
    <section class="round-column round-depth-${n} ${t==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${r.map(a=>Ne(a,t,o)).join("")}
      </div>
    </section>
  `}function Ne(e,r="left",n){const t=x({...e,venue:void 0}),o=Ae(e.venue),a=r==="center"?"center-match":r==="left"?"flows-right":"flows-left",s=e.round==="Round of 32";return`
    <article class="match-card ${a}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
      </div>
      <div class="team-row">
        ${re(e,"home",n)}
        ${s?`<small>${f(e.homeSlot)}</small>`:""}
      </div>
      <div class="team-row">
        ${re(e,"away",n)}
        ${s?`<small>${f(e.awaySlot)}</small>`:""}
      </div>
      ${t?`<p class="venue">${f(t)}</p>`:""}
      ${o?`<p class="match-venue">${f(o)}</p>`:""}
    </article>
  `}function jr(e,r,n){return`
    <section class="knockout-schedule">
      <div class="section-heading schedule-heading">
        <h2>Knockout matches</h2>
      </div>
      <div class="schedule-stage-list">
        ${wr(e,r).map(o=>Br(o.round,o.matches,n)).join("")}
      </div>
    </section>
  `}function Br(e,r,n){return`
    <section class="schedule-stage">
      <h3>${f(e)}</h3>
      <div class="schedule-match-list">
        ${r.map(t=>_r(t,n)).join("")}
      </div>
    </section>
  `}function _r(e,r){const n=x({...e,venue:void 0}),t=Ae(e.venue);return`
    <article class="schedule-match">
      <div class="schedule-match-meta">
        <span>Match ${e.matchNumber}</span>
        ${n?`<time>${f(n)}</time>`:""}
      </div>
      <div class="schedule-teams">
        ${ne(e.resolvedHomeTeam,e,"home",r)}
        ${e.played?Ur(e):'<span class="schedule-versus">vs</span>'}
        ${ne(e.resolvedAwayTeam,e,"away",r)}
      </div>
      ${t?`<p>${f(t)}</p>`:""}
    </article>
  `}function Ae(e){return e.replace(/\s*(?:attendance|referee|officials?)\b.*$/i,"").trim()}function Me(e,r){const n=Er(e),t=r[e]??"unqualified";return`${n?`<span class="team-flag bracket-team-${t}" aria-hidden="true">${n}</span>`:""}<span class="bracket-team-${t}">${f(e)}</span>`}function re(e,r,n){const t=r==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam,o=r==="home"?e.homeScore:e.awayScore,a=r==="home"?e.homePenaltyScore:e.awayPenaltyScore;return`
    <strong class="match-team${e.winnerTeam===t?" match-team-winner":""}">
      <span class="match-team-name">${Me(t,n)}</span>
      ${e.played?F(o,a,!1):""}
    </strong>
  `}function ne(e,r,n,t){const o=r.winnerTeam===e?" match-team-winner":"";return`
    <strong class="schedule-team schedule-team-${n}${o}">
      ${Me(e,t)}
    </strong>
  `}function Ur(e){const r=e.extraTime?"AET":"FT";return`
    <span class="schedule-scoreline" aria-label="${f(`${e.resolvedHomeTeam} ${L(e.homeScore,e.homePenaltyScore)}, ${r}, ${e.resolvedAwayTeam} ${L(e.awayScore,e.awayPenaltyScore)}`)}">
      ${F(e.homeScore,e.homePenaltyScore,e.winnerTeam===e.resolvedHomeTeam)}
      <span class="schedule-result-label">${r}</span>
      ${F(e.awayScore,e.awayPenaltyScore,e.winnerTeam===e.resolvedAwayTeam)}
    </span>
  `}function F(e,r,n){return`<span class="match-score${n?" match-score-winner":""}">${f(L(e,r))}</span>`}function L(e,r){return`${e??"-"}${r===void 0?"":` (${r})`}`}function Kr(e){e.querySelectorAll(".bracket-stage").forEach(r=>{const n=r.querySelector(".bracket-connectors");if(!n)return;const t=Jr(r.dataset.connections),o=r.getBoundingClientRect();n.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),n.replaceChildren(...t.flatMap(a=>{const s=r.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),i=r.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!s||!i)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",pr(te(s,o),te(i,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function Jr(e){if(!e)return[];try{const r=JSON.parse(e);return Array.isArray(r)?r:[]}catch{return[]}}function te(e,r){const n=e.getBoundingClientRect();return{left:n.left-r.left,top:n.top-r.top,width:n.width,height:n.height}}function zr(e){return`
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
        ${e.thirdPlaceRanking.map(r=>`
              <div class="third-row ${r.qualified?"qualified":""}">
                <span>${r.rank}</span>
                <strong>${f(r.team)}</strong>
                <small>Group ${r.group}</small>
                <b>${r.played}</b>
                <b>${r.points}</b>
                <b>${ke(r.goalDifference)}</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function Qr(e){return`
    <div class="groups-grid">
      ${Object.entries(e).map(([r,n])=>`
            <section class="group-card">
              <h3>Group ${r}</h3>
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
                  ${n.map(t=>`
                        <tr>
                          <td>${t.position}</td>
                          <td>${f(t.team)}</td>
                          <td>${t.played}</td>
                          <td>${t.points}</td>
                          <td>${ke(t.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function Vr(e,r){return`
    <div class="results-grid">
      ${Object.entries(e).map(([n,t])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${n}</h3>
              </div>
              <div class="results-list">
                ${t.map(o=>Zr(o,r[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function Zr(e,r){const n=e.played?e.homeScore:r==null?void 0:r.homeScore,t=e.played?e.awayScore:r==null?void 0:r.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${f(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${n??"-"}-${t??"-"}</strong>`:`
              <div class="score-editor" aria-label="${f(e.homeTeam)} vs ${f(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${n??""}" aria-label="${f(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${t??""}" aria-label="${f(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${f(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${f(x({...e,venue:void 0}))}</p>`}
    </article>
  `}function Yr(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function ke(e){return e>0?`+${e}`:String(e)}function f(e){return e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}const Re=document.querySelector("#app");if(!Re)throw new Error("App root element was not found");Dr(Re);
