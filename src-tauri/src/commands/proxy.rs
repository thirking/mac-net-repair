use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ProxyConfig {
    pub enabled: bool,
    pub server: String,
    pub port: u16,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ProxySettings {
    pub http_proxy: ProxyConfig,
    pub https_proxy: ProxyConfig,
    pub socks_proxy: ProxyConfig,
    pub service_name: String,
}

fn parse_proxy_output(output: &str) -> ProxyConfig {
    let mut config = ProxyConfig::default();

    for line in output.lines() {
        let line = line.trim();
        if line.starts_with("Enabled:") {
            config.enabled = line.contains("Yes");
        } else if line.starts_with("Server:") {
            config.server = line.replace("Server:", "").trim().to_string();
        } else if line.starts_with("Port:") {
            if let Ok(port) = line.replace("Port:", "").trim().parse() {
                config.port = port;
            }
        }
    }

    config
}

#[tauri::command]
pub fn get_proxy_settings(service_name: String) -> Result<ProxySettings, String> {
    let mut settings = ProxySettings {
        service_name: service_name.clone(),
        ..Default::default()
    };

    // Get HTTP proxy
    if let Ok(output) = Command::new("networksetup")
        .args(["-getwebproxy", &service_name])
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        settings.http_proxy = parse_proxy_output(&stdout);
    }

    // Get HTTPS proxy
    if let Ok(output) = Command::new("networksetup")
        .args(["-getsecurewebproxy", &service_name])
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        settings.https_proxy = parse_proxy_output(&stdout);
    }

    // Get SOCKS proxy
    if let Ok(output) = Command::new("networksetup")
        .args(["-getsocksfirewallproxy", &service_name])
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        settings.socks_proxy = parse_proxy_output(&stdout);
    }

    Ok(settings)
}

#[tauri::command]
pub fn set_http_proxy(
    service_name: String,
    enabled: bool,
    server: String,
    port: u16,
) -> Result<String, String> {
    if enabled {
        Command::new("networksetup")
            .args(["-setwebproxy", &service_name, &server, &port.to_string()])
            .output()
            .map_err(|e| format!("Failed to set HTTP proxy: {}", e))?;
    } else {
        Command::new("networksetup")
            .args(["-setwebproxystate", &service_name, "off"])
            .output()
            .map_err(|e| format!("Failed to disable HTTP proxy: {}", e))?;
    }

    Ok(format!("HTTP proxy updated for {}", service_name))
}

#[tauri::command]
pub fn set_https_proxy(
    service_name: String,
    enabled: bool,
    server: String,
    port: u16,
) -> Result<String, String> {
    if enabled {
        Command::new("networksetup")
            .args([
                "-setsecurewebproxy",
                &service_name,
                &server,
                &port.to_string(),
            ])
            .output()
            .map_err(|e| format!("Failed to set HTTPS proxy: {}", e))?;
    } else {
        Command::new("networksetup")
            .args(["-setsecurewebproxystate", &service_name, "off"])
            .output()
            .map_err(|e| format!("Failed to disable HTTPS proxy: {}", e))?;
    }

    Ok(format!("HTTPS proxy updated for {}", service_name))
}

#[tauri::command]
pub fn set_socks_proxy(
    service_name: String,
    enabled: bool,
    server: String,
    port: u16,
) -> Result<String, String> {
    if enabled {
        Command::new("networksetup")
            .args([
                "-setsocksfirewallproxy",
                &service_name,
                &server,
                &port.to_string(),
            ])
            .output()
            .map_err(|e| format!("Failed to set SOCKS proxy: {}", e))?;
    } else {
        Command::new("networksetup")
            .args(["-setsocksfirewallproxystate", &service_name, "off"])
            .output()
            .map_err(|e| format!("Failed to disable SOCKS proxy: {}", e))?;
    }

    Ok(format!("SOCKS proxy updated for {}", service_name))
}

#[tauri::command]
pub fn clear_all_proxies(service_name: String) -> Result<String, String> {
    // Disable HTTP proxy
    Command::new("networksetup")
        .args(["-setwebproxystate", &service_name, "off"])
        .output()
        .map_err(|e| format!("Failed to disable HTTP proxy: {}", e))?;

    // Disable HTTPS proxy
    Command::new("networksetup")
        .args(["-setsecurewebproxystate", &service_name, "off"])
        .output()
        .map_err(|e| format!("Failed to disable HTTPS proxy: {}", e))?;

    // Disable SOCKS proxy
    Command::new("networksetup")
        .args(["-setsocksfirewallproxystate", &service_name, "off"])
        .output()
        .map_err(|e| format!("Failed to disable SOCKS proxy: {}", e))?;

    // Disable auto proxy
    Command::new("networksetup")
        .args(["-setautoproxystate", &service_name, "off"])
        .output()
        .map_err(|e| format!("Failed to disable auto proxy: {}", e))?;

    Ok(format!("All proxies cleared for {}", service_name))
}
