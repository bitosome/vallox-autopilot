/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=t=>new a("string"==typeof t?t:t+"",void 0,i),n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",y=m.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);a?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const r=a.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const r=this.constructor;if(!1===s&&(a=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??x)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==a||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,y?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _=globalThis,k=t=>t,A=_.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,R=`<${z}>`,M=document,N=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,D="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,q=/>/g,H=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=j(1),G=j(2),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Y=new WeakMap,X=M.createTreeWalker(M,129);function J(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let a,r=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let o,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===U?"!--"===l[1]?n=O:void 0!==l[1]?n=q:void 0!==l[2]?(L.test(l[2])&&(a=RegExp("</"+l[2],"g")),n=H):void 0!==l[3]&&(n=H):n===H?">"===l[0]?(n=a??U,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?H:'"'===l[3]?F:I):n===F||n===I?n=H:n===O||n===q?n=U:(n=H,a=void 0);const h=n===H&&t[e+1].startsWith("/>")?" ":"";r+=n===U?i+R:c>=0?(s.push(o),i.slice(0,c)+C+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[J(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,r=0;const n=t.length-1,o=this.parts,[l,c]=Z(t,e);if(this.el=K.createElement(l,i),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&o.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[r++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:a,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?at:"@"===n[1]?rt:it}),s.removeAttribute(t)}else t.startsWith(E)&&(o.push({type:6,index:a}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),X.nextNode(),o.push({type:2,index:++a});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===z)o.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)o.push({type:7,index:a}),t+=E.length-1}a++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===W)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const r=T(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=Q(t,a._$AS(t,e.values),a,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);X.currentNode=s;let a=X.nextNode(),r=0,n=0,o=i[0];for(;void 0!==o;){if(r===o.index){let e;2===o.type?e=new et(a,a.nextSibling,this,t):1===o.type?e=new o.ctor(a,o.name,o.strings,this,t):6===o.type&&(e=new nt(a,this,t)),this._$AV.push(e),o=i[++n]}r!==o?.index&&(a=X.nextNode(),r++)}return X.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),T(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new K(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new et(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const a=this.strings;let r=!1;if(void 0===a)t=Q(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==W,r&&(this._$AH=t);else{const s=t;let n,o;for(t=a[0],n=0;n<a.length-1;n++)o=Q(this,s[i+n],e,n),o===W&&(o=this._$AH[n]),r||=!T(o)||o!==this._$AH[n],o===V?t=V:t!==V&&(t+=(o??"")+a[n+1]),this._$AH[n]=o}r&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class at extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class rt extends it{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===W)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=_.litHtmlPolyfillSupport;ot?.(K,et),(_.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ct=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new et(e.insertBefore(N(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=n`
  ${r("\n  :host {\n    display: block;\n    /* Chip styling variables */\n    --chip-padding: 2px 2px;\n    --chip-text-font-weight: 700;\n    --chip-text-font-size: var(--chip-font-size, 12px);\n    --chip-background-color: rgba(0,0,0,0.06);\n    --chip-border-radius: var(--ha-badge-border-radius, 999px);\n    --chip-gap: 6px;\n    --main-light-on-bg: linear-gradient(135deg,#ffcf57,#ffb200);\n    --main-light-off-bg: rgba(0,0,0,0.06);\n    --main-light-icon-on-color: #ffffff;\n    --main-light-icon-off-color: var(--secondary-text-color);\n    --switch-on-color: var(--switch-on-yellow, #ffc107);\n    --switch-smart-on-color: var(--switch-on-green, #00c853);\n    --switch-lock-unlocked-color: var(--switch-unlocked-red, #e53935);\n    --lock-spinner-color: var(--primary-text-color, #ffffff);\n    --switch-chip-bg: var(--chip-background-color, rgba(0,0,0,0.06));\n    --switch-icon-size: 28px;\n    --ac-chip-bg-off: rgba(158,158,158,0.95);\n    --ac-chip-bg-cool: #00aaff;\n    --ac-chip-bg-heat: #ff7043;\n    --ac-chip-bg-dry: #ffca28;\n    --ac-chip-bg-fan: #66bb6a;\n    --ac-chip-bg-auto: #26c6da;\n    --ac-chip-bg-default: rgba(0,0,0,0.06);\n    --ac-chip-icon-color: #ffffff;\n    --ac-chip-icon-off-color: #ffffff;\n    --ac-fan-color-off: gray;\n    --ac-fan-color-cool: #00aaff;\n    --ac-fan-color-heat: #ff7043;\n    --ac-fan-color-dry: #ffca28;\n    --ac-fan-color-fan: #66bb6a;\n    --ac-fan-color-auto: #26c6da;\n    --ac-fan-color-default: var(--paper-item-icon-color);\n    --thermostat-heating-color: #ff7043;\n    --thermostat-idle-color: #66bb6a;\n    --thermostat-off-color: gray;\n    --thermostat-pill-heating-bg: var(--state-climate-heat-color, #ff7043);\n    --thermostat-pill-heating-fg: var(--primary-background-color, #fff);\n    --thermostat-pill-idle-bg: var(--chip-background-color, rgba(0,0,0,0.06));\n    --thermostat-pill-idle-fg: var(--secondary-text-color);\n\n    /* Shared semantic status palette (single source of truth across cards) */\n    --status-on-color: #ffc107;\n    --status-active-color: #42a5f5;\n    --status-success-color: #66bb6a;\n    --status-alert-color: #e53935;\n    --status-warn-color: #ff9800;\n    --status-caution-color: #ffca28;\n    --status-cool-color: #00aaff;\n    --status-heat-color: #ff7043;\n    --status-dry-color: #ffca28;\n    --status-fan-color: #66bb6a;\n    --status-auto-color: #26c6da;\n    --status-smartplug-on-color: #ff9800;\n    --status-presence-color: #42a5f5;\n    --status-icon-on-color: #ffffff;\n\n    /* Positioning variables */\n    --tile-padding: 8px;\n    --tile-padding-large: 12px;\n    --chip-z-index: 3;\n    --tile-z-index: 2;\n    --glow-z-index: 1;\n\n    /* Tile shape control */\n    --tile-border-radius: var(--ha-card-border-radius, 12px);\n\n    /* Common gaps and spacing */\n    --small-gap: 2px;\n    --medium-gap: 6px;\n    --large-gap: 12px;\n\n    /* Shadow variables */\n    --tile-shadow-default: 0 6px 18px rgba(0,0,0,0.10);\n    --tile-shadow-hover: 0 12px 24px rgba(0,0,0,0.16);\n    --tile-shadow-active: 0 18px 40px var(--pulse-strong, rgba(0,0,0,0.18)), 0 6px 18px var(--pulse-weak, rgba(0,0,0,0.10));\n  }\n")}
`,pt={close:"mdi:close",settings:"mdi:cog-outline",details:"mdi:information-outline",history:"mdi:history",back:"mdi:arrow-left",next:"mdi:chevron-right",expand:"mdi:chevron-down",drag:"mdi:drag",add:"mdi:plus",remove:"mdi:minus",check:"mdi:check",edit:"mdi:pencil-outline",undo:"mdi:undo"};function ut(t){return B`<ha-icon .icon=${pt[t]} aria-hidden="true"></ha-icon>`}const mt=n`
  :host {
    --family-gap: 12px;
    --family-grid-gap: 8px;
    --family-surface: var(
      --ha-card-background,
      var(--card-background-color, #fff)
    );
    --family-tile: color-mix(
      in srgb,
      var(--family-surface) 96%,
      var(--primary-text-color) 4%
    );
    --family-muted: var(--secondary-text-color);
    --family-radius: var(--ha-card-border-radius, 24px);
    --family-font: var(
      --ha-font-family-body,
      var(--paper-font-body1_-_font-family, inherit)
    );
    font-family: var(--family-font);
    /* Semantic aliases: one resolution order for every card. The HA theme's
       --success/--warning/--error-color win, so user themes keep working; the
       family --status-* palette is the fallback. Card CSS uses these aliases. */
    --family-success: var(--success-color, var(--status-success-color, #66bb6a));
    --family-caution: var(--status-caution-color, #ffca28);
    --family-warning: var(--warning-color, var(--status-warn-color, #ff9800));
    --family-error: var(--error-color, var(--status-alert-color, #e53935));
    --family-active: var(--status-active-color, #42a5f5);
    /* Readable text colour for missing data; always paired with a text label. */
    --family-unavailable: var(--secondary-text-color);
  }
  .family-icon-button {
    display: inline-grid;
    place-items: center;
    min-width: 44px;
    min-height: 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    cursor: pointer;
    flex: 0 0 44px;
    touch-action: manipulation;
  }
  .family-icon-button ha-icon {
    width: 22px;
    height: 22px;
    --mdc-icon-size: 22px;
    flex: 0 0 22px;
  }
  .family-icon-button:focus-visible,
  .family-action:focus-visible,
  .family-chip:is(button):focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
  }
  .family-icon-button:disabled,
  .family-action:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .family-action[aria-busy="true"]:disabled {
    opacity: 1;
    cursor: progress;
  }
  .family-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  .family-action {
    min-width: 44px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 8px 14px;
    border: 0;
    border-radius: var(--chip-border-radius, 999px);
    background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    color: var(--primary-text-color);
    font: inherit;
    font-family: var(--family-font);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    cursor: pointer;
    touch-action: manipulation;
  }
  .family-action ha-icon {
    width: 22px;
    height: 22px;
    --mdc-icon-size: 22px;
    flex: 0 0 22px;
  }
  .family-action.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, var(--primary-background-color));
  }
  .family-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 28px;
    padding: 4px 8px;
    border-radius: var(--chip-border-radius, 999px);
    background: var(--chip-background-color);
    font: inherit;
    font-family: var(--family-font);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  button.family-chip {
    min-height: 44px;
    cursor: pointer;
  }
  .family-surface {
    position: relative;
    z-index: 1;
    background: var(--family-tile);
    border-radius: var(--tile-border-radius, 12px);
    box-shadow: var(--tile-shadow-default);
  }
  @media (hover: hover) {
    .family-icon-button:not(:disabled):hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .family-action,
    .family-icon-button {
      transition: none !important;
      animation: none !important;
    }
  }
`,ft=n`
  .family-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 8px 3px;
  }
  .family-brand {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  }
  .family-brand ha-icon {
    width: 26px;
    height: 26px;
    --mdc-icon-size: 26px;
  }
  .family-identity {
    min-width: 0;
    flex: 1;
  }
  .family-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .family-subtitle {
    margin-top: 4px;
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
`,gt=n`
  .family-metrics {
    display: grid;
    grid-template-columns: repeat(
      var(--family-metric-columns, 2),
      minmax(0, 1fr)
    );
    gap: 8px;
    align-items: stretch;
  }
  .family-metric {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    text-align: start;
    padding: 12px;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 6px;
    min-height: var(--family-metric-height, 100px);
  }
  .family-metric-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: 18px auto;
    gap: 6px 4px;
    align-items: center;
    color: var(--secondary-text-color);
  }
  .family-metric-top ha-icon {
    width: 18px;
    height: 18px;
    --mdc-icon-size: 18px;
    grid-column: 1;
    grid-row: 1;
  }
  .family-metric-top .family-metric-trailing {
    width: 16px;
    height: 16px;
    --mdc-icon-size: 16px;
    grid-column: 2;
    opacity: 0.6;
  }
  .family-metric-label {
    grid-column: 1/-1;
    grid-row: 2;
    min-width: 0;
    font-size: 11px;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  .family-metric-value {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 3px;
    font-size: clamp(22px, 6.4cqw, 28px);
    font-weight: 550;
    letter-spacing: -0.03em;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .family-metric-value small {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0;
    color: var(--secondary-text-color);
  }
  .family-metric-value.missing {
    font-size: 13px;
    line-height: 1.4;
    letter-spacing: 0;
    min-height: 28px;
    align-items: center;
  }
  @container (max-width:340px) {
    .family-metric {
      padding: 10px;
    }
  }
`,yt=n`
  .family-telemetry {
    display: grid;
    grid-template-columns: repeat(
      var(--family-telemetry-columns, 3),
      minmax(0, 1fr)
    );
    padding: 8px 0;
  }
  .family-telemetry-cell {
    min-width: 0;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    padding: 4px 12px;
    border: 0;
    border-inline-end: 1px solid
      color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    background: transparent;
    text-align: start;
    color: inherit;
    font: inherit;
  }
  .family-telemetry-cell:last-child {
    border-inline-end: 0;
  }
  .family-telemetry-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .family-telemetry-value {
    max-width: 100%;
    font-size: 13px;
    font-weight: 550;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  @container (max-width:340px) {
    .family-telemetry-cell {
      padding-inline: 10px;
    }
  }
`,vt=n`
  .family-navigation {
    display: grid;
    grid-template-columns: repeat(var(--family-nav-columns, 4), minmax(0, 1fr));
    gap: 4px;
    padding: 5px;
    background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    border-radius: var(--tile-border-radius, 12px);
    position: relative;
    z-index: 1;
  }
  .family-navigation button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 56px;
    padding: 8px 4px;
    border: 0;
    background: transparent;
    border-radius: max(0px, calc(var(--tile-border-radius, 12px) - 3px));
    font: inherit;
    font-size: 11px;
    color: var(--secondary-text-color);
    cursor: pointer;
  }
  .family-navigation button[aria-current="page"] {
    background: var(--family-surface);
    color: var(--primary-text-color);
    box-shadow: 0 2px 8px #0001;
  }
  .family-navigation button:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 1px;
  }
`,bt=n`
  .family-dialog {
    --family-safe-top: var(
      --safe-area-inset-top,
      env(safe-area-inset-top, 0px)
    );
    --family-safe-bottom: var(
      --safe-area-inset-bottom,
      env(safe-area-inset-bottom, 0px)
    );
    --family-safe-left: var(
      --safe-area-inset-left,
      env(safe-area-inset-left, 0px)
    );
    --family-safe-right: var(
      --safe-area-inset-right,
      env(safe-area-inset-right, 0px)
    );
    --family-available-height: calc(
      100vh - 24px - var(--family-safe-top) - var(--family-safe-bottom)
    );
    position: fixed;
    inset: calc(12px + var(--family-safe-top))
      calc(12px + var(--family-safe-right))
      calc(12px + var(--family-safe-bottom))
      calc(12px + var(--family-safe-left));
    margin: auto;
    padding: 0;
    box-sizing: border-box;
    width: calc(
      100vw - 24px - var(--family-safe-left) - var(--family-safe-right)
    );
    max-width: var(--family-dialog-width, 480px);
    max-height: var(--family-available-height);
    border: 1px solid var(--divider-color, #8883);
    border-radius: var(--family-radius, 24px);
    color: var(--primary-text-color);
    background: var(--family-surface);
    box-shadow: 0 24px 90px #0005;
    overflow: hidden;
    font-family: var(--family-font);
  }
  .family-dialog[open] {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .family-dialog.long {
    height: min(760px, var(--family-available-height));
  }
  .family-dialog::backdrop {
    background: #070a1480;
    backdrop-filter: blur(4px);
  }
  .family-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color, #8883);
  }
  .family-dialog-header h2,
  .family-dialog-header h3 {
    min-width: 0;
    margin: 0;
    font-size: 18px;
    font-weight: 650;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .family-dialog-body {
    min-width: 0;
    min-height: 0;
    padding: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  .family-dialog-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--divider-color, #8883);
  }
  .family-dialog-footer.equal {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
  .family-dialog-footer.equal > .family-action {
    min-width: 0;
    width: 100%;
    min-height: 48px;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .family-dialog button:focus-visible,
  .family-dialog input:focus-visible,
  .family-dialog select:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 2px;
  }
  .family-dialog input,
  .family-dialog select {
    font-size: 16px;
  }
  @supports (height: 100dvh) {
    .family-dialog {
      --family-available-height: calc(
        100dvh - 24px - var(--family-safe-top) - var(--family-safe-bottom)
      );
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .family-dialog,
    .family-dialog * {
      animation: none !important;
      transition: none !important;
    }
  }
`,xt=new WeakMap;function $t(t,e={}){if(t.open)return;xt.get(t)?.cleanup();const i=e.opener||function(t){let e=t.activeElement;for(;e&&e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:void 0}(t.ownerDocument);let s=!1;const a=e=>{const i=t.getBoundingClientRect();return e.target===t&&(e.clientX<i.left||e.clientX>i.right||e.clientY<i.top||e.clientY>i.bottom)},r=t=>{s=a(t)},n=t=>{const i=s&&a(t);s=!1,i&&e.onBackdrop?.()},o=()=>{s=!1},l=()=>{t.removeEventListener("close",c),t.removeEventListener("pointerdown",r),t.removeEventListener("pointerup",n),t.removeEventListener("pointercancel",o),xt.delete(t)},c=()=>{l(),i?.isConnected&&!i.closest("[inert]")&&i.focus({preventScroll:!0})};t.addEventListener("close",c),t.addEventListener("pointerdown",r),t.addEventListener("pointerup",n),t.addEventListener("pointercancel",o),xt.set(t,{opener:i,cleanup:l});try{t.showModal()}catch(t){throw l(),t}e.initialFocus?.focus({preventScroll:!0})}function wt(t){t&&(xt.get(t)?.cleanup(),t.open&&t.close())}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class kt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),At(t,e);return!0},St=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},Ct=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),Rt(e)}};function Et(t){void 0!==this._$AN?(St(this),this._$AM=t,Ct(this)):this._$AM=t}function zt(t,e=!1,i=0){const s=this._$AH,a=this._$AN;if(void 0!==a&&0!==a.size)if(e)if(Array.isArray(s))for(let t=i;t<s.length;t++)At(s[t],!1),St(s[t]);else null!=s&&(At(s,!1),St(s));else At(this,t)}const Rt=t=>{t.type==_t&&(t._$AP??=zt,t._$AQ??=Et)};class Mt extends kt{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),Ct(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(At(this,t),St(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}const Nt=new WeakMap,Tt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Mt{render(t){return V}update(t,[e]){const i=e!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),V}rt(t){if(void 0!==this.G)if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=Nt.get(e);void 0===i&&(i=new WeakMap,Nt.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?Nt.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class Pt{constructor(t,e={}){this.host=t,this.options=e,this.routes=[],this.focusAfterUpdate=!1,this.revision=0,this.scrollPositions=new Map,this.confirmationScroll=0,this.returnToDraft=!1,this.confirmation="",this.notice="",this.back=()=>this.canBack?this.attempt("back",()=>{const t=this.current;this.routes.pop(),this.update(t)}):this.close(),this.close=()=>this.attempt("close",()=>this.forceClose()),this.requestBack=()=>this.back(),this.requestClose=()=>this.close(),this.keepEditing=()=>{this.confirmation="",this.deferred=void 0,this.notice="",this.returnToDraft=!0,this.focusAfterUpdate=!0,this.host.requestUpdate()},this.discardAndContinue=()=>{this.deferred?.()},this.onCancel=t=>{t.preventDefault(),this.confirmation?this.keepEditing():this.close()},this.dialogRef=t=>{const e=t;this.dialog&&e!==this.dialog&&wt(this.dialog),this.dialog=e},t.addController?.(this)}get current(){return this.routes[this.routes.length-1]}get stack(){return[...this.routes]}get active(){return this.routes.length>0}get canBack(){return this.routes.length>1}get generation(){return this.revision}isCurrent(t){return this.active&&t===this.revision}configure(t){this.options=t}update(t){t&&this.dialog&&this.scrollPositions.set(t,this.dialog.querySelector(".family-dialog-body")?.scrollTop||0),this.confirmation="",this.notice="",this.deferred=void 0,this.revision++,this.focusAfterUpdate=!0,this.options.onChange?.(this.current,t),this.host.requestUpdate()}open(t,e){return this.attempt("navigate",()=>{const i=this.current;this.active||(this.opener=e),this.scrollPositions.clear(),this.routes=[t],this.update(i)})}push(t){return this.attempt("navigate",()=>{const e=this.current;this.routes.push(t),this.update(e)})}replace(t){return this.attempt("navigate",()=>{const e=this.current;this.routes.splice(Math.max(0,this.routes.length-1),1,t),this.update(e)})}forceClose(t=!0){if(!this.active)return;const e=this.current;var i;t?(i=this.dialog,i?.open&&i.close()):wt(this.dialog),this.routes=[],this.update(e),this.options.onClose?.()}handoff(t){return this.attempt("close",()=>{this.forceClose(!1),t()})}attempt(t,e){const i=this.active?this.options.guard?.(t,this.current):void 0;if(i?.pending)return this.notice=i.message||"Wait for the current request to finish.",this.host.requestUpdate(),!1;if(i?.dirty){if(!this.confirmation){const t=this.dialog?.getRootNode();this.confirmationFocus=t?.activeElement instanceof HTMLElement?t.activeElement:void 0,this.confirmationScroll=this.dialog?.querySelector(".family-dialog-body")?.scrollTop||0}return this.confirmation=i.message||"Discard unsaved changes?",this.deferred=()=>{const i=this.options.guard?.(t,this.current);if(i?.pending)return this.notice=i.message||"Wait for the current request to finish.",void this.host.requestUpdate();i?.discard?.(),e()},this.focusAfterUpdate=!0,this.host.requestUpdate(),!1}return e(),!0}hostUpdated(){if(this.dialog&&this.active&&($t(this.dialog,{opener:this.opener,onBackdrop:this.close}),this.focusAfterUpdate)){this.focusAfterUpdate=!1;const t=this.dialog.querySelector(".family-dialog-body");if(this.returnToDraft&&(this.returnToDraft=!1,t&&(t.scrollTop=this.confirmationScroll),this.confirmationFocus?.isConnected&&this.dialog.contains(this.confirmationFocus)))return void this.confirmationFocus.focus({preventScroll:!0});t&&!this.confirmation&&this.current&&(t.scrollTop=this.scrollPositions.get(this.current)||0);const e=this.dialog.querySelector("[data-family-initial-focus]");(this.confirmation?this.dialog.querySelector("[data-family-keep]"):e||this.dialog.querySelector("[data-family-heading]"))?.focus({preventScroll:!0})}}hostDisconnected(){wt(this.dialog),this.dialog=void 0,this.routes=[],this.scrollPositions.clear(),this.confirmationFocus=void 0,this.returnToDraft=!1,this.deferred=void 0,this.confirmation="",this.notice="",this.revision++}}function Dt(t,e){return t.active?B`<dialog
    class="family-dialog ${e.long?"long":""} ${e.className||""}"
    id=${e.id||V}
    style=${e.wide?"--family-dialog-width:720px":""}
    aria-label=${e.title}
    aria-describedby=${e.ariaDescribedBy||V}
    @cancel=${t.onCancel}
    ${Tt(t.dialogRef)}
  >
    <header class="family-dialog-header">
      ${t.canBack&&!t.confirmation?B`<button
            type="button"
            class="family-icon-button"
            title="Back"
            aria-label="Back"
            @click=${t.back}
          >
            ${ut("back")}
          </button>`:V}
      <h2 tabindex="-1" data-family-heading>${e.title}</h2>
      ${i=`Close ${e.title}`,s=t.close,B`<button
    type="button"
    class="family-icon-button"
    title="Close"
    aria-label=${i}
    @click=${s}
  >
    ${ut("close")}
  </button>`}
    </header>
    <div class="family-dialog-body ${e.bodyClass||""}">
      ${t.notice?B`<p class="family-notice" role="status">${t.notice}</p>`:V}
      ${t.confirmation?B`<section aria-label="Unsaved changes">
            <p>${t.confirmation}</p>
            <div class="family-actions">
              <button
                class="family-action"
                type="button"
                data-family-keep
                @click=${t.keepEditing}
              >
                Keep editing
              </button>
              <button
                class="family-action destructive"
                type="button"
                @click=${t.discardAndContinue}
              >
                Discard changes
              </button>
            </div>
          </section>`:V}
      <div ?hidden=${!!t.confirmation}>${e.content}</div>
    </div>
    ${null==e.footer||e.footer===V||!1===e.footer||t.confirmation?V:B`<footer class="family-dialog-footer ${"equal"===e.footerLayout?"equal":""}">${e.footer}</footer>`}
  </dialog>`:V;var i,s}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=t=>t??V,Ot={accent:"mdi:information-outline",success:"mdi:check-circle-outline",caution:"mdi:alert-outline",warning:"mdi:alert-outline",error:"mdi:alert-circle-outline",unavailable:"mdi:help-circle-outline"},qt=t=>t?B`<ha-icon .icon=${t} aria-hidden="true"></ha-icon>`:V;function Ht(){return B`<span class="family-pending-indicator" aria-hidden="true"></span>`}function It(t){return B`<button
    type="button"
    class="family-action ${function(t){return t.emphasis&&"secondary"!==t.emphasis?t.emphasis:[t.primary?"primary":"",t.destructive?"destructive":""].filter(Boolean).join(" ")}(t)} ${t.className||""}"
    title=${t.title||t.label}
    aria-label=${Ut(t.ariaLabel)}
    aria-haspopup=${Ut(t.hasPopup)}
    ?data-family-initial-focus=${!!t.initialFocus}
    ?disabled=${t.disabled||t.pending}
    aria-busy=${t.pending?"true":"false"}
    @click=${t.onClick}
  >
    ${t.pending?Ht():qt(t.icon)}${t.pending?t.pendingLabel||"Saving…":t.label}
  </button>`}function Ft(t){const e=t.pending?Ht():qt(t.icon);return B`<button
    type="button"
    class="family-action family-toggle ${t.className||""}"
    aria-pressed=${t.pressed?"true":"false"}
    title=${t.title||t.label}
    aria-label=${Ut(t.ariaLabel)}
    ?disabled=${t.disabled||t.pending}
    aria-busy=${t.pending?"true":"false"}
    @click=${t.onClick}
  >
    ${e}<span>${t.label}</span><ha-icon
      class="family-toggle-check"
      .icon=${pt.check}
      aria-hidden="true"
    ></ha-icon>
  </button>`}function Lt(t){const e=t.tone||"neutral",i=!1===t.icon?void 0:t.icon||Ot[e],s=[...t.action?[t.action]:[],...t.actions||[]];return B`<div
    class="family-notice ${t.className||""}"
    data-tone=${e}
    role=${t.role||("error"===e?"alert":"status")}
  >
    ${i?B`<ha-icon class="family-notice-icon" .icon=${i} aria-hidden="true"></ha-icon>`:V}<div class="family-notice-content">
      ${t.title?B`<strong class="family-notice-title">${t.title}</strong>`:V}<span class="family-notice-message">${t.message}</span>${t.body?B`<div class="family-notice-body">${t.body}</div>`:V}
    </div>${s.length?B`<div class="family-notice-actions">${s.map(t=>It(t))}</div>`:V}
  </div>`}function jt(t){return"loading"===t.state?B`<div class="family-async-state" role="status">
      ${Ht()}<span>${t.message||"Loading…"}</span>
    </div>`:"empty"===t.state?B`<div class="family-async-state" role="status">
      <span>${t.message||"Nothing to show yet"}</span>
    </div>`:Lt({tone:"error",message:t.message||"Could not load data",action:t.onRetry?{label:t.retryLabel||"Try again",icon:"mdi:refresh",onClick:t.onRetry,pending:t.retrying,pendingLabel:"Retrying…"}:void 0})}const Bt=n`
  .family-pending-indicator {
    display: inline-block;
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
    box-sizing: border-box;
    border: 2px solid color-mix(in srgb, currentColor 24%, transparent);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: family-pending-spin 800ms linear infinite;
  }
  @keyframes family-pending-spin {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .family-pending-indicator {
      animation: none;
    }
  }

  .family-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .family-action.destructive {
    color: var(--family-error, var(--error-color, var(--status-alert-color, #e53935)));
    background: color-mix(in srgb, var(--family-error, var(--error-color, var(--status-alert-color, #e53935))) 10%, transparent);
  }
  .family-action.quiet {
    background: transparent;
    color: color-mix(in srgb, var(--primary-color) 70%, var(--primary-text-color));
  }
  @media (hover: hover) {
    .family-action.quiet:not(:disabled):hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
  }
  .family-toggle[aria-pressed="true"] {
    background: color-mix(in srgb, var(--primary-color) 14%, var(--family-surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 40%, transparent);
  }
  .family-toggle[aria-pressed="true"] ha-icon {
    color: var(--primary-color);
  }
  /* The check keeps its slot when unpressed, so selecting never shifts layout. */
  .family-toggle[aria-pressed="false"] .family-toggle-check {
    visibility: hidden;
  }
  .family-chip .family-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .family-chip-text {
    display: inline-flex;
    flex-direction: column;
    min-width: 0;
  }
  .family-chip-secondary {
    color: color-mix(in srgb, var(--secondary-text-color) 70%, var(--primary-text-color));
    font-size: 12px;
    font-weight: 400;
  }
  .family-unavailable {
    color: var(--family-unavailable, var(--secondary-text-color));
  }
  .family-chip {
    border: 0;
    color: var(--primary-text-color);
  }
  .family-chip ha-icon {
    width: 18px;
    height: 18px;
    --mdc-icon-size: 18px;
    flex: 0 0 18px;
  }
  /* One resolution order for every tone: the family --family-* aliases from familyStyles. */
  [data-tone="accent"] {
    --family-tone: var(--primary-color);
  }
  [data-tone="success"] {
    --family-tone: var(--family-success, var(--success-color, var(--status-success-color, #66bb6a)));
  }
  [data-tone="caution"] {
    --family-tone: var(--family-caution, var(--status-caution-color, #ffca28));
  }
  [data-tone="warning"] {
    --family-tone: var(--family-warning, var(--warning-color, var(--status-warn-color, #ff9800)));
  }
  [data-tone="error"] {
    --family-tone: var(--family-error, var(--error-color, var(--status-alert-color, #e53935)));
  }
  [data-tone="unavailable"] {
    --family-tone: var(--family-unavailable, var(--secondary-text-color));
  }
  .family-chip[data-tone]:not([data-tone="neutral"]):not([data-tone="unavailable"]) {
    color: var(--primary-text-color);
    background: color-mix(
      in srgb,
      var(--family-tone) 14%,
      var(--family-surface)
    );
  }
  .family-chip[data-tone="unavailable"] {
    color: var(--family-unavailable, var(--secondary-text-color));
    background: transparent;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--secondary-text-color) 40%, transparent);
  }
  .family-metric-trailing[data-tone] {
    color: var(--family-tone, var(--secondary-text-color));
  }
  button.family-metric {
    font: inherit;
    color: inherit;
    border: 0;
    cursor: pointer;
  }
  button.family-metric:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
  }
  .family-notice {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: var(--tile-border-radius, 12px);
    font-size: 13px;
    line-height: 1.5;
    background: color-mix(
      in srgb,
      var(--family-tone, var(--primary-text-color)) 8%,
      var(--family-surface)
    );
  }
  .family-notice-icon {
    width: 22px;
    height: 22px;
    --mdc-icon-size: 22px;
    flex: 0 0 22px;
    align-self: flex-start;
    color: var(--family-tone, var(--secondary-text-color));
  }
  .family-notice-content {
    display: grid;
    gap: 2px;
    flex: 1 1 180px;
    min-width: 0;
  }
  .family-notice-title {
    font-weight: 600;
  }
  .family-notice-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .family-async-state {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    color: var(--secondary-text-color);
    font-size: 13px;
    line-height: 1.5;
  }
  .family-disclosure-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    width: 100%;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: start;
    font: inherit;
    cursor: pointer;
  }
  .family-disclosure-toggle > span:first-child {
    flex: 1;
  }
  .family-disclosure-toggle ha-icon {
    width: 22px;
    height: 22px;
    --mdc-icon-size: 22px;
  }
  .family-dialog-header h2 {
    flex: 1;
  }
  .family-dialog [hidden] {
    display: none !important;
  }
`;const Gt=n`
  .family-tile-group {
    isolation: isolate;
  }
  .tile-wrap,
  .family-tile-wrap {
    position: relative;
  }
  .tile-wrap .glow-under,
  .family-tile-wrap .glow-under {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    display: block;
    border-radius: var(--tile-border-radius, 12px);
  }
  .glow-under .glow-overlay {
    position: absolute;
    inset: -10px -14px -18px -14px;
    border-radius: inherit;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.9;
    -webkit-mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.25) 18px,
      rgba(0, 0, 0, 0.9) 44px,
      rgba(0, 0, 0, 1) 100%
    );
    mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.25) 18px,
      rgba(0, 0, 0, 0.9) 44px,
      rgba(0, 0, 0, 1) 100%
    );
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
  .family-tile-face {
    position: relative;
    z-index: 1;
  }
  @keyframes glowPulse {
    0%,
    100% {
      box-shadow: 0 10px 20px var(--pulse-weak);
    }
    50% {
      box-shadow: 0 28px 56px var(--pulse-strong);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .glow-under,
    .glow-overlay {
      animation: none !important;
      transition: none !important;
    }
  }
`;const Wt="Unavailable",Vt=t=>t?.locale?.language||t?.language||"en";const Yt=/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;function Xt(t){try{return t()}catch{return Wt}}const Jt=t=>"none"!==t?.locale?.number_format;function Zt(t,e,i={}){const s=function(t){if("number"==typeof t)return Number.isFinite(t)?t:void 0;if("string"!=typeof t||!Yt.test(t.trim()))return;const e=Number(t.trim());return Number.isFinite(e)?e:void 0}(e);if(void 0===s)return Wt;const a=Xt(()=>new Intl.NumberFormat(function(t){switch(t?.locale?.number_format){case"comma_decimal":case"none":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return Vt(t)}}(t),{minimumFractionDigits:i.digits??i.minimumFractionDigits,maximumFractionDigits:i.digits??i.maximumFractionDigits,signDisplay:i.signDisplay,useGrouping:Jt(t)}).format(s));return i.unit&&a!==Wt?`${a} ${i.unit}`:a}function Kt(t,e,i){const s=function(t){if(null==t||""===t)return;const e=t instanceof Date?t:new Date(t);return Number.isFinite(e.getTime())?e:void 0}(e);if(!s)return Wt;const a="hour"in i||"minute"in i?function(t){switch(t?.locale?.time_format){case"12":return!0;case"24":return!1;case"system":{const t=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hourCycle;return"h11"===t||"h12"===t}default:return}}(t):void 0,r=void 0===a?{}:{hourCycle:a?"h12":"h23"},n=e=>new Intl.DateTimeFormat(Vt(t),{...i,...r,timeZone:e}).format(s);return Xt(()=>{try{return n(function(t){const e=(new Intl.DateTimeFormat).resolvedOptions().timeZone;if("local"!==t?.locale?.time_zone||!e||"UTC"===e)return t?.config?.time_zone||void 0}(t))}catch{return n(void 0)}})}function Qt(t,e,i={}){return Kt(t,e,{day:"numeric",month:"short",...!1===i.year?{}:{year:"numeric"},...i.weekday?{weekday:"short"}:{}})}const te=[mt,ft,gt,vt,yt,bt,Bt,Gt,n`
    :host {
      color: var(--primary-text-color, #26352f);
      font-family: var(--family-font);
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: var(--tile-padding-large);
      background: var(--family-surface);
      border: 1px solid var(--divider-color, #0001);
      border-radius: var(--family-radius);
      /* Bound the halo to this dashboard card; inner tile gaps remain open. */
      overflow: clip;
      container-type: inline-size;
    }
    .root {
      isolation: isolate;
      display: grid;
      gap: var(--large-gap);
    }
    button,
    input,
    select {
      font: inherit;
      color: inherit;
    }
    button {
      cursor: pointer;
      border: 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
    button:focus-visible,
    summary:focus-visible,
    input:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 3px;
    }
    ha-icon {
      display: inline-flex;
      width: 22px;
      height: 22px;
      --mdc-icon-size: 22px;
      flex: 0 0 22px;
    }
    .identity {
      position: relative;
      min-height: 44px;
    }
    .metrics {
      --family-metric-columns: 3;
      --family-metric-height: 112px;
    }
    .metric-label {
      min-height: 2.6em;
      align-self: start;
    }
    .fan-telemetry {
      margin-top: 12px;
    }
    .telemetry {
      background: transparent;
    }
    .telemetry-label {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .telemetry.active {
      border-radius: 8px;
    }
    .temperatures {
      grid-column: 1/-1;
    }
    .mode {
      position: absolute;
      inset: 0;
      background: transparent;
      border-radius: 8px;
      padding: 0;
      min-width: 44px;
      min-height: 44px;
    }
    .modal-content,
    .settings-overview {
      display: grid;
      gap: var(--large-gap);
      min-width: 0;
    }
    .family-dialog-body {
      container-type: inline-size;
    }
    .hero {
      padding: 14px 16px;
    }
    .speed {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      margin: 0 0 10px;
    }
    .speed-values {
      min-width: 0;
      justify-self: start;
      min-height: 64px;
      padding: 0;
      text-align: left;
      background: transparent;
      border-radius: 8px;
    }
    .speed-reading {
      display: flex;
      align-items: baseline;
      gap: 3px;
    }
    .speed strong {
      font-size: 40px;
      font-weight: 550;
      line-height: 1;
      letter-spacing: -0.055em;
      font-variant-numeric: tabular-nums;
    }
    .speed strong.missing {
      font-size: clamp(20px, 7cqw, 28px);
      overflow-wrap: anywhere;
      letter-spacing: -0.02em;
    }
    .speed-reading > span {
      font-size: 19px;
      color: var(--family-muted);
    }
    .speed-caption {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 3px;
      font-size: 12px;
      color: var(--family-muted);
      line-height: 1.6;
    }
    .track {
      height: 5px;
      border-radius: 999px;
      overflow: hidden;
      background: color-mix(
        in srgb,
        var(--primary-text-color) 12%,
        transparent
      );
    }
    .track > div {
      height: 100%;
      background: var(--primary-color);
      border-radius: inherit;
      transition: width 0.3s;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
    .telemetry-label ha-icon {
      width: 13px;
      height: 13px;
      --mdc-icon-size: 13px;
      flex-basis: 13px;
    }
    .telemetry.active {
      background: color-mix(in srgb, var(--status-heat-color) 12%, transparent);
    }
    .telemetry.active .telemetry-label {
      color: var(--status-heat-color);
    }
    /* Decorative flow uses the native MDI fan and theme accent; never indicates
   automation ownership. It moves only with a valid operating reading and, when mapped, measured RPM. */
    .airflow {
      position: relative;
      width: 56px;
      height: 56px;
      pointer-events: none;
      color: var(--family-muted);
      opacity: 0.35;
      flex-shrink: 0;
    }
    .airflow.flowing {
      color: var(--primary-color);
      opacity: 1;
    }
    .airflow-fan {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }
    .airflow-fan ha-icon {
      width: 34px;
      height: 34px;
      --mdc-icon-size: 34px;
    }
    .flowing .airflow-fan ha-icon {
      animation: airflow-spin var(--airflow-duration, 8s) linear infinite;
    }
    @keyframes airflow-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .metric-top .dot {
      grid-column: 2;
      grid-row: 1;
    }
    .dot {
      height: 7px;
      width: 7px;
      border-radius: 50%;
      margin-left: auto;
      flex-shrink: 0;
      background: var(--family-muted);
    }
    .dot.green {
      background: var(--family-success);
    }
    .dot.amber {
      background: var(--family-warning);
    }
    .dot.red {
      background: var(--family-error);
    }

    .input-issues {
      padding: 0 12px;
    }
    .data-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: 44px;
      gap: 12px;
      font-size: 12px;
      background: transparent;
      text-align: left;
      padding: 7px 0;
      border-bottom: 1px solid
        color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }
    .data-row:last-child {
      border-bottom: 0;
    }
    .data-row span {
      color: var(--family-muted);
    }
    .data-row b {
      text-align: right;
      font-weight: 550;
      overflow-wrap: anywhere;
      max-width: 62%;
    }
    .hint {
      font-size: 12px;
      color: var(--family-muted);
      line-height: 1.6;
      margin: 0;
      padding: 0 8px;
    }
    .group {
      padding: 8px 16px;
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      min-height: 44px;
      padding: 11px 0;
      font-size: 13px;
      font-weight: 600;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary ha-icon {
      width: 16px;
      height: 16px;
      --mdc-icon-size: 16px;
      flex-basis: 16px;
      color: var(--family-muted);
    }
    details[open] > summary ha-icon {
      transform: rotate(180deg);
    }
    .settings-link {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr) 22px;
      align-items: center;
      gap: 12px;
      min-height: 56px;
      padding: 14px 16px;
      text-align: left;
    }
    .settings-fields {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .setting-field {
      display: grid;
      gap: 12px;
      padding: 16px;
      min-width: 0;
    }
    .setting-field > label {
      font-size: 14px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .setting-controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .setting-input-unit {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 112px;
      min-width: 0;
    }
    .setting-input-unit input {
      width: 100%;
      min-width: 64px;
      min-height: 44px;
      font-size: 16px;
      border: 1px solid var(--divider-color, #0002);
      border-radius: 10px;
      padding: 8px 12px;
      background: var(--family-surface);
    }
    .setting-input-unit small {
      color: var(--family-muted);
      flex: 0 0 auto;
    }
    .setting-field .family-action {
      flex: 0 0 auto;
    }
    .event {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      font-size: 12px;
      border-top: 1px solid var(--divider-color, #0001);
      line-height: 1.5;
    }
    .event time {
      color: var(--family-muted);
      flex-shrink: 0;
    }
    @container (max-width:340px) {
      .hero {
        padding: 12px;
      }
      .speed-caption {
        font-size: 12px;
      }
      .airflow {
        width: 48px;
        height: 48px;
      }
      .speed strong {
        font-size: 38px;
      }
      .pill {
        padding: 8px 10px;
      }
      .setting {
        flex-wrap: wrap;
        padding: 8px 0;
      }
    }
    @container (max-width:300px) {
      .metric strong {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `],ee={home:{label:"Home humidity",unit:"%",lo:20,hi:100,step:1,reading:"home_humidity"},shower:{label:"Shower humidity",unit:"%",lo:20,hi:100,step:1,reading:"shower_humidity"},excess:{label:"Shower rise",unit:"points",lo:0,hi:40,step:1,reading:"excess"},co2:{label:"CO₂",unit:"ppm",lo:400,hi:3e3,step:50,reading:"co2"}},ie=t=>t.map(t=>({...t})),se=t=>t===Wt?"family-unavailable":"";class ae extends ct{constructor(){super(...arguments),this.flowEmbedded=!1,this.settings={},this.readings={},this.curves={},this.revisions={},this.busy=!1,this.winter=!1,this.inhibited=!1,this.selected="home",this.profile="home",this.pointIndex=0,this.draft=null,this.error="",this.saving=!1,this.pendingRevision=null,this.editing=!1,this.compare=!1,this.viewport=null,this.draftRevision=0,this.drag=null}canLeave(){return!this.draft&&!this.saving&&null===this.pendingRevision&&!this.drag}navigationGuard(){return{pending:this.saving||null!==this.pendingRevision||!!this.drag,dirty:!!this.draft,message:this.saving||null!==this.pendingRevision||this.drag?"Wait for the curve edit to finish and Home Assistant to confirm it.":"Discard unsaved curve changes?",discard:()=>{this.draft=null,this.error=""}}}returnToOverview(){this.editing=!1,this.viewport=null}reading(t){const e=ee[t];return"excess"===t?"number"==typeof this.readings.shower_humidity&&"number"==typeof this.readings.home_humidity?this.readings.shower_humidity-this.readings.home_humidity:null:this.readings[e.reading]}response(t,e){if(e<=t[0].x)return t[0].y;for(let i=1;i<t.length;i++){const s=t[i-1],a=t[i];if(e<=a.x)return s.y+(a.y-s.y)*(e-s.x)/(a.x-s.x)}return t[t.length-1].y}open(t){this.select(t,this.profile),this.editing=!0,this.viewport=null,this.flowEmbedded&&this.dispatchEvent(new CustomEvent("curve-open",{detail:{title:ee[t].label},bubbles:!0,composed:!0}))}back(){this.canLeave()?(this.editing=!1,this.viewport=null):this.error="Finish this edit or reload the shared curve before leaving."}get key(){return`${this.selected}:${this.profile}`}get points(){return this.draft??this.curves[this.selected]?.[this.profile]??[]}get locked(){return this.busy||this.saving||null!==this.pendingRevision||!this.saveCurve}view(){if(this.drag)return{lo:this.drag.lo,hi:this.drag.hi};if(this.viewport)return this.viewport;const t=ee[this.selected],e=[...this.points,...this.curves[this.selected]?.["home"===this.profile?"away":"home"]??[]],i=Math.min(...e.map(t=>t.x)),s=Math.max(...e.map(t=>t.x)),a=Math.max(2*t.step,.5*(s-i));return this.viewport={lo:Math.max(t.lo,Math.floor((i-a)/t.step)*t.step),hi:Math.min(t.hi,Math.ceil((s+a)/t.step)*t.step)}}get shift(){return!this.winter||"home"!==this.selected&&"shower"!==this.selected?0:this.settings.winter_rh_reduction??0}willUpdate(t){null!==this.pendingRevision&&(this.revisions[this.key]??0)>=this.pendingRevision&&(this.draft=null,this.pendingRevision=null,this.error=""),this.pointIndex=Math.max(0,Math.min(this.pointIndex,this.points.length-1))}begin(){this.draft||(this.draft=ie(this.points),this.draftRevision=this.revisions[this.key]??0)}limits(t){const e=ee[this.selected],i=this.points;return{xmin:t?i[t-1].x+e.step:e.lo,xmax:t<i.length-1?i[t+1].x-e.step:e.hi,ymin:Math.max(this.settings[`${this.profile}_speed`],t?i[t-1].y:10),ymax:Math.min(this.settings.boost_speed,t<i.length-1?i[t+1].y:100)}}updatePoint(t,e,i){const s=ee[this.selected],a=this.limits(t);this.begin();const r=ie(this.points);r[t]={x:Math.max(a.xmin,Math.min(a.xmax,Math.round(e/s.step)*s.step)),y:Math.max(a.ymin,Math.min(a.ymax,Math.round(i)))},this.draft=r,this.error=""}async commit(){if(!this.draft||this.locked||this.drag)return;const t={curve:this.selected,profile:this.profile,points:ie(this.draft),expected_revision:this.draftRevision};if(JSON.stringify(this.draft)!==JSON.stringify(this.curves[this.selected]?.[this.profile])||(this.revisions[this.key]??0)!==this.draftRevision){this.saving=!0,this.error="";try{await this.saveCurve(t),this.pendingRevision=t.expected_revision+1,(this.revisions[this.key]??0)>=this.pendingRevision&&(this.draft=null,this.pendingRevision=null)}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.saving=!1}}else this.draft=null}select(t,e){this.locked||this.drag||(this.draft?this.error="Finish this edit or reload the shared curve before switching.":(this.selected=t,this.profile=e,this.pointIndex=0,this.error="",this.viewport=null))}down(t,e){if(this.locked||this.drag||0!==t.button)return;t.preventDefault();const i=t.currentTarget;i.focus({preventScroll:!0});const s=this.renderRoot.querySelector(".graph").getBoundingClientRect();this.pointIndex=e;const a=this.view();this.drag={id:t.pointerId,index:e,clientX:t.clientX,clientY:t.clientY,point:{...this.points[e]},before:this.draft?ie(this.draft):null,revision:this.draftRevision,width:s.width,height:s.height,lo:a.lo,hi:a.hi},this.begin(),i.setPointerCapture(t.pointerId)}move(t){const e=this.drag;e&&t.pointerId===e.id&&this.updatePoint(e.index,Math.max(e.lo,Math.min(e.hi,e.point.x+(t.clientX-e.clientX)/e.width*348/288*(e.hi-e.lo))),e.point.y-(t.clientY-e.clientY)/e.height*234/160*100)}up(t){if(this.drag?.id!==t.pointerId)return;this.drag=null;const e=t.currentTarget;e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId),this.commit()}cancel(){this.drag&&(this.draft=this.drag.before,this.draftRevision=this.drag.revision,this.drag=null)}keydown(t,e){if("Escape"===t.key)return t.preventDefault(),void this.cancel();if(this.locked||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(t.key))return;t.preventDefault(),this.pointIndex=e;const i=this.points[e],s=ee[this.selected].step;this.updatePoint(e,i.x+("ArrowRight"===t.key?s:"ArrowLeft"===t.key?-s:0),i.y+("ArrowUp"===t.key?1:"ArrowDown"===t.key?-1:0))}editField(t,e){if(this.locked)return;const i=t.target;if(!i.value||!i.checkValidity())return void(i.value=String(this.points[this.pointIndex][e]));const s=this.points[this.pointIndex];this.updatePoint(this.pointIndex,"x"===e?Number(i.value):s.x,"y"===e?Number(i.value):s.y),this.commit()}add(){if(this.locked||this.points.length>=12)return;const t=ee[this.selected].step;let e=-1,i=0;for(let s=0;s<this.points.length-1;s++){const a=this.points[s+1].x-this.points[s].x;a>=2*t&&a>i&&(e=s,i=a)}if(e<0)return void(this.error="Move points farther apart to make room for another.");this.begin();const s=ie(this.points),a=s[e],r=s[e+1],n=Math.max(a.x+t,Math.min(r.x-t,Math.round((a.x+r.x)/2/t)*t));s.splice(e+1,0,{x:n,y:a.y+(r.y-a.y)*(n-a.x)/(r.x-a.x)}),this.draft=s,this.pointIndex=e+1,this.commit()}removePoint(){this.locked||this.points.length<=2||(this.begin(),this.draft=this.points.filter((t,e)=>e!==this.pointIndex),this.pointIndex=Math.min(this.pointIndex,this.draft.length-1),this.commit())}addAt(t){if(this.locked||this.drag||this.points.length>=12||t.target.closest("button"))return;const e=t.currentTarget.getBoundingClientRect(),i=this.view(),s=ee[this.selected],a=(t.clientX-e.left)/e.width*348,r=(t.clientY-e.top)/e.height*234;if(a<34||a>322||r<30||r>190)return;const n=Math.round((i.lo+(a-34)/288*(i.hi-i.lo))/s.step)*s.step;if(n<s.lo||n>s.hi||this.points.some(t=>Math.abs(t.x-n)<s.step))return;const o=this.points.findIndex(t=>t.x>n),l=o<0?this.points.length:o,c=l?this.points[l-1].y:this.settings[`${this.profile}_speed`],d=l<this.points.length?this.points[l].y:this.settings.boost_speed;this.begin();const h=ie(this.points);h.splice(l,0,{x:n,y:Math.max(c,Math.min(d,Math.round((190-r)/1.6)))}),this.draft=h,this.pointIndex=l,this.commit()}readingText(t,e){return"number"==typeof t?`${Zt(this.hass,t,{maximumFractionDigits:1})} ${e}`:Wt}profiles(){return B`<div class="curve-profiles" aria-label="Occupancy curve">
      ${["home","away"].map(t=>Ft({label:"home"===t?"Home":"Away",icon:"home"===t?"mdi:home-outline":"mdi:home-export-outline",ariaLabel:`Edit ${t} curve`,pressed:this.profile===t,disabled:this.locked,onClick:()=>this.select(this.selected,t)}))}<span class="bounds"
        >${this.settings[`${this.profile}_speed`]}–${this.settings.boost_speed}%
        fan</span
      >
    </div>`}overview(){return B`<section class="curve-overview">
      <div class="curve-title">
        <span>Response curves</span
        ><span class="save-state">Shared · Auto-save</span>
      </div>
      ${this.profiles()}
      <div class="curve-list">
        ${Object.entries(ee).map(([t,e])=>{const i=t,s=this.curves[i]?.[this.profile]??[],a=this.reading(i),r=this.readingText(a,e.unit),n=this.inhibited&&"co2"!==i,o=this.winter&&["home","shower"].includes(i)?this.settings.winter_rh_reduction??0:0,l=s[0]?.x??0,c=s[s.length-1]?.x??1;return B`<button
            class="surface family-surface curve-summary"
            aria-label=${`Edit ${e.label} curve`}
            @click=${()=>this.open(i)}
          >
            <div class="summary-copy">
              <strong>${e.label}</strong
              ><span
                ><span class=${se(r)}>${r}</span> ·
                ${n?"Paused for sauna":s.length&&"number"==typeof a?`${Math.round(this.response(s,a+o))}% curve request`:"No response"}</span
              >
            </div>
            <svg class="spark" viewBox="0 0 100 42" aria-hidden="true">
              <polyline
                points=${s.map(t=>`${4+(t.x-l)/(c-l||1)*92},${39-.35*t.y}`).join(" ")}
              ></polyline></svg
            ><ha-icon aria-hidden="true" icon=${pt.next}></ha-icon>
          </button>`})}
      </div>
      <p class="hint">
        Choose a curve to edit. The highest demand sets the target; ramp and
        cooldown still apply.
      </p>
    </section>`}render(){const t=ee[this.selected],e=this.points;if(!this.editing)return this.overview();if(e.length<2)return B`<section class="surface family-surface curve-panel">
        <p class="hint">
          Update the Vallox Autopilot integration to enable the point editor.
        </p>
      </section>`;const i=this.view(),s=t=>34+(t-i.lo)/(i.hi-i.lo)*288,a=t=>190-1.6*t,r=t=>`${s(i.lo)},${a(t[0].y)} ${t.map(t=>`${s(t.x)},${a(t.y)}`).join(" ")} ${s(i.hi)},${a(t[t.length-1].y)}`,n=this.curves[this.selected]?.["home"===this.profile?"away":"home"],o=this.reading(this.selected),l=this.readingText(o,t.unit),c="number"==typeof o?`${Math.round(this.response(e,o+this.shift))}%`:Wt,d=e[this.pointIndex],h=this.limits(this.pointIndex);return B`<section class="surface family-surface curve-panel">
      <div class="curve-title">
        ${this.flowEmbedded?V:B`<button
              class="icon-button family-icon-button"
              aria-label="Back to response curves"
              @click=${this.back}
            >
              <ha-icon aria-hidden="true" icon=${pt.back}></ha-icon>
            </button>`}<span
          >${this.flowEmbedded?"Response curve":t.label}${this.flowEmbedded?V:B`<small>Response curve</small>`}</span
        ><button
          class="family-action quiet fit"
          @click=${()=>{this.viewport=null,this.requestUpdate()}}
        >
          Fit
        </button>
      </div>
      ${this.profiles()}
      <div class="curve-context">
        <span>Now <b class=${se(l)}>${l}</b></span
        ><span
          >${this.inhibited&&"co2"!==this.selected?"Paused for sauna":B`Curve request
                <b class=${se(c)}>${c}</b>`}</span
        >
      </div>
      <div
        class="graph"
        role="group"
        aria-label=${`${t.label}, ${this.profile} curve. Drag points or use arrow keys.`}
        @click=${this.addAt}
      >
        <svg viewBox="0 0 348 234" aria-hidden="true" focusable="false">
          <text x="34" y="15">Fan speed (%)</text>
          ${[0,25,50,75,100].map(t=>G`<line class="grid" x1="34" y1=${a(t)} x2="322" y2=${a(t)}></line><text x="26" y=${a(t)+4} text-anchor="end">${t}</text>`)}
          ${this.compare&&n?G`<polyline class="line other" points=${r(n)}></polyline>`:V}
          <polyline class="line" points=${r(e)}></polyline>
          ${"number"==typeof o&&o+this.shift>=i.lo&&o+this.shift<=i.hi?G`<line class="marker" x1=${s(o+this.shift)} x2=${s(o+this.shift)} y1="30" y2="190"></line>`:V}
          ${[0,.25,.5,.75,1].map(t=>{const e=i.lo+(i.hi-i.lo)*t;return G`<line class="grid" x1=${s(e)} x2=${s(e)} y1="30" y2="190"></line><text x=${s(e)} y="213" text-anchor="middle">${Math.round(e)}</text>`})}
          <text x="178" y="232" text-anchor="middle">
            ${t.label} (${t.unit})
          </text>
        </svg>
        ${e.map((e,i)=>B`<button
              class=${"point "+(i===this.pointIndex?"selected":"")}
              style=${`left:${s(e.x)/348*100}%;top:${a(e.y)/234*100}%`}
              aria-label=${`Point ${i+1}: ${Math.round(10*e.x)/10} ${t.unit}, ${Math.round(10*e.y)/10}% fan`}
              aria-pressed=${i===this.pointIndex}
              ?disabled=${this.locked}
              @click=${t=>{t.stopPropagation(),this.pointIndex=i}}
              @pointerdown=${t=>this.down(t,i)}
              @pointermove=${this.move}
              @pointerup=${this.up}
              @pointercancel=${this.cancel}
              @lostpointercapture=${this.cancel}
              @keydown=${t=>this.keydown(t,i)}
              @keyup=${t=>{t.key.startsWith("Arrow")&&this.commit()}}
            ></button>`)}
      </div>
      <div class="graph-footer">
        <span>Drag a point · Tap the graph to add</span
        ><label
          ><input
            type="checkbox"
            .checked=${this.compare}
            @change=${t=>this.compare=t.target.checked}
          />Compare ${"home"===this.profile?"Away":"Home"}</label
        >
      </div>
      <div class="point-strip" aria-label="Select point">
        ${e.map((e,i)=>B`<button
              class="family-action family-toggle"
              aria-label=${`Select point ${i+1}`}
              aria-pressed=${this.pointIndex===i}
              @click=${()=>this.pointIndex=i}
            >
              ${e.x}${"%"===t.unit?"%":""}<span
                >→ ${Math.round(e.y)}%</span
              >
            </button>`)}
      </div>
      <div class="live">Selected point ${this.pointIndex+1}</div>
      <div class="point-fields">
        <label
          >${t.label} · ${t.unit}<input
            type="number"
            aria-label="Point input"
            .value=${String(d.x)}
            min=${h.xmin}
            max=${h.xmax}
            step=${t.step}
            ?disabled=${this.locked}
            @focus=${()=>this.begin()}
            @blur=${()=>this.commit()}
            @change=${t=>this.editField(t,"x")} /></label
        ><label
          >Fan speed · %<input
            type="number"
            aria-label="Point fan speed"
            .value=${String(Math.round(10*d.y)/10)}
            min=${h.ymin}
            max=${h.ymax}
            step="any"
            ?disabled=${this.locked}
            @focus=${()=>this.begin()}
            @blur=${()=>this.commit()}
            @change=${t=>this.editField(t,"y")}
        /></label>
      </div>
      <div class="curve-tools">
        <button
          class="pill family-action"
          ?disabled=${this.locked||e.length>=12}
          @click=${this.add}
        >
          <ha-icon aria-hidden="true" icon=${pt.add}></ha-icon>Add point</button
        ><button
          class="pill family-action"
          ?disabled=${this.locked||e.length<=2}
          @click=${this.removePoint}
        >
          <ha-icon aria-hidden="true" icon=${pt.remove}></ha-icon>Remove
          point
        </button>
      </div>
      ${this.error?Lt({message:this.error,tone:"error",action:{label:"Try again",icon:"mdi:refresh",disabled:this.locked,onClick:()=>this.commit()},actions:[{label:"Reload shared curve",disabled:this.locked,onClick:()=>{this.draft=null,this.error=""}}]}):V}
      <p class="save-state" role="status">
        ${this.saving||null!==this.pendingRevision?"Saving…":this.error?"Not saved":this.draft?"Editing…":"Shared · Saved automatically"}
      </p>

      ${this.shift?B`<p class="hint">
            Editing normal thresholds. Winter currently activates humidity
            points ${this.shift} points earlier.
          </p>`:V}
      ${this.inhibited&&"co2"!==this.selected?B`<p class="hint">
            Humidity response is currently paused by sauna monitoring.
          </p>`:V}
    </section>`}}ae.properties={flowEmbedded:{type:Boolean},hass:{attribute:!1},settings:{attribute:!1},readings:{attribute:!1},curves:{attribute:!1},revisions:{attribute:!1},saveCurve:{attribute:!1},busy:{type:Boolean},winter:{type:Boolean},inhibited:{type:Boolean},selected:{state:!0},profile:{state:!0},pointIndex:{state:!0},draft:{state:!0},error:{state:!0},saving:{state:!0},pendingRevision:{state:!0},editing:{state:!0},compare:{state:!0}},ae.styles=[te,n`
      :host {
        display: block;
      }
      .curve-panel {
        padding: 16px;
      }
      .curve-title,
      .curve-tools,
      .curve-profiles {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .curve-title {
        font-size: 14px;
        font-weight: 650;
        margin-bottom: 12px;
      }
      .curve-tabs {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }
      .curve-tabs button {
        flex: 1 1 auto;
        padding: 6px 10px;
        min-height: 44px;
        font-size: 12px;
      }
      .curve-profiles {
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .curve-profiles button {
        min-width: 72px;
      }
      .bounds {
        font-size: 11px;
        color: var(--family-muted);
        margin-left: auto;
      }
      .graph {
        position: relative;
        margin: 12px 0 8px;
        user-select: none;
        -webkit-user-select: none;
      }
      .graph svg {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
      }
      .graph text {
        font-family: var(--family-font);
        font-size: 11px;
        fill: var(--family-muted);
      }
      .grid {
        stroke: var(--divider-color, #8883);
        stroke-width: 1;
      }
      .line {
        fill: none;
        stroke-width: 3;
        stroke-linejoin: round;
        stroke: var(--primary-color);
      }
      .other {
        stroke: var(--family-muted);
        stroke-width: 1.5;
        stroke-dasharray: 4 5;
        opacity: 0.5;
      }
      .marker {
        stroke: var(--primary-text-color);
        stroke-width: 1;
        stroke-dasharray: 3 4;
        opacity: 0.55;
      }
      .point {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: transparent;
        padding: 0;
        display: grid;
        place-items: center;
        touch-action: none;
        cursor: grab;
        z-index: 2;
      }
      .point:active {
        cursor: grabbing;
      }
      .point::before {
        content: "";
        width: 12px;
        height: 12px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        background: var(--family-surface);
      }
      .point.selected::before {
        background: var(--primary-color);
        box-shadow: 0 0 0 5px
          color-mix(in srgb, var(--primary-color) 18%, transparent);
      }
      .point.selected {
        z-index: 3;
      }
      .point:focus-visible {
        outline-offset: -3px;
      }
      .point-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin: 12px 0;
      }
      .point-fields label {
        display: grid;
        gap: 6px;
        font-size: 12px;
        color: var(--family-muted);
      }
      .point-fields input {
        width: 100%;
        min-width: 0;
        min-height: 44px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--divider-color, #8883);
        background: var(--family-surface);
      }
      .curve-tools {
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .curve-tools .family-action {
        font-size: 12px;
        padding: 8px 10px;
      }
      .save-state {
        font-size: 11px;
        color: var(--family-muted);
        margin: 10px 0 0;
      }
      .hint {
        padding: 0;
        margin-top: 8px;
        font-size: 11px;
      }
      .live {
        font-size: 12px;
        color: var(--family-muted);
      }
      .curve-panel .family-notice {
        margin-top: 12px;
      }
      .curve-overview {
        min-width: 0;
      }
      .curve-title > span {
        flex: 1;
      }
      .curve-title small {
        display: block;
        font-size: 11px;
        font-weight: 400;
        color: var(--family-muted);
        margin-top: 4px;
      }
      .curve-title .save-state {
        flex: none;
        margin: 0;
      }
      .curve-list {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }
      .curve-summary {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 10px;
        text-align: left;
        padding: 14px 12px;
        min-height: 82px;
      }
      .summary-copy {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 6px;
      }
      .summary-copy strong {
        font-size: 13px;
      }
      .summary-copy span {
        font-size: 11px;
        color: var(--family-muted);
      }
      .spark {
        width: 76px;
        height: 38px;
        flex-shrink: 0;
      }
      .spark polyline {
        stroke: var(--primary-color);
        stroke-width: 2;
        fill: none;
        stroke-linejoin: round;
      }
      .curve-summary > ha-icon {
        width: 18px;
        --mdc-icon-size: 18px;
      }
      .curve-panel {
        padding: 12px;
      }
      .curve-title {
        margin-bottom: 8px;
      }
      .curve-title .icon-button {
        margin-left: -8px;
      }
      .fit {
        font-size: 11px;
        min-height: 44px;
      }
      .curve-context {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-top: 14px;
        font-size: 11px;
        color: var(--family-muted);
      }
      .curve-context b {
        color: var(--primary-text-color);
      }
      .curve-context b.family-unavailable {
        color: var(--family-unavailable);
      }
      .graph {
        margin: 4px 0 8px;
      }
      .graph-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
        font-size: 12px;
        color: var(--family-muted);
      }
      .graph-footer label {
        display: flex;
        align-items: center;
        min-height: 44px;
        gap: 4px;
      }
      .graph-footer > span {
        align-self: center;
      }
      .point-strip {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 6px 0 12px;
        margin-top: 4px;
      }
      .point-strip button {
        flex-shrink: 0;
        display: grid;
        gap: 2px;
        font-size: 12px;
        min-width: 66px;
        padding: 6px 10px;
        border-radius: 12px;
      }
      .point-strip span {
        font-size: 11px;
        color: var(--family-muted);
      }
      .point-fields {
        gap: 8px;
        margin: 8px 0;
      }
      .point-fields input {
        font-size: 16px;
      }
      .curve-tools {
        padding-top: 4px;
      }
      .live {
        font-size: 11px;
      }
      .curve-profiles .family-action {
        font-size: 12px;
        gap: 6px;
        padding: 8px 12px;
      }
      .curve-profiles ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
      .graph .grid {
        opacity: 0.5;
      }
    `],customElements.define("vallox-response-curves",ae);class re extends ct{constructor(){super(...arguments),this.readings={},this.selected="speed",this.hours=24,this.chart=null,this.error="",this.empty="",this.loading=!1,this.generation=0,this.signature=""}series(){const t=this.readings,e=t.entities??{},i=t.bindings??{};return({speed:[[e.fan_setting,"Fan setting"],[e.desired_speed,"Controller target"],[i.actual_speed_entity,"Unit operating level"]],rpm:[[i.supply_fan_speed_entity,"Supply fan"],[i.extract_fan_speed_entity,"Extract fan"]],humidity:[[e.home_humidity,"Home"],[i.shower_humidity_entity,"Shower"]],co2:[[i.co2_entity,"CO₂"]],temperature:[[i.outdoor_entity,"Outside"],[i.supply_entity,"Supply air"],[i.extract_entity,"Extract air"]]}[this.selected]??[]).filter(([t])=>t&&this.hass?.states[t]).map(([t,e])=>({entity:t,name:e}))}updated(){const t=this.series(),e=JSON.stringify([this.selected,this.hours,t]);e!==this.signature&&(this.signature=e,this.load(t)),this.chart&&(this.chart.hass=this.hass)}disconnectedCallback(){super.disconnectedCallback(),this.generation++,this.signature="",this.loading=!1}async load(t){const e=++this.generation;if(this.chart=null,this.error="",this.empty="",!t.length)return this.loading=!1,void(this.empty="No configured sensors are available for this graph.");this.loading=!0;try{const i=window.loadCardHelpers;if(!i)throw Error("Recorded graphs are available in your Home Assistant dashboard.");const s=await i();if(e!==this.generation||!this.isConnected)return;const a=s.createCardElement({type:"history-graph",hours_to_show:this.hours,entities:t});a.hass=this.hass,this.chart=a}catch(t){e===this.generation&&(this.error=t instanceof Error?t.message:String(t))}finally{e===this.generation&&(this.loading=!1)}}render(){return B`<section aria-label="Ventilation history">
      <div class="history-heading">
        <select
          aria-label="History period"
          .value=${String(this.hours)}
          @change=${t=>this.hours=Number(t.target.value)}
        >
          ${[6,24,72].map(t=>B`<option value=${t} ?selected=${this.hours===t}>
                ${t} hours
              </option>`)}
        </select>
      </div>
      <div class="history-tools">
        ${[["speed","Setting %"],["rpm","Fan RPM"],["humidity","Humidity"],["co2","CO₂"],["temperature","Temperature"]].map(([t,e])=>Ft({label:e,pressed:t===this.selected,onClick:()=>this.selected=t}))}
      </div>
      <div class="chart">${this.chart}</div>
      ${this.loading?jt({state:"loading",message:"Loading recorded history…"}):this.empty?jt({state:"empty",message:this.empty}):this.error?jt({state:"error",message:this.error,onRetry:()=>this.load(this.series())}):V}
      <p class="hint">
        Recorded by Home Assistant. Gaps indicate missing
        readings.${"speed"===this.selected?" Fan setting is the native requested percentage. Controller target is demand; unit operating level is a separate native reading.":""}
      </p>
    </section>`}}re.properties={hass:{attribute:!1},readings:{attribute:!1},selected:{state:!0},hours:{state:!0},chart:{state:!0},error:{state:!0},empty:{state:!0},loading:{state:!0}},re.styles=[te,n`
      :host {
        display: block;
        min-width: 0;
      }
      .history-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }
      .history-tools button {
        flex: 1;
        font-size: 12px;
        padding: 8px;
      }
      .history-heading {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 12px;
      }
      .history-heading select {
        font-size: 16px;
        min-height: 44px;
        border: 0;
        border-radius: 12px;
        padding: 8px;
        background: var(--family-surface);
      }
      .chart {
        min-width: 0;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }
      .hint,
      .family-notice,
      .family-async-state {
        margin-top: 12px;
      }
    `],customElements.define("vallox-ventilation-history",re);const ne=t=>B`<ha-icon icon=${t} aria-hidden="true"></ha-icon>`,oe=(t,e,i="")=>"number"==typeof e&&Number.isFinite(e)?`${Zt(t,e,{maximumFractionDigits:1})}${i}`:Wt,le=(t,e)=>Qt(t,1e3*e)===Qt(t,Date.now())?function(t,e,i={}){return Kt(t,e,{hour:"numeric",minute:"2-digit",...i.seconds?{second:"2-digit"}:{}})}(t,1e3*e):function(t,e,i={}){return Kt(t,e,{day:"numeric",month:"short",...!1===i.year?{}:{year:"numeric"},hour:"numeric",minute:"2-digit",...i.seconds?{second:"2-digit"}:{}})}(t,1e3*e,{year:!1}),ce=(t,e=0,i=1/0)=>"number"==typeof t&&Number.isFinite(t)&&t>=e&&t<=i?t:null,de={airflow:{label:"Airflow",keys:["home_speed","away_speed","boost_speed","boost_minutes"]},sauna:{label:"Sauna",keys:["sauna_current_threshold","sauna_on_seconds","sauna_off_minutes"]},timing:{label:"Winter & timing",keys:["winter_below","winter_rh_reduction","ramp_up","ramp_down","release_minutes","override_minutes","stale_minutes"]}};class he extends ct{constructor(){super(...arguments),this.curveTitle="Response curve",this.numberDrafts={},this.settingsGeneration=0,this.flow=new Pt(this,{guard:()=>this.settingRequest?{pending:!0,message:"Wait for the setting to be confirmed before leaving."}:Object.values(this.numberDrafts).some(t=>this.isDirty(t))?{dirty:!0,message:"Discard unsaved settings? Saved values stay in Home Assistant.",discard:()=>{this.numberDrafts={}}}:this.curveEditor()?.navigationGuard(),onChange:(t,e)=>{"curve"===e&&"curve"!==t&&this.curveEditor()?.returnToOverview(),e?.startsWith("group:")&&t!==e&&(this.numberDrafts={})}}),this.error="",this.busy=!1,this.pendingAction=""}get tab(){return"curve"===this.flow.current||this.flow.current?.startsWith("group:")?"settings":this.flow.current??"overview"}curveEditor(){return this.renderRoot.querySelector("vallox-response-curves")}setConfig(t){if(!t.entity?.startsWith("sensor."))throw new Error("Select the Vallox Autopilot status sensor");this.settingsGeneration++,this.clearSettingRequest(),this.numberDrafts={},this.error="",this.flow.forceClose(!1),this.config=t}disconnectedCallback(){super.disconnectedCallback(),this.settingsGeneration++,this.clearSettingRequest()}updated(){this.acknowledgeSetting();let t=!1;for(const[e,i]of Object.entries(this.numberDrafts)){const s=this.numberMeta(e);!this.isDirty(i)&&s&&s.entity===i.entity&&s.state.state!==i.base&&this.settingRequest?.key!==e&&(this.numberDrafts[e]={entity:i.entity,base:s.state.state,value:s.state.state},t=!0)}t&&this.requestUpdate()}clearSettingRequest(){this.settingRequest?.timer&&clearTimeout(this.settingRequest.timer),this.settingRequest&&(this.flow.notice=""),this.settingRequest=void 0,this.busy=!1}isDirty(t){return t.value!==t.base&&(""===t.value.trim()||Number(t.value)!==Number(t.base))}numberMeta(t){const e=this.entity(t,"number"),i=e?this.hass?.states[e]:void 0;if(!e||!i)return;const s=i.attributes.min,a=i.attributes.max,r=i.attributes.step,n=""!==i.state.trim()&&Number.isFinite(Number(i.state))&&"number"==typeof s&&Number.isFinite(s)&&"number"==typeof a&&Number.isFinite(a)&&s<=a&&"number"==typeof r&&Number.isFinite(r)&&r>0;return{entity:e,state:i,min:s,max:a,step:r,available:n,label:String(i.attributes.friendly_name??t.replaceAll("_"," ")).replace(/^Vallox Autopilot /,""),unit:String(i.attributes.unit_of_measurement??"")}}openGroup(t){if(!this.busy&&this.flow.push(`group:${t}`)){this.error="",this.numberDrafts={};for(const e of de[t].keys){const t=this.numberMeta(e);t&&(this.numberDrafts[e]={entity:t.entity,base:t.state.state,value:t.state.state})}}}reloadNumber(t){const e=this.numberMeta(t);e&&!this.busy&&(this.numberDrafts[t]={entity:e.entity,base:e.state.state,value:e.state.state},this.error="",this.requestUpdate())}async saveNumber(t){const e=this.numberDrafts[t],i=this.numberMeta(t);if(this.busy||!e||!this.isDirty(e))return;if(!i?.available||i.entity!==e.entity)return void(this.error="This setting is unavailable or its mapping changed. Reload its current value before saving.");if(Number(i.state.state)!==Number(e.base))return void(this.error=`${i.label} changed elsewhere. Reload its current value before saving.`);const s=Number(e.value),a=(s-i.min)/i.step;if(!e.value.trim()||!Number.isFinite(s)||s<i.min||s>i.max||Math.abs(a-Math.round(a))>1e-6)return void(this.error=`Enter a value from ${i.min} to ${i.max}, in steps of ${i.step}.`);const r=this.settingsGeneration,n={key:t,entity:i.entity,value:s,accepted:!1};this.settingRequest=n,this.busy=!0,this.error="",n.timer=setTimeout(()=>{this.settingRequest===n&&(this.clearSettingRequest(),this.error="No confirmation received. Your draft is kept; check the current value before retrying.")},15e3);try{if(await this.hass.callService("number","set_value",{entity_id:n.entity,value:s}),r!==this.settingsGeneration||this.settingRequest!==n)return;n.accepted=!0,this.acknowledgeSetting(),this.requestUpdate()}catch(t){if(r!==this.settingsGeneration||this.settingRequest!==n)return;this.clearSettingRequest(),this.error=t instanceof Error?t.message:String(t)}}acknowledgeSetting(){const t=this.settingRequest;if(!t?.accepted)return;const e=this.numberMeta(t.key);!e?.available||e.entity!==t.entity||Math.abs(Number(e.state.state)-t.value)>1e-6||(this.numberDrafts[t.key]={entity:t.entity,base:e.state.state,value:e.state.state},this.clearSettingRequest(),this.requestUpdate())}static getStubConfig(t){return{entity:Object.keys(t.states).find(e=>"vallox_autopilot"===t.states[e].attributes.controller)}}static getConfigElement(){return document.createElement("vallox-autopilot-card-editor")}getCardSize(){return 6}get state(){return this.hass?.states[this.config?.entity??""]}get attrs(){return this.state?.attributes??{}}entity(t,e){const i=this.attrs.entities?.[t];return"string"==typeof i&&i.startsWith(e+".")&&this.hass?.states[i]?i:void 0}async act(t,e,i,s={}){const a=this.entity(t,e);if(a&&!this.busy){this.error="",this.busy=!0,this.pendingAction=t;try{await this.hass.callService(e,i,{entity_id:a,...s})}catch(t){this.error=t instanceof Error?t.message:String(t)}finally{this.busy=!1,this.pendingAction=""}}}show(t,e){(this.flow.active?this.flow.push(t):this.flow.open(t,e))&&(this.error="")}more(t){t&&this.flow.handoff(()=>{return e=t,void this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}));var e})}dialog(t,e){const i=this.flow.current,s=i?.startsWith("group:")?i.slice(6):void 0,a=s?this.settingsGroup(s):"settings"===i||"curve"===i?this.settings():"history"===i?B`<vallox-ventilation-history
              .hass=${this.hass}
              .readings=${this.attrs}
            ></vallox-ventilation-history>`:this.details(t,e);return Dt(this.flow,{title:s?de[s].label:"curve"===i?this.curveTitle:"history"===i?"History":"details"===i?"Details":"Settings",content:B`<div class="modal-content">${a}</div>`,footer:this.error?Lt({message:this.error,tone:"error"}):this.settingRequest?Lt({message:this.settingRequest.accepted?"Request sent. Waiting for Home Assistant to confirm the value…":"Saving setting…"}):void 0,wide:"history"===i||"curve"===i,long:"history"===i||"curve"===i})}badge(t,e,i,s,a,r){const n=!["unknown","unavailable"].includes(this.state?.state??"unavailable")&&"number"==typeof e&&Number.isFinite(e),o=n&&["red","amber","green"].includes(s)?s:"unknown",l=n?oe(this.hass,e):Wt,c=`${t}: ${l}${n?` ${i}; ${"red"===o?"Needs attention":"amber"===o?"Watch":"green"===o?"In range":Wt}`:""}`,d=B`<span class="metric-top family-metric-top">
        ${ne(a)}<span class="metric-label family-metric-label"
          >${t}</span
        >
        <span class=${`dot ${o}`} aria-hidden="true"></span> </span
      ><strong class=${"family-metric-value "+(n?"":"missing")}
        >${l}${n?B`<small>${i}</small>`:V}</strong
      >`;return r?B`<button
          class="metric surface family-metric family-surface"
          @click=${()=>this.more(r)}
          aria-label=${`${c}. Open details`}
        >
          ${d}
        </button>`:B`<div
          class="metric surface family-metric family-surface"
          role="group"
          aria-label=${c}
        >
          ${d}
        </div>`}row(t,e,i="",s,a=!1){const r="string"==typeof e?e:oe(this.hass,e,i),n=B`<span class=${a?"family-telemetry-label":""}
        >${t}</span
      ><b
        class=${`${a?"family-telemetry-value":""} ${r===Wt?"family-unavailable":""}`}
        >${r}</b
      >`,o=a?"family-telemetry-cell":"data-row";return s?B`<button
          class=${o}
          @click=${()=>this.more(s)}
          aria-label=${`${t}: ${r}. Open details`}
        >
          ${n}
        </button>`:B`<div class=${o}>${n}</div>`}fanTelemetry(t,e,i){const s=this.attrs.bindings??{},a=[{entity:s.supply_fan_speed_entity,label:"Supply fan",text:null===t?Wt:`${Zt(this.hass,t,{digits:0})} rpm`,mdi:"mdi:fan",active:!1},{entity:s.extract_fan_speed_entity,label:"Extract fan",text:null===e?Wt:`${Zt(this.hass,e,{digits:0})} rpm`,mdi:"mdi:fan",active:!1},{entity:s.post_heater_entity,label:"Post-heater",text:null===i?Wt:i?"Active":"Off",mdi:"mdi:radiator",active:!0===i}].filter(t=>t.entity);return a.length?B`<div
          class="fan-telemetry family-telemetry"
          style=${`--family-telemetry-columns:${a.length}`}
          aria-label="Measured fan speeds and heater"
        >
          ${a.map(t=>B`<button
                class=${"telemetry family-telemetry-cell "+(t.active?"active":"")}
                aria-label=${`${t.label}: ${t.text}`}
                @click=${()=>this.more(t.entity)}
              >
                <span class="telemetry-label family-telemetry-label"
                  >${ne(t.mdi)}${t.label}</span
                ><strong
                  class=${"family-telemetry-value "+(t.text===Wt?"family-unavailable":"")}
                  >${t.text}</strong
                >
              </button>`)}
        </div>`:V}settings(){const t=this.attrs;return B`<vallox-response-curves
        .flowEmbedded=${!0}
        .hass=${this.hass}
        @curve-open=${t=>{this.curveTitle=t.detail.title,this.flow.push("curve")}}
        .settings=${t.settings??{}}
        .readings=${t}
        .curves=${t.response_curves??{}}
        .revisions=${t.curve_revisions??{}}
        .winter=${!!t.winter}
        .inhibited=${!!t.sauna_inhibited}
        .busy=${this.busy}
        .saveCurve=${async t=>{await this.hass.callService("vallox_autopilot","set_response_curve",{entity_id:this.config.entity,...t})}}
      ></vallox-response-curves>
      <div class="settings-overview" ?hidden=${"curve"===this.flow.current}>
        ${Object.keys(de).filter(t=>de[t].keys.some(t=>this.numberMeta(t))).map(t=>B` <button
                class="settings-link surface family-surface"
                aria-haspopup="dialog"
                ?disabled=${this.busy}
                @click=${()=>this.openGroup(t)}
              >
                ${ne(pt.settings)}<span>${de[t].label}</span>${ne(pt.next)}
              </button>`)}
        ${It({label:"Native controls",icon:"mdi:fan",disabled:!t.bindings?.fan_entity,onClick:()=>this.more(t.bindings?.fan_entity)})}
        <p class="hint">
          Shared settings save in Home Assistant. Configure sensor and occupancy
          mappings in the integration’s options.
        </p>
      </div>`}settingsGroup(t){return B`<div class="settings-fields">
      ${de[t].keys.map(t=>{const e=this.numberDrafts[t],i=this.numberMeta(t);if(!e)return V;const s=i?.label??t.replaceAll("_"," "),a=!!i&&(i.entity!==e.entity||Number(i.state.state)!==Number(e.base)),r=this.isDirty(e);return B`<section class="setting-field surface family-surface">
          <label for=${`setting-${t}`}>${s}</label>
          <div class="setting-controls">
            <span class="setting-input-unit"
              ><input
                id=${`setting-${t}`}
                type="number"
                inputmode="decimal"
                required
                aria-label=${s}
                .value=${e.value}
                min=${i?.min??V}
                max=${i?.max??V}
                step=${i?.step??V}
                ?disabled=${this.busy||!i?.available||i.entity!==e.entity}
                @input=${t=>{e.value=t.target.value,this.error="",this.requestUpdate()}}
                @keydown=${e=>{"Enter"===e.key&&(e.preventDefault(),this.saveNumber(t))}}
              /><small>${i?.unit??""}</small></span
            >
            ${It({label:"Save",icon:"mdi:content-save-outline",ariaLabel:`Save ${s}`,disabled:this.busy||!r||!i?.available||a,pending:this.settingRequest?.key===t,pendingLabel:"Saving…",onClick:()=>this.saveNumber(t)})}
          </div>
          ${i?.available?a?Lt({message:`Changed elsewhere: ${i.state.state} ${i.unit}. Your draft is kept.`,tone:"warning",action:{label:"Reload current value",onClick:()=>this.reloadNumber(t)}}):V:Lt({message:"This setting is unavailable.",tone:"warning"})}
        </section>`})}
    </div>`}overview(){const t=this.attrs;return B`<div class="metrics family-metrics">
      ${this.badge("Home humidity",t.home_humidity,"%",t.home_rag,"mdi:water-percent",this.entity("home_humidity","sensor"))}${this.badge("Shower humidity",t.shower_humidity,"%",t.shower_rag,"mdi:shower-head",t.bindings?.shower_humidity_entity)}${this.badge("CO₂",t.co2,"ppm",t.co2_rag,"mdi:molecule-co2",t.bindings?.co2_entity)}
      <div
        class="surface family-surface temperatures family-telemetry"
        role="group"
        aria-label="Air temperatures"
      >
        ${this.row("Outside",t.outdoor_temperature,"°C",t.bindings?.outdoor_entity,!0)}${this.row("Supply air",t.supply_temperature,"°C",t.bindings?.supply_entity,!0)}${this.row("Extract air",t.extract_temperature,"°C",t.bindings?.extract_entity,!0)}
      </div>
    </div>`}details(t,e){const i=this.attrs;return B`<section class="surface family-surface group">
        ${this.row("Native profile",i.profile)}${this.row("Heat recovery",i.cell_state)}${this.row("Sauna",!0===i.sauna_active?"Active":!1===i.sauna_active?"Inactive":Wt,"",i.entities?.sauna_active)}${this.row("Fan speed setting",t,"%",i.bindings?.fan_entity)}${this.row("Unit-reported speed",e,"%",i.bindings?.actual_speed_entity)}${this.row("Filter service",i.bindings?.filter_entity?this.hass?.states[i.bindings.filter_entity]?.state??Wt:"Not configured","",i.bindings?.filter_entity)}
      </section>
      <details class="surface family-surface group">
        <summary>Recent decisions${ne(pt.expand)}</summary>
        ${i.events?.length?[...i.events].reverse().map(t=>B`<div class="event">
                    <time>${le(this.hass,t.time)}</time
                    ><span>${t.message}</span>
                  </div>`):jt({state:"empty",message:"No decisions yet"})}
      </details>
      <p class="hint">
        Vallox may increase actual speed using its own sensors. Defrost, fan
        balance and heater protections remain under native control.
      </p>`}render(){const t=this.state,e=this.attrs;if(!t||"vallox_autopilot"!==e.controller)return B`<ha-card
        >${Lt({message:"Select an available Vallox Autopilot status sensor.",tone:"warning"})}</ha-card
      >`;const i=this.entity("automation","switch"),s=i&&"on"===this.hass?.states[i]?.state,a=this.hass?.states[e.bindings?.fan_entity],r=a?.attributes.percentage,n="off"===a?.state?0:"on"===a?.state?ce(r,0,100):null,o=this.hass?.states[e.bindings?.actual_speed_entity],l=o?""===o.state.trim()||["unknown","unavailable"].includes(o.state)?null:Number(o.state):e.actual_speed,c=!e.actual_speed_stale&&!["unknown","unavailable"].includes(t.state)&&"number"==typeof l&&Number.isFinite(l)&&l>=0&&l<=100?l:null,d=!["unknown","unavailable"].includes(t.state),h=d?ce(e.supply_fan_rpm):null,p=d?ce(e.extract_fan_rpm):null,u=d&&"boolean"==typeof e.post_heater_active?e.post_heater_active:null,m=!(!e.bindings?.supply_fan_speed_entity&&!e.bindings?.extract_fan_speed_entity),f=e.bindings?.supply_fan_speed_entity&&null!==h&&h>0||e.bindings?.extract_fan_speed_entity&&null!==p&&p>0,g=d&&null!==c&&c>0&&(m?!!f:"on"===a?.state),y=g?120/Math.max(1,Math.min(100,c)):12,v=!!e.boost_until,b=function(t,e="static",i=!1){return t&&"none"!==e&&i?{style:`--pulse-weak: ${t.weak}; --pulse-strong: ${t.strong}; ${"pulse"===e?"animation: glowPulse 2.4s ease-in-out infinite;":""} box-shadow: 0 18px 40px var(--pulse-strong, ${t.strong}), 0 6px 18px var(--pulse-weak, ${t.weak});`,overlay:B`<div class="glow-overlay" aria-hidden="true"></div>`}:{style:"",overlay:V}}({weak:"color-mix(in srgb, var(--family-active) 12%, transparent)",strong:"color-mix(in srgb, var(--family-active) 22%, transparent)"},"static",!!s||v);return B`<ha-card
        ><div class="root">
          <header class="family-header">
            <span class="brand family-brand">${ne("mdi:air-filter")}</span>
            <div class="identity family-identity">
              <h1 class="family-title">
                ${this.config?.name??"Ventilation"}
              </h1>
              <div class="subtitle family-subtitle" id="home-mode">
                ${!0===e.home?"At home":!1===e.home?"Away":"Occupancy unknown"}${e.winter?" · Winter":""}
              </div>
              <button
                class="mode"
                aria-label="Home/Away mode"
                aria-describedby="home-mode"
                title="Home/Away mode"
                @click=${()=>this.more(e.bindings?.home_entity||e.entities?.home_mode)}
              ></button>
            </div>
            <button
              class="icon-button family-icon-button"
              aria-label="Settings"
              title="Settings"
              aria-haspopup="dialog"
              @click=${t=>this.show("settings",t.currentTarget)}
            >
              ${ne(pt.settings)}
            </button>
          </header>
          <div class="tile-wrap">
            ${function(t){return B`<div class="glow-under" style=${t.style} aria-hidden="true">
    ${t.overlay}
  </div>`}(b)}
            <section class="surface family-surface hero">
              <div class="speed">
                <div class="speed-values">
                  <span class="speed-reading"
                    ><strong
                      class=${null===n?"missing family-unavailable":""}
                      >${null===n?Wt:oe(this.hass,n)}</strong
                    >${null===n?V:B`<span>%</span>`}</span
                  ><span class="speed-caption" aria-live="polite"
                    >Fan setting</span
                  >
                </div>
                <div
                  class=${"airflow "+(g?"flowing":"")}
                  style=${`--airflow-duration:${y.toFixed(1)}s`}
                  aria-hidden="true"
                >
                  <span class="airflow-fan">${ne("mdi:fan")}</span>
                </div>
              </div>
              <div class="track">
                <div style=${`width:${n??0}%`}></div>
              </div>
              ${this.fanTelemetry(h,p,u)}
              <div class="actions">
                ${It({label:v?"End boost":`Boost · ${e.settings?.boost_minutes??15} min`,icon:v?"mdi:stop":"mdi:fan-plus",primary:v,disabled:this.busy||!this.entity(v?"cancel_boost":"boost","button"),pending:this.pendingAction===(v?"cancel_boost":"boost"),pendingLabel:v?"Ending boost…":"Starting boost…",onClick:()=>this.act(v?"cancel_boost":"boost","button","press")})}${e.hold_until?It({label:"Resume auto",icon:"mdi:play",disabled:this.busy,pending:"resume"===this.pendingAction,pendingLabel:"Resuming…",onClick:()=>this.act("resume","button","press")}):V}${v?B`<span class="hint"
                      >Until ${le(this.hass,e.boost_until)}</span
                    >`:V}
              </div>
            </section>
          </div>
          ${e.sauna_inhibited?!0===e.sauna_active?Lt({message:"Controller humidity boost paused for sauna.",tone:"accent",icon:"mdi:heat-wave"}):Lt({message:"Sauna status unavailable; controller humidity boost paused.",tone:"warning",icon:"mdi:heat-wave"}):V}
          ${e.degraded?B`${Lt({title:`Sensor fallback · minimum ${e.settings?.home_speed??30}%`,message:"Some inputs cannot be used. Auto keeps at least the Home airflow; higher valid demands still apply.",tone:"warning"})}${(e.input_issues??[]).length?B`<!-- Outside the status notice: stale-input minutes change every refresh. -->
                    <div
                      class="input-issues"
                      role="group"
                      aria-label="Unusable inputs"
                    >
                      ${(e.input_issues??[]).map(t=>B`<button
                            class="data-row"
                            @click=${()=>this.more(t.entity_id)}
                          >
                            <span>${t.name}</span><b>${t.reason}</b>
                          </button>`)}
                    </div>`:V}`:V}
          ${e.notice?B`<p class="hint">${e.notice}</p>`:V}${this.error||e.error?Lt({message:this.error||e.error,tone:"error"}):V}
          ${this.overview()}
          <nav
            class="family-navigation"
            aria-label="Ventilation information"
            style="--family-nav-columns:2"
          >
            ${[["history",pt.history,"History"],["details",pt.details,"Details"]].map(([t,e,i])=>B`<button
                  aria-haspopup="dialog"
                  @click=${e=>this.show(t,e.currentTarget)}
                >
                  ${ne(e)}${i}
                </button>`)}
          </nav>
        </div></ha-card
      >${this.dialog(n,c)}`}}he.properties={hass:{attribute:!1},config:{state:!0},error:{state:!0},busy:{state:!0},pendingAction:{state:!0}},he.styles=[ht,te],customElements.define("vallox-autopilot-card",he);class pe extends ct{constructor(){super(...arguments),this.config={}}setConfig(t){this.config=t}render(){return B`<label
      >Status sensor
      <select
        @change=${t=>{this.config={...this.config,entity:t.target.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}
      >
        ${Object.keys(this.hass?.states??{}).filter(t=>"vallox_autopilot"===this.hass.states[t].attributes.controller).map(t=>B`<option value=${t} ?selected=${t===this.config.entity}>
                ${t}
              </option>`)}
      </select></label
    >`}}pe.styles=[mt,n`
      :host {
        display: block;
        color: var(--primary-text-color);
      }
      label {
        display: grid;
        gap: 6px;
        font-size: 13px;
      }
      select {
        font: inherit;
        font-size: 16px;
        color: inherit;
        width: 100%;
        min-height: 44px;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        background: var(--family-surface);
      }
      select:focus-visible {
        outline: 3px solid var(--primary-color);
        outline-offset: 3px;
      }
    `],pe.properties={hass:{attribute:!1},config:{state:!0}},customElements.define("vallox-autopilot-card-editor",pe),window.customCards=window.customCards??[],window.customCards.push({type:"vallox-autopilot-card",name:"Vallox Autopilot",description:"Humidity, CO₂ and balanced ventilation control",preview:!0});export{he as ValloxAutopilotCard};
