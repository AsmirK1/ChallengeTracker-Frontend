import { useEffect, useMemo, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/shared/api/leaderboard.api";

type SortKey = "rank" | "userName" | "totalPoints";
type SortDir = "asc" | "desc";

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setLoading(true);
    setError(null);

    getLeaderboard()
      .then(rows => setData(rows))
      .catch(e => setError(e?.message ?? "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    const copy = [...data];
    const dir = sortDir === "asc" ? 1 : -1;

    copy.sort((a, b) => {
      if (sortKey === "userName") {
        return a.userName.localeCompare(b.userName) * dir;
      }
      return ((a[sortKey] ?? 0) - (b[sortKey] ?? 0)) * dir;
    });

    return copy;
  }, [data, sortKey, sortDir]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => setSortKey("rank")}>Rank</th>
          <th onClick={() => setSortKey("userName")}>User</th>
          <th onClick={() => setSortKey("totalPoints")}>Points</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(row => (
          <tr key={row.userId}>
            <td>{row.rank}</td>
            <td>{row.userName}</td>
            <td>{row.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}