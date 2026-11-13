import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Search, X } from 'lucide-react';
import { TAX_ARTICLES, TAX_CATEGORIES } from '../rules';
import { TaxArticle, TaxTypeId } from '../types/tax';

interface TaxArticleDirectoryProps {
  selectedCategory: 'semua' | TaxTypeId;
  onSelectCategory: (cat: 'semua' | TaxTypeId) => void;
  onOpenArticle: (article: TaxArticle) => void;
}

export const TaxArticleDirectory: React.FC<TaxArticleDirectoryProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenArticle,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TAX_ARTICLES.filter((art) => {
      const matchesCat = selectedCategory === 'semua' || art.taxType === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        art.title.toLowerCase().includes(q) ||
        art.legalBasis.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.taxTypeLabel.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const groupedArticles = useMemo(() => {
    const groups: { categoryId: TaxTypeId; label: string; scope: string; items: TaxArticle[] }[] =
      [];
    for (const cat of TAX_CATEGORIES) {
      const items = filteredArticles.filter((a) => a.taxType === cat.id);
      if (items.length > 0) {
        groups.push({ categoryId: cat.id, label: cat.label, scope: cat.scope, items });
      }
    }
    return groups;
  }, [filteredArticles]);

  const activeCategoryLabel =
    selectedCategory === 'semua'
      ? 'Semua Jenis Pajak'
      : TAX_CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? 'Pustaka Aturan';

  const handleResetFilters = () => {
    onSelectCategory('semua');
    setSearchQuery('');
  };

  return (
    <section aria-labelledby="heading-pustaka" className="py-6 sm:py-8 space-y-6">
      {/* Directory Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#5E706F]/30">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              id="heading-pustaka"
              className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F2A2C] dark:text-[#E8EAE4]"
            >
              Pustaka Aturan Pajak
            </h1>
            {selectedCategory !== 'semua' && (
              <span className="text-sm font-semibold text-[#6B5A00] dark:text-[#D9B92E]">
                / {activeCategoryLabel}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-[#4F6160] dark:text-[#E8EAE4]/75 leading-relaxed">
            Ringkasan ketentuan perpajakan Indonesia dikelompokkan per jenis pajak. Pilih salah satu
            artikel untuk membaca naskah lengkap dan menguji perhitungannya.
          </p>
          {selectedCategory !== 'semua' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onSelectCategory('semua')}
                className="min-h-[44px] inline-flex items-center text-xs font-semibold text-[#6B5A00] dark:text-[#D9B92E] underline underline-offset-4 decoration-[#D9B92E]/70 hover:decoration-[#D9B92E] active:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
              >
                Tampilkan semua jenis pajak
              </button>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search
            className="w-4 h-4 text-[#4F6160] dark:text-[#E8EAE4]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pasal, PP, PMK, atau topik"
            aria-label="Cari artikel aturan pajak"
            className="w-full min-h-[44px] pl-10 pr-10 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] placeholder:text-[#4F6160]/75 dark:placeholder:text-[#E8EAE4]/50 border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Bersihkan pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#4F6160] dark:text-[#E8EAE4]/75 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4] hover:bg-[#5E706F]/15 active:bg-[#D9B92E]/30 active:text-[#1F2A2C] dark:active:text-[#E8EAE4] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {groupedArticles.length === 0 ? (
        <div className="py-10 text-left max-w-lg space-y-3">
          <p className="text-lg font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]">
            Tidak ada aturan yang cocok dengan &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-sm text-[#4F6160] dark:text-[#E8EAE4]/75">
            Coba kata kunci seperti PP 58, PMK 131, UU HPP, atau tampilkan kembali seluruh jenis
            pajak.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="min-h-[44px] px-5 py-2 text-sm font-semibold bg-[#D9B92E] text-[#1F2A2C] facet-cut-sm hover:brightness-95 active:brightness-90 active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A2C]"
          >
            Tampilkan semua aturan
          </button>
        </div>
      ) : (
        /* Grouped Regulation Index directly on surface (no card grids, no pill tabs) */
        <div className="space-y-10">
          {groupedArticles.map((group) => (
            <div key={group.categoryId} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[#1F2A2C]/25 dark:border-[#E8EAE4]/25">
                <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]">
                  {group.label}
                </h2>
                <p className="text-xs sm:text-sm text-[#4F6160] dark:text-[#E8EAE4]/70">
                  {group.scope}
                </p>
              </div>

              <ul className="divide-y divide-[#5E706F]/25">
                {group.items.map((article) => (
                  <li key={article.id}>
                    <button
                      type="button"
                      onClick={() => onOpenArticle(article)}
                      className="w-full text-left py-4 px-2.5 sm:px-3 -mx-2.5 sm:-mx-3 flex items-start justify-between gap-4 shadow-[inset_3px_0_0_0_transparent] hover:shadow-[inset_3px_0_0_0_#D9B92E] active:shadow-[inset_3px_0_0_0_#D9B92E] hover:bg-[#DFE2DA]/75 dark:hover:bg-[#263336]/75 active:bg-[#D6DAD0] dark:active:bg-[#2E3D40] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="text-xs font-medium text-[#4F6160] dark:text-[#E8EAE4]/70">
                          <span>{article.legalBasis}</span>
                          <span className="mx-2">/</span>
                          <span>Berlaku {article.effectiveDate}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#1F2A2C] dark:text-[#E8EAE4] group-hover:text-[#6B5A00] dark:group-hover:text-[#D9B92E] group-active:text-[#6B5A00] dark:group-active:text-[#D9B92E] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-sm text-[#4F6160] dark:text-[#E8EAE4]/80 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="shrink-0 mt-1 text-[#5E706F] dark:text-[#E8EAE4]/70 group-hover:text-[#6B5A00] dark:group-hover:text-[#D9B92E] group-active:text-[#6B5A00] dark:group-active:text-[#D9B92E] group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

interface TaxArticleDetailPageProps {
  article: TaxArticle;
  onBackToDirectory: () => void;
  onSelectArticle: (article: TaxArticle) => void;
}

export const TaxArticleDetailPage: React.FC<TaxArticleDetailPageProps> = ({
  article,
  onBackToDirectory,
  onSelectArticle,
}) => {
  const [sidebarQuery, setSidebarQuery] = useState<string>('');

  useEffect(() => {
    setSidebarQuery('');
  }, [article.taxType]);

  const sameCategoryArticles = useMemo(() => {
    const q = sidebarQuery.trim().toLowerCase();
    return TAX_ARTICLES.filter((a) => {
      if (a.taxType !== article.taxType) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.legalBasis.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    });
  }, [article.taxType, sidebarQuery]);

  return (
    <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <article aria-labelledby="article-page-title" className="lg:col-span-8 space-y-7">
        {/* Back navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#5E706F]/25">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="min-h-[44px] px-2.5 -ml-2.5 inline-flex items-center gap-2 text-sm font-semibold text-[#1F2A2C] dark:text-[#E8EAE4] hover:bg-[#DFE2DA]/75 dark:hover:bg-[#263336]/75 active:bg-[#D6DAD0] dark:active:bg-[#2E3D40] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Kembali ke Pustaka Aturan</span>
          </button>

          <span className="text-xs font-semibold text-[#6B5A00] dark:text-[#D9B92E]">
            {article.taxTypeLabel}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#4F6160] dark:text-[#E8EAE4]/75">
            <span>Berlaku sejak {article.effectiveDate}</span>
          </div>

          <h1
            id="article-page-title"
            className="font-editorial text-2xl sm:text-4xl font-semibold leading-tight text-[#1F2A2C] dark:text-[#E8EAE4]"
          >
            {article.title}
          </h1>

          <p className="text-sm font-medium text-[#4F6160] dark:text-[#E8EAE4]/80">
            Dasar hukum: {article.legalBasis}
          </p>
        </header>

        {/* Lead Summary */}
        <p className="text-base sm:text-lg font-medium leading-relaxed text-[#1F2A2C] dark:text-[#E8EAE4] max-w-prose pt-2 border-t border-[#5E706F]/25">
          {article.summary}
        </p>

        {/* Body Prose */}
        <div className="space-y-6 max-w-prose">
          {article.sections.map((sec, idx) => (
            <section key={idx} className="space-y-2.5">
              <h2 className="font-editorial text-lg sm:text-xl font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[15px] sm:text-base leading-relaxed text-[#1F2A2C]/90 dark:text-[#E8EAE4]/85"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Statutory Comparison Table directly on page surface */}
        {article.comparisonTable && (
          <section className="pt-2 space-y-3">
            <h2 className="font-editorial text-lg sm:text-xl font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]">
              Ringkasan Perubahan Ketentuan
            </h2>
            <div className="overflow-x-auto table-scroll">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#5E706F]/40 text-xs text-[#4F6160] dark:text-[#E8EAE4]/75">
                    <th scope="col" className="py-2.5 pr-4 font-semibold">
                      Aspek Aturan
                    </th>
                    <th scope="col" className="py-2.5 px-3 font-semibold">
                      {article.comparisonTable.oldHeader}
                    </th>
                    <th
                      scope="col"
                      className="py-2.5 pl-3 font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      {article.comparisonTable.newHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {article.comparisonTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-[#5E706F]/20 align-top">
                      <td className="py-3 pr-4 font-medium text-[#1F2A2C] dark:text-[#E8EAE4]">
                        {row.aspek}
                      </td>
                      <td className="py-3 px-3 text-[#4F6160] dark:text-[#E8EAE4]/75">
                        {row.aturanLama}
                      </td>
                      <td className="py-3 pl-3 font-medium text-[#1F2A2C] dark:text-[#E8EAE4]">
                        {row.aturanBaru}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </article>

      {/* Cross-Article Navigation within the same tax category: Bottom on mobile, Sticky right rail on desktop */}
      <aside
        aria-label={`Artikel dalam kategori ${article.taxTypeLabel}`}
        className="lg:col-span-4 lg:sticky lg:top-8 pt-6 border-t lg:pt-0 lg:border-t-0 lg:pl-8 lg:border-l border-[#5E706F]/25 space-y-4"
      >
        <div className="space-y-2.5 pb-3 border-b border-[#5E706F]/25">
          <p className="text-xs font-semibold text-[#6B5A00] dark:text-[#D9B92E]">
            {article.taxTypeLabel}
          </p>
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#4F6160] dark:text-[#E8EAE4]/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={sidebarQuery}
              onChange={(e) => setSidebarQuery(e.target.value)}
              placeholder={`Cari aturan ${article.taxTypeLabel}`}
              aria-label={`Cari artikel ${article.taxTypeLabel}`}
              className="w-full min-h-[44px] pl-9 pr-9 py-1.5 text-base lg:text-sm bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] placeholder:text-[#4F6160]/75 dark:placeholder:text-[#E8EAE4]/50 border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
            />
            {sidebarQuery && (
              <button
                type="button"
                onClick={() => setSidebarQuery('')}
                aria-label="Bersihkan pencarian artikel"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#4F6160] dark:text-[#E8EAE4]/75 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4] hover:bg-[#5E706F]/15 active:bg-[#D9B92E]/30 active:text-[#1F2A2C] dark:active:text-[#E8EAE4] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {sameCategoryArticles.length === 0 ? (
          <div className="py-4 space-y-2">
            <p className="text-sm text-[#4F6160] dark:text-[#E8EAE4]/75">
              Tidak ada artikel {article.taxTypeLabel} yang cocok dengan &ldquo;{sidebarQuery}
              &rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSidebarQuery('')}
              className="min-h-[44px] inline-flex items-center text-xs font-semibold text-[#6B5A00] dark:text-[#D9B92E] underline underline-offset-4 active:opacity-70 transition-opacity"
            >
              Bersihkan pencarian
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[#5E706F]/20">
            {sameCategoryArticles.map((item) => {
              const isCurrent = item.id === article.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCurrent) onSelectArticle(item);
                    }}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`w-full text-left py-3.5 px-3 -mx-3 transition-colors flex items-start justify-between gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E] ${
                      isCurrent
                        ? 'bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] facet-cut-sm cursor-default'
                        : 'text-[#1F2A2C]/85 dark:text-[#E8EAE4]/80 shadow-[inset_3px_0_0_0_transparent] hover:shadow-[inset_3px_0_0_0_#D9B92E] active:shadow-[inset_3px_0_0_0_#D9B92E] hover:bg-[#DFE2DA]/70 dark:hover:bg-[#263336]/70 active:bg-[#D6DAD0] dark:active:bg-[#2E3D40]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-[#4F6160] dark:text-[#E8EAE4]/70">
                        {item.legalBasis}
                      </div>
                      <div
                        className={`text-sm font-semibold leading-snug transition-colors ${
                          !isCurrent
                            ? 'group-hover:text-[#6B5A00] dark:group-hover:text-[#D9B92E] group-active:text-[#6B5A00] dark:group-active:text-[#D9B92E]'
                            : ''
                        }`}
                      >
                        {item.title}
                      </div>
                    </div>
                    {!isCurrent && (
                      <ChevronRight
                        className="w-4 h-4 shrink-0 mt-1 text-[#5E706F] dark:text-[#E8EAE4]/70 group-hover:text-[#6B5A00] dark:group-hover:text-[#D9B92E] group-active:text-[#6B5A00] dark:group-active:text-[#D9B92E] group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-all"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
};
