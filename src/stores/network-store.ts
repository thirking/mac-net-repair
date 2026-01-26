import { create } from "zustand";

export type InterfaceStatus = "Connected" | "Disconnected" | "Unavailable";

export interface NetworkService {
  name: string;
  hardwarePort: string;
  device: string;
  enabled: boolean;
  isDefault: boolean;
  order: number;
  status: InterfaceStatus;
}

export interface HardwarePort {
  name: string;
  device: string;
  inUse: boolean;
}

export interface ProxySettings {
  httpProxy: {
    enabled: boolean;
    server: string;
    port: number;
  };
  httpsProxy: {
    enabled: boolean;
    server: string;
    port: number;
  };
  socksProxy: {
    enabled: boolean;
    server: string;
    port: number;
  };
}

export interface DnsSettings {
  servers: string[];
  service: string;
}

export interface PingResult {
  target: string;
  success: boolean;
  time?: number;
  error?: string;
}

interface NetworkState {
  // Network services
  services: NetworkService[];
  isLoadingServices: boolean;
  availableHardwarePorts: HardwarePort[];
  error: string | null;

  // Proxy
  proxySettings: ProxySettings | null;
  isLoadingProxy: boolean;

  // DNS
  dnsSettings: DnsSettings | null;
  isLoadingDns: boolean;

  // Diagnostics
  pingResults: PingResult[];
  isPinging: boolean;

  // Actions
  setServices: (services: NetworkService[]) => void;
  setLoadingServices: (loading: boolean) => void;
  reorderServices: (fromIndex: number, toIndex: number) => void;
  addService: (service: NetworkService) => void;
  removeService: (name: string) => void;
  setAvailableHardwarePorts: (ports: HardwarePort[]) => void;
  setError: (error: string | null) => void;
  setProxySettings: (settings: ProxySettings | null) => void;
  setLoadingProxy: (loading: boolean) => void;
  setDnsSettings: (settings: DnsSettings | null) => void;
  setLoadingDns: (loading: boolean) => void;
  addPingResult: (result: PingResult) => void;
  clearPingResults: () => void;
  setIsPinging: (pinging: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  // Initial state
  services: [],
  isLoadingServices: false,
  availableHardwarePorts: [],
  error: null,
  proxySettings: null,
  isLoadingProxy: false,
  dnsSettings: null,
  isLoadingDns: false,
  pingResults: [],
  isPinging: false,

  // Actions
  setServices: (services) => set({ services }),
  setLoadingServices: (loading) => set({ isLoadingServices: loading }),
  reorderServices: (fromIndex, toIndex) =>
    set((state) => {
      const newServices = [...state.services];
      const [removed] = newServices.splice(fromIndex, 1);
      newServices.splice(toIndex, 0, removed);
      // Update order property
      return {
        services: newServices.map((s, idx) => ({
          ...s,
          order: idx,
          isDefault: idx === 0,
        })),
      };
    }),
  addService: (service) =>
    set((state) => ({
      services: [
        ...state.services,
        { ...service, order: state.services.length },
      ],
    })),
  removeService: (name) =>
    set((state) => ({
      services: state.services
        .filter((s) => s.name !== name)
        .map((s, idx) => ({ ...s, order: idx, isDefault: idx === 0 })),
    })),
  setAvailableHardwarePorts: (ports) => set({ availableHardwarePorts: ports }),
  setError: (error) => set({ error }),
  setProxySettings: (settings) => set({ proxySettings: settings }),
  setLoadingProxy: (loading) => set({ isLoadingProxy: loading }),
  setDnsSettings: (settings) => set({ dnsSettings: settings }),
  setLoadingDns: (loading) => set({ isLoadingDns: loading }),
  addPingResult: (result) =>
    set((state) => ({ pingResults: [...state.pingResults, result] })),
  clearPingResults: () => set({ pingResults: [] }),
  setIsPinging: (pinging) => set({ isPinging: pinging }),
}));
