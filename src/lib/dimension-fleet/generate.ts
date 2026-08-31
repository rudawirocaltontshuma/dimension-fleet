import { CITIES, CUSTOMERS, DEPOTS, FIRST_NAMES, LAST_NAMES, TODAY_ISO, VEHICLE_MAKES_MODELS } from "./constants";
import { Rng } from "./random";
import type {
  Delivery,
  DeliveryStatus,
  DocumentRecord,
  DocumentStatus,
  Driver,
  FuelRecord,
  Incident,
  IncidentSeverity,
  Inspection,
  InspectionResult,
  Location,
  MaintenanceRecord,
  MaintenanceStatus,
  RouteRecord,
  Trip,
  TripStatus,
  Vehicle,
} from "./types";

const rng = new Rng(20260831);

function pad(n: number, len: number) {
  return n.toString().padStart(len, "0");
}

function vin(r: Rng): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 17; i++) out += chars[r.int(0, chars.length - 1)];
  return out;
}

function plate(r: Rng): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 3; i++) s += letters[r.int(0, letters.length - 1)];
  return `${s}-${pad(r.int(0, 9999), 4)}`;
}

function isoDaysAgo(days: number, r: Rng) {
  return r.dateWithinDays(days, TODAY_ISO).toISOString();
}

// ---------- Vehicles ----------
export const VEHICLES: Vehicle[] = Array.from({ length: 112 }, (_, i) => {
  const idx = i + 1;
  const mm = rng.pick(VEHICLE_MAKES_MODELS);
  const status = rng.weighted<Vehicle["status"]>([
    ["Available", 40],
    ["On Trip", 32],
    ["Maintenance", 15],
    ["Inactive", 13],
  ]);
  const purchaseDate = isoDaysAgo(rng.int(200, 2400), rng);
  const mileage = rng.int(8000, 320000);
  return {
    id: `veh-${pad(idx, 4)}`,
    fleetNumber: `FL-${pad(idx, 4)}`,
    make: mm.make,
    model: rng.pick(mm.models),
    type: mm.type,
    year: rng.int(2016, 2025),
    vin: vin(rng),
    plate: plate(rng),
    status,
    driverId: null,
    locationId: rng.pick(DEPOTS).id,
    mileage,
    fuelLevel: rng.int(8, 100),
    lastServiceDate: isoDaysAgo(rng.int(3, 220), rng),
    nextServiceDueMileage: mileage + rng.int(1500, 9000),
    purchaseDate,
    capacityTons: [1.5, 3, 5, 10, 20][rng.int(0, 4)],
  };
});

// ---------- Drivers ----------
export const DRIVERS: Driver[] = Array.from({ length: 88 }, (_, i) => {
  const idx = i + 1;
  const first = rng.pick(FIRST_NAMES);
  const last = rng.pick(LAST_NAMES);
  const status = rng.weighted<Driver["status"]>([
    ["Active", 45],
    ["On Trip", 30],
    ["Off Duty", 18],
    ["Suspended", 7],
  ]);
  return {
    id: `drv-${pad(idx, 4)}`,
    driverCode: `DR-${pad(idx, 4)}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@dimensionfleet.com`,
    phone: `(${rng.int(200, 989)}) ${rng.int(200, 989)}-${pad(rng.int(0, 9999), 4)}`,
    licenseNumber: `${rng.pick(["TX", "CA", "IL", "GA", "CO", "AZ", "WA"])}${rng.int(1000000, 9999999)}`,
    licenseClass: rng.pick(["Class A CDL", "Class B CDL", "Class C"]),
    licenseExpiry: new Date(new Date(TODAY_ISO).getTime() + rng.int(-60, 730) * 86400000).toISOString(),
    status,
    vehicleId: null,
    homeDepotId: rng.pick(DEPOTS).id,
    hireDate: isoDaysAgo(rng.int(60, 3200), rng),
    performanceScore: rng.int(62, 99),
    safetyScore: rng.int(58, 100),
    tripsCompleted: rng.int(5, 420),
    deliveriesCompleted: rng.int(5, 900),
    avatarSeed: `${first}${last}${idx}`,
  };
});

// Assign vehicles <-> drivers for those on trip / active
{
  const availableDrivers = DRIVERS.filter((d) => d.status === "On Trip" || d.status === "Active");
  const onTripVehicles = VEHICLES.filter((v) => v.status === "On Trip" || v.status === "Available");
  let di = 0;
  for (const v of onTripVehicles) {
    if (di >= availableDrivers.length) break;
    const drv = availableDrivers[di++];
    v.driverId = drv.id;
    drv.vehicleId = v.id;
  }
}

