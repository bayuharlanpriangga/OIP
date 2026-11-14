import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { OriasFacetMark } from './components/OriasFacetMark';
import { TaxArticleDetailPage, TaxArticleDirectory } from './components/TaxArticleLibrary';
import { DEFAULT_CALCULATOR_INPUT, TAX_ARTICLES, TAX_CATEGORIES, TAX_REGIMES } from './rules';
import { TaxArticle, TaxCalculatorInput, TaxTypeId } from './types/tax';

const TaxCalculatorWorkspace = lazy(() =>
  import('./components/TaxCalculatorWorkspace').then((m) => ({
    default: m.TaxCalculatorWorkspace,
  }))
);

type ActiveView = 'pustaka' | 'artikel' | 'kalkulator';

const DEFAULT_REGIME_BY_TYPE: Record<TaxTypeId, string> = {
  pph21: 'pph21_ter_2024',
  pph22: 'pph22_pmk51_2025',
  pph23: 'pph23_pmk141_2015',
  pph4_2: 'pph4_2_pp9_2022',
  pph_umkm: 'umkm_pp20_2026',
  pph25: 'pph25_pmk81_2024',
  pph26: 'pph26_pp9_2021',
  pph15: 'pph15_kmk416_1996',
  pph_badan: 'badan_hpp_2022',
  ppn: 'ppn_pmk131_2025',
  ppnbm: 'ppnbm_pp74_2021',
  pbb: 'pbb_hkpd_2022',
  bphtb: 'bphtb_hkpd_2022',
  pbjt: 'pbjt_hkpd_2022',
  bea_meterai: 'meterai_uu10_2020',
};

interface ParsedHashRoute {
  activeView: ActiveView;
  category: 'semua' | TaxTypeId;
  article: TaxArticle | null;
  taxType: TaxTypeId;
  regimeId: string;
}

function isValidTaxType(val: string): val is TaxTypeId {
  return TAX_CATEGORIES.some((c) => c.id === val);
}

function parseAppHash(rawHash: string): ParsedHashRoute {
  const cleaned = rawHash.replace(/^#\/?/, '').trim();
  const segments = cleaned ? cleaned.split('/').map((s) => decodeURIComponent(s)) : [];
  const base: ParsedHashRoute = {
    activeView: 'pustaka',
    category: 'semua',
    article: null,
    taxType: 'pph21',
    regimeId: DEFAULT_REGIME_BY_TYPE.pph21,
  };

  if (segments[0] === 'artikel' && segments[1]) {
    const found = TAX_ARTICLES.find((a) => a.id === segments[1]);
    if (found) {
      return {
        ...base,
        activeView: 'artikel',
        category: found.taxType,
        article: found,
      };
    }
  }

  if (segments[0] === 'kalkulator') {
    const taxType = segments[1] && isValidTaxType(segments[1]) ? segments[1] : 'pph21';
    const candidateRegime = segments[2];
    const validRegime = candidateRegime
      ? TAX_REGIMES.find((r) => r.taxType === taxType && r.id === candidateRegime)?.id
      : undefined;
    const defaultReg =
      DEFAULT_REGIME_BY_TYPE[taxType] ||
      TAX_REGIMES.find((r) => r.taxType === taxType)?.id ||
      '';
    return {
      ...base,
      activeView: 'kalkulator',
      taxType,
      regimeId: validRegime ?? defaultReg,
    };
  }

  if (segments[0] === 'pustaka' && segments[1] && isValidTaxType(segments[1])) {
    return {
      ...base,
      activeView: 'pustaka',
      category: segments[1],
    };
  }

  return base;
}

function setBrowserHash(nextHash: string) {
  if (typeof window === 'undefined') return;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, '', nextHash);
  }
}

