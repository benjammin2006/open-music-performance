// Camera QR reading. Uses the native BarcodeDetector where it exists (Chrome, Android, recent Safari) and
// falls back to jsQR on a downscaled canvas elsewhere. Calls onCode for each decoded string; the caller
// de-duplicates.
import * as jsqrModule from "jsqr";
// jsqr ships CommonJS; depending on the bundler the function is the namespace's default or the namespace itself.
type JsQR = (data: Uint8ClampedArray, width: number, height: number, opts?: { inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" }) => { data: string } | null;
const jsQR = ((jsqrModule as unknown as { default?: unknown }).default ?? jsqrModule) as JsQR;

type Detector = { detect(source: ImageBitmapSource): Promise<{ rawValue: string }[]> };
declare const BarcodeDetector: (new (opts: { formats: string[] }) => Detector) | undefined;

export class Camera {
  private stream: MediaStream | null = null;
  private running = false;
  private canvas = document.createElement("canvas");
  private detector: Detector | null = null;
  private video: HTMLVideoElement;
  private onCode: (code: string) => void;

  constructor(video: HTMLVideoElement, onCode: (code: string) => void) {
    this.video = video;
    this.onCode = onCode;
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    this.video.srcObject = this.stream;
    this.video.setAttribute("playsinline", "true");
    await this.video.play();
    if (typeof BarcodeDetector !== "undefined") {
      try {
        this.detector = new BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        this.detector = null;
      }
    }
    this.running = true;
    void this.loop();
  }

  stop(): void {
    this.running = false;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  get engine(): string {
    return this.detector ? "native" : "jsqr";
  }

  private async loop(): Promise<void> {
    while (this.running) {
      try {
        if (this.video.readyState >= 2) {
          if (this.detector) {
            const codes = await this.detector.detect(this.video);
            for (const c of codes) if (c.rawValue) this.onCode(c.rawValue);
          } else {
            const w = 640;
            const h = Math.round((this.video.videoHeight / this.video.videoWidth) * w) || 480;
            this.canvas.width = w;
            this.canvas.height = h;
            const ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
            ctx.drawImage(this.video, 0, 0, w, h);
            const img = ctx.getImageData(0, 0, w, h);
            const r = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
            if (r?.data) this.onCode(r.data);
          }
        }
      } catch {
        /* a single failed frame is not fatal */
      }
      await new Promise((res) => setTimeout(res, this.detector ? 120 : 200));
    }
  }
}
