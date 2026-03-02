export const SAPPHIRE_RATE = 50 // $1 USD = 50 sapphires

export const sapphiresToUSD = (sapphires: number): string =>
  (sapphires / SAPPHIRE_RATE).toFixed(2)

export const usdToSapphires = (usd: number): number =>
  Math.floor(usd * SAPPHIRE_RATE)

export const formatSapphires = (sapphires: number): string =>
  sapphires.toLocaleString()

export const sapphiresToCents = (sapphires: number): number =>
  Math.round((sapphires / SAPPHIRE_RATE) * 100)
