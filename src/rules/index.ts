import {
  CalculationResult,
  TaxArticle,
  TaxCalculatorInput,
  TaxRegime,
  TaxTypeId,
} from '../types/tax';
import { BEA_KELUAR_RULES } from './bea_keluar';
import { BEA_MASUK_RULES } from './bea_masuk';
import { BEA_METERAI_RULES } from './bea_meterai';
import { BPHTB_RULES } from './bphtb';
import { PBB_RULES } from './pbb';
import { PBJT_RULES } from './pbjt';
import { PPH15_RULES } from './pph15';
import { PPH21_RULES } from './pph21';
import { PPH22_RULES } from './pph22';
import { PPH23_RULES } from './pph23';
import { PPH25_RULES } from './pph25';
import { PPH26_RULES } from './pph26';
import { PPH4_2_RULES } from './pph4_2';
import { PPH_BADAN_RULES } from './pph_badan';
import { PPH_UMKM_RULES } from './pph_umkm';
import { PPN_RULES } from './ppn';
import { PPNBM_RULES } from './ppnbm';

export const TAX_CATEGORIES: {
  id: TaxTypeId;
  label: string;
  shortLabel: string;
  scope: string;
}[] = [
  {
    id: 'pph21',
    label: 'PPh Pasal 21',
    shortLabel: 'PPh 21',
    scope: 'Penghasilan pegawai tetap, gaji bulanan, bonus, dan tunjangan',
  },
  {
    id: 'pph22',
    label: 'PPh Pasal 22',
    shortLabel: 'PPh 22',
    scope: 'Pemungutan atas impor, belanja bendahara/BUMN, transaksi marketplace, dan barang sangat mewah',
  },
  {
    id: 'pph23',
    label: 'PPh Pasal 23',
    shortLabel: 'PPh 23',
    scope: 'Pemotongan atas jasa, sewa harta bergerak, royalti, dan dividen',
  },
  {
    id: 'pph4_2',
    label: 'PPh Pasal 4(2) Final',
    shortLabel: 'PPh 4(2)',
    scope: 'Pajak final sewa tanah/bangunan, jasa konstruksi, dan pengalihan properti',
  },
  {
    id: 'pph_umkm',
    label: 'PPh Final UMKM',
    shortLabel: 'PPh UMKM',
    scope: 'Pajak final peredaran bruto sampai dengan Rp 4,8 miliar per tahun',
  },
  {
    id: 'pph25',
    label: 'PPh Pasal 25',
    shortLabel: 'PPh 25',
    scope: 'Angsuran bulanan PPh terutang berdasarkan SPT Tahunan tahun sebelumnya',
  },
  {
    id: 'pph26',
    label: 'PPh Pasal 26',
    shortLabel: 'PPh 26',
    scope: 'Pemotongan penghasilan Wajib Pajak Luar Negeri dan penerapan tarif P3B',
  },
  {
    id: 'pph15',
    label: 'PPh Pasal 15',
    shortLabel: 'PPh 15',
    scope: 'Norma penghitungan khusus sektor pelayaran dan penerbangan',
  },
  {
    id: 'pph_badan',
    label: 'PPh Badan',
    shortLabel: 'PPh Badan',
    scope: 'Pajak penghasilan tahunan perseroan dan fasilitas Pasal 31E',
  },
  {
    id: 'ppn',
    label: 'PPN',
    shortLabel: 'PPN',
    scope: 'Pajak Pertambahan Nilai atas penyerahan barang dan jasa kena pajak',
  },
  {
    id: 'ppnbm',
    label: 'PPnBM',
    shortLabel: 'PPnBM',
    scope: 'Pajak Penjualan atas Barang Mewah kendaraan bermotor dan barang mewah tertentu',
  },
  {
    id: 'pbb',
    label: 'PBB',
    shortLabel: 'PBB',
    scope: 'Pajak Bumi dan Bangunan atas kepemilikan/pemanfaatan tanah dan bangunan',
  },
  {
    id: 'bphtb',
    label: 'BPHTB',
    shortLabel: 'BPHTB',
    scope: 'Bea Perolehan Hak atas Tanah dan Bangunan dari jual beli maupun waris',
  },
  {
    id: 'pbjt',
    label: 'PBJT (Pajak Daerah)',
    shortLabel: 'PBJT',
    scope: 'Pajak Barang dan Jasa Tertentu (restoran, hotel, parkir, hiburan, listrik)',
  },
  {
    id: 'bea_meterai',
    label: 'Bea Meterai',
    shortLabel: 'Meterai',
    scope: 'Pajak atas dokumen perdata dan dokumen nominal uang kertas maupun e-Meterai',
  },
  {
    id: 'bea_masuk',
    label: 'Bea Masuk',
    shortLabel: 'Bea Masuk',
    scope: 'Pungutan kepabeanan impor (BTKI 2022, Nilai Pabean CIF, FTA/SKA, Kiriman, Penumpang, BMT, KITE & Historis)',
  },
  {
    id: 'bea_keluar',
    label: 'Bea Keluar',
    shortLabel: 'Bea Keluar',
    scope: 'Pungutan kepabeanan ekspor (CPO/Sawit & POME, Emas PMK 80/2025, Kakao/Getah Pinus, Kulit/Kayu, Mineral & Historis)',
  },
];

