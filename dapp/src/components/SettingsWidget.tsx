import useSettings from "hooks/useSettings";
import OverlayComponent from "./OverlayComponent";

export default function SettingsWidget({onExit}: {onExit: () => void}) {
  const [settings, setSettings] = useSettings();

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
            onChange={(e) => {
              let updatedSettings = {...settings};
              updatedSettings.subgraph.endpoint = e.target.value;
              setSettings(updatedSettings);
            }}
            value={settings.subgraph.endpoint}
          />
        </fieldset>
        <fieldset className="border border-secondary-accent rounded px-4 pb-2 mx-2">
          <legend className="font-bold">IPFS Endpoint</legend>
          <div>Change this to upload IPFS images to a different endpoint.</div>
          <textarea
            className="w-full"
            spellCheck={false}
            onChange={(e) => {
              let updatedSettings = {...settings};
              updatedSettings.ipfs.endpoint = e.target.value;
              setSettings(updatedSettings);
            }}
            value={settings.ipfs.endpoint}
          />
        </fieldset>
      </div>
    </div>
  ) : (
    null
  ));
}