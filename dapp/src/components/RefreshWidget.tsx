import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useInterval } from "react-use";

export function RefreshWidget({ onRefresh }: { onRefresh: () => void }) {
  const [lastRefreshedRelative, setLastRefreshedAtRelative] =
    useState<string>("");

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );

  const refreshLastRefreshedAtRelative = useCallback(() => {
    if (lastRefreshedAt.diffNow().toMillis() === 0) {
      return;
    }

    setLastRefreshedAtRelative(lastRefreshedAt.toRelative() || "");
  }, [lastRefreshedAt, setLastRefreshedAtRelative]);

  useEffect(() => {
    refreshLastRefreshedAtRelative();
  }, [lastRefreshedAt, refreshLastRefreshedAtRelative]);

  useInterval(() => {
    refreshLastRefreshedAtRelative();
  }, 1_000);

  const onClick = useCallback(() => {
    setLastRefreshedAt(DateTime.now());
    onRefresh();
  }, [setLastRefreshedAt, onRefresh]);

  return (
    <span className="mx-1">
      [
      <button
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
        onClick={onClick}
      >
        {lastRefreshedRelative}
      </button>
      ]
    </span>
  );
}