export const DEFAULT_CALCULATOR_INPUT: TaxCalculatorInput = {
  pph21: {
    gajiBulanan: 0,
    tunjanganTetap: 0,
    bonusTahunan: 0,
    iuranPensiunBulanan: 0,
    ptkpStatus: 'TK/0',
    hasNpwp: true,
    pesangonBruto: 0,
    pesangonType: 'pesangon',
    naturaBulanan: 0,
    honorariumApbn: 0,
    golonganAsn: 'gol_3',
    honorariumBukanPegawai: 0,
    bukanPegawaiBerkesinambungan: false,
    skemaNonPegawai: 'bukan_pegawai_pmk168',
    bulanBayarBonus: 'jan_nov',
    pmk168KhususType: 'dewan_komisaris',
    wnaTahunKe: 1,
    tahunPesangonLama: 'kmk462_1998',
    isEligibleIknPmk28: true,
    jumlahBulanKerja: 6,
    skemaTengahTahun: 'lokal_berhenti_tidak_setahun',
    gajiPemberiKerja2: 0,
    hariDiLuarNegeri: 200,
    hasPermanentHomeLn: true,
  },
  pph22: {
    nilaiDasar: 0,
    objectType: 'impor_api',
    hasNpwp: true,
    akumulasiOmzetSebelumnya: 0,
    marketplaceTaxStatus: 'umkm_final',
    kriptoChannel: 'dalam_negeri_ojk',
    sektorIndustri: 'bbm_spbu_pertamina',
    jenisMewah: 'hunian_mewah',
    eraMewah: 'pmk92_2019',
    skemaEmas: 'pabrikan_ke_pedagang_pkp',
    skemaPembebasan22: 'belanja_max_2jt',
  },
  pph23: {
    nilaiBruto: 0,
    objectType: 'jasa_konsultan',
    hasNpwp: true,
    fintechRecipientType: 'wpdn_but',
    isSuketUmkm: true,
    isPengecualianPasal23_4: false,
    nilaiReimbursement: 0,
    isPembuktianFakturTerpisah: true,
    hasBpsNppnRoyalti: true,
  },
  pph4_2: {
    nilaiBruto: 0,
    objectType: 'sewa_tanah_bangunan',
    sewaSubjectType: 'orang_pribadi',
    depositoSkema: 'reguler',
    nilaiDepositoPokok: 100000000,
    eraObligasi: 'pp91_2021',
    isSahamPendiri: false,
    isDividenReinvested: true,
    undianAtauKoperasi: 'hadiah_undian',
    skemaPhtbKhusus: 'rumah_sederhana_1',
    skemaSpnDhe: 'diskonto_spn_20',
    skemaPph42Historis: 'deposito_15_pp51_1994',
    skemaDireVentura: 'kik_dire_0_5',
    nilaiBukuFiskal: 0,
    skemaRevaluasi: 'reguler_10_pmk79',
    skemaTaPps: 'pps_k2_14',
    skemaSkbPhtb: 'waris',
    isDilaporkanSptPewaris: true,
    skemaIknPhtb: 'perolehan_pertama_skb',
    isMarginAwalDerivatif: true,
  },
  pph_umkm: {
    omzetBulanan: 0,
    akumulasiOmzetSebelumnya: 0,
    subjectType: 'orang_pribadi',
    isEntityInTransition: false,
    isFreeProfession: false,
    omzetTerkaitSebelumnya: 0,
    nppnPersen: 50,
    marginLabaPersen: 10,
    skemaSuket164: 'suket_pihak_ketiga_0_5',
  },
  pph25: {
    pphTerutangTahunLalu: 0,
    kreditPajakTahunLalu: 0,
    bulanBerjalan: 12,
    diskonPandemiPersen: 50,
    omzetOpptBulanan: 0,
    flnTransport: 'udara',
    isKondisiTurun25: false,
    estimasiPphSetahunBaru: 0,
    skemaWpTertentu: 'bank_ojk',
    labaTriwulanAtauRkap: 0,
    flnEra1994: 'pp17_1998',
    skemaWpBaruTransisi: 'wp_baru_umum',
    penghasilanTidakTeraturNeto: 0,
  },
  pph26: {
    nilaiBruto: 0,
    objectType: 'dividen_royalti_jasa',
    hasSkdP3b: false,
    tarifP3bPersen: 10,
    isBptReinvested: false,
    skemaButPpt: 'beneficial_owner_valid',
    nilaiPenyerahanJasaBut: 0,
    hariDiIndonesia: 75,
    skemaAsuransi624: 'tertanggung_ri_10',
  },
  pph15: {
    peredaranBruto: 0,
    sectorType: 'pelayaran_dn',
    hasSkdP3bArticle8: true,
  },
  pph_badan: {
    peredaranBrutoTahunan: 0,
    penghasilanKenaPajak: 0,
    isTbk: false,
    etrSetelahInsentifPersen: 0,
    tbkEra: 'pp30_2020',
    skemaInsentif: 'tax_holiday_100',
    nilaiInvestasiAtauRnd: 500000000000,
    utangBerbunga: 0,
    ekuitasFiskal: 0,
    kelompokHartaPenyusutan: 'kel_2_8thn',
    skemaEkstraktif: 'batubara_iupk_pp15_18',
    skemaIknPfii: 'ikn_tax_holiday_100',
    koreksiPositifNonDeductible: 0,
    koreksiNegatif: 0,
    kompensasiKerugianFiskal: 0,
    penghasilanLuarNegeri: 0,
    rugiLuarNegeri: 0,
    pphDibayarLuarNegeri: 0,
    persenKepemilikanCfc: 60,
    penghasilanPasifNetoCfc: 0,
    labaAktifUsahaCfc: 0,
    eraCfc: 'pmk93_2019',
    nilaiAfiliasiBarang: 0,
    nilaiAfiliasiJasaLain: 0,
    omzetGrupKonsolidasi: 0,
    koreksiKewajaranTp: 0,
    isRepatriasiTpBeforeSkp: false,
    isAfiliasiTarifLebihRendah: false,
    nilaiPasarHartaMerger: 0,
    nilaiBukuFiskalMerger: 0,
    isPersetujuanNilaiBuku: true,
    labaSetelahPajakBuln: 0,
    dividenLnDiterima: 0,
    nilaiReinvestasiDividenLn: 0,
    pajakDibayarDiLnDividen: 0,
    zakatWajibResmi: 0,
    isLembagaZakatResmi: true,
  },
  ppn: {
    hargaJualDpp: 0,
    goodsType: 'umum',
    termasukPpn: false,
    besaranTertentuType: 'kms_2_2',
    pmseChannel: 'pmse_jasa_digital',
    eraPkp: 'pmk197_2013',
    periodePropertiDtp: 'ta_2026_100_pmk90',
    periodeTiketDtp: 'pmk77_nataru_2026',
    skemaEvDtp: 'kblbb_tkdn40_pmk12_2025',
    skemaStrategis: 'bkp_jkp_dibebaskan_pp49',
    eraPkpLama: 'kmk571_2003',
    skemaKmsLama: 'pmk163_2012_2persen',
    skemaKekRefund: 'kek_tidak_dipungut_pp40',
    skemaWapu81: 'bumn_pmk8_diatas_10jt',
    statusPkpJln: 'pkp_dapat_kredit',
    skemaPasal16d: 'aktiva_pm_dapat_kredit',
    persenZEstimasi: 70,
    persenZRealisasi: 85,
    masaManfaatPpn: 4,
    jenisEksporJkp: 'maklon_desain_it',
    isMemenuhiSyaratEksporJkp: true,
    skemaAyda: 'jual_ayda_pembeli',
    skemaNilaiLainRetur: 'pemakaian_cuma_cuma',
    persenLabaKotor: 20,
    skemaKawasanBerikat: 'pemasukan_bahan_baku',
    skemaRestitusiPpn: 'wp_17d_sd_5m',
    skemaDigunggung: 'eceran_konsumen_akhir',
    hasSkbDiplomatikTimbalBalik: true,
  },
  ppnbm: {
    hargaJual: 0,
    categoryType: 'sedan_suv_menengah',
    dtpDiscountPersen: 100,
    isPembebasanPmk141: true,
  },
  pbb: {
    njopBumi: 0,
    njopBangunan: 0,
    njoptkpPilihan: 10000000,
    tierRate: 'menengah',
    sektorPp46: 'perkebunan_kehutanan',
    sektorP3Lama: 'migas_panas_bumi_pmk76',
  },
  bphtb: {
    hargaTransaksi: 0,
    njopObjek: 0,
    acquisitionType: 'jual_beli_pertama',
    isRumahMbr: false,
    tingkatPenguranganBphtb: 'pengurangan_50',
    penghasilanBulananMbr: 6000000,
    adaPerkadaPembebasanMbr: true,
  },
  pbjt: {
    nilaiTransaksi: 0,
    sectorType: 'makanan_minuman',
    listrikSkema: 'umum_10',
    jenisOpsenHkpd: 'opsen_pkb_66',
    jenisPajakDaerahLain: 'reklame_25',
    jenisPajakProvinsiHkpd: 'pkb_non_dki',
    skemaProgresifMblb: 'pkb_progresif_non_dki',
    tingkatKepemilikanPkb: 2,
  },
  bea_meterai: {
    nilaiDokumen: 0,
    jumlahDokumen: 0,
    isPemeteraianKemudian: false,
    isBebasMeteraiPp3: true,
    jenisTransisiMeterai: 'transisi_3000_6000_9000',
    skemaPemungutNonObjek: 'non_objek_pasal7',
    jenisDokumenNonNominal: 'perjanjian_akta_notaris',
  },
  bea_masuk: {
    nilaiPabeanIdr: 0,
    tarifBmPersen: 10,
    skemaBtki: 'ad_valorem',
    jumlahUnitSpesifik: 0,
    tarifSpesifikPerUnit: 450,
    nilaiFobUsd: 0,
    ndpbmKurs: 16000,
    asalWilayahFreight: 'asia_australia_10',
    statusAsuransiPabean: 'norma_0_5',
    tarifFtaPersen: 0,
    isSkaValidSinsw: true,
    jenisKiriman2025: 'umum_7_5',
    skemaPenumpang2025: 'pribadi_usd500_10',
    hasNpwpPenumpang: true,
    jenisBmt: 'bmad_antidumping',
    tarifBmtPersen: 15,
    skemaFasilitasBm: 'kite_pembebasan_149',
    eraKirimanHistoris: 'pmk199_2019_usd3',
    isTasSepatuTekstilPmk199: false,
    eraBtkiLama: 'btki_2017_8digit',
    skemaBarangPindahan: 'rumah_tangga_bebas',
    skemaImporSementara: 'keringanan_2_persen',
    bulanImporSementara: 6,
    bmDibayarAwalSptnp: 0,
    bmKurangBayarSptnp: 0,
    isSalahanNilaiPabeanSptnp: true,
    skemaFtzPlb: 'ftz_keluar_barang_jadi_tlddp',
    rasioBahanBakuImporPersen: 60,
    skemaReimpor: 'kualitas_sama_bebas',
    nilaiBagianPenggantiIdr: 0,
    biayaPerbaikanFreightAsuransiIdr: 0,
    statusPelunasanRushHandling: 'tepat_waktu_7hari',
  },
  bea_keluar: {
    nilaiEksporUsd: 0,
    ndpbmKurs: 16000,
    tonaseMt: 0,
    tarifBkPersen: 10,
    skemaPemungutanBk: 'ad_valorem',
    tarifSpesifikUsdPerMt: 74,
    hargaReferensiCpoUsd: 1042.15,
    jenisProdukSawit: 'cpo_1511',
    isHitungPerbandinganPeBpdp: false,
    jenisProdukEmas: 'dore',
    hargaReferensiEmasUsdOz: 3300,
    beratEmasKg: 0,
    skemaKakaoPinus: 'kakao_pmk68_2025',
    hargaReferensiKakaoUsd: 4200,
    kategoriKulitKayu: 'kulit_wet_blue_15',
    jenisMineral2024: 'konsentrat_tembaga_7_5',
    bkDibayarAwalSptbk: 0,
    bkKurangBayarSptbk: 0,
    isKesalahanJumlahJenisBk: true,
    periodeSmelter71: '2024_h1',
    progresSmelterPersen: 65,
    periodeMinerba2012_2017: 'pmk6_2014_h1_2016_50',
    eraAwal2008_2012: 'pmk128_2011_cpo',
    eraPra2005: 'kmk334_1998_cpo_60',
  },
};

