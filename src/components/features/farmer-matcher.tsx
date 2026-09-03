'use client'

import { useState } from 'react'
import { Users, Loader2, AlertCircle, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { matchFarmers } from '@/lib/api'
import type { FarmerMatchResponse, FarmerMatch } from '@/lib/api'

function FarmerCard({ match }: { match: FarmerMatch }) {
  const { farmer } = match
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm">{farmer.name}</CardTitle>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3" />
              {farmer.location}
              {match.distanceKm !== undefined && ` · ${match.distanceKm.toFixed(1)} km`}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {farmer.experience_years}y exp
          </Badge>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Star className="size-3 text-yellow-500" />
          <Progress value={match.matchScore} className="h-1.5 flex-1" />
          <span className="text-muted-foreground text-xs">{match.matchScore}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-xs leading-relaxed">{match.geminiExplanation}</p>
        <div className="flex flex-wrap gap-1">
          {farmer.crops.map((c) => (
            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
          ))}
        </div>
        {match.matchReasons.length > 0 && (
          <ul className="space-y-0.5">
            {match.matchReasons.map((r, i) => (
              <li key={i} className="text-muted-foreground text-xs">· {r}</li>
            ))}
          </ul>
        )}
        <p className="text-muted-foreground text-xs">📞 {farmer.phone_masked}</p>
        <Badge variant="secondary" className="text-xs">Demo data</Badge>
      </CardContent>
    </Card>
  )
}

export function FarmerMatcher() {
  const [crop, setCrop] = useState('')
  const [problem, setProblem] = useState('')
  const [location, setLocation] = useState('')
  const [result, setResult] = useState<FarmerMatchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = crop.trim() || problem.trim() || location.trim()

  const handleSearch = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await matchFarmers({
        ...(crop.trim() ? { crop: crop.trim() } : {}),
        ...(problem.trim() ? { problem: problem.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
        maxResults: 5,
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find farmer matches.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-violet-600" />
            Find Farmer Peers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="fm-crop" className="text-xs">Crop</Label>
              <Input id="fm-crop" placeholder="e.g. rice" value={crop}
                onChange={(e) => setCrop(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fm-problem" className="text-xs">Problem</Label>
              <Input id="fm-problem" placeholder="e.g. brown planthopper" value={problem}
                onChange={(e) => setProblem(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fm-loc" className="text-xs">Location</Label>
              <Input id="fm-loc" placeholder="e.g. Tamil Nadu" value={location}
                onChange={(e) => setLocation(e.target.value)} className="text-sm" />
            </div>
          </div>
          <p className="text-muted-foreground text-xs">Fill at least one field to search.</p>
          <Button onClick={() => void handleSearch()} disabled={!isValid || loading} className="w-full sm:w-auto">
            {loading
              ? <><Loader2 className="mr-2 size-4 animate-spin" />Finding matches…</>
              : 'Find Farmers'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs">
            {result.matches.length === 0
              ? 'No nearby matches found. Try different search terms.'
              : `Showing ${result.matches.length} of ${result.totalCandidates} farmers — ranked by Gemini AI`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.matches.map((match) => (
              <FarmerCard key={match.farmer.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
