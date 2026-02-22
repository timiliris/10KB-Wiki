(function(){
var D=JSON.parse(document.getElementById("w").textContent),P=D.pages,$=s=>document.getElementById(s),tE=$("t"),LR=/^(\s*)([-*+]|\d+\.)\s/;
function md(s){
var l=s.replace(/\r\n/g,"\n").split("\n"),o="",i=0,L,m;
while(i<l.length){L=l[i];
if(!L.trim()){i++;continue}
m=L.match(/^```(\w*)/);
if(m){var g=m[1],c=[];i++;while(i<l.length&&!/^```\s*$/.test(l[i]))c.push(esc(l[i++]));i++;o+="<pre><code"+(g?' class="language-'+g+'"':"")+">"+c.join("\n")+"</code></pre>";continue}
m=L.match(/^(#{1,6})\s+(.+)/);
if(m){o+="<h"+m[1].length+">"+inl(m[2])+"</h"+m[1].length+">";i++;continue}
if(/^(\*{3,}|-{3,}|_{3,})\s*$/.test(L)){o+="<hr>";i++;continue}
if(L[0]==">"){var b=[];while(i<l.length&&l[i][0]==">")b.push(l[i++].replace(/^>\s?/,""));o+="<blockquote>"+md(b.join("\n"))+"</blockquote>";continue}
if(i+1<l.length&&L[0]=="|"&&/^\|[\s\-:|]+\|/.test(l[i+1])){
var h=tr(L),r=[];i+=2;while(i<l.length&&l[i][0]=="|")r.push(tr(l[i++]));
o+="<table><thead><tr>"+h.map(v=>"<th>"+inl(v)+"</th>").join("")+"</tr></thead><tbody>";
r.forEach(v=>{o+="<tr>"+v.map(c=>"<td>"+inl(c)+"</td>").join("")+"</tr>"});o+="</tbody></table>";continue}
if(LR.test(L)){o+=pL(l,i,n=>{i=n});continue}
var p=[];while(i<l.length&&l[i].trim()&&!/^(#{1,6}\s|```|>\s?|\||\s*[-*+]\s|\s*\d+\.\s|(\*{3,}|-{3,}|_{3,})\s*$)/.test(l[i]))p.push(l[i++]);
o+="<p>"+inl(p.join(" "))+"</p>";}return o;}
function pL(l,i,cb){
var f=l[i].match(LR),bi=f[1].length,tg=/\d/.test(f[2])?"ol":"ul",o="<"+tg+">",m;
while(i<l.length){m=l[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)/);
if(!m||m[1].length<bi)break;
if(m[1].length>bi){o+=pL(l,i,n=>{i=n});continue}
o+="<li>"+inl(m[3]);i++;
if(i<l.length&&l[i]){var n=l[i].match(LR);if(n&&n[1].length>bi)o+=pL(l,i,n=>{i=n})}
o+="</li>";}o+="</"+tg+">";cb(i);return o;}
function tr(l){return l.replace(/^\|/,"").replace(/\|$/,"").split("|").map(c=>c.trim())}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function inl(s){s=esc(s);
s=s.replace(/`([^`]+)`/g,"<code>$1</code>");
s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1">');
s=s.replace(/\[\[([^\]]+)\]\]/g,(_,n)=>'<a href="#'+n.toLowerCase().replace(/\s+/g,"-")+'">'+n+"</a>");
s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
s=s.replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>");
s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
s=s.replace(/__(.+?)__/g,"<strong>$1</strong>");
s=s.replace(/\*(.+?)\*/g,"<em>$1</em>");
s=s.replace(/_(.+?)_/g,"<em>$1</em>");
s=s.replace(/~~(.+?)~~/g,"<del>$1</del>");return s;}
function bT(n){var h="";(n.children||[]).forEach(c=>{
if(c.children)h+='<li><span class="fl open" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">'+c.name+'</span><ul class="fc open">'+bT(c)+"</ul></li>";
else h+='<li><a href="#'+c.path+'" data-p="'+c.path+'">'+c.name+"</a></li>"});return h;}
tE.innerHTML="<ul>"+bT(D.tree)+"</ul>";
var gp=()=>decodeURIComponent(location.hash.replace(/^#/,"")||"index");
function render(){var p=gp(),s=P[p]||P[p.replace(/\.md$/,"")]||P[p+".md"];
if(!s){$("c").innerHTML="<h1>Not found</h1><p><code>"+esc(p)+"</code></p>";hl(p);return}
$("c").innerHTML=md(s);hl(p);scrollTo(0,0);$("s").classList.remove("open");}
function hl(p){var a=tE.querySelectorAll("a"),j=a.length;while(j--)a[j].classList.toggle("active",a[j].dataset.p===p)}
$("q").oninput=function(){
var q=this.value.toLowerCase(),a=tE.querySelectorAll("a"),j=a.length;
while(j--)a[j].parentNode.style.display=a[j].textContent.toLowerCase().indexOf(q)>=0?"":"none";
var f=tE.querySelectorAll(".fc"),k=f.length;
while(k--){var v=f[k].querySelector("li:not([style*='display: none'])");
f[k].parentNode.style.display=v?"":"none";
if(q&&v){f[k].classList.add("open");f[k].previousElementSibling.classList.add("open")}}};
$("mb").onclick=()=>$("s").classList.add("open");
$("sx").onclick=()=>$("s").classList.remove("open");
onhashchange=render;render();
})();
