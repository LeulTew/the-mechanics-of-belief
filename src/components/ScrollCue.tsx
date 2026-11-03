interface Props {
  act: number
  beat: number
  onActivate: () => void
}

// A quiet prompt at the two moments the reader needs one: the very start and the very end.
export function ScrollCue({ act, beat, onActivate }: Props) {
  const start = act === 0 && beat === 0
  const end = act === 7 && beat === 1
  if (!start && !end) return null
  return (
    <button type="button" className="scroll-cue" onClick={onActivate}>
      <span>{start ? 'Scroll to enter' : 'Continue to the complete manuscript'}</span>
      <span className="scroll-cue-line" aria-hidden="true" />
    </button>
  )
}
