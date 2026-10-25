import { LitElement, html, svg, css, nothing, type PropertyValues } from "lit";
import { UI_ICONS } from "@bitosome/ha-card-ui";
import { styles } from "./styles";

const definitions = {
  home: {
    label: "Home humidity",
    unit: "%",
    lo: 20,
    hi: 100,
    step: 1,
    reading: "home_humidity",
  },
  shower: {
    label: "Shower humidity",
    unit: "%",
    lo: 20,
    hi: 100,
    step: 1,
    reading: "shower_humidity",
  },
  excess: {
    label: "Shower rise",
    unit: "points",
    lo: 0,
    hi: 40,
    step: 1,
    reading: "excess",
  },
  co2: {
    label: "CO₂",
    unit: "ppm",
    lo: 400,
    hi: 3000,
    step: 50,
    reading: "co2",
  },
} as const;
type CurveKey = keyof typeof definitions;
type Profile = "home" | "away";
export type Point = { x: number; y: number };
export type CurveEdit = {
  curve: CurveKey;
  profile: Profile;
  points: Point[];
  expected_revision: number;
};
type Curves = Partial<Record<CurveKey, Record<Profile, Point[]>>>;
const copy = (p: Point[]) => p.map((p) => ({ ...p }));

export class ResponseCurves extends LitElement {
  static properties = {
    flowEmbedded: { type: Boolean },
    settings: { attribute: false },
    readings: { attribute: false },
    curves: { attribute: false },
    revisions: { attribute: false },
    saveCurve: { attribute: false },
    busy: { type: Boolean },
    winter: { type: Boolean },
    inhibited: { type: Boolean },
    selected: { state: true },
    profile: { state: true },
    pointIndex: { state: true },
    draft: { state: true },
    error: { state: true },
    saving: { state: true },
    pendingRevision: { state: true },
    editing: { state: true },
    compare: { state: true },
  };
  flowEmbedded = false;
  settings: Record<string, number> = {};
  readings: Record<string, number | null> = {};
  curves: Curves = {};
  revisions: Record<string, number> = {};
  saveCurve?: (edit: CurveEdit) => Promise<unknown>;
  busy = false;
  winter = false;
  inhibited = false;
  selected: CurveKey = "home";
  profile: Profile = "home";
  pointIndex = 0;
  draft: Point[] | null = null;
  error = "";
  saving = false;
  pendingRevision: number | null = null;
  editing = false;
  compare = false;
  private viewport: { lo: number; hi: number } | null = null;
  private draftRevision = 0;
  canLeave() {
    return (
      !this.draft && !this.saving && this.pendingRevision === null && !this.drag
    );
  }
  navigationGuard() {
    return {
      pending: this.saving || this.pendingRevision !== null || !!this.drag,
      dirty: !!this.draft,
      message:
        this.saving || this.pendingRevision !== null || !!this.drag
          ? "Wait for the curve edit to finish and Home Assistant to confirm it."
          : "Discard unsaved curve changes?",
      discard: () => {
        this.draft = null;
        this.error = "";
      },
    };
  }
  returnToOverview() {
    this.editing = false;
    this.viewport = null;
  }
  private reading(key: CurveKey) {
    const d = definitions[key];
    return key === "excess"
      ? typeof this.readings.shower_humidity === "number" &&
        typeof this.readings.home_humidity === "number"
        ? this.readings.shower_humidity - this.readings.home_humidity
        : null
      : this.readings[d.reading];
  }
  private response(points: Point[], n: number) {
    if (n <= points[0].x) return points[0].y;
    for (let i = 1; i < points.length; i++) {
      const l = points[i - 1],
        r = points[i];
      if (n <= r.x) return l.y + ((r.y - l.y) * (n - l.x)) / (r.x - l.x);
    }
    return points[points.length - 1].y;
  }
  private open(key: CurveKey) {
    this.select(key, this.profile);
    this.editing = true;
    this.viewport = null;
    if (this.flowEmbedded)
      this.dispatchEvent(
        new CustomEvent("curve-open", {
          detail: { title: definitions[key].label },
          bubbles: true,
          composed: true,
        }),
      );
  }
  private back() {
    if (!this.canLeave()) {
      this.error =
        "Finish this edit or reload the shared curve before leaving.";
      return;
    }
    this.editing = false;
    this.viewport = null;
  }
  private drag: {
    id: number;
    index: number;
    clientX: number;
    clientY: number;
    point: Point;
    before: Point[] | null;
    revision: number;
    width: number;
    height: number;
    lo: number;
    hi: number;
  } | null = null;
  static styles = [
    styles,
    css`
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
        color: var(--muted);
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
        font: 11px system-ui;
        fill: var(--muted);
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
        stroke: var(--muted);
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
        background: var(--surface);
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
        color: var(--muted);
      }
      .point-fields input {
        width: 100%;
        min-width: 0;
        min-height: 44px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--divider-color, #8883);
        background: var(--surface);
      }
      .curve-tools {
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .curve-tools .pill {
        font-size: 12px;
        padding: 8px 10px;
      }
      .save-state {
        font-size: 11px;
        color: var(--muted);
        margin: 10px 0 0;
      }
      .hint {
        padding: 0;
        margin-top: 8px;
        font-size: 11px;
      }
      .live {
        font-size: 12px;
        color: var(--muted);
      }
      .edit-error {
        padding: 10px 0;
        font-size: 12px;
      }
      .error-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
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
        color: var(--muted);
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
        color: var(--muted);
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
        color: var(--muted);
      }
      .curve-context b {
        color: var(--primary-text-color);
      }
      .graph {
        margin: 4px 0 8px;
      }
      .graph-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: space-between;
        font-size: 10px;
        color: var(--muted);
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
        font-size: 10px;
        color: var(--muted);
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
      .curve-profiles .pill {
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
    `,
  ];
  private get key() {
    return `${this.selected}:${this.profile}`;
  }
  private get points() {
    return this.draft ?? this.curves[this.selected]?.[this.profile] ?? [];
  }
  private get locked() {
    return (
      this.busy ||
      this.saving ||
      this.pendingRevision !== null ||
      !this.saveCurve
    );
  }
  private view() {
    if (this.drag) return { lo: this.drag.lo, hi: this.drag.hi };
    if (this.viewport) return this.viewport;
    const d = definitions[this.selected],
      all = [
        ...this.points,
        ...(this.curves[this.selected]?.[
          this.profile === "home" ? "away" : "home"
        ] ?? []),
      ],
      min = Math.min(...all.map((p) => p.x)),
      max = Math.max(...all.map((p) => p.x)),
      pad = Math.max(d.step * 2, (max - min) * 0.5);
    return (this.viewport = {
      lo: Math.max(d.lo, Math.floor((min - pad) / d.step) * d.step),
      hi: Math.min(d.hi, Math.ceil((max + pad) / d.step) * d.step),
    });
  }
  private get shift() {
    return this.winter &&
      (this.selected === "home" || this.selected === "shower")
      ? (this.settings.winter_rh_reduction ?? 0)
      : 0;
  }
  protected willUpdate(_changed: PropertyValues) {
    if (
      this.pendingRevision !== null &&
      (this.revisions[this.key] ?? 0) >= this.pendingRevision
    ) {
      this.draft = null;
      this.pendingRevision = null;
      this.error = "";
    }
    this.pointIndex = Math.max(
      0,
      Math.min(this.pointIndex, this.points.length - 1),
    );
  }
  private begin() {
    if (!this.draft) {
      this.draft = copy(this.points);
      this.draftRevision = this.revisions[this.key] ?? 0;
    }
  }
  private limits(index: number) {
    const d = definitions[this.selected],
      p = this.points;
    return {
      xmin: index ? p[index - 1].x + d.step : d.lo,
      xmax: index < p.length - 1 ? p[index + 1].x - d.step : d.hi,
      ymin: Math.max(
        this.settings[`${this.profile}_speed`],
        index ? p[index - 1].y : 10,
      ),
      ymax: Math.min(
        this.settings.boost_speed,
        index < p.length - 1 ? p[index + 1].y : 100,
      ),
    };
  }
  private updatePoint(index: number, x: number, y: number) {
    const d = definitions[this.selected],
      b = this.limits(index);
    this.begin();
    const p = copy(this.points);
    p[index] = {
      x: Math.max(b.xmin, Math.min(b.xmax, Math.round(x / d.step) * d.step)),
      y: Math.max(b.ymin, Math.min(b.ymax, Math.round(y))),
    };
    this.draft = p;
    this.error = "";
  }
  private async commit() {
    if (!this.draft || this.locked || this.drag) return;
    const edit = {
      curve: this.selected,
      profile: this.profile,
      points: copy(this.draft),
      expected_revision: this.draftRevision,
    };
    if (
      JSON.stringify(this.draft) ===
        JSON.stringify(this.curves[this.selected]?.[this.profile]) &&
      (this.revisions[this.key] ?? 0) === this.draftRevision
    ) {
      this.draft = null;
      return;
    }
    this.saving = true;
    this.error = "";
    try {
      await this.saveCurve!(edit);
      this.pendingRevision = edit.expected_revision + 1;
      if ((this.revisions[this.key] ?? 0) >= this.pendingRevision) {
        this.draft = null;
        this.pendingRevision = null;
      }
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.saving = false;
    }
  }
  private select(curve: CurveKey, profile: Profile) {
    if (this.locked || this.drag) return;
    if (this.draft) {
      this.error =
        "Finish this edit or reload the shared curve before switching.";
      return;
    }
    this.selected = curve;
    this.profile = profile;
    this.pointIndex = 0;
    this.error = "";
    this.viewport = null;
  }
  private down(e: PointerEvent, index: number) {
    if (this.locked || this.drag || e.button !== 0) return;
    e.preventDefault();
    const b = e.currentTarget as HTMLButtonElement;
    b.focus({ preventScroll: true });
    const rect = this.renderRoot
      .querySelector(".graph")!
      .getBoundingClientRect();
    this.pointIndex = index;
    const view = this.view();
    this.drag = {
      id: e.pointerId,
      index,
      clientX: e.clientX,
      clientY: e.clientY,
      point: { ...this.points[index] },
      before: this.draft ? copy(this.draft) : null,
      revision: this.draftRevision,
      width: rect.width,
      height: rect.height,
      lo: view.lo,
      hi: view.hi,
    };
    this.begin();
    b.setPointerCapture(e.pointerId);
  }
  private move(e: PointerEvent) {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.updatePoint(
      d.index,
      Math.max(
        d.lo,
        Math.min(
          d.hi,
          d.point.x +
            ((((e.clientX - d.clientX) / d.width) * 348) / 288) * (d.hi - d.lo),
        ),
      ),
      d.point.y - ((((e.clientY - d.clientY) / d.height) * 234) / 160) * 100,
    );
  }
  private up(e: PointerEvent) {
    if (this.drag?.id !== e.pointerId) return;
    this.drag = null;
    const b = e.currentTarget as HTMLButtonElement;
    if (b.hasPointerCapture(e.pointerId)) b.releasePointerCapture(e.pointerId);
    void this.commit();
  }
  private cancel() {
    if (!this.drag) return;
    this.draft = this.drag.before;
    this.draftRevision = this.drag.revision;
    this.drag = null;
  }
  private keydown(e: KeyboardEvent, index: number) {
    if (e.key === "Escape") {
      e.preventDefault();
      this.cancel();
      return;
    }
    if (
      this.locked ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
    )
      return;
    e.preventDefault();
    this.pointIndex = index;
    const p = this.points[index],
      step = definitions[this.selected].step;
    this.updatePoint(
      index,
      p.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0),
      p.y + (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0),
    );
  }
  private editField(e: Event, axis: "x" | "y") {
    if (this.locked) return;
    const input = e.target as HTMLInputElement;
    if (!input.value || !input.checkValidity()) {
      input.value = String(this.points[this.pointIndex][axis]);
      return;
    }
    const p = this.points[this.pointIndex];
    this.updatePoint(
      this.pointIndex,
      axis === "x" ? Number(input.value) : p.x,
      axis === "y" ? Number(input.value) : p.y,
    );
    void this.commit();
  }
  private add() {
    if (this.locked || this.points.length >= 12) return;
    const step = definitions[this.selected].step;
    let index = -1,
      gap = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const width = this.points[i + 1].x - this.points[i].x;
      if (width >= 2 * step && width > gap) {
        index = i;
        gap = width;
      }
    }
    if (index < 0) {
      this.error = "Move points farther apart to make room for another.";
      return;
    }
    this.begin();
    const p = copy(this.points),
      l = p[index],
      r = p[index + 1],
      x = Math.max(
        l.x + step,
        Math.min(r.x - step, Math.round((l.x + r.x) / 2 / step) * step),
      );
    p.splice(index + 1, 0, {
      x,
      y: l.y + ((r.y - l.y) * (x - l.x)) / (r.x - l.x),
    });
    this.draft = p;
    this.pointIndex = index + 1;
    void this.commit();
  }
  private removePoint() {
    if (this.locked || this.points.length <= 2) return;
    this.begin();
    this.draft = this.points.filter((_, i) => i !== this.pointIndex);
    this.pointIndex = Math.min(this.pointIndex, this.draft.length - 1);
    void this.commit();
  }
  private addAt(e: MouseEvent) {
    if (
      this.locked ||
      this.drag ||
      this.points.length >= 12 ||
      (e.target as Element).closest("button")
    )
      return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(),
      view = this.view(),
      d = definitions[this.selected];
    const gx = ((e.clientX - rect.left) / rect.width) * 348,
      gy = ((e.clientY - rect.top) / rect.height) * 234;
    if (gx < 34 || gx > 322 || gy < 30 || gy > 190) return;
    const x =
      Math.round((view.lo + ((gx - 34) / 288) * (view.hi - view.lo)) / d.step) *
      d.step;
    if (
      x < d.lo ||
      x > d.hi ||
      this.points.some((p) => Math.abs(p.x - x) < d.step)
    )
      return;
    const index = this.points.findIndex((p) => p.x > x),
      at = index < 0 ? this.points.length : index;
    const lo = at
        ? this.points[at - 1].y
        : this.settings[`${this.profile}_speed`],
      hi =
        at < this.points.length ? this.points[at].y : this.settings.boost_speed;
    this.begin();
    const points = copy(this.points);
    points.splice(at, 0, {
      x,
      y: Math.max(lo, Math.min(hi, Math.round((190 - gy) / 1.6))),
    });
    this.draft = points;
    this.pointIndex = at;
    void this.commit();
  }
  private profiles() {
    return html`<div class="curve-profiles" aria-label="Occupancy curve">
      ${(["home", "away"] as Profile[]).map(
        (profile) =>
          html`<button
            class=${`pill family-action ${this.profile === profile ? "active" : ""}`}
            aria-label=${`Edit ${profile} curve`}
            aria-pressed=${this.profile === profile}
            ?disabled=${this.locked}
            @click=${() => this.select(this.selected, profile)}
          >
            <ha-icon
              icon=${profile === "home"
                ? "mdi:home-outline"
                : "mdi:home-export-outline"}
            ></ha-icon
            >${profile === "home" ? "Home" : "Away"}
          </button>`,
      )}<span class="bounds"
        >${this.settings[`${this.profile}_speed`]}–${this.settings.boost_speed}%
        fan</span
      >
    </div>`;
  }
  private overview() {
    return html`<section class="curve-overview">
      <div class="curve-title">
        <span>Response curves</span
        ><span class="save-state">Shared · Auto-save</span>
      </div>
      ${this.profiles()}
      <div class="curve-list">
        ${Object.entries(definitions).map(([k, d]) => {
          const key = k as CurveKey,
            points = this.curves[key]?.[this.profile] ?? [],
            reading = this.reading(key),
            paused = this.inhibited && key !== "co2",
            shift =
              this.winter && ["home", "shower"].includes(key)
                ? (this.settings.winter_rh_reduction ?? 0)
                : 0;
          const lo = points[0]?.x ?? 0,
            hi = points[points.length - 1]?.x ?? 1;
          return html`<button
            class="surface family-surface curve-summary"
            aria-label=${`Edit ${d.label} curve`}
            @click=${() => this.open(key)}
          >
            <div class="summary-copy">
              <strong>${d.label}</strong
              ><span
                >${typeof reading === "number"
                  ? `${Math.round(reading * 10) / 10} ${d.unit}`
                  : "No reading"}
                ·
                ${paused
                  ? "Paused for sauna"
                  : points.length && typeof reading === "number"
                    ? `${Math.round(this.response(points, reading + shift))}% curve request`
                    : "No response"}</span
              >
            </div>
            <svg class="spark" viewBox="0 0 100 42" aria-hidden="true">
              <polyline
                points=${points
                  .map(
                    (p) =>
                      `${4 + ((p.x - lo) / (hi - lo || 1)) * 92},${39 - p.y * 0.35}`,
                  )
                  .join(" ")}
              ></polyline></svg
            ><ha-icon aria-hidden="true" icon=${UI_ICONS.next}></ha-icon>
          </button>`;
        })}
      </div>
      <p class="hint">
        Choose a curve to edit. The highest demand sets the target; ramp and
        cooldown still apply.
      </p>
    </section>`;
  }
  protected render() {
    const d = definitions[this.selected],
      p = this.points;
    if (!this.editing) return this.overview();
    if (p.length < 2)
      return html`<section class="surface family-surface curve-panel">
        <p class="hint">
          Update the Vallox Autopilot integration to enable the point editor.
        </p>
      </section>`;
    const view = this.view(),
      x = (n: number) => 34 + ((n - view.lo) / (view.hi - view.lo)) * 288,
      y = (n: number) => 190 - n * 1.6;
    const line = (points: Point[]) =>
      `${x(view.lo)},${y(points[0].y)} ${points.map((p) => `${x(p.x)},${y(p.y)}`).join(" ")} ${x(view.hi)},${y(points[points.length - 1].y)}`;
    const other =
      this.curves[this.selected]?.[this.profile === "home" ? "away" : "home"];
    const reading = this.reading(this.selected);
    const selected = p[this.pointIndex],
      b = this.limits(this.pointIndex);
    return html`<section class="surface family-surface curve-panel">
      <div class="curve-title">
        ${!this.flowEmbedded
          ? html`<button
              class="icon-button family-icon-button"
              aria-label="Back to response curves"
              @click=${this.back}
            >
              <ha-icon aria-hidden="true" icon=${UI_ICONS.back}></ha-icon>
            </button>`
          : nothing}<span
          >${this.flowEmbedded ? "Response curve" : d.label}${this.flowEmbedded
            ? nothing
            : html`<small>Response curve</small>`}</span
        ><button
          class="pill family-action fit"
          @click=${() => {
            this.viewport = null;
            this.requestUpdate();
          }}
        >
          Fit
        </button>
      </div>
      ${this.profiles()}
      <div class="curve-context">
        <span
          >Now
          <b
            >${typeof reading === "number"
              ? `${Math.round(reading * 10) / 10} ${d.unit}`
              : "—"}</b
          ></span
        ><span
          >${this.inhibited && this.selected !== "co2"
            ? "Paused for sauna"
            : `Curve request ${typeof reading === "number" ? Math.round(this.response(p, reading + this.shift)) + "%" : "—"}`}</span
        >
      </div>
      <div
        class="graph"
        role="group"
        aria-label=${`${d.label}, ${this.profile} curve. Drag points or use arrow keys.`}
        @click=${this.addAt}
      >
        <svg viewBox="0 0 348 234" aria-hidden="true" focusable="false">
          <text x="34" y="15">Fan speed (%)</text>
          ${[0, 25, 50, 75, 100].map(
            (n) =>
              svg`<line class="grid" x1="34" y1=${y(n)} x2="322" y2=${y(n)}></line><text x="26" y=${y(n) + 4} text-anchor="end">${n}</text>`,
          )}
          ${this.compare && other
            ? svg`<polyline class="line other" points=${line(other)}></polyline>`
            : nothing}
          <polyline class="line" points=${line(p)}></polyline>
          ${typeof reading === "number" &&
          reading + this.shift >= view.lo &&
          reading + this.shift <= view.hi
            ? svg`<line class="marker" x1=${x(reading + this.shift)} x2=${x(reading + this.shift)} y1="30" y2="190"></line>`
            : nothing}
          ${[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const v = view.lo + (view.hi - view.lo) * t;
            return svg`<line class="grid" x1=${x(v)} x2=${x(v)} y1="30" y2="190"></line><text x=${x(v)} y="213" text-anchor="middle">${Math.round(v)}</text>`;
          })}
          <text x="178" y="232" text-anchor="middle">
            ${d.label} (${d.unit})
          </text>
        </svg>
        ${p.map(
          (point, i) =>
            html`<button
              class=${`point ${i === this.pointIndex ? "selected" : ""}`}
              style=${`left:${(x(point.x) / 348) * 100}%;top:${(y(point.y) / 234) * 100}%`}
              aria-label=${`Point ${i + 1}: ${Math.round(point.x * 10) / 10} ${d.unit}, ${Math.round(point.y * 10) / 10}% fan`}
              aria-pressed=${i === this.pointIndex}
              ?disabled=${this.locked}
              @click=${(e: MouseEvent) => {
                e.stopPropagation();
                this.pointIndex = i;
              }}
              @pointerdown=${(e: PointerEvent) => this.down(e, i)}
              @pointermove=${this.move}
              @pointerup=${this.up}
              @pointercancel=${this.cancel}
              @lostpointercapture=${this.cancel}
              @keydown=${(e: KeyboardEvent) => this.keydown(e, i)}
              @keyup=${(e: KeyboardEvent) => {
                if (e.key.startsWith("Arrow")) void this.commit();
              }}
            ></button>`,
        )}
      </div>
      <div class="graph-footer">
        <span>Drag a point · Tap the graph to add</span
        ><label
          ><input
            type="checkbox"
            .checked=${this.compare}
            @change=${(e: Event) =>
              (this.compare = (e.target as HTMLInputElement).checked)}
          />Compare ${this.profile === "home" ? "Away" : "Home"}</label
        >
      </div>
      <div class="point-strip" aria-label="Select point">
        ${p.map(
          (point, i) =>
            html`<button
              class=${`pill family-action ${this.pointIndex === i ? "active" : ""}`}
              aria-label=${`Select point ${i + 1}`}
              aria-pressed=${this.pointIndex === i}
              @click=${() => (this.pointIndex = i)}
            >
              ${point.x}${d.unit === "%" ? "%" : ""}<span
                >→ ${Math.round(point.y)}%</span
              >
            </button>`,
        )}
      </div>
      <div class="live">Selected point ${this.pointIndex + 1}</div>
      <div class="point-fields">
        <label
          >${d.label} · ${d.unit}<input
            type="number"
            aria-label="Point input"
            .value=${String(selected.x)}
            min=${b.xmin}
            max=${b.xmax}
            step=${d.step}
            ?disabled=${this.locked}
            @focus=${() => this.begin()}
            @blur=${() => this.commit()}
            @change=${(e: Event) => this.editField(e, "x")} /></label
        ><label
          >Fan speed · %<input
            type="number"
            aria-label="Point fan speed"
            .value=${String(Math.round(selected.y * 10) / 10)}
            min=${b.ymin}
            max=${b.ymax}
            step="any"
            ?disabled=${this.locked}
            @focus=${() => this.begin()}
            @blur=${() => this.commit()}
            @change=${(e: Event) => this.editField(e, "y")}
        /></label>
      </div>
      <div class="curve-tools">
        <button
          class="pill family-action"
          ?disabled=${this.locked || p.length >= 12}
          @click=${this.add}
        >
          <ha-icon aria-hidden="true" icon=${UI_ICONS.add}></ha-icon>Add point</button
        ><button
          class="pill family-action"
          ?disabled=${this.locked || p.length <= 2}
          @click=${this.removePoint}
        >
          <ha-icon aria-hidden="true" icon=${UI_ICONS.remove}></ha-icon>Remove
          point
        </button>
      </div>
      ${this.error
        ? html`<div class="edit-error" role="alert">
            ${this.error}
            <div class="error-actions">
              <button
                class="pill family-action"
                ?disabled=${this.locked}
                @click=${() => this.commit()}
              >
                Retry</button
              ><button
                class="pill family-action"
                ?disabled=${this.locked}
                @click=${() => {
                  this.draft = null;
                  this.error = "";
                }}
              >
                Reload shared curve
              </button>
            </div>
          </div>`
        : nothing}
      <p class="save-state" role="status">
        ${this.saving || this.pendingRevision !== null
          ? "Saving…"
          : this.error
            ? "Not saved"
            : this.draft
              ? "Editing…"
              : "Shared · Saved automatically"}
      </p>

      ${this.shift
        ? html`<p class="hint">
            Editing normal thresholds. Winter currently activates humidity
            points ${this.shift} points earlier.
          </p>`
        : nothing}
      ${this.inhibited && this.selected !== "co2"
        ? html`<p class="hint">
            Humidity response is currently paused by sauna monitoring.
          </p>`
        : nothing}
    </section>`;
  }
}
customElements.define("vallox-response-curves", ResponseCurves);
