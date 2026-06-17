(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const w=["A","B","C","D","E","F","G","H","I","J","K","L"],Y=["1A","1B","1D","1E","1G","1I","1K","1L"],$=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],Z=[[89,"Round of 16","Winner Match 73","Winner Match 75"],[90,"Round of 16","Winner Match 74","Winner Match 77"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function G(e){return new DOMParser().parseFromString(e,"text/html")}function ee(e){const t={};for(const n of w){const r=y(e,`Group ${n}`),o=r?k(r):null;if(!o)throw new Error(`Could not find standings table for Group ${n}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(s=>s.querySelector("td"));if(t[n]=a.map(s=>se(s,n)).filter(Boolean),t[n].length<4)throw new Error(`Group ${n} standings table did not contain four teams`)}return t}function te(e){const t={};for(const n of w){const r=y(e,`Group ${n}`);if(!r)throw new Error(`Could not find match list for Group ${n}`);const o=[];let a=r.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const s=ce(a,n,o.length);s&&o.push(s)}a=a.nextElementSibling}t[n]=o}return t}function ne(e){const t=y(e,"Ranking of third-placed teams"),n=t?k(t):null;if(!n)throw new Error("Could not find ranking of third-placed teams table");return Array.from(n.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map((r,o)=>{var l;const a=A(r),s=a[0]&&/^\d+$/.test(a[0])?0:-1,i=f(a[0+s])||o+1,c=(l=(a[1+s]||"").match(/[A-L]/))==null?void 0:l[0],u=b(a[2+s]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:i,group:c,team:u,played:f(a[3+s]),wins:f(a[4+s]),draws:f(a[5+s]),losses:f(a[6+s]),goalsFor:f(a[7+s]),goalsAgainst:f(a[8+s]),goalDifference:I(a[9+s]),points:f(a[10+s]),qualified:i<=8}})}function re(e){const t=y(e,"Combinations of matches in the round of 32"),n=t?k(t):null;if(!n)throw new Error("Could not find third-place combination table");return Array.from(n.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map(r=>{const o=A(r),a=o.filter(i=>/^[A-L]$/.test(i)).slice(0,8),s=o.filter(i=>/^3[A-L]$/.test(i)).slice(0,8);return a.length!==8||s.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(Y.map((i,c)=>[i,s[c]]))}}).filter(Boolean)}function oe(e){const t=R(e),n=y(e,"Round of 32");if(!n)return pe(t);const r=[];let o=n.nextElementSibling;for(;o&&!/^H2$/i.test(o.tagName);){if(/^H3$/i.test(o.tagName)){const i=p(o).split(/\s+vs\s+/i).map(me),c=D(o),u=c.matchNumber??le(i[0],i[1]);u&&i.length===2&&r.push({matchNumber:u,round:"Round of 32",date:c.date,time:c.time,kickoffAt:c.kickoffAt,venue:c.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:i[0],resolvedAwayTeam:i[1]})}o=o.nextElementSibling}const a=new Map(r.map(s=>[s.matchNumber,s]));return $.map(([s,i,c])=>{const u=a.get(s)??t.get(s);return{matchNumber:s,round:"Round of 32",date:(u==null?void 0:u.date)??"",time:(u==null?void 0:u.time)??"",kickoffAt:u==null?void 0:u.kickoffAt,venue:(u==null?void 0:u.venue)??"",homeSlot:i,awaySlot:c,resolvedHomeTeam:i,resolvedAwayTeam:c}})}function C(e=new Map){return Z.map(([t,n,r,o])=>({...H(e.get(t)),matchNumber:t,round:n,homeSlot:r,awaySlot:o,resolvedHomeTeam:r,resolvedAwayTeam:o}))}function ae(e){return C(R(e))}function M(e,t){const n=e.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i),r=t.replace(/\u2212/g,"-").match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);if(!n||!r)return;const o=he(n[1]),a=Number(n[2]),s=Number(n[3]);let i=Number(r[1]);const c=Number(r[2]),u=r[3].toLowerCase(),l=Number(r[4]),m=Number(r[5]??"0");if(o===void 0)return;u==="p"&&i!==12?i+=12:u==="a"&&i===12&&(i=0);const Q=l<0?-1:1,X=l*60+Q*m;return new Date(Date.UTC(s,o,a,i,c)-X*60*1e3).toISOString()}function ie(e){var n;return(n=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:n[0]}function se(e,t){const n=A(e);return n.length<10||!/^\d+$/.test(n[0])?null:{group:t,position:f(n[0]),team:b(n[1]),played:f(n[2]),wins:f(n[3]),draws:f(n[4]),losses:f(n[5]),goalsFor:f(n[6]),goalsAgainst:f(n[7]),goalDifference:I(n[8]),points:f(n[9]),note:n.slice(10).join(" ")}}function ce(e,t,n){var l;const r=b(p(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=b(p(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=p(e.querySelector(".fscore")??e),s=a.match(/(\d+)\s*[–-]\s*(\d+)/),i=Number((l=a.match(/Match\s+(\d+)/i))==null?void 0:l[1])||void 0;if(!r||!o)return null;const c=p(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),u=p(e.querySelector(".ftime")??e);return{id:`${t}-${n+1}`,group:t,matchNumber:i,date:c,time:u,kickoffAt:M(c,u),venue:N(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:r,awayTeam:o,homeScore:s?Number(s[1]):void 0,awayScore:s?Number(s[2]):void 0,played:!!s}}function y(e,t){const n=T(t);return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(r=>T(r.textContent??"").includes(n))??null}function k(e){let t=e.nextElementSibling;for(;t;){if(t.matches("table.wikitable"))return t;const n=t.querySelector("table.wikitable");if(n)return n;if(/^H[234]$/i.test(t.tagName)||t.matches(".mw-heading"))return null;t=t.nextElementSibling}return null}function R(e){const t=new Map;for(const n of Array.from(e.querySelectorAll(".footballbox")).map(ue).filter(r=>!!r.matchNumber))t.set(n.matchNumber,n);for(const n of Array.from(e.querySelectorAll("h3, .mw-heading")).filter(r=>/\s+vs\s+/i.test(p(r))).map(r=>D(r)).filter(r=>!!r.matchNumber))t.has(n.matchNumber)||t.set(n.matchNumber,n);return t}function ue(e){var o;const t=p(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),n=p(e.querySelector(".ftime")??e),r=p(e.querySelector(".fscore")??e);return{matchNumber:Number((o=r.match(/Match\s+(\d+)/i))==null?void 0:o[1])||void 0,date:t,time:n,kickoffAt:M(t,n),venue:N(e.querySelector(".flocation")??e.querySelector(".fright"))}}function D(e){var u,l;const t=[];let n="",r="",o="",a=e.nextElementSibling;for(;a&&!/^H[23]$/i.test(a.tagName)&&!a.matches(".mw-heading");)a.matches(".footballbox")&&(n||(n=p(a.querySelector(".fdate")??a).replace(/\s+\(.*\)$/,"")),r||(r=p(a.querySelector(".ftime")??a)),o||(o=N(a.querySelector(".flocation")??a.querySelector(".fright")))),/^STYLE$/i.test(a.tagName)||t.push(p(a)),a=a.nextElementSibling;const s=t.join(" ").replace(/\s+/g," ").trim(),i=n||((u=s.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:u[0])||"",c=r||((l=s.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i))==null?void 0:l[0])||"";return{matchNumber:de(e,s),date:i,time:c,kickoffAt:M(i,c),venue:o||fe(t)}}function le(e,t){var n;return(n=$.find(([,r,o])=>r===e&&o===t))==null?void 0:n[0]}function de(e,t){const n=new Set(v(p(e)));return v(t).find(r=>!n.has(r))??v(t)[0]}function v(e){return Array.from(e.matchAll(/Match\s+(\d+)/gi)).map(t=>Number(t[1]))}function fe(e){return e.find(t=>t&&!/(?:June|July)\s+\d{1,2},\s+2026/i.test(t)&&!/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(t)&&!/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(t)&&!/Match\s+\d+/i.test(t)&&!/[\{\}]/.test(t)&&!/\[edit\]/i.test(t))??""}function pe(e=new Map){return $.map(([t,n,r])=>({...H(e.get(t)),matchNumber:t,round:"Round of 32",homeSlot:n,awaySlot:r,resolvedHomeTeam:n,resolvedAwayTeam:r}))}function H(e){return{date:(e==null?void 0:e.date)??"",time:(e==null?void 0:e.time)??"",kickoffAt:e==null?void 0:e.kickoffAt,venue:(e==null?void 0:e.venue)??""}}function A(e){return Array.from(e.querySelectorAll("th, td")).map(t=>p(t))}function b(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z]\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function me(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function T(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function p(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function N(e){return e?p(e):""}function f(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function I(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function he(e){return{june:5,july:6}[e.toLowerCase()]}const ge=101,ye=102,be=[104,103],we=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function ve(e,t){const n=new Map([...e,...t].map(i=>[i.matchNumber,i])),r=E(n,ge).reverse(),o=E(n,ye),a=Me(n,be),s=t.flatMap(i=>B(i).map(c=>({fromMatchNumber:c,toMatchNumber:i.matchNumber})));return{leftRounds:r,rightRounds:o,finals:a,connections:s}}function Se(e,t){const n=e.left+e.width/2,r=t.left+t.width/2,o=n<r,a=o?e.left+e.width:e.left,s=e.top+e.height/2,i=o?t.left:t.left+t.width,c=t.top+t.height/2,u=a+(i-a)/2;return`M ${g(a)} ${g(s)} H ${g(u)} V ${g(c)} H ${g(i)}`}function E(e,t){return j(e,t).map((n,r)=>{var o;return{label:we[r]??((o=n[0])==null?void 0:o.round)??"",matches:n}})}function j(e,t,n=0,r=[]){const o=e.get(t);if(!o)return r;r[n]=[...r[n]??[],o];for(const a of B(o))j(e,a,n+1,r);return r}function B(e){return[e.homeSlot,e.awaySlot].map($e).filter(Boolean)}function $e(e){var t;return Number((t=e.match(/^Winner Match (\d+)$/))==null?void 0:t[1])}function Me(e,t){return t.map(n=>e.get(n)).filter(Boolean)}function g(e){return Number.isInteger(e)?String(e):e.toFixed(2)}function O(e,t,n,r,o=C()){const a=t.filter(i=>i.qualified).map(i=>i.group).sort().join(""),s=n.find(i=>i.key===a);if(!s)throw new Error(`No third-place combination found for groups ${a}`);return{roundOf32:r.map(i=>({...i,resolvedHomeTeam:W(i.homeSlot,e,t,s),resolvedAwayTeam:W(i.awaySlot,e,t,s)})),laterRounds:o,thirdPlaceKey:a}}function W(e,t,n,r){var i,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return S(t,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return S(t,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const u=ke(e),l=(i=r.slotAssignments[u])==null?void 0:i.replace("3","");return l?((c=n.find(m=>m.group===l))==null?void 0:c.team)??S(t,l,2)??e:e}return e}function ke(e){var n;switch(((n=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:n[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function S(e,t,n){var r,o;return(o=(r=e[t])==null?void 0:r[n])==null?void 0:o.team}function Ae(e,t,n){const r={};for(const o of w){const a=new Map(e[o].map((i,c)=>[i.team,c])),s=new Map(e[o].map((i,c)=>[i.team,P(o,i.team,c+1,i.note)]));for(const i of t[o]){const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:n[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||J(s,i,c.homeScore,c.awayScore)}r[o]=Ne(Array.from(s.values()),t[o],n,a).map((i,c)=>({...i,position:c+1}))}return r}function Ne(e,t,n,r){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[s])=>s-a).flatMap(([,a])=>x(a,t,n,r))}function x(e,t,n,r){if(e.length<2)return e;const o=new Set(e.map(i=>i.team)),a=new Map(e.map(i=>[i.team,P(i.group,i.team,i.position,i.note)]));for(const i of t){if(!o.has(i.homeTeam)||!o.has(i.awayTeam))continue;const c=i.played?{homeScore:i.homeScore,awayScore:i.awayScore}:n[i.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||J(a,i,c.homeScore,c.awayScore)}const s=[...e].sort((i,c)=>U(i,c,a));return Ge(s,a).flatMap(i=>i.length===e.length?i.sort((c,u)=>Ee(c,u,r)):x(i,t,n,r))}function Ge(e,t){const n=[];for(const r of e){const o=n[n.length-1],a=o==null?void 0:o[o.length-1];!a||U(r,a,t)!==0?n.push([r]):o.push(r)}return n}function Te(e,t){const n=new Map(t.map(r=>[r.group,r.rank]));return w.map(r=>e[r][2]).sort((r,o)=>We(r,o,n)).map((r,o)=>({rank:o+1,group:r.group,team:r.team,played:r.played,wins:r.wins,draws:r.draws,losses:r.losses,goalsFor:r.goalsFor,goalsAgainst:r.goalsAgainst,goalDifference:r.goalDifference,points:r.points,qualified:o<8}))}function P(e,t,n,r){return{group:e,position:n,team:t,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:r}}function J(e,t,n,r){const o=e.get(t.homeTeam),a=e.get(t.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=n,o.goalsAgainst+=r,a.goalsFor+=r,a.goalsAgainst+=n,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,n>r?(o.wins+=1,a.losses+=1,o.points+=3):r>n?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function U(e,t,n){const r=n.get(e.team),o=n.get(t.team);return((o==null?void 0:o.points)??0)-((r==null?void 0:r.points)??0)||((o==null?void 0:o.goalDifference)??0)-((r==null?void 0:r.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((r==null?void 0:r.goalsFor)??0)}function Ee(e,t,n){return t.goalDifference-e.goalDifference||t.goalsFor-e.goalsFor||(n.get(e.team)??99)-(n.get(t.team)??99)}function We(e,t,n){return t.points-e.points||t.goalDifference-e.goalDifference||t.goalsFor-e.goalsFor||(n.get(e.group)??99)-(n.get(t.group)??99)}function _(e,t){if(!e.kickoffAt)return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const n=new Date(e.kickoffAt);if(Number.isNaN(n.getTime()))return[e.date,e.time,e.venue].filter(Boolean).join(" · ");const r={},o=new Intl.DateTimeFormat("en-US",{...r,month:"short",day:"numeric",year:"numeric"}).format(n),a=new Intl.DateTimeFormat("en-US",{...r,hour:"numeric",minute:"2-digit",hour12:!0}).format(n);return[o,a,e.venue].filter(Boolean).join(" · ")}const Le="https://en.wikipedia.org/w/api.php";async function L(e){var a,s;const t=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),n=await fetch(`${Le}?${t.toString()}`);if(!n.ok)throw new Error(`Wikipedia request failed for ${e}: ${n.status}`);const r=await n.json();if(r.error)throw new Error(r.error.info??`Wikipedia returned an error for ${e}`);const o=(s=(a=r.parse)==null?void 0:a.text)==null?void 0:s["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const Fe=300*1e3;function qe(e){const t={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>K(e));const n=async()=>{t.loading=!0,t.error=void 0,h(e,t,n);try{t.data=await Ce(),t.stale=!1}catch(r){t.error=r instanceof Error?r.message:"Unable to load tournament data",t.stale=!!t.data}finally{t.loading=!1,h(e,t,n)}};h(e,t,n),n(),window.setInterval(n,Fe)}async function Ce(){const[e,t]=await Promise.all([L("2026_FIFA_World_Cup"),L("2026_FIFA_World_Cup_knockout_stage")]),n=G(e),r=G(t),o=ee(n),a=te(n),s=ne(n),i=re(r),c=oe(r),u=ae(r);return{groups:o,groupMatches:a,knockoutCombinations:i,roundOf32:c,thirdPlaceRanking:s,projection:O(o,s,i,c,u),fetchedAt:new Date,sourceUpdatedText:ie(n)}}function h(e,t,n){var o,a;const r=t.data?Re(t.data,t.userResults):void 0;e.innerHTML=`
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">World Cup 2026</p>
          <h1>Knockout projection</h1>
        </div>
        <div class="status-panel">
          <button class="refresh-button" type="button" ${t.loading?"disabled":""}>
            <span aria-hidden="true">Refresh</span>
          </button>
          <p class="timestamp">${Pe(t)}</p>
        </div>
      </header>

      ${t.error?`<section class="notice ${t.stale?"warning":"error"}">${d(t.error)}</section>`:""}
      ${t.loading&&!t.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

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
          ${De(r.projection.roundOf32,r.projection.laterRounds)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${d(r.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${je(r)}
            ${Be(r.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
            <button class="clear-button clear-all-button" type="button">Clear all</button>
          </div>
          ${Oe(r.groupMatches,t.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,K(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",n),(a=e.querySelector(".clear-all-button"))==null||a.addEventListener("click",()=>{t.userResults={},h(e,t,n)}),e.querySelectorAll(".clear-group-button").forEach(s=>{s.addEventListener("click",()=>{var u;const i=s.dataset.group,c=i&&((u=t.data)!=null&&u.groupMatches[i])?t.data.groupMatches[i]:[];for(const l of c)delete t.userResults[l.id];h(e,t,n)})}),e.querySelectorAll(".score-input").forEach(s=>{s.addEventListener("input",()=>{var m;const i=s.dataset.matchId,c=s.dataset.side;if(!i||!c)return;const u={...t.userResults[i]??{}},l=s.value===""?void 0:Number(s.value);u[c]=Number.isFinite(l)&&l!==void 0?l:void 0,u.homeScore===void 0&&u.awayScore===void 0?delete t.userResults[i]:t.userResults[i]=u,h(e,t,n),(m=e.querySelector(`.score-input[data-match-id="${i}"][data-side="${c}"]`))==null||m.focus()})})}function K(e){window.requestAnimationFrame(()=>He(e))}function Re(e,t){const n=Ae(e.groups,e.groupMatches,t),r=Te(n,e.thirdPlaceRanking);return{...e,groups:n,thirdPlaceRanking:r,projection:O(n,r,e.knockoutCombinations,e.roundOf32,e.projection.laterRounds)}}function De(e,t){const{leftRounds:n,rightRounds:r,finals:o,connections:a}=ve(e,t);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${d(JSON.stringify(a))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${n.map((s,i)=>F(s.label,s.matches,i+1,"left")).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${o.map(s=>V(s,"center")).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${r.map((s,i)=>F(s.label,s.matches,4-i,"right")).join("")}
        </div>
      </div>
    </div>
  `}function F(e,t,n,r){return`
    <section class="round-column round-depth-${n} ${r==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${t.map(o=>V(o,r)).join("")}
      </div>
    </section>
  `}function V(e,t="left"){const n=_({...e,venue:void 0});return`
    <article class="match-card ${t==="center"?"center-match":t==="left"?"flows-right":"flows-left"}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
      </div>
      <div class="team-row">
        <strong>${d(e.resolvedHomeTeam)}</strong>
        <small>${d(e.homeSlot)}</small>
      </div>
      <div class="team-row">
        <strong>${d(e.resolvedAwayTeam)}</strong>
        <small>${d(e.awaySlot)}</small>
      </div>
      ${n?`<p class="venue">${d(n)}</p>`:""}
    </article>
  `}function He(e){e.querySelectorAll(".bracket-stage").forEach(t=>{const n=t.querySelector(".bracket-connectors");if(!n)return;const r=Ie(t.dataset.connections),o=t.getBoundingClientRect();n.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),n.replaceChildren(...r.flatMap(a=>{const s=t.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),i=t.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!s||!i)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",Se(q(s,o),q(i,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function Ie(e){if(!e)return[];try{const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function q(e,t){const n=e.getBoundingClientRect();return{left:n.left-t.left,top:n.top-t.top,width:n.width,height:n.height}}function je(e){return`
    <section class="third-place-block">
      <h3>Third-place ranking</h3>
      <div class="third-place-list">
        ${e.thirdPlaceRanking.map(t=>`
              <div class="third-row ${t.qualified?"qualified":""}">
                <span>${t.rank}</span>
                <strong>${d(t.team)}</strong>
                <small>Group ${t.group}</small>
                <b>${t.points} pts</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function Be(e){return`
    <div class="groups-grid">
      ${Object.entries(e).map(([t,n])=>`
            <section class="group-card">
              <h3>Group ${t}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>Pts</th>
                    <th>GD</th>
                  </tr>
                </thead>
                <tbody>
                  ${n.map(r=>`
                        <tr>
                          <td>${r.position}</td>
                          <td>${d(r.team)}</td>
                          <td>${r.points}</td>
                          <td>${Je(r.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function Oe(e,t){return`
    <div class="results-grid">
      ${Object.entries(e).map(([n,r])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${n}</h3>
                <button class="clear-button clear-group-button" type="button" data-group="${n}">Clear</button>
              </div>
              <div class="results-list">
                ${r.map(o=>xe(o,t[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function xe(e,t){const n=e.played?e.homeScore:t==null?void 0:t.homeScore,r=e.played?e.awayScore:t==null?void 0:t.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${d(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${n??"-"}-${r??"-"}</strong>`:`
              <div class="score-editor" aria-label="${d(e.homeTeam)} vs ${d(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${n??""}" aria-label="${d(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${r??""}" aria-label="${d(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${d(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${d(_({...e,venue:void 0}))}</p>`}
    </article>
  `}function Pe(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function Je(e){return e>0?`+${e}`:String(e)}function d(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const z=document.querySelector("#app");if(!z)throw new Error("App root element was not found");qe(z);
