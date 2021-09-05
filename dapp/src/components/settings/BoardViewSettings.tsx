import useSettings from "hooks/useSettings";

export default function BoardViewSettings() {
  const [settings, setSettings] = useSettings();

  return (
    <details>
      <summary>View settings</summary>
      <div className="bg-secondary p-2 max-w-sm">
        <div>
          <label className="px-2" htmlFor="dchan-input-view-mode">
            Board view mode
          </label>
          <select
            id="dchan-input-view-mode"
            onChange={(e) => {
              setSettings({
                ...settings,
                content_view: {
                  ...settings?.content_view,
                  board_view_mode: e.target.value,
                },
              });
            }}
            value={settings?.content_view?.board_view_mode}
          >
            <option value={"catalog"}>{"Catalog"}</option>
            <option value={"threads"}>{"Threads"}</option> 
          </select>
        </div>
        <div>
          <label className="px-2" htmlFor="dchan-input-view-mode">
            Page size
          </label>
          <input
            id="dchan-input-page-size"
            type="number"
            min={1}
            value={settings?.content_view?.board_page_size}
            onChange={(e) => {
              setSettings({
                ...settings,
                content_view: {
                  ...settings?.content_view,
                  board_page_size: e.target.value,
                },
              });
            }} />
        </div>
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
            <option value={"postsPerMinute"}>{"Posts per minute"}</option>
          </select>
        </div>
      </div>
    </details>
  );
}
