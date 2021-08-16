import Footer from "components/Footer";
import GenericHeader from "components/header/generic";
import { Link } from "react-router-dom";
import useLocalStorage from "hooks/useLocalStorage";
import Config from "settings/default";
import MaxLengthWatch from "components/form/MaxLengthWatch";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Status from "components/Status";
import useSettings from "hooks/useSettings";

export default function SettingsPage() {
  const [status, setStatus] = useState<string>();
  const [settings, setSettings] = useSettings()
  const { register, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      ...settings
    }
  });

  const resetSettings = () => {
    reset(Config)
    setSettings(Config)
    setStatus("Settings reset");
  }

  const onSubmit = async (data: any) => {
    await setSettings({...settings, ...data})
    setStatus("Settings saved");
  };

  return (
    <div className="bg-primary min-h-100vh">
      <GenericHeader title="Settings"></GenericHeader>

      <div className="center grid">
        <form
          id="dchan-post-form"
          className="grid center bg-primary p-2 pointer-events-auto bg-primary"
          onSubmit={handleSubmit(onSubmit)}
        >
          <table>
            <tbody>
              <tr>
                <td className="px-2 border border-solid border-black bg-highlight font-semibold text-sm">
                  IPFS endpoint
                </td>
                <td>
                  <span className="relative">
                    <input
                      className="px-1 border border-solid border-gray focus:border-indigo-300"
                      type="text"
                      placeholder="https://..."
                      {...register("ipfs.endpoint")}
                      onChange={(e) =>
                        setValue("ipfs.endpoint", e.target.value)
                      }
                      maxLength={70}
                    ></input>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="display flex justify-end">
            <button className="mx-2 px-2 bg-gray-100 border" onClick={resetSettings} type="button">
              Reset
            </button>
            <button className="mx-2 px-2 bg-gray-100 border" type="submit">
              Save
            </button>
          </div>
          <div className="text-right">
            <Status status={status} />
          </div>
        </form>
      </div>

      <Footer></Footer>
    </div>
  );
}
