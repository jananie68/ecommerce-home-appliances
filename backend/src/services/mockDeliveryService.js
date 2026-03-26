const MOCK_CARRIERS = [
  {
    code: "SNR",
    name: "SkyNest Route Co.",
    standardService: "Express Home Delivery",
    bulkyService: "Appliance XL Delivery",
    supportPhone: "+91 1800 120 4401",
    supportEmail: "care@skynest-route.test"
  },
  {
    code: "MTR",
    name: "MetroRail Logistics",
    standardService: "Priority Surface",
    bulkyService: "Heavy Appliance Lane",
    supportPhone: "+91 1800 120 7714",
    supportEmail: "support@metrorail-logistics.test"
  },
  {
    code: "HDF",
    name: "HomeDrop Freight",
    standardService: "Same-Region Parcel",
    bulkyService: "White-Glove Home Delivery",
    supportPhone: "+91 1800 120 9918",
    supportEmail: "hello@homedrop-freight.test"
  }
];

const REGION_STATES = {
  south: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"],
  west: ["Maharashtra", "Goa", "Gujarat", "Rajasthan"],
  north: ["Delhi", "Haryana", "Punjab", "Uttar Pradesh", "Uttarakhand", "Himachal Pradesh", "Jammu and Kashmir"],
  east: ["West Bengal", "Odisha", "Bihar", "Jharkhand", "Assam"],
  central: ["Madhya Pradesh", "Chhattisgarh"]
};

const ORIGIN_HUB = {
  label: "Chennai Mega Hub",
  city: "Chennai",
  state: "Tamil Nadu",
  type: "origin"
};

const REGIONAL_HUBS = {
  south: {
    label: "Bengaluru Linehaul Hub",
    city: "Bengaluru",
    state: "Karnataka",
    type: "regional"
  },
  west: {
    label: "Mumbai Crossdock Hub",
    city: "Mumbai",
    state: "Maharashtra",
    type: "regional"
  },
  north: {
    label: "Delhi Surface Hub",
    city: "New Delhi",
    state: "Delhi",
    type: "regional"
  },
  east: {
    label: "Kolkata East Hub",
    city: "Kolkata",
    state: "West Bengal",
    type: "regional"
  },
  central: {
    label: "Nagpur Central Hub",
    city: "Nagpur",
    state: "Maharashtra",
    type: "regional"
  }
};

const ORDER_STATUS_CONFIG = {
  "pending-payment": {
    label: "Awaiting payment verification",
    note: "Shipment will be booked after payment confirmation.",
    completedSteps: [],
    currentLocationKey: "origin"
  },
  confirmed: {
    label: "Order confirmed",
    note: "Inventory has been reserved and the courier booking is queued.",
    completedSteps: ["confirmed"],
    currentLocationKey: "origin"
  },
  processing: {
    label: "Packed at warehouse",
    note: "The appliance is being packed, inspected, and prepared for dispatch.",
    completedSteps: ["confirmed", "packed"],
    currentLocationKey: "origin"
  },
  "picked-up": {
    label: "Picked up by courier",
    note: "The delivery partner has scanned the shipment and moved it to departure.",
    completedSteps: ["confirmed", "packed", "picked-up"],
    currentLocationKey: "origin"
  },
  shipped: {
    label: "In transit",
    note: "The shipment is moving between hubs on the long-haul route.",
    completedSteps: ["confirmed", "packed", "picked-up", "in-transit"],
    currentLocationKey: "regional"
  },
  "out-for-delivery": {
    label: "Out for delivery",
    note: "The last-mile crew is on the route to the delivery address.",
    completedSteps: ["confirmed", "packed", "picked-up", "in-transit", "destination-hub", "out-for-delivery"],
    currentLocationKey: "destination"
  },
  delivered: {
    label: "Delivered",
    note: "The shipment was delivered successfully.",
    completedSteps: ["confirmed", "packed", "picked-up", "in-transit", "destination-hub", "out-for-delivery", "delivered"],
    currentLocationKey: "customer"
  },
  "delivery-exception": {
    label: "Delivery exception",
    note: "The delivery team needs a fresh slot confirmation before the next attempt.",
    completedSteps: ["confirmed", "packed", "picked-up", "in-transit", "destination-hub"],
    currentLocationKey: "destination",
    specialEventCode: "delivery-exception"
  },
  cancelled: {
    label: "Shipment cancelled",
    note: "The shipment booking has been released and the order is no longer in transit.",
    completedSteps: ["confirmed"],
    currentLocationKey: "origin",
    specialEventCode: "cancelled"
  }
};

