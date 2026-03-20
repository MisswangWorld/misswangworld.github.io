# SVOD Catchup Wrapper (Lightning) — Partner Streaming Integration Framework

## Overview

The SVOD Catchup Wrapper is a multi-tenant integration framework that embeds third-party streaming services — SBS, ABC iView, Paramount+, Optus Sport, and others — directly into the Fetch TV platform. The Lightning variant replaces the legacy UI4 rendering system with a GPU-accelerated Lightning engine, delivering a significantly more performant and visually fluid experience across all partner apps.

Users browse, authenticate, and play content from partner catalogs without ever leaving Fetch TV. A single, unified surface handles the full lifecycle: login, content discovery, playback, resume, wishlist, and analytics — all behind a consistent navigation model.

---

## Problem Statement

Each streaming partner operates its own catalog, authentication system, API contract, and analytics stack. Naively building a bespoke native integration per partner would result in duplicated infrastructure, inconsistent UX, and an unmaintainable codebase that scales linearly with the number of partners.

The Wrapper solves this with a configuration-driven host surface: partners declare their UI layout, API endpoints, feature flags, and analytics plugins in a single config file. The platform handles rendering, navigation, session management, media playback, and DRM — partners implement only the integration interface that maps their specific API to the shared contract.

---

## Architecture

### Two-Layer Design

```
┌─────────────────────────────────────────────────────┐
│              SVODCatchupWrapper (Orchestrator)       │
│  - loadApp / loadConfig                             │
│  - Auth session lifecycle                           │
│  - Playback initialisation & DRM                    │
│  - Bookmark / history / wishlist sync               │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐   ┌──────────▼──────────┐
│  UI4 Surface    │   │  Lightning Surface   │
│  (Legacy)       │   │  (Modern, default)   │
│  UIContainer    │   │  GPU-accelerated     │
│  UILabel etc.   │   │  Lightning engine    │
└────────────────-┘   └─────────────────────┘
```

The active rendering system is determined by `"renderSystem": "lightning"` in the partner config. No code change is required to onboard a new partner onto Lightning.

### Integration Interface Pattern

Each partner ships a self-contained integration class (e.g. `SBS.singleton.class.js`) that implements a shared interface:

| Method | Responsibility |
|--------|---------------|
| `isAuthenticated()` | Check current session validity |
| `login()` / `logout()` | Credential-based or QR code auth |
| `playbackInitialise()` | Fetch stream URL, set up DRM, inject ad cue points |
| `playbackGetData()` | Return structured `MediaPlayerItem` for the player queue |
| `getWishList()` / `toggleWishList()` | User saved content |
| `getHistory()` / `updateHistory()` | Continue-watching positions |

The orchestrator calls these methods without knowing which partner is active — the config selects the implementation at runtime.

---

## Supported Partners

| Partner | Render System | Auth Method | Key Analytics |
|---------|--------------|-------------|---------------|
| SBS | Lightning | Email / QR Code | Adobe Data Layer, Conviva |
| ABC iView | Lightning | QR Code / Multi-profile | Snowplow |
| Paramount+ | UI4 | Email / Password | Omniture (CBS) |
| Optus Sport | UI4 | Email / Password | Segment.io |

---

## Technical Highlights

### 1. Configuration-Driven UI Composition

Each partner's `screenConfigurations` block in their config file declaratively defines every screen — layouts, component types, data mappings, and navigation transitions. The Lightning Business class reads this at runtime to assemble the full UI without any partner-specific branching in the host code:

```javascript
{
  "appName": "sbs",
  "renderSystem": "lightning",
  "middlewareServiceName": "SBS_CATCHUP_V2",
  "saveLoggedInState": true,
  "wishListRemove": true,
  "historyList": true,
  "historyListPositionUpdateInterval": 90000,
  "plugins": [
    { "name": "adobeDataLayer" },
    { "name": "conviva", "url": "..." }
  ],
  "screenConfigurations": { ... }
}
```

Adding a new partner requires writing a config file and an integration class — the surface itself needs no modification.

### 2. Lazy Surface Loading with Hot Swap

The Lightning surface is registered with `dynamicImport`, `doNotIdleLoad`, and `hotSwappable: true`. It only loads into memory when a user navigates to a partner app, and can be swapped out when the user exits without a full re-initialisation on return. Combined with `remainOnscreen: true`, the surface retains its render state during video playback, eliminating reload latency when returning from the player.

### 3. DRM & Playback Pipeline

Playback is fully delegated to the platform's shared `MediaPlayer`. The integration interface's responsibility is to resolve the stream URL and DRM license URL, then hand off a structured `MediaPlayerItem`:

```
playVideo(appName, item)
  → Concurrency / entitlement check
  → playbackGetData()  [partner API: stream URL + PlayReady license URL]
  → MediaPlayer.queueItem({ baseType: SVOD_CATCHUP_APP, ... })
  → Platform handles DRM handshake, buffering, analytics
```

This means the platform's full DRM, retry, and error-handling infrastructure applies uniformly to all partner streams.

### 4. Navigation History Stack

The wrapper maintains its own per-session navigation stack, separate from the top-level Fetch TV navigation. Pressing back within a partner app pops the wrapper's own stack first; only when the stack is empty does it return to the Fetch TV home. Authentication state can mutate the stack mid-session — screens like device-linking or profile-selection are injected or removed based on login state without requiring full re-renders.

### 5. Middleware Bookmark Sync

