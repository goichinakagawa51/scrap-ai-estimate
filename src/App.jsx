import { useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   品目データ（大畑商事 2026/4/6 価格ベース）
   ═══════════════════════════════════════════ */
const ITEMS = [
  { name:"ピカ線(特一号銅線)",price:1930,unit:"kg",cat:"銅・電線",hint:"断面1.3mm以上、光沢のある銅線。被覆なし",page:"scrap_pika" },
  { name:"並銅(なみどう)",price:1880,unit:"kg",cat:"銅・電線",hint:"銅管、銅板等。多少の付着物あり",page:"scrap_namidou" },
  { name:"込銅(付物あり)",price:1830,unit:"kg",cat:"銅・電線",hint:"真鍮やハンダ等の付き物がある銅",page:"scrap_komidou" },
  { name:"空調銅配管_皮あり",price:900,unit:"kg",cat:"銅・電線",hint:"断熱材付きのエアコン用銅配管",page:"scrap_kawaari" },
  { name:"雑電線(銅率80%)",price:1450,unit:"kg",cat:"銅・電線",hint:"太い電力ケーブル。IV線、CV線等",page:"scrap_z80per" },
  { name:"雑電線(銅率65%)",price:1035,unit:"kg",cat:"銅・電線",hint:"一般的な雑電線",page:"scrap_z65per" },
  { name:"家電線",price:520,unit:"kg",cat:"銅・電線",hint:"家電製品の細い電源コード",page:"scrap_kaden" },
  { name:"VA線(VVFケーブル)",price:820,unit:"kg",cat:"銅・電線",hint:"平形の屋内配線用ケーブル",page:"scrap_zVAper" },
  { name:"給湯器_赤釜",price:1550,unit:"kg",cat:"銅・電線",hint:"銅製熱交換器の給湯器",page:"scrap_a_kama" },
  { name:"給湯器_白釜",price:1400,unit:"kg",cat:"銅・電線",hint:"ステンレス製熱交換器の給湯器",page:"scrap_s_kama" },
  { name:"砲金(青銅)",price:1650,unit:"kg",cat:"銅・電線",hint:"バルブ、水栓金具等。付物なし",page:"scrap_bronze_001" },
  { name:"込砲金(バルブ砲金)",price:1570,unit:"kg",cat:"銅・電線",hint:"鉄やゴム等の付物がある砲金",page:"scrap_bronze_002" },
  { name:"真鍮/黄銅",price:1180,unit:"kg",cat:"銅・電線",hint:"金色の合金。蛇口、鍵、楽器部品等",page:"scrap_brass" },
  { name:"リン青銅",price:1680,unit:"kg",cat:"銅・電線",hint:"バネ材、コネクタ端子等に使用",page:"scrap_p_bronze" },
  { name:"ハーネス(自動車線)",price:820,unit:"kg",cat:"銅・電線",hint:"自動車用ワイヤーハーネス",page:"scrap_harness" },
  { name:"SUS304",price:175,unit:"kg",cat:"ステンレス",hint:"最も一般的なステンレス。磁石に付かない",page:"scrap_sus304" },
  { name:"SUS316",price:310,unit:"kg",cat:"ステンレス",hint:"耐食性が高い。化学プラント等で使用",page:"scrap_sus316" },
  { name:"SUS301",price:140,unit:"kg",cat:"ステンレス",hint:"バネ用ステンレス。磁石に少し付く",page:"scrap_sus301" },
  { name:"SUS310",price:480,unit:"kg",cat:"ステンレス",hint:"耐熱ステンレス。炉の部品等",page:"scrap_sus310" },
  { name:"SUS400系",price:39,unit:"kg",cat:"ステンレス",hint:"磁石に付くステンレス。刃物、流し台等",page:"scrap_sus400" },
  { name:"SUS309",price:230,unit:"kg",cat:"ステンレス",hint:"耐熱用。SUS304とSUS310の中間",page:"scrap_sus309" },
  { name:"アルミサッシA_付物なし",price:430,unit:"kg",cat:"アルミ",hint:"窓枠用アルミサッシ。ビスやゴムなし",page:"scrap_sash_vis_nashi" },
  { name:"アルミサッシB_付物あり",price:400,unit:"kg",cat:"アルミ",hint:"ビスやゴム付きのアルミサッシ",page:"scrap_sash_vis_ari" },
  { name:"アルミガラA_付物なし",price:360,unit:"kg",cat:"アルミ",hint:"アルミ端材。付物なし",page:"scrap_alm_dust_nashi" },
  { name:"アルミガラB_金属付",price:330,unit:"kg",cat:"アルミ",hint:"鉄ビス等の金属付物があるアルミ",page:"scrap_alumi_dast_ari" },
  { name:"アルミガラC_非金属付",price:200,unit:"kg",cat:"アルミ",hint:"プラスチック等の非金属付物あり",page:"scrap_alm_dust_ari_c" },
  { name:"アルミヒートシンク",price:430,unit:"kg",cat:"アルミ",hint:"PC等の放熱板",page:"scrap_heat_sink" },
  { name:"アルミホイールA_付物なし",price:460,unit:"kg",cat:"アルミ",hint:"自動車用アルミホイール。タイヤなし",page:"scrap_wheel_dust_nashi" },
  { name:"アルミ缶(UBC)",price:300,unit:"kg",cat:"アルミ",hint:"飲料用アルミ缶",page:"scrap_ubc" },
  { name:"アルミ印刷版",price:430,unit:"kg",cat:"アルミ",hint:"印刷用のアルミ版(PS版)",page:"scrap_ps_ban" },
  { name:"鉛管",price:220,unit:"kg",cat:"鉛・亜鉛",hint:"鉛製の配管",page:"scrap_lead_pipe" },
  { name:"鉛錘(おもり)",price:120,unit:"kg",cat:"鉛・亜鉛",hint:"釣り用鉛おもり等",page:"scrap_lead_weight" },
  { name:"亜鉛",price:240,unit:"kg",cat:"鉛・亜鉛",hint:"亜鉛の塊、ダイカスト品等",page:"scrap_zinc" },
  { name:"自動車用鉛バッテリー",price:113,unit:"kg",cat:"バッテリー",hint:"自動車用の鉛蓄電池",page:"scrap_battery_car" },
  { name:"シールド鉛バッテリー",price:60,unit:"kg",cat:"バッテリー",hint:"密閉型バッテリー",page:"scrap_battery_sealed" },
  { name:"フォークリフト用バッテリー",price:60,unit:"kg",cat:"バッテリー",hint:"フォークリフトの大型鉛バッテリー",page:"scrap_battery_fork" },
  { name:"リチウムイオン電池",price:30,unit:"kg",cat:"バッテリー",hint:"小型リチウムイオンバッテリー",page:"scrap_small_bt" },
  { name:"ニッケル水素バッテリー",price:50,unit:"kg",cat:"バッテリー",hint:"ニッケル水素二次電池",page:"scrap_nickel_mhb" },
  { name:"ハイブリッド車バッテリー",price:2000,unit:"個",cat:"バッテリー",hint:"ハイブリッド車用ニッケル水素",page:"scrap_hybrid_a" },
  { name:"純錫(すず)",price:5000,unit:"kg",cat:"錫",hint:"錫の塊、インゴット等",page:"scrap_tin" },
  { name:"錫食器(錫器)",price:2000,unit:"kg",cat:"錫",hint:"錫製の酒器、花瓶等",page:"scrap_lead_tableware" },
  { name:"半田(銀3%入り)",price:10000,unit:"kg",cat:"錫",hint:"銀入り半田。電子基板用",page:"scrap_handa_003" },
  { name:"半田(鉛フリー)",price:3700,unit:"kg",cat:"錫",hint:"鉛フリー半田(Sn-Ag-Cu系等)",page:"scrap_handa_004" },
  { name:"半田(錫60%鉛40%)",price:2200,unit:"kg",cat:"錫",hint:"共晶半田。線状・棒状",page:"scrap_handa_002" },
  { name:"ガス給湯器",price:350,unit:"kg",cat:"鉄・雑品",hint:"家庭用ガス給湯器の本体",page:"scrap_water_heater" },
  { name:"ガスメーター",price:100,unit:"kg",cat:"鉄・雑品",hint:"ガスメーターの本体",page:"scrap_gas_meter" },
  { name:"トランス(変圧器)",price:60,unit:"kg",cat:"鉄・雑品",hint:"柱上変圧器、工業用変圧器",page:"scrap_trans" },
  { name:"トランスコア",price:300,unit:"kg",cat:"鉄・雑品",hint:"変圧器の鉄心部分",page:"scrap_trans_core" },
  { name:"鉄(スチール)",price:39,unit:"kg",cat:"鉄・雑品",hint:"一般的な鉄くず、H鋼、鉄板等",page:"scrap_iron_001" },
  { name:"工業雑品",price:30,unit:"kg",cat:"鉄・雑品",hint:"鉄ベースで付物が多い雑品",page:"scrap_zappin" },
  { name:"純ニッケル",price:1700,unit:"kg",cat:"ニッケル",hint:"ニッケルの塊、板、線等",page:"scrap_nickel" },
  { name:"ニクロム線",price:1150,unit:"kg",cat:"ニッケル",hint:"電熱線。Ni80%,Cr20%",page:"scrap_nichrom" },
  { name:"インコネル600",price:1050,unit:"kg",cat:"ニッケル",hint:"耐熱・耐食ニッケル合金",page:"scrap_inconel_600" },
  { name:"インコネル625",price:1500,unit:"kg",cat:"ニッケル",hint:"耐食性に優れたニッケル合金",page:"scrap_inconel_625" },
  { name:"ハステロイC",price:1400,unit:"kg",cat:"ニッケル",hint:"超耐食ニッケル合金",page:"scrap_hastelloy_c" },
  { name:"洋白(洋銀)",price:500,unit:"kg",cat:"ニッケル",hint:"銅・ニッケル・亜鉛合金。銀色",page:"scrap_youhaku" },
  { name:"モネル400",price:840,unit:"kg",cat:"ニッケル",hint:"ニッケル-銅合金。海水耐食",page:"scrap_monel_400" },
  { name:"タングステン",price:20000,unit:"kg",cat:"超硬",hint:"非常に重い銀灰色の金属",page:"scrap_tungsten" },
  { name:"超硬(チップ等)",price:9000,unit:"kg",cat:"超硬",hint:"超硬合金。切削工具のチップ等",page:"scrap_choukou" },
  { name:"ハイス(HSS)",price:300,unit:"kg",cat:"超硬",hint:"高速度鋼。ドリル、エンドミル等",page:"scrap_hss" },
  { name:"ヘビメット",price:7000,unit:"kg",cat:"超硬",hint:"タングステン系重合金",page:"scrap_hevimet" },
  { name:"S基板",price:5000,unit:"kg",cat:"基板",hint:"金メッキが多い高品位基板",page:"scrap_kiban_s" },
  { name:"A基板",price:3200,unit:"kg",cat:"基板",hint:"ICチップが多い基板",page:"scrap_kiban_a" },
  { name:"B基板",price:2200,unit:"kg",cat:"基板",hint:"一般的な電子基板",page:"scrap_kiban_b" },
  { name:"C基板",price:1700,unit:"kg",cat:"基板",hint:"部品少なめの基板",page:"scrap_kiban_c" },
  { name:"家電/電源基板",price:345,unit:"kg",cat:"基板",hint:"家電製品の電源基板等",page:"scrap_kiban_low" },
  { name:"マザーボード",price:1000,unit:"kg",cat:"基板",hint:"PC用メイン基板",page:"scrap_mbd_002" },
  { name:"メモリーA",price:7000,unit:"kg",cat:"基板",hint:"PC用メモリ",page:"scrap_mem" },
  { name:"CPUセラミック(紫)",price:20000,unit:"kg",cat:"基板",hint:"紫色セラミックの古いCPU",page:"scrap_cpu_e" },
  { name:"CPU(黒)",price:10000,unit:"kg",cat:"基板",hint:"黒いパッケージのCPU",page:"scrap_cpu_b" },
  { name:"CPU(緑)",price:3500,unit:"kg",cat:"基板",hint:"緑基板のCPU",page:"scrap_cpu_d" },
  { name:"IC(セラミック紫金足)",price:18000,unit:"kg",cat:"基板",hint:"紫セラミック・金色端子のIC",page:"scrap_ic_a" },
  { name:"IC(正方形)",price:4500,unit:"kg",cat:"基板",hint:"正方形パッケージのIC",page:"scrap_ic_c" },
  { name:"ハードディスク",price:120,unit:"kg",cat:"基板",hint:"HDD",page:"scrap_hdd" },
  { name:"パソコン屑",price:100,unit:"kg",cat:"基板",hint:"PC丸ごと",page:"scrap_pc_scrap" },
  { name:"携帯電話本体",price:2000,unit:"kg",cat:"基板",hint:"ガラケー本体",page:"scrap_mobile" },
  { name:"スマートフォン本体",price:1000,unit:"kg",cat:"基板",hint:"スマートフォン本体",page:"scrap_smartphone" },
  { name:"ブレーカー",price:250,unit:"kg",cat:"基板",hint:"配線用遮断器",page:"scrap_breaker" },
  { name:"リレーA(接点付)",price:500,unit:"kg",cat:"基板",hint:"銀接点付きリレー",page:"scrap_relay_a" },
  { name:"ECU(車載制御)",price:200,unit:"kg",cat:"基板",hint:"自動車用ECU",page:"scrap_ecu" },
  { name:"黒モーター",price:120,unit:"kg",cat:"モーター",hint:"鉄カバーの汎用モーター",page:"scrap_kuro_motor" },
  { name:"工業用モーター",price:135,unit:"kg",cat:"モーター",hint:"工場設備用の大型モーター",page:"scrap_kgy_motor" },
  { name:"コンプレッサー(自動車)",price:100,unit:"kg",cat:"モーター",hint:"カーエアコン用コンプレッサー",page:"scrap_car_compressor" },
  { name:"セルモーター",price:150,unit:"kg",cat:"モーター",hint:"自動車用スターターモーター",page:"scrap_cell_mortor" },
  { name:"ダイナモ",price:150,unit:"kg",cat:"モーター",hint:"自動車用発電機",page:"scrap_alternator" },
  { name:"空調ラジエーター",price:900,unit:"kg",cat:"ラジエーター",hint:"エアコン室外機の熱交換器",page:"scrap_radiator_aircon" },
  { name:"真鍮ラジエーター",price:900,unit:"kg",cat:"ラジエーター",hint:"旧車の真鍮製ラジエーター",page:"scrap_radiator_brass" },
  { name:"アルミラジエーター",price:120,unit:"kg",cat:"ラジエーター",hint:"現行車のアルミ製ラジエーター",page:"scrap_radiator_aluminum" },
  { name:"ディーゼル触媒(トラック)",price:23000,unit:"個",cat:"触媒",hint:"トラック用大型ハニカム触媒",page:"scrap_shokubai_010" },
  { name:"自動車触媒(ハニカム大)",price:11000,unit:"個",cat:"触媒",hint:"乗用車ハニカム触媒 大",page:"scrap_shokubai_001" },
  { name:"自動車触媒(ハニカム中)",price:6000,unit:"個",cat:"触媒",hint:"乗用車ハニカム触媒 中",page:"scrap_shokubai_002" },
  { name:"自動車触媒(ハニカム小)",price:3000,unit:"個",cat:"触媒",hint:"乗用車ハニカム触媒 小",page:"scrap_shokubai_003" },
  { name:"自動車触媒(メタル大)",price:10000,unit:"個",cat:"触媒",hint:"金属担体触媒 大",page:"scrap_shokubai_004" },
  { name:"自動車触媒(メタル中)",price:5000,unit:"個",cat:"触媒",hint:"金属担体触媒 中",page:"scrap_shokubai_006" },
  { name:"自動車触媒(メタル小)",price:3000,unit:"個",cat:"触媒",hint:"金属担体触媒 小",page:"scrap_shokubai_014" },
  { name:"ネオジム磁石(鉄付)",price:80,unit:"kg",cat:"その他",hint:"強力な永久磁石",page:"scrap_neodym_magnet" },
  { name:"純チタン",price:250,unit:"kg",cat:"その他",hint:"チタンの板、棒、パイプ等",page:"scrap_titan" },
  { name:"モリブデン",price:5000,unit:"kg",cat:"その他",hint:"高融点金属。銀白色",page:"scrap_molybdenum" },
  { name:"タンタル",price:20000,unit:"kg",cat:"その他",hint:"コンデンサ等に使用",page:"scrap_tantalum" },
  { name:"銀ろう70%",price:105000,unit:"kg",cat:"銀",hint:"銀含有率70%のろう材",page:"scrap_ginrou" },
  { name:"銀ろう50%",price:70000,unit:"kg",cat:"銀",hint:"銀含有率50%のろう材",page:"scrap_ginrou_50" },
  { name:"銀ろう45%",price:63000,unit:"kg",cat:"銀",hint:"銀含有率45%のろう材",page:"scrap_ginrou_45" },
];

const ITEM_MAP = {};
ITEMS.forEach(it => { ITEM_MAP[it.name] = it; });

/* ═══ カテゴリ別カラー＋アイコン ═══ */
const CAT_VISUAL = {
  "銅・電線":     { bg:"#92400E", fg:"#FBBF24", icon:"⚡", gradient:"linear-gradient(135deg,#B45309,#D97706)" },
  "ステンレス":   { bg:"#374151", fg:"#E5E7EB", icon:"🔩", gradient:"linear-gradient(135deg,#4B5563,#6B7280)" },
  "アルミ":       { bg:"#1E3A5F", fg:"#93C5FD", icon:"🪟", gradient:"linear-gradient(135deg,#1E40AF,#3B82F6)" },
  "鉛・亜鉛":    { bg:"#374151", fg:"#9CA3AF", icon:"⚖️", gradient:"linear-gradient(135deg,#4B5563,#6B7280)" },
  "バッテリー":   { bg:"#14532D", fg:"#86EFAC", icon:"🔋", gradient:"linear-gradient(135deg,#166534,#22C55E)" },
  "錫":           { bg:"#44403C", fg:"#D6D3D1", icon:"🪙", gradient:"linear-gradient(135deg,#57534E,#78716C)" },
  "鉄・雑品":    { bg:"#1C1917", fg:"#A8A29E", icon:"🏗️", gradient:"linear-gradient(135deg,#292524,#44403C)" },
  "ニッケル":     { bg:"#312E81", fg:"#A5B4FC", icon:"⚙️", gradient:"linear-gradient(135deg,#3730A3,#6366F1)" },
  "超硬":         { bg:"#0C4A6E", fg:"#7DD3FC", icon:"🔧", gradient:"linear-gradient(135deg,#075985,#0EA5E9)" },
  "基板":         { bg:"#14532D", fg:"#4ADE80", icon:"💻", gradient:"linear-gradient(135deg,#15803D,#22C55E)" },
  "モーター":     { bg:"#1C1917", fg:"#FCA5A5", icon:"⚙️", gradient:"linear-gradient(135deg,#292524,#57534E)" },
  "ラジエーター": { bg:"#7C2D12", fg:"#FDBA74", icon:"🌡️", gradient:"linear-gradient(135deg,#9A3412,#EA580C)" },
  "触媒":         { bg:"#3F3F46", fg:"#E4E4E7", icon:"🔰", gradient:"linear-gradient(135deg,#52525B,#71717A)" },
  "その他":       { bg:"#3F3F46", fg:"#D4D4D8", icon:"🔬", gradient:"linear-gradient(135deg,#52525B,#71717A)" },
  "銀":           { bg:"#1F2937", fg:"#F3F4F6", icon:"✨", gradient:"linear-gradient(135deg,#374151,#9CA3AF)" },
};

const getCatVisual = (cat) => CAT_VISUAL[cat] || CAT_VISUAL["その他"];

/* ═══ カテゴリイラスト SVG生成 ═══ */
const CatIllustration = ({ cat, size = 64 }) => {
  const v = getCatVisual(cat);
  const svgMap = {
    "銅・電線": `<circle cx="32" cy="32" r="18" fill="none" stroke="${v.fg}" stroke-width="3"/>
      <path d="M24 26c4-6 12-6 16 0" stroke="${v.fg}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M24 32c4-6 12-6 16 0" stroke="${v.fg}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M24 38c4-6 12-6 16 0" stroke="${v.fg}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".4"/>`,
    "ステンレス": `<rect x="14" y="20" width="36" height="24" rx="2" fill="none" stroke="${v.fg}" stroke-width="2.5"/>
      <line x1="14" y1="28" x2="50" y2="28" stroke="${v.fg}" stroke-width="1.5" opacity=".5"/>
      <line x1="14" y1="36" x2="50" y2="36" stroke="${v.fg}" stroke-width="1.5" opacity=".3"/>
      <circle cx="46" cy="24" r="3" fill="${v.fg}" opacity=".4"/>`,
    "アルミ": `<rect x="16" y="18" width="32" height="8" rx="1" fill="${v.fg}" opacity=".3"/>
      <rect x="16" y="28" width="32" height="8" rx="1" fill="${v.fg}" opacity=".5"/>
      <rect x="16" y="38" width="32" height="8" rx="1" fill="${v.fg}" opacity=".7"/>`,
    "鉛・亜鉛": `<rect x="18" y="22" width="28" height="22" rx="3" fill="${v.fg}" opacity=".5"/>
      <text x="32" y="38" text-anchor="middle" font-size="14" font-weight="bold" fill="${v.fg}">Pb</text>`,
    "バッテリー": `<rect x="20" y="16" width="24" height="34" rx="3" fill="none" stroke="${v.fg}" stroke-width="2.5"/>
      <rect x="26" y="12" width="12" height="6" rx="1" fill="${v.fg}" opacity=".6"/>
      <line x1="28" y1="28" x2="36" y2="28" stroke="${v.fg}" stroke-width="2"/>
      <line x1="32" y1="24" x2="32" y2="32" stroke="${v.fg}" stroke-width="2"/>
      <line x1="28" y1="40" x2="36" y2="40" stroke="${v.fg}" stroke-width="2"/>`,
    "錫": `<rect x="16" y="24" width="32" height="18" rx="2" fill="${v.fg}" opacity=".4"/>
      <text x="32" y="38" text-anchor="middle" font-size="13" font-weight="bold" fill="${v.fg}">Sn</text>`,
    "鉄・雑品": `<path d="M16 44 L24 16 L28 16 L20 44Z" fill="${v.fg}" opacity=".6"/>
      <path d="M16 44 L48 44 L48 40 L16 40Z" fill="${v.fg}" opacity=".4"/>
      <path d="M34 44 L42 16 L46 16 L38 44Z" fill="${v.fg}" opacity=".6"/>`,
    "ニッケル": `<circle cx="32" cy="32" r="16" fill="none" stroke="${v.fg}" stroke-width="2.5"/>
      <text x="32" y="37" text-anchor="middle" font-size="14" font-weight="bold" fill="${v.fg}">Ni</text>`,
    "超硬": `<polygon points="32,14 44,44 20,44" fill="none" stroke="${v.fg}" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="32" y="40" text-anchor="middle" font-size="10" font-weight="bold" fill="${v.fg}">WC</text>`,
    "基板": `<rect x="14" y="18" width="36" height="28" rx="2" fill="${v.fg}" opacity=".2"/>
      <rect x="18" y="22" width="6" height="4" rx="1" fill="${v.fg}" opacity=".7"/>
      <rect x="26" y="22" width="6" height="4" rx="1" fill="${v.fg}" opacity=".7"/>
      <rect x="34" y="22" width="6" height="4" rx="1" fill="${v.fg}" opacity=".7"/>
      <rect x="42" y="22" width="4" height="4" rx="1" fill="${v.fg}" opacity=".5"/>
      <line x1="14" y1="30" x2="50" y2="30" stroke="${v.fg}" stroke-width="1" opacity=".4"/>
      <rect x="18" y="34" width="8" height="6" rx="1" fill="${v.fg}" opacity=".5"/>
      <rect x="30" y="33" width="12" height="8" rx="1" fill="${v.fg}" opacity=".6"/>
      <circle cx="22" cy="42" r="2" fill="${v.fg}" opacity=".4"/>
      <circle cx="42" cy="42" r="2" fill="${v.fg}" opacity=".4"/>`,
    "モーター": `<circle cx="32" cy="32" r="16" fill="none" stroke="${v.fg}" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="6" fill="${v.fg}" opacity=".5"/>
      <line x1="32" y1="16" x2="32" y2="22" stroke="${v.fg}" stroke-width="2"/>
      <line x1="32" y1="42" x2="32" y2="48" stroke="${v.fg}" stroke-width="2"/>
      <line x1="16" y1="32" x2="22" y2="32" stroke="${v.fg}" stroke-width="2"/>
      <line x1="42" y1="32" x2="48" y2="32" stroke="${v.fg}" stroke-width="2"/>`,
    "ラジエーター": `<rect x="16" y="18" width="32" height="28" rx="2" fill="none" stroke="${v.fg}" stroke-width="2"/>
      ${[0,1,2,3,4,5,6].map(i=>`<line x1="${20+i*4}" y1="18" x2="${20+i*4}" y2="46" stroke="${v.fg}" stroke-width="1.5" opacity=".5"/>`).join("")}`,
    "触媒": `<ellipse cx="32" cy="22" rx="12" ry="6" fill="none" stroke="${v.fg}" stroke-width="2"/>
      <line x1="20" y1="22" x2="20" y2="42" stroke="${v.fg}" stroke-width="2"/>
      <line x1="44" y1="22" x2="44" y2="42" stroke="${v.fg}" stroke-width="2"/>
      <ellipse cx="32" cy="42" rx="12" ry="6" fill="none" stroke="${v.fg}" stroke-width="2"/>`,
    "その他": `<polygon points="32,16 46,28 40,46 24,46 18,28" fill="none" stroke="${v.fg}" stroke-width="2.5"/>
      <text x="32" y="36" text-anchor="middle" font-size="11" font-weight="bold" fill="${v.fg}">?</text>`,
    "銀": `<circle cx="32" cy="32" r="14" fill="none" stroke="${v.fg}" stroke-width="2"/>
      <text x="32" y="37" text-anchor="middle" font-size="14" font-weight="bold" fill="${v.fg}">Ag</text>`,
  };
  const inner = svgMap[cat] || svgMap["その他"];
  return (
    <div style={{width:size,height:size,borderRadius:12,background:v.gradient,flexShrink:0,overflow:"hidden"}}
      dangerouslySetInnerHTML={{__html:`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`}}/>
  );
};

/* ═══ AIプロンプト ═══ */
const buildPrompt = () => {
  const cats = {};
  ITEMS.forEach(it => { if(!cats[it.cat]) cats[it.cat]=[]; cats[it.cat].push(it); });
  let list = "";
  Object.entries(cats).forEach(([c, items]) => {
    list += `\n【${c}】\n`;
    items.forEach(it => { list += `- ${it.name} (${it.price}円/${it.unit}) … ${it.hint}\n`; });
  });
  return `あなたはスクラップ金属の識別専門家です。写真に写っている金属スクラップを以下の品目リストから識別してください。

【重要ルール】
1. 最も可能性の高い品目を候補として挙げてください。
2. 外観で判別が難しい場合（例：アルミとステンレス、SUS304とSUS316）は全候補を挙げ、判別ヒント（磁石テスト等）も記載。
3. 同一品目が複数写っている場合は推定個数を回答。
4. スクラップ金属でない場合はis_scrapをfalseに。

以下のJSON形式のみで回答（JSON以外は一切出力しないこと）:
{"is_scrap":true,"candidates":[{"name":"品目名（リスト名称と完全一致）","confidence":0.0〜1.0,"reason":"判断理由30字以内","differentiation_hint":"判別ヒント（不要ならnull）"}],"estimated_quantity":1,"quantity_note":"個数補足（不要ならnull）","notes":"全体補足（不要ならnull）"}

【品目リスト】${list}`;
};

/* ═══ 画像リサイズ ═══ */
const resizeImg = (url, max=1024) => new Promise(r => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(max/img.width, max/img.height, 1);
    const c = document.createElement("canvas");
    c.width=img.width*s; c.height=img.height*s;
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    r(c.toDataURL("image/jpeg",0.85));
  };
  img.src = url;
});

