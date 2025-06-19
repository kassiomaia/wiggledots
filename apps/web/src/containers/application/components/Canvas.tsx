import { useApplicationContext } from "@src/providers/ApplicationProvider";

export function Canvas() {
  const { containerRef } = useApplicationContext();

  return <canvas ref={containerRef} id="game-canvas"></canvas>;
}
