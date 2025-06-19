import { AudioSystem, SoundName, SoundThemes } from "@wiggledots/audio";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// @ts-ignore
import wiggledotsSongUrl from "../sounds/wiggledots.mp3?url";

function playBackgroundSound(audio: HTMLAudioElement) {
  audio.loop = true;
  audio.volume = 0.1; // Set volume to a reasonable level
  audio.play().catch((error) => {
    console.error("Failed to play audio:", error);
  });
}

function stopBackgroundSound(audio: HTMLAudioElement) {
  audio.pause();
  audio.currentTime = 0; // Reset to the beginning
}

function pauseBackgroundSound(audio: HTMLAudioElement) {
  audio.pause();
}

// Define the context value type
interface AudioContextValue {
  audioSystem: AudioSystem | null;
  isInitialized: boolean;
  currentTheme: keyof typeof SoundThemes;
  playSound: (soundName: SoundName) => void;
  setTheme: (theme: keyof typeof SoundThemes) => void;
  getAvailableSounds: () => string[];
  registerSound: (name: string, options: any) => void; // Using 'any' to avoid importing SoundOptions type
  initializeAudio: () => Promise<void>;
  backgroundSong: HTMLAudioElement | null;
  playBackgroundSong: () => void;
  stopBackgroundSong: () => void;
  pauseBackgroundSong: () => void;
}

// Create the context with default values
const AudioContext = createContext<AudioContextValue | null>(null);

// Props for the AudioProvider component
interface AudioProviderProps {
  children: ReactNode;
  defaultTheme?: keyof typeof SoundThemes;
  autoInitialize?: boolean;
}

// AudioProvider component
export function AudioProvider({
  children,
  defaultTheme = "SOFT",
  autoInitialize = true,
}: AudioProviderProps) {
  const [audioSystem, setAudioSystem] = useState<AudioSystem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof SoundThemes>(
    defaultTheme,
  );

  // Initialize audio system
  const initializeAudio = async (): Promise<void> => {
    try {
      // Some browsers require user interaction before creating AudioContext
      if (!audioSystem) {
        const system = new AudioSystem(currentTheme);
        setAudioSystem(system);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Failed to initialize audio system:", error);
    }
  };

  // Auto-initialize on mount if enabled
  useEffect(() => {
    if (autoInitialize) {
      void initializeAudio();
    }
  }, [autoInitialize]);

  // Handle theme changes
  const handleSetTheme = (theme: keyof typeof SoundThemes) => {
    setCurrentTheme(theme);
    if (audioSystem) {
      audioSystem.setTheme(theme);
    }
  };

  let backgroundSound: any = null;
  // Play sound wrapper
  const playSound = (soundName: SoundName) => {
    if (!backgroundSound) {
      backgroundSound = new Audio("songs/wiggledots.mp3");
      backgroundSound.play();
    }

    if (audioSystem && isInitialized) {
      audioSystem.playSound(soundName);
    } else {
      console.warn(
        "Audio system not initialized. Call initializeAudio() first or enable autoInitialize.",
      );
    }
  };

  // Get available sounds wrapper
  const getAvailableSounds = (): string[] => {
    if (audioSystem) {
      return audioSystem.getAvailableSounds();
    }
    return [];
  };

  // Register custom sound wrapper
  const registerSound = (name: string, options: any) => {
    if (audioSystem) {
      audioSystem.registerSound(name, options);
    } else {
      console.warn("Audio system not initialized. Cannot register sound.");
    }
  };

  const contextValue: AudioContextValue = {
    backgroundSong: new Audio(wiggledotsSongUrl),
    audioSystem,
    isInitialized,
    currentTheme,
    playSound,
    setTheme: handleSetTheme,
    getAvailableSounds,
    registerSound,
    initializeAudio,
    playBackgroundSong: () => {
      if (contextValue.backgroundSong) {
        playBackgroundSound(contextValue.backgroundSong);
      } else {
        console.warn("Background sound not available.");
      }
    },
    stopBackgroundSong: () => {
      if (contextValue.backgroundSong) {
        stopBackgroundSound(contextValue.backgroundSong);
      } else {
        console.warn("Background sound not available.");
      }
    },
    pauseBackgroundSong: () => {
      if (contextValue.backgroundSong) {
        pauseBackgroundSound(contextValue.backgroundSong);
      } else {
        console.warn("Background sound not available.");
      }
    },
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }

  return context;
};

export const useBackgroundSong = () => {
  const { playBackgroundSong, pauseBackgroundSong, stopBackgroundSong } =
    useAudio();

  return {
    play: playBackgroundSong,
    pause: pauseBackgroundSong,
    stop: stopBackgroundSong,
  };
};
