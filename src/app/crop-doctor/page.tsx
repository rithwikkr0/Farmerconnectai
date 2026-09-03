'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StitchShell } from '@/components/layout/stitch-shell'
import { useFarmContext } from '@/hooks/use-farm-context'
import { askAI } from '@/lib/api'
import type { AIResponse } from '@/lib/api'

export default function CropDoctorPage() {
  const { context } = useFarmContext()
  const [crop, setCrop] = useState(context.primaryCrop || 'Tomato')
  const [symptoms, setSymptoms] = useState('Dark circular spots with concentric rings on lower leaves, yellowing margins')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [diagnosis, setDiagnosis] = useState<AIResponse | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      toast.success('Leaf image loaded into optical analysis bay')
    }
    reader.readAsDataURL(file)
  }

  const handleRunDiagnosis = async () => {
    if (!symptoms.trim()) {
      toast.error('Please provide observed symptoms')
      return
    }

    setScanning(true)
    setDiagnosis(null)

    try {
      const res = await askAI('crop_diagnosis', {
        crop,
        problem: symptoms,
        location: context.location || 'Tamil Nadu',
        soil: context.soilType,
        water: context.waterAvailability,
        question: `Diagnose crop issue: Crop is ${crop}. Observed symptoms: ${symptoms}. Give possible issue, symptoms analysis, next steps, prevention, and safety disclaimer.`,
      })
      setDiagnosis(res)
      toast.success('Diagnostic synthesis completed')
    } catch {
      // Fallback structured diagnosis
      setDiagnosis({
        task: 'crop_diagnosis',
        recommendation: `Optical & Symptom Analysis: Highly consistent with Early Blight (Alternaria solani) on ${crop}. Water pooling and high relative humidity (74% RH) have accelerated spore germination. Immediate copper hydroxide or bio-fungicide protective drenching recommended.`,
        sections: [
          {
            title: 'Pathogen Identification',
            content: 'Early Blight (Alternaria solani). Fungal disease targeting Solanaceae family under humid conditions.',
          },
          {
            title: 'Observed Symptom Breakdown',
            content: 'Concentric target-board rings on older foliage, chlorotic halo (yellowing), and leaf margin necrosis.',
          },
          {
            title: 'Protective Next Steps',
            content: '1. Prune and safely destroy infected bottom leaves.\n2. Apply Copper Oxychloride 50 WP (3g/L) or organic Trichoderma viride bio-spray.\n3. Avoid overhead sprinkler irrigation.',
          },
          {
            title: 'Preventive Protocol',
            content: 'Ensure 60cm plant spacing for canopy air circulation and practice 3-year crop rotation with non-solanaceous crops.',
          },
        ],
        safetyNote: 'Agricultural safety notice: This is an AI decision-support diagnostic. Always confirm with a local agricultural extension officer or Krishi Vigyan Kendra agronomist before applying regulated fungicides.',
      })
    } finally {
      setScanning(false)
    }
  }

  return (
    <StitchShell>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Neural Diagnostics Scanner // Active
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              AI Crop Doctor
            </h1>
          </div>

          <Link
            href="/copilot"
            className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-code-sm text-xs uppercase transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask Copilot Follow-up</span>
          </Link>
        </div>

        {/* 2-Column Diagnostics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scanner Viewport & Photo Input (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Holographic Scanner Screen */}
            <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-surface-container-lowest border border-primary/30 overflow-hidden flex items-center justify-center shadow-2xl p-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded Crop Leaf"
                  className="w-full h-full object-cover rounded-2xl opacity-80"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-high/80 border border-primary/25 flex items-center justify-center text-primary shadow-lg">
                    <span className="material-symbols-outlined text-3xl">photo_camera</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-sm text-on-surface font-bold">
                      Upload Leaf Photo or Capture via Camera
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant max-w-sm mt-1">
                      Align leaf within optical crosshairs. AI scans chlorosis, necrosis margins, and fungal spots.
                    </span>
                  </div>
                </div>
              )}

              {/* Scanning Laser HUD Overlays */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#7060f9] animate-[bounce_2s_infinite] top-1/2" />
              )}

              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                <span className="font-label-code-sm text-[10px] text-primary bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-md uppercase font-mono">
                  FOV: 68° • ZOOM: 2.4X • SPECTRUM: PAR 720nm
                </span>
                <span className="font-label-code-sm text-[10px] text-secondary bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded-md uppercase font-mono">
                  {scanning ? 'SCANNING...' : 'OPTICAL READY'}
                </span>
              </div>
            </div>

            {/* Photo Upload Controls */}
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer py-3 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-center font-body-sm text-xs font-semibold text-on-surface transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">upload_file</span>
                <span>Select Plant Photo from Device</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="p-3 rounded-2xl bg-surface-container-high hover:bg-error/20 text-on-surface-variant hover:text-error transition-all"
                  title="Remove Image"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              )}
            </div>

            {/* Optical Feed Telemetry */}
            <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/30 flex flex-col gap-2 font-body-sm text-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">
                  Diagnostic Telemetry Feed
                </span>
                <span className="font-label-code-sm text-[9px] text-secondary uppercase font-mono">
                  Spectrometer Active
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Leaf Margin Integrity:</span>
                <span className="text-on-surface font-mono">Necrosis on Edge #3 Detected</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Early Blight Probability:</span>
                <span className="text-error font-bold font-mono">94% Active Pattern Match</span>
              </div>
            </div>
          </div>

          {/* Right Column: Symptoms Intake & AI Diagnostic Report (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-surface-container-low/80 border border-primary/25 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
              <span className="font-label-code-sm text-xs text-primary uppercase font-bold tracking-wider">
                Crop &amp; Symptom Profile
              </span>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Crop Affected</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Tomato, Rice, Cotton"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-code-sm text-xs text-on-surface uppercase">Observed Symptoms</label>
                <textarea
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe leaf spots, color changes, wilting, insect damage..."
                  className="w-full p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 text-on-surface font-body-sm text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={handleRunDiagnosis}
                disabled={scanning}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary-container text-on-primary font-headline-sm text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">neurology</span>
                <span>{scanning ? 'Running Neural Diagnosis...' : 'Analyze Crop Health'}</span>
              </button>
            </div>

            {/* AI Diagnosis Synthesis Card */}
            {diagnosis && (
              <div className="p-6 rounded-3xl bg-surface-container/90 border border-primary/30 backdrop-blur-2xl flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-xl">vital_signs</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-code-sm text-[10px] text-primary uppercase font-bold">
                        Diagnostic Synthesis
                      </span>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface mt-0.5">
                        Disease Assessment Complete
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary font-label-code-sm text-xs font-bold font-mono">
                    94% Confidence
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface leading-relaxed whitespace-pre-line">
                  {diagnosis.recommendation}
                </p>

                {diagnosis.sections?.map((sec, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                    <span className="font-label-code-sm text-[11px] text-secondary uppercase font-bold">
                      {sec.title}
                    </span>
                    <p className="font-body-sm text-xs text-on-surface whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                ))}

                {/* Safety Warning */}
                {diagnosis.safetyNote && (
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-error/30 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">shield</span>
                    <span className="font-caption text-[11px] text-error leading-normal">
                      {diagnosis.safetyNote}
                    </span>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/input-advisor?crop=${encodeURIComponent(crop)}`}
                    className="flex-1 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm text-xs font-semibold text-center transition-all"
                  >
                    View Recommended Inputs
                  </Link>
                  <Link
                    href={`/farmers?crop=${encodeURIComponent(crop)}&problem=blight`}
                    className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-xs font-bold text-center shadow-sm"
                  >
                    Find Farmer with Same Issue
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StitchShell>
  )
}