Resume positions, wishlist state, and continue-watching history are synced to Fetch TV's middleware service (`middlewareServiceName` in the config). This enables cross-device continuity: a user who starts watching on one device can resume on another through the same Fetch TV account, regardless of which partner's content they were watching.

### 6. Analytics Plugin Architecture

Partners declare their analytics SDKs as named plugins in their config. The wrapper dynamically loads only the relevant SDKs at launch time — SBS loads Adobe + Conviva, iView loads Snowplow, Paramount loads Omniture. This prevents unused SDK code from running globally and keeps each partner's measurement implementation fully isolated.

---

## Technical Challenges & Trade-offs

### Challenge 1: Lightning Canvas Visibility During Video Playback

When the platform media player takes over the screen, the Lightning canvas must be correctly hidden and restored. An early approach using `hide()` on the canvas caused the canvas to stop receiving GPU updates on return — frame rendering froze even though the logic was running.

**Resolution:** A `detach_lightning` release setting was introduced to fully detach the Lightning canvas from the render tree during playback. However, after approximately 12 hours of device uptime, GPU memory calculations become inaccurate when repeatedly attaching and detaching, causing visual artifacts.

**Trade-off:** `detach_lightning` is disabled by default. The canvas is kept in the render tree during playback, accepting a small idle GPU cost in exchange for reliability across long device sessions.

### Challenge 2: Navigation Stack and Auth State Coherence

The navigation history stack must remain consistent with the user's authentication state. Screens like device-linking, QR code login, and profile selection are only valid in specific auth states — navigating back to them after logging in (or out) would present a broken or misleading UI.

The wrapper uses `removeFromHistoryIfAuthenticated` and `removeFromHistoryIfNotAuthenticated` markers on stack entries to prune invalid history items on every auth state change. This is correct but fragile — each new screen added to a partner must be annotated with its auth-state dependencies or it risks surfacing at the wrong time.

### Challenge 3: Animation Synchronisation with Scroll Containers

Lightning's `UILightningScrollArea` manages its own animation state. When programmatic navigation bypasses scroll animation (e.g. jumping to a focused item on load), re-enabling animation must be deferred one call stack frame:

```javascript
component.parent.disableAnimation();
// perform navigation
top.utilities.bypassCallStack(() => { component.parent.enableAnimation(); });
```

Enabling animation synchronously causes the scroll container to animate from its previous position to the new one — visible as a janky initial scroll. The bypass is necessary but adds subtle timing-dependent behaviour that can surface as regressions when navigation flow changes.

### Challenge 4: Per-Partner Resource Loading Strategy

Some partners return short-lived stream URLs that expire within minutes. Others return durable URLs that can be cached across multiple plays. The `resourceLoadedOnEachPlay` flag controls whether the platform re-calls `playbackGetData()` before every play event. Misconfiguring this per-partner causes either needless extra API calls or playback failures on expired tokens.

**Trade-off:** There is no automatic expiry detection. The correct value must be determined by examining each partner's token TTL and documented in their config. A future improvement would be to detect 401/403 on stream start and trigger a transparent refresh.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| VTT / stream URL fetch times out | `playbackGetData()` returns an error; platform shows user-facing error toast, does not crash |
| User logs out mid-navigation | Auth-state history pruning fires; landing or link screen is injected at the stack root |
| Partner API returns an empty catalog page | Grid renders empty state defined in `screenConfigurations`; no null-pointer crash |
| Multi-profile partner (iView) — no profile selected | Profile selection screen is forced before browse; skipping via back returns to Fetch home |
| Concurrency limit reached (too many simultaneous streams) | Concurrency check rejects before MediaPlayer is invoked; error presented without initiating DRM |
| Device linking poll timeout | Polling retries with exponential backoff; user can cancel and retry without re-entering the link screen |
| Partner SDK (analytics / DRM) fails to load | SDK load is non-blocking; playback proceeds, analytics events are silently dropped |

---

## Known Issues

| Issue | Ticket | Status |
|-------|--------|--------|
| After ~12 hours uptime, `detach_lightning` causes GPU memory miscalculation and visual artifacts | — | Known — `detach_lightning` disabled by default; requires framework-level fix |
| Navigation history annotation (`removeFromHistory*`) must be manually maintained per screen — easy to miss on new screens | — | Process gap — no automated enforcement |
| VPC/AVC channel monitoring does not cover wrapper playback events | — | Monitoring gap |
| QR code login polling does not gracefully handle network interruption mid-poll (drops silently) | IPTV-51722 | Under investigation |
| Closing an Apple TV hardware session before opening a wrapper app can race with surface initialisation | IPTV-52699 | Fixed |

---

## Improvement Roadmap

1. **Token expiry auto-detection** — Intercept 401/403 on stream start, trigger a transparent `playbackGetData()` retry instead of surfacing a hard error to the user.
2. **Navigation history schema enforcement** — Add a lint-time or config-parse-time validation step that requires `removeFromHistory*` to be declared on every screen with an auth dependency.
3. **GPU memory stability under `detach_lightning`** — Investigate Lightning framework's texture ref-counting to find why long-uptime detach/reattach cycles corrupt GPU memory calculations.
4. **QR code poll resilience** — Add network-interruption detection during device-linking polling and surface a "Reconnecting…" state rather than silently timing out.
5. **Analytics SDK load observability** — Emit a structured log event when any analytics plugin fails to load, so failures appear in monitoring dashboards rather than disappearing silently.
6. **Unified partner onboarding checklist** — Document the `resourceLoadedOnEachPlay`, `removeFromHistory*`, and plugin configuration decisions as a required checklist for each new partner integration.
