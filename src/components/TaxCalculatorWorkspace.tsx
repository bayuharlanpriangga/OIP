import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw,
} from 'lucide-react';
import {
  DEFAULT_CALCULATOR_INPUT,
  TAX_CATEGORIES,
  TAX_REGIMES,
  runTaxCalculation,
} from '../rules';
import {
  BphtbAcquisitionType,
  PbbTierRate,
  PbjtSectorType,
  Pph15SectorType,
  Pph22ObjectType,
  Pph23ObjectType,
  Pph26ObjectType,
  Pph4_2ObjectType,
  PpnGoodsType,
  PpnbmCategoryType,
  PtkpStatus,
  TaxCalculatorInput,
  TaxTypeId,
  UmkmSubjectType,
} from '../types/tax';
import { formatPersen, formatRupiah } from '../utils/formatters';
import { CurrencyInput } from './CurrencyInput';

interface TaxCalculatorWorkspaceProps {
  activeTaxType: TaxTypeId;
  onSelectTaxType: (taxType: TaxTypeId) => void;
  regimeId: string;
  onChangeRegime: (id: string) => void;
  calcInput: TaxCalculatorInput;
  onChangeInput: React.Dispatch<React.SetStateAction<TaxCalculatorInput>>;
}

const PTKP_OPTIONS: { value: PtkpStatus; label: string }[] = [
  { value: 'TK/0', label: 'TK/0 — Tidak kawin, 0 tanggungan' },
  { value: 'TK/1', label: 'TK/1 — Tidak kawin, 1 tanggungan' },
  { value: 'TK/2', label: 'TK/2 — Tidak kawin, 2 tanggungan' },
  { value: 'TK/3', label: 'TK/3 — Tidak kawin, 3 tanggungan' },
  { value: 'K/0', label: 'K/0 — Kawin, 0 tanggungan' },
  { value: 'K/1', label: 'K/1 — Kawin, 1 tanggungan' },
  { value: 'K/2', label: 'K/2 — Kawin, 2 tanggungan' },
  { value: 'K/3', label: 'K/3 — Kawin, 3 tanggungan' },
];

const PPH22_OBJECTS: { value: Pph22ObjectType; label: string }[] = [
  { value: 'impor_api', label: 'Impor barang umum dengan API (2,5%)' },
  { value: 'impor_non_api', label: 'Impor barang tanpa API (7,5%)' },
  { value: 'impor_komoditas_tertentu', label: 'Impor kedelai, gandum, atau tepung terigu API (0,5%)' },
  { value: 'impor_konsumsi_10', label: 'Impor barang konsumsi tertentu Lampiran I (10% PMK 110/2018)' },
  { value: 'bendahara_bumn', label: 'Belanja barang Bendahara Pemerintah / BUMN (1,5%)' },
  { value: 'ekspor_tambang_1_5', label: 'Ekspor komoditas tambang minerba & batubara IUPK/izin (1,5%)' },
  { value: 'pengumpul_kehutanan_perkebunan_0_25', label: 'Pembelian bahan industri dari pedagang pengumpul kehutanan/perkebunan/pertanian/perikanan (0,25% PMK 16/2016)' },
  { value: 'bulion_emas', label: 'Emas batangan / bulion LJK berizin OJK (0,25% PMK 51/2025)' },
  { value: 'barang_sangat_mewah', label: 'Penjualan barang sangat mewah tertentu (5%)' },
];

const PPH23_OBJECTS: { value: Pph23ObjectType; label: string }[] = [
  { value: 'jasa_konsultan', label: 'Jasa konsultan, akuntansi & hukum' },
  { value: 'jasa_teknik_manajemen', label: 'Jasa teknik, manajemen & konstruksi' },
  { value: 'sewa_harta', label: 'Sewa & penggunaan harta (selain tanah/bangunan)' },
  { value: 'royalti', label: 'Royalti, bunga & hadiah penghargaan' },
  { value: 'dividen_badan', label: 'Dividen diterima WP Badan dalam negeri' },
];

const PPH4_2_OBJECTS: { value: Pph4_2ObjectType; label: string }[] = [
  { value: 'sewa_tanah_bangunan', label: 'Persewaan tanah dan/atau bangunan (10%)' },
  { value: 'konstruksi_kecil', label: 'Pelaksana konstruksi SBU Kecil (1,75% / 2%)' },
  { value: 'konstruksi_menengah_besar', label: 'Pelaksana konstruksi SBU Menengah/Besar (2,65% / 3%)' },
  { value: 'konstruksi_tanpa_sbu', label: 'Pelaksana konstruksi tanpa SBU (4%)' },
  { value: 'konsultansi_konstruksi_sbu', label: 'Jasa konsultansi konstruksi ber-SBU (3,5% / 4%)' },
  { value: 'konsultansi_konstruksi_tanpa_sbu', label: 'Jasa konsultansi konstruksi tanpa SBU (6%)' },
  { value: 'pengalihan_tanah_bangunan', label: 'Pengalihan hak tanah & bangunan umum (2,5% / 5%)' },
];

const PPH26_OBJECTS: { value: Pph26ObjectType; label: string }[] = [
  { value: 'dividen_royalti_jasa', label: 'Dividen, royalti, jasa teknik, & hadiah WPLN (20%)' },
  { value: 'bunga_obligasi_wpln', label: 'Bunga obligasi diterima WPLN (10% PP 9/2021 / 20% lama)' },
  { value: 'premi_asuransi_ln', label: 'Premi asuransi dibayar ke perusahaan asuransi LN (eff. 10%)' },
];

const PPH15_SECTORS: { value: Pph15SectorType; label: string }[] = [
  { value: 'pelayaran_dn', label: 'Pelayaran dalam negeri (1,2% final — KMK 416/1996)' },
  { value: 'penerbangan_dn_charter', label: 'Penerbangan dalam negeri / charter (1,8% tidak final — KMK 475/1996)' },
  { value: 'pelayaran_penerbangan_ln', label: 'Pelayaran / penerbangan luar negeri BUT (2,64% final — KMK 417/1996)' },
];

const PPNBM_CATEGORIES: { value: PpnbmCategoryType; label: string }[] = [
  { value: 'listrik_bev', label: 'Kendaraan listrik murni BEV/FCEV (0% PP 74/2021 / 10% PP 41/2013)' },
  { value: 'lcgc', label: 'LCGC / KBH2 (3% efektif PP 74/2021 / 0% PP 41/2013)' },
  { value: 'hybrid_full', label: 'Full Hybrid hemat emisi <= 3.000 cc (6% efektif PP 74/2021 / 20% lama)' },
  { value: 'sedan_suv_menengah', label: 'Mobil penumpang / SUV menengah s.d. 3.000 cc (20% / 30%)' },
  { value: 'kendaraan_emisi_tinggi', label: 'Kendaraan emisi tinggi / > 3.000 cc (40% / 125%)' },
  { value: 'hunian_mewah', label: 'Hunian mewah: rumah / apartemen >= Rp 30 miliar (20%)' },
  { value: 'balon_udara_peluru', label: 'Balon udara, pesawat tanpa penggerak, & peluru (40%)' },
  { value: 'helikopter_senjata_api', label: 'Helikopter / pesawat non-niaga & senjata api non-negara (50%)' },
  { value: 'kapal_pesiar_pesawat', label: 'Kapal pesiar, yacht, & pesawat pribadi non-niaga (75%)' },
];

const PBJT_SECTORS: { value: PbjtSectorType; label: string }[] = [
  { value: 'makanan_minuman', label: 'Makanan dan/atau minuman / restoran (maks 10%)' },
  { value: 'perhotelan', label: 'Jasa perhotelan (maks 10%)' },
  { value: 'parkir', label: 'Jasa parkir (maks 10% HKPD / 30% PDRD)' },
  { value: 'hiburan_umum', label: 'Kesenian & hiburan umum (maks 10% HKPD / 35% PDRD)' },
  { value: 'hiburan_khusus', label: 'Hiburan khusus: diskotek, karaoke, kelab, spa (40%–75%)' },
  { value: 'tenaga_listrik', label: 'Tenaga listrik konsumsi umum (maks 10%)' },
];

