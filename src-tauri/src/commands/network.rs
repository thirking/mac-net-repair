use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::io::Write;
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum InterfaceStatus {
    Connected,
    Disconnected,
    Unavailable,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkService {
    pub name: String,
    pub hardware_port: String,
    pub device: String,
    pub enabled: bool,
    pub is_default: bool,
    pub order: i32,
    pub status: InterfaceStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HardwarePort {
    pub name: String,
    pub device: String,
    pub in_use: bool,
}

/// Execute a shell command with administrator privileges using AppleScript
fn run_with_admin_privileges(command: &str) -> Result<String, String> {
    // Create a temporary script file
    let temp_dir = std::env::temp_dir();
    let script_path = temp_dir.join("mac_net_repair_admin.scpt");
    let result_path = temp_dir.join("mac_net_repair_result.txt");
    let error_path = temp_dir.join("mac_net_repair_error.txt");

    // Clean up previous result/error files
    let _ = std::fs::remove_file(&result_path);
    let _ = std::fs::remove_file(&error_path);

    // Prepend cd /tmp to avoid working directory permission issues
    // Escape the command for AppleScript
    let full_command = format!("cd /tmp && {}", command);
    let escaped_command = full_command.replace("\\", "\\\\").replace("\"", "\\\"");

    // Create AppleScript that writes result to a file
    let script_content = format!(
        r#"try
    set result to do shell script "{}" with administrator privileges
    do shell script "echo " & quoted form of result & " > {}"
on error errMsg number errNum
    do shell script "echo " & quoted form of errMsg & " > {}"
    error errMsg number errNum
end try"#,
        escaped_command,
        result_path.to_string_lossy(),
        error_path.to_string_lossy()
    );

    // Write the script to a file
    let mut file = std::fs::File::create(&script_path)
        .map_err(|e| format!("Failed to create script file: {}", e))?;
    file.write_all(script_content.as_bytes())
        .map_err(|e| format!("Failed to write script file: {}", e))?;
    drop(file);

    // Execute the script using osascript with /tmp as working directory
    let output = Command::new("/usr/bin/osascript")
        .arg(&script_path)
        .current_dir("/tmp")
        .output()
        .map_err(|e| format!("Failed to execute osascript: {}", e))?;

    // Clean up script file
    let _ = std::fs::remove_file(&script_path);

    if output.status.success() {
        // Read result from file
        let result = std::fs::read_to_string(&result_path)
            .unwrap_or_default()
            .trim()
            .to_string();
        let _ = std::fs::remove_file(&result_path);
        Ok(result)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        // Check if user cancelled the authorization dialog
        if stderr.contains("User canceled") || stderr.contains("-128") {
            Err("用户取消了授权".to_string())
        } else if let Ok(error_msg) = std::fs::read_to_string(&error_path) {
            let _ = std::fs::remove_file(&error_path);
            Err(format!("命令执行失败: {}", error_msg.trim()))
        } else {
            Err(format!("命令执行失败: {}", stderr))
        }
    }
}

/// Get the status of a network interface using ifconfig
fn get_interface_status(device: &str) -> InterfaceStatus {
    if device.is_empty() {
        return InterfaceStatus::Unavailable;
    }

    let output = Command::new("ifconfig").arg(device).output();

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            if stdout.contains("status: active") {
                InterfaceStatus::Connected
            } else if stdout.contains("status: inactive") {
                InterfaceStatus::Disconnected
            } else if stdout.contains("flags=") {
                // Interface exists but status unknown, check if it has an IP
                if stdout.contains("inet ") && !stdout.contains("inet 127.") {
                    InterfaceStatus::Connected
                } else {
                    InterfaceStatus::Disconnected
                }
            } else {
                InterfaceStatus::Unavailable
            }
        }
        Err(_) => InterfaceStatus::Unavailable,
    }
}

#[tauri::command]
pub fn get_network_services() -> Result<Vec<NetworkService>, String> {
    // Get actual network services from listnetworkserviceorder
    // This returns only configured services, not all hardware ports
    let output = Command::new("networksetup")
        .arg("-listnetworkserviceorder")
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut services = Vec::new();
    let mut current_service: Option<(String, bool)> = None;

    for line in stdout.lines() {
        let line = line.trim();

        // Check for hardware port line first: "(Hardware Port: Wi-Fi, Device: en1)"
        // Must check this before service line since both start with '('
        if line.starts_with("(Hardware Port:") && current_service.is_some() {
            let (service_name, enabled) = current_service.take().unwrap();

            // Parse hardware port and device
            let inner = line
                .trim_start_matches("(Hardware Port:")
                .trim_end_matches(')');
            let parts: Vec<&str> = inner.split(", Device:").collect();

            if parts.len() == 2 {
                let hardware_port = parts[0].trim().to_string();
                let device = parts[1].trim().to_string();
                let status = get_interface_status(&device);

                services.push(NetworkService {
                    name: service_name,
                    hardware_port,
                    device,
                    enabled,
                    is_default: services.is_empty(), // First service is default
                    order: services.len() as i32,
                    status,
                });
            }
        }
        // Check for service line: "(1) Wi-Fi" or "(*) Disabled Service"
        // Format: (number) or (*) followed by service name
        else if line.starts_with('(') && line.contains(')') {
            // Check if disabled (starts with asterisk)
            let is_disabled = line.starts_with("(*)");

            if let Some(name) = line.split(')').nth(1) {
                let name = name.trim().to_string();
                if !name.is_empty() {
                    current_service = Some((name, !is_disabled));
                }
            }
        }
    }

    Ok(services)
}

