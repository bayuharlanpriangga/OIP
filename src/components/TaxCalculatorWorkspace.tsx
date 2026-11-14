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
    <section id="kalkulator" aria-labelledby="heading-kalkulator" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="pb-5 border-b border-[#5E706F]/25 space-y-1.5 max-w-2xl">
        <h1
          id="heading-kalkulator"
          className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F2A2C] dark:text-[#E8EAE4]"
        >
          Kalkulator Pajak Multi-Aturan
        </h1>
        <p className="text-sm sm:text-base text-[#4F6160] dark:text-[#E8EAE4]/75 leading-relaxed">
          Pilih jenis pajak lalu tentukan aturan yang berlaku saat ini atau aturan periode
          terdahulu untuk mensimulasikan perhitungannya.
        </p>
      </div>

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
            {activeTaxType === 'pph21' && (
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
                </div>
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
            )}

            {activeTaxType === 'pph23' && (
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
                    Penerima penghasilan memiliki NPWP (hindari sanksi +100%)
                  </span>
                </label>
              </>
            )}

            {activeTaxType === 'pph_umkm' && (
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
                    <option value="badan_usaha">Wajib Pajak Badan (PT / CV / Firma / Koperasi)</option>
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
                  helperText="Digunakan PP 55/2022 untuk menghitung sisa kuota bebas pajak Rp 500 juta bagi Orang Pribadi."
                />
              </>
            )}

            {activeTaxType === 'pph_badan' && (
              <>
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
                  helperText="Menentukan fasilitas diskon 50% Pasal 31E (berlaku untuk omzet s.d. Rp 50 miliar)."
                />
                <CurrencyInput
                  id="badan-pkp"
                  label="Penghasilan Kena Pajak (laba fiskal setahun)"
                  value={calcInput.pph_badan.penghasilanKenaPajak}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph_badan: { ...prev.pph_badan, penghasilanKenaPajak: val },
                    }))
                  }
                />
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
              </>
            )}

            {activeTaxType === 'ppn' && (
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
            )}

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
                {regimeId !== 'pbb_uu12_1994' && (
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
                        {regimeId === 'pbb_hkpd_2022'
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
                          {regimeId === 'pbb_hkpd_2022'
                            ? 'NJKP 20% (tarif efektif 0,10%)'
                            : 'Lapisan bawah (tarif 0,10%)'}
                        </option>
                        <option value="menengah">
                          {regimeId === 'pbb_hkpd_2022'
                            ? 'NJKP 40% (tarif efektif 0,20%)'
                            : 'Lapisan menengah (tarif 0,20%)'}
                        </option>
                        <option value="tinggi">
                          {regimeId === 'pbb_hkpd_2022'
                            ? 'NJKP 60% (tarif efektif 0,30%)'
                            : 'Batas maksimal UU PDRD (0,30%)'}
                        </option>
                        {regimeId === 'pbb_hkpd_2022' && (
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
              </>
            )}

            {activeTaxType === 'pph22' && (
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
              </>
            )}

            {activeTaxType === 'pph4_2' && (
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
              </>
            )}

            {activeTaxType === 'pph25' && (
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
              </>
            )}

            {activeTaxType === 'pph26' && (
              <>
                <CurrencyInput
                  id="pph26-bruto"
                  label="Nilai bruto penghasilan dibayar ke WPLN"
                  value={calcInput.pph26.nilaiBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph26: { ...prev.pph26, nilaiBruto: val },
                    }))
                  }
                />
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
            )}

            {activeTaxType === 'pph15' && (
              <>
                <CurrencyInput
                  id="pph15-bruto"
                  label="Peredaran bruto jasa pengangkutan / charter (non-PPN)"
                  value={calcInput.pph15.peredaranBruto}
                  onChange={(val) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      pph15: { ...prev.pph15, peredaranBruto: val },
                    }))
                  }
                />
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
              </>
            )}

            {activeTaxType === 'pbjt' && (
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
                    Sektor barang & jasa tertentu (PBJT)
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
              </>
            )}

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
                {result.regime.isCurrent ? 'Aturan berlaku saat ini' : 'Aturan historis'}
              </span>
            </div>

            <div>
              <p className="text-xs text-[#4F6160] dark:text-[#E8EAE4]/75">
                {result.primaryTaxLabel}
              </p>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-[#1F2A2C] dark:text-[#E8EAE4] mt-1">
                {formatRupiah(result.primaryTaxAmount)}
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-4 border-t border-[#5E706F]/25 text-sm">
              {result.annualTaxLabel && result.annualTaxAmount !== undefined && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">{result.annualTaxLabel}</dt>
                  <dd className="font-semibold tabular-nums text-[#1F2A2C] dark:text-[#E8EAE4]">
                    {formatRupiah(result.annualTaxAmount)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">Tarif pajak efektif</dt>
                <dd className="font-semibold tabular-nums text-[#1F2A2C] dark:text-[#E8EAE4]">
                  {formatPersen(result.effectiveRatePercent)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#4F6160] dark:text-[#E8EAE4]/75">
                  {result.takeHomeOrNetLabel}
                </dt>
                <dd className="font-semibold tabular-nums text-[#1F2A2C] dark:text-[#E8EAE4]">
                  {formatRupiah(result.takeHomeOrNetAmount)}
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
                        Nilai (IDR / %)
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
                          {step.format === 'percent'
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
    </section>
  );
};