const TRACKING_STEPS = [
  {
    code: "confirmed",
    label: "Order confirmed",
    gapHours: 0,
    locationKey: "origin",
    details: ({ provider }) => `Payment received and ${provider.name} booking created.`
  },
  {
    code: "packed",
    label: "Packed at warehouse",
    gapHours: 6,
    locationKey: "origin",
    details: ({ packageSummary }) =>
      packageSummary.installationRequired
        ? "Large-appliance packing, accessory check, and installation note were completed."
        : "QC scan completed and the parcel was sealed for dispatch."
  },
  {
    code: "picked-up",
    label: "Picked up by courier",
    gapHours: 12,
    locationKey: "origin",
    details: ({ provider }) => `${provider.name} scanned the shipment at the origin dock.`
  },
  {
    code: "in-transit",
    label: "In transit",
    gapHours: 18,
    locationKey: "regional",
    details: ({ regionalHub }) => `Line-haul vehicle departed towards ${regionalHub.city}.`
  },
  {
    code: "destination-hub",
    label: "Reached destination hub",
    gapHours: 10,
    locationKey: "destination",
    details: ({ destinationHub }) => `Shipment arrived at ${destinationHub.label} for local sorting.`
  },
  {
    code: "out-for-delivery",
    label: "Out for delivery",
    gapHours: 8,
    locationKey: "destination",
    details: ({ packageSummary }) =>
      packageSummary.installationRequired
        ? "Two-person delivery crew assigned with doorstep handover support."
        : "Last-mile partner is on the route with the shipment."
  },
  {
    code: "delivered",
    label: "Delivered",
    gapHours: 6,
    locationKey: "customer",
    details: ({ packageSummary }) =>
      packageSummary.installationRequired
        ? "Appliance delivered and handover completed at the doorstep."
        : "Package delivered successfully to the shipping address."
  }
];

const SPECIAL_EVENTS = {
  "delivery-exception": {
    label: "Delivery exception",
    locationKey: "destination",
    details: ({ address }) => `Delivery was paused near ${address.city} while the team waits for slot or address confirmation.`
  },
  cancelled: {
    label: "Shipment cancelled",
    locationKey: "origin",
    details: () => "Order cancelled before final delivery dispatch."
  }
};

export const ALLOWED_ORDER_STATUSES = Object.keys(ORDER_STATUS_CONFIG);

export function shipmentNeedsHydration(order) {
  const shipment = order?.shipment;

  return (
    !shipment ||
    !shipment.trackingNumber ||
    !shipment.provider?.name ||
    !Array.isArray(shipment.events) ||
    shipment.events.length === 0 ||
    shipment.orderStatus !== order.status
  );
}

export function synchronizeOrderShipment(order, occurredAt = new Date()) {
  if (!order) {
    return null;
  }

  const createdAt = toDate(order.createdAt) || toDate(occurredAt) || new Date();
  const context = buildShipmentContext(order);
  const existingShipment = toPlainShipment(order.shipment);
  const baseShipment = existingShipment?.trackingNumber
    ? refreshBaseShipment(existingShipment, context, createdAt)
    : createBaseShipment(context, createdAt);

  const shipment = applyStatusToShipment(baseShipment, context, createdAt, toDate(occurredAt) || createdAt);
  order.shipment = shipment;
  return shipment;
}

