'use client'

import { useState } from 'react'
import { Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFarmContext } from '@/hooks/use-farm-context'

interface FarmContextFormProps {
  onSaved?: () => void
}

export function FarmContextForm({ onSaved }: FarmContextFormProps) {
  const { context, updateContext } = useFarmContext()
  const [localState, setLocalState] = useState({ ...context })

  const set = (key: string, value: string | number) =>
    setLocalState((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    updateContext(localState)
    onSaved?.()
  }

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Leaf className="size-4 text-green-600" />
          Your Farm Profile
        </CardTitle>
        <CardDescription className="text-xs">
          This context is sent with every AI request so responses are tailored to your farm.
          Stored locally — never sent to a server on its own.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="location" className="text-xs">Location / Village</Label>
          <Input
            id="location"
            placeholder="e.g. Thanjavur"
            value={localState.location ?? ''}
            onChange={(e) => set('location', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="state" className="text-xs">State</Label>
          <Input
            id="state"
            placeholder="e.g. Tamil Nadu"
            value={localState.state ?? ''}
            onChange={(e) => set('state', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="soilType" className="text-xs">Soil Type</Label>
          <Input
            id="soilType"
            placeholder="e.g. black cotton, alluvial"
            value={localState.soilType ?? ''}
            onChange={(e) => set('soilType', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="landSize" className="text-xs">Land Size (acres)</Label>
          <Input
            id="landSize"
            type="number"
            min={0}
            step={0.5}
            placeholder="e.g. 3"
            value={localState.landSizeAcres ?? ''}
            onChange={(e) => set('landSizeAcres', parseFloat(e.target.value) || 0)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="water" className="text-xs">Water Availability</Label>
          <Select
            value={localState.waterAvailability ?? ''}
            onValueChange={(v) => set('waterAvailability', v ?? '')}
          >
            <SelectTrigger id="water" className="text-sm">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (rainfed)</SelectItem>
              <SelectItem value="moderate">Moderate (seasonal canal)</SelectItem>
              <SelectItem value="high">High (borewell / river)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="season" className="text-xs">Current Season</Label>
          <Input
            id="season"
            placeholder="e.g. Kharif, Samba, Rabi"
            value={localState.season ?? ''}
            onChange={(e) => set('season', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="crop" className="text-xs">Primary Crop</Label>
          <Input
            id="crop"
            placeholder="e.g. rice, cotton, groundnut"
            value={localState.primaryCrop ?? ''}
            onChange={(e) => set('primaryCrop', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="livestock" className="text-xs">Livestock (optional)</Label>
          <Input
            id="livestock"
            placeholder="e.g. 2 cows, 10 goats"
            value={localState.livestock ?? ''}
            onChange={(e) => set('livestock', e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={handleSave} size="sm" className="w-full sm:w-auto">
            Save Farm Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
