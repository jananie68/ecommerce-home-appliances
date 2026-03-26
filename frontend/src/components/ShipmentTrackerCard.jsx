import {
  AlertTriangle,
  Boxes,
  Clock3,
  Headset,
  MapPin,
  PackageCheck,
  Route,
  Truck
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  formatDeliveryWindow,
  formatStatusLabel
} from "../lib/format";

function ShipmentTrackerCard({ order, showItems = false }) {
  const shipment = order?.shipment;

  if (!shipment) {
    return (
      <div className="rounded-[24px] bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Tracking details will appear once the mock delivery service books this shipment.</p>
      </div>
    );
  }

  const activeEvent = getActiveEvent(shipment.events || []);
  const toneClasses = getStatusTone(order.status);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="space-y-5">
        <div className="rounded-[24px] bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Mock courier</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">{shipment.provider?.name || "Shipment partner assigned"}</h3>
              <p className="mt-2 text-sm text-slate-500">{shipment.provider?.serviceType || shipment.serviceType}</p>
            </div>
            <span className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${toneClasses}`}>
              {shipment.statusLabel || formatStatusLabel(order.status)}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailTile icon={Truck} label="Tracking number" value={shipment.trackingNumber} />
            <DetailTile icon={Boxes} label="Manifest" value={shipment.manifestNumber} />
            <DetailTile icon={Clock3} label="Last updated" value={formatDateTime(shipment.lastUpdatedAt)} />
            <DetailTile
              icon={Headset}
              label="Courier support"
              value={shipment.provider?.supportPhone || shipment.provider?.supportEmail || "Mock support active"}
            />
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600">{shipment.statusNote}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            icon={MapPin}
            label="Current location"
            value={shipment.currentLocation || "Preparing route"}
            caption={activeEvent?.details}
          />
          <MetricCard
            icon={Clock3}
            label={order.status === "delivered" ? "Delivered at" : "Estimated delivery"}
            value={
              order.status === "delivered"
                ? formatDateTime(shipment.actualDeliveryAt || shipment.estimatedDeliveryEnd)
                : formatDeliveryWindow(shipment.estimatedDeliveryStart, shipment.estimatedDeliveryEnd)
            }
            caption={shipment.packageSummary?.handlingNote}
          />
        </div>

        <div className="rounded-[24px] bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-coral">
            <Route size={14} />
            Route map
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(shipment.route || []).map((stop) => (
              <span
                key={`${stop.label}-${stop.city}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  stop.completed ? "bg-ink text-white" : "bg-white text-slate-600"
                }`}
              >
                {stop.label}
              </span>
            ))}
          </div>
        </div>

        {showItems ? (
          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Shipment contents</p>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={`${item.product}-${item.name}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold text-ink">{formatCurrency(item.discountedPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[24px] bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Tracking timeline</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Shipment activity</h3>
          </div>
          {activeEvent ? <p className="text-sm text-slate-500">{activeEvent.label}</p> : null}
        </div>

        <div className="mt-6 space-y-4">
          {(shipment.events || []).map((event, index) => {
            const isWarning = event.code === "delivery-exception" || event.code === "cancelled";
            const markerClasses = isWarning
              ? "border-rose-200 bg-rose-100 text-rose-600"
              : event.completed
                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                : "border-slate-200 bg-white text-slate-400";

            return (
              <div key={event.code} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${markerClasses}`}>
                    {isWarning ? <AlertTriangle size={16} /> : <PackageCheck size={16} />}
                  </div>
                  {index < (shipment.events || []).length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
                </div>
                <div className="pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{event.label}</p>
                    {event.isCurrent ? (
                      <span className="rounded-full bg-coral/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-coral">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.details}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                    <span>{event.locationLabel}</span>
                    <span>{event.timestamp ? formatDateTime(event.timestamp) : "Pending update"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-ink">{value || "Available soon"}</p>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, caption }) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-coral">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value || "Updating"}</p>
      {caption ? <p className="mt-2 text-sm leading-6 text-slate-500">{caption}</p> : null}
    </div>
  );
}

function getActiveEvent(events) {
  for (const event of events) {
    if (event.isCurrent) {
      return event;
    }
  }

  return events.find((event) => event.completed) || null;
}

function getStatusTone(status) {
  if (status === "delivered") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "delivery-exception" || status === "cancelled") {
    return "bg-rose-100 text-rose-700";
  }

  if (status === "out-for-delivery") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-sky-100 text-sky-700";
}

export default ShipmentTrackerCard;
