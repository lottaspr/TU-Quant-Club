import type { ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { CLUB, EMAIL } from '../content'

/** Shown wherever the club still has to supply real details. */
function Fill({ children }: { children: ReactNode }) {
  return <mark className="fill">{children}</mark>
}

function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: ReactNode }) {
  return (
    <div className="page">
      <section className="legal container">
        <Reveal as="span" className="eyebrow">{eyebrow}</Reveal>
        <Reveal as="h1" className="h1 legal__title" delay={80}>{title}</Reveal>
        <Reveal as="p" className="muted legal__updated" delay={140}>Last updated: {updated}</Reveal>
        <Reveal className="legal__body" delay={200}>{children}</Reveal>
      </section>
    </div>
  )
}

export function Imprint() {
  return (
    <LegalPage eyebrow="Legal" title="Imprint" updated="October 2026">
      <h2>Information according to § 5 DDG</h2>
      <p>
        {CLUB}
        <br />
        <Fill>Registered name of the association, e.g. “TU Quant Club e.V.”</Fill>
        <br />
        <Fill>Street and number</Fill>
        <br />
        <Fill>Postcode</Fill> Munich, Germany
      </p>

      <h2>Represented by</h2>
      <p>
        <Fill>Name of the president / board member(s) authorised to represent the club</Fill>
      </p>

      <h2>Contact</h2>
      <p>
        Email: {EMAIL}
      </p>

      <h2>Register entry</h2>
      <p>
        <Fill>Register court and register number (if registered as an e.V.), otherwise remove this section</Fill>
      </p>

      <h2>Responsible for content according to § 18 (2) MStV</h2>
      <p>
        <Fill>Name and address of the responsible person</Fill>
      </p>

      <h2>Affiliation</h2>
      <p>
        {CLUB} is an independent student society. Unless stated otherwise, it is not an official body of any
        university, and the content of this website does not represent the views of any university.
      </p>
    </LegalPage>
  )
}

export function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Data Privacy" updated="October 2026">
      <h2>1. Who is responsible</h2>
      <p>
        The controller for data processing on this website is {CLUB}, <Fill>full address as in the imprint</Fill>,
        email: {EMAIL}.
      </p>

      <h2>2. Hosting</h2>
      <p>
        This website is hosted on <Fill>hosting provider, e.g. GitHub Pages (GitHub Inc., USA)</Fill>. When you visit
        the site, the host processes technical data such as your IP address, the date and time of the request and your
        browser type in server log files. This is needed to deliver the site securely (Art. 6 (1)(f) GDPR).
      </p>

      <h2>3. Cookies and tracking</h2>
      <p>
        This website does not use cookies, analytics or tracking tools. The interactive charts run entirely in your
        browser and do not send any data.
      </p>

      <h2>4. Contacting us and applying</h2>
      <p>
        If you email us or submit an application, we process the details you send (such as your name, email address,
        study programme and CV) only to answer you and to run the application process (Art. 6 (1)(b) GDPR). We delete
        application data <Fill>retention period, e.g. six months after the decision</Fill>, unless you join the club.
        The application form is provided by <Fill>form provider, e.g. Google Forms or Tally</Fill>.
      </p>

      <h2>5. External links</h2>
      <p>
        Links to LinkedIn, Instagram and other sites take you to services operated by third parties. Their own privacy
        policies apply there.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You have the right to access, rectification, erasure, restriction of processing, data portability and to
        object to processing of your personal data (Art. 15–21 GDPR). To use these rights, email {EMAIL}. You also have
        the right to lodge a complaint with a data protection authority, for example the Bavarian State Office for Data
        Protection Supervision (BayLDA).
      </p>
    </LegalPage>
  )
}

export function Disclaimer() {
  return (
    <LegalPage eyebrow="Legal" title="Disclaimer" updated="October 2026">
      <h2>No investment advice</h2>
      <p>
        Everything on this website and at {CLUB} events, including workshops, lectures, research articles, models
        and simulations, is for educational purposes only. It is not investment, financial, legal or tax advice, and
        it is not a recommendation to buy or sell any financial instrument. Trading involves risk, including the loss
        of your capital.
      </p>

      <h2>Simulations and data</h2>
      <p>
        The charts and interactive models on this site, such as the volatility surface and the Monte Carlo lab, use
        simulated data. They do not show real market prices and say nothing about future performance.
      </p>

      <h2>Accuracy of content</h2>
      <p>
        We prepare our content carefully, but we cannot guarantee that it is complete, correct or up to date. Opinions
        in research articles belong to their authors and not to the club as a whole.
      </p>

      <h2>External links</h2>
      <p>
        This website links to external sites. We have no control over their content and are not responsible for it.
        The operator of a linked site is always responsible for its content. If we become aware of unlawful content on
        a linked site, we will remove the link.
      </p>

      <h2>Partners</h2>
      <p>
        Mentioning a partner firm does not mean that the firm endorses the club’s content, or that the club endorses
        the firm’s products.
      </p>
    </LegalPage>
  )
}
