'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, Bell, Boxes, Building2, Check, ChevronDown,
  ClipboardCheck, Command, FileText, Gauge, HandCoins, HelpCircle,
  LayoutDashboard, Leaf, Menu, PackageCheck, Search, Settings, ShieldCheck,
  ShoppingBasket, Store, RotateCcw, Truck, Users, X,
} from 'lucide-react';

import dashboardData from '@/mockdata/dashboard.json';
import formData from '@/mockdata/forms.json';
import { ActionDialog, type FormValues } from '@/components/action-dialog';
import { AgreementBuilderDialog } from '@/components/commercial-agreement';
import { Button } from '@/components/ui/button';
import { usePrototypeStore } from '@/components/prototype-store';
import { RoleOverview } from '@/components/role-overviews';
import { VerifiedIdentity } from '@/components/verified-badge';
import { getWorkspaceScreen, WorkspaceView } from '@/components/workspace-view';
import { cn } from '@/lib/utils';

type RoleId = (typeof dashboardData.roles)[number]['id'];

const roleNavigation: Record<RoleId, { label: string; icon: typeof Gauge }[]> = {
  farmer: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Produce', icon: Boxes },
    { label: 'Offers', icon: HandCoins }, { label: 'Trades', icon: FileText },
    { label: 'Services', icon: Truck },
  ],
  fpo: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Campaigns', icon: Store },
    { label: 'Farmer supply', icon: Users }, { label: 'Buyer trades', icon: HandCoins },
    { label: 'Services', icon: Truck },
  ],
  buyer: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Requirements', icon: FileText },
    { label: 'Marketplace', icon: Store }, { label: 'Purchases', icon: ShoppingBasket },
    { label: 'Deliveries', icon: Truck },
  ],
  storage: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Facilities', icon: Building2 },
    { label: 'Bookings', icon: FileText }, { label: 'Inventory', icon: Boxes },
    { label: 'Operations', icon: Gauge },
  ],
  transport: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Shipments', icon: PackageCheck },
    { label: 'Vehicles', icon: Truck }, { label: 'Quotes', icon: HandCoins },
    { label: 'Routes', icon: Gauge },
  ],
  quality: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Assessments', icon: ClipboardCheck },
    { label: 'Schedule', icon: FileText }, { label: 'Reports', icon: PackageCheck },
    { label: 'Availability', icon: Gauge },
  ],
  admin: [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Verification', icon: ShieldCheck },
    { label: 'Grievances', icon: AlertTriangle }, { label: 'Disputes', icon: FileText },
    { label: 'Analytics', icon: Gauge },
  ],
};

function Logo() {
  return (
    <div className="brand-mark" aria-label="KisanMitra">
      <span className="brand-icon"><Leaf aria-hidden="true" /></span>
      <span><strong>KisanMitra</strong><small>Trade with clarity</small></span>
    </div>
  );
}