// ---------- Locations ----------
export const LOCATIONS: Location[] = DEPOTS.map((d) => ({
  id: d.id,
  name: d.name,
  city: d.city,
  state: d.state,
  type: d.type,
  capacity: rng.int(60, 220),
  vehicleIds: VEHICLES.filter((v) => v.locationId === d.id).map((v) => v.id),
}));

// ---------- Trips ----------
export const TRIPS: Trip[] = Array.from({ length: 236 }, (_, i) => {
  const idx = i + 1;
  const vehicle = rng.pick(VEHICLES);
  const driver = vehicle.driverId ? DRIVERS.find((d) => d.id === vehicle.driverId)! : rng.pick(DRIVERS);
  const originCity = rng.pick(CITIES);
  let destCity = rng.pick(CITIES);
  while (destCity.city === originCity.city) destCity = rng.pick(CITIES);
  const status = rng.weighted<TripStatus>([
    ["Scheduled", 15],
    ["Dispatched", 12],
    ["In Transit", 18],
    ["Completed", 48],
    ["Cancelled", 7],
  ]);
  const departure =
    status === "Scheduled" || status === "Dispatched"
      ? rng.futureDateWithinDays(14, TODAY_ISO)
      : new Date(isoDaysAgo(150, rng));
  const distance = rng.int(80, 1900);
  const hours = distance / rng.int(38, 55);
  const arrival = new Date(departure.getTime() + hours * 3600000);
  return {
    id: `trip-${pad(idx, 5)}`,
    tripNumber: `TRP-${pad(idx, 5)}`,
    vehicleId: vehicle.id,
    driverId: driver.id,
    origin: `${originCity.city}, ${originCity.state}`,
    destination: `${destCity.city}, ${destCity.state}`,
    distanceMiles: distance,
    departure: departure.toISOString(),
    arrival: arrival.toISOString(),
    status,
  };
});

// ---------- Routes ----------
export const ROUTES: RouteRecord[] = Array.from({ length: 46 }, (_, i) => {
  const idx = i + 1;
  const originCity = rng.pick(CITIES);
  let destCity = rng.pick(CITIES);
  while (destCity.city === originCity.city) destCity = rng.pick(CITIES);
  const stopCount = rng.int(0, 3);
  const stops = Array.from({ length: stopCount }, () => {
    const c = rng.pick(CITIES);
    return { name: `${c.city} Stop`, city: `${c.city}, ${c.state}` };
  });
  const vehicle = rng.pick(VEHICLES);
  const driver = vehicle.driverId ? DRIVERS.find((d) => d.id === vehicle.driverId)! : rng.pick(DRIVERS);
  const distance = rng.int(120, 2100);
  return {
    id: `route-${pad(idx, 4)}`,
    routeCode: `RT-${pad(idx, 4)}`,
    origin: `${originCity.city}, ${originCity.state}`,
    destination: `${destCity.city}, ${destCity.state}`,
    stops,
    distanceMiles: distance,
    durationHours: Math.round((distance / 48) * 10) / 10,
    driverId: driver.id,
    vehicleId: vehicle.id,
    status: rng.weighted([
      ["Planned", 30],
      ["Active", 35],
      ["Completed", 35],
    ]),
  };
});

// ---------- Deliveries ----------
export const DELIVERIES: Delivery[] = Array.from({ length: 318 }, (_, i) => {
  const idx = i + 1;
  const route = rng.pick(ROUTES);
  const vehicle = VEHICLES.find((v) => v.id === route.vehicleId)!;
  const driver = DRIVERS.find((d) => d.id === route.driverId)!;
  const status = rng.weighted<DeliveryStatus>([
    ["Scheduled", 14],
    ["Dispatched", 10],
    ["In Transit", 16],
    ["Delivered", 50],
    ["Delayed", 6],
    ["Failed", 4],
  ]);
  const scheduled =
    status === "Scheduled" || status === "Dispatched"
      ? rng.futureDateWithinDays(10, TODAY_ISO)
      : new Date(isoDaysAgo(140, rng));
  return {
    id: `dlv-${pad(idx, 5)}`,
    deliveryNumber: `DEL-${pad(idx, 5)}`,
    customer: rng.pick(CUSTOMERS),
    routeId: route.id,
    driverId: driver.id,
    vehicleId: vehicle.id,
    scheduled: scheduled.toISOString(),
    destination: route.destination,
    status,
    weightLbs: rng.int(200, 42000),
  };
});

