# MagnetoClip User Guide

**Advanced Download Manager — Capture the Web.**

MagnetoClip is a Windows desktop download manager that captures files, videos,
music, documents and torrents from the web into smart, auto-sorted categories.
It combines a multi-connection download core with a browser extension that
detects downloadable content as you browse.

---

## Table of contents

1. [Getting started](#1-getting-started)
2. [Activating your license](#2-activating-your-license)
3. [Interface tour](#3-interface-tour)
4. [Adding downloads](#4-adding-downloads)
5. [Browser integration](#5-browser-integration)
6. [Capturing files and streaming media](#6-capturing-files-and-streaming-media)
7. [Torrents](#7-torrents)
8. [Remote dashboard](#8-remote-dashboard)
9. [Proxy profiles](#9-proxy-profiles)
10. [Settings reference](#10-settings-reference)
11. [File preview](#11-file-preview)
12. [Webpage archive](#12-webpage-archive)
13. [Pause control](#13-pause-control)
14. [Speed test](#14-speed-test)
15. [System tray](#15-system-tray)
16. [Where MagnetoClip stores your data](#16-where-magnetoclip-stores-your-data)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Getting started

### Requirements

- Windows 10 or 11
- An internet connection
- A valid serial key (release builds only — development builds skip licensing);
  new machines also get a free 7-day trial

### Starting the app

Launch **MagnetoClip** from the Start menu or the desktop shortcut. A splash
screen appears while the app loads, then the main window opens on the
**Overview** page.

If you started MagnetoClip for the first time you will be asked to activate
your license before the main window appears (see the next section).

---

## 2. Activating your license

Each serial key binds to one PC. The format is
`MGCL-XXXXX-XXXXX-XXXXX-XXXXX`.

1. When the **Activate MagnetoClip** window appears, paste or type your serial.
   Extra spaces, dashes and lowercase letters are cleaned up automatically.
2. Click **Activate**.
3. On success the app opens. The PC's machine ID is recorded by the license
   server and this computer becomes the key's bound device.
4. If the key is already bound to another PC you will see which hostname holds
   it. Deactivate it there first (**Settings → License → Deactivate this
   PC…**), or contact support to reset it.

Other messages you may see:

| Message | Meaning |
|---|---|
| *Could not reach the license server* | Check your internet connection and retry |
| *This serial key has been revoked* | The vendor disabled the key — contact support |
| *This serial key has expired* | Renew the license to continue |
| *That serial was not recognized* | Typo in the key |
| *Too many attempts* | Wait about a minute and try again |

Your serial is stored securely in the operating system credential store
(Windows Credential Manager) — never in plain files. On later launches the app
silently re-validates against the server.

To move the license to another PC: open **Settings**, scroll to **License**
and click **Deactivate this PC…**. This frees the slot immediately so the same
serial can activate elsewhere.

---

## 3. Interface tour

The top toolbar switches between pages; the left sidebar filters the download
list and can be collapsed with the ☰ button. The former **Sites** page has been
removed — recommendations for third-party download sites now appear as links at
the bottom of the **Downloads** and **Torrents** pages.

### Overview

A live dashboard: four stat cards (**Active downloads**, **Completed**,
**Total downloaded**, **Current speed**) plus up-to-five recent activity
cards with progress bars, speeds and ETAs.

### Downloads

The main workbench. Each row shows name, size, a colored progress bar with
percentage, speed, time left and time added.

Toolbar: **Select All · Add · Start · Pause · Remove**

Right-click any row for actions:

- Completed items → **Open File**, **Open File Location**, **Restart Download**
- Failed items → **Retry Download**
- Active/paused/queued items → **Pause / Resume / Start**
- Always available → **Copy URL**, **Remove from List**

Double-click a row to open the **Download details** dialog (live progress,
status, speed, ETA, Start/Pause controls).

At the bottom of the page, the link **Best Sites to download anime and
streaming videos for free** opens a Devallix guide in your default browser.
MagnetoClip is not affiliated with, and does not endorse, any site listed there.

The sidebar narrows the view: **All Downloads**, **Finished**, **Unfinished**,
or any of the eight categories (Image, Video, Audio, Document, Compressed,
App/Software, Torrent, Other). Counter badges show how many items match each
filter.

### Detected

Files the browser extension found on pages you visited: file name, size, type,
source page and detection time. Select entries and click **Download**, or
right-click to copy URLs / remove them. Double-click checks the row and starts
the download.

### Completed

Only finished, failed or stopped downloads — handy for finding files to open.

### Torrents

Dedicated torrent manager (see [section 7](#7-torrents)). At the bottom of the
page, the link **Best Sites to download torrent files** opens a guide to
torrent sites in your default browser.

### Analytics

Six stat cards (total, completed, failed, data downloaded, average speed, peak
speed), two bar charts covering the last 14 days (**Downloads per day** and
**Bandwidth per day**) and a per-category breakdown.

### Pause

A single switch that pauses every running and waiting download instantly, plus
an optional auto-resume countdown timer (see [section 13](#13-pause-control)).

### Speed

Built-in network speed test that measures download, upload and latency with an
animated gauge, keeps a history and flags possible ISP throttling (see
[section 14](#14-speed-test)).

### Browser

Setup hub for the MagnetoClip Companion extension (see
[section 5](#5-browser-integration)).

### Settings

Every tunable option, grouped into General, Downloads, Duplicate Detection,
Network Speed Test, File Preview, Webpage Archiver, Browser & Capture, Torrent,
Proxy, Updates, Remote Control and License (see
[section 10](#10-settings-reference)).

---

## 4. Adding downloads

Click **Add** on the Downloads page (or add from the Torrents page for
magnets).

**New Download dialog fields:**

| Field | Notes |
|---|---|
| URL | Accepts `http://`, `https://`, `blob:` and `magnet:` addresses |
| Filename | Optional — keep the server-provided name if blank |
| Save to | Defaults to your configured download folder |
| Category | Pre-selected automatically from the file type |
| Connections | 1–64 parallel connections for this download |
| Proxy profile | Route this download through a saved proxy, or Direct |
| Username / Password | Optional HTTP basic-auth credentials (stored in the OS keyring) |
| Cookies | Optional header-style cookies, e.g. `session=abc123` |

**About blob: URLs:** right-click → *Copy link address* on an embedded video
or image often yields a `blob:` address that only exists inside the browser
tab. With the MagnetoClip extension installed, the app asks the browser for
the real bytes of that resource — just keep the tab open until the fetch
completes.

Downloads are segmented automatically: the file is split into parts fetched in
parallel, connections adapt to server behavior, interrupted jobs resume from
where they stopped (`.mclip` sidecar files), transient failures retry with
backoff, and finished files pass an integrity check before being marked
**Completed**.

Status meanings: Queued, Scheduled, Connecting, Downloading, Paused, Retrying,
Verifying, Completed, Failed, Verification failed, Stopped.

---

## 5. Browser integration

The MagnetoClip Companion extension lets MagnetoClip see downloadable files as you browse,
capture media streams, resolve `blob:` URLs, and optionally take over every
browser download.

**Supported browsers:** Google Chrome, Microsoft Edge, Firefox, Brave, Vivaldi,
Chromium, Opera.

**Store availability:** The extension is available on **Firefox Add-ons (AMO)**,
**Microsoft Edge Add-ons**, and **Opera Add-ons**. **Chrome Web Store** support
is coming soon. Brave, Vivaldi, and other Chromium browsers can use the Chrome
Web Store listing when it becomes available.

### Install and setup (recommended)

1. **Install the MagnetoClip desktop app** and open it.
2. In MagnetoClip, open the **Browser** page and tick **Enable browser integration**.
3. Under **Installed browsers**, find your browser and click **Install host**.
   This registers MagnetoClip's native messaging host (`com.magnetoclip.host`) so the
   browser extension can communicate with the desktop app.
4. Install the **MagnetoClip Companion** extension from your browser's store:
   - **Firefox:** install from Firefox Add-ons (AMO).
   - **Microsoft Edge:** install from Microsoft Edge Add-ons.
   - **Opera:** install from Opera Add-ons.
   - **Chrome/Brave/Vivaldi/Chromium:** Chrome Web Store listing coming soon; use the
     development/unpacked option below in the meantime.
5. Reload/restart the browser if prompted, keep MagnetoClip running, and confirm the
   Browser page status shows the host/extension as ready. The status dot turns green
   when everything is ready.

If you update MagnetoClip and the store extension stops connecting, return to the
**Browser** page and click **Install host** again for that browser to refresh the
native messaging host registration.

Use **Re-detect browsers** after installing a new browser. The **Auto-install**
button (when shown) may push the published extension via browser policy (where
supported by the browser/environment).

### Development option: load unpacked extension

For development, testing, or before a store listing is available, you can load the
unpacked extension manually:

1. In MagnetoClip, open **Browser** and click **Prepare extension** (or use the staged
   extension folder prepared by the app/build).
2. Load it in your browser:
   - **Chrome/Edge/Brave/Vivaldi/Chromium/Opera:** open the browser's extensions page
     (for example `chrome://extensions`, `edge://extensions`, or `opera://extensions`),
     enable **Developer mode**, click **Load unpacked**, and choose the Chromium
     extension folder shown on the Browser page.
   - **Firefox:** open `about:debugging#/runtime/this-firefox`, choose **Load
     Temporary Add-on**, and pick the extension manifest from the Firefox extension
     folder.
3. Keep MagnetoClip running and install/verify the native messaging host for that
   browser. After reloading or rebuilding the unpacked extension, reload it in the
   browser extensions page and test again.

### Capture modes

| Option | What it does |
|---|---|
| Enable browser integration | Master switch for the native messaging host |
| Capture media streams | Detect video/audio streams on pages you visit |
| Make MagnetoClip the default downloader | Intercept *every* browser download and route it through MagnetoClip |
| Show a confirmation dialog before downloading captures | Ask before each captured file |
| Notify me when downloadable files are found on a page | Tray notification when content is detected |

When a file is detected you get a **Downloadable file detected** popup with
filename, save location, category and connection count, plus four choices:

| Choice | What it does |
|---|---|
| **Skip** | Reject just this file |
| **Skip all** | Move all currently detected files to the **Detected** page; future files still ask for confirmation |
| **Download later** | Queue the file without starting it |
| **Download now** | Start the download immediately |

To turn the confirmation popups off entirely, use **Settings → Browser &
Capture → Skip all detected files without asking**. That is the only control
that silences them, and it is just as easy to turn back on.

---

## 6. Capturing files and streaming media

MagnetoClip recognizes videos, audio streams, images, documents, archives and
installers by extension (100+ extensions across ten media types) and
auto-sorts them into matching categories and folders when **Auto-categorize by
file type** is enabled.

Streaming platforms are handled through a dedicated engine supporting dozens
of popular video/music sites plus direct HLS (`.m3u8`) and DASH (`.mpd`) streams.
The app can also sniff audio/video manifests directly from the pages you visit,
and fall back to browser-assisted capture for challenge-protected streams.

Pick a default quality under **Settings → Browser & Capture → Streaming
quality**: **Best**, **1080p**, **720p**, **Audio only**, or **Ask each
time**. When *Ask each time* is selected (or a video offers a finer choice),
MagnetoClip shows a resolution-ladder picker so you can choose the exact format
before downloading.

**Playlists** are supported too: paste a playlist URL into the **Add**
dialog and MagnetoClip lists every video with name and duration. Tick the ones
you want (or *Select all*), cap the number of items if you like, and download
them in one shot — already-downloaded videos are tracked in an archive so you
are not asked about them again. Streamed video and
audio tracks are merged automatically (via bundled FFmpeg tooling) into a
single playable file, and titles/metadata are inferred where possible.

---

## 7. Torrents

Open the **Torrents** page to manage magnet links and `.torrent` files.

### Finding sites to download from

The built-in **Sites** page has been removed. Instead, two links at the bottom
of the app open curated Devallix guides in your default browser:

- On the **Downloads** page:
  [Best Sites to download anime and streaming videos for free](https://www.devallix.com/blog/useful-websites/top-5-best-anime-streaming-sites-in-2026/)
- On the **Torrents** page:
  [Best Sites to download torrent files](https://www.devallix.com/blog/useful-websites/10-best-torrent-sites-in-2026-features-categories-and-safety-tips/)

MagnetoClip is a general-purpose download tool. It is not affiliated with, does
not endorse, and is not responsible for any third-party site or its content.
Always confirm that you are entitled to download the content you save, and
review each site's terms and the law in your jurisdiction.

### Adding a torrent

- **Add** — paste a magnet URI (`magnet:?xt=…`) or a `.torrent` URL.
- **Upload** — pick a local `.torrent` file.
- After loading you get a preview: name, total size, tracker, info hash and
  the full file list, then options for save folder, category, **sequential
  download** and **seed after download**.

You can also associate MagnetClip with the OS once (Settings → Torrent):

- **Register to open .torrent files** — double-clicking a `.torrent` opens
  MagnetoClip.
- **Register magnet: links** — clicking magnet links in the browser opens
  MagnetoClip.

### Engine options (Settings → Torrent)

| Setting | Default | Meaning |
|---|---|---|
| Enable DHT | On | Trackerless peer discovery |
| Enable PEX | On | Peer exchange from connected peers |
| Enable encryption | On | Obfuscate peer traffic |
| Listen port | 6881 | Incoming peer connections |
| Max connections | 500 | Per-torrent peer ceiling |
| Max upload slots | 4 | Simultaneous uploads per torrent |
| Prefer TCP over uTP | On | Favour plain TCP for transfers |
| Disk cache | 256 MB | Memory used for disk read/write caching |
| Hashing threads | 4 | Threads that hash incoming pieces |
| Request queue | 1500 | Outstanding requests per peer |
| Connections per torrent | 0 | Cap per-torrent connections (0 = no cap) |
| Max download speed | Unlimited | Global torrent download limit |
| Max upload speed | Unlimited | Global upload limit |
| Max active torrents | 5 | Queue size for unfinished torrents |
| Max active downloads | 3 | How many actually transfer at once |
| Sequential download | Off | Fetch pieces in order (enables near-instant preview playback) |
| Auto-seed | Off | Keep seeding after completion |

The table shows progress, speed, **peers/seeds** counts and ETA. Right-click a
completed torrent and choose **Start Seeding** to share it manually.

---

## 8. Remote dashboard

Control downloads from your phone or another computer **on the same local
network**.

1. **Settings → Remote Control** → tick **Enable remote dashboard**.
2. Leave the port at **8477** unless it conflicts.
3. Click **Show QR…** and scan the code with your phone, or type the displayed
   URL into its browser.

Access is protected by a pairing token; **Regenerate Token** invalidates all
previously paired devices at once. The dashboard can pause, resume and watch
downloads — it never exposes your filesystem.

---

## 9. Proxy profiles

**Settings → Proxy → Manage proxy profiles…**

Create any number of named profiles:

- Type: `http`, `https` or `socks5`
- Host and port
- Optional username/password (stored in the OS keyring, never in the database)

Choose a default profile for new downloads, or pick per-download in the Add
dialog. Use **Direct (no proxy)** to bypass.

---

## 10. Settings reference

### Downloads

| Setting | Default | Range |
|---|---|---|
| Simultaneous downloads | 3 | 1–32 |
| Connections per download | 16 | 1–64 |
| Write in place (skip post-download merge) | on | — |
| Max bandwidth (0 = unlimited) | unlimited | MB/s cap |
| Network timeout | 30 s | 5–300 s |
| Max retries | 5 | 0–20 |
| Verify TLS certificates for downloads | on | — |
| Custom User-Agent | a modern desktop browser UA | free text |
| Default download folder | *(choose)* | folder |
| Auto-categorize by file type | on | — |
| Theme | dark | dark / light |
| Start with system | on | — |

### Browser

See the capture-modes table in [section 5](#5-browser-integration), plus
**Streaming quality** (Best / 1080p / 720p / Audio only / *Ask each time*) and
**Video quality** (the default resolution/format behavior, including *Ask each
time* for the per-video resolution picker). **FFmpeg folder** lets you point the
app at your own FFmpeg installation instead of the bundled one.

### Duplicate Detection

| Setting | Default | Meaning |
|---|---|---|
| Detect files you have already downloaded | on | Compare new downloads against a local hash index |
| Skip duplicates automatically | off | When on, duplicates are skipped instead of asking |
| Index files after a download completes | on | Add finished files to the duplicate index |

Filenames are matched first (fast); a hash comparison (xxHash-based) confirms a
true duplicate. When a duplicate is found you can **Open the existing file**,
**Download anyway**, or **Skip**. Use **Scan Downloads Folder** to build the
index from files you already have.

### Network Speed Test

| Setting | Default | Meaning |
|---|---|---|
| Enable built-in network speed tests | on | Master switch for the Speed page |
| Run speed tests automatically | off | Periodically run a test in the background |
| Test size | 25 MB | Amount downloaded per test |
| Interval | 12 h | How often automatic tests run |

### File Preview

| Setting | Default | Meaning |
|---|---|---|
| Enable built-in file preview | on | Master switch for the in-app viewer (see [section 11](#11-file-preview)) |

### Webpage Archive

| Setting | Default | Meaning |
|---|---|---|
| Enable webpage archiving | on | Master switch for the Archiver (see [section 12](#12-webpage-archive)) |
| Inline images as base64 | on | Embed images directly in the HTML |
| Inline CSS | on | Embed stylesheets so they survive offline |
| Inline JavaScript | off | Embed scripts too — can change how pages render |
| Max resource size | 5 MB | Skip resources larger than this |

### Torrent

See the engine-options table in [section 7](#7-torrents).

### Updates

Automatic checking is on by default; press **Check Now** to look manually.
When an update is found: **Download** fetches it (progress shown, integrity
verified), then **Install** closes MagnetoClip, applies the update and
restarts the app automatically.

### Remote Control

Enable/port/QR/regenerate token — see [section 8](#8-remote-dashboard).

### License

Shows the masked serial and last-verified timestamp, with
**Deactivate this PC…** to free the key for another computer.

---

## 11. File preview

Finished downloads can be previewed **inside the app** — images, text, video,
audio and torrent metadata — without opening an external program. Preview only
improves the experience of downloads you already have: nothing extra is
downloaded and no new files are created.

### Where to find it

- **Downloads page** — right-click a completed download and choose **Preview**.
- **Download Details** — the **Preview** button on a finished download.

### What the in-app viewer can show

- **Images** — `.jpg/.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.svg`, `.tiff`,
  `.heic/.heif`, `.avif` and more, with zoom and fit-to-window
- **Text and source code** — `.txt`, `.json`, `.csv`, `.xml`, `.md`, `.py`,
  `.js`, `.css` and more, up to **5 MB**
- **Video** — `.mp4`, `.mkv`, `.webm`, `.avi`, `.mov`, `.m4v` and more, played
  with playback controls
- **Audio** — `.mp3`, `.flac`, `.ogg`, `.wav`, `.aac`, `.m4a` and more, with
  playback controls
- **Torrents** — metadata: name, size, info hash and file list

**PDFs** are handed to the system's default PDF viewer instead. Files the
viewer does not recognise open in their default application. To switch the
whole feature off, clear **Settings → Built-in File Preview**.

---

## 12. Webpage archive

Save any webpage as a **self-contained offline copy**: one `.html` file with
its images and stylesheets embedded, ready to open with no internet.

### Archiving from the browser

With browser integration enabled (see [section 5](#5-browser-integration)),
right-click any `http://` or `https://` page and choose **Archive this page
with MagnetoClip**. The app fetches the page server-side — only the URL (and
cookie/referrer data) crosses the native-messaging bridge, never the page's
bytes — and saves it as `<title>.html` in your download folder as a
**Webpage** download.

### Archiving from the app

On the Downloads page click **Add**, paste the page's address, and tick
**Save as a self-contained webpage archive (offline HTML)**.

### Tuning

Embedding options live under **Settings → Webpage Archive**. Images and CSS
are inlined by default for a faithful offline copy; JavaScript embedding is
off by default because it can change how pages render. **Max resource size**
skips page resources larger than the limit.

---

## 13. Pause control

The **Pause** page replaces the old weekly time-window scheduler with one
unambiguous control: a single switch that pauses everything, with an optional
countdown that resumes downloads automatically.

### Pausing

Open **Pause** and tick **Pause all downloads**. Every running and waiting
download stops immediately, and downloads added while paused stay in the
paused list instead of starting. The status label confirms the current state.

To resume, untick the switch — or wait for the auto-resume timer (below). The
pause state is saved with your settings and survives restarts.

### Auto-resume

While paused you can set **Automatically resume after** to a number of hours
(1–168). The default **0 h (off)** keeps downloads paused until you flip the
switch back. With a timer set, the page shows a live countdown
(*Resuming in 3 h 05 min*) and downloads restart on their own when it reaches
zero.

### How it works

- Waiting and running downloads pause right away.
- Downloads added while paused stay in the paused list.
- Flip the switch back on (or wait for the timer) to resume.

---

## 14. Speed test

The **Speed** page measures your connection with a built-in test:

- **Run Test** — full test: download → upload → latency. Progress shows the
  current phase (*Download…* / *Upload…*) with a percentage, and the animated
  gauge centres on the upload speed while uploading.
- **Upload Test** — measures upload speed and latency only.
- **Export CSV** — saves your test history to a CSV file.

### Results

- **Download** and **Upload** cards — throughput in Mbps.
- **Latency** card — ping in milliseconds.
- **Server** card — the test server used.
- **ISP** label — your provider, when identified.
- **History** — your recent test runs with timestamps.
- **ISP Throttling** — compares runs over time and warns when a result looks
  throttled.

A card shows `--` until its metric has been measured at least once. Use
**Settings → Network Speed Test** to enable the page, turn on automatic
background tests, and tune the test size and interval.

---

## 15. System tray

MagnetoClip lives in the tray while running. The tooltip shows active count
and aggregate speed. The tray menu offers:

- **Open MagnetoClip**
- **Pause All / Resume All**
- **Open Remote…** — shows the pairing QR
- **License…** — serial and last validation time
- **Exit**

Clicking a finished-download notification reveals the file in Explorer;
clicking a detected-file notification jumps to the Detected page.

---

## 16. Where MagnetoClip stores your data

| Data | Location |
|---|---|
| Downloads database (SQLite) | Per-user application-data directory |
| Serial key | Windows Credential Manager (OS keyring) |
| Proxy passwords | OS keyring |
| Logs | Structured JSON logs in the log directory (credentials are scrubbed automatically) |

Analytics shown on the Analytics page are computed **locally** from your own
download history; nothing is uploaded.

---

## 17. Troubleshooting

**The app asks for a serial every start.**
Check your internet connection; the app must reach the license server to
validate. If the network is fine, re-enter the key once.

**"Verification failed" on a download.**
The file did not match its expected integrity data after transfer. Use
right-click → **Retry Download**.

**Speed test cards show `--`.**
A card stays `--` until its metric has been measured: run **Run Test** to fill
all cards, or **Upload Test** for upload + latency only.

**Blob download hangs at 0 %.**
Keep the browser tab the URL was copied from open until the fetch completes.

**Extension not detecting anything.**
On the Browser page confirm: integration enabled, host installed for your
browser, the MagnetoClip Companion extension installed (from your browser store
or loaded unpacked for development), and the status dot green. If needed, click
**Install host** again, reload/restart the browser, then reload the page you are
browsing.

**Torrents show no peers.**
Enable DHT and PEX in Settings, verify the listen port is reachable if you
router-filters traffic, and try a healthy magnet/torrent.

**Remote dashboard unreachable from phone.**
Phone and PC must be on the same Wi-Fi/LAN; check the port (8477) and that the
server status reads *Running*; re-pair by scanning a fresh QR after
regenerating the token.

**Forgot which PC holds my license.**
The activation error names the bound hostname; deactivate there, or request a
binding reset from support.

---

*MagnetoClip is developed by Devallix. It is a general-purpose download tool —
you are responsible for the content you download and for complying with
applicable law. See `docs/EULA.md` for the license terms and the Terms of
Service for acceptable use.*
