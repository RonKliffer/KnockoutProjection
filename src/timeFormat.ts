export interface MatchSchedule {
  date: string;
  time: string;
  kickoffAt?: string;
  venue?: string;
}

export function formatMatchSchedule(match: MatchSchedule, timeZone?: string): string {
  if (!match.kickoffAt) {
    return [match.date, match.time, match.venue].filter(Boolean).join(" · ");
  }

  const kickoff = new Date(match.kickoffAt);
  if (Number.isNaN(kickoff.getTime())) {
    return [match.date, match.time, match.venue].filter(Boolean).join(" · ");
  }

  const formatOptions = timeZone ? { timeZone } : {};
  const date = new Intl.DateTimeFormat("en-US", {
    ...formatOptions,
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(kickoff);
  const time = new Intl.DateTimeFormat("en-US", {
    ...formatOptions,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(kickoff);

  return [date, time, match.venue].filter(Boolean).join(" · ");
}