export default function App() {
  const [initialRoute] = useState<ParsedHashRoute>(() =>
    parseAppHash(typeof window !== 'undefined' ? window.location.hash : '')
  );

  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>(initialRoute.activeView);
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<'semua' | TaxTypeId>(
    initialRoute.category
  );
  const [selectedArticle, setSelectedArticle] = useState<TaxArticle | null>(initialRoute.article);

  const [isPustakaDropdownOpen, setIsPustakaDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [activeTaxType, setActiveTaxType] = useState<TaxTypeId>(initialRoute.taxType);
  const [regimeId, setRegimeId] = useState<string>(initialRoute.regimeId);
  const [calcInput, setCalcInput] = useState<TaxCalculatorInput>(DEFAULT_CALCULATOR_INPUT);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseAppHash(window.location.hash);
      setActiveView(parsed.activeView);
      setSelectedArticleCategory(parsed.category);
      setSelectedArticle(parsed.article);
      if (parsed.activeView === 'kalkulator') {
        setActiveTaxType(parsed.taxType);
        setRegimeId(parsed.regimeId);
      }
      setIsPustakaDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticleCategory = (category: 'semua' | TaxTypeId) => {
    setSelectedArticleCategory(category);
    setBrowserHash(category === 'semua' ? '#/pustaka' : `#/pustaka/${category}`);
  };

  const handleSelectTaxTypeForCalc = (taxType: TaxTypeId) => {
    setActiveTaxType(taxType);
    const defaultId = DEFAULT_REGIME_BY_TYPE[taxType];
    const regimesForType = TAX_REGIMES.filter((r) => r.taxType === taxType);
    const nextRegime = defaultId || regimesForType[0]?.id || '';
    setRegimeId(nextRegime);
    setBrowserHash(`#/kalkulator/${taxType}/${nextRegime}`);
  };

  const handleChangeRegimeForCalc = (nextRegimeId: string) => {
    setRegimeId(nextRegimeId);
    setBrowserHash(`#/kalkulator/${activeTaxType}/${nextRegimeId}`);
  };

  const handleNavigatePustaka = (category: 'semua' | TaxTypeId = 'semua') => {
    setSelectedArticleCategory(category);
    setSelectedArticle(null);
    setActiveView('pustaka');
    setIsPustakaDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setBrowserHash(category === 'semua' ? '#/pustaka' : `#/pustaka/${category}`);
    scrollToTop();
  };

  const handleNavigateKalkulator = () => {
    setActiveView('kalkulator');
    setIsPustakaDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setBrowserHash(`#/kalkulator/${activeTaxType}/${regimeId}`);
    scrollToTop();
  };

  const handleOpenArticle = (article: TaxArticle) => {
    setSelectedArticle(article);
    setActiveView('artikel');
    setIsPustakaDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setBrowserHash(`#/artikel/${article.id}`);
    scrollToTop();
  };

  const isPustakaActive = activeView === 'pustaka' || activeView === 'artikel';

  return (
    <div
      id="top"
      className="min-h-dvh flex flex-col bg-[#E8EAE4] dark:bg-[#1F2A2C] text-[#1F2A2C] dark:text-[#E8EAE4] transition-colors duration-200 overflow-x-clip"
    >
      {/* Header Navigation */}
      <header className="relative z-40 border-b border-[#5E706F]/30 bg-[#E8EAE4] dark:bg-[#1F2A2C]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigatePustaka('semua')}
            className="min-h-[44px] inline-flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
          >
            <OriasFacetMark className="w-6 h-6 shrink-0" />
            <span className="font-editorial">OIP</span>
          </button>

          {/* Desktop Navigation */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {/* Pustaka Aturan with Hover Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPustakaDropdownOpen(true)}
              onMouseLeave={() => setIsPustakaDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => handleNavigatePustaka('semua')}
                aria-expanded={isPustakaDropdownOpen}
                aria-haspopup="true"
                className={`min-h-[44px] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E] ${
                  isPustakaActive
                    ? 'text-[#1F2A2C] dark:text-[#E8EAE4] font-semibold underline underline-offset-8 decoration-2 decoration-[#D9B92E]'
                    : 'text-[#4F6160] dark:text-[#E8EAE4]/80 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4]'
                }`}
              >
                <span>Pustaka Aturan</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isPustakaDropdownOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isPustakaDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Filter jenis pajak"
                  className="absolute left-0 top-full w-64 max-h-[75vh] overflow-y-auto table-scroll bg-[#DFE2DA] dark:bg-[#263336] border border-[#5E706F]/45 py-1.5 z-50 facet-cut"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigatePustaka('semua')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                      selectedArticleCategory === 'semua' && activeView === 'pustaka'
                        ? 'bg-[#D9B92E] text-[#1F2A2C] font-semibold'
                        : 'text-[#1F2A2C] dark:text-[#E8EAE4] hover:bg-[#5E706F]/15'
                    }`}
                  >
                    <span>Semua Jenis Pajak</span>
                  </button>
                  <div className="my-1 border-t border-[#5E706F]/25" />
                  {TAX_CATEGORIES.map((cat) => {
                    const isCatActive =
                      selectedArticleCategory === cat.id && activeView === 'pustaka';
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleNavigatePustaka(cat.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isCatActive
                            ? 'bg-[#D9B92E] text-[#1F2A2C] font-semibold'
                            : 'text-[#1F2A2C] dark:text-[#E8EAE4] hover:bg-[#5E706F]/15'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleNavigateKalkulator}
              className={`min-h-[44px] whitespace-nowrap shrink-0 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E] ${
                activeView === 'kalkulator'
                  ? 'text-[#1F2A2C] dark:text-[#E8EAE4] font-semibold underline underline-offset-8 decoration-2 decoration-[#D9B92E]'
                  : 'text-[#4F6160] dark:text-[#E8EAE4]/80 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4]'
              }`}
            >
              Kalkulator
            </button>
          </nav>

          {/* Right Header Controls: Theme switch (Desktop) & Unboxed Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? 'Ganti ke mode terang Kapur' : 'Ganti ke mode gelap Basalt'}
              className="hidden md:inline-flex min-h-[40px] px-3.5 py-2 text-xs font-semibold border border-[#5E706F]/45 bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] items-center gap-2 hover:bg-[#D6DAD0] dark:hover:bg-[#2E3D40] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Mode Gelap</span>
                </>
              )}
            </button>

            {/* Unboxed Mobile Menu Button (text-color highlight only on press/hover) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-header-dropdown"
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="md:hidden min-h-[44px] px-2 py-2 text-sm font-semibold text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Tutup</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel Directly From Header */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-header-dropdown"
            aria-label="Navigasi seluler"
            className="md:hidden absolute left-0 right-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#DFE2DA] dark:bg-[#263336] border-b border-[#5E706F]/45 px-4 py-4 space-y-4 z-50"
          >
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleNavigatePustaka('semua')}
                className={`w-full min-h-[44px] px-3 py-2 text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                  isPustakaActive && selectedArticleCategory === 'semua'
                    ? 'bg-[#D9B92E] text-[#1F2A2C] facet-cut-sm active:opacity-80'
                    : 'text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E]'
                }`}
              >
                <span>Pustaka Aturan (Semua)</span>
              </button>

              {/* Nested tax category links under Pustaka Aturan */}
              <div className="pl-3 border-l border-[#5E706F]/35 space-y-1">
                {TAX_CATEGORIES.map((cat) => {
                  const activeCat = isPustakaActive && selectedArticleCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNavigatePustaka(cat.id)}
                      className={`w-full min-h-[42px] px-3 py-1.5 text-left text-sm transition-colors ${
                        activeCat
                          ? 'bg-[#D9B92E] text-[#1F2A2C] font-semibold facet-cut-sm active:opacity-80'
                          : 'text-[#4F6160] dark:text-[#E8EAE4]/85 hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#5E706F]/25">
              <button
                type="button"
                onClick={handleNavigateKalkulator}
                className={`w-full min-h-[44px] px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  activeView === 'kalkulator'
                    ? 'bg-[#D9B92E] text-[#1F2A2C] facet-cut-sm active:opacity-80'
                    : 'text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E]'
                }`}
              >
                Kalkulator Pajak
              </button>
            </div>

            <div className="pt-2 border-t border-[#5E706F]/25">
              <button
                type="button"
                onClick={() => setIsDark((d) => !d)}
                className="w-full min-h-[44px] px-3 py-2 text-left text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] inline-flex items-center gap-2.5 transition-colors"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Ganti ke Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Ganti ke Mode Gelap</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeView === 'pustaka' && (
          <TaxArticleDirectory
            selectedCategory={selectedArticleCategory}
            onSelectCategory={handleSelectArticleCategory}
            onOpenArticle={handleOpenArticle}
          />
        )}

        {activeView === 'artikel' && selectedArticle && (
          <TaxArticleDetailPage
            article={selectedArticle}
            onBackToDirectory={() => handleNavigatePustaka(selectedArticleCategory)}
            onSelectArticle={handleOpenArticle}
          />
        )}

        {activeView === 'kalkulator' && (
          <Suspense
            fallback={
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-10 text-sm text-[#4F6160] dark:text-[#E8EAE4]/75">
                Memuat kalkulator pajak…
              </div>
            }
          >
            <TaxCalculatorWorkspace
              activeTaxType={activeTaxType}
              onSelectTaxType={handleSelectTaxTypeForCalc}
              regimeId={regimeId}
              onChangeRegime={handleChangeRegimeForCalc}
              calcInput={calcInput}
              onChangeInput={setCalcInput}
            />
          </Suspense>
        )}
      </main>

      {/* Quiet, Functional Footer */}
      <footer className="border-t border-[#5E706F]/30 mt-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
          <p>OIP — Orias Indonesia Pajak</p>
          <div className="flex items-center gap-5 shrink-0 font-medium">
            <button
              type="button"
              onClick={() => handleNavigatePustaka('semua')}
              className="min-h-[44px] inline-flex items-center underline underline-offset-4 decoration-[#5E706F]/45 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4] hover:decoration-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] active:decoration-[#D9B92E] transition-colors"
            >
              Pustaka Aturan
            </button>
            <button
              type="button"
              onClick={handleNavigateKalkulator}
              className="min-h-[44px] inline-flex items-center underline underline-offset-4 decoration-[#5E706F]/45 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4] hover:decoration-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] active:decoration-[#D9B92E] transition-colors"
            >
              Kalkulator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
