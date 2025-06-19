import { Button } from "./Button";

export function Congrats() {
  return (
    <div className="won-screen">
      <h1>
        <span>Congratulations!</span>
      </h1>
      <p>You have killed all the wiggles!</p>
      <Button onClick={() => window.location.reload()}>
        <i className="icon icon-repeat" />
        <span>Play Again</span>
      </Button>
    </div>
  );
}
