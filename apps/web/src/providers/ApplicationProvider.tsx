import {useAudio, useBackgroundSong} from "@src/providers/AudioProvider";
import {useConfiguration} from "@src/providers/ConfigurationProvider";
import {createEngine, type Engine} from "@wiggledots/engine";
import React, {ReactNode, Ref, useCallback, useEffect} from "react";

type Status = "running" | "paused" | "stopped" | "won";

interface ApplicationStatus {
  info: {
    title: string;
    headline: string;
  };
  status: Status;
  statistics: {
    alive: number;
    dead: number;
  };
  containerRef: Ref<HTMLCanvasElement>;
  engineRef: Ref<Engine>;
}

interface ApplicationContextValue extends ApplicationStatus {
  // Actions to modify the state
  setStatus: (status: Status) => void;
  // Convenience methods
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const initialState: ApplicationStatus = {
  info: {
    title: "WiggleDots",
    headline: "A Wiggle World of Living Dots!",
  },
  statistics: {
    alive: 0,
    dead: 0,
  },
  status: "paused", // Changed to 'stopped' as initial state
  containerRef: null,
  engineRef: null,
};

// Create context with proper typing
const ApplicationContext = React.createContext<
  ApplicationContextValue | undefined
>(undefined);

export function useApplicationContext() {
  const context = React.useContext(ApplicationContext);
  
  if (context === undefined) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider",
    );
  }
  
  return context;
}

export function ApplicationProvider({children}: { children: ReactNode }) {
  const [state, setState] = React.useState<ApplicationStatus>(initialState);
  const containerRef = React.useRef<HTMLCanvasElement>(null);
  const engineRef = React.useRef<Engine | null>(null);
  const {playSound} = useAudio();
  const song = useBackgroundSong();
  const {getConfigurationByKey} = useConfiguration();
  
  const setStatus = useCallback((status: Status) => {
    setState((prevState) => ({
      ...prevState,
      status,
    }));
  }, []);
  
  const verifyStatistics = useCallback((statistics: { alive: number, dead: number }) => {
    if (statistics.alive === 0) {
      /* Declare the victory */
      setStatus("won");
      playSound("victory");
      
      setState((previous) => {
        return {
          ...previous,
          statistics: statistics,
        };
      });
      
      return;
    }
    setState((previous) => {
      return {
        ...previous,
        statistics: statistics,
      };
    });
  }, [setStatus]);
  
  useEffect(() => {
    if (containerRef.current) {
      engineRef.current = createEngine(containerRef.current, {fps: 120});
      if (!state) return;
      
      return engineRef.current.subscribe((state) => verifyStatistics(state.getStats()));
    }
  }, [engineRef, containerRef, getConfigurationByKey('toggle-squareds')]);
  
  useEffect(() => {
    if (getConfigurationByKey('toggle-squareds').value) {
      engineRef.current!.filter([
        [1, 1],
        [1, 1],
      ]);
    }
    
  }, [getConfigurationByKey]);
  
  
  // Convenience methods for common actions
  const start = useCallback(() => {
    setStatus("running");
    if (engineRef.current) {
      song.play();
      engineRef.current.start();
    }
  }, [setStatus]);
  
  const pause = useCallback(() => {
    setStatus("paused");
    if (engineRef.current) {
      song.pause();
      engineRef.current.pause();
    }
  }, [setStatus]);
  
  const reset = useCallback(() => {
    if (engineRef.current) {
      song.stop();
      engineRef.current.reset();
      start();
    }
  }, []);
  
  // Context value with all state and actions
  const contextValue: ApplicationContextValue = {
    info: state.info,
    status: state.status,
    statistics: state.statistics,
    setStatus,
    
    start,
    pause,
    reset,
    
    containerRef,
    engineRef,
  };
  
  return (
    <ApplicationContext.Provider value={contextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}

// Additional hooks for specific use cases
export function useApplicationStatus() {
  const {status, setStatus, start, pause, reset} = useApplicationContext();
  return {
    status,
    setStatus,
    start,
    pause,
    reset,
    isRunning: status === "running",
    isPaused: status === "paused",
    isStopped: status === "stopped",
    isWon: status === "won",
  };
}

export function useApplicationStatistics() {
  const {statistics} = useApplicationContext();
  return {statistics};
}

export function useApplicationInfo() {
  const {info: {title, headline}} = useApplicationContext();
  return {
    title,
    headline,
  };
}

// Type exports for external use
export type {ApplicationContextValue, ApplicationStatus, Status};
