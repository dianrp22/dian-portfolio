export function startSora(data: {
  email: string
  tagline: string
  timeline: { y: string; t: string; s?: string; c: string; code: string[]; m: string; h: number }[]
  markers: { t: number; l: string }[]
  branches: { name: string; from: number; to: number; lane: number; commits: number; merge: boolean; note?: string }[]
}): void
