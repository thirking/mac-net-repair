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
