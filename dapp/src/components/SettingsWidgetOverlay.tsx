import useSettings from "hooks/useSettings";

export default function SettingsWidgetOverlay({onExit}: {onExit: () => void}) {
  const [settings, setSettings] = useSettings();

  return <div className="flex fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 cursor-default" onClick={onExit}>
    <div className="w-full sm:w-4/6 h-5/6 m-auto bg-secondary border-secondary-accent border-2" onClick={(e) => e.stopPropagation()}>
      {settings ? (
        <div className="flex flex-col h-full">
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
        ""
      )}
    </div>
  </div>;
}

