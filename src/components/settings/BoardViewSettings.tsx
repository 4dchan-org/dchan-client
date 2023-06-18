import { useLocalSettings } from "src/hooks";

export const BoardViewSettings = () => {
  const [settings, setSettings] = useLocalSettings();

  return (
    <details>
      <summary>
        <span className="inline-flex flex-wrap center">
          <span className="whitespace-nowrap">
            <label className="pl-2" htmlFor="dchan-input-view-mode">
              Sort by
            </label>
            <select
              id="dchan-input-view-mode"
              onChange={(e) => {
                settings && setSettings({
                  ...settings,
                  content_view: {
                    ...settings.content_view,
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
          </span>
          <span className="whitespace-nowrap">
            <label className="pl-2" htmlFor="dchan-input-view-mode">
              Sort direction
            </label>
            <select
              id="dchan-input-view-mode"
              onChange={(e) => {
                settings && setSettings({
                  ...settings,
                  content_view: {
                    ...settings.content_view,
                    board_sort_direction: e.target.value,
                  },
                });
              }}
              value={settings?.content_view?.board_sort_direction}
            >
              <option value={"asc"}>{"Ascending"}</option>
              <option value={"desc"}>{"Descending"}</option>
            </select>
          </span>
        </span>
      </summary>

      <div className="bg-secondary border border-tertiary-accent border-solid p-2">
        <div>
          <label className="px-2" htmlFor="dchan-input-view-mode">
            Page size
          </label>
          <input
            id="dchan-input-page-size"
            type="number"
            min={1}
            value={settings?.content_view?.page_size}
            onChange={(e) => {
              settings && setSettings({
                ...settings,
                content_view: {
                  ...settings.content_view,
                  page_size: Number(e.target.value),
                },
              });
            }}
          />
        </div>
        <div>
          <label className="px-2" htmlFor="dchan-input-view-mode">
            Default board view mode
          </label>
          <select
            id="dchan-input-view-mode"
            onChange={(e) => {
              settings && setSettings({
                ...settings,
                content_view: {
                  ...settings.content_view,
                  board_default_view_mode: e.target.value,
                },
              });
            }}
            value={settings?.content_view?.board_default_view_mode}
          >
            <option value={"catalog"}>{"Catalog"}</option>
            <option value={"index"}>{"Index"}</option>
          </select>
        </div>
      </div>
    </details>
  );
}
