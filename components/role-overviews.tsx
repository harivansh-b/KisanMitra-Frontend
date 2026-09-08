import {
  ArrowRight, BadgeCheck, Check, ChevronRight, ClipboardCheck, Clock3, IndianRupee, Leaf, MapPin,
  LockKeyhole, PackageCheck, ShieldCheck, Thermometer, Truck, Users, Warehouse, Building2, ShoppingCart, FlaskConical,
} from 'lucide-react';

import { roleOverviewFixture as overviewData } from '@/data/fixtures';
import { Button } from '@/components/ui/button';
import { VerifiedIdentity } from '@/components/verified-badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

type RoleId = keyof typeof overviewData | string;
type Tone = 'neutral' | 'positive' | 'warning';

interface OverviewProps {
  roleId: RoleId;
  onAction: (actionMessage: string) => void;
  onNavigate: (sectionLabel: string) => void;
  onOpenAgreement?: (agreementId: string) => void;
}

export const ROLE_ACCESS_RIGHTS = {
  farmer: {
    title: { en: 'Farmer Platform Access Rights & Verified Capabilities', mr: 'शेतकरी व्यासपीठ वापर अधिकार आणि वैशिष्ट्ये' },
    subtitle: { en: 'Verified grower privileges for direct market access, storage, and logistics', mr: 'थेट शेतमाल विक्री, गोदाम आणि मालवाहतूक वापर हक्क' },
    rights: [
      {
        title: { en: 'Direct Produce Sales & Listing', mr: 'थेट शेतमाल विक्री व लिस्टिंग' },
        desc: { en: 'List crops (Onion, Cotton, Soybean) with quality grade directly for Buyers & FPOs', mr: 'कांदा, सोयाबीन, कापूस इत्यादी शेतमालाची थेट खरेदीदार व FPO ला विक्री करा' },
        tag: { en: 'Core Right', mr: 'मुख्य अधिकार' },
      },
      {
        title: { en: 'Live Mandi Price Stock Ticker', mr: 'थेट बाजार भाव (Mandi Ticker)' },
        desc: { en: 'Real-time price streams from Lasalgaon, Nashik, Pune, Solapur mandis with stock charts', mr: 'लासलगाव, नाशिक, पुणे आणि सोलापूर बाजार समित्यांमधील थेट भाव पहा' },
        tag: { en: 'Live Access', mr: 'थेट माहिती' },
      },
      {
        title: { en: 'Warehouse & Cold Storage Booking', mr: 'गोदाम व शीतगृह जागा नोंदणी' },
        desc: { en: 'Reserve certified cold storage space across Maharashtra to avoid distress sale', mr: 'उत्तम भावासाठी महाराष्ट्रातील मान्यताप्राप्त गोदामांमध्ये जागा आरक्षित करा' },
        tag: { en: 'Storage Access', mr: 'गोदाम हक्क' },
      },
      {
        title: { en: 'Logistics & Transport Dispatch', mr: 'मालवाहतूक वाहन बुकिंग' },
        desc: { en: 'Request pickup trucks & agri transport logistics from local providers', mr: 'शेतातून माल उचलण्यासाठी स्थानिक वाहतूकदारांची सेवा मिळवा' },
        tag: { en: 'Logistics', mr: 'वाहतूक हक्क' },
      },
      {
        title: { en: 'Quality Grading Certificate', mr: 'गुणवत्ता चाचणी प्रमाणपत्र' },
        desc: { en: 'Get NABL/APEDA compliant grade certificates from Quality Assessors', mr: 'मान्यताप्राप्त गुणतज्ज्ञांकडून गुणवत्ता आणि आद्रता प्रमाणपत्र मिळवा' },
        tag: { en: 'Verified', mr: 'प्रमाणित' },
      },
      {
        title: { en: 'Direct Buyer Escrow Contracts', mr: 'सुरक्षित खरेदीदार करार' },
        desc: { en: 'Sign binding digital trade agreements with escrow payment protection', mr: 'पैशांच्या सुरक्षेसाठी थेट खरेदीदारांसोबत डिजीटल करार करा' },
        tag: { en: 'Escrow Protected', mr: 'सुरक्षित व्यवहार' },
      },
    ],
  },
  fpo: {
    title: { en: 'FPO Organization Access Rights & Aggregation Privileges', mr: 'FPO संस्था वापर अधिकार व वैशिष्ट्ये' },
    subtitle: { en: 'Collective farmer management, bulk contract fulfillment, and margin tracking', mr: 'शेतकरी गट एकत्रीकरण आणि घाऊक पुरवठा व्यवस्थापन' },
    rights: [
      {
        title: { en: 'Farmer Member Aggregation', mr: 'शेतकरी गट एकत्रीकरण' },
        desc: { en: 'Aggregate produce volumes across member farmers in your district', mr: 'जिल्ह्यातील सभासद शेतकऱ्यांचा माल एकत्र करून मोठा पुरवठा तयार करा' },
        tag: { en: 'Collective Right', mr: 'गट अधिकार' },
      },
      {
        title: { en: 'Bulk Procurement Sourcing', mr: 'घाऊक खरेदी करार व्यवस्थापन' },
        desc: { en: 'B2B sourcing contracts with institutional corporate buyers', mr: 'मोठ्या कॉर्पोरेट खरेदीदारांशी घाऊक पुरवठा करार करा' },
        tag: { en: 'Institutional', mr: 'संस्थात्मक' },
      },
      {
        title: { en: 'Collective Storage Management', mr: 'गट साठवणूक गोदाम वाटप' },
        desc: { en: 'Allocate FPO warehouse quota for member farmer produce storage', mr: 'सभासदांच्या मालासाठी FPO गोदामांचे नियोजन व वाटप करा' },
        tag: { en: 'Storage Operations', mr: 'गोदाम हक्क' },
      },
    ],
  },
  buyer: {
    title: { en: 'Agri Buyer Access Rights & Procurement Requisitions', mr: 'शेतमाल खरेदीदार वापर अधिकार व वैशिष्ट्ये' },
    subtitle: { en: 'Direct farmer/FPO sourcing, verified crop quality, and escrow contracts', mr: 'थेट शेतकरी/FPO पुरवठा खरेदी, गुणवत्ता तपासणी आणि सुरक्षित करार' },
    rights: [
      {
        title: { en: 'Crop Sourcing Requisitions', mr: 'खरेदी मागणी नोंदणी (Requisition)' },
        desc: { en: 'Issue volume requirements with specific grade & delivery parameters', mr: 'हव्या असलेल्या पिकांची श्रेणी व मुदतीसह खरेदी मागणी नोंदवा' },
        tag: { en: 'Procurement', mr: 'खरेदी हक्क' },
      },
      {
        title: { en: 'Digital Escrow Trade Agreements', mr: 'डिजिटल एस्क्रो व्यापार करार' },
        desc: { en: 'Secure seller commitments with locked escrow trade terms', mr: 'शेतकरी व FPO सोबत सुरक्षित डिजिटल एस्क्रो करार निश्चित करा' },
        tag: { en: 'Secure Escrow', mr: 'सुरक्षित एस्क्रो' },
      },
      {
        title: { en: 'Lab Quality Report Access', mr: 'प्रयोगशाळा गुणवत्ता अहवाल' },
        desc: { en: 'Review certified moisture and grading reports before dispatch release', mr: 'माल उचलण्यापूर्वी लॅब गुणवत्ता अहवाल ऑनलाइन तपासा' },
        tag: { en: 'Verified Sourcing', mr: 'प्रमाणित खरेदी' },
      },
    ],
  },
  storage: {
    title: { en: 'Storage Manager Access Rights & Capacity Management', mr: 'गोदाम व शीतगृह व्यवस्थापक वापर अधिकार' },
    subtitle: { en: 'Warehouse capacity tracking, deposit receipt issuance, and climate logs', mr: 'गोदाम क्षमता ट्रॅकिंग आणि पावती नोंदणी' },
    rights: [
      {
        title: { en: 'Warehouse Capacity Management', mr: 'गोदाम क्षमता ट्रॅकिंग' },
        desc: { en: 'Manage dry warehouse and cold storage occupancy in MT', mr: 'गोदाम आणि शीतगृहाची उपलब्ध क्षमता (MT) व्यवस्थापित करा' },
        tag: { en: 'Facility Right', mr: 'गोदाम अधिकार' },
      },
      {
        title: { en: 'Warehouse Receipt (WHR) Issuance', mr: 'गोदाम पावती (WHR) वितरण' },
        desc: { en: 'Issue digital deposit receipts to farmers and FPOs for collateral finance', mr: 'शेतकऱ्यांना कायदेशीर डिजिटल गोदाम ठेव पावती (WHR) द्या' },
        tag: { en: 'WHR Authorized', mr: 'प्रमाणित पावती' },
      },
    ],
  },
  transport: {
    title: { en: 'Transport Logistics Access Rights & Fleet Management', mr: 'वाहतूक लॉजिस्टिक्स व्यवस्थापक वापर अधिकार' },
    subtitle: { en: 'Fleet dispatching, route transit tracking, and load assignment', mr: 'वाहन वाटप, वाहतूक ट्रॅकिंग आणि शेतमाल वाहतूक' },
    rights: [
      {
        title: { en: 'Agri Goods Fleet Dispatch', mr: 'शेती मालवाहतूक वाहन वाटप' },
        desc: { en: 'Assign mini-trucks and heavy transport for farm-to-mandi delivery', mr: 'शेतकऱ्यांच्या मालासाठी पिकअप आणि ट्रक्सचे वाटप करा' },
        tag: { en: 'Fleet Manager', mr: 'वाहतूक अधिकार' },
      },
      {
        title: { en: 'Live Transit & Route Tracking', mr: 'थेट रस्ता वाहतूक ट्रॅकिंग' },
        desc: { en: 'Provide real-time dispatch updates and estimated arrival times', mr: 'वाहनाचे लोकेशन आणि पोहचण्याची वेळ थेट अपडेट करा' },
        tag: { en: 'Transit Operator', mr: 'ट्रॅकिंग अधिकार' },
      },
    ],
  },
  quality: {
    title: { en: 'Quality Assessor Access Rights & Certification', mr: 'गुणवत्ता निरीक्षक वापर अधिकार आणि प्रमाणपत्र' },
    subtitle: { en: 'Produce grading, moisture content testing, and official certificate issue', mr: 'शेतमाल गुणवत्ता चाचणी आणि लॅब प्रमाणपत्र' },
    rights: [
      {
        title: { en: 'Grade & Moisture Certification', mr: 'गुणवत्ता आणि आद्रता प्रमाणपत्र' },
        desc: { en: 'Test grain moisture, foreign matter, and assign Grade A/B/FAQ status', mr: 'पिकातील आद्रता, रंग व आकार तपासून ग्रेड A/B प्रमाणपत्र द्या' },
        tag: { en: 'Accredited Tester', mr: 'परीक्षक अधिकार' },
      },
      {
        title: { en: 'APEDA/NABL Test Certificate Issue', mr: 'अधिकृत लॅब रिपोर्ट जारी करणे' },
        desc: { en: 'Issue digitally signed quality passports for buyers and export compliance', mr: 'खरेदीदारांसाठी डिजिटल गुणवत्ता अहवाल जारी करा' },
        tag: { en: 'Certified Assessor', mr: 'प्रमाणित अहवाल' },
      },
    ],
  },
  admin: {
    title: { en: 'System Administrator Operations & Governance', mr: 'सिस्टम प्रशासक वापर अधिकार' },
    subtitle: { en: 'Full platform management, entity verification, and system parameter controls', mr: 'संपूर्ण व्यासपीठ व्यवस्थापन आणि वापरकर्ता पडताळणी' },
    rights: [
      {
        title: { en: 'Platform Verification & Governance', mr: 'व्यासपीठ वापरकर्ता पडताळणी' },
        desc: { en: 'Approve KYC levels, 7/12 land records, and trade licenses', mr: 'शेतकरी 7/12 आणि व्यापाऱ्यांचे परवाने पडताळून मंजूर करा' },
        tag: { en: 'Full Admin', mr: 'प्रशासक अधिकार' },
      },
    ],
  },
};

