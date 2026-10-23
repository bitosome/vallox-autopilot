import {LitElement,html,svg,css,nothing} from 'lit';
import {styles} from './styles';

const definitions = {
 home:{label:'Home humidity',start:'home_start',full:'home_full',unit:'%',min:30,max:95,step:1,lo:20,hi:100,reading:'home_humidity'},
 shower:{label:'Shower humidity',start:'shower_start',full:'shower_full',unit:'%',min:30,max:99,step:1,lo:20,hi:100,reading:'shower_humidity'},
 excess:{label:'Shower rise',start:'shower_delta_start',full:'shower_delta_full',unit:'points',min:1,max:40,step:1,lo:0,hi:40,reading:'excess'},
 co2:{label:'CO₂',start:'co2_start',full:'co2_full',unit:'ppm',min:500,max:3000,step:50,lo:400,hi:2000,reading:'co2'},
} as const;
type CurveKey=keyof typeof definitions;
export class ResponseCurves extends LitElement {
 static properties={settings:{attribute:false},readings:{attribute:false},limits:{attribute:false},busy:{type:Boolean},winter:{type:Boolean},inhibited:{type:Boolean},selected:{state:true},draft:{state:true},error:{state:true}};
 settings:Record<string,number>={};readings:Record<string,number|null>={};limits:Record<string,{min:number;max:number;step:number}>={};busy=false;winter=false;inhibited=false;selected:CurveKey='home';draft:Record<string,number>={};error='';
 static styles=[styles,css`
 :host{display:block}.curve-panel{padding:16px}.curve-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;font-size:14px;font-weight:650}.curve-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.curve-tabs button{flex:1 1 auto;padding:6px 10px;min-height:44px;font-size:12px}.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin:8px 0}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:18px;border-top:3px solid var(--primary-color)}.legend .away{border-top:3px dashed var(--muted)}svg{display:block;width:100%;height:auto;overflow:visible}svg text{font:11px inherit;fill:var(--muted)}.grid{stroke:var(--divider-color,#8883);stroke-width:1}.line{fill:none;stroke-width:3;stroke-linejoin:round}.home{stroke:var(--primary-color)}.away{stroke:var(--muted);stroke-dasharray:6 4}.marker{stroke:var(--primary-text-color);stroke-width:1;stroke-dasharray:3 4}.curve-setting{display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center;margin-top:16px;font-size:13px}.curve-setting input[type=range]{grid-column:1/-1;width:100%;min-height:44px;accent-color:var(--primary-color);margin:0}.curve-setting input[type=number]{width:88px;min-height:44px;padding:8px;border-radius:10px;border:1px solid var(--divider-color,#8883);background:var(--surface)}.hint{padding:0;margin-top:12px}.live{font-size:12px;color:var(--muted)}
 `];
 private setting(key:string){return this.draft[key]??this.settings[key]}
 private bounds(key:string,other:number,isStart:boolean){const l=this.limits[key];return l?{min:Math.max(l.min,isStart?l.min:other+l.step),max:Math.min(l.max,isStart?other-l.step:l.max),step:l.step}:undefined}
 private commit(key:string,input:HTMLInputElement,min:number,max:number){const v=Number(input.value);if(!input.value||!Number.isFinite(v)||v<min||v>max){this.error='Keep boost start below full boost.';this.draft={};return}this.error='';this.draft={};this.dispatchEvent(new CustomEvent('setting-change',{detail:{key,value:v},bubbles:true,composed:true}))}
 private control(key:string,label:string,other:number,isStart:boolean,unit:string){const b=this.bounds(key,other,isStart);if(!b)return nothing;const n=this.setting(key);return html`<label class="curve-setting"><span>${label} · ${unit}</span><input type="number" aria-label=${label} .value=${String(n)} min=${b.min} max=${b.max} step=${b.step} ?disabled=${this.busy} @change=${(e:Event)=>this.commit(key,e.target as HTMLInputElement,b.min,b.max)}><input type="range" aria-label=${`${label} slider`} .value=${String(n)} min=${b.min} max=${b.max} step=${b.step} ?disabled=${this.busy} @input=${(e:Event)=>{this.draft={...this.draft,[key]:Number((e.target as HTMLInputElement).value)}}} @change=${(e:Event)=>this.commit(key,e.target as HTMLInputElement,b.min,b.max)}></label>`}
 protected render(){const d=definitions[this.selected],start=this.setting(d.start),full=this.setting(d.full),home=this.settings.home_speed,away=this.settings.away_speed,boost=this.settings.boost_speed;
 if(![start,full,home,away,boost].every(Number.isFinite))return nothing;
 const winterShift=this.winter&&(this.selected==='home'||this.selected==='shower')?this.settings.winter_rh_reduction??0:0;
 const a=start-winterShift,b=full-winterShift,lo=Math.min(d.lo,a),hi=Math.max(d.hi,b),x=(n:number)=>40+(n-lo)/(hi-lo)*288,y=(n:number)=>174-n*1.38;
 const path=(base:number)=>`${x(lo)},${y(base)} ${x(a)},${y(base)} ${x(b)},${y(boost)} ${x(hi)},${y(boost)}`;
 const reading=this.selected==='excess'?(typeof this.readings.shower_humidity==='number'&&typeof this.readings.home_humidity==='number'?this.readings.shower_humidity-this.readings.home_humidity:null):this.readings[d.reading];
 const xNow=typeof reading==='number'?x(Math.max(lo,Math.min(hi,reading))):null;
 return html`<section class="surface curve-panel"><div class="curve-title">Fan speed curves <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon></div><div class="curve-tabs">${Object.entries(definitions).map(([key,v])=>html`<button class=${`pill ${this.selected===key?'active':''}`} aria-pressed=${this.selected===key} @click=${()=>{this.selected=key as CurveKey;this.draft={};this.error=''}}>${v.label}</button>`)}</div><div class="legend"><span><i></i>Home ${home}%</span><span><i class="away"></i>Away ${away}%</span><span>Maximum ${boost}%</span></div>
 <svg viewBox="0 0 348 210" role="img" aria-label=${`${d.label} requested speed: Home ${home}%, Away ${away}%, rises from ${a} to ${b} ${d.unit}, maximum ${boost}%`}>
 <text x="40" y="15">Requested fan speed (%)</text>
 ${[0,50,100].map(n=>svg`<line class="grid" x1="40" y1=${y(n)} x2="328" y2=${y(n)}></line><text x="30" y=${y(n)+4} text-anchor="end">${n}</text>`)}
 <polyline class="line away" points=${path(away)}></polyline><polyline class="line home" points=${path(home)}></polyline>
 ${[a,b].map(n=>svg`<circle cx=${x(n)} cy=${y(n===a?home:boost)} r="4" fill="var(--primary-color)"></circle>`)}
 ${xNow!==null?svg`<line class="marker" x1=${xNow} y1="30" x2=${xNow} y2="174"></line>`:nothing}
 <text x="40" y="195">${lo}</text><text x="184" y="195" text-anchor="middle">${d.label} (${d.unit})</text><text x="328" y="195" text-anchor="end">${hi}</text>
 </svg>
 ${typeof reading==='number'?html`<div class="live">Current reading: ${Math.round(reading*10)/10} ${d.unit}</div>`:nothing}
 ${this.control(d.start,'Boost starts',full,true,d.unit)}${this.control(d.full,'Full boost',start,false,d.unit)}
 ${this.error?html`<p role="alert">${this.error}</p>`:nothing}
 <p class="hint">The highest demand wins. Speed changes gradually; these curves show the target, not the measured fan speed.</p>
 ${winterShift?html`<p class="hint">Winter shifts this curve ${winterShift} points earlier. The controls edit the normal thresholds.</p>`:nothing}
 ${this.selected==='excess'?html`<p class="hint">Shower humidity minus the dry-house average. This and the shower humidity curve work together.</p>`:nothing}
 ${this.inhibited&&this.selected!=='co2'?html`<p class="hint">Humidity demand is currently paused by sauna monitoring. The curve remains editable.</p>`:nothing}
 </section>`
 }
}
customElements.define('vallox-response-curves',ResponseCurves);
