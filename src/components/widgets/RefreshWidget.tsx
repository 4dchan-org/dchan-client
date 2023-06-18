import { useLocalSettings } from "src/hooks";
import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useInterval } from "react-use";
import { Menu } from "../Menu";

export const RefreshWidget = ({ onRefresh }: { onRefresh: () => void }) => {
  const [settings, setSettings] = useLocalSettings();

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
    <span className="mx-2 flex whitespace-nowrap select-none">
      <div>
        <span>
          [
          <button
            className="dchan-link"
            onClick={refresh}
          >
            {lastRefreshedRelative || "Refreshing..."}
          </button>
          ]
        </span>
        <Menu>
          <div>
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
                  settings && setSettings({
                    ...settings,
                    autorefresh: {
                      ...settings.autorefresh,
                      enabled: e.target.checked,
                    },
                  });
                }}
              />
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
                  settings && setSettings({
                    ...settings,
                    autorefresh: {
                      ...settings.autorefresh,
                      seconds: Number(e.target.value),
                    },
                  });
                }}
              ></input>
            </div>
          </div>
        </Menu>
      </div>
    </span>
  );
}
