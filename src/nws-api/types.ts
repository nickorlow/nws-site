export type UptimeRecord = {
    name: string,
    url: string,
    uptimeMonth: number,
    uptimeAllTime: number,
    isUp: boolean,
    undergoingMaintenance: boolean
};

export type UptimeResponse = {
    datacenters: UptimeRecord[],
    services: UptimeRecord[],
    lastUpdated: string
};

export type Blog = {
    id: number,
    title: string,
    author: string,
    content: string,
    imageUrl: string
};

export type Incident = {
    id: number,
    severity: IncidentSeverity,
    title: string,
    description: string
};

enum IncidentSeverity {
  LOW,
  MEDIUM,
  HIGH
};
