use serde::{Deserialize, Serialize};
use std::process::Command;
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct PingResult {
    pub target: String,
    pub success: bool,
    pub time_ms: Option<f64>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn ping_host(target: String, count: Option<u32>) -> Result<PingResult, String> {
    let count = count.unwrap_or(4);
    let start = Instant::now();

    let output = Command::new("ping")
        .args(["-c", &count.to_string(), &target])
        .output()
        .map_err(|e| format!("Failed to execute ping: {}", e))?;

    let duration = start.elapsed();
    let stdout = String::from_utf8_lossy(&output.stdout);

    if output.status.success() {
        // Parse average time from ping output
        let mut avg_time: Option<f64> = None;
        for line in stdout.lines() {
            if line.contains("avg") || line.contains("平均") {
                // Parse line like: "round-trip min/avg/max/stddev = 1.234/5.678/9.012/3.456 ms"
                if let Some(stats) = line.split('=').nth(1) {
                    let parts: Vec<&str> = stats.trim().split('/').collect();
                    if parts.len() >= 2 {
                        if let Ok(avg) = parts[1].trim().parse::<f64>() {
                            avg_time = Some(avg);
                        }
                    }
                }
            }
        }

        Ok(PingResult {
            target,
            success: true,
            time_ms: avg_time.or(Some(duration.as_secs_f64() * 1000.0)),
            error: None,
        })
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Ok(PingResult {
            target,
            success: false,
            time_ms: None,
            error: Some(if stderr.is_empty() {
                "Ping failed - host unreachable".to_string()
            } else {
                stderr.to_string()
            }),
        })
    }
}

#[tauri::command]
pub fn reset_network() -> Result<String, String> {
    let mut results = Vec::new();

    // 1. Flush DNS cache
    if let Ok(_) = Command::new("dscacheutil")
        .arg("-flushcache")
        .output()
    {
        results.push("DNS cache flushed");
    }

    // 2. Restart mDNSResponder
    if let Ok(_) = Command::new("killall")
        .args(["-HUP", "mDNSResponder"])
        .output()
    {
        results.push("mDNSResponder restarted");
    }

    // 3. Flush ARP cache
    if let Ok(_) = Command::new("arp")
        .arg("-d")
        .arg("-a")
        .output()
    {
        results.push("ARP cache cleared");
    }

    // 4. Release and renew DHCP (for primary interface)
    // Get primary interface first
    if let Ok(output) = Command::new("route")
        .args(["-n", "get", "default"])
        .output()
    {
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            if line.contains("interface:") {
                let interface = line.split(':').nth(1).map(|s| s.trim());
                if let Some(iface) = interface {
                    // Try to get the service name for this interface
                    if let Ok(services_output) = Command::new("networksetup")
                        .arg("-listallhardwareports")
                        .output()
                    {
                        let services_str = String::from_utf8_lossy(&services_output.stdout);
                        let mut current_port = String::new();

                        for svc_line in services_str.lines() {
                            if svc_line.starts_with("Hardware Port:") {
                                current_port = svc_line.replace("Hardware Port: ", "").trim().to_string();
                            } else if svc_line.starts_with("Device:") {
                                let device = svc_line.replace("Device: ", "").trim().to_string();
                                if device == iface && !current_port.is_empty() {
                                    // Renew DHCP for this service
                                    if let Ok(_) = Command::new("ipconfig")
                                        .args(["set", iface, "DHCP"])
                                        .output()
                                    {
                                        results.push("DHCP renewed");
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    if results.is_empty() {
        Ok("Network reset attempted".to_string())
    } else {
        Ok(format!("Network reset completed: {}", results.join(", ")))
    }
}