function createBaseShipment(context, createdAt) {
  const trackingNumber = buildTrackingNumber(context.provider.code, context.orderId);

  return {
    orderStatus: "pending-payment",
    trackingNumber,
    manifestNumber: `MNF-${context.orderId.slice(-6).toUpperCase()}`,
    serviceType: context.provider.serviceType,
    provider: context.provider,
    packageSummary: context.packageSummary,
    route: context.route.map((stop) => ({ ...stop, completed: false })),
    statusCode: "pending-payment",
    statusLabel: ORDER_STATUS_CONFIG["pending-payment"].label,
    statusNote: ORDER_STATUS_CONFIG["pending-payment"].note,
    currentLocation: context.originHub.label,
    estimatedDeliveryStart: context.eta.start,
    estimatedDeliveryEnd: context.eta.end,
    actualDeliveryAt: null,
    lastUpdatedAt: createdAt,
    events: buildEmptyTimeline(context)
  };
}

function refreshBaseShipment(existingShipment, context, createdAt) {
  const estimatedDeliveryWindow = updateDeliveryWindow(existingShipment, context, createdAt, createdAt, existingShipment.orderStatus || "pending-payment");

  return {
    ...existingShipment,
    manifestNumber: existingShipment.manifestNumber || `MNF-${context.orderId.slice(-6).toUpperCase()}`,
    serviceType: context.provider.serviceType,
    provider: {
      ...context.provider,
      ...existingShipment.provider
    },
    packageSummary: {
      ...context.packageSummary,
      ...existingShipment.packageSummary
    },
    route: buildRouteProgress(context.route, existingShipment.orderStatus || "pending-payment"),
    currentLocation: existingShipment.currentLocation || context.originHub.label,
    estimatedDeliveryStart: estimatedDeliveryWindow.start,
    estimatedDeliveryEnd: estimatedDeliveryWindow.end,
    actualDeliveryAt: existingShipment.actualDeliveryAt || null,
    lastUpdatedAt: existingShipment.lastUpdatedAt || createdAt,
    events: Array.isArray(existingShipment.events) && existingShipment.events.length ? existingShipment.events : buildEmptyTimeline(context)
  };
}

function applyStatusToShipment(baseShipment, context, createdAt, occurredAt) {
  const config = ORDER_STATUS_CONFIG[context.status] || ORDER_STATUS_CONFIG["pending-payment"];
  const previousEvents = new Map((baseShipment.events || []).map((event) => [event.code, event]));
  let lastCompletedAt = createdAt;

  const events = TRACKING_STEPS.map((step) => {
    const existingEvent = previousEvents.get(step.code);
    const completed = config.completedSteps.includes(step.code);
    const location = resolveLocation(context, step.locationKey);
    let timestamp = toDate(existingEvent?.timestamp);

    if (completed && !timestamp) {
      timestamp = buildStepTimestamp(lastCompletedAt, occurredAt, step.gapHours);
    }

    if (completed && timestamp) {
      lastCompletedAt = timestamp;
    }

    return {
      code: step.code,
      label: step.label,
      details: step.details(context),
      locationLabel: location.label,
      city: location.city,
      state: location.state,
      completed,
      timestamp,
      isCurrent: false
    };
  });

  if (config.specialEventCode) {
    const existingEvent = previousEvents.get(config.specialEventCode);
    const specialEvent = SPECIAL_EVENTS[config.specialEventCode];
    const location = resolveLocation(context, specialEvent.locationKey);
    const timestamp = toDate(existingEvent?.timestamp) || buildStepTimestamp(lastCompletedAt, occurredAt, 2);

    events.push({
      code: config.specialEventCode,
      label: specialEvent.label,
      details: specialEvent.details(context),
      locationLabel: location.label,
      city: location.city,
      state: location.state,
      completed: true,
      timestamp,
      isCurrent: false
    });
  }

  const currentEventCode = resolveCurrentEventCode(events, config);
  const currentLocation = resolveLocation(
    context,
    config.specialEventCode ? SPECIAL_EVENTS[config.specialEventCode].locationKey : config.currentLocationKey
  );
  const estimatedDeliveryWindow = updateDeliveryWindow(baseShipment, context, createdAt, occurredAt, context.status);

  const syncedEvents = events.map((event) => ({
    ...event,
    isCurrent: event.code === currentEventCode
  }));

  return {
    ...baseShipment,
    orderStatus: context.status,
    statusCode: currentEventCode,
    statusLabel: config.label,
    statusNote: config.note,
    currentLocation: currentLocation.label,
    route: buildRouteProgress(context.route, context.status),
    estimatedDeliveryStart: estimatedDeliveryWindow.start,
    estimatedDeliveryEnd: estimatedDeliveryWindow.end,
    actualDeliveryAt: context.status === "delivered" ? occurredAt : baseShipment.actualDeliveryAt || null,
    lastUpdatedAt: occurredAt,
    events: syncedEvents
  };
}

