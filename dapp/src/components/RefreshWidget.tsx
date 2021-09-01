import useSettings from "hooks/useSettings";
import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useInterval } from "react-use";

export function RefreshWidget({ onRefresh }: { onRefresh: () => void }) {
  const [settings, setSettings] = useSettings();

  const [lastRefreshedRelative, setLastRefreshedAtRelative] =
    useState<string>("");

  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>(
    DateTime.now()
  );

  const refresh = useCallback(() => {
    setLastRefreshedAt(DateTime.now());
    onRefresh();
  }, [setLastRefreshedAt, onRefresh]);

  const updateLastRefreshedAt = useCallback(() => {
    const diffSeconds = -(lastRefreshedAt.diffNow().toMillis() / 1000);
    if (
      settings?.autorefresh?.enabled &&
      diffSeconds > (settings?.autorefresh?.seconds || Number.MAX_SAFE_INTEGER)
    ) {
      refresh();
    } else if (diffSeconds === 0) {
      return;
    } else {
      setLastRefreshedAtRelative(lastRefreshedAt.toRelative() || "");
    }
  }, [settings, lastRefreshedAt, setLastRefreshedAtRelative, refresh]);

  useEffect(() => {
    updateLastRefreshedAt();
  }, [lastRefreshedAt, updateLastRefreshedAt]);

  useInterval(() => {
    updateLastRefreshedAt();
  }, 1_000);

  return (
    <span className="mx-1 flex items-start">
      <details>
        <summary>
          [
          <button
            className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
            onClick={refresh}
          >
            {lastRefreshedRelative}
          </button>
          ]
        </summary>
        <div className="bg-secondary p-2">
          <div>
            <label htmlFor="dchan-input-refresh-toggle">
              Enable autorefresh
            </label>
            <input
              id="dchan-input-refresh-toggle"
              className="mx-1 text-xs whitespace-nowrap"
              type="checkbox"
              checked={settings?.autorefresh?.enabled}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  autorefresh: {
                    ...settings?.autorefresh,
                    enabled: e.target.checked,
                  },
                });
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="dchan-input-autorefresh-interval">
              Autorefresh interval (seconds)
            </label>
            <input
              id="dchan-input-autorefresh-interval"
              className="mx-1 text-xs whitespace-nowrap"
              type="number"
              min="10"
              value={settings?.autorefresh?.seconds}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  autorefresh: {
                    ...settings?.autorefresh,
                    seconds: e.target.value,
                  },
                });
              }}
            ></input>
          </div>
        </div>
      </details>
    </span>
  );
}