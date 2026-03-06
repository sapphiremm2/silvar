import { ParticleBackground } from '@/components/ui/ParticleBackground'
import Link from 'next/link'

export const metadata = { title: 'Terms of Service — silvar.gg' }

const LAST_UPDATED = 'June 1, 2025'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-[#00f2ff] mb-4 uppercase tracking-wide">{title}</h2>
      <div className="space-y-3 text-[#94a3b8] text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-[#00f2ff] shrink-0">—</span><span>{children}</span></li>
}

export default function TermsPage() {
  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-[#64748b] uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-4xl font-black text-[#e2e8f0] mb-3">
            Terms of <span className="gradient-cyan">Service</span>
          </h1>
          <p className="text-sm text-[#64748b]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="glass rounded-2xl border border-[rgba(0,242,255,0.1)] p-8">

          <Section title="1. Acceptance of Terms">
            <P>By accessing or using silvar.gg ("the Platform", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. We reserve the right to update these terms at any time — continued use after a change constitutes acceptance.</P>
            <P>You must be at least 13 years old to use silvar.gg. By using the Platform you confirm you meet this requirement. Certain features (including Stripe-processed payments) may require you to be 18 or to have parental consent.</P>
          </Section>

          <Section title="2. Sapphires — Platform Credits">
            <P><strong className="text-[#e2e8f0]">Sapphires are non-redeemable platform credits with no monetary value.</strong> They cannot be exchanged for real money, withdrawn, or transferred to any external platform. Purchasing Sapphires is final.</P>
            <ul className="space-y-2 mt-2">
              <Li>1 USD = 50 Sapphires. This rate may change at any time.</Li>
              <Li>Sapphires have no value outside of silvar.gg.</Li>
              <Li>Unused Sapphires are forfeited if your account is terminated for rule violations.</Li>
              <Li>We do not guarantee Sapphire balances will be preserved indefinitely if the Platform ceases operation, though we will make reasonable effort to provide notice.</Li>
            </ul>
          </Section>

          <Section title="3. Purchases & Payments">
            <P>All payments are processed by Stripe. By making a purchase you agree to Stripe's terms of service. We do not store your payment card details.</P>
            <ul className="space-y-2 mt-2">
              <Li><strong className="text-[#e2e8f0]">All Sapphire purchases are final and non-refundable.</strong> Once Sapphires are credited to your account the transaction is complete.</Li>
              <Li>Purchases of virtual items using Sapphires are also final. Digital goods cannot be returned once delivered.</Li>
              <Li>If an item you purchased is not delivered due to a platform error, contact support within 48 hours and we will investigate and remedy the situation.</Li>
              <Li>Initiating a chargeback or payment dispute for Sapphire purchases without first contacting our support team will result in immediate permanent account suspension and forfeiture of your balance.</Li>
            </ul>
          </Section>

          <Section title="4. P2P Marketplace">
            <P>The P2P Marketplace allows users to list and purchase virtual Roblox game items from one another. silvar.gg acts as a platform intermediary only — we do not own, store, or guarantee P2P items.</P>
            <ul className="space-y-2 mt-2">
              <Li>A platform fee (displayed at checkout) is deducted from the seller's Sapphires on each completed P2P sale. This fee is non-refundable.</Li>
              <Li>Sellers are solely responsible for fulfilling their listings as described. Misrepresenting items constitutes fraud and will result in account termination.</Li>
              <Li>Buyers and sellers must complete trades in good faith. Deliberately failing to deliver after receiving payment is a bannable offence.</Li>
              <Li>silvar.gg is not liable for losses arising from user-to-user disputes. We will review reports and take action against bad actors but cannot guarantee recovery of Sapphires in all cases.</Li>
              <Li>We reserve the right to remove any listing at our discretion without notice.</Li>
            </ul>
          </Section>

          <Section title="5. Blind Boxes">
            <P>Blind Boxes are a game of chance. Purchasing a Blind Box does not guarantee any specific item. Odds are weighted by rarity and displayed on each box where possible.</P>
            <ul className="space-y-2 mt-2">
              <Li>Blind Box purchases are final and non-refundable.</Li>
              <Li>Items won from Blind Boxes are added to your inventory and cannot be exchanged back for Sapphires.</Li>
              <Li>silvar.gg reserves the right to adjust item pools and weightings at any time.</Li>
            </ul>
          </Section>

          <Section title="6. Prohibited Conduct">
            <P>The following are strictly prohibited and will result in immediate account suspension or permanent ban:</P>
            <ul className="space-y-2 mt-2">
              <Li>Chargebacks, fraudulent payment disputes, or credit card fraud.</Li>
              <Li>Using stolen payment methods or accounts belonging to others.</Li>
              <Li>Creating multiple accounts to exploit promotions, bonuses, or referral systems (multi-accounting).</Li>
              <Li>Using bots, scripts, or automation tools to interact with the Platform.</Li>
              <Li>Attempting to manipulate item prices, Sapphire balances, or platform systems.</Li>
              <Li>Selling, buying, or transferring accounts.</Li>
              <Li>Harassing, threatening, or abusing other users.</Li>
              <Li>Any form of money laundering or use of the Platform for illegal purposes.</Li>
              <Li>Attempting to bypass or exploit platform security measures.</Li>
            </ul>
          </Section>

          <Section title="7. Account Suspension & Termination">
            <P>We reserve the right to suspend or permanently terminate any account at our discretion, with or without notice, for violations of these Terms or behaviour we determine to be harmful to the Platform or its users.</P>
            <P>Upon termination for rule violations, all Sapphires and items in the account are forfeited. If you believe your account was suspended in error, contact us at <a href="mailto:support@silvar.gg" className="text-[#00f2ff] hover:underline">support@silvar.gg</a>.</P>
          </Section>

          <Section title="8. Intellectual Property">
            <P>Roblox and all associated game titles, characters, and assets are the property of Roblox Corporation and their respective developers. silvar.gg is an independent marketplace and is not affiliated with, endorsed by, or sponsored by Roblox Corporation.</P>
            <P>The silvar.gg brand, logo, site design, and original content are owned by silvar.gg. You may not reproduce or distribute them without permission.</P>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <P>The Platform is provided "as is" and "as available" without any warranty of any kind. We do not guarantee that the Platform will be uninterrupted, error-free, or that item values will remain stable. Virtual item markets are volatile — prices fluctuate.</P>
            <P>We are not responsible for losses due to technical failures, server downtime, or changes to the underlying Roblox games that affect item values or availability.</P>
          </Section>

          <Section title="10. Limitation of Liability">
            <P>To the maximum extent permitted by law, silvar.gg and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to loss of Sapphires, loss of items, or loss of data.</P>
            <P>Our total liability in any dispute shall not exceed the amount you paid to us in the 30 days preceding the event giving rise to the claim.</P>
          </Section>

          <Section title="11. Governing Law">
            <P>These Terms are governed by the laws of the United States. Any disputes shall be resolved through good-faith negotiation first. If unresolved, disputes shall be settled through binding arbitration rather than in court, except where prohibited by applicable law.</P>
          </Section>

          <Section title="12. Contact">
            <P>For questions about these Terms, contact us at <a href="mailto:support@silvar.gg" className="text-[#00f2ff] hover:underline">support@silvar.gg</a>.</P>
          </Section>

        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-sm text-[#64748b] hover:text-[#00f2ff] transition-colors">
            View our Privacy Policy →
          </Link>
        </div>
      </div>
    </>
  )
}