function buildShipmentContext(order) {
  const status = ORDER_STATUS_CONFIG[order.status] ? order.status : "pending-payment";
  const orderId = String(order._id);
  const address = order.address || {};
  const packageSummary = buildPackageSummary(order.items || []);
  const provider = pickCarrier(orderId, packageSummary);
  const route = buildRoute(address);
  const eta = estimateDeliveryWindow(address, packageSummary, toDate(order.createdAt) || new Date(), status);

  return {
    orderId,
    status,
    address,
    packageSummary,
    provider,
    route,
    originHub: route[0],
    regionalHub: route[1],
    destinationHub: route[2],
    eta
  };
}

function buildPackageSummary(items) {
  const pieces = items.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0);
  const weightKg = items.reduce((sum, item) => sum + estimateItemWeight(item) * normalizeQuantity(item.quantity), 0);
  const installationRequired = items.some((item) => requiresInstallation(item.name));
  const bulky = weightKg >= 30 || installationRequired;

  return {
    pieces,
    weightKg: Number(weightKg.toFixed(1)),
    bulky,
    installationRequired,
    handlingNote: bulky ? "Two-person home delivery with doorstep inspection" : "Standard parcel handling"
  };
}

function buildRoute(address) {
  const region = getRegion(address.state);
  const regionalHub = REGIONAL_HUBS[region] || REGIONAL_HUBS.central;
  const destinationHub = {
    label: `${address.city || "Destination"} Service Center`,
    city: address.city || "Destination",
    state: address.state || "State",
    type: "destination"
  };

  return [ORIGIN_HUB, regionalHub, destinationHub];
}

function buildRouteProgress(route, status) {
  const completionIndexByStatus = {
    "pending-payment": -1,
    confirmed: 0,
    processing: 0,
    "picked-up": 0,
    shipped: 1,
    "out-for-delivery": 2,
    delivered: 2,
    "delivery-exception": 2,
    cancelled: 0
  };

  const completionIndex = completionIndexByStatus[status] ?? -1;

  return route.map((stop, index) => ({
    ...stop,
    completed: index <= completionIndex
  }));
}

function buildEmptyTimeline(context) {
  return TRACKING_STEPS.map((step) => {
    const location = resolveLocation(context, step.locationKey);

    return {
      code: step.code,
      label: step.label,
      details: step.details(context),
      locationLabel: location.label,
      city: location.city,
      state: location.state,
      completed: false,
      timestamp: null,
      isCurrent: false
    };
  });
}

function updateDeliveryWindow(baseShipment, context, createdAt, occurredAt, status) {
  if (status === "delivered") {
    return {
      start: occurredAt,
      end: occurredAt
    };
  }

  if (status === "out-for-delivery") {
    return {
      start: setTime(occurredAt, 10, 0),
      end: setTime(occurredAt, 20, 0)
    };
  }

  if (status === "delivery-exception") {
    return {
      start: addDays(startOfDay(occurredAt), 1),
      end: addDays(startOfDay(occurredAt), 2)
    };
  }

  return {
    start: toDate(baseShipment.estimatedDeliveryStart) || estimateDeliveryWindow(context.address, context.packageSummary, createdAt, status).start,
    end: toDate(baseShipment.estimatedDeliveryEnd) || estimateDeliveryWindow(context.address, context.packageSummary, createdAt, status).end
  };
}

