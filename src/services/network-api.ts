import { invoke } from "@tauri-apps/api/core";

export type InterfaceStatus = "Connected" | "Disconnected" | "Unavailable";

export interface NetworkService {
  name: string;
  hardware_port: string;
  device: string;
  enabled: boolean;
  is_default: boolean;
  order: number;
  status: InterfaceStatus;
}

export interface HardwarePort {
  name: string;
  device: string;
  in_use: boolean;
}

export interface ProxyConfig {
  enabled: boolean;
  server: string;
  port: number;
}

export interface ProxySettings {
  http_proxy: ProxyConfig;
  https_proxy: ProxyConfig;
  socks_proxy: ProxyConfig;
  service_name: string;
}

export interface DnsSettings {
  servers: string[];
  service_name: string;
}

export interface PingResult {
  target: string;
  success: boolean;
  time_ms: number | null;
  error: string | null;
}

// Network services
export async function getNetworkServices(): Promise<NetworkService[]> {
  return invoke<NetworkService[]>("get_network_services");
}

export async function getServiceOrder(): Promise<string[]> {
  return invoke<string[]>("get_service_order");
}

export async function setServiceOrder(services: string[]): Promise<string> {
  return invoke<string>("set_service_order", { services });
}

export async function getAvailableHardwarePorts(): Promise<HardwarePort[]> {
  return invoke<HardwarePort[]>("get_available_hardware_ports");
}

export async function createNetworkService(
  name: string,
  hardwarePort: string,
): Promise<string> {
  return invoke<string>("create_network_service", { name, hardwarePort });
}

export async function removeNetworkService(name: string): Promise<string> {
  return invoke<string>("remove_network_service", { name });
}

// Proxy
export async function getProxySettings(
  serviceName: string,
): Promise<ProxySettings> {
  return invoke<ProxySettings>("get_proxy_settings", { serviceName });
}

export async function clearAllProxies(serviceName: string): Promise<string> {
  return invoke<string>("clear_all_proxies", { serviceName });
}

// DNS
export async function getDnsServers(serviceName: string): Promise<DnsSettings> {
  return invoke<DnsSettings>("get_dns_servers", { serviceName });
}

export async function setDnsServers(
  serviceName: string,
  servers: string[],
): Promise<string> {
  return invoke<string>("set_dns_servers", { serviceName, servers });
}

export async function flushDnsCache(): Promise<string> {
  return invoke<string>("flush_dns_cache");
}

// Diagnostics
export async function pingHost(
  target: string,
  count?: number,
): Promise<PingResult> {
  return invoke<PingResult>("ping_host", { target, count });
}

export async function resetNetwork(): Promise<string> {
  return invoke<string>("reset_network");
}
