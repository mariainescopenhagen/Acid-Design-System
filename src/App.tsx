import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  Settings, 
  Database, 
  BookOpen, 
  Palette, 
  FileCode, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Clock, 
  Layers, 
  ChevronRight, 
  Heart,
  Eye,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientRecord, ClinicalAlert } from './types';
import { INITIAL_PATIENTS, INITIAL_ALERTS, DESIGN_RULES, CODE_SNIPPETS } from './data';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tokens' | 'playground' | 'rules'>('dashboard');
  
  // Clinical State Management
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(INITIAL_ALERTS);
  
  // Logging Vitals Form State
  const [patientId, setPatientId] = useState<string>('PT-00487');
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<string>('M');
  const [marker, setMarker] = useState<'Glucose' | 'HbA1c' | 'Creatinine' | 'Potassium'>('Glucose');
  const [value, setValue] = useState<string>('120');
  
  // Validation / Form Errors
  const [formError, setFormError] = useState<string | null>(null);
  
  // Code Snippet Copy Feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playground States
  const [playgroundBtnActionLog, setPlaygroundBtnActionLog] = useState<string>('No button clicked yet.');
  const [playgroundInputVal, setPlaygroundInputVal] = useState<string>('');
  const [playgroundAlertText, setPlaygroundAlertText] = useState<string>('Calibration complete. System performing at maximum precision.');
  const [playgroundAlertType, setPlaygroundAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [playgroundAlerts, setPlaygroundAlerts] = useState<Array<{id: string, text: string, type: 'success' | 'error' | 'info'}>>([]);

  // Typography Live Specimen Test text
  const [typeSpecimenText, setTypeSpecimenText] = useState<string>('The patient showed stable indicators post-medication.');
  const [typeSpecimenSize, setTypeSpecimenSize] = useState<number>(18);

  // Auto-fill Reference parameters on Marker Change
  const getMarkerDefaults = (m: 'Glucose' | 'HbA1c' | 'Creatinine' | 'Potassium') => {
    switch (m) {
      case 'Glucose':
        return { unit: 'mg/dL', range: '70–99' };
      case 'HbA1c':
        return { unit: '%', range: '< 5.7' };
      case 'Creatinine':
        return { unit: 'mg/dL', range: '0.6–1.2' };
      case 'Potassium':
        return { unit: 'mEq/L', range: '3.5–5.0' };
    }
  };

  // Helper for copying design properties
  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1500);
  };

  // Log Vitals Action
  const handleLogVitals = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate ID format: must start with PT- and have exactly 5 digits
    const idRegex = /^PT-\d{5}$/;
    if (!idRegex.test(patientId)) {
      setFormError('Validation failed. Patient ID must follow format PT-XXXXX (e.g. PT-00488).');
      return;
    }

    if (!patientName.trim()) {
      setFormError('Validation failed. Patient Name cannot be empty.');
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setFormError('Validation failed. Vitals value must be a positive number.');
      return;
    }

    // Determine status & reference range
    const defaults = getMarkerDefaults(marker);
    let calculatedStatus: 'Normal' | 'High' | 'Pre-diabetic' | 'Low' = 'Normal';

    if (marker === 'Glucose') {
      if (numericValue > 140) calculatedStatus = 'High';
      else if (numericValue >= 100) calculatedStatus = 'Pre-diabetic';
      else if (numericValue < 70) calculatedStatus = 'Low';
    } else if (marker === 'HbA1c') {
      if (numericValue >= 6.5) calculatedStatus = 'High';
      else if (numericValue >= 5.7) calculatedStatus = 'Pre-diabetic';
    } else if (marker === 'Creatinine') {
      if (numericValue > 1.2) calculatedStatus = 'High';
      else if (numericValue < 0.6) calculatedStatus = 'Low';
    } else if (marker === 'Potassium') {
      if (numericValue > 5.0) calculatedStatus = 'High';
      else if (numericValue < 3.5) calculatedStatus = 'Low';
    }

    const newRecord: PatientRecord = {
      id: patientId,
      name: patientName,
      age: patientAge,
      gender: patientGender,
      marker,
      value: numericValue,
      unit: defaults.unit,
      status: calculatedStatus,
      referenceRange: defaults.range,
      date: new Date().toISOString().split('T')[0]
    };

    setPatients(prev => [newRecord, ...prev]);

    // If status is critically abnormal, trigger alert
    if (calculatedStatus === 'High' || calculatedStatus === 'Low') {
      const alertId = `alt-gen-${Date.now()}`;
      const newAlert: ClinicalAlert = {
        id: alertId,
        type: 'error',
        title: `Critical Alert: ${marker} level.`,
        message: `Patient ${patientId} (${patientName}) — Registered ${value} ${defaults.unit} is classified as critically ${calculatedStatus.toUpperCase()}. Reference is ${defaults.range}.`,
        date: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`,
        patientId
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else {
      // Trigger success alert
      const alertId = `alt-gen-${Date.now()}`;
      const newAlert: ClinicalAlert = {
        id: alertId,
        type: 'success',
        title: `Vitals Logged successfully.`,
        message: `Registered ${patientName}'s ${marker} as ${value} ${defaults.unit} (Normal range).`,
        date: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    // Reset Form Fields
    setPatientName('');
    setValue('');
    // Increment ID automatically
    const currentNum = parseInt(patientId.split('-')[1]);
    const nextNum = String(currentNum + 1).padStart(5, '0');
    setPatientId(`PT-${nextNum}`);
  };

  // Delete Patient Record
  const handleDeletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    // Append informational notification
    const infoAlert: ClinicalAlert = {
      id: `info-${Date.now()}`,
      type: 'info',
      title: 'Record purge initiated.',
      message: `System successfully deleted clinical file reference for ${id}.`,
      date: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`
    };
    setAlerts(prev => [infoAlert, ...prev]);
  };

  // Reset clinical state back to original
  const handleResetClinicalState = () => {
    setPatients(INITIAL_PATIENTS);
    setAlerts(INITIAL_ALERTS);
    setFormError(null);
    setPatientId('PT-00487');
  };

  // Add Custom Playground Alert
  const handleAddPlaygroundAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundAlertText.trim()) return;
    
    setPlaygroundAlerts(prev => [
      {
        id: `pg-alt-${Date.now()}`,
        text: playgroundAlertText,
        type: playgroundAlertType
      },
      ...prev
    ]);
    setPlaygroundAlertText('');
  };

  // Clear Alerts
  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Dynamic statistics
  const activePatientsCount = patients.length;
  const criticalCount = alerts.filter(a => a.type === 'error').length;
  const normalCount = patients.filter(p => p.status === 'Normal').length;
  const criticalPercentage = activePatientsCount > 0 
    ? Math.round((patients.filter(p => p.status === 'High' || p.status === 'Low').length / activePatientsCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-bg-acid text-text-acid selection:bg-brand-primary selection:text-text-acid font-body pb-12">
      {/* GLOBAL SYSTEM HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-border-acid shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-primary border-2 border-text-acid rounded-[4px] relative flex-shrink-0">
              <div className="absolute inset-[5px] bg-brand-secondary rounded-[2px]" />
            </div>
            <div>
              <h1 className="font-heading text-lg leading-none tracking-tight">Acid</h1>
              <p className="font-mono text-[10px] text-border-acid mt-1 font-semibold uppercase tracking-wider">Clinical Design System</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap gap-2">
            <button 
              id="btn-nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-mono border-2 rounded-[4px] transition-all duration-150 ease-std flex items-center gap-2 ${
                activeTab === 'dashboard' 
                  ? 'bg-brand-primary text-text-acid border-text-acid font-bold translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_#09090b]' 
                  : 'bg-white text-text-acid border-border-acid/30 hover:border-text-acid'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Clinical Dashboard
            </button>
            <button 
              id="btn-nav-tokens"
              onClick={() => setActiveTab('tokens')}
              className={`px-4 py-2 text-xs font-mono border-2 rounded-[4px] transition-all duration-150 ease-std flex items-center gap-2 ${
                activeTab === 'tokens' 
                  ? 'bg-brand-primary text-text-acid border-text-acid font-bold translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_#09090b]' 
                  : 'bg-white text-text-acid border-border-acid/30 hover:border-text-acid'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Design Tokens
            </button>
            <button 
              id="btn-nav-playground"
              onClick={() => setActiveTab('playground')}
              className={`px-4 py-2 text-xs font-mono border-2 rounded-[4px] transition-all duration-150 ease-std flex items-center gap-2 ${
                activeTab === 'playground' 
                  ? 'bg-brand-primary text-text-acid border-text-acid font-bold translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_#09090b]' 
                  : 'bg-white text-text-acid border-border-acid/30 hover:border-text-acid'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Interactive Playground
            </button>
            <button 
              id="btn-nav-rules"
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 text-xs font-mono border-2 rounded-[4px] transition-all duration-150 ease-std flex items-center gap-2 ${
                activeTab === 'rules' 
                  ? 'bg-brand-primary text-text-acid border-text-acid font-bold translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_#09090b]' 
                  : 'bg-white text-text-acid border-border-acid/30 hover:border-text-acid'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Rules: Do's & Don'ts
            </button>
          </nav>
        </div>
      </header>

      {/* SYSTEM META / ANNOUNCEMENT BANNER */}
      <div className="bg-border-acid text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[10px] tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            <span>Core Design Framework Sync: Active & Stable</span>
          </div>
          <div>
            <span>Format: Claude & OpenDesign Compliant</span>
            <span className="mx-2">·</span>
            <span>Local Instance: UTC 2026-06-23</span>
          </div>
        </div>
      </div>

      {/* CORE WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* SIDEBAR FOR CLINICAL CONTEXT */}
              <aside className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white border border-border-acid rounded-[4px] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-brand-secondary" />
                    <span className="font-mono text-xs uppercase tracking-wider text-border-acid font-bold">Clinical Session</span>
                  </div>
                  <h2 className="font-heading text-md mb-2">Patient Files</h2>
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    A secure, local diagnostic environment formatted using Acid Design System variables.
                  </p>

                  <div className="flex flex-col gap-1">
                    <a href="#vitals-table" className="flex items-center justify-between p-2 text-xs font-mono rounded-[4px] bg-bg-acid text-text-acid border-l-2 border-brand-primary font-semibold">
                      <span>Overview Directory</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                    <a href="#vitals-form" className="flex items-center justify-between p-2 text-xs font-mono rounded-[4px] text-slate-600 hover:bg-bg-acid hover:text-text-acid transition-all border-l-2 border-transparent">
                      <span>Log Vitals Entry</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                    <a href="#stats-anchor" className="flex items-center justify-between p-2 text-xs font-mono rounded-[4px] text-slate-600 hover:bg-bg-acid hover:text-text-acid transition-all border-l-2 border-transparent">
                      <span>Abnormal Index</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* ACTIVE ANOMALIES QUICK SUMMARY CARD */}
                <div className="bg-white border border-border-acid rounded-[4px] p-5">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-border-acid font-bold mb-3">Diagnostic Status</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">In-range Files</span>
                      <span className="font-mono font-bold">{normalCount} / {activePatientsCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-border-acid/20">
                      <div 
                        className="bg-brand-primary h-full transition-all duration-300"
                        style={{ width: `${activePatientsCount > 0 ? (normalCount / activePatientsCount) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-slate-500">Purge Index</span>
                      <span className="font-mono text-brand-secondary font-semibold">{criticalPercentage}% Abnormal</span>
                    </div>
                  </div>
                </div>

                {/* RE-INITIALIZE STATE ACTION */}
                <button 
                  onClick={handleResetClinicalState}
                  className="acid-btn acid-btn-ghost w-full justify-center gap-2 text-xs font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restore System Preset
                </button>
              </aside>

              {/* CENTRAL MAIN CONTENT ZONE */}
              <section className="lg:col-span-3 flex flex-col gap-8">
                {/* HERO HEADING SECTION */}
                <div className="border-b-2 border-text-acid pb-4 flex flex-col sm:flex-row justify-between items-baseline gap-2">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-brand-secondary font-bold">Clinical Portal · Workspace</span>
                    <h2 className="font-heading text-lg md:text-xl leading-tight mt-1">Patient Vitals Overview</h2>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Diagnostics: 2026-06-23 UTC</span>
                  </div>
                </div>

                {/* STATS COMPONENT GRID */}
                <div id="stats-anchor" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="acid-card flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-border-acid/60 font-semibold block mb-1">Active Records</span>
                      <div className="font-mono text-3xl font-bold tracking-tight text-text-acid leading-none mb-1">
                        {activePatientsCount}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <Users className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Patients actively cataloged</span>
                    </div>
                  </div>

                  <div className="acid-card flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-border-acid/60 font-semibold block mb-1">Critical Anomalies</span>
                      <div className="font-mono text-3xl font-bold tracking-tight text-brand-secondary leading-none mb-1">
                        {criticalCount}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <AlertTriangle className="w-3.5 h-3.5 text-brand-secondary" />
                      <span>Requires immediate review</span>
                    </div>
                  </div>

                  <div className="acid-card flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-border-acid/60 font-semibold block mb-1">Response Clock</span>
                      <div className="font-mono text-3xl font-bold tracking-tight text-text-acid leading-none mb-1">
                        00:14:32
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-primary" />
                      <span>18s average improvement</span>
                    </div>
                  </div>
                </div>

                {/* LIVE ALERTS NOTIFICATION CENTER */}
                {alerts.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-border-acid font-bold">Active Safety Alerts</h3>
                    <div className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {alerts.map(alert => (
                          <motion.div 
                            key={alert.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className={`acid-alert ${alert.type === 'error' ? 'acid-alert-error' : alert.type === 'success' ? 'acid-alert-success' : 'acid-alert-info'} flex justify-between items-start gap-4`}>
                              <div className="flex gap-3 items-start">
                                <span className="acid-alert-icon text-base leading-none">
                                  {alert.type === 'error' && '!'}
                                  {alert.type === 'success' && '✓'}
                                  {alert.type === 'info' && 'i'}
                                </span>
                                <div>
                                  <strong className="block mb-0.5">{alert.title}</strong>
                                  <span className="text-xs">{alert.message}</span>
                                  <span className="block mt-1.5 text-[10px] opacity-60 font-mono">{alert.date}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => dismissAlert(alert.id)}
                                className="text-xs font-mono font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                              >
                                Clear
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* THE CORE PATIENT LAB DATA TABLE */}
                <div id="vitals-table" className="flex flex-col gap-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-border-acid font-bold">Recent Lab Diagnostics</h3>
                    <span className="text-xs font-mono text-slate-500">Showing {patients.length} active files</span>
                  </div>

                  <div className="overflow-x-auto border border-border-acid rounded-[4px]">
                    {patients.length > 0 ? (
                      <table className="acid-table w-full">
                        <thead>
                          <tr>
                            <th>Patient ID</th>
                            <th>Full Name</th>
                            <th>Biomarker</th>
                            <th className="text-right">Value</th>
                            <th>Unit</th>
                            <th>Ref. Limit</th>
                            <th>Status Scale</th>
                            <th className="text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence initial={false}>
                            {patients.map(p => (
                              <motion.tr 
                                key={p.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="hover:bg-white transition-colors"
                              >
                                <td className="acid-num font-bold text-xs">{p.id}</td>
                                <td className="font-semibold text-xs text-slate-800">{p.name} <span className="text-[10px] font-mono text-slate-400">({p.gender}, {p.age}y)</span></td>
                                <td className="text-xs font-mono text-border-acid font-semibold">{p.marker}</td>
                                <td className="acid-num text-right font-bold text-xs">{p.value}</td>
                                <td className="acid-num text-[11px] text-slate-500">{p.unit}</td>
                                <td className="acid-num text-[11px] text-slate-500">{p.referenceRange}</td>
                                <td>
                                  <span className={`acid-badge ${
                                    p.status === 'High' 
                                      ? 'acid-badge-error' 
                                      : p.status === 'Pre-diabetic' 
                                      ? 'acid-badge-secondary' 
                                      : p.status === 'Low'
                                      ? 'bg-amber-100 text-amber-700 border-amber-600'
                                      : 'acid-badge-primary'
                                  }`}>
                                    {p.status === 'Normal' ? '● Normal' : p.status === 'High' ? '● Critical' : p.status}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <button 
                                    onClick={() => handleDeletePatient(p.id)}
                                    className="p-1.5 text-slate-400 hover:text-brand-secondary hover:bg-slate-50 rounded transition-colors"
                                    title="Purge record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    ) : (
                      <div className="bg-white p-8 text-center text-slate-500 font-mono text-xs py-12 flex flex-col items-center justify-center gap-2">
                        <Activity className="w-8 h-8 text-slate-300 animate-pulse" />
                        <span>All clinical registers cleared. Click 'Restore System Preset' to refresh files.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* VITALS REGISTRATION FORM PANEL */}
                <div id="vitals-form" className="acid-card bg-white p-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-dashed border-border-acid/20 pb-3">
                    <Plus className="w-4 h-4 text-brand-primary bg-text-acid rounded-sm p-0.5" />
                    <h3 className="font-heading text-md">Vitals Entry Terminal</h3>
                  </div>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    Log new laboratory marker outcomes. The system auto-calculates clinical evaluation categories and appends security records on anomaly thresholds.
                  </p>

                  <form onSubmit={handleLogVitals} className="flex flex-col gap-5">
                    {formError && (
                      <div className="acid-alert acid-alert-error text-xs p-3">
                        <span className="acid-alert-icon">!</span>
                        <div><strong>Data Entry Denied:</strong> {formError}</div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Patient ID */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500">PATIENT FILE ID</label>
                        <input 
                          type="text"
                          value={patientId}
                          onChange={(e) => setPatientId(e.target.value.toUpperCase())}
                          className="acid-input font-mono w-full"
                          placeholder="PT-00487"
                          required
                        />
                      </div>

                      {/* Patient Name */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500">FULL NAME</label>
                        <input 
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="acid-input w-full"
                          placeholder="Marie Antoinette"
                          required
                        />
                      </div>

                      {/* Patient Age */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500">AGE (YEARS)</label>
                        <input 
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(parseInt(e.target.value) || 30)}
                          className="acid-input font-mono w-full"
                          min="1"
                          max="120"
                          required
                        />
                      </div>

                      {/* Patient Gender */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500">SEX</label>
                        <select 
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="acid-input w-full bg-white h-[44px]"
                        >
                          <option value="M">Male (M)</option>
                          <option value="F">Female (F)</option>
                          <option value="O">Other (O)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      {/* Biomarker Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500">LAB BIOMARKER</label>
                        <select 
                          value={marker}
                          onChange={(e) => setMarker(e.target.value as any)}
                          className="acid-input w-full bg-white font-mono font-bold text-border-acid h-[44px]"
                        >
                          <option value="Glucose">Glucose (Fasting)</option>
                          <option value="HbA1c">HbA1c (Averages)</option>
                          <option value="Creatinine">Creatinine (Renal)</option>
                          <option value="Potassium">Potassium (Electrolyte)</option>
                        </select>
                      </div>

                      {/* Measured Value */}
                      <div className="flex flex-col gap-2">
                        <label className="acid-mono text-[10px] font-bold text-slate-500 flex justify-between">
                          <span>MEASURED VALUE</span>
                          <span className="text-slate-400">Unit: {getMarkerDefaults(marker).unit}</span>
                        </label>
                        <input 
                          type="text"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="acid-input font-mono w-full text-right font-bold text-slate-800"
                          placeholder="0.0"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <div>
                        <button 
                          type="submit"
                          className="acid-btn acid-btn-primary w-full justify-center gap-2 h-[44px]"
                        >
                          <span>+ Register Vitals</span>
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC REFERENCE BOUNDS HELPER PANEL */}
                    <div className="bg-bg-acid border border-border-acid/20 rounded-[4px] p-3.5 flex justify-between items-center flex-wrap gap-2 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">ACTIVE COMPLIANCE FOR:</span>
                        <strong className="ml-1.5 text-border-acid">{marker.toUpperCase()}</strong>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-slate-500">UNIT:</span>
                          <span className="ml-1 font-bold">{getMarkerDefaults(marker).unit}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">NORMAL RANGE:</span>
                          <span className="ml-1 font-bold">{getMarkerDefaults(marker).range}</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'tokens' && (
            <motion.div 
              key="tokens"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              {/* HEADING HEADER */}
              <div className="border-b-2 border-text-acid pb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-secondary font-bold">Foundation · Specifications</span>
                <h2 className="font-heading text-lg md:text-xl mt-1">Design Token Repositories</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Design tokens represent the absolute values that sustain the premium, clinical layout of Acid. Under Open Design workflows, copy these variables into your theme code.
                </p>
              </div>

              {/* COGNITIVE COLOR SWATCHES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Brand Primary Swatches */}
                <div className="bg-white border border-border-acid rounded-[4px] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-md mb-2">01 · Color Tokens</h3>
                    <p className="text-xs text-slate-500 mb-6">Flat solid ink fills that constitute the distinctive brand essence. No visual soft gradients permitted.</p>
                    
                    <div className="flex flex-col gap-4">
                      {/* Swatch 1 */}
                      <div className="border border-border-acid rounded-[4px] overflow-hidden bg-white">
                        <div className="h-24 bg-brand-primary border-b border-border-acid" />
                        <div className="p-3.5 flex justify-between items-center bg-white">
                          <div>
                            <span className="font-bold text-xs block">Acid Primary</span>
                            <span className="font-mono text-[10px] text-slate-400">--acid-brand-primary</span>
                          </div>
                          <button 
                            onClick={() => handleCopyToClipboard('#D2E823', 'brand-primary')}
                            className="px-2.5 py-1 text-[10px] font-mono border rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            {copiedKey === 'brand-primary' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'brand-primary' ? 'Copied' : '#D2E823'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Swatch 2 */}
                      <div className="border border-border-acid rounded-[4px] overflow-hidden bg-white">
                        <div className="h-24 bg-brand-secondary border-b border-border-acid" />
                        <div className="p-3.5 flex justify-between items-center bg-white">
                          <div>
                            <span className="font-bold text-xs block">Acid Secondary</span>
                            <span className="font-mono text-[10px] text-slate-400">--acid-brand-secondary</span>
                          </div>
                          <button 
                            onClick={() => handleCopyToClipboard('#E76F51', 'brand-secondary')}
                            className="px-2.5 py-1 text-[10px] font-mono border rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            {copiedKey === 'brand-secondary' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'brand-secondary' ? 'Copied' : '#E76F51'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Semantic Interface Swatches */}
                <div className="bg-white border border-border-acid rounded-[4px] p-6 lg:col-span-2">
                  <h3 className="font-heading text-md mb-2">02 · Semantic Interfaces</h3>
                  <p className="text-xs text-slate-500 mb-6">Mappable properties used to describe UI hierarchies, validation feedback, and layouts.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* bg Swatch */}
                    <div className="border border-border-acid/30 rounded-[4px] overflow-hidden flex bg-white">
                      <div className="w-20 bg-bg-acid border-r border-border-acid/20" />
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <div>
                          <strong className="text-xs block font-bold">Cream Background</strong>
                          <span className="font-mono text-[9px] text-slate-400">--acid-bg</span>
                        </div>
                        <button 
                          onClick={() => handleCopyToClipboard('#F8F4E8', 'bg-token')}
                          className="w-full text-left mt-2 py-0.5 text-[10px] font-mono text-border-acid hover:underline flex items-center justify-between"
                        >
                          <span>Hex: #F8F4E8</span>
                          {copiedKey === 'bg-token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* surface Swatch */}
                    <div className="border border-border-acid/30 rounded-[4px] overflow-hidden flex bg-white">
                      <div className="w-20 bg-white border-r border-border-acid/20 shadow-inner" />
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <div>
                          <strong className="text-xs block font-bold">Pure Surface</strong>
                          <span className="font-mono text-[9px] text-slate-400">--acid-surface</span>
                        </div>
                        <button 
                          onClick={() => handleCopyToClipboard('#FFFFFF', 'surface-token')}
                          className="w-full text-left mt-2 py-0.5 text-[10px] font-mono text-border-acid hover:underline flex items-center justify-between"
                        >
                          <span>Hex: #FFFFFF</span>
                          {copiedKey === 'surface-token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* border Swatch */}
                    <div className="border border-border-acid/30 rounded-[4px] overflow-hidden flex bg-white">
                      <div className="w-20 bg-brand-primary opacity-90 border-r border-border-acid" style={{ backgroundColor: '#691073' }} />
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <div>
                          <strong className="text-xs block font-bold">Purple Border</strong>
                          <span className="font-mono text-[9px] text-slate-400">--acid-border</span>
                        </div>
                        <button 
                          onClick={() => handleCopyToClipboard('#691073', 'border-token')}
                          className="w-full text-left mt-2 py-0.5 text-[10px] font-mono text-border-acid hover:underline flex items-center justify-between"
                        >
                          <span>Hex: #691073</span>
                          {copiedKey === 'border-token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* error Swatch */}
                    <div className="border border-border-acid/30 rounded-[4px] overflow-hidden flex bg-white">
                      <div className="w-20 bg-brand-primary opacity-90 border-r border-border-acid" style={{ backgroundColor: '#D9383A' }} />
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <div>
                          <strong className="text-xs block font-bold">Crimson Error</strong>
                          <span className="font-mono text-[9px] text-slate-400">--acid-error</span>
                        </div>
                        <button 
                          onClick={() => handleCopyToClipboard('#D9383A', 'error-token')}
                          className="w-full text-left mt-2 py-0.5 text-[10px] font-mono text-border-acid hover:underline flex items-center justify-between"
                        >
                          <span>Hex: #D9383A</span>
                          {copiedKey === 'error-token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* COGNITIVE VARIABLE CHEATSHEET */}
                  <div className="mt-6 bg-bg-acid border border-border-acid/20 rounded-[4px] p-4 flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex gap-2 items-center">
                      <FileCode className="w-4 h-4 text-border-acid" />
                      <span className="font-mono text-xs font-bold uppercase text-border-acid">Export Full CSS Properties :root</span>
                    </div>
                    <button 
                      onClick={() => handleCopyToClipboard(CODE_SNIPPETS.cssVariables, 'css-all')}
                      className="acid-btn py-1 px-3 text-xs font-mono"
                    >
                      {copiedKey === 'css-all' ? 'Copied Token Variables!' : 'Copy :root Block'}
                    </button>
                  </div>
                </div>
              </div>

              {/* TYPOGRAPHY SPECIMEN TESTER */}
              <div className="bg-white border border-border-acid rounded-[4px] p-6">
                <div className="flex justify-between items-start flex-wrap gap-4 border-b border-dashed border-border-acid/20 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-md">03 · Typography Specimens</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Three distinct families sustain Acid readability. Heading sizes use Dela Gothic, UI Space Grotesk, numbers Fira Code.</p>
                  </div>

                  {/* Tester Controls */}
                  <div className="flex items-center gap-4 bg-bg-acid p-2 border border-border-acid/20 rounded-[4px] flex-wrap">
                    <span className="font-mono text-[10px] text-slate-500 font-bold">LIVE TYPOGRAPHY PREVIEW:</span>
                    <input 
                      type="text" 
                      value={typeSpecimenText} 
                      onChange={(e) => setTypeSpecimenText(e.target.value)} 
                      className="px-2 py-1 text-xs border border-border-acid/30 rounded bg-white w-52"
                      placeholder="Type custom text..."
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{typeSpecimenSize}px</span>
                      <input 
                        type="range" 
                        min="12" 
                        max="36" 
                        value={typeSpecimenSize} 
                        onChange={(e) => setTypeSpecimenSize(parseInt(e.target.value))}
                        className="accent-brand-primary cursor-pointer w-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Specimens Rows */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 rounded hover:bg-bg-acid/30 transition-colors">
                    <div className="md:col-span-1">
                      <strong className="block text-xs font-bold font-mono text-border-acid">--acid-f-heading</strong>
                      <span className="text-[10px] font-mono text-slate-400">Dela Gothic One</span>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-heading tracking-tight text-text-acid leading-none" style={{ fontSize: `${typeSpecimenSize}px` }}>
                        {typeSpecimenText}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 rounded hover:bg-bg-acid/30 transition-colors border-t border-slate-100">
                    <div className="md:col-span-1">
                      <strong className="block text-xs font-bold font-mono text-border-acid">--acid-f-body</strong>
                      <span className="text-[10px] font-mono text-slate-400">Space Grotesk</span>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-body text-text-acid" style={{ fontSize: `${typeSpecimenSize}px` }}>
                        {typeSpecimenText}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 rounded hover:bg-bg-acid/30 transition-colors border-t border-slate-100">
                    <div className="md:col-span-1">
                      <strong className="block text-xs font-bold font-mono text-border-acid">--acid-f-mono</strong>
                      <span className="text-[10px] font-mono text-slate-400">Fira Code</span>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-mono text-text-acid" style={{ fontSize: `${typeSpecimenSize}px` }}>
                        {typeSpecimenText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPACING GRID DEMONSTRATION & MOTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spacing Baseline Card */}
                <div className="bg-white border border-border-acid rounded-[4px] p-6">
                  <h3 className="font-heading text-md mb-2">04 · Spacing Baseline Scale</h3>
                  <p className="text-xs text-slate-500 mb-6">Derived from a strict 4px grid. All layouts align strictly to `gap = n × 4px`. Outer margin is fixed at 10%.</p>

                  <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-600 bg-bg-acid/55 p-4 rounded-[4px] border border-border-acid/20">
                    {/* Row 4px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 1</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '4px' }} />
                      <span className="text-slate-400">4px</span>
                    </div>
                    {/* Row 8px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 2</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '8px' }} />
                      <span className="text-slate-400">8px</span>
                    </div>
                    {/* Row 12px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 3</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '12px' }} />
                      <span className="text-slate-400">12px</span>
                    </div>
                    {/* Row 16px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 4</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '16px' }} />
                      <span className="text-slate-400">16px</span>
                    </div>
                    {/* Row 24px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 6</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '24px' }} />
                      <span className="text-slate-400">24px</span>
                    </div>
                    {/* Row 32px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 8</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '32px' }} />
                      <span className="text-slate-400">32px</span>
                    </div>
                    {/* Row 48px */}
                    <div className="flex items-center gap-4">
                      <span className="w-16 font-bold">grid × 12</span>
                      <div className="h-5 bg-brand-primary border border-text-acid rounded-[2px]" style={{ width: '48px' }} />
                      <span className="text-slate-400">48px</span>
                    </div>
                  </div>
                </div>

                {/* Motion Playgrounds Card */}
                <div className="bg-white border border-border-acid rounded-[4px] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-md mb-2">05 · Motion Easing Curves</h3>
                    <p className="text-xs text-slate-500 mb-6">Interactive state loops. Standard standard easing triggers in 150ms. Decelerated parameters trigger in 300ms.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Standard Box */}
                      <div className="bg-bg-acid border border-border-acid/20 rounded-[4px] p-5 flex flex-col items-center justify-center text-center gap-3">
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-500">Standard (150ms)</span>
                        {/* Interactive anim box */}
                        <div 
                          className="w-16 h-16 bg-brand-primary border-2 border-text-acid rounded-[4px] cursor-pointer transition-all duration-[150ms] ease-std hover:scale-110 hover:rotate-6 flex items-center justify-center font-mono font-bold text-xs"
                          title="Hover to animate"
                        >
                          STD
                        </div>
                        <span className="font-mono text-[8px] text-slate-400">cubic-bezier(0.4, 0, 0.2, 1)</span>
                      </div>

                      {/* Decelerated Box */}
                      <div className="bg-bg-acid border border-border-acid/20 rounded-[4px] p-5 flex flex-col items-center justify-center text-center gap-3">
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-500">Decelerate (300ms)</span>
                        <div 
                          className="w-16 h-16 bg-brand-secondary border-2 border-text-acid rounded-[4px] cursor-pointer transition-all duration-[300ms] ease-dec hover:scale-110 hover:rotate-12 flex items-center justify-center font-mono font-bold text-xs text-white"
                          title="Hover to animate"
                        >
                          DEC
                        </div>
                        <span className="font-mono text-[8px] text-slate-400">cubic-bezier(0, 0, 0.2, 1)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-400 font-mono text-center">
                    * Reserved strictly for active mouse pointer interactions (hover & active tap).
                  </div>
                </div>
              </div>

              {/* DESIGN ASSETS SHOWCASE */}
              <div className="bg-white border border-border-acid rounded-[4px] p-6">
                <h3 className="font-heading text-md mb-2">06 · Preserved Brand Assets</h3>
                <p className="text-xs text-slate-500 mb-6">Original brand assets mapped by pixel specification coordinates. Refer to these files for logos and indicators.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Full Wordmark Logo */}
                  <div className="border border-border-acid/40 rounded-[4px] p-4 bg-bg-acid/40 flex flex-col items-center">
                    <div className="h-28 flex items-center justify-center mb-4">
                      {/* Logo mockup using design components */}
                      <div className="flex items-center gap-2 bg-white p-3 border-2 border-text-acid rounded-[4px] shadow-sm">
                        <div className="w-6 h-6 bg-brand-primary border-2 border-text-acid rounded-[2px] relative flex-shrink-0">
                          <div className="absolute inset-[3px] bg-brand-secondary rounded-[1px]" />
                        </div>
                        <span className="font-heading text-sm">Acid logo</span>
                      </div>
                    </div>
                    <div className="w-full text-left font-mono text-[11px]">
                      <strong className="block text-text-acid text-xs font-bold">Acid Full Logo</strong>
                      <span className="text-slate-400 block mt-0.5">Path: build/acid-logo.svg</span>
                      <span className="text-slate-500 block mt-2 text-[10px]">Primary lockup wordmark and icon</span>
                    </div>
                  </div>

                  {/* Icon mark */}
                  <div className="border border-border-acid/40 rounded-[4px] p-4 bg-bg-acid/40 flex flex-col items-center">
                    <div className="h-28 flex items-center justify-center mb-4">
                      <div className="w-14 h-14 bg-brand-primary border-2 border-text-acid rounded-[4px] relative shadow-sm">
                        <div className="absolute inset-[8px] bg-brand-secondary rounded-[2px]" />
                      </div>
                    </div>
                    <div className="w-full text-left font-mono text-[11px]">
                      <strong className="block text-text-acid text-xs font-bold">Acid Standalone Mark</strong>
                      <span className="text-slate-400 block mt-0.5">Path: build/acid-mark.svg</span>
                      <span className="text-slate-500 block mt-2 text-[10px]">Symbol used for favicons, badges, and status avatars</span>
                    </div>
                  </div>

                  {/* Reversed dark logo */}
                  <div className="border border-border-acid/40 rounded-[4px] p-4 bg-[#09090B] flex flex-col items-center">
                    <div className="h-28 flex items-center justify-center mb-4">
                      <div className="flex items-center gap-2 bg-text-acid p-3 border-2 border-white/25 rounded-[4px]">
                        <div className="w-6 h-6 bg-brand-primary border border-white rounded-[2px] relative flex-shrink-0">
                          <div className="absolute inset-[4px] bg-white rounded-[1px]" />
                        </div>
                        <span className="font-heading text-sm text-white">Acid logo</span>
                      </div>
                    </div>
                    <div className="w-full text-left font-mono text-[11px]">
                      <strong className="block text-white text-xs font-bold">Logo — Reversed</strong>
                      <span className="text-slate-400 block mt-0.5">Inverted backdrop asset</span>
                      <span className="text-slate-500 block mt-2 text-[10px]">Exclusively reserved for dark backgrounds</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'playground' && (
            <motion.div 
              key="playground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              {/* HEADER */}
              <div className="border-b-2 border-text-acid pb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-secondary font-bold">Interactive Sandbox · Playground</span>
                <h2 className="font-heading text-lg md:text-xl mt-1">Component Lab</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Directly test components built following the Acid guidelines. Inspect and copy compliant HTML blocks immediately for use in Open Design systems.
                </p>
              </div>

              {/* BUTTON SANDBOX */}
              <div className="bg-white border border-border-acid rounded-[4px] p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-md mb-2">01 · Buttons Sandbox</h3>
                  <p className="text-xs text-slate-500 mb-6">Test hover feedback, sizing scales, and triggers. Active clicks trigger action logs.</p>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-3 items-center p-4 bg-bg-acid/40 rounded border border-border-acid/15">
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Primary button clicked: triggered main event loop.')}
                        className="acid-btn acid-btn-primary"
                      >
                        Primary Action
                      </button>
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Secondary button clicked: recorded secondary flow.')}
                        className="acid-btn acid-btn-secondary"
                      >
                        Secondary
                      </button>
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Default button clicked: baseline registry logged.')}
                        className="acid-btn"
                      >
                        Default Action
                      </button>
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Ghost button clicked: initiated silent reload.')}
                        className="acid-btn acid-btn-ghost"
                      >
                        Ghost
                      </button>
                    </div>

                    {/* Button Special States */}
                    <div className="flex flex-wrap gap-3 items-center p-4 bg-bg-acid/40 rounded border border-border-acid/15">
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Icon arrow button triggered.')}
                        className="acid-btn acid-btn-primary"
                      >
                        <span>→ Continue</span>
                      </button>
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Icon add button triggered.')}
                        className="acid-btn"
                      >
                        <span>+ Add Item</span>
                      </button>
                      <button 
                        className="acid-btn" 
                        disabled
                        title="Disabled states do not animate"
                      >
                        Disabled Style
                      </button>
                    </div>

                    {/* Action Logs Box */}
                    <div className="bg-slate-900 text-slate-300 p-3 rounded-[4px] font-mono text-[10px] flex justify-between items-center">
                      <div>
                        <span className="text-slate-500 block uppercase font-bold">Playground Trigger Log:</span>
                        <span className="text-brand-primary">{playgroundBtnActionLog}</span>
                      </div>
                      <button 
                        onClick={() => setPlaygroundBtnActionLog('Cleared trigger logs.')}
                        className="text-[9px] text-slate-400 hover:text-white underline font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* COPYABLE BUTTON CODE */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-2">Pristine HTML/CSS Markup:</span>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-[4px] font-mono text-[11px] overflow-x-auto max-h-[220px] border border-border-acid/20">
                      <code>{CODE_SNIPPETS.buttons}</code>
                    </pre>
                  </div>
                  <button 
                    onClick={() => handleCopyToClipboard(CODE_SNIPPETS.buttons, 'btn-code')}
                    className="acid-btn w-full justify-center gap-2 text-xs font-mono mt-4"
                  >
                    {copiedKey === 'btn-code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'btn-code' ? 'Copied code snippet!' : 'Copy Button Markup'}</span>
                  </button>
                </div>
              </div>

              {/* INPUTS SANDBOX */}
              <div className="bg-white border border-border-acid rounded-[4px] p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-md mb-2">02 · Inputs Sandbox</h3>
                  <p className="text-xs text-slate-500 mb-6">Type and test validation focus rings. Validates patient ID format triggers real-time visual styling.</p>

                  <div className="flex flex-col gap-5">
                    {/* Input testing row */}
                    <div className="flex flex-col gap-3 p-4 bg-bg-acid/40 rounded border border-border-acid/15">
                      <label className="flex flex-col gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500">LIVE INPUT VALIDATOR (Try: PT-XXXXX)</span>
                        <input 
                          type="text"
                          value={playgroundInputVal}
                          onChange={(e) => setPlaygroundInputVal(e.target.value)}
                          className={`acid-input font-mono w-full ${
                            playgroundInputVal && !/^PT-\d{5}$/.test(playgroundInputVal) ? 'acid-input-error' : ''
                          }`}
                          placeholder="Type 'PT-00482' or similar..."
                        />
                      </label>
                      
                      {/* Interactive Feedback State */}
                      <span className="font-mono text-[10px] block">
                        {playgroundInputVal === '' ? (
                          <span className="text-slate-400">Waiting for clinical inputs...</span>
                        ) : /^PT-\d{5}$/.test(playgroundInputVal) ? (
                          <span className="text-emerald-600 font-bold">✓ FORMAT VALID</span>
                        ) : (
                          <span className="text-brand-secondary font-bold">! ERR: MUST MATCH PT-XXXXX</span>
                        )}
                      </span>
                    </div>

                    {/* Pre-styled States Preview */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 block mb-1">STRICT FOCUS SPECIMEN:</span>
                        <input className="acid-input w-full" value="Click to test glow ring" readOnly />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 block mb-1">STRICT ERROR SPECIMEN:</span>
                        <input className="acid-input acid-input-error w-full" value="Invalid input field" readOnly />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COPYABLE INPUT CODE */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-2">Input Fields Markup:</span>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-[4px] font-mono text-[11px] overflow-x-auto max-h-[220px] border border-border-acid/20">
                      <code>{CODE_SNIPPETS.inputs}</code>
                    </pre>
                  </div>
                  <button 
                    onClick={() => handleCopyToClipboard(CODE_SNIPPETS.inputs, 'inp-code')}
                    className="acid-btn w-full justify-center gap-2 text-xs font-mono mt-4"
                  >
                    {copiedKey === 'inp-code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'inp-code' ? 'Copied code snippet!' : 'Copy Input Markup'}</span>
                  </button>
                </div>
              </div>

              {/* BADGES & LIVE ALERT GENERATOR */}
              <div className="bg-white border border-border-acid rounded-[4px] p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-md mb-2">03 · Badges & Alerts Generator</h3>
                  <p className="text-xs text-slate-500 mb-6">Construct and visualize customized clinical notifications. Test visual densities.</p>

                  <div className="flex flex-col gap-5">
                    {/* Static badge gallery preview */}
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">BADGE SAMPLES:</span>
                      <div className="flex flex-wrap gap-2 items-center p-3.5 bg-bg-acid/40 border border-border-acid/15 rounded">
                        <span className="acid-badge">Default Gray</span>
                        <span className="acid-badge acid-badge-primary">● Active</span>
                        <span className="acid-badge acid-badge-secondary">New Badge</span>
                        <span className="acid-badge acid-badge-error">● Critical</span>
                      </div>
                    </div>

                    {/* Alert Construction Interface */}
                    <form onSubmit={handleAddPlaygroundAlert} className="flex flex-col gap-3">
                      <span className="font-mono text-[10px] font-bold text-slate-400">CONSTRUCT ALERTS:</span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text"
                          value={playgroundAlertText}
                          onChange={(e) => setPlaygroundAlertText(e.target.value)}
                          className="acid-input flex-grow text-xs font-mono"
                          placeholder="Type custom notification text..."
                          required
                        />
                        <select 
                          value={playgroundAlertType}
                          onChange={(e) => setPlaygroundAlertType(e.target.value as any)}
                          className="acid-input bg-white text-xs h-[44px]"
                        >
                          <option value="success">Success Type</option>
                          <option value="error">Error Type</option>
                          <option value="info">Info Type</option>
                        </select>
                        <button type="submit" className="acid-btn acid-btn-primary flex-shrink-0 text-xs">
                          Render
                        </button>
                      </div>
                    </form>

                    {/* Live Render Area */}
                    <div className="border border-dashed border-border-acid/30 p-4 rounded bg-bg-acid/30 flex flex-col gap-2.5">
                      <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">Live Render Container:</span>
                      {playgroundAlerts.length > 0 ? (
                        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {playgroundAlerts.map(alt => (
                            <div key={alt.id} className={`acid-alert ${alt.type === 'success' ? 'acid-alert-success' : alt.type === 'error' ? 'acid-alert-error' : 'acid-alert-info'} text-xs p-3.5 relative flex justify-between items-center`}>
                              <div className="flex gap-2 items-start">
                                <span className="acid-alert-icon leading-none font-bold">
                                  {alt.type === 'success' ? '✓' : alt.type === 'error' ? '!' : 'i'}
                                </span>
                                <div>
                                  <strong>{alt.type.toUpperCase()}:</strong> <span className="ml-1">{alt.text}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => setPlaygroundAlerts(prev => prev.filter(a => a.id !== alt.id))}
                                className="text-[10px] font-mono hover:underline font-bold text-border-acid opacity-60"
                              >
                                Clear
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`acid-alert ${playgroundAlertType === 'success' ? 'acid-alert-success' : playgroundAlertType === 'error' ? 'acid-alert-error' : 'acid-alert-info'} text-xs p-3.5`}>
                          <span className="acid-alert-icon font-bold leading-none">
                            {playgroundAlertType === 'success' ? '✓' : playgroundAlertType === 'error' ? '!' : 'i'}
                          </span>
                          <div>
                            <strong>LIVE PREVIEW:</strong> <span className="ml-1">{playgroundAlertText || 'Your message will render here.'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COPYABLE BADGE & ALERT CODE */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-2">Badges & Alerts Markup:</span>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-[4px] font-mono text-[11px] overflow-x-auto max-h-[220px] border border-border-acid/20">
                      <code>{CODE_SNIPPETS.badges}

{CODE_SNIPPETS.alerts}</code>
                    </pre>
                  </div>
                  <button 
                    onClick={() => handleCopyToClipboard(`${CODE_SNIPPETS.badges}\n\n${CODE_SNIPPETS.alerts}`, 'bad-code')}
                    className="acid-btn w-full justify-center gap-2 text-xs font-mono mt-4"
                  >
                    {copiedKey === 'bad-code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'bad-code' ? 'Copied markup code!' : 'Copy Alerts Markup'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rules' && (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              {/* HEADER */}
              <div className="border-b-2 border-text-acid pb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand-secondary font-bold">Guidelines · Quality Control</span>
                <h2 className="font-heading text-lg md:text-xl mt-1">Design System Directives</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Strict guidelines ensuring consistency across mock representations. Adhere strictly to these principles under Open Design or Claude workspaces.
                </p>
              </div>

              {/* RULES GRID LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Do list */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2 border-b border-dashed border-border-acid/20 pb-2">
                    <span className="px-2.5 py-0.5 bg-brand-primary border border-text-acid rounded-[4px] text-[10px] font-mono font-bold uppercase">System Do's</span>
                    <span className="text-xs text-slate-500 font-mono">Recommended Practices</span>
                  </div>

                  {DESIGN_RULES.dos.map(rule => (
                    <div key={rule.id} className="acid-card bg-white p-5 border-t-4 border-t-brand-primary relative">
                      <span className="font-mono text-[9px] uppercase font-bold text-slate-400 absolute top-5 right-5">{rule.id.toUpperCase()}</span>
                      <h4 className="font-heading text-xs uppercase mb-2 flex items-center gap-1.5 text-text-acid">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{rule.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Don'ts list */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2 border-b border-dashed border-border-acid/20 pb-2">
                    <span className="px-2.5 py-0.5 bg-brand-secondary text-white border border-text-acid rounded-[4px] text-[10px] font-mono font-bold uppercase">System Don'ts</span>
                    <span className="text-xs text-slate-500 font-mono">Strict Prohibitions</span>
                  </div>

                  {DESIGN_RULES.donts.map(rule => (
                    <div key={rule.id} className="acid-card bg-white p-5 border-t-4 border-t-brand-secondary relative">
                      <span className="font-mono text-[9px] uppercase font-bold text-slate-400 absolute top-5 right-5">{rule.id.toUpperCase()}</span>
                      <h4 className="font-heading text-xs uppercase mb-2 flex items-center gap-1.5 text-text-acid">
                        <AlertTriangle className="w-4 h-4 text-brand-secondary" />
                        <span>{rule.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OUTRO SUMMARY BRIEF */}
              <div className="acid-card bg-white p-6 border-l-4 border-l-border-acid">
                <h3 className="font-heading text-xs uppercase text-border-acid mb-2">Diagnostic Strictness Clause</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By adhering strictly to these programmatic tokens and visual parameters, design systems such as Claude Design and Open Design can correctly parse elements without encountering styling degradation or missing variables. This interactive showcase acts as the final evidence validation workspace.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 border-t-2 border-text-acid pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px] font-mono">
        <div>
          <span>Acid Design System v1.0.0</span>
          <span className="mx-2">·</span>
          <span>Released under Open Design Standards</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-brand-secondary fill-brand-secondary" />
            <span>Formulated for precision</span>
          </span>
          <span className="text-slate-400">|</span>
          <span>Diagnostics Instance: 2026</span>
        </div>
      </footer>
    </div>
  );
}