fn get_service_order_internal() -> Result<Vec<String>, String> {
    let output = Command::new("networksetup")
        .arg("-listnetworkserviceorder")
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut services = Vec::new();

    for line in stdout.lines() {
        // Lines look like: "(1) Wi-Fi"
        if line.starts_with('(') && line.contains(')') {
            if let Some(name) = line.split(')').nth(1) {
                let name = name.trim().to_string();
                if !name.is_empty() && !name.starts_with("Hardware Port") {
                    services.push(name);
                }
            }
        }
    }

    Ok(services)
}

#[tauri::command]
pub fn get_service_order() -> Result<Vec<String>, String> {
    get_service_order_internal()
}

#[tauri::command]
pub fn set_service_order(services: Vec<String>) -> Result<String, String> {
    if services.is_empty() {
        return Err("Service list cannot be empty".to_string());
    }

    // Build the command with properly escaped service names
    let service_args: Vec<String> = services
        .iter()
        .map(|s| format!("\"{}\"", s.replace("\"", "\\\"")))
        .collect();

    let command = format!(
        "networksetup -ordernetworkservices {}",
        service_args.join(" ")
    );

    run_with_admin_privileges(&command)?;

    Ok("Service order updated successfully".to_string())
}

#[tauri::command]
pub fn get_available_hardware_ports() -> Result<Vec<HardwarePort>, String> {
    // Get all hardware ports
    let output = Command::new("networksetup")
        .arg("-listallhardwareports")
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut ports = Vec::new();
    let mut seen_names = HashSet::new();

    let mut current_port = String::new();
    let mut current_device = String::new();

    for line in stdout.lines() {
        if line.starts_with("Hardware Port:") {
            current_port = line.replace("Hardware Port: ", "").trim().to_string();
        } else if line.starts_with("Device:") {
            current_device = line.replace("Device: ", "").trim().to_string();
        } else if line.starts_with("Ethernet Address:") || line.is_empty() {
            if !current_port.is_empty() && !current_device.is_empty() {
                // Skip duplicates by name
                if !seen_names.contains(&current_port) {
                    seen_names.insert(current_port.clone());
                    ports.push(HardwarePort {
                        name: current_port.clone(),
                        device: current_device.clone(),
                        in_use: true, // Will be updated below
                    });
                }
            }
            if line.is_empty() {
                current_port.clear();
                current_device.clear();
            }
        }
    }

    // Get existing services to mark which ports are in use
    if let Ok(services) = get_service_order_internal() {
        for port in &mut ports {
            port.in_use = services.iter().any(|s| s == &port.name);
        }
    }

    Ok(ports)
}

#[tauri::command]
pub fn create_network_service(name: String, hardware_port: String) -> Result<String, String> {
    if name.is_empty() {
        return Err("Service name cannot be empty".to_string());
    }
    if hardware_port.is_empty() {
        return Err("Hardware port cannot be empty".to_string());
    }

    // Check if service name already exists
    if let Ok(existing) = get_service_order_internal() {
        if existing.iter().any(|s| s == &name) {
            return Err("Service name already exists".to_string());
        }
    }

    let command = format!(
        "networksetup -createnetworkservice \"{}\" \"{}\"",
        name.replace("\"", "\\\""),
        hardware_port.replace("\"", "\\\"")
    );

    run_with_admin_privileges(&command)?;

    Ok(format!("Network service '{}' created successfully", name))
}

#[tauri::command]
pub fn remove_network_service(name: String) -> Result<String, String> {
    if name.is_empty() {
        return Err("Service name cannot be empty".to_string());
    }

    // Check if this is the only service
    if let Ok(existing) = get_service_order_internal() {
        if existing.len() <= 1 {
            return Err("Cannot remove the only network service".to_string());
        }
        if !existing.iter().any(|s| s == &name) {
            return Err(format!("Network service '{}' does not exist", name));
        }
    }

    let command = format!(
        "networksetup -removenetworkservice \"{}\"",
        name.replace("\"", "\\\"")
    );

    run_with_admin_privileges(&command)?;

    Ok(format!("Network service '{}' removed successfully", name))
}