export const TAX_REGIMES: TaxRegime[] = [
  ...PPH21_RULES.map((m) => m.regime),
  ...PPH22_RULES.map((m) => m.regime),
  ...PPH23_RULES.map((m) => m.regime),
  ...PPH4_2_RULES.map((m) => m.regime),
  ...PPH_UMKM_RULES.map((m) => m.regime),
  ...PPH25_RULES.map((m) => m.regime),
  ...PPH26_RULES.map((m) => m.regime),
  ...PPH15_RULES.map((m) => m.regime),
  ...PPH_BADAN_RULES.map((m) => m.regime),
  ...PPN_RULES.map((m) => m.regime),
  ...PPNBM_RULES.map((m) => m.regime),
  ...PBB_RULES.map((m) => m.regime),
  ...BPHTB_RULES.map((m) => m.regime),
  ...PBJT_RULES.map((m) => m.regime),
  ...BEA_METERAI_RULES.map((m) => m.regime),
  ...BEA_MASUK_RULES.map((m) => m.regime),
  ...BEA_KELUAR_RULES.map((m) => m.regime),
];

export const TAX_ARTICLES: TaxArticle[] = [
  ...PPH21_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH22_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH23_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH4_2_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH_UMKM_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH25_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH26_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH15_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPH_BADAN_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPN_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PPNBM_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PBB_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...BPHTB_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...PBJT_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...BEA_METERAI_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...BEA_MASUK_RULES.flatMap((m) => (m.article ? [m.article] : [])),
  ...BEA_KELUAR_RULES.flatMap((m) => (m.article ? [m.article] : [])),
];

