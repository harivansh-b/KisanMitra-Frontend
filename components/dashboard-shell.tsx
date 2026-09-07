'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, ArrowRight, Bell, Boxes, Building2, Check, ChevronDown,
  ClipboardCheck, Command, FileText, Gauge, Globe, HandCoins, HelpCircle,
  LayoutDashboard, Leaf, Menu, MoreHorizontal, PackageCheck, Search, Settings, ShieldCheck,
  ShoppingBasket, Store, RotateCcw, Truck, X, MapPin, User, FileCheck,
} from 'lucide-react';

import { dashboardFixture as dashboardData, formsFixture as formData } from '@/data/fixtures';
import { ActionDialog, type FormValues } from '@/components/action-dialog';
import { AgreementBuilderDialog, AgreementReviewSheet, getAgreementView } from '@/components/commercial-agreement';
import { ProcurementPlanDialog } from '@/components/procurement-plan';
import { FpoInventory } from '@/components/fpo-inventory';
import { MandiModule } from '@/components/mandi-module';
import { ChatbotWidget } from '@/components/chatbot-widget';
import { AuthControl } from '@/components/auth-control';
import { VerificationModule } from '@/components/verification-module';
import { RankingModule } from '@/components/ranking-module';
import { GeographyModule } from '@/components/geography-module';
import { DocumentModule } from '@/components/document-module';
import { AccountManagementModal } from '@/components/account-management-modal';
import { useLanguage, Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { usePrototypeStore } from '@/components/prototype-store';
import { RoleOverview } from '@/components/role-overviews';
import { VerifiedIdentity } from '@/components/verified-badge';
import { getWorkspaceScreen, WorkspaceView } from '@/components/workspace-view';
import { cn } from '@/lib/utils';
import { sectionSlug } from '@/domain/navigation';

type RoleId = (typeof dashboardData.roles)[number]['id'];
type NavItem = { label: string; icon: typeof Gauge; target?: string };

const TOAST_DURATION_MS = 5000;

const roleNavigation: Record<RoleId, NavItem[]> = {
  farmer: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Produce', icon: Boxes },
    { label: 'Offers', icon: HandCoins }, { label: 'Trades', icon: FileText },
    { label: 'Services', icon: Truck }, { label: 'Mandi', icon: Store, target: 'Mandi' },
    { label: 'Rankings', icon: Gauge }, { label: 'Geography', icon: MapPin },
    { label: 'Documents', icon: FileCheck }, { label: 'Verification', icon: ShieldCheck },
  ],
  fpo: [
    { label: 'Home', icon: LayoutDashboard, target: 'Overview' },
    { label: 'Procurement', icon: ShoppingBasket, target: 'Campaigns' },
    { label: 'Inventory', icon: Boxes },
    { label: 'Sales', icon: HandCoins, target: 'Open demand' },
    { label: 'Services', icon: Truck, target: 'Service requests' },
    { label: 'Mandi', icon: Store, target: 'Mandi' },
    { label: 'Geography', icon: MapPin }, { label: 'Documents', icon: FileCheck },
  ],
  buyer: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Requirements', icon: FileText },
    { label: 'Marketplace', icon: Store }, { label: 'Purchases', icon: ShoppingBasket },
    { label: 'Deliveries', icon: Truck }, { label: 'Mandi', icon: Store, target: 'Mandi' },
    { label: 'Rankings', icon: Gauge }, { label: 'Geography', icon: MapPin },
    { label: 'Documents', icon: FileCheck }, { label: 'Verification', icon: ShieldCheck },
  ],
  storage: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Facilities', icon: Building2 },
    { label: 'Requests', icon: ClipboardCheck }, { label: 'Bookings', icon: FileText },
    { label: 'Inventory', icon: Boxes }, { label: 'Operations', icon: Gauge },
    { label: 'Geography', icon: MapPin }, { label: 'Documents', icon: FileCheck },
  ],
  transport: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Shipments', icon: PackageCheck },
    { label: 'Vehicles', icon: Truck }, { label: 'Quote requests', icon: HandCoins },
    { label: 'Routes', icon: Gauge }, { label: 'Geography', icon: MapPin },
    { label: 'Documents', icon: FileCheck },
  ],
  quality: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Requests', icon: HandCoins },
    { label: 'Assessments', icon: ClipboardCheck }, { label: 'Schedule', icon: FileText },
    { label: 'Reports', icon: PackageCheck }, { label: 'Availability', icon: Gauge },
    { label: 'Geography', icon: MapPin }, { label: 'Documents', icon: FileCheck },
  ],
  admin: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Verification', icon: ShieldCheck },
    { label: 'Grievances', icon: AlertTriangle }, { label: 'Disputes', icon: FileText },
    { label: 'Analytics', icon: Gauge }, { label: 'Geography', icon: MapPin },
    { label: 'Documents', icon: FileCheck },
  ],
};

