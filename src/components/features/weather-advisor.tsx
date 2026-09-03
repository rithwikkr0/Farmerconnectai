'use client'

import { useState } from 'react'
import { CloudSun, Loader2, AlertCircle, Thermometer, Droplets, Wind, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getWeather, getWeatherAdvice } from '@/lib/api'
import type { WeatherData, WeatherAdviceResponse } from '@/lib/api'

function WeatherNow({ weather }: { weather: WeatherData }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-foreground text-base font-semibold">{weather.location}</h2>
        <Badge variant="outline" className="text-xs">DEMO</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <Thermometer className="size-5 text-orange-500" />
            <div>
              <p className="text-foreground text-lg font-bold">{weather.current.temperature_c}°C</p>
              <p className="text-muted-foreground text-xs">{weather.current.condition}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <Droplets className="size-5 text-blue-500" />
            <div>
              <p className="text-foreground text-lg font-bold">{weather.current.humidity_pct}%</p>
              <p className="text-muted-foreground text-xs">Humidity</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-2 p-3">
            <Wind className="size-5 text-slate-500" />
            <div>
              <p className="text-foreground text-lg font-bold">{weather.current.wind_kph} km/h</p>
              <p className="text-muted-foreground text-xs">Wind</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">5-Day Forecast</p>
        <div className="grid grid-cols-5 gap-1.5">
          {weather.forecast.map((day) => (
            <Card key={day.date}>
              <CardContent className="p-2 text-center">
                <p className="text-muted-foreground text-xs">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                <p className="text-foreground text-sm font-semibold">{day.max_temp_c}°</p>
                <p className="text-muted-foreground text-xs">{day.min_temp_c}°</p>
                <p className="text-blue-500 text-xs">{day.rainfall_mm}mm</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function WeatherAdviceResult({ advice }: { advice: WeatherAdviceResponse }) {
  return (
    <div className="space-y-4">
      <div className="bg-sky-50 dark:bg-sky-950 rounded-lg p-4">
        <p className="text-sky-900 dark:text-sky-100 text-sm leading-relaxed">{advice.advice}</p>
      </div>
      {advice.risks.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-red-700 dark:text-red-400">Risks to watch</p>
          <ul className="space-y-1">
            {advice.risks.map((r, i) => (
              <li key={i} className="text-muted-foreground flex items-start gap-2 text-xs">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
      {advice.preventiveActions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-green-700 dark:text-green-400">Preventive actions</p>
          <ul className="space-y-1">
            {advice.preventiveActions.map((a, i) => (
              <li key={i} className="text-muted-foreground flex items-start gap-2 text-xs">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function WeatherAdvisor() {
  const [location, setLocation] = useState('')
  const [crop, setCrop] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advice, setAdvice] = useState<WeatherAdviceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetWeather = async () => {
    if (!location.trim() || loading) return
    setLoading(true)
    setError(null)
    setWeather(null)
    setAdvice(null)
    try {
      const data = await getWeather(location.trim())
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get weather data.')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAdvice = async () => {
    if (!weather || adviceLoading) return
    setAdviceLoading(true)
    setError(null)
    try {
      const data = await getWeatherAdvice({
        location: weather.location,
        ...(crop.trim() ? { crop: crop.trim() } : {}),
      })
      setAdvice(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI advice.')
    } finally {
      setAdviceLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CloudSun className="size-4 text-sky-600" />
            Check Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter location (e.g. Chennai, Tamil Nadu)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleGetWeather()}
              className="text-sm"
            />
            <Button onClick={() => void handleGetWeather()} disabled={!location.trim() || loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
          {weather && (
            <div className="space-y-1">
              <Label htmlFor="wa-crop" className="text-xs">Your crop (optional — for tailored advice)</Label>
              <div className="flex gap-2">
                <Input
                  id="wa-crop"
                  placeholder="e.g. rice, tomato, cotton"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => void handleGetAdvice()}
                  disabled={adviceLoading}
                >
                  {adviceLoading ? <Loader2 className="size-4 animate-spin" /> : 'Get AI Advice'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {weather && (
        <Tabs defaultValue={advice ? 'advice' : 'weather'}>
          <TabsList>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="advice" disabled={!advice}>
              {adviceLoading ? 'Analyzing…' : 'AI Advice'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weather" className="mt-4">
            <WeatherNow weather={weather} />
          </TabsContent>
          <TabsContent value="advice" className="mt-4">
            {advice && <WeatherAdviceResult advice={advice} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
