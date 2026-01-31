export interface DnsSettings {
  servers: string[];
  service_name: string;
}

export interface DnsServer {
  address: string;
  label?: string;
}
