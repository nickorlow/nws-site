export type UptimeRecord = {
    name: string,
    url: string,
    uptimeMonth: number,
    uptimeAllTime: number,
    uptimeYtd: number,
    averageResponseTime: number,
    monitorStart: string,
    isUp: boolean,
    undergoingMaintenance: boolean
};

export type UptimeResponse = {
    datacenters: UptimeRecord[],
    services: UptimeRecord[],
    competitors: UptimeRecord[],
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

// Below is primarily for user-facing things

export type Account = {
  id?: string,
  email: string,
  name?: string,
  password?: string,
  status?: string
};

export type Service = {
    serviceId: string,
    serviceName: string,
    namespace: string,
    containerUrl: string,
    ownerId: string
}

export type ApiError = {
    StatusCode: number,
    ErrorMessage: string
};

export type SessionKey = {
    id: string,
    expiry: Date,
    accountId: string,
    ip: string
};

export type Namespace = {
    id: string,
    accountId: string,
    name: string
}