function estimateDeliveryWindow(address, packageSummary, createdAt, status) {
  if (status === "pending-payment") {
    return {
      start: addDays(startOfDay(createdAt), 2),
      end: addDays(startOfDay(createdAt), 4)
    };
  }

  const region = getRegion(address.state);
  const sameState = String(address.state || "").trim().toLowerCase() === "tamil nadu";
  let minDays = 2;
  let maxDays = 3;

  if (sameState) {
    minDays = 1;
    maxDays = 2;
  } else if (region === "south") {
    minDays = 2;
    maxDays = 3;
  } else if (region === "west" || region === "central") {
    minDays = 3;
    maxDays = 4;
  } else if (region === "north" || region === "east") {
    minDays = 4;
    maxDays = 6;
  }

  if (packageSummary.bulky) {
    minDays += 1;
    maxDays += 1;
  }

  return {
    start: addDays(startOfDay(createdAt), minDays),
    end: addDays(startOfDay(createdAt), maxDays)
  };
}

function pickCarrier(orderId, packageSummary) {
  const carrier = MOCK_CARRIERS[hashCode(orderId) % MOCK_CARRIERS.length];

  return {
    code: carrier.code,
    name: carrier.name,
    serviceType: packageSummary.bulky ? carrier.bulkyService : carrier.standardService,
    supportPhone: carrier.supportPhone,
    supportEmail: carrier.supportEmail
  };
}

function buildTrackingNumber(providerCode, orderId) {
  const cleanId = orderId.replace(/[^a-z0-9]/gi, "").toUpperCase();
  const tail = cleanId.slice(-8).padStart(8, "0");
  return `${providerCode}-${tail.slice(0, 4)}-${tail.slice(4)}`;
}

function buildStepTimestamp(previousTimestamp, occurredAt, gapHours) {
  const candidate = addHours(previousTimestamp, gapHours);
  return candidate > occurredAt ? occurredAt : candidate;
}

function resolveCurrentEventCode(events, config) {
  if (config.specialEventCode) {
    return config.specialEventCode;
  }

  const completedEvents = events.filter((event) => event.completed);
  if (completedEvents.length) {
    return completedEvents[completedEvents.length - 1].code;
  }

  return events[0]?.code || "pending-payment";
}

function resolveLocation(context, key) {
  if (key === "origin") {
    return context.originHub;
  }

  if (key === "regional") {
    return context.regionalHub;
  }

  if (key === "customer") {
    return {
      label: `${context.address.city || "Destination"}, ${context.address.state || "State"}`,
      city: context.address.city || "Destination",
      state: context.address.state || "State"
    };
  }

  return context.destinationHub;
}

function getRegion(state = "") {
  const normalizedState = String(state).trim().toLowerCase();

  for (const [region, states] of Object.entries(REGION_STATES)) {
    if (states.some((regionState) => regionState.toLowerCase() === normalizedState)) {
      return region;
    }
  }

  return "central";
}

function requiresInstallation(name = "") {
  return /(refrigerator|fridge|washing machine|air conditioner|ac|dishwasher|television|smart tv|tv)/i.test(name);
}

function estimateItemWeight(item) {
  const name = String(item.name || "").toLowerCase();

  if (/refrigerator|fridge/.test(name)) {
    return 52;
  }

  if (/washing machine/.test(name)) {
    return 34;
  }

  if (/air conditioner| split ac| window ac| ac /.test(` ${name} `)) {
    return 31;
  }

  if (/dishwasher/.test(name)) {
    return 38;
  }

  if (/television|smart tv| led tv| oled/.test(name)) {
    return 16;
  }

  if (/microwave|oven/.test(name)) {
    return 13;
  }

  if (/mixer|kettle|toaster|iron/.test(name)) {
    return 4;
  }

  const value = Number(item.discountedPrice || item.unitPrice || 0);
  if (value >= 50000) {
    return 24;
  }

  if (value >= 20000) {
    return 12;
  }

  return 6;
}

function normalizeQuantity(quantity) {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function hashCode(value = "") {
  let hash = 0;

  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function addHours(date, hours) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function setTime(date, hours, minutes) {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

function toDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toPlainShipment(shipment) {
  if (!shipment) {
    return null;
  }

  if (typeof shipment.toObject === "function") {
    return shipment.toObject();
  }

  return shipment;
}
