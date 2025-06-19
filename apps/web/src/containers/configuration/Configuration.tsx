import {useConfiguration} from "@src/providers/ConfigurationProvider";
import {useCallback, useState} from "react";
export function Configuration() {
  const { close, defaultConfigurations, getConfigurationByKey, changeConfiguration, reset, save } = useConfiguration();
  
  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close]);
  
  const handleSave = useCallback(() => {
    save();
    close();
  }, [close]);
  
  return (
    <div className="configuration">
      <h2 className="configuration__title">
        Application Settings
      </h2>
      <p className="configuration-panel__description">
        Configure your application settings here.
      </p>
      <div className="configuration__configurations">
        {Object.entries(defaultConfigurations).map(([key, config]) => (
          <div key={key} className="configuration-item">
            <input
              type="checkbox"
              defaultChecked={config.defaultValue}
              className="configuration-item__checkbox"
              checked={getConfigurationByKey(key as keyof typeof defaultConfigurations).value}
              onChange={(e) => {
                changeConfiguration(key as keyof typeof defaultConfigurations, e.target.checked);
              }}
            />
            <span className="configuration-item__description">
            {config.description}
          </span>
          </div>
        ))}
      </div>
      <div className="configuration__footer">
        <button onClick={handleSave} className="configuration__save-button">
          Save Settings
        </button>
        <button onClick={handleClose} className="configuration__cancel-button">
          Cancel
        </button>
      </div>
    </div>
  )
}
