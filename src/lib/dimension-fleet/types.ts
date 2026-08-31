export type VehicleStatus = "Available" | "On Trip" | "Maintenance" | "Inactive";
export type DriverStatus = "Active" | "On Trip" | "Off Duty" | "Suspended";
export type TripStatus = "Scheduled" | "Dispatched" | "In Transit" | "Completed" | "Cancelled";
export type DeliveryStatus = "Scheduled" | "Dispatched" | "In Transit" | "Delivered" | "Delayed" | "Failed";
export type MaintenanceStatus = "Upcoming" | "In Progress" | "Completed" | "Overdue";
export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
export type IncidentStatus = "Open" | "Investigating" | "Resolved" | "Closed";
export type InspectionResult = "Pass" | "Pass with Notes" | "Fail";
export type InspectionStatus = "Completed" | "Scheduled" | "Overdue";
export type DispatchStage = "Unassigned" | "Assigned" | "Dispatched" | "In Transit" | "Completed";
export type DocumentStatus = "Valid" | "Expiring Soon" | "Expired";

export interface Vehicle {
  id: string;
  fleetNumber: string;
  make: string;
  model: string;
  type: string;
  year: number;
  vin: string;
  plate: string;
  status: VehicleStatus;
  driverId: string | null;
  locationId: string;
  mileage: number;
  fuelLevel: number;
  lastServiceDate: string;
  nextServiceDueMileage: number;
  purchaseDate: string;
  capacityTons: number;
}

export interface Driver {
  id: string;
  driverCode: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: string;
  status: DriverStatus;
  vehicleId: string | null;
  homeDepotId: string;
  hireDate: string;
  performanceScore: number;
  safetyScore: number;
  tripsCompleted: number;
  deliveriesCompleted: number;
  avatarSeed: string;
}

export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  distanceMiles: number;
  departure: string;
  arrival: string;
  status: TripStatus;
}

export interface RouteStop {
  name: string;
  city: string;
}

export interface RouteRecord {
  id: string;
  routeCode: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
  distanceMiles: number;
  durationHours: number;
  driverId: string;
  vehicleId: string;
  status: "Planned" | "Active" | "Completed";
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  customer: string;
  routeId: string;
  driverId: string;
  vehicleId: string;
  scheduled: string;
  destination: string;
  status: DeliveryStatus;
  weightLbs: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  maintenanceType: string;
  date: string;
  mileage: number;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  volumeGallons: number;
  cost: number;
  mileage: number;
  efficiencyMpg: number;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  vehicleId: string;
  driverId: string;
  date: string;
  location: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  inspectionType: string;
  date: string;
  inspector: string;
  result: InspectionResult;
  status: InspectionStatus;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  capacity: number;
  vehicleIds: string[];
}

export interface DocumentRecord {
  id: string;
  name: string;
  category: "Registration" | "Insurance" | "Inspection" | "Maintenance" | "Driver Documents" | "Delivery Documents";
  relatedId: string;
  relatedLabel: string;
  issueDate: string;
  expiryDate: string;
  status: DocumentStatus;
}
