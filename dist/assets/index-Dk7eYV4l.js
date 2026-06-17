(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const y=["A","B","C","D","E","F","G","H","I","J","K","L"],B=["1A","1B","1D","1E","1G","1I","1K","1L"],v=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],O=[[89,"Round of 16","Winner Match 73","Winner Match 75"],[90,"Round of 16","Winner Match 74","Winner Match 77"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function G(e){return new DOMParser().parseFromString(e,"text/html")}function _(e){const t={};for(const n of y){const r=g(e,`Group ${n}`),o=r?S(r):null;if(!o)throw new Error(`Could not find standings table for Group ${n}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(i=>i.querySelector("td"));if(t[n]=a.map(i=>V(i,n)).filter(Boolean),t[n].length<4)throw new Error(`Group ${n} standings table did not contain four teams`)}return t}function J(e){const t={};for(const n of y){const r=g(e,`Group ${n}`);if(!r)throw new Error(`Could not find match list for Group ${n}`);const o=[];let a=r.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const i=Y(a,n,o.length);i&&o.push(i)}a=a.nextElementSibling}t[n]=o}return t}function U(e){const t=g(e,"Ranking of third-placed teams"),n=t?S(t):null;if(!n)throw new Error("Could not find ranking of third-placed teams table");return Array.from(n.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map((r,o)=>{var p;const a=M(r),i=a[0]&&/^\d+$/.test(a[0])?0:-1,s=u(a[0+i])||o+1,c=(p=(a[1+i]||"").match(/[A-L]/))==null?void 0:p[0],d=b(a[2+i]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:s,group:c,team:d,played:u(a[3+i]),wins:u(a[4+i]),draws:u(a[5+i]),losses:u(a[6+i]),goalsFor:u(a[7+i]),goalsAgainst:u(a[8+i]),goalDifference:L(a[9+i]),points:u(a[10+i]),qualified:s<=8}})}function K(e){const t=g(e,"Combinations of matches in the round of 32"),n=t?S(t):null;if(!n)throw new Error("Could not find third-place combination table");return Array.from(n.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map(r=>{const o=M(r),a=o.filter(s=>/^[A-L]$/.test(s)).slice(0,8),i=o.filter(s=>/^3[A-L]$/.test(s)).slice(0,8);return a.length!==8||i.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(B.map((s,c)=>[s,i[c]]))}}).filter(Boolean)}function Q(e){const t=g(e,"Round of 32");if(!t)return te();const n=[];let r=t.nextElementSibling;for(;r&&!/^H2$/i.test(r.tagName);){if(/^H3$/i.test(r.tagName)){const i=f(r).split(/\s+vs\s+/i).map(ne),s=Z(r),c=s.matchNumber??ee(i[0],i[1]);c&&i.length===2&&n.push({matchNumber:c,round:"Round of 32",date:s.date,time:s.time,venue:s.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:i[0],resolvedAwayTeam:i[1]})}r=r.nextElementSibling}const o=new Map(n.map(a=>[a.matchNumber,a]));return v.map(([a,i,s])=>{const c=o.get(a);return{matchNumber:a,round:"Round of 32",date:(c==null?void 0:c.date)??"",time:(c==null?void 0:c.time)??"",venue:(c==null?void 0:c.venue)??"",homeSlot:i,awaySlot:s,resolvedHomeTeam:i,resolvedAwayTeam:s}})}function X(){return O.map(([e,t,n,r])=>({matchNumber:e,round:t,date:"",time:"",venue:"",homeSlot:n,awaySlot:r,resolvedHomeTeam:n,resolvedAwayTeam:r}))}function z(e){var n;return(n=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:n[0]}function V(e,t){const n=M(e);return n.length<10||!/^\d+$/.test(n[0])?null:{group:t,position:u(n[0]),team:b(n[1]),played:u(n[2]),wins:u(n[3]),draws:u(n[4]),losses:u(n[5]),goalsFor:u(n[6]),goalsAgainst:u(n[7]),goalDifference:L(n[8]),points:u(n[9]),note:n.slice(10).join(" ")}}function Y(e,t,n){var c;const r=b(f(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=b(f(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=f(e.querySelector(".fscore")??e),i=a.match(/(\d+)\s*[–-]\s*(\d+)/),s=Number((c=a.match(/Match\s+(\d+)/i))==null?void 0:c[1])||void 0;return!r||!o?null:{id:`${t}-${n+1}`,group:t,matchNumber:s,date:f(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),time:f(e.querySelector(".ftime")??e),venue:re(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:r,awayTeam:o,homeScore:i?Number(i[1]):void 0,awayScore:i?Number(i[2]):void 0,played:!!i}}function g(e,t){const n=A(t);return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(r=>A(r.textContent??"").includes(n))??null}function S(e){let t=e.nextElementSibling;for(;t;){if(t.matches("table.wikitable"))return t;const n=t.querySelector("table.wikitable");if(n)return n;if(/^H[234]$/i.test(t.tagName)||t.matches(".mw-heading"))return null;t=t.nextElementSibling}return null}function Z(e){var o,a,i,s,c;const t=[];let n=e.nextElementSibling;for(;n&&!/^H[23]$/i.test(n.tagName);)t.push(f(n)),n=n.nextElementSibling;const r=t.join(" ").replace(/\s+/g," ").trim();return{matchNumber:Number((o=r.match(/Match\s+(\d+)/i))==null?void 0:o[1])||void 0,date:((a=r.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:a[0])??"",time:((i=r.match(/\d{1,2}:\d{2}\s+[ap]\.m\./i))==null?void 0:i[0])??"",venue:((c=(s=r.match(/(?:p\.m\.\s+UTC[+-]\d+\s+)(.+?)(?=$|###|Winner|Runner-up|3rd|\[)/i))==null?void 0:s[1])==null?void 0:c.trim())??""}}function ee(e,t){var n;return(n=v.find(([,r,o])=>r===e&&o===t))==null?void 0:n[0]}function te(){return v.map(([e,t,n])=>({matchNumber:e,round:"Round of 32",date:"",time:"",venue:"",homeSlot:t,awaySlot:n,resolvedHomeTeam:t,resolvedAwayTeam:n}))}function M(e){return Array.from(e.querySelectorAll("th, td")).map(t=>f(t))}function b(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z]\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function ne(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function A(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function f(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function re(e){return e?f(e):""}function u(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function L(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}const oe=101,ae=102,ie=[104,103],se=["Semifinal","Quarterfinals","Round of 16","Round of 32"];function ce(e,t){const n=new Map([...e,...t].map(s=>[s.matchNumber,s])),r=E(n,oe).reverse(),o=E(n,ae),a=de(n,ie),i=t.flatMap(s=>R(s).map(c=>({fromMatchNumber:c,toMatchNumber:s.matchNumber})));return{leftRounds:r,rightRounds:o,finals:a,connections:i}}function le(e,t){const n=e.left+e.width/2,r=t.left+t.width/2,o=n<r,a=o?e.left+e.width:e.left,i=e.top+e.height/2,s=o?t.left:t.left+t.width,c=t.top+t.height/2,d=a+(s-a)/2;return`M ${h(a)} ${h(i)} H ${h(d)} V ${h(c)} H ${h(s)}`}function E(e,t){return F(e,t).map((n,r)=>{var o;return{label:se[r]??((o=n[0])==null?void 0:o.round)??"",matches:n}})}function F(e,t,n=0,r=[]){const o=e.get(t);if(!o)return r;r[n]=[...r[n]??[],o];for(const a of R(o))F(e,a,n+1,r);return r}function R(e){return[e.homeSlot,e.awaySlot].map(ue).filter(Boolean)}function ue(e){var t;return Number((t=e.match(/^Winner Match (\d+)$/))==null?void 0:t[1])}function de(e,t){return t.map(n=>e.get(n)).filter(Boolean)}function h(e){return Number.isInteger(e)?String(e):e.toFixed(2)}function C(e,t,n,r){const o=t.filter(i=>i.qualified).map(i=>i.group).sort().join(""),a=n.find(i=>i.key===o);if(!a)throw new Error(`No third-place combination found for groups ${o}`);return{roundOf32:r.map(i=>({...i,resolvedHomeTeam:k(i.homeSlot,e,t,a),resolvedAwayTeam:k(i.awaySlot,e,t,a)})),laterRounds:X(),thirdPlaceKey:o}}function k(e,t,n,r){var s,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return $(t,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return $(t,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const d=pe(e),p=(s=r.slotAssignments[d])==null?void 0:s.replace("3","");return p?((c=n.find(w=>w.group===p))==null?void 0:c.team)??$(t,p,2)??e:e}return e}function pe(e){var n;switch(((n=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:n[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function $(e,t,n){var r,o;return(o=(r=e[t])==null?void 0:r[n])==null?void 0:o.team}function fe(e,t,n){const r={};for(const o of y){const a=new Map(e[o].map((s,c)=>[s.team,c])),i=new Map(e[o].map((s,c)=>[s.team,q(o,s.team,c+1,s.note)]));for(const s of t[o]){const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:n[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||D(i,s,c.homeScore,c.awayScore)}r[o]=me(Array.from(i.values()),t[o],n,a).map((s,c)=>({...s,position:c+1}))}return r}function me(e,t,n,r){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[i])=>i-a).flatMap(([,a])=>H(a,t,n,r))}function H(e,t,n,r){if(e.length<2)return e;const o=new Set(e.map(s=>s.team)),a=new Map(e.map(s=>[s.team,q(s.group,s.team,s.position,s.note)]));for(const s of t){if(!o.has(s.homeTeam)||!o.has(s.awayTeam))continue;const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:n[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||D(a,s,c.homeScore,c.awayScore)}const i=[...e].sort((s,c)=>I(s,c,a));return he(i,a).flatMap(s=>s.length===e.length?s.sort((c,d)=>we(c,d,r)):H(s,t,n,r))}function he(e,t){const n=[];for(const r of e){const o=n[n.length-1],a=o==null?void 0:o[o.length-1];!a||I(r,a,t)!==0?n.push([r]):o.push(r)}return n}function ge(e,t){const n=new Map(t.map(r=>[r.group,r.rank]));return y.map(r=>e[r][2]).sort((r,o)=>be(r,o,n)).map((r,o)=>({rank:o+1,group:r.group,team:r.team,played:r.played,wins:r.wins,draws:r.draws,losses:r.losses,goalsFor:r.goalsFor,goalsAgainst:r.goalsAgainst,goalDifference:r.goalDifference,points:r.points,qualified:o<8}))}function q(e,t,n,r){return{group:e,position:n,team:t,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:r}}function D(e,t,n,r){const o=e.get(t.homeTeam),a=e.get(t.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=n,o.goalsAgainst+=r,a.goalsFor+=r,a.goalsAgainst+=n,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,n>r?(o.wins+=1,a.losses+=1,o.points+=3):r>n?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function I(e,t,n){const r=n.get(e.team),o=n.get(t.team);return((o==null?void 0:o.points)??0)-((r==null?void 0:r.points)??0)||((o==null?void 0:o.goalDifference)??0)-((r==null?void 0:r.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((r==null?void 0:r.goalsFor)??0)}function we(e,t,n){return t.goalDifference-e.goalDifference||t.goalsFor-e.goalsFor||(n.get(e.team)??99)-(n.get(t.team)??99)}function be(e,t,n){return t.points-e.points||t.goalDifference-e.goalDifference||t.goalsFor-e.goalsFor||(n.get(e.group)??99)-(n.get(t.group)??99)}const ye="https://en.wikipedia.org/w/api.php";async function N(e){var a,i;const t=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),n=await fetch(`${ye}?${t.toString()}`);if(!n.ok)throw new Error(`Wikipedia request failed for ${e}: ${n.status}`);const r=await n.json();if(r.error)throw new Error(r.error.info??`Wikipedia returned an error for ${e}`);const o=(i=(a=r.parse)==null?void 0:a.text)==null?void 0:i["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const $e=300*1e3;function ve(e){const t={loading:!0,stale:!1,userResults:{}};window.addEventListener("resize",()=>j(e));const n=async()=>{t.loading=!0,t.error=void 0,m(e,t,n);try{t.data=await Se(),t.stale=!1}catch(r){t.error=r instanceof Error?r.message:"Unable to load tournament data",t.stale=!!t.data}finally{t.loading=!1,m(e,t,n)}};m(e,t,n),n(),window.setInterval(n,$e)}async function Se(){const[e,t]=await Promise.all([N("2026_FIFA_World_Cup"),N("2026_FIFA_World_Cup_knockout_stage")]),n=G(e),r=G(t),o=_(n),a=J(n),i=U(n),s=K(r),c=Q(r);return{groups:o,groupMatches:a,knockoutCombinations:s,roundOf32:c,thirdPlaceRanking:i,projection:C(o,i,s,c),fetchedAt:new Date,sourceUpdatedText:z(n)}}function m(e,t,n){var o,a;const r=t.data?Me(t.data,t.userResults):void 0;e.innerHTML=`
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
          <p class="timestamp">${Le(t)}</p>
        </div>
      </header>

      ${t.error?`<section class="notice ${t.stale?"warning":"error"}">${l(t.error)}</section>`:""}
      ${t.loading&&!t.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

      ${r?`
        <section class="page-stack">
          <section class="bracket-panel">
          <div class="section-heading">
            <h2>Projected bracket</h2>
            <p>Third-place groups: ${r.projection.thirdPlaceKey.split("").join(", ")}</p>
          </div>
          ${Ge(r.projection.roundOf32,r.projection.laterRounds)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${l(r.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${ke(r)}
            ${Ne(r.groups)}
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
          ${Te(r.groupMatches,t.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,j(e),(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",n),(a=e.querySelector(".clear-all-button"))==null||a.addEventListener("click",()=>{t.userResults={},m(e,t,n)}),e.querySelectorAll(".clear-group-button").forEach(i=>{i.addEventListener("click",()=>{var d;const s=i.dataset.group,c=s&&((d=t.data)!=null&&d.groupMatches[s])?t.data.groupMatches[s]:[];for(const p of c)delete t.userResults[p.id];m(e,t,n)})}),e.querySelectorAll(".score-input").forEach(i=>{i.addEventListener("input",()=>{var w;const s=i.dataset.matchId,c=i.dataset.side;if(!s||!c)return;const d={...t.userResults[s]??{}},p=i.value===""?void 0:Number(i.value);d[c]=Number.isFinite(p)&&p!==void 0?p:void 0,d.homeScore===void 0&&d.awayScore===void 0?delete t.userResults[s]:t.userResults[s]=d,m(e,t,n),(w=e.querySelector(`.score-input[data-match-id="${s}"][data-side="${c}"]`))==null||w.focus()})})}function j(e){window.requestAnimationFrame(()=>Ae(e))}function Me(e,t){const n=fe(e.groups,e.groupMatches,t),r=ge(n,e.thirdPlaceRanking);return{...e,groups:n,thirdPlaceRanking:r,projection:C(n,r,e.knockoutCombinations,e.roundOf32)}}function Ge(e,t){const{leftRounds:n,rightRounds:r,finals:o,connections:a}=ce(e,t);return`
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${l(JSON.stringify(a))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${n.map((i,s)=>T(i.label,i.matches,s+1,"left")).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${o.map(i=>P(i,"center")).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${r.map((i,s)=>T(i.label,i.matches,4-s,"right")).join("")}
        </div>
      </div>
    </div>
  `}function T(e,t,n,r){return`
    <section class="round-column round-depth-${n} ${r==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${t.map(o=>P(o,r)).join("")}
      </div>
    </section>
  `}function P(e,t="left"){const n=[e.date,e.time,e.venue].filter(Boolean).join(" · ");return`
    <article class="match-card ${t==="center"?"center-match":t==="left"?"flows-right":"flows-left"}" data-match-number="${e.matchNumber}">
      <div class="match-meta">
        <span>Match ${e.matchNumber}</span>
        <span>${l(e.round)}</span>
      </div>
      <div class="team-row">
        <strong>${l(e.resolvedHomeTeam)}</strong>
        <small>${l(e.homeSlot)}</small>
      </div>
      <div class="team-row">
        <strong>${l(e.resolvedAwayTeam)}</strong>
        <small>${l(e.awaySlot)}</small>
      </div>
      ${n?`<p class="venue">${l(n)}</p>`:""}
    </article>
  `}function Ae(e){e.querySelectorAll(".bracket-stage").forEach(t=>{const n=t.querySelector(".bracket-connectors");if(!n)return;const r=Ee(t.dataset.connections),o=t.getBoundingClientRect();n.setAttribute("viewBox",`0 0 ${o.width} ${o.height}`),n.replaceChildren(...r.flatMap(a=>{const i=t.querySelector(`.match-card[data-match-number="${a.fromMatchNumber}"]`),s=t.querySelector(`.match-card[data-match-number="${a.toMatchNumber}"]`);if(!i||!s)return[];const c=document.createElementNS("http://www.w3.org/2000/svg","path");return c.setAttribute("d",le(W(i,o),W(s,o))),c.dataset.fromMatch=String(a.fromMatchNumber),c.dataset.toMatch=String(a.toMatchNumber),[c]}))})}function Ee(e){if(!e)return[];try{const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function W(e,t){const n=e.getBoundingClientRect();return{left:n.left-t.left,top:n.top-t.top,width:n.width,height:n.height}}function ke(e){return`
    <section class="third-place-block">
      <h3>Third-place ranking</h3>
      <div class="third-place-list">
        ${e.thirdPlaceRanking.map(t=>`
              <div class="third-row ${t.qualified?"qualified":""}">
                <span>${t.rank}</span>
                <strong>${l(t.team)}</strong>
                <small>Group ${t.group}</small>
                <b>${t.points} pts</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function Ne(e){return`
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
                          <td>${l(r.team)}</td>
                          <td>${r.points}</td>
                          <td>${Fe(r.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function Te(e,t){return`
    <div class="results-grid">
      ${Object.entries(e).map(([n,r])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${n}</h3>
                <button class="clear-button clear-group-button" type="button" data-group="${n}">Clear</button>
              </div>
              <div class="results-list">
                ${r.map(o=>We(o,t[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function We(e,t){const n=e.played?e.homeScore:t==null?void 0:t.homeScore,r=e.played?e.awayScore:t==null?void 0:t.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${l(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${n??"-"}-${r??"-"}</strong>`:`
              <div class="score-editor" aria-label="${l(e.homeTeam)} vs ${l(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${n??""}" aria-label="${l(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${r??""}" aria-label="${l(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${l(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${l([e.date,e.time].filter(Boolean).join(" · "))}</p>`}
    </article>
  `}function Le(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function Fe(e){return e>0?`+${e}`:String(e)}function l(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const x=document.querySelector("#app");if(!x)throw new Error("App root element was not found");ve(x);