export function runTaxCalculation(
  taxType: TaxTypeId,
  input: TaxCalculatorInput,
  regimeId: string
): CalculationResult {
  switch (taxType) {
    case 'pph21': {
      const mod = PPH21_RULES.find((r) => r.regime.id === regimeId) ?? PPH21_RULES[0];
      return mod.calculate(input.pph21);
    }
    case 'pph22': {
      const mod = PPH22_RULES.find((r) => r.regime.id === regimeId) ?? PPH22_RULES[0];
      return mod.calculate(input.pph22);
    }
    case 'pph23': {
      const mod = PPH23_RULES.find((r) => r.regime.id === regimeId) ?? PPH23_RULES[0];
      return mod.calculate(input.pph23);
    }
    case 'pph4_2': {
      const mod = PPH4_2_RULES.find((r) => r.regime.id === regimeId) ?? PPH4_2_RULES[0];
      return mod.calculate(input.pph4_2);
    }
    case 'pph_umkm': {
      const mod = PPH_UMKM_RULES.find((r) => r.regime.id === regimeId) ?? PPH_UMKM_RULES[0];
      return mod.calculate(input.pph_umkm);
    }
    case 'pph25': {
      const mod = PPH25_RULES.find((r) => r.regime.id === regimeId) ?? PPH25_RULES[0];
      return mod.calculate(input.pph25);
    }
    case 'pph26': {
      const mod = PPH26_RULES.find((r) => r.regime.id === regimeId) ?? PPH26_RULES[0];
      return mod.calculate(input.pph26);
    }
    case 'pph15': {
      const mod = PPH15_RULES.find((r) => r.regime.id === regimeId) ?? PPH15_RULES[0];
      return mod.calculate(input.pph15);
    }
    case 'pph_badan': {
      const mod = PPH_BADAN_RULES.find((r) => r.regime.id === regimeId) ?? PPH_BADAN_RULES[0];
      return mod.calculate(input.pph_badan);
    }
    case 'ppn': {
      const mod = PPN_RULES.find((r) => r.regime.id === regimeId) ?? PPN_RULES[0];
      return mod.calculate(input.ppn);
    }
    case 'ppnbm': {
      const mod = PPNBM_RULES.find((r) => r.regime.id === regimeId) ?? PPNBM_RULES[0];
      return mod.calculate(input.ppnbm);
    }
    case 'pbb': {
      const mod = PBB_RULES.find((r) => r.regime.id === regimeId) ?? PBB_RULES[0];
      return mod.calculate(input.pbb);
    }
    case 'bphtb': {
      const mod = BPHTB_RULES.find((r) => r.regime.id === regimeId) ?? BPHTB_RULES[0];
      return mod.calculate(input.bphtb);
    }
    case 'pbjt': {
      const mod = PBJT_RULES.find((r) => r.regime.id === regimeId) ?? PBJT_RULES[0];
      return mod.calculate(input.pbjt);
    }
    case 'bea_meterai': {
      const mod =
        BEA_METERAI_RULES.find((r) => r.regime.id === regimeId) ?? BEA_METERAI_RULES[0];
      return mod.calculate(input.bea_meterai);
    }
    case 'bea_masuk': {
      const mod = BEA_MASUK_RULES.find((r) => r.regime.id === regimeId) ?? BEA_MASUK_RULES[0];
      return mod.calculate(input.bea_masuk);
    }
    case 'bea_keluar': {
      const mod = BEA_KELUAR_RULES.find((r) => r.regime.id === regimeId) ?? BEA_KELUAR_RULES[0];
      return mod.calculate(input.bea_keluar);
    }
  }
}