export function RoleAccessRightsFeature({ roleId }: { roleId: string }) {
  const { language } = useLanguage();
  const key = (roleId || 'farmer').toLowerCase();
  const roleRights = ROLE_ACCESS_RIGHTS[key as keyof typeof ROLE_ACCESS_RIGHTS] ?? ROLE_ACCESS_RIGHTS.farmer;

  return (
    <section className="panel p-5 border-l-4 border-l-emerald-600 bg-emerald-500/5 space-y-4 my-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-foreground">{roleRights.title[language === 'mr' ? 'mr' : 'en']}</h3>
            <p className="text-xs text-muted-foreground">{roleRights.subtitle[language === 'mr' ? 'mr' : 'en']}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <BadgeCheck className="h-4 w-4" />
          {language === 'mr' ? 'सक्रिय व्यासपीठ वापर अधिकार' : 'Active Verified Access Rights'}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roleRights.rights.map((item, idx) => (
          <div key={idx} className="rounded-lg border bg-card p-3 shadow-sm space-y-1 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground">{item.title[language === 'mr' ? 'mr' : 'en']}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {item.tag[language === 'mr' ? 'mr' : 'en']}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc[language === 'mr' ? 'mr' : 'en']}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Status({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={cn('status-badge', `status-${tone}`)}>{children}</span>;
}

function PanelTitle({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="panel-header">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {action && <button onClick={onAction}>{action}<ArrowRight /></button>}
    </div>
  );
}

function FarmerOverview({ onAction, onNavigate, onOpenAgreement }: OverviewProps) {
  const { t, tCrop, tDistrict, language } = useLanguage();
  const data = overviewData.farmer;

  return (
    <div className="role-overview farmer-overview">
      <section className="farmer-alert">
        <span className="role-icon"><Clock3 /></span>
        <div>
          <strong>{language === 'mr' ? t('farmer.urgent_title') : data.urgent.title}</strong>
          <p>{language === 'mr' ? t('farmer.urgent_detail') : data.urgent.detail}</p>
        </div>
        <Button onClick={() => onNavigate('Offers')}>
          {language === 'mr' ? t('farmer.urgent_action') : data.urgent.action}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </section>

      <RoleAccessRightsFeature roleId="farmer" />

      <section className="farmer-main-grid">
        <article className="panel farmer-produce-card">
          <PanelTitle
            eyebrow={language === 'mr' ? t('farmer.ready_to_sell') : 'Ready to sell'}
            title={language === 'mr' ? t('farmer.active_produce') : 'Your active produce'}
            action={language === 'mr' ? t('farmer.view_all_produce') : 'View all produce'}
            onAction={() => onNavigate('Produce')}
          />
          <div className="farmer-crop">
            <span className="crop-mark"><Leaf /></span>
            <div className="crop-title">
              <h3>{tCrop(data.produce.crop)}</h3>
              <p>{data.produce.id} · {language === 'mr' ? 'निफाड, नाशिक' : data.produce.location}</p>
            </div>
            <Status tone="positive">{language === 'mr' ? t('farmer.offers_open') : data.produce.marketStatus}</Status>
          </div>
          <div className="crop-facts">
            <span><small>{language === 'mr' ? t('farmer.available') : 'Available'}</small><strong>{data.produce.quantity}</strong></span>
            <span><small>{language === 'mr' ? t('farmer.quality') : 'Quality'}</small><strong>{language === 'mr' ? t('farmer.grade_a_verified') : data.produce.grade}</strong></span>
            <span><small>{language === 'mr' ? t('farmer.current_stage') : 'Current produce stage'}</small><strong>{language === 'mr' ? t('farmer.quality_assessed') : data.produce.stage}</strong></span>
          </div>
          <div className="produce-lifecycle-head">
            <span>{language === 'mr' ? t('farmer.produce_journey') : 'Produce journey'}</span>
            <strong>{language === 'mr' ? t('farmer.stages_count', { current: 4, total: 8 }) : '4 of 8 stages'}</strong>
          </div>
          <div className="farmer-steps-scroll">
            <ol className="farmer-steps">
              {data.produceLifecycle.map((step, index) => {
                const stepTranslations: Record<string, string> = {
                  'Pre-harvest': 'पिक काढणीपूर्व',
                  'Harvested': 'काढणी पूर्ण',
                  'Quantity recorded': 'प्रमाण नोंदवले',
                  'Quality assessed': 'गुणवत्ता तपासली',
                  'Storage / pickup pending': 'गोदाम / पिकअप बाकी',
                  'In transport': 'वाहतुकीत आहे',
                  'Delivered': 'पोहोच झाले',
                  'Transaction complete': 'व्यवहार पूर्ण',
                };
                const displayStepLabel = language === 'mr' ? (stepTranslations[step.label] || step.label) : step.label;

                return (
                  <li className={cn(step.state === 'complete' && 'is-complete', step.state === 'current' && 'is-current')} key={step.label}>
                    <span>{step.state === 'complete' ? <Check /> : index + 1}</span>
                    <small>{displayStepLabel}</small>
                  </li>
                );
              })}
            </ol>
          </div>
        </article>

        <article className="panel decision-card">
          <PanelTitle
            eyebrow={language === 'mr' ? t('farmer.decision_support') : 'Decision support'}
            title={language === 'mr' ? t('farmer.sell_or_wait') : 'Sell now or wait?'}
          />
          <div className="scenario-list">
            {data.sellScenarios.map((scenario) => {
              const scenarioTranslations: Record<string, { label: string; detail: string }> = {
                'Sell now': { label: t('farmer.sell_now'), detail: t('farmer.sell_now_detail') },
                'Nearby mandi': { label: t('farmer.nearby_mandi'), detail: t('farmer.nearby_mandi_detail') },
                'Store 7 days': { label: t('farmer.store_7_days'), detail: t('farmer.store_7_days_detail') },
              };
              const currentScenario = language === 'mr' && scenarioTranslations[scenario.label]
                ? scenarioTranslations[scenario.label]
                : scenario;

              return (
                <button className={cn('scenario-row', scenario.recommended && 'is-recommended')} key={scenario.label} onClick={() => onAction(`${scenario.label} scenario opened.`)}>
                  <span><strong>{currentScenario.label}</strong><small>{currentScenario.detail}</small></span>
                  <b>{scenario.value}</b>
                  {scenario.recommended && <Status tone="positive">{language === 'mr' ? t('farmer.recommended') : 'Recommended'}</Status>}
                </button>
              );
            })}
          </div>
          <p className="context-note">
            <IndianRupee />
            {language === 'mr' ? t('farmer.net_values_note') : 'Net values include the listed transport, storage and market costs.'}
          </p>
        </article>
      </section>

      <section className="panel farmer-offers">
        <PanelTitle
          eyebrow={language === 'mr' ? t('farmer.offer_window') : 'Competitive offer window'}
          title={language === 'mr' ? t('farmer.ranked_offers') : 'Offers ranked for your return'}
          action={language === 'mr' ? t('farmer.compare_terms') : 'Compare full terms'}
          onAction={() => onNavigate('Offers')}
        />
        <div className="offer-cards">
          {data.offers.map((offer, index) => {
            const tagTranslations: Record<string, string> = {
              'Best net return': 'सर्वोत्तम निव्वळ नफा',
              'Highest price': 'सर्वाधिक भाव',
              'Reliable terms': 'विश्वासू अटी',
            };
            const termsTranslations: Record<string, string> = {
              'Buyer transport · same-day payment': 'खरेदीदाराची वाहतूक · त्याच दिवशी पेमेंट',
              'You arrange transport · payment in 7 days': 'तुम्ही वाहतूक करा · ७ दिवसांत पेमेंट',
              'Pickup included · payment in 2 days': 'पिकअप समाविष्ट · २ दिवसांत पेमेंट',
            };
            const tagDisplay = language === 'mr' ? (tagTranslations[offer.tag] || offer.tag) : offer.tag;
            const termsDisplay = language === 'mr' ? (termsTranslations[offer.terms] || offer.terms) : offer.terms;
            const priceDisplay = language === 'mr' ? offer.price.replace('/kg', '/किलो') : offer.price;

            return (
              <button className={cn('offer-card', index === 0 && 'is-best')} key={offer.id} onClick={() => onOpenAgreement?.(offer.id)}>
                <span className="offer-rank">#{index + 1}</span>
                <Status tone={offer.tone as Tone}>{tagDisplay}</Status>
                <VerifiedIdentity name={offer.buyer} as="h3" />
                <p>{termsDisplay}</p>
                <div>
                  <span><small>{language === 'mr' ? t('farmer.price_per_kg') : 'Price'}</small><strong>{priceDisplay}</strong></span>
                  <span><small>{language === 'mr' ? t('farmer.expected_net') : 'Expected net'}</small><strong>{offer.net}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FpoOverview({ onNavigate }: OverviewProps) {
  const { language } = useLanguage();
  const data = overviewData.fpo;

  return (
    <div className="role-overview fpo-overview">
      <section className="fpo-home-focus">
        <div>
          <p className="eyebrow">{language === 'mr' ? 'प्राधान्य खरेदी मोहीम' : 'Priority campaign'} · {data.campaign.id}</p>
          <h2>{data.campaign.name}</h2>
          <p><VerifiedIdentity name={data.campaign.buyer} /> · {data.campaign.deadline}</p>
        </div>
        <span><small>{language === 'mr' ? 'आरक्षित प्रमाण' : 'Reserved'}</small><strong>16.4T</strong><em>of {data.campaign.target}</em></span>
        <span className="is-warning"><small>{language === 'mr' ? 'अजून आवश्यक' : 'Still required'}</small><strong>3.6T</strong><em>{language === 'mr' ? 'मुदत संपण्यापूर्वी' : 'before commitment closes'}</em></span>
        <Button onClick={() => onNavigate('Campaigns')}>
          {language === 'mr' ? 'खरेदी मोहीम उघडा' : 'Open procurement'}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </section>

      <section className="fpo-home-grid">
        <article className="panel fpo-action-queue">
          <PanelTitle eyebrow={language === 'mr' ? 'आजचे काम' : 'Today'} title={language === 'mr' ? 'लक्ष देण्याची गरज असलेले काम' : 'Work needing attention'} />
          <button onClick={() => onNavigate('Campaigns')}>
            <span className="role-icon"><Users /></span>
            <span><strong>{language === 'mr' ? 'उरलेला कांदा पुरवठा मिळवा' : 'Secure remaining onion supply'}</strong><small>{data.campaign.id} · 3.6T shortfall</small></span>
            <Status tone="warning">{language === 'mr' ? 'तात्काळ' : 'Due first'}</Status>
            <ChevronRight />
          </button>
          <button onClick={() => onNavigate('Farmer supply')}>
            <span className="role-icon"><ClipboardCheck /></span>
            <span><strong>{language === 'mr' ? 'शेतकरी संकलन तपासा' : 'Review Farmer collections'}</strong><small>{data.reservations.length} grouped reservations</small></span>
            <Status tone="neutral">{language === 'mr' ? 'तपासणी बाकी' : 'Needs review'}</Status>
            <ChevronRight />
          </button>
          <button onClick={() => onNavigate('Inventory')}>
            <span className="role-icon"><PackageCheck /></span>
            <span><strong>{language === 'mr' ? 'नवीन शेतमाल गोदामात ठेवा' : 'Place newly purchased produce'}</strong><small>4,280 kg onion · ownership received</small></span>
            <Status tone="warning">{language === 'mr' ? 'गोदाम बाकी' : 'Storage due'}</Status>
            <ChevronRight />
          </button>
        </article>

        <article className="panel economics-card fpo-home-economics">
          <PanelTitle
            eyebrow={language === 'mr' ? 'व्यापारी अटी' : 'Priority campaign'}
            title={language === 'mr' ? 'आर्थिक अहवाल' : 'Commercial snapshot'}
            action={language === 'mr' ? 'व्यापारी अटी पहा' : 'Buyer terms'}
            onAction={() => onNavigate('Open demand')}
          />
          <dl>
            {data.economics.map((item, index) => (
              <div className={cn(index === data.economics.length - 1 && 'is-total')} key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="context-note">
            <ShieldCheck />
            {language === 'mr' ? 'सर्व पुरवठा व खरेदी अटी सुरक्षित रेषेत उपलब्ध आहेत.' : 'Detailed sourcing, reservations and terms remain available in their workspaces.'}
          </p>
        </article>
      </section>
    </div>
  );
}

function BuyerOverview({ onNavigate }: OverviewProps) {
  const { language } = useLanguage();
  const data = overviewData.buyer;

  return (
    <div className="role-overview buyer-overview">
      <section className="panel buyer-focus">
        <div>
          <p className="eyebrow">{language === 'mr' ? 'सक्रिय खरेदी आवश्यकता' : 'Active procurement'}</p>
          <h2>{data.requirement.name}</h2>
          <p>{data.requirement.destination} · {data.requirement.budget}</p>
        </div>
        <span><small>{language === 'mr' ? 'जमा झालेले प्रमाण' : 'Gathered'}</small><strong>16.4T / 20T</strong></span>
        <Button onClick={() => onNavigate('Requirements')}>
          {language === 'mr' ? 'खरेदी व्यवस्थापन पहा' : 'Manage sourcing'}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </section>

      <RoleAccessRightsFeature roleId="buyer" />
    </div>
  );
}

export function RoleOverview({ roleId, onAction, onNavigate, onOpenAgreement }: OverviewProps) {
  const { language } = useLanguage();
  if (roleId === 'farmer') {
    return <FarmerOverview roleId={roleId} onAction={onAction} onNavigate={onNavigate} onOpenAgreement={onOpenAgreement} />;
  }
  if (roleId === 'fpo') {
    return <FpoOverview roleId={roleId} onAction={onAction} onNavigate={onNavigate} onOpenAgreement={onOpenAgreement} />;
  }
  if (roleId === 'buyer') {
    return <BuyerOverview roleId={roleId} onAction={onAction} onNavigate={onNavigate} onOpenAgreement={onOpenAgreement} />;
  }

  // Storage Manager, Transport Logistics, Quality Assessor, System Administrator
  const titleStr = language === 'mr' ? `${roleId.toUpperCase()} कार्यसंचालन डॅशबोर्ड` : `${roleId.toUpperCase()} Operational Dashboard`;
  const descStr = language === 'mr' ? 'महाराष्ट्रातील सर्व कामे, नेटवर्क आणि व्यवहार सुलभपणे व्यवस्थापित करा.' : 'Manage your operations, network connections, and tasks smoothly in Maharashtra.';

  return (
    <div className="role-overview generic-overview p-6 space-y-4 panel">
      <h2 className="text-xl font-semibold capitalize">{titleStr}</h2>
      <p className="text-sm text-muted-foreground">{descStr}</p>
      <RoleAccessRightsFeature roleId={roleId} />
    </div>
  );
}