/* ═══════════════════════════════════════
   メインアプリ
   ═══════════════════════════════════════ */
export default function App() {
  const [scr, setScr] = useState("home");
  const [photo, setPhoto] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [aiNotes, setAiNotes] = useState("");
  const [aiQty, setAiQty] = useState(1);
  const [sel, setSel] = useState(null);
  const [weight, setWeight] = useState("");
  const [qty, setQty] = useState("1");
  const [cart, setCart] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [browseCat, setBrowseCat] = useState(null);
  const [manualItem, setManualItem] = useState(null);
  const camRef = useRef(null);
  const galRef = useRef(null);

  /* ── カテゴリ一覧（順序付き） ── */
  const CAT_ORDER = ["銅・電線","ステンレス","アルミ","鉛・亜鉛","バッテリー","錫","鉄・雑品","ニッケル","超硬","基板","モーター","ラジエーター","触媒","その他","銀"];
  const CATS_GROUPED = {};
  ITEMS.forEach(it=>{ if(!CATS_GROUPED[it.cat]) CATS_GROUPED[it.cat]=[]; CATS_GROUPED[it.cat].push(it); });

  /* ── 検索フィルタ ── */
  const filteredItems = searchQ.trim()
    ? ITEMS.filter(it => it.name.toLowerCase().includes(searchQ.toLowerCase()) || it.hint.toLowerCase().includes(searchQ.toLowerCase()) || it.cat.includes(searchQ))
    : [];

  /* ── カテゴリ検索から品目選択 → カートに追加 ── */
  const addManualToCart = () => {
    if(!manualItem) return;
    const w = parseFloat(weight)||0;
    const q = parseInt(qty)||1;
    const sub = manualItem.unit==="個" ? manualItem.price*q : manualItem.price*w*q;
    setCart([...cart, {item:manualItem, weight:w, qty:q, subtotal:sub, photo:null}]);
    setManualItem(null); setWeight(""); setQty("1"); setScr("home");
  };

  /* ── AI解析 ── */
  const analyze = useCallback(async (dataUrl) => {
    setBusy(true); setErr(""); setCandidates([]); setSel(null); setScr("analyzing");
    try {
      const resized = await resizeImg(dataUrl);
      const b64 = resized.split(",")[1];
      const mt = (resized.match(/data:(image\/\w+);/)||[])[1]||"image/jpeg";
      const res = await fetch("/api/analyze", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:mt,data:b64}},
            {type:"text",text:buildPrompt()}
          ]}]
        })
      });
      const data = await res.json();
      const txt = (data.content||[]).map(b=>b.text||"").join("");
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      if(!parsed.is_scrap){ setErr("スクラップ金属が検出できませんでした。別の写真をお試しください。"); setScr("results"); setBusy(false); return; }
      const valid = (parsed.candidates||[]).map(c=>({...c, item:ITEM_MAP[c.name]||null})).filter(c=>c.item);
      if(!valid.length){ setErr("品目を特定できませんでした。別の角度から撮影してお試しください。"); setScr("results"); setBusy(false); return; }
      setCandidates(valid);
      setAiNotes(parsed.notes||"");
      setAiQty(parsed.estimated_quantity||1);
      setQty(String(parsed.estimated_quantity||1));
      setScr("results");
    } catch(e) {
      console.error(e);
      setErr("解析中にエラーが発生しました。再度お試しください。");
      setScr("results");
    }
    setBusy(false);
  }, []);

  const onFile = (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => { setPhoto(ev.target.result); analyze(ev.target.result); };
    r.readAsDataURL(f); e.target.value="";
  };

  const addToCart = () => {
    if(!sel) return;
    const w = parseFloat(weight)||0;
    const q = parseInt(qty)||1;
    const sub = sel.item.unit==="個" ? sel.item.price*q : sel.item.price*w*q;
    setCart([...cart, {item:sel.item, weight:w, qty:q, subtotal:sub, photo}]);
    setSel(null); setWeight(""); setQty("1"); setPhoto(null); setScr("home");
  };

  const cartTotal = cart.reduce((s,c)=>s+c.subtotal,0);

  const reset = ()=>{ setScr("home"); setPhoto(null); setCandidates([]); setSel(null); setWeight(""); setQty("1"); setCart([]); setErr(""); setManualItem(null); setSearchQ(""); setBrowseCat(null); };

  const ConfBadge = ({val}) => {
    const p=Math.round(val*100);
    const col = p>=70?"#10B981":p>=40?"#F59E0B":"#EF4444";
    const lb = p>=70?"高確度":p>=40?"中確度":"低確度";
    return <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:col+"20",color:col,border:`1px solid ${col}40`}}>{lb} {p}%</span>;
  };

  /* ═══════ SCREENS ═══════ */

  /* ── HOME ── */
  if(scr==="home") return (
    <div style={S.pg}>
      <div style={S.hero}>
        <div style={S.logoBox}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="8" width="28" height="24" rx="3" fill="#F59E0B"/>
            <path d="M15 17l5 5 5-5" stroke="#78350F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 22v4" stroke="#78350F" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={S.ttl}>スクラップ<span style={{color:"#FBBF24"}}>AI</span>見積</h1>
        <p style={S.sub}>撮影するだけでAIが品目を識別<br/>当日単価で即時に買取価格を算出</p>
        <div style={S.live}><span style={S.dot}/>買取単価: 2026年4月6日 更新</div>
      </div>

      {cart.length>0 && (
        <div style={S.cartBanner}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:"#D1D5DB"}}>{cart.length}品目</span>
            <span style={{fontSize:18,fontWeight:800,color:"#FBBF24"}}>¥{cartTotal.toLocaleString()}</span>
          </div>
          <button style={{...S.sm,background:"#2563EB",marginTop:8,width:"100%"}} onClick={()=>setScr("summary")}>見積一覧を確認 →</button>
        </div>
      )}

      <div style={{padding:"0 20px"}}>
        <button style={S.big} onClick={()=>camRef.current?.click()}>
          <span style={{fontSize:28}}>📸</span>
          <div><div style={{fontSize:15,fontWeight:700}}>撮影して識別</div><div style={{fontSize:12,color:"#78350F",opacity:.7}}>カメラでスクラップを撮影</div></div>
        </button>
        <button style={{...S.big,background:"linear-gradient(135deg,#374151,#4B5563)"}} onClick={()=>galRef.current?.click()}>
          <span style={{fontSize:28}}>🖼️</span>
          <div><div style={{fontSize:15,fontWeight:700,color:"#F3F4F6"}}>写真から選択</div><div style={{fontSize:12,color:"#9CA3AF"}}>ライブラリから画像を選択</div></div>
        </button>
        <button style={{...S.big,background:"linear-gradient(135deg,#1E3A5F,#2563EB)"}} onClick={()=>{setScr("browse");setSearchQ("");setBrowseCat(null);}}>
          <span style={{fontSize:28}}>🔍</span>
          <div><div style={{fontSize:15,fontWeight:700,color:"#F3F4F6"}}>品目から検索</div><div style={{fontSize:12,color:"#93C5FD"}}>カテゴリ・名前から品目を選択</div></div>
        </button>
      </div>
      <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onFile}/>
      <input ref={galRef} type="file" accept="image/*" style={{display:"none"}} onChange={onFile}/>

      <div style={S.steps}>
        <div style={{fontSize:13,fontWeight:700,color:"#D1D5DB",marginBottom:12}}>使い方</div>
        {["スクラップの写真を撮影","AIが品目を自動識別","品目を確認し重量を入力","買取価格を即座に算出"].map((t,i)=>(
          <div key={i} style={S.step}><span style={S.stepN}>{i+1}</span><span style={{fontSize:13,color:"#D1D5DB"}}>{t}</span></div>
        ))}
      </div>
    </div>
  );

  /* ── BROWSE (カテゴリ検索) ── */
  if(scr==="browse") return (
    <div style={S.pg}>
      <div style={S.hdr}>
        <button style={S.back} onClick={()=>setScr("home")}>←</button>
        <span style={S.hdrT}>品目から検索</span><span/>
      </div>

      <div style={{padding:"12px 20px 8px",position:"sticky",top:48,zIndex:9,background:"#0F172A"}}>
        <input style={S.inp} placeholder="🔍 品目名・カテゴリで検索..." value={searchQ} onChange={e=>{setSearchQ(e.target.value);setBrowseCat(null);}} autoFocus/>
      </div>

      {/* ── 検索結果 ── */}
      {searchQ.trim() ? (
        <div style={{padding:"0 20px"}}>
          <div style={{fontSize:12,color:"#9CA3AF",marginBottom:10}}>{filteredItems.length}件の結果</div>
          {filteredItems.length===0 && <div style={{fontSize:13,color:"#6B7280",padding:"20px 0",textAlign:"center"}}>該当する品目が見つかりません</div>}
          {filteredItems.map((it,i)=>(
            <button key={i} style={S.browseItem} onClick={()=>{setManualItem(it);setWeight("");setQty("1");setScr("manual");}}>
              <CatIllustration cat={it.cat} size={48}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600}}>{it.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{it.cat} ｜ {it.hint}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:700,color:"#FBBF24"}}>¥{it.price.toLocaleString()}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>/{it.unit}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* ── カテゴリ一覧 ── */
        <div style={{padding:"0 20px"}}>
          {CAT_ORDER.map(cat=>{
            const items = CATS_GROUPED[cat]; if(!items) return null;
            const v = getCatVisual(cat);
            const isOpen = browseCat===cat;
            return (
              <div key={cat} style={{marginBottom:4}}>
                <button style={{...S.catBtn, borderLeft:`3px solid ${v.fg}`}} onClick={()=>setBrowseCat(isOpen?null:cat)}>
                  <CatIllustration cat={cat} size={36}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600}}>{cat}</div>
                    <div style={{fontSize:11,color:"#9CA3AF"}}>{items.length}品目</div>
                  </div>
                  <span style={{fontSize:16,color:"#9CA3AF",transition:"transform 0.2s",transform:isOpen?"rotate(90deg)":"none"}}>›</span>
                </button>
                {isOpen && (
                  <div style={{paddingLeft:8,borderLeft:`3px solid ${v.fg}22`}}>
                    {items.map((it,j)=>(
                      <button key={j} style={S.browseItem} onClick={()=>{setManualItem(it);setWeight("");setQty("1");setScr("manual");}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600}}>{it.name}</div>
                          <div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>{it.hint}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:14,fontWeight:700,color:"#FBBF24"}}>¥{it.price.toLocaleString()}</div>
                          <div style={{fontSize:10,color:"#9CA3AF"}}>/{it.unit}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ── MANUAL (カテゴリ検索からの品目詳細→重量入力) ── */
  if(scr==="manual" && manualItem) {
    const calcTotal = manualItem.unit==="個" ? manualItem.price*(parseInt(qty)||1) : manualItem.price*(parseFloat(weight)||0)*(parseInt(qty)||1);
    return (
      <div style={S.pg}>
        <div style={S.hdr}>
          <button style={S.back} onClick={()=>setScr("browse")}>←</button>
          <span style={S.hdrT}>品目詳細</span><span/>
        </div>

        <div style={{padding:"0 20px"}}>
          <div style={S.selCard}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <CatIllustration cat={manualItem.cat} size={64}/>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{manualItem.cat}</div>
                <div style={{fontSize:17,fontWeight:700,marginTop:2}}>{manualItem.name}</div>
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:3}}>{manualItem.hint}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:14}}>
              <div style={{fontSize:26,fontWeight:800,color:"#FBBF24"}}>
                ¥{manualItem.price.toLocaleString()}<span style={{fontSize:13,fontWeight:400,color:"#9CA3AF"}}>/{manualItem.unit}</span>
              </div>
              <a href={`https://www.ohata.org/${manualItem.page}.html`} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#60A5FA",textDecoration:"none"}}>
                大畑商事で詳細を見る ↗
              </a>
            </div>
          </div>

          {manualItem.unit==="kg" && (
            <div style={{marginTop:16}}>
              <label style={S.lbl}>概算重量 (kg)</label>
              <div style={{position:"relative"}}>
                <input style={S.inp} type="number" placeholder="例: 50" value={weight} onChange={e=>setWeight(e.target.value)} autoFocus/>
                <span style={S.unit}>kg</span>
              </div>
            </div>
          )}
          <div style={{marginTop:12}}>
            <label style={S.lbl}>数量</label>
            <input style={S.inp} type="number" placeholder="1" value={qty} onChange={e=>setQty(e.target.value)}/>
          </div>

          {(manualItem.unit==="個" || parseFloat(weight)>0) && (
            <div style={S.priceBox}>
              <div style={{fontSize:12,color:"#9CA3AF"}}>概算買取価格</div>
              <div style={{fontSize:34,fontWeight:800,color:"#FBBF24",marginTop:4}}>¥{calcTotal.toLocaleString()}</div>
              <div style={{fontSize:12,color:"#6EE7B7",marginTop:6}}>
                ±20%: ¥{Math.floor(calcTotal*0.8).toLocaleString()} 〜 ¥{Math.floor(calcTotal*1.2).toLocaleString()}
              </div>
            </div>
          )}

          <button style={{...S.big,marginTop:16}} onClick={addManualToCart}>
            <span style={{fontSize:22}}>＋</span><div style={{fontSize:15,fontWeight:700}}>見積に追加</div>
          </button>
        </div>
      </div>
    );
  }

  /* ── ANALYZING ── */
  if(scr==="analyzing") return (
    <div style={S.pg}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20}}>
        {photo && <img src={photo} alt="" style={{width:180,height:180,objectFit:"cover",borderRadius:16,border:"2px solid rgba(245,158,11,0.3)"}}/>}
        <div style={{width:36,height:36,border:"3px solid rgba(245,158,11,0.2)",borderTop:"3px solid #F59E0B",borderRadius:"50%",marginTop:24,animation:"spin 1s linear infinite"}}/>
        <div style={{fontSize:16,fontWeight:700,marginTop:20,color:"#FBBF24"}}>AI解析中...</div>
        <p style={{fontSize:13,color:"#9CA3AF",marginTop:8}}>画像から品目を識別しています</p>
      </div>
    </div>
  );

  /* ── RESULTS ── */
  if(scr==="results") return (
    <div style={S.pg}>
      <div style={S.hdr}>
        <button style={S.back} onClick={()=>{setScr("home");setPhoto(null);setCandidates([]);setErr("");}}>←</button>
        <span style={S.hdrT}>識別結果</span><span/>
      </div>

      {photo && <img src={photo} alt="" style={{width:"100%",height:180,objectFit:"cover",borderBottom:"2px solid rgba(245,158,11,0.2)"}}/>}

      {err ? (
        <div style={S.errBox}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>⚠️ {err}</div>
          <button style={{...S.sm,background:"#374151",marginTop:10}} onClick={()=>{setScr("home");setErr("");}}>再撮影する</button>
        </div>
      ) : sel ? (
        /* ── 確定 → 重量入力 ── */
        <div style={{padding:"0 20px"}}>
          <div style={S.selCard}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <CatIllustration cat={sel.item.cat} size={56}/>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{sel.item.cat}</div>
                <div style={{fontSize:16,fontWeight:700,marginTop:1}}>{sel.item.name}</div>
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>{sel.item.hint}</div>
              </div>
              <button style={{...S.sm,background:"#374151",fontSize:11,padding:"6px 10px"}} onClick={()=>setSel(null)}>変更</button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:14}}>
              <div style={{fontSize:24,fontWeight:800,color:"#FBBF24"}}>
                ¥{sel.item.price.toLocaleString()}<span style={{fontSize:13,fontWeight:400,color:"#9CA3AF"}}>/{sel.item.unit}</span>
              </div>
              <a href={`https://www.ohata.org/${sel.item.page}.html`} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#60A5FA",textDecoration:"none"}}>
                大畑商事で詳細を見る ↗
              </a>
            </div>
          </div>

          {sel.item.unit==="kg" && (
            <div style={{marginTop:14}}>
              <label style={S.lbl}>概算重量 (kg)</label>
              <div style={{position:"relative"}}>
                <input style={S.inp} type="number" placeholder="例: 50" value={weight} onChange={e=>setWeight(e.target.value)} autoFocus/>
                <span style={S.unit}>kg</span>
              </div>
            </div>
          )}
          <div style={{marginTop:10}}>
            <label style={S.lbl}>数量</label>
            <input style={S.inp} type="number" placeholder="1" value={qty} onChange={e=>setQty(e.target.value)}/>
          </div>

          {(sel.item.unit==="個" || parseFloat(weight)>0) && (() => {
            const total = sel.item.unit==="個" ? sel.item.price*(parseInt(qty)||1) : sel.item.price*(parseFloat(weight)||0)*(parseInt(qty)||1);
            return (
              <div style={S.priceBox}>
                <div style={{fontSize:12,color:"#9CA3AF"}}>概算買取価格</div>
                <div style={{fontSize:34,fontWeight:800,color:"#FBBF24",marginTop:4}}>¥{total.toLocaleString()}</div>
                <div style={{fontSize:12,color:"#6EE7B7",marginTop:6}}>
                  ±20%: ¥{Math.floor(total*0.8).toLocaleString()} 〜 ¥{Math.floor(total*1.2).toLocaleString()}
                </div>
              </div>
            );
          })()}

          <button style={{...S.big,marginTop:14}} onClick={addToCart}>
            <span style={{fontSize:22}}>＋</span><div style={{fontSize:15,fontWeight:700}}>見積に追加</div>
          </button>
        </div>
      ) : (
        /* ── 候補一覧 ── */
        <div style={{padding:"0 20px"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#D1D5DB",margin:"16px 0 12px"}}>
            {candidates.length>1 ? "候補が見つかりました — 正しい品目を選択してください" : "品目が識別されました"}
          </div>
          {aiNotes && <div style={S.noteBox}>{aiNotes}</div>}

          {candidates.map((c,i)=>(
            <button key={i} style={S.candCard} onClick={()=>setSel(c)}>
              <div style={{display:"flex",gap:12}}>
                {/* ── カテゴリイラスト ── */}
                <CatIllustration cat={c.item.cat} size={68}/>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,fontWeight:700}}>{c.name}</span>
                    <ConfBadge val={c.confidence}/>
                  </div>
                  <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{c.item.cat} ｜ {c.item.hint}</div>
                  <div style={{fontSize:13,color:"#D1D5DB",marginTop:6}}>{c.reason}</div>
                  {c.differentiation_hint && (
                    <div style={S.hintBox}>💡 {c.differentiation_hint}</div>
                  )}
                </div>

                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:17,fontWeight:800,color:"#FBBF24"}}>¥{c.item.price.toLocaleString()}</div>
                  <div style={{fontSize:11,color:"#9CA3AF"}}>/{c.item.unit}</div>
                  <a href={`https://www.ohata.org/${c.item.page}.html`} target="_blank" rel="noreferrer"
                    style={{fontSize:10,color:"#60A5FA",textDecoration:"none",display:"inline-block",marginTop:6}}
                    onClick={e=>e.stopPropagation()}>
                    参照画像 ↗
                  </a>
                </div>
              </div>
            </button>
          ))}

          <button style={{...S.sm,background:"#374151",width:"100%",marginTop:6}} onClick={()=>{setScr("home");setPhoto(null);}}>再撮影する</button>
        </div>
      )}
    </div>
  );

  /* ── SUMMARY ── */
  if(scr==="summary") return (
    <div style={S.pg}>
      <div style={S.hdr}>
        <button style={S.back} onClick={()=>setScr("home")}>←</button>
        <span style={S.hdrT}>見積一覧</span><span/>
      </div>
      <div style={{textAlign:"center",padding:"24px 20px 16px",background:"linear-gradient(180deg,rgba(245,158,11,0.06) 0%,transparent 100%)"}}>
        <div style={{fontSize:13,color:"#9CA3AF"}}>合計買取概算額（税込）</div>
        <div style={{fontSize:36,fontWeight:800,color:"#FBBF24",marginTop:4}}>¥{cartTotal.toLocaleString()}</div>
        <div style={{fontSize:13,color:"#6EE7B7",marginTop:6}}>±20%: ¥{Math.floor(cartTotal*0.8).toLocaleString()} 〜 ¥{Math.floor(cartTotal*1.2).toLocaleString()}</div>
        <div style={{fontSize:12,color:"#9CA3AF",marginTop:6}}>{cart.length}品目</div>
      </div>

      <div style={{padding:"0 20px"}}>
        {cart.map((c,i)=>(
          <div key={i} style={S.cartItem}>
            <div style={{display:"flex",gap:10}}>
              <CatIllustration cat={c.item.cat} size={52}/>
              {c.photo && <img src={c.photo} alt="" style={{width:52,height:52,objectFit:"cover",borderRadius:8,flexShrink:0}}/>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{c.item.cat}</div>
                <div style={{fontSize:13,fontWeight:600}}>{c.item.name}</div>
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:3}}>
                  {c.item.unit==="個" ? `${c.qty}個 × ¥${c.item.price.toLocaleString()}/個` : `${c.weight}kg${c.qty>1?` × ${c.qty}`:""} × ¥${c.item.price.toLocaleString()}/kg`}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:700,color:"#FBBF24"}}>¥{c.subtotal.toLocaleString()}</div>
                <button style={{fontSize:11,color:"#EF4444",background:"none",border:"none",marginTop:4,cursor:"pointer"}}
                  onClick={()=>setCart(cart.filter((_,j)=>j!==i))}>削除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:"0 20px",marginTop:8}}>
        <button style={S.big} onClick={()=>setScr("home")}>
          <span style={{fontSize:22}}>📸</span><div style={{fontSize:15,fontWeight:700}}>品目を追加撮影</div>
        </button>
        <button style={{...S.big,background:"linear-gradient(135deg,#2563EB,#3B82F6)"}}
          onClick={()=>setScr("share")}>
          <span style={{fontSize:22}}>📤</span><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>社長に共有する</div>
        </button>
        <button style={{...S.sm,background:"#374151",width:"100%",marginTop:4}} onClick={reset}>新しい見積を作成</button>
      </div>
      <div style={{padding:"16px 20px",fontSize:11,color:"#64748B"}}>※ 概算（±20%）。正式価格は実物確認後に確定。</div>
    </div>
  );

  /* ── SHARE ── */
  if(scr==="share") return (
    <div style={S.pg}>
      <div style={S.hdr}>
        <button style={S.back} onClick={()=>setScr("summary")}>←</button>
        <span style={S.hdrT}>共有</span><span/>
      </div>
      <div style={{padding:"28px 20px",textAlign:"center"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#D1D5DB",marginBottom:16}}>共有方法を選択</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{icon:"💬",l:"LINE",bg:"#06C755"},{icon:"✉️",l:"メール",bg:"#2563EB"},{icon:"📋",l:"コピー",bg:"#6B7280"},{icon:"📄",l:"PDF",bg:"#7C3AED"}].map((o,i)=>(
            <button key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:18,borderRadius:14,cursor:"pointer",border:`1px solid ${o.bg}44`,background:`${o.bg}18`,color:"#F3F4F6"}}>
              <span style={{fontSize:30}}>{o.icon}</span><span style={{fontSize:12,fontWeight:600}}>{o.l}</span>
            </button>
          ))}
        </div>
        <div style={{marginTop:24,textAlign:"left",padding:16,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#9CA3AF",marginBottom:8}}>共有プレビュー</div>
          <div style={{fontSize:14,fontWeight:700}}>スクラップ買取見積（概算）</div>
          <div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>2026年4月6日</div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",margin:"10px 0",paddingTop:10}}>
            {cart.map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0"}}>
                <span>{c.item.name} ({c.item.unit==="個"?`${c.qty}個`:`${c.weight}kg`})</span>
                <span style={{fontWeight:600}}>¥{c.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid rgba(245,158,11,0.3)",paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700}}>
            <span>合計</span><span style={{color:"#FBBF24"}}>¥{cartTotal.toLocaleString()}</span>
          </div>
          <div style={{fontSize:11,color:"#6B7280",marginTop:8}}>※ 概算（±20%）。正式価格は実物確認後に確定。</div>
        </div>
      </div>
    </div>
  );

  return null;
}

/* ═══ STYLES ═══ */
const S = {
  pg:{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"linear-gradient(180deg,#0F172A,#1E293B)",color:"#F3F4F6",fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif",paddingBottom:40},
  hero:{textAlign:"center",padding:"40px 20px 24px"},
  logoBox:{width:64,height:64,borderRadius:16,background:"rgba(245,158,11,0.1)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14},
  ttl:{fontSize:24,fontWeight:800,margin:"0 0 8px",color:"#F3F4F6"},
  sub:{fontSize:13,color:"#94A3B8",lineHeight:1.7,margin:0},
  live:{display:"inline-flex",alignItems:"center",gap:6,marginTop:12,fontSize:11,color:"#6EE7B7",background:"rgba(16,185,129,0.08)",padding:"4px 12px",borderRadius:20},
  dot:{width:5,height:5,borderRadius:"50%",background:"#10B981",display:"inline-block"},
  big:{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"16px 20px",fontSize:16,fontWeight:700,color:"#78350F",background:"linear-gradient(135deg,#F59E0B,#FBBF24)",border:"none",borderRadius:14,cursor:"pointer",marginBottom:10,textAlign:"left"},
  sm:{padding:"10px 16px",fontSize:13,fontWeight:600,color:"#F3F4F6",background:"#2563EB",border:"none",borderRadius:10,cursor:"pointer"},
  steps:{padding:"20px 20px 0"},
  step:{display:"flex",alignItems:"center",gap:12,marginBottom:8},
  stepN:{width:24,height:24,borderRadius:"50%",background:"rgba(245,158,11,0.12)",color:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0},
  hdr:{display:"flex",alignItems:"center",padding:"12px 16px",background:"rgba(0,0,0,0.25)",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(12px)"},
  back:{background:"none",border:"none",color:"#FBBF24",fontSize:20,cursor:"pointer",padding:"4px 8px"},
  hdrT:{flex:1,textAlign:"center",fontSize:15,fontWeight:700},
  errBox:{margin:"20px",padding:20,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14},
  candCard:{width:"100%",padding:14,marginBottom:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,cursor:"pointer",textAlign:"left",color:"#F3F4F6"},
  hintBox:{fontSize:12,color:"#93C5FD",background:"rgba(59,130,246,0.08)",padding:"6px 10px",borderRadius:8,marginTop:8,lineHeight:1.5},
  noteBox:{fontSize:12,color:"#D1D5DB",background:"rgba(255,255,255,0.04)",padding:"10px 12px",borderRadius:10,marginBottom:12,lineHeight:1.6},
  selCard:{padding:16,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:14,marginTop:14},
  lbl:{fontSize:13,fontWeight:600,color:"#D1D5DB",marginBottom:6,display:"block"},
  inp:{width:"100%",padding:"13px 16px",fontSize:16,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,color:"#F3F4F6",outline:"none",boxSizing:"border-box"},
  unit:{position:"absolute",right:14,top:13,fontSize:14,color:"#9CA3AF"},
  priceBox:{textAlign:"center",padding:18,marginTop:14,background:"rgba(245,158,11,0.06)",borderRadius:14,border:"1px solid rgba(245,158,11,0.15)"},
  cartBanner:{margin:"0 20px 14px",padding:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14},
  cartItem:{padding:12,marginBottom:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12},
  browseItem:{width:"100%",display:"flex",gap:10,alignItems:"center",padding:"12px 14px",marginBottom:6,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,cursor:"pointer",textAlign:"left",color:"#F3F4F6"},
  catBtn:{width:"100%",display:"flex",gap:10,alignItems:"center",padding:"12px 14px",marginBottom:4,background:"rgba(255,255,255,0.04)",border:"none",borderRadius:12,cursor:"pointer",textAlign:"left",color:"#F3F4F6"},
};

/* ── Global CSS ── */
const st = document.createElement("style");
st.textContent=`@keyframes spin{to{transform:rotate(360deg)}}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}button:active{opacity:.85;transform:scale(.98)}`;
document.head.appendChild(st);
