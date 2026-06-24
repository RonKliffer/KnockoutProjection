const TEAM_COUNTRY_CODES: Record<string, string> = {
  "algeria": "DZ",
  "argentina": "AR",
  "australia": "AU",
  "austria": "AT",
  "belgium": "BE",
  "bosnia and herzegovina": "BA",
  "brazil": "BR",
  "canada": "CA",
  "cape verde": "CV",
  "colombia": "CO",
  "costa rica": "CR",
  "croatia": "HR",
  "curacao": "CW",
  "czech republic": "CZ",
  "czechia": "CZ",
  "denmark": "DK",
  "dominican republic": "DO",
  "dr congo": "CD",
  "congo dr": "CD",
  "ecuador": "EC",
  "egypt": "EG",
  "france": "FR",
  "germany": "DE",
  "ghana": "GH",
  "haiti": "HT",
  "iran": "IR",
  "iraq": "IQ",
  "ivory coast": "CI",
  "cote d ivoire": "CI",
  "japan": "JP",
  "jordan": "JO",
  "mexico": "MX",
  "morocco": "MA",
  "netherlands": "NL",
  "new zealand": "NZ",
  "norway": "NO",
  "panama": "PA",
  "paraguay": "PY",
  "portugal": "PT",
  "qatar": "QA",
  "saudi arabia": "SA",
  "senegal": "SN",
  "south africa": "ZA",
  "south korea": "KR",
  "spain": "ES",
  "sweden": "SE",
  "switzerland": "CH",
  "turkey": "TR",
  "turkiye": "TR",
  "united states": "US",
  "usa": "US",
  "uruguay": "UY",
  "uzbekistan": "UZ"
};

const TEAM_FLAG_OVERRIDES: Record<string, string> = {
  "england": subdivisionFlagEmoji("gbeng"),
  "scotland": subdivisionFlagEmoji("gbsct"),
  "wales": subdivisionFlagEmoji("gbwls")
};

export function teamFlag(teamName: string): string {
  const normalized = normalizeTeamName(teamName);
  if (!normalized || isPlaceholderTeam(normalized)) {
    return "";
  }

  const flagOverride = TEAM_FLAG_OVERRIDES[normalized];
  if (flagOverride) {
    return flagOverride;
  }

  const countryCode = TEAM_COUNTRY_CODES[normalized];
  return countryCode ? countryCodeToFlag(countryCode) : "";
}

function normalizeTeamName(teamName: string): string {
  return teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isPlaceholderTeam(normalizedTeamName: string): boolean {
  return /^(winner|loser|runner up|3rd|third place)\b/.test(normalizedTeamName);
}

function countryCodeToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65))
    .join("");
}

function subdivisionFlagEmoji(subdivisionCode: string): string {
  return String.fromCodePoint(
    0x1f3f4,
    ...subdivisionCode.toLowerCase().split("").map((letter) => 0xe0000 + letter.charCodeAt(0)),
    0xe007f
  );
}
