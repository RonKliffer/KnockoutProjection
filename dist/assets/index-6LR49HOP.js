(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();const v=["A","B","C","D","E","F","G","H","I","J","K","L"],q=["1A","1B","1D","1E","1G","1I","1K","1L"],b=[[73,"Runner-up Group A","Runner-up Group B"],[74,"Winner Group E","3rd Group A/B/C/D/F"],[75,"Winner Group F","Runner-up Group C"],[76,"Winner Group C","Runner-up Group F"],[77,"Winner Group I","3rd Group C/D/F/G/H"],[78,"Runner-up Group E","Runner-up Group I"],[79,"Winner Group A","3rd Group C/E/F/H/I"],[80,"Winner Group L","3rd Group E/H/I/J/K"],[81,"Winner Group D","3rd Group B/E/F/I/J"],[82,"Winner Group G","3rd Group A/E/H/I/J"],[83,"Runner-up Group K","Runner-up Group L"],[84,"Winner Group H","Runner-up Group J"],[85,"Winner Group B","3rd Group E/F/G/I/J"],[86,"Winner Group J","Runner-up Group H"],[87,"Winner Group K","3rd Group D/E/I/J/L"],[88,"Runner-up Group D","Runner-up Group G"]],j=[[89,"Round of 16","Winner Match 73","Winner Match 75"],[90,"Round of 16","Winner Match 74","Winner Match 77"],[91,"Round of 16","Winner Match 76","Winner Match 78"],[92,"Round of 16","Winner Match 79","Winner Match 80"],[93,"Round of 16","Winner Match 83","Winner Match 84"],[94,"Round of 16","Winner Match 81","Winner Match 82"],[95,"Round of 16","Winner Match 86","Winner Match 88"],[96,"Round of 16","Winner Match 85","Winner Match 87"],[97,"Quarterfinals","Winner Match 89","Winner Match 90"],[98,"Quarterfinals","Winner Match 93","Winner Match 94"],[99,"Quarterfinals","Winner Match 91","Winner Match 92"],[100,"Quarterfinals","Winner Match 95","Winner Match 96"],[101,"Semifinals","Winner Match 97","Winner Match 98"],[102,"Semifinals","Winner Match 99","Winner Match 100"],[103,"Third place","Loser Match 101","Loser Match 102"],[104,"Final","Winner Match 101","Winner Match 102"]];function M(e){return new DOMParser().parseFromString(e,"text/html")}function I(e){const n={};for(const t of v){const r=g(e,`Group ${t}`),o=r?S(r):null;if(!o)throw new Error(`Could not find standings table for Group ${t}`);const a=Array.from(o.querySelectorAll("tbody tr")).filter(i=>i.querySelector("td"));if(n[t]=a.map(i=>U(i,t)).filter(Boolean),n[t].length<4)throw new Error(`Group ${t} standings table did not contain four teams`)}return n}function P(e){const n={};for(const t of v){const r=g(e,`Group ${t}`);if(!r)throw new Error(`Could not find match list for Group ${t}`);const o=[];let a=r.nextElementSibling;for(;a&&!a.matches(".mw-heading");){if(a.matches(".footballbox")){const i=K(a,t,o.length);i&&o.push(i)}a=a.nextElementSibling}n[t]=o}return n}function x(e){const n=g(e,"Ranking of third-placed teams"),t=n?S(n):null;if(!t)throw new Error("Could not find ranking of third-placed teams table");return Array.from(t.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map((r,o)=>{var p;const a=G(r),i=a[0]&&/^\d+$/.test(a[0])?0:-1,s=u(a[0+i])||o+1,c=(p=(a[1+i]||"").match(/[A-L]/))==null?void 0:p[0],d=w(a[2+i]||`Third place Group ${c??"?"}`);if(!c)throw new Error("Third-place ranking table has a row without a group letter");return{rank:s,group:c,team:d,played:u(a[3+i]),wins:u(a[4+i]),draws:u(a[5+i]),losses:u(a[6+i]),goalsFor:u(a[7+i]),goalsAgainst:u(a[8+i]),goalDifference:R(a[9+i]),points:u(a[10+i]),qualified:s<=8}})}function O(e){const n=g(e,"Combinations of matches in the round of 32"),t=n?S(n):null;if(!t)throw new Error("Could not find third-place combination table");return Array.from(t.querySelectorAll("tbody tr")).filter(r=>r.querySelector("td")).map(r=>{const o=G(r),a=o.filter(s=>/^[A-L]$/.test(s)).slice(0,8),i=o.filter(s=>/^3[A-L]$/.test(s)).slice(0,8);return a.length!==8||i.length!==8?null:{key:a.sort().join(""),slotAssignments:Object.fromEntries(q.map((s,c)=>[s,i[c]]))}}).filter(Boolean)}function _(e){const n=g(e,"Round of 32");if(!n)return V();const t=[];let r=n.nextElementSibling;for(;r&&!/^H2$/i.test(r.tagName);){if(/^H3$/i.test(r.tagName)){const i=m(r).split(/\s+vs\s+/i).map(Z),s=Q(r),c=s.matchNumber??z(i[0],i[1]);c&&i.length===2&&t.push({matchNumber:c,round:"Round of 32",date:s.date,time:s.time,venue:s.venue,homeSlot:i[0],awaySlot:i[1],resolvedHomeTeam:i[0],resolvedAwayTeam:i[1]})}r=r.nextElementSibling}const o=new Map(t.map(a=>[a.matchNumber,a]));return b.map(([a,i,s])=>{const c=o.get(a);return{matchNumber:a,round:"Round of 32",date:(c==null?void 0:c.date)??"",time:(c==null?void 0:c.time)??"",venue:(c==null?void 0:c.venue)??"",homeSlot:i,awaySlot:s,resolvedHomeTeam:i,resolvedAwayTeam:s}})}function B(){return j.map(([e,n,t,r])=>({matchNumber:e,round:n,date:"",time:"",venue:"",homeSlot:t,awaySlot:r,resolvedHomeTeam:t,resolvedAwayTeam:r}))}function J(e){var t;return(t=(e.body.textContent??"").match(/Updated to match\(es\) played on [^.]+\./))==null?void 0:t[0]}function U(e,n){const t=G(e);return t.length<10||!/^\d+$/.test(t[0])?null:{group:n,position:u(t[0]),team:w(t[1]),played:u(t[2]),wins:u(t[3]),draws:u(t[4]),losses:u(t[5]),goalsFor:u(t[6]),goalsAgainst:u(t[7]),goalDifference:R(t[8]),points:u(t[9]),note:t.slice(10).join(" ")}}function K(e,n,t){var c;const r=w(m(e.querySelector(".fhome [itemprop='name']")??e.querySelector(".fhome")??e)),o=w(m(e.querySelector(".faway [itemprop='name']")??e.querySelector(".faway")??e)),a=m(e.querySelector(".fscore")??e),i=a.match(/(\d+)\s*[–-]\s*(\d+)/),s=Number((c=a.match(/Match\s+(\d+)/i))==null?void 0:c[1])||void 0;return!r||!o?null:{id:`${n}-${t+1}`,group:n,matchNumber:s,date:m(e.querySelector(".fdate")??e).replace(/\s+\(.*\)$/,""),time:m(e.querySelector(".ftime")??e),venue:X(e.querySelector(".flocation")??e.querySelector(".fright")),homeTeam:r,awayTeam:o,homeScore:i?Number(i[1]):void 0,awayScore:i?Number(i[2]):void 0,played:!!i}}function g(e,n){const t=A(n);return Array.from(e.querySelectorAll(".mw-heading, h2, h3, h4")).find(r=>A(r.textContent??"").includes(t))??null}function S(e){let n=e.nextElementSibling;for(;n;){if(n.matches("table.wikitable"))return n;const t=n.querySelector("table.wikitable");if(t)return t;if(/^H[234]$/i.test(n.tagName)||n.matches(".mw-heading"))return null;n=n.nextElementSibling}return null}function Q(e){var o,a,i,s,c;const n=[];let t=e.nextElementSibling;for(;t&&!/^H[23]$/i.test(t.tagName);)n.push(m(t)),t=t.nextElementSibling;const r=n.join(" ").replace(/\s+/g," ").trim();return{matchNumber:Number((o=r.match(/Match\s+(\d+)/i))==null?void 0:o[1])||void 0,date:((a=r.match(/(?:June|July)\s+\d{1,2},\s+2026/))==null?void 0:a[0])??"",time:((i=r.match(/\d{1,2}:\d{2}\s+[ap]\.m\./i))==null?void 0:i[0])??"",venue:((c=(s=r.match(/(?:p\.m\.\s+UTC[+-]\d+\s+)(.+?)(?=$|###|Winner|Runner-up|3rd|\[)/i))==null?void 0:s[1])==null?void 0:c.trim())??""}}function z(e,n){var t;return(t=b.find(([,r,o])=>r===e&&o===n))==null?void 0:t[0]}function V(){return b.map(([e,n,t])=>({matchNumber:e,round:"Round of 32",date:"",time:"",venue:"",homeSlot:n,awaySlot:t,resolvedHomeTeam:n,resolvedAwayTeam:t}))}function G(e){return Array.from(e.querySelectorAll("th, td")).map(n=>m(n))}function w(e){return e.replace(/\[[^\]]+\]/g,"").replace(/\s+\([A-Z]\)$/g,"").replace(/\s+based on ranking$/i,"").trim()}function Z(e){return e.replace(/^Best\s+/i,"").replace(/3rd place Group/i,"3rd Group").replace(/\s+/g," ").trim()}function A(e){return e.replace(/\[edit\]/gi,"").replace(/\s+/g," ").trim().toLowerCase()}function m(e){return(e.textContent??"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function X(e){return e?m(e):""}function u(e){return Number((e??"0").replace(/[^\d-]/g,""))||0}function R(e){return Number((e??"0").replace("+","").replace("−","-").replace(/[^\d-]/g,""))||0}function k(e,n,t,r){const o=n.filter(i=>i.qualified).map(i=>i.group).sort().join(""),a=t.find(i=>i.key===o);if(!a)throw new Error(`No third-place combination found for groups ${o}`);return{roundOf32:r.map(i=>({...i,resolvedHomeTeam:E(i.homeSlot,e,n,a),resolvedAwayTeam:E(i.awaySlot,e,n,a)})),laterRounds:B(),thirdPlaceKey:o}}function E(e,n,t,r){var s,c;const o=e.match(/^Winner Group ([A-L])$/);if(o)return $(n,o[1],0)??e;const a=e.match(/^Runner-up Group ([A-L])$/);if(a)return $(n,a[1],1)??e;if(e.match(/^3rd Group ([A-L/]+)$/)){const d=Y(e),p=(s=r.slotAssignments[d])==null?void 0:s.replace("3","");return p?((c=t.find(y=>y.group===p))==null?void 0:c.team)??$(n,p,2)??e:e}return e}function Y(e){var t;switch(((t=e.match(/^3rd Group ([A-L/]+)$/))==null?void 0:t[1].replaceAll("/",""))??""){case"CEFHI":return"1A";case"EFGIJ":return"1B";case"BEFIJ":return"1D";case"ABCDF":return"1E";case"AEHIJ":return"1G";case"CDFGH":return"1I";case"DEIJL":return"1K";case"EHIJK":return"1L";default:throw new Error(`Unexpected third-place slot: ${e}`)}}function $(e,n,t){var r,o;return(o=(r=e[n])==null?void 0:r[t])==null?void 0:o.team}function ee(e,n,t){const r={};for(const o of v){const a=new Map(e[o].map((s,c)=>[s.team,c])),i=new Map(e[o].map((s,c)=>[s.team,L(o,s.team,c+1,s.note)]));for(const s of n[o]){const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:t[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||D(i,s,c.homeScore,c.awayScore)}r[o]=ne(Array.from(i.values()),n[o],t,a).map((s,c)=>({...s,position:c+1}))}return r}function ne(e,n,t,r){const o=new Map;for(const a of e)o.set(a.points,[...o.get(a.points)??[],a]);return Array.from(o.entries()).sort(([a],[i])=>i-a).flatMap(([,a])=>F(a,n,t,r))}function F(e,n,t,r){if(e.length<2)return e;const o=new Set(e.map(s=>s.team)),a=new Map(e.map(s=>[s.team,L(s.group,s.team,s.position,s.note)]));for(const s of n){if(!o.has(s.homeTeam)||!o.has(s.awayTeam))continue;const c=s.played?{homeScore:s.homeScore,awayScore:s.awayScore}:t[s.id];(c==null?void 0:c.homeScore)===void 0||c.awayScore===void 0||D(a,s,c.homeScore,c.awayScore)}const i=[...e].sort((s,c)=>N(s,c,a));return te(i,a).flatMap(s=>s.length===e.length?s.sort((c,d)=>oe(c,d,r)):F(s,n,t,r))}function te(e,n){const t=[];for(const r of e){const o=t[t.length-1],a=o==null?void 0:o[o.length-1];!a||N(r,a,n)!==0?t.push([r]):o.push(r)}return t}function re(e,n){const t=new Map(n.map(r=>[r.group,r.rank]));return v.map(r=>e[r][2]).sort((r,o)=>ae(r,o,t)).map((r,o)=>({rank:o+1,group:r.group,team:r.team,played:r.played,wins:r.wins,draws:r.draws,losses:r.losses,goalsFor:r.goalsFor,goalsAgainst:r.goalsAgainst,goalDifference:r.goalDifference,points:r.points,qualified:o<8}))}function L(e,n,t,r){return{group:e,position:t,team:n,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,goalDifference:0,points:0,note:r}}function D(e,n,t,r){const o=e.get(n.homeTeam),a=e.get(n.awayTeam);!o||!a||(o.played+=1,a.played+=1,o.goalsFor+=t,o.goalsAgainst+=r,a.goalsFor+=r,a.goalsAgainst+=t,o.goalDifference=o.goalsFor-o.goalsAgainst,a.goalDifference=a.goalsFor-a.goalsAgainst,t>r?(o.wins+=1,a.losses+=1,o.points+=3):r>t?(a.wins+=1,o.losses+=1,a.points+=3):(o.draws+=1,a.draws+=1,o.points+=1,a.points+=1))}function N(e,n,t){const r=t.get(e.team),o=t.get(n.team);return((o==null?void 0:o.points)??0)-((r==null?void 0:r.points)??0)||((o==null?void 0:o.goalDifference)??0)-((r==null?void 0:r.goalDifference)??0)||((o==null?void 0:o.goalsFor)??0)-((r==null?void 0:r.goalsFor)??0)}function oe(e,n,t){return n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(t.get(e.team)??99)-(t.get(n.team)??99)}function ae(e,n,t){return n.points-e.points||n.goalDifference-e.goalDifference||n.goalsFor-e.goalsFor||(t.get(e.group)??99)-(t.get(n.group)??99)}const ie="https://en.wikipedia.org/w/api.php";async function T(e){var a,i;const n=new URLSearchParams({action:"parse",page:e,prop:"text",format:"json",origin:"*"}),t=await fetch(`${ie}?${n.toString()}`);if(!t.ok)throw new Error(`Wikipedia request failed for ${e}: ${t.status}`);const r=await t.json();if(r.error)throw new Error(r.error.info??`Wikipedia returned an error for ${e}`);const o=(i=(a=r.parse)==null?void 0:a.text)==null?void 0:i["*"];if(!o)throw new Error(`Wikipedia response for ${e} did not include page HTML`);return o}const se=300*1e3;function ce(e){const n={loading:!0,stale:!1,userResults:{}},t=async()=>{n.loading=!0,n.error=void 0,h(e,n,t);try{n.data=await le(),n.stale=!1}catch(r){n.error=r instanceof Error?r.message:"Unable to load tournament data",n.stale=!!n.data}finally{n.loading=!1,h(e,n,t)}};h(e,n,t),t(),window.setInterval(t,se)}async function le(){const[e,n]=await Promise.all([T("2026_FIFA_World_Cup"),T("2026_FIFA_World_Cup_knockout_stage")]),t=M(e),r=M(n),o=I(t),a=P(t),i=x(t),s=O(r),c=_(r);return{groups:o,groupMatches:a,knockoutCombinations:s,roundOf32:c,thirdPlaceRanking:i,projection:k(o,i,s,c),fetchedAt:new Date,sourceUpdatedText:J(t)}}function h(e,n,t){var o,a;const r=n.data?ue(n.data,n.userResults):void 0;e.innerHTML=`
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
          <p class="timestamp">${ge(n)}</p>
        </div>
      </header>

      ${n.error?`<section class="notice ${n.stale?"warning":"error"}">${l(n.error)}</section>`:""}
      ${n.loading&&!n.data?'<section class="notice">Loading live Wikipedia data...</section>':""}

      ${r?`
        <section class="page-stack">
          <section class="bracket-panel">
          <div class="section-heading">
            <h2>Projected bracket</h2>
            <p>Third-place groups: ${r.projection.thirdPlaceKey.split("").join(", ")}</p>
          </div>
          ${de(r.projection.roundOf32,r.projection.laterRounds)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${l(r.sourceUpdatedText??"Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${pe(r)}
            ${fe(r.groups)}
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
          ${me(r.groupMatches,n.userResults)}
        </section>
        </section>
      `:""}
    </main>
  `,(o=e.querySelector(".refresh-button"))==null||o.addEventListener("click",t),(a=e.querySelector(".clear-all-button"))==null||a.addEventListener("click",()=>{n.userResults={},h(e,n,t)}),e.querySelectorAll(".clear-group-button").forEach(i=>{i.addEventListener("click",()=>{var d;const s=i.dataset.group,c=s&&((d=n.data)!=null&&d.groupMatches[s])?n.data.groupMatches[s]:[];for(const p of c)delete n.userResults[p.id];h(e,n,t)})}),e.querySelectorAll(".score-input").forEach(i=>{i.addEventListener("input",()=>{var y;const s=i.dataset.matchId,c=i.dataset.side;if(!s||!c)return;const d={...n.userResults[s]??{}},p=i.value===""?void 0:Number(i.value);d[c]=Number.isFinite(p)&&p!==void 0?p:void 0,d.homeScore===void 0&&d.awayScore===void 0?delete n.userResults[s]:n.userResults[s]=d,h(e,n,t),(y=e.querySelector(`.score-input[data-match-id="${s}"][data-side="${c}"]`))==null||y.focus()})})}function ue(e,n){const t=ee(e.groups,e.groupMatches,n),r=re(t,e.thirdPlaceRanking);return{...e,groups:t,thirdPlaceRanking:r,projection:k(t,r,e.knockoutCombinations,e.roundOf32)}}function de(e,n){const t=new Map([...e,...n].map(i=>[i.matchNumber,i])),r=[["Round of 32",f(t,[73,74,75,76,77,78,79,80])],["Round of 16",f(t,[89,90,91,92])],["Quarterfinals",f(t,[97,99])],["Semifinal",f(t,[101])]],o=[["Semifinal",f(t,[102])],["Quarterfinals",f(t,[98,100])],["Round of 16",f(t,[93,94,95,96])],["Round of 32",f(t,[81,82,83,84,85,86,87,88])]],a=f(t,[104,103]);return`
    <div class="bracket-scroll">
      <div class="bracket-stage">
        <div class="bracket-half bracket-half-left">
          ${r.map(([i,s],c)=>W(i,s,c+1,"left")).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${a.map(i=>H(i,"center")).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${o.map(([i,s],c)=>W(i,s,4-c,"right")).join("")}
        </div>
      </div>
    </div>
  `}function W(e,n,t,r){return`
    <section class="round-column round-depth-${t} ${r==="right"?"round-mirrored":""}">
      <h3>${e}</h3>
      <div class="match-list">
        ${n.map(o=>H(o,r)).join("")}
      </div>
    </section>
  `}function H(e,n="left"){const t=[e.date,e.time,e.venue].filter(Boolean).join(" · ");return`
    <article class="match-card ${n==="center"?"center-match":n==="left"?"flows-right":"flows-left"}">
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
      ${t?`<p class="venue">${l(t)}</p>`:""}
    </article>
  `}function f(e,n){return n.map(t=>e.get(t)).filter(Boolean)}function pe(e){return`
    <section class="third-place-block">
      <h3>Third-place ranking</h3>
      <div class="third-place-list">
        ${e.thirdPlaceRanking.map(n=>`
              <div class="third-row ${n.qualified?"qualified":""}">
                <span>${n.rank}</span>
                <strong>${l(n.team)}</strong>
                <small>Group ${n.group}</small>
                <b>${n.points} pts</b>
              </div>
            `).join("")}
      </div>
    </section>
  `}function fe(e){return`
    <div class="groups-grid">
      ${Object.entries(e).map(([n,t])=>`
            <section class="group-card">
              <h3>Group ${n}</h3>
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
                  ${t.map(r=>`
                        <tr>
                          <td>${r.position}</td>
                          <td>${l(r.team)}</td>
                          <td>${r.points}</td>
                          <td>${ye(r.goalDifference)}</td>
                        </tr>
                      `).join("")}
                </tbody>
              </table>
            </section>
          `).join("")}
    </div>
  `}function me(e,n){return`
    <div class="results-grid">
      ${Object.entries(e).map(([t,r])=>`
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${t}</h3>
                <button class="clear-button clear-group-button" type="button" data-group="${t}">Clear</button>
              </div>
              <div class="results-list">
                ${r.map(o=>he(o,n[o.id])).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `}function he(e,n){const t=e.played?e.homeScore:n==null?void 0:n.homeScore,r=e.played?e.awayScore:n==null?void 0:n.awayScore,o=e.matchNumber?`Match ${e.matchNumber}`:e.played?"Played":"Scheduled";return`
    <article class="result-card ${e.played?"played":"editable"}">
      <div class="result-meta">
        <span>${o}</span>
        <span>${e.played?"FT":"Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${l(e.homeTeam)}</span>
        ${e.played?`<strong class="result-score">${t??"-"}-${r??"-"}</strong>`:`
              <div class="score-editor" aria-label="${l(e.homeTeam)} vs ${l(e.awayTeam)} prediction">
                <input class="score-input" data-match-id="${e.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${t??""}" aria-label="${l(e.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${e.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${r??""}" aria-label="${l(e.awayTeam)} score" />
              </div>
            `}
        <span class="result-team away">${l(e.awayTeam)}</span>
      </div>
      ${e.played?"":`<p class="fixture-time">${l([e.date,e.time].filter(Boolean).join(" · "))}</p>`}
    </article>
  `}function ge(e){return e.loading&&!e.data?"Fetching live data":e.data?`${e.stale?"Showing cached data from":"Last updated"} ${e.data.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"No data loaded"}function ye(e){return e>0?`+${e}`:String(e)}function l(e){return e.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}const C=document.querySelector("#app");if(!C)throw new Error("App root element was not found");ce(C);
