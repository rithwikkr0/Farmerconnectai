'use client'

import { useState } from 'react'
import { Sprout, Loader2, AlertCircle, Droplets, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { recommendCrops } from '@/lib/api'
import type { CropRecommendationResponse, CropRecommendation } from '@/lib/api'

const SUITABILITY_COLOR: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

function CropCard({ crop }: { crop: CropRecommendation }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{crop.cropName}</CardTitle>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SUITABILITY_COLOR[crop.suitabilityLabel]}`}>
            {crop.suitabilityLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={crop.suitabilityScore} className="h-1.5 flex-1" />
          <span className="text-muted-foreground w-8 text-right text-xs">{crop.suitabilityScore}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="gap-1 text-xs">
            <Droplets className="size-3" />
            Water: {crop.waterRequirement}
          </Badge>
          {crop.estimatedYield && (
            <Badge variant="outline" className="text-xs">Yield: {crop.estimatedYield}</Badge>
          )}
          {crop.estimatedProfit && (
            <Badge variant="outline" className="gap-1 text-xs">
              <TrendingUp className="size-3" />
              {crop.estimatedProfit}
            </Badge>
          )}
        </div>

        {crop.reasons.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold text-green-700 dark:text-green-400">Why suitable</p>
            <ul className="space-y-0.5">
              {crop.reasons.map((r, i) => (
                <li key={i} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                  <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-green-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {crop.majorRisks.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-400">Major risks</p>
            <ul className="space-y-0.5">
              {crop.majorRisks.map((r, i) => (
                <li key={i} className="text-muted-foreground flex items-start gap-1.5 text-xs">
                  <ShieldAlert className="mt-0.5 size-3 shrink-0 text-red-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {crop.suggestedActions.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold">Suggested actions</p>
            <ol className="space-y-0.5 list-decimal list-inside">
              {crop.suggestedActions.map((a, i) => (
                <li key={i} className="text-muted-foreground text-xs">{a}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CropAdvisor() {
  const [form, setForm] = useState({
    location: '',
    soil: '',
    waterAvailability: '' as 'low' | 'moderate' | 'high' | '',
    landSize: '',
    season: '',
    farmerGoal: '' as 'subsistence' | 'profit' | 'export' | 'mixed' | '',
    additionalContext: '',
  })
  const [result, setResult] = useState<CropRecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const isValid =
    form.location.trim() &&
    form.soil.trim() &&
    form.waterAvailability &&
    form.landSize &&
    parseFloat(form.landSize) > 0 &&
    form.season.trim() &&
    form.farmerGoal

  const handleSubmit = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await recommendCrops({
        location: form.location,
        soil: form.soil,
        waterAvailability: form.waterAvailability as 'low' | 'moderate' | 'high',
        landSize: parseFloat(form.landSize),
        season: form.season,
        farmerGoal: form.farmerGoal as 'subsistence' | 'profit' | 'export' | 'mixed',
        additionalContext: form.additionalContext || undefined,
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sprout className="size-4 text-emerald-600" />
            Tell us about your farm
          </CardTitle>
          <CardDescription className="text-xs">
            Fill in the details below to get personalized crop recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="cr-location" className="text-xs">Location</Label>
            <Input id="cr-location" placeholder="e.g. Thanjavur, Tamil Nadu"
              value={form.location} onChange={(e) => set('location', e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cr-soil" className="text-xs">Soil Type</Label>
            <Input id="cr-soil" placeholder="e.g. black cotton, alluvial clay"
              value={form.soil} onChange={(e) => set('soil', e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cr-water" className="text-xs">Water Availability</Label>
            <Select value={form.waterAvailability} onValueChange={(v) => set('waterAvailability', v ?? '')}>
              <SelectTrigger id="cr-water" className="text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (rainfed)</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High (borewell / canal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="cr-land" className="text-xs">Land Size (acres)</Label>
            <Input id="cr-land" type="number" min={0.5} step={0.5} placeholder="e.g. 3"
              value={form.landSize} onChange={(e) => set('landSize', e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cr-season" className="text-xs">Season</Label>
            <Input id="cr-season" placeholder="e.g. Kharif, Samba, Rabi"
              value={form.season} onChange={(e) => set('season', e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cr-goal" className="text-xs">Farmer Goal</Label>
            <Select value={form.farmerGoal} onValueChange={(v) => set('farmerGoal', v ?? '')}>
              <SelectTrigger id="cr-goal" className="text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="subsistence">Subsistence (family food)</SelectItem>
                <SelectItem value="profit">Profit (market sale)</SelectItem>
                <SelectItem value="export">Export quality</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="cr-notes" className="text-xs">Additional context (optional)</Label>
            <Input id="cr-notes" placeholder="e.g. Near canal, previous crop was cotton"
              value={form.additionalContext} onChange={(e) => set('additionalContext', e.target.value)} className="text-sm" />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={() => void handleSubmit()} disabled={!isValid || loading} className="w-full sm:w-auto">
              {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Analyzing your farm…</> : 'Get Crop Recommendations'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <div>
            <h2 className="text-foreground text-base font-semibold">
              Recommendations for {result.location}
            </h2>
            <p className="text-muted-foreground text-xs">{result.generalAdvice}</p>
          </div>
          {result.recommendations.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recommendations returned. Try adjusting your inputs.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.recommendations.map((crop) => (
                <CropCard key={crop.cropName} crop={crop} />
              ))}
            </div>
          )}
          <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
            <AlertCircle className="size-4 text-yellow-600" />
            <AlertDescription className="text-xs">{result.safetyNote}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
