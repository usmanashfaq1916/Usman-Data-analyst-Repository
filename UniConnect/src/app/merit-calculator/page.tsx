import { MeritForm } from "./MeritForm";

export default async function MeritCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Merit Calculator</h1>
        <p className="mt-1 text-gray-600">
          Calculate your aggregate and see which programs you qualify for.
        </p>
      </div>
      <MeritForm />
    </div>
  );
}