const fpoWorkspaceGroups = [
  { label: 'Home', screens: ['Overview'] },
  { label: 'Procurement', screens: ['Campaigns', 'Farmer supply'] },
  { label: 'Inventory', screens: ['Inventory'] },
  { label: 'Sales', screens: ['Open demand', 'Responses', 'Confirmed trades'] },
  { label: 'Services', screens: ['Service requests', 'Services'] },
  { label: 'Mandi', screens: ['Mandi'] },
];

function Logo() {
  return (
    <div className="brand-mark" aria-label="KisanMitra">
      <span className="brand-icon"><Leaf aria-hidden="true" /></span>
      <span><strong>KisanMitra</strong><small>Trade with clarity</small></span>
    </div>
  );
}

export function DashboardShell({ initialRole, initialSection = 'Overview' }: { initialRole: string; initialSection?: string }) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isSignedUpMode, setIsSignedUpMode] = useState(false);
  const {
    state: prototypeState, addEvent, addProduce, addAgreement, markRequirementSent,
    respondToAgreement,
    updateRequirementSourcing, resetDemo,
  } = usePrototypeStore();
  const safeInitial = dashboardData.roles.some((role) => role.id === initialRole) ? initialRole : 'farmer';
  const [roleId, setRoleId] = useState<RoleId>(safeInitial as RoleId);
  const [activeNav, setActiveNav] = useState(initialSection);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [procurementPlanOpen, setProcurementPlanOpen] = useState(false);
  const [procurementRequirementId, setProcurementRequirementId] = useState('REQ-331');
  const [overviewAgreementId, setOverviewAgreementId] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  const role = useMemo(
    () => dashboardData.roles.find((item) => item.id === roleId) ?? dashboardData.roles[0],
    [roleId],
  );
  const navItems = roleNavigation[roleId];
  const activeFpoGroup = roleId === 'fpo'
    ? fpoWorkspaceGroups.find((group) => group.screens.includes(activeNav))
    : undefined;
  const activeNavLabel = activeFpoGroup?.label ?? activeNav;
  const pageEyebrow = roleId === 'fpo'
    ? activeNavLabel === 'Home' ? 'FPO workspace'
      : activeNavLabel === 'Procurement' ? 'Procurement workspace'
        : activeNavLabel === 'Inventory' ? 'Inventory control'
          : activeNavLabel === 'Sales' ? 'Buyer sales'
            : 'Farmer services'
    : role.eyebrow;
  const activeScreen = getWorkspaceScreen(roleId, activeNav);
  const primaryAction = activeScreen?.primaryAction ?? role.primaryAction;
  const isFarmerProduceAction = roleId === 'farmer' && (activeNav === 'Overview' || activeNav === 'Produce');
  const isAgreementAction = (roleId === 'buyer' && (activeNav === 'Overview' || activeNav === 'Requirements'))
    || (roleId === 'fpo' && (activeNav === 'Overview' || activeNav === 'Campaigns'))
    || (roleId === 'farmer' && activeNav === 'Offers');
  const isProcurementPlanAction = roleId === 'buyer' && activeNav === 'Marketplace';
  const isFpoResponsesAction = roleId === 'fpo' && activeNav === 'Responses';
  const isFpoInventoryAction = roleId === 'fpo' && activeNav === 'Inventory';
  const providerRequestActionTarget = roleId === 'fpo' && activeNav === 'Service requests'
    ? 'Services'
    : roleId === 'storage' && activeNav === 'Requests'
      ? 'Facilities'
      : roleId === 'quality' && activeNav === 'Requests'
        ? 'Availability'
        : null;
  const actionFields = isFarmerProduceAction ? formData.farmerAddProduce.fields : (activeScreen?.fields ?? []);
  const notificationCount = role.queue.length + prototypeState.events.length;
  const overviewAgreement = overviewAgreementId ? getAgreementView(overviewAgreementId) : undefined;

  useEffect(() => () => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
  }, []);

  function completeAction(values: FormValues) {
    if (isFarmerProduceAction) {
      const produce = addProduce({
        crop: values.crop_type,
        variety: values.variety,
        stage: values.current_produce_stage,
        quantity: values.quantity_in_kg,
        location: values.farm_or_produce_location,
        harvestDate: values.harvest_or_expected_harvest_date,
        storageStatus: values.storage_status,
        qualityStatus: values.quality_status,
        notes: values.notes,
      });
      runAction(`${produce.id} created at ${produce.stage}.`);
      setActiveNav('Produce');
      return;
    }
    runAction(`${primaryAction} saved locally.`);
  }

  function publishAgreement(agreement: Parameters<typeof addAgreement>[0]) {
    const createdAgreement = addAgreement(agreement);
    const privateMessage = createdAgreement.actor === 'farmer'
      ? `${createdAgreement.id} sent privately to ${createdAgreement.recipients?.length ?? 0} verified Buyers/FPOs.`
      : `${createdAgreement.id} private direct offer prepared. Select verified sellers; their acceptance will reserve quantity immediately.`;
    runAction(createdAgreement.visibility === 'private'
      ? privateMessage
      : `${createdAgreement.id} published to the public marketplace.`);
    setActiveNav(roleId === 'buyer' ? 'Requirements' : roleId === 'farmer' ? 'Offers' : 'Campaigns');
  }

  function saveAgreementDraft(agreement: Parameters<typeof addAgreement>[0]) {
    const createdAgreement = addAgreement(agreement);
    runAction(`${createdAgreement.id} saved as a ${createdAgreement.visibility} ${createdAgreement.actor === 'farmer' ? 'offer-window' : 'requirement'} draft.`);
    setActiveNav(roleId === 'buyer' ? 'Requirements' : roleId === 'farmer' ? 'Offers' : 'Campaigns');
  }

  function openProcurementPlan(requirementId = 'REQ-331') {
    setProcurementRequirementId(requirementId);
    setProcurementPlanOpen(true);
  }

  function changeRole(nextRole: RoleId) {
    setRoleId(nextRole);
    setActiveNav('Overview');
    setOverviewAgreementId(null);
    setMobileMenuOpen(false);
    router.push(`/${nextRole}/overview`);
  }

  function navigate(screen: string) {
    setActiveNav(screen);
    setMobileMenuOpen(false);
    router.push(`/${roleId}/${sectionSlug(screen)}`);
  }

  function runAction(message: string) {
    addEvent(roleId, message);
    setNotice(message);
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimer.current = null;
    }, TOAST_DURATION_MS);
  }

  function restoreDemo() {
    resetDemo();
    runAction('Demo restored to its canonical state.');
  }

  return (
    <div className="app-shell">
      <aside className={cn('workspace-sidebar', mobileMenuOpen && 'is-open')}>
        <div className="sidebar-head">
          <Logo />
          <Button className="mobile-only" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X /></Button>
        </div>

        <nav className="primary-nav" aria-label={`${role.name} navigation`}>
          <p className="nav-label">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={cn('nav-item', activeNavLabel === item.label && 'is-active')}
                aria-current={activeNavLabel === item.label ? 'page' : undefined}
                key={item.label}
                onClick={() => {
                  navigate(item.target ?? item.label);
                }}
              >
                <Icon aria-hidden="true" /><span>{item.label}</span>
                {activeNavLabel === item.label && <span className="nav-indicator" />}
              </button>
            );
          })}
          <p className="nav-label nav-section">Manage</p>
          <button className="nav-item" onClick={() => navigate('Documents')}><FileCheck /><span>{t('doc.title')}</span></button>
          <button className="nav-item" onClick={() => setAccountModalOpen(true)}><Settings /><span>{t('header.manage_account')}</span></button>
          <button className="nav-item" onClick={restoreDemo}><RotateCcw /><span>{t('nav.reset_demo')}</span></button>
        </nav>

        <div className="sidebar-support">
          <HelpCircle aria-hidden="true" />
          <span><strong>Need help?</strong><small>Guidance coming later</small></span>
          <ArrowRight aria-hidden="true" />
        </div>
        <div className="sidebar-profile" onClick={() => setAccountModalOpen(true)} style={{ cursor: 'pointer' }}>
          <span className="avatar">{role.profile.charAt(0)}</span>
          <span className="profile-copy"><VerifiedIdentity name={role.profile} as="strong" /><small>{role.name}</small></span>
          <ChevronDown aria-hidden="true" />
        </div>
      </aside>

      {mobileMenuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <div className="workspace-main">
        <header className="topbar">
          <div className="topbar-left">
            <Button className="mobile-only" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu /></Button>
            <div className="desktop-only breadcrumb"><span>{role.name}</span><span>/</span><strong>{activeNavLabel}</strong>{roleId === 'fpo' && activeNav !== 'Overview' && activeNav !== activeNavLabel && <><span>/</span><strong>{activeNav}</strong></>}</div>
            <Logo />
          </div>
          <button className="command-search" disabled title="Search is coming later">
            <Search aria-hidden="true" /><span>Search produce, trades and people</span><kbd><Command /> K</kbd>
          </button>
          <div className="topbar-actions">
            <div className="flex items-center gap-1 text-xs border rounded-md px-2 py-1 bg-background">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="en">EN (English)</option>
                <option value="mr">MR (मराठी)</option>
                <option value="hi">HI (हिंदी)</option>
              </select>
            </div>
            {/* State Toggle: Non-signup (Demo) vs Signup (Authenticated User) */}
            <button
              type="button"
              onClick={() => setIsSignedUpMode(prev => !prev)}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors ${
                isSignedUpMode
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/40 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/40 dark:text-amber-400'
              }`}
              title="Toggle between Non-signup (Demo mode with role switcher) and Signup state"
            >
              <span className={`h-2 w-2 rounded-full ${isSignedUpMode ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isSignedUpMode ? 'Signed-up State' : 'Non-signup State (Demo)'}
            </button>

            {/* User Type Role Switcher: Present ONLY in Non-signup state */}
            {!isSignedUpMode ? (
              <div className="role-switcher-wrap" title="Explore user roles in Non-signup Demo Mode">
                <label htmlFor="role-switcher">{t('header.viewing_as')}</label>
                <select id="role-switcher" value={roleId} onChange={(event) => changeRole(event.target.value as RoleId)}>
                  {dashboardData.roles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-semibold">
                <span className="text-muted-foreground">Active Role:</span>
                <span className="text-primary font-bold">{role.name}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccountModalOpen(true)}
              className="hidden sm:inline-flex gap-1.5 text-xs font-medium"
            >
              <User className="h-3.5 w-3.5 text-primary" />
              {t('header.manage_account')}
            </Button>
            <Button className="notification-button" variant="outline" size="icon" aria-label={`Open ${notificationCount} notifications`} onClick={() => setNotificationsOpen(true)}><Bell />{notificationCount > 0 && <span>{notificationCount > 9 ? '9+' : notificationCount}</span>}</Button>
            <AuthControl />
          </div>
        </header>

        <main className="dashboard-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{pageEyebrow}</p>
              <h1>{activeNav === 'Overview' ? role.title : activeNavLabel}</h1>
              <p>{activeNav === 'Overview' ? role.subtitle : activeScreen?.subtitle}</p>
            </div>
            <Button size="lg" onClick={() => {
              if (isProcurementPlanAction) openProcurementPlan();
              else if (isFpoResponsesAction) setActiveNav('Open demand');
              else if (isFpoInventoryAction) setActiveNav('Farmer supply');
              else if (providerRequestActionTarget) setActiveNav(providerRequestActionTarget);
              else setDialogOpen(true);
            }}>{primaryAction}<ArrowRight data-icon="inline-end" /></Button>
          </section>

          {roleId === 'fpo' && activeFpoGroup && activeFpoGroup.screens.length > 1 && (
            <nav className="fpo-workspace-tabs" aria-label={`${activeFpoGroup.label} views`}>
              {activeFpoGroup.screens.map((screen) => <button className={cn(activeNav === screen && 'is-active')} key={screen} onClick={() => setActiveNav(screen)}>{screen}</button>)}
            </nav>
          )}

          {activeNav === 'Overview' ? (
            <RoleOverview
              roleId={roleId as 'farmer' | 'fpo' | 'buyer' | 'storage' | 'transport' | 'quality' | 'admin'}
              onAction={runAction}
              onNavigate={navigate}
              onOpenAgreement={setOverviewAgreementId}
            />
          ) : roleId === 'fpo' && activeNav === 'Inventory' ? (
            <FpoInventory onAction={runAction} />
          ) : activeNav === 'Mandi' ? (
            <MandiModule />
          ) : (roleId === 'farmer' || roleId === 'buyer') && activeNav === 'Rankings' ? (
            <RankingModule role={roleId} />
          ) : activeNav === 'Geography' ? (
            <GeographyModule />
          ) : activeNav === 'Documents' ? (
            <DocumentModule role={roleId} />
          ) : (roleId === 'farmer' || roleId === 'buyer') && activeNav === 'Verification' ? (
            <VerificationModule role={roleId} />
          ) : (
            <WorkspaceView roleId={roleId} screenName={activeNav} onAction={runAction} onOpenProcurementPlan={openProcurementPlan} />
          )}
        </main>
      </div>

      <nav className={cn('mobile-nav', roleId === 'fpo' && 'fpo-mobile-nav')} aria-label="Mobile navigation">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return <button key={item.label} aria-current={activeNavLabel === item.label ? 'page' : undefined} className={cn(activeNavLabel === item.label && 'is-active')} onClick={() => navigate(item.target ?? item.label)}><Icon /><span>{item.label}</span></button>;
        })}
        <button className={cn(!navItems.slice(0, 4).some((item) => activeNavLabel === item.label) && 'is-active')} aria-label="Open more navigation" onClick={() => setMobileMenuOpen(true)}><MoreHorizontal /><span>More</span></button>
      </nav>

      <ActionDialog
        open={dialogOpen && !isAgreementAction}
        onOpenChange={setDialogOpen}
        title={primaryAction}
        fields={actionFields}
        description={isFarmerProduceAction ? formData.farmerAddProduce.description : undefined}
        submitLabel={isFarmerProduceAction ? formData.farmerAddProduce.submitLabel : undefined}
        onComplete={completeAction}
      />
      <AgreementBuilderDialog
        key={`${roleId}-builder`}
        actor={roleId === 'fpo' ? 'fpo' : roleId === 'farmer' ? 'farmer' : 'buyer'}
        open={dialogOpen && isAgreementAction}
        onOpenChange={setDialogOpen}
        onPublish={publishAgreement}
        onSaveDraft={saveAgreementDraft}
      />
      <ProcurementPlanDialog
        key={procurementRequirementId}
        open={procurementPlanOpen}
        onOpenChange={setProcurementPlanOpen}
        onComplete={runAction}
        requirements={prototypeState.createdAgreements}
        requirementId={procurementRequirementId}
        onRequestSent={markRequirementSent}
        onSourcingUpdate={updateRequirementSourcing}
      />
      <AgreementReviewSheet
        agreement={overviewAgreement}
        open={Boolean(overviewAgreement)}
        onOpenChange={(open) => !open && setOverviewAgreementId(null)}
        negotiator="farmer"
        responseKey={overviewAgreementId ? `farmer:${overviewAgreementId}` : undefined}
        response={overviewAgreementId ? prototypeState.agreementResponses[`farmer:${overviewAgreementId}`] : undefined}
        onRespond={respondToAgreement}
        onAction={runAction}
      />
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent className="notification-sheet">
          <SheetHeader className="notification-sheet-header">
            <p className="eyebrow">Activity centre</p>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Recent updates remain available here after their five-second popup closes.</SheetDescription>
          </SheetHeader>
          <div className="notification-history">
            {prototypeState.events.length > 0 && (
              <section>
                <h3>This session</h3>
                <div className="notification-list">
                  {prototypeState.events.map((event) => {
                    const eventRole = dashboardData.roles.find((item) => item.id === event.roleId)?.name ?? event.roleId;
                    return (
                      <article className="notification-item is-update" key={event.id}>
                        <span className="notification-icon"><Check aria-hidden="true" /></span>
                        <span><strong>{event.message}</strong><small>{eventRole} · This session</small></span>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
            <section>
              <h3>Needs attention</h3>
              <div className="notification-list">
                {role.queue.map((item) => (
                  <article className="notification-item" key={`${roleId}-${item.title}`}>
                    <span className="notification-icon"><Bell aria-hidden="true" /></span>
                    <span><strong>{item.title}</strong><small>{item.meta}</small></span>
                    <span className={`status-badge status-${item.tone}`}>{item.status}</span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>
      {notice && <output className="toast-notice" aria-live="polite"><Check />{notice}</output>}
      <AccountManagementModal
        currentRole={roleId}
        onRoleChange={(newRole) => changeRole(newRole as RoleId)}
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
      <ChatbotWidget />
    </div>
  );
}
