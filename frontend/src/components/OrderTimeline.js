import React from "react";

function OrderTimeline({ steps = [] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-4 w-4 rounded-full ${
                step.completed ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
            {index < steps.length - 1 && <div className="mt-1 h-full w-px bg-slate-200" />}
          </div>
          <div className="pb-4">
            <p className="font-semibold text-slate-900">{step.label}</p>
            {step.details && <p className="text-sm text-slate-500">{step.details}</p>}
            {step.timestamp && (
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {new Date(step.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;
