import useSettings from "hooks/useSettings";

export default function BoardViewSettings() {
  const [settings, setSettings] = useSettings();

  return (
    <span className="flex flex-wrap text-xs justify-end">
      <details>
        <summary>
          <span className="inline-block">
            <div>
              <label className="px-2" htmlFor="dchan-input-view-mode">
                Sort by
              </label>
              <select
                id="dchan-input-view-mode"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    content_view: {
                      ...settings?.content_view,
                      board_sort_threads_by: e.target.value,
                    },
                  });
                }}
                value={settings?.content_view?.board_sort_threads_by}
              >
                <option value={"lastBumpedAt"}>{"Last bumped at"}</option>
                <option value={"replyCount"}>{"Reply count"}</option>
                <option value={"imageCount"}>{"File count"}</option>
              </select>
            </div>
            <div>
              <label className="px-2" htmlFor="dchan-input-view-mode">
                Sort direction
              </label>
              <select
                id="dchan-input-view-mode"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    content_view: {
                      ...settings?.content_view,
                      board_sort_direction: e.target.value,
                    },
                  });
                }}
                value={settings?.content_view?.board_sort_direction}
              >
                <option value={"asc"}>{"Ascending"}</option>
                <option value={"desc"}>{"Descending"}</option>
              </select>
            </div>
          </span>
        </summary>
        <span>
          <label className="px-2" htmlFor="dchan-input-view-mode">
            Page size
          </label>
          <input
            id="dchan-input-page-size"
            type="number"
            min={1}
            value={settings?.content_view?.page_size}
            onChange={(e) => {
              setSettings({
                ...settings,
                content_view: {
                  ...settings?.content_view,
                  page_size: e.target.value,
                },
              });
            }}
          />
        </span>
      </details>
    </span>
  );
}