export const TaxCalculatorWorkspace: React.FC<TaxCalculatorWorkspaceProps> = ({
  activeTaxType,
  onSelectTaxType,
  regimeId,
  onChangeRegime,
  calcInput,
  onChangeInput,
}) => {
  const [showDetailedSteps, setShowDetailedSteps] = useState<boolean>(true);

  const availableRegimes = useMemo(
    () => TAX_REGIMES.filter((r) => r.taxType === activeTaxType),
    [activeTaxType]
  );

  const activeCategory = useMemo(
    () => TAX_CATEGORIES.find((c) => c.id === activeTaxType) ?? TAX_CATEGORIES[0],
    [activeTaxType]
  );

  const result = useMemo(
    () => runTaxCalculation(activeTaxType, calcInput, regimeId),
    [activeTaxType, calcInput, regimeId]
  );

  const handleResetToZero = () => {
    onChangeInput((prev) => ({
      ...prev,
      [activeTaxType]: DEFAULT_CALCULATOR_INPUT[activeTaxType],
    }));
  };

  return (
    <section id="kalkulator" aria-labelledby="heading-kalkulator" className="pb-6 sm:pb-8">
      <h1 id="heading-kalkulator" className="sr-only">
        Kalkulator Pajak Multi-Aturan
      </h1>

      {/* Full-bleed Section Banner flush to header & edges */}
      <div className="w-full border-b border-[#5E706F]/25 bg-[#E8EAE4] dark:bg-[#263336]">
        <img
          src={`${import.meta.env.BASE_URL}assets/banner/Banner_Kalkulator.jpg`}
          alt="Kalkulator Pajak Multi-Aturan"
          className="w-full h-auto block"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      {/* Tax Type Selector Tabs */}
      <div
        role="tablist"
        aria-label="Pilih jenis pajak"
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto table-scroll py-4 border-b border-[#5E706F]/25"
      >
        {TAX_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeTaxType;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectTaxType(cat.id)}
              className={`min-h-[44px] px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E] ${
                isActive
                  ? 'bg-[#1F2A2C] text-[#E8EAE4] dark:bg-[#E8EAE4] dark:text-[#1F2A2C] facet-cut-sm active:opacity-85'
                  : 'bg-[#DFE2DA] dark:bg-[#263336] text-[#4F6160] dark:text-[#E8EAE4]/80 hover:text-[#1F2A2C] dark:hover:text-[#E8EAE4] active:text-[#6B5A00] dark:active:text-[#D9B92E] active:border-[#D9B92E] border border-[#5E706F]/30'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Asymmetric Workspace: 42% Inputs / 58% Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-6 items-start">
        {/* LEFT COLUMN: Single Rule Selector + Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]">
              {activeCategory.label}
            </h2>
            <p className="text-sm text-[#4F6160] dark:text-[#E8EAE4]/75">{activeCategory.scope}</p>
          </div>

          {/* Single Rule Selector */}
          <div className="space-y-2 pt-2 border-t border-[#5E706F]/25">
            <label
              htmlFor="regime-select"
              className="block text-sm font-semibold text-[#1F2A2C] dark:text-[#E8EAE4]"
            >
              Pilih Aturan Perhitungan
            </label>
            <select
              id="regime-select"
              value={regimeId}
              onChange={(e) => onChangeRegime(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
            >
              {availableRegimes.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.shortName} — {reg.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/75 leading-relaxed">
              {result.regime.legalBasis} · Berlaku {result.regime.effectivePeriod}
            </p>
            <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70 leading-relaxed">
              {result.regime.summary}
            </p>
          </div>

          {/* Dynamic Inputs per Tax Type */}
          <div className="space-y-4 pt-4 border-t border-[#5E706F]/25">
            {activeTaxType === 'pph21' &&
              (regimeId === 'pph21_pp68_2009' || regimeId === 'pph21_pp149_2000' ? (
                <>
                  <CurrencyInput
                    id="pph21-pesangon-bruto"
                    label="Nilai bruto pesangon / tebusan pensiun / THT / JHT"
                    value={calcInput.pph21.pesangonBruto ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, pesangonBruto: val },
                      }))
                    }
                    helperText="Pembayaran sekaligus (atau bertahap maksimal 2 tahun kalender). Pajak bersifat final tanpa sanksi non-NPWP."
                  />
                  {regimeId === 'pph21_pp68_2009' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-pesangon-type"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Jenis penghasilan sekaligus (PP 68/2009)
                      </label>
                      <select
                        id="pph21-pesangon-type"
                        value={calcInput.pph21.pesangonType ?? 'pesangon'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: {
                              ...prev.pph21,
                              pesangonType: e.target.value as 'pesangon' | 'pensiun_tht_jht',
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="pesangon">
                          Uang Pesangon (0% / 5% / 15% / 25%)
                        </option>
                        <option value="pensiun_tht_jht">
                          Uang Manfaat Pensiun, THT, atau JHT (0% / 5%)
                        </option>
                      </select>
                    </div>
                  )}
                </>
              ) : regimeId === 'pph21_pp80_2010' ? (
                <>
                  <CurrencyInput
                    id="pph21-apbn-bruto"
                    label="Nilai bruto honorarium / imbalan tetap beban APBN atau APBD"
                    value={calcInput.pph21.honorariumApbn ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, honorariumApbn: val },
                      }))
                    }
                    helperText="Pemotongan bersifat final atas honorarium dan imbalan lain selain gaji reguler yang dibebankan pada APBN/APBD."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-golongan-asn"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Golongan PNS / Anggota TNI-Polri / Pejabat Negara
                    </label>
                    <select
                      id="pph21-golongan-asn"
                      value={calcInput.pph21.golonganAsn ?? 'gol_3'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: {
                            ...prev.pph21,
                            golonganAsn: e.target.value as 'gol_1_2' | 'gol_3' | 'gol_4_pejabat',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="gol_1_2">
                        Golongan I &amp; II / Tamtama &amp; Bintara / Non-PNS tertentu (0% Final)
                      </option>
                      <option value="gol_3">
                        Golongan III / Perwira Pertama (5% Final)
                      </option>
                      <option value="gol_4_pejabat">
                        Golongan IV / Perwira Menengah–Tinggi / Pejabat Negara (15% Final)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph21_per31_2009' ? (
                <>
                  <CurrencyInput
                    id="pph21-nonpegawai-bruto"
                    label="Imbalan / honorarium bruto Bukan Pegawai (tenaga ahli, komisi, agen)"
                    value={calcInput.pph21.honorariumBukanPegawai ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, honorariumBukanPegawai: val },
                      }))
                    }
                    helperText="Dasar pengenaan norma Bukan Pegawai 50% dari penghasilan bruto sebelum tarif Pasal 17."
                  />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph21.bukanPegawaiBerkesinambungan)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, bukanPegawaiBerkesinambungan: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Bersifat berkesinambungan dari 1 pemberi kerja (berhak pengurang PTKP/12)
                    </span>
                  </label>
                  {calcInput.pph21.bukanPegawaiBerkesinambungan && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-ptkp-nonpegawai"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Status PTKP
                      </label>
                      <select
                        id="pph21-ptkp-nonpegawai"
                        value={calcInput.pph21.ptkpStatus}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        {PTKP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_pmk168_2023_nonpegawai' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-nonpegawai-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori penerima penghasilan PMK 168/2023 &amp; PP 58/2023
                    </label>
                    <select
                      id="pph21-nonpegawai-skema"
                      value={calcInput.pph21.skemaNonPegawai ?? 'bukan_pegawai_pmk168'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: {
                            ...prev.pph21,
                            skemaNonPegawai: e.target.value as
                              | 'bukan_pegawai_pmk168'
                              | 'harian_ter_pp58',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="bukan_pegawai_pmk168">
                        Bukan Pegawai (Tenaga Ahli, Komisi, Freelancer — 50% Bruto x Psl 17)
                      </option>
                      <option value="harian_ter_pp58">
                        Pegawai Tidak Tetap / Harian Lepas (TER Harian 0% / 0,5% / Psl 17)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pph21-pmk168-bruto"
                    label={
                      (calcInput.pph21.skemaNonPegawai ?? 'bukan_pegawai_pmk168') === 'harian_ter_pp58'
                        ? 'Rata-rata upah / penghasilan bruto harian (Rp/hari)'
                        : 'Imbalan / honorarium bruto Bukan Pegawai per masa (Rp)'
                    }
                    value={calcInput.pph21.honorariumBukanPegawai ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, honorariumBukanPegawai: val },
                      }))
                    }
                    helperText={
                      (calcInput.pph21.skemaNonPegawai ?? 'bukan_pegawai_pmk168') === 'harian_ter_pp58'
                        ? 'TER Harian: 0% (<= Rp 450 rb/hari), 0,5% (> Rp 450 rb–Rp 2,5 jt/hari), atau 50% Bruto x Pasal 17 (> Rp 2,5 jt/hari).'
                        : 'Sejak 1 Jan 2024 (PMK 168/2023), seluruh Bukan Pegawai dihitung per masa tanpa PTKP dan tanpa kumulatif.'
                    }
                  />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_pmk168_2023_khusus' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-khusus-tipe"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori subjek khusus PPh 21 (PMK 168/2023)
                    </label>
                    <select
                      id="pph21-khusus-tipe"
                      value={calcInput.pph21.pmk168KhususType ?? 'dewan_komisaris'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: {
                            ...prev.pph21,
                            pmk168KhususType: e.target.value as NonNullable<
                              TaxCalculatorInput['pph21']['pmk168KhususType']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="dewan_komisaris">
                        Dewan Komisaris / Pengawas Tidak Teratur (Bruto x TER Bulanan)
                      </option>
                      <option value="mantan_pegawai">
                        Mantan Pegawai: Tantiem / Jasa Produksi (Bruto x TER Bulanan)
                      </option>
                      <option value="peserta_kegiatan">
                        Peserta Kegiatan: Seminar, Lomba, Diklat (Bruto x Tarif Pasal 17)
                      </option>
                      <option value="penarikan_dapen">
                        Penarikan Dana Pensiun Awal oleh Pegawai (Bruto x Tarif Pasal 17)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pph21-khusus-bruto"
                    label="Penghasilan bruto yang diterima pada masa pajak (Rp)"
                    value={calcInput.pph21.honorariumBukanPegawai ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, honorariumBukanPegawai: val },
                      }))
                    }
                    helperText="Komisaris tidak teratur & Mantan Pegawai memakai TER Bulanan PP 58/2023; Peserta Kegiatan & Penarikan Dapen memakai Tarif Pasal 17 langsung."
                  />
                  {((calcInput.pph21.pmk168KhususType ?? 'dewan_komisaris') === 'dewan_komisaris' ||
                    calcInput.pph21.pmk168KhususType === 'mantan_pegawai') && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-khusus-ptkp"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Status PTKP (penentu Kategori TER A/B/C)
                      </label>
                      <select
                        id="pph21-khusus-ptkp"
                        value={calcInput.pph21.ptkpStatus}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        {PTKP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_pmk18_2021_wna' ? (
                <>
                  <CurrencyInput
                    id="pph21-wna-gaji"
                    label="Gaji pokok dari sumber Indonesia per bulan"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-wna-tunjangan"
                    label="Tunjangan tetap dari sumber Indonesia per bulan"
                    value={calcInput.pph21.tunjanganTetap}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, tunjanganTetap: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-wna-ln"
                    label="Penghasilan dari sumber luar negeri per bulan (dividen / jasa LN)"
                    value={calcInput.pph21.naturaBulanan ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, naturaBulanan: val },
                      }))
                    }
                    helperText="Dikecualikan selama 4 tahun pajak pertama bagi WNA keahlian tertentu di bawah PMK 18/2021."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-wna-tahun"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tahun pajak ke- menjadi Subjek Pajak Dalam Negeri (1–10)
                    </label>
                    <input
                      id="pph21-wna-tahun"
                      type="number"
                      min={1}
                      max={10}
                      step={1}
                      value={calcInput.pph21.wnaTahunKe ?? 1}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 1 : Math.min(10, Math.max(1, Math.round(raw)));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, wnaTahunKe: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      Tahun ke-1 s.d. ke-4 hanya dipajaki atas penghasilan Indonesia (teritorial); Tahun ke-5 dst berlaku worldwide income.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="pph21-wna-bonus"
                      label="Bonus &amp; THR tahunan dari Indonesia"
                      value={calcInput.pph21.bonusTahunan}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, bonusTahunan: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="pph21-wna-pensiun"
                      label="Iuran pensiun/JHT pegawai (/bln)"
                      value={calcInput.pph21.iuranPensiunBulanan}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, iuranPensiunBulanan: val },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-wna-ptkp"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status PTKP
                    </label>
                    <select
                      id="pph21-wna-ptkp"
                      value={calcInput.pph21.ptkpStatus}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PTKP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_kmk462_1998_pesangon' ? (
                <>
                  <CurrencyInput
                    id="pph21-pesangon-lama-bruto"
                    label="Nilai bruto uang pesangon / tebusan pensiun / THT sekaligus (Rp)"
                    value={calcInput.pph21.pesangonBruto ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, pesangonBruto: val },
                      }))
                    }
                    helperText="Pemotongan final uang pesangon pada era 1995–2000 sebelum berlakunya PP 149/2000 dan PP 68/2009."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-pesangon-lama-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode KMK batas bebas pesangon (1995–2000)
                    </label>
                    <select
                      id="pph21-pesangon-lama-era"
                      value={calcInput.pph21.tahunPesangonLama ?? 'kmk462_1998'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: {
                            ...prev.pph21,
                            tahunPesangonLama: e.target.value as 'kmk462_1998' | 'kmk600_1995',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="kmk462_1998">
                        KMK 462/KMK.04/1998 (Okt 1998–2000: Bebas ≤ Rp 17,28 jt, lalu 10% / 15%)
                      </option>
                      <option value="kmk600_1995">
                        KMK 600/KMK.04/1995 (1995–Sep 1998: Bebas ≤ Rp 5,184 jt, lalu 10% / 15%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph21_pmk28_2024_ikn' ? (
                <>
                  <CurrencyInput
                    id="pph21-ikn-gaji"
                    label="Gaji pokok per bulan pegawai di IKN"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-ikn-tunjangan"
                    label="Tunjangan tetap & premi bulanan"
                    value={calcInput.pph21.tunjanganTetap}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, tunjanganTetap: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-ikn-pensiun"
                    label="Iuran pensiun/JHT dibayar pegawai (/bln)"
                    value={calcInput.pph21.iuranPensiunBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, iuranPensiunBulanan: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-ikn-ptkp"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status PTKP
                    </label>
                    <select
                      id="pph21-ikn-ptkp"
                      value={calcInput.pph21.ptkpStatus}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PTKP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.isEligibleIknPmk28 ?? true}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, isEligibleIknPmk28: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Pegawai bertempat tinggal &amp; ber-NPWP KPP wilayah IKN pada pemberi kerja berizin (DTP Final 100% s.d. 2035 — PMK 28/2024)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (acuan tarif TER pembanding)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_pmk168_2023_tengah_tahun' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-tengah-tahun-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori pegawai masuk / berhenti tengah tahun (Pasal 16 PMK 168/2023)
                    </label>
                    <select
                      id="pph21-tengah-tahun-skema"
                      value={calcInput.pph21.skemaTengahTahun ?? 'lokal_berhenti_tidak_setahun'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: {
                            ...prev.pph21,
                            skemaTengahTahun: e.target.value as
                              | 'lokal_berhenti_tidak_setahun'
                              | 'expat_meninggal_tinggal_ri_setahun',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="lokal_berhenti_tidak_setahun">
                        WPDN lokal resign / pensiun / pindah kerja DN (TIDAK disetahunkan)
                      </option>
                      <option value="expat_meninggal_tinggal_ri_setahun">
                        WNA baru tiba / tinggalkan Indonesia selamanya / meninggal (Disetahunkan 12÷n)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pph21-tengah-gaji"
                    label="Gaji pokok rata-rata per bulan"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="pph21-tengah-tunjangan"
                      label="Tunjangan tetap (/bln)"
                      value={calcInput.pph21.tunjanganTetap}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, tunjanganTetap: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="pph21-tengah-pensiun"
                      label="Iuran pensiun/JHT pegawai (/bln)"
                      value={calcInput.pph21.iuranPensiunBulanan}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, iuranPensiunBulanan: val },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-tengah-bulan"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Jumlah bulan bekerja di tahun berjalan (1–12)
                      </label>
                      <input
                        id="pph21-tengah-bulan"
                        type="number"
                        min={1}
                        max={12}
                        step={1}
                        value={calcInput.pph21.jumlahBulanKerja ?? 6}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw)
                            ? 6
                            : Math.min(12, Math.max(1, Math.round(raw)));
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, jumlahBulanKerja: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-tengah-ptkp"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Status PTKP
                      </label>
                      <select
                        id="pph21-tengah-ptkp"
                        value={calcInput.pph21.ptkpStatus}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        {PTKP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_pmk168_2023_multi_pemberi_kerja' ? (
                <>
                  <CurrencyInput
                    id="pph21-multi-gaji1"
                    label="Gaji & tunjangan bruto per bulan (Pemberi Kerja 1)"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-multi-gaji2"
                    label="Gaji & tunjangan bruto per bulan (Pemberi Kerja 2)"
                    value={calcInput.pph21.gajiPemberiKerja2 ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiPemberiKerja2: val },
                      }))
                    }
                    helperText="Sesuai Pasal 10(3) PMK 168/2023, Biaya Jabatan (5% maks Rp 6 jt/thn) dihitung di masing-masing pemberi kerja, namun saat lapor SPT Tahunan hanya dikurangi 1 PTKP."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph21-multi-ptkp"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status PTKP
                    </label>
                    <select
                      id="pph21-multi-ptkp"
                      value={calcInput.pph21.ptkpStatus}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PTKP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph21_per2_2009_spln' ? (
                <>
                  <CurrencyInput
                    id="pph21-spln-gaji"
                    label="Gaji & tunjangan pekerjaan di luar negeri (/bln, ekuivalen Rupiah)"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-spln-hari"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Jumlah hari berada/bekerja di luar negeri (dalam 12 bulan)
                      </label>
                      <input
                        id="pph21-spln-hari"
                        type="number"
                        min={0}
                        max={366}
                        step={1}
                        value={calcInput.pph21.hariDiLuarNegeri ?? 200}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(366, Math.max(0, Math.round(raw)));
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, hariDiLuarNegeri: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-spln-ptkp"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Status PTKP (bila gagal uji SPLN)
                      </label>
                      <select
                        id="pph21-spln-ptkp"
                        value={calcInput.pph21.ptkpStatus}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        {PTKP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph21.hasPermanentHomeLn !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, hasPermanentHomeLn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memenuhi uji berjenjang PER-23/PJ/2025 (tempat tinggal permanen &amp; pusat kepentingan vital di luar negeri + konfirmasi SPLN)
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pph21-gaji"
                    label="Gaji pokok per bulan"
                    value={calcInput.pph21.gajiBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, gajiBulanan: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph21-tunjangan"
                    label="Tunjangan tetap & premi bulanan"
                    value={calcInput.pph21.tunjanganTetap}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph21: { ...prev.pph21, tunjanganTetap: val },
                      }))
                    }
                    helperText="Termasuk tunjangan jabatan, transport, atau premi JKK/JKM dari pemberi kerja."
                  />
                  {regimeId === 'pph21_pmk66_2023' && (
                    <CurrencyInput
                      id="pph21-natura"
                      label="Nilai natura / kenikmatan objek pajak per bulan (PMK 66/2023)"
                      value={calcInput.pph21.naturaBulanan ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, naturaBulanan: val },
                        }))
                      }
                      helperText="Masukkan nilai pasar natura atau fasilitas kenikmatan yang melebihi batas pengecualian Lampiran PMK 66/2023."
                    />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="pph21-bonus"
                      label="THR & bonus setahun"
                      value={calcInput.pph21.bonusTahunan}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph21: { ...prev.pph21, bonusTahunan: val },
                        }))
                      }
                    />
                    {regimeId !== 'pph21_ppd1944' && (
                      <CurrencyInput
                        id="pph21-pensiun"
                        label="Iuran pensiun/JHT pegawai (/bln)"
                        value={calcInput.pph21.iuranPensiunBulanan}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, iuranPensiunBulanan: val },
                          }))
                        }
                      />
                    )}
                  </div>
                  {regimeId === 'pph21_pmk168_2023_desember' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-bulan-bonus"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Waktu pencairan THR / Bonus tahunan
                      </label>
                      <select
                        id="pph21-bulan-bonus"
                        value={calcInput.pph21.bulanBayarBonus ?? 'jan_nov'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: {
                              ...prev.pph21,
                              bulanBayarBonus: e.target.value as 'jan_nov' | 'desember',
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="jan_nov">
                          Dibayar pada bulan Jan–Nov (10 bln rutin + 1 bln lonjakan TER)
                        </option>
                        <option value="desember">
                          Dibayar di Masa Desember (11 bln rutin tanpa lonjakan TER awal)
                        </option>
                      </select>
                    </div>
                  )}
                  {regimeId !== 'pph21_ppd1944' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph21-ptkp"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Status PTKP
                      </label>
                      <select
                        id="pph21-ptkp"
                        value={calcInput.pph21.ptkpStatus}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, ptkpStatus: e.target.value as PtkpStatus },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        {PTKP_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {![
                    'pph21_pmk137_2005',
                    'pph21_kmk564_2004',
                    'pph21_uu17_2000',
                    'pph21_uu10_1994',
                    'pph21_uu7_1983',
                    'pph21_ppd1944',
                  ].includes(regimeId) && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph21.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph21: { ...prev.pph21, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Memiliki NPWP / NIK sudah padan (tidak kena sanksi +20%)
                      </span>
                    </label>
                  )}
                </>
              ))}

            {activeTaxType === 'pph23' &&
              (regimeId === 'pph23_pmk69_2022_fintech' ? (
                <>
                  <CurrencyInput
                    id="pph23-fintech-bruto"
                    label="Nilai bruto bunga pinjaman P2P lending yang dibayarkan"
                    value={calcInput.pph23.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiBruto: val },
                      }))
                    }
                    helperText="Pemotongan pajak dilakukan oleh penyelenggara fintech P2P lending berizin OJK (PMK 69/PMK.03/2022)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph23-fintech-recipient"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status pemberi pinjaman (lender) P2P lending
                    </label>
                    <select
                      id="pph23-fintech-recipient"
                      value={calcInput.pph23.fintechRecipientType ?? 'wpdn_but'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: {
                            ...prev.pph23,
                            fintechRecipientType: e.target.value as
                              | 'wpdn_but'
                              | 'wpln_pph26'
                              | 'umkm_skb',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="wpdn_but">
                        WPDN (OP / Badan) &amp; BUT Dalam Negeri (PPh 23 — 15%)
                      </option>
                      <option value="wpln_pph26">
                        Wajib Pajak Luar Negeri selain BUT (PPh 26 — 20% atau tarif P3B)
                      </option>
                      <option value="umkm_skb">
                        Lender berstatus Bank / memiliki SKB PPh 23 (0%)
                      </option>
                    </select>
                  </div>
                  {(calcInput.pph23.fintechRecipientType ?? 'wpdn_but') === 'wpdn_but' && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph23.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph23: { ...prev.pph23, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Pemberi pinjaman memiliki NPWP (hindari sanksi +100% menjadi 30%)
                      </span>
                    </label>
                  )}
                </>
              ) : regimeId === 'pph23_pbdr_1970' ? (
                <CurrencyInput
                  id="pph23-pbdr-bruto"
                  label="Jumlah bruto bunga, dividen, atau royalti (Basis PBDR Pra-1984)"
                  value={calcInput.pph23.nilaiBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph23: { ...prev.pph23, nilaiBruto: val },
                    }))
                  }
                  helperText="UU Nomor 10 Tahun 1970 (PBDR) mengenakan tarif pemotongan tunggal 20% atas pembayaran bunga, dividen, dan royalti sebelum berlakunya PPh Pasal 23 (15%) pada 1 Januari 1984."
                />
              ) : regimeId === 'pph23_suket_pengecualian' ? (
                <>
                  <CurrencyInput
                    id="pph23-suket-bruto"
                    label="Nilai bruto pembayaran jasa / transaksi objek PPh 23 (non-PPN)"
                    value={calcInput.pph23.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph23-suket-object"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek pemotongan pembanding
                    </label>
                    <select
                      id="pph23-suket-object"
                      value={calcInput.pph23.objectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, objectType: e.target.value as Pph23ObjectType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH23_OBJECTS.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph23.isSuketUmkm)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, isSuketUmkm: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Vendor menyerahkan Surat Keterangan (Suket) UMKM PP 55/2022 atau PP 20/2026 valid (setor PPh Final 0,5%)
                    </span>
                  </label>
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph23.isPengecualianPasal23_4)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, isPengecualianPasal23_4: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Termasuk pengecualian Pasal 23 ayat (4) UU PPh (pembayaran ke Bank / SGU hak opsi / dividen bebas — 0%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph23_pmk141_2015_reimbursement' ? (
                <>
                  <CurrencyInput
                    id="pph23-reimburse-jasa"
                    label="Nilai imbalan jasa / management fee (non-PPN)"
                    value={calcInput.pph23.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiBruto: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph23-reimburse-atcost"
                    label="Nilai komponen Reimbursement / Material / Gaji Alih Daya (At-Cost)"
                    value={calcInput.pph23.nilaiReimbursement ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiReimbursement: val },
                      }))
                    }
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph23.isPembuktianFakturTerpisah !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, isPembuktianFakturTerpisah: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Dipisah jelas di kontrak &amp; dilampiri bukti faktur pihak ketiga (Pasal 1(3) PMK 141/2015 — hanya Jasa dipotong)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph23.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Vendor memiliki NPWP / NIK valid 16 digit (hindari sanksi +100% menjadi 4%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph23_per1_2023_royalti' ? (
                <>
                  <CurrencyInput
                    id="pph23-royalti-bruto"
                    label="Nilai bruto royalti yang dibayarkan kepada pencipta / penulis WPOP"
                    value={calcInput.pph23.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiBruto: val },
                      }))
                    }
                    helperText="Sesuai PER-1/PJ/2023, WPOP pengguna NPPN (omzet < Rp 4,8 M/thn) mendapat DPP 40% sehingga tarif efektif PPh 23 menjadi 6%."
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph23.hasBpsNppnRoyalti !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, hasBpsNppnRoyalti: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      WPOP menyerahkan Bukti Penerimaan Surat (BPS) pemberitahuan penggunaan NPPN kepada pemotong (tarif efektif 6%)
                    </span>
                  </label>
                  {calcInput.pph23.hasBpsNppnRoyalti === false && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph23.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph23: { ...prev.pph23, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Penerima memiliki NPWP / NIK valid 16 digit (hindari sanksi +100% menjadi 30%)
                      </span>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pph23-bruto"
                    label="Nilai bruto transaksi (tidak termasuk PPN)"
                    value={calcInput.pph23.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph23: { ...prev.pph23, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph23-object"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek pemotongan PPh 23
                    </label>
                    <select
                      id="pph23-object"
                      value={calcInput.pph23.objectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph23: { ...prev.pph23, objectType: e.target.value as Pph23ObjectType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH23_OBJECTS.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {calcInput.pph23.objectType !== 'dividen_badan' && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph23.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph23: { ...prev.pph23, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        {regimeId === 'pph23_pmk81_2024'
                          ? 'Penerima penghasilan memiliki NPWP / NIK valid 16 digit (hindari sanksi +100%)'
                          : 'Penerima penghasilan memiliki NPWP (hindari sanksi +100%)'}
                      </span>
                    </label>
                  )}
                </>
              ))}

            {activeTaxType === 'pph_umkm' &&
              (regimeId === 'umkm_nppn_pra2013' ? (
                <>
                  <CurrencyInput
                    id="umkm-nppn-omzet"
                    label="Peredaran bruto / penerimaan bruto usaha atau pekerjaan bebas per bulan"
                    value={calcInput.pph_umkm.omzetBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_umkm: { ...prev.pph_umkm, omzetBulanan: val },
                      }))
                    }
                    helperText="Wajib pajak Orang Pribadi beromzet di bawah Rp 4,8 miliar/tahun yang memakai Norma Penghitungan Penghasilan Neto (NPPN) dikurangi PTKP TK/0 (ilustrasi)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="umkm-nppn-persen"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Persentase Norma Penghasilan Neto / NPPN (% sesuai KLU &amp; kota)
                    </label>
                    <input
                      id="umkm-nppn-persen"
                      type="number"
                      min={10}
                      max={75}
                      step={2.5}
                      value={calcInput.pph_umkm.nppnPersen ?? 50}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 50 : Math.min(75, Math.max(10, raw));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_umkm: { ...prev.pph_umkm, nppnPersen: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      Contoh PER-17/PJ/2015: Dokter / konsultan / notaris / pengacara 50%; pedagang eceran 20%–30%.
                    </p>
                  </div>
                </>
              ) : regimeId === 'umkm_pp20_2026_transisi' ? (
                <>
                  <CurrencyInput
                    id="umkm-transisi-omzet"
                    label="Peredaran bruto (omzet) CV / Firma / PT per bulan"
                    value={calcInput.pph_umkm.omzetBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_umkm: { ...prev.pph_umkm, omzetBulanan: val },
                      }))
                    }
                    helperText="Membandingkan kewajiban PPh Final 0,5% omzet terhadap skema pembukuan PPh Badan Pasal 31E (11% laba untuk porsi omzet ≤ Rp 4,8 M)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="umkm-transisi-margin"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Estimasi margin laba bersih fiskal (%)
                    </label>
                    <input
                      id="umkm-transisi-margin"
                      type="number"
                      min={0}
                      max={80}
                      step={0.5}
                      value={calcInput.pph_umkm.marginLabaPersen ?? 10}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 10 : Math.min(80, Math.max(0, raw));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_umkm: { ...prev.pph_umkm, marginLabaPersen: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      Titik impas beban pajak antara 0,5% omzet dan Pasal 31E (11% laba) adalah margin ~4,55%; di bawah 4,55% pembukuan umum lebih hemat.
                    </p>
                  </div>
                </>
              ) : regimeId === 'umkm_pmk164_2023_suket' ? (
                <>
                  <CurrencyInput
                    id="umkm-pmk164-nilai"
                    label="Nilai tagihan jasa / penyerahan barang UMKM (non-PPN)"
                    value={calcInput.pph_umkm.omzetBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_umkm: { ...prev.pph_umkm, omzetBulanan: val },
                      }))
                    }
                    helperText="Menguji potongan di pihak ketiga berdasarkan kelengkapan Suket UMKM atau Surat Pernyataan kuota Rp 500 juta OP (PMK 164/2023)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="umkm-pmk164-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status dokumen Suket &amp; omzet UMKM (PMK 164/2023)
                    </label>
                    <select
                      id="umkm-pmk164-skema"
                      value={calcInput.pph_umkm.skemaSuket164 ?? 'suket_pihak_ketiga_0_5'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_umkm: {
                            ...prev.pph_umkm,
                            skemaSuket164: e.target.value as NonNullable<
                              TaxCalculatorInput['pph_umkm']['skemaSuket164']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="suket_pihak_ketiga_0_5">
                        Serahkan Suket UMKM valid -&gt; Dipotong PPh Final 0,5%
                      </option>
                      <option value="suket_op_kuota_500jt_0">
                        WP OP + Surat Pernyataan omzet &le; Rp 500 jt -&gt; Bebas potong 0%
                      </option>
                      <option value="tanpa_suket_pph23_2">
                        Tanpa Suket / Surat Pernyataan -&gt; Dipotong PPh 23 umum 2%
                      </option>
                      <option value="lewati_4_8m_pkp_akhir_tahun">
                        Omzet lewati Rp 4,8 M tahun berjalan -&gt; 0,5% s.d. akhir tahun &amp; PKP akhir tahun buku
                      </option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="umkm-subject"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Bentuk Wajib Pajak UMKM
                    </label>
                    <select
                      id="umkm-subject"
                      value={calcInput.pph_umkm.subjectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_umkm: {
                            ...prev.pph_umkm,
                            subjectType: e.target.value as UmkmSubjectType,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="orang_pribadi">Wajib Pajak Orang Pribadi</option>
                      <option value="perseroan_perorangan">Perseroan Perorangan (PT Perorangan)</option>
                      <option value="koperasi">Koperasi Dalam Negeri</option>
                      <option value="badan_usaha">CV / Firma / PT Umum / BUMDes</option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="umkm-omzet"
                    label="Peredaran bruto (omzet) bulan ini"
                    value={calcInput.pph_umkm.omzetBulanan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_umkm: { ...prev.pph_umkm, omzetBulanan: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="umkm-akumulasi"
                    label="Akumulasi omzet bulan-bulan sebelumnya di tahun yang sama"
                    value={calcInput.pph_umkm.akumulasiOmzetSebelumnya}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_umkm: { ...prev.pph_umkm, akumulasiOmzetSebelumnya: val },
                      }))
                    }
                    helperText="Digunakan PP 55/2022 & PP 20/2026 untuk menghitung sisa kuota bebas pajak Rp 500 juta bagi Orang Pribadi."
                  />
                  {regimeId === 'umkm_pp20_2026' && (
                    <CurrencyInput
                      id="umkm-omzet-terkait"
                      label="Omzet gabungan keluarga / entitas terkait tahun ini (opsional)"
                      value={calcInput.pph_umkm.omzetTerkaitSebelumnya ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_umkm: { ...prev.pph_umkm, omzetTerkaitSebelumnya: val },
                        }))
                      }
                      helperText="Ketentuan anti-pecah usaha PP 20/2026 menggabungkan omzet keluarga/entitas terkait saat menguji ambang batas Rp 4,8 miliar."
                    />
                  )}
                  {calcInput.pph_umkm.subjectType === 'orang_pribadi' &&
                    (regimeId === 'umkm_pp20_2026' || regimeId === 'umkm_pp55_2022') && (
                      <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(calcInput.pph_umkm.isFreeProfession)}
                          onChange={(e) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pph_umkm: { ...prev.pph_umkm, isFreeProfession: e.target.checked },
                            }))
                          }
                          className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                        />
                        <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                          Usaha berupa jasa pekerjaan bebas / kreator konten (dokter, pengacara, konsultan, arsitek, influencer)
                        </span>
                      </label>
                    )}
                  {calcInput.pph_umkm.subjectType === 'badan_usaha' &&
                    regimeId === 'umkm_pp20_2026' && (
                      <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(calcInput.pph_umkm.isEntityInTransition)}
                          onChange={(e) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pph_umkm: { ...prev.pph_umkm, isEntityInTransition: e.target.checked },
                            }))
                          }
                          className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                        />
                        <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                          Entitas lama masih berada dalam sisa masa transisi PP 55/2022 (maks. 3 thn PT / 4 thn CV·Firma·BUMDes sejak terdaftar)
                        </span>
                      </label>
                    )}
                </>
              ))}

            {activeTaxType === 'pph_badan' && (
              <>
                {![
                  'badan_uu17_2000',
                  'badan_uu10_1994',
                  'badan_uu7_1983',
                  'badan_pps1925',
                  'badan_gmt_pmk136_2024',
                  'badan_insentif_fiskal',
                  'badan_pp30_2020_tbk',
                  'badan_pmk169_2015_der',
                  'badan_pmk72_2023_penyusutan',
                  'badan_pp15_2022_ekstraktif',
                  'badan_pp12_2023_ikn',
                  'badan_pmk192_2018_pph24',
                  'badan_pmk93_2019_cfc',
                  'badan_pmk52_2017_merger',
                  'badan_pmk18_2021_dividen_ln',
                  'badan_pp60_2010_zakat',
                ].includes(regimeId) && (
                  <CurrencyInput
                    id="badan-omzet"
                    label="Peredaran bruto (omzet) setahun"
                    value={calcInput.pph_badan.peredaranBrutoTahunan}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_badan: { ...prev.pph_badan, peredaranBrutoTahunan: val },
                      }))
                    }
                    helperText={
                      regimeId === 'badan_pmk172_2023_tp_doc'
                        ? 'Ambang wajib Master & Local File PMK 172/2023: omzet tahun sebelumnya > Rp 50 miliar.'
                        : 'Menentukan fasilitas diskon 50% Pasal 31E (berlaku untuk omzet s.d. Rp 50 miliar).'
                    }
                  />
                )}
                {![
                  'badan_pmk93_2019_cfc',
                  'badan_pmk172_2023_tp_doc',
                  'badan_pmk52_2017_merger',
                  'badan_pmk18_2021_dividen_ln',
                ].includes(regimeId) && (
                  <CurrencyInput
                    id="badan-pkp"
                    label={
                      regimeId === 'badan_gmt_pmk136_2024'
                        ? 'Laba GloBE / Penghasilan Kena Pajak yurisdiksi setahun'
                        : regimeId === 'badan_koreksi_fiskal_kerugian'
                          ? 'Laba bersih komersial sebelum pajak (akuntansi PSAK)'
                          : regimeId === 'badan_pmk192_2018_pph24'
                            ? 'Penghasilan Kena Pajak (PKP) Dalam Negeri setahun'
                            : regimeId === 'badan_pp60_2010_zakat'
                              ? 'Penghasilan Kena Pajak (PKP) sebelum pengurangan zakat / sumbangan wajib'
                              : 'Penghasilan Kena Pajak (laba fiskal setahun)'
                    }
                    value={calcInput.pph_badan.penghasilanKenaPajak}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph_badan: { ...prev.pph_badan, penghasilanKenaPajak: val },
                      }))
                    }
                  />
                )}
                {regimeId === 'badan_pmk52_2017_merger' && (
                  <>
                    <CurrencyInput
                      id="badan-merger-pasar"
                      label="Nilai pasar wajar harta yang dialihkan saat merger / pemekaran"
                      value={calcInput.pph_badan.nilaiPasarHartaMerger ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, nilaiPasarHartaMerger: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-merger-buku"
                      label="Nilai sisa buku fiskal harta yang dialihkan"
                      value={calcInput.pph_badan.nilaiBukuFiskalMerger ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, nilaiBukuFiskalMerger: val },
                        }))
                      }
                    />
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph_badan.isPersetujuanNilaiBuku !== false}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, isPersetujuanNilaiBuku: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Memperoleh persetujuan penggunaan Nilai Buku dari DJP (PMK 52/2017 stdd PMK 56/2021 — tax-neutral Rp 0)
                      </span>
                    </label>
                  </>
                )}
                {regimeId === 'badan_pmk18_2021_dividen_ln' && (
                  <>
                    <CurrencyInput
                      id="badan-divln-laba"
                      label="Porsi laba setelah pajak BULN non-bursa (dasar syarat reinvestasi 30%)"
                      value={calcInput.pph_badan.labaSetelahPajakBuln ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, labaSetelahPajakBuln: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-divln-terima"
                      label="Total dividen luar negeri yang diterima WP Badan di Indonesia"
                      value={calcInput.pph_badan.dividenLnDiterima ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, dividenLnDiterima: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-divln-reinvest"
                      label="Realisasi reinvestasi di Indonesia (>= 3 tahun pajak, maks akhir bln ke-4)"
                      value={calcInput.pph_badan.nilaiReinvestasiDividenLn ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, nilaiReinvestasiDividenLn: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-divln-taxln"
                      label="Pajak atas dividen yang sudah dipotong di negara sumber (untuk PPh 24)"
                      value={calcInput.pph_badan.pajakDibayarDiLnDividen ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, pajakDibayarDiLnDividen: val },
                        }))
                      }
                    />
                  </>
                )}
                {regimeId === 'badan_pp60_2010_zakat' && (
                  <>
                    <CurrencyInput
                      id="badan-zakat-nilai"
                      label="Nilai zakat / sumbangan keagamaan wajib yang dibayarkan (Rp)"
                      value={calcInput.pph_badan.zakatWajibResmi ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, zakatWajibResmi: val },
                        }))
                      }
                    />
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph_badan.isLembagaZakatResmi !== false}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, isLembagaZakatResmi: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Disalurkan melalui BAZNAS / LAZ / lembaga keagamaan yang dibentuk atau disahkan pemerintah + bukti setor sah (PP 60/2010)
                      </span>
                    </label>
                  </>
                )}
                {regimeId === 'badan_pmk192_2018_pph24' && (
                  <>
                    <CurrencyInput
                      id="badan-pph24-labaln"
                      label="Penghasilan Neto dari Luar Negeri (Negara sumber berlaba)"
                      value={calcInput.pph_badan.penghasilanLuarNegeri ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, penghasilanLuarNegeri: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-pph24-rugiln"
                      label="Rugi Usaha / Cabang Luar Negeri (Diabaikan per Pasal 4(3) PMK 192/2018)"
                      value={calcInput.pph_badan.rugiLuarNegeri ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, rugiLuarNegeri: val },
                        }))
                      }
                      helperText="Rugi luar negeri tidak boleh mengurangi PKP dalam negeri atau meng-offset laba negara lain."
                    />
                    <CurrencyInput
                      id="badan-pph24-dibayar"
                      label="PPh yang telah dipotong / dibayar di Luar Negeri (KPLN)"
                      value={calcInput.pph_badan.pphDibayarLuarNegeri ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, pphDibayarLuarNegeri: val },
                        }))
                      }
                    />
                  </>
                )}
                {regimeId === 'badan_pmk93_2019_cfc' && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="badan-cfc-era"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Rezim Deemed Dividend BULN Non-Bursa Terkendali (CFC)
                      </label>
                      <select
                        id="badan-cfc-era"
                        value={calcInput.pph_badan.eraCfc ?? 'pmk93_2019'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: {
                              ...prev.pph_badan,
                              eraCfc: e.target.value as 'pmk93_2019' | 'pmk107_2017',
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="pmk93_2019">
                          PMK 93/PMK.03/2019 (TP 2019–Kini — Hanya Penghasilan Pasif Tertentu)
                        </option>
                        <option value="pmk107_2017">
                          PMK 107/PMK.03/2017 (TP 2017–2018 — Seluruh Laba Pasif + Aktif Usaha)
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="badan-cfc-persen"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Persentase penyertaan modal di BULN Non-Bursa (Syarat CFC &ge; 50%)
                      </label>
                      <input
                        id="badan-cfc-persen"
                        type="number"
                        min={0}
                        max={100}
                        step={5}
                        value={calcInput.pph_badan.persenKepemilikanCfc ?? 60}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(100, Math.max(0, raw));
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, persenKepemilikanCfc: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                    <CurrencyInput
                      id="badan-cfc-pasif"
                      label="Penghasilan neto pasif BULN (bunga, dividen, royalti, sewa, capital gain)"
                      value={calcInput.pph_badan.penghasilanPasifNetoCfc ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, penghasilanPasifNetoCfc: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-cfc-aktif"
                      label="Laba usaha aktif operasional BULN (pabrik / dagang riil)"
                      value={calcInput.pph_badan.labaAktifUsahaCfc ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, labaAktifUsahaCfc: val },
                        }))
                      }
                    />
                  </>
                )}
                {regimeId === 'badan_pmk172_2023_tp_doc' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CurrencyInput
                        id="badan-tp-barang"
                        label="Transaksi afiliasi barang berwujud (> Rp 20 M)"
                        value={calcInput.pph_badan.nilaiAfiliasiBarang ?? 0}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, nilaiAfiliasiBarang: val },
                          }))
                        }
                      />
                      <CurrencyInput
                        id="badan-tp-jasa"
                        label="Transaksi afiliasi jasa/bunga/royalti (> Rp 5 M)"
                        value={calcInput.pph_badan.nilaiAfiliasiJasaLain ?? 0}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, nilaiAfiliasiJasaLain: val },
                          }))
                        }
                      />
                    </div>
                    <CurrencyInput
                      id="badan-tp-grup"
                      label="Peredaran bruto konsolidasi grup usaha (Ambang CbCR &ge; Rp 11 T)"
                      value={calcInput.pph_badan.omzetGrupKonsolidasi ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, omzetGrupKonsolidasi: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-tp-koreksi"
                      label="Nilai selisih koreksi kewajaran Transfer Pricing (Primary Adjustment)"
                      value={calcInput.pph_badan.koreksiKewajaranTp ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, koreksiKewajaranTp: val },
                        }))
                      }
                    />
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(calcInput.pph_badan.isRepatriasiTpBeforeSkp)}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, isRepatriasiTpBeforeSkp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        WP menyetujui koreksi &amp; melakukan repatriasi kas sebelum SKP terbit (Pasal 37 PMK 172/2023 — Bebas Secondary Adjustment 20%)
                      </span>
                    </label>
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(calcInput.pph_badan.isAfiliasiTarifLebihRendah)}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, isAfiliasiTarifLebihRendah: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Ada transaksi afiliasi di yurisdiksi bertarif PPh &lt; 22% (Wajib Master &amp; Local File — Pasal 16 ayat (3) huruf d)
                      </span>
                    </label>
                  </>
                )}
                {regimeId === 'badan_koreksi_fiskal_kerugian' && (
                  <>
                    <CurrencyInput
                      id="badan-koreksi-positif"
                      label="Koreksi fiskal positif (biaya non-deductible / tanpa daftar nominatif)"
                      value={calcInput.pph_badan.koreksiPositifNonDeductible ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, koreksiPositifNonDeductible: val },
                        }))
                      }
                      helperText="Menambah PhKP: denda/sanksi pajak, sumbangan >5% PP 93/2010, biaya promosi tanpa nominatif PMK 02/2010, atau piutang macet non-syarat PMK 105/2009."
                    />
                    <CurrencyInput
                      id="badan-koreksi-negatif"
                      label="Koreksi fiskal negatif (penghasilan PPh Final / non-objek Pasal 4(3))"
                      value={calcInput.pph_badan.koreksiNegatif ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, koreksiNegatif: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-kompensasi-rugi"
                      label="Saldo kompensasi kerugian fiskal <= 5 tahun sebelumnya (Pasal 6(2) UU PPh)"
                      value={calcInput.pph_badan.kompensasiKerugianFiskal ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, kompensasiKerugianFiskal: val },
                        }))
                      }
                    />
                  </>
                )}
                {regimeId === 'badan_gmt_pmk136_2024' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="badan-gmt-etr"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tarif pajak efektif (ETR) yurisdiksi setelah insentif pajak (%)
                    </label>
                    <input
                      id="badan-gmt-etr"
                      type="number"
                      min={0}
                      max={30}
                      step={0.5}
                      value={calcInput.pph_badan.etrSetelahInsentifPersen ?? 0}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 0 : Math.min(30, Math.max(0, raw));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, etrSetelahInsentifPersen: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      Jika ETR di bawah tarif minimum global 15% (mis. penerima Tax Holiday = 0%), selisihnya dikenai Top-up Tax DMTT/IIR (PMK 136/2024).
                    </p>
                  </div>
                )}
                {regimeId === 'badan_pp30_2020_tbk' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="badan-tbk-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode aturan penurunan tarif Perseroan Terbuka (Tbk)
                    </label>
                    <select
                      id="badan-tbk-era"
                      value={calcInput.pph_badan.tbkEra ?? 'pp30_2020'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: {
                            ...prev.pph_badan,
                            tbkEra: e.target.value as 'pp30_2020' | 'pp77_2013' | 'pp81_2007',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pp30_2020">
                        PP 30/2020 &amp; PP 55/2022 (2020–Kini: 22% - 3% = 19%)
                      </option>
                      <option value="pp77_2013">
                        PP 77/2013 (2013–2019: 25% - 5% = 20%)
                      </option>
                      <option value="pp81_2007">
                        PP 81/2007 (2008–2012: Diskon -5% dr Tarif Normal)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'badan_insentif_fiskal' && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="badan-insentif-skema"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Skema fasilitas insentif fiskal PPh Badan
                      </label>
                      <select
                        id="badan-insentif-skema"
                        value={calcInput.pph_badan.skemaInsentif ?? 'tax_holiday_100'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: {
                              ...prev.pph_badan,
                              skemaInsentif: e.target.value as
                                | 'tax_holiday_100'
                                | 'tax_holiday_50'
                                | 'tax_allowance'
                                | 'supertax_rnd',
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="tax_holiday_100">
                          Tax Holiday 100% — PMK 130/2020 jo. PMK 69/2024
                        </option>
                        <option value="tax_holiday_50">
                          Tax Holiday Mini 50% (Investasi Rp 100–500 M)
                        </option>
                        <option value="tax_allowance">
                          Tax Allowance 30% Nilai Aktiva Tetap (6 thn x 5%) — PP 78/2019
                        </option>
                        <option value="supertax_rnd">
                          Super Tax Deduction Litbang / R&amp;D hingga 300% — PP 45/2019
                        </option>
                      </select>
                    </div>
                    {(calcInput.pph_badan.skemaInsentif === 'tax_allowance' ||
                      calcInput.pph_badan.skemaInsentif === 'supertax_rnd') && (
                      <CurrencyInput
                        id="badan-insentif-investasi"
                        label={
                          calcInput.pph_badan.skemaInsentif === 'tax_allowance'
                            ? 'Nilai realisasi investasi aktiva tetap (berwujud)'
                            : 'Total biaya penelitian & pengembangan (Litbang/R&D) di Indonesia'
                        }
                        value={calcInput.pph_badan.nilaiInvestasiAtauRnd ?? 0}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: { ...prev.pph_badan, nilaiInvestasiAtauRnd: val },
                          }))
                        }
                      />
                    )}
                  </>
                )}
                {regimeId === 'badan_pmk169_2015_der' && (
                  <>
                    <CurrencyInput
                      id="badan-der-utang"
                      label="Rata-rata saldo utang berbunga (pinjaman)"
                      value={calcInput.pph_badan.utangBerbunga ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, utangBerbunga: val },
                        }))
                      }
                    />
                    <CurrencyInput
                      id="badan-der-ekuitas"
                      label="Rata-rata saldo ekuitas / modal fiskal"
                      value={calcInput.pph_badan.ekuitasFiskal ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, ekuitasFiskal: val },
                        }))
                      }
                      helperText="PMK 169/PMK.010/2015 menetapkan rasio utang terhadap modal maksimal 4:1; bunga atas kelebihan utang dikoreksi positif (asumsi bunga 10%/thn)."
                    />
                  </>
                )}
                {regimeId === 'badan_pmk72_2023_penyusutan' && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="badan-penyusutan-kel"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Kelompok harta berwujud fiskal (PMK 72/2023)
                      </label>
                      <select
                        id="badan-penyusutan-kel"
                        value={calcInput.pph_badan.kelompokHartaPenyusutan ?? 'kel_2_8thn'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: {
                              ...prev.pph_badan,
                              kelompokHartaPenyusutan: e.target.value as NonNullable<
                                TaxCalculatorInput['pph_badan']['kelompokHartaPenyusutan']
                              >,
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="kel_1_4thn">
                          Kelompok 1 — Masa manfaat 4 thn (25% GL / 50% SM)
                        </option>
                        <option value="kel_2_8thn">
                          Kelompok 2 — Masa manfaat 8 thn (12,5% GL / 25% SM)
                        </option>
                        <option value="kel_3_16thn">
                          Kelompok 3 — Masa manfaat 16 thn (6,25% GL / 12,5% SM)
                        </option>
                        <option value="kel_4_20thn">
                          Kelompok 4 — Masa manfaat 20 thn (5% GL / 10% SM)
                        </option>
                        <option value="bangunan_20thn">
                          Bangunan Permanen — Masa manfaat ≥ 20 thn (5% Garis Lurus)
                        </option>
                      </select>
                    </div>
                    <CurrencyInput
                      id="badan-penyusutan-nilai"
                      label="Harga perolehan aset tetap yang disusutkan (Rp)"
                      value={calcInput.pph_badan.nilaiInvestasiAtauRnd ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, nilaiInvestasiAtauRnd: val },
                        }))
                      }
                    />
                  </>
                )}
                {regimeId === 'badan_pp15_2022_ekstraktif' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="badan-ekstraktif-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor ekstraktif sumber daya alam
                    </label>
                    <select
                      id="badan-ekstraktif-skema"
                      value={calcInput.pph_badan.skemaEkstraktif ?? 'batubara_iupk_pp15_18'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: {
                            ...prev.pph_badan,
                            skemaEkstraktif: e.target.value as NonNullable<
                              TaxCalculatorInput['pph_badan']['skemaEkstraktif']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="batubara_iupk_pp15_18">
                        IUPK Batubara Kelanjutan Operasi (PP 15/2022 jo. PP 18/2025 — PPh 22% + 10% Laba Pemda/Pusat)
                      </option>
                      <option value="mineral_pp37_2018">
                        Pertambangan Mineral Logam / Non-Logam (PP 37/2018 — PPh Badan 22%)
                      </option>
                      <option value="migas_gross_split_pp53">
                        Hulu Migas Kontrak Gross Split (PP 53/2017 — Kompensasi Rugi 10 Thn)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'badan_pp12_2023_ikn' && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="badan-ikn-skema"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Skema fasilitas pajak Ibu Kota Nusantara (PP 12/2023 jo. PP 29/2024)
                      </label>
                      <select
                        id="badan-ikn-skema"
                        value={calcInput.pph_badan.skemaIknPfii ?? 'ikn_tax_holiday_100'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph_badan: {
                              ...prev.pph_badan,
                              skemaIknPfii: e.target.value as NonNullable<
                                TaxCalculatorInput['pph_badan']['skemaIknPfii']
                              >,
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="ikn_tax_holiday_100">
                          Tax Holiday IKN 100% — Investasi minimal Rp 10 miliar (10–30 tahun)
                        </option>
                        <option value="financial_center_ikn">
                          Financial Center IKN — Klaster Jasa Keuangan (Simulasi Pengurangan 85%)
                        </option>
                        <option value="ikn_supertax_350">
                          Super Tax Deduction Riset &amp; Litbang IKN hingga 350%
                        </option>
                      </select>
                    </div>
                    <CurrencyInput
                      id="badan-ikn-nilai"
                      label={
                        calcInput.pph_badan.skemaIknPfii === 'ikn_supertax_350'
                          ? 'Total biaya penelitian & pengembangan (Litbang/R&D) di IKN'
                          : 'Nilai rencana / realisasi investasi di IKN & Daerah Mitra (min. Rp 10 M)'
                      }
                      value={calcInput.pph_badan.nilaiInvestasiAtauRnd ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, nilaiInvestasiAtauRnd: val },
                        }))
                      }
                    />
                  </>
                )}
                {![
                  'badan_uu10_1994',
                  'badan_uu7_1983',
                  'badan_pps1925',
                  'badan_gmt_pmk136_2024',
                  'badan_insentif_fiskal',
                  'badan_pp15_2022_ekstraktif',
                  'badan_pp12_2023_ikn',
                  'badan_pmk192_2018_pph24',
                  'badan_pmk93_2019_cfc',
                  'badan_pmk172_2023_tp_doc',
                  'badan_pmk52_2017_merger',
                  'badan_pmk18_2021_dividen_ln',
                  'badan_pp60_2010_zakat',
                ].includes(regimeId) && (
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph_badan.isTbk}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph_badan: { ...prev.pph_badan, isTbk: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Perseroan Terbuka (Tbk) dengan saham publik minimal 40%
                    </span>
                  </label>
                )}
              </>
            )}

            {activeTaxType === 'ppn' &&
              (regimeId === 'ppn_besaran_tertentu_pmk11_2025' ? (
                <>
                  <CurrencyInput
                    id="ppn-besaran-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total nilai tagihan / penyerahan (sudah termasuk PPN)'
                        : 'Nilai peredaran bruto / harga jual / biaya pembangunan KMS'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-besaran-type"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis penyerahan / besaran tertentu PPN (PMK 11/2025)
                    </label>
                    <select
                      id="ppn-besaran-type"
                      value={calcInput.ppn.besaranTertentuType ?? 'kms_2_2'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            besaranTertentuType: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['besaranTertentuType']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="kms_2_2">
                        Kegiatan Membangun Sendiri / KMS (20% x 11/12 x 12% = 2,2%)
                      </option>
                      <option value="paket_wisata_1_1">
                        Jasa Biro Perjalanan / Paket Wisata (10% x 11/12 x 12% = 1,1%)
                      </option>
                      <option value="pengiriman_paket_1_1">
                        Jasa Pengiriman Paket / Pos (10% x 11/12 x 12% = 1,1%)
                      </option>
                      <option value="kendaraan_bekas_1_1">
                        Penyerahan Kendaraan Bermotor Bekas oleh PKP (1,1%)
                      </option>
                      <option value="freight_forwarding_1_1">
                        Jasa Pengurusan Transportasi / Freight Forwarding (1,1%)
                      </option>
                      <option value="agen_asuransi_1_1">
                        Jasa Agen Asuransi atas Komisi Bruto (1,1%)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN (ekstrak DPP)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pmse_pmk60_2022' ? (
                <>
                  <CurrencyInput
                    id="ppn-pmse-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total harga tagihan pelanggan (sudah termasuk PPN)'
                        : 'Nilai transaksi layanan digital PMSE / platform (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-pmse-channel"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Saluran / rezim PPN ekonomi digital
                    </label>
                    <select
                      id="ppn-pmse-channel"
                      value={calcInput.ppn.pmseChannel ?? 'pmse_jasa_digital'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            pmseChannel: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['pmseChannel']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pmse_jasa_digital">
                        Produk Digital Asing / PMSE (11% efektif — PMK 60/2022 jo. PMK 131/2024)
                      </option>
                      <option value="aset_kripto_pmk50_2025">
                        Aset Kripto Berlaku Kini per 1 Ags 2025 (Bukan Objek PPN — 0%, PMK 50/2025)
                      </option>
                      <option value="aset_kripto_pmk68_2022">
                        Aset Kripto Historis 2022–Jul 2025 (0,11% Pedagang Bappebti — PMK 68/2022)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN (ekstrak DPP)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pkp_pmk197_2013' ? (
                <>
                  <CurrencyInput
                    id="ppn-pkp-omzet"
                    label="Total peredaran bruto / omzet penyerahan BKP & JKP setahun"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Menguji kewajiban pengukuhan sebagai Pengusaha Kena Pajak (PKP) dibandingkan plafon Pengusaha Kecil."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-pkp-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode batasan omzet Pengusaha Kecil
                    </label>
                    <select
                      id="ppn-pkp-era"
                      value={calcInput.ppn.eraPkp ?? 'pmk197_2013'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            eraPkp: e.target.value as 'pmk197_2013' | 'pmk68_2010',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pmk197_2013">
                        PMK 197/2013 &amp; PMK 164/2023 (2014–Kini: Ambang Rp 4,8 Miliar)
                      </option>
                      <option value="pmk68_2010">
                        PMK 68/2010 Historis (2010–2013: Ambang Rp 600 Juta)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_dtp_properti_pmk13_2025' ? (
                <>
                  <CurrencyInput
                    id="ppn-dtp-properti-harga"
                    label="Harga jual rumah tapak / rusun baru siap huni (sebelum PPN)"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="PMK 90/2025 & PMK 13/2025 mensyaratkan harga jual maksimal Rp 5 miliar dengan porsi DPP yang ditanggung pemerintah paling banyak Rp 2 miliar."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-dtp-properti-periode"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode Berita Acara Serah Terima (BAST) tahun 2025–2026
                    </label>
                      <select
                        id="ppn-dtp-properti-periode"
                        value={calcInput.ppn.periodePropertiDtp ?? 'ta_2026_100_pmk90'}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: {
                              ...prev.ppn,
                              periodePropertiDtp: e.target.value as NonNullable<
                                TaxCalculatorInput['ppn']['periodePropertiDtp']
                              >,
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="ta_2026_100_pmk90">
                          1 Januari – 31 Desember 2026 (DTP 100% — PMK 90/2025)
                        </option>
                        <option value="jan_jun_2025_100">
                          1 Januari – 30 Juni 2025 (DTP 100% — PMK 13/2025)
                        </option>
                        <option value="jul_des_2025_100_pmk60">
                          1 Juli – 31 Desember 2025 (DTP 100% — Perluasan PMK 60/2025)
                        </option>
                        <option value="jul_des_2025_50">
                          1 Juli – 31 Desember 2025 Skema Awal PMK 13/2025 (DTP 50%)
                        </option>
                      </select>
                  </div>
                </>
              ) : regimeId === 'ppn_dtp_tiket_pesawat' ? (
                <>
                  <CurrencyInput
                    id="ppn-dtp-tiket-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total harga komponen tiket (sudah termasuk PPN)'
                        : 'Nilai penggantian tiket (base fare + fuel surcharge, non-airport tax)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Gelombang 2026 (PMK 4, 43, & 77/2026) memberi PPN DTP 100% sehingga penumpang bayar Rp 0 PPN; gelombang 2025 (PMK 18, 36, & 71/2025) memberi DTP 6% (bayar 5%)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-dtp-tiket-periode"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Gelombang musiman PPN DTP tiket pesawat ekonomi domestik
                    </label>
                    <select
                      id="ppn-dtp-tiket-periode"
                      value={calcInput.ppn.periodeTiketDtp ?? 'pmk77_nataru_2026'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            periodeTiketDtp: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['periodeTiketDtp']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pmk77_nataru_2026">
                        Nataru Des 2026–Jan 2027 — PMK 77/2026 (DTP 100%, Bayar 0%)
                      </option>
                      <option value="pmk43_libur_2026">
                        Libur Sekolah Jun–Jul 2026 — PMK 43/2026 (DTP 100%, Bayar 0%)
                      </option>
                      <option value="pmk4_lebaran_2026">
                        Idulfitri 1447 H Mar 2026 — PMK 4/2026 (DTP 100%, Bayar 0%)
                      </option>
                      <option value="pmk18_mudik_2025">
                        Mudik Lebaran 2025 — PMK 18/2025 (DTP 6%, Bayar 5%)
                      </option>
                      <option value="pmk36_libur_2025">
                        Libur Sekolah Jun–Jul 2025 — PMK 36/2025 (DTP 6%, Bayar 5%)
                      </option>
                      <option value="pmk71_nataru_2025">
                        Nataru Des 2025–Jan 2026 — PMK 71/2025 (DTP 6%, Bayar 5%)
                      </option>
                      <option value="reguler_non_dtp">
                        Di Luar Periode Musiman / Non-Ekonomi (PPN Normal 11%)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN (ekstrak nilai penggantian)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_dtp_ev_pmk12_2025' ? (
                <>
                  <CurrencyInput
                    id="ppn-dtp-ev-harga"
                    label="Harga jual Kendaraan Listrik Berbasis Baterai / KBLBB (DPP sebelum pajak)"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Pada 2025 (tarif PPN 12%), DTP 10% menyisakan beban PPN 2% bagi pembeli KBLBB TKDN >= 40%."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-dtp-ev-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kriteria TKDN &amp; tahun anggaran insentif KBLBB
                    </label>
                    <select
                      id="ppn-dtp-ev-skema"
                      value={calcInput.ppn.skemaEvDtp ?? 'kblbb_tkdn40_pmk12_2025'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaEvDtp: e.target.value as
                              | 'kblbb_tkdn40_pmk12_2025'
                              | 'bus_tkdn20_pmk12_2025'
                              | 'kblbb_tkdn40_pmk8_2024',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="kblbb_tkdn40_pmk12_2025">
                        Mobil / Bus Listrik TKDN &gt;= 40% (PMK 12/2025 — DTP 10%, Pembeli Bayar 2%)
                      </option>
                      <option value="bus_tkdn20_pmk12_2025">
                        Bus Listrik TKDN 20% s.d. &lt; 40% (PMK 12/2025 — DTP 5%, Pembeli Bayar 7%)
                      </option>
                      <option value="kblbb_tkdn40_pmk8_2024">
                        KBLBB TKDN &gt;= 40% Historis TA 2024 (PMK 8/2024 — DTP 10% dr 11%, Bayar 1%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_pp49_2022_strategis' ? (
                <>
                  <CurrencyInput
                    id="ppn-strategis-harga"
                    label="Nilai penyerahan barang / jasa (DPP sebelum PPN)"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-strategis-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Fasilitas PPN Strategis (PP 49/2022) &amp; WAPU Instansi Pemerintah (PMK 59/2022)
                    </label>
                    <select
                      id="ppn-strategis-skema"
                      value={calcInput.ppn.skemaStrategis ?? 'bkp_jkp_dibebaskan_pp49'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaStrategis: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaStrategis']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="bkp_jkp_dibebaskan_pp49">
                        BKP/JKP Strategis Dibebaskan PP 49/2022 (0% Kode 08 — Sembako, Medis, Pendidikan)
                      </option>
                      <option value="tidak_dipungut_kawasan">
                        PPN Tidak Dipungut (0% Kode 07 — Kawasan Berikat/KEK/Angkutan Tertentu)
                      </option>
                      <option value="wapu_diatas_2jt">
                        Pengadaan Instansi Pemerintah &gt; Rp 2 Jt (Dipungut WAPU Bendahara 11%)
                      </option>
                      <option value="wapu_dibawah_2jt">
                        Pengadaan Instansi Pemerintah &lt;= Rp 2 Jt (Dipungut Sendiri Rekanan PKP 11%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_pkp_pra2010' ? (
                <>
                  <CurrencyInput
                    id="ppn-pkp-lama-omzet"
                    label="Peredaran bruto / omzet penyerahan BKP atau JKP setahun"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Menguji kewajiban Pengusaha Kena Pajak (PKP) dan tarif PPN 10% pada periode 1995–2009."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-pkp-lama-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode KMK Batasan Pengusaha Kecil (1995–2009)
                    </label>
                    <select
                      id="ppn-pkp-lama-era"
                      value={calcInput.ppn.eraPkpLama ?? 'kmk571_2003'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            eraPkpLama: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['eraPkpLama']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="kmk571_2003">
                        KMK 571/KMK.03/2003 (2004–2009: BKP &amp; JKP Rp 600 Juta)
                      </option>
                      <option value="kmk552_2000_bkp">
                        KMK 552/KMK.04/2000 (2001–2003: Penyerah BKP Rp 360 Juta)
                      </option>
                      <option value="kmk552_2000_jkp">
                        KMK 552/KMK.04/2000 (2001–2003: Pemberi JKP Rp 180 Juta)
                      </option>
                      <option value="kmk648_1994_bkp">
                        KMK 648/KMK.04/1994 (1995–2000: Penyerah BKP Rp 240 Juta)
                      </option>
                      <option value="kmk648_1994_jkp">
                        KMK 648/KMK.04/1994 (1995–2000: Pemberi JKP Rp 120 Juta)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_pmk163_2012_kms' ? (
                <>
                  <CurrencyInput
                    id="ppn-kms-lama-biaya"
                    label="Total biaya membangun sendiri per masa / proyek (di luar harga perolehan tanah)"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Bangunan >= 200 m2 yang dibangun sendiri memakai DPP 20% dari total biaya bulanan (tidak termasuk harga tanah)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-kms-lama-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode tarif efektif KMS (2012–2024)
                    </label>
                    <select
                      id="ppn-kms-lama-skema"
                      value={calcInput.ppn.skemaKmsLama ?? 'pmk163_2012_2persen'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaKmsLama: e.target.value as 'pmk163_2012_2persen' | 'pmk61_2022_2_2persen',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pmk163_2012_2persen">
                        PMK 163/PMK.03/2012 (2012–Mar 2022: 10% x 20% = 2,0% Efektif)
                      </option>
                      <option value="pmk61_2022_2_2persen">
                        PMK 61/PMK.03/2022 (Apr 2022–2024: 11% x 20% = 2,2% Efektif)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_pp40_2021_kek_refund' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-kek-refund-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Fasilitas Kawasan Ekonomi Khusus (PP 40/2021) atau VAT Refund Turis (PMK 120/2019)
                    </label>
                    <select
                      id="ppn-kek-refund-skema"
                      value={calcInput.ppn.skemaKekRefund ?? 'kek_tidak_dipungut_pp40'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaKekRefund: e.target.value as
                              | 'kek_tidak_dipungut_pp40'
                              | 'vat_refund_turis_pmk120',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="kek_tidak_dipungut_pp40">
                        Pemasukan Barang Modal / Bahan Baku ke KEK (PP 40/2021 — Tidak Dipungut 0% Kode 07)
                      </option>
                      <option value="vat_refund_turis_pmk120">
                        Klaim VAT Refund Belanja Turis Asing di Bandara (PMK 120/2019 — Min. PPN Rp 500 rb)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="ppn-kek-refund-nilai"
                    label={
                      calcInput.ppn.skemaKekRefund === 'vat_refund_turis_pmk120'
                        ? calcInput.ppn.termasukPpn
                          ? 'Total struk belanja toko retail Tax Free (sudah termasuk PPN)'
                          : 'Total nilai belanja barang ritel turis asing (sebelum PPN)'
                        : 'Nilai barang modal / bahan baku yang dimasukkan ke KEK (DPP)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  {calcInput.ppn.skemaKekRefund === 'vat_refund_turis_pmk120' && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.ppn.termasukPpn}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Nominal struk belanja sudah termasuk PPN 11% (ekstrak DPP)
                      </span>
                    </label>
                  )}
                </>
              ) : regimeId === 'ppn_pmk64_2022_pertanian' ? (
                <>
                  <CurrencyInput
                    id="ppn-pertanian-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total tagihan Barang Hasil Pertanian Tertentu (sudah termasuk PPN 1,1%)'
                        : 'Harga jual Barang Hasil Pertanian Tertentu / BHPT (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Tarif besaran tertentu PMK 64/2022 sebesar 1,1% (Pajak Masukan penjual tidak dikreditkan, namun PKP pembeli boleh mengkreditkan)."
                  />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN 1,1% (ekstrak DPP)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pp81_2015_strategis' ? (
                <CurrencyInput
                  id="ppn-pp81-harga"
                  label="Nilai impor / harga jual BKP tertentu bersifat strategis (PP 81/2015 jo. PP 48/2020)"
                  value={calcInput.ppn.hargaJualDpp}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      ppn: { ...prev.ppn, hargaJualDpp: val },
                    }))
                  }
                  helperText="Penyerahan mesin pabrik, bibit/benih, pakan ternak, air bersih, dan listrik rumah tangga <= 6.600 VA dibebaskan PPN 0% (Kode Faktur 08)."
                />
              ) : regimeId === 'ppn_pmk81_2024_wapu_bumn_kkks' ? (
                <>
                  <CurrencyInput
                    id="ppn-wapu81-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total nilai kontrak / invoice (sudah termasuk PPN 11%)'
                        : 'Harga jual / penggantian DPP (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Batas pengecualian WAPU PMK 81/2024: BUMN/KKKS > Rp 10 jt (termasuk PPN) -> Kode 030; Instansi Pemerintah > Rp 2 jt (non-PPN) -> Kode 020."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-wapu81-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Pihak pemungut / skema WAPU PPN (PMK 81/2024 Bab IV)
                    </label>
                    <select
                      id="ppn-wapu81-skema"
                      value={calcInput.ppn.skemaWapu81 ?? 'bumn_pmk8_diatas_10jt'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaWapu81: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaWapu81']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="bumn_pmk8_diatas_10jt">
                        BUMN &amp; Perusahaan Tertentu (ambang &gt; Rp 10 jt inc. PPN -&gt; Kode 030)
                      </option>
                      <option value="bumn_pmk8_sd_10jt">
                        Penyerahan ke BUMN &le; Rp 10 jt inc. PPN (Dipungut PKP Penjual -&gt; Kode 040)
                      </option>
                      <option value="kkks_diatas_10jt">
                        KKKS Migas &amp; Panas Bumi (ambang &gt; Rp 10 jt inc. PPN -&gt; Kode 030)
                      </option>
                      <option value="instansi_diatas_2jt">
                        Instansi Pemerintah / Bendahara (ambang &gt; Rp 2 jt exc. PPN -&gt; Kode 020)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN 11% (ekstrak DPP)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pmk40_2010_jln' ? (
                <>
                  <CurrencyInput
                    id="ppn-jln-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total pembayaran kontrak JLN (sudah termasuk PPN 11%)'
                        : 'Nilai tagihan JKP / BKP Tidak Berwujud dari Luar Negeri (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                    helperText="Wajib disetor sendiri paling lambat tanggal 15 bulan berikutnya (PMK 40/2010 jo. PMK 81/2024 & PMK 131/2024)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-jln-pkp"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status Pengusaha pemanfaat di Indonesia
                    </label>
                    <select
                      id="ppn-jln-pkp"
                      value={calcInput.ppn.statusPkpJln ?? 'pkp_dapat_kredit'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            statusPkpJln: e.target.value as 'pkp_dapat_kredit' | 'non_pkp_beban_biaya',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pkp_dapat_kredit">
                        Berstatus PKP (NTPN PPN JLN dapat dikreditkan sebagai Pajak Masukan)
                      </option>
                      <option value="non_pkp_beban_biaya">
                        Non-PKP / Orang Pribadi (Tetap wajib setor 11% — jadi komponen beban/biaya)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nilai kontrak sudah termasuk PPN (ekstrak 11/111)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pasal16d_aktiva' ? (
                <>
                  <CurrencyInput
                    id="ppn-16d-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total harga jual aktiva bekas (termasuk PPN)'
                        : 'Harga jual aktiva bekas (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-16d-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status Pajak Masukan saat perolehan aktiva dahulu (Pasal 16D UU PPN)
                    </label>
                    <select
                      id="ppn-16d-skema"
                      value={calcInput.ppn.skemaPasal16d ?? 'aktiva_pm_dapat_kredit'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaPasal16d: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaPasal16d']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="aktiva_pm_dapat_kredit">
                        PM Dapat Dikreditkan (Mesin, gudang, truk operasional — PPN 11% Kode 090)
                      </option>
                      <option value="aktiva_non_kredit_9_8_b">
                        Aset Tanpa Hubungan Langsung Usaha Pasal 9(8)(b) — Dikecualikan 0%
                      </option>
                      <option value="sedan_station_wagon_9_8_c">
                        Sedan / Station Wagon eks-Pasal 9(8)(c) pra-April 2022 — Dikecualikan 0%
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal harga jual sudah termasuk PPN 11%
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pmk186_2022_proporsional' ? (
                <>
                  <CurrencyInput
                    id="ppn-186-pm"
                    label="Total Pajak Masukan (PM) perolehan bersama dalam Faktur Pajak"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="ppn-186-zest"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Estimasi awal penyerahan kena PPN Z (%)
                      </label>
                      <input
                        id="ppn-186-zest"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={calcInput.ppn.persenZEstimasi ?? 70}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(100, Math.max(0, raw));
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, persenZEstimasi: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="ppn-186-zreal"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Realisasi akhir tahun kena PPN Z&apos; (%)
                      </label>
                      <input
                        id="ppn-186-zreal"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={calcInput.ppn.persenZRealisasi ?? 85}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(100, Math.max(0, raw));
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, persenZRealisasi: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-186-masa"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Masa manfaat (T) barang/jasa bersama (PMK 186/2022)
                    </label>
                    <select
                      id="ppn-186-masa"
                      value={calcInput.ppn.masaManfaatPpn ?? 4}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            masaManfaatPpn: (Number(e.target.value) as 1 | 4 | 10) || 4,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value={1}>T = 1 tahun (Bukan barang modal / jasa operasional)</option>
                      <option value={4}>T = 4 tahun (Barang modal selain tanah/bangunan)</option>
                      <option value={10}>T = 10 tahun (Barang modal berupa tanah dan/atau bangunan)</option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'ppn_pmk32_2019_ekspor_jkp' ? (
                <>
                  <CurrencyInput
                    id="ppn-ekspor-jkp-nilai"
                    label="Nilai penggantian kontrak Ekspor Jasa Kena Pajak"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-ekspor-jkp-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kelompok Jasa Kena Pajak (Pasal 4 PMK 32/2019)
                    </label>
                    <select
                      id="ppn-ekspor-jkp-jenis"
                      value={calcInput.ppn.jenisEksporJkp ?? 'maklon_desain_it'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            jenisEksporJkp: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['jenisEksporJkp']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="maklon_desain_it">
                        Maklon, TI &amp; Software / Hosting, atau Perbaikan Barang Ekspor (0%)
                      </option>
                      <option value="konsultansi_konstruksi_hukum">
                        Konsultansi Bisnis, Hukum, Akuntansi, Arsitektur &amp; Konstruksi LN (0%)
                      </option>
                      <option value="riset_perdagangan_interkoneksi">
                        Riset (R&amp;D), Perdagangan Ekspor, Persewaan Angkut &amp; Interkoneksi (0%)
                      </option>
                      <option value="jasa_lain_non_list">
                        Jasa di Luar Daftar PMK 32/2019 atau Dimanfaatkan di RI (11%)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.isMemenuhiSyaratEksporJkp !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, isMemenuhiSyaratEksporJkp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Terpenuhi kontrak tertulis dengan penerima LN + bukti transfer pembayaran dari luar negeri (PEJKP 0%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pmk41_2023_ayda' ? (
                <>
                  <CurrencyInput
                    id="ppn-ayda-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Harga jual / lelang AYDA (sudah termasuk PPN 1,1%)'
                        : 'Harga jual / nilai lelang AYDA kepada pembeli (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-ayda-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tahap transaksi agunan (PMK 41/2023 jo. PMK 11/2025)
                    </label>
                    <select
                      id="ppn-ayda-skema"
                      value={calcInput.ppn.skemaAyda ?? 'jual_ayda_pembeli'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaAyda: e.target.value as 'jual_ayda_pembeli' | 'pengambilalihan_debitur',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="jual_ayda_pembeli">
                        Penjualan / Lelang AYDA oleh Kreditur kepada Pembeli (Besaran Tertentu 1,1%)
                      </option>
                      <option value="pengambilalihan_debitur">
                        Pengambilalihan Awal Agunan dari Debitur oleh Kreditur (Belum Penyerahan Akhir — 0%)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nilai lelang / pelunasan sudah termasuk PPN 1,1%
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pmk75_2010_nilai_lain_retur' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-nilailain-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis transaksi DPP Nilai Lain / Nota Retur (PMK 11/2025 &amp; PMK 81/2024)
                    </label>
                    <select
                      id="ppn-nilailain-skema"
                      value={calcInput.ppn.skemaNilaiLainRetur ?? 'pemakaian_cuma_cuma'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaNilaiLainRetur: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaNilaiLainRetur']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pemakaian_cuma_cuma">
                        Pemakaian Sendiri Non-Produktif &amp; Pemberian Cuma-Cuma (DPP = HPP x 11/12)
                      </option>
                      <option value="nota_retur_bkp_jkp">
                        Nota Retur BKP / Nota Pembatalan JKP (Pengurang PK Penjual &amp; PM Pembeli)
                      </option>
                      <option value="film_cerita_nilai_lain">
                        Penyerahan Film Cerita (Perkiraan Hasil Rata-Rata x 11/12)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="ppn-nilailain-nilai"
                    label={
                      calcInput.ppn.skemaNilaiLainRetur === 'nota_retur_bkp_jkp'
                        ? 'Nilai BKP dikembalikan / JKP dibatalkan dalam Nota Retur'
                        : calcInput.ppn.skemaNilaiLainRetur === 'film_cerita_nilai_lain'
                          ? 'Perkiraan hasil rata-rata per judul film cerita'
                          : 'Harga jual komersial barang/jasa yang diberikan cuma-cuma'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  {(calcInput.ppn.skemaNilaiLainRetur ?? 'pemakaian_cuma_cuma') === 'pemakaian_cuma_cuma' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="ppn-nilailain-labakotor"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Persentase laba kotor yang dikeluarkan dari harga jual (%)
                      </label>
                      <input
                        id="ppn-nilailain-labakotor"
                        type="number"
                        min={0}
                        max={99}
                        step={1}
                        value={calcInput.ppn.persenLabaKotor ?? 20}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(99, Math.max(0, raw));
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, persenLabaKotor: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                  )}
                  {calcInput.ppn.skemaNilaiLainRetur === 'nota_retur_bkp_jkp' && (
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.ppn.termasukPpn}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Nilai Nota Retur yang diinput sudah termasuk PPN (ekstrak DPP 100/111)
                      </span>
                    </label>
                  )}
                </>
              ) : regimeId === 'ppn_pp85_2015_kawasan_berikat' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-kb-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Arah arus barang Kawasan Berikat (PP 85/2015 &amp; PMK 65/2021)
                    </label>
                    <select
                      id="ppn-kb-skema"
                      value={calcInput.ppn.skemaKawasanBerikat ?? 'pemasukan_bahan_baku'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaKawasanBerikat: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaKawasanBerikat']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pemasukan_bahan_baku">
                        Pemasukan Bahan Baku / Mesin ke Kawasan Berikat (Tidak Dipungut — Kode 07)
                      </option>
                      <option value="penjualan_tlldp_dalam_kuota">
                        Penjualan Hasil Produksi ke TLDDP / Domestik Dalam Kuota &le; 50% (11%)
                      </option>
                      <option value="penjualan_tlldp_lebih_kuota">
                        Penjualan ke TLDDP Melebihi Kuota 50% Tanpa Persetujuan (11% + Risiko Beku)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="ppn-kb-nilai"
                    label="Nilai barang pemasukan / penjualan hasil produksi Kawasan Berikat"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                </>
              ) : regimeId === 'ppn_pmk119_2024_restitusi' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-restitusi-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jalur pengembalian kelebihan pembayaran PPN (PMK 119/2024)
                    </label>
                    <select
                      id="ppn-restitusi-skema"
                      value={calcInput.ppn.skemaRestitusiPpn ?? 'wp_17d_sd_5m'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaRestitusiPpn: e.target.value as NonNullable<
                              TaxCalculatorInput['ppn']['skemaRestitusiPpn']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="wp_17d_sd_5m">
                        WP Persyaratan Tertentu Pasal 17D (Lebih Bayar &le; Rp 5 M — SKPPKP 1 Bln)
                      </option>
                      <option value="pkp_risiko_rendah_9_4c">
                        PKP Berisiko Rendah Pasal 9(4c) UU PPN (SKPPKP 1 Bln per Masa Pajak)
                      </option>
                      <option value="wp_17c_golden">
                        WP Kriteria Tertentu / Golden Taxpayer Pasal 17C (Tanpa Plafon — 1 Bln)
                      </option>
                      <option value="reguler_17b_pemeriksaan">
                        Restitusi Pemeriksaan Reguler Pasal 17B (Maks 12 Bln — Tanpa Sanksi 100%)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="ppn-restitusi-nilai"
                    label="Nilai Lebih Bayar PPN yang dimohonkan restitusi"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                </>
              ) : regimeId === 'ppn_per11_2025_digunggung' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppn-digunggung-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Karakteristik transaksi ritel PKP (Pasal 51–52 & 123 PER-11/PJ/2025)
                    </label>
                    <select
                      id="ppn-digunggung-skema"
                      value={calcInput.ppn.skemaDigunggung ?? 'eceran_konsumen_akhir'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: {
                            ...prev.ppn,
                            skemaDigunggung: e.target.value as 'eceran_konsumen_akhir' | 'eceran_ke_pkp_b2b',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="eceran_konsumen_akhir">
                        Penyerahan Langsung ke Konsumen Akhir (Faktur Pajak Digunggung di Coretax)
                      </option>
                      <option value="eceran_ke_pkp_b2b">
                        Penjualan ke Pembeli PKP / B2B / BKP Tertentu (Wajib e-Faktur Normal)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="ppn-digunggung-nilai"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total omzet kasir / struk ritel (sudah termasuk PPN 11%)'
                        : 'Nilai penjualan bersih eceran (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nilai penjualan sudah termasuk PPN (ekstrak DPP 100/111)
                    </span>
                  </label>
                </>
              ) : regimeId === 'ppn_pp47_2020_diplomatik' ? (
                <>
                  <CurrencyInput
                    id="ppn-diplomatik-nilai"
                    label="Nilai impor / penyerahan BKP atau JKP kepada PNA / Badan Internasional"
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.hasSkbDiplomatikTimbalBalik !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, hasSkbDiplomatikTimbalBalik: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memenuhi asas timbal balik / perjanjian internasional &amp; memiliki SKB PPN DJP (Kode Faktur 08 — 0%)
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="ppn-harga"
                    label={
                      calcInput.ppn.termasukPpn
                        ? 'Total harga faktur (sudah termasuk PPN)'
                        : 'Harga jual / penggantian (sebelum PPN)'
                    }
                    value={calcInput.ppn.hargaJualDpp}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppn: { ...prev.ppn, hargaJualDpp: val },
                      }))
                    }
                  />
                  {regimeId !== 'ppn_uuppn_1951' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="ppn-goods"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Kategori barang/jasa kena pajak
                      </label>
                      <select
                        id="ppn-goods"
                        value={calcInput.ppn.goodsType}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            ppn: { ...prev.ppn, goodsType: e.target.value as PpnGoodsType },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="umum">Barang / jasa umum (DPP Nilai Lain 11/12 di 2025)</option>
                        <option value="barang_mewah">
                          Barang tergolong mewah / PPnBM (DPP penuh 100%)
                        </option>
                      </select>
                    </div>
                  )}
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.ppn.termasukPpn}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppn: { ...prev.ppn, termasukPpn: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Nominal di atas sudah termasuk PPN (ekstrak DPP)
                    </span>
                  </label>
                </>
              ))}

            {activeTaxType === 'pbb' && (
              <>
                <CurrencyInput
                  id="pbb-bumi"
                  label="NJOP Bumi (total nilai tanah)"
                  value={calcInput.pbb.njopBumi}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pbb: { ...prev.pbb, njopBumi: val },
                    }))
                  }
                />
                <CurrencyInput
                  id="pbb-bangunan"
                  label="NJOP Bangunan (total nilai bangunan)"
                  value={calcInput.pbb.njopBangunan}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pbb: { ...prev.pbb, njopBangunan: val },
                    }))
                  }
                />
                {regimeId === 'pbb_pp46_2000' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbb-sektor-pp46"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor objek PBB (PP 46/2000)
                    </label>
                    <select
                      id="pbb-sektor-pp46"
                      value={calcInput.pbb.sektorPp46 ?? 'perkebunan_kehutanan'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbb: {
                            ...prev.pbb,
                            sektorPp46: e.target.value as
                              | 'perkebunan_kehutanan'
                              | 'pertambangan'
                              | 'lainnya_umum',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="perkebunan_kehutanan">
                        Perkebunan &amp; Kehutanan (NJKP 40%)
                      </option>
                      <option value="pertambangan">
                        Pertambangan (NJKP 40%)
                      </option>
                      <option value="lainnya_umum">
                        Perumahan / Umum &lt; Rp 1 M (NJKP 20%, ≥ Rp 1 M = 40%)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'pbb_pmk139_2014_migas' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbb-sektor-p3-lama"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor PBB-P3 Pusat (PMK 76/2013 &amp; PMK 139/2014)
                    </label>
                    <select
                      id="pbb-sektor-p3-lama"
                      value={calcInput.pbb.sektorP3Lama ?? 'migas_panas_bumi_pmk76'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbb: {
                            ...prev.pbb,
                            sektorP3Lama: e.target.value as
                              | 'migas_panas_bumi_pmk76'
                              | 'perkebunan_hutanan_pmk139',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="migas_panas_bumi_pmk76">
                        Hulu Migas &amp; Panas Bumi — Permukaan + Tubuh Bumi (PMK 76/2013 jo. PMK 122/2019)
                      </option>
                      <option value="perkebunan_hutanan_pmk139">
                        Perkebunan &amp; Perhutanan — Klasifikasi NJOP (PMK 139/2014)
                      </option>
                    </select>
                  </div>
                )}
                {![
                  'pbb_uu12_1994',
                  'pbb_uu12_1985',
                  'pbb_pmk186_2019_p3',
                  'pbb_pmk139_2014_migas',
                  'pbb_pp46_2000',
                  'pbb_ipeda_pra1986',
                ].includes(regimeId) && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pbb-njoptkp"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        NJOPTKP Daerah
                      </label>
                      <select
                        id="pbb-njoptkp"
                        value={calcInput.pbb.njoptkpPilihan}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pbb: { ...prev.pbb, njoptkpPilihan: Number(e.target.value) },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value={10000000}>Rp 10.000.000 (Standar minimal UU)</option>
                        <option value={15000000}>Rp 15.000.000 (Perda daerah tertentu)</option>
                        <option value={25000000}>Rp 25.000.000 (Perda daerah tertentu)</option>
                        <option value={60000000}>Rp 60.000.000 (Perda kota besar)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pbb-tier"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        {regimeId === 'pbb_hkpd_2022' || regimeId === 'pbb_pp35_2023'
                          ? 'Klaster NJKP Perda (x tarif 0,5%)'
                          : 'Lapisan tarif Perda UU PDRD'}
                      </label>
                      <select
                        id="pbb-tier"
                        value={calcInput.pbb.tierRate}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pbb: { ...prev.pbb, tierRate: e.target.value as PbbTierRate },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value="rendah">
                          {regimeId === 'pbb_hkpd_2022' || regimeId === 'pbb_pp35_2023'
                            ? 'NJKP 20% (tarif efektif 0,10%)'
                            : 'Lapisan bawah (tarif 0,10%)'}
                        </option>
                        <option value="menengah">
                          {regimeId === 'pbb_hkpd_2022' || regimeId === 'pbb_pp35_2023'
                            ? 'NJKP 40% (tarif efektif 0,20%)'
                            : 'Lapisan menengah (tarif 0,20%)'}
                        </option>
                        <option value="tinggi">
                          {regimeId === 'pbb_hkpd_2022' || regimeId === 'pbb_pp35_2023'
                            ? 'NJKP 60% (tarif efektif 0,30%)'
                            : 'Batas maksimal UU PDRD (0,30%)'}
                        </option>
                        {(regimeId === 'pbb_hkpd_2022' || regimeId === 'pbb_pp35_2023') && (
                          <option value="maksimal">NJKP 100% (tarif maksimal 0,50%)</option>
                        )}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTaxType === 'bphtb' && (
              <>
                <CurrencyInput
                  id="bphtb-harga"
                  label="Harga transaksi / nilai perolehan"
                  value={calcInput.bphtb.hargaTransaksi}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      bphtb: { ...prev.bphtb, hargaTransaksi: val },
                    }))
                  }
                />
                <CurrencyInput
                  id="bphtb-njop"
                  label="NJOP PBB objek tanah & bangunan"
                  value={calcInput.bphtb.njopObjek}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      bphtb: { ...prev.bphtb, njopObjek: val },
                    }))
                  }
                  helperText="NPOP akan mengambil nilai tertinggi antara harga transaksi dan NJOP."
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor="bphtb-acq"
                    className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                  >
                    Jenis perolehan hak
                  </label>
                  <select
                    id="bphtb-acq"
                    value={calcInput.bphtb.acquisitionType}
                    onChange={(e) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        bphtb: {
                          ...prev.bphtb,
                          acquisitionType: e.target.value as BphtbAcquisitionType,
                        },
                      }))
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                  >
                    <option value="jual_beli_pertama">
                      Jual beli / perolehan pertama (NPOPTKP min. Rp 80 jt di UU HKPD)
                    </option>
                    <option value="jual_beli_lainnya">
                      Jual beli / perolehan lainnya (NPOPTKP Rp 60 jt)
                    </option>
                    <option value="waris_hibah_wasiat">
                      Waris / hibah wasiat keluarga sedarah (NPOPTKP Rp 300 jt)
                    </option>
                  </select>
                </div>
                {regimeId === 'bphtb_pp35_2023_mbr' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.bphtb.isRumahMbr)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bphtb: { ...prev.bphtb, isRumahMbr: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Rumah pertama Masyarakat Berpenghasilan Rendah (MBR) — Pembebasan BPHTB 100% (Perda / SKB 3 Menteri)
                    </span>
                  </label>
                )}
                {regimeId === 'bphtb_pmk91_2006_pengurangan' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="bphtb-pengurangan-tingkat"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tingkat pengurangan BPHTB (KMK 561/2004 jo. PMK 91/2006)
                    </label>
                    <select
                      id="bphtb-pengurangan-tingkat"
                      value={calcInput.bphtb.tingkatPenguranganBphtb ?? 'pengurangan_50'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bphtb: {
                            ...prev.bphtb,
                            tingkatPenguranganBphtb: e.target.value as
                              | 'pengurangan_25'
                              | 'pengurangan_50'
                              | 'pengurangan_75',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pengurangan_25">
                        Pengurangan 25% — Pembeli Rumah Sederhana (RS/RSS) angsuran pengembang
                      </option>
                      <option value="pengurangan_50">
                        Pengurangan 50% — Hibah keluarga sedarah lurus / kepentingan umum
                      </option>
                      <option value="pengurangan_75">
                        Pengurangan 75% — Redistribusi tanah / korban bencana / veteran
                      </option>
                    </select>
                  </div>
                )}
              </>
            )}

            {activeTaxType === 'pph22' &&
              (regimeId === 'pph22_pmk37_2025' ? (
                <>
                  <CurrencyInput
                    id="pph22-marketplace-invoice"
                    label="Nilai peredaran bruto pada invoice marketplace (non-PPN & PPnBM)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                    helperText="Tarif PPh 22 PMK 37/2025 sebesar 0,5% dari nilai bruto invoice sebelum diskon/biaya platform."
                  />
                  <CurrencyInput
                    id="pph22-marketplace-akumulasi"
                    label="Akumulasi omzet tahun berjalan sebelum transaksi ini"
                    value={calcInput.pph22.akumulasiOmzetSebelumnya ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, akumulasiOmzetSebelumnya: val },
                      }))
                    }
                    helperText="WP Orang Pribadi dengan omzet kumulatif <= Rp 500 juta/tahun dan telah menyampaikan Surat Pernyataan tidak dipungut."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-marketplace-status"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Status pedagang & sifat pemungutan PMK 37/2025
                    </label>
                    <select
                      id="pph22-marketplace-status"
                      value={calcInput.pph22.marketplaceTaxStatus ?? 'umkm_final'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            marketplaceTaxStatus: e.target.value as
                              | 'umkm_final'
                              | 'umum_kredit'
                              | 'op_surat_pernyataan_dibawah_500jt',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="umkm_final">
                        WP UMKM Final (0,5% sebagai pelunasan PPh Final)
                      </option>
                      <option value="umum_kredit">
                        WP Tarif Umum / Non-UMKM (0,5% sebagai kredit pajak tidak final)
                      </option>
                      <option value="op_surat_pernyataan_dibawah_500jt">
                        WP OP omzet s.d. Rp 500 jt dg Surat Pernyataan (bebas pungut)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph22_pmk50_2025_kripto' || regimeId === 'pph22_pmk68_2022_kripto' ? (
                <>
                  <CurrencyInput
                    id="pph22-kripto-nilai"
                    label="Nilai transaksi jual/beli aset kripto (Rp)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                    helperText={
                      regimeId === 'pph22_pmk68_2022_kripto'
                        ? 'PMK 68/PMK.03/2022 (Mei 2022–Jul 2025) mengenakan PPh 22 Final 0,1%/0,2% sekaligus PPN Besaran Tertentu 0,11%/0,22%.'
                        : 'Tarif PPh Pasal 22 Final PMK 50/2025 berlaku sejak 1 Agustus 2025 menggantikan PMK 68/2022 (dan PPN koin kripto dihapus).'
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-kripto-channel"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Saluran / penyelenggara perdagangan aset kripto
                    </label>
                    <select
                      id="pph22-kripto-channel"
                      value={calcInput.pph22.kriptoChannel ?? 'dalam_negeri_ojk'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            kriptoChannel: e.target.value as 'dalam_negeri_ojk' | 'luar_negeri',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="dalam_negeri_ojk">
                        {regimeId === 'pph22_pmk68_2022_kripto'
                          ? 'Exchanger Terdaftar Bappebti Dalam Negeri (0,1% PPh 22 + 0,11% PPN)'
                          : 'PPMSE / Pedagang Aset Kripto Terdaftar Dalam Negeri (0,21% Final)'}
                      </option>
                      <option value="luar_negeri">
                        {regimeId === 'pph22_pmk68_2022_kripto'
                          ? 'Exchanger Non-Terdaftar / Luar Negeri (0,2% PPh 22 + 0,22% PPN)'
                          : 'PPMSE / Bursa Luar Negeri (1% Final — Lapor SPT Tahunan jika non-pemungut)'}
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph22_pmk48_2023_emas' ? (
                <>
                  <CurrencyInput
                    id="pph22-emas-nilai"
                    label="Harga jual emas perhiasan / emas batangan (Rp)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                    helperText="PMK 48/2023 jo. PMK 51/2025 menetapkan PPh Pasal 22 sebesar 0,25% (tidak final) dan dibebaskan bila pembeli konsumen akhir atau pemegang SKB."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-emas-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Skema transaksi emas (PPh 22 &amp; PPN Besaran Tertentu)
                    </label>
                    <select
                      id="pph22-emas-skema"
                      value={calcInput.pph22.skemaEmas ?? 'pabrikan_ke_pedagang_pkp'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            skemaEmas: e.target.value as NonNullable<
                              TaxCalculatorInput['pph22']['skemaEmas']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pabrikan_ke_pedagang_pkp">
                        Pabrikan Emas -&gt; Pedagang / Pabrikan Lain (PPh 22 0,25% + PPN 1,1%)
                      </option>
                      <option value="pabrikan_ke_konsumen">
                        Pabrikan Emas -&gt; Konsumen Akhir (PPh 22 0% + PPN 1,65%)
                      </option>
                      <option value="pedagang_punya_fp">
                        Pedagang Emas (Punya Faktur Pajak) -&gt; Pelaku Usaha (PPh 22 0,25% + PPN 1,1%)
                      </option>
                      <option value="pedagang_punya_fp_konsumen">
                        Pedagang Emas (Punya Faktur Pajak) -&gt; Konsumen Akhir (PPh 22 0% + PPN 1,1%)
                      </option>
                      <option value="pedagang_tanpa_fp_usaha">
                        Pedagang Emas (Tanpa Faktur Pajak) -&gt; Pelaku Usaha (PPh 22 0,25% + PPN 1,65%)
                      </option>
                      <option value="pedagang_tanpa_fp">
                        Pedagang Emas (Tanpa Faktur Pajak) -&gt; Konsumen Akhir (PPh 22 0% + PPN 1,65%)
                      </option>
                      <option value="emas_batangan">
                        Penjualan Emas Batangan Non-Konsumen Akhir (PPh 22 0,25% + PPN 0%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph22_mpo_uu8_1967' ? (
                <>
                  <CurrencyInput
                    id="pph22-mpo-nilai"
                    label="Nilai transaksi perdagangan / impor (Basis MPO Pra-1984)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                    helperText="UU 8/1967 mengenakan pungutan MPO (Menghitung Pajak Orang) sebesar 2% per transaksi niaga sebagai uang muka PPd 1944 / PPs 1925."
                  />
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph22.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: { ...prev.pph22, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Pembeli terdaftar NPWP / surat fiskal (tarif MPO standar 2%, jika tidak 4%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph22_pmk58_2022_sipp' ? (
                <CurrencyInput
                  id="pph22-sipp-nilai"
                  label="Nilai transaksi pengadaan instansi pemerintah via SIPP / Marketplace (non-PPN)"
                  value={calcInput.pph22.nilaiDasar}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph22: { ...prev.pph22, nilaiDasar: val },
                    }))
                  }
                  helperText="Pihak lain (marketplace SIPP pemerintah) memungut PPh Pasal 22 sebesar 0,5% dari jumlah pembayaran tidak termasuk PPN (PMK 58/PMK.03/2022)."
                />
              ) : regimeId === 'pph22_bbm_industri' ? (
                <>
                  <CurrencyInput
                    id="pph22-bbm-nilai"
                    label="Harga jual / penebusan BBM, BBG, pelumas, atau hasil industri (non-PPN)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-bbm-sektor"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor BBM / BBG / industri pemungutan PPh Pasal 22
                    </label>
                    <select
                      id="pph22-bbm-sektor"
                      value={calcInput.pph22.sektorIndustri ?? 'bbm_spbu_pertamina'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            sektorIndustri: e.target.value as NonNullable<
                              TaxCalculatorInput['pph22']['sektorIndustri']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="bbm_spbu_pertamina">
                        BBM untuk SPBU/Agen dari Pertamina (0,25% Final ke penyalur)
                      </option>
                      <option value="bbm_spbu_non_pertamina">
                        BBM untuk SPBU/Agen non-Pertamina / selain penyalur (0,3%)
                      </option>
                      <option value="bbg_pelumas">
                        BBG &amp; Pelumas produsen/importir (0,3%)
                      </option>
                      <option value="semen">Industri Semen dalam negeri (0,25%)</option>
                      <option value="kertas">Industri Kertas dalam negeri (0,1%)</option>
                      <option value="baja">Industri Baja dalam negeri (0,3%)</option>
                      <option value="otomotif">Industri Otomotif / ATPM (0,45%)</option>
                      <option value="farmasi">Industri Farmasi distributor dalam negeri (0,3%)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph22.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: { ...prev.pph22, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Penyalur / pembeli memiliki NPWP (hindari tarif ganda +100% jika tidak final)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph22_pmk253_2008_mewah' ? (
                <>
                  <CurrencyInput
                    id="pph22-mewah-nilai"
                    label="Harga jual barang sangat mewah (tidak termasuk PPN & PPnBM)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-mewah-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kelompok barang sangat mewah
                    </label>
                    <select
                      id="pph22-mewah-jenis"
                      value={calcInput.pph22.jenisMewah ?? 'hunian_mewah'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            jenisMewah: e.target.value as 'hunian_mewah' | 'kendaraan_yacht_pesawat',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="hunian_mewah">
                        Rumah beserta tanahnya &amp; apartemen/kondominium mewah
                      </option>
                      <option value="kendaraan_yacht_pesawat">
                        Pesawat pribadi, kapal pesiar/yacht, kendaraan roda empat mewah
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-mewah-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode aturan tarif &amp; ambang batas harga jual
                    </label>
                    <select
                      id="pph22-mewah-era"
                      value={calcInput.pph22.eraMewah ?? 'pmk92_2019'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            eraMewah: e.target.value as 'pmk92_2019' | 'pmk90_2015' | 'pmk253_2008',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pmk92_2019">
                        PMK 92/2019 (2019–Kini: Hunian ≥ Rp 30 M tarif 1%, non-hunian 5%)
                      </option>
                      <option value="pmk90_2015">
                        PMK 90/2015 (2015–2019: Hunian ≥ Rp 5 M tarif 5%)
                      </option>
                      <option value="pmk253_2008">
                        PMK 253/2008 Awal (2009–2015: Ambang lama Rp 10 M tarif 5%)
                      </option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph22.hasNpwp}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: { ...prev.pph22, hasNpwp: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Pembeli memiliki NPWP (hindari sanksi +100%)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph22_pembebasan_skb' ? (
                <>
                  <CurrencyInput
                    id="pph22-skb-nilai"
                    label="Nilai transaksi / nilai impor CIF + Bea Masuk (non-PPN)"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                    helperText="Pasal 3 PMK 51/2025 mengecualikan belanja instansi <= Rp 2 juta (non-PPN) dan impor KITE/KEK secara otomatis tanpa SKB."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-skb-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis pengecualian / SKB PPh Pasal 22 (PMK 51/2025)
                    </label>
                    <select
                      id="pph22-skb-skema"
                      value={calcInput.pph22.skemaPembebasan22 ?? 'belanja_max_2jt'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: {
                            ...prev.pph22,
                            skemaPembebasan22: e.target.value as NonNullable<
                              TaxCalculatorInput['pph22']['skemaPembebasan22']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="belanja_max_2jt">
                        Belanja Instansi Pemerintah &le; Rp 2 juta non-PPN (Bebas Otomatis 0% Tanpa SKB)
                      </option>
                      <option value="kite_kek_bebas_bm">
                        Impor KITE Pembebasan / KEK / Kawasan Berikat / Bantuan Bencana (Bebas Otomatis 0%)
                      </option>
                      <option value="impor_ekspor_skb_djp">
                        Pembebasan dengan SKB PPh 22 DJP (Wajib Pajak Rugi Fiskal / Tidak Terutang PPh)
                      </option>
                      <option value="umkm_pp55_skb">
                        Rekanan menyerahkan Suket UMKM PP 55/2022 / PP 20/2026 (Dialihkan ke Final 0,5%)
                      </option>
                    </select>
                  </div>
                  {(calcInput.pph22.skemaPembebasan22 ?? 'belanja_max_2jt') === 'belanja_max_2jt' && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph22.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph22: { ...prev.pph22, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Rekanan ber-NPWP/NIK valid (bila transaksi &gt; Rp 2 juta kena 1,5%, bukan 3%)
                      </span>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pph22-dasar"
                    label="Nilai impor (CIF + Bea Masuk) atau harga beli non-PPN"
                    value={calcInput.pph22.nilaiDasar}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph22: { ...prev.pph22, nilaiDasar: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph22-object"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek pemungutan PPh Pasal 22
                    </label>
                    <select
                      id="pph22-object"
                      value={calcInput.pph22.objectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph22: { ...prev.pph22, objectType: e.target.value as Pph22ObjectType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH22_OBJECTS.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!['pph22_kmk450_1997', 'pph22_uu7_1983'].includes(regimeId) && (
                    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph22.hasNpwp}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph22: { ...prev.pph22, hasNpwp: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Importir / rekanan memiliki NPWP (hindari sanksi +100%)
                      </span>
                    </label>
                  )}
                </>
              ))}

            {activeTaxType === 'pph4_2' &&
              (regimeId === 'pph4_2_deposito_pp131_2000' ? (
                <>
                  <CurrencyInput
                    id="pph42-deposito-bunga"
                    label="Bunga deposito / tabungan / diskonto SBI yang diterima (Rp)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph42-deposito-pokok"
                    label="Nominal pokok / rata-rata saldo deposito & tabungan"
                    value={calcInput.pph4_2.nilaiDepositoPokok ?? 100000000}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiDepositoPokok: val },
                      }))
                    }
                    helperText="Pokok s.d. Rp 7.500.000 tidak dipotong PPh Final Pasal 4(2) sesuai PP 131/2000."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-deposito-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Skema &amp; tenor penempatan (PP 131/2000 jo. PP 123/2015)
                    </label>
                    <select
                      id="pph42-deposito-skema"
                      value={calcInput.pph4_2.depositoSkema ?? 'reguler'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            depositoSkema: e.target.value as NonNullable<
                              TaxCalculatorInput['pph4_2']['depositoSkema']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="reguler">Deposito / Tabungan Reguler (20% Final)</option>
                      <option value="dhe_idr_1bln">DHE Rupiah — Tenor 1 Bulan (7,5% Final)</option>
                      <option value="dhe_idr_3bln">DHE Rupiah — Tenor 3 Bulan (5% Final)</option>
                      <option value="dhe_idr_6bln_lebih">DHE Rupiah — Tenor ≥ 6 Bulan (0% Final)</option>
                      <option value="dhe_usd_1bln">DHE Valas USD — Tenor 1 Bulan (10% Final)</option>
                      <option value="dhe_usd_3bln">DHE Valas USD — Tenor 3 Bulan (7,5% Final)</option>
                      <option value="dhe_usd_6bln">DHE Valas USD — Tenor 6 Bulan (2,5% Final)</option>
                      <option value="dhe_usd_lebih_6bln">DHE Valas USD — Tenor &gt; 6 Bulan (0% Final)</option>
                      <option value="historis_pp51_1994">Historis PP 51/1994 Pra-2001 (15% Final)</option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_obligasi_pp91_2021' ? (
                <>
                  <CurrencyInput
                    id="pph42-obligasi-bunga"
                    label="Bunga kupon dan/atau diskonto obligasi diterima WPDN (Rp)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-obligasi-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode aturan PPh Final bunga obligasi WPDN
                    </label>
                    <select
                      id="pph42-obligasi-era"
                      value={calcInput.pph4_2.eraObligasi ?? 'pp91_2021'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            eraObligasi: e.target.value as 'pp91_2021' | 'pp16_2009' | 'pp139_2000',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pp91_2021">
                        PP 91/2021 (30 Ags 2021–Kini: 10% Final WPDN &amp; BUT)
                      </option>
                      <option value="pp16_2009">
                        PP 16/2009 jo. PP 55/2019 (2009–2021: 15% WPDN / 5% Reksadana)
                      </option>
                      <option value="pp139_2000">
                        PP 139/2000 Awal (2001–2008: 20% Final Bursa)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_saham_pp41_1994' ? (
                <>
                  <CurrencyInput
                    id="pph42-saham-bruto"
                    label="Nilai bruto transaksi penjualan saham di Bursa Efek Indonesia (Rp)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph4_2.isSahamPendiri)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: { ...prev.pph4_2, isSahamPendiri: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Termasuk kategori Saham Pendiri — Tambahan PPh Final 0,5% (total 0,6% sesuai PP 14/1997)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph4_2_dividen_op' ? (
                <>
                  <CurrencyInput
                    id="pph42-dividen-bruto"
                    label="Nilai bruto dividen yang diterima Wajib Pajak Orang Pribadi Dalam Negeri"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph4_2.isDividenReinvested)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: { ...prev.pph4_2, isDividenReinvested: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Diinvestasikan kembali di Indonesia minimal 3 tahun (Pengecualian 0% UU Cipta Kerja / PMK 18/2021)
                    </span>
                  </label>
                </>
              ) : regimeId === 'pph4_2_undian_koperasi' ? (
                <>
                  <CurrencyInput
                    id="pph42-undian-bruto"
                    label="Nilai bruto hadiah undian atau bunga simpanan koperasi (/bulan)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-undian-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek PPh Final
                    </label>
                    <select
                      id="pph42-undian-jenis"
                      value={calcInput.pph4_2.undianAtauKoperasi ?? 'hadiah_undian'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            undianAtauKoperasi: e.target.value as 'hadiah_undian' | 'simpanan_koperasi',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="hadiah_undian">
                        Hadiah Undian — PP 132/2000 (25% Final dari Nilai Bruto)
                      </option>
                      <option value="simpanan_koperasi">
                        Bunga Simpanan Koperasi ke Anggota OP — PP 15/2009 (0% ≤ Rp 240 rb/bln; 10% &gt; Rp 240 rb)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_phtb_khusus' ? (
                <>
                  <CurrencyInput
                    id="pph42-phtb-khusus-bruto"
                    label="Nilai bruto pengalihan hak tanah dan/atau bangunan (PP 34/2016)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-phtb-khusus-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori pengalihan properti PP Nomor 34 Tahun 2016
                    </label>
                    <select
                      id="pph42-phtb-khusus-skema"
                      value={calcInput.pph4_2.skemaPhtbKhusus ?? 'rumah_sederhana_1'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaPhtbKhusus: e.target.value as
                              | 'umum_2_5'
                              | 'rumah_sederhana_1'
                              | 'pemerintah_bumn_0',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="rumah_sederhana_1">
                        Rumah Sederhana / Rusun Sederhana oleh Developer (1% Final)
                      </option>
                      <option value="pemerintah_bumn_0">
                        Pengalihan kepada Pemerintah / BUMN-BUMD Kepentingan Umum (0%)
                      </option>
                      <option value="umum_2_5">
                        Pengalihan Hak Tanah / Bangunan Komersial Umum (2,5% Final)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_spn_pp27_2008' ? (
                <>
                  <CurrencyInput
                    id="pph42-spn-dhe-bruto"
                    label="Nilai diskonto SPN atau bunga deposito DHE SDA (Rp)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-spn-dhe-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Instrumen Surat Perbendaharaan Negara (SPN) &amp; Devisa Hasil Ekspor (DHE SDA)
                    </label>
                    <select
                      id="pph42-spn-dhe-skema"
                      value={calcInput.pph4_2.skemaSpnDhe ?? 'diskonto_spn_20'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaSpnDhe: e.target.value as
                              | 'diskonto_spn_20'
                              | 'dhe_nonmigas_pp8_2025_12bln'
                              | 'dhe_migas_pp36_2023_3bln',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="diskonto_spn_20">
                        Diskonto SPN &lt;= 12 Bulan — PP 27/2008 (20% Final)
                      </option>
                      <option value="dhe_nonmigas_pp8_2025_12bln">
                        Bunga Deposito DHE SDA Non-Migas Retensi 100% 12 Bln — PP 8/2025 (0% Final)
                      </option>
                      <option value="dhe_migas_pp36_2023_3bln">
                        Bunga Deposito DHE SDA Migas USD Tenor 3 Bln — PP 36/2023 (7,5% Final)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_pp40_2016_dire' ? (
                <CurrencyInput
                  id="pph42-dire-bruto"
                  label="Nilai bruto pengalihan aset real estat kepada SPC / KIK-DIRE (Rp)"
                  value={calcInput.pph4_2.nilaiBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                    }))
                  }
                  helperText="PP Nomor 40 Tahun 2016 memangkas tarif PPh Final pengalihan properti ke dalam skema KIK-DIRE dari 2,5% menjadi 0,5%."
                />
              ) : regimeId === 'pph4_2_pp4_1995_ventura' ? (
                <CurrencyInput
                  id="pph42-ventura-bruto"
                  label="Nilai bruto transaksi penjualan saham / penyertaan pada Perusahaan Pasangan Usaha (Rp)"
                  value={calcInput.pph4_2.nilaiBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                    }))
                  }
                  helperText="PP Nomor 4 Tahun 1995 mengenakan PPh Final 0,1% bagi perusahaan modal ventura atas divestasi PPU non-bursa."
                />
              ) : regimeId === 'pph4_2_pp51_1994_historis' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-historis-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Objek PPh Final periode 1995–2000 (PP 51/1994 &amp; PP 42/1994)
                    </label>
                    <select
                      id="pph42-historis-skema"
                      value={calcInput.pph4_2.skemaPph42Historis ?? 'deposito_15_pp51_1994'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaPph42Historis: e.target.value as
                              | 'deposito_15_pp51_1994'
                              | 'undian_20_pp42_1994',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="deposito_15_pp51_1994">
                        Bunga Deposito / Tabungan / SBI (15% Final — PP 51/1994)
                      </option>
                      <option value="undian_20_pp42_1994">
                        Hadiah Undian Segala Nama &amp; Bentuk (20% Final — PP 42/1994)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pph42-historis-bruto"
                    label={
                      calcInput.pph4_2.skemaPph42Historis === 'undian_20_pp42_1994'
                        ? 'Nilai bruto hadiah undian (Rp)'
                        : 'Bunga bruto deposito / tabungan / diskonto SBI (Rp)'
                    }
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                </>
              ) : regimeId === 'pph4_2_pmk191_2015_revaluasi' ? (
                <>
                  <CurrencyInput
                    id="pph42-revaluasi-pasar"
                    label="Nilai pasar wajar aktiva tetap hasil penilaian KJPP (Rp)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph42-revaluasi-buku"
                    label="Nilai sisa buku fiskal aktiva tetap semula (Rp)"
                    value={calcInput.pph4_2.nilaiBukuFiskal ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBukuFiskal: val },
                      }))
                    }
                    helperText="DPP PPh Final revaluasi adalah selisih lebih antara nilai pasar wajar dan nilai sisa buku fiskal."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-revaluasi-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode &amp; tarif revaluasi aktiva tetap (PMK 79/2008 &amp; PMK 191/2015)
                    </label>
                    <select
                      id="pph42-revaluasi-skema"
                      value={calcInput.pph4_2.skemaRevaluasi ?? 'reguler_10_pmk79'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaRevaluasi: e.target.value as NonNullable<
                              TaxCalculatorInput['pph4_2']['skemaRevaluasi']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="reguler_10_pmk79">
                        PMK 79/PMK.03/2008 — Tarif Reguler Berlaku Kini (10%)
                      </option>
                      <option value="insentif_2015_3">
                        PMK 191/2015 — Insentif Paket Ekonomi s.d. 31 Des 2015 (3%)
                      </option>
                      <option value="insentif_h1_2016_4">
                        PMK 191/2015 — Insentif Jan–Jun 2016 (4%)
                      </option>
                      <option value="insentif_h2_2016_6">
                        PMK 191/2015 — Insentif Jul–Des 2016 (6%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_pps_tax_amnesty' ? (
                <>
                  <CurrencyInput
                    id="pph42-ta-pps-harta"
                    label="Nilai harta bersih yang diungkapkan (Nilai Wajar Harta - Utang Relevan)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-ta-pps-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Program, periode, &amp; skema penempatan aset (TA 2016–2017 / PPS 2022)
                    </label>
                    <select
                      id="pph42-ta-pps-skema"
                      value={calcInput.pph4_2.skemaTaPps ?? 'pps_k2_14'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaTaPps: e.target.value as NonNullable<
                              TaxCalculatorInput['pph4_2']['skemaTaPps']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pps_k2_12">PPS 2022 Kebijakan II OP — DN + Investasi SBN/Hilirisasi (12%)</option>
                      <option value="pps_k2_14">PPS 2022 Kebijakan II OP — Deklarasi DN / Repatriasi (14%)</option>
                      <option value="pps_k2_18">PPS 2022 Kebijakan II OP — Deklarasi Luar Negeri (18%)</option>
                      <option value="pps_k1_6">PPS 2022 Kebijakan I (Peserta TA) — DN + Investasi SBN/Hilirisasi (6%)</option>
                      <option value="pps_k1_8">PPS 2022 Kebijakan I (Peserta TA) — Deklarasi DN / Repatriasi (8%)</option>
                      <option value="pps_k1_11">PPS 2022 Kebijakan I (Peserta TA) — Deklarasi Luar Negeri (11%)</option>
                      <option value="ta_dn_2">Tax Amnesty 2016 Periode I — DN / Repatriasi (2%)</option>
                      <option value="ta_dn_3">Tax Amnesty 2016 Periode II — DN / Repatriasi (3%)</option>
                      <option value="ta_dn_5">Tax Amnesty 2017 Periode III — DN / Repatriasi (5%)</option>
                      <option value="ta_ln_4">Tax Amnesty 2016 Periode I — Deklarasi Luar Negeri (4%)</option>
                      <option value="ta_ln_6">Tax Amnesty 2016 Periode II — Deklarasi Luar Negeri (6%)</option>
                      <option value="ta_ln_10">Tax Amnesty 2017 Periode III — Deklarasi Luar Negeri (10%)</option>
                      <option value="ta_umkm_0_5">Tax Amnesty UMKM — Total Harta &le; Rp 10 M (0,5%)</option>
                      <option value="ta_umkm_2">Tax Amnesty UMKM — Total Harta &gt; Rp 10 M (2%)</option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_skb_waris_hibah' ? (
                <>
                  <CurrencyInput
                    id="pph42-skb-nilai"
                    label="Nilai pengalihan / NJOP / harga pasar properti"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-skb-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori Pengecualian &amp; SKB PHTB (Pasal 6 PP 34/2016)
                    </label>
                    <select
                      id="pph42-skb-skema"
                      value={calcInput.pph4_2.skemaSkbPhtb ?? 'waris'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaSkbPhtb: e.target.value as NonNullable<
                              TaxCalculatorInput['pph4_2']['skemaSkbPhtb']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="waris">
                        Pengalihan karena Warisan kepada Ahli Waris (SKB PHTB — 0%)
                      </option>
                      <option value="hibah_garis_lurus">
                        Hibah Garis Lurus 1 Derajat (Ortu &lt;-&gt; Anak) / Badan Sosial-Keagamaan (0%)
                      </option>
                      <option value="op_bawah_ptkp_60jt">
                        OP Bawah PTKP dengan Nilai Pengalihan &lt; Rp 60 Juta (0%; &ge; 60 Jt = 2,5%)
                      </option>
                      <option value="hibah_non_garis_lurus_tanpa_skb">
                        Hibah kepada Saudara Kandung / Pihak Non-Garis Lurus / Tanpa SKB (2,5% Final)
                      </option>
                    </select>
                  </div>
                  {(calcInput.pph4_2.skemaSkbPhtb ?? 'waris') === 'waris' && (
                    <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                      <input
                        type="checkbox"
                        checked={calcInput.pph4_2.isDilaporkanSptPewaris !== false}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph4_2: { ...prev.pph4_2, isDilaporkanSptPewaris: e.target.checked },
                          }))
                        }
                        className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                      />
                      <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                        Properti warisan sudah dilaporkan di SPT Tahunan pewaris (atau pewaris berpenghasilan di bawah PTKP &amp; ada Surat Pernyataan)
                      </span>
                    </label>
                  )}
                </>
              ) : regimeId === 'pph4_2_pmk28_2024_ikn' ? (
                <>
                  <CurrencyInput
                    id="pph42-ikn-nilai"
                    label="Nilai pengalihan hak atas tanah dan/atau bangunan di wilayah IKN"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-ikn-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tahap pengalihan properti di Ibu Kota Nusantara (PMK 28/2024)
                    </label>
                    <select
                      id="pph42-ikn-skema"
                      value={calcInput.pph4_2.skemaIknPhtb ?? 'perolehan_pertama_skb'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: {
                            ...prev.pph4_2,
                            skemaIknPhtb: e.target.value as 'perolehan_pertama_skb' | 'pengalihan_kedua_normal',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="perolehan_pertama_skb">
                        Perolehan Pertama di IKN + SKB s.d. 2035 (Pengurangan 100% — 0%)
                      </option>
                      <option value="pengalihan_kedua_normal">
                        Pengalihan Kedua / Pasar Sekunder IKN (Tarif Normal 2,5%)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pph4_2_pp17_2009_derivatif' ? (
                <>
                  <CurrencyInput
                    id="pph42-derivatif-margin"
                    label="Nilai margin awal (initial margin) kontrak berjangka di bursa"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph4_2.isMarginAwalDerivatif !== false}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: { ...prev.pph4_2, isMarginAwalDerivatif: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Simulasi periode berlakunya PP 17/2009 (1 Jan 2009 – 30 Mei 2011: 2,5% final; non-centang untuk pasca-pencabutan PP 31/2011)
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pph42-bruto"
                    label="Nilai bruto transaksi / nilai kontrak / harga pengalihan (non-PPN)"
                    value={calcInput.pph4_2.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph4_2: { ...prev.pph4_2, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph42-object"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek PPh Final Pasal 4(2)
                    </label>
                    <select
                      id="pph42-object"
                      value={calcInput.pph4_2.objectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph4_2: { ...prev.pph4_2, objectType: e.target.value as Pph4_2ObjectType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH4_2_OBJECTS.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {regimeId === 'pph4_2_pp29_1996' &&
                    calcInput.pph4_2.objectType === 'sewa_tanah_bangunan' && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="pph42-sewa-subject"
                          className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                        >
                          Pemilik properti yang menyewakan (PP 29/1996)
                        </label>
                        <select
                          id="pph42-sewa-subject"
                          value={calcInput.pph4_2.sewaSubjectType ?? 'orang_pribadi'}
                          onChange={(e) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pph4_2: {
                                ...prev.pph4_2,
                                sewaSubjectType: e.target.value as 'orang_pribadi' | 'badan_usaha',
                              },
                            }))
                          }
                          className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                        >
                          <option value="orang_pribadi">
                            Wajib Pajak Orang Pribadi (tarif 10% PP 29/1996)
                          </option>
                          <option value="badan_usaha">
                            Wajib Pajak Badan / BUT (tarif 6% PP 29/1996)
                          </option>
                        </select>
                      </div>
                    )}
                </>
              ))}

            {activeTaxType === 'pph25' &&
              (regimeId === 'pph25_kmk522_2000_oppt' ? (
                <CurrencyInput
                  id="pph25-oppt-omzet"
                  label="Peredaran bruto (omzet) seluruh gerai Pengusaha Tertentu (OPPT) per bulan"
                  value={calcInput.pph25.omzetOpptBulanan ?? 0}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph25: { ...prev.pph25, omzetOpptBulanan: val },
                    }))
                  }
                  helperText="Tarif angsuran PPh Pasal 25 OPPT ditetapkan sebesar 0,75% per bulan per tempat usaha (PMK 208/PMK.03/2009 jo. PMK 215/2018)."
                />
              ) : regimeId === 'pph25_pp80_2008_fln' ? (
                <div className="space-y-1.5">
                  <label
                    htmlFor="pph25-fln-transport"
                    className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                  >
                    Moda keberangkatan &amp; status NPWP (Fiskal Luar Negeri 2009–2010)
                  </label>
                  <select
                    id="pph25-fln-transport"
                    value={calcInput.pph25.flnTransport ?? 'udara'}
                    onChange={(e) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph25: {
                          ...prev.pph25,
                          flnTransport: e.target.value as 'udara' | 'laut' | 'punya_npwp',
                        },
                      }))
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                  >
                    <option value="udara">
                      Pesawat Udara Tanpa NPWP (Rp 2.500.000 per keberangkatan)
                    </option>
                    <option value="laut">
                      Kapal Laut Tanpa NPWP (Rp 1.000.000 per keberangkatan)
                    </option>
                    <option value="punya_npwp">
                      Memiliki NPWP / Anggota Keluarga Tercantum di KK (Rp 0 — Bebas FLN)
                    </option>
                  </select>
                </div>
              ) : regimeId === 'pph25_pp42_2000_fln' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-fln-lama-transport"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Moda keberangkatan keluar negeri (PP 42/2000 — Era 2000–2008)
                    </label>
                    <select
                      id="pph25-fln-lama-transport"
                      value={calcInput.pph25.flnTransport === 'laut' ? 'laut' : 'udara'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: {
                            ...prev.pph25,
                            flnTransport: e.target.value === 'laut' ? 'laut' : 'udara',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="udara">
                        Pesawat Udara (Rp 1.000.000/keberangkatan — Pemilik NPWP tetap bayar)
                      </option>
                      <option value="laut">
                        Kapal Laut (Rp 500.000/keberangkatan — Pemilik NPWP tetap bayar)
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-fln-trips"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jumlah keberangkatan ke luar negeri
                    </label>
                    <input
                      id="pph25-fln-trips"
                      type="number"
                      min={1}
                      max={24}
                      step={1}
                      value={calcInput.pph25.bulanBerjalan}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 1 : Math.min(24, Math.max(1, Math.round(raw)));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, bulanBerjalan: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                  </div>
                </>
              ) : regimeId === 'pph25_pp46_1994_fln' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-fln1994-era"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Periode regulasi Fiskal Luar Negeri (1995–2000)
                    </label>
                    <select
                      id="pph25-fln1994-era"
                      value={calcInput.pph25.flnEra1994 ?? 'pp17_1998'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: {
                            ...prev.pph25,
                            flnEra1994: e.target.value as 'pp46_1994' | 'pp17_1998',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pp46_1994">
                        PP 46/1994 (1995–Jan 1998: Rp 250 rb Udara / Rp 100 rb Laut / Rp 50 rb Darat)
                      </option>
                      <option value="pp17_1998">
                        PP 17/1998 (Jan 1998–Jun 2000: Rp 1 jt Udara / Rp 500 rb Laut / Rp 200 rb Darat)
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-fln1994-transport"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Moda keberangkatan ke luar negeri
                    </label>
                    <select
                      id="pph25-fln1994-transport"
                      value={
                        calcInput.pph25.flnTransport === 'laut' || calcInput.pph25.flnTransport === 'darat'
                          ? calcInput.pph25.flnTransport
                          : 'udara'
                      }
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: {
                            ...prev.pph25,
                            flnTransport: e.target.value as 'udara' | 'laut' | 'darat',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="udara">Pesawat Udara (Bandar Udara Internasional)</option>
                      <option value="laut">Kapal Laut (Pelabuhan Laut)</option>
                      <option value="darat">Lintas Darat (Pos Pemeriksaan Lintas Batas)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-fln1994-trips"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jumlah keberangkatan ke luar negeri
                    </label>
                    <input
                      id="pph25-fln1994-trips"
                      type="number"
                      min={1}
                      max={24}
                      step={1}
                      value={calcInput.pph25.bulanBerjalan}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 1 : Math.min(24, Math.max(1, Math.round(raw)));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, bulanBerjalan: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                  </div>
                </>
              ) : regimeId === 'pph25_pmk215_2018_bank_bumn' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-pmk215-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori Wajib Pajak Tertentu (PMK 215/PMK.03/2018)
                    </label>
                    <select
                      id="pph25-pmk215-skema"
                      value={calcInput.pph25.skemaWpTertentu ?? 'bank_ojk'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: {
                            ...prev.pph25,
                            skemaWpTertentu: e.target.value as 'bank_ojk' | 'bumn_bumd_rkap' | 'emiten_berkala',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="bank_ojk">Bank Umum / Syariah (Lapkeu Triwulanan OJK × 4)</option>
                      <option value="bumn_bumd_rkap">BUMN &amp; BUMD (Proyeksi Laba RKAP Setahun)</option>
                      <option value="emiten_berkala">Emiten / Perusahaan Terbuka BEI (Lapkeu Semesteran × 2 — Tarif 19%)</option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pph25-pmk215-laba"
                    label={
                      calcInput.pph25.skemaWpTertentu === 'bumn_bumd_rkap'
                        ? 'Proyeksi Penghasilan Kena Pajak dalam RKAP setahun'
                        : calcInput.pph25.skemaWpTertentu === 'emiten_berkala'
                        ? 'Laba neto fiskal laporan keuangan berkala (1 semester)'
                        : 'Laba neto fiskal laporan keuangan triwulanan OJK (1 triwulan)'
                    }
                    value={calcInput.pph25.labaTriwulanAtauRkap ?? 0}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph25: { ...prev.pph25, labaTriwulanAtauRkap: val },
                      }))
                    }
                  />
                  <CurrencyInput
                    id="pph25-pmk215-kredit"
                    label="Kredit pajak tahun berjalan yang dapat diperhitungkan (PPh 22/23/24)"
                    value={calcInput.pph25.kreditPajakTahunLalu}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph25: { ...prev.pph25, kreditPajakTahunLalu: val },
                      }))
                    }
                  />
                </>
              ) : regimeId === 'pph25_pmk81_2024_wp_baru_transisi' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-wp-baru-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Skenario khusus PPh Pasal 25 (Pasal 25(2) UU PPh &amp; Pasal 10 PMK 215/2018)
                    </label>
                    <select
                      id="pph25-wp-baru-skema"
                      value={calcInput.pph25.skemaWpBaruTransisi ?? 'wp_baru_umum'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: {
                            ...prev.pph25,
                            skemaWpBaruTransisi: e.target.value as NonNullable<
                              TaxCalculatorInput['pph25']['skemaWpBaruTransisi']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="wp_baru_umum">
                        Wajib Pajak Baru Umum non-Bank/BUMN/OPPT (Nihil Rp 0 s.d. SPT Pertama)
                      </option>
                      <option value="masa_sebelum_spt">
                        Masa Pajak Sebelum Batas SPT Tahunan (Jan–Mar ikut angsuran Des tahun lalu)
                      </option>
                      <option value="penggabungan_peleburan">
                        Perusahaan Hasil Penggabungan / Peleburan / Merger (Akumulasi peserta)
                      </option>
                      <option value="wp_baru_oppt">
                        Wajib Pajak Baru OP Pengusaha Tertentu / Gerai Ritel (0,75% omzet bulanan)
                      </option>
                    </select>
                  </div>
                  {(calcInput.pph25.skemaWpBaruTransisi ?? 'wp_baru_umum') === 'masa_sebelum_spt' && (
                    <CurrencyInput
                      id="pph25-transisi-desember"
                      label="Angsuran PPh Pasal 25 Masa Desember tahun pajak sebelumnya"
                      value={calcInput.pph25.pphTerutangTahunLalu}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, pphTerutangTahunLalu: val },
                        }))
                      }
                      helperText="Sesuai Pasal 25 ayat (2) UU PPh, sebelum SPT Tahunan dilaporkan/jatuh tempo, angsuran sama dengan bulan terakhir tahun lalu."
                    />
                  )}
                  {calcInput.pph25.skemaWpBaruTransisi === 'penggabungan_peleburan' && (
                    <>
                      <CurrencyInput
                        id="pph25-merger-a"
                        label="Angsuran PPh Pasal 25 entitas peserta merger 1 (penerima penggabungan)"
                        value={calcInput.pph25.pphTerutangTahunLalu}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph25: { ...prev.pph25, pphTerutangTahunLalu: val },
                          }))
                        }
                      />
                      <CurrencyInput
                        id="pph25-merger-b"
                        label="Angsuran PPh Pasal 25 entitas peserta merger 2 (yang bergabung)"
                        value={calcInput.pph25.kreditPajakTahunLalu}
                        onChange={(val) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph25: { ...prev.pph25, kreditPajakTahunLalu: val },
                          }))
                        }
                      />
                    </>
                  )}
                  {calcInput.pph25.skemaWpBaruTransisi === 'wp_baru_oppt' && (
                    <CurrencyInput
                      id="pph25-baru-oppt"
                      label="Peredaran bruto gerai eceran OPPT baru pada bulan berjalan (0,75%)"
                      value={calcInput.pph25.omzetOpptBulanan ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, omzetOpptBulanan: val },
                        }))
                      }
                    />
                  )}
                  {(calcInput.pph25.skemaWpBaruTransisi ?? 'wp_baru_umum') === 'wp_baru_umum' && (
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/75 bg-[#DFE2DA] dark:bg-[#263336] border border-[#5E706F]/30 px-3 py-2.5">
                      Pasal 10 PMK 215/PMK.03/2018 menetapkan angsuran PPh Pasal 25 bagi Wajib Pajak Baru umum sebesar <strong>Nihil (Rp 0)</strong> hingga tahun pajak pertama berakhir; pajak terutang dibayar sebagai PPh Pasal 29 saat SPT Tahunan.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pph25-terutang"
                    label="PPh terutang menurut SPT Tahunan tahun pajak lalu"
                    value={calcInput.pph25.pphTerutangTahunLalu}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph25: { ...prev.pph25, pphTerutangTahunLalu: val },
                      }))
                    }
                    helperText="Hanya atas penghasilan teratur non-final dari SPT Tahunan tahun sebelumnya."
                  />
                  <CurrencyInput
                    id="pph25-kredit"
                    label="Kredit pajak tahun lalu (PPh 21, 22, 23, dan 24)"
                    value={calcInput.pph25.kreditPajakTahunLalu}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph25: { ...prev.pph25, kreditPajakTahunLalu: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph25-bulan"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Pembagi jumlah bulan dalam tahun pajak lalu (1–12)
                    </label>
                    <input
                      id="pph25-bulan"
                      type="number"
                      min={1}
                      max={12}
                      step={1}
                      value={calcInput.pph25.bulanBerjalan}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 12 : Math.min(12, Math.max(1, Math.round(raw)));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, bulanBerjalan: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                  </div>
                  {regimeId === 'pph25_pmk23_2020' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph25-diskon-pandemi"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Besaran pengurangan angsuran PPh 25 pandemi 2020
                      </label>
                      <select
                        id="pph25-diskon-pandemi"
                        value={calcInput.pph25.diskonPandemiPersen ?? 30}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pph25: {
                              ...prev.pph25,
                              diskonPandemiPersen: Number(e.target.value) === 50 ? 50 : 30,
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value={30}>30% — PMK 23/2020, PMK 44/2020 &amp; PMK 86/2020 (Apr–Jul 2020)</option>
                        <option value={50}>50% — PMK 110/2020 (Ags–Des 2020)</option>
                      </select>
                    </div>
                  )}
                  {regimeId === 'pph25_kep537_2000' && (
                    <>
                      <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(calcInput.pph25.isKondisiTurun25)}
                          onChange={(e) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pph25: { ...prev.pph25, isKondisiTurun25: e.target.checked },
                            }))
                          }
                          className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                        />
                        <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                          Ajukan pengurangan angsuran (proyeksi PPh tahun berjalan &lt; 75% dasar tahun lalu setelah 3 bulan — Pasal 7 KEP-537/PJ./2000)
                        </span>
                      </label>
                      {calcInput.pph25.isKondisiTurun25 && (
                        <CurrencyInput
                          id="pph25-estimasi-baru"
                          label="Estimasi PPh dibayar sendiri (neto setelah kredit) tahun berjalan"
                          value={calcInput.pph25.estimasiPphSetahunBaru ?? 0}
                          onChange={(val) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pph25: { ...prev.pph25, estimasiPphSetahunBaru: val },
                            }))
                          }
                          helperText="Harus lebih rendah dari 75% dasar tahun lalu agar permohonan pengurangan angsuran dikabulkan KPP."
                        />
                      )}
                    </>
                  )}
                  {regimeId === 'pph25_kep537_2000_tidak_teratur' && (
                    <CurrencyInput
                      id="pph25-tidak-teratur"
                      label="Penghasilan neto tidak teratur dalam SPT tahun lalu (Pasal 3 KEP-537/PJ./2000)"
                      value={calcInput.pph25.penghasilanTidakTeraturNeto ?? 0}
                      onChange={(val) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph25: { ...prev.pph25, penghasilanTidakTeraturNeto: val },
                        }))
                      }
                      helperText="Misalnya laba penjualan aktiva tetap / kapital gain insidental yang dikecualikan dari dasar angsuran PPh 25 tahun berjalan (estimasi porsi pajak 22%)."
                    />
                  )}
                </>
              ))}

            {activeTaxType === 'pph26' &&
              (regimeId === 'pph26_pmk35_2019_but' ? (
                <>
                  <CurrencyInput
                    id="pph26-but-nilai"
                    label="Nilai kontrak penyerahan jasa WPLN di Indonesia (Rp)"
                    value={calcInput.pph26.nilaiPenyerahanJasaBut ?? calcInput.pph26.nilaiBruto}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph26: { ...prev.pph26, nilaiPenyerahanJasaBut: val, nilaiBruto: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph26-but-hari"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Durasi pemberian jasa di Indonesia dalam 12 bulan (hari)
                    </label>
                    <input
                      id="pph26-but-hari"
                      type="number"
                      min={0}
                      max={365}
                      step={1}
                      value={calcInput.pph26.hariDiIndonesia ?? 75}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 0 : Math.min(365, Math.max(0, Math.round(raw)));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: { ...prev.pph26, hariDiIndonesia: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                    <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      Ambang time test jasa PMK 35/PMK.03/2019 = 60 hari dalam 12 bulan; di atas 60 hari memicu status BUT (PPh Badan 22% neto + BPT).
                    </p>
                  </div>
                  <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={calcInput.pph26.hasSkdP3b}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: { ...prev.pph26, hasSkdP3b: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki SKD / Form DGT sah untuk tarif P3B (Tax Treaty)
                    </span>
                  </label>
                  {calcInput.pph26.hasSkdP3b && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pph26-but-p3b-rate"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Tarif Branch Profit Tax P3B jika menjadi BUT (%)
                      </label>
                      <input
                        id="pph26-but-p3b-rate"
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={calcInput.pph26.tarifP3bPersen}
                        onChange={(e) => {
                          const raw = Number(e.target.value);
                          const clamped = Number.isNaN(raw) ? 0 : Math.min(20, Math.max(0, raw));
                          onChangeInput((prev) => ({
                            ...prev,
                            pph26: { ...prev.pph26, tarifP3bPersen: clamped },
                          }));
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      />
                    </div>
                  )}
                </>
              ) : (
              <>
                <CurrencyInput
                  id="pph26-bruto"
                  label={
                    regimeId === 'pph26_pmk14_2011_bpt'
                      ? 'PKP BUT sesudah dikurangi PPh Badan (dasar Branch Profit Tax)'
                      : regimeId === 'pph26_pmk258_2008_saham'
                        ? 'Nilai pengalihan / penjualan saham SPC Pasal 18 ayat (3c)'
                        : regimeId === 'pph26_pmk82_2009_harta'
                          ? 'Harga jual / nilai pengalihan harta di Indonesia oleh WPLN (Rp)'
                          : regimeId === 'pph26_kmk624_1994_asuransi'
                            ? 'Jumlah premi asuransi / reasuransi bruto dibayar ke luar negeri (Rp)'
                            : 'Nilai bruto penghasilan dibayar ke WPLN'
                  }
                  value={calcInput.pph26.nilaiBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph26: { ...prev.pph26, nilaiBruto: val },
                    }))
                  }
                />
                {regimeId === 'pph26_kmk624_1994_asuransi' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph26-asuransi-624"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Pihak pembayar premi asuransi/reasuransi ke luar negeri (KMK 624/KMK.04/1994)
                    </label>
                    <select
                      id="pph26-asuransi-624"
                      value={calcInput.pph26.skemaAsuransi624 ?? 'tertanggung_ri_10'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: {
                            ...prev.pph26,
                            skemaAsuransi624: e.target.value as NonNullable<
                              TaxCalculatorInput['pph26']['skemaAsuransi624']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="tertanggung_ri_10">
                        Tertanggung di Indonesia bayar langsung ke asuransi LN (Neto 50% -&gt; 10% efektif)
                      </option>
                      <option value="perusahaan_asuransi_ri_2">
                        Perusahaan Asuransi di Indonesia bayar ke asuransi/reasuransi LN (Neto 10% -&gt; 2% efektif)
                      </option>
                      <option value="perusahaan_reasuransi_ri_1">
                        Perusahaan Reasuransi di Indonesia bayar ke reasuransi LN (Neto 5% -&gt; 1% efektif)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'pph26_pmk112_2025_p3b' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph26-pmk112-uji"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Hasil uji substansi Beneficial Owner &amp; Principal Purpose Test (PMK 112/2025)
                    </label>
                    <select
                      id="pph26-pmk112-uji"
                      value={calcInput.pph26.skemaButPpt ?? 'beneficial_owner_valid'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: {
                            ...prev.pph26,
                            skemaButPpt: e.target.value as NonNullable<
                              TaxCalculatorInput['pph26']['skemaButPpt']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="beneficial_owner_valid">
                        Lolos Uji Beneficial Owner (BO) &amp; PPT — Berhak Tarif Preferensial P3B
                      </option>
                      <option value="conduit_gagal_bo">
                        Terindikasi Conduit / Gagal Uji Beneficial Owner (P3B Gugur -&gt; 20%)
                      </option>
                      <option value="ppt_fragmentasi_ditolak">
                        Gagal Principal Purpose Test / Anti-Fragmentasi (P3B Gugur -&gt; 20%)
                      </option>
                    </select>
                  </div>
                )}
                {![
                  'pph26_pmk14_2011_bpt',
                  'pph26_pmk258_2008_saham',
                  'pph26_pmk82_2009_harta',
                  'pph26_kmk624_1994_asuransi',
                  'pph26_pbdr_1970',
                ].includes(regimeId) && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph26-object"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis penghasilan Wajib Pajak Luar Negeri
                    </label>
                    <select
                      id="pph26-object"
                      value={calcInput.pph26.objectType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: { ...prev.pph26, objectType: e.target.value as Pph26ObjectType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH26_OBJECTS.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {regimeId === 'pph26_pmk14_2011_bpt' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph26.isBptReinvested)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: { ...prev.pph26, isBptReinvested: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Seluruh laba sesudah pajak BUT ditanamkan kembali di Indonesia (Pengecualian 0% PMK 14/2011)
                    </span>
                  </label>
                )}
                <label className="flex items-center gap-3 min-h-[44px] cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                  <input
                    type="checkbox"
                    checked={calcInput.pph26.hasSkdP3b}
                    onChange={(e) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pph26: { ...prev.pph26, hasSkdP3b: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                  />
                  <span className="text-sm text-[#1F2A2C] dark:text-[#E8EAE4]">
                    Memiliki SKD / Form DGT sah untuk tarif P3B (Tax Treaty)
                  </span>
                </label>
                {calcInput.pph26.hasSkdP3b && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph26-p3b-rate"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Tarif preferensial P3B / Tax Treaty (%)
                    </label>
                    <input
                      id="pph26-p3b-rate"
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={calcInput.pph26.tarifP3bPersen}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isNaN(raw) ? 0 : Math.min(20, Math.max(0, raw));
                        onChangeInput((prev) => ({
                          ...prev,
                          pph26: { ...prev.pph26, tarifP3bPersen: clamped },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    />
                  </div>
                )}
              </>
              ))}

            {activeTaxType === 'pph15' && (
              <>
                <CurrencyInput
                  id="pph15-bruto"
                  label={
                    regimeId === 'pph15_kmk634_1994_kpd'
                      ? 'Nilai ekspor bruto dari negara Indonesia (dasar 0,44% Final KPD)'
                      : regimeId === 'pph15_kmk543_2002_maklon'
                        ? 'Total biaya pembuatan / perakitan non-bahan baku (dasar 2,1% Final)'
                        : regimeId === 'pph15_kmk628_1991_migas'
                          ? 'Peredaran bruto kontrak pengeboran migas BUT asing (Rp)'
                          : 'Peredaran bruto jasa pengangkutan / charter (non-PPN)'
                  }
                  value={calcInput.pph15.peredaranBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph15: { ...prev.pph15, peredaranBruto: val },
                    }))
                  }
                />
                {![
                  'pph15_kmk634_1994_kpd',
                  'pph15_kmk543_2002_maklon',
                  'pph15_kmk628_1991_migas',
                  'pph15_pmk112_2025_resiprokal',
                ].includes(regimeId) && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pph15-sector"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor norma penghitungan khusus Pasal 15
                    </label>
                    <select
                      id="pph15-sector"
                      value={calcInput.pph15.sectorType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph15: { ...prev.pph15, sectorType: e.target.value as Pph15SectorType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PPH15_SECTORS.map((sec) => (
                        <option key={sec.value} value={sec.value}>
                          {sec.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {regimeId === 'pph15_pmk112_2025_resiprokal' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.pph15.hasSkdP3bArticle8)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pph15: { ...prev.pph15, hasSkdP3bArticle8: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki SKD valid &amp; memenuhi asas resiprokal Article 8 P3B / PMK 112/2025 (Dibebaskan 0%, tanpa SKD 2,64% Final)
                    </span>
                  </label>
                )}
              </>
            )}

            {activeTaxType === 'ppnbm' && (
              <>
                <CurrencyInput
                  id="ppnbm-harga"
                  label="Harga jual penyerahan pabrikan / nilai impor (sebelum pajak)"
                  value={calcInput.ppnbm.hargaJual}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      ppnbm: { ...prev.ppnbm, hargaJual: val },
                    }))
                  }
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor="ppnbm-category"
                    className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                  >
                    Kelompok barang tergolong mewah
                  </label>
                  <select
                    id="ppnbm-category"
                    value={calcInput.ppnbm.categoryType}
                    onChange={(e) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        ppnbm: {
                          ...prev.ppnbm,
                          categoryType: e.target.value as PpnbmCategoryType,
                        },
                      }))
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                  >
                    {PPNBM_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                {regimeId === 'ppnbm_pmk20_2021_dtp' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ppnbm-dtp-discount"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Persentase insentif PPnBM DTP (PMK 20/2021 – PMK 5/2022)
                    </label>
                    <select
                      id="ppnbm-dtp-discount"
                      value={calcInput.ppnbm.dtpDiscountPersen ?? 100}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        const clean = v === 25 ? 25 : v === 50 ? 50 : 100;
                        onChangeInput((prev) => ({
                          ...prev,
                          ppnbm: { ...prev.ppnbm, dtpDiscountPersen: clean },
                        }));
                      }}
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value={100}>100% Ditanggung Pemerintah (Mar–Ags 2021 &amp; LCGC Q1 2022)</option>
                      <option value={50}>50% Ditanggung Pemerintah (Tahap Penurunan II)</option>
                      <option value={25}>25% Ditanggung Pemerintah (2.500 cc / Tahap III)</option>
                    </select>
                  </div>
                )}
                {regimeId === 'ppnbm_pmk141_2021_pembebasan' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.ppnbm.isPembebasanPmk141)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          ppnbm: { ...prev.ppnbm, isPembebasanPmk141: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Memiliki Surat Keterangan Bebas (SKB) PPnBM — Ambulans, Jenazah, Damkar, Angkutan Umum, atau TNI/Polri (PMK 141/2021 — 0%)
                    </span>
                  </label>
                )}
              </>
            )}

            {activeTaxType === 'pbjt' &&
              (regimeId === 'pbjt_hkpd_opsen' ? (
                <>
                  <CurrencyInput
                    id="pbjt-opsen-pokok"
                    label="Pokok PKB atau BBNKB terutang provinsi (Rp — bukan harga jual kendaraan)"
                    value={calcInput.pbjt.nilaiTransaksi}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pbjt: { ...prev.pbjt, nilaiTransaksi: val },
                      }))
                    }
                    helperText="Mulai 5 Januari 2025, Kabupaten/Kota memungut langsung Opsen sebesar 66% atas pokok PKB/BBNKB terutang Provinsi (Pasal 83–84 UU HKPD)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbjt-opsen-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis Opsen Pajak Daerah (UU HKPD)
                    </label>
                    <select
                      id="pbjt-opsen-jenis"
                      value={calcInput.pbjt.jenisOpsenHkpd ?? 'opsen_pkb_66'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbjt: {
                            ...prev.pbjt,
                            jenisOpsenHkpd: e.target.value as 'opsen_pkb_66' | 'opsen_bbnkb_66',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="opsen_pkb_66">
                        Opsen Pajak Kendaraan Bermotor / PKB (66% dari Pokok PKB Provinsi)
                      </option>
                      <option value="opsen_bbnkb_66">
                        Opsen Bea Balik Nama Kendaraan Bermotor / BBNKB (66% dari Pokok BBNKB)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pbjt_hkpd_daerah_lain' ? (
                <>
                  <CurrencyInput
                    id="pbjt-daerah-lain-dpp"
                    label="Dasar Pengenaan Pajak Daerah (NSR / NJAB / NPA / Nilai Jual MBLB)"
                    value={calcInput.pbjt.nilaiTransaksi}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pbjt: { ...prev.pbjt, nilaiTransaksi: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbjt-daerah-lain-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis Pajak Daerah non-PBJT (UU HKPD jo. PP 35/2023)
                    </label>
                    <select
                      id="pbjt-daerah-lain-jenis"
                      value={calcInput.pbjt.jenisPajakDaerahLain ?? 'reklame_25'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbjt: {
                            ...prev.pbjt,
                            jenisPajakDaerahLain: e.target.value as NonNullable<
                              TaxCalculatorInput['pbjt']['jenisPajakDaerahLain']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="reklame_25">
                        Pajak Reklame (Plafon maksimal 25% Nilai Sewa Reklame)
                      </option>
                      <option value="air_tanah_20">
                        Pajak Air Tanah / PAT (Plafon maksimal 20% Nilai Perolehan Air)
                      </option>
                      <option value="minerba_mblb_20">
                        Pajak MBLB / Galian C (Plafon maksimal 20% + Opsen Provinsi 25%)
                      </option>
                      <option value="pab_alat_berat_0_2">
                        Pajak Alat Berat / PAB Provinsi (Plafon maksimal 0,2% NJAB)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pbjt_hkpd_provinsi_ototarif' ? (
                <>
                  <CurrencyInput
                    id="pbjt-provinsi-dasar"
                    label={
                      calcInput.pbjt.jenisPajakProvinsiHkpd === 'pbbkb_10'
                        ? 'Nilai jual bahan bakar kendaraan bermotor (sebelum PPN)'
                        : calcInput.pbjt.jenisPajakProvinsiHkpd === 'rokok_10'
                          ? 'Besaran cukai rokok terutang'
                          : 'Nilai Jual Kendaraan Bermotor / NJKB (Rp)'
                    }
                    value={calcInput.pbjt.nilaiTransaksi}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pbjt: { ...prev.pbjt, nilaiTransaksi: val },
                      }))
                    }
                    helperText="UU HKPD (berlaku 5 Januari 2025) menurunkan tarif pokok non-DKI (PKB 1,2%, BBNKB baru 12%) untuk ditambah Opsen Kab/Kota 66%, dan menghapus BBNKB kendaraan bekas (0%)."
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbjt-provinsi-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis Pajak Provinsi (Pasal 7–34 UU HKPD jo. PP 35/2023)
                    </label>
                    <select
                      id="pbjt-provinsi-jenis"
                      value={calcInput.pbjt.jenisPajakProvinsiHkpd ?? 'pkb_non_dki'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbjt: {
                            ...prev.pbjt,
                            jenisPajakProvinsiHkpd: e.target.value as NonNullable<
                              TaxCalculatorInput['pbjt']['jenisPajakProvinsiHkpd']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pkb_non_dki">
                        PKB Kepemilikan Ke-1 Non-DKI (Pokok 1,2% + Opsen 66% = 1,992%)
                      </option>
                      <option value="pkb_dki">
                        PKB Kepemilikan Ke-1 DK Jakarta (Maks 2%, tanpa Opsen)
                      </option>
                      <option value="bbnkb_non_dki">
                        BBNKB Kendaraan Baru Non-DKI (Pokok 12% + Opsen 66% = 19,92%; Bekas 0%)
                      </option>
                      <option value="bbnkb_dki">
                        BBNKB Kendaraan Baru DK Jakarta (Maks 20%, tanpa Opsen; Bekas 0%)
                      </option>
                      <option value="pbbkb_10">
                        Pajak Bahan Bakar Kendaraan Bermotor / PBBKB (Plafon maks 10%)
                      </option>
                      <option value="rokok_10">
                        Pajak Rokok Nasional (Tarif seragam 10% dari cukai rokok)
                      </option>
                    </select>
                  </div>
                </>
              ) : regimeId === 'pbjt_hkpd_pkb_progresif_opsen_mblb' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbjt-progresif-skema"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis objek tarif progresif / Opsen HKPD (Pasal 10 &amp; 83 UU 1/2022)
                    </label>
                    <select
                      id="pbjt-progresif-skema"
                      value={calcInput.pbjt.skemaProgresifMblb ?? 'pkb_progresif_non_dki'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbjt: {
                            ...prev.pbjt,
                            skemaProgresifMblb: e.target.value as NonNullable<
                              TaxCalculatorInput['pbjt']['skemaProgresifMblb']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="pkb_progresif_non_dki">
                        PKB Progresif Provinsi Non-DKI (Plafon maks 6% + Opsen 66%)
                      </option>
                      <option value="pkb_progresif_dki">
                        PKB Progresif Provinsi Khusus / DKI Jakarta (2%–6% Tanpa Opsen)
                      </option>
                      <option value="opsen_mblb_25">
                        Pajak MBLB Kab/Kota (maks 20%) + Opsen MBLB Provinsi (25% Pokok = 25% total)
                      </option>
                    </select>
                  </div>
                  <CurrencyInput
                    id="pbjt-progresif-nilai"
                    label={
                      calcInput.pbjt.skemaProgresifMblb === 'opsen_mblb_25'
                        ? 'Nilai jual hasil pertambangan MBLB'
                        : 'Nilai Jual Kendaraan Bermotor (NJKB x koefisien bobot)'
                    }
                    value={calcInput.pbjt.nilaiTransaksi}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pbjt: { ...prev.pbjt, nilaiTransaksi: val },
                      }))
                    }
                  />
                  {calcInput.pbjt.skemaProgresifMblb !== 'opsen_mblb_25' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pbjt-pkb-urutan"
                        className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                      >
                        Urutan kepemilikan kendaraan bermotor pribadi
                      </label>
                      <select
                        id="pbjt-pkb-urutan"
                        value={calcInput.pbjt.tingkatKepemilikanPkb ?? 2}
                        onChange={(e) =>
                          onChangeInput((prev) => ({
                            ...prev,
                            pbjt: {
                              ...prev.pbjt,
                              tingkatKepemilikanPkb: (Number(e.target.value) as 1 | 2 | 3 | 4 | 5) || 2,
                            },
                          }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                      >
                        <option value={1}>Kepemilikan ke-1 (1,2% Non-DKI / 2% DKI)</option>
                        <option value={2}>Kepemilikan ke-2 (2,0% Non-DKI / 3% DKI)</option>
                        <option value={3}>Kepemilikan ke-3 (3,0% Non-DKI / 4% DKI)</option>
                        <option value={4}>Kepemilikan ke-4 (4,0% Non-DKI / 5% DKI)</option>
                        <option value={5}>Kepemilikan ke-5+ (5,0% Non-DKI / 6% plafon maks DKI)</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="pbjt-transaksi"
                    label="Nilai transaksi / pembayaran konsumen (sebelum pajak daerah)"
                    value={calcInput.pbjt.nilaiTransaksi}
                    onChange={(val) =>
                      onChangeInput((prev) => ({
                        ...prev,
                        pbjt: { ...prev.pbjt, nilaiTransaksi: val },
                      }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pbjt-sector"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Sektor barang &amp; jasa tertentu (PBJT)
                    </label>
                    <select
                      id="pbjt-sector"
                      value={calcInput.pbjt.sectorType}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          pbjt: { ...prev.pbjt, sectorType: e.target.value as PbjtSectorType },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      {PBJT_SECTORS.map((sec) => (
                        <option key={sec.value} value={sec.value}>
                          {sec.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {calcInput.pbjt.sectorType === 'tenaga_listrik' &&
                    ['pbjt_hkpd_2022', 'pbjt_pp35_2023_daerah', 'pbjt_pdrd_2009'].includes(regimeId) && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="pbjt-listrik-skema"
                          className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                        >
                          Kelompok pengguna tenaga listrik (Pasal 58 UU HKPD / UU PDRD)
                        </label>
                        <select
                          id="pbjt-listrik-skema"
                          value={calcInput.pbjt.listrikSkema ?? 'umum_10'}
                          onChange={(e) =>
                            onChangeInput((prev) => ({
                              ...prev,
                              pbjt: {
                                ...prev.pbjt,
                                listrikSkema: e.target.value as 'umum_10' | 'industri_migas_3' | 'sendiri_1_5',
                              },
                            }))
                          }
                          className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                        >
                          <option value="umum_10">Konsumsi umum / rumah tangga / komersial (maks. 10%)</option>
                          <option value="industri_migas_3">Industri, pertambangan minyak &amp; gas bumi (maks. 3%)</option>
                          <option value="sendiri_1_5">Tenaga listrik dihasilkan sendiri / captive power (maks. 1,5%)</option>
                        </select>
                      </div>
                    )}
                </>
              ))}

            {activeTaxType === 'bea_meterai' && (
              <>
                <CurrencyInput
                  id="meterai-nominal"
                  label="Nilai nominal uang yang tercantum dalam dokumen"
                  value={calcInput.bea_meterai.nilaiDokumen}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      bea_meterai: { ...prev.bea_meterai, nilaiDokumen: val },
                    }))
                  }
                  helperText="UU 10/2020 menetapkan batas bebas di bawah atau sama dengan Rp 5.000.000; PP 24/2000 memiliki lapis Rp 250 ribu & Rp 1 juta."
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor="meterai-jumlah"
                    className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                  >
                    Jumlah rangkap / dokumen asli yang ditandatangani
                  </label>
                  <input
                    id="meterai-jumlah"
                    type="number"
                    min={0}
                    step={1}
                    value={calcInput.bea_meterai.jumlahDokumen}
                    onChange={(e) => {
                      const raw = Number(e.target.value);
                      const clean = Number.isNaN(raw) ? 0 : Math.max(0, Math.round(raw));
                      onChangeInput((prev) => ({
                        ...prev,
                        bea_meterai: { ...prev.bea_meterai, jumlahDokumen: clean },
                      }));
                    }}
                    className="w-full min-h-[44px] px-3 py-2 text-base tabular-nums bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                  />
                </div>
                {regimeId === 'meterai_pmk78_2024' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.bea_meterai.isPemeteraianKemudian)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bea_meterai: { ...prev.bea_meterai, isPemeteraianKemudian: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Pemeteraian Kemudian (+sanksi administratif 100% menjadi Rp 20.000 per dokumen — PMK 78/2024)
                    </span>
                  </label>
                )}
                {regimeId === 'meterai_pp3_2022' && (
                  <label className="flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(calcInput.bea_meterai.isBebasMeteraiPp3)}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bea_meterai: { ...prev.bea_meterai, isBebasMeteraiPp3: e.target.checked },
                        }))
                      }
                      className="w-5 h-5 mt-0.5 shrink-0 accent-[#1F2A2C] dark:accent-[#D9B92E]"
                    />
                    <span className="text-sm leading-snug text-[#1F2A2C] dark:text-[#E8EAE4]">
                      Dokumen memenuhi kriteria fasilitas pembebasan Bea Meterai (PP 3/2022 — Tarif Rp 0)
                    </span>
                  </label>
                )}
                {regimeId === 'meterai_pmk134_2021_transisi' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="meterai-transisi-jenis"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Skema masa transisi Bea Meterai (2021–2024)
                    </label>
                    <select
                      id="meterai-transisi-jenis"
                      value={calcInput.bea_meterai.jenisTransisiMeterai ?? 'transisi_3000_6000_9000'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bea_meterai: {
                            ...prev.bea_meterai,
                            jenisTransisiMeterai: e.target.value as
                              | 'transisi_3000_6000_9000'
                              | 'pemungut_emeterai_pmk151',
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="transisi_3000_6000_9000">
                        Masa Transisi 2021 — Kombinasi Meterai Lama Rp 3.000 + Rp 6.000 (Min. Rp 9.000/dok)
                      </option>
                      <option value="pemungut_emeterai_pmk151">
                        Pemungut Bea Meterai / e-Meterai Kolektif PMK 151/2021 (Rp 10.000/dok)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'meterai_uu10_2020_pemungut_nonobjek' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="meterai-pemungut-nonobjek"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Kategori dokumen / Pemungut (Pasal 7 UU 10/2020 &amp; PMK 78/2024)
                    </label>
                    <select
                      id="meterai-pemungut-nonobjek"
                      value={calcInput.bea_meterai.skemaPemungutNonObjek ?? 'non_objek_pasal7'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bea_meterai: {
                            ...prev.bea_meterai,
                            skemaPemungutNonObjek: e.target.value as NonNullable<
                              TaxCalculatorInput['bea_meterai']['skemaPemungutNonObjek']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="non_objek_pasal7">
                        Bukan Objek Pasal 7 UU 10/2020 (Slip gaji, ijazah, B/L, intern, rekening koran — Rp 0)
                      </option>
                      <option value="pemungut_1000_pmk78">
                        Pemungut Bea Meterai PMK 78/2024 (Cek/BG atau &gt;1.000 dokumen/bln — Rp 10.000/dok)
                      </option>
                      <option value="nominal_sd_5jt">
                        Uji nominal dokumen pernyataan uang (&le; Rp 5 jt bebas Rp 0, &gt; Rp 5 jt = Rp 10.000)
                      </option>
                    </select>
                  </div>
                )}
                {regimeId === 'meterai_uu10_2020_non_nominal' && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="meterai-non-nominal"
                      className="block text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4]"
                    >
                      Jenis dokumen non-nominal &amp; alat bukti (Pasal 3(1)–(2) UU 10/2020)
                    </label>
                    <select
                      id="meterai-non-nominal"
                      value={calcInput.bea_meterai.jenisDokumenNonNominal ?? 'perjanjian_akta_notaris'}
                      onChange={(e) =>
                        onChangeInput((prev) => ({
                          ...prev,
                          bea_meterai: {
                            ...prev.bea_meterai,
                            jenisDokumenNonNominal: e.target.value as NonNullable<
                              TaxCalculatorInput['bea_meterai']['jenisDokumenNonNominal']
                            >,
                          },
                        }))
                      }
                      className="w-full min-h-[44px] px-3 py-2 text-base bg-[#DFE2DA] dark:bg-[#263336] text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 focus:border-[#1F2A2C] dark:focus:border-[#D9B92E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
                    >
                      <option value="perjanjian_akta_notaris">
                        Surat Perjanjian (MOU/PKWT), Akta Notaris/PPAT &amp; Risalah Lelang (Rp 10.000/dok)
                      </option>
                      <option value="surat_keterangan_pernyataan">
                        Surat Keterangan, Surat Pernyataan, atau Surat Kuasa Non-Nominal (Rp 10.000/dok)
                      </option>
                      <option value="alat_bukti_pengadilan">
                        Dokumen Biasa Dijadikan Alat Bukti di Pengadilan (Pemeteraian Kemudian Rp 10.000/dok)
                      </option>
                      <option value="surat_biasa_non_perdata">
                        Surat Biasa Non-Perdata / Kuitansi &le; Rp 5 Jt Bukan Alat Bukti Pengadilan (Rp 0)
                      </option>
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Utility Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetToZero}
                className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#1F2A2C] dark:text-[#E8EAE4] border border-[#5E706F]/45 hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] active:border-[#D9B92E] inline-flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Reset ke Rp 0</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Single Rule Result Surface & Step-by-Step Ledger */}
        <div className="lg:col-span-7 space-y-6">
          {/* Single-Regime Result Facet */}
          <div className="bg-[#DFE2DA] dark:bg-[#263336] border border-[#5E706F]/35 p-5 sm:p-6 space-y-4 facet-cut">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#6B5A00] dark:text-[#D9B92E]">
                {result.regime.name}
              </span>
              <span
                className={`text-xs font-semibold ${
                  result.regime.isCurrent
                    ? 'text-[#2F7048] dark:text-[#4E9A6B]'
                    : 'text-[#4F6160] dark:text-[#E8EAE4]/75'
                }`}
              >
                {result.regime.isCurrent
                  ? (result.regime.currentScopeLabel ?? 'Aturan berlaku saat ini')
                  : 'Aturan historis'}
              </span>
            </div>

            <div>
              <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/75">
                {result.primaryTaxLabel}
              </p>
              <p
                className={`font-bold tabular-nums tracking-tight mt-1 ${
                  result.isNotCalculated
                    ? 'text-xl sm:text-2xl text-[#A8530E] dark:text-[#D9772B]'
                    : 'text-3xl sm:text-4xl text-[#1F2A2C] dark:text-[#E8EAE4]'
                }`}
              >
                {result.isNotCalculated && result.primaryTaxDisplay
                  ? result.primaryTaxDisplay
                  : formatRupiah(result.primaryTaxAmount)}
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-4 border-t border-[#5E706F]/25 text-sm">
              {result.annualTaxLabel && result.annualTaxAmount !== undefined && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">{result.annualTaxLabel}</dt>
                  <dd className="font-semibold tabular-nums whitespace-nowrap shrink-0 text-[#1F2A2C] dark:text-[#E8EAE4]">
                    {formatRupiah(result.annualTaxAmount)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">
                  {result.effectiveRateLabel ?? 'Tarif pajak efektif'}
                </dt>
                <dd className="font-semibold tabular-nums whitespace-nowrap shrink-0 text-[#1F2A2C] dark:text-[#E8EAE4]">
                  {result.isNotCalculated ? 'Tidak dihitung' : formatPersen(result.effectiveRatePercent)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">
                  {result.takeHomeOrNetLabel}
                </dt>
                <dd className="font-semibold tabular-nums whitespace-nowrap shrink-0 text-[#1F2A2C] dark:text-[#E8EAE4]">
                  {result.takeHomeOrNetDisplay ?? formatRupiah(result.takeHomeOrNetAmount)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Statutory Notes */}
          {result.notes.length > 0 && (
            <div className="space-y-2.5">
              {result.notes.map((note, idx) => {
                const isWarn = note.startsWith('Peringatan');
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-sm">
                    {isWarn ? (
                      <AlertTriangle
                        className="w-4 h-4 text-[#A8530E] dark:text-[#D9772B] shrink-0 mt-1"
                        aria-hidden="true"
                      />
                    ) : (
                      <Info
                        className="w-4 h-4 text-[#4F6160] dark:text-[#E8EAE4]/75 shrink-0 mt-1"
                        aria-hidden="true"
                      />
                    )}
                    <p
                      className={
                        isWarn
                          ? 'text-[#A8530E] dark:text-[#D9772B] font-medium'
                          : 'text-[#4F6160] dark:text-[#E8EAE4]/85'
                      }
                    >
                      {note}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step-by-Step Calculation Ledger Table directly on surface */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDetailedSteps((s) => !s)}
              aria-expanded={showDetailedSteps}
              className="w-full min-h-[44px] py-2.5 flex items-center justify-between border-b border-[#5E706F]/35 text-sm font-semibold text-[#1F2A2C] dark:text-[#E8EAE4] hover:text-[#6B5A00] dark:hover:text-[#D9B92E] active:text-[#6B5A00] dark:active:text-[#D9B92E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B92E]"
            >
              <span>Rincian Kertas Kerja Perhitungan</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F6160] dark:text-[#E8EAE4]/75">
                <span>{showDetailedSteps ? 'Tutup rincian' : 'Buka rincian'}</span>
                {showDetailedSteps ? (
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                )}
              </span>
            </button>

            {showDetailedSteps && (
              <div className="pt-4 overflow-x-auto table-scroll">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#5E706F]/35 text-xs text-[#4F6160] dark:text-[#E8EAE4]/70">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Komponen Perhitungan
                      </th>
                      <th scope="col" className="py-2 px-3 font-medium hidden sm:table-cell">
                        Dasar / Rumus
                      </th>
                      <th scope="col" className="py-2 pl-3 font-medium text-right whitespace-nowrap">
                        Nilai
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((step, index) => (
                      <tr
                        key={index}
                        className={`border-b border-[#5E706F]/20 ${
                          step.isHighlight ? 'bg-[#DFE2DA]/70 dark:bg-[#263336]/80 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 pr-4 text-[#1F2A2C] dark:text-[#E8EAE4]">
                          <div>{step.label}</div>
                          {step.formula && (
                            <div className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/65 sm:hidden mt-0.5">
                              {step.formula}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-[#4F6160] dark:text-[#E8EAE4]/75 hidden sm:table-cell">
                          {step.formula ?? '—'}
                        </td>
                        <td
                          className={`py-2.5 pl-3 text-right tabular-nums whitespace-nowrap ${
                            step.isNegative
                              ? 'text-[#4F6160] dark:text-[#E8EAE4]/80'
                              : 'text-[#1F2A2C] dark:text-[#E8EAE4]'
                          }`}
                        >
                          {step.format === 'text' && step.displayValue
                            ? step.displayValue
                            : step.format === 'percent'
                              ? formatPersen(step.value)
                              : formatRupiah(step.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
