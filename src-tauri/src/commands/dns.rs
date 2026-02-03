use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct DnsSettings {
    pub servers: Vec<String>,
    pub service_name: String,
}

#[tauri::command]
pub fn get_dns_servers(service_name: String) -> Result<DnsSettings, String> {
    let output = Command::new("networksetup")
        .args(["-getdnsservers", &service_name])
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut servers = Vec::new();

    for line in stdout.lines() {
        let line = line.trim();
        // Skip messages like "There aren't any DNS Servers set"
        if !line.is_empty() && !line.contains("aren't any") && !line.contains("There aren't") {
            servers.push(line.to_string());
        }
    }

    Ok(DnsSettings {
        servers,
        service_name,
    })
}

#[tauri::command]
pub fn set_dns_servers(service_name: String, servers: Vec<String>) -> Result<String, String> {
    let mut args = vec!["-setdnsservers".to_string(), service_name.clone()];

    if servers.is_empty() {
        args.push("Empty".to_string());
    } else {
        args.extend(servers.clone());
    }

    let output = Command::new("networksetup")
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if output.status.success() {
        if servers.is_empty() {
            Ok(format!("DNS servers cleared for {}", service_name))
        } else {
            Ok(format!(
                "DNS servers set to {:?} for {}",
                servers, service_name
            ))
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to set DNS servers: {}", stderr))
    }
}

#[tauri::command]
pub fn flush_dns_cache() -> Result<String, String> {
    // Flush DNS cache using dscacheutil
    Command::new("dscacheutil")
        .arg("-flushcache")
        .output()
        .map_err(|e| format!("Failed to flush DNS cache: {}", e))?;

    // Also restart mDNSResponder (requires sudo, may fail without admin rights)
    let _ = Command::new("killall")
        .args(["-HUP", "mDNSResponder"])
        .output();

    Ok("DNS cache flushed successfully".to_string())
}
