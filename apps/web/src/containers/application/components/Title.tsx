import { useApplicationInfo } from "@src/providers/ApplicationProvider";

export function Title() {
  const info = useApplicationInfo();
  return (
    <div className="wiggle-dots">
      <div id="title">{info.title}</div>
      <span>{info.headline}</span>
    </div>
  );
}
