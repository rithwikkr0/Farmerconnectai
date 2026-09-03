import { describe, it, expect } from 'vitest'
import { cn, truncate, formatCompactNumber } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })
})

describe('truncate', () => {
  it('returns string unchanged when under limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis when over limit', () => {
    const result = truncate('hello world', 8)
    expect(result).toHaveLength(8)
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('formatCompactNumber', () => {
  it('formats numbers compactly', () => {
    expect(formatCompactNumber(1200)).toMatch(/1\.2K/i)
    expect(formatCompactNumber(1_000_000)).toMatch(/1M/i)
  })

  it('returns small numbers unchanged', () => {
    expect(formatCompactNumber(42)).toBe('42')
  })
})
