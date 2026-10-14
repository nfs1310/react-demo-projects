export interface CoinImage {
  thumb: string;
  small: string;
  large: string;
}

export interface Platforms {
  [key: string]: string;
}

export interface DetailPlatform {
  decimal_place: number | null;
  contract_address: string;
}

export interface DetailPlatforms {
  [key: string]: DetailPlatform;
}

export interface Description {
  en: string;
}

export interface ReposUrl {
  github: string[];
  bitbucket: string[];
}

export interface Links {
  homepage: string[];
  whitepaper: string | null;
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  snapshot_url: string | null;
  twitter_screen_name: string | null;
  facebook_username: string | null;
  bitcointalk_thread_identifier: number | null;
  telegram_channel_identifier: string | null;
  subreddit_url: string | null;
  repos_url: ReposUrl;
}

export interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export interface CurrencyPrice {
  vef: number;
  btc: number;
  bits: number;
  sats: number;
  eth: number;
  ltc: number;
  bch: number;
  bnb: number;
  eos: number;
  xrp: number;
  xlm: number;
  link: number;
  dot: number;
  yfi: number;
  sol: number;
  usd: number;
  aed: number;
  ars: number;
  aud: number;
  bdt: number;
  bhd: number;
  bmd: number;
  brl: number;
  cad: number;
  chf: number;
  clp: number;
  cny: number;
  czk: number;
  dkk: number;
  eur: number;
  gbp: number;
  gel: number;
  hkd: number;
  huf: number;
  idr: number;
  ils: number;
  inr: number;
  jpy: number;
  krw: number;
  kwd: number;
  lkr: number;
  mmk: number;
  mxn: number;
  myr: number;
  ngn: number;
  nok: number;
  nzd: number;
  php: number;
  pkr: number;
  pln: number;
  rub: number;
  sar: number;
  sek: number;
  sgd: number;
  thb: number;
  try: number;
  twd: number;
  uah: number;
  vnd: number;
  zar: number;
  xdr: number;
  xag: number;
  xau: number;
}

export interface CurrencyDate {
  vef: string;
  btc: string;
  bits: string;
  sats: string;
  eth: string;
  ltc: string;
  bch: string;
  bnb: string;
  eos: string;
  xrp: string;
  xlm: string;
  link: string;
  dot: string;
  yfi: string;
  sol: string;
  usd: string;
  aed: string;
  ars: string;
  aud: string;
  bdt: string;
  bhd: string;
  bmd: string;
  brl: string;
  cad: string;
  chf: string;
  clp: string;
  cny: string;
  czk: string;
  dkk: string;
  eur: string;
  gbp: string;
  gel: string;
  hkd: string;
  huf: string;
  idr: string;
  ils: string;
  inr: string;
  jpy: string;
  krw: string;
  kwd: string;
  lkr: string;
  mmk: string;
  mxn: string;
  myr: string;
  ngn: string;
  nok: string;
  nzd: string;
  php: string;
  pkr: string;
  pln: string;
  rub: string;
  sar: string;
  sek: string;
  sgd: string;
  thb: string;
  try: string;
  twd: string;
  uah: string;
  vnd: string;
  zar: string;
  xdr: string;
  xag: string;
  xau: string;
}

export interface CurrencyPercentage {
  vef: number;
  btc: number;
  bits: number;
  sats: number;
  eth: number;
  ltc: number;
  bch: number;
  bnb: number;
  eos: number;
  xrp: number;
  xlm: number;
  link: number;
  dot: number;
  yfi: number;
  sol: number;
  usd: number;
  aed: number;
  ars: number;
  aud: number;
  bdt: number;
  bhd: number;
  bmd: number;
  brl: number;
  cad: number;
  chf: number;
  clp: number;
  cny: number;
  czk: number;
  dkk: number;
  eur: number;
  gbp: number;
  gel: number;
  hkd: number;
  huf: number;
  idr: number;
  ils: number;
  inr: number;
  jpy: number;
  krw: number;
  kwd: number;
  lkr: number;
  mmk: number;
  mxn: number;
  myr: number;
  ngn: number;
  nok: number;
  nzd: number;
  php: number;
  pkr: number;
  pln: number;
  rub: number;
  sar: number;
  sek: number;
  sgd: number;
  thb: number;
  try: number;
  twd: number;
  uah: number;
  vnd: number;
  zar: number;
  xdr: number;
  xag: number;
  xau: number;
}

export interface MarketData {
  current_price: CurrencyPrice;
  total_value_locked: number | null;
  mcap_to_tvl_ratio: number | null;
  fdv_to_tvl_ratio: number | null;
  roi: Roi | null;
  ath: CurrencyPrice;
  ath_change_percentage: CurrencyPercentage;
  ath_date: CurrencyDate;
  atl: CurrencyPrice;
  atl_change_percentage: CurrencyPercentage;
  atl_date: CurrencyDate;
  market_cap: CurrencyPrice;
  market_cap_rank: number;
  outstanding_token_value_usd: number | null;
  market_cap_rank_with_rehypothecated: number;
  fully_diluted_valuation: CurrencyPrice;
  market_cap_fdv_ratio: number;
  total_volume: CurrencyPrice;
  high_24h: CurrencyPrice;
  low_24h: CurrencyPrice;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_24h_in_currency: CurrencyPrice;
  price_change_percentage_1h_in_currency: CurrencyPercentage;
  price_change_percentage_24h_in_currency: CurrencyPercentage;
  price_change_percentage_7d_in_currency: CurrencyPercentage;
  price_change_percentage_14d_in_currency: CurrencyPercentage;
  price_change_percentage_30d_in_currency: CurrencyPercentage;
  price_change_percentage_60d_in_currency: CurrencyPercentage;
  price_change_percentage_200d_in_currency: CurrencyPercentage;
  price_change_percentage_1y_in_currency: CurrencyPercentage;
  market_cap_change_24h_in_currency: CurrencyPrice;
  market_cap_change_percentage_24h_in_currency: CurrencyPercentage;
  total_supply: number;
  max_supply: number;
  max_supply_infinite: boolean;
  circulating_supply: number;
  outstanding_supply: number;
  last_updated: string;
}

export interface StatusUpdate {
  [key: string]: any;
}

export default interface Coin {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  asset_platform_id: string | null;
  platforms: Platforms;
  detail_platforms: DetailPlatforms;
  block_time_in_minutes: number;
  hashing_algorithm: string | null;
  categories: string[];
  preview_listing: boolean;
  public_notice: string | null;
  additional_notices: string[];
  description: Description;
  links: Links;
  image: CoinImage;
  country_origin: string;
  genesis_date: string | null;
  listing_price: number | null;
  listing_currency: string;
  listing_timestamp: number | null;
  listing_source: string;
  listing_source_url: string;
  has_supply_breakdown: boolean;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_cap_rank_with_rehypothecated: number;
  market_data: MarketData;
  status_updates: StatusUpdate[];
  last_updated: string;
}
