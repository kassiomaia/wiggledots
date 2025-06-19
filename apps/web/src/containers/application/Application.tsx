import {useApplicationStatistics, useApplicationStatus,} from "@src/providers/ApplicationProvider";
import {Canvas} from "./components/Canvas";
import {Congrats} from "./components/Congrats";
import {Controls} from "./components/Controls";
import {Statistics} from "./components/Statistics";
import {Title} from "./components/Title";

export function Application() {
  const {statistics} = useApplicationStatistics();
  const {isWon} = useApplicationStatus();
  return (
    <div id="game-wrapper">
      <Canvas/>
      <Title/>
      
      {!isWon &&
        (
          <div id="hud">
            <Statistics {...statistics} />
            <Controls/>
          </div>
        )}
      
      {isWon && <Congrats/>}
      
      <div className="click-hint">
        Tap to kill all, but be careful they can regenerate!
      </div>
    </div>
  );
}
