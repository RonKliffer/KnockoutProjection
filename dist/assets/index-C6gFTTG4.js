(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const N=["A","B","C","D","E","F","G","H","I","J","K","L"],$e=["1A","1B","1D","1E","1G","1I","1K","1L"],T=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],G=[[89,"Round of 16","Winner Match 74","Winner Match 77"],[90,"Round of 16","Winner Match 73","Winner Match 75"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function W(e){return new DOMParser().parseFromString(e,"text/html")}function Ae(e){const n={};for(const r of N){const t=w(e,`Group ${r}`),o=t?M(t):null;if(!o)throw new Error(`Could not find standings table for Group ${r}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(i=>i.querySelector("td"));if(n[r]=a.map(i=>qe(i,r)).filter(Boolean),n[r].length<4)throw new Error(`Group ${r} standings table did not contain four teams`)}return n}function Ne(e){const n={};for(const r of N){const t=w(e,`Group ${r}`);if(!t)throw new Error(`Could not find match list for Group ${r}`);const o=[];let a=t.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const i=Fe(a,r,o.length);i&&o.push(i)}a=a.nextElementSibling}n[r]=o}return n}function Me(e){const n=w(e,/ranking of third-plac(?:e|ed) teams/),r=n?M(n):null;if(!r)throw new Error("Could not find ranking of third-placed teams table");return Array.from(r.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map((t,o)=>{var l;const a=v(t),i=a[0]&&/^\d+$/.test(a[0])?0:-1,s=m(a[0+i])||o+1,c=(l=(a[1+i]||"").match(/[A-L]/))==null?void 0:l[0],u=g(a[2+i]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:s,group:c,team:u,played:m(a[3+i]),wins:m(a[4+i]),draws:m(a[5+i]),losses:m(a[6+i]),goalsFor:m(a[7+i]),goalsAgainst:m(a[8+i]),goalDifference:ie(a[9+i]),points:m(a[10+i]),qualified:s<=8}})}function ke(e){const n=w(e,"Qualified teams"),r=n?M(n):null;if(!r)throw new Error("Could not find qualified teams table");const t=Array.from(r.querySelectorAll("tr")),a=v(t.find(u=>v(u).some(Qe))??r).map(se),i=a.map((u,l)=>/^(winners|runners-up)$/.test(u)?l:-1).filter(u=>u>=0),s=a.map((u,l)=>u.includes("third-placed teams")||/^qualified\b/.test(u)?l:-1).filter(u=>u>=0);if(!i.length&&!s.length)throw new Error("Qualified teams table did not include placement columns");const c={};for(const u of t.filter(l=>l.querySelector("td"))){const l=Array.from(u.querySelectorAll("th, td"));for(const p of i)I(c,l[p],"placed");for(const p of s)I(c,l[p],"qualified")}return c}function Ce(e){const n=w(e,"Combinations of matches in the round of 32"),r=n?M(n):null;if(!r)throw new Error("Could not find third-place combination table");return Array.from(r.querySelectorAll("tbody tr")).filter(t=>t.querySelector("td")).map(t=>{const o=v(t),a=o.filter(s=>/^[A-L]$/.test(s)).slice(0,8),i=o.filter(s=>/^3[A-L]$/.test(s)).slice(0,8);return a.length!==8||i.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries($e.map((s,c)=>[s,i[c]]))}}).filter(Boolean)}function Ee(e){const n=ee(e),r=w(e,"Round of 32");if(!r)return Ue(n);for(const[i,s]of We(r,n))n.set(i,s);const t=[];let o=r.nextElementSibling;for(;o&&!/^H2$/i.test(o.tagName);){if(/^H3$/i.test(o.tagName)){const s=d(o).split(/\s+vs\s+/i).map(ze),c=oe(o),u=c.matchNumber??xe(s[0],s[1]);u&&s.length===2&&t.push({matchNumber:u,round:"Round of 32",date:c.date,time:c.time,kickoffAt:c.kickoffAt,venue:c.venue,homeSlot:s[0],awaySlot:s[1],resolvedHomeTeam:c.homeTeam??s[0],resolvedAwayTeam:c.awayTeam??s[1],...A(c)})}o=o.nextElementSibling}const a=new Map(t.map(i=>[i.matchNumber,i]));return T.map(([i,s,c])=>{const u=a.get(i)??n.get(i);return{matchNumber:i,round:"Round of 32",date:(u==null?void 0:u.date)??"",time:(u==null?void 0:u.time)??"",kickoffAt:u==null?void 0:u.kickoffAt,venue:(u==null?void 0:u.venue)??"",homeSlot:s,awaySlot:c,resolvedHomeTeam:P(u,"home")??s,resolvedAwayTeam:P(u,"away")??c,...A(u)}})}function X(e=new Map){return G.map(([n,r,t,o])=>{const a=e.get(n);return{...ae(a),matchNumber:n,round:r,homeSlot:t,awaySlot:o,resolvedHomeTeam:(a==null?void 0:a.homeTeam)??t,resolvedAwayTeam:(a==null?void 0:a.awayTeam)??o,...A(a)}})}function Re(e){return X(ee(e))}function q(e,n){const r=e.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i),t=n.replace(/\u2212/g,"-").match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);if(!r||!t)return;const o=Ve(r[1]),a=Number(r[2]),i=Number(r[3]);let s=Number(t[1]);const c=Number(t[2]),u=t[3].toLowerCase(),l=Number(t[4]),p=Number(t[5]??"0");if(o===void 0)return;u==="p"&&s!==12?s+=12:u==="a"&&s===12&&(s=0);const h=l<0?-1:1,b=l*60+h*p;return new Date(Date.UTC(i,o,a,s,c)-b*60*1e3).toISOString()}function Ge(e){var r;return(r=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:r[0]}function qe(e,n){const r=v(e);return r.length<10||!/^\d+$/.test(r[0])?null:{group:n,position:m(r[0]),team:g(r[1]),played:m(r[2]),wins:m(r[3]),draws:m(r[4]),losses:m(r[5]),goalsFor:m(r[6]),goalsAgainst:m(r[7]),goalDifference:ie(r[8]),points:m(r[9]),note:r.slice(10).join(" ")}}function Fe(e,n,r){var l;const t=g(d(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=g(d(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=d(e.querySelector(".fscore")??e),i=a.match(/(\d+)\s*[–-]\s*(\d+)/),s=Number((l=a.match(/Match\s+(\d+)/i))==null?void 0:l[1])||void 0;if(!t||!o)return null;const c=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),u=d(e.querySelector(".ftime")??e);return{id:`${n}-${r+1}`,group:n,matchNumber:s,date:c,time:u,kickoffAt:q(c,u),venue:F(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:t,awayTeam:o,homeScore:i?Number(i[1]):void 0,awayScore:i?Number(i[2]):void 0,played:!!i}}function w(e,n){return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(r=>{const t=j(r.textContent??"");return typeof n=="string"?t.includes(j(n)):n.test(t)})??null}function M(e){let n=e.nextElementSibling;for(;n;){if(n.matches("table.wikitable"))return n;const r=n.querySelector("table.wikitable");if(r)return r;if(/^H[234]$/i.test(n.tagName)||n.matches(".mw-heading"))return null;n=n.nextElementSibling}return null}function ee(e){const n=new Map;for(const r of Array.from(e.querySelectorAll(".footballbox")).map(t=>te(t,Be(t))).filter(t=>!!t.matchNumber))n.set(r.matchNumber,r);for(const r of Array.from(e.querySelectorAll("h3, .mw-heading")).filter(t=>/\s+vs\s+/i.test(d(t))).map(t=>oe(t)).filter(t=>!!t.matchNumber))n.has(r.matchNumber)||n.set(r.matchNumber,r);return Le(n),n}function Le(e){for(const[n,,r,t]of G){const o=e.get(n);o&&(H(e,r,o.homeTeam),H(e,t,o.awayTeam))}}function H(e,n,r){const t=n.match(/^(Winner|Loser) Match (\d+)$/);if(!t||!r||re(r))return;const o=Number(t[2]),a=e.get(o);if(!a)return;const i=t[1]==="Winner"?r:a.winnerTeam,s=t[1]==="Loser"?r:a.loserTeam;e.set(o,{...a,winnerTeam:i,loserTeam:s??ne(a,i)})}function We(e,n){var s;const r=new Map;let t=e.nextElementSibling,o=0,a="";const i=He(n);for(;t&&!/^H2$/i.test(t.tagName);){if((/^H3$/i.test(t.tagName)||t.matches(".mw-heading"))&&(a=d(t)),t.matches(".footballbox")){const c=te(t,a),u=(s=T[o])==null?void 0:s[0],l=De(c,i),p=c.matchNumber??(l==null?void 0:l.matchNumber)??u;p&&r.set(p,Pe({...c,matchNumber:p},l)),o+=1}t=t.nextElementSibling}return r}function He(e){const n=new Map;for(const[r,,t,o]of G){const a=e.get(r);a&&(D(n,a.homeTeam,t),D(n,a.awayTeam,o))}return n}function D(e,n,r){if(!n||re(n))return;const t=r.match(/^(Winner|Loser) Match (\d+)$/),o=Number(t==null?void 0:t[2]);o&&T.some(([a])=>a===o)&&e.set(n,{matchNumber:o,result:(t==null?void 0:t[1])==="Loser"?"loser":"winner"})}function De(e,n){for(const r of[e.homeTeam,e.awayTeam]){const t=r?n.get(r):void 0;if(r&&t)return{team:r,...t}}}function Pe(e,n){if(!n)return e;const r=n.result==="winner"?n.team:e.winnerTeam,t=n.result==="loser"?n.team:e.loserTeam;return{...e,winnerTeam:r,loserTeam:t??ne(e,r)}}function ne(e,n){if(n===e.homeTeam)return e.awayTeam;if(n===e.awayTeam)return e.homeTeam}function re(e){return/^(winner|loser|runner-up|runner up|3rd|third place)\b/i.test(e)}function te(e,n=""){const r=d(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),t=d(e.querySelector(".ftime")??e),o=e.querySelector(".fhome"),a=e.querySelector(".faway"),i=g(d((o==null?void 0:o.querySelector("[itemprop='name']"))??o??e)),s=g(d((a==null?void 0:a.querySelector("[itemprop='name']"))??a??e)),c=d(e.querySelector(".fscore")??e),u=c.match(/(\d+)\s*[–-]\s*(\d+)/),l=u?Number(u[1]):void 0,p=u?Number(u[2]):void 0,h=Ie(e),b=Je(o,a,i,s),Te=b===i?s:b===s?i:void 0;return{matchNumber:je(e,n),date:r,time:t,kickoffAt:q(r,t),venue:F(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:i||void 0,awayTeam:s||void 0,homeScore:l,awayScore:p,homePenaltyScore:h==null?void 0:h.homePenaltyScore,awayPenaltyScore:h==null?void 0:h.awayPenaltyScore,extraTime:/\ba\.?e\.?t\.?\b/i.test(c),played:!!u,winnerTeam:b,loserTeam:Te}}function Ie(e){const n=Array.from(e.querySelectorAll("tr")),r=n.findIndex(s=>/penalties/i.test(d(s))),t=r>=0?n.slice(r+1).find(s=>s.querySelector(".fhgoal, .fagoal")):void 0,o=t==null?void 0:t.querySelector("th"),i=(o?d(o):"").match(/(\d+)\s*[–-]\s*(\d+)/);if(i)return{homePenaltyScore:Number(i[1]),awayPenaltyScore:Number(i[2])}}function oe(e){var u,l;const n=[];let r="",t="",o="",a=e.nextElementSibling;for(;a&&!/^H[23]$/i.test(a.tagName)&&!a.matches(".mw-heading");)a.matches(".footballbox")&&(r||(r=d(a.querySelector(".fdate")??a).replace(/\s+\(.*\)$/,"")),t||(t=d(a.querySelector(".ftime")??a)),o||(o=F(a.querySelector(".flocation")??a.querySelector(".fright")))),/^STYLE$/i.test(a.tagName)||n.push(d(a)),a=a.nextElementSibling;const i=n.join(" ").replace(/\s+/g," ").trim(),s=r||((u=i.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:u[0])||"",c=t||((l=i.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i))==null?void 0:l[0])||"";return{matchNumber:Oe(e,i),date:s,time:c,kickoffAt:q(s,c),venue:o||_e(n)}}function xe(e,n){var r;return(r=T.find(([,t,o])=>t===e&&o===n))==null?void 0:r[0]}function Oe(e,n){const r=new Set(y(d(e)));return y(n).find(t=>!r.has(t))??y(n)[0]}function je(e,n){const r=y(d(e.querySelector(".fscore")??e));if(r.length)return r[0];const t=y(d(e));if(!t.length)return;const o=new Set(y(n));return t.find(a=>!o.has(a))??t[0]}function Be(e){let n=e.previousElementSibling;for(;n;){if(/^H[23]$/i.test(n.tagName)||n.matches(".mw-heading"))return d(n);n=n.previousElementSibling}return""}function y(e){return Array.from(e.matchAll(/Match\s+(\d+)/gi)).map(n=>Number(n[1]))}function _e(e){return e.find(n=>n&&!/(?:June|July)\s+\d{1,2},\s+2026/i.test(n)&&!/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(n)&&!/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(n)&&!/Match\s+\d+/i.test(n)&&!/[\{\}]/.test(n)&&!/\[edit\]/i.test(n))??""}function Ue(e=new Map){return T.map(([n,r,t])=>{const o=e.get(n);return{...ae(o),matchNumber:n,round:"Round of 32",homeSlot:r,awaySlot:t,resolvedHomeTeam:(o==null?void 0:o.homeTeam)??r,resolvedAwayTeam:(o==null?void 0:o.awayTeam)??t,...A(o)}})}function ae(e){return{date:(e==null?void 0:e.date)??"",time:(e==null?void 0:e.time)??"",kickoffAt:e==null?void 0:e.kickoffAt,venue:(e==null?void 0:e.venue)??""}}function A(e){return{homeScore:e==null?void 0:e.homeScore,awayScore:e==null?void 0:e.awayScore,homePenaltyScore:e==null?void 0:e.homePenaltyScore,awayPenaltyScore:e==null?void 0:e.awayPenaltyScore,extraTime:e==null?void 0:e.extraTime,played:e==null?void 0:e.played,winnerTeam:e==null?void 0:e.winnerTeam,loserTeam:e==null?void 0:e.loserTeam}}function P(e,n){if(e)return"resolvedHomeTeam"in e?n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam:n==="home"?e.homeTeam:e.awayTeam}function v(e){return Array.from(e.querySelectorAll("th, td")).map(n=>d(n))}function I(e,n,r){for(const t of Ke(n))e[t]=e[t]==="placed"?"placed":r}function Ke(e){if(!e)return[];const n=x(Array.from(e.querySelectorAll("a")).map(r=>g(d(r))));return n.length?n:x(e.innerHTML.replace(/<br\s*\/?>/gi,`
`).replace(/<[^>]+>/g," ").split(`
`).map(g))}function x(e){return Array.from(new Set(e.filter(Boolean)))}function Je(e,n,r,t){if(O(e))return r||void 0;if(O(n))return t||void 0}function O(e){if(!e)return!1;const n=e.getAttribute("class")??"";return/\bwinner\b/i.test(n)||!!e.querySelector(".winner, b, strong")}function g(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z](?:\s*,\s*[A-Z])*\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function ze(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function j(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function Qe(e){const n=se(e);return/^(winners|runners-up|qualified)\b/.test(n)||/\bthird-placed teams\b/.test(n)}function se(e){return e.normalize("NFKC").replace(/[\u2010-\u2015\u2212]/g,"-").replace(/\s+/g," ").trim().toLowerCase()}function d(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function F(e){return e?d(e):""}function m(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function ie(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function Ve(e){return{june:5,july:6}[e.toLowerCase()]}const Ze=101,Ye=102,Xe=[104,103],en=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function nn(e,n){const r=new Map([...e,...n].map(s=>[s.matchNumber,s])),t=B(r,Ze).reverse(),o=B(r,Ye),a=on(r,Xe),i=n.flatMap(s=>ue(s).map(c=>({fromMatchNumber:c,toMatchNumber:s.matchNumber})));return{leftRounds:t,rightRounds:o,finals:a,connections:i}}function rn(e,n){const r=e.left+e.width/2,t=n.left+n.width/2,o=r<t,a=o?e.left+e.width:e.left,i=e.top+e.height/2,s=o?n.left:n.left+n.width,c=n.top+n.height/2,u=a+(s-a)/2;return`M ${S(a)} ${S(i)} H ${S(u)} V ${S(c)} H ${S(s)}`}function B(e,n){return ce(e,n).map((r,t)=>{var o;return{label:en[t]??((o=r[0])==null?void 0:o.round)??"",matches:r}})}function ce(e,n,r=0,t=[]){const o=e.get(n);if(!o)return t;t[r]=[...t[r]??[],o];for(const a of ue(o))ce(e,a,r+1,t);return t}function ue(e){return[e.homeSlot,e.awaySlot].map(tn).filter(Boolean)}function tn(e){var n;return Number((n=e.match(/^Winner Match (\d+)$/))==null?void 0:n[1])}function on(e,n){return n.map(r=>e.get(r)).filter(Boolean)}function S(e){return Number.isInteger(e)?String(e):e.toFixed(2)}const an=["Round of 32","Round of 16","Quarterfinals","Semifinals","Third place","Final"];function sn(e,n){const r=new Map;for(const t of[...e,...n])r.set(t.round,[...r.get(t.round)??[],t]);return an.map(t=>{const o=r.get(t);return o?{round:t,matches:cn(o)}:void 0}).filter(t=>!!t)}function cn(e){return[...e].sort((n,r)=>{const t=_(n),o=_(r);return t!==o?t-o:n.matchNumber-r.matchNumber})}function _(e){if(!e.kickoffAt)return Number.POSITIVE_INFINITY;const n=new Date(e.kickoffAt).getTime();return Number.isNaN(n)?Number.POSITIVE_INFINITY:n}function le(e,n,r,t,o=X()){const a=n.filter(l=>l.qualified).map(l=>l.group).sort().join(""),i=r.find(l=>l.key===a);if(!i)throw new Error(`No third-place combination found for groups ${a}`);const s=new Map,c=t.map(l=>U(l,e,n,i,s)),u=o.map(l=>U(l,e,n,i,s));return{roundOf32:c,laterRounds:u,thirdPlaceKey:a}}function un(e,n,r,t){var s,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return k(n,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return k(n,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const u=dn(e),l=(s=t.slotAssignments[u])==null?void 0:s.replace("3","");return l?((c=r.find(p=>p.group===l))==null?void 0:c.team)??k(n,l,2)??e:e}return e}function U(e,n,r,t,o){const a=K(e.homeSlot,n,r,t,o),i=K(e.awaySlot,n,r,t,o),s=J(e.resolvedHomeTeam,e.homeSlot,a),c=J(e.resolvedAwayTeam,e.awaySlot,i),u=ln(e),l={...e,resolvedHomeTeam:s,resolvedAwayTeam:c,...u};return o.set(l.matchNumber,l),l}function K(e,n,r,t,o){var s,c;const a=e.match(/^Winner Match (\d+)$/);if(a)return((s=o.get(Number(a[1])))==null?void 0:s.winnerTeam)??e;const i=e.match(/^Loser Match (\d+)$/);return i?((c=o.get(Number(i[1])))==null?void 0:c.loserTeam)??e:un(e,n,r,t)}function J(e,n,r){return e&&e!==n?e:r}function ln(e,n,r){return e.played?e.winnerTeam?{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}:{played:e.played,winnerTeam:void 0,loserTeam:void 0}:{played:e.played,winnerTeam:e.winnerTeam,loserTeam:e.loserTeam}}function dn(e){var r;switch(((r=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:r[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function k(e,n,r){var t,o;return(o=(t=e[n])==null?void 0:t[r])==null?void 0:o.team}function fn(e,n,r){const t={};for(const o of N){const a=new Map(e[o].map((s,c)=>[s.team,c])),i=new Map(e[o].map((s,c)=>[s.team,me(o,s.team,c+1,s.note)]));for(const s of n[o]){const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:r[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||pe(i,s,c.homeScore,c.awayScore)}t[o]=mn(Array.from(i.values()),n[o],r,a).map((s,c)=>({...s,position:c+1}))}return t}function mn(e,n,r,t){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[i])=>i-a).flatMap(([,a])=>de(a,n,r,t))}function de(e,n,r,t){if(e.length<2)return e;const o=new Set(e.map(s=>s.team)),a=new Map(e.map(s=>[s.team,me(s.group,s.team,s.position,s.note)]));for(const s of n){if(!o.has(s.homeTeam)||!o.has(s.awayTeam))continue;const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:r[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||pe(a,s,c.homeScore,c.awayScore)}const i=[...e].sort((s,c)=>he(s,c,a));return pn(i,a).flatMap(s=>s.length===e.length?s.sort((c,u)=>hn(c,u,t)):de(s,n,r,t))}function pn(e,n){const r=[];for(const t of e){const o=r[r.length-1],a=o==null?void 0:o[o.length-1];!a||he(t,a,n)!==0?r.push([t]):o.push(t)}return r}function fe(e,n){const r=new Map(n.map(t=>[t.group,t.rank]));return N.map(t=>e[t][2]).sort((t,o)=>gn(t,o,r)).map((t,o)=>({rank:o+1,group:t.group,team:t.team,played:t.played,wins:t.wins,draws:t.draws,losses:t.losses,goalsFor:t.goalsFor,goalsAgainst:t.goalsAgainst,goalDifference:t.goalDifference,points:t.points,qualified:o<8}))}function me(e,n,r,t){return{group:e,position:r,team:n,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:t}}function pe(e,n,r,t){const o=e.get(n.homeTeam),a=e.get(n.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=r,o.goalsAgainst+=t,a.goalsFor+=t,a.goalsAgainst+=r,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,r>t?(o.wins+=1,a.losses+=1,o.points+=3):t>r?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function he(e,n,r){const t=r.get(e.team),o=r.get(n.team);return((o==null?void 0:o.points)??0)-((t==null?void 0:t.points)??0)||((o==null?void 0:o.goalDifference)??0)-((t==null?void 0:t.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((t==null?void 0:t.goalsFor)??0)}function hn(e,n,r){return n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(r.get(e.team)??99)-(r.get(n.team)??99)}function gn(e,n,r){return n.points-e.points||n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(r.get(e.group)??99)-(r.get(n.group)??99)}const yn={algeria:"DZ",argentina:"AR",australia:"AU",austria:"AT",belgium:"BE","bosnia and herzegovina":"BA",brazil:"BR",canada:"CA","cape verde":"CV",colombia:"CO","costa rica":"CR",croatia:"HR",curacao:"CW","czech republic":"CZ",czechia:"CZ",denmark:"DK","dominican republic":"DO","dr congo":"CD","congo dr":"CD",ecuador:"EC",egypt:"EG",france:"FR",germany:"DE",ghana:"GH",haiti:"HT",iran:"IR",iraq:"IQ","ivory coast":"CI","cote d ivoire":"CI",japan:"JP",jordan:"JO",mexico:"MX",morocco:"MA",netherlands:"NL","new zealand":"NZ",norway:"NO",panama:"PA",paraguay:"PY",portugal:"PT",qatar:"QA","saudi arabia":"SA",senegal:"SN","south africa":"ZA","south korea":"KR",spain:"ES",sweden:"SE",switzerland:"CH",turkey:"TR",turkiye:"TR","united states":"US",usa:"US",uruguay:"UY",uzbekistan:"UZ"},wn={england:C("gbeng"),scotland:C("gbsct"),wales:C("gbwls")};function bn(e){const n=Sn(e);if(!n||vn(n))return"";const r=wn[n];if(r)return r;const t=yn[n];return t?Tn(t):""}function Sn(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\([^)]*\)/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/gi," ").trim().replace(/\s+/g," ").toLowerCase()}function vn(e){return/^(winner|loser|runner up|3rd|third place)\b/.test(e)}function Tn(e){return e.toUpperCase().split("").map(n=>String.fromCodePoint(127462+n.charCodeAt(0)-65)).join("")}function C(e){return String.fromCodePoint(127988,...e.toLowerCase().split("").map(n=>917504+n.charCodeAt(0)),917631)}function L(e,n){if(!e.kickoffAt)return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const r=new Date(e.kickoffAt);if(Number.isNaN(r.getTime()))return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const t={},o=new Intl.DateTimeFormat("en-US",{...t,month:"short",day:"numeric",year:"numeric"}).format(r),a=new Intl.DateTimeFormat("en-US",{...t,hour:"numeric",minute:"2-digit",hour12:!0}).format(r);return[o,a,e.venue].filter(Boolean).join(" · ")}const $n="https://en.wikipedia.org/w/api.php";async function z(e){var a,i;const n=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),r=await fetch(`${$n}?${n.toString()}`);if(!r.ok)throw new Error(`Wikipedia request failed for ${e}: ${r.status}`);const t=await r.json();if(t.error)throw new Error(t.error.info??`Wikipedia returned an error for ${e}`);const o=(i=(a=t.parse)==null?void 0:a.text)==null?void 0:i["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const An=300*1e3,Nn="Could not find ranking of third-placed teams table";function Mn(e){const n={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>ge(e));const r=async(t={})=>{t.clearUserResults&&(n.userResults={}),n.loading=!0,n.error=void 0,$(e,n,r);try{n.data=await kn(),n.stale=!1}catch(o){n.error=o instanceof Error?o.message:"Unable to load tournament data",n.stale=!!n.data}finally{n.loading=!1,$(e,n,r)}};$(e,n,r),r(),window.setInterval(r,An)}async function kn(){const[e,n]=await Promise.all([z("2026_FIFA_World_Cup"),z("2026_FIFA_World_Cup_knockout_stage")]),r=W(e),t=W(n),o=Ae(r),a=Ne(r),i=Cn(r,o),s=Ce(t),c=Ee(t),u=Re(t),l=ke(t);return{groups:o,groupMatches:a,knockoutCombinations:s,roundOf32:c,thirdPlaceRanking:i,qualificationStatuses:l,projection:le(o,i,s,c,u),fetchedAt:new Date,sourceUpdatedText:Ge(r)}}function Cn(e,n){try{return Me(e)}catch(r){if(r instanceof Error&&r.message===Nn)return fe(n,[]);throw r}}function $(e,n,r){var o;const t=n.data?En(n.data,n.userResults):void 0;e.innerHTML=`
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
          <p class="timestamp">${On(n)}</p>
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
          ${Rn(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
          ${Gn(t.projection.roundOf32,t.projection.laterRounds,t.qualificationStatuses)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${f(t.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${Dn(t)}
            ${Pn(t.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
          </div>
          ${In(t.groupMatches,n.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,ge(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",()=>r({clearUserResults:!0})),e.querySelectorAll(".score-input").forEach(a=>{a.addEventListener("input",()=>{var l;const i=a.dataset.matchId,s=a.dataset.side;if(!i||!s)return;const c={...n.userResults[i]??{}},u=a.value===""?void 0:Number(a.value);c[s]=Number.isFinite(u)&&u!==void 0?u:void 0,c.homeScore===void 0&&c.awayScore===void 0?delete n.userResults[i]:n.userResults[i]=c,$(e,n,r),(l=e.querySelector(`.score-input[data-match-id="${i}"][data-side="${s}"]`))==null||l.focus()})})}function ge(e){window.requestAnimationFrame(()=>Wn(e))}function En(e,n){const r=fn(e.groups,e.groupMatches,n),t=fe(r,e.thirdPlaceRanking);return{...e,groups:r,thirdPlaceRanking:t,projection:le(r,t,e.knockoutCombinations,e.roundOf32,e.projection.laterRounds)}}function Rn(e,n,r){const{leftRounds:t,rightRounds:o,finals:a,connections:i}=nn(e,n);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${f(JSON.stringify(i))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${t.map((s,c)=>Q(s.label,s.matches,c+1,"left",r)).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${a.map(s=>ye(s,"center",r)).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${o.map((s,c)=>Q(s.label,s.matches,4-c,"right",r)).join("")}
        </div>
      </div>
    </div>
  `}function Q(e,n,r,t,o){return`
    <section class="round-column round-depth-${r} ${t==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${n.map(a=>ye(a,t,o)).join("")}
      </div>
    </section>
  `}function ye(e,n="left",r){const t=L({...e,venue:void 0}),o=we(e.venue),a=n==="center"?"center-match":n==="left"?"flows-right":"flows-left",i=e.round==="Round of 32";return`
    <article class="match-card ${a}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
      </div>
      <div class="team-row">
        ${V(e,"home",r)}
        ${i?`<small>${f(e.homeSlot)}</small>`:""}
      </div>
      <div class="team-row">
        ${V(e,"away",r)}
        ${i?`<small>${f(e.awaySlot)}</small>`:""}
      </div>
      ${t?`<p class="venue">${f(t)}</p>`:""}
      ${o?`<p class="match-venue">${f(o)}</p>`:""}
    </article>
  `}function Gn(e,n,r){return`
    <section class="knockout-schedule">
      <div class="section-heading schedule-heading">
        <h2>Knockout matches</h2>
      </div>
      <div class="schedule-stage-list">
        ${sn(e,n).map(o=>qn(o.round,o.matches,r)).join("")}
      </div>
    </section>
  `}function qn(e,n,r){return`
    <section class="schedule-stage">
      <h3>${f(e)}</h3>
      <div class="schedule-match-list">
        ${n.map(t=>Fn(t,r)).join("")}
      </div>
    </section>
  `}function Fn(e,n){const r=L({...e,venue:void 0}),t=we(e.venue);return`
    <article class="schedule-match">
      <div class="schedule-match-meta">
        <span>Match ${e.matchNumber}</span>
        ${r?`<time>${f(r)}</time>`:""}
      </div>
      <div class="schedule-teams">
        ${Z(e.resolvedHomeTeam,e,"home",n)}
        ${e.played?Ln(e):'<span class="schedule-versus">vs</span>'}
        ${Z(e.resolvedAwayTeam,e,"away",n)}
      </div>
      ${t?`<p>${f(t)}</p>`:""}
    </article>
  `}function we(e){return e.replace(/\s*(?:attendance|referee|officials?)\b.*$/i,"").trim()}function be(e,n){const r=bn(e),t=n[e]??"unqualified";return`${r?`<span class="team-flag bracket-team-${t}" aria-hidden="true">${r}</span>`:""}<span class="bracket-team-${t}">${f(e)}</span>`}function V(e,n,r){const t=n==="home"?e.resolvedHomeTeam:e.resolvedAwayTeam,o=n==="home"?e.homeScore:e.awayScore,a=n==="home"?e.homePenaltyScore:e.awayPenaltyScore;return`
    <strong class="match-team${e.winnerTeam===t?" match-team-winner":""}">
      <span class="match-team-name">${be(t,r)}</span>
      ${e.played?E(o,a,!1):""}
    </strong>
  `}function Z(e,n,r,t){const o=n.winnerTeam===e?" match-team-winner":"";return`
    <strong class="schedule-team schedule-team-${r}${o}">
      ${be(e,t)}
    </strong>
  `}function Ln(e){const n=e.extraTime?"AET":"FT";return`
    <span class="schedule-scoreline" aria-label="${f(`${e.resolvedHomeTeam} ${R(e.homeScore,e.homePenaltyScore)}, ${n}, ${e.resolvedAwayTeam} ${R(e.awayScore,e.awayPenaltyScore)}`)}">
      ${E(e.homeScore,e.homePenaltyScore,e.winnerTeam===e.resolvedHomeTeam)}
      <span class="schedule-result-label">${n}</span>
      ${E(e.awayScore,e.awayPenaltyScore,e.winnerTeam===e.resolvedAwayTeam)}
    </span>
  `}function E(e,n,r){return`<span class="match-score${r?" match-score-winner":""}">${f(R(e,n))}</span>`}function R(e,n){return`${e??"-"}${n===void 0?"":` (${n})`}`}function Wn(e){e.querySelectorAll(".bracket-stage").forEach(n=>{const r=n.querySelector(".bracket-connectors");if(!r)return;const t=Hn(n.dataset.connections),o=n.getBoundingClientRect();r.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),r.replaceChildren(...t.flatMap(a=>{const i=n.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),s=n.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!i||!s)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",rn(Y(i,o),Y(s,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function Hn(e){if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}function Y(e,n){const r=e.getBoundingClientRect();return{left:r.left-n.left,top:r.top-n.top,width:r.width,height:r.height}}function Dn(e){return`
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
                <b>${Se(n.goalDifference)}</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function Pn(e){return`
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
                          <td>${Se(t.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function In(e,n){return`
    <div class="results-grid">
      ${Object.entries(e).map(([r,t])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${r}</h3>
              </div>
              <div class="results-list">
                ${t.map(o=>xn(o,n[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function xn(e,n){const r=e.played?e.homeScore:n==null?void 0:n.homeScore,t=e.played?e.awayScore:n==null?void 0:n.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
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
      ${e.played?"":`<p class="fixture-time">${f(L({...e,venue:void 0}))}</p>`}
    </article>
  `}function On(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function Se(e){return e>0?`+${e}`:String(e)}function f(e){return e.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}const ve=document.querySelector("#app");if(!ve)throw new Error("App root element was not found");Mn(ve);