export function DashboardShell({ initialRole }: { initialRole: string }) {
  const { state: prototypeState, addEvent, addProduce, addAgreement, resetDemo } = usePrototypeStore();
  const safeInitial = dashboardData.roles.some((role) => role.id === initialRole) ? initialRole : 'farmer';
  const [roleId, setRoleId] = useState<RoleId>(safeInitial as RoleId);
  const [activeNav, setActiveNav] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const role = useMemo(
    () => dashboardData.roles.find((item) => item.id === roleId) ?? dashboardData.roles[0],
    [roleId],
  );
  const navItems = roleNavigation[roleId];
  const activeScreen = getWorkspaceScreen(roleId, activeNav);
  const primaryAction = activeScreen?.primaryAction ?? role.primaryAction;
  const isFarmerProduceAction = roleId === 'farmer' && (activeNav === 'Overview' || activeNav === 'Produce');
  const isAgreementAction = (roleId === 'buyer' && (activeNav === 'Overview' || activeNav === 'Requirements'))
    || (roleId === 'fpo' && (activeNav === 'Overview' || activeNav === 'Campaigns'));
  const actionFields = isFarmerProduceAction ? formData.farmerAddProduce.fields : (activeScreen?.fields ?? []);

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
    runAction(`${createdAgreement.id} published for seller review.`);
    setActiveNav(roleId === 'buyer' ? 'Requirements' : 'Campaigns');
  }

  function changeRole(nextRole: RoleId) {
    setRoleId(nextRole);
    setActiveNav('Overview');
    setMobileMenuOpen(false);
    window.history.pushState({}, '', `/${nextRole}`);
  }

  function runAction(message: string) {
    addEvent(roleId, message);
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
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
                className={cn('nav-item', activeNav === item.label && 'is-active')}
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon aria-hidden="true" /><span>{item.label}</span>
                {item.label === 'Overview' && <span className="nav-indicator" />}
              </button>
            );
          })}
          <p className="nav-label nav-section">Manage</p>
          <button className="nav-item" onClick={() => runAction('Documents view opened.')}><FileText /><span>Documents</span></button>
          <button className="nav-item" onClick={() => runAction('Settings view opened.')}><Settings /><span>Settings</span></button>
          <button className="nav-item" onClick={() => { resetDemo(); setNotice('Demo restored to its canonical state.'); }}><RotateCcw /><span>Reset demo</span></button>
        </nav>

        <div className="sidebar-support">
          <HelpCircle aria-hidden="true" />
          <span><strong>Need help?</strong><small>View the demo guide</small></span>
          <ArrowRight aria-hidden="true" />
        </div>
        <div className="sidebar-profile">
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
            <div className="desktop-only breadcrumb"><span>{role.name}</span><span>/</span><strong>{activeNav}</strong></div>
            <Logo />
          </div>
          <button className="command-search" onClick={() => runAction('Search is available in the interactive prototype.')}>
            <Search aria-hidden="true" /><span>Search produce, trades and people</span><kbd><Command /> K</kbd>
          </button>
          <div className="topbar-actions">
            <div className="role-switcher-wrap">
              <label htmlFor="role-switcher">Viewing as</label>
              <select id="role-switcher" value={roleId} onChange={(event) => changeRole(event.target.value as RoleId)}>
                {dashboardData.roles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
            <Button className="notification-button" variant="outline" size="icon" aria-label={`${prototypeState.events.length + 3} notifications`} onClick={() => runAction(`${prototypeState.events.length + 3} notifications in this demo session.`)}><Bell />{prototypeState.events.length > 0 && <span>{Math.min(prototypeState.events.length, 9)}</span>}</Button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{role.eyebrow}</p>
              <h1>{activeNav === 'Overview' ? role.title : activeNav}</h1>
              <p>{activeNav === 'Overview' ? role.subtitle : activeScreen?.subtitle}</p>
            </div>
            <Button size="lg" onClick={() => setDialogOpen(true)}>{primaryAction}<ArrowRight data-icon="inline-end" /></Button>
          </section>

          {activeNav === 'Overview' ? (
            <RoleOverview roleId={roleId as 'farmer' | 'fpo' | 'buyer' | 'storage' | 'transport' | 'quality' | 'admin'} onAction={runAction} onNavigate={setActiveNav} />
          ) : (
            <WorkspaceView roleId={roleId} screenName={activeNav} onAction={runAction} />
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return <button key={item.label} className={cn(activeNav === item.label && 'is-active')} onClick={() => setActiveNav(item.label)}><Icon /><span>{item.label}</span></button>;
        })}
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
        key={roleId === 'fpo' ? 'fpo-builder' : 'buyer-builder'}
        actor={roleId === 'fpo' ? 'fpo' : 'buyer'}
        open={dialogOpen && isAgreementAction}
        onOpenChange={setDialogOpen}
        onPublish={publishAgreement}
      />
      {notice && <output className="toast-notice"><Check />{notice}</output>}
    </div>
  );
}