// ---------- Maintenance ----------
const MAINTENANCE_TYPES = [
  "Oil Change",
  "Brake Inspection",
  "Tire Rotation",
  "Transmission Service",
  "Engine Diagnostics",
  "Battery Replacement",
  "Coolant Flush",
  "Suspension Repair",
  "Annual DOT Inspection",
  "Air Filter Replacement",
];
export const MAINTENANCE_RECORDS: MaintenanceRecord[] = Array.from({ length: 168 }, (_, i) => {
  const idx = i + 1;
  const vehicle = rng.pick(VEHICLES);
  const status = rng.weighted<MaintenanceStatus>([
    ["Upcoming", 22],
    ["In Progress", 10],
    ["Completed", 58],
    ["Overdue", 10],
  ]);
  const date =
    status === "Upcoming"
      ? rng.futureDateWithinDays(45, TODAY_ISO)
      : status === "Overdue"
        ? new Date(isoDaysAgo(30, rng))
        : new Date(isoDaysAgo(180, rng));
  return {
    id: `mnt-${pad(idx, 5)}`,
    vehicleId: vehicle.id,
    maintenanceType: rng.pick(MAINTENANCE_TYPES),
    date: date.toISOString(),
    mileage: vehicle.mileage - rng.int(0, 15000),
    cost: rng.int(80, 4200),
    status,
    notes: "Scheduled per fleet maintenance policy.",
  };
});

// ---------- Fuel ----------
export const FUEL_RECORDS: FuelRecord[] = Array.from({ length: 312 }, (_, i) => {
  const idx = i + 1;
  const vehicle = rng.pick(VEHICLES);
  const volume = rng.float(20, 180);
  const mpg = rng.float(4.5, 12.5);
  return {
    id: `fuel-${pad(idx, 5)}`,
    vehicleId: vehicle.id,
    date: isoDaysAgo(180, rng),
    volumeGallons: Math.round(volume * 10) / 10,
    cost: Math.round(volume * rng.float(3.4, 4.7) * 100) / 100,
    mileage: vehicle.mileage - rng.int(0, 20000),
    efficiencyMpg: Math.round(mpg * 10) / 10,
  };
});

// ---------- Incidents ----------
const INCIDENT_DESCRIPTIONS = [
  "Minor rear-end collision at loading dock.",
  "Tire blowout on highway shoulder.",
  "Cargo shift during transit.",
  "Fender bender in parking lot.",
  "Mechanical breakdown - engine overheating.",
  "Near-miss reported at intersection.",
  "Weather-related delay and minor skid.",
  "Improper loading caused shift damage.",
];
export const INCIDENTS: Incident[] = Array.from({ length: 84 }, (_, i) => {
  const idx = i + 1;
  const vehicle = rng.pick(VEHICLES);
  const driver = vehicle.driverId ? DRIVERS.find((d) => d.id === vehicle.driverId)! : rng.pick(DRIVERS);
  const severity = rng.weighted<IncidentSeverity>([
    ["Low", 40],
    ["Medium", 32],
    ["High", 20],
    ["Critical", 8],
  ]);
  const city = rng.pick(CITIES);
  return {
    id: `inc-${pad(idx, 4)}`,
    incidentNumber: `INC-${pad(idx, 4)}`,
    vehicleId: vehicle.id,
    driverId: driver.id,
    date: isoDaysAgo(160, rng),
    location: `${city.city}, ${city.state}`,
    severity,
    status: rng.weighted([
      ["Open", 15],
      ["Investigating", 20],
      ["Resolved", 40],
      ["Closed", 25],
    ]),
    description: rng.pick(INCIDENT_DESCRIPTIONS),
  };
});

// ---------- Inspections ----------
const INSPECTION_TYPES = [
  "Pre-Trip Inspection",
  "Annual DOT Inspection",
  "Brake System Check",
  "Emissions Test",
  "Safety Compliance Audit",
];
export const INSPECTIONS: Inspection[] = Array.from({ length: 214 }, (_, i) => {
  const idx = i + 1;
  const vehicle = rng.pick(VEHICLES);
  const result = rng.weighted<InspectionResult>([
    ["Pass", 68],
    ["Pass with Notes", 22],
    ["Fail", 10],
  ]);
  const status = rng.weighted<Inspection["status"]>([
    ["Completed", 70],
    ["Scheduled", 20],
    ["Overdue", 10],
  ]);
  return {
    id: `insp-${pad(idx, 5)}`,
    vehicleId: vehicle.id,
    inspectionType: rng.pick(INSPECTION_TYPES),
    date: status === "Scheduled" ? rng.futureDateWithinDays(30, TODAY_ISO).toISOString() : isoDaysAgo(170, rng),
    inspector: `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`,
    result,
    status,
  };
});

