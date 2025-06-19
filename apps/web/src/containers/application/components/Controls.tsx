import { useApplicationStatus } from "@src/providers/ApplicationProvider";
import {useConfiguration} from "@src/providers/ConfigurationProvider";
import { useCallback } from "react";
import { Button } from "./Button";

export function Controls() {
  const { start, pause, reset, isRunning, isPaused } = useApplicationStatus();
  const { open } = useConfiguration();

  const handleStartClick = useCallback(() => {
    if (!isRunning) {
      start();
    }
  }, [isRunning, start]);

  const handlePauseClick = useCallback(() => {
    if (!isPaused) {
      pause();
    }
  }, [isPaused, pause]);

  const handleStopClick = useCallback(() => {
    reset();
  }, [reset]);
  
  const handleOpenConfiguration = useCallback(() => {
    open();
  }, [open]);

  return (
    <div className="controls">
      <Button disabled={isRunning} onClick={handleStartClick}>
        <i className="icon icon-sum" />
        <span>Play</span>
      </Button>
      <Button disabled={isPaused} onClick={handlePauseClick}>
        <i className="icon icon-moon" />
        <span>Pause</span>
      </Button>
      <Button onClick={handleStopClick}>
        <i className="icon icon-repeat" />
        <span>Again!</span>
      </Button>
      <Button onClick={handleOpenConfiguration}>
        <span>Settings</span>
      </Button>
    </div>
  );
}
