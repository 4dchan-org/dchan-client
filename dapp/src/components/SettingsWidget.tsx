import useSettings, { Settings } from "hooks/useSettings";
import React, { useCallback } from "react";
import OverlayComponent from "./OverlayComponent";

export default function SettingsWidget({onExit}: {onExit: () => void}) {
  const [settings, setSettings] = useSettings();

  // this might be a bit too autistic
  const changeSetting = useCallback(
    <T extends HTMLElement>(settings: Settings, func: (s: Settings, e: React.ChangeEvent<T>) => void) =>
    (e: React.ChangeEvent<T>) => {
      let updatedSettings = {...settings};
      func(updatedSettings, e);
      setSettings(updatedSettings);
    },
    [setSettings]
  );

  return (settings ? (
    <div className="bg-secondary border-secondary-accent border-2 flex flex-col h-full">
      <div className="mb-2 mt-1 px-3" style={{flex: "0 1 auto"}}>
        <div className="float-left">
          <span className="font-bold">dchan Settings</span>
        </div>
        <div className="float-right">
          <button onClick={onExit}>
            ❌
          </button>
        </div>
      </div>
      <div className="h-full overflow-y-scroll overscroll-contain" style={{flex: "1 1 auto"}}>
        <fieldset className="border border-secondary-accent rounded px-4 pb-2 mx-2">
          <legend className="font-bold">Subgraph Endpoint</legend>
          <div>Change this to query a different subgraph for data.</div>
          <textarea
            className="w-full"
            spellCheck={false}
            onChange={changeSetting(settings, (s, e) => s.subgraph.endpoint = e.target.value)}
            value={settings.subgraph.endpoint}
          />
        </fieldset>
        <fieldset className="border border-secondary-accent rounded px-4 pb-2 mx-2">
          <legend className="font-bold">IPFS Endpoint</legend>
          <div>Change this to upload IPFS images to a different endpoint.</div>
          <textarea
            className="w-full"
            spellCheck={false}
            onChange={changeSetting(settings, (s, e) => s.ipfs.endpoint = e.target.value)}
            value={settings.ipfs.endpoint}
          />
        </fieldset>
        <fieldset className="border border-secondary-accent rounded px-4 pb-2 mx-2">
          <legend className="font-bold">Filter Settings</legend>
          <div className="text-contrast">
            ⚠ By disabling/changing filters, it's possible you may view/download highly disturbing content, or content which may be illegal
            in your jurisdiction.
            <div>Do so at your own risk.</div>
          </div>
          <input
            id="dchan-input-show-below-threshold"
            className="mx-1 text-xs whitespace-nowrap opacity-80 hover:opacity-100"
            type="checkbox"
            checked={settings.content_filter.show_below_threshold}
            onChange={changeSetting(settings, (s, e) => s.content_filter.show_below_threshold = e.target.checked)}
          />
          <label htmlFor="dchan-input-show-below-threshold">
            Show hidden content
          </label>
          <br/>
          <label htmlFor="dchan-input-score-threshold">
            Score hide threshold
          </label>
          <div>
            <input
              id="dchan-input-score-threshold"
              className="mx-1 text-xs whitespace-nowrap opacity-80 hover:opacity-100"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings?.content_filter?.score_threshold}
              onChange={changeSetting(settings, (s, e) => s.content_filter.score_threshold = parseFloat(e.target.value))}
            />
          </div>
          <div className="text-sm">
            {
              {
                "0": "Show everything",
                "0.1": "Hide heavily reported content",
                "0.2": "Hide heavily reported content",
                "0.3": "Hide heavily reported content",
                "0.4": "Hide reported content",
                "0.5": "Hide reported content",
                "0.6": "Hide reported content",
                "0.7": "Hide slighly reported content",
                "0.8": "Hide slighly reported content",
                "0.9": "Hide slighly reported content",
                "1": "Only show content with no reports",
              }[settings?.content_filter?.score_threshold ?? "1"]
            }
          </div>
        </fieldset>
      </div>
    </div>
  ) : (
    null
  ));
}