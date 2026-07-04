(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const R=["A","B","C","D","E","F","G","H","I","J","K","L"],Ge=["1A","1B","1D","1E","1G","1I","1K","1L"],A=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],y=[[89,"Round of 16","Winner Match 74","Winner Match 77"],[90,"Round of 16","Winner Match 73","Winner Match 75"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function P(e){return new DOMParser().parseFromString(e,"text/html")}function qe(e){const n={};for(const r of R){const t=S(e,`Group ${r}`),o=t?C(t):null;if(!o)throw new Error(`Could not find standings table for Group ${r}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(s=>s.querySelector("td"));if(n[r]=a.map(s=>xe(s,r)).filter(Boolean),n[r].length<4)throw new Error(`Group ${r} standings table did not contain four teams`)}return n}function Fe(e){const n={};for(const r of R){const t=S(e,`Group ${r}`);if(!t)throw new Error(`Could not find match list for Group ${r}`);const o=[];let a=t.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const s=Oe(a,r,o.length);s&&o.push(s)}a=a.nextElementSibling}n[r]=o}return n}function Le(e){const n=S(e,/ranking of third-plac(?:e|ed) teams/),r=n?C(n):null;if(!r)throw new Error("Could not find ranking of third-placed teams table");return Array.from(r.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map((t,o)=>{var l;const a=N(t),s=a[0]&&/^\d+$/.test(a[0])?0:-1,i=m(a[0+s])||o+1,c=(l=(a[1+s]||"").match(/[A-L]/))==null?void 0:l[0],u=g(a[2+s]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:i,group:c,team:u,played:m(a[3+s]),wins:m(a[4+s]),draws:m(a[5+s]),losses:m(a[6+s]),goalsFor:m(a[7+s]),goalsAgainst:m(a[8+s]),goalDifference:he(a[9+s]),points:m(a[10+s]),qualified:i<=8}})}function We(e){const n=S(e,"Qualified teams"),r=n?C(n):null;if(!r)throw new Error("Could not find qualified teams table");const t=Array.from(r.querySelectorAll("tr")),a=N(t.find(u=>N(u).some(sn))??r).map(pe),s=a.map((u,l)=>/^(winners|runners-up)$/.test(u)?l:-1).filter(u=>u>=0),i=a.map((u,l)=>u.includes("third-placed teams")||/^qualified\b/.test(u)?l:-1).filter(u=>u>=0);if(!s.length&&!i.length)throw new Error("Qualified teams table did not include placement columns");const c={};for(const u of t.filter(l=>l.querySelector("td"))){const l=Array.from(u.querySelectorAll("th, td"));for(const p of s)U(c,l[p],"placed");for(const p of i)U(c,l[p],"qualified")}return c}function He(e){const n=S(e,"Combinations of matches in the round of 32"),r=n?C(n):null;if(!r)throw new Error("Could not find third-place combination table");return Array.from(r.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map(t=>{const o=N(t),a=o.filter(i=>/^[A-L]$/.test(i)).slice(0,8),s=o.filter(i=>/^3[A-L]$/.test(i)).slice(0,8);return a.length!==8||s.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(Ge.map((i,c)=>[i,s[c]]))}}).filter(Boolean)}function De(e){const n=ae(e),r=S(e,"Round of 32");if(!r)return rn(n);for(const[s,i]of Ue(r,n))n.set(s,i);const t=[];let o=r.nextElementSibling;for(;o&&!/^H2$/i.test(o.tagName);){if(/^H3$/i.test(o.tagName)){const i=d(o).split(/\s+vs\s+/i).map(an),c=de(o),u=c.matchNumber??Ye(i[0],i[1]);u&&i.length===2&&t.push({matchNumber:u,round:"Round of 32",date:c.date,time:c.time,kickoffAt:c.kickoffAt,venue:c.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:c.homeTeam??i[0],resolvedAwayTeam:c.awayTeam??i[1],...k(c)})}o=o.nextElementSibling}const a=new Map(t.map(s=>[s.matchNumber,s]));return A.map(([s,i,c])=>{const u=a.get(s)??n.get(s);return{matchNumber:s,round:"Round of 32",date:(u==null?void 0:u.date)??"",time:(u==null?void 0:u.time)??"",kickoffAt:u==null?void 0:u.kickoffAt,venue:(u==null?void 0:u.venue)??"",homeSlot:i,awaySlot:c,resolvedHomeTeam:_(u,"home")??i,resolvedAwayTeam:_(u,"away")??c,...k(u)}})}function oe(e=new Map){return y.map(([n,r,t,o])=>{const a=e.get(n);return{...me(a),matchNumber:n,round:r,homeSlot:t,awaySlot:o,resolvedHomeTeam:(a==null?void 0:a.homeTeam)??t,resolvedAwayTeam:(a==null?void 0:a.awayTeam)??o,...k(a)}})}function Ie(e){return oe(ae(e))}function W(e,n){const r=e.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i),t=n.replace(/\u2212/g,"-").match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);if(!r||!t)return;const o=cn(r[1]),a=Number(r[2]),s=Number(r[3]);let i=Number(t[1]);const c=Number(t[2]),u=t[3].toLowerCase(),l=Number(t[4]),p=Number(t[5]??"0");if(o===void 0)return;u==="p"&&i!==12?i+=12:u==="a"&&i===12&&(i=0);const h=l<0?-1:1,v=l*60+h*p;return new Date(Date.UTC(s,o,a,i,c)-v*60*1e3).toISOString()}function Pe(e){var r;return(r=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:r[0]}function xe(e,n){const r=N(e);return r.length<10||!/^\d+$/.test(r[0])?null:{group:n,position:m(r[0]),team:g(r[1]),played:m(r[2]),wins:m(r[3]),draws:m(r[4]),losses:m(r[5]),goalsFor:m(r[6]),goalsAgainst:m(r[7]),goalDifference:he(r[8]),points:m(r[9]),note:r.slice(10).join(" ")}}function Oe(e,n,r){var l;const t=g(d(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=g(d(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=d(e.querySelector(".fscore")??e),s=a.match(/(\d+)\s*[–-]\s*(\d+)/),i=Number((l=a.match(/Match\s+(\d+)/i))==null?void 0:l[1])||void 0;if(!t||!o)return null;const c=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),u=d(e.querySelector(".ftime")??e);return{id:`${n}-${r+1}`,group:n,matchNumber:i,date:c,time:u,kickoffAt:W(c,u),venue:D(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:t,awayTeam:o,homeScore:s?Number(s[1]):void 0,awayScore:s?Number(s[2]):void 0,played:!!s}}function S(e,n){return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(r=>{const t=q(r.textContent??"");return typeof n=="string"?t.includes(q(n)):n.test(t)})??null}function C(e){let n=e.nextElementSibling;for(;n;){if(n.matches("table.wikitable"))return n;const r=n.querySelector("table.wikitable");if(r)return r;if(/^H[234]$/i.test(n.tagName)||n.matches(".mw-heading"))return null;n=n.nextElementSibling}return null}function ae(e){const n=new Map;for(const r of Array.from(e.querySelectorAll(".footballbox")).map(t=>H(t,fe(t))).filter(t=>!!t.matchNumber))n.set(r.matchNumber,r);for(const r of Array.from(e.querySelectorAll("h3, .mw-heading")).filter(t=>/\s+vs\s+/i.test(d(t))).map(t=>de(t)).filter(t=>!!t.matchNumber))n.has(r.matchNumber)||n.set(r.matchNumber,r);return je(e,n),_e(n),n}function je(e,n){let r=[],t=0;for(const o of Array.from(e.body.querySelectorAll("h2, .footballbox"))){if(/^H2$/i.test(o.tagName)){r=Be(d(o)),t=0;continue}if(!o.matches(".footballbox"))continue;const a=r[t];if(t+=1,!a)continue;const s=H(o,fe(o)),i=ce(s,Qe(n)),c=ie(s,i,a);se(n,c,ue({...s,matchNumber:c==null?void 0:c.matchNumber},c,i))}}function Be(e){const n=q(e);return n.includes("round of 16")?y.filter(([,r])=>r==="Round of 16").map(([r])=>r):n.includes("quarterfinal")||n.includes("quarter-final")?y.filter(([,r])=>r==="Quarterfinals").map(([r])=>r):n.includes("semifinal")||n.includes("semi-final")?y.filter(([,r])=>r==="Semifinals").map(([r])=>r):n.includes("third place")||n.includes("third-place")?[103]:n.includes("final")?[104]:[]}function _e(e){for(const[n,,r,t]of y){const o=e.get(n);o&&(x(e,r,o.homeTeam),x(e,t,o.awayTeam))}}function x(e,n,r){const t=n.match(/^(Winner|Loser) Match (\d+)$/);if(!t||!r||$(r))return;const o=Number(t[2]),a=e.get(o);if(!a)return;const s=t[1]==="Winner"?r:a.winnerTeam,i=t[1]==="Loser"?r:a.loserTeam;e.set(o,{...a,winnerTeam:s,loserTeam:i??le(a,s)})}function Ue(e,n){var i;const r=new Map;let t=e.nextElementSibling,o=0,a="";const s=ze(n);for(;t&&!/^H2$/i.test(t.tagName);){if((/^H3$/i.test(t.tagName)||t.matches(".mw-heading"))&&(a=d(t)),t.matches(".footballbox")){const c=H(t,a),u=(i=A[o])==null?void 0:i[0],l=ce(c,s),p=ie(c,l,u);se(r,p,ue({...c,matchNumber:p==null?void 0:p.matchNumber},p,l)),o+=1}t=t.nextElementSibling}return r}function ie(e,n,r){return e.matchNumber?{matchNumber:e.matchNumber,source:e.matchNumberSource??"explicit"}:n!=null&&n.matchNumber?{matchNumber:n.matchNumber,source:"advanced"}:r?{matchNumber:r,source:"fallback"}:void 0}function se(e,n,r){if(!n)return;const t=e.get(n.matchNumber),o={...r,matchNumber:n.matchNumber,matchNumberSource:n.source};(!t||O(o)>O(t))&&e.set(n.matchNumber,o)}function O(e){return Ke(e.matchNumberSource??"fallback")*10+(e.played?6:0)+(e.winnerTeam?3:0)+(e.homeScore!==void 0&&e.awayScore!==void 0?2:0)+(Je(e)?1:0)}function Ke(e){switch(e){case"explicit":return 3;case"advanced":return 2;case"fallback":return 1}}function Je(e){return!!(e.homeTeam&&e.awayTeam&&!$(e.homeTeam)&&!$(e.awayTeam))}function ze(e){const n=new Map;for(const[r,,t,o]of y){const a=e.get(r);a&&(j(n,a.homeTeam,t),j(n,a.awayTeam,o))}return n}function Qe(e){const n=new Map;for(const[r,,t,o]of y){const a=e.get(r);a&&(B(n,a.homeTeam,t),B(n,a.awayTeam,o))}return n}function j(e,n,r){if(!n||$(n))return;const t=r.match(/^(Winner|Loser) Match (\d+)$/),o=Number(t==null?void 0:t[2]);o&&A.some(([a])=>a===o)&&e.set(n,{matchNumber:o,result:(t==null?void 0:t[1])==="Loser"?"loser":"winner"})}function B(e,n,r){if(!n||$(n))return;const t=r.match(/^(Winner|Loser) Match (\d+)$/),o=Number(t==null?void 0:t[2]);o&&e.set(n,{matchNumber:o,result:(t==null?void 0:t[1])==="Loser"?"loser":"winner"})}function ce(e,n){for(const r of[e.homeTeam,e.awayTeam]){const t=r?n.get(r):void 0;if(r&&t)return{team:r,...t}}}function Ve(e,n){if(!n)return e;const r=n.result==="winner"?n.team:e.winnerTeam,t=n.result==="loser"?n.team:e.loserTeam;return{...e,winnerTeam:r,loserTeam:t??le(e,r)}}function ue(e,n,r){return(n==null?void 0:n.matchNumber)===(r==null?void 0:r.matchNumber)?Ve(e,r):e}function le(e,n){if(n===e.homeTeam)return e.awayTeam;if(n===e.awayTeam)return e.homeTeam}function $(e){return/^(winner|loser|runner-up|runner up|3rd|third place)\b/i.test(e)}function H(e,n=""){const r=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),t=d(e.querySelector(".ftime")??e),o=e.querySelector(".fhome"),a=e.querySelector(".faway"),s=g(d((o==null?void 0:o.querySelector("[itemprop='name']"))??o??e)),i=g(d((a==null?void 0:a.querySelector("[itemprop='name']"))??a??e)),c=d(e.querySelector(".fscore")??e),u=c.match(/(\d+)\s*[–-]\s*(\d+)/),l=u?Number(u[1]):void 0,p=u?Number(u[2]):void 0,h=Ze(e),v=u?on(o,a,s,i):void 0,Ee=v===s?i:v===i?s:void 0,w=en(e,n);return{matchNumber:w==null?void 0:w.matchNumber,matchNumberSource:w==null?void 0:w.source,date:r,time:t,kickoffAt:W(r,t),venue:D(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:s||void 0,awayTeam:i||void 0,homeScore:l,awayScore:p,homePenaltyScore:h==null?void 0:h.homePenaltyScore,awayPenaltyScore:h==null?void 0:h.awayPenaltyScore,extraTime:/\ba\.?e\.?t\.?\b/i.test(c),played:!!u,winnerTeam:v,loserTeam:Ee}}function Ze(e){const n=Array.from(e.querySelectorAll("tr")),r=n.findIndex(i=>/penalties/i.test(d(i))),t=r>=0?n.slice(r+1).find(i=>i.querySelector(".fhgoal, .fagoal")):void 0,o=t==null?void 0:t.querySelector("th"),s=(o?d(o):"").match(/(\d+)\s*[–-]\s*(\d+)/);if(s)return{homePenaltyScore:Number(s[1]),awayPenaltyScore:Number(s[2])}}function de(e){var u,l;const n=[];let r="",t="",o="",a=e.nextElementSibling;for(;a&&!/^H[23]$/i.test(a.tagName)&&!a.matches(".mw-heading");)a.matches(".footballbox")&&(r||(r=d(a.querySelector(".fdate")??a).replace(/\s+\(.*\)$/,"")),t||(t=d(a.querySelector(".ftime")??a)),o||(o=D(a.querySelector(".flocation")??a.querySelector(".fright")))),/^STYLE$/i.test(a.tagName)||n.push(d(a)),a=a.nextElementSibling;const s=n.join(" ").replace(/\s+/g," ").trim(),i=r||((u=s.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:u[0])||"",c=t||((l=s.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i))==null?void 0:l[0])||"";return{matchNumber:Xe(e,s),date:i,time:c,kickoffAt:W(i,c),venue:o||nn(n)}}function Ye(e,n){var r;return(r=A.find(([,t,o])=>t===e&&o===n))==null?void 0:r[0]}function Xe(e,n){const r=new Set(b(d(e)));return b(n).find(t=>!r.has(t))??b(n)[0]}function en(e,n){const r=b(d(e.querySelector(".fscore")??e));if(r.length)return{matchNumber:r[0],source:"explicit"};const t=b(d(e));if(!t.length)return;const o=new Set(b(n));return{matchNumber:t.find(s=>!o.has(s))??t[0],source:"explicit"}}function fe(e){let n=e.previousElementSibling;for(;n;){if(/^H[23]$/i.test(n.tagName)||n.matches(".mw-heading"))return d(n);n=n.previousElementSibling}return""}function b(e){return Array.from(e.matchAll(/Match\s+(\d+)/gi)).map(n=>Number(n[1]))}function nn(e){return e.find(n=>n&&!/(?:June|July)\s+\d{1,2},\s+2026/i.test(n)&&!/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(n)&&!/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(n)&&!/Match\s+\d+/i.test(n)&&!/[\{\}]/.test(n)&&!/\[edit\]/i.test(n))??""}function rn(e=new Map){return A.map(([n,r,t])=>{const o=e.get(n);return{...me(o),matchNumber:n,round:"Round of 32",homeSlot:r,awaySlot:t,resolvedHomeTeam:(o==null?void 0:o.homeTeam)??r,resolvedAwayTeam:(o==null?void 0:o.awayTeam)??t,...k(o)}})}function me(e){return{date:(e==null?void 0:e.date)??"",time:(e==null?void 0:e.time)??"",kickoffAt:e==null?void 0:e.kickoffAt,venue:(e==null?void 0:e.venue)??""}}function k(e){return{homeScore:e==null?void 0:e.homeScore,awayScore:e==null?void 0:e.awayScore,homePenaltyScore:e==null?void 0:e.homePenaltyScore,awayPenaltyScore:e==null?void 0:e.awayPenaltyScore,extraTime:e==null?void 0:e.extraTime,played:e==null?void 0:e.played,winnerTeam:e==null?void 0:e.winnerTeam,loserTeam:e==null?void 0:e.loserTeam}}function _(e,n){if(e)return"resolvedHomeTeam"in e?n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam:n==="home"?e.homeTeam:e.awayTeam}function N(e){return Array.from(e.querySelectorAll("th, td")).map(n=>d(n))}function U(e,n,r){for(const t of tn(n))e[t]=e[t]==="placed"?"placed":r}function tn(e){if(!e)return[];const n=K(Array.from(e.querySelectorAll("a")).map(r=>g(d(r))));return n.length?n:K(e.innerHTML.replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").split(`
`).map(g))}function K(e){return Array.from(new Set(e.filter(Boolean)))}function on(e,n,r,t){if(J(e))return r||void 0;if(J(n))return t||void 0}function J(e){if(!e)return!1;const n=e.getAttribute("class")??"";return/\bwinner\b/i.test(n)||!!e.querySelector(".winner, b, strong")}function g(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z](?:\s*,\s*[A-Z])*\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function an(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function q(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function sn(e){const n=pe(e);return/^(winners|runners-up|qualified)\b/.test(n)||/\bthird-placed teams\b/.test(n)}function pe(e){return e.normalize("NFKC").replace(/[\u2010-\u2015\u2212]/g,"-").replace(/\s+/g," ").trim().toLowerCase()}function d(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function D(e){return e?d(e):""}function m(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function he(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function cn(e){return{june:5,july:6}[e.toLowerCase()]}const un=101,ln=102,dn=[104,103],fn=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function mn(e,n){const r=new Map([...e,...n].map(i=>[i.matchNumber,i])),t=z(r,un).reverse(),o=z(r,ln),a=gn(r,dn),s=n.flatMap(i=>ye(i).map(c=>({fromMatchNumber:c,toMatchNumber:i.matchNumber})));return{leftRounds:t,rightRounds:o,finals:a,connections:s}}function pn(e,n){const r=e.left+e.width/2,t=n.left+n.width/2,o=r<t,a=o?e.left+e.width:e.left,s=e.top+e.height/2,i=o?n.left:n.left+n.width,c=n.top+n.height/2,u=a+(i-a)/2;return`M ${T(a)} ${T(s)} H ${T(u)} V ${T(c)} H ${T(i)}`}function z(e,n){return ge(e,n).map((r,t)=>{var o;return{label:fn[t]??((o=r[0])==null?void 0:o.round)??"",matches:r}})}function ge(e,n,r=0,t=[]){const o=e.get(n);if(!o)return t;t[r]=[...t[r]??[],o];for(const a of ye(o))ge(e,a,r+1,t);return t}function ye(e){return[e.homeSlot,e.awaySlot].map(hn).filter(Boolean)}function hn(e){var n;return Number((n=e.match(/^Winner Match (\d+)$/))==null?void 0:n[1])}function gn(e,n){return n.map(r=>e.get(r)).filter(Boolean)}function T(e){return Number.isInteger(e)?String(e):e.toFixed(2)}const yn=["Round of 32","Round of 16","Quarterfinals","Semifinals","Third place","Final"];function wn(e,n){const r=new Map;for(const t of[...e,...n])r.set(t.round,[...r.get(t.round)??[],t]);return yn.map(t=>{const o=r.get(t);return o?{round:t,matches:bn(o)}:void 0}).filter(t=>!!t)}function bn(e){return[...e].sort((n,r)=>{const t=Q(n),o=Q(r);return t!==o?t-o:n.matchNumber-r.matchNumber})}function Q(e){if(!e.kickoffAt)return Number.POSITIVE_INFINITY;const n=new Date(e.kickoffAt).getTime();return Number.isNaN(n)?Number.POSITIVE_INFINITY:n}function we(e,n,r,t,o=oe()){const a=n.filter(l=>l.qualified).map(l=>l.group).sort().join(""),s=r.find(l=>l.key===a);if(!s)throw new Error(`No third-place combination found for groups ${a}`);const i=new Map,c=t.map(l=>V(l,e,n,s,i)),u=o.map(l=>V(l,e,n,s,i));return{roundOf32:c,laterRounds:u,thirdPlaceKey:a}}function Sn(e,n,r,t){var i,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return E(n,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return E(n,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const u=Tn(e),l=(i=t.slotAssignments[u])==null?void 0:i.replace("3","");return l?((c=r.find(p=>p.group===l))==null?void 0:c.team)??E(n,l,2)??e:e}return e}function V(e,n,r,t,o){const a=Z(e.homeSlot,n,r,t,o),s=Z(e.awaySlot,n,r,t,o),i=Y(e.resolvedHomeTeam,e.homeSlot,a),c=Y(e.resolvedAwayTeam,e.awaySlot,s),u=vn(e),l={...e,resolvedHomeTeam:i,resolvedAwayTeam:c,...u};return o.set(l.matchNumber,l),l}function Z(e,n,r,t,o){var i,c;const a=e.match(/^Winner Match (\d+)$/);if(a)return((i=o.get(Number(a[1])))==null?void 0:i.winnerTeam)??e;const s=e.match(/^Loser Match (\d+)$/);return s?((c=o.get(Number(s[1])))==null?void 0:c.loserTeam)??e:Sn(e,n,r,t)}function Y(e,n,r){return e&&e!==n?e:r}function vn(e,n,r){return e.played?e.winnerTeam?{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}:{played:e.played,winnerTeam:void 0,loserTeam:void 0}:{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}}function Tn(e){var r;switch(((r=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:r[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function E(e,n,r){var t,o;return(o=(t=e[n])==null?void 0:t[r])==null?void 0:o.team}function $n(e,n,r){const t={};for(const o of R){const a=new Map(e[o].map((i,c)=>[i.team,c])),s=new Map(e[o].map((i,c)=>[i.team,ve(o,i.team,c+1,i.note)]));for(const i of n[o]){const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:r[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||Te(s,i,c.homeScore,c.awayScore)}t[o]=Nn(Array.from(s.values()),n[o],r,a).map((i,c)=>({...i,position:c+1}))}return t}function Nn(e,n,r,t){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[s])=>s-a).flatMap(([,a])=>be(a,n,r,t))}function be(e,n,r,t){if(e.length<2)return e;const o=new Set(e.map(i=>i.team)),a=new Map(e.map(i=>[i.team,ve(i.group,i.team,i.position,i.note)]));for(const i of n){if(!o.has(i.homeTeam)||!o.has(i.awayTeam))continue;const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:r[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||Te(a,i,c.homeScore,c.awayScore)}const s=[...e].sort((i,c)=>$e(i,c,a));return An(s,a).flatMap(i=>i.length===e.length?i.sort((c,u)=>Mn(c,u,t)):be(i,n,r,t))}function An(e,n){const r=[];for(const t of e){const o=r[r.length-1],a=o==null?void 0:o[o.length-1];!a||$e(t,a,n)!==0?r.push([t]):o.push(t)}return r}function Se(e,n){const r=new Map(n.map(t=>[t.group,t.rank]));return R.map(t=>e[t][2]).sort((t,o)=>kn(t,o,r)).map((t,o)=>({rank:o+1,group:t.group,team:t.team,played:t.played,wins:t.wins,draws:t.draws,losses:t.losses,goalsFor:t.goalsFor,goalsAgainst:t.goalsAgainst,goalDifference:t.goalDifference,points:t.points,qualified:o<8}))}function ve(e,n,r,t){return{group:e,position:r,team:n,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:t}}function Te(e,n,r,t){const o=e.get(n.homeTeam),a=e.get(n.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=r,o.goalsAgainst+=t,a.goalsFor+=t,a.goalsAgainst+=r,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,r>t?(o.wins+=1,a.losses+=1,o.points+=3):t>r?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function $e(e,n,r){const t=r.get(e.team),o=r.get(n.team);return((o==null?void 0:o.points)??0)-((t==null?void 0:t.points)??0)||((o==null?void 0:o.goalDifference)??0)-((t==null?void 0:t.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((t==null?void 0:t.goalsFor)??0)}function Mn(e,n,r){return n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(r.get(e.team)??99)-(r.get(n.team)??99)}function kn(e,n,r){return n.points-e.points||n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(r.get(e.group)??99)-(r.get(n.group)??99)}const Rn={algeria:"DZ",argentina:"AR",australia:"AU",austria:"AT",belgium:"BE","bosnia and herzegovina":"BA",brazil:"BR",canada:"CA","cape verde":"CV",colombia:"CO","costa rica":"CR",croatia:"HR",curacao:"CW","czech republic":"CZ",czechia:"CZ",denmark:"DK","dominican republic":"DO","dr congo":"CD","congo dr":"CD",ecuador:"EC",egypt:"EG",france:"FR",germany:"DE",ghana:"GH",haiti:"HT",iran:"IR",iraq:"IQ","ivory coast":"CI","cote d ivoire":"CI",japan:"JP",jordan:"JO",mexico:"MX",morocco:"MA",netherlands:"NL","new zealand":"NZ",norway:"NO",panama:"PA",paraguay:"PY",portugal:"PT",qatar:"QA","saudi arabia":"SA",senegal:"SN","south africa":"ZA","south korea":"KR",spain:"ES",sweden:"SE",switzerland:"CH",turkey:"TR",turkiye:"TR","united states":"US",usa:"US",uruguay:"UY",uzbekistan:"UZ"},Cn={england:G("gbeng"),scotland:G("gbsct"),wales:G("gbwls")};function En(e){const n=Gn(e);if(!n||qn(n))return"";const r=Cn[n];if(r)return r;const t=Rn[n];return t?Fn(t):""}function Gn(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\([^)]*\)/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/gi," ").trim().replace(/\s+/g," ").toLowerCase()}function qn(e){return/^(winner|loser|runner up|3rd|third place)\b/.test(e)}function Fn(e){return e.toUpperCase().split("").map(n=>String.fromCodePoint(127462+n.charCodeAt(0)-65)).join("")}function G(e){return String.fromCodePoint(127988,...e.toLowerCase().split("").map(n=>917504+n.charCodeAt(0)),917631)}function I(e,n){if(!e.kickoffAt)return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const r=new Date(e.kickoffAt);if(Number.isNaN(r.getTime()))return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const t={},o=new Intl.DateTimeFormat("en-US",{...t,month:"short",day:"numeric",year:"numeric"}).format(r),a=new Intl.DateTimeFormat("en-US",{...t,hour:"numeric",minute:"2-digit",hour12:!0}).format(r);return[o,a,e.venue].filter(Boolean).join(" · ")}const Ln="https://en.wikipedia.org/w/api.php";async function X(e){var a,s;const n=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),r=await fetch(`${Ln}?${n.toString()}`);if(!r.ok)throw new Error(`Wikipedia request failed for ${e}: ${r.status}`);const t=await r.json();if(t.error)throw new Error(t.error.info??`Wikipedia returned an error for ${e}`);const o=(s=(a=t.parse)==null?void 0:a.text)==null?void 0:s["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const Wn=300*1e3,Hn="Could not find ranking of third-placed teams table";function Dn(e){const n={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>Ne(e));const r=async(t={})=>{t.clearUserResults&&(n.userResults={}),n.loading=!0,n.error=void 0,M(e,n,r);try{n.data=await In(),n.stale=!1}catch(o){n.error=o instanceof Error?o.message:"Unable to load tournament data",n.stale=!!n.data}finally{n.loading=!1,M(e,n,r)}};M(e,n,r),r(),window.setInterval(r,Wn)}async function In(){const[e,n]=await Promise.all([X("2026_FIFA_World_Cup"),X("2026_FIFA_World_Cup_knockout_stage")]),r=P(e),t=P(n),o=qe(r),a=Fe(r),s=Pn(r,o),i=He(t),c=De(t),u=Ie(t),l=We(t);return{groups:o,groupMatches:a,knockoutCombinations:i,roundOf32:c,thirdPlaceRanking:s,qualificationStatuses:l,projection:we(o,s,i,c,u),fetchedAt:new Date,sourceUpdatedText:Pe(r)}}function Pn(e,n){try{return Le(e)}catch(r){if(r instanceof Error&&r.message===Hn)return Se(n,[]);throw r}}function M(e,n,r){var o;const t=n.data?xn(n.data,n.userResults):void 0;e.innerHTML=`
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
          <p class="timestamp">${Yn(n)}</p>
        </div>
      </header>

      ${n.error?`<section class="notice ${n.stale?"warning":"error"}">${f(n.error)}</section>`:""}
      ${n.loading&&!n.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

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
          ${On(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
          ${jn(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${f(t.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${zn(t)}
            ${Qn(t.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
          </div>
          ${Vn(t.groupMatches,n.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,Ne(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",()=>r({clearUserResults:!0})),e.querySelectorAll(".score-input").forEach(a=>{a.addEventListener("input",()=>{var l;const s=a.dataset.matchId,i=a.dataset.side;if(!s||!i)return;const c={...n.userResults[s]??{}},u=a.value===""?void 0:Number(a.value);c[i]=Number.isFinite(u)&&u!==void 0?u:void 0,c.homeScore===void 0&&c.awayScore===void 0?delete n.userResults[s]:n.userResults[s]=c,M(e,n,r),(l=e.querySelector(`.score-input[data-match-id="${s}"][data-side="${i}"]`))==null||l.focus()})})}function Ne(e){window.requestAnimationFrame(()=>Kn(e))}function xn(e,n){const r=$n(e.groups,e.groupMatches,n),t=Se(r,e.thirdPlaceRanking);return{...e,groups:r,thirdPlaceRanking:t,projection:we(r,t,e.knockoutCombinations,e.roundOf32,e.projection.laterRounds)}}function On(e,n,r){const{leftRounds:t,rightRounds:o,finals:a,connections:s}=mn(e,n);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${f(JSON.stringify(s))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${t.map((i,c)=>ee(i.label,i.matches,c+1,"left",r)).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${a.map(i=>Ae(i,"center",r)).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${o.map((i,c)=>ee(i.label,i.matches,4-c,"right",r)).join("")}
        </div>
      </div>
    </div>
  `}function ee(e,n,r,t,o){return`
    <section class="round-column round-depth-${r} ${t==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${n.map(a=>Ae(a,t,o)).join("")}
      </div>
    </section>
  `}function Ae(e,n="left",r){const t=I({...e,venue:void 0}),o=Me(e.venue),a=n==="center"?"center-match":n==="left"?"flows-right":"flows-left",s=e.round==="Round of 32";return`
    <article class="match-card ${a}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
      </div>
      <div class="team-row">
        ${ne(e,"home",r)}
        ${s?`<small>${f(e.homeSlot)}</small>`:""}
      </div>
      <div class="team-row">
        ${ne(e,"away",r)}
        ${s?`<small>${f(e.awaySlot)}</small>`:""}
      </div>
      ${t?`<p class="venue">${f(t)}</p>`:""}
      ${o?`<p class="match-venue">${f(o)}</p>`:""}
    </article>
  `}function jn(e,n,r){return`
    <section class="knockout-schedule">
      <div class="section-heading schedule-heading">
        <h2>Knockout matches</h2>
      </div>
      <div class="schedule-stage-list">
        ${wn(e,n).map(o=>Bn(o.round,o.matches,r)).join("")}
      </div>
    </section>
  `}function Bn(e,n,r){return`
    <section class="schedule-stage">
      <h3>${f(e)}</h3>
      <div class="schedule-match-list">
        ${n.map(t=>_n(t,r)).join("")}
      </div>
    </section>
  `}function _n(e,n){const r=I({...e,venue:void 0}),t=Me(e.venue);return`
    <article class="schedule-match">
      <div class="schedule-match-meta">
        <span>Match ${e.matchNumber}</span>
        ${r?`<time>${f(r)}</time>`:""}
      </div>
      <div class="schedule-teams">
        ${re(e.resolvedHomeTeam,e,"home",n)}
        ${e.played?Un(e):'<span class="schedule-versus">vs</span>'}
        ${re(e.resolvedAwayTeam,e,"away",n)}
      </div>
      ${t?`<p>${f(t)}</p>`:""}
    </article>
  `}function Me(e){return e.replace(/\s*(?:attendance|referee|officials?)\b.*$/i,"").trim()}function ke(e,n){const r=En(e),t=n[e]??"unqualified";return`${r?`<span class="team-flag bracket-team-${t}" aria-hidden="true">${r}</span>`:""}<span class="bracket-team-${t}">${f(e)}</span>`}function ne(e,n,r){const t=n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam,o=n==="home"?e.homeScore:e.awayScore,a=n==="home"?e.homePenaltyScore:e.awayPenaltyScore;return`
    <strong class="match-team${e.winnerTeam===t?" match-team-winner":""}">
      <span class="match-team-name">${ke(t,r)}</span>
      ${e.played?F(o,a,!1):""}
    </strong>
  `}function re(e,n,r,t){const o=n.winnerTeam===e?" match-team-winner":"";return`
    <strong class="schedule-team schedule-team-${r}${o}">
      ${ke(e,t)}
    </strong>
  `}function Un(e){const n=e.extraTime?"AET":"FT";return`
    <span class="schedule-scoreline" aria-label="${f(`${e.resolvedHomeTeam} ${L(e.homeScore,e.homePenaltyScore)}, ${n}, ${e.resolvedAwayTeam} ${L(e.awayScore,e.awayPenaltyScore)}`)}">
      ${F(e.homeScore,e.homePenaltyScore,e.winnerTeam===e.resolvedHomeTeam)}
      <span class="schedule-result-label">${n}</span>
      ${F(e.awayScore,e.awayPenaltyScore,e.winnerTeam===e.resolvedAwayTeam)}
    </span>
  `}function F(e,n,r){return`<span class="match-score${r?" match-score-winner":""}">${f(L(e,n))}</span>`}function L(e,n){return`${e??"-"}${n===void 0?"":` (${n})`}`}function Kn(e){e.querySelectorAll(".bracket-stage").forEach(n=>{const r=n.querySelector(".bracket-connectors");if(!r)return;const t=Jn(n.dataset.connections),o=n.getBoundingClientRect();r.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),r.replaceChildren(...t.flatMap(a=>{const s=n.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),i=n.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!s||!i)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",pn(te(s,o),te(i,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function Jn(e){if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}function te(e,n){const r=e.getBoundingClientRect();return{left:r.left-n.left,top:r.top-n.top,width:r.width,height:r.height}}function zn(e){return`
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
                <strong>${f(n.team)}</strong>
                <small>Group ${n.group}</small>
                <b>${n.played}</b>
                <b>${n.points}</b>
                <b>${Re(n.goalDifference)}</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function Qn(e){return`
    <div class="groups-grid">
      ${Object.entries(e).map(([n,r])=>`
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
                  ${r.map(t=>`
                        <tr>
                          <td>${t.position}</td>
                          <td>${f(t.team)}</td>
                          <td>${t.played}</td>
                          <td>${t.points}</td>
                          <td>${Re(t.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function Vn(e,n){return`
    <div class="results-grid">
      ${Object.entries(e).map(([r,t])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${r}</h3>
              </div>
              <div class="results-list">
                ${t.map(o=>Zn(o,n[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function Zn(e,n){const r=e.played?e.homeScore:n==null?void 0:n.homeScore,t=e.played?e.awayScore:n==null?void 0:n.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${f(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${r??"-"}-${t??"-"}</strong>`:`
              <div class="score-editor" aria-label="${f(e.homeTeam)} vs ${f(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${r??""}" aria-label="${f(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${t??""}" aria-label="${f(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${f(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${f(I({...e,venue:void 0}))}</p>`}
    </article>
  `}function Yn(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function Re(e){return e>0?`+${e}`:String(e)}function f(e){return e.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}const Ce=document.querySelector("#app");if(!Ce)throw new Error("App root element was not found");Dn(Ce);