// ---------- Documents ----------
function docStatus(expiry: Date): DocumentStatus {
  const now = new Date(TODAY_ISO).getTime();
  const days = (expiry.getTime() - now) / 86400000;
  if (days < 0) return "Expired";
  if (days < 45) return "Expiring Soon";
  return "Valid";
}

export const DOCUMENTS: DocumentRecord[] = [
  ...VEHICLES.slice(0, 60).flatMap((v, i) => {
    const issue = new Date(v.purchaseDate);
    const regExpiry = new Date(new Date(TODAY_ISO).getTime() + rng.int(-30, 400) * 86400000);
    const insExpiry = new Date(new Date(TODAY_ISO).getTime() + rng.int(-20, 300) * 86400000);
    return [
      {
        id: `doc-reg-${pad(i + 1, 4)}`,
        name: `Vehicle Registration - ${v.fleetNumber}`,
        category: "Registration" as const,
        relatedId: v.id,
        relatedLabel: v.fleetNumber,
        issueDate: issue.toISOString(),
        expiryDate: regExpiry.toISOString(),
        status: docStatus(regExpiry),
      },
      {
        id: `doc-ins-${pad(i + 1, 4)}`,
        name: `Insurance Policy - ${v.fleetNumber}`,
        category: "Insurance" as const,
        relatedId: v.id,
        relatedLabel: v.fleetNumber,
        issueDate: issue.toISOString(),
        expiryDate: insExpiry.toISOString(),
        status: docStatus(insExpiry),
      },
    ];
  }),
  ...INSPECTIONS.slice(0, 50).map((insp, i) => {
    const expiry = new Date(new Date(insp.date).getTime() + 365 * 86400000);
    const v = VEHICLES.find((x) => x.id === insp.vehicleId)!;
    return {
      id: `doc-insp-${pad(i + 1, 4)}`,
      name: `${insp.inspectionType} Certificate - ${v.fleetNumber}`,
      category: "Inspection" as const,
      relatedId: insp.id,
      relatedLabel: v.fleetNumber,
      issueDate: insp.date,
      expiryDate: expiry.toISOString(),
      status: docStatus(expiry),
    };
  }),
  ...MAINTENANCE_RECORDS.slice(0, 40).map((m, i) => {
    const v = VEHICLES.find((x) => x.id === m.vehicleId)!;
    const expiry = new Date(new Date(m.date).getTime() + 400 * 86400000);
    return {
      id: `doc-mnt-${pad(i + 1, 4)}`,
      name: `Service Record - ${m.maintenanceType} (${v.fleetNumber})`,
      category: "Maintenance" as const,
      relatedId: m.id,
      relatedLabel: v.fleetNumber,
      issueDate: m.date,
      expiryDate: expiry.toISOString(),
      status: docStatus(expiry),
    };
  }),
  ...DRIVERS.slice(0, 60).map((d, i) => ({
    id: `doc-drv-${pad(i + 1, 4)}`,
    name: `Driver License - ${d.name}`,
    category: "Driver Documents" as const,
    relatedId: d.id,
    relatedLabel: d.name,
    issueDate: d.hireDate,
    expiryDate: d.licenseExpiry,
    status: docStatus(new Date(d.licenseExpiry)),
  })),
  ...DELIVERIES.slice(0, 50).map((del, i) => {
    const expiry = new Date(new Date(del.scheduled).getTime() + 60 * 86400000);
    return {
      id: `doc-del-${pad(i + 1, 4)}`,
      name: `Proof of Delivery - ${del.deliveryNumber}`,
      category: "Delivery Documents" as const,
      relatedId: del.id,
      relatedLabel: del.deliveryNumber,
      issueDate: del.scheduled,
      expiryDate: expiry.toISOString(),
      status: docStatus(expiry),
    };
  }),
];

// ---------- Lookup helpers ----------
export const vehicleById = new Map(VEHICLES.map((v) => [v.id, v]));
export const driverById = new Map(DRIVERS.map((d) => [d.id, d]));
export const locationById = new Map(LOCATIONS.map((l) => [l.id, l]));
export const routeById = new Map(ROUTES.map((r) => [r.id, r]));

export function vehicleLabel(id: string | null | undefined) {
  if (!id) return "Unassigned";
  const v = vehicleById.get(id);
  return v ? `${v.fleetNumber} - ${v.make} ${v.model}` : "Unknown";
}
export function driverName(id: string | null | undefined) {
  if (!id) return "Unassigned";
  return driverById.get(id)?.name ?? "Unknown";
}
export function locationName(id: string) {
  return locationById.get(id)?.name ?? "Unknown";
}
