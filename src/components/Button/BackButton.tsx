import { useRouter } from "next/router";
import Button from "./Button";

function BackButton({ route }: { route: string }) {
  const { push } = useRouter();
  return (
    <div className="flex w-full justify-start">
      <div className="w-16">
        <Button onClick={() => push(route)} variants="secondary">
          Back
        </Button>
      </div>
    </div>
  );
}

export default BackButton;
