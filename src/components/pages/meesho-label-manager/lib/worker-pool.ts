import type { ProviderId } from "@/components/pages/label-provider/provider"
import type { WorkerPageResult, WorkerRequest, WorkerResponse } from "./worker-protocol"

interface Pending {
  resolve: (v: WorkerPageResult) => void
  reject: (e: Error) => void
}

class PageWorker {
  private readonly worker: Worker
  private readonly pending = new Map<number, Pending>()
  private readonly opened = new Map<number, Promise<number>>()
  private readonly openWaiters = new Map<number, { resolve: (n: number) => void; reject: (e: Error) => void }>()
  private nextId = 0
  private broken: Error | null = null

  constructor() {
    this.worker = new Worker(new URL("./label.worker.ts", import.meta.url), { type: "module" })
    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => this.onMessage(e.data)
    this.worker.onerror = (e) => this.fail(new Error(e.message || "worker failed to start"))
    this.worker.onmessageerror = () => this.fail(new Error("worker message could not be decoded"))
  }

  private onMessage(msg: WorkerResponse): void {
    if (msg.type === "opened" || msg.type === "open-failed") {
      const w = this.openWaiters.get(msg.fileIndex)
      this.openWaiters.delete(msg.fileIndex)
      if (msg.type === "opened") w?.resolve(msg.numPages)
      else w?.reject(new Error(msg.error))
      return
    }
    const p = this.pending.get(msg.id)
    if (!p) return
    this.pending.delete(msg.id)
    if (msg.ok) p.resolve(msg.result)
    else p.reject(new Error(msg.error))
  }

  private fail(err: Error): void {
    this.broken = err
    for (const p of this.pending.values()) p.reject(err)
    for (const w of this.openWaiters.values()) w.reject(err)
    this.pending.clear()
    this.openWaiters.clear()
  }

  private send(msg: WorkerRequest, transfer: Transferable[] = []): void {
    this.worker.postMessage(msg, transfer)
  }

  /** Opens a file on this worker once; resolves to its page count. */
  open(fileIndex: number, bytes: ArrayBuffer): Promise<number> {
    let p = this.opened.get(fileIndex)
    if (!p) {
      if (this.broken) return Promise.reject(this.broken)
      p = new Promise<number>((resolve, reject) => this.openWaiters.set(fileIndex, { resolve, reject }))
      // pdf.js takes ownership of the buffer, so the worker always gets a copy.
      const copy = bytes.slice(0)
      this.send({ type: "open", fileIndex, data: copy }, [copy])
      this.opened.set(fileIndex, p)
    }
    return p
  }

  async page(fileIndex: number, bytes: ArrayBuffer, page: number, providerId: ProviderId): Promise<WorkerPageResult> {
    await this.open(fileIndex, bytes)
    if (this.broken) throw this.broken
    const id = this.nextId++
    return new Promise<WorkerPageResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.send({ type: "page", id, fileIndex, page, providerId })
    })
  }

  terminate(): void {
    this.fail(new Error("worker terminated"))
    this.worker.terminate()
  }
}

/** Off-main-thread page processing, one pdf.js instance per worker. */
export class PageWorkerPool {
  readonly workers: PageWorker[]

  static supported(): boolean {
    return (
      typeof Worker !== "undefined" &&
      typeof OffscreenCanvas !== "undefined" &&
      typeof OffscreenCanvas.prototype.convertToBlob === "function"
    )
  }

  constructor(size: number) {
    this.workers = Array.from({ length: size }, () => new PageWorker())
  }

  terminate(): void {
    for (const w of this.workers) w.terminate()
  }
}
