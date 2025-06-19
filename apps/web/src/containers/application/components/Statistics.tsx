export function Statistics(props: {
  alive: number;
  dead: number;
}) {
  return (
    <div className="counters">
      <span>
        <i className="icon icon-sum" />
        ️ Awake: <span id="alive-count">{props.alive}</span>
      </span>
      <span>
        <i className="icon icon-moon" />
        Asleep: <span id="dead-count">{props.dead}</span>
      </span>
    </div>
  );
}
