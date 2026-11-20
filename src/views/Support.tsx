export function CrisisCard() {
  return (
    <section className="card crisis" role="alert">
      <h2>You don’t have to carry this alone</h2>
      <p>
        If you are thinking about ending your life or hurting yourself, please talk to someone now. These thoughts are
        more common than people realise, and they can ease with support.
      </p>
      <ul>
        <li>
          <strong>US &amp; Canada:</strong> call or text <a href="tel:988">988</a> (Suicide &amp; Crisis Lifeline), any
          time.
        </li>
        <li>
          <strong>UK &amp; Ireland:</strong> call Samaritans on <a href="tel:116123">116 123</a>.
        </li>
        <li>
          <strong>Elsewhere:</strong> find a local line at{' '}
          <a href="https://findahelpline.com" target="_blank" rel="noreferrer">
            findahelpline.com
          </a>
          .
        </li>
        <li>If you are in immediate danger, call your local emergency number.</li>
      </ul>
    </section>
  )
}

export function Support() {
  return (
    <>
      <h1>Support</h1>
      <CrisisCard />
      <section className="card">
        <h2>Feeling overwhelmed right now</h2>
        <p>
          Try a one-minute reset: feel both feet on the floor, look around and name five things you can see, then let
          one long breath out through your mouth.
        </p>
        <a className="button" href="#/practices?need=ground">
          Open grounding practices
        </a>
      </section>
      <section className="card">
        <h2>When to see a professional</h2>
        <p>
          Consider booking with a doctor or therapist if low mood or anxiety has lasted more than two weeks, if it is
          getting in the way of work, sleep or relationships, or if memories of something that happened keep intruding.
          Trauma-focused therapies such as CPT, prolonged exposure and EMDR have strong evidence, and they work best
          with a trained guide.
        </p>
      </section>
    </>
  )
}
