import { LitElement, html, css, nothing } from "lit";
import { designTokens } from "./shared/design-tokens";
import { UI_ICONS, familyStyles } from "./shared/card-primitives";
import { buildGlow } from "./shared/glow";
import { styles } from "./styles";
import "./curves";
import "./history";
type State = { state: string; attributes: Record<string, any> };
type Hass = {
  states: Record<string, State>;
  entities?: Record<
    string,
    { platform?: string; config_entry_id?: string; unique_id?: string }
  >;
  callService: (
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ) => Promise<unknown>;
};
const icon = (name: string) =>
  html`<ha-icon icon=${name} aria-hidden="true"></ha-icon>`;
const value = (n: any, unit = "") =>
  typeof n === "number" && Number.isFinite(n)
    ? `${Math.round(n * 10) / 10}${unit}`
    : "—";
const validNumber = (n: any, min = 0, max = Infinity): number | null =>
  typeof n === "number" && Number.isFinite(n) && n >= min && n <= max
    ? n
    : null;
export class ValloxAutopilotCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    tab: { state: true },
    error: { state: true },
    busy: { state: true },
  };
  hass?: Hass;
  config?: { entity: string; name?: string };
  tab = "overview";
  error = "";
  busy = false;
  static styles = [designTokens, styles];
  setConfig(config: any) {
    if (!config.entity?.startsWith("sensor."))
      throw new Error("Select the Vallox Autopilot status sensor");
    this.config = config;
  }
  static getStubConfig(hass: Hass) {
    return {
      entity: Object.keys(hass.states).find(
        (id) => hass.states[id].attributes.controller === "vallox_autopilot",
      ),
    };
  }
  static getConfigElement() {
    return document.createElement("vallox-autopilot-card-editor");
  }
  getCardSize() {
    return 6;
  }
  private get state() {
    return this.hass?.states[this.config?.entity ?? ""];
  }
  private get attrs() {
    return this.state?.attributes ?? {};
  }
  private entity(key: string, domain: string) {
    const id = this.attrs.entities?.[key];
    return typeof id === "string" &&
      id.startsWith(domain + ".") &&
      this.hass?.states[id]
      ? id
      : undefined;
  }
  private async act(
    key: string,
    domain: string,
    service: string,
    data: Record<string, unknown> = {},
  ) {
    const entity = this.entity(key, domain);
    if (!entity || this.busy) return;
    this.error = "";
    this.busy = true;
    try {
      await this.hass!.callService(domain, service, {
        entity_id: entity,
        ...data,
      });
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busy = false;
    }
  }
  private show(tab: string) {
    const editor = this.renderRoot.querySelector(
      "vallox-response-curves",
    ) as any;
    if (editor && !editor.canLeave()) {
      this.error =
        "Finish the curve edit or reload its shared version before leaving.";
      return;
    }
    this.error = "";
    this.tab = tab;
  }
  private more(entity: string | undefined) {
    if (entity)
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId: entity },
          bubbles: true,
          composed: true,
        }),
      );
  }
  private badge(
    title: string,
    n: unknown,
    unit: string,
    rag: string,
    mdi: string,
    entity?: string,
  ) {
    const known =
      !["unknown", "unavailable"].includes(
        this.state?.state ?? "unavailable",
      ) &&
      typeof n === "number" &&
      Number.isFinite(n);
    const severity =
      known && ["red", "amber", "green"].includes(rag) ? rag : "unknown";
    const display = known ? value(n) : "Unavailable";
    const status =
      severity === "red"
        ? "Needs attention"
        : severity === "amber"
          ? "Watch"
          : severity === "green"
            ? "In range"
            : "Unavailable";
    const label = `${title}: ${display}${known ? ` ${unit}; ${status}` : ""}`;
    const content = html`<span class="metric-top family-metric-top">
        ${icon(mdi)}<span class="metric-label family-metric-label"
          >${title}</span
        >
        <span class=${`dot ${severity}`} aria-hidden="true"></span> </span
      ><strong class=${`family-metric-value ${known ? "" : "missing"}`}
        >${display}${known ? html`<small>${unit}</small>` : nothing}</strong
      >`;
    return entity
      ? html`<button
          class="metric surface family-metric family-surface"
          @click=${() => this.more(entity)}
          aria-label=${`${label}. Open details`}
        >
          ${content}
        </button>`
      : html`<div
          class="metric surface family-metric family-surface"
          role="group"
          aria-label=${label}
        >
          ${content}
        </div>`;
  }
  private row(
    label: string,
    n: unknown,
    unit = "",
    entity?: string,
    compact = false,
  ) {
    const display =
      typeof n === "string"
        ? n
        : typeof n === "number" && Number.isFinite(n)
          ? value(n, unit)
          : "Unavailable";
    const content = html`<span class=${compact ? "family-telemetry-label" : ""}
        >${label}</span
      ><b class=${compact ? "family-telemetry-value" : ""}>${display}</b>`;
    const classes = compact ? "family-telemetry-cell" : "data-row";
    return entity
      ? html`<button
          class=${classes}
          @click=${() => this.more(entity)}
          aria-label=${`${label}: ${display}. Open details`}
        >
          ${content}
        </button>`
      : html`<div class=${classes}>${content}</div>`;
  }
  private fanTelemetry(
    supply: number | null,
    extract: number | null,
    heater: boolean | null,
  ) {
    const b = this.attrs.bindings ?? {};
    const items = [
      {
        entity: b.supply_fan_speed_entity,
        label: "Supply fan",
        text:
          supply === null
            ? "Unavailable"
            : `${Math.round(supply).toLocaleString()} rpm`,
        mdi: "mdi:fan",
        active: false,
      },
      {
        entity: b.extract_fan_speed_entity,
        label: "Extract fan",
        text:
          extract === null
            ? "Unavailable"
            : `${Math.round(extract).toLocaleString()} rpm`,
        mdi: "mdi:fan",
        active: false,
      },
      {
        entity: b.post_heater_entity,
        label: "Post-heater",
        text: heater === null ? "Unavailable" : heater ? "Active" : "Off",
        mdi: "mdi:radiator",
        active: heater === true,
      },
    ].filter((item) => item.entity);
    return items.length
      ? html`<div
          class="fan-telemetry family-telemetry"
          style=${`--family-telemetry-columns:${items.length}`}
          aria-label="Measured fan speeds and heater"
        >
          ${items.map(
            (item) =>
              html`<button
                class=${`telemetry family-telemetry-cell ${item.active ? "active" : ""}`}
                aria-label=${`${item.label}: ${item.text}`}
                @click=${() => this.more(item.entity)}
              >
                <span class="telemetry-label family-telemetry-label"
                  >${icon(item.mdi)}${item.label}</span
                ><strong class="family-telemetry-value">${item.text}</strong>
              </button>`,
          )}
        </div>`
      : nothing;
  }
  private settings() {
    const a = this.attrs;
    const groups = [
      ["Airflow", ["home_speed", "away_speed", "boost_speed", "boost_minutes"]],
      [
        "Sauna",
        ["sauna_current_threshold", "sauna_on_seconds", "sauna_off_minutes"],
      ],
      [
        "Winter & timing",
        [
          "winter_below",
          "winter_rh_reduction",
          "ramp_up",
          "ramp_down",
          "release_minutes",
          "override_minutes",
          "stale_minutes",
        ],
      ],
    ] as const;
    return html`<vallox-response-curves
        .settings=${a.settings ?? {}}
        .readings=${a}
        .curves=${a.response_curves ?? {}}
        .revisions=${a.curve_revisions ?? {}}
        .winter=${!!a.winter}
        .inhibited=${!!a.sauna_inhibited}
        .busy=${this.busy}
        .saveCurve=${async (detail: any) => {
          await this.hass!.callService(
            "vallox_autopilot",
            "set_response_curve",
            { entity_id: this.config!.entity, ...detail },
          );
        }}
      ></vallox-response-curves
      >${groups.map(
        ([name, keys]) =>
          html`<details class="surface family-surface group">
            <summary>${name}</summary>
            ${keys.map((key) => {
              const id = this.entity(key, "number");
              const s = id ? this.hass?.states[id] : undefined;
              return s
                ? html`<label class="setting"
                    ><span
                      >${(s.attributes.friendly_name ?? key).replace(
                        /^Vallox Autopilot /,
                        "",
                      )}</span
                    ><span
                      ><input
                        type="number"
                        aria-label=${key.replaceAll("_", " ")}
                        .value=${s.state}
                        min=${s.attributes.min}
                        max=${s.attributes.max}
                        step=${s.attributes.step}
                        ?disabled=${this.busy}
                        @change=${(e: Event) => {
                          const input = e.target as HTMLInputElement;
                          if (input.checkValidity())
                            void this.act(key, "number", "set_value", {
                              value: Number(input.value),
                            });
                          else input.value = s.state;
                        }}
                      /><small
                        >${s.attributes.unit_of_measurement ?? ""}</small
                      ></span
                    ></label
                  >`
                : nothing;
            })}
          </details>`,
      )}
      <p class="hint">
        Shared settings save in Home Assistant. Configure sensor and occupancy
        mappings in the integration’s options.
      </p>`;
  }
  protected render() {
    const s = this.state,
      a = this.attrs;
    if (!s || a.controller !== "vallox_autopilot")
      return html`<ha-card class="notice"
        >Select an available Vallox Autopilot status sensor.</ha-card
      >`;
    const automation = this.entity("automation", "switch"),
      enabled = automation && this.hass?.states[automation]?.state === "on";
    const fan = this.hass?.states[a.bindings?.fan_entity];
    const percentage = fan?.attributes.percentage;
    const setting =
      fan?.state === "off"
        ? 0
        : fan?.state === "on"
          ? validNumber(percentage, 0, 100)
          : null;
    const reported = this.hass?.states[a.bindings?.actual_speed_entity];
    const raw = reported
      ? reported.state.trim() !== "" &&
        !["unknown", "unavailable"].includes(reported.state)
        ? Number(reported.state)
        : null
      : a.actual_speed;
    const speed =
      !a.actual_speed_stale &&
      !["unknown", "unavailable"].includes(s.state) &&
      typeof raw === "number" &&
      Number.isFinite(raw) &&
      raw >= 0 &&
      raw <= 100
        ? raw
        : null;
    const available = !["unknown", "unavailable"].includes(s.state);
    const supply = available ? validNumber(a.supply_fan_rpm) : null,
      extract = available ? validNumber(a.extract_fan_rpm) : null;
    const heater =
      available && typeof a.post_heater_active === "boolean"
        ? a.post_heater_active
        : null;
    const rpmBindings = !!(
      a.bindings?.supply_fan_speed_entity ||
      a.bindings?.extract_fan_speed_entity
    );
    const moving =
      (a.bindings?.supply_fan_speed_entity && supply !== null && supply > 0) ||
      (a.bindings?.extract_fan_speed_entity && extract !== null && extract > 0);
    const airflow =
      available &&
      speed !== null &&
      speed > 0 &&
      (rpmBindings ? !!moving : fan?.state === "on");
    // Decorative rate follows the native operating percentage, not literal RPM.
    // When RPM sensors are mapped, measured movement must also be confirmed.
    const airflowDuration = airflow
      ? 120 / Math.max(1, Math.min(100, speed!))
      : 12;
    const boost = !!a.boost_until,
      glow = buildGlow(
        { weak: "rgba(50,150,220,.12)", strong: "rgba(50,150,220,.22)" },
        "static",
        !!enabled || boost,
      );
    return html`<ha-card
      ><div class="root">
        <header class="family-header">
          <span class="brand family-brand">${icon("mdi:air-filter")}</span>
          <div class="identity family-identity">
            <h1 class="family-title">${this.config?.name ?? "Ventilation"}</h1>
            <div class="subtitle family-subtitle" id="home-mode">
              ${a.home === true
                ? "At home"
                : a.home === false
                  ? "Away"
                  : "Occupancy unknown"}${a.winter ? " · Winter" : ""}
            </div>
            <button
              class="mode"
              aria-label="Home/Away mode"
              aria-describedby="home-mode"
              title="Home/Away mode"
              @click=${() =>
                this.more(a.bindings?.home_entity || a.entities?.home_mode)}
            ></button>
          </div>
          <button
            class="icon-button family-icon-button"
            aria-label="Native Vallox controls"
            title="Native Vallox controls"
            @click=${() => this.more(a.bindings?.fan_entity)}
          >
            ${icon(UI_ICONS.settings)}
          </button>
        </header>
        <div class="tile-wrap">
          <div class="glow-under" style=${glow.style}>${glow.overlay}</div>
          <section class="surface family-surface hero">
            <div class="speed">
              <div class="speed-values">
                <span class="speed-reading"
                  ><strong class=${setting === null ? "missing" : ""}
                    >${setting === null
                      ? "Unavailable"
                      : value(setting)}</strong
                  >${setting === null ? nothing : html`<span>%</span>`}</span
                ><span class="speed-caption" aria-live="polite"
                  >Fan setting</span
                >
              </div>
              <div
                class=${`airflow ${airflow ? "flowing" : ""}`}
                style=${`--airflow-duration:${airflowDuration.toFixed(1)}s`}
                aria-hidden="true"
              >
                <span class="airflow-fan">${icon("mdi:fan")}</span>
              </div>
            </div>
            <div class="track">
              <div style=${`width:${setting ?? 0}%`}></div>
            </div>
            ${this.fanTelemetry(supply, extract, heater)}
            <div class="actions">
              <button
                class=${`pill family-action ${boost ? "active" : ""}`}
                ?disabled=${this.busy ||
                !this.entity(boost ? "cancel_boost" : "boost", "button")}
                @click=${() =>
                  this.act(boost ? "cancel_boost" : "boost", "button", "press")}
              >
                ${icon(boost ? "mdi:stop" : "mdi:fan-plus")}${boost
                  ? "End boost"
                  : `Boost · ${a.settings?.boost_minutes ?? 15} min`}</button
              >${a.hold_until
                ? html`<button
                    class="pill family-action"
                    ?disabled=${this.busy}
                    @click=${() => this.act("resume", "button", "press")}
                  >
                    ${icon("mdi:play")}Resume auto
                  </button>`
                : nothing}${boost
                ? html`<span class="hint"
                    >Until
                    ${new Date(a.boost_until * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span
                  >`
                : nothing}
            </div>
          </section>
        </div>
        ${a.sauna_inhibited
          ? html`<div class="notice">
              ${icon("mdi:heat-wave")}${a.sauna_active === true
                ? "Controller humidity boost paused for sauna."
                : "Sauna status unavailable; controller humidity boost paused."}
            </div>`
          : nothing}
        ${a.degraded
          ? html`<details class="notice">
              <summary>
                Sensor fallback · minimum ${a.settings?.home_speed ?? 30}%
              </summary>
              <p>
                Some inputs cannot be used. Auto keeps at least the Home
                airflow; higher valid demands still apply.
              </p>
              ${(a.input_issues ?? []).map(
                (issue: any) =>
                  html`<button
                    class="data-row"
                    @click=${() => this.more(issue.entity_id)}
                  >
                    <span>${issue.name}</span><b>${issue.reason}</b>
                  </button>`,
              )}
            </details>`
          : nothing}
        ${a.notice ? html`<p class="hint">${a.notice}</p>` : nothing}${this
          .error || a.error
          ? html`<div role="alert" class="notice error">
              ${this.error || a.error}
            </div>`
          : nothing}
        ${this.tab === "overview"
          ? html`<div class="metrics family-metrics">
              ${this.badge(
                "Home humidity",
                a.home_humidity,
                "%",
                a.home_rag,
                "mdi:water-percent",
                this.entity("home_humidity", "sensor"),
              )}${this.badge(
                "Shower humidity",
                a.shower_humidity,
                "%",
                a.shower_rag,
                "mdi:shower-head",
                a.bindings?.shower_humidity_entity,
              )}${this.badge(
                "CO₂",
                a.co2,
                "ppm",
                a.co2_rag,
                "mdi:molecule-co2",
                a.bindings?.co2_entity,
              )}
              <div
                class="surface family-surface temperatures family-telemetry"
                role="group"
                aria-label="Air temperatures"
              >
                ${this.row(
                  "Outside",
                  a.outdoor_temperature,
                  "°C",
                  a.bindings?.outdoor_entity,
                  true,
                )}${this.row(
                  "Supply air",
                  a.supply_temperature,
                  "°C",
                  a.bindings?.supply_entity,
                  true,
                )}${this.row(
                  "Extract air",
                  a.extract_temperature,
                  "°C",
                  a.bindings?.extract_entity,
                  true,
                )}
              </div>
            </div>`
          : this.tab === "settings"
            ? this.settings()
            : this.tab === "history"
              ? html`<vallox-ventilation-history
                  .hass=${this.hass}
                  .readings=${a}
                ></vallox-ventilation-history>`
              : html`<section class="surface family-surface group">
                    ${this.row("Native profile", a.profile)}${this.row(
                      "Heat recovery",
                      a.cell_state,
                    )}${this.row(
                      "Sauna",
                      a.sauna_active === true
                        ? "Active"
                        : a.sauna_active === false
                          ? "Inactive"
                          : "Unavailable",
                      "",
                      a.entities?.sauna_active,
                    )}${this.row(
                      "Fan speed setting",
                      setting,
                      "%",
                      a.bindings?.fan_entity,
                    )}${this.row(
                      "Unit-reported speed",
                      speed,
                      "%",
                      a.bindings?.actual_speed_entity,
                    )}<button
                      class="data-row"
                      @click=${() => this.more(a.bindings?.filter_entity)}
                    >
                      <span>Filter service</span
                      ><b
                        >${a.bindings?.filter_entity
                          ? (this.hass?.states[a.bindings.filter_entity]
                              ?.state ?? "Unavailable")
                          : "Not configured"}</b
                      >
                    </button>
                  </section>
                  <details class="surface family-surface group">
                    <summary>Recent decisions</summary>
                    ${[...(a.events ?? [])]
                      .reverse()
                      .map(
                        (e: any) =>
                          html`<div class="event">
                            <time
                              >${new Date(e.time * 1000).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}</time
                            ><span>${e.message}</span>
                          </div>`,
                      )}
                  </details>
                  <p class="hint">
                    Vallox may increase actual speed using its own sensors.
                    Defrost, fan balance and heater protections remain under
                    native control.
                  </p>`}
        <nav class="family-navigation" aria-label="Ventilation sections">
          ${[
            ["overview", "mdi:home-outline", "Overview"],
            ["history", UI_ICONS.history, "History"],
            ["settings", UI_ICONS.settings, "Settings"],
            ["details", UI_ICONS.details, "Details"],
          ].map(
            ([key, mdi, label]) =>
              html`<button
                aria-current=${this.tab === key ? "page" : "false"}
                @click=${() => this.show(key)}
              >
                ${icon(mdi)}${label}
              </button>`,
          )}
        </nav>
      </div></ha-card
    >`;
  }
}
customElements.define("vallox-autopilot-card", ValloxAutopilotCard);
class Editor extends LitElement {
  static styles = [
    familyStyles,
    css`
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
    `,
  ];
  static properties = { hass: { attribute: false }, config: { state: true } };
  hass?: Hass;
  config: any = {};
  setConfig(c: any) {
    this.config = c;
  }
  protected render() {
    return html`<label
      >Status sensor
      <select
        @change=${(e: Event) => {
          this.config = {
            ...this.config,
            entity: (e.target as HTMLSelectElement).value,
          };
          this.dispatchEvent(
            new CustomEvent("config-changed", {
              detail: { config: this.config },
              bubbles: true,
              composed: true,
            }),
          );
        }}
      >
        ${Object.keys(this.hass?.states ?? {})
          .filter(
            (id) =>
              this.hass!.states[id].attributes.controller ===
              "vallox_autopilot",
          )
          .map(
            (id) =>
              html`<option value=${id} ?selected=${id === this.config.entity}>
                ${id}
              </option>`,
          )}
      </select></label
    >`;
  }
}
customElements.define("vallox-autopilot-card-editor", Editor);
(window as any).customCards = (window as any).customCards ?? [];
(window as any).customCards.push({
  type: "vallox-autopilot-card",
  name: "Vallox Autopilot",
  description: "Humidity, CO₂ and balanced ventilation control",
  preview: true,
});
