import { css } from "lit";
import {
  familyStyles,
  headerStyles,
  metricStyles,
  navigationStyles,
  telemetryStyles,
  dialogStyles,
  componentStyles,
  glowStyles,
} from "@bitosome/ha-card-ui";
export const styles = [
  familyStyles,
  headerStyles,
  metricStyles,
  navigationStyles,
  telemetryStyles,
  dialogStyles,
  componentStyles,
  glowStyles,
  css`
    :host {
      color: var(--primary-text-color, #26352f);
      font-family: var(--family-font);
      --surface: var(--ha-card-background, var(--card-background-color, #fff));
      --muted: var(--secondary-text-color, #69756f);
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: var(--tile-padding-large);
      background: var(--surface);
      border: 1px solid var(--divider-color, #0001);
      border-radius: var(--ha-card-border-radius, 24px);
      overflow: visible;
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
    .pill.active {
      background: color-mix(in srgb, var(--primary-color) 22%, var(--surface));
      color: var(--primary-text-color);
      box-shadow: inset 0 0 0 1px
        color-mix(in srgb, var(--primary-color) 40%, transparent);
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
      color: var(--muted);
    }
    .speed-caption {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 3px;
      font-size: 12px;
      color: var(--muted);
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
      background: color-mix(in srgb, var(--status-warn-color) 12%, transparent);
    }
    .telemetry.active .telemetry-label {
      color: var(--status-warn-color);
    }
    /* Decorative flow uses the native MDI fan and theme accent; never indicates
   automation ownership. It moves only with a valid operating reading and, when mapped, measured RPM. */
    .airflow {
      position: relative;
      width: 56px;
      height: 56px;
      pointer-events: none;
      color: var(--muted);
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
      background: var(--muted);
    }
    .dot.green {
      background: var(--status-success-color);
    }
    .dot.amber {
      background: var(--status-warn-color);
    }
    .dot.red {
      background: var(--status-alert-color);
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
      color: var(--muted);
    }
    .data-row b {
      text-align: right;
      font-weight: 550;
      overflow-wrap: anywhere;
      max-width: 62%;
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.6;
      margin: 0;
      padding: 0 8px;
    }
    .group {
      padding: 8px 16px;
    }
    summary {
      cursor: pointer;
      min-height: 44px;
      padding: 14px 0;
      font-size: 13px;
      font-weight: 600;
    }
    .setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 56px;
      font-size: 12px;
      border-top: 1px solid var(--divider-color, #0001);
    }
    .setting > span:last-child {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }
    .setting input {
      font-size: 16px;
      width: 76px;
      min-height: 44px;
      border: 1px solid var(--divider-color, #0002);
      border-radius: 10px;
      padding: 8px;
      background: var(--surface);
    }
    .setting small {
      color: var(--muted);
      min-width: 28px;
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
      color: var(--muted);
      flex-shrink: 0;
    }
    .notice {
      position: relative;
      z-index: 1;
      border-radius: var(--tile-border-radius);
      padding: 12px 14px;
      font-size: 12px;
      line-height: 1.6;
      background: color-mix(
        in srgb,
        var(--status-warn-color) 9%,
        var(--surface)
      );
      border: 1px solid
        color-mix(in srgb, var(--status-warn-color) 25%, transparent);
    }
    .notice ha-icon {
      vertical-align: middle;
      margin-right: 6px;
    }
    .notice.error {
      border-color: var(--status-alert-color);
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
  `,
];
