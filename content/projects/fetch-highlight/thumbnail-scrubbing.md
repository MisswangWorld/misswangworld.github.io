# Thumbnail Scrubbing — Frame Preview During Trick Play

## Overview

Thumbnail Scrubbing is a VOD playback enhancement that displays video frame previews as users fast-forward or rewind. Rather than navigating blind through a progress bar, users see real-time thumbnail images of the content at their current seek position — enabling precise, confident scene navigation without interrupting playback.

---

## Problem Statement

Traditional trick play is a guessing game. Users see only a moving scrubber head with no visual context, forcing repeated trial-and-error seeks to land on the right scene. This is especially painful for long-form content — movies, sports, documentaries — where the target moment could be anywhere across hours of footage.

Thumbnail Scrubbing makes the seek experience visual: users see what they're navigating to, turning an opaque interaction into an intuitive one.

---

## Two Display Modes

| Mode | Description |
|------|-------------|
| **Full Mode (Carousel)** | A horizontal strip of 13 thumbnails spans the screen. The center frame highlights the current position; 6 frames on each side provide temporal context. |
| **Single Mode** | One larger thumbnail floats above the scrubber head, tracking the user's current seek position. |

Both modes are toggled via release settings, allowing per-platform or per-partner configuration without a code change.

---

## Technical Highlights

### 1. WebVTT + Sprite Sheet Architecture

For each VOD asset, the server generates a `.vtt` file that maps time ranges to coordinates within a sprite sheet:

```
WEBVTT

00:00:00.000 --> 00:00:10.000
sprite.jpg#xywh=0,0,200,112

00:00:10.000 --> 00:00:20.000
sprite.jpg#xywh=200,0,200,112
```

The client fetches and parses this file asynchronously at playback start, building an in-memory `vttMap` keyed by time range. All subsequent frame lookups are O(1) table reads — no additional network requests during trick play.

### 2. Sprite Sheet Clipping via Clip Offset

The Lightning rendering framework's `setClipOffset()` API crops individual frames from the sprite sheet using the `xywh` coordinates parsed from the VTT file. A single image resource serves the entire timeline — eliminating per-frame asset fetches and significantly reducing both network overhead and memory footprint.

### 3. Dual-Buffer Preloading

In Single Mode, two image containers run in parallel:

- **Primary container** — the currently visible thumbnail
- **Cache container** — the next frame, silently preloaded at `opacity: 0.001`

On transition, only visibility is toggled. The actual image load is only triggered when the `src` changes, preventing redundant requests and eliminating the flicker that would otherwise accompany frame changes.

### 4. Speed-Adaptive Refresh Strategy

Update frequency and step size scale with trick play speed to balance visual smoothness against rendering cost:

| Speed | Update Interval | Step | Pace (s) |
|-------|----------------|------|----------|
| 2x – 8x | 300ms | 0.2 – 0.8 | 10 |
| 16x – 64x | 500ms | 4 | 4 |

At lower speeds, small steps and frequent updates keep the preview feeling responsive. At high speeds, larger steps and slower intervals prevent the renderer from being overwhelmed.

---

## Technical Challenges & Trade-offs

### Challenge 1: VTT Parsing Robustness

VTT files in the wild are inconsistent — irregular line endings, variable timestamp precision, missing `#xywh` fields. The parser must handle malformed inputs gracefully while caching the parsed result in memory for the full playback session.

### Challenge 2: Image Upscaling Limitation

The server-side image processor does not support upscaling sprite sheets. On 1080p displays (`precision > 1`), the client manually scales thumbnails at the rendering layer — a known workaround that incurs a minor quality loss.

**Trade-off:** Keeping the asset generation pipeline simple and uniform pushes the scaling cost to the client. Acceptable for now; the right fix is server-side upscaling support.

### Challenge 3: Memory Pressure from Texture Accumulation

The Lightning framework does not reliably release textures in carousel (Full) mode. With 13 continuously updating texture containers during an extended trick play session, memory consumption can grow unbounded (IPTV-50856).

**Trade-off:** Full Mode delivers a richer preview experience but at a higher memory cost. It is the default; Single Mode is available as a lower-footprint fallback for constrained devices.

### Challenge 4: Scrubber Boundary Clamping

In Single Mode, the thumbnail must float above the scrubber marker while remaining fully on screen. The horizontal position is clamped between `64px` and `1220px`. At the extreme edges of the timeline, the thumbnail shifts away from the marker center — an intentional visual compromise to keep the full thumbnail visible.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| VTT fetch fails or file is malformed | Silent degradation — scrubbing continues without thumbnails, playback unaffected |
| `vttMap` contains ≤ 1 entry | Treated as invalid; Thumbnail Scrubbing is disabled for this asset |
| HLS offline download content | Feature disabled (`enableThumbnailScrub: false`) to prevent remote VTT fetch failures |
| Rewind direction | Speed value is negated; step direction reverses. Same rendering path as forward trick play |
| Fewer than 13 frames near timeline boundaries | `Math.max(0, ...)` clamp applied; missing slots render empty |
| Clip coordinates unchanged between updates | `setClipOffset()` call is skipped entirely — no redundant render work |

---

## Known Issues

| Issue | Ticket | Status |
|-------|--------|--------|
| Lightning does not release textures in Full Mode; prolonged trick play causes memory growth | IPTV-50856 | Open — requires framework-level fix |
| Scrub highlighter border persisted on screen after trick play ended | IPTV-52013 | Fixed |
| Complex release settings state machine caused configuration inconsistencies | IPTV-52048 | Fixed — logic simplified |
| Sprite sheet upscaling on 1080p screens produces softened thumbnails (client-side workaround) | — | Known limitation |
| Thumbnail Scrubbing has no monitoring coverage on VPC/AVC channels | — | Monitoring gap — to be addressed |

---

## Improvement Roadmap

1. **Server-side upscaling support** — Eliminate the client-side scaling hack and restore full sharpness on 1080p displays.
2. **Explicit texture teardown** — Proactively destroy Full Mode texture objects when trick play exits, rather than relying on the Lightning GC.
3. **Eager VTT prefetch** — Move VTT fetch earlier in the content lifecycle (e.g., detail page load) to eliminate any perceived latency on first fast-forward.
4. **Boundary indicator refinement** — At timeline extremes in Single Mode, offset a pointer arrow rather than clamping the thumbnail, preserving accurate scrubber alignment.
5. **Monitoring parity** — Extend Thumbnail Scrubbing availability alerts to VPC/AVC channels to match VOD coverage.
