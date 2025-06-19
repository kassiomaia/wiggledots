import { useAudio } from "@src/providers/AudioProvider";
import React, { useCallback } from "react";

export function Button(
  props: React.DetailedHTMLProps<{
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
  }, HTMLButtonElement>,
) {
  const { playSound, isInitialized } = useAudio();

  const handleHover = useCallback(() => {
    if (isInitialized) playSound("hover");
  }, [playSound, isInitialized]);

  return (
    <button onMouseEnter={handleHover} {...props}>
      {props.children}
    </button>
  );
}
