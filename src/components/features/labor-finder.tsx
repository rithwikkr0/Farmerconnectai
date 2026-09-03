'use client'

import { useState } from 'react'
import { HardHat, Loader2, AlertCircle, MapPin, CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getNearbyLabor, createLaborRequest } from '@/lib/api'
import type { LaborNearbyResponse, LaborWorker, LaborRequestResponse } from '@/lib/api'

const AVAILABILITY_COLOR: Record<string, string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  busy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  unavailable: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

function WorkerCard({ worker }: { worker: LaborWorker }) {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-foreground text-sm font-medium">{worker.name}</p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3" />
              {worker.location} · {worker.distanceKm.toFixed(1)} km
            </p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${AVAILABILITY_COLOR[worker.availability]}`}>
            {worker.availability}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {worker.skills.map((s) => (
            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground font-medium">₹{worker.dailyRate_inr}/day</span>
          <span className="text-muted-foreground">{worker.experience_years}y exp</span>
        </div>
        <p className="text-muted-foreground text-xs">📞 {worker.phone_masked}</p>
        <p className="text-muted-foreground text-xs">🗣 {worker.languages.join(', ')}</p>
      </CardContent>
    </Card>
  )
}

export function LaborFinder() {
  // Search tab state
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [radius, setRadius] = useState('5')
  const [skill, setSkill] = useState('')
  const [searchResult, setSearchResult] = useState<LaborNearbyResponse | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Request tab state
  const [reqForm, setReqForm] = useState({
    farmerName: '', farmerPhone: '', location: '', skill: '',
    startDate: '', durationDays: '', description: '',
  })
  const [reqResult, setReqResult] = useState<LaborRequestResponse | null>(null)
  const [reqLoading, setReqLoading] = useState(false)
  const [reqError, setReqError] = useState<string | null>(null)

  const setReq = (k: string, v: string) => setReqForm((p) => ({ ...p, [k]: v }))

  const handleSearch = async () => {
    const latN = parseFloat(lat)
    const lngN = parseFloat(lng)
    if (isNaN(latN) || isNaN(lngN) || searchLoading) return
    setSearchLoading(true)
    setSearchError(null)
    setSearchResult(null)
    try {
      const data = await getNearbyLabor({
        lat: latN, lng: lngN,
        radius: parseFloat(radius) || 5,
        ...(skill.trim() ? { skill: skill.trim() } : {}),
      })
      setSearchResult(data)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to search labor.')
    } finally {
      setSearchLoading(false)
    }
  }

  const reqValid =
    reqForm.farmerName.trim() && reqForm.farmerPhone.trim() &&
    reqForm.location.trim() && reqForm.skill.trim() &&
    reqForm.startDate && reqForm.durationDays && parseInt(reqForm.durationDays) > 0

  const handleRequest = async () => {
    if (!reqValid || reqLoading) return
    setReqLoading(true)
    setReqError(null)
    setReqResult(null)
    try {
      const data = await createLaborRequest({
        farmerName: reqForm.farmerName,
        farmerPhone: reqForm.farmerPhone,
        location: reqForm.location,
        skill: reqForm.skill,
        startDate: reqForm.startDate,
        durationDays: parseInt(reqForm.durationDays),
        ...(reqForm.description.trim() ? { description: reqForm.description } : {}),
      })
      setReqResult(data)
    } catch (err) {
      setReqError(err instanceof Error ? err.message : 'Failed to submit request.')
    } finally {
      setReqLoading(false)
    }
  }

  return (
    <Tabs defaultValue="search">
      <TabsList>
        <TabsTrigger value="search">Find Workers</TabsTrigger>
        <TabsTrigger value="request">Post a Request</TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="mt-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HardHat className="size-4 text-orange-600" />
              Search by Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Latitude</Label>
                <Input placeholder="e.g. 10.787" value={lat} onChange={(e) => setLat(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Longitude</Label>
                <Input placeholder="e.g. 79.137" value={lng} onChange={(e) => setLng(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Radius (km)</Label>
                <Input type="number" min={1} max={50} value={radius} onChange={(e) => setRadius(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Skill (optional)</Label>
                <Input placeholder="e.g. harvesting" value={skill} onChange={(e) => setSkill(e.target.value)} className="text-sm" />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Tip: Use <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a> to find your lat/lng.
              Demo workers are near Thanjavur (10.787, 79.137).
            </p>
            <Button onClick={() => void handleSearch()} disabled={!lat || !lng || searchLoading} className="w-full sm:w-auto">
              {searchLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Searching…</> : 'Find Workers'}
            </Button>
          </CardContent>
        </Card>

        {searchError && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription>{searchError}</AlertDescription></Alert>}

        {searchResult && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs">
              {searchResult.totalFound === 0
                ? `No workers found within ${searchResult.radiusKm} km. Try increasing the radius.`
                : `${searchResult.totalFound} worker${searchResult.totalFound !== 1 ? 's' : ''} within ${searchResult.radiusKm} km`}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {searchResult.workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="request" className="mt-4 space-y-4">
        {reqResult ? (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle2 className="size-4 text-green-600" />
            <AlertDescription className="text-sm">
              <strong>Request submitted!</strong> ID: <code>{reqResult.requestId}</code>
              <br />{reqResult.message}
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Send className="size-4 text-orange-600" />
                Post a Labor Request
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Your Name</Label>
                <Input placeholder="Farmer name" value={reqForm.farmerName} onChange={(e) => setReq('farmerName', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input placeholder="+91-XXXXXXXXXX" value={reqForm.farmerPhone} onChange={(e) => setReq('farmerPhone', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Input placeholder="Village / Town" value={reqForm.location} onChange={(e) => setReq('location', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Skill Required</Label>
                <Input placeholder="e.g. harvesting" value={reqForm.skill} onChange={(e) => setReq('skill', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input type="date" value={reqForm.startDate} onChange={(e) => setReq('startDate', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration (days)</Label>
                <Input type="number" min={1} placeholder="e.g. 3" value={reqForm.durationDays} onChange={(e) => setReq('durationDays', e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Description (optional)</Label>
                <Input placeholder="e.g. Need 2 workers for paddy harvest on 4 acres" value={reqForm.description} onChange={(e) => setReq('description', e.target.value)} className="text-sm" />
              </div>
              {reqError && <Alert variant="destructive" className="sm:col-span-2"><AlertCircle className="size-4" /><AlertDescription>{reqError}</AlertDescription></Alert>}
              <div className="sm:col-span-2">
                <Button onClick={() => void handleRequest()} disabled={!reqValid || reqLoading} className="w-full sm:w-auto">
                  {reqLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Submitting…</> : 'Submit Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
