import {Configuration} from "@src/containers/configuration/Configuration";
import React, {createContext, useContext, useState} from 'react';

const createConfiguration = (key: string, label: string, description: string, defaultValue: boolean) => ({
  label,
  description,
  defaultValue,
  value: false,
});


let defaultConfigurations = {
  ['toggle-squareds']: createConfiguration(
    'toggle-squareds',
    'Toggle Squares',
    'Enable or disable the squared dots feature.',
    true
  ),
};

interface ConfigurationContextType {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly defaultConfigurations: typeof defaultConfigurations;
  readonly changeConfiguration: (key: keyof typeof defaultConfigurations, value: boolean) => void;
  readonly getConfigurationByKey: (key: keyof typeof defaultConfigurations) => typeof defaultConfigurations[keyof typeof defaultConfigurations];
  readonly save: () => void;
  readonly reset: () => void;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const useConfiguration = (): ConfigurationContextType => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
}

export const useDefaultConfigurations = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useDefaultConfigurations must be used within a ConfigurationProvider');
  }
  return context.defaultConfigurations;
}

export const useIsConfigurationOpen = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useIsConfigurationOpen must be used within a ConfigurationProvider');
  }
  return context.isOpen;
}

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [configurationsState, setConfigurationsState] = useState(defaultConfigurations);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  
  return (
    <ConfigurationContext.Provider value={{
      isOpen,
      open,
      close,
      defaultConfigurations,
      save: () => {
        defaultConfigurations = {...configurationsState};
      },
      getConfigurationByKey: (key) => {
        if (!configurationsState[key]) {
          throw new Error(`Configuration with key "${key}" does not exist.`);
        }
        return configurationsState[key];
      },
      reset: () => {
        setConfigurationsState(defaultConfigurations);
      },
      changeConfiguration: (key, value) => {
        if (!configurationsState[key]) {
          throw new Error(`Configuration with key "${key}" does not exist.`);
        }
        
        setConfigurationsState(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            value: value,
          }
        }));
      }
    }}>
      {children}
      {isOpen && <Configuration/>}
    </ConfigurationContext.Provider>
  );
};
