import {LitElement,html,css,nothing} from 'lit';
import {styles} from './styles';

type HistoryCard=HTMLElement&{hass?:any};
type Series={entity:string;name:string};
export class VentilationHistory extends LitElement {
 static properties={hass:{attribute:false},readings:{attribute:false},selected:{state:true},hours:{state:true},chart:{state:true},error:{state:true},loading:{state:true}};
 hass:any;readings:any={};selected='speed';hours=24;chart:HistoryCard|null=null;error='';loading=false;
 private generation=0;private signature='';
 static styles=[styles,css`:host{display:block;min-width:0}.history-tools{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}.history-tools button{flex:1;font-size:12px;padding:8px}.history-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.history-heading h2{font-size:15px;margin:0}.history-heading select{min-height:44px;border:0;border-radius:12px;padding:8px;background:var(--surface)}.chart{min-width:0;--ha-card-border-width:0;--ha-card-box-shadow:none}.hint{margin-top:12px}.notice{margin-top:12px}`];
 private series():Series[]{const a=this.readings,e=a.entities??{},b=a.bindings??{};
  const groups:Record<string,[string|undefined,string][]>= {
   speed:[[b.actual_speed_entity,'Reported fan speed'],[e.desired_speed,'Controller target']],
   humidity:[[e.home_humidity,'Home'],[b.shower_humidity_entity,'Shower']],
   co2:[[b.co2_entity,'CO₂']],
   temperature:[[b.outdoor_entity,'Outside'],[b.supply_entity,'Supply air'],[b.extract_entity,'Extract air']],
  };
  return (groups[this.selected]??[]).filter(([id])=>id&&this.hass?.states[id]).map(([id,name])=>({entity:id!,name}));
 }
 protected updated(){const series=this.series(),key=JSON.stringify([this.selected,this.hours,series]);
  if(key!==this.signature){this.signature=key;void this.load(series)}
  if(this.chart)this.chart.hass=this.hass;
 }
 disconnectedCallback(){super.disconnectedCallback();this.generation++;this.signature='';this.loading=false}
 private async load(series:Series[]){const generation=++this.generation;this.chart=null;this.error='';this.loading=true;
  try{
   if(!series.length)throw Error('No configured sensors are available for this graph.');
   const load=(window as any).loadCardHelpers;
   if(!load)throw Error('Recorded graphs are available in your Home Assistant dashboard.');
   const helpers=await load();if(generation!==this.generation||!this.isConnected)return;
   const chart=helpers.createCardElement({type:'history-graph',hours_to_show:this.hours,entities:series});
   chart.hass=this.hass;this.chart=chart;
  }catch(e){if(generation===this.generation)this.error=e instanceof Error?e.message:String(e)}
  finally{if(generation===this.generation)this.loading=false}
 }
 protected render(){return html`<section aria-label="Ventilation history"><div class="history-heading"><h2>History</h2><select aria-label="History period" .value=${String(this.hours)} @change=${(e:Event)=>this.hours=Number((e.target as HTMLSelectElement).value)}>${[6,24,72].map(h=>html`<option value=${h} ?selected=${this.hours===h}>${h} hours</option>`)}</select></div><div class="history-tools">${[['speed','Fan speed'],['humidity','Humidity'],['co2','CO₂'],['temperature','Temperature']].map(([key,label])=>html`<button class=${`pill ${key===this.selected?'active':''}`} aria-pressed=${key===this.selected} @click=${()=>this.selected=key}>${label}</button>`)}</div><div class="chart">${this.chart}</div>${this.loading?html`<p role="status" class="hint">Loading recorded history…</p>`:nothing}${this.error?html`<div class="notice" role="status">${this.error}<button class="pill" @click=${()=>this.load(this.series())}>Retry</button></div>`:nothing}<p class="hint">Recorded by Home Assistant. Gaps indicate missing readings.${this.selected==='speed'?' The controller target may differ from the unit’s reported speed.':''}</p></section>`}
}
customElements.define('vallox-ventilation-history',VentilationHistory);
